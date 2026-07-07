import DefaultTheme from 'vitepress/theme'
import { h, ref, reactive, computed, watch, onMounted, onUnmounted, nextTick, Teleport } from 'vue'
import { useRoute, useData, withBase } from 'vitepress'
import { data as modelData } from '../data/models.data.mjs'
import { data as paperData } from '../data/papers.data.mjs'
import { ROUTE_COLORS } from './route-colors.mjs'
import LineageMap from './components/LineageMap.vue'
import XhsAccounts from './components/XhsAccounts.vue'
import XhsBoard from './components/XhsBoard.vue'
import DotField from './components/DotField.vue'
import ShuffleText from './components/ShuffleText.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import GridDistortion from './components/GridDistortion.vue'
import AutoResearchLab from './components/AutoResearchLab.vue'
import BenchmarkBoard from './components/BenchmarkBoard.vue'
import DatasetCatalog from './components/DatasetCatalog.vue'
import RoadmapGraph from './components/RoadmapGraph.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import FirstVisitGuide from './components/FirstVisitGuide.vue'
import './custom.css'

// =====================================================================
// 首屏 WebGL 扭曲背景(HeroBG → GridDistortion):蓝紫流体抽象底图
// (public/hero-bg.jpg)铺满首个视口,鼠标拖动产生网格扭曲;
// 叠两层科技增强(见 custom.css):.hero-bg-halo 机器人位锚定青蓝辉光(消除主体与背景
// 脱节感)、.hero-bg-tech HUD 科技层(扫描线 + 暗角聚焦 + 缓慢扫描带)。
// 随滚动收起(--hero-collapse,见 setupHeroCollapse)。client-only。
// =====================================================================
const HeroBG = {
  setup() {
    const mounted = ref(false)
    onMounted(() => {
      mounted.value = true
    })
    return () => {
      if (!mounted.value) return null
      return h('div', { class: 'hero-bg-layer', 'aria-hidden': 'true' }, [
        h(GridDistortion, {
          imageSrc: withBase('/hero-bg.jpg'),
          grid: 14,
          mouse: 0.14,
          strength: 0.2,
          relaxation: 0.91,
        }),
        h('i', { class: 'hero-bg-halo' }),
        h('i', { class: 'hero-bg-tech' }),
      ])
    }
  },
}

// =====================================================================
// 首屏滑动收起:桌面按约 0.86 屏缓慢交叉淡出;移动端 hero 往往高于一屏,
// 改按实际 hero 高度放慢。英雄区(.thero)与扭曲背景按其淡出/上移/微缩,收完关闭指针事件;
// reduced-motion 不启用(直接正常滚动)。
// =====================================================================
let heroCollapseBound = false
function setupHeroCollapse() {
  if (heroCollapseBound || typeof window === 'undefined') return
  heroCollapseBound = true
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  let ticking = false
  document.documentElement.classList.add('home-transition-bound')
  const smoothstep = (n) => {
    const x = Math.min(1, Math.max(0, n))
    return x * x * (3 - 2 * x)
  }
  const apply = () => {
    ticking = false
    const hero = document.querySelector('.VPHome .thero')
    if (!hero) return
    const collapseDistance =
      hero.offsetHeight > window.innerHeight
        ? Math.max(hero.offsetHeight * 0.92, window.innerHeight * 0.82)
        : window.innerHeight * 0.86
    const raw = Math.min(1, Math.max(0, window.scrollY / collapseDistance))
    const p = smoothstep(raw)
    const next = smoothstep(raw / 0.72)
    const bridge = Math.sin(raw * Math.PI)
    document.documentElement.style.setProperty('--hero-collapse', p.toFixed(3))
    document.documentElement.style.setProperty('--home-next-opacity', next.toFixed(3))
    document.documentElement.style.setProperty('--home-next-y', ((1 - next) * 16).toFixed(1) + 'px')
    document.documentElement.style.setProperty('--home-bridge-opacity', (0.2 + bridge * 0.64).toFixed(3))
    document.documentElement.style.setProperty('--home-bridge-y', ((0.5 - raw) * 44).toFixed(1) + 'px')
    document.documentElement.classList.toggle('home-next-ready', next >= 0.62)
    hero.classList.toggle('is-collapsed', raw >= 0.98)
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    },
    { passive: true }
  )
  apply()
}

// =====================================================================
// 顶栏滚动感知:滚动后给 <html> 加 .nav-scrolled,顶栏从「顶部更干净」
// 过渡到「实起来」(玻璃更厚 + 发丝线点亮 + 轻浮起,样式见 custom.css)。全站生效。
// =====================================================================
let navScrollBound = false
function setupNavScroll() {
  if (navScrollBound || typeof window === 'undefined') return
  navScrollBound = true
  const root = document.documentElement
  let ticking = false
  const apply = () => {
    ticking = false
    root.classList.toggle('nav-scrolled', window.scrollY > 8)
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    },
    { passive: true }
  )
  apply()
}

// =====================================================================
// 卡片光标光斑(setupCardSpotlight):pointermove 写入 --spot-x/y。
// · 论文票据用自身 ::after 承载光斑;
// · 路线卡 / 新闻卡的伪元素已被占用,故懒注入一个 <span class="fx-spot">
//   叠加层(screen 混合、只增亮不挡字,subtle 以尊重路线卡「不突兀」原意)。
// 事件委托在 document,只在指针位于卡片上时生效,全站轻量。
// =====================================================================
let cardSpotlightBound = false
function setupCardSpotlight() {
  if (cardSpotlightBound || typeof window === 'undefined') return
  cardSpotlightBound = true
  document.addEventListener(
    'pointermove',
    (e) => {
      const card =
        e.target && e.target.closest && e.target.closest('.paper-ticket, .route-card, .news-card')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--spot-x', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%')
      card.style.setProperty('--spot-y', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%')
      // 论文票据用 ::after,其余卡片懒注入叠加层
      if (!card.classList.contains('paper-ticket') && !card.querySelector('.fx-spot')) {
        const s = document.createElement('span')
        s.className = 'fx-spot'
        s.setAttribute('aria-hidden', 'true')
        card.appendChild(s)
      }
    },
    { passive: true }
  )
}

