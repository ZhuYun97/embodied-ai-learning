<script setup>
import { ref, onBeforeUnmount, onMounted, computed, nextTick } from 'vue'
import { withBase } from 'vitepress'

const isVisible = ref(true)
const robotOpacity = ref(0)
const textOpacity = ref(0)
const coreReady = ref(false)
const pageReady = ref(false)
const minDurationElapsed = ref(false)
const isFirstVisit = ref(true)

let timer = null
let robotTimer = null
let textTimer = null
let coreTimer = null
let readyTimer = null
let handleSkip = null
const cleanupFns = []

// 检查是否首次访问
const checkFirstVisit = () => {
  try {
    const visited = localStorage.getItem('vp-visited-loader-v7')
    if (visited) {
      isFirstVisit.value = false
      return false
    }
    localStorage.setItem('vp-visited-loader-v7', '1')
    return true
  } catch (e) {
    return true
  }
}

// 显示时长：首次访问保留完整启动感，后续访问快速掠过
const displayDuration = computed(() => isFirstVisit.value ? 2400 : 720)
const maxReadyWait = computed(() => isFirstVisit.value ? 12000 : 9000)
const hintText = computed(() => pageReady.value ? '点击或按任意键进入' : '正在装载首页内容')
const bootPhase = computed(() => {
  if (pageReady.value) return 'HOME READY'
  if (coreReady.value) return 'SYNCING ATLAS'
  return 'WAKING CORE'
})
const bootSubline = computed(() =>
  pageReady.value ? '首屏资源已就绪' : '校准 VLA / WAM / DATA 首屏索引'
)
const telemetryItems = ['VLA INDEX', 'WAM GRAPH', 'DATA ROUTES']
const particleCount = 18
const particleStyles = Array.from({ length: particleCount }, (_, index) => {
  const n = index + 1
  return {
    '--x': `${n * 5.4 - 4}%`,
    '--h': `${44 + (n % 5) * 12}px`,
    '--dur': `${3.6 + (n % 7) * 0.38}s`,
    '--delay': `${n * -0.31}s`,
    '--op': String(0.18 + (n % 4) * 0.08),
  }
})

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const withTimeout = (promise, ms) => {
  let done = false
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (done) return
      done = true
      resolve()
    }, ms)
    Promise.resolve(promise)
      .catch(() => undefined)
      .then(() => {
        if (done) return
        done = true
        clearTimeout(timeout)
        resolve()
      })
  })
}

const waitForEvent = (target, events) => {
  if (!target?.addEventListener) return Promise.resolve()
  const names = Array.isArray(events) ? events : [events]
  return new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      names.forEach((name) => target.removeEventListener(name, done))
      resolve()
    }
    names.forEach((name) => target.addEventListener(name, done, { once: true }))
    cleanupFns.push(() => names.forEach((name) => target.removeEventListener(name, done)))
  })
}

const waitForWindowLoad = () => {
  if (document.readyState === 'complete') return Promise.resolve()
  return waitForEvent(window, 'load')
}

const waitForFrames = (count = 1) =>
  new Promise((resolve) => {
    const step = () => {
      count -= 1
      if (count <= 0) resolve()
      else requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })

const waitForCondition = (check, timeout = 4000) =>
  new Promise((resolve) => {
    const start = performance.now()
    const tick = () => {
      let ok = false
      try {
        ok = Boolean(check())
      } catch (e) {}
      if (ok || performance.now() - start >= timeout) {
        resolve(ok)
        return
      }
      requestAnimationFrame(tick)
    }
    tick()
  })

const waitForFonts = () => {
  if (!document.fonts?.ready) return Promise.resolve()
  return document.fonts.ready
}

const waitForImageElement = (img) => {
  if (!img || (img.complete && img.naturalWidth > 0)) return Promise.resolve()
  return waitForEvent(img, ['load', 'error'])
}

const waitForStandaloneImage = (src) => {
  if (!src) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = src
    if (img.complete) resolve()
  })
}

