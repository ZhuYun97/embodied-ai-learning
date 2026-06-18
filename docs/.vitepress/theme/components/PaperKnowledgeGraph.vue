<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as paperData } from '../../data/papers.data.mjs'
import { ROUTE_COLORS } from '../route-colors.mjs'

const W = 1180
const H = 760
const VLA_SET = new Set(['离散 token', '连续 · 扩散/流匹配', '混合 · 连续回归', '分层 · 双系统/推理', '新范式探索'])

const trackFilter = ref('all')
const relationFilter = ref('all')
const routeFilter = ref('all')
const query = ref('')
const activeId = ref('')

const BRIDGES = [
  ['rt1', 'rt2', '离散动作前史'],
  ['rt2', 'openvla', '动作 token 开源化'],
  ['openvla', 'openvla-oft', '离散→连续回归'],
  ['diffusion-policy', 'octo', '扩散策略规模化'],
  ['pi0', 'pi05', 'PI 系列'],
  ['pi05', 'pi06', 'PI 系列'],
  ['pi06', 'pi07', 'PI 系列'],
  ['pi0', 'groot-n1', '流匹配/DiT'],
  ['groot-n1', 'groot-n2', 'NVIDIA VLA→WAM'],
  ['qwen-vla', 'qwen-robotmanip', 'Qwen 操作分支'],
  ['qwen-vla', 'qwen-robotnav', 'Qwen 导航分支'],
  ['qwen-vla', 'qwen-robotworld', 'Qwen 世界模型分支'],
  ['wall-oss', 'wall-oss-05', 'WALL 梯度桥接'],
  ['rynnvla', 'rynnvla-002', 'Rynn VLA→WAM'],
  ['worldvla', 'rynnvla-002', '自回归联合建模'],
  ['uwm', 'x-wam', '耦合扩散改进'],
  ['dreamzero', 'groot-n2', 'WAM 架构延伸'],
  ['dreamzero', 'gigaworld-policy', '零样本策略同族'],
  ['genie-envisioner', 'ge-sim-2', '智元世界模拟'],
  ['go-1', 'genie-envisioner', 'AgiBot 数据生态'],
  ['gr-3', 'gr-dexter', 'Seed 双臂→灵巧手'],
  ['memoryvla', 'memoryvla-plusplus', '记忆→想象'],
  ['steervla', 'steerable-policies', '分层可控策略'],
  ['qwen-robotmanip', 'qwen-robotworld', '数据合成/世界模型'],
]

const IMPORTANT = new Set([
  'rt2', 'openvla', 'pi0', 'pi05', 'pi06', 'pi07', 'groot-n1', 'qwen-vla',
  'qwen-robotmanip', 'qwen-robotnav', 'qwen-robotworld', 'rynnvla', 'rynnvla-002',
  'worldvla', 'dreamzero', 'x-wam', 'groot-n2', 'diffusion-policy', 'octo',
])

const papers = computed(() => paperData.papers || [])
const paperBySlug = computed(() => Object.fromEntries(papers.value.map((p) => [p.slug, p])))
const routeOptions = computed(() => (paperData.routes || []).filter((r) => {
  if (trackFilter.value === 'all') return true
  return trackFilter.value === 'vla' ? VLA_SET.has(r) : !VLA_SET.has(r)
}))

function sideOf(route) {
  return VLA_SET.has(route) ? 'vla' : 'wam'
}

function paperVisible(p) {
  if (trackFilter.value !== 'all' && p.track.toLowerCase() !== trackFilter.value) return false
  if (routeFilter.value !== 'all' && p.route !== routeFilter.value) return false
  return true
}

function geomFor(side) {
  if (trackFilter.value !== 'all') {
    return { trackX: 130, hubX: 132, minX: 210, maxX: 1094 }
  }
  return side === 'vla'
    ? { trackX: 305, hubX: 305, minX: 76, maxX: 542 }
    : { trackX: 875, hubX: 875, minX: 638, maxX: 1112 }
}

function pathBetween(a, b) {
  const mx = (a.x + b.x) / 2
  const bend = Math.abs(a.y - b.y) < 4 ? -26 : 0
  return `M ${a.x} ${a.y} C ${mx} ${a.y + bend} ${mx} ${b.y + bend} ${b.x} ${b.y}`
}

