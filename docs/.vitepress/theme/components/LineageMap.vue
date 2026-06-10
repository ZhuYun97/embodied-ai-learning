<script setup>
// VLA × WAM 谱系「地铁图」:横轴 = 时间(arXiv ID 派生年月),纵向 = 技术路线,站点 = 论文细读。
// 数据全部来自 papers.data.mjs(首页路线卡名单 + 细读页 arXiv/核对日期)→ 零手工维护、不引入新主张;
// 无日期者列右侧「日期待核」区(诚实标注,不编造)。布局确定性计算,SSR 安全;
// 入场为一次性逐线绘制(reduced-motion 全关);悬停只作用于被指元素,无指针跟随效果。
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as paperData } from '../../data/papers.data.mjs'
import { ROUTE_COLORS } from '../route-colors.mjs'

const VLA_SET = new Set(['离散 token', '连续 · 扩散/流匹配', '混合 · 连续回归', '分层 · 双系统/推理', '新范式探索'])
// track: 'all' = 双面板(/map/ 总览页);'vla' | 'wam' = 单面板(嵌入对应调研总报告)。
// 单面板模式仍与总览共用同一时间刻度与数据源,口径不分叉。
const props = defineProps({
  track: { type: String, default: 'all' },
})
const targetSlug = ref('')

const monthIdx = (ym) => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}
// 估算站名标签宽度(CJK 宽字 / 拉丁窄字),用于贪心分配标签行避让
const estW = (s) => {
  let w = 8
  for (const ch of s) w += /[　-鿿＀-￯]/.test(ch) ? 10.5 : 6.3
  return w
}

const panels = computed(() => {
  const PXM = 34, LEFT = 36, LANE = 78, HEAD = 46, BOT = 18
  const papers = paperData.papers || []
  const dated = papers.filter((p) => p.date)
  if (!dated.length) return []
  let minM = Infinity, maxM = -Infinity
  for (const p of dated) {
    const mi = monthIdx(p.date)
    if (mi < minM) minM = mi
    if (mi > maxM) maxM = mi
  }
  minM -= 1
  maxM += 1
  const X = (ym) => LEFT + (monthIdx(ym) - minM) * PXM
  const maxDatedX = LEFT + (maxM - minM) * PXM
  const maxU = Math.max(0, ...Object.values(paperData.byRoute || {}).map((arr) => arr.filter((p) => !p.date).length))
  const zoneStart = maxDatedX + 26
  const WIDTH = maxU ? zoneStart + 44 + (maxU - 1) * 84 + 64 : maxDatedX + 56
  // 年份主刻度(1 月)+ 年中次刻度(7 月,无标签)
  const years = []
  const halves = []
  for (let mi = minM; mi <= maxM; mi++) {
    const x = LEFT + (mi - minM) * PXM
    if (mi % 12 === 0) years.push({ x, label: String(Math.floor(mi / 12)) })
    else if (mi % 12 === 6) halves.push({ x })
  }

  const mkPanel = (key, title, routes) => {
    const lines = []
    routes.forEach((route) => {
      const src = paperData.byRoute[route] || []
      if (!src.length) return
      const i = lines.length
      const y = HEAD + LANE * i + LANE / 2 + 8
      const seen = {}
      let uCount = 0
      const stations = src.map((p) => {
        let x, undated = false
        if (p.date) {
          const base = X(p.date)
          const k = (seen[base] = (seen[base] || 0) + 1) - 1
          x = base + k * 13
        } else {
          undated = true
          x = zoneStart + 44 + uCount * 84
          uCount++
        }
        return { ...p, x, undated }
      })
      // 标签行避让:按 x 升序,贪心放入 上1/下1/上2/下2 四条标签行
      const DY = [-15, 19, -28, 32]
      const lastEnd = [-1e9, -1e9, -1e9, -1e9]
      for (const st of stations.slice().sort((a, b) => a.x - b.x)) {
        const w = estW(st.display)
        let lane = 3
        for (let li = 0; li < 4; li++) {
          if (st.x - w / 2 > lastEnd[li] + 6) { lane = li; break }
        }
        lastEnd[lane] = st.x + w / 2
        st.dy = DY[lane]
      }
      const datedSts = stations.filter((s) => !s.undated)
      const undatedSts = stations.filter((s) => s.undated)
      const x1 = datedSts.length ? Math.min(...datedSts.map((s) => s.x)) - 16 : zoneStart + 28
      const x2 = datedSts.length ? Math.max(...datedSts.map((s) => s.x)) + 16 : zoneStart + 28
      const dashX2 = undatedSts.length ? Math.max(...undatedSts.map((s) => s.x)) + 16 : null
      lines.push({ route, color: ROUTE_COLORS[route] || '#94a3b8', y, x1, x2, dashX2, stations, count: stations.length })
    })
    return {
      key,
      title,
      lines,
      width: WIDTH,
      height: HEAD + LANE * lines.length + BOT,
      years,
      halves,
      zone: maxU ? { x: zoneStart, label: '日期待核' } : null,
      total: lines.reduce((a, l) => a + l.count, 0),
    }
  }

  const routes = paperData.routes || []
  return [
    mkPanel('vla', 'VLA 主线 · 按动作生成路线', routes.filter((r) => VLA_SET.has(r))),
    mkPanel('wam', 'WAM 主线 · 按范式(级联 / 联合 / 跨范式)', routes.filter((r) => !VLA_SET.has(r))),
  ].filter((p) => p.lines.length && (props.track === 'all' || p.key === props.track))
})

