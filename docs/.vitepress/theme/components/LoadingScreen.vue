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
    const visited = localStorage.getItem('vp-visited-loader-v11')
    if (visited) {
      isFirstVisit.value = false
      return false
    }
    localStorage.setItem('vp-visited-loader-v11', '1')
    return true
  } catch (e) {
    return true
  }
}

// 显示时长：首次访问保留完整入场镜头，后续访问快速掠过
const displayDuration = computed(() => isFirstVisit.value ? 3000 : 760)
const maxReadyWait = computed(() => isFirstVisit.value ? 12000 : 9000)
const hintText = computed(() => pageReady.value ? '点击进入' : '请稍候')
const readinessLabel = computed(() => pageReady.value ? '入口已开' : '入场中')
const statusText = computed(() => pageReady.value ? '具身世界已就绪' : '正在打开具身世界')
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
  robotTimer = setTimeout(() => { robotOpacity.value = 1 }, 140)
  textTimer = setTimeout(() => { textOpacity.value = 1 }, 720)

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
    <div
      v-if="isVisible"
      class="loading-screen"
      :class="{ 'is-ready': pageReady }"
      :style="{ '--loader-bg': `url(${withBase('/hero-bg.jpg')})` }"
      @click="skip"
    >
      <div class="cinema-backdrop" aria-hidden="true"></div>
      <div class="cinema-grade" aria-hidden="true"></div>
      <div class="surface-grain" aria-hidden="true"></div>

      <div class="loading-center" :class="{ 'is-ready': coreReady }">
        <div class="entry-scene" :style="{ opacity: robotOpacity }" aria-hidden="true">
          <span class="portal-depth"></span>
          <span class="portal-slit"></span>
          <span class="portal-bloom"></span>
          <span class="floor-plane"></span>
          <span class="floor-trace floor-trace--near"></span>
          <span class="floor-trace floor-trace--far"></span>
          <video
            class="guide-video"
            :src="withBase('/hero-laser-human.mp4')"
            muted
            playsinline
            autoplay
            loop
            preload="auto"
          ></video>
          <div class="guide-figure">
            <span class="guide-halo"></span>
            <span class="guide-head"></span>
            <span class="guide-torso"></span>
            <span class="guide-arm guide-arm--left"></span>
            <span class="guide-arm guide-arm--right"></span>
            <span class="guide-leg guide-leg--left"></span>
            <span class="guide-leg guide-leg--right"></span>
          </div>
          <span class="guide-shadow"></span>
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
  width: min(430px, 86vw);
  height: 330px;
  margin-bottom: 1.7rem;
  display: grid;
  place-items: center;
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 900px;
}

.lens-shadow,
.embodied-world,
.world-sky,
.world-grid,
.world-horizon,
.entry-gate,
.entry-core,
.entry-scan,
.route-line,
.world-node,
.guide-beam {
  position: absolute;
  pointer-events: none;
}

.lens-shadow {
  left: 50%;
  bottom: 8px;
  width: min(360px, 76vw);
  height: 78px;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.58), transparent 72%),
    radial-gradient(ellipse at 50% 52%, rgba(109, 232, 255, 0.16), transparent 62%);
  filter: blur(34px);
  transform: translateX(-50%);
}

.embodied-world {
  inset: 0;
  overflow: hidden;
  border-radius: 26px;
  transform: rotateX(0.001deg);
  filter: saturate(1.14);
}

.embodied-world::before {
  content: '';
  position: absolute;
  inset: 20px 42px 0;
  background:
    radial-gradient(circle at 50% 42%, rgba(236, 254, 255, 0.16), transparent 19%),
    radial-gradient(circle at 50% 46%, rgba(109, 232, 255, 0.18), transparent 31%),
    radial-gradient(circle at 50% 56%, rgba(159, 140, 255, 0.12), transparent 55%);
  opacity: 0.88;
  filter: blur(8px);
  animation: world-breathe 4.2s ease-in-out infinite;
}

.embodied-world::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 112px;
  width: 318px;
  height: 170px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(236, 254, 255, 0.34), rgba(109, 232, 255, 0.12) 32%, transparent 76%),
    linear-gradient(180deg, rgba(109, 232, 255, 0.18), transparent 78%);
  clip-path: polygon(43% 0, 57% 0, 100% 100%, 0 100%);
  opacity: 0.5;
  transform: translateX(-50%);
  filter: blur(0.6px);
  animation: entry-cone-open 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
}