// =====================================================================
// 每日论文页分类筛选:从每张 paper-ticket 的 meta 标签自动推断类目。
// 后续每日新增卡片只要沿用 VLA/WAM/DATA/HUMANOID/TACTILE/P0/已细读 等标签,
// 筛选按钮和数量会自动更新;hash 支持分享 /papers/latest#vla。
// =====================================================================
let paperFilterObserverBound = false
function setupPaperFilters() {
  if (typeof window === 'undefined') return

  const FILTER_LABELS = {
    all: '全部',
    vla: 'VLA',
    wam: 'WAM',
    data: 'DATA/EVAL',
    humanoid: 'HUMANOID',
    tactile: 'TACTILE',
    p0: 'P0 优先',
    done: '已细读',
  }

  const normalize = (value) => String(value || '').trim().toUpperCase()

  const inferCategories = (ticket) => {
    const tags = Array.from(ticket.querySelectorAll('.paper-ticket__meta span')).map((span) =>
      normalize(span.textContent)
    )
    const tagText = tags.join(' ')
    const categories = new Set(['all'])

    if (ticket.classList.contains('paper-ticket--vla') || /\bVLA\b/.test(tagText)) categories.add('vla')
    if (ticket.classList.contains('paper-ticket--wam') || /\bWAM\b/.test(tagText)) categories.add('wam')
    if (ticket.classList.contains('paper-ticket--data')) categories.add('data')
    if (/\b(DATA|EVAL|BENCH|DEX|REWARD|PREFERENCE|PLANNING|SURVEY|SAFETY|OFFLINE)\b/.test(tagText)) {
      categories.add('data')
    }
    if (/\bHUMANOID\b/.test(tagText)) categories.add('humanoid')
    if (/\b(TACTILE|FORCE|TOUCH)\b/.test(tagText)) categories.add('tactile')
    if (/\bP0\b/.test(tagText)) categories.add('p0')
    if (/已细读|DONE/.test(tagText)) categories.add('done')

    ticket.dataset.paperCategories = Array.from(categories).join(' ')
    return categories
  }

  const initPanel = (panel) => {
    if (panel.dataset.paperFilterReady) return
    const buttons = Array.from(panel.querySelectorAll('[data-paper-filter]'))
    const counter = panel.querySelector('[data-paper-filter-count]')
    if (!buttons.length || !document.querySelector('.paper-ticket')) return
    panel.dataset.paperFilterReady = '1'

    let empty = document.querySelector('[data-paper-filter-empty]')
    if (!empty) {
      empty = document.createElement('p')
      empty.className = 'paper-filter-empty'
      empty.dataset.paperFilterEmpty = '1'
      empty.hidden = true
      empty.textContent = '当前分类暂无论文。'
      const lastSection = document.querySelector('.daily-paper-section')
      lastSection?.parentNode?.insertBefore(empty, lastSection)
    }

    const getTickets = () => Array.from(document.querySelectorAll('.paper-ticket'))

    const getFilterFromHash = () => {
      const key = decodeURIComponent(window.location.hash.replace(/^#/, '')).toLowerCase()
      return buttons.some((button) => button.dataset.paperFilter === key) ? key : 'all'
    }

    const apply = (filter, updateHash = true) => {
      const active = filter || 'all'
      let visible = 0
      const tickets = getTickets()
      tickets.forEach(inferCategories)
      tickets.forEach((ticket) => {
        const cats = ticket.dataset.paperCategories || ''
        const show = active === 'all' || cats.split(/\s+/).includes(active)
        ticket.hidden = !show
        ticket.style.display = show ? '' : 'none'
        ticket.classList.toggle('is-filtered-out', !show)
        if (show) visible += 1
      })

      document.querySelectorAll('.daily-paper-section').forEach((section) => {
        const cards = Array.from(section.querySelectorAll('.paper-ticket'))
        const hasVisible = cards.some((card) => !card.hidden)
        section.hidden = !hasVisible
        const heading = section.previousElementSibling
        if (heading?.classList?.contains('paper-day-heading')) heading.hidden = !hasVisible
      })

      buttons.forEach((button) => {
        const on = button.dataset.paperFilter === active
        button.classList.toggle('is-active', on)
        button.setAttribute('aria-pressed', String(on))
      })

      if (counter) {
        const label = FILTER_LABELS[active] || active.toUpperCase()
        counter.textContent = active === 'all' ? `显示 ${visible} 篇` : `${label} · ${visible} 篇`
      }
      empty.hidden = visible !== 0

      if (updateHash) {
        const next = active === 'all' ? window.location.pathname + window.location.search : `#${active}`
        if (active === 'all') window.history.replaceState(null, '', next)
        else window.history.replaceState(null, '', next)
      }
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => apply(button.dataset.paperFilter || 'all'))
    })
    window.addEventListener('hashchange', () => apply(getFilterFromHash(), false))
    apply(getFilterFromHash(), false)
  }

  const bind = () => {
    document.querySelectorAll('[data-paper-filter-panel]').forEach(initPanel)
  }

  bind()
  if (!paperFilterObserverBound && 'MutationObserver' in window) {
    paperFilterObserverBound = true
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(bind, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 主页鼠标互动点阵(HomeDots):DotField 的首页包装层。
// fixed 全视口背景层(z-index:0,内容 z-index:1 之上不受影响;fixed 不被
// .VPHome overflow:hidden 裁剪),随 home-hero-before 槽只在首页挂载;
// SSR 首帧渲染 null,mounted 后才上 canvas。配色随明暗主题切换(紫→青,站点同源)。
// =====================================================================
const HomeDots = {
  setup() {
    const mounted = ref(false)
    const { isDark } = useData()
    onMounted(() => {
      mounted.value = true
    })
    return () => {
      if (!mounted.value) return null
      return h('div', { class: 'dot-field-layer', 'aria-hidden': 'true' }, [
        h(DotField, {
          dotRadius: 1.5,
          dotSpacing: 14,
          bulgeStrength: 67,
          glowRadius: 160,
          sparkle: false,
          waveAmplitude: 0,
          gradientFrom: isDark.value ? 'rgba(167, 139, 250, 0.42)' : 'rgba(124, 58, 237, 0.30)',
          gradientTo: isDark.value ? 'rgba(34, 211, 238, 0.26)' : 'rgba(14, 127, 168, 0.22)',
          glowColor: isDark.value ? 'rgba(124, 58, 237, 0.30)' : 'rgba(124, 58, 237, 0.12)',
        }),
      ])
    }
  },
}

// =====================================================================
// 「专注阅读」切换:收起左右两侧(侧边栏 + 右侧目录),加宽正文。
// 状态写入 localStorage 并加在 <html>.zen-reading 上(config head 里有预渲染脚本防闪烁)。
// =====================================================================
const PANEL_ICON =
  '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><line x1="5" y1="3" x2="5" y2="13"/><line x1="11" y1="3" x2="11" y2="13"/></svg>'

const shouldShowZenToggle = (path) => {
  const normalized = String(path || '').replace(/\/+$/, '') || '/'
  return !['/', '/index', '/index.html', '/404'].includes(normalized)
}

const ZenToggle = {
  setup() {
    const route = useRoute()
    const { frontmatter } = useData()
    const on = ref(false)
    onMounted(() => {
      on.value =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('zen-reading')
    })
    const toggle = () => {
      on.value = !on.value
      document.documentElement.classList.toggle('zen-reading', on.value)
      try {
        localStorage.setItem('zen-reading', on.value ? '1' : '0')
      } catch (e) {}
    }
    return () => {
      // 普通文档页都显示:zen-reading 是全站状态,否则跨目录后会有开关却无出口。
      if (frontmatter.value?.layout === 'home' || !shouldShowZenToggle(route.path)) return null
      return h(
        'button',
        {
          class: ['zen-toggle', { 'is-on': on.value }],
          type: 'button',
          onClick: toggle,
          'aria-pressed': String(on.value),
          title: on.value ? '退出专注模式(恢复左右侧栏)' : '专注阅读:收起左右侧栏',
        },
        [
          h('span', { class: 'zen-toggle__icon', innerHTML: PANEL_ICON }),
          h('span', { class: 'zen-toggle__label' }, on.value ? '退出专注' : '专注'),
        ]
      )
    }
  },
}

// =====================================================================
// 「可信度透镜」全局开关:循环 全部 → 暗化自评/待核 → 仅显已核。
// 配合 markdown 已给含 ⚠️/待核 的 <td> 打的 cred-warn / cred-todo class(见 config.mjs),
// 通过 <html>.lens-dim / .lens-strict 暗化(从不删除,保持诚实)。
// 仅暗化已被标记的数据,绝不制造或抹去信息。
// =====================================================================
const lens = reactive({ mode: '' }) // '' | 'dim' | 'strict'
const LENS_KEY = 'cred-lens'
const LENS_CYCLE = { '': 'dim', dim: 'strict', strict: '' }
const LENS_META = {
  '': { label: '可信度', title: '可信度透镜:全部显示。点击 → 暗化自评/待核数据' },
  dim: { label: '暗化自评', title: '可信度透镜:已暗化 ⚠️ 自评与待核数据。点击 → 仅显已核' },
  strict: { label: '仅显已核', title: '可信度透镜:仅突出已核数据(⚠️/待核 大幅淡出)。点击 → 恢复全部' },
}
const SHIELD_ICON =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.5l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6v-4l5-2z"/><path d="M5.8 8l1.6 1.6L10.4 6"/></svg>'

const ConfidenceLens = {
  setup() {
    const route = useRoute()
    onMounted(() => {
      try {
        const l = localStorage.getItem(LENS_KEY)
        lens.mode = l === 'dim' || l === 'strict' ? l : ''
      } catch (e) {}
    })
    const cycle = () => {
      lens.mode = LENS_CYCLE[lens.mode]
      const el = document.documentElement
      el.classList.remove('lens-dim', 'lens-strict')
      if (lens.mode) el.classList.add('lens-' + lens.mode)
      try {
        localStorage.setItem(LENS_KEY, lens.mode)
      } catch (e) {}
    }
    return () => {
      if (!/\/vla\//.test(route.path)) return null
      const meta = LENS_META[lens.mode]
      return h(
        'button',
        {
          class: ['lens-toggle', { 'is-on': lens.mode !== '' }],
          type: 'button',
          onClick: cycle,
          'aria-label': meta.title,
          title: meta.title,
        },
        [
          h('span', { class: 'lens-toggle__icon', innerHTML: SHIELD_ICON }),
          h('span', { class: 'lens-toggle__label' }, meta.label),
        ]
      )
    }
  },
}

// 透镜横幅:透镜开启时,统计「当前页」实际含 ⚠️/待核 的单元格数并提示(数字来自 DOM,不硬编码)。
const LensBanner = {
  setup() {
    const route = useRoute()
    const count = ref(0)
    const recount = () => {
      if (typeof document === 'undefined') return
      requestAnimationFrame(() => {
        count.value = document.querySelectorAll('.vp-doc .cred-warn, .vp-doc .cred-todo').length
      })
    }
    onMounted(recount)
    watch(() => route.path, () => nextTick(recount))
    watch(() => lens.mode, () => nextTick(recount))
    return () => {
      if (lens.mode === '' || count.value === 0) return null
      const verb = lens.mode === 'strict' ? '已大幅淡出' : '已暗化'
      return h('div', { class: 'lens-banner', role: 'status' }, [
        h('span', { class: 'lens-banner__dot' }),
        h('span', null, `可信度透镜:本页 ${count.value} 处「自评 ⚠️ / 待核」数据${verb}(其余为细读出处)。`),
      ])
    }
  },
}

// =====================================================================
// 「相关细读」自动页脚:在模型细读页底部,按 机构 / 主干家族 / 动作路线 给出兄弟模型,
// 每条带可解释 chip(同机构·X / 同主干·Y / 同·Z 路线)。数据来自 models-spec.md 解析器,
// 确定性 + 可解释,绝非黑箱推荐;非模型页自动隐藏。
// =====================================================================
const RelatedReads = {
  setup() {
    const route = useRoute()
    return () => {
      const m = route.path.match(/\/vla\/papers\/([\w-]+)/)
      if (!m) return null
      const slug = m[1]
      const rel = (modelData.related && modelData.related[slug]) || []
      if (!rel.length) return null
      return h('nav', { class: 'related-reads', 'aria-label': '相关细读' }, [
        h('div', { class: 'related-reads__title' }, '相关细读'),
        h(
          'ul',
          { class: 'related-reads__list' },
          rel.map((sib) =>
            h('li', { class: 'related-reads__item' }, [
              h('a', { class: 'related-reads__link', href: withBase(`/vla/papers/${sib.slug}`) }, sib.name),
              h(
                'span',
                { class: 'related-reads__chips' },
                sib.reasons.map((r) =>
                  h('span', { class: ['rr-chip', `rr-chip--${r.kind}`] }, r.label)
                )
              ),
            ])
          )
        ),
      ])
    }
  },
}

// =====================================================================
// 阅读进度跟踪:localStorage 记录已读页;滚动到底自动标记,亦可手动切换。
// 作为共享状态层(未来学习路径 / 闪卡复用)。只记录访问,不主张任何内容。
// =====================================================================
const READ_KEY = 'read-pages'
const progress = reactive({ set: new Set(), ready: false })
function loadProgress() {
  if (progress.ready) return
  try {
    progress.set = new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]'))
  } catch (e) {}
  progress.ready = true
}
function saveProgress() {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...progress.set]))
  } catch (e) {}
}
function setRead(path, on) {
  const next = new Set(progress.set)
  if (on) next.add(path)
  else next.delete(path)
  progress.set = next
  saveProgress()
}
// 从 sidebar 配置统计「全站可读页」总数(分母),去重
function countCorpus(sidebar) {
  const links = new Set()
  const walk = (items) => {
    if (!Array.isArray(items)) return
    for (const it of items) {
      if (it.link) links.add(it.link.replace(/\/$/, ''))
      if (it.items) walk(it.items)
    }
  }
  if (Array.isArray(sidebar)) walk(sidebar)
  else if (sidebar && typeof sidebar === 'object') for (const k of Object.keys(sidebar)) walk(sidebar[k])
  return links.size
}

