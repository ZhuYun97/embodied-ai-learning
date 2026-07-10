<script setup>
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { data as leaderboardData } from '../../data/leaderboard.data.mjs'

const SNAPSHOT_DATE = '2026-07-01'
const benchmarkOrder = ['SimplerEnv', 'LIBERO', 'CALVIN', 'RoboCasa']

const benchmarkMeta = {
  SimplerEnv: {
    index: '01',
    subtitle: 'REAL-TO-SIM',
    metric: '任务成功率',
    scale: '0–100%',
    defaultSplit: 'Google Robot',
    description: '把真实机器人策略放进仿真环境，观察视觉与动力学迁移后的任务成功率。',
    caveat: 'Google Robot 与 WidowX/Bridge 是不同机器人、任务族与数据分布，必须分开阅读。'
  },
  LIBERO: {
    index: '02',
    subtitle: 'MULTI-SUITE',
    metric: '平均成功率',
    scale: '0–100%',
    defaultSplit: '平均(5套件)',
    description: '衡量语言条件操作在空间、物体、目标与长程任务套件上的平均表现。',
    caveat: '4 套件、5 套件与套件数待核记录已拆开；95% 以上也不代表扰动下仍有泛化能力。'
  },
  CALVIN: {
    index: '03',
    subtitle: 'LONG-HORIZON',
    metric: '平均完成长度',
    scale: '0–5',
    defaultSplit: 'ABC→D 零样本',
    description: '连续执行最多五条语言指令，报告平均能完成多少步，越高越好。',
    caveat: '标准多视角口径与单图、移除 proprio expert 的第三方改口径重评已分开。'
  },
  RoboCasa: {
    index: '04',
    subtitle: 'KITCHEN-300',
    metric: '任务成功率',
    scale: '0–100%',
    defaultSplit: '官方 multitask-300',
    description: '在 300 个厨房任务的维护方统一评测中，观察多任务策略的整体成功率。',
    caveat: '仅 4 个模型/变体，属于维护方统一口径的小样本证据，不应外推为全领域总榜。'
  }
}

const statusMeta = {
  sourced: { label: '有出处', tone: 'source', description: '已记录论文、项目页或主报告出处' },
  self_reported: { label: '作者自评', tone: 'self', description: '由提出方或厂商报告，未独立复现' },
  verified: { label: '已核对', tone: 'verified', description: '已对照原表或维护方统一评测核查' },
  unverified: { label: '待核', tone: 'pending', description: '来源或口径仍需补充确认' }
}

const selectedBenchmark = ref('SimplerEnv')
const selectedSplit = ref(benchmarkMeta.SimplerEnv.defaultSplit)
const selectedStatus = ref('all')
const searchQuery = ref('')
const sortBy = ref('score')

const scoreBounds = (entry) => {
  if (typeof entry.score === 'number') return [entry.score, entry.score]
  const values = String(entry.score).match(/\d+(?:\.\d+)?/g)?.map(Number) || [0]
  return [values[0] || 0, values[1] || values[0] || 0]
}

const scoreNumber = (entry) => scoreBounds(entry)[0]
const scoreCeiling = (entry) => entry.unit === 'avg-len' ? 5 : 100
const scorePercent = (entry) => Math.max(0, Math.min(100, scoreNumber(entry) / scoreCeiling(entry) * 100))
const scoreEndPercent = (entry) => {
  const [, end] = scoreBounds(entry)
  return Math.max(0, Math.min(100, end / scoreCeiling(entry) * 100))
}
const hasRange = (entry) => scoreBounds(entry)[1] !== scoreBounds(entry)[0]

const availableSplits = computed(() => {
  const values = leaderboardData.entries
    .filter(entry => entry.benchmark === selectedBenchmark.value)
    .map(entry => entry.split)
  return [...new Set(values)]
})

const benchmarkRows = computed(() => benchmarkOrder.map(name => {
  const entries = leaderboardData.entries.filter(entry => entry.benchmark === name)
  return {
    name,
    meta: benchmarkMeta[name],
    records: entries.length,
    models: new Set(entries.map(entry => entry.model)).size,
    splits: new Set(entries.map(entry => entry.split)).size
  }
}))

const allSlices = computed(() =>
  new Set(leaderboardData.entries.map(entry => entry.benchmark + '|' + entry.split)).size
)

const activeMeta = computed(() => benchmarkMeta[selectedBenchmark.value])

const activeGroupEntries = computed(() =>
  leaderboardData.entries.filter(entry =>
    entry.benchmark === selectedBenchmark.value &&
    entry.split === selectedSplit.value
  )
)

const filteredEntries = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return activeGroupEntries.value.filter(entry => {
    if (selectedStatus.value !== 'all' && entry.credibility !== selectedStatus.value) return false
    if (!query) return true
    return [entry.model, entry.source, entry.note, entry.protocol]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
})

const rankedEntries = computed(() =>
  filteredEntries.value.slice().sort((a, b) => scoreNumber(b) - scoreNumber(a))
)

const displayEntries = computed(() => {
  const entries = filteredEntries.value.slice()
  if (sortBy.value === 'score') return entries.sort((a, b) => scoreNumber(b) - scoreNumber(a))
  if (sortBy.value === 'year') {
    return entries.sort((a, b) => parseFloat(b.year || '0') - parseFloat(a.year || '0'))
  }
  return entries.sort((a, b) => a.model.localeCompare(b.model))
})

const topEntries = computed(() => rankedEntries.value.slice(0, 5))
const rankFor = (entry) => rankedEntries.value.findIndex(item => item.id === entry.id) + 1

const activeSummary = computed(() => {
  const entries = activeGroupEntries.value
  const scores = entries.map(scoreNumber)
  const latest = entries
    .slice()
    .sort((a, b) => parseFloat(b.year || '0') - parseFloat(a.year || '0'))[0]
  return {
    records: entries.length,
    statusCount: entries.filter(entry => entry.credibility === 'verified').length,
    latestYear: latest?.year || '—',
    low: scores.length ? Math.min(...scores) : 0,
    high: scores.length ? Math.max(...scores) : 0,
    unit: entries[0]?.unit || '',
    ranges: entries.filter(hasRange).length
  }
})

