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
  newsData.forEach(n => years.add(n.date.split('-')[0]))
  return ['全部', ...Array.from(years).sort().reverse()]
})
// 筛选后的数据
const filteredData = computed(() => {
  let data = newsData
  if (selectedCategory.value !== '全部') {
    data = data.filter(n => n.category.includes(selectedCategory.value))
  }
  if (selectedImportance.value !== '全部') {
    data = data.filter(n => n.importance === selectedImportance.value)
  }
  if (selectedYear.value !== '全部') {
    data = data.filter(n => n.date.startsWith(selectedYear.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    data = data.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q)
    )
  }
  return data
})

// 按 fetched_at 分组(降序),组内按重要程度排序
const groups = computed(() => {
  const map = new Map()
  for (const item of filteredData.value) {
    const key = item.fetched_at
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  const order = { hot: 0, major: 1, normal: 2 }
  const arr = Array.from(map.entries()).map(([date, items]) => ({
    date,
    items: items.sort((a, b) => order[a.importance] - order[b.importance])
  }))
  return arr.sort((a, b) => b.date.localeCompare(a.date))
})

// 标签映射
const importanceLabel = { hot: '重磅', major: '重要', normal: '关注' }
const importanceIcon = { hot: '🔥', major: '⭐', normal: '📌' }
const credibilityLabel = { verified: '已核', todo: '待核' }
const importanceFilters = [
  { value: '全部', label: '全部' },
  { value: 'hot', label: '🔥 重磅' },
  { value: 'major', label: '⭐ 重要' },
  { value: 'normal', label: '📌 关注' },
]

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

// 是否有任何筛选生效
const hasActiveFilter = computed(() =>
  selectedCategory.value !== '全部' ||
  selectedImportance.value !== '全部' ||
  selectedYear.value !== '全部' ||
  searchQuery.value.trim() !== ''
)

// 重置筛选
const resetFilters = () => {
  selectedCategory.value = '全部'
  selectedImportance.value = '全部'
  selectedYear.value = '全部'
  searchQuery.value = ''
  saveFilter()
}

// 日期格式化:2026-06-01 → 2026年6月1日
const formatDate = (d) => {
  const parts = d.split('-')
  if (parts.length === 3) return `${parts[0]}年${+parts[1]}月${+parts[2]}日`
  if (parts.length === 2) return `${parts[0]}年${+parts[1]}月`
  return d
}
</script>

<template>
  <div class="news-index">
    <!-- 筛选工具栏 -->
    <div class="news-toolbar">
      <div class="toolbar-search">
        <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索标题或摘要…"
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''" aria-label="清除搜索">×</button>
      </div>

      <!-- 重要程度:分段按钮 -->
      <div class="seg-control">
        <button
          v-for="f in importanceFilters"
          :key="f.value"
          :class="['seg-btn', { active: selectedImportance === f.value }]"
          @click="selectedImportance = f.value; saveFilter()"
        >{{ f.label }}</button>
      </div>

      <!-- 类别 / 年份下拉 + 重置 -->
      <div class="toolbar-selects">
        <div class="select-wrap">
          <select v-model="selectedCategory" @change="saveFilter" class="filter-select" aria-label="类别">
            <option v-for="cat in allCategories" :key="cat" :value="cat">
              {{ cat === '全部' ? '全部类别' : cat }}
            </option>
          </select>
        </div>
        <div class="select-wrap">
          <select v-model="selectedYear" @change="saveFilter" class="filter-select" aria-label="年份">
            <option v-for="year in allYears" :key="year" :value="year">
              {{ year === '全部' ? '全部年份' : year + ' 年' }}
            </option>
          </select>
        </div>
        <button v-if="hasActiveFilter" @click="resetFilters" class="filter-reset">重置</button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="news-stats">
      <span class="stat-total">共 <strong>{{ stats.total }}</strong> 条<span v-if="stats.total !== stats.totalAll" class="stat-of"> / {{ stats.totalAll }}</span></span>
      <span class="stat-divider"></span>
      <span class="stat-chip stat-chip--hot">🔥 {{ stats.hot }}</span>
      <span class="stat-chip stat-chip--major">⭐ {{ stats.major }}</span>
      <span class="stat-chip stat-chip--normal">📌 {{ stats.normal }}</span>
    </div>

    <!-- 空状态 -->
    <div v-if="groups.length === 0" class="news-empty">
      <div class="empty-icon">🔍</div>
      <p>没有匹配的新闻</p>
      <button @click="resetFilters" class="filter-reset">清除筛选条件</button>
    </div>

    <!-- 按日期分组 -->
    <div v-for="group in groups" :key="group.date" class="news-group">
      <div class="news-group__head">
        <h2 class="news-group__date">{{ formatDate(group.date) }}</h2>
        <span class="news-group__count">{{ group.items.length }} 条收录</span>
      </div>

      <div class="news-grid">
        <article
          v-for="item in group.items"
          :key="item.id"
          class="news-card"
          :data-importance="item.importance"
        >
          <div class="news-card__header">
            <span :class="['news-badge', `news-badge--${item.importance}`]">
              <span class="badge-icon">{{ importanceIcon[item.importance] }}</span>{{ importanceLabel[item.importance] }}
            </span>
            <span :class="['news-badge', `news-badge--${item.credibility}`]">
              {{ credibilityLabel[item.credibility] }}
            </span>
            <span v-if="item.bot" class="news-badge news-badge--bot" title="机器人自动收录">🤖 bot</span>
            <time class="news-card__date" :datetime="item.date">{{ formatDate(item.date) }}</time>
          </div>

          <h3 class="news-card__title">{{ item.title }}</h3>
          <p class="news-card__summary" v-html="item.summary"></p>

          <!-- 类别标签 -->
          <div v-if="item.category.length" class="news-card__tags">
            <span v-for="cat in item.category" :key="cat" class="news-tag">{{ cat }}</span>
          </div>

          <!-- 底部:来源 + 相关 -->
          <div class="news-card__footer">
            <span v-if="item.sources.length" class="footer-sources">
              <a
                v-for="(src, idx) in item.sources"
                :key="idx"
                :href="src.url"
                target="_blank"
                rel="noopener"
                class="source-link"
              >{{ src.name }}<svg class="ext-icon" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M12 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
            </span>
            <span v-if="item.related.length" class="footer-related">
              <a v-for="(rel, idx) in item.related" :key="idx" :href="rel.url" class="related-link">{{ rel.label }}</a>
            </span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-index { margin-top: 8px; }

/* ============================================================
   筛选工具栏:玻璃拟态卡 + 顶部三色发丝(呼应首页 route-card)
   ============================================================ */
.news-toolbar {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  margin-bottom: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.news-toolbar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2563eb, #22d3ee, #8b5cf6);
  opacity: 0.7;
}

/* 搜索框 */
.toolbar-search {
  position: relative;
  flex: 1 1 240px;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: var(--vp-c-text-3);
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 9px 34px 9px 38px;
  font-size: 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-softer);
}
.search-input::placeholder { color: var(--vp-c-text-3); }
.search-clear {
  position: absolute;
  right: 8px;
  width: 22px; height: 22px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; line-height: 1;
  color: var(--vp-c-text-3);
  background: transparent; border: none; border-radius: 50%;
  cursor: pointer; transition: all 0.15s;
}
.search-clear:hover { color: var(--vp-c-text-1); background: var(--vp-c-default-soft); }

