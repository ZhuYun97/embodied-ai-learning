// scripts/news-merge.mjs
// 把 tmp/news-fetched.json 合并进 docs/news/news-data.json
// 相比旧版 markdown 正则操作,JSON 读写健壮 100 倍

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FETCHED_PATH = path.join(ROOT, 'tmp/news-fetched.json')
const NEWS_DATA_PATH = path.join(ROOT, 'docs/news/news-data.json')
const STATE_PATH = path.join(ROOT, 'docs/news/.bot-state.json')
const ARCHIVE_PATH = path.join(ROOT, 'docs/news/archive-data.json')
const REPORT_PATH = path.join(ROOT, 'tmp/merge-report.json')

const ARCHIVE_THRESHOLD = parseInt(process.env.NEWS_ARCHIVE_THRESHOLD || '80', 10)
const MAX_ADD_PER_RUN = parseInt(process.env.NEWS_MAX_ADD_PER_RUN || '15', 10)

// ===== 读取输入 =====
if (!fs.existsSync(FETCHED_PATH)) {
  console.error(`[news-merge] ❌ ${FETCHED_PATH} 不存在(需先跑 fetch-news.mjs)`)
  process.exit(1)
}

const fetched = JSON.parse(fs.readFileSync(FETCHED_PATH, 'utf-8'))
const fetchedNews = fetched.news || []
console.log(`[news-merge] ▶ 读到 ${fetchedNews.length} 条 fetched`)

// 读取 state(指纹去重)
let state = { last_fetched_at: null, fingerprints: [] }
if (fs.existsSync(STATE_PATH)) {
  state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'))
}
const knownSet = new Set(state.fingerprints)

// 读取现有新闻数据
let newsData = []
if (fs.existsSync(NEWS_DATA_PATH)) {
  newsData = JSON.parse(fs.readFileSync(NEWS_DATA_PATH, 'utf-8'))
}
console.log(`[news-merge] ▶ 现有 ${newsData.length} 条`)

// ===== 兜底去重 =====
const newNews = []
const dupSkipped = []

for (const n of fetchedNews) {
  const fp = (n.fingerprint || '').trim()
  if (!fp) {
    dupSkipped.push({ title: n.title, reason: 'no fingerprint' })
    continue
  }
  if (knownSet.has(fp)) {
    dupSkipped.push({ title: n.title, reason: 'duplicate' })
    continue
  }
  newNews.push(n)
  knownSet.add(fp)
}
console.log(`  · 去重后剩 ${newNews.length} 条,跳过 ${dupSkipped.length} 条`)

// ===== 单次写入上限 =====
let toAdd = newNews
if (toAdd.length > MAX_ADD_PER_RUN) {
  const order = { hot: 0, major: 1, normal: 2 }
  toAdd = [...newNews]
    .sort((a, b) => order[a.importance] - order[b.importance])
    .slice(0, MAX_ADD_PER_RUN)
  console.log(`  · 超过单次上限 ${MAX_ADD_PER_RUN},保留前 ${toAdd.length} 条(hot 优先)`)
}

// ===== 早退:无新闻 =====
if (toAdd.length === 0) {
  console.log(`[news-merge] ✓ 无新事件,跳过写入`)
  state.last_fetched_at = fetched.fetched_at || new Date().toISOString()
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8')
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        added_count: 0,
        skipped_count: dupSkipped.length,
        archived_count: 0,
        fetched_at: state.last_fetched_at,
      },
      null,
      2
    ) + '\n',
    'utf-8'
  )
  process.exit(0)
}

// ===== 转换 fetched 格式为 news-data.json schema =====
// fetched schema: {title, date, fetched_at, category, summary, source_url, source_name, importance, credibility, fingerprint, related_site_page}
// news-data schema: {id, title, date, fetched_at, category:[], summary, sources:[{name,url}], related:[{label,url}], importance, credibility, bot:true}

const converted = toAdd.map(n => ({
  id: n.fingerprint.replace(/\|/g, '-'), // 用 fingerprint 作为 id
  title: n.title,
  date: n.date,
  fetched_at: n.fetched_at || fetched.fetched_at.split('T')[0], // 确保是 YYYY-MM-DD
  importance: n.importance,
  credibility: n.credibility,
  category: Array.isArray(n.category) ? n.category : [n.category].filter(Boolean),
  summary: n.summary,
  sources: [{ name: n.source_name, url: n.source_url }],
  related: n.related_site_page
    ? [{ label: n.related_site_page.split('/').pop(), url: n.related_site_page }]
    : [],
  bot: true, // bot 添加的标记
}))

// ===== 合并并按 fetched_at 降序 + 同日按 importance 排序 =====
const merged = [...newsData, ...converted].sort((a, b) => {
  // 先按 fetched_at 降序
  if (a.fetched_at !== b.fetched_at) {
    return b.fetched_at.localeCompare(a.fetched_at)
  }
  // 同日按 importance(hot → major → normal)
  const order = { hot: 0, major: 1, normal: 2 }
  return order[a.importance] - order[b.importance]
})

// ===== 自动归档(超过阈值时移最老的月份到 archive) =====
let archivedCount = 0
if (merged.length > ARCHIVE_THRESHOLD) {
  // 找最老的月份(从 fetched_at 提取 YYYY-MM)
  const oldestMonth = merged[merged.length - 1].fetched_at.slice(0, 7) // "YYYY-MM"

  // 分离:归档月份 vs 保留
  const toArchive = merged.filter(n => n.fetched_at.startsWith(oldestMonth))
  const toKeep = merged.filter(n => !n.fetched_at.startsWith(oldestMonth))

  if (toArchive.length > 0 && toKeep.length > 0) {
    // 写归档文件(追加模式)
    let archive = []
    if (fs.existsSync(ARCHIVE_PATH)) {
      archive = JSON.parse(fs.readFileSync(ARCHIVE_PATH, 'utf-8'))
    }
    archive = [...archive, ...toArchive]
    fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2) + '\n', 'utf-8')

    archivedCount = toArchive.length
    console.log(`  · 已归档 ${oldestMonth} 月(${archivedCount} 条) → archive-data.json`)

    // 更新 merged 为保留部分
    merged.splice(0, merged.length, ...toKeep)
  }
}

// ===== 写回 news-data.json =====
fs.writeFileSync(NEWS_DATA_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8')

// ===== 更新 state =====
state.last_fetched_at = fetched.fetched_at || new Date().toISOString()
state.fingerprints = [...new Set([...state.fingerprints, ...toAdd.map(n => n.fingerprint)])]
fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8')

// ===== 写 merge report =====
const byImp = { hot: 0, major: 0, normal: 0 }
for (const n of toAdd) byImp[n.importance]++

const report = {
  added_count: toAdd.length,
  skipped_count: dupSkipped.length,
  by_importance: byImp,
  archived_count: archivedCount,
  fetched_at: state.last_fetched_at,
  total_events_after: merged.length,
}
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')

console.log(`[news-merge] ✅ 已写入`)
console.log(`  · 新增:${toAdd.length} 条(🔥${byImp.hot} / ⭐${byImp.major} / 📌${byImp.normal})`)
console.log(`  · 跳过(去重):${dupSkipped.length}`)
if (archivedCount > 0) console.log(`  · 已归档:${archivedCount} 条`)
console.log(`  · 全站新闻总数:${merged.length}`)
