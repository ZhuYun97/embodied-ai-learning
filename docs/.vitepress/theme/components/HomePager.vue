<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import {
  HOME_PAGES,
  activeHomePage,
  setActiveHomePage,
  setHomePageNavigator,
} from '../home-pager-state.mjs'

const tabButtons = ref([])
const ready = ref(false)
const transitioning = ref(false)
const transitionDirection = ref('next')
const transitionTarget = ref('')
const boundaryMessage = ref('')
const tabOrientation = ref('horizontal')
const route = useRoute()
const activeIndex = computed(() =>
  Math.max(0, HOME_PAGES.findIndex((page) => page.id === activeHomePage.value))
)
const activeMeta = computed(() => HOME_PAGES[activeIndex.value])
const targetIndex = computed(() => {
  const index = HOME_PAGES.findIndex((page) => page.id === transitionTarget.value)
  return index >= 0 ? index : activeIndex.value
})
const visualIndex = computed(() => transitioning.value ? targetIndex.value : activeIndex.value)
const liveMessage = computed(() => boundaryMessage.value ||
  `当前页面：${activeMeta.value.label}，${activeMeta.value.description}`)

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
let nextSyncUpdateUrl = true
let focusPanelOnChange = false
let wheelDelta = 0
let wheelLastAt = 0
let wheelLocked = false
let wheelLockDirection = 0
let wheelReverseDelta = 0
let wheelUnlockTimer = null
let transitionTimer = null
let transitionCommitTimer = null
let pagerIntentTimer = null
let boundaryTimer = null
let boundaryMessageTimer = null
let boundaryFrame = null
let touchOrigin = null
let pagerActive = false
let pendingTransition = null
let queuedTransition = null
let returningTransition = false
let reduceMotionQuery = null
let onMotionPreferenceChange = null
let orientationQuery = null
let onOrientationChange = null