const waitForVideoElement = (video) => {
  if (!video || video.readyState >= 2) return Promise.resolve()
  try {
    if (video.preload === 'none') video.preload = 'auto'
    video.load?.()
  } catch (e) {}
  return waitForEvent(video, ['loadeddata', 'canplay', 'error'])
}

const isInitialViewportMedia = (el) => {
  const rect = el.getBoundingClientRect()
  return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 1.35 && rect.bottom > -80
}

const waitForCriticalMedia = async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

  const media = Array.from(document.querySelectorAll('img, video')).filter(isInitialViewportMedia)
  const imageWaits = media
    .filter((el) => el.tagName === 'IMG')
    .map((img) => withTimeout(waitForImageElement(img), 2200))
  const videoWaits = media
    .filter((el) => el.tagName === 'VIDEO')
    .map((video) => withTimeout(waitForVideoElement(video), 2600))

  const knownHeroAssets = [
    withBase('/hero-robot.svg'),
    withBase('/hero-bg.jpg'),
  ].map((src) => withTimeout(waitForStandaloneImage(src), 2200))

  await Promise.all([...imageWaits, ...videoWaits, ...knownHeroAssets])
}

const getBasePath = () => {
  try {
    return new URL(import.meta.env.BASE_URL || '/', window.location.origin).pathname
  } catch (e) {
    return '/'
  }
}

const isHomePath = () => {
  const base = getBasePath()
  const path = window.location.pathname
  return path === base || path === base.replace(/\/$/, '') || path === `${base}index.html`
}

const waitForHomeShell = async () => {
  if (!isHomePath() && !document.querySelector('.VPHome')) return false
  const hasShell = await waitForCondition(() => {
    const home = document.querySelector('.VPHome')
    if (!home) return false
    return (
      home.querySelector('.thero') &&
      home.querySelector('.VPFeatures .VPFeature') &&
      home.querySelector('.vp-doc .route-card')
    )
  }, 8200)
  return hasShell
}

const waitForHomeBootDone = async () => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce || !document.querySelector('.VPHome .thero')) return
  await waitForCondition(() => document.documentElement.classList.contains('boot-done'), 3600)
}

const waitForHeroVideoReady = async () => {
  await waitForCondition(() => {
    const video = document.querySelector('.thero__robot--video')
    if (!video) return true
    const canvas = document.querySelector('.thero__robot--keyed')
    return video.dataset.ready === '1' || canvas?.dataset.ready === '1'
  }, 8200)
}

const waitForHeroBackgroundReady = async () => {
  if (!document.documentElement.classList.contains('dark')) return
  await waitForCondition(() => {
    const layer = document.querySelector('.hero-bg-layer')
    if (!layer) return true
    const distortion = layer.querySelector('.distortion-container')
    return distortion?.dataset.ready === 'true'
  }, 8200)
}

const waitForHomeContent = async () => {
  const hasHome = await waitForHomeShell()
  if (!hasHome) return
  await waitForFrames(2)
  await Promise.all([
    waitForHomeBootDone(),
    waitForHeroVideoReady(),
    waitForHeroBackgroundReady(),
    waitForCriticalMedia(),
  ])
  await waitForFrames(2)
}

const markPageReady = () => {
  if (pageReady.value) return
  clearTimeout(readyTimer)
  pageReady.value = true
  requestClose()
}

const waitForPageReady = async () => {
  await Promise.all([
    withTimeout(waitForWindowLoad(), 3600),
    withTimeout(waitForFonts(), 2200),
    withTimeout(waitForCriticalMedia(), 3200),
    waitForHomeContent(),
  ])
  await wait(80)
  markPageReady()
}

// 跳过加载动画
const skip = () => {
  requestClose()
}

const requestClose = () => {
  if (!isVisible.value || !pageReady.value || !minDurationElapsed.value) return
  isVisible.value = false
  document.documentElement.classList.add('boot-done')
}