const comparisonQuality = computed(() => {
  if (selectedBenchmark.value === 'RoboCasa') {
    return {
      tone: 'strong',
      label: '统一口径',
      text: '由基准维护方在同一 multitask-300 设置下统一评测，但样本仅 4 条。'
    }
  }
  if (
    selectedBenchmark.value === 'CALVIN' &&
    selectedSplit.value === 'ABC→D 改口径重评'
  ) {
    return {
      tone: 'weak',
      label: '弱可比参考',
      text: '单图输入并移除 proprio expert，只用于记录，不参与标准 CALVIN 榜首判断。'
    }
  }
  if (
    selectedBenchmark.value === 'LIBERO' &&
    selectedSplit.value === '平均(套件数待核)'
  ) {
    return {
      tone: 'weak',
      label: '口径待核',
      text: '套件数量或输入设置尚未结构化确认，排序仅用于查阅，不代表严格可比排名。'
    }
  }
  return {
    tone: 'conditional',
    label: '条件可比',
    text: '已锁定同一 split；仍需结合输入视角、任务子集、自评属性和备注判断。'
  }
})

const crossBenchmarkModels = computed(() => {
  const grouped = new Map()
  for (const entry of leaderboardData.entries) {
    if (!grouped.has(entry.model)) grouped.set(entry.model, new Set())
    grouped.get(entry.model).add(entry.benchmark)
  }
  return Array.from(grouped.entries())
    .filter(([, benchmarks]) => benchmarks.size > 1)
    .map(([model, benchmarks]) => ({ model, benchmarks: Array.from(benchmarks) }))
})

const hasActiveFilter = computed(() =>
  selectedSplit.value !== activeMeta.value.defaultSplit ||
  selectedStatus.value !== 'all' ||
  searchQuery.value.trim() !== '' ||
  sortBy.value !== 'score'
)

const selectBenchmark = (name) => {
  selectedBenchmark.value = name
  selectedSplit.value = benchmarkMeta[name].defaultSplit
  selectedStatus.value = 'all'
  searchQuery.value = ''
  sortBy.value = 'score'
}

const resetFilters = () => {
  selectedSplit.value = activeMeta.value.defaultSplit
  selectedStatus.value = 'all'
  searchQuery.value = ''
  sortBy.value = 'score'
}

const statusLabel = (status) => statusMeta[status]?.label || status

const modelHref = (entry) => {
  if (!entry.modelSlug) return null
  const overrides = {
    'gr-1': '/wam/papers/gr-1',
    'pi0-5': '/vla/papers/pi05',
    'rt1-x': null,
    vote: null
  }
  if (Object.prototype.hasOwnProperty.call(overrides, entry.modelSlug)) {
    return overrides[entry.modelSlug] ? withBase(overrides[entry.modelSlug]) : null
  }
  return withBase('/vla/papers/' + entry.modelSlug)
}

const sourceHref = (entry) =>
  withBase('/vla/papers/benchmarks' + (entry.sourceSection || ''))

const formatSnapshot = (date) => date.replaceAll('-', '.')
const formatSpan = (summary) =>
  summary.low.toFixed(summary.unit === 'avg-len' ? 2 : 1) +
  '–' +
  summary.high.toFixed(summary.unit === 'avg-len' ? 2 : 1)
</script>

