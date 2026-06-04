<template>
  <div class="jobmap-wrap">
    <div class="jobmap-legend">
      <span class="jm-title">就业地图 · 具身公司总部分布</span>
      <span class="jm-legend-items">
        <span class="jm-li"><i class="jm-dot jm-dot--cn"></i>国内</span>
        <span class="jm-li"><i class="jm-dot jm-dot--intl"></i>海外</span>
      </span>
      <span class="jm-readout" aria-hidden="true"><b>{{ plottedCount }}</b> 家已定位 · <b>{{ cityCount }}</b> 城<span v-if="pending.length"> · <b>{{ pending.length }}</b> 待核</span></span>
    </div>

    <div class="jobmap-stage">
      <div class="jobmap-canvas" ref="mapEl"></div>
      <div v-if="!ready" class="jobmap-loading">加载地图中…</div>
      <span class="jm-corner jm-corner--tl" aria-hidden="true"></span>
      <span class="jm-corner jm-corner--tr" aria-hidden="true"></span>
      <span class="jm-corner jm-corner--bl" aria-hidden="true"></span>
      <span class="jm-corner jm-corner--br" aria-hidden="true"></span>
    </div>

    <p class="jobmap-note">
      圆点大小 = 该城公司数;点击圆点查看公司清单与官网。总部城市经多源核实;底图 © OpenStreetMap · CARTO。
      <span v-if="pending.length">总部暂未公开 / 待核(未上图):{{ pending.join(' · ') }}。</span>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import data from '../../../ecosystem/companies-data.json'

// 公司 → 总部城市(经多源核实;null = 总部待核,不上图,绝不臆测)。
// 公司事实(名称/阶段/融资/官网)来自 companies-data.json;此处只补「地理标签」,不复制其它字段。
const CITY_BY_ID = {
  'physical-intelligence': 'sf',
  'figure-ai': 'sunnyvale',
  'boston-dynamics': 'waltham',
  'agility-robotics': 'salem',
  '1x-technologies': 'moss',
  'apptronik': 'austin',
  'sanctuary-ai': 'vancouver',
  'skild-ai': 'pittsburgh',
  'humanoid-uk': 'london',
  'mecka-ai': 'nyc',
  'tesla': 'austin',
  'nvidia': 'santaclara',
  'world-labs': 'sf',
  'covariant': 'emeryville',
  'ubtech': 'shenzhen',
  'unitree': 'hangzhou',
  'cloudminds': 'shanghai',
  'robotera': 'beijing',
  'linkerbot': 'beijing',
  'agibot': 'shanghai',
  'fourier': 'shanghai',
  'limx': 'shenzhen',
  'x-humanoid': 'beijing',
  'galbot': 'beijing',
  'vbot': 'beijing',
  'joyin': null,
  'x2robot': 'shenzhen',
  'genisom': null,
  'spirit-ai': 'hangzhou',
  'leju': 'shenzhen',
  'keenon': 'shanghai',
  'orionstar': 'beijing',
  'gaussian': 'shanghai',
  'ninebot': 'beijing',
  'flexiv': 'shanghai',
  'galaxea': 'beijing',
  'tars': 'shanghai',
  'noematrix': 'shanghai',
  'ai2robotics': 'shenzhen',
  'engineai': 'shenzhen',
  'booster': 'beijing',
  'deeprobotics': 'hangzhou',
  'agile-robots': 'beijing',
  'dobot': 'shenzhen',
  'psibot': 'beijing',
  'noetix': 'beijing',
  'field-ai': 'missionviejo',
  'dexterity': 'redwoodcity',
  'collaborative-robotics': 'santaclara',
}