.world-sky {
  inset: 8px 16px 74px;
  border-radius: 24px 24px 46% 46%;
  background:
    radial-gradient(circle at 50% 34%, rgba(236, 254, 255, 0.18), transparent 10%),
    radial-gradient(circle at 46% 44%, rgba(109, 232, 255, 0.22), transparent 24%),
    radial-gradient(circle at 60% 36%, rgba(159, 140, 255, 0.16), transparent 26%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.03), rgba(15, 23, 42, 0.46));
  border: 1px solid rgba(226, 232, 240, 0.11);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.09),
    inset 0 -46px 80px rgba(2, 6, 23, 0.4);
}

.world-grid {
  left: 24px;
  right: 24px;
  bottom: 10px;
  height: 148px;
  background:
    linear-gradient(rgba(109, 232, 255, 0.42) 1px, transparent 1px),
    linear-gradient(90deg, rgba(109, 232, 255, 0.3) 1px, transparent 1px),
    radial-gradient(ellipse at 50% 0%, rgba(109, 232, 255, 0.26), transparent 62%);
  background-size: 100% 18px, 28px 100%, 100% 100%;
  transform: perspective(430px) rotateX(66deg);
  transform-origin: center bottom;
  opacity: 0.68;
  filter: drop-shadow(0 0 22px rgba(109, 232, 255, 0.24));
  animation: world-grid-forward 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 72%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 72%, transparent 100%);
}

.world-horizon {
  left: 48px;
  right: 48px;
  top: 192px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(236, 254, 255, 0.48), rgba(109, 232, 255, 0.42), transparent);
  box-shadow:
    0 0 24px rgba(109, 232, 255, 0.4),
    0 0 64px rgba(159, 140, 255, 0.22);
  opacity: 0.78;
}

.entry-gate {
  left: 50%;
  top: 18px;
  border-radius: 999px 999px 42px 42px;
  transform: translateX(-50%);
}

.entry-gate--outer {
  width: 218px;
  height: 254px;
  background:
    conic-gradient(from 220deg, transparent 0 9%, rgba(109, 232, 255, 0.92) 13%, transparent 20% 43%, rgba(233, 196, 106, 0.72) 51%, transparent 58% 76%, rgba(159, 140, 255, 0.72) 82%, transparent 91% 100%),
    linear-gradient(180deg, rgba(236, 254, 255, 0.08), rgba(109, 232, 255, 0.03));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  padding: 2px;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.94;
  filter:
    drop-shadow(0 0 18px rgba(109, 232, 255, 0.42))
    drop-shadow(0 0 28px rgba(159, 140, 255, 0.22));
  animation: gate-open 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
}

.entry-gate--inner {
  top: 44px;
  width: 148px;
  height: 182px;
  border: 1px solid rgba(226, 232, 240, 0.16);
  background:
    radial-gradient(ellipse at 50% 34%, rgba(236, 254, 255, 0.18), transparent 16%),
    linear-gradient(180deg, rgba(109, 232, 255, 0.12), rgba(2, 6, 23, 0.34));
  box-shadow:
    inset 0 0 38px rgba(109, 232, 255, 0.16),
    0 0 42px rgba(109, 232, 255, 0.2);
  opacity: 0.72;
  animation: gate-core-breathe 2.8s ease-in-out infinite;
}

.entry-core {
  left: 50%;
  top: 86px;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.94) 0 6%, rgba(109, 232, 255, 0.66) 7% 24%, rgba(109, 232, 255, 0.14) 42%, transparent 70%),
    conic-gradient(from 0deg, rgba(109, 232, 255, 0.04), rgba(233, 196, 106, 0.42), rgba(159, 140, 255, 0.18), rgba(109, 232, 255, 0.04));
  transform: translateX(-50%);
  filter: blur(0.2px) drop-shadow(0 0 34px rgba(109, 232, 255, 0.64));
  animation: entry-core-pulse 2.2s ease-in-out infinite;
}

