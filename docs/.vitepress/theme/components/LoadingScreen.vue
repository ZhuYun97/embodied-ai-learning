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
const hintText = computed(() => pageReady.value ? '点击进入' : '正在预热首页')
const readinessLabel = computed(() => {
  if (pageReady.value) return 'READY'
  if (coreReady.value) return 'SYNC'
  return 'WAKE'
})
const statusText = computed(() => pageReady.value ? '首页已就绪' : '正在载入研究星图')
const shimmerStyles = Array.from({ length: 14 }, (_, index) => {
  const n = index + 1
  return {
    '--x': `${7 + n * 6.2}%`,
    '--y': `${16 + (n % 7) * 9}%`,
    '--s': `${2 + (n % 4)}px`,
    '--d': `${2.6 + (n % 5) * 0.45}s`,
    '--delay': `${n * -0.22}s`,
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
    <div v-if="isVisible" class="loading-screen" :class="{ 'is-ready': pageReady }" @click="skip">
      <div class="light-sculpture" aria-hidden="true">
        <span class="light light--cyan"></span>
        <span class="light light--violet"></span>
        <span class="light light--gold"></span>
      </div>
      <div class="shimmer-field" aria-hidden="true">
        <span v-for="(style, index) in shimmerStyles" :key="index" :style="style"></span>
      </div>
      <div class="surface-grain" aria-hidden="true"></div>
      <div class="stage-lines" aria-hidden="true">
        <span></span>
        <span></span>
      </div>

      <div class="loading-center" :class="{ 'is-ready': coreReady }">
        <div class="premium-lens" :style="{ opacity: robotOpacity }" aria-hidden="true">
          <span class="lens-shadow"></span>
          <span class="lens-aura"></span>
          <span class="lens-ring lens-ring--outer"></span>
          <span class="lens-ring lens-ring--mid"></span>
          <span class="lens-ring lens-ring--inner"></span>
          <span class="lens-glass"></span>
          <span class="lens-reflection"></span>
          <span class="lens-scan"></span>
          <div class="robot-capsule">
            <span class="capsule-sheen"></span>
            <img :src="withBase('/hero-robot.svg')" alt="" />
          </div>
        </div>

        <div class="brand-lockup" :style="{ opacity: textOpacity }">
          <div class="brand-cn">具身星图</div>
          <div class="brand-en">Embodied AI Atlas</div>
          <div class="status-line">
            <span class="status-dot" aria-hidden="true"></span>
            <b>{{ readinessLabel }}</b>
            <span>{{ statusText }}</span>
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
  --loader-cyan: #6de8ff;
  --loader-blue: #2563eb;
  --loader-violet: #9f8cff;
  --loader-gold: #e9c46a;
  --loader-ink: #050812;
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 40%, rgba(109, 232, 255, 0.15), transparent 25rem),
    radial-gradient(circle at 72% 68%, rgba(159, 140, 255, 0.12), transparent 28rem),
    linear-gradient(145deg, #02040a 0%, #07101d 48%, #030713 100%);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
}

.loading-screen::before {
  content: '';
  position: absolute;
  inset: -24%;
  background:
    radial-gradient(circle at 50% 48%, transparent 0 26%, rgba(109, 232, 255, 0.08) 32%, transparent 38%),
    conic-gradient(from 210deg at 50% 50%, transparent 0 16%, rgba(109, 232, 255, 0.1) 22%, transparent 30% 60%, rgba(233, 196, 106, 0.08) 67%, transparent 76% 100%);
  opacity: 0.74;
  filter: blur(24px);
  animation: atmosphere-turn 22s linear infinite;
}

.loading-screen::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 18%, rgba(0, 0, 0, 0.3)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.018) 0, rgba(255, 255, 255, 0.018) 1px, transparent 1px, transparent 5px);
  opacity: 0.72;
  pointer-events: none;
}

.light-sculpture,
.shimmer-field,
.surface-grain,
.stage-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.light {
  position: absolute;
  border-radius: 999px;
  filter: blur(42px);
  mix-blend-mode: screen;
  opacity: 0.58;
}

.light--cyan {
  left: 12%;
  top: 18%;
  width: 34vw;
  height: 34vw;
  background: rgba(109, 232, 255, 0.22);
  animation: slow-light-a 8s ease-in-out infinite;
}

.light--violet {
  right: 10%;
  top: 22%;
  width: 30vw;
  height: 30vw;
  background: rgba(159, 140, 255, 0.2);
  animation: slow-light-b 9.5s ease-in-out infinite;
}

.light--gold {
  left: 44%;
  bottom: 10%;
  width: 22vw;
  height: 22vw;
  background: rgba(233, 196, 106, 0.12);
  animation: slow-light-c 10.5s ease-in-out infinite;
}

.surface-grain {
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.06) 0 1px, transparent 1.2px),
    radial-gradient(circle at 70% 60%, rgba(109, 232, 255, 0.08) 0 1px, transparent 1.2px);
  background-size: 44px 44px, 72px 72px;
  opacity: 0.18;
  mask-image: radial-gradient(circle at 50% 48%, #000 0 42%, transparent 72%);
}

