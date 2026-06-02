<template>
  <div class="graph-wrap" ref="wrapEl">
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

    <div class="graph-hint">拖拽 · 滚轮缩放 · 悬停高亮 · 点击访问官网</div>

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
        <!-- 箭头标记:三种关系各一色 -->
        <marker id="arrow-invest" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#38bdf8" />
        </marker>
        <marker id="arrow-partner" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#818cf8" />
        </marker>
        <marker id="arrow-own" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#c084fc" />
        </marker>
        <!-- 节点球渐变(三类):左上高光 → 深色边缘,做出立体球感 -->
        <radialGradient id="grad-cn" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stop-color="#ff9d92" /><stop offset="52%" stop-color="#ef4d44" /><stop offset="100%" stop-color="#bb2c26" />
        </radialGradient>
        <radialGradient id="grad-intl" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stop-color="#9cc4ff" /><stop offset="52%" stop-color="#3f7fe0" /><stop offset="100%" stop-color="#1f4fae" />
        </radialGradient>
        <radialGradient id="grad-conn" cx="36%" cy="30%" r="78%">
          <stop offset="0%" stop-color="#ffe39a" /><stop offset="52%" stop-color="#eaa12c" /><stop offset="100%" stop-color="#b9741a" />
        </radialGradient>
        <!-- 焦点辉光:仅悬停节点用 -->
        <filter id="focus-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`" :class="{ 'is-hovering': hoverId }">
        <!-- 边:曲线 + 方向箭头 -->
        <g class="edges">
          <path
            v-for="(e, i) in edges"
            :key="'e' + i"
            :d="edgePath(e)"
            :class="['edge', `edge-${e.type}`, { dim: hoverId && !edgeActive(e), active: edgeActive(e) }]"
            :marker-end="`url(#arrow-${arrowKind(e.type)})`"
          />
        </g>

        <!-- 节点 -->
        <g
          v-for="n in nodes"
          :key="n.id"
          :transform="`translate(${n.x},${n.y})`"
          :class="['node', `node-${n.kind}`, { dim: hoverId && !nodeActive(n.id), focus: hoverId === n.id, clickable: !!n.website }]"
          @pointerdown="onPointerDown(n, $event)"
          @pointerenter="hoverId = n.id"
          @pointerleave="hoverId = null"
          @click="onNodeClick(n)"
        >
          <circle :r="n.r" class="node-halo" />
          <circle :r="n.r" class="node-ring" />
          <text class="node-initial" dy="0.34em">{{ n.initial }}</text>
          <!-- 标签:带底衬,默认仅机构与大节点显示,hover 时全显 -->
          <g class="node-label-wrap" :transform="`translate(0, ${n.r + 6})`">
            <text class="node-label">{{ n.label }}</text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import data from '../../../ecosystem/companies-data.json'

const W = 1100, H = 780
const svgEl = ref(null)
const wrapEl = ref(null)

const zoom = ref(1)
const pan = reactive({ x: 0, y: 0 })
const hoverId = ref(null)

// 首字母:中文取首字,英文取首字母
function initialOf(name) {
  if (!name) return '?'
  const c = name.trim()[0]
  if (/[一-鿿]/.test(c)) return c
  return c.toUpperCase()
}

// ===== 构建节点 =====
const rels = data.relationships || []
const connectors = data.connectors || []
const linkedIds = new Set()
rels.forEach(r => { linkedIds.add(r.source); linkedIds.add(r.target) })

const CX = W / 2, CY = H / 2

// 投资方/机构 → 外环;公司 → 内圈。分层布局,减少交叉、增加秩序感。
const connectorList = connectors.filter(c => linkedIds.has(c.id))
const companyList = (data.companies || []).filter(c => linkedIds.has(c.id))

const connectorNodes = connectorList.map((c, i) => {
  const ang = (i / connectorList.length) * Math.PI * 2 - Math.PI / 2
  return {
    id: c.id, label: c.name, initial: initialOf(c.name),
    kind: 'conn', r: 16, website: null,
    x: CX + Math.cos(ang) * 360, y: CY + Math.sin(ang) * 290,
    vx: 0, vy: 0, fixed: false,
  }
})

