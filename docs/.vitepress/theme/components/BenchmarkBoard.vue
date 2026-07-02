<script setup>
import { ref, computed } from 'vue'
import { data as leaderboardData } from '../../data/leaderboard.data.mjs'

// ===== 筛选状态(Vue refs) =====
const selectedBenchmark = ref('SimplerEnv') // 单选:SimplerEnv | LIBERO | CALVIN | RoboCasa
const selectedSplits = ref([]) // 多选:split keys
const selectedCredibility = ref(['sourced', 'self_reported', 'verified', 'unverified']) // 默认全选
const searchQuery = ref('')
const sortBy = ref('score') // score | model | year
const sortOrder = ref('desc') // asc | desc

// ===== 派生数据 =====
// 当前 benchmark 的所有 split 选项(从数据提取)
const availableSplits = computed(() => {
  const splits = leaderboardData.entries
    .filter((e) => e.benchmark === selectedBenchmark.value)
    .map((e) => e.split)
  return [...new Set(splits)]
})

// 筛选 + 排序逻辑
const filteredEntries = computed(() => {
  let result = leaderboardData.entries

  // benchmark 单选
  result = result.filter((e) => e.benchmark === selectedBenchmark.value)

  // split 多选(空数组 = 全选)
  if (selectedSplits.value.length > 0) {
    result = result.filter((e) => selectedSplits.value.includes(e.split))
  }

  // 可信度多选
  result = result.filter((e) => selectedCredibility.value.includes(e.credibility))

  // 搜索(模型名)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((e) => e.model.toLowerCase().includes(query))
  }

  // 排序
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy.value === 'score') {
      const aScore = typeof a.score === 'number' ? a.score : parseFloat(String(a.score).split('–')[0])
      const bScore = typeof b.score === 'number' ? b.score : parseFloat(String(b.score).split('–')[0])
      cmp = bScore - aScore // 默认降序
    } else if (sortBy.value === 'model') {
      cmp = a.model.localeCompare(b.model)
    } else if (sortBy.value === 'year') {
      const aYear = a.year ? parseFloat(a.year) : 0
      const bYear = b.year ? parseFloat(b.year) : 0
      cmp = bYear - aYear
    }
    return sortOrder.value === 'asc' ? -cmp : cmp
  })

  return result
})