const ProgressControl = {
  setup() {
    const route = useRoute()
    const { theme } = useData()
    let onScroll = null
    onMounted(() => {
      loadProgress()
      onScroll = () => {
        const doc = document.documentElement
        if (window.innerHeight + window.scrollY >= doc.scrollHeight - 240) {
          if (!progress.set.has(route.path)) setRead(route.path, true)
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
    })
    onUnmounted(() => {
      if (onScroll) window.removeEventListener('scroll', onScroll)
    })
    const isRead = computed(() => progress.ready && progress.set.has(route.path))
    const total = computed(() => countCorpus(theme.value.sidebar))
    const done = computed(() => {
      let n = 0
      for (const p of progress.set) if (/\/vla\//.test(p)) n++
      return n
    })
    return () => {
      if (!/\/vla\//.test(route.path)) return null
      const pct = total.value ? Math.min(100, Math.round((done.value / total.value) * 100)) : 0
      return h('div', { class: 'read-progress' }, [
        h(
          'button',
          {
            class: ['read-progress__btn', { 'is-read': isRead.value }],
            type: 'button',
            onClick: () => setRead(route.path, !isRead.value),
            'aria-pressed': String(isRead.value),
          },
          isRead.value ? '✓ 已读(点击取消)' : '标记为已读'
        ),
        h('div', { class: 'read-progress__meter', title: `本站已读 ${done.value} / ${total.value} 篇` }, [
          h('div', { class: 'read-progress__bar', style: { width: pct + '%' } }),
        ]),
        h('span', { class: 'read-progress__count' }, `已读 ${done.value}/${total.value}`),
      ])
    }
  },
}

// =====================================================================
// 「本系列」页脚导航:在所有 /vla/papers/* 细读与专题页底部提供跨页快捷入口。
// =====================================================================
const SERIES_LINKS = [
  ['/vla/', '← 总报告'],
  ['/vla/papers/embodied-data', '具身数据'],
  ['/vla/papers/data-processing', '数据处理'],
  ['/vla/papers/benchmarks', '数据集与基准'],
  ['/vla/papers/robots', '机器人本体'],
  ['/vla/papers/motion-control', '运控算法'],
  ['/vla/papers/glossary', '术语表'],
  ['/vla/papers/timeline', '时间线'],
  ['/vla/papers/references', '参考文献'],
]

const SeriesFooter = {
  setup() {
    const route = useRoute()
    return () => {
      if (!/\/vla\/papers\//.test(route.path)) return null
      return h('nav', { class: 'series-footer', 'aria-label': '本系列导航' }, [
        h('span', { class: 'series-footer__label' }, '本系列'),
        ...SERIES_LINKS.map(([to, text]) =>
          h('a', { class: 'series-footer__link', href: withBase(to) }, text)
        ),
      ])
    }
  },
}

// =====================================================================
// 论文细读「档案化」三件套(2026-06-10):
//  ① PaperDossier 档案头:主线 / 技术路线 / 发布年月 / arXiv 直链 / 谱系图定位 / 可信度图例。
//     全部派生自 papers.data.mjs(首页路线卡名单 + 细读页 arXiv 链接),零手工维护、不引入新主张;
//  ② DocReadBar 顶缘阅读进度条(真实滚动百分比,诚实遥测、非装饰假数);
//  ③ 可信度行内徽章化:把正文里的 ✅ / ⚠️ 字形包进统一徽章(只包字形不改文本,
//     代码块 / 链接 / 已包节点跳过,幂等可重入)。
// 三者仅在「细读页」(首页路线卡收录名单)生效;html.paper-page 供 CSS 定向。
// =====================================================================
const PAPER_BY_PATH = (() => {
  const m = {}
  for (const p of paperData.papers || []) m[p.link] = p
  return m
})()
function paperFromRoute(path) {
  const mm = (path || '').match(/\/(vla|wam)\/papers\/([\w-]+?)(?:\.html)?\/?$/)
  if (!mm) return null
  return PAPER_BY_PATH[`/${mm[1]}/papers/${mm[2]}`] || null
}

// ✅/⚠️ 行内徽章化:TreeWalker 扫正文文本节点,把字形原样包进 <span class="cred-mark">。
// 不增删任何字符 → 语料导出(llms.txt)与复制粘贴不受影响。
function decorateCredMarks() {
  if (typeof document === 'undefined') return
  const root = document.querySelector('.vp-doc')
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!/[✅⚠]/.test(n.nodeValue || '')) return NodeFilter.FILTER_REJECT
      if (n.parentElement && n.parentElement.closest('pre, code, a, script, style, .cred-mark')) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })
  const targets = []
  while (walker.nextNode()) targets.push(walker.currentNode)
  for (const node of targets) {
    const parts = (node.nodeValue || '').split(/(✅|⚠️|⚠)/)
    if (parts.length < 2) continue
    const frag = document.createDocumentFragment()
    for (const part of parts) {
      if (part === '✅' || part === '⚠️' || part === '⚠') {
        const s = document.createElement('span')
        s.className = 'cred-mark ' + (part === '✅' ? 'cred-mark--ok' : 'cred-mark--warn')
        s.textContent = part
        frag.appendChild(s)
      } else if (part) {
        frag.appendChild(document.createTextNode(part))
      }
    }
    node.parentNode && node.parentNode.replaceChild(frag, node)
  }
}

const PaperDossier = {
  setup() {
    const route = useRoute()
    const sync = (path) => {
      if (typeof document === 'undefined') return
      const isPaper = !!paperFromRoute(path)
      document.documentElement.classList.toggle('paper-page', isPaper)
      if (isPaper) {
        // 路由切换后正文已水合,双保险(rAF + 短延时)再做徽章化
        requestAnimationFrame(decorateCredMarks)
        setTimeout(decorateCredMarks, 180)
      }
    }
    onMounted(() => sync(route.path))
    watch(() => route.path, (p) => nextTick(() => sync(p)))
    onUnmounted(() => {
      if (typeof document !== 'undefined') document.documentElement.classList.remove('paper-page')
    })
    return () => {
      const p = paperFromRoute(route.path)
      if (!p) return null
      return h('aside', { class: 'paper-dossier', 'aria-label': '论文档案' }, [
        h('span', { class: 'pd-chip pd-chip--track', 'data-track': p.track }, p.track),
        h('span', { class: 'pd-chip pd-chip--route', style: { '--route-c': ROUTE_COLORS[p.route] || '#94a3b8' } }, p.route),
        p.date
          ? h('span', { class: 'pd-meta', title: p.arxivId ? 'arXiv ID 前四位派生的提交年月' : '发布年月(站内细读页核对)' }, '发布 ' + p.date)
          : null,
        p.arxivId
          ? h('a', { class: 'pd-link', href: `https://arxiv.org/abs/${p.arxivId}`, target: '_blank', rel: 'noopener' }, `arXiv:${p.arxivId} ↗`)
          : null,
        h('a', { class: 'pd-map', href: withBase(`${p.track === 'VLA' ? '/vla/' : '/wam/'}#${p.slug}`), title: '在调研总报告内的谱系图中定位本篇' }, '谱系图 ⌖'),
        h('span', { class: 'pd-legend', role: 'note' }, [
          h('span', { class: 'pd-lg pd-lg--ok', title: '✅ 经核查:基准维护方 / 独立来源可核' }, '✅ 已核'),
          h('span', { class: 'pd-lg pd-lg--warn', title: '⚠️ 厂商 / 作者自评,非第三方复现' }, '⚠️ 自评'),
          h('span', { class: 'pd-lg pd-lg--todo', title: '待核:一手源未给出,本站不编造' }, '待核'),
        ]),
      ])
    }
  },
}

const DocReadBar = {
  setup() {
    const route = useRoute()
    const pct = ref(0)
    let onScroll = null
    onMounted(() => {
      onScroll = () => {
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        pct.value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll, { passive: true })
    })
    onUnmounted(() => {
      if (onScroll) {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    })
    return () =>
      paperFromRoute(route.path)
        ? h('div', { class: 'doc-readbar', 'aria-hidden': 'true' }, [
            h('i', { class: 'doc-readbar__fill', style: { width: pct.value.toFixed(1) + '%' } }),
          ])
        : null
  },
}

// Hero 规模读出条(home-hero-actions-after):本站规模一览。
// 数字与 feature 卡口径完全一致(71 篇=VLA43+WAM28 · 50+ 基准 · 57 公司 · 2 主线),不引入任何新主张。
const HERO_STATS = [
  { n: '71', unit: '篇', label: '论文细读' },
  { n: '50+', unit: '', label: '评测基准' },
  { n: '57', unit: '家', label: '生态公司' },
  { n: '2', unit: '条', label: '研究主线' },
]
const HeroStats = {
  setup() {
    // 数字「读出」:进入首屏即从 0 计数到目标值(tabular mono → HUD 遥测感)。
    // 直接动 text 节点,保留 .hero-stat__n 的渐变裁切;reduced-motion 直接显示终值。
    onMounted(() => {
      if (typeof window === 'undefined') return
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      document.querySelectorAll('.VPHome .hero-stat__n').forEach((el) => {
        const tn = el.firstChild
        if (!tn || tn.nodeType !== 3) return
        const raw = (tn.nodeValue || '').trim()
        const m = raw.match(/(\d+)/)
        if (!m) return
        const target = parseInt(m[1], 10)
        if (!target) return
        const prefix = raw.slice(0, m.index)
        const suffix = raw.slice(m.index + m[1].length)
        tn.nodeValue = prefix + '0' + suffix
        setTimeout(() => {
          let start = null
          const tick = (ts) => {
            if (start === null) start = ts
            const p = Math.min(1, (ts - start) / 850)
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target)
            tn.nodeValue = prefix + v + suffix
            if (p < 1) requestAnimationFrame(tick)
            else tn.nodeValue = raw
          }
          requestAnimationFrame(tick)
        }, 360)
      })
    })
    return () =>
      h(
        'dl',
        { class: 'hero-stats', 'aria-label': '本站规模一览' },
        HERO_STATS.map((s, i) =>
          h('div', { class: 'hero-stat', style: { '--i': i } }, [
            h('dt', { class: 'hero-stat__n' }, [
              s.n,
              s.unit ? h('span', { class: 'hero-stat__unit' }, s.unit) : null,
            ]),
            h('dd', { class: 'hero-stat__label' }, s.label),
          ])
        )
      )
  },
}

// Hero 机器人:科技线稿概念图(public/hero-robot.svg);辉光 + 轻浮动见 custom.css
const HeroRobot = {
  setup() {
    return () =>
      h('div', { class: 'hero-robot-wrap' }, [
        h('img', {
          class: 'hero-robot-img',
          src: withBase('/hero-robot.svg'),
          alt: '具身智能机器人概念图',
        }),
      ])
  },
}

// =====================================================================
// Hero 科技感增强层(HeroFX):深空氛围(第二层星云 + 漂浮星场)+ HUD 接口
// (载入启动扫描 + 四角取景框)。注入于 home-hero-before(.VPHome 内、内容 z-index:1 之下,
// 与既有 grid/aurora 同为 z-index:0 背景层)。星点坐标确定性硬编码 → SSR 安全;
// 动效见 custom.css,reduced-motion 全关,深空 FX(星场/扫描)以暗色为主。
// =====================================================================
const FX_STARS = Array.from({ length: 64 }, (_, i) => ({
  x: (i * 73 + 13) % 100,
  y: (i * 41 + 7) % 100,
  s: i % 3 === 0 ? 2.4 : i % 3 === 1 ? 1.4 : 1.9,
  tw: 3 + (i % 5),
  dl: ((i % 7) * 0.4).toFixed(1),
}))
// 数据流光束:细竖线坠落(Tron 风);x 位置 + 时长 + 延迟,确定性。
const FX_BEAMS = [
  { x: 14, d: 5.5, dl: 0 }, { x: 30, d: 7, dl: 1.3 }, { x: 46, d: 6, dl: 2.6 },
  { x: 62, d: 8, dl: 0.7 }, { x: 78, d: 6.5, dl: 3.1 }, { x: 91, d: 7.5, dl: 1.9 },
]
// 电路数据包:沿背景网格的横线(44px 行距,与 .VPHome::before 同原点)滑行的信号光点;
// 行号 / 时长 / 延迟全部确定性(SSR 安全)。v2 加重:6 个、更快、可见窗口更长。
const FX_PACKETS = [
  { row: 2, d: 6.5, dl: 0.8, rev: 0 },
  { row: 4, d: 8, dl: 3.9, rev: 1 },
  { row: 6, d: 7, dl: 6.2, rev: 0 },
  { row: 9, d: 8.5, dl: 2.1, rev: 1 },
  { row: 11, d: 7.5, dl: 5.0, rev: 0 },
  { row: 13, d: 9, dl: 7.6, rev: 1 },
]
const HeroFX = {
  setup() {
    // 注:「指针感应网格」(光标吸附 44px 单元格)曾在此实现,应用户反馈「没必要」已整体移除;
    // 指针跟随类效果(准星/感应格)在本站已两次被否,勿再提案。
    return () =>
      h('div', { class: 'hero-fx', 'aria-hidden': 'true' }, [
        h('div', { class: 'hero-fx__glow' }),
        h(
          'div',
          { class: 'hero-fx__stars' },
          FX_STARS.map((st) =>
            h('i', {
              class: 'hero-fx__star',
              style: {
                left: st.x + '%',
                top: st.y + '%',
                '--s': st.s + 'px',
                '--tw': st.tw + 's',
                '--dl': st.dl + 's',
              },
            })
          )
        ),
        h(
          'div',
          { class: 'hero-fx__beams' },
          FX_BEAMS.map((b) =>
            h('i', {
              class: 'hero-fx__beam',
              style: { left: b.x + '%', '--bd': b.d + 's', '--bdl': b.dl + 's' },
            })
          )
        ),
        h(
          'div',
          { class: 'hero-fx__packets' },
          FX_PACKETS.map((p) =>
            h('i', {
              class: ['hero-fx__packet', p.rev ? 'is-rev' : ''],
              style: { top: `calc(${p.row} * 44px - 1px)`, '--pd': p.d + 's', '--pdl': p.dl + 's' },
            })
          )
        ),
        h('div', { class: 'hud-scan' }),
        h('span', { class: 'hud-corner hud-corner--tl' }),
        h('span', { class: 'hud-corner hud-corner--tr' }),
        h('span', { class: 'hud-corner hud-corner--bl' }),
        h('span', { class: 'hud-corner hud-corner--br' }),
      ])
  },
}

// =====================================================================
// 自定义科技 Hero(TechHero):跳出默认居中布局 → 不对称「终端 / HUD」版。
// 顶部状态读出条(闪烁光标)+ 大号渐变中文标题 + 等宽英文副标 + 「>」终端提示
// + 等宽按钮 + 实时读出条(数字 0→目标计数)+ 右侧机器人。内容取自 frontmatter.hero
// (单一来源,不重复维护);默认 .VPHero 由 custom.css 隐藏。reduced-motion 安全。
// =====================================================================
// 英文标题拆成「逐字」span(科幻入场:每个字母错峰点亮)。按词分组 + nowrap → 只在词间换行,词内不裂;
// span 全部 aria-hidden,父级用 aria-label 保留可读文本(屏幕阅读器读整句、不逐字念)。
function splitTitleChars(text) {
  const out = []
  let ci = 0
  text.split(' ').forEach((word, wi) => {
    if (wi > 0) out.push(' ') // 词间正常空格(可换行)
    out.push(
      h(
        'span',
        { class: 'thero__word' },
        word.split('').map((ch) =>
          h('span', { class: 'thero__char', 'aria-hidden': 'true', style: { '--ci': ci++ } }, ch)
        )
      )
    )
  })
  return out
}

// 打字机(开机序列用):清空后逐字回填,一次性;SSR / 无 JS / reduced-motion 下保持完整静态文本。
// keepHeight:打字前把父元素高度锁住,避免换行导致下方按钮跳动。
// 开机序列可跳过(2026-06-10;源:Vercel Web Interface Guidelines「Animations are
// cancelable by user input」):所有 JS 侧开机动效注册 finisher,任意 pointerdown/keydown
// → skipBoot() 瞬间定格终态,并给 <html> 加 .boot-done 定格 CSS 侧动画(见 custom.css)。
const bootFinishers = []
let bootSkipped = false
function skipBoot() {
  if (bootSkipped) return
  bootSkipped = true
  for (const fin of bootFinishers.splice(0)) {
    try { fin() } catch (e) {}
  }
  if (typeof document !== 'undefined') document.documentElement.classList.add('boot-done')
  window.removeEventListener('pointerdown', skipBoot, true)
  window.removeEventListener('keydown', skipBoot, true)
}
function armBootSkip() {
  bootSkipped = false
  document.documentElement.classList.remove('boot-done')
  window.addEventListener('pointerdown', skipBoot, true)
  window.addEventListener('keydown', skipBoot, true)
  // 开机自然结束(~2.4s)后自动收尾:清监听 + 定格终态(finisher 幂等,重复无害)
  setTimeout(skipBoot, 2600)
}
function typewrite(el, { delay = 0, cps = 55, keepHeight = false } = {}) {
  if (!el) return
  const full = el.textContent || ''
  if (!full) return
  if (keepHeight && el.parentElement) {
    el.parentElement.style.minHeight = el.parentElement.offsetHeight + 'px'
  }
  el.textContent = ''
  el.classList.add('is-typing')
  let i = 0
  let timer = null
  const st = setTimeout(() => {
    timer = setInterval(() => {
      i++
      el.textContent = full.slice(0, i)
      if (i >= full.length) {
        clearInterval(timer)
        el.classList.remove('is-typing')
      }
    }, Math.max(8, 1000 / cps))
  }, delay)
  bootFinishers.push(() => {
    clearTimeout(st)
    if (timer) clearInterval(timer)
    el.textContent = full
    el.classList.remove('is-typing')
  })
}

const TechHero = {
  setup() {
    const { frontmatter } = useData()
    // 真实走秒时钟(诚实遥测:真时钟、非装饰假数)。reduced-motion 下保留——它是内容更新,不是动效。
    const clock = ref('UTC+8 --:--:--')
    let clockTimer = null
    onMounted(() => {
      if (typeof window === 'undefined') return
      const tick = () => {
        try {
          clock.value = 'UTC+8 ' + new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false })
        } catch (e) {
          clock.value = 'UTC+8 ' + new Date().toLocaleTimeString('en-GB', { hour12: false })
        }
      }
      tick()
      clockTimer = setInterval(tick, 1000)
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      bindHeroUnit(reduce)
      bindHeroVideo(reduce)
      if (reduce) return
      // 开机序列:状态条 → 终端提示语,逐字打出(一次性;机器人物化见 custom.css robotMaterialize)
      armBootSkip()
      typewrite(document.querySelector('.thero__bar-text'), { delay: 120, cps: 70 })
      typewrite(document.querySelector('.thero__lede-text'), { delay: 700, cps: 45, keepHeight: true })
      document.querySelectorAll('.thero__stat-n').forEach((el) => {
        const tn = el.firstChild
        if (!tn || tn.nodeType !== 3) return
        const raw = (tn.nodeValue || '').trim()
        const m = raw.match(/(\d+)/)
        if (!m) return
        const target = parseInt(m[1], 10)
        if (!target) return
        const prefix = raw.slice(0, m.index)
        const suffix = raw.slice(m.index + m[1].length)
        tn.nodeValue = prefix + '0' + suffix
        let counterDone = false
        bootFinishers.push(() => {
          counterDone = true
          tn.nodeValue = raw
        })
        setTimeout(() => {
          let start = null
          const tick = (ts) => {
            if (counterDone) return
            if (start === null) start = ts
            const p = Math.min(1, (ts - start) / 900)
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target)
            tn.nodeValue = prefix + v + suffix
            if (p < 1) requestAnimationFrame(tick)
            else tn.nodeValue = raw
          }
          requestAnimationFrame(tick)
        }, 420)
      })
    })
    onUnmounted(() => {
      if (clockTimer) clearInterval(clockTimer)
      skipBoot() // 中途离开首页:立即定格并清掉全局监听(幂等)
    })
    return () => {
      const hero = (frontmatter.value && frontmatter.value.hero) || {}
      const actions = Array.isArray(hero.actions) ? hero.actions : []
      return h('section', { class: 'thero' }, [
        h('div', { class: 'thero__bar' }, [
          h('span', { class: 'thero__bar-dot' }),
          h('span', { class: 'thero__bar-text' }, 'SYSTEM ONLINE · EMBODIED-AI ARCHIVE · VLA × WAM · 2022—2026'),
          h('span', { class: 'thero__bar-clock' }, clock.value),
          h('span', { class: 'thero__bar-cursor' }),
        ]),
        h('div', { class: 'thero__grid' }, [
          h('div', { class: 'thero__main' }, [
            h('h1', { class: 'thero__title' }, [
              h('span', { class: 'thero__title-zh' }, hero.name || '具身智能学习站'),
              // 英文标题改 ShuffleText 逐字滑条洗牌入场(取代原逐字点亮),
              // 悬停可重播;组件根节点自带 aria-label,内部字符结构读屏不可见
              h(
                'span',
                { class: 'thero__title-shuffle' },
                [
                  h(ShuffleText, {
                    text: hero.text || 'Embodied AI Learning',
                    tag: 'span',
                    textAlign: 'left',
                    shuffleDirection: 'right',
                    duration: 0.35,
                    animationMode: 'evenodd',
                    shuffleTimes: 1,
                    ease: 'power3.out',
                    stagger: 0.03,
                    threshold: 0.1,
                    triggerOnce: true,
                    triggerOnHover: true,
                    respectReducedMotion: true,
                  }),
                ]
              ),
            ]),
            h('p', { class: 'thero__lede' }, [
              h('span', { class: 'thero__prompt' }, '> '),
              h('span', { class: 'thero__lede-text' }, hero.tagline || ''),
            ]),
            h(
              'div',
              { class: 'thero__cta' },
              actions.map((a) =>
                h(
                  'a',
                  {
                    class: ['thero__btn', a.theme === 'brand' ? 'thero__btn--brand' : ''],
                    href: withBase(a.link || '/'),
                  },
                  a.text || ''
                )
              )
            ),
            h(
              'dl',
              { class: 'thero__readout', 'aria-label': '本站规模一览' },
              HERO_STATS.map((s, i) =>
                h('div', { class: 'thero__stat', style: { '--i': i } }, [
                  h('dt', { class: 'thero__stat-n' }, [
                    s.n,
                    s.unit ? h('span', { class: 'thero__stat-unit' }, s.unit) : null,
                  ]),
                  h('dd', { class: 'thero__stat-label' }, s.label),
                ])
              )
            ),
          ]),
          h('div', { class: 'thero__visual' }, [
            h('div', { class: 'thero__unit' }, [
              h('span', { class: 'tu-corner tu-corner--tl' }),
              h('span', { class: 'tu-corner tu-corner--tr' }),
              h('span', { class: 'tu-corner tu-corner--bl' }),
              h('span', { class: 'tu-corner tu-corner--br' }),
              h('span', { class: 'tu-tag tu-tag--tl' }, 'EMBODIED-UNIT'),
              h('span', { class: 'tu-tag tu-tag--tr' }, 'VLA · WAM'),
              h('div', { class: 'thero__robot-wrap thero__robot-wrap--laser', title: '点我 · 单元会回应' }, [
                // 镭光人概念视频(public/hero-laser-human.mp4,自托管):桌面精确指针
                // = 鼠标推扫逐帧(bindHeroVideo),窄屏/触屏 = 静音循环播放,reduced-motion = 静帧
                h('video', {
                  class: 'thero__robot thero__robot--video',
                  src: withBase('/hero-laser-human.mp4'),
                  muted: true,
                  playsinline: true,
                  'webkit-playsinline': true,
                  preload: 'auto',
                  loop: true,
                  'aria-label': '镭光人 · 具身智能概念视频',
                }),
                h('span', { class: 'tu-mat', 'aria-hidden': 'true' }),
              ]),
              h('span', { class: 'tu-scan', 'aria-hidden': 'true' }),
              h('span', { class: 'tu-base' }, [
                h('span', { class: 'tu-base-dot' }),
                h('span', { class: 'tu-base-text' }, '运行中 · ONLINE'),
              ]),
            ]),
          ]),
        ]),
      ])
    }
  },
}

