<script setup>
import { ref, computed, watch } from 'vue'
import { withBase } from 'vitepress'
import newsData from '../../../news/news-data.json'

const searchQuery = ref('')
const selectedTopic = ref('all')
const selectedImportance = ref('all')
const selectedCredibility = ref('all')
const selectedYear = ref('all')
const visibleGroupCount = ref(4)

const importanceOrder = { hot: 0, major: 1, normal: 2 }
const importanceLabel = { hot: '重磅', major: '重要', normal: '关注' }
const credibilityLabel = { verified: '已核实', todo: '待核实' }

const topicOptions = [
  { value: 'all', label: '全部动态', keywords: [] },
  {
    value: 'model',
    label: '模型 / 产品',
    keywords: ['模型', '产品', '平台', '系统', '框架', '开源', '软件', '操作系统', '大脑', 'VLA']
  },
  {
    value: 'deployment',
    label: '产业 / 部署',
    keywords: ['产业', '落地', '部署', '应用', '量产', '生产', '工厂', '订单', '合同', '商业化']
  },
  {
    value: 'capital',
    label: '融资 / 上市',
    keywords: ['融资', '投资', '上市', '并购', '资本', '估值', '募资']
  },
  {
    value: 'company',
    label: '公司 / 合作',
    keywords: ['公司', '企业', '合作', '战略', '团队', '组织', '人事', '收购', '生态']
  },
  {
    value: 'policy',
    label: '政策 / 标准',
    keywords: ['政策', '标准', '法规', '监管', '政府', '国家', '地方']
  },
  {
    value: 'event',
    label: '活动 / 赛事',
    keywords: ['活动', '赛事', '竞赛', '会议', '展会', '峰会', '论坛', '奖项']
  },
  {
    value: 'research',
    label: '研究发布',
    keywords: ['论文', '研究', '报告', '评测', '数据集', '基准']
  }
]

const allYears = computed(() => {
  const years = new Set(newsData.map(item => (item.date || '').slice(0, 4)).filter(Boolean))
  return ['all', ...Array.from(years).sort().reverse()]
})

const searchableText = (item) =>
  [item.title, item.summary, ...(item.category || [])].filter(Boolean).join(' ').toLowerCase()

const matchesTopic = (item, value) => {
  if (value === 'all') return true
  const topic = topicOptions.find(option => option.value === value)
  if (!topic) return true
  const text = searchableText(item)
  return topic.keywords.some(keyword => text.includes(keyword.toLowerCase()))
}

const primaryTopic = (item) => {
  const match = topicOptions.slice(1).find(topic => matchesTopic(item, topic.value))
  return match?.label || item.category?.[0] || '行业动态'
}

const filteredData = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return newsData.filter(item => {
    if (!matchesTopic(item, selectedTopic.value)) return false
    if (selectedImportance.value !== 'all' && item.importance !== selectedImportance.value) return false
    if (selectedCredibility.value !== 'all' && item.credibility !== selectedCredibility.value) return false
    if (selectedYear.value !== 'all' && !(item.date || '').startsWith(selectedYear.value)) return false
    if (query && !searchableText(item).includes(query)) return false
    return true
  })
})

