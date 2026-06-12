<!--
  TargetCursor —— HUD 瞄准光标(React Bits TargetCursor 的 Vue 3 移植)。
  机制:fixed 反色(mix-blend-difference)十字光标 = 中心点 + 四只角括号,
  空闲时整体匀速自旋;悬停目标(targetSelector)时角括号飞出去框住目标矩形
  (rect 进入时快照,角随光标 lerp 产生视差),离开后角归位、转轮续旋。
  移植说明:原版依赖 gsap(ticker/timeline);此处自旋走 CSS 动画(合成器,零 JS 帧),
  位置/四角用单 rAF lerp,空闲(无输入 + 全部收敛)自动停帧,mousemove 唤醒。
  新增站点适配:仅指针在 .VPHome 内显示(出首页区隐藏并还原原生光标,经
  html.tc-cursor-on 作用域 cursor:none);触屏/小屏/移动 UA 与 prefers-reduced-motion
  一律不挂载。仅由 theme/index.js 在首页槽挂载。
-->
<template>
  <div v-if="show" ref="cursorEl" class="target-cursor-wrapper" aria-hidden="true">
    <div
      ref="rotorEl"
      class="target-cursor-rotor"
      :class="{ 'is-spinning': spinning }"
      :style="{ '--tc-spin': spinDuration + 's' }"
    >
      <div ref="dotEl" class="target-cursor-dot"></div>
      <div class="target-cursor-corner corner-tl"></div>
      <div class="target-cursor-corner corner-tr"></div>
      <div class="target-cursor-corner corner-br"></div>
      <div class="target-cursor-corner corner-bl"></div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  targetSelector: { type: String, default: '.cursor-target' },
  spinDuration: { type: Number, default: 2 },
  hideDefaultCursor: { type: Boolean, default: true },
  hoverDuration: { type: Number, default: 0.2 },
  parallaxOn: { type: Boolean, default: true },
})

const BORDER = 3
const CORNER = 12
// 角括号静息位(px,等价原版 CSS 的 ±150%/±50% 位移)
const REST = [
  { x: -CORNER * 1.5, y: -CORNER * 1.5 },
  { x: CORNER * 0.5, y: -CORNER * 1.5 },
  { x: CORNER * 0.5, y: CORNER * 0.5 },
  { x: -CORNER * 1.5, y: CORNER * 0.5 },
]

const show = ref(false)
const spinning = ref(true)
const cursorEl = ref(null)
const rotorEl = ref(null)
const dotEl = ref(null)

let corners = []
let raf = null
let running = false
let lastInput = 0
let activeTarget = null
let frame = null // 锁定目标时的四角视口坐标快照
let strength = 0
let pressScale = 1
let pressTarget = 1
let overHome = false
const mouse = { x: 0, y: 0 }
const cur = { x: 0, y: 0 }
const cstate = REST.map((p) => ({ x: p.x, y: p.y }))
let spinResumeTimer = null

