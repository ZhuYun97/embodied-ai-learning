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
  // 📅 事件时间:显示事件实际发生/发表日期(与 H2 收录日期区分)
  const eventDate = n.date ? `📅 **事件时间**: ${n.date}  \n` : ''
  return [
    `### ${imp} ${n.title} ${cred} 🤖`,
    '',
    n.summary,
    '',
    `**来源**:[${n.source_name}](${n.source_url})  ·  ${cat}${related}  `,
    eventDate, // 📅 行插在来源后、--- 前
    '---',
    '',
  ].join('\n')
}
// 🤖 标识:bot 写入的条目尾巴加机器人 emoji,与人工整理区分

// ===== 按 fetched_at(收录日期)分组待插入(支持日级 + 月级两种粒度)=====
// **语义**:H2 分组按「收录日期」(fetched_at),卡片内 📅 事件时间 显示事件实际日期(date)
// - 完整日期 YYYY-MM-DD → 日级 H2(每天独立块)
// - 仅月份 YYYY-MM → 月级 H2,显示「YYYY-MM(月内事件)」,排在该月所有日级块之后
// - 仅年份 YYYY → 年级 H2,显示「YYYY(年内事件)」,排在该年所有月级块之后
function dateKeyOf(date) {
  const ds = String(date || '').trim()
  // YYYY-MM-DD 完整日期
  let m = ds.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) {
    const key = `${m[1]}-${m[2]}-${m[3]}`
    return { key, level: 'day', sortKey: key, headerLine: `## ${key}\n` }
  }
  // YYYY-MM
  m = ds.match(/^(\d{4})-(\d{2})/)
  if (m) {
    const key = `${m[1]}-${m[2]}`
    // sortKey 用 -00 让月级排在该月日级之后(倒序 02 > 00,即日级靠顶)
    return { key, level: 'month', sortKey: `${key}-00`, headerLine: `## ${key}(月内事件)\n` }
  }
  // YYYY
  m = ds.match(/^(\d{4})/)
  if (m) {
    const key = m[1]
    return { key, level: 'year', sortKey: `${key}-00-00`, headerLine: `## ${key}(年内事件)\n` }
  }
  return { key: '未知', level: 'unknown', sortKey: '0000-00-00', headerLine: `## 未知日期\n` }
}

const byDate = new Map() // key → { meta, items[] }
for (const n of toAdd) {
  // ⚠️ 分组用 fetched_at(收录日期),非 date(事件日期)
  const meta = dateKeyOf(n.fetched_at)
  if (!byDate.has(meta.key)) byDate.set(meta.key, { meta, items: [] })
  byDate.get(meta.key).items.push(n)
}

// ===== 找到 markdown 里现有的日期/月份/年份分隔位置 =====
// 同时匹配:
//   ## YYYY-MM-DD                     (日级)
//   ## YYYY-MM(月内事件)              (月级,带或不带括号说明)
//   ## YYYY-MM(历史里程碑)            (旧版月级带说明也保留)
//   ## YYYY(年内事件)                 (年级)
const HEADER_RE = /^## (\d{4}(?:-\d{2}(?:-\d{2})?)?)(?:\(([^)]*)\))?\s*$/gm
const headerMatches = []
{
  const tmpRe = new RegExp(HEADER_RE.source, 'gm')
  let mm
  while ((mm = tmpRe.exec(markdown)) !== null) {
    const ds = mm[1]
    const meta = dateKeyOf(ds)
    headerMatches.push({ ...meta, index: mm.index, headerLine: mm[0] })
  }
}
console.log(`  · markdown 现有分组:${headerMatches.length} 个(日/月/年级混合)`)

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

// 解析现有分组段为 { key, meta, headerLine, body }[]
const existingSegments = []
for (let i = 0; i < headerMatches.length; i++) {
  const start = headerMatches[i].index
  const end = i + 1 < headerMatches.length ? headerMatches[i + 1].index : footerIndex
  existingSegments.push({
    key: headerMatches[i].key,
    sortKey: headerMatches[i].sortKey,
    headerLine: headerMatches[i].headerLine + '\n',
    body: markdown.slice(start + headerMatches[i].headerLine.length, end), // 不含 header 自身,但含其后的 \n
  })
}

