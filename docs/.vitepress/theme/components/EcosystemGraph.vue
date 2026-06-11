<template>
  <div class="kg-wrap" ref="wrapEl">
    <div class="kg-legend">
      <span class="lg-item"><i class="dot dot-leaf"></i>公司</span>
      <span class="lg-item"><i class="dot dot-hub"></i>投资方/机构</span>
      <span class="lg-item"><i class="dot dot-mentor"></i>导师/科学家</span>
      <span class="lg-sep"></span>
      <span class="lg-item">同色 = 同一投资集群</span>
      <span class="lg-item"><i class="ln ln-solid"></i>投资/控股</span>
      <span class="lg-item"><i class="ln ln-dash"></i>合作/孵化</span>
      <span class="lg-readout" aria-hidden="true"><b>{{ stat.companies }}</b>公司<b>{{ stat.hubs }}</b>投资方<b>{{ stat.mentors }}</b>学者<b>{{ stat.edges }}</b>关系</span>
    </div>
    <div class="kg-hint">拖拽平移 · 滚轮缩放 · 悬停高亮关联 · 点击访问官网</div>

    <!-- 缩放 / 复位控制(玻璃 HUD,左下角) -->
    <div class="kg-zoom" role="group" aria-label="图谱缩放">
      <button type="button" class="kg-zoom__btn" @click="zoomBy(1.2)" title="放大" aria-label="放大">+</button>
      <button type="button" class="kg-zoom__btn" @click="zoomBy(1/1.2)" title="缩小" aria-label="缩小">−</button>
      <button type="button" class="kg-zoom__btn kg-zoom__btn--reset" @click="resetView" title="复位视图" aria-label="复位视图">↺</button>
    </div>

    <!-- 目标读出坞:悬停节点的档案读出(细节按需;空态显引导) -->
    <aside class="kg-dock" :class="{ 'has-target': hoverInfo }" aria-live="polite">
      <div class="kg-dock__tag">TARGET READOUT</div>
      <template v-if="hoverInfo">
        <div class="kg-dock__name">
          {{ hoverInfo.name }}<span v-if="hoverInfo.sub" class="kg-dock__sub">{{ hoverInfo.sub }}</span>
        </div>
        <div class="kg-dock__meta">
          <span class="kg-dock__kind">{{ hoverInfo.kind }}</span>
          <span v-if="hoverInfo.founded" class="kg-dock__founded">{{ hoverInfo.founded }} 创立</span>
        </div>
        <div v-if="hoverInfo.funding" class="kg-dock__funding">{{ hoverInfo.funding }}</div>
        <p v-if="hoverInfo.desc" class="kg-dock__desc">{{ hoverInfo.desc }}</p>
        <div v-if="hoverInfo.website" class="kg-dock__hint">点击节点访问官网 ↗</div>
      </template>
      <div v-else class="kg-dock__empty">悬停节点 → 读出档案</div>
    </aside>

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
          <stop offset="66%" stop-color="#2563eb" />
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
        <!-- 中心能量核心:背景光晕(青核→蓝→透明) -->
        <radialGradient id="cr-aura" cx="50%" cy="46%" r="58%">
          <stop offset="0%" stop-color="rgba(125, 211, 252, 0.24)" />
          <stop offset="55%" stop-color="rgba(99, 140, 246, 0.12)" />
          <stop offset="100%" stop-color="rgba(99, 140, 246, 0)" />
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
        <filter id="kg-glow-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g :transform="`translate(${pan.x},${pan.y}) scale(${zoom})`" :class="{ 'is-hovering': hoverId }">
        <!-- 背景轨道环 -->
        <g class="orbits">
          <circle v-for="(r, i) in orbitRings" :key="'o' + i" :cx="CX" :cy="CY" :r="r" class="orbit" />
        </g>
        <!-- 扫描仪光点:沿外环匀速绕行(雷达追踪意象) -->
        <circle :cx="CX" :cy="CY" :r="orbitRings[orbitRings.length - 1]" class="orbit-scan" />

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

        <!-- 数据流光:沿主辐射边匀速流动的发光数据包(同集群色,无滤镜以保性能) -->
        <g class="edge-flow">
          <template v-for="(e, i) in flowEdges" :key="'f' + i">
            <path :d="edgePath(e)" pathLength="100" class="flow flow-halo"
              :style="{ stroke: e.color || '#7dd3fc', animationDelay: flowDelay(i) }" />
            <path :d="edgePath(e)" pathLength="100" class="flow flow-core"
              :style="{ stroke: e.color || '#7dd3fc', animationDelay: flowDelay(i) }" />
          </template>
        </g>

        <!-- 中心:发光机器人线稿(具身智能意象,填补留白) -->
        <circle :cx="CX" :cy="CY" r="126" class="center-aura" />
        <g class="energy-core" :transform="`translate(${CX} ${CY})`">
          <!-- 六边封装框 -->
          <path class="ec-frame" d="M98 0 L49 84.9 L-49 84.9 L-98 0 L-49 -84.9 L49 -84.9 Z" />
          <!-- 外层虚线 reticle 环(缓转) -->
          <circle class="ec-reticle" r="82" />
          <!-- 中环 + 八向刻度 -->
          <circle class="ec-ring" r="58" />
          <g class="ec-ticks">
            <line x1="58" y1="0" x2="70" y2="0" /><line x1="41" y1="41" x2="49.5" y2="49.5" />
            <line x1="0" y1="58" x2="0" y2="70" /><line x1="-41" y1="41" x2="-49.5" y2="49.5" />
            <line x1="-58" y1="0" x2="-70" y2="0" /><line x1="-41" y1="-41" x2="-49.5" y2="-49.5" />
            <line x1="0" y1="-58" x2="0" y2="-70" /><line x1="41" y1="-41" x2="49.5" y2="-49.5" />
          </g>
          <!-- 倾斜轨道 + 绕行电子(平面=倾斜+压扁;内层 ec-spin 绕中心自转→电子沿椭圆轨道运行) -->
          <g class="ec-plane" transform="rotate(-20) scale(1 0.4)">
            <circle class="ec-orbit-ring" r="84" />
            <g class="ec-spin">
              <circle class="ec-electron" cx="84" cy="0" r="5" /><circle class="ec-electron" cx="0" cy="84" r="5" />
              <circle class="ec-electron" cx="-84" cy="0" r="5" /><circle class="ec-electron" cx="0" cy="-84" r="5" />
            </g>
          </g>
          <!-- 炽核 -->
          <circle class="ec-nucleus-glow" r="38" />
          <circle class="ec-nucleus" r="18" />
          <circle class="ec-hot" r="9.5" />
        </g>

        <!-- 节点:球 + 首字(可交互) -->
        <g
          v-for="(n, ni) in nodes"
          :key="n.id"
          :class="['node', `node-${n.kind}`, { dim: hoverId && !nodeActive(n.id), focus: hoverId === n.id, clickable: !!n.website }]"
          :style="{ '--c': n.color, '--i': ni, '--pr': n.r + 'px' }"
          @pointerenter="hoverId = n.id"
          @pointerleave="hoverId = null"
          @click="onNodeClick(n)"
        >
          <!-- 悬停声呐:聚焦节点向外扩散的发光环 -->
          <circle :cx="n.x" :cy="n.y" :r="n.r" class="ping" />
          <circle :cx="n.x" :cy="n.y" :r="n.r" class="ping ping--2" />
          <circle :cx="n.x" :cy="n.y" :r="n.r" class="node-orb" />
          <svg
            v-if="n.kind === 'mentor'"
            :x="n.x - n.r" :y="n.y - n.r" :width="n.r * 2" :height="n.r * 2"
            viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="node-person"
          ><path d="M12 12.3a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 1.9c-3.3 0-6.4 1.8-6.4 5V20h12.8v-.8c0-3.2-3.1-5-6.4-5Z" /></svg>
          <svg
            v-else-if="n.logo"
            :x="n.x - n.logoS / 2" :y="n.y - n.logoS / 2" :width="n.logoS" :height="n.logoS"
            :viewBox="n.logo.vb" preserveAspectRatio="xMidYMid meet" class="node-logo"
            v-html="n.logo.body"
          />
          <text v-else :x="n.x" :y="n.y" class="node-initial" dy="0.34em" :style="{ fontSize: Math.round(Math.max(9, Math.min(14, n.r * 0.82))) + 'px' }">{{ n.initial }}</text>
        </g>
        <!-- 标签:单独置于最上层,任何时候都清晰可读(不被相邻节点压住) -->
        <g class="labels">
          <text
            v-for="n in nodes"
            :key="'l' + n.id"
            :x="n.lx" :y="n.ly" :text-anchor="n.anchor" dy="0.32em"
            :class="['node-label', n.kind === 'mentor' && 'lbl-mentor', { showlabel: n.show, dim: hoverId && !nodeActive(n.id), focus: hoverId === n.id }]"
          >{{ n.label }}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import data from '../../../ecosystem/companies-data.json'
