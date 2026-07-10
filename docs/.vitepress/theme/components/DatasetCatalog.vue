<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { data as datasetsData } from '../../data/datasets.data.mjs'

// ===== 筛选状态(Vue refs) =====
const selectedType = ref('all') // all | 真机 | 人类视频 | 仿真环境 | 合成工具
const selectedEmbodiments = ref([]) // 多选:本体类型
const selectedLicenses = ref([]) // 多选:开源/研究用途/未公开
const selectedCredibility = ref(['sourced', 'self_reported', 'verified', 'unverified']) // 默认全选
const searchQuery = ref('')
const sortBy = ref('year') // year | name | scale
const sortOrder = ref('desc') // asc | desc

// ===== 派生数据 =====
// 提取所有本体选项(从数据去重)
const availableEmbodiments = computed(() => {
  const embodiments = datasetsData.entries
    .map((e) => e.embodiment)
    .filter(Boolean)
  return [...new Set(embodiments)]
})

// 提取许可选项
const availableLicenses = computed(() => {
  const licenses = datasetsData.entries
    .map((e) => e.license)
    .filter(Boolean)
  return [...new Set(licenses)]
})

// 筛选 + 排序逻辑
const filteredEntries = computed(() => {
  let result = datasetsData.entries

  // type 单选
  if (selectedType.value !== 'all') {
    result = result.filter((e) => e.type === selectedType.value)
  }

  // embodiment 多选(空数组 = 全选)
  if (selectedEmbodiments.value.length > 0) {
    result = result.filter((e) => e.embodiment && selectedEmbodiments.value.some(emb => e.embodiment.includes(emb)))
  }

  // license 多选(空数组 = 全选)
  if (selectedLicenses.value.length > 0) {
    result = result.filter((e) => e.license && selectedLicenses.value.some(lic => e.license.includes(lic)))
  }

  // 可信度多选
  result = result.filter((e) => selectedCredibility.value.includes(e.credibility))

  // 搜索(名称/机构)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((e) =>
      e.name.toLowerCase().includes(query) ||
      (e.institution && e.institution.toLowerCase().includes(query))
    )
  }

  // 排序
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy.value === 'year') {
      const aYear = a.year ? parseFloat(a.year) : 0
      const bYear = b.year ? parseFloat(b.year) : 0
      cmp = bYear - aYear
    } else if (sortBy.value === 'name') {
      cmp = a.name.localeCompare(b.name)
    } else if (sortBy.value === 'scale') {
      // scale 是文本,简单按字符串排(不精确,但可用)
      const aScale = a.scale || ''
      const bScale = b.scale || ''
      cmp = bScale.localeCompare(aScale)
    }
    return sortOrder.value === 'asc' ? -cmp : cmp
  })

  return result
})

// ===== UI 交互 =====
function toggleEmbodiment(emb) {
  const idx = selectedEmbodiments.value.indexOf(emb)
  if (idx > -1) {
    selectedEmbodiments.value.splice(idx, 1)
  } else {
    selectedEmbodiments.value.push(emb)
  }
}

function toggleLicense(lic) {
  const idx = selectedLicenses.value.indexOf(lic)
  if (idx > -1) {
    selectedLicenses.value.splice(idx, 1)
  } else {
    selectedLicenses.value.push(lic)
  }
}

function toggleCredibility(cred) {
  const idx = selectedCredibility.value.indexOf(cred)
  if (idx > -1) {
    selectedCredibility.value.splice(idx, 1)
  } else {
    selectedCredibility.value.push(cred)
  }
}

function resetFilters() {
  selectedType.value = 'all'
  selectedEmbodiments.value = []
  selectedLicenses.value = []
  selectedCredibility.value = ['sourced', 'self_reported', 'verified', 'unverified']
  searchQuery.value = ''
}

function toggleSort(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
}

function getCredibilityLabel(cred) {
  const map = {
    sourced: '细读为出处',
    self_reported: '⚠️ 自评',
    verified: '✅ 已核',
    unverified: '待核',
  }
  return map[cred] || cred
}

function getCredibilityTone(cred) {
  const map = {
    sourced: 'cyan',
    self_reported: 'amber',
    verified: 'emerald',
    unverified: 'slate',
  }
  return map[cred] || 'slate'
}

function getTypeTone(type) {
  const map = {
    真机: 'rose',
    人类视频: 'blue',
    仿真环境: 'amber',
    合成工具: 'emerald',
  }
  return map[type] || 'slate'
}
</script>

