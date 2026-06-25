<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const DEFAULT_QUESTION = '围绕 VLA / WAM / 具身数据闭环,自动挖掘一个能写成 workshop paper 的研究课题。'
const BASE_PATH = import.meta.env.BASE_URL || '/'

const PRESETS = [
  '自动生成一个 VLA 后训练 + 数据闭环方向的可投稿课题。',
  '从 WAM 细读中挖一个能落地验证的研究假设。',
  '围绕跨机器人本体动作表示,生成实验设计和论文骨架。',
  '把具身数据 scaling 的瓶颈转成 3 个研究选题。',
  '从最新论文队列中发现一个值得补细读和复现实验的方向。',
]

const SCOPES = [
  { id: 'all', label: '全站' },
  { id: 'vla', label: 'VLA' },
  { id: 'wam', label: 'WAM' },
  { id: 'data', label: 'DATA' },
  { id: 'news', label: 'NEWS' },
  { id: 'ecosystem', label: '生态' },
]

const TAG_RULES = [
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
  const stats = { all: corpus.value.length, vla: 0, wam: 0, data: 0, news: 0, ecosystem: 0 }
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
  if (url.includes('/news/')) return 'news'
  if (url.includes('/ecosystem/')) return 'ecosystem'
  if (url.includes('/wam/')) return 'wam'
  if (url.includes('/vla/')) return 'vla'
  if (url.includes('/papers/latest')) return 'news'
  return 'all'
}

