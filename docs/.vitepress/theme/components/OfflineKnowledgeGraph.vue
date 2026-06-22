<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const graphEl = ref(null)
const graphData = ref(null)
const loading = ref(true)
const error = ref('')
const query = ref('')
const nodeType = ref('all')
const edgeMode = ref('core')
const showSections = ref(false)
const selected = ref(null)
const cytoscapeRef = ref(null)
const cy = ref(null)

const NODE_TYPES = [
  ['all', '全部节点'],
  ['paper', '论文'],
  ['topic', '专题'],
  ['concept', '概念'],
  ['data', '数据'],
  ['benchmark', '基准'],
  ['robot', '本体'],
  ['org', '机构'],
  ['news', '新闻'],
  ['source-paper', 'arXiv'],
]

const EDGE_MODES = [
  ['core', '核心关系'],
  ['evidence', '证据来源'],
  ['all', '全部关系'],
]

const CORE_EDGES = new Set(['taxonomy', 'links-to', 'mentions', 'related', 'cites-paper', 'tagged'])
const EVIDENCE_EDGES = new Set(['cites-domain', 'cites-paper', 'links-to'])
const TYPE_META = {
  home: ['首页', '#f8fafc'],
  index: ['总览', '#93c5fd'],
  page: ['页面', '#93c5fd'],
  paper: ['论文', '#c084fc'],
  topic: ['专题', '#60a5fa'],
  ecosystem: ['生态', '#34d399'],
  'news-page': ['新闻页', '#fbbf24'],
  news: ['新闻', '#f59e0b'],
  section: ['章节', '#64748b'],
  track: ['主线', '#22d3ee'],
  route: ['路线', '#38bdf8'],
  concept: ['概念', '#22d3ee'],
  data: ['数据', '#34d399'],
  benchmark: ['基准', '#f59e0b'],
  robot: ['本体', '#fb7185'],
  org: ['机构', '#a78bfa'],
  'source-domain': ['来源域名', '#94a3b8'],
  'source-paper': ['arXiv', '#e2e8f0'],
  'topic-tag': ['标签', '#facc15'],
}

const stats = computed(() => {
  const g = graphData.value
  if (!g) return null
  const byType = {}
  for (const n of g.nodes) byType[n.type] = (byType[n.type] || 0) + 1
  return {
    nodes: g.nodes.length,
    edges: g.edges.length,
    docs: (byType.paper || 0) + (byType.topic || 0) + (byType.index || 0) + (byType.page || 0),
    entities: ['concept', 'data', 'benchmark', 'robot', 'org'].reduce((sum, k) => sum + (byType[k] || 0), 0),
    sections: byType.section || 0,
    generatedAt: g.meta?.generatedAt,
  }
})

