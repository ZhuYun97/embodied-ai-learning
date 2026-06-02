<template>
  <div class="kg-wrap" ref="wrapEl">
    <div class="kg-legend">
      <div class="lg-row">
        <span class="lg-item"><i class="dot dot-cn"></i>国内公司</span>
        <span class="lg-item"><i class="dot dot-intl"></i>国际公司</span>
        <span class="lg-item"><i class="dot dot-conn"></i>投资方/机构</span>
      </div>
      <div class="lg-row">
        <span class="lg-item"><i class="ln ln-invest"></i>投资</span>
        <span class="lg-item"><i class="ln ln-partner"></i>合作</span>
        <span class="lg-item"><i class="ln ln-own"></i>控股/孵化</span>
      </div>
    </div>
    <div class="kg-hint">拖拽平移 · 滚轮缩放 · 悬停高亮关联 · 点击访问官网</div>

    <svg
      ref="svgEl"
      class="kg-svg"
      :viewBox="`0 0 ${W} ${H}`"
      @wheel.prevent="onWheel"
      @pointerdown="onBgDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointerleave="onUp"
    >
      <defs>
        <radialGradient id="kg-core" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stop-color="#dbeafe" />
          <stop offset="32%" stop-color="#60a5fa" />
          <stop offset="66%" stop-color="#7c3aed" />
          <stop offset="100%" stop-color="#1e1b4b" />
        </radialGradient>
        <radialGradient id="kg-cn" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stop-color="#f0abfc" /><stop offset="52%" stop-color="#c026d3" /><stop offset="100%" stop-color="#701a75" />
        </radialGradient>
        <radialGradient id="kg-intl" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stop-color="#a5f3fc" /><stop offset="52%" stop-color="#22d3ee" /><stop offset="100%" stop-color="#155e75" />
        </radialGradient>
        <radialGradient id="kg-conn" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stop-color="#fde68a" /><stop offset="52%" stop-color="#f59e0b" /><stop offset="100%" stop-color="#92400e" />
        </radialGradient>
        <filter id="kg-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="kg-glow-strong" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="kg-edge-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`" :class="{ 'is-hovering': hoverId }">
        <!-- 背景轨道环 -->
        <g class="orbits">
          <circle v-for="(r, i) in orbitRings" :key="'o' + i" :cx="CX" :cy="CY" :r="r" class="orbit" />
        </g>

        <!-- 核心 → hub 辐射骨架 -->
        <g class="spokes">
          <line v-for="h in hubs" :key="'s' + h.id" :x1="CX" :y1="CY" :x2="h.x" :y2="h.y" class="spoke" />
        </g>

        <!-- 关系边(发光) -->
        <g class="edges" filter="url(#kg-edge-glow)">
          <path
            v-for="(e, i) in edges"
            :key="'e' + i"
            :d="edgePath(e)"
            :class="['edge', `edge-${e.type}`, { dim: hoverId && !edgeActive(e), active: edgeActive(e) }]"
          />
        </g>

        <!-- 中心核(装饰) -->
        <circle :cx="CX" :cy="CY" :r="86" class="core-halo" />
        <circle :cx="CX" :cy="CY" :r="46" class="core" />
        <text :x="CX" :y="CY" class="core-label" dy="0.34em">具身智能</text>

        <!-- 节点 -->
        <g
          v-for="n in nodes"
          :key="n.id"
          :class="['node', `node-${n.kind}`, { dim: hoverId && !nodeActive(n.id), focus: hoverId === n.id, clickable: !!n.website }]"
          @pointerenter="hoverId = n.id"
          @pointerleave="hoverId = null"
          @click="onNodeClick(n)"
        >
          <circle :cx="n.x" :cy="n.y" :r="n.r" class="node-orb" />
          <text :x="n.x" :y="n.y" class="node-initial" dy="0.34em" :style="{ fontSize: n.r > 13 ? '12px' : '10px' }">{{ n.initial }}</text>
          <text :x="n.lx" :y="n.ly" :text-anchor="n.anchor" class="node-label" dy="0.32em">{{ n.label }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import data from '../../../ecosystem/companies-data.json'

const W = 1040, H = 940
const CX = W / 2, CY = H / 2 + 6
const Rh = 232          // hub 内环
const Rl = 388          // leaf 外环
const orbitRings = [120, 232, 320, 388, 430]

const svgEl = ref(null)
const wrapEl = ref(null)
const zoom = ref(1)
const pan = reactive({ x: 0, y: 0 })
const hoverId = ref(null)

function initialOf(name) {
  if (!name) return '?'
  const c = name.trim().replace(/[《》"'（(]/g, '')[0] || name.trim()[0]
  return /[一-鿿]/.test(c) ? c : c.toUpperCase()
}

// ===== 数据 → 径向布局 =====
const rels = data.relationships || []
const linked = new Set()
rels.forEach((r) => { linked.add(r.source); linked.add(r.target) })

const companies = (data.companies || []).filter((c) => linked.has(c.id))
const connectors = (data.connectors || []).filter((c) => linked.has(c.id))

const deg = {}
;[...companies, ...connectors].forEach((n) => (deg[n.id] = 0))
rels.forEach((r) => { if (deg[r.source] != null) deg[r.source]++; if (deg[r.target] != null) deg[r.target]++ })

const adj = {}
;[...companies, ...connectors].forEach((n) => (adj[n.id] = []))
rels.forEach((r) => { if (adj[r.source] && adj[r.target]) { adj[r.source].push(r.target); adj[r.target].push(r.source) } })

// hub = 有 ≥2 关系的投资方/机构(生态枢纽);其余皆为叶子
const hubList = connectors.filter((c) => (deg[c.id] || 0) >= 2)
const hubIds = new Set(hubList.map((h) => h.id))
const leafList = [...companies, ...connectors.filter((c) => !hubIds.has(c.id))]

const pickHub = (id) => {
  let best = null, bd = -1
  for (const nb of adj[id]) if (hubIds.has(nb) && (deg[nb] || 0) > bd) { bd = deg[nb]; best = nb }
  return best
}
const childrenOf = {}
hubList.forEach((h) => (childrenOf[h.id] = []))
const orphans = []
for (const lf of leafList) { const h = pickHub(lf.id); if (h) childrenOf[h].push(lf); else orphans.push(lf) }

const kindOf = (n) => (hubIds.has(n.id) || connectors.some((c) => c.id === n.id) ? (companies.some((c) => c.id === n.id) ? null : 'conn') : null)
const isCompany = (id) => companies.some((c) => c.id === id)
const regionKind = (n) => (isCompany(n.id) ? (n.region === 'china' ? 'cn' : 'intl') : 'conn')
const hubR = (h) => 15 + Math.min(8, (deg[h.id] || 0) * 1.4)
const leafR = (n) => (isCompany(n.id) ? 9 + Math.min(8, Math.sqrt((n.fundingAmount || 0) / 1e8) * 2.1) : 11)

const pos = {}
const Hn = Math.max(1, hubList.length)
// hub:按子节点数降序,均匀铺在内环(多子的分散开)
hubList.sort((a, b) => childrenOf[b.id].length - childrenOf[a.id].length)
hubList.forEach((h, i) => {
  const ang = (i / Hn) * Math.PI * 2 - Math.PI / 2
  pos[h.id] = { x: CX + Math.cos(ang) * Rh, y: CY + Math.sin(ang) * Rh, ang, r: hubR(h) }
})
const sector = (Math.PI * 2 / Hn) * 0.94
hubList.forEach((h) => {
  const base = pos[h.id].ang
  const kids = childrenOf[h.id]
  const m = kids.length
  kids.forEach((c, k) => {
    const t = m === 1 ? 0 : k / (m - 1) - 0.5
    const ang = base + t * sector
    const rr = Rl + (k % 2 === 0 ? -24 : 22)
    pos[c.id] = { x: CX + Math.cos(ang) * rr, y: CY + Math.sin(ang) * rr, ang, r: leafR(c) }
  })
})
orphans.forEach((c, k) => {
  const ang = (k / Math.max(1, orphans.length)) * Math.PI * 2 + 0.2
  pos[c.id] = { x: CX + Math.cos(ang) * (Rl + 44), y: CY + Math.sin(ang) * (Rl + 44), ang, r: leafR(c) }
})

const allRaw = [...hubList, ...leafList]
const nodes = reactive(allRaw.filter((n) => pos[n.id]).map((n) => {
  const p = pos[n.id]
  const out = p.r + 7
  const lx = p.x + Math.cos(p.ang) * out
  const ly = p.y + Math.sin(p.ang) * out
  return {
    id: n.id, label: n.name, initial: initialOf(n.name),
    kind: regionKind(n), r: p.r, website: n.website || null,
    x: p.x, y: p.y, ang: p.ang, lx, ly,
    anchor: Math.cos(p.ang) >= 0 ? 'start' : 'end',
  }
}))
const hubs = nodes.filter((n) => hubIds.has(n.id))

const nodeMap = computed(() => Object.fromEntries(nodes.map((n) => [n.id, n])))
const validIds = new Set(nodes.map((n) => n.id))
const edges = rels.filter((e) => validIds.has(e.source) && validIds.has(e.target))

const nbset = {}
nodes.forEach((n) => (nbset[n.id] = new Set([n.id])))
edges.forEach((e) => { nbset[e.source].add(e.target); nbset[e.target].add(e.source) })
const nodeActive = (id) => hoverId.value && nbset[hoverId.value]?.has(id)
const edgeActive = (e) => hoverId.value && (e.source === hoverId.value || e.target === hoverId.value)

function edgePath(e) {
  const a = nodeMap.value[e.source], b = nodeMap.value[e.target]
  const dx = b.x - a.x, dy = b.y - a.y
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const nx = -dy / dist, ny = dx / dist
  const off = dist * 0.12
  return `M ${a.x} ${a.y} Q ${mx + nx * off} ${my + ny * off} ${b.x} ${b.y}`
}

// ===== 平移 / 缩放 / 点击 =====
let panning = false, sx = 0, sy = 0, px = 0, py = 0
function onBgDown(evt) {
  if (evt.target.closest('.node')) return
  panning = true; sx = evt.clientX; sy = evt.clientY; px = pan.x; py = pan.y
  svgEl.value.setPointerCapture?.(evt.pointerId)
}
function onMove(evt) {
  if (!panning) return
  const rect = svgEl.value.getBoundingClientRect()
  const k = W / rect.width
  pan.x = px + (evt.clientX - sx) * k
  pan.y = py + (evt.clientY - sy) * k
}
function onUp() { panning = false }
function onWheel(evt) {
  const f = evt.deltaY < 0 ? 1.1 : 0.9
  zoom.value = Math.max(0.45, Math.min(2.6, zoom.value * f))
}
function onNodeClick(n) { if (n.website) window.open(n.website, '_blank', 'noopener') }
</script>

<style scoped>
/* 舞台:近黑深空 + 星云 + 星点(对标知识图谱大屏) */
.kg-wrap {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 50% 42% at 50% 49%, rgba(124, 58, 237, 0.22), transparent 70%),
    radial-gradient(ellipse 80% 70% at 50% 49%, rgba(37, 99, 235, 0.16), transparent 72%),
    radial-gradient(ellipse 120% 100% at 50% 45%, #0a0e22 0%, #05060f 55%, #020308 100%);
  border: 1px solid rgba(96, 130, 220, 0.2);
  box-shadow: inset 0 0 90px rgba(40, 60, 160, 0.16), 0 18px 50px -18px rgba(8, 12, 40, 0.7);
}
.kg-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(rgba(190, 210, 255, 0.18) 1px, transparent 1.4px),
    radial-gradient(rgba(150, 170, 230, 0.10) 1px, transparent 1.2px);
  background-size: 34px 34px, 19px 19px;
  background-position: 0 0, 11px 15px;
  -webkit-mask-image: radial-gradient(ellipse 86% 80% at 50% 48%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 86% 80% at 50% 48%, #000 40%, transparent 100%);
}
.kg-svg {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  touch-action: none;
  cursor: grab;
}
.kg-svg:active { cursor: grabbing; }

/* 轨道环 */
.orbit { fill: none; stroke: rgba(120, 150, 230, 0.12); stroke-width: 1; }

/* 核心 → hub 辐射线 */
.spoke { stroke: rgba(130, 170, 255, 0.16); stroke-width: 1; }

/* 中心核:发光等离子球 */
.core-halo { fill: rgba(99, 102, 241, 0.22); filter: url(#kg-glow-strong); }
.core { fill: url(#kg-core); filter: url(#kg-glow-strong); }
.core-label {
  text-anchor: middle; fill: #fff; font-size: 15px; font-weight: 700; letter-spacing: 0.04em;
  paint-order: stroke; stroke: rgba(5, 8, 24, 0.6); stroke-width: 3px;
  pointer-events: none; user-select: none;
}

/* 关系边 */
.edge { fill: none; stroke-width: 1.1; opacity: 0.5; transition: opacity 0.2s, stroke-width 0.2s; }
.edge.active { stroke-width: 2.2; opacity: 1; }
.edge.dim { opacity: 0.07; }
.edge-invest { stroke: #38bdf8; }
.edge-partner { stroke: #a78bfa; stroke-dasharray: 5 4; }
.edge-own { stroke: #e879f9; }
.edge-incubate { stroke: #e879f9; stroke-dasharray: 2 5; }

/* 节点:发光球 */
.node { cursor: default; }
.node.clickable { cursor: pointer; }
.node-orb { stroke-width: 1.2; filter: url(#kg-glow); transition: opacity 0.2s; }
.node-cn   { --c: #d946ef; }
.node-intl { --c: #22d3ee; }
.node-conn { --c: #f59e0b; }
.node-cn .node-orb   { fill: url(#kg-cn);   stroke: #f5d0fe; }
.node-intl .node-orb { fill: url(#kg-intl); stroke: #cffafe; }
.node-conn .node-orb { fill: url(#kg-conn); stroke: #fde68a; }
.node.focus .node-orb { filter: url(#kg-glow-strong); stroke-width: 2; }
.node.dim { opacity: 0.16; }

.node-initial {
  text-anchor: middle; fill: #fff; fill-opacity: 0.96; font-weight: 700; letter-spacing: -0.02em;
  paint-order: stroke; stroke: rgba(5, 8, 24, 0.3); stroke-width: 0.6px;
  pointer-events: none; user-select: none;
}
.node-label {
  font-size: 9.5px; font-weight: 500; fill: rgba(214, 225, 250, 0.78);
  paint-order: stroke; stroke: rgba(4, 6, 16, 0.92); stroke-width: 2.6px;
  pointer-events: none; user-select: none; transition: fill 0.2s;
}
.node-conn .node-label { fill: rgba(253, 230, 138, 0.85); }
.node.focus .node-label { fill: #fff; font-weight: 600; }
.is-hovering .node.dim .node-label { fill-opacity: 0; }

.kg-legend {
  position: absolute; top: 14px; left: 16px; z-index: 3;
  display: flex; flex-direction: column; gap: 7px;
  padding: 9px 13px; font-size: 0.72rem; color: rgba(203, 213, 235, 0.86);
  background: rgba(6, 10, 26, 0.5); border: 1px solid rgba(96, 130, 220, 0.22);
  border-radius: 9px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.lg-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.lg-item { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 7px currentColor; }
.dot-cn { background: #d946ef; color: #d946ef; }
.dot-intl { background: #22d3ee; color: #22d3ee; }
.dot-conn { background: #f59e0b; color: #f59e0b; }
.ln { width: 18px; height: 0; border-top-width: 2px; border-top-style: solid; }
.ln-invest { border-color: #38bdf8; }
.ln-partner { border-color: #a78bfa; border-top-style: dashed; }
.ln-own { border-color: #e879f9; }

.kg-hint {
  position: absolute; bottom: 12px; right: 16px; z-index: 3;
  font-size: 0.68rem; color: rgba(148, 163, 200, 0.6); pointer-events: none;
}

@media (max-width: 640px) {
  .kg-legend { font-size: 0.62rem; padding: 8px 10px; gap: 4px; }
  .kg-hint { display: none; }
  .node-label { font-size: 8.5px; }
}
</style>

<!-- 档案皮:暖纸深空(非 scoped,确保 html.skin-archive 后代选择器正确编译) -->
<style>
html.skin-archive .kg-wrap {
  background:
    radial-gradient(ellipse 50% 42% at 50% 49%, rgba(176, 106, 46, 0.2), transparent 70%),
    radial-gradient(ellipse 80% 70% at 50% 49%, rgba(154, 51, 36, 0.14), transparent 72%),
    radial-gradient(ellipse 120% 100% at 50% 45%, #1c1108 0%, #120a04 55%, #0a0502 100%);
  border-color: rgba(201, 123, 90, 0.24);
}
</style>
