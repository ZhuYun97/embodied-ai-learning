<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const DEFAULT_QUESTION = '结合最新 WLA / WAM / VLA 后训练与站内落盘论文,生成 3 个可写成 paper 的 ideas。'
const BASE_PATH = import.meta.env.BASE_URL || '/'

const PRESETS = [
  '生成 VLA 后训练 + 数据闭环方向的 paper ideas。',
  '生成 WAM / WLA 融合方向的 paper ideas。',
  '围绕跨机器人本体动作表示生成 paper ideas。',
  '从具身数据 scaling 与自动标注中生成 paper ideas。',
  '只从每日最新论文队列里生成 3 个新 idea。',
]

const SCOPES = [
  { id: 'all', label: '全站' },
  { id: 'vla', label: 'VLA' },
  { id: 'wam', label: 'WAM' },
  { id: 'data', label: 'DATA' },
  { id: 'latest', label: '最新论文' },
  { id: 'news', label: 'NEWS' },
  { id: 'ecosystem', label: '生态' },
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

const question = ref(DEFAULT_QUESTION)
const scope = ref('all')
const corpus = ref([])
const loading = ref(true)
const loadError = ref('')
const result = ref(null)
const lastRunAt = ref('')
const corpusSource = ref('')
let timer = 0

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
  if (scope.value === 'all') return true
  if (scope.value === 'data') return doc.tags.includes('DATA')
  if (scope.value === 'latest') return doc.bucket === 'latest' || doc.tags.includes('LATEST') || doc.title.includes('每日最新论文')
  return doc.bucket === scope.value
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

function runResearch() {
  if (!corpus.value.length) return
  const q = question.value.trim() || DEFAULT_QUESTION
  const qTokens = tokenize(q)
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
  result.value = {
    seed: q,
    focus,
    frontiers,
    evidence,
    tensions,
    ideas,
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

function pickPreset(text) {
  question.value = text
  runResearch()
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
      const payload = await jsonRes.json()
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
        docs = parseCorpus(raw)
        if (docs.length) {
          corpusSource.value = 'FULLTEXT'
          break
        }
      }
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

watch([question, scope], () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(runResearch, 420)
})

onMounted(loadCorpus)
</script>

<template>
  <section class="ar-lab">
    <header class="ar-hero">
      <div>
        <span class="ar-kicker">// PAPER IDEA LAB</span>
        <h1>论文 Idea 生成器</h1>
        <p>最新研究信号 + 站内落盘论文 → 动机、贡献、方法、验证方案。离线运行,不调用外部 API。</p>
      </div>
      <div class="ar-stats" aria-label="语料统计">
        <span><b>{{ corpusStats.all }}</b>文档</span>
        <span><b>{{ corpusStats.vla }}</b>VLA</span>
        <span><b>{{ corpusStats.wam }}</b>WAM</span>
        <span><b>{{ corpusStats.latest }}</b>最新</span>
        <span><b>{{ corpusStats.data }}</b>DATA</span>
      </div>
    </header>

    <section class="ar-console">
      <div class="ar-query">
        <label for="ar-question">Idea Seed</label>
        <textarea id="ar-question" v-model="question" rows="4" />
        <div class="ar-presets" aria-label="预设问题">
          <button v-for="item in PRESETS" :key="item" type="button" @click="pickPreset(item)">{{ item }}</button>
        </div>
      </div>

      <aside class="ar-run">
        <div class="ar-scope" role="group" aria-label="语料范围">
          <button
            v-for="item in SCOPES"
            :key="item.id"
            type="button"
            :class="{ on: scope === item.id }"
            @click="scope = item.id"
          >
            {{ item.label }}
          </button>
        </div>
        <button class="ar-runbtn" type="button" :disabled="loading" @click="runResearch">
          {{ loading ? '加载语料中' : '生成论文 Ideas' }}
        </button>
        <p class="ar-note">
          <span v-if="loadError">{{ loadError }}</span>
          <span v-else>
            离线 idea mining,不调用外部 API。{{ corpusSource ? `语料源 ${corpusSource}。` : '' }}{{ lastRunAt ? `上次运行 ${lastRunAt}` : '' }}
          </span>
        </p>
      </aside>
    </section>

    <section v-if="result" class="ar-output">
      <div class="ar-panel ar-brief">
        <span class="ar-panel__tag">PAPER IDEAS</span>
        <h2>{{ result.seed }}</h2>
        <div class="ar-focus">
          <span v-for="tag in result.focus" :key="tag">{{ tag }}</span>
        </div>
        <div class="ar-ideas">
          <article v-for="idea in result.ideas" :key="idea.id" class="ar-idea">
            <header>
              <span>{{ idea.tension }}</span>
              <span>N{{ idea.novelty }} / F{{ idea.feasibility }}</span>
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
                <h4>动机 Motivation</h4>
                <p>{{ idea.motivation }}</p>
              </section>
              <section>
                <h4>贡献 Contributions</h4>
                <ul class="ar-tight-list">
                  <li v-for="item in idea.contributions" :key="`${idea.id}-c-${item}`">{{ item }}</li>
                </ul>
              </section>
              <section>
                <h4>方法 Method</h4>
                <ul class="ar-tight-list">
                  <li v-for="item in idea.method" :key="`${idea.id}-m-${item}`">{{ item }}</li>
                </ul>
              </section>
              <section>
                <h4>验证 Evaluation</h4>
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

      <div class="ar-panel">
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

      <div class="ar-panel">
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

      <div class="ar-grid">
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

      <div class="ar-grid">
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

      <section class="ar-panel">
        <span class="ar-panel__tag">NEXT IDEA REFINEMENT</span>
        <ol class="ar-list">
          <li v-for="step in result.nextActions" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section class="ar-panel">
        <span class="ar-panel__tag">COPYABLE IDEA BRIEF</span>
        <pre>{{ result.prompt }}</pre>
      </section>
    </section>
  </section>
</template>

<style scoped>
.ar-lab {
  display: grid;
  gap: 18px;
  margin-top: 20px;
}

.ar-lab,
.ar-lab * {
  box-sizing: border-box;
}

.ar-hero,
.ar-console,
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
}

.ar-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
  padding: 24px;
}

