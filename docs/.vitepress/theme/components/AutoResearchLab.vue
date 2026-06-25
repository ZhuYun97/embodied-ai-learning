<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const DEFAULT_QUESTION = 'VLA 与 WAM 在具身数据闭环、在线后训练和跨本体迁移上还有哪些可研究缺口？'
const BASE_PATH = import.meta.env.BASE_URL || '/'

const PRESETS = [
  'VLA 后训练如何从离线模仿走向在线自适应？',
  'WAM 如何服务具身数据筛选、合成与策略评估？',
  '跨机器人本体动作表示的主要路线和未解问题是什么？',
  '具身数据 scaling 的瓶颈在采集、清洗、标注还是动作编码？',
  '导航 VLA 与导航 WAM 的边界在哪里？',
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

function buildGaps(focus) {
  const gaps = []
  if (focus.includes('DATA')) gaps.push('数据闭环:哪些失败技能应触发补采、合成、过滤或重标注,仍需要更细的可执行判据。')
  if (focus.includes('WAM')) gaps.push('WAM 评估:未来视觉质量、value estimation 与真实策略成功率之间的对应关系仍需站内横向对照。')
  if (focus.includes('VLA')) gaps.push('VLA 后训练:在线自适应、RL fine-tuning 与持续自蒸馏的边界条件需要分任务梳理。')
  if (focus.includes('CONTROL')) gaps.push('动作表示:跨本体 state/action 对齐、EEF delta、waypoint 与 joint/action prior 的接口仍不统一。')
  if (focus.includes('EVAL')) gaps.push('可信度:厂商自评、作者自报和第三方复现实验需要分层标注,避免把指标洗成裸事实。')
  if (!gaps.length) gaps.push('问题定义仍偏宽:先把对象限定到模型范式、数据流程、评测协议或部署约束之一。')
  return gaps.slice(0, 4)
}

function buildPlan(focus, evidence) {
  const first = evidence[0]?.title || '核心细读页'
  const second = evidence[1]?.title || '对照细读页'
  return [
    `证据归档:先读 ${first} 与 ${second},抽取可核事实、⚠️ 自评数字和待核声明。`,
    focus.includes('DATA')
      ? '变量拆解:把数据来源、动作标签、合成/筛选、训练配比和评测指标拆成表格。'
      : '范式拆解:把方法按输入、世界状态、动作接口、训练目标和部署约束拆成表格。',
    focus.includes('EVAL')
      ? '核查路线:优先找第三方基准、项目页、代码/权重状态,把不可复现实验单独标红。'
      : '对照路线:选 2 个相邻范式做差异矩阵,再生成需要补读的论文清单。',
    '产出格式:形成一页 research memo,包含结论、证据链接、反例、下一轮检索关键词。',
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
  const ranked = (candidates.length ? candidates : corpus.value.filter(scopeMatch).map((doc) => ({ doc, score: 1 }))).slice(0, 9)
  const evidence = ranked.map(({ doc, score }) => ({ ...doc, score, snippet: snippetFor(doc, qTokens) }))
  const focus = buildFocus(evidence)
  const claims = dedupeSentences(evidence.map((doc) => ({ text: doc.snippet, source: doc.title, url: doc.url }))).slice(0, 5)
  result.value = {
    question: q,
    focus,
    claims,
    evidence,
    gaps: buildGaps(focus),
    plan: buildPlan(focus, evidence),
    prompt: buildPrompt(q, evidence, focus),
  }
  lastRunAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function buildPrompt(q, evidence, focus) {
  const refs = evidence.slice(0, 6).map((doc, idx) => `${idx + 1}. ${doc.title} - ${doc.url}`).join('\n')
  return `研究问题: ${q}
范围标签: ${focus.join(' / ') || '全站'}

请只基于以下站内证据进行科研综述,保留 ⚠️/✅/待核 标记,不要把作者自评写成已证实事实:
${refs}

输出:
1. 3 条可证据支持的结论
2. 2 条最值得继续查的一手来源
3. 1 个可落地实验或对照表设计
4. 待核声明清单`
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
        <p>站内全文语料 → 自动检索证据 → 研究 brief → 下一步读文献与实验任务。</p>
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
        <label for="ar-question">Research Question</label>
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
          {{ loading ? '加载语料中' : '运行 Autoresearch' }}
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
        <span class="ar-panel__tag">RESEARCH BRIEF</span>
        <h2>{{ result.question }}</h2>
        <div class="ar-focus">
          <span v-for="tag in result.focus" :key="tag">{{ tag }}</span>
        </div>
        <ul>
          <li v-for="claim in result.claims" :key="claim.text">
            {{ claim.text }}
            <a :href="claim.url" target="_blank" rel="noopener">{{ claim.source }}</a>
          </li>
        </ul>
      </div>

      <div class="ar-panel">
        <span class="ar-panel__tag">EVIDENCE STACK</span>
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
          <span class="ar-panel__tag">GAPS</span>
          <ol class="ar-list">
            <li v-for="gap in result.gaps" :key="gap">{{ gap }}</li>
          </ol>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">NEXT ACTIONS</span>
          <ol class="ar-list">
            <li v-for="step in result.plan" :key="step">{{ step }}</li>
          </ol>
        </section>
      </div>

      <section class="ar-panel">
        <span class="ar-panel__tag">COPYABLE RESEARCH TASK</span>
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

.ar-card header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #7dd3fc;
  font: 800 0.68rem/1 var(--font-display);
  letter-spacing: 0.06em;
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
