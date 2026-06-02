// scripts/fetch-news.mjs
// 调 Anthropic API + web_search/web_fetch server tools 检索具身智能新闻。
// 输出:tmp/news-fetched.json
// 环境变量:ANTHROPIC_API_KEY 必填;NEWS_MODEL/NEWS_MAX_NEWS/NEWS_LOOKBACK_DAYS 可选。
//
// 设计要点:
// 1. server tools(web_search/web_fetch)在 Anthropic 服务器执行,一次 API 调用返回最终结果,
//    无需自己写 agent loop;tool_use 块和 text 块在同一 response 里。
// 2. 用 prefill 强制模型只输出 JSON(响应以 `{` 开头,模型补完成完整 JSON)。
// 3. 严格 JSON 解析失败 → 进程 exit(1),触发 workflow 失败、不写脏数据。
// 4. 用 .bot-state.json 已发布指纹注入到 prompt,实现 LLM 侧去重(merge 阶段还会做严格去重作兜底)。

import Anthropic from '@anthropic-ai/sdk'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PROMPT_PATH = path.join(__dirname, 'news-prompt.md')
const STATE_PATH = path.join(ROOT, 'docs/news/.bot-state.json')
const OUT_DIR = path.join(ROOT, 'tmp')
const OUT_PATH = path.join(OUT_DIR, 'news-fetched.json')

// ===== 配置(可通过环境变量覆盖)=====
const MODEL = process.env.NEWS_MODEL || 'claude-sonnet-4-6'
const MAX_NEWS = parseInt(process.env.NEWS_MAX_NEWS || '20', 10)
const LOOKBACK_DAYS = parseInt(process.env.NEWS_LOOKBACK_DAYS || '7', 10)
const MAX_TOKENS = parseInt(process.env.NEWS_MAX_TOKENS || '16000', 10)
const WEB_SEARCH_MAX = parseInt(process.env.NEWS_WEB_SEARCH_MAX || '30', 10)
const WEB_FETCH_MAX = parseInt(process.env.NEWS_WEB_FETCH_MAX || '50', 10)

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('[fetch-news] ❌ ANTHROPIC_API_KEY 未设置')
  process.exit(1)
}

// ===== 读 prompt 模板 =====
const promptTemplate = fs.readFileSync(PROMPT_PATH, 'utf-8')

// ===== 读已收录指纹(去重)=====
let knownFingerprints = []
let lastFetchedAt = '从未'
try {
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'))
  knownFingerprints = state.fingerprints || []
  lastFetchedAt = state.last_fetched_at || '从未'
} catch (e) {
  console.warn(`[fetch-news] ⚠️ 未找到 .bot-state.json,首次运行,无去重指纹`)
}

// ===== 注入占位符 =====
const TODAY = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
const knownBlock =
  knownFingerprints.length === 0
    ? '(无,首次运行)'
    : knownFingerprints.map((fp) => `- ${fp}`).join('\n')

const userPrompt = promptTemplate
  .replace('{{TODAY}}', TODAY)
  .replace('{{KNOWN_FINGERPRINTS}}', knownBlock)
  .replace('{{MAX_NEWS}}', String(MAX_NEWS))

console.log(`[fetch-news] ▶ 启动`)
console.log(`  · today          = ${TODAY}`)
console.log(`  · model          = ${MODEL}`)
console.log(`  · max_news       = ${MAX_NEWS}`)
console.log(`  · lookback_days  = ${LOOKBACK_DAYS}`)
console.log(`  · last_fetched   = ${lastFetchedAt}`)
console.log(`  · known_fingers  = ${knownFingerprints.length}`)
console.log(`  · web_search_max = ${WEB_SEARCH_MAX}, web_fetch_max = ${WEB_FETCH_MAX}`)