const readout = computed(() => {
  if (!selected.value) return null
  const type = TYPE_META[selected.value.type]?.[0] || selected.value.type
  return {
    ...selected.value,
    typeLabel: type,
    displayUrl: selected.value.url?.replace(/^https?:\/\//, ''),
  }
})

function nodeColor(type) {
  return TYPE_META[type]?.[1] || '#94a3b8'
}

function typeLabel(type) {
  return TYPE_META[type]?.[0] || type
}

function matchesNode(n, q) {
  if (!q) return true
  const hay = [n.label, n.type, n.route, n.track, n.description, n.rel, n.arxivId]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

function edgeAllowed(edge) {
  if (edgeMode.value === 'all') return true
  if (edgeMode.value === 'evidence') return EVIDENCE_EDGES.has(edge.type)
  return CORE_EDGES.has(edge.type)
}

function buildElements() {
  const g = graphData.value
  if (!g) return []
  const q = query.value.trim().toLowerCase()
  const baseIds = new Set()
  const matched = new Set()

  for (const n of g.nodes) {
    if (!showSections.value && n.type === 'section') continue
    if (nodeType.value !== 'all' && n.type !== nodeType.value) continue
    baseIds.add(n.id)
    if (matchesNode(n, q)) matched.add(n.id)
  }

  let visibleIds = baseIds
  if (q) {
    visibleIds = new Set(matched)
    for (const e of g.edges) {
      if (!edgeAllowed(e)) continue
      if (matched.has(e.source) && baseIds.has(e.target)) visibleIds.add(e.target)
      if (matched.has(e.target) && baseIds.has(e.source)) visibleIds.add(e.source)
    }
  }

  const edges = g.edges.filter((e) => edgeAllowed(e) && visibleIds.has(e.source) && visibleIds.has(e.target))
  const connected = new Set()
  for (const e of edges) {
    connected.add(e.source)
    connected.add(e.target)
  }
  for (const id of matched) connected.add(id)

  const nodeElements = g.nodes
    .filter((n) => visibleIds.has(n.id) && (connected.has(n.id) || q || n.type === 'track'))
    .map((n) => ({
      data: {
        ...n,
        typeLabel: typeLabel(n.type),
        color: nodeColor(n.type),
        size: n.size || 30,
      },
    }))

  const edgeElements = edges.map((e) => ({
    data: {
      ...e,
      width: Math.max(1, Math.min(5, e.weight || 1)),
    },
  }))

  return [...nodeElements, ...edgeElements]
}

function layoutGraph() {
  if (!cy.value) return
  const count = cy.value.nodes().length
  const layoutName = count > 420 ? 'cose' : 'fcose'
  cy.value.layout({
    name: layoutName,
    animate: false,
    fit: true,
    padding: 34,
    randomize: false,
    nodeRepulsion: 7400,
    idealEdgeLength: 78,
    edgeElasticity: 0.16,
    gravity: 0.25,
    numIter: 1700,
  }).run()
}

async function renderGraph() {
  if (!cytoscapeRef.value || !graphEl.value || !graphData.value) return
  const elements = buildElements()
  if (!cy.value) {
    cy.value = cytoscapeRef.value({
      container: graphEl.value,
      elements,
      wheelSensitivity: 0.22,
      minZoom: 0.08,
      maxZoom: 2.4,
      style: [
        {
          selector: 'node',
          style: {
            width: 'data(size)',
            height: 'data(size)',
            'background-color': 'data(color)',
            'border-color': 'rgba(255,255,255,0.78)',
            'border-width': 1,
            label: 'data(label)',
            color: '#e5f5ff',
            'font-family': 'Inter, PingFang SC, sans-serif',
            'font-size': 10,
            'min-zoomed-font-size': 6,
            'text-max-width': 104,
            'text-wrap': 'wrap',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 6,
            'text-outline-color': 'rgba(4, 8, 18, 0.84)',
            'text-outline-width': 2,
          },
        },
        {
          selector: 'node[type = "section"]',
          style: { opacity: 0.48, 'font-size': 8 },
        },
        {
          selector: 'node[type = "paper"]',
          style: { shape: 'round-rectangle', 'border-width': 1.6 },
        },
        {
          selector: 'node[type = "concept"], node[type = "data"], node[type = "benchmark"], node[type = "robot"], node[type = "org"]',
          style: { shape: 'hexagon' },
        },
        {
          selector: 'node[type = "route"], node[type = "track"]',
          style: { shape: 'tag', 'font-size': 11, 'border-width': 2 },
        },
        {
          selector: 'edge',
          style: {
            width: 'data(width)',
            'line-color': 'rgba(125, 211, 252, 0.34)',
            'target-arrow-color': 'rgba(125, 211, 252, 0.36)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            opacity: 0.66,
          },
        },
        { selector: 'edge[type = "taxonomy"]', style: { 'line-color': '#38bdf8', opacity: 0.84 } },
        { selector: 'edge[type = "mentions"], edge[type = "section-mentions"]', style: { 'line-color': '#22d3ee', opacity: 0.46 } },
        { selector: 'edge[type = "related"]', style: { 'line-color': '#a78bfa', 'line-style': 'dashed', opacity: 0.52 } },
        { selector: 'edge[type = "links-to"]', style: { 'line-color': '#34d399', opacity: 0.62 } },
        { selector: 'edge[type = "cites-paper"], edge[type = "cites-domain"]', style: { 'line-color': '#f8fafc', opacity: 0.42 } },
        { selector: 'node:selected', style: { 'border-color': '#f8fafc', 'border-width': 4 } },
        { selector: '.faded', style: { opacity: 0.16, 'text-opacity': 0.12 } },
        { selector: '.focused', style: { opacity: 1, 'border-width': 4 } },
      ],
    })
    cy.value.on('tap', 'node', (evt) => {
      const node = evt.target
      selected.value = node.data()
      focusNode(node)
    })
    cy.value.on('tap', (evt) => {
      if (evt.target === cy.value) {
        selected.value = null
        cy.value.elements().removeClass('faded focused')
      }
    })
  } else {
    cy.value.elements().remove()
    cy.value.add(elements)
  }
  await nextTick()
  layoutGraph()
}

function focusNode(node) {
  if (!cy.value) return
  const neighborhood = node.closedNeighborhood()
  cy.value.elements().addClass('faded').removeClass('focused')
  neighborhood.removeClass('faded')
  node.addClass('focused')
}

function resetView() {
  if (!cy.value) return
  selected.value = null
  cy.value.elements().removeClass('faded focused')
  layoutGraph()
}

function openSelected() {
  const url = selected.value?.url
  if (!url || typeof window === 'undefined') return
  window.location.href = /^https?:\/\//.test(url) ? url : withBase(url)
}

onMounted(async () => {
  try {
    const [{ default: cytoscape }, fcoseMod] = await Promise.all([
      import('cytoscape'),
      import('cytoscape-fcose'),
    ])
    const fcose = fcoseMod.default || fcoseMod
    cytoscape.use(fcose)
    cytoscapeRef.value = cytoscape
    const res = await fetch(withBase('/graphs/offline-knowledge-graph.json'))
    if (!res.ok) throw new Error(`graph json ${res.status}`)
    graphData.value = await res.json()
    loading.value = false
    await renderGraph()
  } catch (e) {
    error.value = e.message || String(e)
    loading.value = false
  }
})

onUnmounted(() => {
  if (cy.value) cy.value.destroy()
})

watch([query, nodeType, edgeMode, showSections], () => {
  selected.value = null
  renderGraph()
})
</script>

<template>
  <section class="okg-shell">
    <div class="okg-metrics" v-if="stats">
      <div><b>{{ stats.nodes }}</b><span>节点</span></div>
      <div><b>{{ stats.edges }}</b><span>关系</span></div>
      <div><b>{{ stats.docs }}</b><span>文档</span></div>
      <div><b>{{ stats.entities }}</b><span>实体</span></div>
      <div><b>{{ stats.sections }}</b><span>章节</span></div>
    </div>

    <div class="okg-toolbar">
      <label class="okg-search">
        <span>搜索</span>
        <input v-model="query" type="search" placeholder="Qwen / LIBERO / 世界模型" />
      </label>

      <div class="okg-segment" aria-label="节点类型">
        <button
          v-for="[value, label] in NODE_TYPES"
          :key="value"
          type="button"
          :class="{ on: nodeType === value }"
          @click="nodeType = value"
        >
          {{ label }}
        </button>
      </div>

      <div class="okg-actions">
        <select v-model="edgeMode" aria-label="关系类型">
          <option v-for="[value, label] in EDGE_MODES" :key="value" :value="value">{{ label }}</option>
        </select>
        <label class="okg-check">
          <input v-model="showSections" type="checkbox" />
          <span>章节</span>
        </label>
        <button type="button" class="okg-reset" @click="resetView">重排</button>
      </div>
    </div>

    <div class="okg-stage">
      <div ref="graphEl" class="okg-graph" :class="{ loading: loading || error }">
        <span v-if="loading">加载图谱...</span>
        <span v-else-if="error">图谱加载失败: {{ error }}</span>
      </div>
      <aside class="okg-readout">
        <template v-if="readout">
          <div class="okg-kind">{{ readout.typeLabel }}</div>
          <h3>{{ readout.label }}</h3>
          <p v-if="readout.description">{{ readout.description }}</p>
          <dl>
            <template v-if="readout.track">
              <dt>主线</dt><dd>{{ readout.track }}</dd>
            </template>
            <template v-if="readout.route">
              <dt>路线</dt><dd>{{ readout.route }}</dd>
            </template>
            <template v-if="readout.date">
              <dt>日期</dt><dd>{{ readout.date }}</dd>
            </template>
            <template v-if="readout.degree !== undefined">
              <dt>度数</dt><dd>{{ readout.degree }}</dd>
            </template>
          </dl>
          <button v-if="readout.url" type="button" @click="openSelected">打开节点</button>
        </template>
        <template v-else>
          <div class="okg-kind">Overview</div>
          <h3>离线知识图谱</h3>
          <p>全图来自本站 Markdown、站内链接、论文目录和本地词典抽取。API 调用数为 0。</p>
          <dl v-if="stats">
            <dt>生成时间</dt><dd>{{ stats.generatedAt?.replace('T', ' ').replace(/\.\d+Z$/, ' UTC') }}</dd>
            <dt>默认视图</dt><dd>隐藏章节节点</dd>
          </dl>
        </template>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.okg-shell {
  --okg-border: rgba(148, 163, 184, 0.22);
  --okg-surface: rgba(8, 13, 28, 0.66);
  --okg-text: #dbeafe;
  margin: 28px 0 42px;
}

.okg-metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.okg-metrics div {
  border: 1px solid var(--okg-border);
  background: rgba(15, 23, 42, 0.58);
  padding: 12px;
  min-height: 68px;
}

.okg-metrics b {
  display: block;
  color: #f8fafc;
  font: 700 22px/1.1 "JetBrains Mono", monospace;
}

.okg-metrics span {
  display: block;
  margin-top: 6px;
  color: #9fb7d9;
  font-size: 12px;
}

.okg-toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) minmax(280px, 1.3fr) auto;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--okg-border);
  border-bottom: 0;
  background: rgba(5, 10, 24, 0.78);
  padding: 12px;
}

