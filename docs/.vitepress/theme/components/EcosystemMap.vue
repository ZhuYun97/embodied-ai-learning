<template>
  <div class="ecosystem-map">
    <!-- 控制栏 -->
    <div class="controls">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索公司名称、产品或技术标签..."
          class="search-input"
        />
      </div>

      <div class="filters">
        <button
          :class="['filter-btn', { active: activeRegion === 'all' }]"
          @click="activeRegion = 'all'"
        >
          全部
        </button>
        <button
          :class="['filter-btn', { active: activeRegion === 'international' }]"
          @click="activeRegion = 'international'"
        >
          国际 ({{ internationalCount }})
        </button>
        <button
          :class="['filter-btn', { active: activeRegion === 'china' }]"
          @click="activeRegion = 'china'"
        >
          国内 ({{ chinaCount }})
        </button>
      </div>

      <div class="stage-filters">
        <button
          v-for="stage in stages"
          :key="stage.id"
          :class="['stage-btn', { active: activeStages.includes(stage.id) }]"
          @click="toggleStage(stage.id)"
        >
          {{ stage.label }}
        </button>
      </div>
    </div>

    <!-- 统计摘要 -->
    <div class="stats-summary">
      <div class="stat-card">
        <div class="stat-number">{{ filteredCompanies.length }}</div>
        <div class="stat-label">公司总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ unicornCount }}</div>
        <div class="stat-label">独角兽/上市</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ totalFunding }}</div>
        <div class="stat-label">已披露融资</div>
      </div>
    </div>

    <!-- 公司卡片网格 -->
    <div class="companies-grid">
      <div
        v-for="company in filteredCompanies"
        :key="company.id"
        :class="['company-card', `stage-${company.stage}`, { clickable: !!company.website }]"
        :title="company.website ? `点击访问 ${company.website}` : ''"
        @click="openCompanyDetail(company)"
      >
        <!-- 跳转指示图标:仅在有 website 时显示 -->
        <svg
          v-if="company.website"
          class="card-go"
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="M14 5h5v5M19 5l-9 9M12 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="card-header">
          <div class="company-logo">
            <img
              v-if="getLogoUrl(company) && !logoErrors[company.id]"
              :src="getLogoUrl(company)"
              :alt="company.name"
              loading="lazy"
              @error="logoErrors[company.id] = true"
            />
            <div
              v-else
              class="logo-fallback"
              :style="{ background: getLogoColor(company.id) }"
            >
              {{ getInitial(company.name) }}
            </div>
          </div>
          <div class="company-name">
            <h3>{{ company.name }}</h3>
            <span v-if="company.nameEn || company.nameZh" class="name-alt">{{ company.nameEn || company.nameZh }}</span>
          </div>
          <div class="stage-badge" :data-stage="company.stage">{{ getStageLabel(company.stage) }}</div>
        </div>

        <p class="description">{{ company.description }}</p>

        <div class="card-meta">
          <span v-if="company.founded" class="meta-item">{{ company.founded }}</span>
          <span v-if="company.country" class="meta-item">{{ company.country }}</span>
          <span v-if="company.funding" class="meta-funding">{{ company.funding }}</span>
        </div>

        <div v-if="company.tags && company.tags.length" class="tags">
          <span v-for="tag in company.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredCompanies.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>未找到匹配的公司</p>
      <button class="reset-btn" @click="resetFilters">重置筛选</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import companiesData from '../../../ecosystem/companies-data.json'

const searchQuery = ref('')
const activeRegion = ref('all')
const activeStages = ref(['public', 'unicorn', 'growth', 'early', 'vertical', 'mature'])

// logo 加载失败回退记录(响应式 map)
const logoErrors = reactive({})