.shimmer-field span {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--s);
  height: var(--s);
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.92);
  box-shadow: 0 0 20px rgba(109, 232, 255, 0.78);
  opacity: 0;
  animation: star-breathe var(--d) ease-in-out infinite;
  animation-delay: var(--delay);
}

.stage-lines span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(72vw, 760px);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(109, 232, 255, 0.18), transparent);
  transform: translate(-50%, -50%);
}

.stage-lines span:nth-child(1) {
  margin-top: -142px;
}

.stage-lines span:nth-child(2) {
  margin-top: 168px;
  background: linear-gradient(90deg, transparent, rgba(233, 196, 106, 0.14), transparent);
}

.loading-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: translateY(10px) scale(0.985);
  transition:
    transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  filter: saturate(0.92);
}

.loading-center.is-ready {
  transform: translateY(0) scale(1);
  filter: saturate(1.04);
}

.premium-lens {
  position: relative;
  width: 296px;
  height: 296px;
  margin-bottom: 2rem;
  display: grid;
  place-items: center;
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.lens-shadow,
.lens-aura,
.lens-ring,
.lens-glass,
.lens-reflection,
.lens-scan {
  position: absolute;
  pointer-events: none;
}

.lens-shadow {
  inset: 54px 32px 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  filter: blur(34px);
  transform: translateY(32px) scaleX(1.18);
}

.lens-aura {
  inset: 18px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 44%, rgba(109, 232, 255, 0.34), transparent 56%),
    radial-gradient(circle at 38% 74%, rgba(233, 196, 106, 0.22), transparent 54%),
    radial-gradient(circle at 64% 24%, rgba(159, 140, 255, 0.28), transparent 50%);
  filter: blur(12px);
  opacity: 0.76;
  animation: lens-aura-pulse 3.8s ease-in-out infinite;
}

.lens-ring {
  border-radius: 50%;
}

.lens-ring--outer {
  inset: 6px;
  background:
    conic-gradient(from 130deg, transparent 0 9%, rgba(109, 232, 255, 0.9) 13%, transparent 20% 48%, rgba(233, 196, 106, 0.74) 56%, transparent 62% 78%, rgba(159, 140, 255, 0.72) 83%, transparent 92% 100%);
  -webkit-mask: radial-gradient(circle, transparent 0 64%, #000 65% 67%, transparent 68%);
  mask: radial-gradient(circle, transparent 0 64%, #000 65% 67%, transparent 68%);
  animation: lens-spin 5.8s cubic-bezier(0.5, 0, 0.25, 1) infinite;
}

.lens-ring--mid {
  inset: 30px;
  border: 1px solid rgba(226, 232, 240, 0.13);
  box-shadow:
    inset 0 0 42px rgba(109, 232, 255, 0.12),
    0 0 46px rgba(109, 232, 255, 0.16);
}

.lens-ring--inner {
  inset: 74px;
  background:
    repeating-conic-gradient(from 0deg, rgba(226, 232, 240, 0.24) 0deg 2deg, transparent 2deg 13deg);
  -webkit-mask: radial-gradient(circle, transparent 0 80%, #000 81% 83%, transparent 84%);
  mask: radial-gradient(circle, transparent 0 80%, #000 81% 83%, transparent 84%);
  opacity: 0.6;
  animation: tick-turn 18s linear infinite reverse;
}

.lens-glass {
  inset: 52px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 36% 24%, rgba(255, 255, 255, 0.34), transparent 14%),
    radial-gradient(circle at 50% 50%, rgba(109, 232, 255, 0.08), rgba(2, 6, 23, 0.62) 62%, rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.36),
    inset 0 -28px 56px rgba(0, 0, 0, 0.36),
    0 22px 72px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(8px) saturate(1.35);
  -webkit-backdrop-filter: blur(8px) saturate(1.35);
}

.lens-reflection {
  inset: 68px 76px 142px 82px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.02));
  filter: blur(1px);
  opacity: 0.42;
  transform: rotate(-16deg);
}

.lens-scan {
  left: 46px;
  right: 46px;
  height: 1px;
  top: 50%;
  background: linear-gradient(90deg, transparent, rgba(109, 232, 255, 0.95), rgba(255, 255, 255, 0.9), transparent);
  box-shadow: 0 0 22px rgba(109, 232, 255, 0.8);
  animation: optical-scan 2.2s ease-in-out infinite;
}

.robot-capsule {
  position: relative;
  width: 122px;
  height: 122px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 28%, rgba(109, 232, 255, 0.2), transparent 50%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(7, 17, 31, 0.45));
  border: 1px solid rgba(226, 232, 240, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -26px 44px rgba(2, 6, 23, 0.38),
    0 16px 44px rgba(0, 0, 0, 0.34),
    0 0 38px rgba(109, 232, 255, 0.24);
  overflow: hidden;
}

.capsule-sheen {
  content: '';
  position: absolute;
  inset: -20% 10% 54% 10%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  filter: blur(10px);
}

.robot-capsule img {
  width: 74%;
  height: 74%;
  object-fit: contain;
  filter:
    drop-shadow(0 0 14px rgba(109, 232, 255, 0.55))
    drop-shadow(0 10px 20px rgba(0, 0, 0, 0.28));
  animation: robot-float 2.6s ease-in-out infinite;
}

@keyframes robot-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes atmosphere-turn {
  from { transform: rotate(0deg) scale(1); }
  to { transform: rotate(360deg) scale(1); }
}

@keyframes slow-light-a {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(8%, -4%, 0) scale(1.06); }
}