const graph = computed(() => {
  const nodeMap = new Map()
  const edges = []
  const routes = routeOptions.value.filter((r) => routeFilter.value === 'all' || r === routeFilter.value)
  const sides = trackFilter.value === 'all'
    ? ['vla', 'wam']
    : [trackFilter.value]

  for (const side of sides) {
    const trackLabel = side === 'vla' ? 'VLA' : 'WAM'
    const geom = geomFor(side)
    nodeMap.set(`track:${side}`, {
      id: `track:${side}`,
      kind: 'track',
      label: trackLabel,
      detail: side === 'vla' ? '视觉-语言-动作策略' : '世界-行动模型',
      x: geom.trackX,
      y: 52,
      r: 25,
      color: side === 'vla' ? '#38bdf8' : '#c084fc',
      track: trackLabel,
    })
  }

  const groupedRoutes = {
    vla: routes.filter((r) => sideOf(r) === 'vla'),
    wam: routes.filter((r) => sideOf(r) === 'wam'),
  }

  for (const side of Object.keys(groupedRoutes)) {
    const list = groupedRoutes[side]
    if (!list.length) continue
    const geom = geomFor(side)
    const startY = trackFilter.value === 'all' ? (side === 'vla' ? 150 : 128) : 132
    const gap = trackFilter.value === 'all' ? (side === 'vla' ? 112 : 92) : 94
    list.forEach((route, ri) => {
      const routeId = `route:${route}`
      const color = ROUTE_COLORS[route] || '#94a3b8'
      const y = startY + ri * gap
      nodeMap.set(routeId, {
        id: routeId,
        kind: 'route',
        label: route,
        detail: side === 'vla' ? 'VLA 技术路线' : 'WAM 范式路线',
        route,
        x: geom.hubX,
        y,
        r: 17,
        color,
        track: side === 'vla' ? 'VLA' : 'WAM',
      })
      edges.push({ id: `track-${route}`, type: 'track', source: `track:${side}`, target: routeId, label: '路线' })
      const src = (paperData.byRoute?.[route] || []).filter(paperVisible)
      src.forEach((p, pi) => {
        const t = src.length === 1 ? 0.5 : pi / (src.length - 1)
        const x = geom.minX + t * (geom.maxX - geom.minX)
        const wave = src.length > 7 ? (pi % 2 ? 18 : -18) : 0
        const paperId = `paper:${p.slug}`
        nodeMap.set(paperId, {
          ...p,
          id: paperId,
          kind: 'paper',
          label: p.display,
          detail: p.arxivId ? `arXiv:${p.arxivId}` : '日期待核',
          x,
          y: y + wave,
          r: IMPORTANT.has(p.slug) ? 7.5 : 5.8,
          color,
          track: p.track,
        })
        edges.push({ id: `belongs-${p.slug}`, type: 'belongs', source: routeId, target: paperId, label: '归属' })
        if (pi > 0) {
          edges.push({
            id: `lineage-${src[pi - 1].slug}-${p.slug}`,
            type: 'lineage',
            source: `paper:${src[pi - 1].slug}`,
            target: paperId,
            label: '路线演化',
          })
        }
      })
    })
  }

  for (const [from, to, label] of BRIDGES) {
    const a = paperBySlug.value[from]
    const b = paperBySlug.value[to]
    if (!a || !b || !paperVisible(a) || !paperVisible(b)) continue
    const source = `paper:${from}`
    const target = `paper:${to}`
    if (!nodeMap.has(source) || !nodeMap.has(target)) continue
    edges.push({ id: `bridge-${from}-${to}`, type: 'bridge', source, target, label })
  }

  const nodes = [...nodeMap.values()]
  return { nodes, nodeMap, edges }
})

const visibleEdges = computed(() => {
  return graph.value.edges.filter((e) => {
    if (relationFilter.value === 'all') return true
    if (relationFilter.value === 'bridge') return e.type === 'bridge'
    if (relationFilter.value === 'lineage') return e.type === 'lineage'
    if (relationFilter.value === 'belongs') return e.type === 'track' || e.type === 'belongs'
    return true
  })
})

const activeSet = computed(() => {
  if (!activeId.value) return new Set()
  const s = new Set([activeId.value])
  for (const e of visibleEdges.value) {
    if (e.source === activeId.value) s.add(e.target)
    if (e.target === activeId.value) s.add(e.source)
  }
  return s
})

const q = computed(() => query.value.trim().toLowerCase())
function matchesQuery(n) {
  if (!q.value) return true
  return [n.label, n.slug, n.route, n.track, n.arxivId, n.detail]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(q.value))
}

