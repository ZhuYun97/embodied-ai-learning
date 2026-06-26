<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const BASE_PATH = import.meta.env.BASE_URL || '/'
const MARKDOWN_MODULES = import.meta.glob('../../../**/*.md', { query: '?raw', import: 'default' })

const DAILY_DIRECTIONS = [
  {
    id: 'latest',
    label: '最新论文雷达',
    scope: 'latest',
    focus: 'P0/P1 新论文、已细读候选与可验证 claim。',
    seed: '从每日最新论文队列和站内细读里筛出 3 个今日可推进 paper ideas。',
  },
  {
    id: 'data',
    label: '具身数据闭环',
    scope: 'data',
    focus: '数据采集、自动标注、失败回流和 VLA 后训练。',
    seed: '围绕具身数据 scaling、自动标注和失败驱动后训练生成今日 paper ideas。',
  },
  {
    id: 'wam',
    label: 'WAM / WLA',
    scope: 'wam',
    focus: '世界模型、未来预测、候选动作 critic 与真实执行成功率。',
    seed: '围绕 WAM / WLA 如何服务 VLA 控制和评测生成今日 paper ideas。',
  },
  {
    id: 'vla',
    label: 'VLA 后训练',
    scope: 'vla',
    focus: '动作接口、跨本体迁移、post-training 和部署反馈。',
    seed: '围绕 VLA 后训练、动作接口和部署反馈生成今日 paper ideas。',
  },
  {
    id: 'all',
    label: '全站交叉',
    scope: 'all',
    focus: '把 VLA、WAM、数据、评测与产业信号交叉成新问题。',
    seed: '结合全站落盘论文和最新研究信号生成今日 paper ideas。',
  },
]

const MODES = [
  { id: 'deep', label: 'Deep Discovery' },
  { id: 'quick', label: 'Quick Ideas' },
]

const FRONTIER_SIGNALS = [
  {
    title: 'WLA: World-Language-Action unified model',
    date: '2026-06-04',
    url: 'https://arxiv.org/abs/2606.05979',
    tags: ['VLA', 'WAM', 'CONTROL'],
    signal: '把 world modeling、language reasoning、action synthesis 放进统一 AR Transformer,用 World Expert / Action Expert 与 meta-query 连接预测和动作。',
    ideaHook: '把站内 WAM 与 VLA 细读合成“世界预测如何影响动作接口”的 idea。',
  },
  {
    title: 'DreamZero: World Action Models are zero-shot policies',
    date: '2026-02-17',
    url: 'https://arxiv.org/abs/2602.15922',
    tags: ['WAM', 'CONTROL', 'DATA'],
    signal: 'WAM 用视频扩散骨干联合建模未来世界状态和动作,强调跨环境、跨本体和视频演示迁移。',
    ideaHook: '把未来想象变成 VLA 候选动作的 critic / data filter。',
  },
  {
    title: 'World Model for Robot Learning survey',
    date: '2026-04-30',
    url: 'https://arxiv.org/html/2605.00080v1',
    tags: ['WAM', 'EVAL', 'DATA'],
    signal: '综述把机器人世界模型分成 policy coupling、simulator/evaluation、robotic video generation 等角色,并指出 evaluation 与 physical consistency 仍碎片化。',
    ideaHook: '把站内模型细读整理成一个可测的 evaluation protocol idea。',
  },
  {
    title: 'Robots Need More Than VLAs & World Models',
    date: '2026-06-05',
    url: 'https://arxiv.org/html/2606.06556v1',
    tags: ['DATA', 'EVAL', 'CONTROL'],
    signal: '提出 physical data engine / embodied autolabelling / deployment feedback loop,把失败、接触、物体状态和奖励错误转成结构化监督。',
    ideaHook: '把“数据处理页 + 最新论文队列”转成物理可用标签自动生成的 idea。',
  },
]

const TAG_RULES = [
  { tag: 'WLA', terms: ['wla', 'world-language-action', 'world language action', '世界-语言-动作'] },
  { tag: 'VLA', terms: ['vla', '视觉-语言-动作', 'vision-language-action', 'openvla', 'qwen-vla', 'π0', 'pi0'] },
  { tag: 'WAM', terms: ['wam', '世界模型', 'world model', 'world-action', 'world action', 'future visual'] },
  { tag: 'DATA', terms: ['数据', 'dataset', 'data', '合成', '筛选', '标注', '伪标签', '采集', 'scaling', 'rlds', 'lerobot'] },
  { tag: 'EVAL', terms: ['评测', 'benchmark', '基准', '成功率', '自评', '复现', 'roboarena'] },
  { tag: 'CONTROL', terms: ['动作', '控制', 'action', 'trajectory', 'waypoint', 'delta', '跨本体', '运控'] },
  { tag: 'DEPLOY', terms: ['部署', '推理', '量化', '实时', 'latency', 'online', 'post-training'] },
  { tag: 'NEWS', terms: ['新闻', '融资', '发布', '产品', '公司', '产业'] },
]

const STOP = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'what', 'how', 'why', 'are', 'was', 'were',
  '一个', '哪些', '如何', '什么', '主要', '以及', '还是', '之间', '是否', '可以', '进行', '研究',
])

const dailyClock = ref(Date.now())
const mode = ref('quick')
const corpus = ref([])
const loading = ref(true)
const loadError = ref('')
const result = ref(null)
const lastRunAt = ref('')
const corpusSource = ref('')
let timer = 0

const today = computed(() => new Date(dailyClock.value))

const todayKey = computed(() => today.value.toLocaleDateString('zh-CN', {
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
}))

const dailyDirection = computed(() => {
  const date = today.value
  const dayIndex = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000)
  return DAILY_DIRECTIONS[Math.abs(dayIndex) % DAILY_DIRECTIONS.length]
})

const dailySeed = computed(() => `${todayKey.value} · ${dailyDirection.value.seed}`)

const corpusStats = computed(() => {
  const stats = { all: corpus.value.length, vla: 0, wam: 0, data: 0, latest: 0, news: 0, ecosystem: 0 }
  for (const doc of corpus.value) {
    if (doc.bucket in stats) stats[doc.bucket] += 1
    if (doc.tags.includes('DATA')) stats.data += 1
  }
  return stats
})

function cleanText(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+]\(([^)]+)\)/g, (m) => m.replace(/\(([^)]+)\)/, ''))
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  const lower = String(text || '').toLowerCase()
  const out = []
  const latin = lower.match(/[a-z0-9][a-z0-9+._/-]{1,}/g) || []
  for (const t of latin) {
    if (!STOP.has(t) && t.length > 1) out.push(t)
  }
  const han = lower.match(/[\u4e00-\u9fff]{2,}/g) || []
  for (const seq of han) {
    if (!STOP.has(seq)) out.push(seq)
    if (seq.length > 2) {
      for (let i = 0; i < seq.length - 1; i++) out.push(seq.slice(i, i + 2))
    }
  }
  return [...new Set(out)].slice(0, 80)
}

function bucketFromUrl(url) {
  if (url.includes('/papers/latest')) return 'latest'
  if (url.includes('/news/')) return 'news'
  if (url.includes('/ecosystem/')) return 'ecosystem'
  if (url.includes('/wam/')) return 'wam'
  if (url.includes('/vla/')) return 'vla'
  return 'all'
}

function inferTags(title, text, bucket) {
  const hay = `${title} ${text}`.toLowerCase()
  const tags = new Set()
  if (bucket === 'vla') tags.add('VLA')
  if (bucket === 'wam') tags.add('WAM')
  if (bucket === 'latest') tags.add('LATEST')
  if (bucket === 'news') tags.add('NEWS')
  for (const rule of TAG_RULES) {
    if (rule.terms.some((term) => hay.includes(term.toLowerCase()))) tags.add(rule.tag)
  }
  return [...tags].slice(0, 5)
}

function parseCorpus(raw) {
  return raw
    .split(/\n\n---\n\n/g)
    .map((block, index) => {
      const title = block.match(/^#\s+(.+)$/m)?.[1]?.trim()
      const url = block.match(/^来源:\s*(.+)$/m)?.[1]?.trim()
      if (!title || !url) return null
      const text = cleanText(block.replace(/^#\s+.+$/m, '').replace(/^来源:\s*.+$/m, ''))
      const bucket = bucketFromUrl(url)
      const tags = inferTags(title, text, bucket)
      return { id: `${index}-${title}`, title, url, text, bucket, tags, tokens: tokenize(`${title} ${text}`) }
    })
    .filter(Boolean)
}

function titleFromMarkdown(raw, rel) {
  const fmBlock = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fmBlock) {
    const title = fmBlock[1].match(/^title:\s*(.+)$/m)
    if (title) return title[1].trim().replace(/^["']|["']$/g, '')
  }
  const h1 = raw.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return rel === 'index.md' ? '具身星图' : rel.replace(/\.md$/, '')
}

function stripMarkdown(raw) {
  return raw
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/```mermaid[\s\S]*?```/g, '[流程图,详见网页]')
    .replace(/<div[\s\S]*?<\/div>/g, '')
    .trim()
}

function routeFromRel(rel) {
  const route = rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  return withBase(`/${route}`)
}

async function loadMarkdownFallback() {
  const docs = []
  for (const [file, load] of Object.entries(MARKDOWN_MODULES)) {
    const rel = file.replace(/^(\.\.\/){3}/, '')
    if (!rel || rel === '404.md' || rel.startsWith('.vitepress/')) continue
    const raw = await load()
    docs.push({
      title: titleFromMarkdown(raw, rel),
      url: routeFromRel(rel),
      text: stripMarkdown(raw).slice(0, 4000),
    })
  }
  return normalizeDocs(docs)
}

function normalizeDocs(docs) {
  return docs
    .map((doc, index) => {
      const title = doc.title?.trim()
      const url = doc.url?.trim()
      if (!title || !url) return null
      const text = cleanText(doc.text || '')
      const bucket = bucketFromUrl(url)
      const tags = inferTags(title, text, bucket)
      return { id: `${index}-${title}`, title, url, text, bucket, tags, tokens: tokenize(`${title} ${text}`) }
    })
    .filter(Boolean)
}

function scopeMatch(doc) {
  const currentScope = dailyDirection.value.scope
  if (currentScope === 'all') return true
  if (currentScope === 'data') return doc.tags.includes('DATA')
  if (currentScope === 'latest') return doc.bucket === 'latest' || doc.tags.includes('LATEST') || doc.title.includes('每日最新论文')
  return doc.bucket === currentScope
}

function scoreDoc(doc, qTokens) {
  const title = doc.title.toLowerCase()
  const text = doc.text.toLowerCase()
  let score = 0
  for (const t of qTokens) {
    if (title.includes(t)) score += 16
    const first = text.indexOf(t)
    if (first >= 0) score += 5 + Math.max(0, 5 - Math.floor(first / 900))
    if (doc.tokens.includes(t)) score += 2
  }
  if (qTokens.some((t) => ['数据', 'dataset', 'data', '合成', '筛选', '标注'].includes(t)) && doc.tags.includes('DATA')) score += 10
  if (qTokens.some((t) => ['world', '世界', 'wam', '想象', '未来'].includes(t)) && doc.tags.includes('WAM')) score += 8
  if (qTokens.some((t) => ['vla', '动作', 'action', '控制'].includes(t)) && doc.tags.includes('VLA')) score += 8
  if (doc.bucket === 'latest' || doc.tags.includes('LATEST')) score += 16
  if (/(2026-06-25|P0|P1|每日最新论文|PAPER RADAR)/i.test(`${doc.title} ${doc.text}`)) score += 6
  return score
}

function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[。！？.!?])\s+|\s{2,}|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 18 && s.length <= 220)
}