import logos from './investor-logos.json'

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

// 「目标读出坞」(2026-06-10;细节按需 details-on-demand):悬停节点 → 右上角固定
// HUD 面板读出该主体档案(名称/类型/成立/融资/简介)。做固定坞而非跟随气泡:
// 图谱有平移缩放,锚定坐标随变换漂移;固定读出更稳,也与雷达控制台语言一致,
// 且绝无指针跟随感(本站红线)。字段缺失即不渲染,不编造。
const infoById = (() => {
  const m = {}
  for (const c of data.companies || []) {
    m[c.id] = {
      kind: '公司',
      name: c.nameZh || c.name || c.id,
      sub: c.nameZh && c.name && c.name !== c.nameZh ? c.name : '',
      founded: c.founded || '',
      funding: c.funding || '',
      desc: c.description || '',
      website: c.website || '',
    }
  }
  for (const c of data.connectors || []) {
    m[c.id] = {
      kind: '投资方/机构',
      name: c.nameZh || c.name || c.id,
      sub: '',
      founded: '',
      funding: '',
      desc: c.description || c.desc || '',
      website: c.website || '',
    }
  }
  for (const c of data.mentors || []) {
    m[c.id] = {
      kind: '导师/科学家',
      name: c.nameZh || c.name || c.id,
      sub: c.affiliation || c.org || '',
      founded: '',
      funding: '',
      desc: c.description || c.desc || '',
      website: c.website || '',
    }
  }
  return m
})()
const hoverInfo = computed(() => (hoverId.value && infoById[hoverId.value]) || null)

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
const mentors = (data.mentors || []).filter((c) => linked.has(c.id)) // 知名导师/科学家