const groups = computed(() => {
  const grouped = new Map()
  for (const item of filteredData.value) {
    const key = item.date || '日期待补'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(item)
  }

  return Array.from(grouped.entries())
    .map(([date, items]) => ({
      date,
      items: items.slice().sort((a, b) => {
        const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance]
        if (importanceDiff !== 0) return importanceDiff
        return (b.fetched_at || '').localeCompare(a.fetched_at || '')
      })
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
})

const visibleGroups = computed(() => groups.value.slice(0, visibleGroupCount.value))
const visibleItemCount = computed(() =>
  visibleGroups.value.reduce((total, group) => total + group.items.length, 0)
)
const remainingCount = computed(() =>
  groups.value
    .slice(visibleGroupCount.value)
    .reduce((total, group) => total + group.items.length, 0)
)

const hasActiveFilter = computed(() =>
  searchQuery.value.trim() !== '' ||
  selectedTopic.value !== 'all' ||
  selectedImportance.value !== 'all' ||
  selectedCredibility.value !== 'all' ||
  selectedYear.value !== 'all'
)

watch(
  [searchQuery, selectedTopic, selectedImportance, selectedCredibility, selectedYear],
  () => { visibleGroupCount.value = 4 }
)

const resetFilters = () => {
  searchQuery.value = ''
  selectedTopic.value = 'all'
  selectedImportance.value = 'all'
  selectedCredibility.value = 'all'
  selectedYear.value = 'all'
}

const fullDates = newsData
  .map(item => item.date || '')
  .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
const latestDate = fullDates.reduce((latest, date) => date > latest ? date : latest, '')
const latestFetchedAt = newsData
  .map(item => item.fetched_at || '')
  .reduce((latest, date) => date > latest ? date : latest, '')

const latestItems = newsData
  .filter(item => item.date === latestDate)
  .slice()
  .sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance])

const recentCount = (() => {
  if (!latestDate) return 0
  const latest = Date.parse(latestDate + 'T00:00:00Z')
  return newsData.filter(item => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')) return false
    const diff = (latest - Date.parse(item.date + 'T00:00:00Z')) / 86400000
    return diff >= 0 && diff <= 6
  }).length
})()

const verifiedCount = newsData.filter(item => item.credibility === 'verified').length

const stats = computed(() => ({
  total: filteredData.value.length,
  verified: filteredData.value.filter(item => item.credibility === 'verified').length,
  hot: filteredData.value.filter(item => item.importance === 'hot').length
}))

const formatDate = (date) => {
  const parts = (date || '').split('-')
  if (parts.length === 3) return parts[0] + '年' + Number(parts[1]) + '月' + Number(parts[2]) + '日'
  if (parts.length === 2) return parts[0] + '年' + Number(parts[1]) + '月'
  return date
}

const formatCompactDate = (date) => {
  const parts = (date || '').split('-')
  if (parts.length >= 2) return parts.slice(1).join('.')
  return date
}

const formatMachineDate = (date) => (date || '').replaceAll('-', '.')

const weekday = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return 'ARCHIVE'
  return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
    new Date(date + 'T00:00:00Z').getUTCDay()
  ]
}

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

const escapeAttribute = (value) => escapeHtml(value)
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const isExternalLink = (url) => /^https?:\/\//i.test(url || '')

const resolvedHref = (url) => {
  const value = String(url || '').trim()
  if (isExternalLink(value) || /^(mailto:|tel:)/i.test(value)) return value
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '#'
  if (!value) return '#'
  return withBase(value.startsWith('/') ? value : '/' + value.replace(/^\.?\//, ''))
}

const renderMarkdown = (text) => {
  if (!text) return ''
  let html = escapeHtml(text)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const href = resolvedHref(url.replace(/&amp;/g, '&'))
    const attrs = isExternalLink(href) ? ' target="_blank" rel="noopener"' : ''
    return '<a href="' + escapeAttribute(href) + '"' + attrs + '>' + label + '</a>'
  })
  return html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}
</script>