const companyNodes = companyList.map((c, i) => {
  const ang = (i / companyList.length) * Math.PI * 2
  return {
    id: c.id, label: c.name, initial: initialOf(c.name),
    kind: c.region === 'china' ? 'cn' : 'intl',
    r: 12 + Math.min(9, Math.sqrt((c.fundingAmount || 0) / 1e8) * 2),
    website: c.website || null,
    x: CX + Math.cos(ang) * 160, y: CY + Math.sin(ang) * 130,
    vx: 0, vy: 0, fixed: false,
  }
})

const nodes = reactive([...connectorNodes, ...companyNodes])
const nodeMap = computed(() => Object.fromEntries(nodes.map(n => [n.id, n])))

const validIds = new Set(nodes.map(n => n.id))
const edges = rels.filter(e => validIds.has(e.source) && validIds.has(e.target))

// 邻接表(悬停高亮)
const adj = {}
nodes.forEach(n => { adj[n.id] = new Set([n.id]) })
edges.forEach(e => { adj[e.source].add(e.target); adj[e.target].add(e.source) })

function nodeActive(id) { return hoverId.value && adj[hoverId.value]?.has(id) }
function edgeActive(e) { return hoverId.value && (e.source === hoverId.value || e.target === hoverId.value) }
function arrowKind(type) { return type === 'invest' ? 'invest' : type === 'partner' ? 'partner' : 'own' }

// 曲线边:二次贝塞尔,控制点垂直偏移制造弧度,末端留出箭头空间
function edgePath(e) {
  const a = nodeMap.value[e.source], b = nodeMap.value[e.target]
  const dx = b.x - a.x, dy = b.y - a.y
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  // 末端缩短到目标节点边缘(留箭头)
  const tr = b.r + 7
  const ex = b.x - (dx / dist) * tr, ey = b.y - (dy / dist) * tr
  // 控制点:中点沿法线偏移 ~16% 距离
  const mx = (a.x + ex) / 2, my = (a.y + ey) / 2
  const nx = -dy / dist, ny = dx / dist
  const off = dist * 0.16
  return `M ${a.x} ${a.y} Q ${mx + nx * off} ${my + ny * off} ${ex} ${ey}`
}

// ===== 力导向 =====
let raf = null
let alpha = 1

function tick() {
  if (alpha < 0.005) { raf = null; return }
  alpha *= 0.992

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      let dx = a.x - b.x, dy = a.y - b.y
      let d2 = dx * dx + dy * dy || 0.01
      let d = Math.sqrt(d2)
      const rep = 6200 / d2
      const fx = (dx / d) * rep, fy = (dy / d) * rep
      a.vx += fx; a.vy += fy
      b.vx -= fx; b.vy -= fy
    }
  }

  const LINK = 185
  for (const e of edges) {
    const a = nodeMap.value[e.source], b = nodeMap.value[e.target]
    let dx = b.x - a.x, dy = b.y - a.y
    let d = Math.sqrt(dx * dx + dy * dy) || 0.01
    const f = (d - LINK) * 0.02
    const fx = (dx / d) * f, fy = (dy / d) * f
    a.vx += fx; a.vy += fy
    b.vx -= fx; b.vy -= fy
  }

  for (const n of nodes) {
    if (n.fixed) { n.vx = 0; n.vy = 0; continue }
    // 公司向中心,机构被往外推,形成分层
    const pull = n.kind === 'conn' ? 0.0010 : 0.0035
    n.vx += (CX - n.x) * pull
    n.vy += (CY - n.y) * pull
    n.vx *= 0.85; n.vy *= 0.85
    n.x += n.vx * alpha * 4
    n.y += n.vy * alpha * 4
    n.x = Math.max(n.r + 56, Math.min(W - n.r - 56, n.x))
    n.y = Math.max(n.r + 26, Math.min(H - n.r - 26, n.y))
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
  zoom.value = Math.max(0.5, Math.min(2.4, zoom.value * factor))
}

// ===== 点击访问 =====
function onNodeClick(n) {
  if (n.website) window.open(n.website, '_blank', 'noopener')
}

onMounted(() => { reheat() })
onBeforeUnmount(() => { if (raf) cancelAnimationFrame(raf) })
</script>


