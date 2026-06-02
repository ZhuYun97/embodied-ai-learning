// scripts/news-merge.mjs
// 把 tmp/news-fetched.json 合并进 docs/news/index.md。
// 步骤:
// 1. 读 fetched JSON
// 2. 读现有 .bot-state.json,做指纹去重(LLM 侧已做一遍,这里兜底)
// 3. 读现有 news/index.md,定位每条 fetched 应插入的「## YYYY-MM」段落
// 4. 同月内按 🔥 → ⭐ → 📌 排序插入
// 5. 更新 .bot-state.json(追加新指纹 + last_fetched_at)
// 6. 输出 tmp/merge-report.json 供 GitHub Actions 读取(added_count、提交标题等)
// 7. 自动归档:当 news/index.md 超过 80 个事件时,把最老月份移到 news/archive/YYYY-MM.md
//
// 注意:为简单稳定,不写 markdown AST 解析,而是基于「## YYYY-MM」+「### 🔥/⭐/📌」的
//      固定分隔符做行级编辑。各处都加了 invariant 检查,防止结构破坏。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const FETCHED_PATH = path.join(ROOT, 'tmp/news-fetched.json')
const NEWS_PATH = path.join(ROOT, 'docs/news/index.md')
const STATE_PATH = path.join(ROOT, 'docs/news/.bot-state.json')
const ARCHIVE_DIR = path.join(ROOT, 'docs/news/archive')
const REPORT_PATH = path.join(ROOT, 'tmp/merge-report.json')

const ARCHIVE_THRESHOLD = parseInt(process.env.NEWS_ARCHIVE_THRESHOLD || '80', 10)
const MAX_ADD_PER_RUN = parseInt(process.env.NEWS_MAX_ADD_PER_RUN || '15', 10)

// ===== 读输入 =====
if (!fs.existsSync(FETCHED_PATH)) {
  console.error(`[news-merge] ❌ ${FETCHED_PATH} 不存在(fetch-news.mjs 必须先跑)`)
  process.exit(1)
}
const fetched = JSON.parse(fs.readFileSync(FETCHED_PATH, 'utf-8'))
const fetchedNews = fetched.news || []
console.log(`[news-merge] ▶ 读到 ${fetchedNews.length} 条 fetched`)

let state = { last_fetched_at: null, fingerprints: [] }
if (fs.existsSync(STATE_PATH)) {
  state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'))
}
const knownSet = new Set(state.fingerprints)

let markdown = fs.readFileSync(NEWS_PATH, 'utf-8')

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
  knownSet.add(fp) // 防本批内重复
}
console.log(`  · 去重后剩 ${newNews.length} 条新事件,跳过 ${dupSkipped.length} 条`)

// ===== 单次写入上限 =====
let toAdd = newNews
if (toAdd.length > MAX_ADD_PER_RUN) {
  // 按 importance 排序保留前 N(hot 优先)
  const order = { hot: 0, major: 1, normal: 2 }
  toAdd = [...newNews].sort((a, b) => order[a.importance] - order[b.importance]).slice(0, MAX_ADD_PER_RUN)
  console.log(`  · 超过单次上限 ${MAX_ADD_PER_RUN},保留前 ${toAdd.length} 条(hot 优先)`)
}

// ===== 早退:无新闻 =====
if (toAdd.length === 0) {
  console.log(`[news-merge] ✓ 无新事件,跳过写入`)
  // 仍更新 last_fetched_at(让 state 里保留心跳)
  state.last_fetched_at = fetched.fetched_at || new Date().toISOString()
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8')
  fs.writeFileSync(REPORT_PATH, JSON.stringify({
    added_count: 0,
    skipped_count: dupSkipped.length,
    archived_month: null,
    fetched_at: state.last_fetched_at,
  }, null, 2) + '\n', 'utf-8')
  process.exit(0)
}

// ===== 渲染单条新闻为 markdown(与 news/index.md 格式严格一致)=====
const IMP_ICON = { hot: '🔥', major: '⭐', normal: '📌' }
const CRED_ICON = { verified: '✅', todo: '⚠️' }
function renderItem(n) {
  const imp = IMP_ICON[n.importance] || '📌'
  const cred = CRED_ICON[n.credibility] || '⚠️'
  const cat = `**类别**:#${(n.category || '').replace(/\s+/g, '')}`
  const related = n.related_site_page
    ? `  ·  **相关**:[${n.related_site_page.split('/').pop()}](${n.related_site_page})`
    : ''
  return [
    `### ${imp} ${n.title} ${cred} 🤖`,
    '',
    n.summary,
    '',
    `**来源**:[${n.source_name}](${n.source_url})  ·  ${cat}${related}`,
    '',
    '---',
    '',
  ].join('\n')
}
// 🤖 标识:bot 写入的条目尾巴加机器人 emoji,与人工整理区分