<template>
  <div class="news-brief">
    <header class="brief-hero">
      <div class="brief-hero__lead">
        <div class="brief-hero__meta">
          <span>FIELD NOTES</span>
          <time :datetime="latestFetchedAt">UPDATED {{ formatMachineDate(latestFetchedAt) }}</time>
        </div>
        <h1>具身智能新闻</h1>
        <p class="brief-hero__dek">
          聚合公司战略、产品发布、融资进展与产业落地，也保留少量值得跟进的研究发布。纯论文候选请前往每日论文雷达。
        </p>

        <dl class="brief-hero__stats" aria-label="新闻简报统计">
          <div><dt>最新日期</dt><dd>{{ latestItems.length }}</dd></div>
          <div><dt>近 7 日</dt><dd>{{ recentCount }}</dd></div>
          <div><dt>已核实</dt><dd>{{ verifiedCount }}</dd></div>
          <div><dt>更新</dt><dd>{{ formatCompactDate(latestFetchedAt) }}</dd></div>
        </dl>

        <nav class="brief-hero__links" aria-label="相关内容入口">
          <a :href="withBase('/papers/latest')">每日论文雷达</a>
          <a :href="withBase('/vla/papers/timeline')">发展时间线</a>
          <a :href="withBase('/news/qwen-robot')">Qwen-Robot 专题</a>
        </nav>
      </div>

      <section class="brief-signals" aria-labelledby="latest-signals-title">
        <div class="brief-signals__head">
          <h2 id="latest-signals-title">最新动态</h2>
          <span>{{ String(latestItems.length).padStart(2, '0') }}</span>
        </div>
        <ol>
          <li v-for="(item, index) in latestItems.slice(0, 4)" :key="item.id">
            <span class="brief-signals__no">{{ String(index + 1).padStart(2, '0') }}</span>
            <span :class="['brief-signals__level', 'is-' + item.importance]">
              {{ importanceLabel[item.importance] }}
            </span>
            <strong>{{ item.title }}</strong>
            <span class="brief-signals__topic">{{ primaryTopic(item) }}</span>
          </li>
        </ol>
      </section>
    </header>

    <section class="brief-filter" aria-label="新闻筛选">
      <div class="brief-filter__top">
        <label class="brief-search">
          <span class="sr-only">搜索新闻标题、摘要或标签</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <circle cx="11" cy="11" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="搜索标题、摘要或标签…"
            autocomplete="off"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="brief-search__clear"
            aria-label="清除搜索"
            @click="searchQuery = ''"
          >清除</button>
        </label>

        <div class="brief-filter__status">
          <span>NEWS INDEX</span>
          <output aria-live="polite">显示 {{ stats.total }} / {{ newsData.length }} 条</output>
        </div>

        <button
          v-if="hasActiveFilter"
          type="button"
          class="brief-filter__reset"
          @click="resetFilters"
        >清除筛选</button>
      </div>

      <div class="brief-filter__row">
        <span class="brief-filter__label">主题</span>
        <div class="brief-topics" role="group" aria-label="按主题筛选">
          <button
            v-for="topic in topicOptions"
            :key="topic.value"
            type="button"
            :class="{ active: selectedTopic === topic.value }"
            :aria-pressed="selectedTopic === topic.value"
            @click="selectedTopic = topic.value"
          >{{ topic.label }}</button>
        </div>
      </div>

      <div class="brief-filter__row brief-filter__row--compact">
        <span class="brief-filter__label">精筛</span>
        <div class="brief-selects">
          <label>
            <span class="sr-only">重要程度</span>
            <select v-model="selectedImportance">
              <option value="all">全部重要度</option>
              <option value="hot">重磅</option>
              <option value="major">重要</option>
              <option value="normal">关注</option>
            </select>
          </label>
          <label>
            <span class="sr-only">可信度</span>
            <select v-model="selectedCredibility">
              <option value="all">全部可信度</option>
              <option value="verified">已核实</option>
              <option value="todo">待核实</option>
            </select>
          </label>
          <label>
            <span class="sr-only">年份</span>
            <select v-model="selectedYear">
              <option value="all">全部年份</option>
              <option v-for="year in allYears.slice(1)" :key="year" :value="year">{{ year }} 年</option>
            </select>
          </label>
        </div>
        <div class="brief-filter__summary" aria-live="polite">
          <span>{{ stats.hot }} 条重磅</span>
          <span>{{ stats.verified }} 条已核实</span>
        </div>
      </div>
    </section>

    <div v-if="groups.length === 0" class="brief-empty">
      <span>NO MATCHES</span>
      <h2>没有找到匹配的动态</h2>
      <p>换一个关键词，或清除当前筛选条件后再试。</p>
      <button type="button" @click="resetFilters">清除筛选</button>
    </div>

    <section v-else class="brief-results" aria-label="新闻列表">
      <div class="brief-results__head">
        <span>EVENT STREAM</span>
        <span>已展示 {{ visibleItemCount }} / {{ stats.total }} 条</span>
      </div>

      <section
        v-for="(group, groupIndex) in visibleGroups"
        :key="group.date"
        class="brief-group"
        :aria-labelledby="'news-date-' + groupIndex"
      >
        <header class="brief-group__head">
          <div>
            <span class="brief-group__compact">{{ formatCompactDate(group.date) }}</span>
            <span class="brief-group__weekday">{{ weekday(group.date) }}</span>
          </div>
          <h2 :id="'news-date-' + groupIndex">{{ formatDate(group.date) }}</h2>
          <span>{{ group.items.length }} 条动态</span>
        </header>

        <div class="brief-grid">
          <article
            v-for="(item, itemIndex) in group.items"
            :key="item.id"
            class="brief-card"
            :class="{
              'is-featured': groupIndex === 0 && itemIndex === 0 && group.items.length > 1,
              'is-hot': item.importance === 'hot',
              'is-major': item.importance === 'major'
            }"
          >
            <div class="brief-card__meta">
              <span :class="['brief-level', 'is-' + item.importance]">
                <i aria-hidden="true"></i>{{ importanceLabel[item.importance] }}
              </span>
              <span :class="['brief-credibility', 'is-' + item.credibility]">
                {{ credibilityLabel[item.credibility] }}
              </span>
              <span class="brief-card__topic">{{ primaryTopic(item) }}</span>
            </div>

            <h3>{{ item.title }}</h3>
            <p class="brief-card__summary" v-html="renderMarkdown(item.summary)"></p>

            <div v-if="item.category?.length" class="brief-card__tags" aria-label="原始分类">
              <span v-for="tag in item.category.slice(0, 2)" :key="tag">{{ tag }}</span>
              <span v-if="item.category.length > 2">+{{ item.category.length - 2 }}</span>
            </div>

            <footer class="brief-card__footer">
              <div class="brief-card__sources">
                <a
                  v-for="(source, sourceIndex) in (item.sources || []).slice(0, 2)"
                  :key="sourceIndex"
                  :href="resolvedHref(source.url)"
                  :target="isExternalLink(source.url) ? '_blank' : undefined"
                  :rel="isExternalLink(source.url) ? 'noopener' : undefined"
                >
                  {{ source.name }}
                  <svg v-if="isExternalLink(source.url)" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
                    <path d="M14 5h5v5m0-5-9 9M12 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <span v-if="!(item.sources || []).length">来源待补</span>
              </div>

              <div v-if="item.related?.length" class="brief-card__related">
                <a
                  v-for="(related, relatedIndex) in item.related.slice(0, 2)"
                  :key="relatedIndex"
                  :href="resolvedHref(related.url)"
                >{{ related.label }}</a>
              </div>

              <small>收录于 {{ formatDate(item.fetched_at) }}<span v-if="item.bot"> · 自动采集</span></small>
            </footer>
          </article>
        </div>
      </section>

      <div v-if="remainingCount > 0" class="brief-load">
        <button type="button" @click="visibleGroupCount += 4">
          加载更早动态
          <span>剩余 {{ remainingCount }} 条</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.news-brief {
  --news-ink: var(--vp-c-text-1);
  --news-muted: var(--vp-c-text-2);
  --news-faint: var(--vp-c-text-3);
  --news-page: var(--vp-c-bg-soft);
  --news-surface: color-mix(in srgb, var(--vp-c-bg) 94%, var(--vp-c-brand-soft));
  --news-surface-strong: var(--vp-c-bg);
  --news-border: var(--vp-c-divider);
  --news-border-strong: color-mix(in srgb, var(--vp-c-text-1) 22%, transparent);
  --news-blue: var(--vp-c-brand-1);
  --news-red: var(--vp-c-danger-1, #b74242);
  --news-amber: var(--vp-c-warning-1, #9b6716);
  --news-green: var(--vp-c-success-1, #247552);
  --news-shadow: 0 1px 1px rgba(10, 15, 25, 0.04), 0 16px 38px rgba(10, 15, 25, 0.06);
  position: relative;
  color: var(--news-ink);
}

:global(.news-brief-page .VPDoc) {
  overflow-x: clip;
  padding-bottom: 64px;
  background:
    radial-gradient(920px 460px at 14% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent 68%),
    radial-gradient(760px 420px at 94% 3%, color-mix(in srgb, var(--vp-c-success-1, #247552) 6%, transparent), transparent 70%),
    var(--vp-c-bg-soft);
}
:global(.news-brief-page) { overflow-x: clip; }
:global(.news-brief-page .VPDoc:not(.has-sidebar) > .container) { max-width: 1440px !important; }
:global(.news-brief-page .VPDoc:not(.has-sidebar) > .container > .content) { max-width: 100% !important; }
:global(.news-brief-page .content-container) { max-width: 1180px; }

.sr-only {
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

.brief-hero {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(36px, 5vw, 72px);
  align-items: start;
  margin: 10px 0 24px;
  padding: 30px 0 28px;
  border-block: 1px solid var(--news-border);
}

.brief-hero__lead,
.brief-signals { min-width: 0; }

.brief-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  align-items: center;
  color: var(--news-faint);
  font: 680 0.68rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.07em;
}
.brief-hero__meta span { color: var(--news-blue); }
.brief-hero__meta time::before {
  content: '/';
  margin-right: 9px;
  color: var(--news-border-strong);
}

.news-brief h1 {
  margin: 17px 0 11px;
  padding: 0;
  border: 0;
  color: var(--news-ink);
  font-size: clamp(2rem, 3vw, 2.7rem);
  font-weight: 790;
  letter-spacing: -0.05em;
  line-height: 1.06;
}
.news-brief h1::before,
.news-brief h1::after,
.news-brief h2::before,
.news-brief h2::after {
  content: none !important;
  display: none !important;
}

.brief-hero__dek {
  max-width: 39ch;
  margin: 0;
  color: var(--news-muted);
  font-size: 0.91rem;
  line-height: 1.72;
}

.brief-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  max-width: 430px;
  margin: 22px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--news-border);
}
.brief-hero__stats > div {
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  min-width: 0;
}
.brief-hero__stats dt {
  color: var(--news-faint);
  font-size: 0.66rem;
  line-height: 1.2;
  white-space: nowrap;
}
.brief-hero__stats dd {
  margin: 0;
  color: var(--news-ink);
  font-size: 1.22rem;
  font-weight: 760;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
  line-height: 1;
}

.brief-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 15px;
  margin-top: 18px;
}
.brief-hero__links a {
  color: var(--news-muted);
  font-size: 0.72rem;
  font-weight: 650;
  text-decoration: underline;
  text-decoration-color: var(--news-border-strong);
  text-underline-offset: 4px;
}
.brief-hero__links a:hover,
.brief-hero__links a:focus-visible { color: var(--news-blue); }

.brief-signals__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  min-height: 28px;
  color: var(--news-faint);
}
.brief-signals__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  font: 700 0.68rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.08em;
}
.brief-signals__head > span {
  font: 680 0.66rem/1 var(--vp-font-family-mono);
  font-variant-numeric: tabular-nums;
}
.brief-signals ol {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--news-border);
  list-style: none;
}
.brief-signals li {
  display: grid;
  grid-template-columns: 28px 58px minmax(0, 1fr) minmax(82px, 120px);
  gap: 10px;
  align-items: center;
  min-height: 59px;
  margin: 0;
  border-top: 1px solid var(--news-border);
}
.brief-signals__no,
.brief-signals__level,
.brief-signals__topic {
  color: var(--news-faint);
  font: 680 0.64rem/1.2 var(--vp-font-family-mono);
  letter-spacing: 0.02em;
}
.brief-signals__level.is-hot { color: var(--news-red); }
.brief-signals__level.is-major { color: var(--news-amber); }
.brief-signals li strong {
  min-width: 0;
  color: var(--news-ink);
  font-size: 0.87rem;
  font-weight: 720;
  line-height: 1.35;
}
.brief-signals__topic {
  overflow: hidden;
  color: var(--news-muted);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brief-filter {
  position: relative;
  z-index: 2;
  margin: 0 0 30px;
  padding: 14px;
  border: 1px solid var(--news-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--news-surface-strong) 88%, transparent);
  box-shadow: var(--news-shadow);
}
.brief-filter__top {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto auto;
  gap: 12px 18px;
  align-items: center;
}
.brief-search {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
}
.brief-search > svg {
  position: absolute;
  left: 13px;
  color: var(--news-faint);
  pointer-events: none;
}
.brief-search input {
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 10px 64px 10px 40px;
  border: 1px solid var(--news-border);
  border-radius: 10px;
  outline: none;
  background: var(--news-surface-strong);
  color: var(--news-ink);
  font: inherit;
  font-size: 0.88rem;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.brief-search input:focus {
  border-color: var(--news-blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--news-blue) 14%, transparent);
}
.brief-search input::placeholder { color: var(--news-faint); }
.brief-search__clear {
  position: absolute;
  right: 7px;
  min-height: 32px;
  padding: 0 9px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--news-muted);
  font-size: 0.72rem;
  cursor: pointer;
}
.brief-search__clear:hover { background: var(--vp-c-default-soft); color: var(--news-ink); }