<template>
  <div class="leaderboard-shell">
    <header class="lb-hero">
      <div class="lb-hero__lead">
        <div class="lb-hero__meta">
          <span>EVALUATION INDEX</span>
          <time :datetime="SNAPSHOT_DATE">SNAPSHOT {{ formatSnapshot(SNAPSHOT_DATE) }}</time>
        </div>
        <h1>VLA 统一基准榜</h1>
        <p class="lb-hero__dek">
          把分散在论文与基准报告里的成绩收拢为可核对的证据账本。这里只做同口径排序，不制造跨基准“总冠军”。
        </p>

        <dl class="lb-hero__stats" aria-label="排行榜数据概览">
          <div><dt>成绩记录</dt><dd>{{ leaderboardData.stats.total }}</dd></div>
          <div><dt>模型 / 变体</dt><dd>{{ leaderboardData.stats.models }}</dd></div>
          <div><dt>口径组</dt><dd>{{ allSlices }}</dd></div>
          <div><dt>已核对</dt><dd>{{ leaderboardData.stats.credibilityCount.verified }}</dd></div>
        </dl>

        <nav class="lb-hero__links" aria-label="排行榜相关入口">
          <a :href="withBase('/vla/papers/benchmarks')">评测基准全景</a>
          <a :href="withBase('/vla/papers/models-spec')">模型规格对比</a>
          <a :href="withBase('/vla/papers/robots')">实验机器人本体</a>
        </nav>
      </div>

      <section class="coverage-map" aria-labelledby="coverage-map-title">
        <div class="coverage-map__head">
          <h2 id="coverage-map-title">覆盖地图</h2>
          <span>04 BENCHMARKS</span>
        </div>
        <ol>
          <li v-for="row in benchmarkRows" :key="row.name">
            <span class="coverage-map__index">{{ row.meta.index }}</span>
            <div>
              <strong>{{ row.name }}</strong>
              <span>{{ row.meta.subtitle }}</span>
            </div>
            <dl>
              <div><dt>记录</dt><dd>{{ row.records }}</dd></div>
              <div><dt>口径</dt><dd>{{ row.splits }}</dd></div>
              <div><dt>指标</dt><dd>{{ row.meta.scale }}</dd></div>
            </dl>
          </li>
        </ol>
      </section>
    </header>

    <aside class="comparison-rule" aria-label="读榜规则">
      <span class="comparison-rule__index">RULE 01</span>
      <strong>先锁定 split 与 protocol，再看数字。</strong>
      <p>同一个模型换机器人、任务套件、输入视角或评测设置后，成绩可能相差数十个百分点。</p>
      <a :href="withBase('/vla/papers/benchmarks#十、读-vla-成绩表的七条铁律')">阅读七条铁律</a>
    </aside>

    <section id="交互榜" class="lb-explorer" aria-label="交互基准榜">
      <div class="benchmark-tabs" role="group" aria-label="选择评测基准">
        <button
          v-for="name in benchmarkOrder"
          :key="name"
          type="button"
          :class="{ active: selectedBenchmark === name }"
          :aria-pressed="selectedBenchmark === name"
          @click="selectBenchmark(name)"
        >
          <span>{{ benchmarkMeta[name].index }}</span>
          {{ name }}
          <small>{{ leaderboardData.entries.filter(entry => entry.benchmark === name).length }}</small>
        </button>
      </div>

      <section class="active-benchmark" :aria-labelledby="'active-' + selectedBenchmark">
        <div class="active-benchmark__copy">
          <span>{{ activeMeta.subtitle }} · {{ activeMeta.metric }}</span>
          <h2 :id="'active-' + selectedBenchmark">{{ selectedBenchmark }}</h2>
          <p>{{ activeMeta.description }}</p>
        </div>
        <dl class="active-benchmark__facts">
          <div><dt>当前口径</dt><dd>{{ selectedSplit }}</dd></div>
          <div><dt>记录数</dt><dd>{{ activeSummary.records }}</dd></div>
          <div><dt>记录跨度</dt><dd>{{ formatSpan(activeSummary) }} {{ activeSummary.unit }}</dd></div>
          <div><dt>最新版本</dt><dd>{{ activeSummary.latestYear }}</dd></div>
        </dl>
      </section>

      <section class="lb-controls" aria-label="筛选排行榜">
        <div class="lb-controls__top">
          <label class="lb-search">
            <span class="sr-only">搜索模型、来源或备注</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8"/>
              <path d="m16 16 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="搜索模型、来源或备注…"
              autocomplete="off"
            />
          </label>

          <label class="status-select">
            <span>记录状态</span>
            <select v-model="selectedStatus" aria-label="按记录状态筛选">
              <option value="all">全部状态</option>
              <option v-for="(meta, key) in statusMeta" :key="key" :value="key">{{ meta.label }}</option>
            </select>
          </label>

          <div class="lb-controls__count">
            <span>RESULT SET</span>
            <output aria-live="polite">{{ filteredEntries.length }} / {{ activeGroupEntries.length }} 条</output>
          </div>

          <button
            v-if="hasActiveFilter"
            type="button"
            class="reset-button"
            @click="resetFilters"
          >清除筛选</button>
        </div>

        <div class="lb-controls__row">
          <span class="lb-controls__label">比较口径</span>
          <div class="split-tabs" role="group" aria-label="选择比较口径">
            <button
              v-for="split in availableSplits"
              :key="split"
              type="button"
              :class="{ active: selectedSplit === split }"
              :aria-pressed="selectedSplit === split"
              @click="selectedSplit = split"
            >{{ split }}</button>
          </div>
        </div>

        <div class="lb-controls__row lb-controls__row--sort">
          <span class="lb-controls__label">排序</span>
          <div class="sort-tabs" role="group" aria-label="排行榜排序方式">
            <button type="button" :aria-pressed="sortBy === 'score'" :class="{ active: sortBy === 'score' }" @click="sortBy = 'score'">成绩高到低</button>
            <button type="button" :aria-pressed="sortBy === 'year'" :class="{ active: sortBy === 'year' }" @click="sortBy = 'year'">版本时间</button>
            <button type="button" :aria-pressed="sortBy === 'model'" :class="{ active: sortBy === 'model' }" @click="sortBy = 'model'">模型名称</button>
          </div>
          <span :class="['quality-badge', 'is-' + comparisonQuality.tone]">{{ comparisonQuality.label }}</span>
        </div>
      </section>

      <section class="insight-grid" aria-label="当前口径洞察">
        <article class="score-distribution">
          <header>
            <div>
              <span>CURRENT SLICE</span>
              <h3>记录值分布</h3>
            </div>
            <small>{{ selectedSplit }} · {{ activeMeta.scale }}</small>
          </header>

          <ol v-if="topEntries.length">
            <li v-for="(entry, index) in topEntries" :key="entry.id">
              <span class="score-distribution__rank">{{ String(index + 1).padStart(2, '0') }}</span>
              <strong>{{ entry.model }}</strong>
              <span :class="['record-status', 'is-' + statusMeta[entry.credibility].tone]">
                {{ statusLabel(entry.credibility) }}
              </span>
              <span class="score-distribution__value">{{ entry.score }} <small>{{ entry.unit }}</small></span>
              <span class="score-track" aria-hidden="true">
                <i :style="{ width: scorePercent(entry) + '%' }"></i>
                <b
                  v-if="hasRange(entry)"
                  :style="{
                    left: scorePercent(entry) + '%',
                    width: (scoreEndPercent(entry) - scorePercent(entry)) + '%'
                  }"
                ></b>
              </span>
            </li>
          </ol>
          <p v-else class="insight-empty">当前筛选下没有可显示的记录。</p>
        </article>

        <article class="interpretation-card">
          <div class="interpretation-card__status">
            <span :class="['quality-badge', 'is-' + comparisonQuality.tone]">{{ comparisonQuality.label }}</span>
            <small>{{ activeSummary.ranges ? activeSummary.ranges + ' 条范围值' : '均为点估计' }}</small>
          </div>
          <h3>为什么不做跨基准总分？</h3>
          <p>{{ comparisonQuality.text }}</p>
          <p>{{ activeMeta.caveat }}</p>

          <div class="cross-coverage">
            <span>CROSS-BENCHMARK COVERAGE</span>
            <p>仅 {{ crossBenchmarkModels.length }} 个同名模型出现在两个基准，数据不足以支撑“全能冠军”。</p>
            <ul>
              <li v-for="item in crossBenchmarkModels" :key="item.model">
                <strong>{{ item.model }}</strong>
                <span>{{ item.benchmarks.join(' / ') }}</span>
              </li>
            </ul>
          </div>
        </article>
      </section>

      <section class="ranking-section" aria-labelledby="ranking-title">
        <header class="ranking-section__head">
          <div>
            <span>RANKED EVIDENCE</span>
            <h3 id="ranking-title">{{ selectedBenchmark }} · {{ selectedSplit }}</h3>
          </div>
          <p>序号始终按记录值下界计算；切换“版本时间 / 模型名称”只改变展示顺序。</p>
        </header>

        <div class="rank-labels" aria-hidden="true">
          <span>#</span>
          <span>模型 / 出处</span>
          <span>记录状态</span>
          <span>模型版本</span>
          <span>记录值</span>
        </div>

        <ol v-if="displayEntries.length" class="rank-list">
          <li
            v-for="entry in displayEntries"
            :key="entry.id"
            class="rank-entry"
            :class="{ 'is-top': rankFor(entry) <= 3 }"
          >
            <span class="rank-entry__number">{{ String(rankFor(entry)).padStart(2, '0') }}</span>

            <div class="rank-entry__model">
              <a v-if="modelHref(entry)" :href="modelHref(entry)">{{ entry.model }}</a>
              <strong v-else>{{ entry.model }}</strong>
              <span>{{ entry.protocol || activeMeta.metric }} · {{ entry.source }}</span>
            </div>

            <span :class="['record-status', 'is-' + statusMeta[entry.credibility].tone]">
              {{ statusLabel(entry.credibility) }}
            </span>

            <time class="rank-entry__year">{{ entry.year || '—' }}</time>

            <div class="rank-entry__score">
              <span><strong>{{ entry.score }}</strong><small>{{ entry.unit }}</small></span>
              <span class="score-track" aria-hidden="true">
                <i :style="{ width: scorePercent(entry) + '%' }"></i>
                <b
                  v-if="hasRange(entry)"
                  :style="{
                    left: scorePercent(entry) + '%',
                    width: (scoreEndPercent(entry) - scorePercent(entry)) + '%'
                  }"
                ></b>
              </span>
            </div>

            <details class="rank-entry__evidence">
              <summary>来源与口径备注</summary>
              <div>
                <p><strong>记录来源</strong>{{ entry.source }}</p>
                <p v-if="entry.note"><strong>特殊说明</strong>{{ entry.note }}</p>
                <p v-else><strong>特殊说明</strong>当前数据没有额外口径备注。</p>
                <a :href="sourceHref(entry)">回到 benchmarks.md 对应章节</a>
              </div>
            </details>
          </li>
        </ol>

        <div v-else class="rank-empty">
          <span>NO MATCHES</span>
          <h3>没有匹配的成绩记录</h3>
          <p>换一个关键词或恢复当前口径的全部记录。</p>
          <button type="button" @click="resetFilters">清除筛选</button>
        </div>

        <footer class="ranking-section__footer">
          <span>显示 {{ displayEntries.length }} 条</span>
          <span>数据快照 {{ SNAPSHOT_DATE }}</span>
          <span>总库 {{ leaderboardData.entries.length }} 条</span>
        </footer>
      </section>
    </section>

    <section class="method-section" aria-labelledby="method-title">
      <header class="method-section__head">
        <span>METHODOLOGY</span>
        <h2 id="method-title">读榜方法与边界</h2>
        <p>排行榜是检索入口，不是替代原论文的最终结论。</p>
      </header>

      <div class="method-grid">
        <article>
          <span>01 · COMPARABILITY</span>
          <h3>只在同一口径内排序</h3>
          <p>页面默认锁定一个 split。机器人、任务集、视角或输入设置改变后，记录会进入新的口径组。</p>
        </article>
        <article>
          <span>02 · RANGE VALUES</span>
          <h3>范围值按下界排序</h3>
          <p>例如 95.3–97.1 按 95.3 排序，图中用半透明区间补出上界，不把范围伪装成点估计。</p>
        </article>
        <article>
          <span>03 · RECORD STATUS</span>
          <h3>状态不等于独立复现</h3>
          <p>“已核对”表示对照原表或维护方结果完成核查；“有出处”也可能仍是作者论文中的自报结果。</p>
        </article>
      </div>

      <details id="未纳入清单" class="exclusion-notes">
        <summary>
          <span>
            <small>EXCLUSIONS · 收录边界</small>
            <strong>查看暂未纳入的口径与基准</strong>
          </span>
          <span>{{ benchmarkOrder.length }} 组说明</span>
          <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </summary>
        <div class="exclusion-notes__body">
          <article>
            <h3>SimplerEnv</h3>
            <p>Variant Aggregation 样本过少，第三方复现又明确不等同官方数，暂留在评测全景中讨论。</p>
          </article>
          <article>
            <h3>CALVIN</h3>
            <p>ABCD→D 与 D→D 难度显著不同；标准样本不足时不与 ABC→D 零样本记录混排。</p>
          </article>
          <article>
            <h3>RoboCasa</h3>
            <p>30-demo、24-atomic 与 Isaac-GR00T 25-task 都是不同任务集，仅保留维护方 multitask-300。</p>
          </article>
          <article>
            <h3>其他维度</h3>
            <p>真机、双臂、人形、VQA 与 VLN 的指标轴不同，暂不生成跨域综合分或雷达图。</p>
          </article>
        </div>
      </details>

      <nav class="related-reading" aria-label="关联阅读">
        <a :href="withBase('/vla/papers/benchmarks')">
          <span>01</span><strong>评测基准全景</strong><small>方法论与口径演进</small>
        </a>
        <a :href="withBase('/vla/papers/models-spec')">
          <span>02</span><strong>全模型规格对比</strong><small>架构、动作与许可</small>
        </a>
        <a :href="withBase('/vla/papers/robots')">
          <span>03</span><strong>实验机器人本体</strong><small>硬件平台与自由度</small>
        </a>
        <a :href="withBase('/vla/papers/training-pipeline')">
          <span>04</span><strong>模型训练全流程</strong><small>数据、训练与评测闭环</small>
        </a>
      </nav>
    </section>
  </div>
