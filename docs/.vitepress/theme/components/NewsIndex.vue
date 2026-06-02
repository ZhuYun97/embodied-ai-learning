<script setup>
import { ref, computed, onMounted } from 'vue'
import newsData from '../../../news/news-data.json'

// 筛选状态
const selectedCategory = ref('全部')
const selectedImportance = ref('全部')
const selectedYear = ref('全部')
const searchQuery = ref('')

// 从 localStorage 恢复筛选偏好
onMounted(() => {
  const saved = localStorage.getItem('news-filter')
  if (saved) {
    try {
      const { category, importance, year } = JSON.parse(saved)
      if (category) selectedCategory.value = category
      if (importance) selectedImportance.value = importance
      if (year) selectedYear.value = year
    } catch (e) {}
  }
})

// 保存筛选偏好
const saveFilter = () => {
  localStorage.setItem('news-filter', JSON.stringify({
    category: selectedCategory.value,
    importance: selectedImportance.value,
    year: selectedYear.value
  }))
}

// 提取所有类别(动态)
const allCategories = computed(() => {
  const cats = new Set()
  newsData.forEach(n => n.category.forEach(c => cats.add(c)))
  return ['全部', ...Array.from(cats).sort()]
})

// 提取所有年份
const allYears = computed(() => {
  const years = new Set()
  newsData.forEach(n => {
    const year = n.date.split('-')[0]
    years.add(year)
  })
  return ['全部', ...Array.from(years).sort().reverse()]
})

// 筛选后的数据
const filteredData = computed(() => {
  let data = newsData

  // 类别筛选
  if (selectedCategory.value !== '全部') {
    data = data.filter(n => n.category.includes(selectedCategory.value))
  }

  // 重要程度筛选
  if (selectedImportance.value !== '全部') {
    data = data.filter(n => n.importance === selectedImportance.value)
  }

  // 年份筛选
  if (selectedYear.value !== '全部') {
    data = data.filter(n => n.date.startsWith(selectedYear.value))
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q)
    )
  }

  return data
})

// 按 fetched_at 分组(降序)
const groups = computed(() => {
  const map = new Map()
  for (const item of filteredData.value) {
    const key = item.fetched_at
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(item)
  }

  // 转为数组并按日期降序排序
  const arr = Array.from(map.entries()).map(([date, items]) => ({
    date,
    items: items.sort((a, b) => {
      const order = { hot: 0, major: 1, normal: 2 }
      return order[a.importance] - order[b.importance]
    })
  }))

  return arr.sort((a, b) => b.date.localeCompare(a.date))
})

// 重要程度中文映射
const importanceLabel = {
  hot: '🔥 重磅',
  major: '⭐ 重要',
  normal: '📌 关注'
}

// 可信度映射
const credibilityLabel = {
  verified: '✅ 已核',
  todo: '⚠️ 待核'
}

// 统计(基于筛选后数据)
const stats = computed(() => {
  const imp = { hot: 0, major: 0, normal: 0 }
  filteredData.value.forEach(n => imp[n.importance]++)
  return {
    total: filteredData.value.length,
    hot: imp.hot,
    major: imp.major,
    normal: imp.normal,
    totalAll: newsData.length
  }
})

// 重置筛选
const resetFilters = () => {
  selectedCategory.value = '全部'
  selectedImportance.value = '全部'
  selectedYear.value = '全部'
  searchQuery.value = ''
  saveFilter()
}
</script>