.brief-filter__status {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 118px;
  color: var(--news-faint);
  font: 670 0.66rem/1.2 var(--vp-font-family-mono);
  letter-spacing: 0.05em;
}
.brief-filter__status span { color: var(--news-blue); }
.brief-filter__status output { letter-spacing: 0; }
.brief-filter__reset {
  min-height: 40px;
  padding: 0 13px;
  border: 1px solid var(--news-border);
  border-radius: 9px;
  background: transparent;
  color: var(--news-muted);
  font-size: 0.76rem;
  font-weight: 650;
  cursor: pointer;
}
.brief-filter__reset:hover { border-color: var(--news-blue); color: var(--news-blue); }

.brief-filter__row {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--news-border);
}
.brief-filter__row--compact {
  grid-template-columns: 58px minmax(0, auto) 1fr;
}
.brief-filter__label {
  color: var(--news-faint);
  font: 680 0.65rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.brief-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.brief-topics button {
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--news-muted);
  font-size: 0.75rem;
  font-weight: 650;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;
}
.brief-topics button:hover { color: var(--news-ink); background: var(--vp-c-default-soft); }
.brief-topics button.active {
  border-color: color-mix(in srgb, var(--news-blue) 25%, var(--news-border));
  background: color-mix(in srgb, var(--news-blue) 10%, transparent);
  color: var(--news-blue);
}
.brief-selects {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.brief-selects select {
  min-height: 36px;
  padding: 0 30px 0 10px;
  border: 1px solid var(--news-border);
  border-radius: 8px;
  outline: none;
  background: var(--news-surface-strong);
  color: var(--news-muted);
  font-size: 0.74rem;
  cursor: pointer;
}
.brief-selects select:focus { border-color: var(--news-blue); }
.brief-filter__summary {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  color: var(--news-faint);
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
}

.brief-results__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0 0 18px;
  color: var(--news-faint);
  font: 680 0.66rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.brief-results__head span:last-child { letter-spacing: 0; }

.brief-group { margin: 0 0 42px; }
.brief-group__head {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
  min-height: 48px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--news-border-strong);
}
.brief-group__head > div {
  display: flex;
  gap: 10px;
  align-items: baseline;
}
.brief-group__compact {
  color: var(--news-ink);
  font: 760 1.05rem/1 var(--vp-font-family-mono);
  letter-spacing: -0.04em;
}
.brief-group__weekday {
  color: var(--news-blue);
  font: 680 0.62rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.brief-group__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--news-muted);
  font-size: 0.76rem;
  font-weight: 620;
  line-height: 1;
}
.brief-group__head > span {
  color: var(--news-faint);
  font: 650 0.68rem/1 var(--vp-font-family-mono);
}