function nodeDim(n) {
  if (activeId.value && !activeSet.value.has(n.id)) return true
  if (q.value && n.kind === 'paper' && !matchesQuery(n)) return true
  return false
}

function edgeDim(e) {
  if (activeId.value && e.source !== activeId.value && e.target !== activeId.value) return true
  if (!q.value) return false
  const a = graph.value.nodeMap.get(e.source)
  const b = graph.value.nodeMap.get(e.target)
  return a?.kind === 'paper' && b?.kind === 'paper' && !matchesQuery(a) && !matchesQuery(b)
}

function showLabel(n) {
  return n.kind !== 'paper' || IMPORTANT.has(n.slug) || activeId.value === n.id || (q.value && matchesQuery(n))
}

const readout = computed(() => {
  const node = activeId.value ? graph.value.nodeMap.get(activeId.value) : null
  if (node) {
    const rel = visibleEdges.value
      .filter((e) => e.source === node.id || e.target === node.id)
      .map((e) => e.label)
      .slice(0, 4)
    return { node, rel }
  }
  const p = graph.value.nodes.filter((n) => n.kind === 'paper').length
  const r = graph.value.nodes.filter((n) => n.kind === 'route').length
  const b = visibleEdges.value.filter((e) => e.type === 'bridge').length
  return { stat: { papers: p, routes: r, bridges: b, edges: visibleEdges.value.length } }
})

function clearRouteIfHidden() {
  if (routeFilter.value !== 'all' && !routeOptions.value.includes(routeFilter.value)) routeFilter.value = 'all'
}
</script>