.okg-search {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  color: #9fb7d9;
  font-size: 12px;
}

.okg-search input,
.okg-actions select {
  width: 100%;
  min-height: 34px;
  border: 1px solid rgba(148, 163, 184, 0.26);
  background: rgba(15, 23, 42, 0.72);
  color: var(--okg-text);
  padding: 0 10px;
  outline: none;
}

.okg-search input:focus,
.okg-actions select:focus {
  border-color: rgba(56, 189, 248, 0.72);
}

.okg-segment {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.okg-segment button,
.okg-reset,
.okg-readout button {
  min-height: 34px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(15, 23, 42, 0.74);
  color: #cbd5e1;
  padding: 0 10px;
  font-size: 12px;
  cursor: pointer;
}

.okg-segment button.on,
.okg-segment button:hover,
.okg-reset:hover,
.okg-readout button:hover {
  border-color: rgba(34, 211, 238, 0.72);
  color: #f8fafc;
  background: rgba(14, 116, 144, 0.34);
}

.okg-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.okg-check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  color: #cbd5e1;
  font-size: 12px;
  white-space: nowrap;
}

.okg-check input {
  accent-color: #22d3ee;
}

.okg-stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  min-height: 720px;
  border: 1px solid var(--okg-border);
  background: var(--okg-surface);
}