// =====================================================================
// 右缘章节定位轨(HomeRail):HERO / VLA / WAM / ABOUT 四节点,滚动高亮、点击平滑跳转。
// 真导航非装饰:分区从 DOM 实测(h2 / coda),标签取 h2 冒号前缀;仅 ≥1280px 显示。
// 随 home-hero-before 槽只在首页挂载;SSR 首帧渲染 null(分区列表 mounted 后才有)。
// =====================================================================
const HomeRail = {
  setup() {
    const items = ref([])
    const active = ref(0)
    let onScroll = null
    onMounted(() => {
      if (typeof document === 'undefined') return
      const list = []
      const hero = document.querySelector('.VPHome .thero')
      if (hero) list.push({ label: 'HERO', el: hero })
      document.querySelectorAll('.VPHome .vp-doc h2').forEach((h2) => {
        const label = ((h2.textContent || '').split(/[::]/)[0] || 'SEC').trim().toUpperCase().slice(0, 6)
        list.push({ label, el: h2 })
      })
      const coda = document.querySelector('.VPHome .home-coda')
      if (coda) list.push({ label: 'ABOUT', el: coda })
      if (list.length < 2) return
      items.value = list
      onScroll = () => {
        const mid = window.scrollY + window.innerHeight * 0.38
        let idx = 0
        list.forEach((it, i) => {
          if (it.el.getBoundingClientRect().top + window.scrollY <= mid) idx = i
        })
        active.value = idx
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    })
    onUnmounted(() => {
      if (onScroll) window.removeEventListener('scroll', onScroll)
    })
    const go = (it) => {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      it.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
    const renderRail = () =>
      h(
        'nav',
        { class: 'home-rail', 'aria-label': '页面分区导航' },
        items.value.map((it, i) =>
          h(
            'button',
            {
              class: ['home-rail__item', { 'is-active': i === active.value }],
              type: 'button',
              onClick: () => go(it),
              'aria-current': i === active.value ? 'true' : undefined,
            },
            [h('i', { class: 'home-rail__dot' }), h('span', { class: 'home-rail__label' }, it.label)]
          )
        )
      )
    return () => (!items.value.length ? null : h(Teleport, { to: 'body' }, [renderRail()]))
  },
}

// =====================================================================
// 自定义轻量灯箱:点击/键盘放大流程图(Mermaid SVG)或论文框架图
// =====================================================================
let bound = false

function setupLightbox() {
  if (bound || typeof document === 'undefined') return
  bound = true

  const overlay = document.createElement('div')
  overlay.className = 'zoom-lightbox'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', '放大预览,按 Esc 关闭')
  overlay.tabIndex = -1
  const stage = document.createElement('div')
  stage.className = 'zoom-lightbox__stage'
  overlay.appendChild(stage)
  document.body.appendChild(overlay)

  let lastFocused = null

  const close = () => {
    overlay.classList.remove('is-open')
    if (lastFocused && lastFocused.focus) lastFocused.focus()
    lastFocused = null
    setTimeout(() => {
      stage.innerHTML = ''
    }, 180)
  }

  const open = (node) => {
    lastFocused = document.activeElement
    stage.innerHTML = ''
    const clone = node.cloneNode(true)
    const isSvg = clone.tagName.toLowerCase() === 'svg'
    clone.removeAttribute('style')
    clone.removeAttribute('tabindex')
    clone.removeAttribute('role')
    clone.removeAttribute('aria-label')
    if (isSvg) {
      clone.removeAttribute('width')
      clone.removeAttribute('height')
    }
    clone.classList.add('zoom-lightbox__content')
    stage.appendChild(clone)
    overlay.classList.add('is-open')
    // 等可见性生效后再移焦点入对话框(visibility:hidden 元素无法聚焦)
    requestAnimationFrame(() => overlay.focus())
  }

  const resolveTarget = (t) => {
    if (!t || !t.closest) return null
    const svg = t.closest('.vp-doc .mermaid svg')
    if (svg) return svg
    if (t.tagName === 'IMG' && t.closest('.vp-doc p')) return t
    return null
  }

  overlay.addEventListener('click', close)

  document.addEventListener('keydown', (e) => {
    // 对话框打开时:Esc 关闭,Tab 困在对话框内(简易焦点陷阱)
    if (overlay.classList.contains('is-open')) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        overlay.focus()
      }
      return
    }
    // 未打开时:Enter / Space 在可放大元素上触发放大
    if (e.key === 'Enter' || e.key === ' ') {
      const node = resolveTarget(document.activeElement)
      if (node) {
        e.preventDefault()
        open(node)
      }
    }
  })

  document.addEventListener('click', (e) => {
    const node = resolveTarget(e.target)
    if (!node) return
    e.preventDefault()
    e.stopPropagation()
    open(node)
  })

  // 将可放大元素标记为可聚焦 + 语义(兼容 Mermaid 异步渲染)
  const tagZoomable = () => {
    document.querySelectorAll('.vp-doc .mermaid svg, .vp-doc p > img').forEach((el) => {
      if (el.dataset.zoomable) return
      el.dataset.zoomable = '1'
      el.setAttribute('tabindex', '0')
      el.setAttribute('role', 'button')
      const isSvg = el.tagName.toLowerCase() === 'svg'
      const base = isSvg ? '流程图' : el.getAttribute('alt') || '图片'
      el.setAttribute('aria-label', `${base},按 Enter 放大`)
    })
  }
  tagZoomable()
  if ('MutationObserver' in window) {
    let debounce
    new MutationObserver(() => {
      clearTimeout(debounce)
      debounce = setTimeout(tagZoomable, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 惊喜层(delight):仅主页 + 全站控制台签名。克制、双皮肤通用、reduced-motion 安全。
//  ① 控制台签名(面向开发者/研究者,附开源链接 + 彩蛋提示)
//  ② Hero 机器人悬停"抬头"(见 custom.css)
//  ③ Konami(↑↑↓↓←→←→BA)→ 机器人庆祝旋转 + ⊕/✦ 粒子 + 轻提示
// =====================================================================
// 轻提示 toast(delight 通用)
function delightToast(msg) {
  const toast = document.createElement('div')
  toast.className = 'delight-toast'
  toast.textContent = msg
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('is-in'))
  setTimeout(() => { toast.classList.remove('is-in'); setTimeout(() => toast.remove(), 420) }, 2600)
}

// Hero 全息单元交互:悬停问候 + 指针视差倾斜 + 点击核心脉冲与「角色内」台词 + 连点成就。
// 台词均与本站内容强相关(VLA π 策略 / WAM 世界模型 / 动作分块 / 三级可信度),非通用填充。
const ROBOT_DEFAULT = '运行中 · ONLINE'
const ROBOT_HELLO = '你好,研究员 · HELLO'
const ROBOT_LINES = [
  '校准位姿 · CALIBRATING',
  '载入策略 · π-POLICY',
  '想象未来 · WORLD-MODEL',
  '动作分块 · ACTION-CHUNK',
  '自评存疑,待复现 · ⚠',
  '双主线就绪 · VLA × WAM',
]
// =====================================================================
// 镭光人视频交互(spec: Native Scrubbing 移植)+ 实时抠像:
// 源片是浅紫白底,直接上屏要么成卡片要么得羽化(均被否)→ 视频仅作隐藏解码源,
// 可见层为 canvas:每帧方裁右对齐绘入,采四角均值作底色参考,从边缘做容差泛洪
// (只清除与边缘连通的底色,人物内部的白高光不受伤),命中像素置全透明、
// 邻接像素半透明作 1px 软边——人物以透明底直接立在页面上(与旧 SVG 机器人同款承载)。
// 模式:① 桌面(pointer:fine + ≥1024 + 允许动效)= 鼠标推扫,(ΔX/视宽)*0.8*时长,
//        seeked 节流,每次 seek 完成重抠重绘;
//      ② 窄屏 / 触屏 = 静音循环自动播放,requestVideoFrameCallback(降级 rAF)逐帧抠;
//      ③ prefers-reduced-motion = 只抠首帧静像。
// =====================================================================
function bindHeroVideo(reduce) {
  if (typeof document === 'undefined') return
  const video = document.querySelector('.thero__robot--video')
  if (!video || video.dataset.scrub) return
  video.dataset.scrub = '1'
  video.muted = true
  let readyMarked = false
  const markReady = () => {
    if (readyMarked) return
    readyMarked = true
    video.dataset.ready = '1'
    const keyed = video.parentElement?.querySelector('.thero__robot--keyed')
    if (keyed) keyed.dataset.ready = '1'
  }
  video.addEventListener('error', markReady, { once: true })
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  const SIZE = fine ? 720 : 480
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  canvas.className = 'thero__robot thero__robot--keyed'
  canvas.setAttribute('role', 'img')
  canvas.setAttribute('aria-label', '镭光人 · 具身智能概念视频')
  video.insertAdjacentElement('afterend', canvas)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  const N = SIZE * SIZE
  const queue = new Int32Array(N)
  const visited = new Uint8Array(N)
  const maskA = new Uint8Array(N)
  const maskB = new Uint8Array(N)
  const keyFrame = () => {
    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh || video.readyState < 2) return
    const s = Math.min(vw, vh)
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.drawImage(video, vw - s, 0, s, s, 0, 0, SIZE, SIZE)
    let img
    try { img = ctx.getImageData(0, 0, SIZE, SIZE) } catch (e) { return }
    const d = img.data
    // 底色参考 = 四角均值(逐帧自适应光照/暗角)
    let rr = 0, rg = 0, rb = 0
    for (const p of [(2 * SIZE + 2), (2 * SIZE + SIZE - 3), ((SIZE - 3) * SIZE + 2), ((SIZE - 3) * SIZE + SIZE - 3)]) {
      rr += d[p * 4]; rg += d[p * 4 + 1]; rb += d[p * 4 + 2]
    }
    rr /= 4; rg /= 4; rb /= 4
    const TOL2 = 56 * 56
    visited.fill(0)
    let qh = 0
    let qt = 0
    const tryPush = (p) => {
      if (visited[p]) return
      const i = p * 4
      const dr = d[i] - rr, dg = d[i + 1] - rg, db = d[i + 2] - rb
      if (dr * dr + dg * dg + db * db < TOL2) { visited[p] = 1; queue[qt++] = p }
    }
    for (let x = 0; x < SIZE; x++) { tryPush(x); tryPush(N - SIZE + x) }
    for (let y = 1; y < SIZE - 1; y++) { tryPush(y * SIZE); tryPush(y * SIZE + SIZE - 1) }
    while (qh < qt) {
      const p = queue[qh++]
      const x = p % SIZE
      if (x > 0) tryPush(p - 1)
      if (x < SIZE - 1) tryPush(p + 1)
      if (p >= SIZE) tryPush(p - SIZE)
      if (p < N - SIZE) tryPush(p + SIZE)
    }
    // —— 边缘整形:收边 1px(去沾底色的最外圈)→ 两道 3×3 盒模糊软化蒙版 → 去边 ——
    for (let p = 0; p < N; p++) maskA[p] = visited[p] ? 0 : 255
    for (let p = 0; p < N; p++) {
      if (!maskA[p]) { maskB[p] = 0; continue }
      const x = p % SIZE
      maskB[p] =
        (x > 0 && !maskA[p - 1]) || (x < SIZE - 1 && !maskA[p + 1]) || (p >= SIZE && !maskA[p - SIZE]) || (p < N - SIZE && !maskA[p + SIZE])
          ? 0
          : 255
    }
    // 两轮 H+V 盒模糊(半径 1,边界夹取)≈ 高斯软化,过渡带约 4px
    for (let round = 0; round < 2; round++) {
      for (let p = 0; p < N; p++) {
        const x = p % SIZE
        const l = x > 0 ? maskB[p - 1] : maskB[p]
        const r = x < SIZE - 1 ? maskB[p + 1] : maskB[p]
        maskA[p] = (l + maskB[p] + r) / 3
      }
      for (let p = 0; p < N; p++) {
        const u = p >= SIZE ? maskA[p - SIZE] : maskA[p]
        const dn = p < N - SIZE ? maskA[p + SIZE] : maskA[p]
        maskB[p] = (u + maskA[p] + dn) / 3
      }
    }
    for (let p = 0; p < N; p++) {
      const a = maskB[p]
      const i = p * 4
      d[i + 3] = a
      // 去边:半透明过渡像素按 alpha 反混掉底色成分,消除浅紫描边
      if (a > 24 && a < 250) {
        d[i] = Math.max(0, Math.min(255, (d[i] * 255 - (255 - a) * rr) / a))
        d[i + 1] = Math.max(0, Math.min(255, (d[i + 1] * 255 - (255 - a) * rg) / a))
        d[i + 2] = Math.max(0, Math.min(255, (d[i + 2] * 255 - (255 - a) * rb) / a))
      }
    }
    ctx.putImageData(img, 0, 0)
    markReady()
  }
  const paintWhenReady = () => {
    if (video.readyState >= 2) keyFrame()
    else video.addEventListener('loadeddata', keyFrame, { once: true })
  }
  if (reduce) {
    paintWhenReady()
    return
  }
  if (!fine || window.innerWidth < 1024) {
    // —— 自动播放模式:逐帧抠像 ——
    video.autoplay = true
    const p = video.play()
    if (p && p.catch) p.catch(() => {})
    if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
      const onFrame = () => { keyFrame(); video.requestVideoFrameCallback(onFrame) }
      video.requestVideoFrameCallback(onFrame)
    } else {
      const loop = () => { keyFrame(); requestAnimationFrame(loop) }
      requestAnimationFrame(loop)
    }
    return
  }
  // —— 桌面推扫模式 ——
  paintWhenReady()
  let prevX = null
  let target = 0
  let seeking = false
  const apply = () => {
    if (seeking || !Number.isFinite(video.duration) || video.duration <= 0) return
    const clamped = Math.max(0, Math.min(video.duration - 0.05, target))
    if (Math.abs(clamped - video.currentTime) < 0.02) return
    seeking = true
    try { video.currentTime = clamped } catch (e) { seeking = false }
  }
  video.addEventListener('seeked', () => {
    seeking = false
    keyFrame()
    apply()
  })
  window.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth < 1024) return
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      if (prevX === null) {
        prevX = e.clientX
        return
      }
      const delta = e.clientX - prevX
      prevX = e.clientX
      target = Math.max(0, Math.min(video.duration, target + (delta / window.innerWidth) * 0.8 * video.duration))
      apply()
    },
    { passive: true }
  )
}