// ===== 按 month_key 分组待插入 =====
function monthKeyOf(date) {
  // YYYY-MM-DD → YYYY-MM;YYYY-MM → 原样
  const m = String(date).match(/^(\d{4})-(\d{2})/)
  return m ? `${m[1]}-${m[2]}` : '未知'
}
const byMonth = new Map()
for (const n of toAdd) {
  const mk = monthKeyOf(n.date)
  if (!byMonth.has(mk)) byMonth.set(mk, [])
  byMonth.get(mk).push(n)
}

// ===== 找到 markdown 里现有的月份分隔位置 =====
// 期望结构:每月以 `## YYYY-MM` 开头,以下一个 `## ` 或 `---\n\n## 条目格式说明` 结尾
const MONTH_HEADER_RE = /^## (\d{4})-(\d{2})(?:\([^)]*\))?\s*$/gm
const headerMatches = []
let mm
const tmpRe = new RegExp(MONTH_HEADER_RE.source, 'gm')
while ((mm = tmpRe.exec(markdown)) !== null) {
  headerMatches.push({ key: `${mm[1]}-${mm[2]}`, index: mm.index, headerLine: mm[0] })
}
console.log(`  · markdown 现有月份分组:${headerMatches.length} 个`)

// 找正文结束位置(开始格式说明的地方)= 第一个 `## 条目格式说明` 或 `## 相关页面`
const FOOTER_RE = /^## (条目格式说明|相关页面)/m
const footerMatch = markdown.match(FOOTER_RE)
if (!footerMatch) {
  console.error(`[news-merge] ❌ markdown 结构异常:找不到「条目格式说明」/「相关页面」分界`)
  process.exit(1)
}
const footerIndex = footerMatch.index

// ===== 逐月份处理插入 =====
// 策略:
// 1. 月份已存在 → 在该月段内,按 🔥→⭐→📌 排序插入(找到第一个低优先级或下个 ## 边界)
// 2. 月份不存在 → 按时间倒序,插到该插入的位置(可能是文件最早段后,或是月份序的某一处)
//
// 为简化,我们把要插入的内容按月份合并成 string,然后按月份序拼回。
// 直接做法:重写整个「正文区域」(从第一个 ## 月份 到 footerIndex)。

// 先把现有内容拆解为:头部(到第一个 ## 月份前)+ 各月份段 + 尾部(footerIndex 之后)
const firstHeaderIdx = headerMatches.length > 0 ? headerMatches[0].index : footerIndex
const head = markdown.slice(0, firstHeaderIdx)
const tail = markdown.slice(footerIndex)

// 解析现有月份段为 { key, content }[]
const existingMonths = []
for (let i = 0; i < headerMatches.length; i++) {
  const start = headerMatches[i].index
  const end = i + 1 < headerMatches.length ? headerMatches[i + 1].index : footerIndex
  existingMonths.push({
    key: headerMatches[i].key,
    headerLine: headerMatches[i].headerLine,
    body: markdown.slice(start + headerMatches[i].headerLine.length, end), // 不含 header 自身
  })
}

