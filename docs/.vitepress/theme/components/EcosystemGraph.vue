<template>
  <div class="kg-wrap" ref="wrapEl">
    <div class="kg-legend">
      <div class="lg-row">
        <span class="lg-item"><i class="dot dot-leaf"></i>公司(发光主体)</span>
        <span class="lg-item"><i class="dot dot-hub"></i>投资方/机构(枢纽)</span>
      </div>
      <div class="lg-row">
        <span class="lg-item">同色 = 同一投资集群</span>
      </div>
      <div class="lg-row">
        <span class="lg-item"><i class="ln ln-solid"></i>投资/控股</span>
        <span class="lg-item"><i class="ln ln-dash"></i>合作/孵化</span>
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

        <!-- 关系边(发光) -->
        <g class="edges" filter="url(#kg-edge-glow)">
          <path
            v-for="(e, i) in edges"
            :key="'e' + i"
            :d="edgePath(e)"
            :class="['edge', `edge-${e.type}`, { primary: e.primary, dim: hoverId && !edgeActive(e), active: edgeActive(e) }]"
            :style="{ stroke: e.color || undefined }"
          />
        </g>

        <!-- 中心:发光机器人线稿(具身智能意象,填补留白) -->
        <circle :cx="CX" :cy="CY" r="118" class="center-aura" />
        <g class="center-robot" :transform="`translate(${CX - 305 * 0.62}, ${CY - 240 * 0.62}) scale(0.62)`">
          <g class="cr-stroke" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="234" y="62" width="120" height="100" rx="26" />
            <line x1="260" y1="110" x2="288" y2="110" stroke-width="6" />
            <line x1="300" y1="110" x2="328" y2="110" stroke-width="6" />
            <path d="M294 62v-22" />
            <path d="M278 162v18 M310 162v18" />
            <path d="M238 198 L350 198 L370 252 L338 358 L250 358 L218 252 Z" />
            <circle cx="294" cy="264" r="34" />
            <path d="M226 216 L184 272 L198 346" />
            <path d="M362 216 L418 234 L444 180" />
            <path d="M254 358 L240 414 M334 358 L348 414" />
            <rect x="228" y="414" width="132" height="22" rx="8" />
          </g>
          <circle class="cr-eye" cx="294" cy="264" r="13" />
          <g class="cr-joint">
            <circle cx="226" cy="216" r="6" /><circle cx="184" cy="272" r="6" />
            <circle cx="362" cy="216" r="6" /><circle cx="418" cy="234" r="6" />
          </g>
        </g>

        <!-- 节点 -->
        <g
          v-for="n in nodes"
          :key="n.id"
          :class="['node', `node-${n.kind}`, { showlabel: n.show, dim: hoverId && !nodeActive(n.id), focus: hoverId === n.id, clickable: !!n.website }]"
          :style="{ '--c': n.color }"
          @pointerenter="hoverId = n.id"
          @pointerleave="hoverId = null"
          @click="onNodeClick(n)"
        >
          <circle :cx="n.x" :cy="n.y" :r="n.r" class="node-orb" />
          <text :x="n.x" :y="n.y" class="node-initial" dy="0.34em" :style="{ fontSize: Math.round(Math.max(9, Math.min(14, n.r * 0.82))) + 'px' }">{{ n.initial }}</text>
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
const Rh = 178          // hub 内环(去中心核后向内收,避免空心太大)
const Rl = 388          // leaf 外环
const orbitRings = [178, 286]

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
const hubR = (h) => 17 + Math.min(11, (deg[h.id] || 0) * 1.6)
// 公司=生态主体,放大并抬高下限,确保都能被注意到(10–21px);次要连接点 11px
const leafR = (n) => (isCompany(n.id) ? 10 + Math.min(11, Math.sqrt((n.fundingAmount || 0) / 1e8) * 2.4) : 11)

