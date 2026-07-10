<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PaperKnowledgeGraph from './PaperKnowledgeGraph.vue'
import OfflineKnowledgeGraph from './OfflineKnowledgeGraph.vue'

const VIEWS = [
  {
    id: 'paper',
    hash: '#paper-graph',
    eyebrow: 'CURATED MAP',
    title: '论文策展图谱',
    subtitle: '人工维护的 VLA / WAM 论文、路线、概念、数据、基准、本体与机构关系。',
    stats: ['72 篇路线论文', '多类型知识节点', '人工桥接关系'],
  },
  {
    id: 'offline',
    hash: '#offline-graphify',
    eyebrow: 'GRAPHIFY VIEW',
    title: '离线全站图谱',
    subtitle: '从全站 Markdown、站内链接、论文目录与本地实体词典离线抽取,不调用模型 API。',
    stats: ['213 个节点', '3407 条 Graphify 边', '10 个 community'],
  },
]

const activeView = ref('paper')
const active = computed(() => VIEWS.find((view) => view.id === activeView.value) || VIEWS[0])

function viewFromHash(hash) {
  if (hash === '#offline-graphify' || hash === '#offline-knowledge-graph') return 'offline'
  return 'paper'
}

function setView(id, updateHash = true) {
  activeView.value = id
  const view = VIEWS.find((item) => item.id === id)
  if (updateHash && view && typeof window !== 'undefined') {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${view.hash}`)
  }
}

function syncFromHash() {
  if (typeof window === 'undefined') return
  setView(viewFromHash(window.location.hash), false)
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('hashchange', syncFromHash)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('hashchange', syncFromHash)
})
</script>

<template>
  <section class="kg-hub" aria-label="知识图谱视图选择">
    <div class="kg-hub__copy">
      <span>{{ active.eyebrow }}</span>
      <strong>{{ active.title }}</strong>
      <p>{{ active.subtitle }}</p>
    </div>
    <div class="kg-tabs" role="tablist" aria-label="知识图谱视图">
      <button
        v-for="view in VIEWS"
        :id="`kg-tab-${view.id}`"
        :key="view.id"
        type="button"
        role="tab"
        :aria-controls="`kg-panel-${view.id}`"
        :aria-selected="activeView === view.id"
        :class="{ on: activeView === view.id }"
        @click="setView(view.id)"
      >
        <span>{{ view.eyebrow }}</span>
        {{ view.title }}
      </button>
    </div>
    <div class="kg-hub__stats" aria-label="当前视图摘要">
      <span v-for="item in active.stats" :key="item">{{ item }}</span>
    </div>
  </section>

  <section
    v-if="activeView === 'paper'"
    id="paper-graph"
    class="kg-panel"
    role="tabpanel"
    aria-labelledby="kg-tab-paper"
  >
    <PaperKnowledgeGraph />
  </section>

  <section
    v-else
    id="offline-graphify"
    class="kg-panel kg-panel--offline"
    role="tabpanel"
    aria-labelledby="kg-tab-offline"
  >
    <OfflineKnowledgeGraph />
  </section>
</template>

<style scoped>
.kg-hub {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(240px, 1fr) auto;
  gap: 14px 18px;
  align-items: end;
  margin: 22px 0 18px;
  padding: 20px;
  border: 1px solid rgba(98, 204, 255, 0.18);
  border-radius: 18px;
  background:
    radial-gradient(circle at 0 0, rgba(61, 186, 255, 0.16), transparent 34%),
    radial-gradient(circle at 100% 0, rgba(139, 124, 255, 0.12), transparent 30%),
    linear-gradient(135deg, rgba(8, 15, 31, 0.97), rgba(4, 9, 22, 0.99));
  box-shadow: 0 24px 70px rgba(2, 6, 18, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.045);
}

.kg-hub::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(123, 213, 255, 0.18) 0.7px, transparent 0.7px);
  background-size: 18px 18px;
  mask-image: linear-gradient(90deg, #000, transparent 42%);
  opacity: 0.25;
}

.kg-hub__copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.kg-hub__copy span,
.kg-tabs span {
  display: block;
  color: #78ddff;
  font: 800 11px var(--vp-font-family-mono, monospace);
  letter-spacing: 0.08em;
}

.kg-hub__copy strong {
  display: block;
  margin-top: 3px;
  color: #f8fafc;
  font-size: 24px;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.kg-hub__copy p {
  max-width: 680px;
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.78);
  font-size: 14px;
  line-height: 1.65;
}

.kg-tabs {
  position: relative;
  z-index: 1;
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(142px, 1fr));
  gap: 5px;
  padding: 5px;
  border: 1px solid rgba(134, 196, 232, 0.14);
  border-radius: 13px;
  background: rgba(3, 8, 20, 0.58);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
}

.kg-tabs button {
  min-height: 56px;
  border: 1px solid transparent;
  border-radius: 9px;
  padding: 8px 11px;
  background: transparent;
  color: #cbd5e1;
  font: 800 13px var(--vp-font-family-base);
  text-align: left;
  cursor: pointer;
}

.kg-tabs button.on {
  border-color: rgba(111, 220, 255, 0.42);
  background: linear-gradient(135deg, rgba(52, 176, 255, 0.2), rgba(139, 124, 255, 0.12));
  color: #f8fafc;
  box-shadow: 0 10px 28px rgba(28, 119, 196, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.035);
}

.kg-hub__stats {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  grid-column: 1 / -1;
  gap: 8px;
}

.kg-hub__stats span {
  border: 1px solid rgba(117, 205, 248, 0.12);
  border-radius: 8px;
  padding: 6px 9px;
  background: rgba(10, 20, 42, 0.62);
  color: #dcecff;
  font: 750 12px var(--vp-font-family-mono, monospace);
}

.kg-panel {
  scroll-margin-top: 88px;
}

.kg-panel--offline {
  min-height: 720px;
}

@media (max-width: 760px) {
  .kg-hub {
    grid-template-columns: 1fr;
  }

  .kg-tabs {
    width: 100%;
  }
}
</style>