.ar-hero > *,
.ar-console > *,
.ar-panel > *,
.ar-card,
.ar-idea,
.ar-frontier,
.ar-stats {
  min-width: 0;
}

.ar-kicker,
.ar-panel__tag {
  display: inline-flex;
  color: #7dd3fc;
  font: 800 0.72rem/1 var(--font-display);
  letter-spacing: 0.08em;
}

.ar-hero h1,
.ar-panel h2 {
  margin: 8px 0 8px;
  color: #f8fafc;
  font-size: clamp(1.5rem, 3vw, 2.35rem);
  line-height: 1.1;
  overflow-wrap: anywhere;
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
  max-width: 760px;
  margin: 0;
  color: #aebbd0;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.ar-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(86px, 1fr));
  gap: 8px;
}

.ar-stats span {
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.62);
  color: #aebbd0;
  font-size: 0.78rem;
}

.ar-stats b {
  display: block;
  color: #f8fafc;
  font: 900 1.2rem/1 var(--font-display);
}

.ar-console {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  padding: 18px;
}

.ar-query label {
  display: block;
  margin-bottom: 8px;
  color: #e2e8f0;
  font-weight: 800;
}

.ar-query textarea {
  width: 100%;
  resize: vertical;
  min-height: 128px;
  padding: 14px 15px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 6px;
  background: rgba(2, 6, 23, 0.72);
  color: #f8fafc;
  font: 500 0.95rem/1.6 var(--vp-font-family-base);
  outline: none;
}

.ar-query textarea:focus {
  border-color: rgba(125, 211, 252, 0.62);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.14);
}

.ar-presets,
.ar-scope,
.ar-tags,
.ar-focus {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-presets {
  margin-top: 10px;
}

.ar-presets button,
.ar-scope button,
.ar-runbtn,
.ar-tags span,
.ar-focus span {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.64);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 800;
}

.ar-presets button,
.ar-scope button {
  padding: 7px 10px;
  cursor: pointer;
}

.ar-scope button.on {
  border-color: rgba(125, 211, 252, 0.6);
  background: rgba(14, 165, 233, 0.18);
  color: #e0f2fe;
}

.ar-run {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ar-runbtn {
  width: 100%;
  padding: 12px 14px;
  border-radius: 6px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
  cursor: pointer;
}

.ar-runbtn:disabled {
  cursor: wait;
  opacity: 0.68;
}

.ar-note {
  margin: 0;
  color: #94a3b8;
  font-size: 0.82rem;
  line-height: 1.55;
}

.ar-output {
  display: grid;
  gap: 16px;
}

.ar-panel {
  padding: 18px;
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
  margin: 12px 0 4px;
}

.ar-focus span {
  padding: 5px 8px;
  color: #f6c667;
}

.ar-ideas,
.ar-frontiers,
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

.ar-idea header,
.ar-frontier header,
.ar-card header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #7dd3fc;
  font: 800 0.68rem/1 var(--font-display);
  letter-spacing: 0.06em;
}

.ar-idea h3,
.ar-frontier h3,
.ar-mini h3 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.05rem;
  line-height: 1.35;
}

.ar-frontier h3 a {
  color: #f8fafc;
  text-decoration: none;
}

.ar-idea p,
.ar-frontier p,
.ar-mini p,
.ar-matrix p,
.ar-outline p {
  margin: 0;
  color: #aebbd0;
  line-height: 1.6;
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

.ar-mini strong,
.ar-matrix small,
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
  .ar-console,
  .ar-grid {
    grid-template-columns: 1fr;
  }

  .ar-idea-grid {
    grid-template-columns: 1fr;
  }

  .ar-stats {
    grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
  }
}

@media (max-width: 560px) {
  .ar-hero,
  .ar-console,
  .ar-panel {
    padding: 14px;
  }

  .ar-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