const deg = {}
;[...companies, ...connectors, ...mentors].forEach((n) => (deg[n.id] = 0))
rels.forEach((r) => { if (deg[r.source] != null) deg[r.source]++; if (deg[r.target] != null) deg[r.target]++ })

const adj = {}
;[...companies, ...connectors, ...mentors].forEach((n) => (adj[n.id] = []))
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
const isMentor = (id) => mentors.some((m) => m.id === id)
const MENTOR_HUE = '#fcd34d' // 导师/科学家统一学术金,自成一类
const regionKind = (n) => (isMentor(n.id) ? 'mentor' : isCompany(n.id) ? (n.region === 'china' ? 'cn' : 'intl') : 'conn')
// 投资方枢纽适当收敛,让位给公司(17.5–23px)
const hubR = (h) => 15 + Math.min(8, (deg[h.id] || 0) * 1.25)
// 公司=生态主体,做成最醒目的节点(重点公司 ≥ 枢纽;12–23px);次要连接点 11px
const leafR = (n) => (isCompany(n.id) ? 12 + Math.min(11, Math.sqrt((n.fundingAmount || 0) / 1e8) * 2.6) : 11)
const mentorR = 11 // 导师固定小尺寸,靠金色 + 姓名标签吸睛,不与公司争大小

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