</template>

<style scoped>
.leaderboard-shell {
  --lb-ink: var(--vp-c-text-1);
  --lb-muted: var(--vp-c-text-2);
  --lb-faint: var(--vp-c-text-3);
  --lb-page: var(--vp-c-bg-soft);
  --lb-surface: color-mix(in srgb, var(--vp-c-bg) 94%, var(--vp-c-brand-soft));
  --lb-surface-strong: var(--vp-c-bg);
  --lb-border: var(--vp-c-divider);
  --lb-border-strong: color-mix(in srgb, var(--vp-c-text-1) 22%, transparent);
  --lb-blue: var(--vp-c-brand-1);
  --lb-green: var(--vp-c-success-1, #247552);
  --lb-amber: var(--vp-c-warning-1, #9b6716);
  --lb-red: var(--vp-c-danger-1, #b74242);
  --lb-shadow: 0 1px 1px rgba(10, 15, 25, 0.04), 0 18px 42px rgba(10, 15, 25, 0.07);
  position: relative;
  color: var(--lb-ink);
}

:global(.leaderboard-page) { overflow-x: clip; }
:global(.leaderboard-page .VPDoc) {
  overflow-x: clip;
  padding-bottom: 64px;
  background:
    radial-gradient(920px 460px at 12% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent 68%),
    radial-gradient(760px 420px at 94% 3%, color-mix(in srgb, var(--vp-c-success-1, #247552) 5%, transparent), transparent 70%),
    var(--vp-c-bg-soft);
}
:global(.leaderboard-page .VPDoc:not(.has-sidebar) > .container) { max-width: 1440px !important; }
:global(.leaderboard-page .VPDoc:not(.has-sidebar) > .container > .content) { max-width: 100% !important; }
:global(.leaderboard-page .content-container) { max-width: 1180px; }

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

.leaderboard-shell h1::before,
.leaderboard-shell h1::after,
.leaderboard-shell h2::before,
.leaderboard-shell h2::after,
.leaderboard-shell h3::before,
.leaderboard-shell h3::after {
  content: none !important;
  display: none !important;
}

.lb-hero {
  display: grid;
  grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1.22fr);
  gap: clamp(36px, 5vw, 72px);
  align-items: start;
  margin: 10px 0 24px;
  padding: 30px 0 28px;
  border-block: 1px solid var(--lb-border);
}
.lb-hero__lead,
.coverage-map { min-width: 0; }
.lb-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  align-items: center;
  color: var(--lb-faint);
  font: 680 0.68rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.07em;
}
.lb-hero__meta span { color: var(--lb-blue); }
.lb-hero__meta time::before {
  content: '/';
  margin-right: 9px;
  color: var(--lb-border-strong);
}
.leaderboard-shell h1 {
  margin: 17px 0 11px;
  padding: 0;
  border: 0;
  color: var(--lb-ink);
  font-size: clamp(2rem, 3vw, 2.7rem);
  font-weight: 790;
  letter-spacing: -0.05em;
  line-height: 1.06;
}
.lb-hero__dek {
  max-width: 39ch;
  margin: 0;
  color: var(--lb-muted);
  font-size: 0.91rem;
  line-height: 1.72;
}
.lb-hero__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 15px;
  max-width: 440px;
  margin: 22px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--lb-border);
}
.lb-hero__stats > div {
  display: flex;
  flex-direction: column-reverse;
  gap: 5px;
  min-width: 0;
}
.lb-hero__stats dt {
  color: var(--lb-faint);
  font-size: 0.66rem;
  line-height: 1.2;
  white-space: nowrap;
}
.lb-hero__stats dd {
  margin: 0;
  color: var(--lb-ink);
  font-size: 1.22rem;
  font-weight: 760;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
  line-height: 1;
}
.lb-hero__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 15px;
  margin-top: 18px;
}
.lb-hero__links a {
  color: var(--lb-muted);
  font-size: 0.72rem;
  font-weight: 650;
  text-decoration: underline;
  text-decoration-color: var(--lb-border-strong);
  text-underline-offset: 4px;
}
.lb-hero__links a:hover,
.lb-hero__links a:focus-visible { color: var(--lb-blue); }

.coverage-map__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  min-height: 28px;
  color: var(--lb-faint);
}
.coverage-map__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  color: inherit;
  font: 700 0.68rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.08em;
}
.coverage-map__head > span {
  font: 680 0.64rem/1 var(--vp-font-family-mono);
}
.coverage-map ol {
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--lb-border);
  list-style: none;
}
.coverage-map li {
  display: grid;
  grid-template-columns: 32px minmax(140px, 1fr) minmax(240px, 0.9fr);
  gap: 12px;
  align-items: center;
  min-height: 67px;
  margin: 0;
  border-top: 1px solid var(--lb-border);
}
.coverage-map__index {
  color: var(--lb-faint);
  font: 680 0.64rem/1 var(--vp-font-family-mono);
}
.coverage-map li > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}
.coverage-map li strong {
  color: var(--lb-ink);
  font-size: 0.88rem;
  font-weight: 730;
}
.coverage-map li > div > span {
  color: var(--lb-blue);
  font: 650 0.61rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.04em;
}
.coverage-map dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
}
.coverage-map dl > div {
  display: flex;
  flex-direction: column-reverse;
  gap: 3px;
  text-align: right;
}
.coverage-map dt {
  color: var(--lb-faint);
  font-size: 0.6rem;
}
.coverage-map dd {
  margin: 0;
  color: var(--lb-muted);
  font: 680 0.72rem/1 var(--vp-font-family-mono);
}

