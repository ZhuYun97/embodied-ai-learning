<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import {
  HOME_PAGES,
  activeHomePage,
  setActiveHomePage,
} from '../home-pager-state.mjs'

const tabButtons = ref([])
const ready = ref(false)
const transitioning = ref(false)
const transitionDirection = ref('next')
const transitionToken = ref(0)
const route = useRoute()
const activeIndex = computed(() =>
  Math.max(0, HOME_PAGES.findIndex((page) => page.id === activeHomePage.value))
)
const activeMeta = computed(() => HOME_PAGES[activeIndex.value])

let stopWatch = null
let stopRouteWatch = null
let onLocationChange = null
let onPageKeydown = null
let onPageWheel = null
let onTouchStart = null
let onTouchMove = null
let onTouchEnd = null
let onTouchCancel = null
let homeElement = null
let suppressNextHistory = false
let focusPanelOnChange = false
let wheelDelta = 0
let wheelLastAt = 0
let wheelLocked = false
let wheelLockDirection = 0
let wheelReverseDelta = 0
let wheelUnlockTimer = null
let transitionTimer = null
let touchOrigin = null
let pagerActive = false

const WHEEL_PIXEL_THRESHOLD = 28
const WHEEL_LINE_THRESHOLD = 16
const WHEEL_REVERSE_THRESHOLD = 10
const WHEEL_IDLE_MS = 240
const WHEEL_UNLOCK_MS = 180
const TOUCH_THRESHOLD = 44
const TRANSITION_DURATION_MS = 700
const KEYBOARD_IGNORE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  'a',
  '[contenteditable="true"]',
  'dialog',
  '[role="dialog"]',
  '[aria-modal="true"]',
  '[data-home-pager-ignore]',
].join(', ')
const WHEEL_IGNORE_SELECTOR = [
  '[data-home-pager-ignore]',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]',
  'dialog',
  '[role="dialog"]',
  '[aria-modal="true"]',
  '.first-guide-shell',
  '.feature-tip',
  '.VPNavScreen',
  '.VPFlyout',
].join(', ')