function inferTags(title, text, bucket) {
  const hay = `${title} ${text}`.toLowerCase()
  const tags = new Set()
  if (bucket === 'vla') tags.add('VLA')
  if (bucket === 'wam') tags.add('WAM')
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

function buildTensions(focus, evidence) {
  const tensions = []
  if (focus.includes('DATA') || evidence.some((doc) => doc.tags.includes('DATA'))) {
    tensions.push({
      title: '数据闭环缺少触发器',
      problem: '站内材料已经覆盖采集、清洗、筛选和后训练,但还缺少“失败样本何时触发补采/合成/重标注”的可执行判据。',
      researchMove: '把失败类型、动作接口和数据操作绑定成一个 closed-loop data scheduler。',
      sources: pickEvidence(evidence, ['DATA', 'VLA'], 2),
    })
  }
  if (focus.includes('WAM')) {
    tensions.push({
      title: 'WAM 生成质量和策略成功率之间缺桥',
      problem: '世界模型页面强调未来视觉 / value / rollout,但这些信号如何预测真实机器人任务成功率仍不稳定。',
      researchMove: '设计一个 WAM-as-critic 协议,比较视觉一致性、任务进度估计和真实执行成功率。',
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
      problem: '站内多处保留 ⚠️ / 待核 标记,说明作者自评、厂商口径和第三方榜单容易混在一起。',
      researchMove: '把 evidence trust level 纳入论文表格,单独评估“指标可信度”对结论排序的影响。',
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

function buildPrograms(seed, focus, evidence, tensions) {
  const programs = []
  const first = compactTitle(evidence[0]?.title || '站内核心证据')
  const second = compactTitle(evidence[1]?.title || '对照证据')
  if (focus.includes('DATA') || focus.includes('VLA')) {
    programs.push({
      title: '失败驱动的 VLA 数据闭环调度',
      thesis: '把 VLA 后训练从“继续收更多数据”改成“由失败类型自动决定补采、合成、过滤或重标注”。',
      hypothesis: '如果补数据动作由失败 primitive / action-interface mismatch 触发,同等数据预算下会比均匀扩数据更稳定。',
      method: '抽取站内 VLA 后训练、具身数据处理、动作接口材料,构建失败类型到数据操作的规则表。',
      experiment: '在 2-3 个操作任务上比较 uniform replay、hard-example mining、failure-triggered data scheduler。',
      metric: '任务成功率、失败复现率、每提升 1% 成功率所需新增样本量。',
      novelty: focus.includes('DATA') ? 86 : 74,
      feasibility: 78,
      sources: pickEvidence(evidence, ['DATA', 'VLA', 'CONTROL'], 3),
    })
  }
  if (focus.includes('WAM') || focus.includes('EVAL')) {
    programs.push({
      title: 'WAM-as-Critic:用世界模型预测策略是否值得执行',
      thesis: '把 WAM 从“生成未来视频”推进到“给 VLA 候选动作打风险分”。',
      hypothesis: '未来视觉一致性 + 任务进度估计的组合分数,能比单纯语言置信度更早发现不可执行动作。',
      method: '从 WAM 细读中拆出未来预测、value estimation、导航/操作 rollout 三类信号。',
      experiment: '给同一批 VLA 候选轨迹生成 WAM rollout,比较 critic score 与真实执行结果的相关性。',
      metric: 'AUROC、失败提前预警率、误杀可执行动作比例。',
      novelty: focus.includes('WAM') ? 88 : 76,
      feasibility: 70,
      sources: pickEvidence(evidence, ['WAM', 'EVAL', 'VLA'], 3),
    })
  }
  if (focus.includes('CONTROL') || focus.includes('VLA')) {
    programs.push({
      title: '跨本体动作接口的最小充分表示',
      thesis: '把 action token、EEF delta、waypoint 和 action prior 放到同一任务族里做接口层对照。',
      hypothesis: '跨本体迁移的关键不是动作维度越细越好,而是中间表示能否保留 task progress 与接触状态。',
      method: '抽取站内 action prior / trajectory / waypoint / 运控基础材料,整理成统一变量表。',
      experiment: '同一 demonstration 条件下替换动作接口,测少样本适配、失败类型和延迟。',
      metric: '跨本体成功率、样本效率、动作平滑度、接触状态错误率。',
      novelty: focus.includes('CONTROL') ? 84 : 73,
      feasibility: 74,
      sources: pickEvidence(evidence, ['CONTROL', 'VLA', 'DATA'], 3),
    })
  }
  if (programs.length < 3) {
    programs.push({
      title: '站内证据可信度对研究结论的影响',
      thesis: '把 ⚠️ 自评、待核、第三方验证作为研究变量,重新排序现有 VLA/WAM 结论。',
      hypothesis: '当自评指标降权后,论文谱系中的“强模型/强路线”排序会明显变化。',
      method: '读取站内可信度标记,为每条 evidence 加 trust weight。',
      experiment: '比较原始排序、可信度加权排序和只保留一手/第三方证据的排序差异。',
      metric: '排序 Kendall tau、结论变化率、待核声明占比。',
      novelty: 68,
      feasibility: 90,
      sources: pickEvidence(evidence, ['EVAL', 'NEWS', 'VLA', 'WAM'], 3),
    })
  }
  return programs.slice(0, 3).map((program, index) => ({
    ...program,
    id: `program-${index}`,
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

function buildExperimentMatrix(programs, focus) {
  const lead = programs[0]
  return [
    {
      axis: '变量',
      design: focus.includes('DATA') ? '失败类型 × 数据操作 × 动作接口' : '模型路线 × 训练目标 × 评测协议',
      check: '把每个变量限制为可在表格里打勾/量化的字段。',
    },
    {
      axis: '基线',
      design: '原始 VLA / WAM 方法 + 站内相邻路线各 1 个',
      check: '基线必须能找到代码、权重、数据或至少清晰复现实验口径。',
    },
    {
      axis: '干预',
      design: lead ? lead.experiment : '替换一个关键模块,其余训练/评测条件保持不变。',
      check: '每次只改变一个研究变量,避免把数据、模型和评测一起改。',
    },
    {
      axis: '指标',
      design: lead ? lead.metric : '成功率、样本效率、失败类型、可信度标记。',
      check: '自评指标单独标 ⚠️,第三方或可复现实验单独标 ✅。',
    },
  ]
}

function buildPaperOutline(programs, tensions) {
  const lead = programs[0]
  return [
    { title: '1. Problem', text: lead ? lead.thesis : '定义站内证据暴露出的核心研究问题。' },
    { title: '2. Evidence Map', text: `把 ${tensions.map((item) => item.title).join(' / ')} 转成可引用证据链。` },
    { title: '3. Method', text: lead ? lead.method : '提出最小可实现方法,避免泛泛综述。' },
    { title: '4. Experiments', text: lead ? lead.experiment : '做 ablation + 可信度分层。' },
    { title: '5. Failure Analysis', text: '按失败类型、数据来源、动作接口和评测可信度回填结论。' },
  ]
}

function buildSprint(programs) {
  const lead = programs[0]?.title || '候选课题'
  return [
    `Day 1:锁定主课题「${lead}」,只保留 6 篇核心证据。`,
    'Day 2:把方法变量、数据变量、评测变量拆成一张对照表。',
    'Day 3:找最小复现实验或 toy benchmark,写出 baseline 命令/伪代码。',
    'Day 4:跑第一版 sanity check,记录失败样例而不是只看平均分。',
    'Day 5:补一轮反例和相关工作,删掉不可验证 claim。',
    'Day 6:写 4 页 workshop paper skeleton。',
    'Day 7:根据 evidence trust level 重排结论,形成投稿版 research memo。',
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
  const tensions = buildTensions(focus, evidence)
  const programs = buildPrograms(q, focus, evidence, tensions)
  result.value = {
    seed: q,
    focus,
    evidence,
    tensions,
    programs,
    readingQueue: buildReadingQueue(evidence),
    experiments: buildExperimentMatrix(programs, focus),
    outline: buildPaperOutline(programs, tensions),
    sprint: buildSprint(programs),
    prompt: buildPrompt(q, evidence, focus, programs),
  }
  lastRunAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function buildPrompt(q, evidence, focus, programs) {
  const refs = evidence.slice(0, 8).map((doc, idx) => `${idx + 1}. ${doc.title} - ${doc.url}`).join('\n')
  const selected = programs[0]
  return `任务:基于站内材料执行一次离线 autoresearch,不是问答。
Research seed: ${q}
候选主课题: ${selected?.title || '待选'}
范围标签: ${focus.join(' / ') || '全站'}

只允许使用以下站内证据,保留 ⚠️/✅/待核 标记,不要把作者自评写成已证实事实:
${refs}

输出:
1. 一个可投稿 research problem,说明 novelty 和 why now
2. 一个可证伪 hypothesis
3. 最小方法设计和 ablation 表
4. 实验变量、基线、指标、失败分析协议
5. 论文大纲和 7 天执行计划
6. 需要继续查的一手来源清单`
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
        <span class="ar-kicker">// AUTORESEARCH</span>
        <h1>Autoresearch 工作台</h1>
        <p>站内语料 → 证据张力挖掘 → 候选课题 → 假设与实验矩阵 → 论文骨架。</p>
      </div>
      <div class="ar-stats" aria-label="语料统计">
        <span><b>{{ corpusStats.all }}</b>文档</span>
        <span><b>{{ corpusStats.vla }}</b>VLA</span>
        <span><b>{{ corpusStats.wam }}</b>WAM</span>
        <span><b>{{ corpusStats.data }}</b>DATA</span>
      </div>
    </header>

    <section class="ar-console">
      <div class="ar-query">
        <label for="ar-question">Research Seed</label>
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
          {{ loading ? '加载语料中' : '生成研究计划' }}
        </button>
        <p class="ar-note">
          <span v-if="loadError">{{ loadError }}</span>
          <span v-else>
            离线抽取式研究,不调用外部 API。{{ corpusSource ? `语料源 ${corpusSource}。` : '' }}{{ lastRunAt ? `上次运行 ${lastRunAt}` : '' }}
          </span>
        </p>
      </aside>
    </section>

    <section v-if="result" class="ar-output">
      <div class="ar-panel ar-brief">
        <span class="ar-panel__tag">AUTO RESEARCH PROGRAM</span>
        <h2>{{ result.seed }}</h2>
        <div class="ar-focus">
          <span v-for="tag in result.focus" :key="tag">{{ tag }}</span>
        </div>
        <div class="ar-programs">
          <article v-for="program in result.programs" :key="program.id" class="ar-program">
            <header>
              <span>{{ program.tension }}</span>
              <span>N{{ program.novelty }} / F{{ program.feasibility }}</span>
            </header>
            <h3>{{ program.title }}</h3>
            <p>{{ program.thesis }}</p>
            <dl>
              <div>
                <dt>Hypothesis</dt>
                <dd>{{ program.hypothesis }}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{{ program.method }}</dd>
              </div>
              <div>
                <dt>Experiment</dt>
                <dd>{{ program.experiment }}</dd>
              </div>
            </dl>
            <div class="ar-source-row">
              <a v-for="doc in program.sources" :key="`${program.id}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">
                {{ doc.title }}
              </a>
            </div>
          </article>
        </div>
      </div>

      <div class="ar-panel">
        <span class="ar-panel__tag">CORPUS SIGNALS</span>
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
          <span class="ar-panel__tag">EVIDENCE TENSIONS</span>
          <div class="ar-tensions">
            <article v-for="item in result.tensions" :key="item.title" class="ar-mini">
              <h3>{{ item.title }}</h3>
              <p>{{ item.problem }}</p>
              <strong>{{ item.researchMove }}</strong>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">EXPERIMENT MATRIX</span>
          <div class="ar-matrix">
            <article v-for="row in result.experiments" :key="row.axis">
              <span>{{ row.axis }}</span>
              <p>{{ row.design }}</p>
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
        <span class="ar-panel__tag">7-DAY RESEARCH SPRINT</span>
        <ol class="ar-list">
          <li v-for="step in result.sprint" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section class="ar-panel">
        <span class="ar-panel__tag">COPYABLE AUTORESEARCH TASK</span>
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
.ar-program,
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
  grid-template-columns: repeat(2, minmax(88px, 1fr));
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

.ar-programs,
.ar-tensions,
.ar-matrix,
.ar-outline {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.ar-program {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.12), transparent 46%),
    rgba(15, 23, 42, 0.58);
}

.ar-program header,
.ar-card header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #7dd3fc;
  font: 800 0.68rem/1 var(--font-display);
  letter-spacing: 0.06em;
}

.ar-program h3,
.ar-mini h3 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.05rem;
  line-height: 1.35;
}

.ar-program p,
.ar-mini p,
.ar-matrix p,
.ar-outline p {
  margin: 0;
  color: #aebbd0;
  line-height: 1.6;
}

.ar-program dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}

.ar-program dl > div,
.ar-mini,
.ar-matrix article,
.ar-outline article {
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.36);
}

.ar-program dt,
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

.ar-program dd {
  margin: 0;
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
.ar-reading span {
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

  .ar-program dl {
    grid-template-columns: 1fr;
  }

  .ar-stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
