<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as paperData } from '../../data/papers.data.mjs'
import { activeExploreNode, activeHomePage } from '../home-pager-state.mjs'

const { frontmatter } = useData()
const orbitPaused = ref(false)

const nodes = computed(() => {
  const features = frontmatter.value?.features
  return Array.isArray(features) ? features : []
})
const activeNodeIndex = computed(() =>
  Math.min(activeExploreNode.value, Math.max(0, nodes.value.length - 1))
)
const activeNode = computed(() =>
  nodes.value[activeNodeIndex.value] || nodes.value[0] || null
)
const visible = computed(() => activeHomePage.value === 'explore')
const papers = computed(() => paperData.papers || [])
const vlaCount = computed(() => papers.value.filter((paper) => paper.track === 'VLA').length)
const wamCount = computed(() => papers.value.filter((paper) => paper.track === 'WAM').length)

const quickPaths = [
  {
    code: 'START',
    title: '5 分钟上手',
    detail: '先建立概念地图',
    link: '/vla/papers/getting-started',
  },
  {
    code: 'ROADMAP',
    title: '选择学习路线',
    detail: '按阶段与能力推进',
    link: '/vla/papers/roadmap',
  },
  {
    code: 'TIMELINE',
    title: '回看 2022 → 2026',
    detail: '串起双主线里程碑',
    link: '/vla/papers/timeline',
  },
  {
    code: 'COMPARE',
    title: '横向比较模型',
    detail: '查看关键规格差异',
    link: '/vla/papers/models-spec',
  },
]

const toggleOrbit = () => {
  orbitPaused.value = !orbitPaused.value
}

watch(orbitPaused, (paused) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('explore-orbit-paused', paused)
})

onUnmounted(() => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.remove('explore-orbit-paused')
})
</script>

<template>
  <section
    v-show="visible"
    id="home-explore-hud"
    class="explore-hud"
    role="tabpanel"
    aria-labelledby="home-tab-explore explore-hud-title"
    tabindex="-1"
  >
    <header class="explore-hud__header">
      <div class="explore-hud__intro">
        <span class="explore-hud__eyebrow">02 / RESEARCH NAVIGATOR</span>
        <h2 id="explore-hud-title">从研究问题出发，选择下一站</h2>
        <p>悬停或聚焦任一卡片即可暂停轨道并预览入口，也可以从推荐路径直接开始。</p>
        <div class="explore-hud__metrics" aria-label="研究导航概览">
          <span><b>{{ String(nodes.length).padStart(2, '0') }}</b> 核心入口</span>
          <span><b>{{ papers.length }}</b> 篇论文细读</span>
          <span><b>{{ vlaCount }} / {{ wamCount }}</b> VLA / WAM</span>
        </div>
      </div>

      <div v-if="activeNode" class="explore-hud__node">
        <div class="explore-hud__node-head">
          <span>FOCUS NODE / {{ String(activeNodeIndex + 1).padStart(2, '0') }}</span>
          <button
            class="explore-hud__pause"
            type="button"
            :aria-pressed="orbitPaused"
            @click="toggleOrbit"
          >
            {{ orbitPaused ? '继续轨道' : '暂停轨道' }}
          </button>
        </div>
        <Transition name="explore-node" mode="out-in">
          <div :key="activeNode.title" class="explore-hud__node-body">
            <h3 v-html="activeNode.title" />
            <p v-html="activeNode.details" />
            <a :href="withBase(activeNode.link)">
              {{ activeNode.linkText || '打开入口' }}
              <span class="vpi-arrow-right" aria-hidden="true" />
            </a>
          </div>
        </Transition>
      </div>
    </header>

    <nav class="explore-hud__paths" aria-label="推荐研究路径">
      <div class="explore-hud__paths-label">
        <span>QUICK START</span>
        <strong>四条推荐路径</strong>
      </div>
      <a v-for="path in quickPaths" :key="path.code" :href="withBase(path.link)">
        <span>{{ path.code }}</span>
        <strong>{{ path.title }}</strong>
        <small>{{ path.detail }}</small>
      </a>
    </nav>
  </section>
</template>

<style scoped>
.explore-hud {
  position: absolute;
  z-index: 3;
  inset: 18px 64px 10px 24px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  pointer-events: none;
}
.explore-hud__header,
.explore-hud__paths {
  pointer-events: auto;
}
.explore-hud__header {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 14px;
}
.explore-hud__intro,
.explore-hud__node,
.explore-hud__paths {
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 22%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-bg) 80%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  -webkit-backdrop-filter: blur(12px) saturate(1.08);
  backdrop-filter: blur(12px) saturate(1.08);
}
.explore-hud__intro {
  min-width: 0;
  padding: 13px 16px 11px;
  border-radius: 12px;
}
.explore-hud__eyebrow,
.explore-hud__node-head > span,
.explore-hud__paths-label span,
.explore-hud__paths > a > span {
  color: var(--vp-c-brand-1);
  font: 680 0.58rem/1.2 var(--vp-font-family-mono);
  letter-spacing: 0.08em;
}
.explore-hud__intro h2 {
  margin: 5px 0 3px;
  color: var(--vp-c-text-1);
  font-size: clamp(1.08rem, 1.75vw, 1.45rem);
  line-height: 1.2;
  letter-spacing: -0.025em;
}
.explore-hud__intro > p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  line-height: 1.45;
}
.explore-hud__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 9px;
}
.explore-hud__metrics span {
  padding: 4px 7px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-divider));
  border-radius: 6px;
  color: var(--vp-c-text-3);
  font: 600 0.61rem/1.15 var(--vp-font-family-mono);
}
.explore-hud__metrics b {
  color: var(--vp-c-text-1);
  font-weight: 740;
}
.explore-hud__node {
  min-width: 0;
  padding: 11px 13px;
  overflow: hidden;
  border-radius: 12px;
}
.explore-hud__node-head {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
.explore-hud__pause {
  min-height: 25px;
  padding: 4px 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-divider));
  border-radius: 6px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
  color: var(--vp-c-brand-1);
  font: 650 0.61rem/1 var(--vp-font-family-mono);
  cursor: pointer;
}
.explore-hud__pause:hover,
.explore-hud__pause:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: none;
  box-shadow: 0 0 14px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}