@keyframes slow-light-b {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-7%, 5%, 0) scale(1.05); }
}

@keyframes slow-light-c {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(4%, -8%, 0) scale(1.08); }
}

@keyframes star-breathe {
  0%, 100% { opacity: 0; transform: scale(0.6); }
  45%, 60% { opacity: 0.82; transform: scale(1); }
}

@keyframes lens-aura-pulse {
  0%, 100% { opacity: 0.62; transform: scale(0.98); }
  50% { opacity: 0.88; transform: scale(1.04); }
}

@keyframes lens-spin {
  0% { transform: rotate(0deg); opacity: 0.68; }
  52% { opacity: 1; }
  100% { transform: rotate(360deg); opacity: 0.68; }
}

@keyframes tick-turn {
  to { transform: rotate(360deg); }
}

@keyframes optical-scan {
  0%, 100% {
    opacity: 0;
    transform: translateY(-72px) scaleX(0.58);
  }
  18%, 78% {
    opacity: 0.92;
  }
  50% {
    transform: translateY(72px) scaleX(1);
  }
}

/* 品牌文字 */
.brand-lockup {
  text-align: center;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.brand-cn {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  font-size: 2.15rem;
  font-weight: 800;
  letter-spacing: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #9eeeff 38%, #f0d789 76%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
}

.brand-en {
  font-family: 'Orbitron', monospace;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0;
  color: rgba(203, 213, 225, 0.78);
  text-transform: uppercase;
}

.status-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  max-width: min(360px, calc(100vw - 48px));
  min-height: 32px;
  margin: 1.1rem auto 0;
  padding: 6px 10px;
  border: 1px solid rgba(226, 232, 240, 0.14);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.34);
  color: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(14px) saturate(1.22);
  -webkit-backdrop-filter: blur(14px) saturate(1.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 18px 42px rgba(0, 0, 0, 0.18);
}

.status-line b,
.status-line span:last-child {
  font-size: 0.72rem;
  line-height: 1.2;
  letter-spacing: 0;
}

.status-line b {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  color: var(--loader-gold);
}

.status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--loader-cyan);
  box-shadow: 0 0 14px rgba(109, 232, 255, 0.86);
  animation: dot-pulse 1.5s ease-in-out infinite;
}

.boot-progress {
  position: absolute;
  left: 50%;
  bottom: 4.8rem;
  width: min(320px, calc(100vw - 64px));
  height: 3px;
  transform: translateX(-50%);
  overflow: hidden;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.13);
  box-shadow: 0 0 32px rgba(109, 232, 255, 0.12);
}

.boot-progress::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 38%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  transform: translateX(-110%);
  animation: ready-scan 1.1s ease-in-out infinite;
}

.boot-progress.is-ready {
  background: rgba(109, 232, 255, 0.18);
  box-shadow: 0 0 30px rgba(109, 232, 255, 0.26);
}

.boot-progress.is-ready::after {
  opacity: 0;
}

.boot-progress span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--loader-cyan), #f8fafc, var(--loader-gold), var(--loader-violet));
  animation: boot-fill 1.9s cubic-bezier(0.24, 0.8, 0.24, 1) forwards;
}

@keyframes boot-fill {
  from { transform: scaleX(0.08); }
  to { transform: scaleX(1); }
}

@keyframes ready-scan {
  to { transform: translateX(280%); }
}

@keyframes dot-pulse {
  0%, 100% { opacity: 0.54; transform: scale(0.88); }
  50% { opacity: 1; transform: scale(1.08); }
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
  .premium-lens {
    width: 238px;
    height: 238px;
    margin-bottom: 1.55rem;
  }

  .lens-glass {
    inset: 42px;
  }

  .lens-ring--mid {
    inset: 24px;
  }

  .lens-ring--inner {
    inset: 58px;
  }

  .robot-capsule {
    width: 98px;
    height: 98px;
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

  .stage-lines span {
    width: calc(100vw - 64px);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-screen::before,
  .light,
  .shimmer-field span,
  .lens-aura,
  .lens-ring--outer,
  .lens-ring--inner,
  .lens-scan,
  .robot-capsule img,
  .status-dot,
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

  .premium-lens,
  .brand-lockup {
    transition: opacity 0.3s ease;
  }
}
</style>