.brief-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}
.brief-card {
  --card-accent: var(--news-faint);
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 260px;
  padding: 21px 22px 19px;
  overflow: hidden;
  border: 1px solid var(--news-border);
  border-radius: 13px;
  background: var(--news-surface);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--news-ink) 3%, transparent);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.brief-card.is-hot { --card-accent: var(--news-red); }
.brief-card.is-major { --card-accent: var(--news-amber); }
.brief-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: var(--card-accent);
  opacity: 0.8;
}
.brief-card:hover,
.brief-card:focus-within {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--card-accent) 24%, var(--news-border));
  box-shadow: var(--news-shadow);
}
.brief-card.is-featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  column-gap: clamp(30px, 5vw, 64px);
  min-height: 220px;
  padding: 27px 28px 23px;
}
.brief-card.is-featured .brief-card__meta,
.brief-card.is-featured h3,
.brief-card.is-featured .brief-card__tags { grid-column: 1; }
.brief-card.is-featured .brief-card__summary,
.brief-card.is-featured .brief-card__footer { grid-column: 2; }
.brief-card.is-featured .brief-card__meta { align-self: start; }
.brief-card.is-featured h3 { align-self: start; font-size: clamp(1.22rem, 2vw, 1.52rem); }
.brief-card.is-featured .brief-card__summary { grid-row: 1 / span 2; align-self: start; -webkit-line-clamp: 5; }
.brief-card.is-featured .brief-card__tags { align-self: end; }
.brief-card.is-featured .brief-card__footer { align-self: end; }