onMounted(() => {
  checkFirstVisit()

  // 键盘/鼠标跳过
  handleSkip = () => skip()
  window.addEventListener('keydown', handleSkip, { once: true })
  window.addEventListener('click', handleSkip, { once: true })

  coreTimer = setTimeout(() => { coreReady.value = true }, 80)
  robotTimer = setTimeout(() => { robotOpacity.value = 1 }, 220)
  textTimer = setTimeout(() => { textOpacity.value = 1 }, 580)

  // 自动关闭
  timer = setTimeout(() => {
    minDurationElapsed.value = true
    requestClose()
  }, displayDuration.value)

  readyTimer = setTimeout(markPageReady, maxReadyWait.value)
  waitForPageReady()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(robotTimer)
  clearTimeout(textTimer)
  clearTimeout(coreTimer)
  clearTimeout(readyTimer)
  cleanupFns.splice(0).forEach((cleanup) => cleanup())
  if (handleSkip) {
    window.removeEventListener('keydown', handleSkip)
    window.removeEventListener('click', handleSkip)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="loading-screen" @click="skip">
      <div class="loading-aurora" aria-hidden="true">
        <span class="aurora-field aurora-field--a"></span>
        <span class="aurora-field aurora-field--b"></span>
        <span class="aurora-field aurora-field--c"></span>
      </div>
      <div class="loading-grid" aria-hidden="true"></div>
      <div class="loading-vignette" aria-hidden="true"></div>
      <div class="data-rain" aria-hidden="true">
        <span v-for="(style, index) in particleStyles" :key="index" :style="style"></span>
      </div>
      <div class="corner-frame" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- 中央内容 -->
      <div class="loading-center" :class="{ 'is-ready': coreReady }">
        <div class="system-label" :class="{ 'is-ready': pageReady }">
          <span>// ATLAS BOOT</span>
          <strong>{{ bootPhase }}</strong>
        </div>

        <!-- 机器人剪影 -->
        <div class="boot-core" :style="{ opacity: robotOpacity }" aria-hidden="true">
          <span class="core-shell"></span>
          <span class="core-ticks"></span>
          <span class="orbit orbit-a"></span>
          <span class="orbit orbit-b"></span>
          <span class="orbit orbit-c"></span>
          <span class="scan-line"></span>
          <span class="core-glow"></span>
          <div class="robot-silhouette">
            <img :src="withBase('/hero-robot.svg')" alt="" />
          </div>
          <div class="core-readout">
            <span>NEURAL NAV</span>
            <b>{{ pageReady ? 'READY' : 'SYNC' }}</b>
          </div>
        </div>

        <!-- 品牌文字 -->
        <div class="brand-text" :style="{ opacity: textOpacity }">
          <div class="brand-cn">具身星图</div>
          <div class="brand-en">Embodied AI Atlas</div>
          <div class="boot-modules" aria-hidden="true">
            <span>VLA</span>
            <span>WAM</span>
            <span>DATA</span>
          </div>
          <div class="boot-terminal">
            <span>{{ bootSubline }}</span>
            <i v-for="item in telemetryItems" :key="item">{{ item }}</i>
          </div>
        </div>
      </div>

      <div class="boot-progress" :class="{ 'is-ready': pageReady }" aria-hidden="true">
        <span></span>
      </div>

      <!-- 跳过提示 -->
      <div class="skip-hint">{{ hintText }}</div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 44%, rgba(34, 211, 238, 0.16), transparent 28rem),
    radial-gradient(circle at 72% 30%, rgba(139, 92, 246, 0.14), transparent 30rem),
    radial-gradient(circle at 24% 76%, rgba(245, 158, 11, 0.08), transparent 24rem),
    linear-gradient(145deg, #050914 0%, #08111f 48%, #0d1825 100%);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
}

.loading-screen::before {
  content: '';
  position: absolute;
  inset: -18%;
  background:
    conic-gradient(from 220deg at 50% 48%, transparent 0 18%, rgba(34, 211, 238, 0.1) 24%, transparent 34% 58%, rgba(167, 139, 250, 0.12) 66%, transparent 76% 100%),
    radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0), rgba(2, 6, 23, 0.6) 74%);
  opacity: 0.84;
  filter: blur(18px);
  animation: nebula-turn 18s linear infinite;
}