// 城市 → 标签 + 坐标(城市质心,公开地理常量)+ 国内/海外
const CITY_META = {
  beijing:    { label: '北京', lat: 39.9042, lng: 116.4074, region: 'china' },
  shanghai:   { label: '上海', lat: 31.2304, lng: 121.4737, region: 'china' },
  shenzhen:   { label: '深圳', lat: 22.5431, lng: 114.0579, region: 'china' },
  hangzhou:   { label: '杭州', lat: 30.2741, lng: 120.1551, region: 'china' },
  sf:         { label: 'San Francisco', lat: 37.7749, lng: -122.4194, region: 'intl' },
  sunnyvale:  { label: 'Sunnyvale, CA', lat: 37.3688, lng: -122.0363, region: 'intl' },
  santaclara: { label: 'Santa Clara, CA', lat: 37.3541, lng: -121.9552, region: 'intl' },
  missionviejo: { label: 'Mission Viejo, CA', lat: 33.6000, lng: -117.6719, region: 'intl' },
  redwoodcity: { label: 'Redwood City, CA', lat: 37.4852, lng: -122.2364, region: 'intl' },
  emeryville: { label: 'Emeryville, CA', lat: 37.8313, lng: -122.2852, region: 'intl' },
  austin:     { label: 'Austin, TX', lat: 30.2672, lng: -97.7431, region: 'intl' },
  pittsburgh: { label: 'Pittsburgh, PA', lat: 40.4406, lng: -79.9959, region: 'intl' },
  waltham:    { label: 'Waltham, MA', lat: 42.3765, lng: -71.2356, region: 'intl' },
  salem:      { label: 'Salem, OR', lat: 44.9429, lng: -123.0351, region: 'intl' },
  nyc:        { label: 'New York', lat: 40.7128, lng: -74.0060, region: 'intl' },
  vancouver:  { label: 'Vancouver', lat: 49.2827, lng: -123.1207, region: 'intl' },
  moss:       { label: 'Moss, 挪威', lat: 59.4344, lng: 10.6578, region: 'intl' },
  london:     { label: 'London', lat: 51.5074, lng: -0.1278, region: 'intl' },
}

const STAGE_LABEL = { public: '上市', unicorn: '独角兽', growth: '成长期', early: '早期', mature: '成熟', vertical: '垂直' }

const companies = data.companies || []
const byCity = {}
const pending = []
for (const c of companies) {
  const key = CITY_BY_ID[c.id]
  if (key && CITY_META[key]) (byCity[key] = byCity[key] || []).push(c)
  else pending.push(c.name)
}
const plottedCount = Object.values(byCity).reduce((s, a) => s + a.length, 0)
const cityCount = Object.keys(byCity).length

const mapEl = ref(null)
const ready = ref(false)
let map = null

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]))
}
function popupHtml(meta, list) {
  const rows = list.map((c) => {
    const stage = STAGE_LABEL[c.stage] || ''
    const fund = c.funding ? ` · ${esc(c.funding)}` : ''
    const name = esc(c.name) + (c.nameEn ? ` <span class="jm-co__en">${esc(c.nameEn)}</span>` : '')
    const inner = `<span class="jm-co__name">${name}</span><span class="jm-co__meta">${esc(stage)}${fund}</span>`
    return c.website
      ? `<a class="jm-co" href="${esc(c.website)}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="jm-co">${inner}</div>`
  }).join('')
  return `<div class="jm-pop"><div class="jm-pop__city">${esc(meta.label)} · ${list.length} 家</div>${rows}</div>`
}