const explicitPageFromHash = () => {
  if (typeof window === 'undefined') return null
  const match = window.location.hash.match(/^#page-(overview|explore|vla|wam|about)$/)
  return match?.[1] || null
}

const hashTarget = () => {
  if (typeof document === 'undefined' || !window.location.hash) return null
  try {
    return document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
  } catch {
    return null
  }
}

const pageFromHash = () => {
  const explicit = explicitPageFromHash()
  if (explicit) return explicit
  const target = hashTarget()
  return target?.closest('.home-page-panel')?.dataset.page || null
}

const syncDocument = (page, { updateUrl = true, scroll = true } = {}) => {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.homePage = page
  document.documentElement.classList.add('home-pager-ready')
  const home = document.querySelector('.VPHome')
  const hero = document.querySelector('.VPHome .thero')
  const features = document.querySelector('.VPHome .VPFeatures')
  hero?.setAttribute('aria-hidden', String(page !== 'overview'))
  features?.setAttribute('aria-hidden', String(page !== 'explore'))

  if (updateUrl) {
    const url = new URL(window.location.href)
    url.hash = page === 'overview' ? '' : `page-${page}`
    if (url.href !== window.location.href) {
      window.history.pushState(window.history.state, '', url)
    }
  }

  if (scroll) {
    if (home) home.scrollTop = 0
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

const runPageTransition = (direction) => {
  transitionDirection.value = direction
  transitionToken.value += 1
  transitioning.value = true
  if (transitionTimer) window.clearTimeout(transitionTimer)
  transitionTimer = window.setTimeout(() => {
    transitioning.value = false
    transitionTimer = null
  }, TRANSITION_DURATION_MS)
}

const activate = (page, { focusPanel = false } = {}) => {
  const nextIndex = HOME_PAGES.findIndex((item) => item.id === page)
  if (nextIndex < 0 || nextIndex === activeIndex.value) return false
  const direction = nextIndex > activeIndex.value ? 'next' : 'previous'
  document.documentElement.dataset.homeDirection = direction
  runPageTransition(direction)
  focusPanelOnChange = focusPanel
  setActiveHomePage(page)
  return true
}

const selectRelative = (offset, options) => {
  const nextIndex = Math.min(HOME_PAGES.length - 1, Math.max(0, activeIndex.value + offset))
  if (nextIndex === activeIndex.value) return false
  return activate(HOME_PAGES[nextIndex].id, options)
}

const unlockWheelAfterGesture = () => {
  if (wheelUnlockTimer) window.clearTimeout(wheelUnlockTimer)
  wheelUnlockTimer = window.setTimeout(() => {
    wheelLocked = false
    wheelLockDirection = 0
    wheelReverseDelta = 0
    wheelDelta = 0
    wheelUnlockTimer = null
  }, WHEEL_UNLOCK_MS)
}

const onTabKeydown = async (event, index) => {
  let nextIndex = index
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = (index + 1) % HOME_PAGES.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = (index - 1 + HOME_PAGES.length) % HOME_PAGES.length
  } else if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = HOME_PAGES.length - 1
  } else {
    return
  }

  event.preventDefault()
  activate(HOME_PAGES[nextIndex].id)
  await nextTick()
  tabButtons.value[nextIndex]?.focus()
}

const setupPager = () => {
  if (pagerActive || typeof document === 'undefined') return
  const home = document.querySelector('.VPHome')
  if (!home) return
  pagerActive = true

  const initialPage = pageFromHash() || 'overview'
  setActiveHomePage(initialPage)
  syncDocument(initialPage, { updateUrl: false, scroll: true })
  homeElement = home
  const features = document.querySelector('.VPHome .VPFeatures')
  home?.setAttribute('tabindex', '-1')
  home?.setAttribute('aria-label', '主页整页切换区域，可使用滚轮、上下翻页键或上下滑动切换')
  if (features) {
    features.id = 'home-page-explore'
    features.setAttribute('role', 'tabpanel')
    features.setAttribute('aria-labelledby', 'home-tab-explore')
  }
  ready.value = true

  stopWatch = watch(activeHomePage, (page) => {
    syncDocument(page, {
      updateUrl: !suppressNextHistory,
      scroll: true,
    })
    suppressNextHistory = false
    nextTick(() => {
      const focusedInHiddenView = document.activeElement?.closest?.('[hidden], [aria-hidden="true"]')
      if (focusPanelOnChange || focusedInHiddenView) {
        document.getElementById(`home-page-${page}`)?.focus({ preventScroll: true })
      }
      focusPanelOnChange = false
    })
  })
  onLocationChange = () => {
    const explicitPage = explicitPageFromHash()
    const page = pageFromHash()
    if (!page) return
    if (page !== activeHomePage.value) {
      suppressNextHistory = true
      activate(page)
    } else if (explicitPage) {
      syncDocument(page, { updateUrl: false })
    } else {
      syncDocument(page, { updateUrl: false, scroll: true })
    }
  }
  onPageKeydown = (event) => {
    const isNext = event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)
    const isPrevious = event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)
    if (!isNext && !isPrevious) return
    if (event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return
    if (event.target?.closest?.(KEYBOARD_IGNORE_SELECTOR)) return
    if (selectRelative(isNext ? 1 : -1, { focusPanel: true })) event.preventDefault()
  }
  onPageWheel = (event) => {
    if (
      !pagerActive ||
      !document.documentElement.classList.contains('home-pager-ready') ||
      !document.querySelector('.VPHome')
    ) return
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.deltaY === 0) return
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
    if (event.target?.closest?.(WHEEL_IGNORE_SELECTOR)) return

    if (event.cancelable) event.preventDefault()
    const now = window.performance.now()
    if (now - wheelLastAt > WHEEL_IDLE_MS) {
      wheelDelta = 0
      wheelReverseDelta = 0
    }
    wheelLastAt = now

    const multiplier = event.deltaMode === 1
      ? 16
      : event.deltaMode === 2
        ? window.innerHeight
        : 1
    const normalizedDelta = event.deltaY * multiplier
    const direction = Math.sign(normalizedDelta)

    if (wheelLocked) {
      if (direction === wheelLockDirection) {
        wheelReverseDelta = 0
        unlockWheelAfterGesture()
        return
      }

      wheelReverseDelta += normalizedDelta
      if (Math.abs(wheelReverseDelta) < WHEEL_REVERSE_THRESHOLD) {
        unlockWheelAfterGesture()
        return
      }

      if (wheelUnlockTimer) window.clearTimeout(wheelUnlockTimer)
      wheelUnlockTimer = null
      wheelLocked = false
      wheelLockDirection = 0
      wheelDelta = wheelReverseDelta
      wheelReverseDelta = 0
    } else {
      if (wheelDelta && direction !== Math.sign(wheelDelta)) wheelDelta = 0
      wheelDelta += normalizedDelta
    }

    const threshold = event.deltaMode === 0
      ? WHEEL_PIXEL_THRESHOLD
      : WHEEL_LINE_THRESHOLD
    if (Math.abs(wheelDelta) < threshold) return

    const triggerDirection = Math.sign(wheelDelta)
    const changed = selectRelative(triggerDirection > 0 ? 1 : -1)
    wheelDelta = 0
    if (!changed) return
    wheelLocked = true
    wheelLockDirection = triggerDirection
    wheelReverseDelta = 0
    unlockWheelAfterGesture()
  }
  onTouchStart = (event) => {
    if (event.touches.length !== 1) {
      touchOrigin = null
      return
    }
    const touch = event.touches[0]
    touchOrigin = {
      x: touch.clientX,
      y: touch.clientY,
      startedAt: window.performance.now(),
      vertical: false,
    }
  }
  onTouchMove = (event) => {
    if (!touchOrigin || event.touches.length !== 1) return
    const touch = event.touches[0]
    const deltaX = touchOrigin.x - touch.clientX
    const deltaY = touchOrigin.y - touch.clientY
    if (Math.abs(deltaY) >= 12 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
      touchOrigin.vertical = true
      if (event.cancelable) event.preventDefault()
    }
  }
  onTouchEnd = (event) => {
    if (!touchOrigin || event.changedTouches.length !== 1) {
      touchOrigin = null
      return
    }
    const touch = event.changedTouches[0]
    const deltaX = touchOrigin.x - touch.clientX
    const deltaY = touchOrigin.y - touch.clientY
    const elapsed = window.performance.now() - touchOrigin.startedAt
    const wasVertical = touchOrigin.vertical
    touchOrigin = null
    if (!wasVertical || elapsed > 850 || Math.abs(deltaY) < TOUCH_THRESHOLD || Math.abs(deltaY) <= Math.abs(deltaX) * 1.15) return
    selectRelative(deltaY > 0 ? 1 : -1)
  }
  onTouchCancel = () => {
    touchOrigin = null
  }
  window.addEventListener('popstate', onLocationChange)
  window.addEventListener('hashchange', onLocationChange)
  window.addEventListener('wheel', onPageWheel, { passive: false, capture: true })
  home?.addEventListener('touchstart', onTouchStart, { passive: true })
  home?.addEventListener('touchmove', onTouchMove, { passive: false })
  home?.addEventListener('touchend', onTouchEnd, { passive: true })
  home?.addEventListener('touchcancel', onTouchCancel, { passive: true })
  document.addEventListener('keydown', onPageKeydown)
}