.loading-aurora,
.data-rain,
.corner-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.aurora-field {
  position: absolute;
  width: 54vw;
  height: 54vh;
  min-width: 420px;
  min-height: 320px;
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.46;
  mix-blend-mode: screen;
  transform: translate3d(0, 0, 0);
}

.aurora-field--a {
  left: -14%;
  top: 8%;
  background: rgba(34, 211, 238, 0.28);
  animation: aurora-drift-a 7.8s ease-in-out infinite;
}

.aurora-field--b {
  right: -16%;
  top: 18%;
  background: rgba(139, 92, 246, 0.26);
  animation: aurora-drift-b 9.2s ease-in-out infinite;
}

.aurora-field--c {
  left: 28%;
  bottom: -24%;
  background: rgba(16, 185, 129, 0.18);
  animation: aurora-drift-c 8.6s ease-in-out infinite;
}

.loading-grid {
  position: absolute;
  inset: -2px;
  opacity: 0.26;
  background-image:
    linear-gradient(rgba(125, 211, 252, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 211, 252, 0.1) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 72%);
  animation: grid-drift 8s linear infinite;
}

.loading-grid::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0 47%, rgba(125, 211, 252, 0.14) 50%, transparent 53% 100%),
    linear-gradient(180deg, transparent 0 47%, rgba(52, 211, 153, 0.1) 50%, transparent 53% 100%);
  background-size: 260px 260px;
  animation: grid-lock 4.8s ease-in-out infinite;
}

.loading-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 9, 20, 0.12), rgba(5, 9, 20, 0.82)),
    radial-gradient(circle at 50% 48%, transparent 0 22rem, rgba(0, 0, 0, 0.28) 38rem);
  pointer-events: none;
}

.data-rain span {
  position: absolute;
  left: var(--x);
  top: -12%;
  width: 1px;
  height: var(--h);
  background: linear-gradient(180deg, transparent, rgba(125, 211, 252, 0.72), transparent);
  opacity: var(--op);
  transform: translateY(-20vh);
  animation: data-fall var(--dur) linear infinite;
  animation-delay: var(--delay);
}

.data-rain span:nth-child(3n) {
  background: linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.68), transparent);
}

.data-rain span:nth-child(4n) {
  background: linear-gradient(180deg, transparent, rgba(245, 158, 11, 0.58), transparent);
}

.corner-frame span {
  position: absolute;
  width: min(18vw, 142px);
  height: min(18vw, 142px);
  border: 1px solid rgba(125, 211, 252, 0.28);
  opacity: 0.84;
}

.corner-frame span:nth-child(1) {
  top: 24px;
  left: 24px;
  border-right: 0;
  border-bottom: 0;
}

.corner-frame span:nth-child(2) {
  top: 24px;
  right: 24px;
  border-left: 0;
  border-bottom: 0;
}

.corner-frame span:nth-child(3) {
  right: 24px;
  bottom: 24px;
  border-left: 0;
  border-top: 0;
}

.corner-frame span:nth-child(4) {
  bottom: 24px;
  left: 24px;
  border-right: 0;
  border-top: 0;
}

.corner-frame span::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 7px;
  background: #67e8f9;
  box-shadow: 0 0 14px rgba(103, 232, 249, 0.84);
}

.corner-frame span:nth-child(1)::after { top: -4px; left: -4px; }
.corner-frame span:nth-child(2)::after { top: -4px; right: -4px; }
.corner-frame span:nth-child(3)::after { right: -4px; bottom: -4px; }
.corner-frame span:nth-child(4)::after { bottom: -4px; left: -4px; }

.loading-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: translateY(6px);
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.loading-center.is-ready {
  transform: translateY(0);
}

