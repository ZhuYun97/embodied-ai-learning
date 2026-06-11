<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
import newsData from '../../../news/news-data.json'

// 筛选状态
const selectedCategory = ref('全部')
const selectedImportance = ref('全部')
const selectedYear = ref('全部')
const searchQuery = ref('')
const selectedDate = ref('')          // 日历筛选:YYYY-MM-DD,空 = 不筛
const showCalendar = ref(false)       // 日历面板展开态
const viewMode = ref('log')           // 'log' 日志流(默认)| 'card' 卡片;持久化于 news-filter
const setView = (v) => { viewMode.value = v; saveFilter() }

// 日历:初始定位到「最新有新闻的月份」(确定性、SSR 安全,不依赖 new Date())
const _newsYMs = newsData.map(n => n.date || '').filter(s => s.length === 10).map(s => s.slice(0, 7))
const _maxYM = _newsYMs.length ? _newsYMs.reduce((a, b) => (a > b ? a : b)) : '2026-01'
const _minYM = _newsYMs.length ? _newsYMs.reduce((a, b) => (a < b ? a : b)) : _maxYM
const calYear = ref(+_maxYM.slice(0, 4))
const calMonth = ref(+_maxYM.slice(5, 7) - 1)   // 0-indexed
const today = ref('')                 // 客户端在 onMounted 写入,避免 SSR 水合不一致