<template>
  <div class="pkg">
    <div class="pkg-toolbar">
      <div class="seg" role="group" aria-label="论文主线筛选">
        <button :class="{ on: trackFilter === 'all' }" @click="trackFilter = 'all'; routeFilter = 'all'">全部</button>
        <button :class="{ on: trackFilter === 'vla' }" @click="trackFilter = 'vla'; clearRouteIfHidden()">VLA</button>
        <button :class="{ on: trackFilter === 'wam' }" @click="trackFilter = 'wam'; clearRouteIfHidden()">WAM</button>
      </div>
      <select v-model="routeFilter" class="route-select" aria-label="技术路线">
        <option value="all">全部路线</option>
        <option v-for="r in routeOptions" :key="r" :value="r">{{ r }}</option>
      </select>
      <div class="seg seg--relation" role="group" aria-label="关系类型">
        <button :class="{ on: relationFilter === 'all' }" @click="relationFilter = 'all'">全部关系</button>
        <button :class="{ on: relationFilter === 'belongs' }" @click="relationFilter = 'belongs'">路线归属</button>
        <button :class="{ on: relationFilter === 'lineage' }" @click="relationFilter = 'lineage'">路线演化</button>
        <button :class="{ on: relationFilter === 'bridge' }" @click="relationFilter = 'bridge'">跨线桥接</button>
      </div>
      <input v-model="query" class="paper-search" type="search" placeholder="搜索论文 / 路线 / arXiv" aria-label="搜索论文" />
    </div>

    <div class="pkg-stage">
      <svg :viewBox="`0 0 ${W} ${H}`" class="pkg-svg" role="img" aria-label="VLA 与 WAM 论文知识图谱">
        <defs>
          <filter id="pkg-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="pkg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
          </marker>
        </defs>

        <g class="pkg-grid" aria-hidden="true">
          <path v-for="x in 11" :key="'x' + x" :d="`M ${x * 98} 84 V 720`" />
          <path v-for="y in 7" :key="'y' + y" :d="`M 42 ${y * 92 + 46} H 1138`" />
        </g>

        <g class="pkg-edges">
          <path
            v-for="e in visibleEdges"
            :key="e.id"
            :d="pathBetween(graph.nodeMap.get(e.source), graph.nodeMap.get(e.target))"
            :class="['pkg-edge', 'edge-' + e.type, { dim: edgeDim(e), active: activeId && (e.source === activeId || e.target === activeId) }]"
          />
        </g>

        <g class="pkg-nodes">
          <template v-for="n in graph.nodes" :key="n.id">
            <a
              v-if="n.kind === 'paper'"
              :href="withBase(n.link)"
              class="pkg-node-link"
              @mouseenter="activeId = n.id"
              @mouseleave="activeId = ''"
              @focus="activeId = n.id"
              @blur="activeId = ''"
            >
              <g :class="['pkg-node', 'node-' + n.kind, { dim: nodeDim(n), hit: q && matchesQuery(n) }]" :style="{ '--c': n.color }">
                <circle :cx="n.x" :cy="n.y" :r="n.r + 7" class="node-touch" />
                <circle :cx="n.x" :cy="n.y" :r="n.r" class="node-core" />
                <text v-if="showLabel(n)" :x="n.x" :y="n.y + 19" class="node-label">{{ n.label }}</text>
              </g>
            </a>
            <g
              v-else
              :class="['pkg-node', 'node-' + n.kind, { dim: nodeDim(n), selected: n.route && routeFilter === n.route }]"
              :style="{ '--c': n.color }"
              @mouseenter="activeId = n.id"
              @mouseleave="activeId = ''"
              @click="n.kind === 'route' && (routeFilter = n.route)"
            >
              <circle v-if="n.kind === 'track'" :cx="n.x" :cy="n.y" :r="n.r" class="node-hub" />
              <rect v-else :x="n.x - 75" :y="n.y - 17" width="150" height="34" rx="8" class="node-route" />
              <text :x="n.x" :y="n.y + 4" :class="n.kind === 'track' ? 'track-label' : 'route-label'">{{ n.label }}</text>
            </g>
          </template>
        </g>
      </svg>

      <aside class="pkg-readout" aria-live="polite">
        <div class="ro-tag">PAPER READOUT</div>
        <template v-if="readout.node">
          <div class="ro-name">{{ readout.node.label }}</div>
          <div class="ro-meta">
            <span>{{ readout.node.track }}</span>
            <span v-if="readout.node.route">{{ readout.node.route }}</span>
            <span v-if="readout.node.date">{{ readout.node.date }}</span>
          </div>
          <div v-if="readout.node.detail" class="ro-detail">{{ readout.node.detail }}</div>
          <div v-if="readout.rel?.length" class="ro-rel">
            <span v-for="r in readout.rel" :key="r">{{ r }}</span>
          </div>
        </template>
        <template v-else>
          <div class="ro-name">{{ readout.stat.papers }} 篇论文 · {{ readout.stat.routes }} 条路线</div>
          <div class="ro-meta">
            <span>{{ readout.stat.edges }} 条可视关系</span>
            <span>{{ readout.stat.bridges }} 条跨线桥接</span>
          </div>
          <div class="ro-detail">节点来自首页路线卡与细读页档案;点击论文节点进入对应细读。</div>
        </template>
      </aside>
    </div>

    <div class="pkg-legend" aria-label="图例">
      <span><i class="lg lg-track"></i>VLA / WAM 主线</span>
      <span><i class="lg lg-route"></i>技术路线 / 范式</span>
      <span><i class="lg lg-paper"></i>论文细读</span>
      <span><i class="ln ln-belongs"></i>路线归属</span>
      <span><i class="ln ln-lineage"></i>路线演化</span>
      <span><i class="ln ln-bridge"></i>跨线桥接</span>
    </div>
  </div>
</template>

