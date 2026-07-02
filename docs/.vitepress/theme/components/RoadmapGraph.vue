<script setup>
import { ref, computed, onMounted } from 'vue'
import { data as roadmapData } from '../../data/roadmap.data.mjs'

// ===== 视图模式 =====
const viewMode = ref('graph') // graph | list
const isMobile = ref(false)

onMounted(() => {
  // 检测移动端 / reduced-motion
  const mq = window.matchMedia('(max-width: 768px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', (e) => {
    isMobile.value = e.matches
  })

  // reduced-motion 用户自动切换到列表视图
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (prefersReducedMotion.matches) {
    viewMode.value = 'list'
  }
})

// ===== 数据派生 =====
// 按 stage 分组(保持阶段顺序)
const stages = ['基础', '核心', '进阶', '前沿']
const nodesByStage = computed(() => {
  const grouped = {}
  stages.forEach((stage) => {
    grouped[stage] = roadmapData.nodes.filter((n) => n.stage === stage)
  })
  return grouped
})

// Track 配色
function getTrackColor(track) {
  return roadmapData.TRACK_COLORS[track] || roadmapData.TRACK_COLORS['通用']
}

// ===== 交互 =====
const hoveredNode = ref(null)

function onNodeHover(nodeId) {
  hoveredNode.value = nodeId
}

function onNodeLeave() {
  hoveredNode.value = null
}

// 检查节点是否在高亮路径上(hover 时高亮其前置链路)
function isInHighlightPath(nodeId) {
  if (!hoveredNode.value) return false
  const hovered = roadmapData.nodes.find((n) => n.id === hoveredNode.value)
  if (!hovered) return false
  // 如果是 hover 的节点本身,或是其前置节点,高亮
  if (nodeId === hoveredNode.value) return true
  return hovered.prereq.includes(nodeId)
}
</script>

<template>
  <div class="roadmap-graph">
    <!-- 视图切换 -->
    <div class="view-toggle">
      <button
        :class="['toggle-btn', { active: viewMode === 'graph' }]"
        @click="viewMode = 'graph'"
        :disabled="isMobile"
      >
        📊 图形视图
      </button>
      <button
        :class="['toggle-btn', { active: viewMode === 'list' }]"
        @click="viewMode = 'list'"
      >
        📋 列表视图
      </button>
      <span v-if="isMobile" class="mobile-hint">(移动端推荐列表)</span>
    </div>

    <!-- 图形视图(桌面端) -->
    <div v-if="viewMode === 'graph' && !isMobile" class="graph-view">
      <div class="graph-stages">
        <div
          v-for="stage in stages"
          :key="stage"
          class="stage-column"
        >
          <div class="stage-header">{{ stage }}</div>
          <div class="stage-nodes">
            <a
              v-for="node in nodesByStage[stage]"
              :key="node.id"
              :href="node.link"
              :class="['node-card', `node-${node.track}`, { highlighted: isInHighlightPath(node.id) }]"
              :title="node.description"
              @mouseenter="onNodeHover(node.id)"
              @mouseleave="onNodeLeave()"
            >
              <div class="node-label">{{ node.label }}</div>
              <div class="node-track-badge" :style="{
                background: getTrackColor(node.track).bg,
                borderColor: getTrackColor(node.track).border,
                color: getTrackColor(node.track).text
              }">
                {{ node.track }}
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- 图例 -->
      <div class="graph-legend">
        <div class="legend-title">轨道图例</div>
        <div class="legend-items">
          <span
            v-for="(color, track) in roadmapData.TRACK_COLORS"
            :key="track"
            class="legend-badge"
            :style="{
              background: color.bg,
              borderColor: color.border,
              color: color.text
            }"
          >
            {{ track }}
          </span>
        </div>
      </div>
    </div>

    <!-- 列表视图(移动端 / reduced-motion) -->
    <div v-if="viewMode === 'list' || isMobile" class="list-view">
      <div
        v-for="stage in stages"
        :key="stage"
        class="list-stage"
      >
        <h3 class="list-stage-title">{{ stage }}</h3>
        <div class="list-nodes">
          <a
            v-for="node in nodesByStage[stage]"
            :key="node.id"
            :href="node.link"
            class="list-node-card"
          >
            <div class="list-node-header">
              <span class="list-node-label">{{ node.label }}</span>
              <span
                class="list-node-badge"
                :style="{
                  background: getTrackColor(node.track).bg,
                  borderColor: getTrackColor(node.track).border,
                  color: getTrackColor(node.track).text
                }"
              >
                {{ node.track }}
              </span>
            </div>
            <div v-if="node.description" class="list-node-desc">{{ node.description }}</div>
            <div v-if="node.prereq.length > 0" class="list-node-prereq">
              <span class="prereq-label">前置:</span>
              <span class="prereq-items">
                {{ node.prereq.map(id => roadmapData.nodes.find(n => n.id === id)?.label || id).join(', ') }}
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- 统计 -->
    <div class="roadmap-stats">
      <p>共 <strong>{{ roadmapData.nodes.length }}</strong> 个节点 · 4 阶段 × 6 轨道 · 全部指向站内已有页面</p>
    </div>
  </div>
</template>

<style scoped>
.roadmap-graph {
  width: 100%;
  padding: 2rem 0;
}

/* ===== View Toggle ===== */
.view-toggle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover:not(:disabled) {
  border-color: var(--ar-cyan);
  color: var(--vp-c-brand-1);
}

.toggle-btn.active {
  background: linear-gradient(120deg, #2563eb, #22d3ee);
  color: white;
  border-color: transparent;
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mobile-hint {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

/* ===== Graph View ===== */
.graph-view {
  width: 100%;
}

.graph-stages {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stage-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stage-header {
  padding: 0.75rem;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.08), rgba(37, 99, 235, 0.08));
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  letter-spacing: 0.03em;
}

.stage-nodes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.node-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  border: 1.5px solid;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.node-card.highlighted {
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
}

.node-label {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.node-track-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid;
}

/* ===== Graph Legend ===== */
.graph-legend {
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.legend-title {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.legend-badge {
  display: inline-flex;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  border-radius: 5px;
  font-weight: 600;
  border: 1px solid;
}

/* ===== List View ===== */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.list-stage {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-stage-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.list-nodes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-node-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.2s;
}

.list-node-card:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--ar-cyan);
}

.list-node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.list-node-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.list-node-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;
}

.list-node-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.list-node-prereq {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.prereq-label {
  font-weight: 600;
}

.prereq-items {
  font-style: italic;
}

/* ===== Stats ===== */
.roadmap-stats {
  margin-top: 2rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.roadmap-stats strong {
  color: var(--ar-cyan);
  font-weight: 700;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .graph-stages {
    grid-template-columns: 1fr;
  }
}
</style>
