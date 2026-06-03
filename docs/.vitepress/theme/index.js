import DefaultTheme from 'vitepress/theme'
import { h, ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useData, withBase } from 'vitepress'
import { data as modelData } from '../data/models.data.mjs'
import './custom.css'

// =====================================================================
// 「专注阅读」切换:收起左右两侧(侧边栏 + 右侧目录),加宽正文。
// 状态写入 localStorage 并加在 <html>.zen-reading 上(config head 里有预渲染脚本防闪烁)。
// =====================================================================
const PANEL_ICON =
  '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><line x1="5" y1="3" x2="5" y2="13"/><line x1="11" y1="3" x2="11" y2="13"/></svg>'

const ZenToggle = {
  setup() {
    const route = useRoute()
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
      // 仅在有左右侧栏的文档页(/vla/*)显示,首页/404 不显示
      if (!/\/vla\//.test(route.path)) return null
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

// Hero 规模读出条(home-hero-actions-after):本站规模一览。
// 数字与 feature 卡口径完全一致(46 篇=VLA30+WAM16 · 50+ 基准 · 38 公司 · 2 主线),不引入任何新主张。
const HERO_STATS = [
  { n: '46', unit: '篇', label: '论文细读' },
  { n: '50+', unit: '', label: '评测基准' },
  { n: '34', unit: '家', label: '生态公司' },
  { n: '2', unit: '条', label: '研究主线' },
]
const HeroStats = {
  setup() {
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
let delightBound = false
function celebrateRobot() {
  const wrap = document.querySelector('.VPHome .hero-robot-wrap')
  const toast = document.createElement('div')
  toast.className = 'delight-toast'
  toast.textContent = '🤖 你发现了彩蛋 — ⊕ keep researching'
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('is-in'))
  setTimeout(() => { toast.classList.remove('is-in'); setTimeout(() => toast.remove(), 420) }, 2600)

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
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(HeroRobot),
      'home-hero-actions-after': () => h(HeroStats),
      'nav-bar-content-after': () => [h(ConfidenceLens), h(ZenToggle)],
      'doc-before': () => [h(LensBanner)],
      'doc-after': () => [h(RelatedReads), h(ProgressControl), h(SeriesFooter)],
    })
  },
  setup() {
    onMounted(setupLightbox)
    onMounted(setupDelight)
  },
}
