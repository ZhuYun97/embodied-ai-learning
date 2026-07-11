<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  HOME_PAGES,
  activeHomePage,
  setActiveHomePage,
} from '../home-pager-state.mjs'

const props = defineProps({
  page: {
    type: String,
    required: true,
  },
})

const ready = ref(false)
const pageIndex = computed(() => HOME_PAGES.findIndex((item) => item.id === props.page))
const isActive = computed(() => activeHomePage.value === props.page)
const previousPage = computed(() => HOME_PAGES[Math.max(0, pageIndex.value - 1)])
const nextPage = computed(() => HOME_PAGES[Math.min(HOME_PAGES.length - 1, pageIndex.value + 1)])

const go = (page) => {
  if (page) setActiveHomePage(page.id)
}

onMounted(() => {
  ready.value = true
})
</script>

<template>
  <section
    :id="`home-page-${page}`"
    class="home-page-panel"
    :class="{ 'is-active': ready && isActive }"
    :data-page="page"
    role="tabpanel"
    :aria-labelledby="`home-tab-${page}`"
    :aria-hidden="ready && !isActive"
    :hidden="ready && !isActive"
    :inert="ready && !isActive ? '' : undefined"
    :tabindex="ready ? 0 : undefined"
  >
    <slot />

    <footer v-show="ready" class="home-page-panel__footer" aria-label="切换主页页面">
      <button
        type="button"
        :disabled="pageIndex === 0"
        @click="go(previousPage)"
      >
        <span aria-hidden="true">←</span>
        <span><small>上一页</small><strong>{{ previousPage.label }}</strong></span>
      </button>
      <span>
        {{ String(pageIndex + 1).padStart(2, '0') }} /
        {{ String(HOME_PAGES.length).padStart(2, '0') }}
      </span>
      <button
        type="button"
        :disabled="pageIndex === HOME_PAGES.length - 1"
        @click="go(nextPage)"
      >
        <span><small>下一页</small><strong>{{ nextPage.label }}</strong></span>
        <span aria-hidden="true">→</span>
      </button>
    </footer>
  </section>
</template>

<style scoped>
.home-page-panel {
  min-height: calc(100vh - 72px);
  outline: none;
}
.home-page-panel[data-page='about'] { min-height: 0; }
.home-page-panel[hidden] { display: none !important; }
.home-page-panel:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 5px;
  border-radius: 12px;
}
.home-page-panel :deep(> h2:first-child) {
  margin-top: 0;
  padding-top: 0;
  border-top: 0;
}
.home-page-panel__footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  margin-top: 36px;
  padding: 18px 0 4px;
  border-top: 1px solid var(--vp-c-divider);
}
.home-page-panel__footer > span {
  color: var(--vp-c-text-3);
  font: 650 0.64rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.08em;
}
.home-page-panel__footer button {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  width: fit-content;
  min-height: 44px;
  padding: 7px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.home-page-panel__footer button:last-child { justify-self: end; text-align: right; }
.home-page-panel__footer button > span {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.home-page-panel__footer button small {
  color: var(--vp-c-text-3);
  font-size: 0.58rem;
}
.home-page-panel__footer button strong {
  color: inherit;
  font-size: 0.72rem;
}
.home-page-panel__footer button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.home-page-panel__footer button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.home-page-panel__footer button:disabled {
  visibility: hidden;
  pointer-events: none;
}

@media (max-width: 700px) {
  .home-page-panel__footer { margin-top: 28px; }
  .home-page-panel__footer button { padding-inline: 9px; }
}

</style>