// 导师/科学家:沿径向放到所属公司更外侧(公司在内、导师在外),多位则张开扇面,再交给松弛去重叠
const mByComp = {}
mentors.forEach((mt) => {
  const comp = (adj[mt.id] || []).find((nb) => isCompany(nb) && pos[nb])
  if (comp) (mByComp[comp] = mByComp[comp] || []).push(mt)
})
Object.entries(mByComp).forEach(([comp, list]) => {
  const cp = pos[comp]
  const baseR = Math.hypot(cp.x - CX, cp.y - CY)
  const m = list.length
  const spread = Math.min(Math.PI / 6, 0.16 + m * 0.07)
  list.forEach((mt, k) => {
    const t = m === 1 ? 0 : k / (m - 1) - 0.5
    const ang = cp.ang + t * spread
    const rr = baseR + cp.r + 26 + (k % 2) * 20
    pos[mt.id] = { x: CX + Math.cos(ang) * rr, y: CY + Math.sin(ang) * rr, ang, r: mentorR }
  })
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

// 节点颜色 = 所属集群色(导师用学术金;枢纽用自身色,公司用其枢纽色,孤立点用中性钢蓝)
const colorOf = (id) => (isMentor(id) ? MENTOR_HUE : hubIds.has(id) ? hubHue[id] : assignedHub[id] ? hubHue[assignedHub[id]] : '#9fb1d4')

const allRaw = [...hubList, ...leafList, ...mentors]
const nodes = reactive(allRaw.filter((n) => pos[n.id]).map((n) => {
  const p = pos[n.id]
  const out = p.r + 9
  const lx = p.x + Math.cos(p.ang) * out
  const ly = p.y + Math.sin(p.ang) * out
  const lbl = isMentor(n.id) ? (n.nameZh || n.name) : n.name
  return {
    id: n.id, label: lbl, initial: initialOf(lbl),
    kind: regionKind(n), r: p.r, website: n.website || null, color: colorOf(n.id),
    x: p.x, y: p.y, ang: p.ang, lx, ly,
    anchor: Math.cos(p.ang) >= 0 ? 'start' : 'end',
    logo: logos[n.id] || null, logoS: Math.round(p.r * 1.3), // 投资方/机构有 logo 则用 logo,否则回退首字
    show: hubIds.has(n.id) || isMentor(n.id) || (isCompany(n.id) && ((n.fundingAmount || 0) >= 2e8 || (n.valuation || 0) >= 1.5e9)), // 默认标 hub + 导师 + 重点公司
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

// 主辐射边(hub→子公司):承载流动数据光的「干线」,数量小(≈公司数)故可常驻动画
const flowEdges = edges.filter((e) => e.primary)
// 负延迟把各数据包初始相位错开,铺满整个流动周期 —— 一上来就是连续流,而非齐步走
function flowDelay(i) { return (-(((i * 0.37) % 2.9))).toFixed(2) + 's' }

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

// ===== 缩放 / 复位控制(配合滚轮缩放与拖拽平移)=====
function zoomBy(f) { zoom.value = Math.max(0.45, Math.min(2.6, zoom.value * f)) }
function resetView() { zoom.value = 1; pan.x = 0; pan.y = 0 }
// 规模读出:数据驱动(随 companies-data.json 自动更新,绝不写死)
const stat = { companies: companies.length, hubs: connectors.length, mentors: mentors.length, edges: edges.length }
</script>

<style scoped>
/* 舞台:近黑深空 + 星云 + 星点(对标知识图谱大屏) */
.kg-wrap {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 50% 42% at 50% 49%, rgba(37, 99, 235, 0.22), transparent 70%),
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

/* 轨道环:虚线刻度环(扫描仪/量程意象) */
.orbit { fill: none; stroke: rgba(120, 150, 230, 0.16); stroke-width: 1; stroke-dasharray: 3 11; }
/* 扫描光点:沿外环匀速绕行的发光弧(单段弧 + 超长间隙 → 只见一点环绕) */
.orbit-scan {
  fill: none; stroke: #7dd3fc; stroke-width: 2; stroke-linecap: round;
  stroke-dasharray: 34 4000; opacity: 0; pointer-events: none;
  filter: drop-shadow(0 0 5px rgba(125, 211, 252, 0.85));
}

/* 中心能量核心(反应堆:六边框 + 同心环/刻度 + 倾斜轨道电子 + 炽核 + 多层辉光) */
.center-aura { fill: url(#cr-aura); filter: url(#kg-glow-strong); pointer-events: none; }
.energy-core { pointer-events: none; }
.ec-frame { fill: none; stroke: #3f6db0; stroke-width: 1.2; opacity: 0.45; }
.ec-reticle { fill: none; stroke: #7dd3fc; stroke-width: 1.4; stroke-dasharray: 3 9; opacity: 0.6; }
.ec-ring { fill: none; stroke: #7dd3fc; stroke-width: 2; opacity: 0.8; filter: url(#kg-glow); }
.ec-ticks line { stroke: #aee6ff; stroke-width: 2; stroke-linecap: round; opacity: 0.7; }
.ec-orbit-ring { fill: none; stroke: #9bb6e8; stroke-width: 1; opacity: 0.45; }
.ec-electron { fill: #aef0ff; filter: url(#kg-glow-soft); }
.ec-nucleus-glow { fill: rgba(125, 211, 252, 0.18); filter: url(#kg-glow-strong); }
.ec-nucleus { fill: #7dd3fc; opacity: 0.55; filter: url(#kg-glow); }
.ec-hot { fill: #eafdff; filter: url(#kg-glow); }
/* 电子组绕中心自转(fill-box → transform-origin 落在自身 bbox 中心 = 轨道中心) */
.ec-spin { transform-box: fill-box; transform-origin: center; }

/* 关系边:主辐射(hub→子公司)亮,跨投资等次要边默认很淡,悬停再点亮 */
/* 主辐射边用集群色(行内 stroke);次要/跨投资边中性极淡;虚线区分合作/孵化 */
.edge { fill: none; stroke: #6e80ad; stroke-width: 1; opacity: 0.12; transition: opacity 0.2s, stroke-width 0.2s; }
.edge.primary { opacity: 0.55; stroke-width: 1.4; }
.edge.active { stroke-width: 2.4; opacity: 1; }
.edge.dim { opacity: 0.04; }
.edge-partner { stroke-dasharray: 5 4; }
.edge-incubate { stroke-dasharray: 2 5; }
/* 导师→公司连线:学术金,比普通次要边更显眼;顾问为虚线 */
.edge-found, .edge-advise { stroke: #d9b24f; opacity: 0.42; }
.edge-advise { stroke-dasharray: 4 4; }

/* 数据流光:pathLength=100 归一化 → 无论边长,单个数据包以相同节奏贯穿整条边 */
/* 核心亮包 + 外层光晕(同色低透明),不用 SVG 滤镜即得霓虹拖尾,常驻也不卡 */
.flow { fill: none; stroke-linecap: round; stroke-dasharray: 7 93; opacity: 0; pointer-events: none; }
.flow-halo { stroke-width: 6; }
.flow-core { stroke-width: 2.1; }
/* 悬停时数据流整体压暗,把视觉让给高亮子图 */
.is-hovering .edge-flow { opacity: 0.16; transition: opacity 0.2s; }

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
/* 投资方/机构=枢纽:更透明、柔光更弱,退为结构骨架,让位给公司 */
.node-conn .node-orb { fill-opacity: 0.2; stroke-width: 1.3; stroke-opacity: 0.6; filter: url(#kg-glow-soft); }
/* 导师/科学家=学术金小节点,自成一类(人物图标 + 默认姓名) */
.node-mentor .node-orb { fill-opacity: 0.14; stroke-width: 1.5; stroke-opacity: 0.95; filter: url(#kg-glow-soft); }
.node-person { fill: #fde9a8; pointer-events: none; }
.node.focus .node-orb { filter: url(#kg-glow-strong); stroke-width: 2.4; fill-opacity: 0.88; }
.is-hovering .node:not(.dim) .node-orb { fill-opacity: 0.72; }
.node.dim { opacity: 0.16; }
/* 声呐环:默认隐形,仅聚焦节点播放扩散动画(见下方 reduced-motion 区) */
.ping { fill: none; stroke: var(--c); stroke-width: 1.5; opacity: 0; pointer-events: none; }

.node-initial {
  text-anchor: middle; fill: #fff; fill-opacity: 0.96; font-weight: 700; letter-spacing: -0.02em;
  paint-order: stroke; stroke: rgba(5, 8, 24, 0.3); stroke-width: 0.6px;
  pointer-events: none; user-select: none;
}
/* 投资方/机构 logo:单色,染成所属集群色并提亮以保证在半透明球上清晰 */
.node-logo { fill: var(--c); color: var(--c); filter: brightness(1.9) saturate(1.1); pointer-events: none; overflow: visible; }
.node-logo :deep(path) { fill: var(--c); }
/* 标签:默认只显 hub + 大公司(showlabel);悬停时显焦点邻居,大幅去拥挤 */
.node-label {
  font-size: 9.5px; font-weight: 500; fill: rgba(220, 230, 252, 0.85);
  paint-order: stroke; stroke: rgba(4, 6, 16, 0.92); stroke-width: 2.6px;
  pointer-events: none; user-select: none; opacity: 0; transition: opacity 0.2s, fill 0.2s;
}
.node-label.showlabel { opacity: 0.82; }
/* 导师姓名标签:学术金,区别于公司/枢纽的浅色标签 */
.node-label.lbl-mentor { fill: #fcd34d; }
/* 标签统一浅色(不再按类别上色,颜色已交给集群)*/
.is-hovering .node-label:not(.dim) { opacity: 1; fill: #fff; }
.is-hovering .node-label.dim { opacity: 0; }
.node-label.focus { opacity: 1; fill: #fff; font-weight: 600; }

/* 图例:置于图谱上方的独立横条,不再浮在画布上遮挡节点 */
.kg-legend {
  position: relative; z-index: 2;
  display: flex; flex-wrap: wrap; align-items: center; gap: 7px 16px;
  padding: 10px 16px; font-size: 0.72rem; color: rgba(203, 213, 235, 0.86);
  background: rgba(8, 12, 28, 0.62); border-bottom: 1px solid rgba(96, 130, 220, 0.18);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.lg-item { display: inline-flex; align-items: center; gap: 6px; }
.lg-sep { width: 1px; height: 13px; background: rgba(150, 170, 230, 0.28); }
.dot { border-radius: 50%; background: #cbd5f0; box-shadow: 0 0 7px rgba(180, 200, 255, 0.7); }
.dot-hub { width: 12px; height: 12px; opacity: 0.7; }
.dot-leaf { width: 11px; height: 11px; }
.dot-mentor { width: 11px; height: 11px; background: #fcd34d; box-shadow: 0 0 7px rgba(252, 211, 77, 0.7); }
.ln { width: 18px; height: 0; border-top: 2px solid rgba(190, 205, 240, 0.85); }
.ln-dash { border-top-style: dashed; }

.kg-hint {
  position: absolute; bottom: 12px; right: 16px; z-index: 3;
  font-size: 0.68rem; color: rgba(148, 163, 200, 0.6); pointer-events: none;
}

/* 图例右侧:规模读出(mono · 等宽数字),让顶栏成为"仪表头" */
.lg-readout {
  margin-left: auto; display: inline-flex; align-items: baseline;
  font-family: var(--vp-font-family-mono); font-size: 0.68rem; letter-spacing: 0.02em;
  color: rgba(170, 190, 230, 0.66);
}
.lg-readout b {
  font-weight: 700; color: #8fd6ff; font-variant-numeric: tabular-nums;
  margin: 0 4px 0 12px;
}
.lg-readout b:first-child { margin-left: 0; }

/* 缩放 / 复位:玻璃 HUD 按钮(左下角) */
.kg-zoom {
  position: absolute; left: 14px; bottom: 12px; z-index: 5;
  display: inline-flex; gap: 6px;
}
.kg-zoom__btn {
  width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center;
  font-size: 17px; line-height: 1; font-weight: 600;
  color: rgba(203, 220, 255, 0.9);
  background: rgba(12, 18, 40, 0.66);
  border: 1px solid rgba(110, 150, 230, 0.32); border-radius: 8px; cursor: pointer;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.18s, color 0.18s, background-color 0.18s, box-shadow 0.18s, transform 0.1s;
}
.kg-zoom__btn:hover {
  color: #aef0ff; border-color: rgba(120, 200, 255, 0.7); background: rgba(24, 40, 80, 0.72);
  box-shadow: 0 0 0 1px rgba(120, 200, 255, 0.4), 0 0 16px rgba(56, 189, 248, 0.3);
}
.kg-zoom__btn:active { transform: translateY(1px); }
.kg-zoom__btn--reset { font-size: 15px; }

/* ===== 动效层:全部仅在用户未要求减少动效时启用(reduced-motion 下退回静态图) ===== */
@media (prefers-reduced-motion: no-preference) {
  /* 中心能量核心:光晕呼吸 + 炽核脉动 + reticle 缓转 + 电子绕行 */
  .center-aura { animation: kgAura 5.5s ease-in-out infinite; }
  .ec-hot { animation: crCore 2.6s ease-in-out infinite; }
  .ec-reticle { animation: crReticle 12s linear infinite; }
  .ec-spin { animation: ecSpin 18s linear infinite; }

  /* 轨道环:虚线缓慢爬行(双环异速反向,似量程盘转动) */
  .orbit { animation: kgOrbit 30s linear infinite; }
  .orbit:nth-child(2) { animation-duration: 44s; animation-direction: reverse; }
  /* 扫描光点:沿外环绕行一周 */
  .orbit-scan { opacity: 0.55; animation: kgScan 7s linear infinite; }

  /* 数据流光:核心包与光晕同步流动,首尾淡入淡出避免在节点处突现 */
  .flow-core { animation: kgFlowCore 2.9s linear infinite; }
  .flow-halo { animation: kgFlowHalo 2.9s linear infinite; }

  /* 悬停声呐:聚焦节点持续向外扩散两道环 */
  .node.focus .ping { animation: kgPing 1.7s ease-out infinite; }
  .node.focus .ping--2 { animation-delay: 0.85s; }

  /* 上电入场:节点按序淡入(逐个点亮),边/轨道整体淡入 */
  .node { animation: kgFade 0.5s ease backwards; animation-delay: calc(var(--i) * 9ms); }
  .edges, .orbits, .energy-core { animation: kgFade 1.1s ease both; }
  .edge-flow { animation: kgFade 1.4s ease 0.3s backwards; }
}
@keyframes kgAura { 0%, 100% { opacity: 0.62; } 50% { opacity: 1; } }
@keyframes crCore { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }
@keyframes crReticle { to { stroke-dashoffset: -44; } }
@keyframes ecSpin { to { transform: rotate(360deg); } }
@keyframes kgOrbit { to { stroke-dashoffset: -280; } }
@keyframes kgScan { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -4034; } }
@keyframes kgFlowCore {
  0% { stroke-dashoffset: 100; opacity: 0; }
  12% { opacity: 0.95; }
  88% { opacity: 0.95; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes kgFlowHalo {
  0% { stroke-dashoffset: 100; opacity: 0; }
  12% { opacity: 0.3; }
  88% { opacity: 0.3; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes kgPing {
  0% { r: var(--pr); opacity: 0.5; }
  70% { opacity: 0.12; }
  100% { r: calc(var(--pr) + 30px); opacity: 0; }
}
@keyframes kgFade { from { opacity: 0; } to { opacity: 1; } }

@media (max-width: 640px) {
  .kg-legend { font-size: 0.62rem; padding: 8px 10px; gap: 4px; }
  .kg-hint { display: none; }
  .lg-readout { display: none; }
  .node-label { font-size: 8.5px; }
  .kg-zoom__btn { width: 40px; height: 40px; font-size: 19px; }
  .kg-zoom__btn--reset { font-size: 17px; }
  /* 数据流光在小屏关闭(让出动画预算,保滚动流畅);雷达/扫描点保留 */
  .edge-flow { display: none; }
}
@media (pointer: coarse) {
  .kg-zoom__btn { width: 40px; height: 40px; }
  .edge-flow { display: none; }
}

/* —— 目标读出坞(细节按需):画布恒深空 → 坞恒深色,不随主题翻转 —— */
.kg-dock {
  position: absolute;
  bottom: 14px; /* 右下角:与左下 kg-zoom 对角呼应,避开顶部图例读出条 */
  right: 12px;
  z-index: 4;
  width: 222px;
  max-width: 46%;
  padding: 10px 12px;
  background: rgba(13, 21, 38, 0.88);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 10px;
  font-family: var(--vp-font-family-mono, monospace);
  pointer-events: none;
  box-shadow: 0 10px 30px rgba(8, 13, 28, 0.5), inset 0 0 0 1px rgba(56, 189, 248, 0.04);
}
.kg-dock.has-target { border-color: rgba(56, 189, 248, 0.45); }
.kg-dock__tag { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.16em; color: #38bdf8; opacity: 0.85; }
.kg-dock__name { margin-top: 5px; font-size: 0.85rem; font-weight: 700; color: #f1f5f9; line-height: 1.4; }
.kg-dock__sub { margin-left: 6px; font-size: 0.64rem; font-weight: 400; color: #94a3b8; }
.kg-dock__meta { display: flex; gap: 9px; margin-top: 4px; font-size: 0.66rem; color: #94a3b8; }
.kg-dock__kind { color: #7dd3fc; }
.kg-dock__funding { margin-top: 4px; font-size: 0.7rem; color: #fbbf24; font-variant-numeric: tabular-nums; }
.kg-dock__desc {
  margin: 6px 0 0;
  font-size: 0.68rem;
  line-height: 1.65;
  color: rgba(203, 213, 235, 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.kg-dock__empty { margin-top: 6px; font-size: 0.68rem; color: rgba(148, 163, 200, 0.55); }
.kg-dock__hint { margin-top: 6px; font-size: 0.62rem; color: #64748b; }
@media (max-width: 640px) { .kg-dock { display: none; } } /* 窄屏触屏无 hover,坞隐藏 */
/* 坞读出激活时,底部操作提示淡出避让(坞盖其右端) */
.kg-wrap:has(.kg-dock.has-target) .kg-hint { opacity: 0.15; transition: opacity 0.2s ease; }

</style>