<style scoped>
/* 舞台:深空 + 星点网格 + 呼吸辉光 — 科技数据星图 */
.graph-wrap {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 60% at 50% 38%, rgba(38, 86, 180, 0.28), transparent 70%),
    radial-gradient(ellipse 110% 90% at 50% 35%, #142554 0%, #0a1336 45%, #050a1f 100%);
  border: 1px solid rgba(96, 140, 230, 0.22);
  box-shadow: inset 0 0 80px rgba(40, 90, 200, 0.12), 0 18px 50px -18px rgba(12, 28, 80, 0.65);
}
/* 星点网格 */
.graph-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(rgba(150, 190, 255, 0.16) 1px, transparent 1.4px),
    radial-gradient(rgba(120, 160, 230, 0.08) 1px, transparent 1.2px);
  background-size: 30px 30px, 17px 17px;
  background-position: 0 0, 9px 13px;
  -webkit-mask-image: radial-gradient(ellipse 82% 75% at 50% 42%, #000 30%, transparent 100%);
  mask-image: radial-gradient(ellipse 82% 75% at 50% 42%, #000 30%, transparent 100%);
}
/* 中心呼吸辉光(缓慢明灭),营造"能量场" */
.graph-wrap::after {
  content: '';
  position: absolute;
  left: 50%; top: 36%;
  width: 60%; height: 55%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  background: radial-gradient(circle, rgba(56, 150, 255, 0.18), transparent 65%);
  filter: blur(20px);
  animation: stageBreathe 6s ease-in-out infinite;
}
@keyframes stageBreathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
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

/* 图例:低调玻璃面板 */
.graph-legend {
  position: absolute;
  top: 14px; left: 16px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 9px 13px;
  font-size: 0.72rem;
  color: rgba(203, 213, 225, 0.82);
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(96, 130, 200, 0.18);
  border-radius: 9px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.lg-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.lg-item { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 9px; height: 9px; border-radius: 50%; }
.dot-cn { background: #f87171; }
.dot-intl { background: #60a5fa; }
.dot-conn { background: #fbbf24; }
.line { width: 18px; height: 0; border-top-width: 2px; border-top-style: solid; }
.line-invest { border-color: #38bdf8; }
.line-partner { border-color: #818cf8; border-top-style: dashed; }
.line-own { border-color: #c084fc; }

.graph-hint {
  position: absolute;
  bottom: 12px; right: 16px;
  z-index: 3;
  font-size: 0.68rem;
  color: rgba(148, 163, 184, 0.6);
  pointer-events: none;
}

/* 边:流动数据电流(stroke-dashoffset 动画)+ 方向箭头。
   默认不加 filter(动画期逐帧重算太贵),辉光只给高亮的少数边。 */
.edge {
  fill: none;
  stroke-width: 1.4;
  opacity: 0.5;
  stroke-dasharray: 7 11;
  stroke-linecap: round;
  animation: dataFlow 1.7s linear infinite;
  transition: opacity 0.22s, stroke-width 0.22s;
}
@keyframes dataFlow { to { stroke-dashoffset: -18; } }
.edge.active {
  stroke-width: 2.6;
  opacity: 1;
  animation-duration: 0.7s;   /* 高亮时电流更快 */
  filter: drop-shadow(0 0 4px rgba(125, 185, 255, 0.9));
}
.edge.dim { opacity: 0.08; animation-play-state: paused; }
.edge-invest { stroke: #38bdf8; }
.edge-partner { stroke: #818cf8; stroke-dasharray: 4 8; }
.edge-own { stroke: #c084fc; }
.edge-incubate { stroke: #c084fc; stroke-dasharray: 2 7; }

/* 节点:扁平描边圆 + 内嵌首字母,无过曝光晕 */
.node { cursor: default; }
.node.clickable { cursor: pointer; }

/* 霓虹光环:默认隐藏,焦点时 ping 扩散 */
.node-halo {
  fill: none;
  stroke-width: 1.6;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  pointer-events: none;
}
.node-cn .node-halo   { stroke: #ff7a6e; }
.node-intl .node-halo { stroke: #7db4ff; }
.node-conn .node-halo { stroke: #ffcf6a; }
.node.focus .node-halo { animation: nodePing 1.5s ease-out infinite; }
@keyframes nodePing {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.6); opacity: 0; }
}

/* 每类一种霓虹色(供光晕用) */
.node-cn   { --glow: rgba(239, 77, 68, 0.7); }
.node-intl { --glow: rgba(63, 127, 224, 0.7); }
.node-conn { --glow: rgba(234, 161, 44, 0.7); }

.node-ring {
  stroke-width: 1.6;
  filter: drop-shadow(0 0 5px var(--glow)) drop-shadow(0 1px 3px rgba(3, 8, 22, 0.6));
  transition: stroke-width 0.2s, opacity 0.2s;
}
.node-cn .node-ring   { fill: url(#grad-cn);   stroke: #ffb6ab; }
.node-intl .node-ring { fill: url(#grad-intl); stroke: #b8d2ff; }
.node-conn .node-ring { fill: url(#grad-conn); stroke: #ffe6a6; }

.node.focus .node-ring { stroke-width: 2.6; filter: url(#focus-glow) drop-shadow(0 0 10px var(--glow)); }

.node.dim { opacity: 0.18; }

/* 节点内首字母:白字叠在彩球上 */
.node-initial {
  text-anchor: middle;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.02em;
  fill: #fff;
  fill-opacity: 0.96;
  paint-order: stroke;
  stroke: rgba(8, 14, 30, 0.28);
  stroke-width: 0.6px;
  pointer-events: none;
  user-select: none;
}

/* 标签:默认隐藏,仅在悬停时显示「焦点节点 + 其邻居」,大幅减少拥挤 */
.node-label {
  text-anchor: middle;
  font-size: 10.5px;
  font-weight: 600;
  fill: #e8eefc;
  paint-order: stroke;
  stroke: rgba(8, 14, 30, 0.95);
  stroke-width: 3px;
  pointer-events: none;
  user-select: none;
  opacity: 0;
  transition: opacity 0.18s;
}
.is-hovering .node:not(.dim) .node-label { opacity: 0.97; }
.is-hovering .node-conn:not(.dim) .node-label { fill: #fde9b0; }
.node.focus .node-label { opacity: 1; }

/* 尊重 reduced-motion:关闭电流流动 / 呼吸辉光 / 焦点 ping */
@media (prefers-reduced-motion: reduce) {
  .edge { animation: none; }
  .graph-wrap::after { animation: none; }
  .node.focus .node-halo { animation: none; }
}

/* 档案皮覆盖见下方非 scoped <style> 块(scoped 下 :global() 的多级后代会被错误折叠) */

@media (max-width: 640px) {
  .graph-legend { font-size: 0.62rem; padding: 8px 10px; gap: 4px; }
  .lg-row { gap: 8px; }
  .graph-hint { display: none; }
  .node-label { font-size: 9.5px; }
  .node-initial { font-size: 11px; }
}
</style>

<!-- 档案皮覆盖:放在非 scoped 块,html.skin-archive 多级后代选择器才能正确编译 -->
<style>
html.skin-archive .graph-wrap {
  background: radial-gradient(ellipse 90% 75% at 50% 42%, #2c1d14 0%, #21150d 60%, #1b1009 100%);
  border-color: rgba(201, 123, 90, 0.22);
}
html.skin-archive .node-cn .node-ring   { fill: #9a3324; stroke: #e0a08a; }
html.skin-archive .node-intl .node-ring { fill: #466da0; stroke: #9fbcde; }
html.skin-archive .node-conn .node-ring { fill: #b06a2e; stroke: #e6b27e; }
html.skin-archive .node-initial { fill: #fff8ef; }
/* 暖色霓虹光晕 + 电流辉光 */
html.skin-archive .node-cn   { --glow: rgba(201, 90, 60, 0.6); }
html.skin-archive .node-intl { --glow: rgba(90, 130, 190, 0.6); }
html.skin-archive .node-conn { --glow: rgba(201, 140, 70, 0.6); }
html.skin-archive .node-cn .node-halo   { stroke: #e08a6e; }
html.skin-archive .node-intl .node-halo { stroke: #8fb0d6; }
html.skin-archive .node-conn .node-halo { stroke: #e6b27e; }
html.skin-archive .edge.active { filter: drop-shadow(0 0 4px rgba(224, 150, 95, 0.9)); }
html.skin-archive .edge-invest { stroke: #d9954f; }
html.skin-archive .edge-partner { stroke: #b5805a; }
html.skin-archive .edge-own,
html.skin-archive .edge-incubate { stroke: #c2693f; }
/* 图例随皮肤变暖 */
html.skin-archive .dot-cn   { background: #9a3324; }
html.skin-archive .dot-intl { background: #466da0; }
html.skin-archive .dot-conn { background: #b06a2e; }
html.skin-archive .line-invest  { border-color: #d9954f; }
html.skin-archive .line-partner { border-color: #b5805a; }
html.skin-archive .line-own     { border-color: #c2693f; }
</style>
