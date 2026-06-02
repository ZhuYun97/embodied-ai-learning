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
        :class="['company-card', `stage-${company.stage}`]"
        @click="openCompanyDetail(company)"
      >
        <div class="card-header">
          <div class="company-name">
            <h3>{{ company.name }}</h3>
            <span v-if="company.nameEn || company.nameZh" class="name-alt">
              {{ company.nameEn || company.nameZh }}
            </span>
          </div>
          <div class="stage-badge" :data-stage="company.stage">
            {{ getStageLabel(company.stage) }}
          </div>
        </div>

        <div class="card-body">
          <div class="company-info">
            <div v-if="company.founded" class="info-item">
              <span class="info-icon">📅</span>
              <span>{{ company.founded }}年</span>
            </div>
            <div v-if="company.country" class="info-item">
              <span class="info-icon">🌍</span>
              <span>{{ company.country }}</span>
            </div>
          </div>

          <p class="description">{{ company.description }}</p>

          <div v-if="company.products && company.products.length" class="products">
            <span class="products-label">产品:</span>
            <span class="product-list">{{ company.products.join(' · ') }}</span>
          </div>

          <div v-if="company.tags && company.tags.length" class="tags">
            <span
              v-for="tag in company.tags.slice(0, 4)"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="company.funding" class="funding-badge">
            💰 {{ company.funding }}
          </div>
          <a
            v-if="company.website"
            :href="company.website"
            target="_blank"
            class="website-link"
            @click.stop
          >
            访问官网 →
          </a>
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
import { ref, computed, onMounted } from 'vue'
import companiesData from '../../../ecosystem/companies-data.json'

const searchQuery = ref('')
const activeRegion = ref('all')
const activeStages = ref(['public', 'unicorn', 'growth', 'early', 'vertical', 'mature'])

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
    window.open(company.website, '_blank')
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
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 3px rgba(var(--vp-c-brand-rgb), 0.1);
}

.filters, .stage-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn, .stage-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.filter-btn:hover, .stage-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.stage-btn.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* 统计摘要 */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--vp-c-brand-soft) 0%,
    var(--vp-c-bg-soft) 100%);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* 公司卡片网格 */
.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.company-card {
  position: relative;
  padding: 1.5rem;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.company-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  opacity: 0;
  transition: opacity 0.3s;
}

.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.company-card:hover::before {
  opacity: 1;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.company-name h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.name-alt {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
}

.stage-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.stage-badge[data-stage="public"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stage-badge[data-stage="unicorn"] {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stage-badge[data-stage="growth"] {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stage-badge[data-stage="early"] {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #1a1a1a;
}

.stage-badge[data-stage="mature"] {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #1a1a1a;
}

.stage-badge[data-stage="vertical"] {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #1a1a1a;
}

/* 卡片主体 */
.card-body {
  margin-bottom: 1rem;
}

.company-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.info-icon {
  font-size: 1rem;
}

.description {
  margin: 0.75rem 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.products {
  margin: 0.75rem 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.products-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.product-list {
  color: var(--vp-c-text-3);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tag {
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: auto;
}

.funding-badge {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.website-link {
  font-size: 0.875rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.website-link:hover {
  opacity: 0.7;
}

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
@media (max-width: 768px) {
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
  background: var(--vp-c-bg-soft);
}

.dark .company-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}

.dark .search-input {
  background: var(--vp-c-bg-soft);
}

.dark .search-input:focus {
  background: var(--vp-c-bg);
}

/* 档案皮肤适配 */
:global(html.skin-archive) .company-card {
  background: #faf8f5;
  border-color: #e5dfd5;
}

:global(html.skin-archive) .company-card:hover {
  border-color: #b8956a;
  box-shadow: 0 4px 12px rgba(139, 104, 64, 0.15);
}

:global(html.skin-archive) .search-input {
  background: #faf8f5;
  border-color: #e5dfd5;
}

:global(html.skin-archive) .stat-card {
  background: linear-gradient(135deg, #f5f0e8 0%, #faf8f5 100%);
  border-color: #e5dfd5;
}

:global(html.skin-archive.dark) .company-card {
  background: #2a2520;
  border-color: #3d352d;
}

:global(html.skin-archive.dark) .company-card:hover {
  border-color: #b8956a;
}
</style>