<style scoped>
.pkg {
  margin: 14px 0 28px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 14px;
  background:
    radial-gradient(circle at 24% 10%, rgba(34, 211, 238, 0.13), transparent 32%),
    radial-gradient(circle at 80% 22%, rgba(192, 132, 252, 0.12), transparent 30%),
    #080d19;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.04), 0 16px 42px rgba(8, 13, 28, 0.32);
}
.pkg-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 13px 14px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.14);
  background: rgba(7, 12, 24, 0.78);
}
.seg {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
}
.seg button,
.route-select,
.paper-search {
  font: 700 12px var(--vp-font-family-mono, monospace);
  color: #cbd5e1;
}
.seg button {
  border: 0;
  border-radius: 6px;
  padding: 6px 10px;
  background: transparent;
  cursor: pointer;
}
.seg button.on {
  color: #04111f;
  background: #67e8f9;
}
.route-select,
.paper-search {
  height: 33px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
  padding: 0 10px;
}
.route-select { max-width: 240px; }
.paper-search { min-width: 210px; margin-left: auto; }
.pkg-stage {
  position: relative;
  overflow-x: auto;
}
.pkg-svg {
  display: block;
  min-width: 920px;
  width: 100%;
  height: auto;
}
.pkg-grid path {
  stroke: rgba(148, 163, 184, 0.045);
  stroke-width: 1;
}
.pkg-edge {
  fill: none;
  stroke-width: 1.35;
  stroke: rgba(148, 163, 184, 0.34);
  transition: opacity 0.16s ease, stroke-width 0.16s ease;
}
.edge-track { stroke-dasharray: 5 7; opacity: 0.55; }
.edge-belongs { opacity: 0.28; }
.edge-lineage {
  stroke: rgba(125, 211, 252, 0.52);
  stroke-width: 1.7;
}
.edge-bridge {
  stroke: #f0abfc;
  stroke-width: 2.1;
  stroke-dasharray: 8 5;
}
.pkg-edge.dim { opacity: 0.08; }
.pkg-edge.active { opacity: 1; stroke-width: 3; filter: url(#pkg-glow); }
.pkg-node { cursor: default; transition: opacity 0.16s ease; }
.pkg-node-link { text-decoration: none; }
.pkg-node.dim { opacity: 0.16; }
.node-touch { fill: transparent; }
.node-core {
  fill: #08111f;
  stroke: var(--c);
  stroke-width: 2.4;
}
.node-paper.hit .node-core,
.pkg-node-link:hover .node-core,
.pkg-node-link:focus-visible .node-core {
  fill: color-mix(in srgb, var(--c) 24%, #08111f);
  stroke-width: 4;
  filter: url(#pkg-glow);
}
.node-hub {
  fill: rgba(8, 17, 31, 0.94);
  stroke: var(--c);
  stroke-width: 2.6;
  filter: url(#pkg-glow);
}
.node-route {
  fill: rgba(8, 17, 31, 0.9);
  stroke: color-mix(in srgb, var(--c) 70%, transparent);
  stroke-width: 1.4;
}
.node-route:hover,
.pkg-node.selected .node-route {
  fill: color-mix(in srgb, var(--c) 18%, #08111f);
}
.track-label,
.route-label,
.node-label {
  pointer-events: none;
  text-anchor: middle;
  paint-order: stroke;
  stroke: #080d19;
}
.track-label {
  fill: #f8fafc;
  font: 800 15px var(--vp-font-family-mono, monospace);
  letter-spacing: 0.08em;
  stroke-width: 4px;
}
.route-label {
  fill: #e2e8f0;
  font: 700 11px var(--vp-font-family-mono, monospace);
  stroke-width: 3px;
}
.node-label {
  fill: #cbd5e1;
  font: 700 9.5px var(--vp-font-family-mono, monospace);
  stroke-width: 3px;
}
.pkg-readout {
  position: absolute;
  right: 14px;
  bottom: 14px;
  width: min(320px, calc(100% - 28px));
  padding: 12px 14px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: 10px;
  background: rgba(7, 12, 24, 0.95);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.38);
  font-family: var(--vp-font-family-mono, monospace);
}
.ro-tag {
  color: #67e8f9;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}
.ro-name {
  margin-top: 5px;
  color: #f8fafc;
  font-weight: 800;
  font-size: 15px;
}
.ro-meta,
.ro-rel {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
}
.ro-meta span,
.ro-rel span {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  padding: 2px 7px;
  color: #aab4c5;
  font-size: 11px;
}
.ro-detail {
  margin-top: 8px;
  color: #8a94a6;
  font-size: 12px;
  line-height: 1.55;
}
.pkg-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  padding: 11px 14px 13px;
  border-top: 1px solid rgba(56, 189, 248, 0.14);
  color: #94a3b8;
  font: 700 11px var(--vp-font-family-mono, monospace);
}
.lg,
.ln {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}
.lg { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #67e8f9; }
.lg-route { border-radius: 3px; border-color: #34d399; }
.lg-paper { width: 8px; height: 8px; border-color: #c084fc; }
.ln { width: 22px; height: 0; border-top: 2px solid rgba(148, 163, 184, 0.55); }
.ln-lineage { border-top-color: #7dd3fc; }
.ln-bridge { border-top-color: #f0abfc; border-top-style: dashed; }

@media (max-width: 760px) {
  .pkg-toolbar { align-items: stretch; }
  .seg,
  .route-select,
  .paper-search { width: 100%; }
  .route-select { max-width: none; }
  .seg { justify-content: space-between; }
  .seg button { flex: 1; padding-inline: 7px; }
  .paper-search { margin-left: 0; min-width: 0; }
  .pkg-readout { position: static; margin: 0 12px 12px; width: auto; }
}
</style>