.entry-scan {
  left: 50%;
  top: 30px;
  width: 226px;
  height: 226px;
  border-radius: 999px;
  border: 1px solid rgba(109, 232, 255, 0.18);
  border-left-color: transparent;
  border-bottom-color: rgba(233, 196, 106, 0.28);
  transform: translateX(-50%) rotate(-18deg);
  animation: entry-scan-turn 6s linear infinite;
}

.route-line {
  --route-length: 154px;
  bottom: 60px;
  left: 50%;
  width: var(--route-length);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(236, 254, 255, 0.68), rgba(109, 232, 255, 0.38));
  transform-origin: left center;
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(109, 232, 255, 0.64));
  animation: route-light 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
}

.route-line--left {
  transform: rotate(-154deg);
}

.route-line--right {
  transform: rotate(-26deg);
  animation-delay: 0.12s;
}

.world-node {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(236, 254, 255, 0.92);
  border: 1px solid rgba(109, 232, 255, 0.84);
  box-shadow:
    0 0 0 4px rgba(109, 232, 255, 0.08),
    0 0 24px rgba(109, 232, 255, 0.9);
  opacity: 0;
  animation: world-node-pop 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
}

.world-node--vision {
  left: 76px;
  bottom: 96px;
  animation-delay: 0.2s;
}

.world-node--touch {
  right: 78px;
  bottom: 104px;
  animation-delay: 0.36s;
}

.world-node--policy {
  left: 132px;
  bottom: 52px;
  animation-delay: 0.52s;
}

.world-node--data {
  right: 128px;
  bottom: 54px;
  animation-delay: 0.68s;
}

.robot-capsule {
  position: relative;
  z-index: 2;
  width: 180px;
  height: 216px;
  display: grid;
  place-items: center;
  border-radius: 30px;
  transform-origin: center bottom;
  animation: robot-guide-enter 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
}

.robot-capsule::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 156px;
  height: 38px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(109, 232, 255, 0.32), rgba(2, 6, 23, 0.08) 62%, transparent 72%);
  transform: translateX(-50%);
  filter: blur(4px);
  opacity: 0.78;
}

.capsule-sheen,
.guide-beam {
  position: absolute;
}

.capsule-sheen {
  inset: 4px 18px auto;
  height: 58px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent 68%);
  filter: blur(8px);
  opacity: 0.48;
  transform: rotate(-10deg);
}

.guide-beam {
  --beam-length: 118px;
  left: 50%;
  bottom: 46px;
  width: var(--beam-length);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(236, 254, 255, 0.92), rgba(109, 232, 255, 0.12));
  transform-origin: left center;
  opacity: 0;
  filter: drop-shadow(0 0 9px rgba(109, 232, 255, 0.72));
  animation: guide-beam-sweep 3.1s cubic-bezier(0.22, 0.8, 0.22, 1) infinite;
}

.guide-beam--left {
  transform: rotate(-154deg);
}

.guide-beam--right {
  transform: rotate(-26deg);
  animation-delay: 0.1s;
}

.robot-capsule img {
  width: 124%;
  height: 124%;
  object-fit: contain;
  filter:
    drop-shadow(0 0 18px rgba(109, 232, 255, 0.6))
    drop-shadow(0 18px 24px rgba(0, 0, 0, 0.34));
  animation: robot-float 2.6s ease-in-out infinite;
}