// 卡片展开态:默认折叠(只显标题+元信息),点击卡片再展开详情(摘要+来源)
const expandedIds = ref(new Set())
const isExpanded = (id) => expandedIds.value.has(id)
const toggleCard = (id) => {
  const s = new Set(expandedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedIds.value = s
}

// 从 localStorage 恢复筛选偏好 + 写入今天(客户端)
onMounted(() => {
  const dt = new Date()
  today.value = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  const saved = localStorage.getItem('news-filter')
  if (saved) {
    try {
      const { category, importance, year, date, view } = JSON.parse(saved)
      if (category) selectedCategory.value = category
      if (importance) selectedImportance.value = importance
      if (year) selectedYear.value = year
      if (date) selectedDate.value = date
      if (view === 'log' || view === 'card') viewMode.value = view
    } catch (e) {}
  }
})

// 保存筛选偏好
const saveFilter = () => {
  localStorage.setItem('news-filter', JSON.stringify({
    category: selectedCategory.value,
    importance: selectedImportance.value,
    year: selectedYear.value,
    date: selectedDate.value,
    view: viewMode.value
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

// ============ 日历筛选 ============
// 各「事件日期」的新闻条数(跳过非完整日期,如历史遗留的 '2026-07')
const newsCountByDate = computed(() => {
  const m = {}
  for (const n of newsData) {
    if (n.date && n.date.length === 10) m[n.date] = (m[n.date] || 0) + 1
  }
  return m
})
const curYM = computed(() => `${calYear.value}-${String(calMonth.value + 1).padStart(2, '0')}`)
const canPrev = computed(() => curYM.value > _minYM)   // 不翻到无新闻的更早月份
const canNext = computed(() => curYM.value < _maxYM)
// 当前月份的日历格子(前导空格 + 1..N 天)
const calCells = computed(() => {
  const y = calYear.value, m = calMonth.value
  const firstDow = new Date(y, m, 1).getDay()       // 0=周日
  const days = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push({ key: 'b' + i, day: null })
  for (let d = 1; d <= days; d++) {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({
      key: ds, day: d, dateStr: ds,
      count: newsCountByDate.value[ds] || 0,
      isSelected: selectedDate.value === ds,
      isToday: today.value === ds
    })
  }
  return cells
})
const prevMonth = () => {
  if (!canPrev.value) return
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- } else calMonth.value--
}
const nextMonth = () => {
  if (!canNext.value) return
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ } else calMonth.value++
}
// 点选某天(仅有新闻的天可点;再点一次取消)
const pickDate = (cell) => {
  if (!cell.dateStr || cell.count === 0) return
  selectedDate.value = (selectedDate.value === cell.dateStr) ? '' : cell.dateStr
  saveFilter()
}
const clearDate = () => { selectedDate.value = ''; saveFilter() }
const jumpToLatest = () => { calYear.value = +_maxYM.slice(0, 4); calMonth.value = +_maxYM.slice(5, 7) - 1 }
const formatDateShort = (d) => { const p = d.split('-'); return p.length === 3 ? `${+p[1]}月${+p[2]}日` : d }

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
  if (selectedDate.value) {
    data = data.filter(n => n.date === selectedDate.value)
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

// 全局排序:重要程度优先(hot→major→normal),同级按事件日期降序
const sortedData = computed(() => {
  const order = { hot: 0, major: 1, normal: 2 }
  return filteredData.value.slice().sort((a, b) => {
    const impDiff = order[a.importance] - order[b.importance]
    if (impDiff !== 0) return impDiff
    return b.date.localeCompare(a.date)
  })
})

// 按 fetched_at 分组(降序),组内已按重要程度排序
const groups = computed(() => {
  const map = new Map()
  for (const item of sortedData.value) {
    const key = item.fetched_at
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  const arr = Array.from(map.entries()).map(([date, items]) => ({ date, items }))
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
  selectedDate.value !== '' ||
  searchQuery.value.trim() !== ''
)

// 重置筛选
const resetFilters = () => {
  selectedCategory.value = '全部'
  selectedImportance.value = '全部'
  selectedYear.value = '全部'
  selectedDate.value = ''
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

// 轻量内联 markdown 渲染:仅处理摘要里实际用到的 **加粗** 与 [文字](链接)。
// 先做 HTML 转义防 XSS,再按内联语法替换;站内相对链接补 base 前缀。
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const renderMarkdown = (text) => {
  if (!text) return ''
  let html = escapeHtml(text)
  // [文字](url):外链新窗口,站内链接补 base
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const isExternal = /^https?:\/\//.test(url)
    const href = isExternal ? url : withBase(url)
    const attrs = isExternal ? ' target="_blank" rel="noopener"' : ''
    return `<a href="${href}"${attrs}>${label}</a>`
  })
  // **加粗**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  return html
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
        <button
          class="cal-trigger"
          :class="{ active: selectedDate || showCalendar }"
          @click="showCalendar = !showCalendar"
          :aria-expanded="showCalendar"
          aria-label="按日期筛选"
        >
          <svg class="cal-trigger__icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <rect x="3" y="4.5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="2.5" x2="8" y2="6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="16" y1="2.5" x2="16" y2="6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>{{ selectedDate ? formatDateShort(selectedDate) : '日历' }}</span>
          <span v-if="selectedDate" class="cal-trigger__x" role="button" aria-label="清除日期" @click.stop="clearDate">×</span>
          <svg v-else class="cal-trigger__caret" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button v-if="hasActiveFilter" @click="resetFilters" class="filter-reset">重置</button>
      </div>

      <!-- 视图切换:日志流(默认)/ 卡片 -->
      <div class="seg-control seg-control--view" role="group" aria-label="视图切换">
        <button :class="['seg-btn', { active: viewMode === 'log' }]" @click="setView('log')" title="日志流视图">▤ 日志流</button>
        <button :class="['seg-btn', { active: viewMode === 'card' }]" @click="setView('card')" title="卡片视图">▦ 卡片</button>
      </div>
    </div>

    <!-- 日历筛选面板(内联展开:避开工具栏 overflow:hidden 与卡片 z-index 叠层) -->
    <div v-if="showCalendar" class="cal-panel" role="dialog" aria-label="按日期筛选">
      <div class="cal-head">
        <button class="cal-nav" :disabled="!canPrev" @click="prevMonth" aria-label="上一月">‹</button>
        <span class="cal-title">{{ calYear }}<span class="cal-title__sep">年</span>{{ calMonth + 1 }}<span class="cal-title__sep">月</span></span>
        <button class="cal-nav" :disabled="!canNext" @click="nextMonth" aria-label="下一月">›</button>
        <button class="cal-close" @click="showCalendar = false" aria-label="收起日历">×</button>
      </div>
      <div class="cal-weekdays">
        <span v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</span>
      </div>
      <div class="cal-grid">
        <template v-for="cell in calCells" :key="cell.key">
          <span v-if="cell.day === null" class="cal-cell cal-cell--blank" aria-hidden="true"></span>
          <button
            v-else
            type="button"
            class="cal-cell"
            :class="{ 'has-news': cell.count > 0, 'is-selected': cell.isSelected, 'is-today': cell.isToday }"
            :disabled="cell.count === 0"
            :title="cell.count ? cell.count + ' 条新闻' : ''"
            :aria-label="`${calMonth + 1}月${cell.day}日` + (cell.count ? `,${cell.count} 条新闻` : ',无新闻')"
            :aria-pressed="cell.isSelected"
            @click="pickDate(cell)"
          >
            <span class="cal-day">{{ cell.day }}</span>
            <span v-if="cell.count > 0" class="cal-dot" :class="{ 'cal-dot--multi': cell.count > 1 }"></span>
          </button>
        </template>
      </div>
      <div class="cal-foot">
        <span class="cal-foot__hint">
          <template v-if="selectedDate">已选 <strong>{{ formatDate(selectedDate) }}</strong></template>
          <template v-else>点亮的日期 = 有新闻,点选即筛</template>
        </span>
        <span class="cal-foot__actions">
          <button v-if="canNext" class="cal-foot__btn" @click="jumpToLatest">最新 ⟫</button>
          <button v-if="selectedDate" class="cal-foot__btn cal-foot__btn--clear" @click="clearDate">清除</button>
        </span>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="news-stats">
      <span class="stat-live"><span class="stat-live__dot"></span>LIVE</span>
      <span class="stat-divider"></span>
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

      <div v-if="viewMode === 'card'" class="news-grid">
        <article
          v-for="item in group.items"
          :key="item.id"
          class="news-card"
          :class="{ 'is-expanded': isExpanded(item.id) }"
          :data-importance="item.importance"
          role="button"
          tabindex="0"
          :aria-expanded="isExpanded(item.id)"
          @click="toggleCard(item.id)"
          @keydown.enter.prevent="toggleCard(item.id)"
          @keydown.space.prevent="toggleCard(item.id)"
        >
          <span class="nc-corner nc-corner--tl" aria-hidden="true"></span>
          <span class="nc-corner nc-corner--tr" aria-hidden="true"></span>
          <span class="nc-corner nc-corner--bl" aria-hidden="true"></span>
          <span class="nc-corner nc-corner--br" aria-hidden="true"></span>
          <span class="nc-scan" aria-hidden="true"></span>
          <div class="news-card__header">
            <span :class="['news-badge', `news-badge--${item.importance}`]">
              <span class="badge-icon">{{ importanceIcon[item.importance] }}</span>{{ importanceLabel[item.importance] }}
            </span>
            <span :class="['news-badge', `news-badge--${item.credibility}`]">
              {{ credibilityLabel[item.credibility] }}
            </span>
            <span v-if="item.bot" class="news-badge news-badge--bot" title="机器人自动收录">🤖 bot</span>
            <time class="news-card__date" :datetime="item.date">{{ formatDate(item.date) }}</time>
            <svg class="news-card__chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>

          <h3 class="news-card__title">{{ item.title }}</h3>

          <!-- 类别标签(始终显示,便于扫读) -->
          <div v-if="item.category.length" class="news-card__tags">
            <span v-for="cat in item.category" :key="cat" class="news-tag">{{ cat }}</span>
          </div>

          <!-- 详情:点击卡片后展开(摘要 + 来源 + 相关) -->
          <div v-if="isExpanded(item.id)" class="news-card__detail">
            <p class="news-card__summary" v-html="renderMarkdown(item.summary)"></p>
            <div class="news-card__footer">
              <span v-if="item.sources.length" class="footer-sources">
                <a
                  v-for="(src, idx) in item.sources"
                  :key="idx"
                  :href="src.url"
                  target="_blank"
                  rel="noopener"
                  class="source-link"
                  @click.stop
                >{{ src.name }}<svg class="ext-icon" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M12 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
              </span>
              <span v-if="item.related.length" class="footer-related">
                <a v-for="(rel, idx) in item.related" :key="idx" :href="rel.url" class="related-link" @click.stop>{{ rel.label }}</a>
              </span>
            </div>
          </div>

          <!-- 折叠态提示 -->
          <span v-else class="news-card__more">阅读详情</span>
        </article>
      </div>

      <!-- 日志流视图(默认):传输日志式时间线,样式见全局 custom.css(.nlog-*) -->
      <div v-else class="news-log">
        <article
          v-for="item in group.items"
          :key="item.id"
          class="nlog"
          :class="{ 'is-expanded': isExpanded(item.id) }"
          :data-importance="item.importance"
          role="button"
          tabindex="0"
          :aria-expanded="isExpanded(item.id)"
          @click="toggleCard(item.id)"
          @keydown.enter.prevent="toggleCard(item.id)"
          @keydown.space.prevent="toggleCard(item.id)"
        >
          <span class="nlog__rail" aria-hidden="true"><i class="nlog__node"></i></span>
          <div class="nlog__body">
            <div class="nlog__head">
              <time class="nlog__ts" :datetime="item.date">{{ item.date }}</time>
              <span :class="['nlog__lvl', `nlog__lvl--${item.importance}`]">{{ importanceIcon[item.importance] }} {{ importanceLabel[item.importance] }}</span>
              <span :class="['nlog__lvl', `nlog__lvl--${item.credibility}`]">{{ credibilityLabel[item.credibility] }}</span>
              <span v-if="item.bot" class="nlog__lvl nlog__lvl--bot" title="机器人自动收录">bot</span>
              <span class="nlog__cats">
                <span v-for="cat in item.category" :key="cat" class="nlog__cat">#{{ cat }}</span>
              </span>
              <svg class="nlog__chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="nlog__title">{{ item.title }}</h3>
            <div v-if="isExpanded(item.id)" class="news-card__detail nlog__detail">
              <p class="news-card__summary" v-html="renderMarkdown(item.summary)"></p>
              <div class="news-card__footer">
                <span v-if="item.sources.length" class="footer-sources">
                  <a
                    v-for="(src, idx) in item.sources"
                    :key="idx"
                    :href="src.url"
                    target="_blank"
                    rel="noopener"
                    class="source-link"
                    @click.stop
                  >{{ src.name }}<svg class="ext-icon" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9M12 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
                </span>
                <span v-if="item.related.length" class="footer-related">
                  <a v-for="(rel, idx) in item.related" :key="idx" :href="rel.url" class="related-link" @click.stop>{{ rel.label }}</a>
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<style scoped>
.news-index { margin-top: 8px; position: relative; z-index: 0; }

/* 新闻页无侧栏 + 无 aside,默认正文仅 ~720px 太窄(卡片挤成 2 列)。
   仅在新闻页(:has(.news-index))放宽容器到 3 列(!important 压过主题媒体查询)。 */
:global(.VPDoc:has(.news-index) .container) { max-width: 1240px !important; }
:global(.VPDoc:has(.news-index) .content) { max-width: 100% !important; }

/* 深空情报台底(星云+网格+星点)放在全局 custom.css 的 `.dark .news-index::before`。
   ⚠️ 不要在 scoped 里写 `:global(.dark) .news-index::before` —— Vue scoped 编译器会把
   「:global() + ::before」误编译成裸 `.dark{...}`,其 pointer-events:none 落到 <html.dark>
   上,导致暗色下整页 body 不可点击(2026-06 踩坑)。 */
.news-toolbar, .news-stats, .news-group, .news-empty { position: relative; z-index: 1; }

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
  background: linear-gradient(90deg, #2563eb, #22d3ee, #67e8f9);
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
  border-color: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.16);
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
  font-family: var(--vp-font-family-mono, monospace);
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
  font-family: var(--vp-font-family-mono, monospace);
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
  font-family: var(--vp-font-family-mono, monospace);
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
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

/* ============================================================
   卡片网格:等宽 Grid，逐行从左到右(保持重要程度排序;展开不再整列重排)
   ============================================================ */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
  align-items: start;
}

.news-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 22px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--tech-card-bg);
  backdrop-filter: blur(10px) saturate(1.15);
  -webkit-backdrop-filter: blur(10px) saturate(1.15);
  overflow: hidden;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}
/* 微网格纹理层(极淡,纯装饰) */
.news-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
  background-size: 16px 16px;
  pointer-events: none;
  opacity: 0.6;
  z-index: 0;
}
.news-card > * { position: relative; z-index: 1; }

/* 整卡可点击展开/折叠 */
.news-card { cursor: pointer; }
.news-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.news-card__chevron {
  margin-left: 6px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: transform 0.25s ease, color 0.2s;
}
.news-card.is-expanded .news-card__chevron {
  transform: rotate(180deg);
  color: var(--vp-c-brand-1);
}
/* 折叠态:提示"阅读详情" */
.news-card__more {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  opacity: 0.85;
}
.news-card__more::after { content: '›'; font-size: 1.05rem; line-height: 1; }
.news-card:hover .news-card__more { opacity: 1; text-decoration: underline; }
/* 展开态:详情淡入 */
.news-card__detail { animation: news-reveal 0.24s ease both; }
@keyframes news-reveal {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: none; }
}

/* 顶部重要程度色条(渐变) */
.news-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  opacity: 0.85;
  z-index: 2;
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
  box-shadow:
    0 0 0 1px rgba(56, 189, 248, 0.45),
    inset 0 0 0 1px rgba(56, 189, 248, 0.08),
    0 16px 44px rgba(37, 99, 235, 0.16);
}
.news-card:hover::before { opacity: 1; }
.news-card:hover::after { opacity: 0.8; }

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
  /* 折叠态:标题最多 3 行,卡片高度更整齐(展开后显示全文) */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-card.is-expanded .news-card__title {
  -webkit-line-clamp: unset;
  overflow: visible;
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
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  letter-spacing: 0;
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
   响应式:瀑布流列数自适应
   ============================================================ */
@media (max-width: 767px) {
  .news-grid { grid-template-columns: 1fr; }
  .news-card { padding: 18px; }
  .news-card__title { font-size: 1rem; }
  .news-toolbar { padding: 14px; gap: 12px; }
  .seg-control { width: 100%; justify-content: space-between; }
  .seg-btn { flex: 1; text-align: center; padding: 7px 4px; font-size: 0.78rem; }
  .toolbar-selects { width: 100%; }
  .select-wrap { flex: 1; }
  .filter-select { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .news-card { transition: none; }
  .news-card:hover { transform: none; }
  .news-card__chevron { transition: none; }
  .news-card__detail { animation: none; }
}

/* ⚠️ 本组件内禁止出现 :global(.dark) 规则——生产构建会压成裸 .dark{...} 污染全站
   (已两次踩坑:第一次整页不可点,第二次顶栏 logo 被 .cal-dot 青底染成色块)。
   全部暗色定制已迁至全局 custom.css「NewsIndex 暗色层」,以 html.dark 前缀书写。 */

/* ============================================================
   炫酷「情报台 HUD」层(暗色为主)— 四角取景框 / 悬停扫描 / 霓虹发光 /
   传输日志分组头 / 流动工具条;呼应首页深空 HUD,reduced-motion 全关动效
   ============================================================ */

/* —— 卡片四角取景框:暗色常驻微光,悬停点亮 —— */
.nc-corner {
  position: absolute; width: 14px; height: 14px; z-index: 3;
  border: 1.5px solid transparent; pointer-events: none;
  opacity: 0; transition: opacity 0.22s ease, box-shadow 0.22s ease;
}
.nc-corner--tl { top: 7px; left: 7px; border-right: 0; border-bottom: 0; border-top-left-radius: 4px; }
.nc-corner--tr { top: 7px; right: 7px; border-left: 0; border-bottom: 0; border-top-right-radius: 4px; }
.nc-corner--bl { bottom: 7px; left: 7px; border-right: 0; border-top: 0; border-bottom-left-radius: 4px; }
.nc-corner--br { bottom: 7px; right: 7px; border-left: 0; border-top: 0; border-bottom-right-radius: 4px; }
.news-card:hover .nc-corner { opacity: 1; }

/* —— 悬停扫描线:一道青光自上而下扫过卡片 —— */
.nc-scan {
  position: absolute; left: 0; right: 0; top: 0; height: 46%;
  z-index: 2; pointer-events: none; opacity: 0;
  background: linear-gradient(to bottom, rgba(56, 189, 248, 0.16), transparent);
}

/* —— 卡片暗色底:更深玻璃 + 青边 + 内描边 —— */

/* —— 重要程度顶条 + 徽章:霓虹发光 —— */

/* —— "阅读详情" → 等宽终端风;标题悬停发光 —— */
.news-card__more { font-family: var(--vp-font-family-mono, monospace); letter-spacing: 0.02em; }

/* —— 时间分组头:HUD 传输日志条 —— */
.news-group__head { position: relative; border-bottom: 0; padding-bottom: 12px; }
.news-group__head::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
  background: linear-gradient(90deg, var(--vp-c-divider), transparent 70%);
}
.news-group__count { padding: 2px 8px; border-radius: 5px; border: 1px solid var(--vp-c-divider); }

/* —— 统计 + 工具条:发光 + 顶条流动 —— */
@media (prefers-reduced-motion: no-preference) {
  .news-toolbar::before {
    background: linear-gradient(90deg, #2563eb, #22d3ee, #67e8f9, #22d3ee, #2563eb);
    background-size: 200% 100%;
    opacity: 0.9;
    animation: ncFiber 5s linear infinite;
  }
}
@keyframes ncFiber { from { background-position: 0 0; } to { background-position: 200% 0; } }

/* —— 情报流「LIVE」读出(闪烁点)—— */
.stat-live {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.74rem; font-weight: 700; letter-spacing: 0.14em;
  color: #16a34a;
}
.stat-live__dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; }
@media (prefers-reduced-motion: no-preference) {
  .stat-live__dot { animation: ncBlink 1.4s steps(1, end) infinite; }
}
@keyframes ncBlink { 0%, 62% { opacity: 1; } 63%, 100% { opacity: 0.25; } }

/* —— 悬停更猛:微缩放 + 更大青光 + 顶条流光 —— */
.news-card:hover { transform: translateY(-4px) scale(1.012); }
@media (prefers-reduced-motion: no-preference) {
  .news-card:hover::before { background-size: 200% 100%; animation: ncFiber 2.4s linear infinite; }
}

/* ============================================================
   日历筛选:触发钮 + 内联面板(HUD 玻璃 · 电光青)
   ============================================================ */
.cal-trigger {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 9px 8px 12px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, color .2s;
}
.cal-trigger:hover { border-color: var(--vp-c-brand-1); }
.cal-trigger.active { color: #0e7490; border-color: #22d3ee; box-shadow: 0 0 0 3px rgba(34, 211, 238, .14); }
.cal-trigger__icon { flex-shrink: 0; color: var(--vp-c-text-3); }
.cal-trigger.active .cal-trigger__icon { color: #0891b2; }
.cal-trigger__caret { color: var(--vp-c-text-3); flex-shrink: 0; }
.cal-trigger__x {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; font-size: 1rem; line-height: 1; border-radius: 50%;
  color: #0891b2; background: rgba(34, 211, 238, .14); transition: background .15s;
}
.cal-trigger__x:hover { background: rgba(34, 211, 238, .3); }

.cal-panel {
  position: relative; z-index: 2;
  width: 300px; max-width: 100%;
  margin: -6px 0 20px;
  padding: 12px 14px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 13px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 12px 32px rgba(15, 23, 42, .14);
  animation: calIn .18s ease both;
}
@keyframes calIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }

.cal-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.cal-title {
  flex: 1; text-align: center;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.95rem; font-weight: 700; letter-spacing: .02em;
  color: var(--vp-c-text-1);
}
.cal-title__sep { color: var(--vp-c-text-3); font-weight: 500; margin: 0 1px; }
.cal-nav {
  width: 28px; height: 28px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.2rem; line-height: 1;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px; cursor: pointer; transition: all .15s;
}
.cal-nav:hover:not(:disabled) { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.cal-nav:disabled { opacity: .35; cursor: not-allowed; }
.cal-close {
  width: 24px; height: 24px; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 1.15rem; line-height: 1;
  color: var(--vp-c-text-3); background: transparent; border: none;
  border-radius: 6px; cursor: pointer; transition: all .15s;
}
.cal-close:hover { color: var(--vp-c-text-1); background: var(--vp-c-default-soft); }

.cal-weekdays, .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.cal-weekdays { margin-bottom: 4px; }
.cal-weekdays span {
  text-align: center; padding: 2px 0;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.68rem; font-weight: 600; color: var(--vp-c-text-3);
}
.cal-cell {
  position: relative; aspect-ratio: 1 / 1; padding: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.82rem; color: var(--vp-c-text-3);
  background: transparent; border: 1px solid transparent; border-radius: 8px;
  cursor: default; transition: border-color .15s, box-shadow .15s, background .15s;
}
.cal-cell--blank { border: 0; }
.cal-cell.has-news {
  color: var(--vp-c-text-1); font-weight: 600; cursor: pointer;
  background: var(--vp-c-default-soft); border-color: var(--vp-c-divider);
}
.cal-cell.has-news:hover { border-color: #22d3ee; box-shadow: 0 0 0 2px rgba(34, 211, 238, .16); }
.cal-cell.is-today { box-shadow: inset 0 0 0 1.5px rgba(34, 211, 238, .5); }
.cal-cell.is-selected {
  color: #06262e;
  background: linear-gradient(180deg, #67e8f9, #22d3ee);
  border-color: #22d3ee; box-shadow: 0 0 14px rgba(34, 211, 238, .45);
}
.cal-dot {
  position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%);
  width: 4px; height: 4px; border-radius: 50%; background: #06b6d4;
}
.cal-dot--multi { width: 12px; border-radius: 3px; background: linear-gradient(90deg, #22d3ee, #0891b2); }
.cal-cell.is-selected .cal-dot { background: #06262e; }

.cal-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  margin-top: 9px; padding-top: 9px; border-top: 1px solid var(--vp-c-divider);
}
.cal-foot__hint { font-size: 0.74rem; color: var(--vp-c-text-3); }
.cal-foot__hint strong { color: var(--vp-c-brand-1); font-weight: 700; }
.cal-foot__actions { display: inline-flex; gap: 6px; flex-shrink: 0; }
.cal-foot__btn {
  padding: 3px 10px; font-size: 0.74rem;
  font-family: var(--vp-font-family-mono, monospace);
  color: var(--vp-c-text-2); background: transparent;
  border: 1px solid var(--vp-c-divider); border-radius: 7px;
  cursor: pointer; transition: all .15s; white-space: nowrap;
}
.cal-foot__btn:hover { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.cal-foot__btn--clear:hover { color: #dc2626; border-color: #dc2626; background: rgba(220, 38, 38, .06); }

@media (prefers-reduced-motion: reduce) { .cal-panel { animation: none; } }
@media (max-width: 767px) { .cal-panel { width: 100%; } }

</style>