function bindHeroUnit(reduce) {
  if (typeof document === 'undefined') return
  const hero = document.querySelector('.VPHome .thero')
  const unit = document.querySelector('.thero__unit')
  if (!unit || unit.dataset.delight) return
  unit.dataset.delight = '1'
  const wrap = unit.querySelector('.thero__robot-wrap')
  const baseText = unit.querySelector('.tu-base-text')
  if (!wrap) return
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  const resetLook = () => {
    wrap.style.setProperty('--ry', '0deg')
    wrap.style.setProperty('--rx', '0deg')
    wrap.style.setProperty('--look-ry', '0deg')
    wrap.style.setProperty('--look-rx', '0deg')
    wrap.style.setProperty('--gaze-x', '0px')
    wrap.style.setProperty('--gaze-y', '0px')
  }
  if (fine && !reduce) {
    const followPointer = (e) => {
      const r = unit.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      const hx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width * 0.5)) / (r.width * 0.62)))
      const hy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height * 0.28)) / (r.height * 0.58)))
      wrap.style.setProperty('--ry', (px * 10).toFixed(2) + 'deg')
      wrap.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg')
      wrap.style.setProperty('--look-ry', (hx * -12).toFixed(2) + 'deg')
      wrap.style.setProperty('--look-rx', (hy * 7).toFixed(2) + 'deg')
      wrap.style.setProperty('--gaze-x', (hx * 13).toFixed(1) + 'px')
      wrap.style.setProperty('--gaze-y', (hy * 9).toFixed(1) + 'px')
    }
    ;(hero || unit).addEventListener('pointermove', followPointer, { passive: true })
    ;(hero || unit).addEventListener('pointerleave', resetLook, { passive: true })
  }
  unit.addEventListener('pointerenter', () => { if (baseText) baseText.textContent = ROBOT_HELLO })
  unit.addEventListener('pointerleave', () => {
    resetLook()
    if (baseText) baseText.textContent = ROBOT_DEFAULT
  })
  let clicks = 0
  wrap.addEventListener('click', () => {
    clicks++
    if (baseText) baseText.textContent = ROBOT_LINES[(clicks - 1) % ROBOT_LINES.length]
    if (!reduce) {
      const p = document.createElement('span')
      p.className = 'tu-pulse'
      p.setAttribute('aria-hidden', 'true')
      wrap.appendChild(p)
      setTimeout(() => p.remove(), 900)
    }
    if (clicks === 5) delightToast('🛰 单元已校准 · 继续探索 ⊕')
  })
}