const pos = {}
const assignedHub = {}
const Hn = Math.max(1, hubList.length)
// hub:按子节点数降序,均匀铺在内环
hubList.sort((a, b) => childrenOf[b.id].length - childrenOf[a.id].length)
// 每个枢纽一种珠宝色 —— 枢纽与其旗下公司共用同一色调(对标参考的「集群配色」)
const HUB_HUES = ['#22d3ee', '#6366f1', '#d946ef', '#2dd4bf', '#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#60a5fa', '#8b5cf6', '#f472b6', '#34d399']
const hubHue = {}
hubList.forEach((h, i) => { hubHue[h.id] = HUB_HUES[i % HUB_HUES.length] })
hubList.forEach((h, i) => {
  const ang = (i / Hn) * Math.PI * 2 - Math.PI / 2
  pos[h.id] = { x: CX + Math.cos(ang) * Rh, y: CY + Math.sin(ang) * Rh, ang, r: hubR(h) }
})
// 每个 hub 的公司聚成一簇「枝叶」紧贴 hub 外侧(短辐射,不再是一圈机械的点)
hubList.forEach((h) => {
  const base = pos[h.id].ang
  const kids = childrenOf[h.id]
  const m = kids.length
  const arc = Math.min(Math.PI / 5.2, 0.2 + m * 0.062) // 扇面随子数增大,封顶防重叠
  kids.forEach((c, k) => {
    const t = m === 1 ? 0 : k / (m - 1) - 0.5
    const ang = base + t * arc
    const rr = Rh + 98 + (k % 2) * 46 // 紧贴 hub 外侧,双层错开(节点变大故拉开层距)
    pos[c.id] = { x: CX + Math.cos(ang) * rr, y: CY + Math.sin(ang) * rr, ang, r: leafR(c) }
    assignedHub[c.id] = h.id
  })
})
// 孤立叶子:放在已定位邻居的平均角度外侧(无邻居则按序铺)
orphans.forEach((c, k) => {
  let ax = 0, ay = 0, cnt = 0
  for (const nb of adj[c.id]) if (pos[nb]) { ax += Math.cos(pos[nb].ang); ay += Math.sin(pos[nb].ang); cnt++ }
  const baseAng = cnt ? Math.atan2(ay, ax) : (k / Math.max(1, orphans.length)) * Math.PI * 2 + 0.2
  const ang = baseAng + (k % 2 ? 0.14 : -0.14) // 轻微错开,避免互为孤点者初始重合
  const rr = Rh + 150 + (k % 3) * 16
  pos[c.id] = { x: CX + Math.cos(ang) * rr, y: CY + Math.sin(ang) * rr, ang, r: leafR(c) }
})

// 去重叠:结构化布局后做若干次同步松弛,保证节点不相互压盖(一次性静态计算,无动画)
// 枢纽固定为骨架;仅推开相互重叠的公司/孤点;并设中心留白区,防止侵入机器人
{
  const ids = Object.keys(pos)
  const movable = new Set(ids.filter((id) => !hubIds.has(id)))
  const PAD = 6, KEEPOUT = 134
  for (let iter = 0; iter < 70; iter++) {
    for (let a = 0; a < ids.length; a++) {
      for (let b = a + 1; b < ids.length; b++) {
        const A = pos[ids[a]], B = pos[ids[b]]
        const dx = B.x - A.x, dy = B.y - A.y
        let d = Math.hypot(dx, dy), ux, uy
        if (d < 0.5) { const ja = a * 2.3999; ux = Math.cos(ja); uy = Math.sin(ja); d = 0 } // 重合:用确定性方向强制分开
        else { ux = dx / d; uy = dy / d }
        const need = A.r + B.r + PAD
        if (d < need) {
          const push = need - d
          const am = movable.has(ids[a]), bm = movable.has(ids[b])
          if (am && bm) { A.x -= ux * push / 2; A.y -= uy * push / 2; B.x += ux * push / 2; B.y += uy * push / 2 }
          else if (am) { A.x -= ux * push; A.y -= uy * push }
          else if (bm) { B.x += ux * push; B.y += uy * push }
        }
      }
    }
    for (const id of movable) {
      const N = pos[id]
      const dx = N.x - CX, dy = N.y - CY
      const d = Math.hypot(dx, dy) || 0.01
      const minD = KEEPOUT + N.r
      if (d < minD) { N.x = CX + (dx / d) * minD; N.y = CY + (dy / d) * minD }
    }
  }
  for (const id of ids) pos[id].ang = Math.atan2(pos[id].y - CY, pos[id].x - CX) // 标签方向按最终位置重算
}

