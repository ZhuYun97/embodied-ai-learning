<!--
  DotField —— 主页鼠标互动点阵背景(React Bits DotField 的 Vue 3 移植版)。
  机制:canvas 画等距点阵,鼠标移动产生「鼓包」位移(bulge),速度驱动 engagement 渐入渐出;
  SVG 径向光晕跟随光标。移植时新增:空闲自动停帧(静止 ≈0.5s 后停 rAF,mousemove 唤醒)、
  prefers-reduced-motion / 触屏 → 只画一次静态点阵不绑监听、卸载全量清理。
  仅由 theme/index.js 的 HomeDots 包装层在首页挂载(client-only),不参与 SSR。
-->
<template>
  <div class="dot-field" aria-hidden="true">
    <canvas ref="canvasEl"></canvas>
    <svg class="dot-field__svg">
      <defs>
        <radialGradient :id="glowId">
          <stop offset="0%" :stop-color="glowColor" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
      <circle
        ref="glowEl"
        cx="-9999"
        cy="-9999"
        :r="glowRadius"
        :fill="`url(#${glowId})`"
        style="opacity: 0; will-change: opacity"
      />
    </svg>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const TWO_PI = Math.PI * 2

const props = defineProps({
  dotRadius: { type: Number, default: 1.5 },
  dotSpacing: { type: Number, default: 14 },
  cursorRadius: { type: Number, default: 500 },
  cursorForce: { type: Number, default: 0.1 },
  bulgeOnly: { type: Boolean, default: true },
  bulgeStrength: { type: Number, default: 67 },
  glowRadius: { type: Number, default: 160 },
  sparkle: { type: Boolean, default: false },
  waveAmplitude: { type: Number, default: 0 },
  gradientFrom: { type: String, default: 'rgba(168, 85, 247, 0.35)' },
  gradientTo: { type: String, default: 'rgba(180, 151, 207, 0.25)' },
  glowColor: { type: String, default: '#120F17' },
})

const canvasEl = ref(null)
const glowEl = ref(null)
const glowId = 'dot-field-glow'

let ctx = null
let dots = []
let raf = null
let running = false
let staticMode = false
let frameCount = 0
let idleFrames = 0
let resizeTimer = null
let speedInterval = null
const size = { w: 0, h: 0 }
const mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 }
let glowOpacity = 0
let engagement = 0

function buildDots() {
  const step = props.dotRadius + props.dotSpacing
  const cols = Math.floor(size.w / step)
  const rows = Math.floor(size.h / step)
  const padX = (size.w % step) / 2
  const padY = (size.h % step) / 2
  const next = new Array(rows * cols)
  let idx = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const ax = padX + col * step + step / 2
      const ay = padY + row * step + step / 2
      next[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay }
    }
  }
  dots = next
}

function drawFrame() {
  const m = mouse
  const len = dots.length
  const t = frameCount * 0.02
  ctx.clearRect(0, 0, size.w, size.h)
  const grad = ctx.createLinearGradient(0, 0, size.w, size.h)
  grad.addColorStop(0, props.gradientFrom)
  grad.addColorStop(1, props.gradientTo)
  ctx.fillStyle = grad

  const cr = props.cursorRadius
  const crSq = cr * cr
  const rad = props.dotRadius / 2
  const isBulge = props.bulgeOnly
  const eng = engagement

  ctx.beginPath()
  for (let i = 0; i < len; i++) {
    const d = dots[i]
    const dx = m.x - d.ax
    const dy = m.y - d.ay
    const distSq = dx * dx + dy * dy

    if (distSq < crSq && eng > 0.01) {
      const dist = Math.sqrt(distSq)
      if (isBulge) {
        const k = 1 - dist / cr
        const push = k * k * props.bulgeStrength * eng
        const angle = Math.atan2(dy, dx)
        d.sx += (d.ax - Math.cos(angle) * push - d.sx) * 0.15
        d.sy += (d.ay - Math.sin(angle) * push - d.sy) * 0.15
      } else {
        const angle = Math.atan2(dy, dx)
        const move = (500 / dist) * (m.speed * props.cursorForce)
        d.vx += Math.cos(angle) * -move
        d.vy += Math.sin(angle) * -move
      }
    } else if (isBulge) {
      d.sx += (d.ax - d.sx) * 0.1
      d.sy += (d.ay - d.sy) * 0.1
    }

    if (!isBulge) {
      d.vx *= 0.9
      d.vy *= 0.9
      d.x = d.ax + d.vx
      d.y = d.ay + d.vy
      d.sx += (d.x - d.sx) * 0.1
      d.sy += (d.y - d.sy) * 0.1
    }

    let drawX = d.sx
    let drawY = d.sy
    if (props.waveAmplitude > 0) {
      drawY += Math.sin(d.ax * 0.03 + t) * props.waveAmplitude
      drawX += Math.cos(d.ay * 0.03 + t * 0.7) * props.waveAmplitude * 0.5
    }

    if (props.sparkle) {
      const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0
      const r = hash % 100 < 3 ? rad * 1.8 : rad
      ctx.moveTo(drawX + r, drawY)
      ctx.arc(drawX, drawY, r, 0, TWO_PI)
    } else {
      ctx.moveTo(drawX + rad, drawY)
      ctx.arc(drawX, drawY, rad, 0, TWO_PI)
    }
  }
  ctx.fill()
}