.brief-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 10px;
  align-items: center;
  margin-bottom: 13px;
}
.brief-level,
.brief-credibility,
.brief-card__topic {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--news-faint);
  font: 680 0.66rem/1.2 var(--vp-font-family-mono);
}
.brief-level i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.brief-level.is-hot { color: var(--news-red); }
.brief-level.is-major { color: var(--news-amber); }
.brief-credibility.is-verified { color: var(--news-green); }
.brief-credibility.is-todo { color: var(--news-amber); }
.brief-card__topic {
  margin-left: auto;
  overflow: hidden;
  color: var(--news-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brief-card h3 {
  margin: 0 0 12px;
  padding: 0;
  border: 0;
  color: var(--news-ink);
  font-size: 1.04rem;
  font-weight: 750;
  letter-spacing: -0.02em;
  line-height: 1.44;
}
.brief-card__summary {
  display: -webkit-box;
  flex: 1;
  margin: 0 0 15px;
  overflow: hidden;
  color: var(--news-muted);
  font-size: 0.84rem;
  line-height: 1.68;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.brief-card__summary :deep(strong) { color: var(--news-ink); font-weight: 680; }
.brief-card__summary :deep(a) { color: var(--news-blue); text-decoration: underline; text-underline-offset: 3px; }

.brief-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 14px;
}
.brief-card__tags span {
  padding: 3px 7px;
  border: 1px solid var(--news-border);
  border-radius: 999px;
  color: var(--news-faint);
  font-size: 0.63rem;
  font-weight: 650;
  line-height: 1.2;
}

.brief-card__footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px 14px;
  align-items: center;
  padding-top: 13px;
  border-top: 1px solid var(--news-border);
}
.brief-card__sources,
.brief-card__related {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 12px;
  min-width: 0;
}
.brief-card__sources a,
.brief-card__related a {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  color: var(--news-blue);
  font-size: 0.71rem;
  font-weight: 670;
  text-decoration: none;
}
.brief-card__sources a:hover,
.brief-card__sources a:focus-visible,
.brief-card__related a:hover,
.brief-card__related a:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
.brief-card__sources > span {
  color: var(--news-faint);
  font-size: 0.7rem;
}
.brief-card__related { justify-content: flex-end; }
.brief-card__related a { color: var(--news-muted); }
.brief-card__footer small {
  grid-column: 1 / -1;
  color: var(--news-faint);
  font-size: 0.63rem;
  font-variant-numeric: tabular-nums;
}

.brief-load {
  display: flex;
  justify-content: center;
  margin: 8px 0 32px;
  padding-top: 4px;
}
.brief-load button,
.brief-empty button {
  display: inline-flex;
  gap: 14px;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--news-border-strong);
  border-radius: 10px;
  background: var(--news-surface-strong);
  color: var(--news-ink);
  font-size: 0.78rem;
  font-weight: 680;
  cursor: pointer;
}
.brief-load button:hover,
.brief-load button:focus-visible,
.brief-empty button:hover,
.brief-empty button:focus-visible { border-color: var(--news-blue); color: var(--news-blue); }
.brief-load button span { color: var(--news-faint); font-size: 0.68rem; font-weight: 550; }