// =====================================================================
// 首页功能卡「椭圆旋转环」中央能量核标签注入(纯装饰,aria-hidden)。
// .VPFeatures .items 是 SPA 重建节点 → 注入一次后用 MutationObserver 兜底重注;
// 标签默认 display:none,仅 ≥1080px 环形 media 内显形(见 custom.css)。
// =====================================================================
function setupFeatureHub() {
  if (typeof document === 'undefined') return
  const inject = () => {
    const items = document.querySelector('.VPHome .VPFeatures .items')
    if (!items) return
    // 中央机器人
    if (!items.querySelector('.feat-hub')) {
      const hub = document.createElement('div')
      hub.className = 'feat-hub'
      hub.setAttribute('aria-hidden', 'true')
      const img = document.createElement('img')
      img.className = 'feat-hub__robot'
      img.src = withBase('/hero-robot.svg')
      img.alt = '具身智能机器人'
      hub.appendChild(img)
      items.appendChild(hub)
    }
    // 轨道线:沿卡片同一 3D 公式 (rx·sinθ, -yt·cosθ, -rz·cosθ) 撒点 → 精确勾出卡片轨迹。
    // 60 个静止点(密=更像实线)+ 4 个沿轨道流动的能量脉冲(--a 动画,能量在轨道上跑)。
    if (!items.querySelector('.feat-orbit-dot')) {
      const N = 90
      for (let i = 0; i < N; i++) {
        const d = document.createElement('i')
        d.className = 'feat-orbit-dot'
        d.style.setProperty('--a', (i * (360 / N)).toFixed(2) + 'deg')
        d.setAttribute('aria-hidden', 'true')
        items.appendChild(d)
      }
      const P = 4
      for (let i = 0; i < P; i++) {
        const p = document.createElement('i')
        p.className = 'feat-orbit-pulse'
        p.style.setProperty('--p', i)
        p.setAttribute('aria-hidden', 'true')
        items.appendChild(p)
      }
    }
  }
  inject()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(inject, 150)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 滚动入场(scroll-reveal):首页正文区块进入视口时错峰升起。
// 仅给元素「加 .reveal-up class」→ 无 JS 时元素从不隐藏;reduced-motion 直接跳过 → 全部照常显示。
// 隐藏/动画终态见 custom.css(@media no-preference 内,用独立 translate,不干扰卡片 hover transform)。
// 目标:章节标题 / 引导段 / 路线卡(网格内左→右错峰)/ 关于×继续 合并卡。环形 Feature 卡不动(其 transform 即轨道位姿)。
// =====================================================================
let revealBound = false
function setupReveal() {
  if (revealBound || typeof window === 'undefined') return
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return
  revealBound = true
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
  )
  const add = (el, delay) => {
    if (!el || el.dataset.reveal) return
    el.dataset.reveal = '1'
    if (delay) el.style.setProperty('--rd', delay.toFixed(2) + 's')
    el.classList.add('reveal-up')
    io.observe(el)
  }
  const scan = () => {
    const doc = document.querySelector('.VPHome .vp-doc')
    if (!doc) return
    // 正文被两层匿名 wrapper 包着(.vp-doc > div > div > 区块);以 route-grid 的父级为准定位真正的区块容器,避免写死层级
    const anyGrid = doc.querySelector('.route-grid')
    const container = anyGrid
      ? anyGrid.parentElement
      : doc.querySelector(':scope > div > div') || doc.querySelector(':scope > div') || doc
    container
      .querySelectorAll(':scope > h2, :scope > p, :scope > blockquote, :scope > .home-coda')
      .forEach((el) => add(el, 0.04))
    container.querySelectorAll(':scope > .route-grid').forEach((grid) => {
      Array.from(grid.children).forEach((card, i) => add(card, 0.06 * (i + 1)))
    })
  }
  scan()
  // SPA 切回首页 / markdown 异步水合:兜底重扫(已标 data-reveal 的跳过)
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(scan, 160)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// VLA/WAM 路线卡 强化悬停:注入光斑层 + 随光标 3D 倾斜(--rx/--ry 倾角、--mx/--my 光斑位置)。
// 仅 pointer:fine + 允许动效时绑定倾斜;光斑层始终注入(CSS 控制悬停显隐)。SPA 重建 → MutationObserver 兜底重绑。
// =====================================================================
let cardTiltBound = false
function setupCardTilt() {
  if (cardTiltBound || typeof window === 'undefined') return
  cardTiltBound = true
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bind = () => {
    document.querySelectorAll('.VPHome .route-card').forEach((card) => {
      if (card.dataset.tilt) return
      card.dataset.tilt = '1'
      if (!card.querySelector('.route-card__spot')) {
        const spot = document.createElement('i')
        spot.className = 'route-card__spot'
        spot.setAttribute('aria-hidden', 'true')
        card.insertBefore(spot, card.firstChild)
      }
      if (!fine || reduce) return
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%')
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%')
        card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg')
        card.style.setProperty('--rx', (-(py - 0.5) * 8).toFixed(2) + 'deg')
      })
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg')
        card.style.setProperty('--ry', '0deg')
      })
    })
  }
  bind()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(bind, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 路线卡 BorderGlow(React Bits BorderGlow 适配版):指针靠近卡片边缘时,
// 朝向光标的锥形区亮起「网格渐变描边 + 内缘辉光」。原版是独立包装组件
// (自带底色/圆角/外溢辉光);此处适配为注入两层 <i>(.bgw-border 锥形遮罩
// 1.5px 渐变环 / .bgw-light 内缘辉光),JS 仅按原版公式写 --edge-proximity
// 与 --cursor-angle 两个变量,视觉全在 custom.css;外溢辉光因卡片
// overflow:hidden(裁流光所需)改为内缘式。仅精确指针绑定;SPA 重建经
// MutationObserver 兜底。
// =====================================================================
let borderGlowBound = false
function setupBorderGlow() {
  if (borderGlowBound || typeof window === 'undefined') return
  borderGlowBound = true
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  if (!fine) return
  const bind = () => {
    document.querySelectorAll('.VPHome .route-card').forEach((card) => {
      if (card.dataset.bgw) return
      card.dataset.bgw = '1'
      const ring = document.createElement('i')
      ring.className = 'bgw-border'
      ring.setAttribute('aria-hidden', 'true')
      const light = document.createElement('i')
      light.className = 'bgw-light'
      light.setAttribute('aria-hidden', 'true')
      card.append(ring, light)
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        const cx = r.width / 2
        const cy = r.height / 2
        const dx = x - cx
        const dy = y - cy
        const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity
        const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity
        const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
        let ang = Math.atan2(dy, dx) * (180 / Math.PI) + 90
        if (ang < 0) ang += 360
        card.style.setProperty('--edge-proximity', (edge * 100).toFixed(2))
        card.style.setProperty('--cursor-angle', ang.toFixed(2) + 'deg')
      })
    })
  }
  bind()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(bind, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 首页卡片 ElectricBorder(React Bits ElectricBorder 适配版):不包裹组件树,
// 而是向 Feature 卡 / 路线卡注入一层 canvas。hover/focus 时才启动 rAF,
// 使用原组件的 rounded-rect 采样 + 分形噪声位移生成电流描边;离开后保留
// 最后一帧配合 CSS 淡出,再清空画布。避免给常驻环形 Feature 动画继续加负担。
// =====================================================================
let electricBorderBound = false
const ELECTRIC_CARD_SELECTOR = '.VPHome .VPFeature, .VPHome .route-card'
const ELECTRIC_COLORS = ['#7df9ff', '#67e8f9', '#60a5fa', '#a78bfa']

function electricRandom(x) {
  return (Math.sin(x * 12.9898) * 43758.5453) % 1
}

function electricNoise2D(x, y) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const a = electricRandom(i + j * 57)
  const b = electricRandom(i + 1 + j * 57)
  const c = electricRandom(i + (j + 1) * 57)
  const d = electricRandom(i + 1 + (j + 1) * 57)
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy
}