.system-label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
  margin-bottom: 1.05rem;
  padding: 5px 12px 5px 6px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 6px;
  background: rgba(2, 6, 23, 0.34);
  color: rgba(226, 232, 240, 0.9);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 14px 42px rgba(2, 6, 23, 0.28);
}

.system-label span {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 7px;
  border-radius: 4px;
  background: rgba(34, 211, 238, 0.1);
  color: #7dd3fc;
  font-family: 'Orbitron', monospace;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0;
}

.system-label strong {
  font-family: 'Orbitron', monospace;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0;
}

.system-label.is-ready {
  border-color: rgba(52, 211, 153, 0.42);
}

.system-label.is-ready span {
  color: #6ee7b7;
  background: rgba(16, 185, 129, 0.12);
}

.boot-core {
  position: relative;
  width: 238px;
  height: 238px;
  margin-bottom: 1.45rem;
  display: grid;
  place-items: center;
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.boot-core::before,
.boot-core::after {
  content: '';
  position: absolute;
  inset: 18px;
  border-radius: 50%;
  pointer-events: none;
}

.boot-core::before {
  border: 1px solid rgba(226, 232, 240, 0.14);
  box-shadow:
    inset 0 0 40px rgba(34, 211, 238, 0.08),
    0 0 60px rgba(34, 211, 238, 0.16);
}

.boot-core::after {
  border: 1px dashed rgba(125, 211, 252, 0.24);
  animation: dial-spin 10s linear infinite reverse;
}

.core-shell {
  position: absolute;
  inset: 6px;
  border-radius: 999px;
  background:
    conic-gradient(from 90deg, rgba(34, 211, 238, 0.04), rgba(34, 211, 238, 0.56), rgba(16, 185, 129, 0.28), rgba(245, 158, 11, 0.34), rgba(139, 92, 246, 0.52), rgba(34, 211, 238, 0.04));
  -webkit-mask: radial-gradient(circle, transparent 0 58%, #000 59% 62%, transparent 63%);
  mask: radial-gradient(circle, transparent 0 58%, #000 59% 62%, transparent 63%);
  animation: shell-scan 3.8s cubic-bezier(0.45, 0, 0.2, 1) infinite;
}

.core-ticks {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background:
    repeating-conic-gradient(from 0deg, rgba(226, 232, 240, 0.28) 0deg 1.8deg, transparent 1.8deg 10deg);
  -webkit-mask: radial-gradient(circle, transparent 0 47%, #000 48% 49.5%, transparent 50.5%);
  mask: radial-gradient(circle, transparent 0 47%, #000 48% 49.5%, transparent 50.5%);
  opacity: 0.42;
  animation: dial-spin 18s linear infinite;
}

.core-glow {
  position: absolute;
  width: 118px;
  height: 118px;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(56, 189, 248, 0.38), transparent 64%),
    radial-gradient(circle, rgba(16, 185, 129, 0.28), transparent 72%);
  filter: blur(4px);
  animation: core-breathe 1.8s ease-in-out infinite;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(125, 211, 252, 0.34);
  border-radius: 999px;
  box-shadow: 0 0 28px rgba(34, 211, 238, 0.18);
}

.orbit::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #67e8f9;
  box-shadow: 0 0 14px rgba(103, 232, 249, 0.9);
}

.orbit-a {
  width: 190px;
  height: 92px;
  transform: rotate(-17deg);
  animation: orbit-turn-a 2.6s linear infinite;
}

.orbit-a::after {
  top: 12px;
  right: 28px;
}

.orbit-b {
  width: 156px;
  height: 156px;
  border-color: rgba(167, 139, 250, 0.28);
  animation: orbit-turn-b 3.2s linear infinite reverse;
}

.orbit-b::after {
  left: 16px;
  bottom: 28px;
  background: #a78bfa;
  box-shadow: 0 0 14px rgba(167, 139, 250, 0.85);
}

.orbit-c {
  width: 96px;
  height: 196px;
  transform: rotate(23deg);
  border-color: rgba(52, 211, 153, 0.24);
  animation: orbit-turn-c 3.8s linear infinite;
}

.orbit-c::after {
  top: 30px;
  left: 8px;
  background: #34d399;
  box-shadow: 0 0 14px rgba(52, 211, 153, 0.85);
}

.scan-line {
  position: absolute;
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.95), transparent);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.72);
  animation: scan-pass 1.55s ease-in-out infinite;
}