function applyTransforms() {
  if (cursorEl.value) {
    cursorEl.value.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) scale(${pressScale})`
  }
  for (let i = 0; i < corners.length; i++) {
    corners[i].style.transform = `translate(${cstate[i].x}px, ${cstate[i].y}px)`
  }
}

function tick() {
  cur.x += (mouse.x - cur.x) * 0.35
  cur.y += (mouse.y - cur.y) * 0.35
  pressScale += (pressTarget - pressScale) * 0.3
  // 锁定强度按 hoverDuration 渐变(0.2s ≈ 每帧 0.25)
  const sTarget = activeTarget ? 1 : 0
  strength += (sTarget - strength) * Math.min(1, (1 / 60 / Math.max(0.05, props.hoverDuration)) * 3)
  let settled = Math.abs(mouse.x - cur.x) + Math.abs(mouse.y - cur.y) < 0.3 && Math.abs(pressTarget - pressScale) < 0.01
  for (let i = 0; i < corners.length; i++) {
    let dx = REST[i].x
    let dy = REST[i].y
    if (frame) {
      // 目标角(相对光标)与静息位按 strength 混合;光标移动 → 角反向偏移 = 视差
      const tx = frame[i].x - cur.x
      const ty = frame[i].y - cur.y
      dx = REST[i].x + (tx - REST[i].x) * strength
      dy = REST[i].y + (ty - REST[i].y) * strength
    }
    const k = activeTarget && strength > 0.95 && props.parallaxOn ? 0.22 : 0.35
    cstate[i].x += (dx - cstate[i].x) * k
    cstate[i].y += (dy - cstate[i].y) * k
    if (Math.abs(dx - cstate[i].x) + Math.abs(dy - cstate[i].y) > 0.3) settled = false
  }
  applyTransforms()
  if (!activeTarget && strength < 0.01 && settled && performance.now() - lastInput > 1500) {
    running = false
    return
  }
  raf = requestAnimationFrame(tick)
}

function wake() {
  lastInput = performance.now()
  if (!running) {
    running = true
    raf = requestAnimationFrame(tick)
  }
}

function setOverHome(v) {
  if (overHome === v) return
  overHome = v
  if (cursorEl.value) cursorEl.value.style.opacity = v ? '1' : '0'
  if (props.hideDefaultCursor) document.documentElement.classList.toggle('tc-cursor-on', v)
}

function snapFrame(target) {
  const rect = target.getBoundingClientRect()
  return [
    { x: rect.left - BORDER, y: rect.top - BORDER },
    { x: rect.right + BORDER - CORNER, y: rect.top - BORDER },
    { x: rect.right + BORDER - CORNER, y: rect.bottom + BORDER - CORNER },
    { x: rect.left - BORDER, y: rect.bottom + BORDER - CORNER },
  ]
}

function lockOn(target) {
  activeTarget = target
  frame = snapFrame(target)
  clearTimeout(spinResumeTimer)
  spinning.value = false // 摘下自旋(rotor 回 0°,角框与视口对齐)
  target.addEventListener('mouseleave', release, { once: true })
  wake()
}

function release() {
  if (!activeTarget) return
  activeTarget = null
  frame = null
  clearTimeout(spinResumeTimer)
  spinResumeTimer = setTimeout(() => {
    if (!activeTarget) spinning.value = true
  }, 320)
  wake()
}

function onMouseMove(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  setOverHome(!!(e.target && e.target.closest && e.target.closest('.VPHome')))
  wake()
}

function onMouseOver(e) {
  const t = e.target && e.target.closest ? e.target.closest(props.targetSelector) : null
  if (t && t !== activeTarget) {
    if (activeTarget) activeTarget.removeEventListener('mouseleave', release)
    lockOn(t)
  }
}

function onScroll() {
  if (!activeTarget) return
  const el = document.elementFromPoint(cur.x, cur.y)
  if (!el || el.closest(props.targetSelector) !== activeTarget) release()
}

function onDown() {
  pressTarget = 0.9
  if (dotEl.value) dotEl.value.style.transform = 'translate(-50%, -50%) scale(0.7)'
  wake()
}
function onUp() {
  pressTarget = 1
  if (dotEl.value) dotEl.value.style.transform = 'translate(-50%, -50%) scale(1)'
  wake()
}

onMounted(() => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const small = window.innerWidth <= 768
  const mobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    (navigator.userAgent || '').toLowerCase()
  )
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if ((hasTouch && small) || mobileUA || reduce) return
  show.value = true
  mouse.x = cur.x = window.innerWidth / 2
  mouse.y = cur.y = window.innerHeight / 2
  requestAnimationFrame(() => {
    corners = cursorEl.value ? [...cursorEl.value.querySelectorAll('.target-cursor-corner')] : []
    applyTransforms()
    if (cursorEl.value) cursorEl.value.style.opacity = '0'
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    wake()
  })
})

onBeforeUnmount(() => {
  running = false
  if (raf) cancelAnimationFrame(raf)
  clearTimeout(spinResumeTimer)
  if (activeTarget) activeTarget.removeEventListener('mouseleave', release)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseover', onMouseOver)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousedown', onDown)
  window.removeEventListener('mouseup', onUp)
  document.documentElement.classList.remove('tc-cursor-on')
})
</script>

<style>
.target-cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity 0.18s ease;
}
.target-cursor-rotor {
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
}
.target-cursor-rotor.is-spinning {
  animation: tcSpin var(--tc-spin, 2s) linear infinite;
}
@keyframes tcSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.target-cursor-dot {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
}
.target-cursor-corner {
  position: absolute;
  left: 0;
  top: 0;
  width: 12px;
  height: 12px;
  border: 3px solid #fff;
  will-change: transform;
}
.corner-tl { border-right: none; border-bottom: none; }
.corner-tr { border-left: none; border-bottom: none; }
.corner-br { border-left: none; border-top: none; }
.corner-bl { border-right: none; border-top: none; }
/* 自定义光标生效期间,首页范围隐藏原生光标(出 .VPHome 即还原) */
.tc-cursor-on .VPHome,
.tc-cursor-on .VPHome * {
  cursor: none !important;
}
</style>