.comparison-rule {
  display: grid;
  grid-template-columns: 82px minmax(230px, 0.72fr) minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  margin: 0 0 24px;
  padding: 15px 18px;
  border: 1px solid color-mix(in srgb, var(--lb-amber) 24%, var(--lb-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--lb-amber) 5%, var(--lb-surface-strong));
}
.comparison-rule__index {
  color: var(--lb-amber);
  font: 700 0.66rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.07em;
}
.comparison-rule strong {
  color: var(--lb-ink);
  font-size: 0.83rem;
}
.comparison-rule p {
  margin: 0;
  color: var(--lb-muted);
  font-size: 0.78rem;
  line-height: 1.55;
}
.comparison-rule a {
  color: var(--lb-amber);
  font-size: 0.72rem;
  font-weight: 680;
  white-space: nowrap;
}

.lb-explorer {
  margin: 0;
  padding: 16px;
  border: 1px solid var(--lb-border);
  border-radius: 17px;
  background: color-mix(in srgb, var(--lb-surface-strong) 88%, transparent);
  box-shadow: var(--lb-shadow);
}
.benchmark-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin-bottom: 18px;
  padding: 5px;
  border: 1px solid var(--lb-border);
  border-radius: 11px;
  background: var(--vp-c-bg-soft);
}
.benchmark-tabs button {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 42px;
  padding: 0 11px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--lb-muted);
  font-size: 0.75rem;
  font-weight: 680;
  text-align: left;
  cursor: pointer;
}
.benchmark-tabs button > span,
.benchmark-tabs button small {
  color: var(--lb-faint);
  font: 650 0.62rem/1 var(--vp-font-family-mono);
}
.benchmark-tabs button:hover { color: var(--lb-ink); background: var(--vp-c-default-soft); }
.benchmark-tabs button.active {
  border-color: color-mix(in srgb, var(--lb-blue) 22%, var(--lb-border));
  background: color-mix(in srgb, var(--lb-blue) 9%, var(--lb-surface-strong));
  color: var(--lb-blue);
}
.benchmark-tabs button.active > span,
.benchmark-tabs button.active small { color: var(--lb-blue); }