// ===== UI 交互 =====
function toggleSplit(split) {
  const idx = selectedSplits.value.indexOf(split)
  if (idx > -1) {
    selectedSplits.value.splice(idx, 1)
  } else {
    selectedSplits.value.push(split)
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
  selectedSplits.value = []
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
</script>

<template>
  <div class="benchmark-board">
    <!-- 读表铁律提示 + 可信度图例 -->
    <div class="board-notice">
      <p class="notice-text">
        <strong>⚠️ 读表铁律</strong>:口径(split/protocol)决定数字含义。同一模型在不同 split、不同任务集、不同输入设置下分数可差数十个百分点。读表前先看 split 列和备注,再看分数。详见
        <a href="/vla/papers/benchmarks#十、读-vla-成绩表的七条铁律">benchmarks.md §十</a>。
      </p>
      <div class="legend">
        <span class="legend-item" data-tone="cyan"><b>细读为出处</b>一手论文/项目页已核实</span>
        <span class="legend-item" data-tone="amber"><b>⚠️ 自评</b>提出方/厂商自报,未独立复现</span>
        <span class="legend-item" data-tone="emerald"><b>✅ 已核</b>经对抗式核查确认</span>
        <span class="legend-item" data-tone="slate"><b>待核</b>一手来源未给出</span>
      </div>
    </div>

    <!-- 筛选控制 -->
    <div class="controls">
      <!-- Benchmark 单选 -->
      <div class="control-group">
        <label class="control-label">Benchmark:</label>
        <div class="benchmark-tabs">
          <button
            v-for="bm in ['SimplerEnv', 'LIBERO', 'CALVIN', 'RoboCasa']"
            :key="bm"
            :class="['tab-btn', { active: selectedBenchmark === bm }]"
            @click="selectedBenchmark = bm; selectedSplits = []"
          >
            {{ bm }}
          </button>
        </div>
      </div>

      <!-- Split 多选 -->
      <div class="control-group">
        <label class="control-label">Split / 口径:</label>
        <div class="split-chips">
          <button
            v-for="split in availableSplits"
            :key="split"
            :class="['chip-btn', { active: selectedSplits.length === 0 || selectedSplits.includes(split) }]"
            @click="toggleSplit(split)"
          >
            {{ split }}
          </button>
        </div>
      </div>

      <!-- 可信度多选 -->
      <div class="control-group">
        <label class="control-label">可信度:</label>
        <div class="credibility-chips">
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
          placeholder="搜索模型名..."
          class="search-input"
        />
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-wrapper">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th class="sortable" @click="toggleSort('score')">
              分数
              <span v-if="sortBy === 'score'" class="sort-icon">{{ sortOrder === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th class="sortable" @click="toggleSort('model')">
              模型
              <span v-if="sortBy === 'model'" class="sort-icon">{{ sortOrder === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th>Split / 口径</th>
            <th>Protocol</th>
            <th>可信度</th>
            <th class="sortable" @click="toggleSort('year')">
              年份
              <span v-if="sortBy === 'year'" class="sort-icon">{{ sortOrder === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th>来源</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredEntries" :key="entry.id" class="entry-row">
            <td class="score-cell">
              <span class="score-value">{{ entry.score }}</span>
              <span class="score-unit">{{ entry.unit }}</span>
            </td>
            <td class="model-cell">
              <a
                v-if="entry.modelSlug"
                :href="`/vla/papers/${entry.modelSlug}`"
                class="model-link"
              >
                {{ entry.model }}
              </a>
              <span v-else class="model-name">{{ entry.model }}</span>
            </td>
            <td class="split-cell">{{ entry.split }}</td>
            <td class="protocol-cell">{{ entry.protocol || '—' }}</td>
            <td class="credibility-cell">
              <span :class="['cred-badge', `cred-${entry.credibility}`]" :data-tone="getCredibilityTone(entry.credibility)">
                {{ getCredibilityLabel(entry.credibility) }}
              </span>
            </td>
            <td class="year-cell">{{ entry.year || '—' }}</td>
            <td class="source-cell">
              <a
                :href="`/vla/papers/benchmarks${entry.sourceSection}`"
                class="source-link"
                title="查看 benchmarks.md 对应章节"
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
      <p>未找到匹配的成绩</p>
      <button class="reset-btn" @click="resetFilters">重置筛选</button>
    </div>

    <!-- 统计信息 -->
    <div class="board-stats">
      <p>当前显示 <strong>{{ filteredEntries.length }}</strong> 条 · 数据源共 <strong>{{ leaderboardData.entries.length }}</strong> 条(转录自 benchmarks.md,日期 2026-07-01)</p>
    </div>
  </div>
</template>

<style scoped>
.benchmark-board {
  width: 100%;
  padding: 2rem 0;
}

/* ===== Notice + Legend ===== */
.board-notice {
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(8px) saturate(1.1);
}

.notice-text {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.notice-text strong {
  color: var(--ar-accent);
}

.notice-text a {
  color: var(--ar-cyan);
  text-decoration: none;
  border-bottom: 1px dotted var(--ar-cyan);
}

.notice-text a:hover {
  border-bottom-style: solid;
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

/* Benchmark tabs */
.benchmark-tabs {
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
  font-family: var(--vp-font-family-mono, monospace);
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

/* Split + Credibility chips */
.split-chips,
.credibility-chips {
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

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.leaderboard-table thead {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.06), rgba(37, 99, 235, 0.06));
  border-bottom: 2px solid var(--vp-c-divider);
}

.leaderboard-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 650;
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  letter-spacing: 0.02em;
}

.leaderboard-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.leaderboard-table th.sortable:hover {
  color: var(--ar-cyan);
}

.sort-icon {
  font-size: 0.7rem;
  margin-left: 0.25rem;
  color: var(--ar-cyan);
}

.leaderboard-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.entry-row:hover {
  background: var(--vp-c-bg-alt);
}

/* Cells */
.score-cell {
  font-family: var(--vp-font-family-mono, monospace);
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.score-value {
  background: linear-gradient(120deg, #2563eb 0%, #22d3ee 55%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.score-unit {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

.model-link {
  color: var(--ar-cyan);
  text-decoration: none;
  font-weight: 600;
}

.model-link:hover {
  text-decoration: underline;
}

.model-name {
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
.board-stats {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.board-stats strong {
  color: var(--ar-cyan);
  font-weight: 700;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .search-group {
    flex-direction: column;
  }

  .leaderboard-table {
    font-size: 0.8rem;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