/* 分段控件:重要程度 */
.seg-control {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  gap: 2px;
}
.seg-btn {
  padding: 6px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s;
}
.seg-btn:hover { color: var(--vp-c-text-1); }
.seg-btn.active {
  color: #fff;
  background: var(--vp-c-brand-3);
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

/* 下拉选择 */
.toolbar-selects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.select-wrap { position: relative; display: inline-flex; }
.select-wrap::after {
  content: '';
  position: absolute;
  right: 11px; top: 50%;
  width: 7px; height: 7px;
  border-right: 1.5px solid var(--vp-c-text-3);
  border-bottom: 1.5px solid var(--vp-c-text-3);
  transform: translateY(-65%) rotate(45deg);
  pointer-events: none;
}
.filter-select {
  appearance: none;
  -webkit-appearance: none;
  padding: 8px 30px 8px 12px;
  font-size: 0.85rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:hover { border-color: var(--vp-c-brand-1); }
.filter-select:focus { outline: none; border-color: var(--vp-c-brand-1); }
.filter-reset {
  padding: 8px 14px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-reset:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-softer);
}

/* ============================================================
   统计概览
   ============================================================ */
.news-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 0 4px;
  margin-bottom: 36px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.stat-total { font-size: 0.9rem; }
.stat-total strong {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
.stat-of { color: var(--vp-c-text-3); }
.stat-divider {
  width: 1px; height: 14px;
  background: var(--vp-c-divider);
}
.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}
.stat-chip--hot { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
.stat-chip--major { background: rgba(245, 158, 11, 0.12); color: #d97706; }
.stat-chip--normal { background: rgba(100, 116, 139, 0.12); color: #475569; }

/* ============================================================
   空状态
   ============================================================ */
.news-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 20px;
  color: var(--vp-c-text-3);
}
.empty-icon { font-size: 2.5rem; opacity: 0.6; }
.news-empty p { margin: 0; font-size: 0.95rem; }

/* ============================================================
   时间分组
   ============================================================ */
.news-group { margin-bottom: 52px; }
.news-group__head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 22px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.news-group__date {
  position: relative;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  margin: 0;
  padding-left: 14px;
  border: none;
}
.news-group__date::before {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 4px; height: 18px;
  border-radius: 2px;
  background: linear-gradient(180deg, #2563eb, #22d3ee);
}
.news-group__count {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

/* ============================================================
   卡片网格
   ============================================================ */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 18px;
}

.news-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}
/* 顶部重要程度色条(渐变) */
.news-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  opacity: 0.9;
  transition: opacity 0.22s;
}
.news-card[data-importance="hot"]::before {
  background: linear-gradient(90deg, #ef4444, #f97316);
}
.news-card[data-importance="major"]::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}
.news-card[data-importance="normal"]::before {
  background: linear-gradient(90deg, #64748b, #94a3b8);
}
.news-card:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4), 0 14px 40px rgba(37, 99, 235, 0.14);
}
.news-card:hover::before { opacity: 1; }

/* 徽章行 */
.news-card__header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.news-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.5;
}
.badge-icon { font-size: 0.72rem; }
.news-badge--hot { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
.news-badge--major { background: rgba(245, 158, 11, 0.14); color: #d97706; }
.news-badge--normal { background: rgba(100, 116, 139, 0.12); color: #475569; }
.news-badge--verified { background: rgba(34, 197, 94, 0.12); color: #16a34a; }
.news-badge--todo { background: rgba(234, 179, 8, 0.14); color: #ca8a04; }
.news-badge--bot { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.news-card__date {
  margin-left: auto;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

/* 标题 */
.news-card__title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.01em;
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
}

/* 摘要 */
.news-card__summary {
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  margin: 0 0 14px;
  flex-grow: 1;
}
.news-card__summary :deep(strong) {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.news-card__summary :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.news-card__summary :deep(a:hover) { text-decoration: underline; }

/* 类别标签 */
.news-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}
.news-tag {
  display: inline-block;
  padding: 2px 9px;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border-radius: 6px;
  letter-spacing: -0.01em;
}

/* 底部:来源 + 相关 */
.news-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.78rem;
}
.footer-sources, .footer-related {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
}
.footer-related {
  margin-left: auto;
}
.source-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.source-link:hover { color: var(--vp-c-brand-2); }
.ext-icon { opacity: 0.55; flex-shrink: 0; }
.related-link {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-brand-softer);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.15s;
}
.related-link::before { content: '📖'; margin-right: 4px; font-size: 0.7rem; }
.related-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 768px) {
  .news-grid { grid-template-columns: 1fr; gap: 14px; }
  .news-card { padding: 18px; }
  .news-card__title { font-size: 1rem; }
  .news-toolbar { padding: 14px; gap: 12px; }
  .seg-control { width: 100%; justify-content: space-between; }
  .seg-btn { flex: 1; text-align: center; padding: 7px 4px; }
  .toolbar-selects { width: 100%; }
  .select-wrap { flex: 1; }
  .filter-select { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .news-card { transition: none; }
  .news-card:hover { transform: none; }
}

/* ============================================================
   暗色:辉光更克制,色条更亮
   ============================================================ */
:global(.dark) .news-card:hover {
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5), 0 14px 40px rgba(37, 99, 235, 0.22);
}
:global(.dark) .news-badge--hot { background: rgba(239, 68, 68, 0.2); color: #f87171; }
:global(.dark) .news-badge--major { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
:global(.dark) .news-badge--normal { background: rgba(148, 163, 184, 0.18); color: #cbd5e1; }
:global(.dark) .news-badge--verified { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
:global(.dark) .news-badge--todo { background: rgba(234, 179, 8, 0.2); color: #fde047; }
:global(.dark) .news-badge--bot { background: rgba(59, 130, 246, 0.2); color: #93b4ff; }
:global(.dark) .stat-chip--hot { background: rgba(239, 68, 68, 0.18); color: #f87171; }
:global(.dark) .stat-chip--major { background: rgba(245, 158, 11, 0.18); color: #fbbf24; }
:global(.dark) .stat-chip--normal { background: rgba(148, 163, 184, 0.16); color: #cbd5e1; }

/* ============================================================
   档案皮肤:暖纸 + 氧化红 + 衬线标题,去玻璃辉光改硬阴影
   ============================================================ */
:global(html.skin-archive) .news-toolbar {
  background: #F5F1E8;
  border-color: #D4C4A8;
}
:global(html.skin-archive) .news-toolbar::before {
  background: linear-gradient(90deg, #9A3324, #C97B5A);
}
:global(html.skin-archive) .seg-btn.active {
  background: #9A3324;
  box-shadow: 1px 1px 0 rgba(154, 51, 36, 0.25);
}
:global(html.skin-archive) .search-input,
:global(html.skin-archive) .filter-select {
  background: #FBF8F1;
  border-color: #D4C4A8;
}
:global(html.skin-archive) .news-card {
  background: #F5F1E8;
  border-color: #D4C4A8;
  box-shadow: 1px 1px 0 rgba(154, 51, 36, 0.06);
}
:global(html.skin-archive) .news-card:hover {
  border-color: #9A3324;
  box-shadow: 3px 3px 0 rgba(154, 51, 36, 0.14);
}
:global(html.skin-archive) .news-card__title {
  font-family: 'Source Serif 4', serif;
  font-weight: 600;
}
:global(html.skin-archive) .news-group__date {
  font-family: 'Space Grotesk', sans-serif;
}
:global(html.skin-archive) .news-group__date::before {
  background: linear-gradient(180deg, #9A3324, #C97B5A);
}
:global(html.skin-archive) .news-tag {
  background: rgba(154, 51, 36, 0.08);
  color: #9A3324;
  font-family: 'IBM Plex Mono', monospace;
}
:global(html.skin-archive) .related-link {
  background: rgba(154, 51, 36, 0.08);
  color: #9A3324;
}
:global(html.skin-archive) .stat-total strong { color: #9A3324; }
</style>