const teardownPager = () => {
  pagerActive = false
  ready.value = false
  if (stopWatch) {
    stopWatch()
    stopWatch = null
  }
  if (onLocationChange) {
    window.removeEventListener('popstate', onLocationChange)
    window.removeEventListener('hashchange', onLocationChange)
    onLocationChange = null
  }
  if (onPageKeydown) {
    document.removeEventListener('keydown', onPageKeydown)
    onPageKeydown = null
  }
  if (onPageWheel) window.removeEventListener('wheel', onPageWheel, { capture: true })
  if (homeElement && onTouchStart) homeElement.removeEventListener('touchstart', onTouchStart)
  if (homeElement && onTouchMove) homeElement.removeEventListener('touchmove', onTouchMove)
  if (homeElement && onTouchEnd) homeElement.removeEventListener('touchend', onTouchEnd)
  if (homeElement && onTouchCancel) homeElement.removeEventListener('touchcancel', onTouchCancel)
  if (wheelUnlockTimer) window.clearTimeout(wheelUnlockTimer)
  if (transitionTimer) window.clearTimeout(transitionTimer)
  wheelUnlockTimer = null
  transitionTimer = null
  wheelDelta = 0
  wheelLocked = false
  wheelLockDirection = 0
  wheelReverseDelta = 0
  transitioning.value = false
  touchOrigin = null
  const home = homeElement
  const hero = home?.querySelector('.thero')
  const features = home?.querySelector('.VPFeatures')
  home?.removeAttribute('tabindex')
  home?.removeAttribute('aria-label')
  hero?.removeAttribute('aria-hidden')
  if (features) {
    features.removeAttribute('id')
    features.removeAttribute('role')
    features.removeAttribute('aria-labelledby')
    features.removeAttribute('aria-hidden')
  }
  homeElement = null
  onPageWheel = null
  onTouchStart = null
  onTouchMove = null
  onTouchEnd = null
  onTouchCancel = null
  document.documentElement.classList.remove('home-pager-ready')
  delete document.documentElement.dataset.homePage
  delete document.documentElement.dataset.homeDirection
  setActiveHomePage('overview')
}

onMounted(() => {
  setupPager()
  stopRouteWatch = watch(
    () => route.path,
    async () => {
      await nextTick()
      if (document.querySelector('.VPHome')) setupPager()
      else teardownPager()
    }
  )
})