// 在每个段里把待插入条目并入(段内按 🔥→⭐→📌 排序)
const ORDER = { hot: 0, major: 1, normal: 2 }
function rankOf(content) {
  // 给现有条目估算 rank:看 ### 开头第一个图标
  const m = content.match(/^###\s+([🔥⭐📌])/m)
  if (!m) return 99
  return m[1] === '🔥' ? 0 : m[1] === '⭐' ? 1 : 2
}

for (const seg of existingSegments) {
  if (!byDate.has(seg.key)) continue
  const newItems = byDate.get(seg.key).items
  byDate.delete(seg.key) // 标记已处理

  // 把段 body 拆成「单条事件」数组(以 `### ` 切)
  const split = seg.body.split(/\n(?=### )/)
  const intro = split.shift() || '' // 第一段(段头到第一个 ### 之前)
  const items = split.map((s) => (s.endsWith('\n') ? s : s + '\n')) // 每段以 ### 开头

  const oldRendered = items.map((s) => ({ rank: rankOf(s), content: s }))
  const newRendered = newItems.map((n) => ({ rank: ORDER[n.importance], content: renderItem(n) }))
  const merged = [...oldRendered, ...newRendered].sort((a, b) => a.rank - b.rank)

  seg.body = intro + (intro && !intro.endsWith('\n\n') ? '\n' : '') + merged.map((m) => m.content).join('')
}

// 剩下的(byDate 里还有的)= 全新分组段,按 sortKey 倒序插入
const newSegments = []
for (const [key, { meta, items }] of byDate.entries()) {
  const sortedItems = [...items].sort((a, b) => ORDER[a.importance] - ORDER[b.importance])
  newSegments.push({
    key,
    sortKey: meta.sortKey,
    headerLine: meta.headerLine,
    body: '\n' + sortedItems.map(renderItem).join(''),
  })
}

// 合并 existing + new,按 sortKey 倒序(日级在月级之前,月级在年级之前,新在旧前)
const allSegments = [...existingSegments, ...newSegments].sort((a, b) => {
  if (a.sortKey < b.sortKey) return 1
  if (a.sortKey > b.sortKey) return -1
  return 0
})

// ===== 重组 markdown =====
let newMarkdown = head
for (const seg of allSegments) {
  newMarkdown += seg.headerLine + seg.body
}
newMarkdown += tail

// 在 head 里更新「最后自动更新于」徽章(若已有)
newMarkdown = newMarkdown.replace(
  /(<!--BOT-LAST-FETCH-->[\s\S]*?<!--\/BOT-LAST-FETCH-->)/,
  `<!--BOT-LAST-FETCH-->\n> 🤖 **最后自动更新于** ${(fetched.fetched_at || new Date().toISOString()).replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} · 由 news-bot 维护(本批新增 **${toAdd.length}** 条)\n<!--/BOT-LAST-FETCH-->`,
)

// ===== 自动归档(超过 80 条时把最老月份的所有日级 + 月级段移到 archive/)=====
// 归档以「月」为单位:把同月所有日级段 + 月级段一起搬走。
let archivedMonth = null
const totalEvents = (newMarkdown.match(/^### [🔥⭐📌]/gm) || []).length
if (totalEvents > ARCHIVE_THRESHOLD && allSegments.length > 1) {
  // 找最旧的月份(从 sortKey 提取 YYYY-MM)
  const oldestSeg = allSegments[allSegments.length - 1]
  const oldestMonth = oldestSeg.sortKey.slice(0, 7) // "YYYY-MM"
  archivedMonth = oldestMonth

  // 收集该月所有 segments(日级 + 月级)
  const sameMonthSegs = allSegments.filter((s) => s.sortKey.startsWith(oldestMonth))
  if (sameMonthSegs.length === allSegments.length) {
    // 全部都是同月,不归档(否则主页会空)
    archivedMonth = null
  } else {
    // 创建 archive 文件
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true })
    const archivePath = path.join(ARCHIVE_DIR, `${oldestMonth}.md`)
    const archiveContent = [
      '---',
      `title: 具身智能新闻归档 · ${oldestMonth}`,
      `description: 具身智能新闻 ${oldestMonth} 月份归档`,
      'sidebar: false',
      '---',
      '',
      `# 具身智能新闻 · ${oldestMonth} 归档`,
      '',
      `> 这是从 [新闻主页](/news/) 自动归档的 ${oldestMonth} 月内容。回到 [最新](/news/)。`,
      '',
      '---',
      '',
      sameMonthSegs.map((s) => s.headerLine + s.body).join(''),
    ].join('\n')
    fs.writeFileSync(archivePath, archiveContent, 'utf-8')
    console.log(`  · 已归档 ${oldestMonth} (${sameMonthSegs.length} 段) → ${archivePath}`)

    // 从主文件里移除该月所有 segments
    const remaining = allSegments.filter((s) => !s.sortKey.startsWith(oldestMonth))
    newMarkdown = head
    for (const seg of remaining) {
      newMarkdown += seg.headerLine + seg.body
    }
    newMarkdown += tail
  }
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