function electricOctavedNoise(x, octaves, lacunarity, gain, amplitude, frequency, time, seed, baseFlatness) {
  let y = 0
  let amp = amplitude
  let freq = frequency
  for (let i = 0; i < octaves; i++) {
    y += amp * (i === 0 ? baseFlatness : 1) * electricNoise2D(freq * x + seed * 100, time * freq * 0.3)
    freq *= lacunarity
    amp *= gain
  }
  return y
}

function electricCornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
  const angle = startAngle + progress * arcLength
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  }
}

function electricRoundedRectPoint(t, left, top, width, height, radius) {
  const straightWidth = Math.max(0, width - 2 * radius)
  const straightHeight = Math.max(0, height - 2 * radius)
  const cornerArc = Math.PI * radius / 2
  const total = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc
  const distance = t * total
  let acc = 0

  if (straightWidth > 0 && distance <= acc + straightWidth) {
    const p = (distance - acc) / straightWidth
    return { x: left + radius + p * straightWidth, y: top }
  }
  acc += straightWidth

  if (cornerArc > 0 && distance <= acc + cornerArc) {
    return electricCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - acc) / cornerArc)
  }
  acc += cornerArc

  if (straightHeight > 0 && distance <= acc + straightHeight) {
    const p = (distance - acc) / straightHeight
    return { x: left + width, y: top + radius + p * straightHeight }
  }
  acc += straightHeight

  if (cornerArc > 0 && distance <= acc + cornerArc) {
    return electricCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - acc) / cornerArc)
  }
  acc += cornerArc

  if (straightWidth > 0 && distance <= acc + straightWidth) {
    const p = (distance - acc) / straightWidth
    return { x: left + width - radius - p * straightWidth, y: top + height }
  }
  acc += straightWidth

  if (cornerArc > 0 && distance <= acc + cornerArc) {
    return electricCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - acc) / cornerArc)
  }
  acc += cornerArc

  if (straightHeight > 0 && distance <= acc + straightHeight) {
    const p = (distance - acc) / straightHeight
    return { x: left, y: top + height - radius - p * straightHeight }
  }
  acc += straightHeight

  if (cornerArc > 0) {
    return electricCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - acc) / cornerArc)
  }
  return { x: left, y: top }
}