.explore-hud__node-body h3 {
  margin: 7px 0 3px;
  color: var(--vp-c-text-1);
  font-size: 0.86rem;
  line-height: 1.25;
}
.explore-hud__node-body p {
  display: -webkit-box;
  min-height: 31px;
  margin: 0;
  overflow: hidden;
  color: var(--vp-c-text-2);
  font-size: 0.67rem;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.explore-hud__node-body a {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-top: 5px;
  color: var(--vp-c-brand-1);
  font: 680 0.65rem/1.2 var(--vp-font-family-mono);
  text-decoration: none;
}
.explore-hud__node-body a:hover { color: var(--vp-c-brand-2); }
.explore-node-enter-active,
.explore-node-leave-active {
  transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.explore-node-enter-from { opacity: 0; transform: translateY(8px); }
.explore-node-leave-to { opacity: 0; transform: translateY(-5px); }
.explore-hud__paths {
  grid-row: 3;
  display: grid;
  grid-template-columns: minmax(145px, 0.68fr) repeat(4, minmax(0, 1fr));
  gap: 6px;
  padding: 6px;
  border-radius: 12px;
}
.explore-hud__paths-label {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: 4px 8px;
}
.explore-hud__paths-label strong {
  margin-top: 4px;
  color: var(--vp-c-text-1);
  font-size: 0.7rem;
}
.explore-hud__paths > a {
  display: grid;
  min-width: 0;
  gap: 2px;
  padding: 7px 9px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent);
  text-decoration: none;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}
.explore-hud__paths > a strong {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 0.69rem;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.explore-hud__paths > a small {
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 0.59rem;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.explore-hud__paths > a:hover,
.explore-hud__paths > a:focus-visible {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-divider));
  outline: none;
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  transform: translateY(-2px);
}
.dark .explore-hud__intro,
.dark .explore-hud__node,
.dark .explore-hud__paths {
  background: color-mix(in srgb, #07111f 82%, transparent);
  box-shadow:
    inset 0 0 0 1px rgba(56, 189, 248, 0.04),
    0 12px 30px rgba(0, 0, 0, 0.16);
}

@media (max-width: 959px) {
  .explore-hud {
    inset: 64px 12px 10px;
  }
  .explore-hud__header {
    grid-template-columns: 1fr;
  }
  .explore-hud__node { display: none; }
  .explore-hud__intro { padding: 10px 12px; }
  .explore-hud__intro h2 { font-size: 1rem; }
  .explore-hud__intro > p { display: none; }
  .explore-hud__metrics { margin-top: 7px; }
  .explore-hud__paths {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .explore-hud__paths-label { display: none; }
}
@media (min-width: 701px) and (max-width: 959px) {
  .explore-hud {
    bottom: calc(10px + var(--vp-nav-height, 64px));
  }
}
@media (max-width: 700px) {
  .explore-hud {
    right: 10px;
    bottom: 150px;
    left: 10px;
  }
  .explore-hud__metrics span {
    flex: 1 1 30%;
    font-size: 0.55rem;
    text-align: center;
    white-space: nowrap;
  }
  .explore-hud__paths {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
    padding: 4px;
  }
  .explore-hud__paths > a { padding: 5px 7px; }
  .explore-hud__paths > a small { display: none; }
}
@media (max-height: 620px) {
  .explore-hud { top: 54px; bottom: 6px; }
  .explore-hud__intro { padding: 7px 10px; }
  .explore-hud__intro > p,
  .explore-hud__metrics { display: none; }
  .explore-hud__node-body p { min-height: 0; -webkit-line-clamp: 1; }
  .explore-hud__paths > a small { display: none; }
  .explore-hud__pause { display: none; }
}
@media (min-width: 701px) and (max-width: 959px) and (max-height: 620px) {
  .explore-hud {
    bottom: calc(6px + var(--vp-nav-height, 64px));
  }
}
@media (max-width: 700px) and (max-height: 620px) {
  .explore-hud { bottom: 140px; }
}
@media (prefers-reduced-motion: reduce) {
  .explore-node-enter-active,
  .explore-node-leave-active,
  .explore-hud__paths > a { transition: none; }
  .explore-hud__paths > a:hover,
  .explore-hud__paths > a:focus-visible { transform: none; }
  .explore-hud__pause { display: none; }
}
</style>