<template>
  <div class="dataset-catalog">
    <!-- 可信度图例 -->
    <div class="catalog-notice">
      <div class="legend">
        <span class="legend-item" data-tone="cyan"><b>细读为出处</b>一手论文/项目页已核实</span>
        <span class="legend-item" data-tone="amber"><b>⚠️ 自评</b>提出方/厂商自报,未独立复现</span>
        <span class="legend-item" data-tone="emerald"><b>✅ 已核</b>经对抗式核查确认</span>
        <span class="legend-item" data-tone="slate"><b>待核</b>一手来源未给出</span>
      </div>
    </div>

    <!-- 筛选控制 -->
    <div class="controls">
      <!-- Type 单选 -->
      <div class="control-group">
        <label class="control-label">类型:</label>
        <div class="type-tabs">
          <button
            v-for="tp in ['all', '真机', '人类视频', '仿真环境', '合成工具']"
            :key="tp"
            :class="['tab-btn', { active: selectedType === tp }]"
            @click="selectedType = tp"
          >
            {{ tp === 'all' ? '全部' : tp }}
          </button>
        </div>
      </div>

      <!-- Embodiment 多选 -->
      <div class="control-group">
        <label class="control-label">本体:</label>
        <div class="chip-row">
          <button
            v-for="emb in availableEmbodiments.slice(0, 8)"
            :key="emb"
            :class="['chip-btn', { active: selectedEmbodiments.length === 0 || selectedEmbodiments.includes(emb) }]"
            @click="toggleEmbodiment(emb)"
          >
            {{ emb }}
          </button>
        </div>
      </div>

      <!-- License 多选 -->
      <div class="control-group">
        <label class="control-label">许可:</label>
        <div class="chip-row">
          <button
            v-for="lic in availableLicenses"
            :key="lic"
            :class="['chip-btn', { active: selectedLicenses.length === 0 || selectedLicenses.includes(lic) }]"
            @click="toggleLicense(lic)"
          >
            {{ lic }}
          </button>
        </div>
      </div>

      <!-- 可信度多选 -->
      <div class="control-group">
        <label class="control-label">可信度:</label>
        <div class="chip-row">
          <button
            v-for="cred in ['sourced', 'self_reported', 'verified', 'unverified']"
            :key="cred"
            :class="['chip-btn', `chip-${cred}`, { active: selectedCredibility.includes(cred) }]"
            @click="toggleCredibility(cred)"
          >
            {{ getCredibilityLabel(cred) }}
          </button>
        </div>
      </div>

      <!-- 搜索 + 重置 -->
      <div class="control-group search-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索名称/机构..."
          class="search-input"
        />
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-wrapper">
      <table class="catalog-table">
        <thead>
          <tr>
            <th>类型</th>
            <th class="sortable" @click="toggleSort('name')">
              名称
              <span v-if="sortBy === 'name'" class="sort-icon">{{ sortOrder === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th>机构</th>
            <th>本体</th>
            <th class="sortable" @click="toggleSort('scale')">
              规模
              <span v-if="sortBy === 'scale'" class="sort-icon">{{ sortOrder === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th>许可</th>
            <th>可信度</th>
            <th class="sortable" @click="toggleSort('year')">
              年份
              <span v-if="sortBy === 'year'" class="sort-icon">{{ sortOrder === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th>链接</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredEntries" :key="entry.id" class="entry-row">
            <td class="type-cell">
              <span :class="['type-badge']" :data-tone="getTypeTone(entry.type)">
                {{ entry.type }}
              </span>
            </td>
            <td class="name-cell">
              <a
                v-if="entry.link"
                :href="entry.link"
                class="dataset-link"
                target="_blank"
                rel="noopener"
              >
                {{ entry.name }} ↗
              </a>
              <span v-else class="dataset-name">{{ entry.name }}</span>
            </td>
            <td class="institution-cell">{{ entry.institution || '—' }}</td>
            <td class="embodiment-cell">{{ entry.embodiment || '—' }}</td>
            <td class="scale-cell">{{ entry.scale || '—' }}</td>
            <td class="license-cell">{{ entry.license || '未公开' }}</td>
            <td class="credibility-cell">
              <span :class="['cred-badge', `cred-${entry.credibility}`]" :data-tone="getCredibilityTone(entry.credibility)">
                {{ getCredibilityLabel(entry.credibility) }}
              </span>
            </td>
            <td class="year-cell">{{ entry.year || '—' }}</td>
            <td class="source-cell">
              <a
                :href="withBase(`/vla/papers/embodied-data${entry.sourceSection}`)"
                class="source-link"
                title="查看 embodied-data.md 对应章节"
              >
                ↗ 章节
              </a>
              <span v-if="entry.note" class="note-tip" :title="entry.note">ℹ️</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredEntries.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>未找到匹配的数据集</p>
      <button class="reset-btn" @click="resetFilters">重置筛选</button>
    </div>

    <!-- 统计信息 -->
    <div class="catalog-stats">
      <p>当前显示 <strong>{{ filteredEntries.length }}</strong> 条 · 数据源共 <strong>{{ datasetsData.entries.length }}</strong> 条(转录自 embodied-data.md,日期 2026-07-01)</p>
    </div>
  </div>
</template>

<style scoped>
.dataset-catalog {
  width: 100%;
  padding: 2rem 0;
}

/* ===== Notice + Legend ===== */
.catalog-notice {
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
}

.legend-item[data-tone='cyan'] { border-color: rgba(56, 189, 248, 0.3); }
.legend-item[data-tone='amber'] { border-color: rgba(246, 198, 103, 0.3); }
.legend-item[data-tone='emerald'] { border-color: rgba(45, 212, 191, 0.3); }
.legend-item[data-tone='slate'] { border-color: rgba(148, 163, 184, 0.3); }

.legend-item b {
  margin-right: 0.25rem;
  font-weight: 600;
}

/* ===== Controls ===== */
.controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.02em;
}

/* Type tabs */
.type-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--ar-cyan);
  color: var(--vp-c-brand-1);
}

.tab-btn.active {
  background: linear-gradient(120deg, #2563eb, #22d3ee);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
}

.dark .tab-btn.active {
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.3);
}

/* Chips */
.chip-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip-btn {
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
}

.chip-btn:hover {
  border-color: var(--ar-cyan);
  color: var(--vp-c-brand-1);
}

.chip-btn.active {
  background: var(--ar-cyan-soft);
  border-color: var(--ar-cyan);
  color: var(--ar-cyan);
}

.chip-btn.chip-self_reported.active {
  background: var(--ar-gold-soft);
  border-color: var(--ar-gold);
  color: var(--ar-gold);
}

.chip-btn.chip-verified.active {
  background: var(--ar-teal-soft);
  border-color: var(--ar-teal);
  color: var(--ar-teal);
}

.chip-btn.chip-unverified.active {
  background: rgba(148, 163, 184, 0.14);
  border-color: #94a3b8;
  color: #94a3b8;
}

/* Search */
.search-group {
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--ar-cyan);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.14);
}

.reset-btn {
  padding: 0.625rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--ar-cyan);
  color: var(--vp-c-brand-1);
}