<template>
  <div class="news-index">
    <!-- 筛选工具栏 -->
    <div class="news-filter">
      <!-- 搜索框 -->
      <div class="filter-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 搜索标题或摘要..."
          class="search-input"
        />
      </div>

      <!-- 筛选按钮组 -->
      <div class="filter-groups">
        <!-- 类别 -->
        <div class="filter-group">
          <span class="filter-label">类别:</span>
          <select v-model="selectedCategory" @change="saveFilter" class="filter-select">
            <option v-for="cat in allCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- 重要程度 -->
        <div class="filter-group">
          <span class="filter-label">重要程度:</span>
          <select v-model="selectedImportance" @change="saveFilter" class="filter-select">
            <option value="全部">全部</option>
            <option value="hot">🔥 重磅</option>
            <option value="major">⭐ 重要</option>
            <option value="normal">📌 关注</option>
          </select>
        </div>

        <!-- 年份 -->
        <div class="filter-group">
          <span class="filter-label">年份:</span>
          <select v-model="selectedYear" @change="saveFilter" class="filter-select">
            <option v-for="year in allYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- 重置按钮 -->
        <button @click="resetFilters" class="filter-reset">重置</button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="news-stats">
      <span class="stat-item">
        显示 <strong>{{ stats.total }}</strong> / {{ stats.totalAll }} 条
      </span>
      <span class="stat-item">🔥 {{ stats.hot }}</span>
      <span class="stat-item">⭐ {{ stats.major }}</span>
      <span class="stat-item">📌 {{ stats.normal }}</span>
    </div>

    <!-- 按日期分组 -->
    <div v-for="group in groups" :key="group.date" class="news-group">
      <h2 class="news-group__date">
        {{ group.date }}
        <span class="news-group__count">({{ group.items.length }} 条)</span>
      </h2>

      <!-- 卡片网格 -->
      <div class="news-grid">
        <article
          v-for="item in group.items"
          :key="item.id"
          class="news-card"
          :data-importance="item.importance"
          :data-credibility="item.credibility"
        >
          <!-- 徽章行 -->
          <div class="news-card__header">
            <span :class="['news-badge', `news-badge--${item.importance}`]">
              {{ importanceLabel[item.importance] }}
            </span>
            <span :class="['news-badge', `news-badge--${item.credibility}`]">
              {{ credibilityLabel[item.credibility] }}
            </span>
            <span v-if="item.bot" class="news-badge news-badge--bot">🤖</span>
          </div>

          <!-- 标题 -->
          <h3 class="news-card__title">{{ item.title }}</h3>

          <!-- 摘要 -->
          <p class="news-card__summary" v-html="item.summary"></p>

          <!-- 元信息 -->
          <div class="news-card__meta">
            <!-- 来源 -->
            <span v-if="item.sources.length" class="news-meta__item">
              🔗
              <a
                v-for="(src, idx) in item.sources"
                :key="idx"
                :href="src.url"
                target="_blank"
                rel="noopener"
              >
                {{ src.name }}{{ idx < item.sources.length - 1 ? ' · ' : '' }}
              </a>
            </span>

            <!-- 类别 -->
            <span v-if="item.category.length" class="news-meta__item">
              🏷️
              <span v-for="cat in item.category" :key="cat" class="news-tag">
                #{{ cat }}
              </span>
            </span>

            <!-- 事件时间 -->
            <span v-if="item.date" class="news-meta__item">
              📅 <time :datetime="item.date">{{ item.date }}</time>
            </span>

            <!-- 相关链接 -->
            <span v-if="item.related.length" class="news-meta__item">
              📖
              <a
                v-for="(rel, idx) in item.related"
                :key="idx"
                :href="rel.url"
              >
                {{ rel.label }}{{ idx < item.related.length - 1 ? ' · ' : '' }}
              </a>
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 筛选工具栏 ========== */
.news-filter {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
}

.filter-search {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  font-size: 0.95rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.filter-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.filter-select {
  padding: 6px 12px;
  font-size: 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:hover {
  border-color: var(--vp-c-brand-1);
}

.filter-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.filter-reset {
  padding: 6px 16px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-reset:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-softer);
}

/* ========== 统计概览 ========== */
.news-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 32px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stat-item strong {
  color: var(--vp-c-text-1);
  font-weight: 700;
}

/* ========== 时间分组 ========== */
.news-group {
  margin-bottom: 64px;
}

.news-group__date {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.news-group__count {
  font-size: 1rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
  margin-left: 8px;
}

/* ========== 卡片网格 ========== */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.news-card {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-left-width: 4px;
  border-radius: 12px;
  padding: 24px;
  background: var(--vp-c-bg-alt);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

/* 左侧色条 */
.news-card[data-importance="hot"] {
  border-left-color: #ef4444; /* red-500 */
}
.news-card[data-importance="major"] {
  border-left-color: #f59e0b; /* amber-500 */
}
.news-card[data-importance="normal"] {
  border-left-color: #64748b; /* slate-500 */
}

.news-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

/* ========== 徽章行 ========== */
.news-card__header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.news-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.news-badge--hot {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}
.news-badge--major {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}
.news-badge--normal {
  background: rgba(100, 116, 139, 0.1);
  color: #475569;
}
.news-badge--verified {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}
.news-badge--todo {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
}
.news-badge--bot {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
}

/* ========== 标题 ========== */
.news-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

/* ========== 摘要 ========== */
.news-card__summary {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
}

.news-card__summary :deep(strong) {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* ========== 元信息区 ========== */
.news-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.news-meta__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.news-meta__item a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.news-meta__item a:hover {
  text-decoration: underline;
}

.news-tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--vp-c-brand-softer);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  letter-spacing: -0.01em;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .news-card {
    padding: 20px;
  }

  .news-card__title {
    font-size: 1rem;
  }

  .news-stats {
    font-size: 0.85rem;
  }
}

/* ========== 档案皮肤适配 ========== */
:global(html.skin-archive) .news-card {
  background: #F5F1E8;
  border-color: #D4C4A8;
  box-shadow: 1px 1px 0 rgba(154, 51, 36, 0.08);
}

:global(html.skin-archive) .news-card:hover {
  border-color: #9A3324;
  box-shadow: 2px 2px 0 rgba(154, 51, 36, 0.12);
}

:global(html.skin-archive) .news-card__title {
  font-family: 'Source Serif 4', serif;
  font-weight: 600;
}

:global(html.skin-archive) .news-tag {
  background: rgba(154, 51, 36, 0.08);
  color: #9A3324;
  font-family: 'IBM Plex Mono', monospace;
}

:global(html.skin-archive) .news-stats {
  background: #F5F1E8;
  border-color: #D4C4A8;
}
</style>