.robot-silhouette {
  position: relative;
  width: 118px;
  height: 118px;
  display: grid;
  place-items: center;
  border-radius: 32px;
  background:
    linear-gradient(145deg, rgba(15, 23, 42, 0.68), rgba(8, 17, 31, 0.28)),
    radial-gradient(circle at 50% 22%, rgba(34, 211, 238, 0.18), transparent 64%);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 22px 60px rgba(2, 6, 23, 0.46),
    0 0 42px rgba(34, 211, 238, 0.25);
}

.robot-silhouette img {
  width: 74%;
  height: 74%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.5));
  animation: robot-float 2.6s ease-in-out infinite;
}

.core-readout {
  position: absolute;
  right: 8px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 24px;
  padding: 4px 7px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 5px;
  background: rgba(2, 6, 23, 0.54);
  box-shadow: 0 0 22px rgba(34, 211, 238, 0.14);
}

.core-readout span,
.core-readout b {
  font-family: 'Orbitron', monospace;
  font-size: 0.58rem;
  line-height: 1;
  letter-spacing: 0;
}

.core-readout span {
  color: rgba(226, 232, 240, 0.62);
}

.core-readout b {
  color: #67e8f9;
}

@keyframes robot-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes nebula-turn {
  from { transform: rotate(0deg) scale(1); }
  to { transform: rotate(360deg) scale(1); }
}

@keyframes aurora-drift-a {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(12%, -6%, 0) scale(1.08); }
}

@keyframes aurora-drift-b {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-10%, 8%, 0) scale(1.05); }
}

@keyframes aurora-drift-c {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(4%, -12%, 0) scale(1.12); }
}

@keyframes data-fall {
  to { transform: translateY(120vh); }
}

@keyframes grid-lock {
  0%, 100% { opacity: 0.18; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.04); }
}

@keyframes shell-scan {
  0% { transform: rotate(0deg); opacity: 0.68; }
  55% { opacity: 1; }
  100% { transform: rotate(360deg); opacity: 0.68; }
}

@keyframes dial-spin {
  to { transform: rotate(360deg); }
}

@keyframes orbit-turn-a {
  from { transform: rotate(-17deg); }
  to { transform: rotate(343deg); }
}

@keyframes orbit-turn-b {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbit-turn-c {
  from { transform: rotate(23deg); }
  to { transform: rotate(383deg); }
}

@keyframes scan-pass {
  0%, 100% {
    opacity: 0;
    transform: translateY(-58px);
  }
  18%, 82% {
    opacity: 1;
  }
  50% {
    transform: translateY(58px);
  }
}

@keyframes core-breathe {
  0%, 100% {
    opacity: 0.72;
    transform: scale(0.96);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes grid-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(72px, 72px, 0); }
}

/* 品牌文字 */
.brand-text {
  text-align: center;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.brand-cn {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0;
  background: linear-gradient(135deg, #e0f2fe 0%, #38bdf8 42%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
}

.brand-en {
  font-family: 'Orbitron', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
  color: rgba(148, 163, 184, 0.8);
  text-transform: uppercase;
}

.boot-modules {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.boot-modules span {
  display: inline-flex;
  align-items: center;
  min-width: 54px;
  height: 28px;
  justify-content: center;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.48);
  color: rgba(226, 232, 240, 0.82);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  animation: module-pop 1.4s ease-in-out infinite;
}

.boot-modules span:nth-child(2) {
  animation-delay: 0.16s;
}

.boot-modules span:nth-child(3) {
  animation-delay: 0.32s;
}

.boot-terminal {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7px;
  width: min(420px, calc(100vw - 48px));
  margin: 1.1rem auto 0;
  color: rgba(203, 213, 225, 0.74);
}

.boot-terminal span,
.boot-terminal i {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 4px 8px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 5px;
  background: rgba(15, 23, 42, 0.34);
  font-size: 0.68rem;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: 0;
}

.boot-terminal span {
  flex-basis: 100%;
  justify-content: center;
  color: rgba(226, 232, 240, 0.82);
}

.boot-terminal i {
  color: rgba(125, 211, 252, 0.76);
  font-family: 'Orbitron', monospace;
  font-weight: 700;
}

.boot-progress {
  position: absolute;
  left: 50%;
  bottom: 4.6rem;
  width: min(280px, calc(100vw - 64px));
  height: 3px;
  transform: translateX(-50%);
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  box-shadow: 0 0 24px rgba(34, 211, 238, 0.14);
}

.boot-progress::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 38%;
  background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.5), transparent);
  transform: translateX(-110%);
  animation: ready-scan 1.1s ease-in-out infinite;
}