// 从 website 派生 favicon URL;若公司数据里直接给了 logo 字段则优先用它
function getLogoUrl(company) {
  if (company.logo) return company.logo
  if (!company.website) return null
  try {
    const host = new URL(company.website).hostname
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`
  } catch {
    return null
  }
}

// 字母徽章配色:基于 id 哈希取 12 色板
const LOGO_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #a8edea, #fed6e3)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #84fab0, #8fd3f4)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
]
function getLogoColor(id) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return LOGO_COLORS[Math.abs(h) % LOGO_COLORS.length]
}

// 取首字母:中文取首字,英文取前两字母大写
function getInitial(name) {
  if (!name) return '?'
  const trimmed = name.trim()
  // 中文(Unicode 4E00-9FFF)
  if (/[一-鿿]/.test(trimmed[0])) return trimmed[0]
  // 英文取首词前两字母
  const m = trimmed.match(/[A-Za-z]+/g)
  if (m && m[0]) return m[0].slice(0, 2).toUpperCase()
  return trimmed[0].toUpperCase()
}

const stages = [
  { id: 'public', label: '上市' },
  { id: 'unicorn', label: '独角兽' },
  { id: 'growth', label: '成长期' },
  { id: 'early', label: '早期' },
  { id: 'mature', label: '成熟' },
  { id: 'vertical', label: '垂直场景' }
]

const companies = ref(companiesData.companies || [])

const internationalCount = computed(() =>
  companies.value.filter(c => c.region === 'international').length
)

const chinaCount = computed(() =>
  companies.value.filter(c => c.region === 'china').length
)

const unicornCount = computed(() =>
  companies.value.filter(c => ['public', 'unicorn'].includes(c.stage)).length
)

const totalFunding = computed(() => {
  const total = companies.value.reduce((sum, c) => {
    return sum + (c.fundingAmount || 0)
  }, 0)
  if (total >= 1e9) return `$${(total / 1e9).toFixed(1)}B`
  if (total >= 1e6) return `$${(total / 1e6).toFixed(0)}M`
  return `$${total}`
})

const filteredCompanies = computed(() => {
  let result = companies.value

  // 地区筛选
  if (activeRegion.value !== 'all') {
    result = result.filter(c => c.region === activeRegion.value)
  }

  // 阶段筛选
  result = result.filter(c => activeStages.value.includes(c.stage))

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => {
      const searchText = [
        c.name,
        c.nameEn,
        c.nameZh,
        c.description,
        ...(c.products || []),
        ...(c.tags || [])
      ].filter(Boolean).join(' ').toLowerCase()

      return searchText.includes(query)
    })
  }

  // 排序：上市/独角兽 > 融资额降序 > 成立年份降序
  return result.sort((a, b) => {
    const stageOrder = { public: 0, unicorn: 1, mature: 2, growth: 3, early: 4, vertical: 5 }
    if (stageOrder[a.stage] !== stageOrder[b.stage]) {
      return stageOrder[a.stage] - stageOrder[b.stage]
    }
    if ((b.fundingAmount || 0) !== (a.fundingAmount || 0)) {
      return (b.fundingAmount || 0) - (a.fundingAmount || 0)
    }
    return (b.founded || 0) - (a.founded || 0)
  })
})

function toggleStage(stageId) {
  const index = activeStages.value.indexOf(stageId)
  if (index > -1) {
    activeStages.value.splice(index, 1)
  } else {
    activeStages.value.push(stageId)
  }
}

function getStageLabel(stage) {
  const labels = {
    public: '上市',
    unicorn: '独角兽',
    growth: '成长期',
    early: '早期',
    mature: '成熟',
    vertical: '垂直'
  }
  return labels[stage] || stage
}

function resetFilters() {
  searchQuery.value = ''
  activeRegion.value = 'all'
  activeStages.value = ['public', 'unicorn', 'growth', 'early', 'vertical', 'mature']
}

function openCompanyDetail(company) {
  if (company.website) {
    window.open(company.website, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.ecosystem-map {
  width: 100%;
  padding: 2rem 0;
}

/* 控制栏 */
.controls {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-size: 0.95rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: #22d3ee;
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.16);
}

.filters, .stage-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn, .stage-btn {
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background-color 0.18s, box-shadow 0.18s;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.78rem;
  font-weight: 500;
}

.filter-btn:hover, .stage-btn:hover {
  border-color: #22d3ee;
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: linear-gradient(120deg, #2563eb, #22d3ee);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4), 0 4px 14px rgba(37, 99, 235, 0.22);
}
.dark .filter-btn.active {
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6), 0 0 18px rgba(56, 189, 248, 0.3);
}

.stage-btn.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
.dark .stage-btn.active { box-shadow: 0 0 12px rgba(56, 189, 248, 0.18); }

/* 统计摘要 —— 玻璃 HUD 面板 + mono 渐变数字(对齐首页 hero 读出条 / 图谱)*/
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.75rem;
}

.stat-card {
  position: relative;
  overflow: hidden;
  padding: 1.15rem 1.4rem;
  border-radius: 12px;
  background: var(--tech-card-bg, var(--vp-c-bg-soft));
  border: 1px solid var(--vp-c-divider);
  text-align: left;
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2563eb, #22d3ee, #67e8f9);
  opacity: 0.8;
}
.dark .stat-card { box-shadow: inset 0 0 24px rgba(34, 211, 238, 0.05); }

.stat-number {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 1.9rem;
  font-weight: 750;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  margin-bottom: 0.45rem;
  background: linear-gradient(120deg, #2563eb 0%, #22d3ee 55%, #67e8f9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  width: fit-content;
}
.dark .stat-number { filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.28)); }

.stat-label {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
}

/* 公司卡片网格 */
.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.company-card {
  position: relative;
  padding: 0.875rem 1rem 0.875rem;
  border-radius: 10px;
  background: var(--tech-card-bg, var(--vp-c-bg-soft));
  border: 1px solid var(--vp-c-divider);
  cursor: default;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  overflow: hidden;
  backdrop-filter: blur(8px) saturate(1.15);
  -webkit-backdrop-filter: blur(8px) saturate(1.15);
}
.company-card.clickable { cursor: pointer; }

/* 跳转指示图标:右下角,默认半透明,hover 时高亮(避开右上角阶段徽章) */
.card-go {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--vp-c-text-3);
  opacity: 0.4;
  pointer-events: none;
  transition: opacity 0.2s, color 0.2s, transform 0.2s;
}
.company-card.clickable:hover .card-go {
  opacity: 1;
  color: var(--vp-c-brand-1);
  transform: translate(2px, -2px);
}

.company-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2563eb, #22d3ee, #67e8f9);
  opacity: 0;
  transition: opacity 0.2s;
}

.company-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.45), 0 14px 40px rgba(37, 99, 235, 0.16);
  border-color: transparent;
}

.company-card:hover::before {
  opacity: 0.85;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

/* logo 容器:圆角方形 + favicon/字母徽章 */
.company-logo {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 7px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
}
.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
}
.logo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}

.company-name {
  flex: 1;
  min-width: 0;
}
.company-name h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.3;
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-alt {
  display: block;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin-top: 0.125rem;
  font-family: var(--vp-font-family-mono, monospace);
}

.stage-badge {
  padding: 0.14rem 0.5rem;
  border-radius: 5px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.64rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

/* 阶段色:统一为冷调珠宝色板(呼应图谱集群色),amber 作唯一暖色强调;均保证对比度 */
.stage-badge[data-stage="public"]   { background: #2563eb; color: #fff; }
.stage-badge[data-stage="unicorn"]  { background: #a855f7; color: #fff; }
.stage-badge[data-stage="mature"]   { background: #0d9488; color: #fff; }
.stage-badge[data-stage="growth"]   { background: #0284c7; color: #fff; }
.stage-badge[data-stage="early"]    { background: #f59e0b; color: #3a2600; }
.stage-badge[data-stage="vertical"] { background: #64748b; color: #fff; }

/* 描述:限制 2 行 */
.description {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 紧凑 meta:成立年/国家/融资 同行 */
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 0.625rem;
  margin-bottom: 0.5rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono, monospace);
}

.meta-item {
  display: inline-flex;
  align-items: center;
}

.meta-funding {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

/* 标签 */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  padding: 0.14rem 0.45rem;
  border-radius: 5px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.64rem;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  letter-spacing: 0;
}
.dark .tag { background: rgba(56, 189, 248, 0.06); border-color: rgba(56, 189, 248, 0.16); }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.reset-btn {
  margin-top: 1rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

/* 响应式 */
@media (max-width: 480px) {
  .companies-grid {
    grid-template-columns: 1fr;
  }

  .stats-summary {
    grid-template-columns: 1fr;
  }

  .card-header {
    flex-direction: column;
  }

  .stage-badge {
    align-self: flex-start;
  }
}

/* 暗色模式 */
.dark .company-card {
  background: var(--tech-card-bg, var(--vp-c-bg-soft));
}

.dark .company-card:hover {
  border-color: transparent;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6), 0 0 26px rgba(56, 189, 248, 0.2), 0 16px 44px rgba(37, 99, 235, 0.26);
}

.dark .search-input {
  background: var(--vp-c-bg-soft);
}

.dark .search-input:focus {
  background: var(--vp-c-bg);
}

</style>
