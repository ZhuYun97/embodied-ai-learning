<template>
  <div class="graph-wrap" ref="wrapEl">
    <!-- 图例 -->
    <div class="graph-legend">
      <span class="lg-item"><i class="dot dot-cn"></i>国内公司</span>
      <span class="lg-item"><i class="dot dot-intl"></i>国际公司</span>
      <span class="lg-item"><i class="dot dot-conn"></i>投资方/机构</span>
      <span class="lg-sep"></span>
      <span class="lg-item"><i class="line line-invest"></i>投资</span>
      <span class="lg-item"><i class="line line-partner"></i>合作</span>
      <span class="lg-item"><i class="line line-own"></i>控股/孵化</span>
    </div>

    <div class="graph-hint">拖拽节点 · 滚轮缩放 · 悬停高亮关联 · 点击访问官网</div>

    <svg
      ref="svgEl"
      class="graph-svg"
      :viewBox="`0 0 ${W} ${H}`"
      @wheel.prevent="onWheel"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`">
        <!-- 边 -->
        <g class="edges">
          <line
            v-for="(e, i) in edges"
            :key="'e' + i"
            :x1="nodeMap[e.source].x"
            :y1="nodeMap[e.source].y"
            :x2="nodeMap[e.target].x"
            :y2="nodeMap[e.target].y"
            :class="['edge', `edge-${e.type}`, { dim: hoverId && !edgeActive(e) }]"
          />
        </g>
        <!-- 节点 -->
        <g
          v-for="n in nodes"
          :key="n.id"
          :transform="`translate(${n.x},${n.y})`"
          :class="['node', `node-${n.kind}`, { dim: hoverId && !nodeActive(n.id), focus: hoverId === n.id }]"
          @pointerdown="onPointerDown(n, $event)"
          @pointerenter="hoverId = n.id"
          @pointerleave="hoverId = null"
          @click="onNodeClick(n)"
        >
          <circle :r="n.r" class="node-circle" />
          <text class="node-label" :y="n.r + 13">{{ n.label }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import data from '../../../ecosystem/companies-data.json'

const W = 900, H = 620
const svgEl = ref(null)
const wrapEl = ref(null)

const zoom = ref(1)
const pan = reactive({ x: 0, y: 0 })
const hoverId = ref(null)

// ===== 构建节点 =====
// 只纳入有关系连线的公司 + 全部投资方/机构,避免孤立散点
const rels = data.relationships || []
const connectors = data.connectors || []
const linkedIds = new Set()
rels.forEach(r => { linkedIds.add(r.source); linkedIds.add(r.target) })

const companyNodes = (data.companies || [])
  .filter(c => linkedIds.has(c.id))
  .map(c => ({
    id: c.id,
    label: c.name,
    kind: c.region === 'china' ? 'cn' : 'intl',
    r: 10 + Math.min(14, Math.sqrt((c.fundingAmount || 0) / 1e8) * 3),
    website: c.website || null,
    x: W / 2 + (Math.random() - 0.5) * 320,
    y: H / 2 + (Math.random() - 0.5) * 320,
    vx: 0, vy: 0, fixed: false,
  }))

const connectorNodes = connectors
  .filter(c => linkedIds.has(c.id))
  .map(c => ({
    id: c.id,
    label: c.name,
    kind: 'conn',
    r: 13,
    website: null,
    x: W / 2 + (Math.random() - 0.5) * 320,
    y: H / 2 + (Math.random() - 0.5) * 320,
    vx: 0, vy: 0, fixed: false,
  }))

const nodes = reactive([...connectorNodes, ...companyNodes])
const nodeMap = computed(() => Object.fromEntries(nodes.map(n => [n.id, n])))

// 仅保留两端节点都存在的边
const validIds = new Set(nodes.map(n => n.id))
const edges = rels.filter(e => validIds.has(e.source) && validIds.has(e.target))

// 邻接表(悬停高亮用)
const adj = {}
nodes.forEach(n => { adj[n.id] = new Set([n.id]) })
edges.forEach(e => { adj[e.source].add(e.target); adj[e.target].add(e.source) })

function nodeActive(id) { return hoverId.value && adj[hoverId.value]?.has(id) }
function edgeActive(e) { return hoverId.value && (e.source === hoverId.value || e.target === hoverId.value) }

// ===== 力导向模拟 =====
let raf = null
let alpha = 1
const CENTER_X = W / 2, CENTER_Y = H / 2

function tick() {
  if (alpha < 0.005) { raf = null; return }
  alpha *= 0.99

  // 斥力(库仑)
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      let dx = a.x - b.x, dy = a.y - b.y
      let d2 = dx * dx + dy * dy || 0.01
      let d = Math.sqrt(d2)
      const rep = 2600 / d2
      const fx = (dx / d) * rep, fy = (dy / d) * rep
      a.vx += fx; a.vy += fy
      b.vx -= fx; b.vy -= fy
    }
  }

  // 引力(弹簧)
  const LINK = 130
  for (const e of edges) {
    const a = nodeMap.value[e.source], b = nodeMap.value[e.target]
    let dx = b.x - a.x, dy = b.y - a.y
    let d = Math.sqrt(dx * dx + dy * dy) || 0.01
    const f = (d - LINK) * 0.02
    const fx = (dx / d) * f, fy = (dy / d) * f
    a.vx += fx; a.vy += fy
    b.vx -= fx; b.vy -= fy
  }

  // 向心力 + 阻尼 + 积分
  for (const n of nodes) {
    if (n.fixed) { n.vx = 0; n.vy = 0; continue }
    n.vx += (CENTER_X - n.x) * 0.002
    n.vy += (CENTER_Y - n.y) * 0.002
    n.vx *= 0.85; n.vy *= 0.85
    n.x += n.vx * alpha * 4
    n.y += n.vy * alpha * 4
    // 边界约束
    n.x = Math.max(n.r + 4, Math.min(W - n.r - 4, n.x))
    n.y = Math.max(n.r + 4, Math.min(H - n.r - 4, n.y))
  }

  raf = requestAnimationFrame(tick)
}

function reheat() {
  alpha = Math.max(alpha, 0.6)
  if (!raf) raf = requestAnimationFrame(tick)
}

// ===== 拖拽 =====
let dragNode = null
function svgPoint(evt) {
  const rect = svgEl.value.getBoundingClientRect()
  const sx = (evt.clientX - rect.left) / rect.width * W
  const sy = (evt.clientY - rect.top) / rect.height * H
  return { x: (sx - pan.x) / zoom.value, y: (sy - pan.y) / zoom.value }
}
function onPointerDown(n, evt) {
  dragNode = n
  n.fixed = true
  svgEl.value.setPointerCapture?.(evt.pointerId)
}
function onPointerMove(evt) {
  if (!dragNode) return
  const p = svgPoint(evt)
  dragNode.x = p.x; dragNode.y = p.y
  reheat()
}
function onPointerUp() {
  if (dragNode) { dragNode.fixed = false; dragNode = null; reheat() }
}

// ===== 缩放 =====
function onWheel(evt) {
  const factor = evt.deltaY < 0 ? 1.1 : 0.9
  const next = Math.max(0.5, Math.min(2.4, zoom.value * factor))
  zoom.value = next
}

// ===== 点击访问官网 =====
let downAt = 0
function onNodeClick(n) {
  if (n.website) window.open(n.website, '_blank', 'noopener')
}

onMounted(() => { reheat() })
onBeforeUnmount(() => { if (raf) cancelAnimationFrame(raf) })
</script>

<style scoped>
.graph-wrap {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background:
    radial-gradient(ellipse 70% 60% at 50% 0%, var(--vp-c-brand-softer), transparent 70%),
    var(--vp-c-bg-soft);
  overflow: hidden;
}
.graph-svg {
  display: block;
  width: 100%;
  height: auto;
  touch-action: none;
  cursor: grab;
}

/* 图例 */
.graph-legend {
  position: absolute;
  top: 12px; left: 14px;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: 0.74rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  backdrop-filter: blur(8px);
}
.lg-item { display: inline-flex; align-items: center; gap: 5px; }
.lg-sep { width: 1px; height: 14px; background: var(--vp-c-divider); }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-cn { background: #ef4444; }
.dot-intl { background: #3b82f6; }
.dot-conn { background: #f59e0b; }
.line { width: 16px; height: 0; border-top-width: 2px; border-top-style: solid; }
.line-invest { border-color: #22c55e; }
.line-partner { border-color: #3b82f6; border-top-style: dashed; }
.line-own { border-color: #a855f7; }

.graph-hint {
  position: absolute;
  bottom: 10px; right: 14px;
  z-index: 2;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

/* 边 */
.edge { stroke-width: 1.6; opacity: 0.55; transition: opacity 0.2s; }
.edge-invest { stroke: #22c55e; }
.edge-partner { stroke: #3b82f6; stroke-dasharray: 5 4; }
.edge-own { stroke: #a855f7; }
.edge-incubate { stroke: #a855f7; stroke-dasharray: 2 3; }
.edge.dim { opacity: 0.07; }

/* 节点 */
.node { cursor: pointer; }
.node-circle {
  stroke: var(--vp-c-bg);
  stroke-width: 2;
  transition: opacity 0.2s, filter 0.2s;
}
.node-cn .node-circle { fill: #ef4444; }
.node-intl .node-circle { fill: #3b82f6; }
.node-conn .node-circle { fill: #f59e0b; }
.node-conn { cursor: default; }
.node.focus .node-circle { filter: drop-shadow(0 0 7px currentColor); }
.node-cn.focus .node-circle { color: #ef4444; }
.node-intl.focus .node-circle { color: #3b82f6; }
.node-conn.focus .node-circle { color: #f59e0b; }
.node.dim { opacity: 0.18; }

.node-label {
  text-anchor: middle;
  font-size: 11px;
  font-weight: 500;
  fill: var(--vp-c-text-1);
  paint-order: stroke;
  stroke: var(--vp-c-bg);
  stroke-width: 3px;
  pointer-events: none;
  user-select: none;
}

/* 暗色 */
:global(.dark) .node-circle { stroke: var(--vp-c-bg-soft); }
:global(.dark) .node-label { stroke: var(--vp-c-bg-soft); }

/* 档案皮 */
:global(html.skin-archive) .node-cn .node-circle { fill: #9A3324; }
:global(html.skin-archive) .node-intl .node-circle { fill: #4A6FA5; }
:global(html.skin-archive) .node-conn .node-circle { fill: #C97B5A; }

@media (max-width: 640px) {
  .graph-legend { font-size: 0.66rem; gap: 6px; padding: 6px 8px; }
  .graph-hint { display: none; }
}
</style>
