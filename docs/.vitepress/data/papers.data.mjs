// 构建期数据加载器:论文细读元数据(供「论文档案头」与「谱系图」共用)。
// 事实源(全部站内已有内容,零新增维护面):
//  ① 收录名单 + 路线归属 = docs/index.md 两块 route-grid 路线卡(本站策展 taxonomy 的唯一权威面);
//  ② 发布年月 = 各细读页内第一个 arXiv 链接的 ID 前四位(YYMM = arXiv 提交年月,一手可核);
//  ③ 无 arXiv 的少数页面 → FALLBACK_DATES,每条注明出处(站内细读页自身的发布时间行),绝不凭记忆填。
// 解析结果全量打印到构建日志(诚实机制):缺日期/解析失败在日志显形,维护者据此核对。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DOCS = fileURLToPath(new URL('../../', import.meta.url))
const HOME = path.join(DOCS, 'index.md')

// 无 arXiv ID 页面的发布年月兜底(出处 = 站内该细读页明确陈述,2026-06-10 逐条核对)。
// 刻意不填 = 站内页面也未给出确定年月 → date 留 null,谱系图排线尾并标「日期待核」:
//  · wall-oss-05:页面自述「arXiv 编号待核;疑似 2026.02」→ 疑似不作数;
//  · groot-n2:页面自述「仅为预览,论文/细节未释出(待核)」。
const FALLBACK_DATES = {
  helix: '2025-02', // 细读页:Figure 官方发布页 2025-02-20(无论文,新闻稿一手)
}

// arXiv 误抓覆盖(2026-06-10 全量审计后加):转述型页面(自身无论文)的页内首个 ID
// 是「引用的他文」,自动提取会张冠李戴 → 显式置 null,日期走 FALLBACK_DATES(无则待核)。
//  · wall-oss-05:页面自述「arXiv 编号待核」,页内首个 ID 是前代 WALL-OSS 2509.11766。
//  · tau0-wm 已于 2026-06-11 摘牌:正式论文上线(2606.01027,实查解析),页头更新注先于
//    正文综述引用(2605.12090)出现,首 60 行第一匹配即正确 ID,无需再豁免。
// 新增「转述型 / 无自身 arXiv」细读时记得在此登记,并复跑去重审计(同 ID 两篇共用 = 红旗)。
const ARXIV_NULL = new Set(['wall-oss-05'])

// 路线展示顺序(谱系图线序;与首页卡片顺序一致)
const ROUTE_ORDER = [
  '离散 token', '连续 · 扩散/流匹配', '混合 · 连续回归', '分层 · 双系统/推理', '新范式探索',
  '级联 · 显式', '级联 · 隐式', '联合 · 自回归', '联合 · 扩散', '联合 · 混合', '跨范式 · 基座/平台/仿真',
]

function parseHomeCards(homeMd) {
  const papers = []
  const chunks = homeMd.split('<div class="route-card">').slice(1)
  for (const chunk of chunks) {
    const tagM = chunk.match(/route-tag">([^<]+)</)
    const route = tagM ? tagM[1].trim() : '未归类'
    // 只认本卡 route-links 区内的链接(防止最后一块 chunk 溢出到 coda 区,把「新手入门/基准速查」误收)
    const linksM = chunk.match(/route-links">([\s\S]*?)<\/div>/)
    if (!linksM) continue
    for (const m of linksM[1].matchAll(/<a href="(vla|wam)\/papers\/([\w-]+)">([^<]+)<\/a>/g)) {
      papers.push({
        slug: m[2],
        display: m[3].trim(),
        track: m[1] === 'vla' ? 'VLA' : 'WAM',
        route,
        link: `/${m[1]}/papers/${m[2]}`,
      })
    }
  }
  return papers
}

function extractMeta(slug, track) {
  const file = path.join(DOCS, track === 'VLA' ? 'vla' : 'wam', 'papers', `${slug}.md`)
  let md = ''
  try {
    md = fs.readFileSync(file, 'utf-8')
  } catch (e) {
    return { exists: false, arxivId: null, date: null }
  }
  if (ARXIV_NULL.has(slug)) {
    return { exists: true, arxivId: null, date: FALLBACK_DATES[slug] ?? null }
  }
  // 取「页面前 60 行」里的第一个 arXiv ID(细读页速览表里的本论文条目;
  // 避免正文后段引用他文的 arXiv 被误抓);前 60 行没有再全文兜底。
  // 认三种写法:arxiv.org/abs|pdf/ 链接、`arXiv:2302.00111` 文本、速览行 `**arXiv**: 2503.20020`
  // (gemini-robotics 曾因漏配「arXiv 后跟 ** 再跟冒号」而全文兜底误抓到配套安全论文的 ID)。
  const ARX = /arxiv\.org\/(?:abs|pdf)\/(\d{4})\.(\d{4,5})|arXiv\**[::]?\s*\**(\d{4})\.(\d{4,5})/
  const head = md.split('\n').slice(0, 60).join('\n')
  const m = head.match(ARX) || md.match(ARX)
  let arxivId = null
  let date = null
  if (m) {
    const yymm = m[1] || m[3]
    const num = m[2] || m[4]
    arxivId = `${yymm}.${num}`
    date = `20${yymm.slice(0, 2)}-${yymm.slice(2)}`
  } else if (FALLBACK_DATES[slug] !== undefined) {
    date = FALLBACK_DATES[slug]
  }
  return { exists: true, arxivId, date }
}

export default {
  watch: [HOME],
  load() {
    let homeMd = ''
    try {
      homeMd = fs.readFileSync(HOME, 'utf-8')
    } catch (e) {
      console.warn(`[papers.data] 无法读取首页:${e.message}`)
      return { papers: [], routes: ROUTE_ORDER }
    }
    const papers = parseHomeCards(homeMd)
    const missing = []
    const noDate = []
    for (const p of papers) {
      const meta = extractMeta(p.slug, p.track)
      p.arxivId = meta.arxivId
      p.date = meta.date
      if (!meta.exists) missing.push(p.slug)
      else if (!meta.date) noDate.push(p.slug)
    }
    // 谱系图线内排序:有日期按日期,无日期排线尾(保持卡内顺序稳定)
    const byRoute = {}
    for (const p of papers) (byRoute[p.route] ||= []).push(p)
    for (const r of Object.keys(byRoute)) {
      byRoute[r].sort((a, b) => {
        if (a.date && b.date) return a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug)
        if (a.date) return -1
        if (b.date) return 1
        return 0
      })
    }
    const vlaN = papers.filter((p) => p.track === 'VLA').length
    const wamN = papers.filter((p) => p.track === 'WAM').length
    console.log(`\n[papers.data] 首页路线卡解析:${papers.length} 篇(VLA ${vlaN} + WAM ${wamN})/ 缺文件 ${missing.length} / 缺日期 ${noDate.length}`)
    if (missing.length) console.log(`  · [error] 细读文件缺失:${missing.join(', ')}`)
    if (noDate.length) console.log(`  · [warn] 无 arXiv 且无兜底日期(谱系图标「日期待核」):${noDate.join(', ')}`)
    return { papers, byRoute, routes: ROUTE_ORDER.filter((r) => byRoute[r]) }
  },
}