/* ===== Table ===== */
.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.catalog-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.catalog-table thead {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.06), rgba(37, 99, 235, 0.06));
  border-bottom: 2px solid var(--vp-c-divider);
}

.catalog-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 650;
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}

.catalog-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.catalog-table th.sortable:hover {
  color: var(--ar-cyan);
}

.sort-icon {
  font-size: 0.7rem;
  margin-left: 0.25rem;
  color: var(--ar-cyan);
}

.catalog-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.entry-row:hover {
  background: var(--vp-c-bg-alt);
}

/* Cells */
.type-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  font-size: 0.72rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid;
}

.type-badge[data-tone='rose'] {
  background: rgba(244, 114, 182, 0.14);
  border-color: #f472b6;
  color: #f472b6;
}

.type-badge[data-tone='blue'] {
  background: rgba(96, 165, 250, 0.14);
  border-color: #60a5fa;
  color: #60a5fa;
}

.type-badge[data-tone='amber'] {
  background: var(--ar-gold-soft);
  border-color: var(--ar-gold);
  color: var(--ar-gold);
}

.type-badge[data-tone='emerald'] {
  background: var(--ar-teal-soft);
  border-color: var(--ar-teal);
  color: var(--ar-teal);
}

.dataset-link {
  color: var(--ar-cyan);
  text-decoration: none;
  font-weight: 600;
}

.dataset-link:hover {
  text-decoration: underline;
}

.dataset-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.cred-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  font-size: 0.72rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid;
}

.cred-badge[data-tone='cyan'] {
  background: var(--ar-cyan-soft);
  border-color: var(--ar-cyan);
  color: var(--ar-cyan);
}

.cred-badge[data-tone='amber'] {
  background: var(--ar-gold-soft);
  border-color: var(--ar-gold);
  color: var(--ar-gold);
}

.cred-badge[data-tone='emerald'] {
  background: var(--ar-teal-soft);
  border-color: var(--ar-teal);
  color: var(--ar-teal);
}

.cred-badge[data-tone='slate'] {
  background: rgba(148, 163, 184, 0.14);
  border-color: #94a3b8;
  color: #94a3b8;
}

.source-link {
  color: var(--ar-cyan);
  text-decoration: none;
  font-size: 0.78rem;
}

.source-link:hover {
  text-decoration: underline;
}

.note-tip {
  margin-left: 0.5rem;
  cursor: help;
}

/* ===== Empty State ===== */
.empty-state {
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
}

/* ===== Stats ===== */
.catalog-stats {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.catalog-stats strong {
  color: var(--ar-cyan);
  font-weight: 700;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .search-group {
    flex-direction: column;
  }

  .catalog-table {
    font-size: 0.8rem;
  }

  .catalog-table th,
  .catalog-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