const WHEEL_PIXEL_THRESHOLD = 28
const WHEEL_LINE_THRESHOLD = 16
const WHEEL_REVERSE_THRESHOLD = 10
const WHEEL_IDLE_MS = 240
const WHEEL_UNLOCK_MS = 260
const TOUCH_THRESHOLD = 44
const TRANSITION_EXIT_MS = 130
const TRANSITION_ENTER_MS = 280
const TRANSITION_SETTLE_MS = 20
const PAGER_INTENT_MAX_PX = 6
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

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  (reduceMotionQuery?.matches ?? window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

const activeStageElements = () => {
  const page = activeHomePage.value
  if (page === 'overview') return [document.querySelector('.VPHome .thero')].filter(Boolean)
  if (page === 'explore') {
    return [
      document.querySelector('.VPHome .VPFeatures > .container'),
      document.querySelector('.VPHome .explore-hud'),
    ].filter(Boolean)
  }
  return [document.querySelector('.home-page-panel.is-active')].filter(Boolean)
}

const activeStageElement = () => activeStageElements()[0] || null

const focusPagePanel = (page) => {
  const panelId = page === 'explore' ? 'home-explore-hud' : `home-page-${page}`
  document.getElementById(panelId)?.focus({ preventScroll: true })
}

const clearPagerIntent = () => {
  if (pagerIntentTimer) window.clearTimeout(pagerIntentTimer)
  pagerIntentTimer = null
  document.documentElement.style.removeProperty('--home-pager-intent')
}

const setPagerIntent = (delta, threshold) => {
  if (prefersReducedMotion()) {
    clearPagerIntent()
    return
  }
  const progress = Math.max(-1, Math.min(1, delta / threshold))
  document.documentElement.style.setProperty(
    '--home-pager-intent',
    `${(progress * PAGER_INTENT_MAX_PX).toFixed(2)}px`
  )
  if (pagerIntentTimer) window.clearTimeout(pagerIntentTimer)
  pagerIntentTimer = window.setTimeout(clearPagerIntent, 150)
}

const finishPageTransition = () => {
  const queued = queuedTransition
  const wasReturning = returningTransition
  if (transitionTimer) window.clearTimeout(transitionTimer)
  transitionTimer = null
  pendingTransition = null
  queuedTransition = null
  returningTransition = false
  transitioning.value = false
  transitionTarget.value = ''
  const root = document.documentElement
  delete root.dataset.homeTransitionPhase
  delete root.dataset.homeExitDirection
  delete root.dataset.homeInput

  if (!queued || !pagerActive || queued.page === activeHomePage.value) return
  // A reversed CSS exit keeps its animation-name until the phase attribute is
  // removed. Flush once before reusing the same exit animation so a quick retry
  // always starts from the fully restored panel instead of a finished timeline.
  if (wasReturning) void activeStageElement()?.offsetHeight
  runPageTransition(queued.page, queued.direction, queued.options)
}

const commitPageTransition = () => {
  const request = pendingTransition
  transitionCommitTimer = null
  if (!request) {
    finishPageTransition()
    return
  }

  pendingTransition = null
  focusPanelOnChange = request.focusPanel
  nextSyncUpdateUrl = request.updateUrl
  const root = document.documentElement
  root.dataset.homeTransitionPhase = 'swapping'
  setActiveHomePage(request.page)
  nextTick(() => {
    if (!pagerActive) return
    root.dataset.homeTransitionPhase = 'entering'
    if (transitionTimer) window.clearTimeout(transitionTimer)
    // CSS animation attaches on the next frame; keep a one-frame safety margin
    // before consuming a queued request so its exit always starts from opacity 1.
    transitionTimer = window.setTimeout(
      finishPageTransition,
      TRANSITION_ENTER_MS + TRANSITION_SETTLE_MS
    )
  })
}

const cancelPageTransition = ({ immediate = false } = {}) => {
  if (transitionCommitTimer) window.clearTimeout(transitionCommitTimer)
  if (transitionTimer) window.clearTimeout(transitionTimer)
  transitionCommitTimer = null
  transitionTimer = null
  pendingTransition = null
  if (immediate) {
    queuedTransition = null
    finishPageTransition()
    return
  }
  transitionTarget.value = activeHomePage.value
  transitioning.value = true
  returningTransition = true
  const exitAnimations = activeStageElements()
    .flatMap((element) => element.getAnimations?.() || [])
    .filter((animation) => animation.animationName?.startsWith('homeFullpageExit'))
  if (exitAnimations.length) exitAnimations.forEach((animation) => animation.reverse())
  else document.documentElement.dataset.homeTransitionPhase = 'returning'
  transitionTimer = window.setTimeout(finishPageTransition, 180)
}

const runPageTransition = (
  page,
  direction,
  { focusPanel = false, source = 'direct', updateUrl = true } = {}
) => {
  const root = document.documentElement
  if (root.dataset.homeTransitionPhase === 'entering' || returningTransition) {
    queuedTransition = {
      page,
      direction,
      options: { focusPanel, source, updateUrl },
    }
    transitionDirection.value = direction
    transitionTarget.value = page
    return
  }

  transitionDirection.value = direction
  transitionTarget.value = page
  transitioning.value = true
  pendingTransition = {
    page,
    focusPanel,
    updateUrl,
  }

  if (boundaryFrame) window.cancelAnimationFrame(boundaryFrame)
  boundaryFrame = null
  if (boundaryTimer) window.clearTimeout(boundaryTimer)
  boundaryTimer = null
  root.classList.remove('home-boundary-hit')
  delete root.dataset.homeBoundary
  root.dataset.homeDirection = direction
  root.dataset.homeInput = source

  if (transitionTimer) {
    window.clearTimeout(transitionTimer)
    transitionTimer = null
  }
  if (transitionCommitTimer) return

  root.dataset.homeExitDirection = direction
  root.dataset.homeTransitionPhase = 'leaving'
  transitionCommitTimer = window.setTimeout(commitPageTransition, TRANSITION_EXIT_MS)
}

const activate = (
  page,
  {
    focusPanel = false,
    direction: requestedDirection,
    source = 'direct',
    updateUrl = true,
  } = {}
) => {
  const nextIndex = HOME_PAGES.findIndex((item) => item.id === page)
  if (nextIndex < 0) return false
  const isImmediateSource = source === 'tab-keyboard' || source === 'page-key'
  if (nextIndex === activeIndex.value) {
    if (isImmediateSource && transitioning.value) {
      cancelPageTransition({ immediate: true })
      document.documentElement.dataset.homeDirection = requestedDirection || 'next'
      document.documentElement.dataset.homeInput = source
      if (updateUrl) {
        syncDocument(activeHomePage.value, { updateUrl: true, scroll: false })
      }
      if (focusPanel) {
        nextTick(() => {
          if (pagerActive && activeHomePage.value === page) focusPagePanel(page)
        })
      }
      return true
    }
    if (queuedTransition && transitionTarget.value !== page) {
      queuedTransition = null
      transitionTarget.value = activeHomePage.value
      transitionDirection.value = document.documentElement.dataset.homeDirection || 'next'
      if (updateUrl) {
        syncDocument(activeHomePage.value, { updateUrl: true, scroll: false })
      }
      return true
    }
    if (transitioning.value && transitionTarget.value && transitionTarget.value !== page) {
      cancelPageTransition()
      if (updateUrl) {
        syncDocument(activeHomePage.value, { updateUrl: true, scroll: false })
      }
      return true
    }
    return false
  }

  const direction = requestedDirection || (nextIndex > activeIndex.value ? 'next' : 'previous')
  if (prefersReducedMotion() || isImmediateSource) {
    if (transitioning.value) cancelPageTransition({ immediate: true })
    document.documentElement.dataset.homeDirection = direction
    document.documentElement.dataset.homeInput = source
    focusPanelOnChange = focusPanel
    nextSyncUpdateUrl = updateUrl
    setActiveHomePage(page)
    return true
  }

  runPageTransition(page, direction, { focusPanel, source, updateUrl })
  return true
}

const selectRelative = (offset, options) => {
  const baseIndex = transitioning.value ? targetIndex.value : activeIndex.value
  const nextIndex = Math.min(HOME_PAGES.length - 1, Math.max(0, baseIndex + offset))
  if (nextIndex === baseIndex) {
    const root = document.documentElement
    const boundary = offset > 0 ? 'end' : 'start'
    root.dataset.homeBoundary = boundary
    root.classList.remove('home-boundary-hit')
    if (boundaryFrame) window.cancelAnimationFrame(boundaryFrame)
    boundaryFrame = null
    if (options?.source !== 'page-key' && !transitioning.value && !prefersReducedMotion()) {
      boundaryFrame = window.requestAnimationFrame(() => {
        boundaryFrame = null
        if (pagerActive) root.classList.add('home-boundary-hit')
      })
    }
    if (boundaryTimer) window.clearTimeout(boundaryTimer)
    boundaryTimer = window.setTimeout(() => {
      root.classList.remove('home-boundary-hit')
      delete root.dataset.homeBoundary
      boundaryTimer = null
    }, 260)
    const boundaryMeta = HOME_PAGES[baseIndex]
    boundaryMessage.value = boundary === 'end'
      ? `已到最后一页：${boundaryMeta.label}`
      : `已到第一页：${boundaryMeta.label}`
    if (boundaryMessageTimer) window.clearTimeout(boundaryMessageTimer)
    boundaryMessageTimer = window.setTimeout(() => {
      boundaryMessage.value = ''
      boundaryMessageTimer = null
    }, 1200)
    return false
  }
  return activate(HOME_PAGES[nextIndex].id, {
    ...options,
    direction: offset > 0 ? 'next' : 'previous',
  })
}

const unlockWheelAfterGesture = () => {
  if (wheelUnlockTimer) window.clearTimeout(wheelUnlockTimer)
  wheelUnlockTimer = window.setTimeout(() => {
    wheelLocked = false
    wheelLockDirection = 0
    wheelReverseDelta = 0
    wheelDelta = 0
    wheelUnlockTimer = null
    clearPagerIntent()
  }, WHEEL_UNLOCK_MS)
}

const onTabKeydown = async (event, index) => {
  let nextIndex = index
  let direction = null
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = (index + 1) % HOME_PAGES.length
    direction = 'next'
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = (index - 1 + HOME_PAGES.length) % HOME_PAGES.length
    direction = 'previous'
  } else if (event.key === 'Home') {
    nextIndex = 0
    direction = nextIndex < index ? 'previous' : 'next'
  } else if (event.key === 'End') {
    nextIndex = HOME_PAGES.length - 1
    direction = nextIndex > index ? 'next' : 'previous'
  } else {
    return
  }

  event.preventDefault()
  activate(HOME_PAGES[nextIndex].id, { direction, source: 'tab-keyboard' })
  await nextTick()
  tabButtons.value[nextIndex]?.focus()
}