.brief-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 280px;
  padding: 56px 0;
  border-block: 1px solid var(--news-border);
}
.brief-empty > span {
  color: var(--news-blue);
  font: 680 0.67rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.08em;
}
.brief-empty h2 { margin: 16px 0 7px; padding: 0; border: 0; font-size: 1.3rem; }
.brief-empty p { margin: 0 0 20px; color: var(--news-muted); font-size: 0.86rem; }

button:focus-visible,
a:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid var(--news-blue);
  outline-offset: 2px;
}

@media (max-width: 920px) {
  .brief-hero { grid-template-columns: 1fr; gap: 27px; padding-block: 26px; }
  .brief-hero__dek { max-width: 62ch; }
  .brief-signals ol {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 20px;
  }
  .brief-signals li { grid-template-columns: 26px 56px minmax(0, 1fr); min-height: 54px; }
  .brief-signals__topic { display: none; }
  .brief-filter__row--compact { grid-template-columns: 58px 1fr; }
  .brief-filter__summary { display: none; }
  .brief-card.is-featured {
    grid-column: auto;
    display: flex;
    min-height: 260px;
    padding: 21px 22px 19px;
  }
  .brief-card.is-featured h3 { font-size: 1.04rem; }
  .brief-card.is-featured .brief-card__summary { -webkit-line-clamp: 3; }
}