.active-benchmark {
  display: grid;
  grid-template-columns: minmax(250px, 0.78fr) minmax(0, 1.22fr);
  gap: clamp(28px, 5vw, 60px);
  align-items: end;
  padding: 22px 18px;
  border-bottom: 1px solid var(--lb-border);
}
.active-benchmark__copy > span {
  color: var(--lb-blue);
  font: 680 0.64rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.active-benchmark h2 {
  margin: 9px 0 7px;
  padding: 0;
  border: 0;
  color: var(--lb-ink);
  font-size: clamp(1.5rem, 2.3vw, 2rem);
  letter-spacing: -0.04em;
  line-height: 1.05;
}
.active-benchmark__copy p {
  max-width: 42ch;
  margin: 0;
  color: var(--lb-muted);
  font-size: 0.82rem;
  line-height: 1.6;
}
.active-benchmark__facts {
  display: grid;
  grid-template-columns: 1.5fr 0.6fr 1.1fr 0.8fr;
  gap: 16px;
  margin: 0;
}
.active-benchmark__facts > div {
  min-width: 0;
  padding-left: 13px;
  border-left: 1px solid var(--lb-border);
}
.active-benchmark__facts dt {
  margin-bottom: 5px;
  color: var(--lb-faint);
  font-size: 0.62rem;
}
.active-benchmark__facts dd {
  margin: 0;
  overflow: hidden;
  color: var(--lb-ink);
  font-size: 0.72rem;
  font-weight: 690;
  line-height: 1.35;
  text-overflow: ellipsis;
}

.lb-controls {
  margin: 0 0 18px;
  padding: 14px 4px 2px;
}
.lb-controls__top {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(146px, auto) 112px auto;
  gap: 10px 16px;
  align-items: end;
}
.lb-search {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
}
.lb-search svg {
  position: absolute;
  left: 13px;
  color: var(--lb-faint);
  pointer-events: none;
}
.lb-search input {
  width: 100%;
  min-width: 0;
  min-height: 43px;
  padding: 9px 13px 9px 40px;
  border: 1px solid var(--lb-border);
  border-radius: 9px;
  outline: none;
  background: var(--lb-surface-strong);
  color: var(--lb-ink);
  font: inherit;
  font-size: 0.83rem;
}
.lb-search input:focus {
  border-color: var(--lb-blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--lb-blue) 13%, transparent);
}
.lb-search input::placeholder { color: var(--lb-faint); }
.status-select {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}
.status-select > span {
  color: var(--lb-faint);
  font-size: 0.61rem;
}
.status-select select {
  width: 100%;
  min-height: 43px;
  padding: 0 28px 0 10px;
  border: 1px solid var(--lb-border);
  border-radius: 9px;
  outline: none;
  background: var(--lb-surface-strong);
  color: var(--lb-muted);
  font-size: 0.74rem;
}
.status-select select:focus { border-color: var(--lb-blue); }
.lb-controls__count {
  display: flex;
  min-height: 43px;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  color: var(--lb-faint);
  font: 650 0.62rem/1 var(--vp-font-family-mono);
}
.lb-controls__count span { color: var(--lb-blue); letter-spacing: 0.05em; }
.reset-button {
  min-height: 43px;
  padding: 0 12px;
  border: 1px solid var(--lb-border);
  border-radius: 9px;
  background: transparent;
  color: var(--lb-muted);
  font-size: 0.72rem;
  font-weight: 650;
  cursor: pointer;
}
.reset-button:hover { border-color: var(--lb-blue); color: var(--lb-blue); }
.lb-controls__row {
  display: grid;
  grid-template-columns: 78px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  margin-top: 11px;
  padding-top: 11px;
  border-top: 1px solid var(--lb-border);
}
.lb-controls__row--sort {
  grid-template-columns: 78px minmax(0, 1fr) auto;
}
.lb-controls__label {
  color: var(--lb-faint);
  font: 680 0.62rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.04em;
}
.split-tabs,
.sort-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.split-tabs button,
.sort-tabs button {
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: var(--lb-muted);
  font-size: 0.71rem;
  font-weight: 650;
  cursor: pointer;
}
.split-tabs button:hover,
.sort-tabs button:hover { background: var(--vp-c-default-soft); color: var(--lb-ink); }
.split-tabs button.active,
.sort-tabs button.active {
  border-color: color-mix(in srgb, var(--lb-blue) 24%, var(--lb-border));
  background: color-mix(in srgb, var(--lb-blue) 9%, transparent);
  color: var(--lb-blue);
}

.quality-badge,
.record-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 24px;
  padding: 3px 8px;
  border: 1px solid var(--lb-border);
  border-radius: 999px;
  color: var(--lb-muted);
  font-size: 0.63rem;
  font-weight: 680;
  white-space: nowrap;
}
.quality-badge.is-strong,
.record-status.is-verified {
  border-color: color-mix(in srgb, var(--lb-green) 28%, var(--lb-border));
  background: color-mix(in srgb, var(--lb-green) 8%, transparent);
  color: var(--lb-green);
}
.quality-badge.is-conditional,
.record-status.is-source {
  border-color: color-mix(in srgb, var(--lb-blue) 25%, var(--lb-border));
  background: color-mix(in srgb, var(--lb-blue) 8%, transparent);
  color: var(--lb-blue);
}
.quality-badge.is-weak,
.record-status.is-self {
  border-color: color-mix(in srgb, var(--lb-amber) 28%, var(--lb-border));
  background: color-mix(in srgb, var(--lb-amber) 8%, transparent);
  color: var(--lb-amber);
}
.record-status.is-pending {
  border-color: var(--lb-border);
  background: var(--vp-c-default-soft);
  color: var(--lb-faint);
}