function tick() {
  frameCount++
  const targetEngagement = Math.min(mouse.speed / 5, 1)
  engagement += (targetEngagement - engagement) * 0.06
  if (engagement < 0.001) engagement = 0
  glowOpacity += (engagement - glowOpacity) * 0.08

  if (glowEl.value) {
    glowEl.value.setAttribute('cx', mouse.x)
    glowEl.value.setAttribute('cy', mouse.y)
    glowEl.value.style.opacity = glowOpacity
  }

  drawFrame()

  // 空闲停帧:无互动、无波浪/闪烁需求时,点阵已回稳 → 停掉 rAF,等 mousemove 唤醒
  if (engagement === 0 && glowOpacity < 0.005 && props.waveAmplitude <= 0 && !props.sparkle) {
    idleFrames++
    if (idleFrames > 30) {
      running = false
      return
    }
  } else {
    idleFrames = 0
  }
  raf = requestAnimationFrame(tick)
}

function wake() {
  idleFrames = 0
  if (!running && !staticMode) {
    running = true
    raf = requestAnimationFrame(tick)
  }
}

function doResize() {
  const canvas = canvasEl.value
  if (!canvas || !canvas.parentElement) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = canvas.parentElement.getBoundingClientRect()
  size.w = rect.width
  size.h = rect.height
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  buildDots()
  if (staticMode) drawFrame()
  else wake()
}

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(doResize, 100)
}

function onMouseMove(e) {
  // 层为 fixed 全视口,clientX/Y 即画布坐标
  const rect = canvasEl.value ? canvasEl.value.getBoundingClientRect() : { left: 0, top: 0 }
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
  wake()
}

function updateMouseSpeed() {
  const dx = mouse.prevX - mouse.x
  const dy = mouse.prevY - mouse.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  mouse.speed += (dist - mouse.speed) * 0.5
  if (mouse.speed < 0.001) mouse.speed = 0
  mouse.prevX = mouse.x
  mouse.prevY = mouse.y
}

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  ctx = canvas.getContext('2d', { alpha: true })
  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  staticMode = reduce || !fine

  doResize()
  window.addEventListener('resize', onResize)
  if (!staticMode) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    speedInterval = setInterval(updateMouseSpeed, 20)
    wake()
  } else {
    drawFrame()
  }
})

watch(
  () => [props.dotRadius, props.dotSpacing, props.gradientFrom, props.gradientTo],
  () => {
    if (!ctx) return
    buildDots()
    if (staticMode) drawFrame()
    else wake()
  }
)

onBeforeUnmount(() => {
  running = false
  if (raf) cancelAnimationFrame(raf)
  clearTimeout(resizeTimer)
  if (speedInterval) clearInterval(speedInterval)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.dot-field {
  position: relative;
  width: 100%;
  height: 100%;
}
.dot-field canvas,
.dot-field__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