// 在每个月段里把待插入条目并入(同月按 🔥→⭐→📌 排序)
const ORDER = { hot: 0, major: 1, normal: 2 }
function rankOf(content) {
  // 给现有条目估算 rank:看 ### 开头第一个图标
  const m = content.match(/^###\s+([🔥⭐📌])/m)
  if (!m) return 99
  return m[1] === '🔥' ? 0 : m[1] === '⭐' ? 1 : 2
}

for (const month of existingMonths) {
  if (!byMonth.has(month.key)) continue
  const newItems = byMonth.get(month.key) // 待插入到该月的
  byMonth.delete(month.key) // 标记已处理

  // 把月段 body 拆成「单条事件」数组(以 `### ` 切,保留 `### ` 前缀)
  // 第一段(在第一个 ### 之前)是「月段引导文本」(罕见,但保留)
  const parts = []
  let cur = month.body
  const itemRe = /(^|\n)(### .+(?:\n(?!### |## )[^\n]*)*)/g
  // 简化:用 split('### ') 然后给每段加回 '### ' 前缀
  const split = month.body.split(/\n(?=### )/)
  const monthIntro = split.shift() || '' // 第一段(无 ### 前缀)
  const items = split // 后续每段都以 `### ...` 开头

  // 组合 = monthIntro + items + newItems(渲染后),整体按 rank 排序
  const allItems = [...items.map((s) => ({ rank: rankOf(s), content: '### ' + s.trimStart().slice(4) /* keep */, isOld: true })),
                    ...newItems.map((n) => ({ rank: ORDER[n.importance], content: renderItem(n), isOld: false }))]
  // 简化:items 字符串以 '### ' 开头,rankOf 已正常
  const reItems = items.map((s) => ({ rank: rankOf(s), content: s.endsWith('\n') ? s : s + '\n' }))
  const newRendered = newItems.map((n) => ({ rank: ORDER[n.importance], content: renderItem(n) }))
  const merged = [...reItems, ...newRendered].sort((a, b) => a.rank - b.rank)

  month.body = monthIntro + (monthIntro && !monthIntro.endsWith('\n\n') ? '\n' : '') + merged.map((m) => m.content).join('')
}

// 剩下的(byMonth 里还有的)= 新月份段,需要按时间倒序插入到 existingMonths 之中
const newMonthSegments = []
for (const [key, items] of byMonth.entries()) {
  const sortedItems = [...items].sort((a, b) => ORDER[a.importance] - ORDER[b.importance])
  newMonthSegments.push({
    key,
    headerLine: `## ${key}\n`,
    body: '\n' + sortedItems.map(renderItem).join(''),
  })
}

// 合并 existing + new,按 key(YYYY-MM)倒序排序
const allMonths = [...existingMonths, ...newMonthSegments].sort((a, b) => {
  if (a.key < b.key) return 1
  if (a.key > b.key) return -1
  return 0
})

// ===== 重组 markdown =====
let newMarkdown = head
for (const m of allMonths) {
  newMarkdown += m.headerLine + m.body
}
newMarkdown += tail

// 在 head 里更新「最后自动更新于」徽章(若已有)
newMarkdown = newMarkdown.replace(
  /(<!--BOT-LAST-FETCH-->[\s\S]*?<!--\/BOT-LAST-FETCH-->)/,
  `<!--BOT-LAST-FETCH-->\n> 🤖 **最后自动更新于** ${(fetched.fetched_at || new Date().toISOString()).replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} · 由 news-bot 维护(本批新增 **${toAdd.length}** 条)\n<!--/BOT-LAST-FETCH-->`,
)

// ===== 自动归档(超过 80 条时把最老月份移到 archive/) =====
let archivedMonth = null
const totalEvents = (newMarkdown.match(/^### [🔥⭐📌]/gm) || []).length
if (totalEvents > ARCHIVE_THRESHOLD && allMonths.length > 1) {
  const oldest = allMonths[allMonths.length - 1] // 最旧的月份(已倒序排序)
  archivedMonth = oldest.key

  // 创建 archive 文件
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true })
  const archivePath = path.join(ARCHIVE_DIR, `${archivedMonth}.md`)
  const archiveContent = [
    '---',
    `title: 具身智能新闻归档 · ${archivedMonth}`,
    `description: 具身智能新闻 ${archivedMonth} 月份归档`,
    'sidebar: false',
    '---',
    '',
    `# 具身智能新闻 · ${archivedMonth} 归档`,
    '',
    `> 这是从 [新闻主页](/news/) 自动归档的 ${archivedMonth} 月内容。回到 [最新](/news/)。`,
    '',
    '---',
    '',
    `${oldest.headerLine}${oldest.body}`,
  ].join('\n')
  fs.writeFileSync(archivePath, archiveContent, 'utf-8')
  console.log(`  · 已归档 ${archivedMonth} → ${archivePath}`)

  // 从主文件里移除该月段
  const idx = allMonths.findIndex((m) => m.key === archivedMonth)
  allMonths.splice(idx, 1)
  // 重新组装 markdown
  newMarkdown = head
  for (const m of allMonths) {
    newMarkdown += m.headerLine + m.body
  }
  newMarkdown += tail
}

// ===== 写回 markdown =====
fs.writeFileSync(NEWS_PATH, newMarkdown, 'utf-8')

// ===== 更新 .bot-state.json =====
state.last_fetched_at = fetched.fetched_at || new Date().toISOString()
state.fingerprints = [...new Set([...state.fingerprints, ...toAdd.map((n) => n.fingerprint)])]
fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8')

// ===== 写 merge report =====
const byImp = { hot: 0, major: 0, normal: 0 }
for (const n of toAdd) byImp[n.importance]++
const report = {
  added_count: toAdd.length,
  skipped_count: dupSkipped.length,
  by_importance: byImp,
  archived_month: archivedMonth,
  fetched_at: state.last_fetched_at,
  total_events_after: totalEvents,
}
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf-8')

console.log(`[news-merge] ✅ 已写入`)
console.log(`  · 新增:${toAdd.length} 条(🔥${byImp.hot} / ⭐${byImp.major} / 📌${byImp.normal})`)
console.log(`  · 跳过(去重/字段不全):${dupSkipped.length}`)
if (archivedMonth) console.log(`  · 已归档月份:${archivedMonth}`)
console.log(`  · 全站新闻总数:${totalEvents}`)