// 节点颜色 = 所属集群色(枢纽用自身色,公司用其枢纽色,孤立点用中性钢蓝)
const colorOf = (id) => (hubIds.has(id) ? hubHue[id] : assignedHub[id] ? hubHue[assignedHub[id]] : '#9fb1d4')

const allRaw = [...hubList, ...leafList]
const nodes = reactive(allRaw.filter((n) => pos[n.id]).map((n) => {
  const p = pos[n.id]
  const out = p.r + 7
  const lx = p.x + Math.cos(p.ang) * out
  const ly = p.y + Math.sin(p.ang) * out
  return {
    id: n.id, label: n.name, initial: initialOf(n.name),
    kind: regionKind(n), r: p.r, website: n.website || null, color: colorOf(n.id),
    x: p.x, y: p.y, ang: p.ang, lx, ly,
    anchor: Math.cos(p.ang) >= 0 ? 'start' : 'end',
    show: hubIds.has(n.id) || (isCompany(n.id) && ((n.fundingAmount || 0) >= 3e8 || (n.valuation || 0) >= 1.5e9)), // 默认标 hub + 重点公司
  }
}))
const hubs = nodes.filter((n) => hubIds.has(n.id))

const nodeMap = computed(() => Object.fromEntries(nodes.map((n) => [n.id, n])))
const validIds = new Set(nodes.map((n) => n.id))
const edges = rels
  .filter((e) => validIds.has(e.source) && validIds.has(e.target))
  .map((e) => {
    const primary = assignedHub[e.source] === e.target || assignedHub[e.target] === e.source
    const hubEnd = hubIds.has(e.source) ? e.source : e.target
    return { ...e, primary, color: primary ? hubHue[hubEnd] || null : null }
  })

const nbset = {}
nodes.forEach((n) => (nbset[n.id] = new Set([n.id])))
edges.forEach((e) => { nbset[e.source].add(e.target); nbset[e.target].add(e.source) })
const nodeActive = (id) => hoverId.value && nbset[hoverId.value]?.has(id)
const edgeActive = (e) => hoverId.value && (e.source === hoverId.value || e.target === hoverId.value)