onUnmounted(() => {
  if (stopRouteWatch) stopRouteWatch()
  stopRouteWatch = null
  teardownPager()
})
</script>

<template>
  <nav v-show="ready" class="home-pager" aria-label="主页五页切换">
    <div
      class="home-pager__tabs"
      role="tablist"
      aria-label="选择主页内容"
      :style="{ '--home-page-offset': `${activeIndex * 100}%` }"
    >
      <i
        class="home-pager__indicator"
        aria-hidden="true"
      />
      <button
        v-for="(page, index) in HOME_PAGES"
        :id="`home-tab-${page.id}`"
        :key="page.id"
        :ref="(element) => { if (element) tabButtons[index] = element }"
        type="button"
        role="tab"
        :class="{ 'is-active': activeHomePage === page.id }"
        :aria-label="`${page.index} ${page.label}，${page.shortLabel}`"
        :aria-selected="activeHomePage === page.id"
        :aria-controls="page.id === 'explore'
          ? 'home-page-explore'
          : `home-page-${page.id}`"
        :tabindex="activeHomePage === page.id ? 0 : -1"
        @click="activate(page.id)"
        @keydown="onTabKeydown($event, index)"
      >
        <span>{{ page.index }}</span>
        <span>
          <strong>{{ page.label }}</strong>
          <small>{{ page.shortLabel }}</small>
        </span>
      </button>
    </div>

    <span class="home-pager__live" aria-live="polite">
      当前页面：{{ activeMeta.label }}，{{ activeMeta.description }}
    </span>
  </nav>

  <div
    v-if="transitioning"
    :key="transitionToken"
    class="home-page-transition"
    :class="`is-${transitionDirection}`"
    aria-hidden="true"
  >
    <i class="home-page-transition__glow" />
    <i class="home-page-transition__beam" />
  </div>
</template>