function createElectricBorder(card, canvas, { overflow = 18 } = {}) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  let width = 0
  let height = 0
  let dpr = 1
  let raf = 0
  let running = false
  let lastFrame = 0
  let time = Math.random() * 10
  let clearTimer = 0

  const resize = () => {
    const rect = card.getBoundingClientRect()
    const nextWidth = Math.max(1, Math.ceil(rect.width + overflow * 2))
    const nextHeight = Math.max(1, Math.ceil(rect.height + overflow * 2))
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return
    width = nextWidth
    height = nextHeight
    dpr = nextDpr
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
  }

  const clear = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawPath = (color, lineWidth, shadowBlur, alpha, noiseSeed) => {
    const style = window.getComputedStyle(card)
    const radius = Math.min(parseFloat(style.borderTopLeftRadius) || 8, (width - overflow * 2) / 2, (height - overflow * 2) / 2)
    const borderWidth = Math.max(1, width - overflow * 2)
    const borderHeight = Math.max(1, height - overflow * 2)
    const perimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius
    const sampleCount = Math.max(96, Math.min(360, Math.floor(perimeter / 3)))

    ctx.beginPath()
    for (let i = 0; i <= sampleCount; i++) {
      const progress = i / sampleCount
      const point = electricRoundedRectPoint(progress, overflow, overflow, borderWidth, borderHeight, radius)
      const xNoise = electricOctavedNoise(progress * 8 + noiseSeed, 8, 1.6, 0.7, 0.12, 10, time, 0, 0)
      const yNoise = electricOctavedNoise(progress * 8 + noiseSeed, 8, 1.6, 0.7, 0.12, 10, time, 1, 0)
      const x = point.x + xNoise * 34
      const y = point.y + yNoise * 34
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = color
    ctx.shadowBlur = shadowBlur
    ctx.globalAlpha = alpha
    ctx.stroke()
  }

  const frame = (now) => {
    if (!running) return
    resize()
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0
    lastFrame = now
    time += delta * 1.15
    clear()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const color = getComputedStyle(card).getPropertyValue('--electric-border-color').trim() || '#7df9ff'
    drawPath(color, 2.4, 15, 0.58, 0)
    drawPath(color, 1.1, 4, 0.95, 1.7)
    ctx.globalAlpha = 1
    ctx.shadowBlur = 0
    raf = window.requestAnimationFrame(frame)
  }

  const observer = 'ResizeObserver' in window ? new ResizeObserver(resize) : null
  observer?.observe(card)
  resize()

  return {
    start() {
      window.clearTimeout(clearTimer)
      if (running) return
      running = true
      lastFrame = 0
      raf = window.requestAnimationFrame(frame)
    },
    stop() {
      running = false
      if (raf) window.cancelAnimationFrame(raf)
      raf = 0
      clearTimer = window.setTimeout(clear, 260)
    },
    disconnect() {
      running = false
      if (raf) window.cancelAnimationFrame(raf)
      observer?.disconnect()
      clear()
    },
  }
}

function setupElectricBorder() {
  if (electricBorderBound || typeof window === 'undefined') return
  electricBorderBound = true
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce) return

  const bind = () => {
    document.querySelectorAll(ELECTRIC_CARD_SELECTOR).forEach((card, index) => {
      if (card.dataset.electricBorder) return
      card.dataset.electricBorder = '1'
      card.classList.add('electric-card')
      card.style.setProperty('--electric-border-color', ELECTRIC_COLORS[index % ELECTRIC_COLORS.length])
      const canvas = document.createElement('canvas')
      canvas.className = 'electric-border-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      canvas.style.inset = '-18px'
      card.appendChild(canvas)
      const controller = createElectricBorder(card, canvas)
      if (!controller) return
      card.addEventListener('pointerenter', controller.start)
      card.addEventListener('pointerleave', controller.stop)
      card.addEventListener('focusin', controller.start)
      card.addEventListener('focusout', (event) => {
        if (!card.contains(event.relatedTarget)) controller.stop()
      })
    })
  }

  bind()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(bind, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 路线卡「×N 入口计数」chip:从 DOM 数出每张卡的链接数,追加到链接区末尾。
// 数字完全派生自页面已有链接 → 不引入第 5 个手工维护的「篇数」面,永不失同步。
// SPA 重建 → MutationObserver 兜底重注(已注入的卡跳过)。
// =====================================================================
let routeCountBound = false
function setupRouteCounts() {
  if (routeCountBound || typeof document === 'undefined') return
  routeCountBound = true
  const inject = () => {
    document.querySelectorAll('.VPHome .route-links').forEach((box) => {
      if (box.querySelector('.route-count')) return
      const n = box.querySelectorAll('a').length
      if (!n) return
      const s = document.createElement('span')
      s.className = 'route-count'
      s.textContent = '×' + n
      s.title = `本卡 ${n} 个细读入口`
      box.appendChild(s)
    })
  }
  inject()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(inject, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

let delightBound = false
function celebrateRobot() {
  delightToast('🤖 你发现了彩蛋 — ⊕ keep researching')
  const wrap = document.querySelector('.VPHome .thero__robot-wrap')
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!wrap || reduce) return
  wrap.classList.remove('delight-spin')
  void wrap.offsetWidth
  wrap.classList.add('delight-spin')
  const marks = ['⊕', '✦', '◆', '✕']
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span')
    s.className = 'delight-particle'
    s.textContent = marks[i % marks.length]
    const ang = (Math.PI * 2 * i) / 14
    const dist = 90 + (i % 3) * 26
    s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px')
    s.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px')
    wrap.appendChild(s)
    setTimeout(() => s.remove(), 1300)
  }
}
function setupDelight() {
  if (delightBound || typeof window === 'undefined') return
  delightBound = true
  try {
    console.log(
      '%c⊕ 具身智能学习站 · Embodied AI Learning',
      'color:#2563eb;font-weight:700;font-size:14px'
    )
    console.log(
      '%cVLA × WAM 研究档案 · 多源检索 + 对抗式事实核查\n开源 https://github.com/ZhuYun97/embodied-ai-learning\n彩蛋:在主页试试  ↑ ↑ ↓ ↓ ← → ← → B A',
      'color:#64748b;font-size:12px;line-height:1.7'
    )
  } catch (e) {}
  const seq = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a']
  let pos = 0
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase()
    pos = k === seq[pos] ? pos + 1 : k === seq[0] ? 1 : 0
    if (pos === seq.length) { pos = 0; if (document.querySelector('.VPHome')) celebrateRobot() }
  })
}

export default {
  extends: DefaultTheme,
  Layout: {
    setup() {
      const route = useRoute()
      const setupClientEnhancements = () => {
        nextTick(() => {
          setupLightbox()
          setupDelight()
          setupFeatureHub()
          setupReveal()
          setupCardTilt()
          setupBorderGlow()
          setupElectricBorder()
          setupRouteCounts()
          setupHeroCollapse()
          setupNavScroll()
          setupCardSpotlight()
          setupPaperFilters()
        })
      }

      onMounted(setupClientEnhancements)
      watch(() => route.path, setupClientEnhancements)

      return () =>
        h(DefaultTheme.Layout, null, {
          'layout-top': () => h(LoadingScreen),
          'home-hero-before': () => [
            h(HomeDots),
            // 首屏背景:GridDistortion 蓝紫流体扭曲层(替代原 HeroFX 深空星场,应用户指定)
            // (HUD 瞄准光标 TargetCursor 应用户「太卡」诉求已移除)
            h(HeroBG),
            h(TechHero),
            h(HomeRail),
          ],
          'nav-bar-content-after': () => [h(ConfidenceLens), h(ZenToggle), h(ThemeToggle)],
          'layout-bottom': () => h(FirstVisitGuide),
          'doc-before': () => [h(DocReadBar), h(PaperDossier), h(LensBanner)],
          'doc-after': () => [h(RelatedReads), h(ProgressControl), h(SeriesFooter)],
        })
    },
  },
  // 全局注册谱系图:SRC 同步的 markdown(VLA 报告 / WAM 总览)可直接写 <LineageMap track="vla|wam"/>,
  // 无需在同步内容里维护相对 import 路径(extends 链上 DefaultTheme 的 enhanceApp 由 VitePress 自动先行调用)。
  enhanceApp({ app }) {
    app.component('LineageMap', LineageMap)
    // 小红书精选页(SRC papers/xiaohongshu.md 同步)的两个展示组件
    app.component('XhsAccounts', XhsAccounts)
    app.component('XhsBoard', XhsBoard)
    app.component('AutoResearchLab', AutoResearchLab)
    app.component('BenchmarkBoard', BenchmarkBoard)
    app.component('DatasetCatalog', DatasetCatalog)
    app.component('RoadmapGraph', RoadmapGraph)
  },
}