function snippetFor(doc, qTokens) {
  const scored = splitSentences(doc.text).map((sentence) => {
    const lower = sentence.toLowerCase()
    let score = 0
    for (const t of qTokens) if (lower.includes(t)) score += 1
    for (const tag of doc.tags) if (lower.includes(tag.toLowerCase())) score += 0.5
    return { sentence, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return (scored.find((s) => s.score > 0)?.sentence || scored[0]?.sentence || doc.text.slice(0, 160)).trim()
}

function dedupeSentences(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const key = item.text.replace(/[，。,.!！?？\s]/g, '').slice(0, 28)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function buildFocus(topDocs) {
  const counts = new Map()
  for (const doc of topDocs) for (const tag of doc.tags) counts.set(tag, (counts.get(tag) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([tag]) => tag)
}

function compactTitle(title) {
  return title
    .replace(/\s*细读[:：].*$/u, '')
    .replace(/\s*深度调研.*$/u, '')
    .replace(/\s*全景.*$/u, '全景')
    .trim()
}

function pickEvidence(evidence, tags, fallbackCount = 3) {
  const tagged = evidence.filter((doc) => tags.some((tag) => doc.tags.includes(tag) || doc.bucket === tag.toLowerCase()))
  return (tagged.length ? tagged : evidence).slice(0, fallbackCount)
}

function buildFrontierMatches(qTokens, focus) {
  return FRONTIER_SIGNALS
    .map((signal) => {
      const hay = `${signal.title} ${signal.signal} ${signal.ideaHook}`.toLowerCase()
      let score = 0
      for (const tag of signal.tags) if (focus.includes(tag)) score += 12
      for (const token of qTokens) if (hay.includes(token)) score += 5
      if (signal.tags.includes('DATA') && focus.includes('LATEST')) score += 4
      return { ...signal, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
}

function buildTensions(focus, evidence, frontiers) {
  const tensions = []
  if (focus.includes('DATA') || evidence.some((doc) => doc.tags.includes('DATA'))) {
    tensions.push({
      title: '数据闭环缺少触发器',
      problem: '站内材料已经覆盖采集、清洗、筛选和后训练,最新 physical data engine 方向也在强调失败回流,但还缺少“失败样本何时触发补采/合成/重标注”的可执行判据。',
      researchMove: '把失败类型、动作接口和数据操作绑定成一个 closed-loop data scheduler,让数据增长从规模叙事变成可检验机制。',
      sources: pickEvidence(evidence, ['DATA', 'VLA'], 2),
    })
  }
  if (focus.includes('WAM') || focus.includes('WLA') || frontiers.some((item) => item.tags.includes('WAM'))) {
    tensions.push({
      title: 'WAM 生成质量和策略成功率之间缺桥',
      problem: 'WLA / WAM 新工作把未来状态、语言和动作放进统一模型,但“想象得像”如何变成“执行得稳”仍没有统一协议。',
      researchMove: '设计一个 WAM/WLA-as-critic 协议,比较视觉一致性、任务进度估计和真实执行成功率。',
      sources: pickEvidence(evidence, ['WAM', 'EVAL'], 2),
    })
  }
  if (focus.includes('CONTROL')) {
    tensions.push({
      title: '跨本体动作表示仍是接口瓶颈',
      problem: 'EEF delta、waypoint、joint action、action prior 各自有效,但跨机器人迁移时缺统一中间层。',
      researchMove: '做一个 action-interface ablation,把同一任务拆成 token / delta / waypoint / prior 四种接口对照。',
      sources: pickEvidence(evidence, ['CONTROL', 'VLA'], 2),
    })
  }
  if (focus.includes('EVAL')) {
    tensions.push({
      title: '自评指标和可复现实验需要分层',
      problem: '每日论文队列里有大量 P0/P1 与已细读状态,但作者自评、厂商口径和第三方榜单容易混在一起。',
      researchMove: '把 evidence trust level 纳入 idea 筛选和实验表格,单独评估“指标可信度”对结论排序的影响。',
      sources: pickEvidence(evidence, ['EVAL', 'NEWS'], 2),
    })
  }
  if (!tensions.length) {
    tensions.push({
      title: '主题仍需收窄',
      problem: '当前 seed 覆盖太宽,先把对象限定到模型范式、数据流程、评测协议或部署约束之一。',
      researchMove: '从证据最多的两个标签开始做 pairwise contrast。',
      sources: evidence.slice(0, 2),
    })
  }
  return tensions.slice(0, 4)
}

function sourceTitles(docs) {
  return docs.map((doc) => compactTitle(doc.title)).filter(Boolean).slice(0, 3).join(' / ')
}

function buildPaperIdeas(seed, focus, evidence, tensions, frontiers) {
  const ideas = []
  const first = compactTitle(evidence[0]?.title || '站内核心证据')
  const second = compactTitle(evidence[1]?.title || '对照证据')
  const latestSources = pickEvidence(evidence, ['LATEST', 'DATA', 'VLA', 'WAM'], 4)
  const frontierByTag = (tag) => frontiers.find((item) => item.tags.includes(tag)) || frontiers[0]

  if (focus.includes('DATA') || focus.includes('VLA')) {
    ideas.push({
      title: 'Failure-to-Data: 面向 VLA 后训练的失败驱动数据引擎',
      thesis: '把 VLA 后训练从“继续收更多数据”改成“由失败类型自动决定补采、合成、过滤或重标注”。',
      motivation: `站内 ${sourceTitles(latestSources)} 已经把数据采集、处理、筛选和后训练放到同一问题链上;最新 physical data engine 方向进一步说明,真正的瓶颈不是数据量本身,而是失败能不能变成下一轮可训练监督。`,
      contributions: [
        '提出 failure primitive -> data action 的结构化映射,把失败样本分成补采、合成、过滤、重标注和奖励修正五类处理动作。',
        '给出一个不依赖外部大模型 API 的离线数据调度器,直接从站内论文里的动作接口、接触状态和任务进度变量抽取规则。',
        '建立同等数据预算下的 VLA 后训练评测协议,衡量“每新增 1% 成功率需要多少新样本”。',
      ],
      method: [
        '从失败 rollout 中解析 primitive、action-interface mismatch、接触状态错误和物体状态错误。',
        '用规则 + 轻量 embedding 检索决定 recollect / simulate / relabel / filter / reward-fix。',
        '对同一基座 VLA 跑 uniform replay、hard mining 和 failure-to-data scheduler 三组后训练。',
      ],
      evaluation: '2-3 个桌面操作任务;指标包括成功率、失败复现率、样本效率、错误标签修复率和新增数据成本。',
      novelty: focus.includes('DATA') ? 86 : 74,
      feasibility: 78,
      whyNow: frontierByTag('DATA')?.ideaHook || '最新数据引擎方向正在把失败反馈、自动标注和部署回流连成闭环。',
      frontier: frontierByTag('DATA'),
      sources: pickEvidence(evidence, ['DATA', 'VLA', 'CONTROL'], 3),
    })
  }

  if (focus.includes('WAM') || focus.includes('WLA') || focus.includes('EVAL') || frontiers.some((item) => item.tags.includes('WAM'))) {
    ideas.push({
      title: 'WLA Critic: 用世界-语言-动作模型给 VLA 候选动作打分',
      thesis: '把 WAM/WLA 从“生成未来状态”推进到“给 VLA 候选动作做执行前风险评估”。',
      motivation: `最新 WLA 与 DreamZero 式 WAM 都在把未来状态和动作联合建模;站内 ${sourceTitles(pickEvidence(evidence, ['WAM', 'VLA'], 3))} 则显示,真实瓶颈是这些预测信号如何服务闭环控制。`,
      contributions: [
        '提出 WLA-as-critic 接口:输入 VLA 的 K 个候选动作,输出任务进度、物理一致性和失败风险三类分数。',
        '把世界模型 rollout 评价从视觉保真度扩展为“是否值得执行”的策略选择问题。',
        '给出 WAM/WLA 分数与真实执行成功率之间的相关性基准,区分会想象和会控制。',
      ],
      method: [
        '用 VLA 采样 K 条短 horizon action plan,并保留语言目标、当前图像和动作接口。',
        '用 WAM/WLA 预测未来状态或 latent transition,提取 progress、contact consistency、collision/risk score。',
        '执行 top-1 / top-k rerank 后的动作,与无 critic、语言置信度 critic、value-only critic 对照。',
      ],
      evaluation: 'AUROC、失败提前预警率、误杀可执行动作比例、真实成功率提升和闭环延迟。',
      novelty: focus.includes('WAM') ? 88 : 76,
      feasibility: 70,
      whyNow: frontierByTag('WAM')?.ideaHook || 'WAM/WLA 最新工作正在把世界预测和动作生成合并,正好需要一个 grounding protocol。',
      frontier: frontierByTag('WAM') || frontierByTag('WLA'),
      sources: pickEvidence(evidence, ['WAM', 'EVAL', 'VLA'], 3),
    })
  }

  if (focus.includes('CONTROL') || focus.includes('VLA')) {
    ideas.push({
      title: 'Action Interface Router: 跨机器人本体的动作表示自适应选择',
      thesis: '让模型在 token、EEF delta、waypoint 和 action prior 之间自动选择动作接口,而不是为所有任务固定一种控制表示。',
      motivation: `站内动作先验、trajectory、waypoint 与运控页面已经说明动作接口会决定迁移上限;最新 WLA/WAM 趋势把 action head 做进统一模型后,更需要解释“什么任务该用什么动作表示”。`,
      contributions: [
        '提出 task geometry / contact phase / embodiment gap 三维条件下的动作接口选择问题。',
        '构建一个轻量 router,按任务阶段选择 token、delta、waypoint 或 learned prior head。',
        '给出跨本体消融:同一 demonstration 下只替换动作接口,评估迁移失败来自模型还是接口。',
      ],
      method: [
        '从站内论文抽取动作接口变量表:动作维度、时间粒度、接触敏感性、是否依赖本体标定。',
        '训练 router 预测接口类型,每个接口接一个小 action head,共享 VLA/WLA 表征。',
        '用少量目标本体数据适配,比较固定接口、多头平均和 router 选择。',
      ],
      evaluation: '跨本体成功率、样本效率、动作平滑度、接触状态错误率和控制频率。',
      novelty: focus.includes('CONTROL') ? 84 : 73,
      feasibility: 74,
      whyNow: frontierByTag('CONTROL')?.ideaHook || '跨本体迁移进入 WLA/WAM 主线后,动作接口本身变成可研究对象。',
      frontier: frontierByTag('CONTROL'),
      sources: pickEvidence(evidence, ['CONTROL', 'VLA', 'DATA'], 3),
    })
  }

  if (ideas.length < 3 || focus.includes('LATEST') || focus.includes('EVAL')) {
    ideas.push({
      title: 'Trust-Aware Paper Radar: 面向具身 AI 的可信 idea 筛选器',
      thesis: '把每日最新论文从“收录列表”升级为“可投稿 idea 的可信度排序器”。',
      motivation: `站内每日论文队列已经区分 P0/P1、已细读、待细读和观察;但最新论文越多,越需要把作者自评、厂商口径和第三方验证拆开,否则 idea 很容易被高调指标带偏。`,
      contributions: [
        '提出 evidence trust level: arXiv 一手、作者自评、厂商新闻、第三方榜单、站内细读五类证据分层。',
        '把 trust level 引入 idea 排序,输出 novelty、feasibility、verification cost 三个分数。',
        '给出 VLA/WAM/DATA 三轨每日论文的 idea mining benchmark。',
      ],
      method: [
        '解析站内每日论文页和细读页中的 ⚠️/✅/待核、P0/P1、arXiv 与代码链接。',
        '为每个候选 idea 绑定 supporting / contradicting / missing evidence 三类证据。',
        '比较原始热度排序、关键词排序和可信度加权排序对最终研究方向的影响。',
      ],
      evaluation: '人工专家打分一致性、后续细读转化率、不可验证 claim 占比、idea novelty/feasibility 排名稳定性。',
      novelty: 68,
      feasibility: 90,
      whyNow: '每日论文队列已经落盘,具备从“记录最新”走向“筛出可写 paper”所需的本地语料。',
      frontier: frontiers.find((item) => item.tags.includes('EVAL')) || frontiers[0],
      sources: pickEvidence(evidence, ['LATEST', 'EVAL', 'NEWS', 'VLA', 'WAM'], 3),
    })
  }

  if (ideas.length < 3) {
    ideas.push({
      title: 'Evidence-to-Benchmark: 从站内细读自动生成最小评测协议',
      thesis: '把站内论文细读里的 claim、失败模式和待核标记转成可复现实验清单,让 idea 从第一天就带验证路径。',
      motivation: `当前 seed 下站内证据更像材料池而非单一技术路线;这正适合做一个把 ${first} 与 ${second} 转成最小 benchmark 的方法论文。`,
      contributions: [
        '提出 claim -> variable -> metric 的抽取模板,把论文细读里的自然语言结论转成实验变量。',
        '把 ⚠️/✅/待核 显式纳入 benchmark design,避免把不可核声明混入主指标。',
        '输出每个研究方向的最小可证伪实验,降低从读论文到做实验的启动成本。',
      ],
      method: [
        '从站内页面抽取 claim、baseline、数据来源、动作接口、评测环境和失败模式。',
        '用规则把 claim 映射到变量表与 ablation 表,并要求每个变量能被复现或反证。',
        '对 VLA/WAM/DATA 三类页面分别生成 toy protocol,人工检查覆盖率和可执行性。',
      ],
      evaluation: '协议覆盖率、专家可执行性评分、遗漏关键变量比例、不可核 claim 过滤率。',
      novelty: 72,
      feasibility: 86,
      whyNow: '站内细读和每日论文队列已经沉淀了足够多结构化页面,可以开始把“阅读资产”转成“实验资产”。',
      frontier: frontiers.find((item) => item.tags.includes('EVAL')) || frontiers[0],
      sources: pickEvidence(evidence, ['EVAL', 'VLA', 'WAM', 'DATA', 'LATEST'], 3),
    })
  }

  return ideas.slice(0, 3).map((idea, index) => ({
    ...idea,
    id: `idea-${index}`,
    anchor: `${first} × ${second}`,
    tension: tensions[index % tensions.length]?.title || '证据张力',
    seed,
  }))
}

function buildReadingQueue(evidence) {
  return evidence.slice(0, 7).map((doc, index) => {
    const purpose = doc.tags.includes('DATA')
      ? '抽取数据变量、失败类型和训练配方'
      : doc.tags.includes('WAM')
        ? '抽取 rollout / value / future prediction 信号'
        : doc.tags.includes('CONTROL')
          ? '抽取动作接口与跨本体迁移条件'
          : '抽取可核事实与待核边界'
    return { ...doc, index: index + 1, purpose }
  })
}

function buildIdeaMatrix(ideas, focus) {
  return ideas.map((idea) => ({
    title: idea.title,
    variable: focus.includes('DATA') ? '失败类型 / 数据操作 / 动作接口' : '模型接口 / 预测信号 / 执行反馈',
    baseline: idea.title.includes('Critic') ? 'VLA 直接执行、语言置信度 rerank、value-only rerank' : '原始 VLA/WAM 方法、uniform replay、固定动作接口',
    proof: idea.evaluation,
    check: '每个 claim 都必须绑定站内来源或最新一手论文,⚠️ 自评与 ✅ 第三方验证分开写。',
  }))
}

function buildPaperOutline(ideas, tensions) {
  const lead = ideas[0]
  return [
    { title: '1. Motivation', text: lead ? lead.motivation : '用最新研究信号和站内证据定义 why now。' },
    { title: '2. Gap', text: `把 ${tensions.map((item) => item.title).join(' / ')} 转成一条明确 research gap。` },
    { title: '3. Contributions', text: lead ? lead.contributions.join(' ') : '列出 2-3 个可被审稿人检查的贡献。' },
    { title: '4. Method', text: lead ? lead.method.join(' ') : '提出最小可实现方法,避免泛泛综述。' },
    { title: '5. Experiments', text: lead ? lead.evaluation : '做 ablation + 可信度分层 + 失败分析。' },
  ]
}

function buildNextActions(ideas) {
  const lead = ideas[0]?.title || '候选 idea'
  return [
    `锁定主 idea「${lead}」,只保留 6 篇最强证据和 2 篇反例。`,
    '把动机里的每一句 why now 改写成可引用来源,不要混用作者自评和第三方验证。',
    '把方法拆成 1 个主模块 + 2 个 ablation,先画出输入输出变量表。',
    '找最小实验场景或 toy benchmark,先验证方向性而不是追求完整系统。',
    '写 1 页 idea memo:Motivation / Contributions / Method / Evaluation / Risks。',
  ]
}

function clampScore(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function candidateFromIdea(idea) {
  return {
    title: idea.title,
    oneLiner: idea.thesis,
    problemAnchor: idea.motivation,
    hypothesis: idea.thesis,
    method: idea.method,
    tags: [...new Set([...(idea.sources || []).flatMap((doc) => doc.tags), idea.frontier?.tags || []].flat())].slice(0, 5),
    sources: idea.sources || [],
    risk: idea.title.includes('Critic') ? '世界模型分数可能只相关于视觉保真度,不相关于真实执行成功率。' : '需要把站内自然语言证据转成可复现实验变量,否则容易停留在综述层。',
    pilot: idea.evaluation,
    pilotHours: idea.title.includes('Critic') ? 2 : 1.5,
    novelty: idea.novelty,
    feasibility: idea.feasibility,
    origin: 'shortlisted',
  }
}

function buildExtraCandidates(evidence, frontiers) {
  return [
    {
      title: 'Coverage-Aware WAM: 面向低覆盖状态的幻觉风险门控',
      oneLiner: '把 world model hallucination 从生成质量问题改成 state-action coverage 的风险估计问题。',
      problemAnchor: '最新论文队列里已有 world model hallucination 与覆盖区域相关的信号,站内 WAM 细读也反复提到 rollout 漂移和物理一致性。',
      hypothesis: '如果在执行前估计 state-action coverage,就能过滤掉更可能幻觉的 WAM rollout,提升 critic 可靠性。',
      method: ['从演示轨迹估计 coverage proxy。', '给 WAM rollout 加 coverage-aware risk head。', '比较无门控、置信度门控和 coverage 门控。'],
      tags: ['WAM', 'EVAL', 'DATA'],
      sources: pickEvidence(evidence, ['WAM', 'EVAL', 'LATEST'], 3),
      risk: 'coverage proxy 可能过粗,需要证明它比简单不确定性更有用。',
      pilot: '用离线轨迹重放做 1 个 toy coverage split,测试风险分数与失败率相关性。',
      pilotHours: 1.5,
      novelty: 80,
      feasibility: 76,
      origin: 'generated',
    },
    {
      title: 'Stage-Aware VLA Post-training: 用关键帧阶段监督减少接触点失败',
      oneLiner: '把 gripper event / keyframe / task stage 变成 VLA 后训练的稀疏结构监督。',
      problemAnchor: '站内数据处理、动作接口和最新论文队列都显示,失败常集中在接触切换和关键帧附近。',
      hypothesis: '阶段监督能让同等数据量的 VLA 更稳地处理接触前后状态切换。',
      method: ['从轨迹中自动提取 gripper event 与关键帧。', '给 action head 加 phase-aware auxiliary loss。', '在接触密集任务上做去除阶段监督消融。'],
      tags: ['VLA', 'DATA', 'CONTROL'],
      sources: pickEvidence(evidence, ['VLA', 'DATA', 'CONTROL', 'LATEST'], 3),
      risk: '如果任务阶段标签噪声过大,辅助监督会误导动作生成。',
      pilot: '先在 1 个开源操作数据集上自动抽 keyframes,检查标签稳定性和失败集中度。',
      pilotHours: 2,
      novelty: 78,
      feasibility: 82,
      origin: 'generated',
    },
    {
      title: 'Human-to-Robot Data Quality Estimator: 第一视角视频到机器人监督的可迁移性评分',
      oneLiner: '在人类视频进入训练前,估计它能否被转成有效机器人动作监督。',
      problemAnchor: '具身数据页覆盖第一视角、人类示范和跨本体数据,但缺少一个输入训练前的数据可用性判据。',
      hypothesis: '只保留 kinematic gap 小、物体交互清晰、阶段可分的视频片段,比盲目扩大人类视频数据更有效。',
      method: ['抽取手/物体/视角稳定性特征。', '估计 retargeting difficulty 与 label confidence。', '按质量分层训练 VLA 或 action prior。'],
      tags: ['DATA', 'CONTROL', 'EVAL'],
      sources: pickEvidence(evidence, ['DATA', 'CONTROL', 'EVAL'], 3),
      risk: '质量评分可能和任务难度耦合,需要分离“难但有用”和“噪声大”。',
      pilot: '对 50-100 个视频片段人工打分,验证自动质量分和人工可迁移性判断的一致性。',
      pilotHours: 1,
      novelty: 76,
      feasibility: 84,
      origin: 'generated',
    },
    {
      title: 'Deployment Smoke-Test Router: 用上线前 rollout 选择 VLA 专家',
      oneLiner: '把短 smoke test 的失败轨迹转成 frozen VLA experts 的路由监督。',
      problemAnchor: '多专家 VLA 和部署选择已经进入每日论文队列,但多数路由仍依赖静态任务标签或语言描述。',
      hypothesis: '少量上线前 smoke rollout 比任务文本更能预测哪一个专家适合当前环境/本体。',
      method: ['对每个专家执行极短 horizon smoke rollout。', '抽取失败类型、时延和动作平滑度。', '训练 router 选择或组合专家。'],
      tags: ['VLA', 'DEPLOY', 'EVAL'],
      sources: pickEvidence(evidence, ['VLA', 'DEPLOY', 'EVAL', 'LATEST'], 3),
      risk: 'smoke test 成本必须低于专家切换收益,否则工程意义不足。',
      pilot: '离线重放已有 rollout,模拟只看前 N 秒能否预测最终成功率。',
      pilotHours: 1.5,
      novelty: 74,
      feasibility: 80,
      origin: 'generated',
    },
    {
      title: 'Tactile-WAM Failure Oracle: 触觉未来预测作为操作失败早预警',
      oneLiner: '把触觉未来状态预测接到 WAM critic,专门处理视觉难以发现的滑动、空抓和接触异常。',
      problemAnchor: '最新 WAM 方向开始加入触觉未来状态,而站内操作失败模式多发生在接触状态不可见或不稳定时。',
      hypothesis: '触觉未来预测能比纯视觉 WAM 更早发现接触失败,尤其在遮挡和小物体任务中。',
      method: ['把 tactile token 作为 WAM rollout 的辅助分支。', '训练 contact-risk score。', '比较视觉-only、触觉-only、多模态 critic。'],
      tags: ['WAM', 'CONTROL', 'EVAL'],
      sources: pickEvidence(evidence, ['WAM', 'CONTROL', 'EVAL', 'LATEST'], 3),
      risk: '触觉数据难收集,需要先证明小规模数据也能提供增益。',
      pilot: '用公开/自有小规模触觉片段做 binary failure prediction sanity check。',
      pilotHours: 2.5,
      novelty: 82,
      feasibility: 62,
      origin: 'generated',
    },
  ].map((candidate) => ({
    ...candidate,
    frontier: frontiers.find((item) => candidate.tags.some((tag) => item.tags.includes(tag))) || frontiers[0],
  }))
}

function closestExistingWork(candidate, evidence) {
  const tokens = tokenize(`${candidate.title} ${candidate.oneLiner} ${candidate.problemAnchor}`)
  const scored = evidence.map((doc) => {
    const hay = `${doc.title} ${doc.text}`.toLowerCase()
    let score = 0
    for (const token of tokens) if (hay.includes(token)) score += 1
    for (const tag of candidate.tags || []) if (doc.tags.includes(tag)) score += 2
    if (doc.bucket === 'latest') score += 1
    return { doc, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(({ doc, score }) => ({ ...doc, matchScore: score }))
}

function noveltyCheck(candidate, evidence) {
  const closest = closestExistingWork(candidate, evidence)
  const top = closest[0]
  const noveltyPenalty = Math.min(18, Math.max(0, (top?.matchScore || 0) - 8))
  const score = clampScore((candidate.novelty || 70) - noveltyPenalty)
  const status = score >= 80 ? 'LOCAL NOVELTY: STRONG' : score >= 68 ? 'LOCAL NOVELTY: PLAUSIBLE' : 'TOO CLOSE LOCALLY'
  const closestTitle = top ? compactTitle(top.title) : '站内未找到近邻'
  return {
    score,
    status,
    closest,
    differentiation: `最近站内近邻是「${closestTitle}」。当前 idea 的区分点应写清:问题变量、干预模块、评测协议至少有一项不同。`,
  }
}

function reviewerRubric(candidate, novelty) {
  const clarity = candidate.method?.length >= 3 ? 8 : 6
  const feasibility = Math.round((candidate.feasibility || 70) / 10)
  const noveltyScore = Math.round(novelty.score / 10)
  const pilot = candidate.pilotHours <= 2 ? 8 : 5
  const reviewerScore = Math.min(10, Math.round((clarity + feasibility + noveltyScore + pilot) / 4))
  const concern = reviewerScore >= 8
    ? '主要风险在实验协议是否足够干净,需要把自评指标和可复现实验分开。'
    : '当前 idea 需要进一步收窄变量,否则贡献可能被审稿人认为只是系统集成。'
  return { reviewerScore, concern }
}

function rankCandidate(candidate, evidence, focus, index) {
  const novelty = noveltyCheck(candidate, evidence)
  const review = reviewerRubric(candidate, novelty)
  const focusBoost = (candidate.tags || []).filter((tag) => focus.includes(tag)).length * 4
  const pilotBoost = candidate.pilotHours <= 2 ? 6 : -5
  const finalScore = clampScore(novelty.score * 0.36 + (candidate.feasibility || 70) * 0.26 + review.reviewerScore * 6 + focusBoost + pilotBoost, 0, 96)
  return {
    ...candidate,
    id: `candidate-${index}`,
    novelty,
    reviewerScore: review.reviewerScore,
    reviewerConcern: review.concern,
    finalScore,
    pilotStatus: candidate.pilotHours <= 2 ? 'PAPER PILOT OK' : 'NEEDS MANUAL PILOT',
  }
}

function buildDiscoveryCandidates(ideas, evidence, focus, frontiers) {
  const seedCandidates = ideas.map(candidateFromIdea)
  const candidates = [...seedCandidates, ...buildExtraCandidates(evidence, frontiers)]
  const seen = new Set()
  return candidates
    .filter((candidate) => {
      const key = candidate.title.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((candidate, index) => rankCandidate(candidate, evidence, focus, index))
    .sort((a, b) => b.finalScore - a.finalScore)
}

function buildLandscape(focus, evidence, frontiers, tensions) {
  const rows = [
    {
      title: 'VLA 后训练与数据闭环',
      scope: '失败样本、数据操作、动作接口和部署回流。',
      gap: '缺少从失败类型到补采/合成/重标注的触发器。',
      tags: ['VLA', 'DATA'],
    },
    {
      title: 'WAM / WLA 作为执行前 critic',
      scope: '未来状态预测、语言目标、动作候选和真实成功率。',
      gap: '缺少把 world rollout 分数接到真实控制成功率的评测协议。',
      tags: ['WAM', 'WLA', 'EVAL'],
    },
    {
      title: '跨本体动作接口',
      scope: 'action token、EEF delta、waypoint、action prior 和 router。',
      gap: '缺少同一任务族下动作接口的最小充分表示对照。',
      tags: ['CONTROL', 'VLA'],
    },
    {
      title: '可信每日论文雷达',
      scope: 'P0/P1、已细读、待核、作者自评与第三方复现。',
      gap: '缺少从最新论文到可投稿 idea 的可信度排序机制。',
      tags: ['LATEST', 'EVAL'],
    },
  ]
  return rows
    .map((row) => ({
      ...row,
      active: row.tags.some((tag) => focus.includes(tag)) || row.tags.some((tag) => evidence.some((doc) => doc.tags.includes(tag))),
      evidence: pickEvidence(evidence, row.tags, 2),
      frontier: frontiers.find((item) => row.tags.some((tag) => item.tags.includes(tag))),
      tension: tensions.find((item) => row.tags.some((tag) => item.title.toUpperCase().includes(tag)))?.title,
    }))
    .sort((a, b) => Number(b.active) - Number(a.active))
}

function buildExperimentPlan(top) {
  if (!top) return []
  return [
    {
      block: 'E0 Sanity Pilot',
      goal: top.pilot,
      metric: '方向性信号是否为正,以及失败样例是否集中在假设变量上。',
      budget: top.pilotHours <= 2 ? `${top.pilotHours}h local / no GPU required first` : `${top.pilotHours}h+,先人工确认数据可得性`,
    },
    {
      block: 'E1 Main Ablation',
      goal: '只替换主方法模块,其余数据、基座和评测保持一致。',
      metric: '成功率、样本效率、失败类型分布、可信度标记。',
      budget: '1-2 个小任务或离线重放集。',
    },
    {
      block: 'E2 Negative Control',
      goal: '找一个理论上不该受益的任务/数据切片,防止方法只是过拟合排序规则。',
      metric: '无关切片不应显著提升,否则需要重写机制解释。',
      budget: '复用 E1 数据,只做分层分析。',
    },
  ]
}

function buildDiscoveryReport(seed, pipeline) {
  const ranked = pipeline.ranked.map((item, index) => {
    const sources = item.novelty.closest.slice(0, 2).map((doc) => doc.title).join(' / ')
    return `${index + 1}. ${item.title}
   - Score: ${item.finalScore} | Novelty: ${item.novelty.status} (${item.novelty.score}) | Reviewer: ${item.reviewerScore}/10 | Pilot: ${item.pilotStatus}
   - Motivation: ${item.problemAnchor}
   - Contribution: ${item.oneLiner}
   - Method: ${item.method.join(' ')}
   - Closest local work: ${sources || 'none'}
   - Concern: ${item.reviewerConcern}`
  }).join('\n\n')
  const eliminated = pipeline.eliminated.map((item) => `- ${item.title}: ${item.eliminateReason}`).join('\n')
  const plan = pipeline.experimentPlan.map((item) => `- ${item.block}: ${item.goal} Metric: ${item.metric} Budget: ${item.budget}`).join('\n')
  return `# Idea Discovery Report

Direction: ${seed}
Pipeline: local brief -> site literature landscape -> candidate generation -> local novelty check -> reviewer rubric -> refined proposal
Mode: offline, site corpus only, no external API calls

## Executive Summary
Recommended idea: ${pipeline.top?.title || 'none'}
Reason: highest combined score across local novelty, feasibility, reviewer rubric, and <=2h pilot feasibility.

## Literature Landscape
${pipeline.landscape.map((item) => `- ${item.title}: ${item.gap}`).join('\n')}

## Ranked Ideas
${ranked}

## Eliminated Ideas
${eliminated || '- none'}

## Refined Proposal
Problem anchor: ${pipeline.top?.problemAnchor || ''}
Method thesis: ${pipeline.top?.oneLiner || ''}
Dominant risk: ${pipeline.top?.risk || ''}

## Experiment Plan
${plan}

## Next Steps
- Turn the top idea into a one-page proposal.
- Verify closest work manually before writing claims.
- Run E0 sanity pilot before expanding the method.`
}

function buildDiscoveryPipeline(seed, focus, evidence, tensions, frontiers, ideas) {
  const candidates = buildDiscoveryCandidates(ideas, evidence, focus, frontiers)
  const ranked = candidates.slice(0, 5)
  const eliminated = candidates.slice(5, 8).map((item) => ({
    ...item,
    eliminateReason: item.pilotHours > 2
      ? '超过 2h paper pilot 预算,先标记为 needs manual pilot。'
      : item.novelty.score < 70
        ? '站内近邻过近,需要更清楚 differentiation 后再进入 top list。'
        : '综合分低于 top ideas,暂列备选。',
  }))
  const top = ranked[0]
  const landscape = buildLandscape(focus, evidence, frontiers, tensions)
  const experimentPlan = buildExperimentPlan(top)
  const pipeline = {
    constants: [
      'PILOT_MAX_HOURS = 2',
      'MAX_PILOT_IDEAS = 3',
      'CANONICAL_REPORT = IDEA_REPORT',
      'MODE = offline site corpus',
    ],
    phases: [
      { id: '0', title: 'Load Daily Direction', status: 'DONE', text: '用今日方向 + 站内语料替代外部 research brief。' },
      { id: '1', title: 'Literature Landscape', status: 'DONE', text: '从站内论文、每日论文和前沿信号抽取子方向、缺口和近邻。' },
      { id: '2', title: 'Idea Generation', status: 'DONE', text: `生成 ${candidates.length} 个候选,保留前 ${ranked.length} 个。` },
      { id: '3', title: 'Local Novelty Check', status: 'DONE', text: '用站内 corpus 查 closest work 与 differentiation,不联网调用 API。' },
      { id: '4', title: 'Reviewer Rubric', status: 'DONE', text: '按 novelty、feasibility、clarity、pilot cost 给审稿人式分数。' },
      { id: '4.5', title: 'Refined Proposal', status: 'READY', text: '为 top idea 输出 problem anchor、method thesis 和实验计划。' },
    ],
    landscape,
    candidates,
    ranked,
    eliminated,
    top,
    experimentPlan,
  }
  pipeline.report = buildDiscoveryReport(seed, pipeline)
  return pipeline
}

function runResearch() {
  if (!corpus.value.length) return
  dailyClock.value = Date.now()
  const direction = dailyDirection.value
  const q = dailySeed.value
  const qTokens = tokenize(`${q} ${direction.focus}`)
  const candidates = corpus.value
    .filter(scopeMatch)
    .map((doc) => ({ doc, score: scoreDoc(doc, qTokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  const ranked = (candidates.length ? candidates : corpus.value.filter(scopeMatch).map((doc) => ({ doc, score: 1 }))).slice(0, 12)
  const evidence = ranked.map(({ doc, score }) => ({ ...doc, score, snippet: snippetFor(doc, qTokens) }))
  const focus = buildFocus(evidence)
  const frontiers = buildFrontierMatches(qTokens, focus)
  const tensions = buildTensions(focus, evidence, frontiers)
  const ideas = buildPaperIdeas(q, focus, evidence, tensions, frontiers)
  const discovery = buildDiscoveryPipeline(q, focus, evidence, tensions, frontiers, ideas)
  result.value = {
    seed: q,
    date: todayKey.value,
    daily: direction,
    focus,
    frontiers,
    evidence,
    tensions,
    ideas,
    discovery,
    readingQueue: buildReadingQueue(evidence),
    experiments: buildIdeaMatrix(ideas, focus),
    outline: buildPaperOutline(ideas, tensions),
    nextActions: buildNextActions(ideas),
    prompt: buildPrompt(q, evidence, focus, ideas, frontiers),
  }
  lastRunAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function buildPrompt(q, evidence, focus, ideas, frontiers) {
  const refs = evidence.slice(0, 8).map((doc, idx) => `${idx + 1}. ${doc.title} - ${doc.url}`).join('\n')
  const frontierRefs = frontiers.map((item, idx) => `${idx + 1}. ${item.title} (${item.date}) - ${item.url}`).join('\n')
  const selected = ideas[0]
  return `任务:生成论文 ideas,不是问答,也不是泛泛 research plan。
Idea seed: ${q}
候选主 idea: ${selected?.title || '待选'}
范围标签: ${focus.join(' / ') || '全站'}

最新研究信号:
${frontierRefs || '无'}

站内落盘证据,保留 ⚠️/✅/待核 标记,不要把作者自评写成已证实事实:
${refs}

输出:
1. 3 个 paper ideas,每个包含动机、贡献、方法、验证和风险
2. 每个 idea 至少引用 2 个站内证据 + 1 个最新研究信号
3. 明确 novelty / feasibility / why now,不要只写方向口号
4. 给出最小实验和 ablation,说明能证伪什么
5. 列出需要继续查的一手来源清单`
}

function assetUrl(path) {
  return `${BASE_PATH.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

async function loadCorpus() {
  loading.value = true
  loadError.value = ''
  corpusSource.value = ''
  try {
    let docs = []
    const jsonUrls = [...new Set([assetUrl('autoresearch-corpus.json'), withBase('/autoresearch-corpus.json')])]
    for (const url of jsonUrls) {
      const jsonRes = await fetch(url, { cache: 'no-store' })
      if (!jsonRes.ok) continue
      const contentType = jsonRes.headers.get('content-type') || ''
      if (!contentType.includes('json')) continue
      let payload
      try {
        payload = await jsonRes.json()
      } catch {
        continue
      }
      docs = normalizeDocs(payload.docs || [])
      if (docs.length) {
        corpusSource.value = 'JSON'
        break
      }
    }
    if (!docs.length) {
      const textUrls = [...new Set([assetUrl('llms-full.txt'), withBase('/llms-full.txt')])]
      for (const url of textUrls) {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) continue
        const raw = await res.text()
        if (/^\s*</.test(raw)) continue
        docs = parseCorpus(raw)
        if (docs.length) {
          corpusSource.value = 'FULLTEXT'
          break
        }
      }
    }
    if (!docs.length) {
      docs = await loadMarkdownFallback()
      if (docs.length) corpusSource.value = 'MARKDOWN'
    }
    if (!docs.length) throw new Error('empty corpus')
    corpus.value = docs
    runResearch()
  } catch (err) {
    loadError.value = `语料加载失败:${err.message}`
  } finally {
    loading.value = false
  }
}

watch(mode, () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(runResearch, 420)
})

onMounted(loadCorpus)
</script>

<template>
  <section class="ar-lab">
    <header class="ar-hero">
      <div class="ar-title">
        <span class="ar-kicker">// DAILY IDEA PUSH</span>
        <h1>每日论文 Ideas</h1>
        <p>每天自动从最新论文队列和站内落盘论文中推送 3 个可写成 paper 的 ideas。离线运行,不调用外部 API。</p>
        <div class="ar-stats" aria-label="语料统计">
          <span>{{ corpusStats.all }} 文档</span>
          <span>{{ corpusStats.vla }} VLA</span>
          <span>{{ corpusStats.wam }} WAM</span>
          <span>{{ corpusStats.latest }} 最新</span>
          <span>{{ corpusStats.data }} DATA</span>
        </div>
      </div>
      <div class="ar-daily">
        <span class="ar-kicker">// TODAY'S TRACK</span>
        <h2>{{ todayKey }} · {{ dailyDirection.label }}</h2>
        <p>{{ dailyDirection.focus }}</p>
      </div>

      <aside class="ar-run">
        <div class="ar-mode" role="group" aria-label="发现模式">
          <button
            v-for="item in MODES"
            :key="item.id"
            type="button"
            :class="{ on: mode === item.id }"
            @click="mode = item.id"
          >
            {{ item.label }}
          </button>
        </div>
        <button class="ar-runbtn" type="button" :disabled="loading" @click="runResearch">
          {{ loading ? '加载语料中' : '刷新今日 Ideas' }}
        </button>
        <p class="ar-note">
          <span v-if="loadError">{{ loadError }}</span>
          <span v-else>
            {{ corpusSource ? `语料源 ${corpusSource}。` : '' }}{{ lastRunAt ? `上次生成 ${lastRunAt}` : '' }}
          </span>
        </p>
      </aside>
    </header>

    <section v-if="result" class="ar-output">
      <section v-if="mode === 'deep' && result.discovery" class="ar-panel ar-discovery">
        <div class="ar-panel-head">
          <div>
            <span class="ar-panel__tag">LOCAL IDEA-DISCOVERY PIPELINE</span>
            <h2>今日 Idea Discovery</h2>
          </div>
          <a href="https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep/blob/main/skills/idea-discovery/SKILL.md" target="_blank" rel="noopener">
            skill source
          </a>
        </div>
        <p class="ar-lead">
          参考 idea-discovery 的筛选链路,但改成本地站内语料版:只用已落盘论文、每日论文和内置前沿信号做可解释筛选。
        </p>
        <div class="ar-constants">
          <span v-for="item in result.discovery.constants" :key="item">{{ item }}</span>
        </div>
        <div class="ar-phases">
          <article v-for="phase in result.discovery.phases" :key="phase.id" class="ar-phase">
            <header>
              <span>PHASE {{ phase.id }}</span>
              <b>{{ phase.status }}</b>
            </header>
            <h3>{{ phase.title }}</h3>
            <p>{{ phase.text }}</p>
          </article>
        </div>
      </section>

      <section v-if="mode === 'deep' && result.discovery" class="ar-panel ar-top-idea">
        <div class="ar-top-shell">
          <aside class="ar-score-tower" aria-label="Top idea score">
            <span>TOP IDEA</span>
            <b>{{ result.discovery.top.finalScore }}</b>
            <small>Reviewer {{ result.discovery.top.reviewerScore }}/10</small>
          </aside>
          <div class="ar-top-main">
            <div class="ar-top-head">
              <div>
                <span class="ar-panel__tag">RECOMMENDED PROPOSAL</span>
                <h2>{{ result.discovery.top.title }}</h2>
              </div>
              <div class="ar-chipline">
                <span>{{ result.discovery.top.novelty.status }}</span>
                <span>{{ result.discovery.top.pilotStatus }}</span>
                <span v-for="tag in result.discovery.top.tags" :key="`top-tag-${tag}`">{{ tag }}</span>
              </div>
            </div>
            <p class="ar-thesis">{{ result.discovery.top.oneLiner }}</p>
            <div class="ar-top-columns">
              <section>
                <h3>动机</h3>
                <p>{{ result.discovery.top.problemAnchor }}</p>
              </section>
              <section>
                <h3>方法</h3>
                <ol>
                  <li v-for="item in result.discovery.top.method" :key="`top-method-${item}`">{{ item }}</li>
                </ol>
              </section>
              <section>
                <h3>验证</h3>
                <p>{{ result.discovery.top.pilot }}</p>
                <small>{{ result.discovery.top.reviewerConcern }}</small>
              </section>
            </div>
            <div class="ar-evidence-strip">
              <span>closest local work</span>
              <a v-for="doc in result.discovery.top.novelty.closest" :key="`top-close-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">
                {{ doc.title }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div v-if="mode === 'deep' && result.discovery" class="ar-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">LITERATURE LANDSCAPE</span>
          <div class="ar-landscape">
            <article v-for="item in result.discovery.landscape" :key="item.title" class="ar-mini" :class="{ muted: !item.active }">
              <h3>{{ item.title }}</h3>
              <p>{{ item.scope }}</p>
              <strong>{{ item.gap }}</strong>
              <div class="ar-source-row">
                <a v-for="doc in item.evidence" :key="`${item.title}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a>
              </div>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">CANDIDATE FUNNEL</span>
          <div class="ar-funnel">
            <article
              v-for="item in result.discovery.candidates"
              :key="item.id"
              class="ar-funnel-row"
              :style="{ '--score': `${item.finalScore}%` }"
            >
              <span>{{ item.finalScore }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.novelty.status }} · Reviewer {{ item.reviewerScore }}/10 · {{ item.pilotStatus }}</p>
                <i class="ar-scorebar" aria-hidden="true"></i>
              </div>
            </article>
          </div>
        </section>
      </div>

      <section v-if="mode === 'deep' && result.discovery" class="ar-panel">
        <span class="ar-panel__tag">RANKED IDEAS AFTER LOCAL REVIEW</span>
        <div class="ar-ranked">
          <article v-for="(item, index) in result.discovery.ranked" :key="`rank-${item.id}`" class="ar-rank">
            <header>
              <span>#{{ index + 1 }}</span>
              <span>{{ item.finalScore }}/100</span>
            </header>
            <h3>{{ item.title }}</h3>
            <p>{{ item.oneLiner }}</p>
            <div class="ar-rank-metrics">
              <span>{{ item.novelty.status }}</span>
              <span>Reviewer {{ item.reviewerScore }}/10</span>
              <span>{{ item.pilotStatus }}</span>
            </div>
            <div class="ar-rank-grid">
              <section>
                <h4>Why</h4>
                <p>{{ item.problemAnchor }}</p>
              </section>
              <section>
                <h4>How</h4>
                <ul>
                  <li v-for="method in item.method.slice(0, 2)" :key="`${item.id}-rank-method-${method}`">{{ method }}</li>
                  <li v-if="item.method.length > 2">+{{ item.method.length - 2 }} method step in report</li>
                </ul>
              </section>
              <section>
                <h4>Check</h4>
                <p>{{ item.pilot }}</p>
              </section>
              <section>
                <h4>Risk</h4>
                <p>{{ item.risk }}</p>
              </section>
            </div>
            <div class="ar-source-row ar-source-row--compact">
              <a v-for="doc in item.novelty.closest.slice(0, 2)" :key="`${item.id}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a>
            </div>
          </article>
        </div>
      </section>

      <div v-if="mode === 'deep' && result.discovery" class="ar-grid ar-plan-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">EXPERIMENT PLAN</span>
          <div class="ar-outline">
            <article v-for="item in result.discovery.experimentPlan" :key="item.block">
              <b>{{ item.block }}</b>
              <p>{{ item.goal }}</p>
              <small>{{ item.metric }}</small>
              <small>{{ item.budget }}</small>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">WHY THIS IDEA WINS</span>
          <div class="ar-mini ar-decision">
            <h3>{{ result.discovery.top.title }}</h3>
            <p>{{ result.discovery.top.novelty.differentiation }}</p>
            <strong>{{ result.discovery.top.reviewerConcern }}</strong>
          </div>
        </section>
      </div>

      <section v-if="mode === 'deep' && result.discovery" class="ar-panel">
        <span class="ar-panel__tag">ELIMINATED / BACKUP IDEAS</span>
        <div class="ar-eliminated">
          <article v-for="item in result.discovery.eliminated" :key="`elim-${item.id}`" class="ar-mini">
            <h3>{{ item.title }}</h3>
            <p>{{ item.eliminateReason }}</p>
          </article>
        </div>
      </section>

      <div class="ar-panel ar-brief" :class="{ 'ar-brief--quick': mode === 'quick' }">
        <div class="ar-brief-head">
          <span class="ar-panel__tag">TODAY'S PAPER IDEAS</span>
          <div class="ar-focus">
            <span v-for="tag in result.focus" :key="tag">{{ tag }}</span>
          </div>
        </div>
        <h2 v-if="mode === 'deep'">{{ result.date }} · {{ result.daily.label }}</h2>
        <p v-if="mode === 'deep'" class="ar-daily-summary">{{ result.daily.focus }}</p>
        <div class="ar-ideas">
          <article v-for="(idea, index) in result.ideas" :key="idea.id" class="ar-idea">
            <header>
              <span class="ar-idea-rank">#{{ index + 1 }}</span>
              <span class="ar-idea-tension">{{ idea.tension }}</span>
              <span class="ar-idea-score">N{{ idea.novelty }} / F{{ idea.feasibility }}</span>
            </header>
            <h3>{{ idea.title }}</h3>
            <p>{{ idea.thesis }}</p>
            <div class="ar-why">
              <span>WHY NOW</span>
              <p>{{ idea.whyNow }}</p>
              <a v-if="idea.frontier" :href="idea.frontier.url" target="_blank" rel="noopener">{{ idea.frontier.title }}</a>
            </div>
            <div class="ar-idea-grid">
              <section>
                <h4>动机</h4>
                <p>{{ idea.motivation }}</p>
              </section>
              <section>
                <h4>贡献</h4>
                <ul class="ar-tight-list">
                  <li v-for="item in idea.contributions" :key="`${idea.id}-c-${item}`">{{ item }}</li>
                </ul>
              </section>
              <section>
                <h4>方法</h4>
                <ul class="ar-tight-list">
                  <li v-for="item in idea.method" :key="`${idea.id}-m-${item}`">{{ item }}</li>
                </ul>
              </section>
              <section>
                <h4>验证</h4>
                <p>{{ idea.evaluation }}</p>
              </section>
            </div>
            <div class="ar-source-row">
              <a v-for="doc in idea.sources" :key="`${idea.id}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">
                {{ doc.title }}
              </a>
            </div>
          </article>
        </div>
      </div>

      <div v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">LATEST RESEARCH SIGNALS</span>
        <div class="ar-frontiers">
          <article v-for="item in result.frontiers" :key="item.url" class="ar-frontier">
            <header>
              <span>{{ item.date }}</span>
              <span>{{ item.tags.join(' / ') }}</span>
            </header>
            <h3><a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a></h3>
            <p>{{ item.signal }}</p>
            <strong>{{ item.ideaHook }}</strong>
          </article>
        </div>
      </div>

      <div v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">SITE PAPERS USED</span>
        <div class="ar-evidence">
          <article v-for="doc in result.evidence" :key="doc.id" class="ar-card">
            <header>
              <span>{{ doc.bucket.toUpperCase() }}</span>
              <span>score {{ Math.round(doc.score) }}</span>
            </header>
            <h3><a :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a></h3>
            <p>{{ doc.snippet }}</p>
            <div class="ar-tags">
              <span v-for="tag in doc.tags" :key="`${doc.id}-${tag}`">{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>

      <div v-if="mode === 'deep'" class="ar-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">IDEA GAPS</span>
          <div class="ar-tensions">
            <article v-for="item in result.tensions" :key="item.title" class="ar-mini">
              <h3>{{ item.title }}</h3>
              <p>{{ item.problem }}</p>
              <strong>{{ item.researchMove }}</strong>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">EVALUATION BLUEPRINT</span>
          <div class="ar-matrix">
            <article v-for="row in result.experiments" :key="row.title">
              <span>{{ row.title }}</span>
              <p>{{ row.variable }}</p>
              <small>{{ row.baseline }}</small>
              <p>{{ row.proof }}</p>
              <small>{{ row.check }}</small>
            </article>
          </div>
        </section>
      </div>

      <div v-if="mode === 'deep'" class="ar-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">READING QUEUE</span>
          <ol class="ar-reading">
            <li v-for="doc in result.readingQueue" :key="`read-${doc.id}`">
              <a :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a>
              <span>{{ doc.purpose }}</span>
            </li>
          </ol>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">PAPER SKELETON</span>
          <div class="ar-outline">
            <article v-for="section in result.outline" :key="section.title">
              <b>{{ section.title }}</b>
              <p>{{ section.text }}</p>
            </article>
          </div>
        </section>
      </div>

      <section v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">NEXT IDEA REFINEMENT</span>
        <ol class="ar-list">
          <li v-for="step in result.nextActions" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">COPYABLE IDEA_DISCOVERY REPORT</span>
        <pre>{{ result.discovery.report }}</pre>
      </section>
    </section>
  </section>
</template>

<style scoped>
.ar-lab {
  display: grid;
  gap: 12px;
  margin-top: 10px;
  container-type: inline-size;
}

.ar-lab,
.ar-lab * {
  box-sizing: border-box;
}

.ar-hero,
.ar-panel {
  position: relative;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  border: 1px solid rgba(96, 165, 250, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.14), transparent 40%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.82));
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.ar-hero::before,
.ar-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.12), transparent) 0 0 / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 32%);
}

.ar-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(250px, 0.82fr);
  gap: 8px 12px;
  padding: 12px 14px;
}

.ar-title {
  grid-column: 1 / -1;
}

.ar-hero > *,
.ar-panel > *,
.ar-card,
.ar-idea,
.ar-frontier,
.ar-phase,
.ar-rank,
.ar-stats {
  min-width: 0;
}

.ar-kicker,
.ar-panel__tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #7dd3fc;
  font: 800 0.72rem/1 var(--font-display);
  letter-spacing: 0.08em;
}

.ar-kicker::before,
.ar-panel__tag::before {
  content: '';
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #38bdf8, #f6c667);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
}

.ar-hero h1,
.ar-panel h2 {
  margin: 0 !important;
  color: #f8fafc;
  font-size: clamp(1.35rem, 2.25vw, 2rem);
  line-height: 1.1;
  overflow-wrap: anywhere;
  border-top: 0 !important;
  padding-top: 0 !important;
}

.ar-hero .ar-title h1 {
  font-size: clamp(1.45rem, 1.9vw, 1.72rem) !important;
  line-height: 1.05 !important;
}

.ar-lab h1::before,
.ar-lab h1::after,
.ar-lab h2::before,
.ar-lab h2::after,
.ar-lab h3::before,
.ar-lab h3::after {
  content: none !important;
  display: none !important;
}

.ar-hero p {
  margin: 0;
  color: #aebbd0;
  font-size: 0.82rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.ar-title {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  align-items: baseline;
}

.ar-title p {
  flex: 1 1 250px;
}

.ar-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 0 auto;
}

.ar-stats span {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 3px 6px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.08);
  color: #dbeafe;
  font-size: 0.68rem !important;
  font-weight: 800;
  line-height: 1 !important;
}

.ar-daily {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 12px;
  min-width: 0;
  padding: 7px 9px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 7px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.08), transparent 56%),
    rgba(2, 6, 23, 0.3);
}

.ar-daily h2 {
  margin: 0 !important;
  color: #f8fafc;
  font-size: clamp(0.98rem, 1.35vw, 1.16rem);
  line-height: 1.16;
  border-top: 0 !important;
  padding-top: 0 !important;
}

.ar-daily p,
.ar-daily-summary {
  margin: 0;
  color: #aebbd0;
  font-size: 0.88rem;
  line-height: 1.35;
}

.ar-daily p {
  flex: 1 1 240px;
}

.ar-mode,
.ar-tags,
.ar-focus,
.ar-constants {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-mode button,
.ar-runbtn,
.ar-tags span,
.ar-focus span,
.ar-constants span {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.64);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 800;
}

.ar-mode button {
  flex: 1 1 0;
  padding: 5px 8px;
  line-height: 1.1;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.ar-mode button.on {
  border-color: rgba(125, 211, 252, 0.6);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.22), rgba(45, 212, 191, 0.12));
  color: #e0f2fe;
  box-shadow: inset 0 0 0 1px rgba(125, 211, 252, 0.12), 0 0 18px rgba(14, 165, 233, 0.12);
}

.ar-run {
  display: grid;
  grid-template-columns: minmax(170px, 0.8fr) minmax(130px, 0.5fr) minmax(0, 1fr);
  align-items: center;
  gap: 7px;
}

.ar-runbtn {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(6, 182, 212, 0.95)),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(14, 165, 233, 0.18);
  transition: transform 0.18s ease, filter 0.18s ease;
}

.ar-runbtn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.ar-runbtn:disabled {
  cursor: wait;
  opacity: 0.68;
}

.ar-note {
  margin: 0;
  color: #94a3b8;
  font-size: 0.74rem;
  line-height: 1.25;
  text-align: right;
}

.ar-output {
  display: grid;
  gap: 10px;
}

.ar-panel {
  padding: 14px;
}

.ar-brief-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ar-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.ar-panel-head a {
  flex: none;
  color: #7dd3fc;
  font-size: 0.8rem;
  font-weight: 900;
  text-decoration: none;
}

.ar-lead {
  max-width: 940px;
  margin: 10px 0 0;
  color: #aebbd0;
  line-height: 1.65;
}

.ar-constants {
  margin-top: 12px;
}

.ar-constants span {
  padding: 5px 9px;
  color: #a7f3d0;
}

.ar-top-idea {
  border-color: rgba(246, 198, 103, 0.34);
  background:
    linear-gradient(135deg, rgba(246, 198, 103, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.84));
}

.ar-top-shell {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.ar-score-tower {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 9px;
  min-height: 210px;
  padding: 18px 12px;
  border: 1px solid rgba(246, 198, 103, 0.32);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 20%, rgba(246, 198, 103, 0.22), transparent 42%),
    rgba(2, 6, 23, 0.5);
  text-align: center;
}

.ar-score-tower span,
.ar-score-tower small {
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ar-score-tower b {
  color: #f8fafc;
  font: 900 3.6rem/0.9 var(--font-display);
}

.ar-top-main {
  display: grid;
  gap: 14px;
}

.ar-top-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.ar-top-head h2 {
  margin-bottom: 0;
}

.ar-chipline {
  display: flex;
  flex: 0 1 360px;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.ar-chipline span {
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #dbeafe;
  font-size: 0.72rem;
  font-weight: 900;
}

.ar-thesis {
  margin: 0;
  color: #f8fafc;
  font-size: 1.02rem;
  font-weight: 800;
  line-height: 1.55;
}

.ar-top-columns {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr;
  gap: 10px;
}

.ar-top-columns section {
  min-width: 0;
  padding: 13px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.38);
}

.ar-top-columns h3,
.ar-rank-grid h4 {
  margin: 0 0 7px;
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-top-columns p,
.ar-top-columns small {
  margin: 0;
  color: #aebbd0;
  line-height: 1.6;
}

.ar-top-columns ol {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 18px;
  color: #dbeafe;
  font-size: 0.86rem;
  line-height: 1.55;
}

.ar-evidence-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  padding-top: 2px;
}

.ar-evidence-strip span {
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-evidence-strip a {
  max-width: 100%;
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #7dd3fc;
  font-size: 0.76rem;
  font-weight: 800;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.ar-brief ul,
.ar-list {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding-left: 20px;
  color: #cbd5e1;
  line-height: 1.65;
}

.ar-brief a {
  margin-left: 6px;
  color: #7dd3fc;
  font-size: 0.82rem;
  font-weight: 800;
}

.ar-focus {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
}

.ar-focus span {
  padding: 4px 7px;
  border-color: rgba(246, 198, 103, 0.26);
  background: rgba(246, 198, 103, 0.08);
  color: #f8d78a;
  font-size: 0.68rem;
}

.ar-ideas,
.ar-frontiers,
.ar-phases,
.ar-landscape,
.ar-funnel,
.ar-ranked,
.ar-eliminated,
.ar-tensions,
.ar-matrix,
.ar-outline {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.ar-ideas {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
}

.ar-idea,
.ar-frontier {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 34%),
    linear-gradient(135deg, rgba(20, 184, 166, 0.12), transparent 52%),
    rgba(15, 23, 42, 0.58);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.05);
}

.ar-idea {
  align-content: start;
  border-left: 3px solid rgba(246, 198, 103, 0.74);
}

.ar-brief--quick .ar-ideas {
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 10px;
}

.ar-brief--quick .ar-idea {
  position: relative;
  gap: 7px;
  padding: 10px 11px 10px 12px;
  border-color: rgba(125, 211, 252, 0.18);
  border-left: 0;
  background:
    linear-gradient(90deg, var(--idea-accent, #38bdf8) 0 3px, transparent 3px),
    linear-gradient(135deg, color-mix(in srgb, var(--idea-accent, #38bdf8) 12%, transparent), transparent 48%),
    rgba(15, 23, 42, 0.62);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.ar-brief--quick .ar-idea:nth-child(1) {
  --idea-accent: #f6c667;
}

.ar-brief--quick .ar-idea:nth-child(2) {
  --idea-accent: #38bdf8;
}

.ar-brief--quick .ar-idea:nth-child(3) {
  --idea-accent: #2dd4bf;
}

.ar-brief--quick .ar-idea:hover {
  border-color: color-mix(in srgb, var(--idea-accent, #38bdf8) 42%, rgba(125, 211, 252, 0.2));
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22), inset 0 1px rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

.ar-idea-rank {
  display: inline-grid;
  min-width: 30px;
  height: 20px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 48%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--idea-accent, #38bdf8) 14%, rgba(2, 6, 23, 0.9));
  color: #f8fafc;
  font: 900 0.68rem/1 var(--font-display);
}

.ar-idea-tension {
  flex: 1 1 auto;
  min-width: 0;
  color: #9fb6d4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ar-idea-score {
  color: #f8d78a;
}

.ar-brief--quick .ar-idea > p,
.ar-brief--quick .ar-why p,
.ar-brief--quick .ar-idea-grid p,
.ar-brief--quick .ar-tight-list li {
  display: -webkit-box !important;
  overflow: hidden !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ar-brief--quick .ar-idea > p {
  -webkit-line-clamp: 1;
}

.ar-brief--quick .ar-why,
.ar-brief--quick .ar-source-row {
  display: none;
}

.ar-brief--quick .ar-idea-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.ar-brief--quick .ar-idea-grid section {
  max-height: 88px;
  overflow: hidden;
  padding: 7px 8px;
  border-color: rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 42%),
    rgba(2, 6, 23, 0.32);
}

.ar-brief--quick .ar-idea h3 {
  color: #f8fafc;
  font-size: 0.98rem;
  line-height: 1.25;
}

.ar-brief--quick .ar-idea-grid h4 {
  color: color-mix(in srgb, var(--idea-accent, #38bdf8) 55%, #f8fafc);
  font-size: 0.62rem;
  margin-bottom: 4px;
}

.ar-brief--quick .ar-idea-grid p,
.ar-brief--quick .ar-tight-list {
  font-size: 0.76rem;
  line-height: 1.38;
}

.ar-brief--quick .ar-idea-grid section:nth-child(4),
.ar-brief--quick .ar-tight-list li:nth-child(n + 2) {
  display: none;
}

.ar-frontiers {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
}

.ar-frontier {
  padding: 14px;
  border-color: rgba(45, 212, 191, 0.2);
  background:
    linear-gradient(135deg, rgba(45, 212, 191, 0.12), transparent 42%),
    rgba(2, 6, 23, 0.42);
}

.ar-phases {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
}

.ar-phase {
  padding: 13px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.34);
}

.ar-phase header,
.ar-idea header,
.ar-rank header,
.ar-funnel-row,
.ar-frontier header,
.ar-card header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #7dd3fc;
  font: 800 0.68rem/1 var(--font-display);
  letter-spacing: 0.06em;
}

.ar-phase header b {
  color: #a7f3d0;
}

.ar-phase h3,
.ar-idea h3,
.ar-rank h3,
.ar-funnel-row h3,
.ar-frontier h3,
.ar-mini h3 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.05rem;
  line-height: 1.35;
}

.ar-phase h3 {
  margin-top: 9px;
}

.ar-frontier h3 a {
  color: #f8fafc;
  text-decoration: none;
}

.ar-phase p,
.ar-idea p,
.ar-rank p,
.ar-funnel-row p,
.ar-frontier p,
.ar-mini p,
.ar-matrix p,
.ar-outline p {
  margin: 0;
  color: #aebbd0;
  line-height: 1.6;
}

.ar-landscape .muted {
  opacity: 0.66;
}

.ar-funnel-row {
  align-items: center;
  justify-content: flex-start;
  gap: 11px;
  padding: 11px 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.34);
  letter-spacing: 0;
}

.ar-funnel-row > span {
  display: grid;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(246, 198, 103, 0.28);
  border-radius: 50%;
  color: #f6c667;
  font: 900 0.9rem/1 var(--font-display);
}

.ar-funnel-row h3 {
  font-size: 0.9rem;
}

.ar-funnel-row p {
  margin-top: 4px;
  font-size: 0.78rem;
}

.ar-scorebar {
  display: block;
  width: 100%;
  height: 4px;
  margin-top: 8px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(45, 212, 191, 0.9) var(--score), rgba(30, 41, 59, 0.92) var(--score));
}

.ar-why {
  display: grid;
  gap: 6px;
  padding: 11px 12px;
  border: 1px solid rgba(246, 198, 103, 0.22);
  border-radius: 7px;
  background: rgba(120, 53, 15, 0.12);
}

.ar-why span,
.ar-idea-grid h4,
.ar-frontier strong {
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-why a,
.ar-frontier strong {
  color: #7dd3fc;
  text-decoration: none;
}

.ar-idea-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ar-ranked {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
}

.ar-rank {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 15px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-left: 3px solid rgba(45, 212, 191, 0.72);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.12), transparent 50%),
    rgba(15, 23, 42, 0.52);
}

.ar-rank:first-child {
  border-color: rgba(246, 198, 103, 0.32);
  border-left-color: rgba(246, 198, 103, 0.9);
  background:
    linear-gradient(135deg, rgba(246, 198, 103, 0.12), transparent 44%),
    rgba(15, 23, 42, 0.58);
}

.ar-rank-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-rank-metrics span {
  padding: 4px 7px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.36);
  color: #dbeafe;
  font-size: 0.72rem;
  font-weight: 900;
}

.ar-rank-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.ar-rank-grid section {
  min-width: 0;
  padding: 11px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.34);
}

.ar-rank-grid p,
.ar-rank-grid li {
  color: #aebbd0;
  font-size: 0.84rem;
  line-height: 1.55;
}

.ar-rank-grid p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ar-rank-grid ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 17px;
}

.ar-idea-grid section,
.ar-mini,
.ar-matrix article,
.ar-outline article {
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.36);
}

.ar-idea-grid h4,
.ar-matrix span,
.ar-outline b {
  display: block;
  margin-bottom: 6px;
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-plan-grid {
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
}

.ar-decision {
  border-color: rgba(246, 198, 103, 0.24);
}

.ar-tight-list {
  display: grid;
  gap: 7px;
  margin: 0;
  padding-left: 18px;
  color: #dbeafe;
  font-size: 0.86rem;
  line-height: 1.56;
}

.ar-source-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-source-row a,
.ar-reading a {
  color: #7dd3fc;
  font-weight: 800;
  text-decoration: none;
}

.ar-source-row a {
  max-width: 100%;
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  font-size: 0.76rem;
  overflow-wrap: anywhere;
}

.ar-source-row--compact a {
  padding: 4px 7px;
  font-size: 0.7rem;
}

.ar-mini strong,
.ar-matrix small,
.ar-outline small,
.ar-reading span,
.ar-frontier strong {
  display: block;
  margin-top: 8px;
  color: #dbeafe;
  font-size: 0.82rem;
  line-height: 1.55;
}

.ar-evidence {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 12px;
  margin-top: 14px;
}

.ar-card {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.54);
}

.ar-card h3 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.35;
}

.ar-card h3 a {
  color: #f8fafc;
  text-decoration: none;
}

.ar-card p {
  margin: 0;
  color: #aebbd0;
  font-size: 0.86rem;
  line-height: 1.58;
}

.ar-tags span {
  padding: 4px 7px;
  border-radius: 4px;
  color: #a7f3d0;
}

.ar-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.ar-reading {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding-left: 20px;
}

.ar-reading li {
  color: #cbd5e1;
  line-height: 1.55;
}

.ar-panel pre {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  max-height: 320px;
  overflow: auto;
  margin: 12px 0 0;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 6px;
  background: rgba(2, 6, 23, 0.74);
  color: #dbeafe;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.6;
}

@media (max-width: 860px) {
  .ar-hero,
  .ar-grid {
    grid-template-columns: 1fr;
  }

  .ar-top-shell,
  .ar-top-columns,
  .ar-idea-grid,
  .ar-rank-grid {
    grid-template-columns: 1fr;
  }

  .ar-score-tower {
    min-height: auto;
    grid-template-columns: auto auto auto;
    justify-content: start;
    padding: 14px;
  }

  .ar-score-tower b {
    font-size: 2.1rem;
  }

  .ar-top-head {
    display: grid;
  }

  .ar-chipline {
    justify-content: flex-start;
  }

  .ar-run {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .ar-mode {
    min-width: 0;
  }
}

@container (max-width: 760px) {
  .ar-title p {
    display: none;
  }

  .ar-stats {
    display: none;
  }

  .ar-daily {
    display: none;
  }

  .ar-run {
    grid-template-columns: 1fr;
  }

  .ar-note {
    display: none;
  }

  .ar-mode {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@container (max-width: 520px) {
  .ar-hero {
    grid-template-columns: 1fr;
  }

  .ar-brief--quick .ar-idea-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ar-brief--quick .ar-idea-grid section {
    max-height: 78px;
    padding: 6px;
  }

  .ar-brief--quick .ar-idea-grid p,
  .ar-brief--quick .ar-tight-list li {
    -webkit-line-clamp: 1;
  }
}

@media (max-width: 560px) {
  .ar-hero,
  .ar-panel {
    padding: 12px;
  }

  .ar-hero {
    gap: 10px;
  }

  .ar-title p {
    display: none;
  }

  .ar-stats {
    margin-top: 8px;
  }

  .ar-run {
    grid-template-columns: 1fr;
  }

  .ar-panel-head,
  .ar-rank header,
  .ar-idea header {
    display: grid;
  }

  .ar-brief--quick .ar-idea header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .ar-brief--quick .ar-idea-tension {
    display: none;
  }

  .ar-funnel-row {
    align-items: start;
  }

  .ar-funnel-row > span {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .ar-thesis,
  .ar-top-columns p,
  .ar-top-columns small {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }

  .ar-top-columns li {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ar-rank {
    gap: 10px;
    padding: 13px;
  }

  .ar-rank h3 {
    font-size: 0.98rem;
  }

  .ar-rank-grid section {
    padding: 9px;
  }

  .ar-rank-grid section:nth-child(4) {
    display: none;
  }
}
</style>