.loading-screen.is-ready .entry-core,
.loading-screen.is-ready .world-node {
  filter: drop-shadow(0 0 28px rgba(109, 232, 255, 0.82));
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

@keyframes world-breathe {
  0%, 100% { opacity: 0.66; transform: scale(0.97); }
  44%, 70% { opacity: 0.96; transform: scale(1.02); }
}

@keyframes entry-cone-open {
  0%, 18% {
    opacity: 0;
    transform: translateX(-50%) scaleX(0.42) translateY(-10px);
  }
  48% {
    opacity: 0.58;
    transform: translateX(-50%) scaleX(0.86) translateY(0);
  }
  100% {
    opacity: 0.42;
    transform: translateX(-50%) scaleX(1) translateY(0);
  }
}

@keyframes world-grid-forward {
  0% {
    opacity: 0;
    background-position: 0 26px, 0 0, 0 0;
    transform: perspective(430px) rotateX(66deg) translateY(16px) scaleX(0.84);
  }
  24% {
    opacity: 0.36;
  }
  58%, 100% {
    opacity: 0.74;
    background-position: 0 -12px, 14px 0, 0 0;
    transform: perspective(430px) rotateX(66deg) translateY(0) scaleX(1);
  }
}

@keyframes gate-open {
  0% {
    opacity: 0;
    transform: translateX(-50%) scaleX(0.74) scaleY(0.9);
    filter:
      drop-shadow(0 0 0 rgba(109, 232, 255, 0))
      drop-shadow(0 0 0 rgba(159, 140, 255, 0));
  }
  24% {
    opacity: 0.9;
    transform: translateX(-50%) scaleX(0.9) scaleY(0.96);
  }
  58%, 100% {
    opacity: 0.96;
    transform: translateX(-50%) scaleX(1) scaleY(1);
    filter:
      drop-shadow(0 0 20px rgba(109, 232, 255, 0.46))
      drop-shadow(0 0 30px rgba(159, 140, 255, 0.22));
  }
}

@keyframes gate-core-breathe {
  0%, 100% { opacity: 0.54; transform: translateX(-50%) scale(0.98); }
  50% { opacity: 0.86; transform: translateX(-50%) scale(1.02); }
}

@keyframes entry-core-pulse {
  0%, 100% {
    opacity: 0.7;
    transform: translateX(-50%) scale(0.86);
  }
  48%, 72% {
    opacity: 1;
    transform: translateX(-50%) scale(1.08);
  }
}

@keyframes entry-scan-turn {
  to { transform: translateX(-50%) rotate(342deg); }
}

@keyframes route-light {
  0%, 26% {
    opacity: 0;
    width: 0;
  }
  56% {
    opacity: 0.92;
    width: var(--route-length);
  }
  100% {
    opacity: 0.28;
    width: var(--route-length);
  }
}

@keyframes world-node-pop {
  0%, 36% {
    opacity: 0;
    transform: translateY(10px) scale(0.6);
  }
  54% {
    opacity: 1;
    transform: translateY(0) scale(1.08);
  }
  100% {
    opacity: 0.72;
    transform: translateY(0) scale(1);
  }
}

@keyframes robot-guide-enter {
  0% {
    opacity: 0;
    transform: translate3d(-48px, 42px, -80px) scale(0.72);
  }
  28% {
    opacity: 1;
    transform: translate3d(-16px, 18px, -32px) scale(0.88);
  }
  58%, 100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes guide-beam-sweep {
  0%, 30% {
    opacity: 0;
    width: 0;
  }
  56% {
    opacity: 0.78;
    width: var(--beam-length);
  }
  100% {
    opacity: 0.26;
    width: var(--beam-length);
  }
}

/* 品牌文字 */
.brand-lockup {
  text-align: center;
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.16s;
}

.brand-cn {
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'Source Han Sans SC', sans-serif;
  font-size: 2.02rem;
  font-weight: 650;
  line-height: 1.18;
  letter-spacing: 0;
  color: #eefcff;
  margin-bottom: 0.5rem;
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 18px rgba(109, 232, 255, 0.34),
    0 0 34px rgba(159, 140, 255, 0.16);
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

.brand-cn::after {
  content: '';
  display: block;
  width: 72px;
  height: 1px;
  margin: 0.55rem auto 0;
  background: linear-gradient(90deg, transparent, rgba(109, 232, 255, 0.72), rgba(233, 196, 106, 0.48), transparent);
  opacity: 0.88;
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
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
    width: min(330px, 88vw);
    height: 254px;
    margin-bottom: 1.35rem;
  }

  .world-sky {
    inset: 10px 12px 58px;
  }

  .world-grid {
    left: 18px;
    right: 18px;
    bottom: 8px;
    height: 112px;
    background-size: 100% 16px, 22px 100%, 100% 100%;
  }

  .world-horizon {
    left: 34px;
    right: 34px;
    top: 148px;
  }

  .entry-gate--outer {
    top: 14px;
    width: 168px;
    height: 198px;
  }

  .entry-gate--inner {
    top: 36px;
    width: 116px;
    height: 140px;
  }

  .entry-core {
    top: 70px;
    width: 58px;
    height: 58px;
  }

  .entry-scan {
    top: 22px;
    width: 174px;
    height: 174px;
  }

  .route-line {
    --route-length: 118px;
    bottom: 46px;
  }

  .world-node {
    width: 8px;
    height: 8px;
  }

  .world-node--vision {
    left: 54px;
    bottom: 72px;
  }

  .world-node--touch {
    right: 56px;
    bottom: 78px;
  }

  .world-node--policy {
    left: 94px;
    bottom: 38px;
  }

  .world-node--data {
    right: 92px;
    bottom: 40px;
  }

  .robot-capsule {
    width: 132px;
    height: 166px;
  }

  .robot-capsule::before {
    width: 118px;
    height: 30px;
  }

  .guide-beam {
    --beam-length: 92px;
    bottom: 36px;
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
  .embodied-world::before,
  .embodied-world::after,
  .world-grid,
  .entry-gate--outer,
  .entry-gate--inner,
  .entry-core,
  .entry-scan,
  .route-line,
  .world-node,
  .robot-capsule,
  .guide-beam,
  .robot-capsule img,
  .status-dot,
  .boot-progress span {
    animation: none;
  }

  .route-line,
  .guide-beam {
    opacity: 0.36;
  }

  .world-node {
    opacity: 0.76;
    transform: none;
  }

  .robot-capsule {
    opacity: 1;
    transform: none;
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

/* v11 cinematic loader: restrained robot-guide entrance */
.loading-screen {
  --loader-cyan: #8ae8ff;
  --loader-violet: #7f7cff;
  --loader-gold: #d6b36a;
  align-items: center;
  justify-content: center;
  background: #050713;
  color: #eefcff;
}

.loading-screen::before {
  inset: 0;
  background:
    radial-gradient(circle at 50% 44%, rgba(138, 232, 255, 0.14), transparent 30rem),
    linear-gradient(180deg, rgba(2, 6, 23, 0.04), rgba(2, 6, 23, 0.72));
  opacity: 1;
  filter: none;
  animation: none;
}

.loading-screen::after {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 18%, rgba(0, 0, 0, 0.42)),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.018) 0, rgba(255, 255, 255, 0.018) 1px, transparent 1px, transparent 6px);
  opacity: 0.62;
}

.cinema-backdrop,
.cinema-grade {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cinema-backdrop {
  inset: -5%;
  background-image:
    linear-gradient(90deg, rgba(3, 7, 18, 0.82), rgba(3, 7, 18, 0.24) 46%, rgba(3, 7, 18, 0.76)),
    var(--loader-bg);
  background-size: cover;
  background-position: center;
  opacity: 0.54;
  filter: saturate(1.04) contrast(1.06) brightness(0.82);
  transform: scale(1.04);
  animation: cinematic-drift 7s ease-in-out infinite alternate;
}

.cinema-grade {
  background:
    radial-gradient(ellipse at 50% 44%, rgba(138, 232, 255, 0.12), transparent 32%),
    radial-gradient(ellipse at 50% 84%, rgba(3, 7, 18, 0.6), transparent 54%),
    linear-gradient(90deg, rgba(3, 7, 18, 0.72), transparent 34%, transparent 66%, rgba(3, 7, 18, 0.72));
}

.surface-grain {
  background-image:
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.16) 0 1px, transparent 1.4px),
    radial-gradient(circle at 78% 68%, rgba(138, 232, 255, 0.18) 0 1px, transparent 1.4px);
  background-size: 96px 96px, 140px 140px;
  opacity: 0.11;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(180deg, transparent, #000 18%, #000 82%, transparent);
}

.loading-center {
  width: min(720px, calc(100vw - 36px));
  transform: translateY(12px) scale(0.99);
  filter: none;
}

.loading-center.is-ready {
  transform: translateY(0) scale(1);
  filter: none;
}

.entry-scene {
  position: relative;
  width: min(560px, 88vw);
  height: 340px;
  margin: 0 auto 1.3rem;
  transition: opacity 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  perspective: 900px;
}

.portal-depth,
.portal-slit,
.portal-bloom,
.floor-plane,
.floor-trace,
.guide-video,
.guide-figure,
.guide-shadow {
  position: absolute;
  pointer-events: none;
}

.portal-depth {
  inset: -6px 40px 64px;
  border-radius: 36px;
  background:
    radial-gradient(ellipse at 50% 42%, rgba(236, 254, 255, 0.1), rgba(138, 232, 255, 0.05) 28%, rgba(3, 7, 18, 0.08) 58%, transparent 76%);
  border: 0;
  box-shadow: none;
  opacity: 0;
  transform: scaleX(0.82);
  animation: portal-reveal 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.portal-slit {
  left: 42%;
  top: 18px;
  width: 2px;
  height: 244px;
  border-radius: 999px;
  background: linear-gradient(180deg, transparent, #f8fdff 18%, #8ae8ff 48%, rgba(127, 124, 255, 0.4) 78%, transparent);
  box-shadow:
    0 0 20px rgba(138, 232, 255, 0.42),
    0 0 70px rgba(138, 232, 255, 0.22),
    0 0 110px rgba(127, 124, 255, 0.12);
  transform: translateX(-50%);
  animation: slit-open 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.portal-bloom {
  left: 46%;
  top: 74px;
  width: 320px;
  height: 190px;
  background:
    radial-gradient(ellipse at 50% 36%, rgba(248, 253, 255, 0.22), rgba(138, 232, 255, 0.11) 30%, transparent 72%);
  transform: translateX(-50%);
  opacity: 0;
  filter: blur(4px);
  animation: bloom-in 3s ease forwards;
}

.floor-plane {
  left: 50%;
  bottom: 0;
  width: min(520px, 86vw);
  height: 118px;
  transform: translateX(-50%) perspective(480px) rotateX(68deg);
  transform-origin: center bottom;
  background:
    linear-gradient(rgba(138, 232, 255, 0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(138, 232, 255, 0.16) 1px, transparent 1px),
    radial-gradient(ellipse at 50% 0%, rgba(138, 232, 255, 0.18), transparent 64%);
  background-size: 100% 24px, 36px 100%, 100% 100%;
  opacity: 0;
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 16%, #000 72%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 16%, #000 72%, transparent 100%);
  animation: floor-rise 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.floor-trace {
  left: 50%;
  bottom: 56px;
  width: min(380px, 70vw);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(248, 253, 255, 0.72), rgba(138, 232, 255, 0.36), transparent);
  opacity: 0;
  transform: translateX(-50%);
  box-shadow: 0 0 24px rgba(138, 232, 255, 0.26);
  animation: trace-pass 3s ease forwards;
}

.floor-trace--far {
  bottom: 106px;
  width: min(260px, 54vw);
  opacity: 0;
  animation-delay: 0.18s;
}

.guide-video {
  z-index: 4;
  left: 50%;
  bottom: 34px;
  width: 332px;
  height: 332px;
  object-fit: cover;
  object-position: 70% 48%;
  opacity: 0;
  mix-blend-mode: screen;
  filter:
    saturate(1.22)
    contrast(1.08)
    brightness(1.04)
    drop-shadow(0 0 34px rgba(138, 232, 255, 0.18));
  transform: translateX(-50%) translateY(24px) scale(0.92);
  -webkit-mask-image: radial-gradient(ellipse at 50% 46%, #000 0 48%, rgba(0, 0, 0, 0.86) 62%, transparent 78%);
  mask-image: radial-gradient(ellipse at 50% 46%, #000 0 48%, rgba(0, 0, 0, 0.86) 62%, transparent 78%);
  animation: video-guide-approach 3s cubic-bezier(0.18, 0.82, 0.22, 1) forwards;
}

.guide-figure {
  z-index: 3;
  left: 50%;
  bottom: 62px;
  width: 128px;
  height: 218px;
  transform: translateX(-50%) translateY(24px) scale(0.88);
  transform-origin: center bottom;
  opacity: 0;
  animation: figure-approach 3s cubic-bezier(0.18, 0.82, 0.22, 1) forwards;
}

.guide-halo,
.guide-head,
.guide-torso,
.guide-arm,
.guide-leg {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.guide-halo {
  top: -28px;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(138, 232, 255, 0.2), transparent 64%);
  filter: blur(8px);
  opacity: 0.72;
}

.guide-head {
  top: 0;
  width: 46px;
  height: 52px;
  border-radius: 44% 44% 48% 48%;
  background:
    radial-gradient(circle at 64% 24%, rgba(248, 253, 255, 0.5), transparent 10px),
    linear-gradient(145deg, rgba(213, 244, 255, 0.28), rgba(6, 16, 34, 0.72));
  border: 1px solid rgba(226, 232, 240, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 0 28px rgba(138, 232, 255, 0.28);
}

.guide-torso {
  top: 58px;
  width: 74px;
  height: 96px;
  border-radius: 28px 28px 34px 34px;
  background:
    linear-gradient(180deg, rgba(226, 247, 255, 0.18), rgba(6, 16, 34, 0.58)),
    radial-gradient(circle at 50% 42%, rgba(138, 232, 255, 0.18), transparent 28%);
  border: 1px solid rgba(226, 232, 240, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 22px 60px rgba(0, 0, 0, 0.34),
    0 0 26px rgba(138, 232, 255, 0.16);
}

.guide-torso::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 40px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle, #f8fdff, #8ae8ff 52%, transparent 68%);
  transform: translateX(-50%);
  box-shadow: 0 0 22px rgba(138, 232, 255, 0.72);
}

.guide-arm {
  top: 72px;
  width: 14px;
  height: 86px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(226, 247, 255, 0.18), rgba(138, 232, 255, 0.08), rgba(6, 16, 34, 0.54));
  border: 1px solid rgba(226, 232, 240, 0.1);
}

.guide-arm--left {
  margin-left: -56px;
  transform: translateX(-50%) rotate(7deg);
}

.guide-arm--right {
  margin-left: 56px;
  transform: translateX(-50%) rotate(-7deg);
}

.guide-leg {
  top: 146px;
  width: 18px;
  height: 82px;
  border-radius: 999px 999px 10px 10px;
  background: linear-gradient(180deg, rgba(226, 247, 255, 0.16), rgba(6, 16, 34, 0.62));
  border: 1px solid rgba(226, 232, 240, 0.1);
}

.guide-leg--left {
  margin-left: -22px;
  transform: translateX(-50%) rotate(2deg);
}

.guide-leg--right {
  margin-left: 22px;
  transform: translateX(-50%) rotate(-2deg);
}

.guide-shadow {
  left: 50%;
  bottom: 42px;
  width: 188px;
  height: 42px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.48), rgba(138, 232, 255, 0.12) 58%, transparent 72%);
  transform: translateX(-50%);
  filter: blur(8px);
  opacity: 0;
  animation: shadow-land 3s ease forwards;
}

.brand-lockup {
  transform: translateY(-4px);
  text-align: center;
}

.brand-cn {
  font-size: 1.92rem;
  font-weight: 560;
  color: rgba(244, 253, 255, 0.96);
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.16),
    0 18px 42px rgba(0, 0, 0, 0.32),
    0 0 26px rgba(138, 232, 255, 0.24);
}

.brand-cn::after {
  width: 44px;
  margin-top: 0.62rem;
  background: linear-gradient(90deg, transparent, rgba(248, 253, 255, 0.7), transparent);
  opacity: 0.68;
}

.brand-en {
  margin-top: 0.04rem;
  font-size: 0.74rem;
  font-weight: 500;
  color: rgba(226, 232, 240, 0.58);
}

.status-line {
  margin-top: 0.95rem;
  padding: 7px 12px;
  border-color: rgba(226, 232, 240, 0.12);
  background: rgba(3, 7, 18, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 60px rgba(0, 0, 0, 0.22);
}

.status-dot {
  background: #8ae8ff;
  box-shadow: 0 0 16px rgba(138, 232, 255, 0.74);
}

.boot-progress {
  bottom: 4.6rem;
  width: min(260px, calc(100vw - 72px));
  height: 2px;
  background: rgba(226, 232, 240, 0.11);
  box-shadow: none;
}

.boot-progress span {
  background: linear-gradient(90deg, rgba(138, 232, 255, 0.18), #f8fdff, rgba(127, 124, 255, 0.5));
  animation-duration: 2.45s;
}

.skip-hint {
  bottom: 2rem;
  color: rgba(203, 213, 225, 0.36);
}

@keyframes cinematic-drift {
  from { transform: scale(1.04) translate3d(-0.4%, 0, 0); }
  to { transform: scale(1.075) translate3d(0.4%, -0.6%, 0); }
}

@keyframes portal-reveal {
  0% { opacity: 0; transform: scaleX(0.72) translateY(14px); }
  34% { opacity: 0.62; }
  100% { opacity: 0.88; transform: scaleX(1) translateY(0); }
}

@keyframes slit-open {
  0% { opacity: 0; transform: translateX(-50%) scaleY(0.18); }
  34% { opacity: 1; transform: translateX(-50%) scaleY(1); }
  100% { opacity: 0.82; transform: translateX(-50%) scaleY(1); }
}

@keyframes bloom-in {
  0%, 18% { opacity: 0; transform: translateX(-50%) scale(0.62); }
  56% { opacity: 0.8; }
  100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
}

@keyframes floor-rise {
  0% { opacity: 0; transform: translateX(-50%) perspective(480px) rotateX(68deg) translateY(28px) scaleX(0.72); }
  48% { opacity: 0.48; }
  100% { opacity: 0.38; transform: translateX(-50%) perspective(480px) rotateX(68deg) translateY(0) scaleX(1); }
}

@keyframes trace-pass {
  0%, 30% { opacity: 0; transform: translateX(-50%) scaleX(0.18); }
  56% { opacity: 0.68; }
  100% { opacity: 0.26; transform: translateX(-50%) scaleX(1); }
}

@keyframes figure-approach {
  0% { opacity: 0; transform: translateX(-50%) translateY(34px) scale(0.78); filter: blur(2px); }
  34% { opacity: 0.18; filter: blur(0.8px); }
  100% { opacity: 0.12; transform: translateX(-50%) translateY(0) scale(1); filter: blur(0); }
}

@keyframes video-guide-approach {
  0% { opacity: 0; transform: translateX(-50%) translateY(38px) scale(0.84); filter: saturate(1.1) contrast(1.02) brightness(0.86) blur(2px); }
  30% { opacity: 0.34; }
  100% { opacity: 0.86; transform: translateX(-50%) translateY(0) scale(1); filter: saturate(1.22) contrast(1.08) brightness(1.04) blur(0); }
}

@keyframes shadow-land {
  0% { opacity: 0; transform: translateX(-50%) scaleX(0.56); }
  100% { opacity: 0.72; transform: translateX(-50%) scaleX(1); }
}

@media (max-width: 768px) {
  .loading-center {
    width: min(340px, calc(100vw - 32px));
  }

  .entry-scene {
    width: min(330px, 88vw);
    height: 316px;
    margin-bottom: 1.1rem;
  }

  .portal-depth {
    inset: 12px 12px 74px;
    border-radius: 28px;
  }

  .portal-slit {
    left: 40%;
    top: 34px;
    height: 216px;
  }

  .portal-bloom {
    top: 92px;
    width: 230px;
    height: 150px;
  }

  .floor-plane {
    width: 310px;
    height: 104px;
  }

  .guide-figure {
    bottom: 70px;
    width: 106px;
    height: 188px;
  }

  .guide-video {
    bottom: 48px;
    width: 256px;
    height: 256px;
  }

  .guide-head {
    width: 40px;
    height: 46px;
  }

  .guide-torso {
    top: 52px;
    width: 64px;
    height: 84px;
  }

  .guide-arm {
    top: 62px;
    height: 76px;
  }

  .guide-arm--left {
    margin-left: -48px;
  }

  .guide-arm--right {
    margin-left: 48px;
  }

  .guide-leg {
    top: 128px;
    height: 70px;
  }

  .brand-cn {
    font-size: 1.48rem;
  }

  .brand-en {
    font-size: 0.68rem;
  }

  .status-line {
    margin-top: 0.8rem;
  }

  .boot-progress {
    bottom: 3.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cinema-backdrop,
  .portal-depth,
  .portal-slit,
  .portal-bloom,
  .floor-plane,
  .floor-trace,
  .guide-figure,
  .guide-video,
  .guide-shadow {
    animation: none;
  }

  .portal-depth,
  .portal-slit,
  .portal-bloom,
  .floor-plane,
  .floor-trace,
  .guide-figure,
  .guide-video,
  .guide-shadow {
    opacity: 1;
  }
}
</style>
