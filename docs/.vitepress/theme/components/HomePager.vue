<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  HOME_PAGES,
  activeHomePage,
  setActiveHomePage,
} from '../home-pager-state.mjs'

const tabButtons = ref([])
const ready = ref(false)
const activeIndex = computed(() =>
  Math.max(0, HOME_PAGES.findIndex((page) => page.id === activeHomePage.value))
)
const activeMeta = computed(() => HOME_PAGES[activeIndex.value])

let stopWatch = null
let onLocationChange = null
let onPageKeydown = null
let suppressNextHistory = false
let suppressNextScroll = false

const explicitPageFromHash = () => {
  if (typeof window === 'undefined') return null
  const match = window.location.hash.match(/^#page-(overview|vla|wam|resources)$/)
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

const scrollToHashTarget = () => {
  const target = hashTarget()
  target?.scrollIntoView({ block: 'start' })
}

const syncDocument = (page, { updateUrl = true, scroll = true } = {}) => {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.homePage = page
  document.documentElement.classList.add('home-pager-ready')
  const home = document.querySelector('.VPHome')
  const hero = document.querySelector('.VPHome .thero')
  const features = document.querySelector('.VPHome .VPFeatures')
  hero?.setAttribute('aria-hidden', String(page !== 'overview'))
  features?.setAttribute('aria-hidden', String(page !== 'resources'))

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

const activate = (page) => {
  setActiveHomePage(page)
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
  setActiveHomePage(HOME_PAGES[nextIndex].id)
  await nextTick()
  tabButtons.value[nextIndex]?.focus()
}

onMounted(() => {
  const explicitPage = explicitPageFromHash()
  const initialPage = pageFromHash() || 'overview'
  setActiveHomePage(initialPage)
  syncDocument(initialPage, { updateUrl: false, scroll: !!explicitPage && initialPage !== 'overview' })
  const home = document.querySelector('.VPHome')
  const features = document.querySelector('.VPHome .VPFeatures')
  home?.setAttribute('tabindex', '-1')
  home?.setAttribute('aria-label', '主页当前视图滚动区域')
  if (features) {
    features.id = 'home-page-resources-features'
    features.setAttribute('role', 'tabpanel')
    features.setAttribute('aria-labelledby', 'home-tab-resources')
  }
  if (!explicitPage && window.location.hash) nextTick(scrollToHashTarget)
  ready.value = true

  stopWatch = watch(activeHomePage, (page) => {
    syncDocument(page, {
      updateUrl: !suppressNextHistory,
      scroll: !suppressNextScroll,
    })
    suppressNextHistory = false
    suppressNextScroll = false
  })
  onLocationChange = () => {
    const explicitPage = explicitPageFromHash()
    const page = pageFromHash()
    if (!page) return
    if (page !== activeHomePage.value) {
      suppressNextHistory = true
      suppressNextScroll = !explicitPage
      setActiveHomePage(page)
      if (!explicitPage) nextTick(scrollToHashTarget)
    } else if (explicitPage) {
      syncDocument(page, { updateUrl: false })
    } else {
      syncDocument(page, { updateUrl: false, scroll: false })
      nextTick(scrollToHashTarget)
    }
  }
  onPageKeydown = (event) => {
    if (event.key !== 'PageDown' && event.key !== 'PageUp') return
    if (event.target?.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) return
    const scrollArea = document.querySelector('.VPHome')
    if (!scrollArea || scrollArea.scrollHeight <= scrollArea.clientHeight) return
    event.preventDefault()
    const direction = event.key === 'PageDown' ? 1 : -1
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    scrollArea.scrollBy({
      top: direction * scrollArea.clientHeight * 0.82,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }
  window.addEventListener('popstate', onLocationChange)
  window.addEventListener('hashchange', onLocationChange)
  document.addEventListener('keydown', onPageKeydown)
})

onUnmounted(() => {
  if (stopWatch) stopWatch()
  if (onLocationChange) {
    window.removeEventListener('popstate', onLocationChange)
    window.removeEventListener('hashchange', onLocationChange)
  }
  if (onPageKeydown) document.removeEventListener('keydown', onPageKeydown)
  const home = document.querySelector('.VPHome')
  const hero = document.querySelector('.VPHome .thero')
  const features = document.querySelector('.VPHome .VPFeatures')
  home?.removeAttribute('tabindex')
  home?.removeAttribute('aria-label')
  hero?.removeAttribute('aria-hidden')
  if (features) {
    features.removeAttribute('id')
    features.removeAttribute('role')
    features.removeAttribute('aria-labelledby')
    features.removeAttribute('aria-hidden')
  }
  document.documentElement.classList.remove('home-pager-ready')
  delete document.documentElement.dataset.homePage
  setActiveHomePage('overview')
})
</script>

<template>
  <nav v-show="ready" class="home-pager" aria-label="主页四页切换">
    <div class="home-pager__label" aria-hidden="true">
      <span>ATLAS VIEW</span>
      <strong>{{ activeMeta.index }} / 04</strong>
    </div>

    <div class="home-pager__tabs" role="tablist" aria-label="选择主页内容">
      <i
        class="home-pager__indicator"
        aria-hidden="true"
        :style="{ transform: `translateX(${activeIndex * 100}%)` }"
      />
      <button
        v-for="(page, index) in HOME_PAGES"
        :id="`home-tab-${page.id}`"
        :key="page.id"
        :ref="(element) => { if (element) tabButtons[index] = element }"
        type="button"
        role="tab"
        :class="{ 'is-active': activeHomePage === page.id }"
        :aria-selected="activeHomePage === page.id"
        :aria-controls="page.id === 'resources'
          ? 'home-page-resources-features home-page-resources'
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
</template>

<style scoped>
.home-pager {
  position: fixed;
  top: 76px;
  left: 50%;
  z-index: 180;
  display: grid;
  width: min(760px, calc(100vw - 40px));
  grid-template-columns: 108px minmax(0, 1fr);
  gap: 6px;
  padding: 6px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 26%, var(--vp-c-divider));
  border-radius: 14px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow:
    0 15px 44px rgba(15, 23, 42, 0.14),
    inset 0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(1.12);
  backdrop-filter: blur(16px) saturate(1.12);
  transform: translateX(-50%);
}
.dark .home-pager {
  background: color-mix(in srgb, #07111f 88%, transparent);
  box-shadow:
    0 18px 54px rgba(0, 0, 0, 0.44),
    0 0 30px rgba(34, 211, 238, 0.07),
    inset 0 0 0 1px rgba(56, 189, 248, 0.05);
}
.home-pager__label {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 0 11px;
  border-right: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono);
}
.home-pager__label span {
  color: var(--vp-c-text-3);
  font-size: 0.55rem;
  font-weight: 650;
  letter-spacing: 0.09em;
}
.home-pager__label strong {
  color: var(--vp-c-brand-1);
  font-size: 0.68rem;
  letter-spacing: 0.05em;
}
.home-pager__tabs {
  position: relative;
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 3px;
}
.home-pager__indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 25%;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
  border-radius: 9px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent), transparent),
    color-mix(in srgb, var(--vp-c-bg) 72%, transparent);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.08);
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
  display: grid;
  min-width: 0;
  min-height: 48px;
  grid-template-columns: 23px minmax(0, 1fr);
  gap: 6px;
  align-items: center;
  padding: 0 8px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--vp-c-text-2);
  text-align: left;
  cursor: pointer;
}
.home-pager button > span:first-child {
  color: var(--vp-c-text-3);
  font: 650 0.56rem/1 var(--vp-font-family-mono);
}
.home-pager button > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}
.home-pager button strong {
  color: inherit;
  font-size: 0.71rem;
  font-weight: 700;
  line-height: 1;
}
.home-pager button small {
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 0.56rem;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
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

@media (max-width: 700px) {
  .home-pager {
    top: auto;
    bottom: max(12px, env(safe-area-inset-bottom));
    width: min(460px, calc(100vw - 20px));
    grid-template-columns: 1fr;
    padding: 5px;
    border-radius: 15px;
  }
  .home-pager__label { display: none; }
  .home-pager button {
    min-height: 50px;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 2px;
    padding: 0 4px;
    text-align: center;
  }
  .home-pager button > span:first-child { display: none; }
  .home-pager button > span:last-child { align-items: center; }
  .home-pager button strong { font-size: 0.72rem; }
  .home-pager button small { font-size: 0.54rem; }
}

@media (prefers-reduced-motion: reduce) {
  .home-pager__indicator { transition: none; }
}
</style>