onMounted(async () => {
  if (!mapEl.value) return
  const mod = await import('leaflet')
  const L = mod.default || mod
  map = L.map(mapEl.value, {
    zoomControl: true,
    scrollWheelZoom: true,
    worldCopyJump: true,
    minZoom: 1,
    maxZoom: 12,
    attributionControl: true,
  }).setView([35, 40], 2)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
    attribution: '© OpenStreetMap © CARTO',
  }).addTo(map)

  // 聚合插件:相近城市(沪/杭、湾区四城)在低缩放下并为一个计数泡,避免互相遮挡;缩放或点击即展开
  let hasCluster = false
  try { await import('leaflet.markercluster'); hasCluster = !!L.markerClusterGroup } catch (e) { hasCluster = false }
  const group = hasCluster
    ? L.markerClusterGroup({
        maxClusterRadius: 46,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        chunkedLoading: false,
        iconCreateFunction: (cluster) => {
          const kids = cluster.getAllChildMarkers()
          let total = 0, cn = 0
          for (const m of kids) { total += m.options._n || 1; if (m.options._cn) cn += 1 }
          const col = cn * 2 >= kids.length ? '#22d3ee' : '#a78bfa'
          const d = Math.round((19 + Math.min(13, Math.sqrt(total) * 3)) * 2)
          return L.divIcon({
            html: `<div class="jm-cluster" style="--c:${col};width:${d}px;height:${d}px"><b>${total}</b></div>`,
            className: 'jm-cluster-wrap',
            iconSize: [d, d],
          })
        },
      })
    : null

  const bounds = []
  for (const [key, list] of Object.entries(byCity)) {
    const meta = CITY_META[key]
    const n = list.length
    const isCN = meta.region === 'china'
    const col = isCN ? '#22d3ee' : '#a78bfa'
    const marker = L.circleMarker([meta.lat, meta.lng], {
      radius: 7 + Math.sqrt(n) * 4.5,
      color: col,
      weight: 2,
      opacity: 0.95,
      fillColor: col,
      fillOpacity: 0.3,
      className: 'jm-marker',
      _n: n,
      _cn: isCN,
    })
    marker.bindPopup(popupHtml(meta, list), { className: 'jm-popup', maxWidth: 300, autoPanPadding: [30, 30] })
    marker.bindTooltip(`${meta.label} · ${n} 家`, { direction: 'top', className: 'jm-tip', offset: [0, -4] })
    if (group) group.addLayer(marker)
    else marker.addTo(map)
    bounds.push([meta.lat, meta.lng])
  }
  if (group) map.addLayer(group)
  ready.value = true
  // 先校正容器尺寸,再 fitBounds —— 否则用错误尺寸算缩放会只框住单个区域(如只剩北美)
  setTimeout(() => {
    if (!map) return
    map.invalidateSize()
    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 })
  }, 180)
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<!-- Leaflet 核心样式(全局,不能 scoped,否则破坏 leaflet 类) -->
<style>
@import 'leaflet/dist/leaflet.css';
@import 'leaflet.markercluster/dist/MarkerCluster.css';