<style scoped>
.home-pager {
  position: fixed;
  top: 72px;
  left: 50%;
  z-index: 25;
  display: block;
  width: min(520px, calc(100vw - 32px));
  padding: 4px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg) 84%, transparent);
  box-shadow:
    0 10px 28px rgba(15, 23, 42, 0.11),
    inset 0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  -webkit-backdrop-filter: blur(14px) saturate(1.1);
  backdrop-filter: blur(14px) saturate(1.1);
  transform: translateX(-50%);
}
.dark .home-pager {
  background: color-mix(in srgb, #07111f 84%, transparent);
  box-shadow:
    0 12px 34px rgba(0, 0, 0, 0.34),
    0 0 22px rgba(34, 211, 238, 0.06),
    inset 0 0 0 1px rgba(56, 189, 248, 0.05);
}
.home-pager__tabs {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
}
.home-pager__indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20%;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
  border-radius: 999px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent), transparent),
    color-mix(in srgb, var(--vp-c-bg) 72%, transparent);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
  transform: translateX(var(--home-page-offset));
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.dark .home-pager__indicator {
  background:
    linear-gradient(135deg, rgba(34, 211, 238, 0.13), rgba(37, 99, 235, 0.08)),
    rgba(8, 20, 37, 0.84);
  box-shadow: 0 0 22px rgba(34, 211, 238, 0.09);
}
.home-pager button {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  min-height: 36px;
  gap: 5px;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-2);
  text-align: center;
  cursor: pointer;
}
.home-pager button > span:first-child {
  color: var(--vp-c-text-3);
  font: 650 0.52rem/1 var(--vp-font-family-mono);
}
.home-pager button > span:last-child {
  display: block;
  min-width: 0;
}
.home-pager button strong {
  color: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1;
}
.home-pager button small {
  display: none;
}
.home-pager button:hover,
.home-pager button.is-active { color: var(--vp-c-brand-1); }
.home-pager button.is-active > span:first-child,
.home-pager button.is-active small { color: var(--vp-c-brand-1); }
.home-pager button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}
.home-pager__live {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.home-page-transition {
  position: fixed;
  top: var(--vp-nav-height, 64px);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 18;
  overflow: hidden;
  background: color-mix(in srgb, var(--vp-c-bg) 4%, transparent);
  isolation: isolate;
  animation: homeTransitionVeil 0.7s ease-out both;
  pointer-events: none;
}
.home-page-transition::before,
.home-page-transition__glow,
.home-page-transition__beam {
  position: absolute;
  right: -8%;
  left: -8%;
  display: block;
  pointer-events: none;
}
.home-page-transition::before {
  content: '';
  z-index: -1;
  height: 42%;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent) 44%,
    color-mix(in srgb, #8b5cf6 5%, transparent) 58%,
    transparent
  );
  filter: blur(24px);
}
.home-page-transition__glow {
  height: 18%;
  background: linear-gradient(
    180deg,
    transparent,
    color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent),
    transparent
  );
  filter: blur(18px);
}
.home-page-transition__beam {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 4%,
    color-mix(in srgb, var(--vp-c-brand-1) 48%, transparent) 25%,
    color-mix(in srgb, #8b5cf6 42%, transparent) 50%,
    color-mix(in srgb, #22d3ee 52%, transparent) 75%,
    transparent 96%
  );
  box-shadow:
    0 0 12px color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent),
    0 0 32px color-mix(in srgb, #22d3ee 12%, transparent);
}
.home-page-transition.is-next::before,
.home-page-transition.is-next .home-page-transition__glow,
.home-page-transition.is-next .home-page-transition__beam {
  animation: homeTransitionSweepNext 0.62s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.home-page-transition.is-previous::before,
.home-page-transition.is-previous .home-page-transition__glow,
.home-page-transition.is-previous .home-page-transition__beam {
  animation: homeTransitionSweepPrevious 0.62s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.home-page-transition.is-next .home-page-transition__glow,
.home-page-transition.is-previous .home-page-transition__glow { animation-delay: 0.025s; }
.home-page-transition.is-next .home-page-transition__beam,
.home-page-transition.is-previous .home-page-transition__beam { animation-delay: 0.055s; }
@keyframes homeTransitionSweepNext {
  0% { top: -42%; opacity: 0; }
  18% { opacity: 0.82; }
  72% { opacity: 0.48; }
  100% { top: 108%; opacity: 0; }
}
@keyframes homeTransitionSweepPrevious {
  0% { bottom: -42%; opacity: 0; }
  18% { opacity: 0.82; }
  72% { opacity: 0.48; }
  100% { bottom: 108%; opacity: 0; }
}
@keyframes homeTransitionVeil {
  0% { opacity: 0; }
  16% { opacity: 1; }
  72% { opacity: 0.72; }
  100% { opacity: 0; }
}

@media (min-width: 960px) {
  .home-pager {
    top: 50%;
    right: max(4px, env(safe-area-inset-right));
    left: auto;
    width: 40px;
    padding: 3px;
    border-radius: 14px;
    transform: translateY(-50%);
    pointer-events: none;
  }
  .home-pager__tabs {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, 38px);
    pointer-events: none;
  }
  .home-pager__indicator {
    top: 0;
    right: 0;
    bottom: auto;
    width: 100%;
    height: 20%;
    border-radius: 11px;
    transform: translateY(var(--home-page-offset));
  }
  .home-pager button {
    width: 100%;
    min-height: 38px;
    padding: 0;
    pointer-events: auto;
  }
  .home-pager button > span:first-child {
    font-size: 0.56rem;
  }
  .home-pager button > span:last-child {
    position: absolute;
    top: 50%;
    right: calc(100% + 9px);
    display: flex;
    min-width: 88px;
    flex-direction: column;
    gap: 3px;
    padding: 7px 9px;
    border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 24%, var(--vp-c-divider));
    border-radius: 9px;
    background: color-mix(in srgb, var(--vp-c-bg) 90%, transparent);
    box-shadow: 0 9px 24px rgba(15, 23, 42, 0.16);
    opacity: 0;
    text-align: left;
    white-space: nowrap;
    transform: translate(5px, -50%);
    transition:
      opacity 0.16s ease,
      transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
  .dark .home-pager button > span:last-child {
    background: color-mix(in srgb, #07111f 92%, transparent);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
  }
  .home-pager button > span:last-child small {
    display: block;
    color: var(--vp-c-text-3);
    font-size: 0.54rem;
    line-height: 1;
  }
  .home-pager button:hover > span:last-child,
  .home-pager button:focus-visible > span:last-child {
    opacity: 1;
    transform: translate(0, -50%);
  }
}

@media (max-width: 700px) {
  .home-pager {
    top: auto;
    bottom: max(12px, env(safe-area-inset-bottom));
    width: min(460px, calc(100vw - 20px));
    padding: 5px;
    border-radius: 15px;
  }
  .home-pager button {
    min-height: 50px;
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2px;
    padding: 0 4px;
    text-align: center;
  }
  .home-pager button > span:first-child { display: none; }
  .home-pager button strong { font-size: 0.72rem; }
  .home-pager button small {
    display: block;
    margin-top: 3px;
    color: var(--vp-c-text-3);
    font-size: 0.54rem;
    line-height: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-pager__indicator { transition: none; }
  .home-page-transition { display: none; }
}
</style>
