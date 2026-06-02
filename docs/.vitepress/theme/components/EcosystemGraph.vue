<template>
  <div class="graph-wrap" ref="wrapEl">
    <!-- 背景动态网格 -->
    <canvas ref="bgCanvas" class="graph-bg"></canvas>

    <!-- 图例 -->
    <div class="graph-legend">
      <div class="lg-row">
        <span class="lg-item"><i class="dot dot-cn"></i>国内公司</span>
        <span class="lg-item"><i class="dot dot-intl"></i>国际公司</span>
        <span class="lg-item"><i class="dot dot-conn"></i>投资方/机构</span>
      </div>
      <div class="lg-row">
        <span class="lg-item"><i class="line line-invest"></i>投资</span>
        <span class="lg-item"><i class="line line-partner"></i>合作</span>
        <span class="lg-item"><i class="line line-own"></i>控股/孵化</span>
      </div>
    </div>

    <div class="graph-hint">拖拽节点 · 滚轮缩放 · 悬停高亮 · 点击访问</div>

    <svg
      ref="svgEl"
      class="graph-svg"
      :viewBox="`0 0 ${W} ${H}`"
      @wheel.prevent="onWheel"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <defs>
        <!-- 渐变定义 -->
        <radialGradient id="glow-cn" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="1" />
          <stop offset="70%" stop-color="#dc2626" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#991b1b" stop-opacity="0.4" />
        </radialGradient>
        <radialGradient id="glow-intl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="1" />
          <stop offset="70%" stop-color="#3b82f6" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#1e40af" stop-opacity="0.4" />
        </radialGradient>
        <radialGradient id="glow-conn" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="1" />
          <stop offset="70%" stop-color="#f59e0b" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#d97706" stop-opacity="0.4" />
        </radialGradient>

        <!-- 边流动动画 -->
        <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent" />
          <stop offset="50%" stop-color="currentColor" stop-opacity="0.8" />
          <stop offset="100%" stop-color="transparent" />
          <animate attributeName="x1" values="-100%;100%" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0%;200%" dur="2.5s" repeatCount="indefinite" />
        </linearGradient>

        <!-- 辉光滤镜 -->
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="glow-strong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="12" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2"/>
            <feMergeNode in="blur1"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`">
        <!-- 边（底层光晕） -->
        <g class="edges-glow">
          <line
            v-for="(e, i) in edges"
            :key="'eg' + i"
            :x1="nodeMap[e.source].x"
            :y1="nodeMap[e.source].y"
            :x2="nodeMap[e.target].x"
            :y2="nodeMap[e.target].y"
            :class="['edge-glow', `edge-${e.type}`, { active: edgeActive(e) }]"
          />
        </g>

        <!-- 边（实体） -->
        <g class="edges">
          <line
            v-for="(e, i) in edges"
            :key="'e' + i"
            :x1="nodeMap[e.source].x"
            :y1="nodeMap[e.source].y"
            :x2="nodeMap[e.target].x"
            :y2="nodeMap[e.target].y"
            :class="['edge', `edge-${e.type}`, { dim: hoverId && !edgeActive(e), active: edgeActive(e) }]"
          />
        </g>

        <!-- 节点（底层光环） -->
        <g class="nodes-halo">
          <circle
            v-for="n in nodes"
            :key="'h' + n.id"
            :cx="n.x"
            :cy="n.y"
            :r="n.r + 5"
            :class="['node-halo', `halo-${n.kind}`, { active: hoverId === n.id }]"
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
          <!-- 外环脉动 -->
          <circle :r="n.r + 3" class="node-pulse">
            <animate
              v-if="hoverId === n.id"
              attributeName="r"
              :from="n.r + 3"
              :to="n.r + 8"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              v-if="hoverId === n.id"
              attributeName="opacity"
              from="0.5"
              to="0"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>

          <!-- 主圆 -->
          <circle :r="n.r" class="node-circle" :fill="`url(#glow-${n.kind})`" />

          <!-- 内环高光 -->
          <circle :r="n.r * 0.5" class="node-inner" />

          <!-- 标签 -->
          <text class="node-label" :y="n.r + 16">{{ n.label }}</text>
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
    r: 7 + Math.min(10, Math.sqrt((c.fundingAmount || 0) / 1e8) * 2.2),
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
    r: 10,
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

// ===== 背景星空粒子 =====
const bgCanvas = ref(null)
let bgRaf = null
let particles = []

function initBg() {
  const canvas = bgCanvas.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 1.4 + 0.4,
    a: Math.random() * 0.5 + 0.2,
  }))

  function draw() {
    const w = rect.width, h = rect.height
    ctx.clearRect(0, 0, w, h)
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(125, 211, 252, ${p.a})`
      ctx.fill()
    }
    bgRaf = requestAnimationFrame(draw)
  }
  draw()
}

onMounted(() => { reheat(); initBg() })
onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (bgRaf) cancelAnimationFrame(bgRaf)
})
</script>

<style scoped>
/* ============================================================
   舞台:深色科技蓝 + 极光 + 微网格
   ============================================================ */
.graph-wrap {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 16px;
  overflow: hidden;
  /* 主背景:深空蓝(亮色站点也保持暗舞台,避免发光被白底吃掉) */
  background:
    radial-gradient(ellipse 60% 50% at 30% 20%, rgba(37, 99, 235, 0.35), transparent 70%),
    radial-gradient(ellipse 60% 50% at 75% 75%, rgba(139, 92, 246, 0.28), transparent 70%),
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(34, 211, 238, 0.12), transparent 70%),
    linear-gradient(180deg, #0a1024 0%, #0d1530 50%, #0a1024 100%);
  box-shadow:
    inset 0 0 0 1px rgba(56, 189, 248, 0.18),
    0 20px 60px -20px rgba(37, 99, 235, 0.3);
}
/* 微网格层 */
.graph-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(125, 211, 252, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(125, 211, 252, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%);
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, #000 40%, transparent 100%);
}
/* 顶部扫描线 */
.graph-wrap::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(34, 211, 238, 0.7) 30%,
    rgba(139, 92, 246, 0.7) 70%,
    transparent 100%);
}

.graph-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.graph-svg {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: auto;
  touch-action: none;
  cursor: grab;
}
.graph-svg:active { cursor: grabbing; }

/* ============================================================
   HUD 图例
   ============================================================ */
.graph-legend {
  position: absolute;
  top: 14px; left: 16px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 14px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  color: rgba(186, 230, 253, 0.85);
  background: rgba(13, 21, 48, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 8px;
  backdrop-filter: blur(10px) saturate(1.4);
  -webkit-backdrop-filter: blur(10px) saturate(1.4);
  box-shadow:
    inset 0 0 0 1px rgba(125, 211, 252, 0.06),
    0 4px 16px rgba(37, 99, 235, 0.2);
}
.lg-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.lg-item { display: inline-flex; align-items: center; gap: 6px; }
.dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}
.dot-cn { background: #f87171; color: #ef4444; }
.dot-intl { background: #60a5fa; color: #3b82f6; }
.dot-conn { background: #fbbf24; color: #f59e0b; }
.line {
  width: 18px; height: 0;
  border-top-width: 2px;
  border-top-style: solid;
  filter: drop-shadow(0 0 4px currentColor);
}
.line-invest { border-color: #22d3ee; color: #22d3ee; }
.line-partner { border-color: #a78bfa; color: #a78bfa; border-top-style: dashed; }
.line-own { border-color: #f472b6; color: #f472b6; }

.graph-hint {
  position: absolute;
  bottom: 12px; right: 16px;
  z-index: 3;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: rgba(186, 230, 253, 0.55);
  pointer-events: none;
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.3);
}

/* ============================================================
   边:霓虹流光双层(底层模糊光晕 + 上层主线)
   ============================================================ */
.edges-glow .edge-glow {
  fill: none;
  stroke-width: 6;
  opacity: 0.18;
  filter: blur(4px);
  transition: opacity 0.25s;
}
.edges-glow .edge-glow.active { opacity: 0.65; }

.edge {
  fill: none;
  stroke-width: 1.4;
  opacity: 0.5;
  transition: opacity 0.25s, stroke-width 0.25s;
}
.edge.active { stroke-width: 2.2; opacity: 1; }
.edge.dim { opacity: 0.08; }

.edge-invest { stroke: #22d3ee; }
.edge-partner { stroke: #a78bfa; stroke-dasharray: 6 4; }
.edge-own { stroke: #f472b6; }
.edge-incubate { stroke: #f472b6; stroke-dasharray: 3 4; }

.edges-glow .edge-invest { stroke: #22d3ee; }
.edges-glow .edge-partner { stroke: #a78bfa; }
.edges-glow .edge-own { stroke: #f472b6; }
.edges-glow .edge-incubate { stroke: #f472b6; }

/* ============================================================
   节点:多层光球(光环 + 主圆 + 内核高光 + 脉冲扩散)
   ============================================================ */
.node-halo {
  fill: none;
  stroke-width: 1.5;
  opacity: 0;
  transition: opacity 0.3s;
  filter: blur(4px);
}
.halo-cn { stroke: #ef4444; }
.halo-intl { stroke: #3b82f6; }
.halo-conn { stroke: #f59e0b; }
.node-halo.active { opacity: 0.7; }

.node { cursor: pointer; }
.node-conn { cursor: default; }

.node-pulse {
  fill: none;
  stroke-width: 1.5;
  opacity: 0;
  pointer-events: none;
}
.node-cn .node-pulse { stroke: #f87171; }
.node-intl .node-pulse { stroke: #60a5fa; }
.node-conn .node-pulse { stroke: #fbbf24; }

.node-circle {
  stroke-width: 1.2;
  stroke: rgba(255, 255, 255, 0.25);
  filter: drop-shadow(0 0 3px currentColor);
  transition: filter 0.25s, opacity 0.25s;
}
.node-cn .node-circle { color: #ef4444; }
.node-intl .node-circle { color: #3b82f6; }
.node-conn .node-circle { color: #f59e0b; }

.node.focus .node-circle {
  filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 2px currentColor);
}

.node-inner {
  fill: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  transform: translate(-25%, -25%);
}

.node.dim .node-circle,
.node.dim .node-inner { opacity: 0.2; }
.node.dim .node-label { opacity: 0.3; }

.node-label {
  text-anchor: middle;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  fill: rgba(226, 232, 240, 0.95);
  paint-order: stroke;
  stroke: rgba(10, 16, 36, 0.95);
  stroke-width: 3px;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.25s, fill 0.25s;
}
.node.focus .node-label {
  fill: #fff;
  stroke-width: 4px;
}

/* 档案皮:暖纸纸面感,降低发光,改深棕舞台 */
:global(html.skin-archive) .graph-wrap {
  background:
    radial-gradient(ellipse 60% 50% at 30% 20%, rgba(154, 51, 36, 0.18), transparent 70%),
    radial-gradient(ellipse 60% 50% at 75% 75%, rgba(201, 123, 90, 0.18), transparent 70%),
    linear-gradient(180deg, #2a1a14 0%, #1f130d 50%, #2a1a14 100%);
}
:global(html.skin-archive) .edge-invest,
:global(html.skin-archive) .edges-glow .edge-invest { stroke: #f59e0b; }
:global(html.skin-archive) .edge-partner,
:global(html.skin-archive) .edges-glow .edge-partner { stroke: #fb923c; }
:global(html.skin-archive) .edge-own,
:global(html.skin-archive) .edge-incubate,
:global(html.skin-archive) .edges-glow .edge-own,
:global(html.skin-archive) .edges-glow .edge-incubate { stroke: #ef4444; }

@media (max-width: 640px) {
  .graph-legend { font-size: 0.62rem; padding: 8px 10px; gap: 4px; }
  .lg-row { gap: 8px; }
  .graph-hint { display: none; }
  .node-label { font-size: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  .node-pulse animate { display: none; }
}
</style>