.okg-graph {
  position: relative;
  min-height: 720px;
  background:
    linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px),
    radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.14), transparent 38%),
    rgba(4, 8, 18, 0.88);
  background-size: 36px 36px, 36px 36px, auto, auto;
  overflow: hidden;
}

.okg-graph.loading {
  display: grid;
  place-items: center;
  color: #9fb7d9;
  font-size: 13px;
}

.okg-readout {
  border-left: 1px solid var(--okg-border);
  background: rgba(5, 10, 24, 0.72);
  padding: 18px;
  min-width: 0;
}

.okg-kind {
  color: #22d3ee;
  font: 700 11px/1.2 "JetBrains Mono", monospace;
  letter-spacing: 0;
  text-transform: uppercase;
}

.okg-readout h3 {
  margin: 8px 0 10px;
  color: #f8fafc;
  font-size: 18px;
  line-height: 1.28;
}

.okg-readout p {
  margin: 0 0 14px;
  color: #aebfd7;
  font-size: 13px;
  line-height: 1.65;
}

.okg-readout dl {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 8px 10px;
  margin: 14px 0;
  font-size: 12px;
}

.okg-readout dt {
  color: #7dd3fc;
}

.okg-readout dd {
  min-width: 0;
  margin: 0;
  color: #dbeafe;
  overflow-wrap: anywhere;
}

.okg-readout button {
  width: 100%;
  margin-top: 8px;
}

@media (max-width: 960px) {
  .okg-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .okg-toolbar,
  .okg-stage {
    grid-template-columns: 1fr;
  }

  .okg-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .okg-stage,
  .okg-graph {
    min-height: 620px;
  }

  .okg-readout {
    border-left: 0;
    border-top: 1px solid var(--okg-border);
  }
}
</style>