/* 聚合计数泡(深空):相近城市低缩放下并为一个泡,数字=公司总数 */
.jm-cluster-wrap { background: transparent !important; }
.jm-cluster {
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  color: #05060f;
  font-family: var(--vp-font-family-mono, monospace);
  font-weight: 800;
  background: radial-gradient(circle at 38% 32%, color-mix(in srgb, var(--c) 92%, #fff), var(--c));
  border: 2px solid color-mix(in srgb, var(--c) 65%, #fff);
  box-shadow: 0 0 16px var(--c), 0 0 5px var(--c);
  transition: transform 0.15s ease;
}
.jm-cluster-wrap:hover .jm-cluster { transform: scale(1.08); }
.jm-cluster b { font-size: 0.84rem; line-height: 1; }

/* 弹窗深空化 */
.jm-popup .leaflet-popup-content-wrapper {
  background: rgba(10, 15, 34, 0.97);
  color: #cdd9f5;
  border: 1px solid rgba(110, 150, 230, 0.4);
  border-radius: 10px;
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
}
.jm-popup .leaflet-popup-content { margin: 11px 13px; line-height: 1.4; }
.jm-popup .leaflet-popup-tip { background: rgba(10, 15, 34, 0.97); border: 1px solid rgba(110, 150, 230, 0.4); }
.jm-popup a.leaflet-popup-close-button { color: #8595bd; }
.jm-pop__city { font-family: var(--vp-font-family-mono, monospace); font-weight: 700; color: #8fd6ff; font-size: 0.82rem; margin-bottom: 4px; letter-spacing: 0.02em; }
.jm-co { display: flex; flex-direction: column; padding: 5px 0; border-top: 1px solid rgba(255, 255, 255, 0.07); text-decoration: none !important; }
.jm-co__name { color: #e6edff; font-size: 0.82rem; font-weight: 600; }
.jm-co__en { color: #8595bd; font-weight: 500; font-size: 0.92em; }
a.jm-co:hover .jm-co__name { color: #8fd6ff; }
.jm-co__meta { color: #8595bd; font-size: 0.7rem; font-family: var(--vp-font-family-mono, monospace); margin-top: 1px; }
.jm-tip {
  background: rgba(10, 15, 34, 0.95); color: #cdd9f5; border: 1px solid rgba(110, 150, 230, 0.45);
  border-radius: 6px; font-family: var(--vp-font-family-mono, monospace); font-size: 0.72rem; box-shadow: none;
}
.jm-tip::before { display: none; }
.jm-marker { filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.5)); }
/* leaflet 控件深空化 */
.jobmap-stage .leaflet-bar a {
  background: rgba(12, 18, 40, 0.85); color: #cdd9f5; border-color: rgba(110, 150, 230, 0.3);
}
.jobmap-stage .leaflet-bar a:hover { background: rgba(24, 40, 80, 0.9); color: #aef0ff; }
.jobmap-stage .leaflet-control-attribution {
  background: rgba(8, 12, 28, 0.7); color: #6b7ba3; font-size: 10px;
}
.jobmap-stage .leaflet-control-attribution a { color: #8595bd; }
</style>

<style scoped>
.jobmap-wrap {
  margin: 1.5rem 0 2rem;
  border: 1px solid rgba(96, 130, 220, 0.2);
  border-radius: 14px;
  overflow: hidden;
  background: radial-gradient(ellipse 120% 100% at 50% 0%, #0a0e22 0%, #05060f 60%, #020308 100%);
  box-shadow: inset 0 0 90px rgba(40, 60, 160, 0.14), 0 18px 50px -18px rgba(8, 12, 40, 0.7);
}

.jobmap-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  padding: 10px 16px;
  background: rgba(8, 12, 28, 0.62);
  border-bottom: 1px solid rgba(96, 130, 220, 0.18);
  backdrop-filter: blur(8px);
}
.jm-title {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(203, 213, 235, 0.92);
}
.jm-legend-items { display: inline-flex; gap: 14px; }
.jm-li { display: inline-flex; align-items: center; gap: 6px; font-size: 0.72rem; color: rgba(203, 213, 235, 0.8); }
.jm-dot { width: 11px; height: 11px; border-radius: 50%; }
.jm-dot--cn { background: #22d3ee; box-shadow: 0 0 7px rgba(34, 211, 238, 0.7); }
.jm-dot--intl { background: #a78bfa; box-shadow: 0 0 7px rgba(167, 139, 250, 0.7); }
.jm-readout {
  margin-left: auto;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem;
  color: rgba(170, 190, 230, 0.66);
}
.jm-readout b { color: #8fd6ff; font-weight: 700; font-variant-numeric: tabular-nums; }

.jobmap-stage { position: relative; }
.jobmap-canvas { width: 100%; height: 520px; background: #05060f; }
.jobmap-canvas :deep(.leaflet-container) { background: #05060f; font-family: inherit; }

.jobmap-loading {
  position: absolute; inset: 0; z-index: 401;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--vp-font-family-mono, monospace); font-size: 0.85rem;
  color: rgba(170, 190, 230, 0.7); background: #05060f; pointer-events: none;
}

/* 四角 HUD 角标 */
.jm-corner { position: absolute; width: 15px; height: 15px; z-index: 402; pointer-events: none; border: 0 solid rgba(120, 200, 255, 0.5); }
.jm-corner--tl { top: 8px; left: 8px; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 5px; }
.jm-corner--tr { top: 8px; right: 8px; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 5px; }
.jm-corner--bl { bottom: 8px; left: 8px; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 5px; }
.jm-corner--br { bottom: 8px; right: 8px; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 5px; }

.jobmap-note {
  margin: 0;
  padding: 10px 16px 13px;
  font-size: 0.72rem;
  line-height: 1.6;
  color: rgba(148, 163, 200, 0.62);
  background: rgba(8, 12, 28, 0.5);
  border-top: 1px solid rgba(96, 130, 220, 0.14);
}

@media (max-width: 640px) {
  .jobmap-canvas { height: 380px; }
  .jm-readout { margin-left: 0; width: 100%; }
}
</style>