const setupPager = () => {
  if (pagerActive || typeof document === 'undefined') return
  const home = document.querySelector('.VPHome')
  if (!home) return
  pagerActive = true
  setHomePageNavigator(activate)
  reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null
  orientationQuery = window.matchMedia?.('(min-width: 960px)') || null
  onOrientationChange = (event) => {
    tabOrientation.value = event.matches ? 'vertical' : 'horizontal'
  }
  onOrientationChange(orientationQuery || { matches: false })
  orientationQuery?.addEventListener?.('change', onOrientationChange)
  onMotionPreferenceChange = (event) => {
    if (!event.matches) return
    clearPagerIntent()
    if (boundaryFrame) window.cancelAnimationFrame(boundaryFrame)
    boundaryFrame = null
    if (transitionCommitTimer) window.clearTimeout(transitionCommitTimer)
    if (transitionTimer) window.clearTimeout(transitionTimer)
    transitionCommitTimer = null
    transitionTimer = null

    const request = queuedTransition
      ? { page: queuedTransition.page, ...queuedTransition.options }
      : pendingTransition
    pendingTransition = null
    queuedTransition = null
    returningTransition = false
    transitioning.value = false
    transitionTarget.value = ''
    const root = document.documentElement
    root.classList.remove('home-boundary-hit')
    delete root.dataset.homeTransitionPhase
    delete root.dataset.homeExitDirection
    delete root.dataset.homeBoundary
    delete root.dataset.homeInput

    if (request && request.page !== activeHomePage.value) {
      focusPanelOnChange = request.focusPanel
      nextSyncUpdateUrl = request.updateUrl
      setActiveHomePage(request.page)
    }
  }
  reduceMotionQuery?.addEventListener?.('change', onMotionPreferenceChange)

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
    features.setAttribute('tabindex', '-1')
  }
  ready.value = true

  stopWatch = watch(activeHomePage, (page) => {
    const updateUrl = nextSyncUpdateUrl
    nextSyncUpdateUrl = true
    syncDocument(page, {
      updateUrl,
      scroll: true,
    })
    nextTick(() => {
      if (!pagerActive) return
      const focusedInHiddenView = document.activeElement?.closest?.('[hidden], [aria-hidden="true"]')
      if (focusPanelOnChange || focusedInHiddenView) {
        focusPagePanel(page)
      }
      focusPanelOnChange = false
    })
  })
  onLocationChange = () => {
    const explicitPage = explicitPageFromHash()
    const page = pageFromHash() || (!window.location.hash ? 'overview' : null)
    if (!page) return
    if (
      page !== activeHomePage.value ||
      (transitioning.value && transitionTarget.value && transitionTarget.value !== page)
    ) {
      const alreadyCurrent = page === activeHomePage.value
      activate(page, { source: 'history', updateUrl: false })
      if (alreadyCurrent) {
        syncDocument(page, { updateUrl: false, scroll: true })
      }
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
    if (selectRelative(isNext ? 1 : -1, { focusPanel: true, source: 'page-key' })) {
      event.preventDefault()
    }
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
    const threshold = event.deltaMode === 0
      ? WHEEL_PIXEL_THRESHOLD
      : WHEEL_LINE_THRESHOLD

    if (wheelLocked) {
      if (direction === wheelLockDirection) {
        wheelReverseDelta = 0
        clearPagerIntent()
        unlockWheelAfterGesture()
        return
      }

      wheelReverseDelta += normalizedDelta
      setPagerIntent(wheelReverseDelta, threshold)
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
      setPagerIntent(wheelDelta, threshold)
    }

    if (Math.abs(wheelDelta) < threshold) return

    const triggerDirection = Math.sign(wheelDelta)
    const changed = selectRelative(triggerDirection > 0 ? 1 : -1, { source: 'wheel' })
    wheelDelta = 0
    clearPagerIntent()
    wheelLocked = true
    wheelLockDirection = triggerDirection
    wheelReverseDelta = 0
    unlockWheelAfterGesture()
    if (!changed) return
  }
  onTouchStart = (event) => {
    if (event.touches.length !== 1) {
      touchOrigin = null
      clearPagerIntent()
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
      setPagerIntent(deltaY, TOUCH_THRESHOLD)
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
    clearPagerIntent()
    if (!wasVertical || elapsed > 850 || Math.abs(deltaY) < TOUCH_THRESHOLD || Math.abs(deltaY) <= Math.abs(deltaX) * 1.15) return
    selectRelative(deltaY > 0 ? 1 : -1, { source: 'touch' })
  }
  onTouchCancel = () => {
    touchOrigin = null
    clearPagerIntent()
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
  setHomePageNavigator(null)
  nextSyncUpdateUrl = true
  focusPanelOnChange = false
  reduceMotionQuery?.removeEventListener?.('change', onMotionPreferenceChange)
  reduceMotionQuery = null
  onMotionPreferenceChange = null
  orientationQuery?.removeEventListener?.('change', onOrientationChange)
  orientationQuery = null
  onOrientationChange = null
  tabOrientation.value = 'horizontal'
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
  if (transitionCommitTimer) window.clearTimeout(transitionCommitTimer)
  if (pagerIntentTimer) window.clearTimeout(pagerIntentTimer)
  if (boundaryTimer) window.clearTimeout(boundaryTimer)
  if (boundaryMessageTimer) window.clearTimeout(boundaryMessageTimer)
  if (boundaryFrame) window.cancelAnimationFrame(boundaryFrame)
  wheelUnlockTimer = null
  transitionTimer = null
  transitionCommitTimer = null
  pagerIntentTimer = null
  boundaryTimer = null
  boundaryMessageTimer = null
  boundaryFrame = null
  wheelDelta = 0
  wheelLastAt = 0
  wheelLocked = false
  wheelLockDirection = 0
  wheelReverseDelta = 0
  transitioning.value = false
  transitionTarget.value = ''
  boundaryMessage.value = ''
  pendingTransition = null
  queuedTransition = null
  returningTransition = false
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
    features.removeAttribute('tabindex')
  }
  homeElement = null
  onPageWheel = null
  onTouchStart = null
  onTouchMove = null
  onTouchEnd = null
  onTouchCancel = null
  const root = document.documentElement
  root.classList.remove('home-pager-ready', 'home-boundary-hit')
  root.style.removeProperty('--home-pager-intent')
  delete root.dataset.homePage
  delete root.dataset.homeDirection
  delete root.dataset.homeTransitionPhase
  delete root.dataset.homeExitDirection
  delete root.dataset.homeBoundary
  delete root.dataset.homeInput
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
  <nav
    v-show="ready"
    class="home-pager"
    :class="[
      { 'is-transitioning': transitioning },
      transitioning ? `is-${transitionDirection}` : '',
    ]"
    aria-label="主页五页切换"
  >
    <div
      class="home-pager__tabs"
      role="tablist"
      aria-label="选择主页内容"
      :aria-orientation="tabOrientation"
      :style="{
        '--home-page-offset': `${visualIndex * 100}%`,
        '--home-page-progress-y': `${visualIndex * 38}px`,
      }"
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
        :class="{
          'is-active': activeHomePage === page.id,
          'is-target': transitioning && transitionTarget === page.id,
        }"
        :aria-label="`${page.index} ${page.label}，${page.shortLabel}`"
        :aria-selected="activeHomePage === page.id"
        :aria-controls="page.id === 'explore'
          ? 'home-explore-hud home-page-explore'
          : `home-page-${page.id}`"
        :tabindex="activeHomePage === page.id ? 0 : -1"
        @click="activate(page.id, { source: 'tab-click' })"
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
      {{ liveMessage }}
    </span>
  </nav>
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
  z-index: 1;
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
  transform: translateX(calc(var(--home-page-offset) + var(--home-pager-intent, 0px)));
  transition:
    transform 0.32s cubic-bezier(0.2, 0, 0.38, 0.9),
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  pointer-events: none;
}
.home-pager.is-transitioning .home-pager__indicator {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 58%, var(--vp-c-divider));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent),
    0 0 20px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}