onMounted(() => {
  if (typeof window === 'undefined') return
  const slug = (window.location.hash || '').replace(/^#/, '')
  if (!slug) return
  requestAnimationFrame(() => {
    const g = document.getElementById('st-' + slug)
    if (!g) return
    targetSlug.value = slug
    const wrap = g.closest('.lm-scroll')
    const x = parseFloat(g.dataset.x || '0')
    if (wrap) wrap.scrollLeft = Math.max(0, x - wrap.clientWidth / 2)
  })
})
</script>

<template>
  <div class="lineage-map">
    <div class="lm-hint" aria-hidden="true">⟷ 横向滚动查看完整时间轴 · 点击站点进入论文细读</div>
    <section v-for="panel in panels" :key="panel.key" class="lm-panel">
      <header class="lm-panelhead">
        <span class="lm-paneltag">{{ panel.key.toUpperCase() }}</span>
        <span class="lm-paneltitle">{{ panel.title }}</span>
        <span class="lm-panelcount">{{ panel.lines.length }} 条路线 · {{ panel.total }} 站</span>
      </header>
      <div class="lm-scroll" tabindex="0" :aria-label="panel.title + '(可横向滚动)'">
        <svg :width="panel.width" :height="panel.height" :viewBox="`0 0 ${panel.width} ${panel.height}`" class="lm-svg" role="img" :aria-label="panel.title + ' 谱系图'">
          <g v-for="h in panel.halves" :key="'h' + h.x">
            <line :x1="h.x" :x2="h.x" y1="34" :y2="panel.height - 8" class="lm-halfline" />
          </g>
          <g v-for="yr in panel.years" :key="'y' + yr.x">
            <line :x1="yr.x" :x2="yr.x" y1="30" :y2="panel.height - 8" class="lm-yearline" />
            <text :x="yr.x + 5" y="22" class="lm-yeartext">{{ yr.label }}</text>
          </g>
          <g v-if="panel.zone">
            <line :x1="panel.zone.x" :x2="panel.zone.x" y1="30" :y2="panel.height - 8" class="lm-zoneline" />
            <text :x="panel.zone.x + 8" y="22" class="lm-zonetext">{{ panel.zone.label }}</text>
          </g>
          <g v-for="(ln, li) in panel.lines" :key="ln.route">
            <text :x="8" :y="ln.y - 34" class="lm-routelabel" :fill="ln.color">{{ ln.route }} · {{ ln.count }}</text>
            <path :d="`M ${ln.x1} ${ln.y} H ${ln.x2}`" :stroke="ln.color" class="lm-line" pathLength="1" :style="{ '--ld': li * 0.12 + 's' }" />
            <path v-if="ln.dashX2" :d="`M ${ln.x2} ${ln.y} H ${ln.dashX2}`" :stroke="ln.color" class="lm-line lm-line--dash" :style="{ '--ld': (li * 0.12 + 0.3) + 's' }" />
            <a v-for="st in ln.stations" :key="st.slug" :href="withBase(st.link)" class="lm-stlink">
              <g
                class="lm-st"
                :class="{ 'is-undated': st.undated, 'is-target': st.slug === targetSlug }"
                :id="'st-' + st.slug"
                :data-x="st.x"
                :style="{ '--sd': (0.45 + (st.x / panel.width) * 0.9).toFixed(2) + 's' }"
              >
                <title>{{ st.display }} · {{ st.date || '日期待核' }} · {{ ln.route }}{{ st.arxivId ? ' · arXiv:' + st.arxivId : '' }}</title>
                <circle :cx="st.x" :cy="ln.y" r="5.5" class="lm-dot" :stroke="ln.color" />
                <circle v-if="st.slug === targetSlug" :cx="st.x" :cy="ln.y" r="9" class="lm-ping" :stroke="ln.color" />
                <text :x="st.x" :y="ln.y + st.dy" class="lm-sttext">{{ st.display }}</text>
              </g>
            </a>
          </g>
        </svg>
      </div>
    </section>
    <p class="lm-foot">
      站点 = 本站论文细读(点击直达);横轴 = arXiv ID 前四位派生的提交年月,无 arXiv 者按站内核对日期定位,均无者列「日期待核」区——不编造时间。路线划分与首页路线卡一致;同月多站横向微错开。
    </p>
  </div>
</template>

<style scoped>
.lineage-map { margin-top: 10px; }
.lm-hint {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.74rem;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
  letter-spacing: 0.04em;
}
/* 面板:双主题统一深空画布(谱系图的「控制台屏幕」),与首页 HUD 同语言 */
.lm-panel {
  position: relative;
  margin: 0 0 26px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 14px;
  background: #0a1020;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.04), 0 12px 40px rgba(8, 13, 28, 0.35);
}
.lm-panelhead {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 13px 16px 2px;
  font-family: var(--vp-font-family-mono, monospace);
}
.lm-paneltag {
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.4);
  border-radius: 5px;
  font-size: 0.66rem;
  font-weight: 700;
  padding: 1px 7px;
  letter-spacing: 0.12em;
}
.lm-paneltitle { color: #e2e8f0; font-weight: 700; font-size: 0.95rem; }
.lm-panelcount { margin-left: auto; color: #64748b; font-size: 0.72rem; font-variant-numeric: tabular-nums; }
.lm-scroll {
  overflow-x: auto;
  padding: 2px 0 10px;
  /* 44px 蓝图网格随内容滚动(background-attachment:local) */
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.04) 1px, transparent 1px);
  background-size: 44px 44px;
  background-attachment: local;
  scrollbar-width: thin;
  scrollbar-color: rgba(56, 189, 248, 0.35) transparent;
}
.lm-scroll:focus-visible { outline: 2px solid #22d3ee; outline-offset: -2px; }
.lm-svg { display: block; }

.lm-yearline { stroke: rgba(148, 163, 184, 0.16); stroke-width: 1; }
.lm-halfline { stroke: rgba(148, 163, 184, 0.07); stroke-width: 1; }
.lm-yeartext {
  fill: #64748b;
  font: 600 11px var(--vp-font-family-mono, monospace);
  letter-spacing: 0.08em;
}
.lm-zoneline { stroke: rgba(234, 179, 8, 0.35); stroke-dasharray: 4 4; }
.lm-zonetext { fill: #ca8a04; font: 600 10.5px var(--vp-font-family-mono, monospace); }

.lm-routelabel {
  font: 700 11px var(--vp-font-family-mono, monospace);
  letter-spacing: 0.06em;
  paint-order: stroke;
  stroke: #0a1020;
  stroke-width: 3px;
}
.lm-line { fill: none; stroke-width: 2.5; stroke-linecap: round; opacity: 0.85; }
.lm-line--dash { stroke-dasharray: 3 5; opacity: 0.45; }

.lm-stlink { cursor: pointer; text-decoration: none; }
.lm-dot { fill: #0a1020; stroke-width: 2.5; transition: stroke-width 0.15s ease; }
.lm-sttext {
  fill: #cbd5e1;
  font: 500 10.5px var(--vp-font-family-mono, monospace);
  text-anchor: middle;
  paint-order: stroke;
  stroke: #0a1020;
  stroke-width: 3px;
  transition: fill 0.15s ease;
}
.lm-stlink:hover .lm-dot,
.lm-stlink:focus-visible .lm-dot { stroke-width: 4.5; }
.lm-stlink:hover .lm-sttext,
.lm-stlink:focus-visible .lm-sttext { fill: #ffffff; font-weight: 700; }
.lm-st.is-undated .lm-dot { stroke-dasharray: 2.5 2.5; }
.lm-st.is-target .lm-dot { stroke-width: 4.5; }
.lm-ping { fill: none; stroke-width: 1.5; opacity: 0.85; }

.lm-foot {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  line-height: 1.75;
  margin: 4px 2px 0;
}

/* 一次性入场:逐线绘制 + 站点按横轴位置错峰点亮;锚点定位站 3 次雷达脉冲。reduced-motion 全关。 */
@media (prefers-reduced-motion: no-preference) {
  .lm-line:not(.lm-line--dash) {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: lmDraw 1s cubic-bezier(0.6, 0.05, 0.3, 1) var(--ld, 0s) forwards;
  }
  .lm-line--dash {
    opacity: 0;
    animation: lmDashIn 0.5s ease var(--ld, 0.3s) forwards;
  }
  .lm-st {
    opacity: 0;
    animation: lmPop 0.4s ease var(--sd, 0.6s) forwards;
  }
  .lm-ping { animation: lmPing 1.5s ease-out 0.2s 3; }
}
@keyframes lmDraw { to { stroke-dashoffset: 0; } }
@keyframes lmDashIn { to { opacity: 0.45; } }
@keyframes lmPop { to { opacity: 1; } }
@keyframes lmPing {
  0% { r: 7; opacity: 0.9; }
  100% { r: 20; opacity: 0; }
}

@media (max-width: 640px) {
  .lm-panelhead { flex-wrap: wrap; }
  .lm-panelcount { margin-left: 0; width: 100%; }
}
</style>