.boot-progress.is-ready {
  background: rgba(34, 211, 238, 0.18);
  box-shadow: 0 0 28px rgba(34, 211, 238, 0.26);
}

.boot-progress.is-ready::after {
  opacity: 0;
}

.boot-progress span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, #22d3ee, #38bdf8, #a78bfa);
  animation: boot-fill 1.75s cubic-bezier(0.24, 0.8, 0.24, 1) forwards;
}

@keyframes module-pop {
  0%, 100% {
    border-color: rgba(125, 211, 252, 0.24);
    transform: translateY(0);
  }
  50% {
    border-color: rgba(125, 211, 252, 0.48);
    transform: translateY(-2px);
  }
}

@keyframes boot-fill {
  from { transform: scaleX(0.08); }
  to { transform: scaleX(1); }
}

@keyframes ready-scan {
  to { transform: translateX(280%); }
}

/* 跳过提示 */
.skip-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.5);
  letter-spacing: 0;
  pointer-events: none;
  animation: hint-pulse 2s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* 淡入淡出 */
.fade-enter-active {
  transition: opacity 0.4s ease;
}

.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .boot-core {
    width: 188px;
    height: 188px;
    margin-bottom: 1.25rem;
  }

  .orbit-a {
    width: 154px;
    height: 74px;
  }

  .orbit-b {
    width: 128px;
    height: 128px;
  }

  .orbit-c {
    width: 80px;
    height: 158px;
  }

  .robot-silhouette {
    width: 96px;
    height: 96px;
    border-radius: 24px;
  }

  .core-readout {
    right: -4px;
    bottom: 16px;
    transform: scale(0.88);
  }

  .system-label {
    margin-bottom: 0.85rem;
    gap: 8px;
  }

  .system-label span,
  .system-label strong {
    font-size: 0.62rem;
  }

  .brand-cn {
    font-size: 1.5rem;
  }

  .brand-en {
    font-size: 0.75rem;
  }

  .skip-hint {
    bottom: 1.5rem;
    font-size: 0.6875rem;
  }

  .boot-progress {
    bottom: 3.8rem;
  }

  .boot-terminal {
    width: min(330px, calc(100vw - 36px));
    gap: 5px;
  }

  .boot-terminal span,
  .boot-terminal i {
    font-size: 0.62rem;
    padding: 4px 6px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-screen::before,
  .aurora-field,
  .loading-grid,
  .loading-grid::after,
  .data-rain span,
  .core-shell,
  .core-ticks,
  .boot-core::after,
  .robot-silhouette img,
  .orbit,
  .scan-line,
  .core-glow,
  .boot-modules span,
  .boot-progress span {
    animation: none;
  }

  .boot-progress span {
    transform: scaleX(1);
  }

  .skip-hint {
    animation: none;
    opacity: 0.5;
  }

  .boot-core,
  .brand-text {
    transition: opacity 0.3s ease;
  }
}
</style>