.dark .home-pager__indicator {
  background:
    linear-gradient(135deg, rgba(34, 211, 238, 0.13), rgba(37, 99, 235, 0.08)),
    rgba(8, 20, 37, 0.84);
  box-shadow: 0 0 22px rgba(34, 211, 238, 0.09);
}
.home-pager button {
  position: relative;
  z-index: 2;
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
.home-pager button.is-active,
.home-pager button.is-target { color: var(--vp-c-brand-1); }
.home-pager button.is-active > span:first-child,
.home-pager button.is-target > span:first-child,
.home-pager button.is-active small { color: var(--vp-c-brand-1); }
.home-pager button.is-target > span:first-child {
  animation: homePagerTargetTick 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes homePagerTargetTick {
  0% { opacity: 0.45; transform: scale(0.78); }
  70% { opacity: 1; transform: scale(1.12); }
  100% { opacity: 1; transform: scale(1); }
}
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
  .home-pager__tabs::before,
  .home-pager__tabs::after {
    content: '';
    position: absolute;
    top: 19px;
    left: 50%;
    z-index: 0;
    width: 1px;
    border-radius: 999px;
    transform: translateX(-50%);
    pointer-events: none;
  }
  .home-pager__tabs::before {
    height: calc(100% - 38px);
    background: color-mix(in srgb, var(--vp-c-brand-1) 16%, var(--vp-c-divider));
  }
  .home-pager__tabs::after {
    height: var(--home-page-progress-y);
    background: linear-gradient(180deg, #2563eb, #22d3ee);
    box-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
    transition: height 0.32s cubic-bezier(0.2, 0, 0.38, 0.9);
  }
  .home-pager__indicator {
    top: 0;
    right: 0;
    bottom: auto;
    width: 100%;
    height: 20%;
    border-radius: 11px;
    transform: translateY(calc(var(--home-page-offset) + var(--home-pager-intent, 0px)));
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
  .home-pager button:focus-visible > span:last-child,
  .home-pager.is-transitioning button.is-target > span:last-child {
    opacity: 1;
    transform: translate(0, -50%);
  }
  .home-pager.is-transitioning button:not(.is-target) > span:last-child {
    opacity: 0;
    transform: translate(5px, -50%);
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

:global(html[data-home-input='tab-keyboard'] .home-pager__indicator),
:global(html[data-home-input='page-key'] .home-pager__indicator),
:global(html[data-home-input='tab-keyboard'] .home-pager__tabs::after),
:global(html[data-home-input='page-key'] .home-pager__tabs::after) {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .home-pager__indicator,
  .home-pager__tabs::after { transition: none; }
  .home-pager button.is-target > span:first-child { animation: none; }
}
</style>