@media (max-width: 760px) {
  .brief-grid { grid-template-columns: 1fr; }
  .brief-card { min-height: 0; }
}

@media (max-width: 680px) {
  .brief-hero { gap: 22px; margin-top: 0; padding-block: 22px; }
  .news-brief h1 { margin-block: 14px 10px; font-size: 1.9rem; }
  .brief-hero__dek { font-size: 0.86rem; }
  .brief-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 28px;
    max-width: 280px;
    margin-top: 18px;
  }
  .brief-signals ol { grid-template-columns: 1fr; }
  .brief-signals li { grid-template-columns: 26px 62px minmax(0, 1fr); min-height: 51px; }

  .brief-filter {
    position: relative;
    top: auto;
    padding: 10px;
    border-radius: 13px;
  }
  .brief-filter__top { grid-template-columns: minmax(0, 1fr) auto; gap: 9px; }
  .brief-filter__status { min-width: 0; }
  .brief-filter__status span { display: none; }
  .brief-filter__reset { grid-column: 2; grid-row: 1; min-height: 36px; padding-inline: 9px; }
  .brief-search input { min-height: 42px; font-size: 0.83rem; }
  .brief-filter__row {
    display: block;
    margin-top: 10px;
    padding-top: 10px;
  }
  .brief-filter__label { display: block; margin-bottom: 8px; }
  .brief-topics {
    flex-wrap: nowrap;
    margin-inline: -10px;
    padding-inline: 10px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .brief-topics::-webkit-scrollbar { display: none; }
  .brief-topics button { min-height: 38px; }
  .brief-selects {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }
  .brief-selects select { width: 100%; min-width: 0; padding-inline: 7px 20px; font-size: 0.68rem; }

  .brief-group { margin-bottom: 34px; }
  .brief-group__head {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 14px;
    min-height: 44px;
  }
  .brief-group__head h2 { display: none; }
  .brief-card,
  .brief-card.is-featured { padding: 19px 18px 17px; }
  .brief-card__topic { max-width: 42%; }
  .brief-card h3 { font-size: 1rem; }
  .brief-card__footer { grid-template-columns: 1fr; }
  .brief-card__related { justify-content: flex-start; }
}

@media (prefers-reduced-motion: reduce) {
  .brief-card,
  .brief-topics button,
  .brief-search input { transition: none; }
  .brief-card:hover,
  .brief-card:focus-within { transform: none; }
}
</style>