.insight-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.48fr) minmax(280px, 0.72fr);
  gap: 14px;
  margin-bottom: 16px;
}
.score-distribution,
.interpretation-card {
  min-width: 0;
  padding: 19px 20px;
  border: 1px solid var(--lb-border);
  border-radius: 13px;
  background: var(--lb-surface);
}
.score-distribution > header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 14px;
}
.score-distribution > header > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.score-distribution > header span,
.cross-coverage > span {
  color: var(--lb-blue);
  font: 680 0.62rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.score-distribution h3,
.interpretation-card h3 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--lb-ink);
  font-size: 0.95rem;
  font-weight: 720;
}
.score-distribution > header > small {
  color: var(--lb-faint);
  font-size: 0.64rem;
  text-align: right;
}
.score-distribution ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
.score-distribution li {
  display: grid;
  grid-template-columns: 26px minmax(120px, 1fr) 74px 92px;
  gap: 9px;
  align-items: center;
  min-height: 44px;
  margin: 0;
  border-top: 1px solid var(--lb-border);
}
.score-distribution__rank {
  color: var(--lb-faint);
  font: 650 0.62rem/1 var(--vp-font-family-mono);
}
.score-distribution li > strong {
  overflow: hidden;
  color: var(--lb-ink);
  font-size: 0.75rem;
  font-weight: 680;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.score-distribution__value {
  color: var(--lb-ink);
  font: 730 0.76rem/1 var(--vp-font-family-mono);
  text-align: right;
}
.score-distribution__value small { color: var(--lb-faint); font-size: 0.58rem; }
.score-distribution .score-track { grid-column: 2 / -1; margin-top: -9px; }
.score-track {
  position: relative;
  display: block;
  height: 3px;
  overflow: hidden;
  border-radius: 99px;
  background: color-mix(in srgb, var(--lb-ink) 8%, transparent);
}
.score-track i,
.score-track b {
  position: absolute;
  top: 0;
  bottom: 0;
}
.score-track i {
  left: 0;
  border-radius: inherit;
  background: var(--lb-blue);
}
.score-track b {
  background: color-mix(in srgb, var(--lb-blue) 35%, transparent);
}
.insight-empty { margin: 20px 0; color: var(--lb-faint); font-size: 0.78rem; }

.interpretation-card__status {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
.interpretation-card__status small { color: var(--lb-faint); font-size: 0.63rem; }
.interpretation-card > p {
  margin: 9px 0 0;
  color: var(--lb-muted);
  font-size: 0.76rem;
  line-height: 1.58;
}
.cross-coverage {
  margin-top: 17px;
  padding-top: 14px;
  border-top: 1px solid var(--lb-border);
}
.cross-coverage > p { margin: 7px 0 10px; color: var(--lb-faint); font-size: 0.69rem; line-height: 1.5; }
.cross-coverage ul { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
.cross-coverage li {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin: 0;
}
.cross-coverage li strong { color: var(--lb-ink); font-size: 0.7rem; }
.cross-coverage li span { color: var(--lb-faint); font-size: 0.62rem; text-align: right; }

.ranking-section {
  overflow: hidden;
  border: 1px solid var(--lb-border);
  border-radius: 13px;
  background: var(--lb-surface-strong);
}
.ranking-section__head {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--lb-border);
}
.ranking-section__head > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ranking-section__head span {
  color: var(--lb-blue);
  font: 680 0.61rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.ranking-section__head h3 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--lb-ink);
  font-size: 0.94rem;
}
.ranking-section__head p {
  max-width: 48ch;
  margin: 0;
  color: var(--lb-faint);
  font-size: 0.66rem;
  line-height: 1.45;
  text-align: right;
}
.rank-labels,
.rank-entry {
  display: grid;
  grid-template-columns: 42px minmax(220px, 1.3fr) 88px 84px minmax(140px, 0.6fr);
  gap: 14px;
  align-items: center;
}
.rank-labels {
  min-height: 34px;
  padding: 0 18px;
  border-bottom: 1px solid var(--lb-border);
  color: var(--lb-faint);
  font: 650 0.59rem/1 var(--vp-font-family-mono);
}
.rank-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.rank-entry {
  position: relative;
  min-height: 92px;
  margin: 0;
  padding: 13px 18px 10px;
  border-bottom: 1px solid var(--lb-border);
}
.rank-entry::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: transparent;
}
.rank-entry.is-top::before { background: var(--lb-blue); }
.rank-entry:hover { background: color-mix(in srgb, var(--lb-blue) 3%, transparent); }
.rank-entry__number {
  color: var(--lb-faint);
  font: 720 0.7rem/1 var(--vp-font-family-mono);
}
.rank-entry.is-top .rank-entry__number { color: var(--lb-blue); }
.rank-entry__model {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}
.rank-entry__model > a,
.rank-entry__model > strong {
  overflow: hidden;
  color: var(--lb-ink);
  font-size: 0.82rem;
  font-weight: 720;
  line-height: 1.3;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rank-entry__model > a:hover,
.rank-entry__model > a:focus-visible { color: var(--lb-blue); text-decoration: underline; text-underline-offset: 3px; }
.rank-entry__model > span {
  overflow: hidden;
  color: var(--lb-faint);
  font-size: 0.63rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rank-entry__year {
  color: var(--lb-muted);
  font: 650 0.66rem/1 var(--vp-font-family-mono);
}
.rank-entry__score {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
}
.rank-entry__score > span:first-child {
  display: flex;
  gap: 5px;
  align-items: baseline;
}
.rank-entry__score strong {
  color: var(--lb-ink);
  font: 760 1rem/1 var(--vp-font-family-mono);
}
.rank-entry__score small {
  color: var(--lb-faint);
  font-size: 0.61rem;
}
.rank-entry__evidence {
  grid-column: 2 / -1;
  min-width: 0;
}
.rank-entry__evidence summary {
  width: fit-content;
  margin-left: auto;
  color: var(--lb-faint);
  font-size: 0.63rem;
  font-weight: 650;
  cursor: pointer;
  list-style: none;
}
.rank-entry__evidence summary::-webkit-details-marker { display: none; }
.rank-entry__evidence summary::after { content: ' +'; color: var(--lb-blue); }
.rank-entry__evidence[open] summary::after { content: ' −'; }
.rank-entry__evidence > div {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
  gap: 10px 18px;
  margin-top: 9px;
  padding: 11px 12px;
  border: 1px solid var(--lb-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.rank-entry__evidence p {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  color: var(--lb-muted);
  font-size: 0.68rem;
  line-height: 1.45;
}
.rank-entry__evidence p strong {
  color: var(--lb-faint);
  font-size: 0.59rem;
}
.rank-entry__evidence a {
  align-self: center;
  color: var(--lb-blue);
  font-size: 0.66rem;
  font-weight: 680;
  white-space: nowrap;
}
.ranking-section__footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 18px;
  color: var(--lb-faint);
  font: 640 0.61rem/1 var(--vp-font-family-mono);
}
.rank-empty {
  display: flex;
  min-height: 250px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.rank-empty > span { color: var(--lb-blue); font: 680 0.62rem/1 var(--vp-font-family-mono); letter-spacing: 0.07em; }
.rank-empty h3 { margin: 14px 0 6px; padding: 0; border: 0; font-size: 1rem; }
.rank-empty p { margin: 0 0 16px; color: var(--lb-muted); font-size: 0.76rem; }
.rank-empty button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--lb-border-strong);
  border-radius: 8px;
  background: var(--lb-surface-strong);
  color: var(--lb-ink);
  font-size: 0.72rem;
  cursor: pointer;
}

.method-section { margin-top: 34px; }
.method-section__head {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--lb-border-strong);
}
.method-section__head > span {
  color: var(--lb-blue);
  font: 680 0.63rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.06em;
}
.method-section__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  color: var(--lb-ink);
  font-size: 1.15rem;
}
.method-section__head p { margin: 0; color: var(--lb-faint); font-size: 0.71rem; }
.method-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.method-grid article {
  padding: 18px;
  border: 1px solid var(--lb-border);
  border-radius: 11px;
  background: var(--lb-surface);
}
.method-grid article > span {
  color: var(--lb-blue);
  font: 670 0.6rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.05em;
}
.method-grid h3 {
  margin: 13px 0 7px;
  padding: 0;
  border: 0;
  color: var(--lb-ink);
  font-size: 0.85rem;
}
.method-grid p {
  margin: 0;
  color: var(--lb-muted);
  font-size: 0.73rem;
  line-height: 1.58;
}
.exclusion-notes {
  margin-top: 12px;
  overflow: hidden;
  border: 1px solid var(--lb-border);
  border-radius: 11px;
  background: var(--lb-surface);
}
.exclusion-notes > summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 34px;
  gap: 18px;
  align-items: center;
  min-height: 70px;
  padding: 12px 16px 12px 18px;
  cursor: pointer;
  list-style: none;
}
.exclusion-notes > summary::-webkit-details-marker { display: none; }
.exclusion-notes > summary > span:first-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.exclusion-notes > summary small {
  color: var(--lb-blue);
  font: 660 0.6rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.05em;
}
.exclusion-notes > summary strong { color: var(--lb-ink); font-size: 0.82rem; }
.exclusion-notes > summary > span:nth-child(2) { color: var(--lb-faint); font-size: 0.68rem; }
.exclusion-notes > summary svg { color: var(--lb-faint); transition: transform 0.18s ease; }
.exclusion-notes[open] > summary svg { transform: rotate(180deg); }
.exclusion-notes__body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--lb-border);
}
.exclusion-notes__body article {
  padding: 17px 18px;
  border-bottom: 1px solid var(--lb-border);
}
.exclusion-notes__body article:nth-child(odd) { border-right: 1px solid var(--lb-border); }
.exclusion-notes__body h3 { margin: 0 0 6px; padding: 0; border: 0; color: var(--lb-ink); font-size: 0.8rem; }
.exclusion-notes__body p { margin: 0; color: var(--lb-muted); font-size: 0.71rem; line-height: 1.55; }
.related-reading {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 12px;
  border: 1px solid var(--lb-border);
  border-radius: 11px;
  overflow: hidden;
}
.related-reading a {
  display: grid;
  min-height: 92px;
  padding: 15px 16px;
  border-right: 1px solid var(--lb-border);
  background: var(--lb-surface);
  text-decoration: none;
}
.related-reading a:last-child { border-right: 0; }
.related-reading a:hover { background: color-mix(in srgb, var(--lb-blue) 5%, var(--lb-surface)); }
.related-reading span { color: var(--lb-blue); font: 660 0.6rem/1 var(--vp-font-family-mono); }
.related-reading strong { align-self: end; color: var(--lb-ink); font-size: 0.78rem; }
.related-reading small { margin-top: 4px; color: var(--lb-faint); font-size: 0.64rem; }