// 控制点向「远离中心」方向外推 —— 连线绕开核心成弧,不再横切中央
function edgePath(e) {
  const a = nodeMap.value[e.source], b = nodeMap.value[e.target]
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const dist = Math.hypot(b.x - a.x, b.y - a.y) || 1
  let cdx = mx - CX, cdy = my - CY
  const cl = Math.hypot(cdx, cdy) || 1
  const off = Math.min(dist * 0.24, 130)
  const qx = mx + (cdx / cl) * off, qy = my + (cdy / cl) * off
  return `M ${a.x} ${a.y} Q ${qx} ${qy} ${b.x} ${b.y}`
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

/* 中心机器人 */
.center-aura { fill: rgba(110, 140, 255, 0.13); filter: url(#kg-glow-strong); pointer-events: none; }
.center-robot { color: #cbdcff; pointer-events: none; }
.cr-stroke { filter: url(#kg-glow); opacity: 0.92; }
.cr-eye { fill: #7dd3fc; filter: url(#kg-glow); }
.cr-joint { fill: #7dd3fc; }

/* 关系边:主辐射(hub→子公司)亮,跨投资等次要边默认很淡,悬停再点亮 */
/* 主辐射边用集群色(行内 stroke);次要/跨投资边中性极淡;虚线区分合作/孵化 */
.edge { fill: none; stroke: #6e80ad; stroke-width: 1; opacity: 0.12; transition: opacity 0.2s, stroke-width 0.2s; }
.edge.primary { opacity: 0.55; stroke-width: 1.4; }
.edge.active { stroke-width: 2.4; opacity: 1; }
.edge.dim { opacity: 0.04; }
.edge-partner { stroke-dasharray: 5 4; }
.edge-incubate { stroke-dasharray: 2 5; }

/* 节点:发光球 */
.node { cursor: default; }
.node.clickable { cursor: pointer; }
/* 节点色 = 所属集群色(行内 --c);扁平半透明 + 同色亮环 + 同色柔光 */
.node-orb {
  fill: var(--c); fill-opacity: 0.4; stroke: var(--c); stroke-width: 1.4;
  filter: url(#kg-glow); transition: opacity 0.2s, fill-opacity 0.2s;
}
/* 公司=生态主体:环更亮更实,把视觉焦点拉到公司上(填充仍半透明) */
.node-cn .node-orb, .node-intl .node-orb { fill-opacity: 0.44; stroke-width: 2.2; }
/* 投资方/机构=枢纽:更透明、环更柔,退为结构骨架,让位给公司 */
.node-conn .node-orb { fill-opacity: 0.18; stroke-width: 1.2; stroke-opacity: 0.7; }
.node.focus .node-orb { filter: url(#kg-glow-strong); stroke-width: 2.4; fill-opacity: 0.88; }
.is-hovering .node:not(.dim) .node-orb { fill-opacity: 0.72; }
.node.dim { opacity: 0.16; }

.node-initial {
  text-anchor: middle; fill: #fff; fill-opacity: 0.96; font-weight: 700; letter-spacing: -0.02em;
  paint-order: stroke; stroke: rgba(5, 8, 24, 0.3); stroke-width: 0.6px;
  pointer-events: none; user-select: none;
}
/* 标签:默认只显 hub + 大公司(showlabel);悬停时显焦点邻居,大幅去拥挤 */
.node-label {
  font-size: 9.5px; font-weight: 500; fill: rgba(220, 230, 252, 0.85);
  paint-order: stroke; stroke: rgba(4, 6, 16, 0.92); stroke-width: 2.6px;
  pointer-events: none; user-select: none; opacity: 0; transition: opacity 0.2s, fill 0.2s;
}
.node.showlabel .node-label { opacity: 0.82; }
/* 标签统一浅色(不再按类别上色,颜色已交给集群)*/
.is-hovering .node:not(.dim) .node-label { opacity: 1; fill: #fff; }
.is-hovering .node.dim .node-label { opacity: 0; }
.node.focus .node-label { opacity: 1; fill: #fff; font-weight: 600; }

.kg-legend {
  position: absolute; top: 14px; left: 16px; z-index: 3;
  display: flex; flex-direction: column; gap: 7px;
  padding: 9px 13px; font-size: 0.72rem; color: rgba(203, 213, 235, 0.86);
  background: rgba(6, 10, 26, 0.5); border: 1px solid rgba(96, 130, 220, 0.22);
  border-radius: 9px; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.lg-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.lg-item { display: inline-flex; align-items: center; gap: 6px; }
.dot { border-radius: 50%; background: #cbd5f0; box-shadow: 0 0 7px rgba(180, 200, 255, 0.7); }
.dot-hub { width: 12px; height: 12px; opacity: 0.7; }
.dot-leaf { width: 11px; height: 11px; }
.ln { width: 18px; height: 0; border-top: 2px solid rgba(190, 205, 240, 0.85); }
.ln-dash { border-top-style: dashed; }

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
html.skin-archive .center-robot { color: #f0d2a8; }
html.skin-archive .cr-eye, html.skin-archive .cr-joint { fill: #f4b86a; }
html.skin-archive .center-aura { fill: rgba(201, 140, 70, 0.13); }
html.skin-archive .kg-wrap {
  background:
    radial-gradient(ellipse 50% 42% at 50% 49%, rgba(176, 106, 46, 0.2), transparent 70%),
    radial-gradient(ellipse 80% 70% at 50% 49%, rgba(154, 51, 36, 0.14), transparent 72%),
    radial-gradient(ellipse 120% 100% at 50% 45%, #1c1108 0%, #120a04 55%, #0a0502 100%);
  border-color: rgba(201, 123, 90, 0.24);
}
</style>