// ===== 调 API =====
const client = new Anthropic()
let response
const startedAt = Date.now()
try {
  response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    tools: [
      // server tools — Anthropic 在服务端执行,无需自己 loop
      { type: 'web_search_20250305', name: 'web_search', max_uses: WEB_SEARCH_MAX },
      { type: 'web_fetch_20250910', name: 'web_fetch', max_uses: WEB_FETCH_MAX },
    ],
    messages: [
      { role: 'user', content: userPrompt },
      // prefill:让模型只输出 JSON
      { role: 'assistant', content: '{' },
    ],
  })
} catch (err) {
  console.error(`[fetch-news] ❌ Anthropic API 调用失败:`, err.message || err)
  process.exit(1)
}

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
console.log(`[fetch-news] ✓ API 返回 (${elapsed}s, stop_reason=${response.stop_reason})`)
console.log(
  `  · usage: input ${response.usage?.input_tokens || 0} / output ${response.usage?.output_tokens || 0}`,
)
if (response.usage?.server_tool_use) {
  console.log(`  · tool calls: ${JSON.stringify(response.usage.server_tool_use)}`)
}

// ===== 提取最终文本(找最后一个 text block)=====
let finalText = ''
for (const block of response.content) {
  if (block.type === 'text') finalText += block.text
}
finalText = '{' + finalText // prefill 加回开头的 `{`

// ===== 严格解析 JSON =====
let parsed
try {
  // 模型可能在 JSON 后追加多余文字;只取第一段完整 JSON
  const jsonMatch = finalText.match(/^\s*(\{[\s\S]*?\})\s*(?:$|[^"}\d\]])/) || finalText.match(/^\s*(\{[\s\S]*\})/)
  parsed = JSON.parse(jsonMatch ? jsonMatch[1] : finalText)
} catch (err) {
  console.error(`[fetch-news] ❌ JSON 解析失败:${err.message}`)
  console.error(`[fetch-news]    text 头 500 字:`, finalText.slice(0, 500))
  // 把原始 text 落盘便于调试,但仍 exit(1) 不让 workflow 写脏
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'news-fetched-raw.txt'), finalText, 'utf-8')
  process.exit(1)
}

// ===== 验证基本结构 =====
if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.news)) {
  console.error(`[fetch-news] ❌ JSON 结构异常:缺 .news 数组`)
  console.error(`[fetch-news]    parsed:`, JSON.stringify(parsed).slice(0, 500))
  process.exit(1)
}

// 过滤掉缺字段的条目(防 LLM 漏填)
const REQUIRED = ['title', 'date', 'category', 'summary', 'source_url', 'source_name', 'importance', 'credibility', 'fingerprint']
const validNews = []
const skipped = []
for (const n of parsed.news) {
  const missing = REQUIRED.filter((k) => !n[k] || (typeof n[k] === 'string' && !n[k].trim()))
  if (missing.length > 0) {
    skipped.push({ title: n.title || '(无标题)', missing })
    continue
  }
  // importance / credibility 取值正规化
  if (!['hot', 'major', 'normal'].includes(n.importance)) n.importance = 'normal'
  if (!['verified', 'todo'].includes(n.credibility)) n.credibility = 'todo'

  // category 规范化为数组(兼容 LLM 输出字符串的情况)
  if (typeof n.category === 'string') {
    n.category = [n.category]
  } else if (!Array.isArray(n.category)) {
    n.category = []
  }

  // fetched_at 默认为今天(如果 LLM 漏填)
  if (!n.fetched_at) {
    n.fetched_at = TODAY
  }

  validNews.push(n)
}

if (skipped.length > 0) {
  console.warn(`[fetch-news] ⚠️ 跳过 ${skipped.length} 条字段不全的条目:`)
  for (const s of skipped) console.warn(`    - ${s.title}: 缺 ${s.missing.join(', ')}`)
}

// ===== 写出结果 =====
const out = {
  fetched_at: parsed.fetched_at || new Date().toISOString(),
  meta: {
    model: MODEL,
    today: TODAY,
    elapsed_seconds: Number(elapsed),
    input_tokens: response.usage?.input_tokens || 0,
    output_tokens: response.usage?.output_tokens || 0,
    server_tool_use: response.usage?.server_tool_use || null,
    skipped_count: skipped.length,
  },
  news: validNews,
}
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8')

// ===== 打印汇总 =====
const byImp = { hot: 0, major: 0, normal: 0 }
for (const n of validNews) byImp[n.importance]++
console.log(`[fetch-news] ✅ 写入 ${OUT_PATH}`)
console.log(`  · 总条数:${validNews.length}(🔥 ${byImp.hot} / ⭐ ${byImp.major} / 📌 ${byImp.normal})`)
console.log(`  · 已写入,等待 news-merge.mjs 去重合并`)
