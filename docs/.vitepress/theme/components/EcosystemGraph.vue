<template>
  <div class="cy-wrap">
    <div class="cy-legend">
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
    <div class="cy-hint">拖拽 · 滚轮缩放 · 悬停高亮关联 · 点击访问官网</div>
    <div ref="cyEl" class="cy-canvas"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import data from '../../../ecosystem/companies-data.json'

const cyEl = ref(null)
let cy = null
let mo = null

// 调色板:科技蓝(默认)/ 实验室档案(暖)
const PAL = {
  tech: {
    cn: '#ff9d92 #ef4d44 #bb2c26', cnB: '#ffb6ab',
    intl: '#9cc4ff #3f7fe0 #1f4fae', intlB: '#b8d2ff',
    conn: '#ffe39a #eaa12c #b9741a', connB: '#ffe6a6',
    invest: '#38bdf8', partner: '#818cf8', own: '#c084fc',
    label: '#e8eefc', outline: '#0a1020',
  },
  archive: {
    cn: '#c4624a #9a3324 #6f2418', cnB: '#e0a08a',
    intl: '#7ea0c8 #466da0 #2f4d75', intlB: '#9fbcde',
    conn: '#dca06a #b06a2e #7e4a1e', connB: '#e6b27e',
    invest: '#d9954f', partner: '#b5805a', own: '#c2693f',
    label: '#f3e9d8', outline: '#1b1009',
  },
}

const sizeOf = (c) => 22 + Math.min(34, Math.sqrt((c.fundingAmount || 0) / 1e8) * 3.2)

function buildStyle(p) {
  return [
    {
      selector: 'node',
      style: {
        width: 'data(size)', height: 'data(size)',
        'background-fill': 'radial-gradient',
        'background-gradient-stop-positions': '0% 55% 100%',
        'border-width': 1.5,
        label: 'data(label)', color: p.label,
        'font-size': 9, 'font-weight': 600,
        'text-valign': 'bottom', 'text-halign': 'center', 'text-margin-y': 3,
        'text-outline-width': 2.6, 'text-outline-color': p.outline,
        'text-wrap': 'wrap', 'text-max-width': '88px',
        'text-opacity': 0,
        'transition-property': 'opacity, text-opacity, border-width',
        'transition-duration': '0.15s',
      },
    },
    { selector: 'node[kind="cn"]', style: { 'background-gradient-stop-colors': p.cn, 'border-color': p.cnB } },
    { selector: 'node[kind="intl"]', style: { 'background-gradient-stop-colors': p.intl, 'border-color': p.intlB } },
    { selector: 'node[kind="conn"]', style: { 'background-gradient-stop-colors': p.conn, 'border-color': p.connB } },
    { selector: 'node.showlabel', style: { 'text-opacity': 0.92 } },
    {
      selector: 'edge',
      style: {
        'curve-style': 'bezier', width: 1.4, opacity: 0.42,
        'target-arrow-shape': 'triangle', 'arrow-scale': 0.85, 'line-cap': 'round',
        'transition-property': 'opacity, width', 'transition-duration': '0.15s',
      },
    },
    { selector: 'edge[type="invest"]', style: { 'line-color': p.invest, 'target-arrow-color': p.invest } },
    { selector: 'edge[type="partner"]', style: { 'line-color': p.partner, 'target-arrow-color': p.partner, 'line-style': 'dashed' } },
    { selector: 'edge[type="own"]', style: { 'line-color': p.own, 'target-arrow-color': p.own } },
    { selector: 'edge[type="incubate"]', style: { 'line-color': p.own, 'target-arrow-color': p.own, 'line-style': 'dashed' } },
    { selector: '.faded', style: { opacity: 0.08, 'text-opacity': 0 } },
    { selector: 'node.hl', style: { 'border-width': 3, 'text-opacity': 1, 'z-index': 20 } },
    { selector: 'edge.hl', style: { opacity: 1, width: 2.8 } },
  ]
}

const isArchive = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('skin-archive')