button:focus-visible,
a:focus-visible,
summary:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid var(--lb-blue);
  outline-offset: 2px;
}

@media (max-width: 980px) {
  .lb-hero { grid-template-columns: 1fr; gap: 26px; }
  .lb-hero__dek { max-width: 62ch; }
  .coverage-map li { grid-template-columns: 32px minmax(130px, 1fr) minmax(220px, 0.9fr); }
  .comparison-rule { grid-template-columns: 70px minmax(220px, 0.8fr) minmax(0, 1fr); }
  .comparison-rule a { grid-column: 2 / -1; }
  .benchmark-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .active-benchmark { grid-template-columns: 1fr; gap: 20px; }
  .insight-grid { grid-template-columns: 1fr; }
  .interpretation-card { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
  .interpretation-card__status,
  .interpretation-card h3,
  .interpretation-card > p { grid-column: 1; }
  .cross-coverage { grid-column: 2; grid-row: 1 / span 4; margin-top: 0; padding: 0 0 0 22px; border-top: 0; border-left: 1px solid var(--lb-border); }
}

@media (max-width: 760px) {
  .lb-explorer { padding: 10px; border-radius: 14px; }
  .benchmark-tabs {
    display: flex;
    margin-inline: -1px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .benchmark-tabs::-webkit-scrollbar { display: none; }
  .benchmark-tabs button { flex: 0 0 auto; min-width: 150px; }
  .active-benchmark { padding: 18px 8px; }
  .active-benchmark__facts { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; }
  .lb-controls__top { grid-template-columns: minmax(0, 1fr) 132px; }
  .lb-controls__count { grid-column: 1; }
  .reset-button { grid-column: 2; grid-row: 2; }
  .lb-controls__row,
  .lb-controls__row--sort { display: block; }
  .lb-controls__label { display: block; margin-bottom: 8px; }
  .quality-badge { margin-top: 8px; }
  .rank-labels { display: none; }
  .rank-entry {
    grid-template-columns: 34px minmax(0, 1fr) auto;
    gap: 9px 12px;
    min-height: 0;
    padding: 16px 14px 12px;
  }
  .rank-entry__number { grid-column: 1; grid-row: 1 / span 2; align-self: start; padding-top: 3px; }
  .rank-entry__model { grid-column: 2; grid-row: 1; }
  .rank-entry > .record-status { grid-column: 2; grid-row: 2; }
  .rank-entry__year { grid-column: 3; grid-row: 2; text-align: right; }
  .rank-entry__score { grid-column: 3; grid-row: 1; min-width: 76px; align-items: flex-end; }
  .rank-entry__score .score-track { width: 76px; }
  .rank-entry__evidence { grid-column: 2 / -1; }
  .rank-entry__evidence > div { grid-template-columns: 1fr; }
  .rank-entry__evidence a { justify-self: start; }
  .method-grid { grid-template-columns: 1fr; }
  .related-reading { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .related-reading a:nth-child(2) { border-right: 0; }
  .related-reading a:nth-child(-n+2) { border-bottom: 1px solid var(--lb-border); }
}

@media (max-width: 620px) {
  .lb-hero { gap: 22px; margin-top: 0; padding-block: 22px; }
  .leaderboard-shell h1 { margin-block: 14px 10px; font-size: 1.9rem; }
  .lb-hero__dek { font-size: 0.86rem; }
  .lb-hero__stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 28px; max-width: 285px; }
  .coverage-map li { grid-template-columns: 28px minmax(0, 1fr); padding-block: 10px; }
  .coverage-map dl { grid-column: 2; text-align: left; }
  .coverage-map dl > div { text-align: left; }
  .comparison-rule { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .comparison-rule a { margin-top: 2px; }
  .active-benchmark__facts { gap: 12px 4px; }
  .lb-controls__top { grid-template-columns: 1fr; }
  .status-select { grid-row: auto; }
  .lb-controls__count { grid-column: auto; }
  .reset-button { grid-column: auto; grid-row: auto; width: fit-content; }
  .split-tabs,
  .sort-tabs {
    flex-wrap: nowrap;
    margin-inline: -4px;
    padding-inline: 4px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .split-tabs::-webkit-scrollbar,
  .sort-tabs::-webkit-scrollbar { display: none; }
  .split-tabs button,
  .sort-tabs button { flex: 0 0 auto; min-height: 38px; }
  .score-distribution,
  .interpretation-card { padding: 17px 15px; }
  .score-distribution li { grid-template-columns: 24px minmax(90px, 1fr) 72px; }
  .score-distribution li > .record-status { display: none; }
  .score-distribution__value { grid-column: 3; }
  .interpretation-card { display: block; }
  .cross-coverage { margin-top: 16px; padding: 14px 0 0; border-top: 1px solid var(--lb-border); border-left: 0; }
  .ranking-section__head { display: block; }
  .ranking-section__head p { margin-top: 8px; text-align: left; }
  .ranking-section__footer { flex-wrap: wrap; }
  .method-section__head { grid-template-columns: 1fr; gap: 7px; align-items: start; }
  .exclusion-notes > summary { grid-template-columns: minmax(0, 1fr) 28px; }
  .exclusion-notes > summary > span:nth-child(2) { display: none; }
  .exclusion-notes__body { grid-template-columns: 1fr; }
  .exclusion-notes__body article:nth-child(odd) { border-right: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .exclusion-notes > summary svg { transition: none; }
}
</style>