onMounted(async () => {
  const cytoscape = (await import('cytoscape')).default
  const fcose = (await import('cytoscape-fcose')).default
  try { cytoscape.use(fcose) } catch (e) {}

  const rels = data.relationships || []
  const linked = new Set()
  rels.forEach((r) => { linked.add(r.source); linked.add(r.target) })

  const elements = []
  for (const c of data.companies || []) {
    if (!linked.has(c.id)) continue
    const size = sizeOf(c)
    elements.push({
      data: { id: c.id, label: c.name, kind: c.region === 'china' ? 'cn' : 'intl', size, website: c.website || '' },
      classes: size >= 33 ? 'showlabel' : '',
    })
  }
  for (const k of data.connectors || []) {
    if (!linked.has(k.id)) continue
    elements.push({ data: { id: k.id, label: k.name, kind: 'conn', size: 25, website: '' }, classes: 'showlabel' })
  }
  const ids = new Set(elements.map((e) => e.data.id))
  rels.filter((r) => ids.has(r.source) && ids.has(r.target)).forEach((r, i) => {
    elements.push({ data: { id: 'e' + i, source: r.source, target: r.target, type: r.type } })
  })

  cy = cytoscape({
    container: cyEl.value,
    elements,
    style: buildStyle(isArchive() ? PAL.archive : PAL.tech),
    layout: {
      name: 'fcose', quality: 'proof', animate: false, randomize: true,
      nodeRepulsion: 7000, idealEdgeLength: 95, nodeSeparation: 90,
      gravity: 0.25, padding: 36, packComponents: true,
    },
    minZoom: 0.4, maxZoom: 2.6, wheelSensitivity: 0.22,
    boxSelectionEnabled: false, autounselectify: true,
  })

  // 悬停:高亮焦点 + 邻居子图,其余淡出
  cy.on('mouseover', 'node', (e) => {
    const nb = e.target.closedNeighborhood()
    cy.elements().addClass('faded')
    nb.removeClass('faded').addClass('hl')
  })
  cy.on('mouseout', 'node', () => cy.elements().removeClass('faded hl'))
  cy.on('tap', 'node', (e) => {
    const w = e.target.data('website')
    if (w) window.open(w, '_blank', 'noopener')
  })

  cy.ready(() => cy.fit(undefined, 38))

  // 跟随配色主题切换(科技蓝 ⇄ 档案暖)
  mo = new MutationObserver(() => {
    if (cy) cy.style(buildStyle(isArchive() ? PAL.archive : PAL.tech)).update()
  })
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  if (mo) mo.disconnect()
  if (cy) cy.destroy()
})
</script>

<style scoped>
/* 舞台:深空 + 星点 + 静态能量辉光(不动) */
.cy-wrap {
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 14px;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 60% at 50% 40%, rgba(38, 86, 180, 0.26), transparent 70%),
    radial-gradient(ellipse 110% 90% at 50% 35%, #142554 0%, #0a1336 45%, #050a1f 100%);
  border: 1px solid rgba(96, 140, 230, 0.22);
  box-shadow: inset 0 0 80px rgba(40, 90, 200, 0.12), 0 18px 50px -18px rgba(12, 28, 80, 0.65);
}
.cy-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(rgba(150, 190, 255, 0.16) 1px, transparent 1.4px),
    radial-gradient(rgba(120, 160, 230, 0.08) 1px, transparent 1.2px);
  background-size: 30px 30px, 17px 17px;
  background-position: 0 0, 9px 13px;
  -webkit-mask-image: radial-gradient(ellipse 82% 75% at 50% 42%, #000 30%, transparent 100%);
  mask-image: radial-gradient(ellipse 82% 75% at 50% 42%, #000 30%, transparent 100%);
}
.cy-canvas {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 600px;
}
@media (max-width: 640px) {
  .cy-canvas { height: 440px; }
}

/* 图例 HUD */
.cy-legend {
  position: absolute;
  top: 14px; left: 16px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 9px 13px;
  font-size: 0.72rem;
  color: rgba(203, 213, 225, 0.86);
  background: rgba(10, 18, 38, 0.55);
  border: 1px solid rgba(96, 140, 230, 0.22);
  border-radius: 9px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.lg-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.lg-item { display: inline-flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 6px currentColor; }
.dot-cn { background: #ef4d44; color: #ef4d44; }
.dot-intl { background: #3f7fe0; color: #3f7fe0; }
.dot-conn { background: #eaa12c; color: #eaa12c; }
.ln { width: 18px; height: 0; border-top-width: 2px; border-top-style: solid; }
.ln-invest { border-color: #38bdf8; }
.ln-partner { border-color: #818cf8; border-top-style: dashed; }
.ln-own { border-color: #c084fc; }

.cy-hint {
  position: absolute;
  bottom: 12px; right: 16px;
  z-index: 3;
  font-size: 0.68rem;
  color: rgba(148, 163, 184, 0.6);
  pointer-events: none;
}
</style>

<!-- 档案皮:暖纸深棕舞台 + 暖色图例(非 scoped,确保 html.skin-archive 后代选择器正确编译) -->
<style>
html.skin-archive .cy-wrap {
  background:
    radial-gradient(ellipse 70% 60% at 50% 40%, rgba(150, 80, 40, 0.22), transparent 70%),
    radial-gradient(ellipse 110% 90% at 50% 35%, #2c1d14 0%, #21150d 45%, #160c06 100%);
  border-color: rgba(201, 123, 90, 0.26);
  box-shadow: inset 0 0 80px rgba(150, 80, 40, 0.12), 0 18px 50px -18px rgba(40, 22, 10, 0.6);
}
html.skin-archive .cy-wrap::before {
  background-image:
    radial-gradient(rgba(230, 180, 140, 0.14) 1px, transparent 1.4px),
    radial-gradient(rgba(200, 150, 110, 0.08) 1px, transparent 1.2px);
}
html.skin-archive .cy-legend {
  background: rgba(33, 21, 13, 0.6);
  border-color: rgba(201, 123, 90, 0.26);
  color: rgba(232, 220, 200, 0.86);
}
html.skin-archive .dot-cn { background: #9a3324; color: #9a3324; }
html.skin-archive .dot-intl { background: #466da0; color: #466da0; }
html.skin-archive .dot-conn { background: #b06a2e; color: #b06a2e; }
html.skin-archive .ln-invest { border-color: #d9954f; }
html.skin-archive .ln-partner { border-color: #b5805a; }
html.skin-archive .ln-own { border-color: #c2693f; }
</style>
