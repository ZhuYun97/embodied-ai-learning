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

// =====================================================================
// 档案 signature:登记十字标 ⊕ + 编号条(accession line / masthead)
// 把"研究档案"的世界观落到结构里:首页报头一条,文档页顶一条(每页仅一次)。
// =====================================================================
const REG_MARK =
  '<svg class="reg-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="7"/><line x1="12" y1="1.5" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="22.5" y2="12"/></svg>'

// 首页报头编号条(home-hero-info-before)
const HomeMasthead = {
  setup() {
    return () =>
      h('div', { class: 'masthead-strip' }, [
        h('span', { class: 'masthead-strip__mark', innerHTML: REG_MARK }),
        h('span', null, 'ARCHIVE · DOMAIN VLA × WAM · REV 2026.05 · LANG ZH / EN'),
      ])
  },
}

// Hero 机器人:技术线稿(墨线随主题 currentColor,关节氧化红;无渐变/辉光/halo)
const ROBOT_SVG =
  '<svg class="hero-robot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 520" fill="none" role="img" aria-label="具身智能机器人技术线稿">' +
  '<g stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
  '<rect x="234" y="62" width="120" height="100" rx="26"/>' +
  '<line x1="260" y1="110" x2="288" y2="110" stroke-width="6"/>' +
  '<line x1="300" y1="110" x2="328" y2="110" stroke-width="6"/>' +
  '<path d="M294 62v-22"/>' +
  '<path d="M278 162v18 M310 162v18"/>' +
  '<path d="M238 198 L350 198 L370 252 L338 358 L250 358 L218 252 Z"/>' +
  '<circle cx="294" cy="264" r="34"/>' +
  '<path d="M226 216 L184 272 L198 346"/>' +
  '<path d="M362 216 L418 234 L444 180"/>' +
  '<path d="M254 358 L240 414 M334 358 L348 414"/>' +
  '<rect x="228" y="414" width="132" height="22" rx="8"/>' +
  '<rect x="452" y="428" width="94" height="26" rx="8"/>' +
  '<path d="M499 428 L486 360 L538 320"/>' +
  '<path d="M538 320 l18 -9 M538 320 l5 -20"/>' +
  '</g>' +
  '<circle class="hero-robot__core" cx="294" cy="264" r="13"/>' +
  '<g class="hero-robot__joint">' +
  '<circle cx="226" cy="216" r="6"/><circle cx="184" cy="272" r="6"/>' +
  '<circle cx="362" cy="216" r="6"/><circle cx="418" cy="234" r="6"/>' +
  '<circle cx="499" cy="428" r="5"/><circle cx="486" cy="360" r="5"/><circle cx="538" cy="320" r="5"/>' +
  '</g>' +
  '<g stroke="currentColor" stroke-width="1.5" opacity="0.5">' +
  '<path d="M462 72 L512 98 L496 152 M512 98 L556 82"/></g>' +
  '<g class="hero-robot__joint">' +
  '<circle cx="462" cy="72" r="4"/><circle cx="512" cy="98" r="4"/><circle cx="496" cy="152" r="4"/><circle cx="556" cy="82" r="4"/>' +
  '</g>' +
  '</svg>'

const HeroRobot = {
  setup() {
    return () => h('div', { class: 'hero-robot-wrap', innerHTML: ROBOT_SVG })
  },
}

// 文档页档案编号行(doc-before):ENTRY · 轨道 · 标题 · REV
const AccessionLine = {
  setup() {
    const route = useRoute()
    const { page, frontmatter } = useData()
    return () => {
      if (!/\/(vla|wam)\//.test(route.path)) return null
      const track = /\/wam\//.test(route.path) ? 'WAM' : 'VLA'
      const title =
        (frontmatter.value && frontmatter.value.title) ||
        (page.value && page.value.title) ||
        ''
      const label = `ENTRY · ${track}${title ? ' · ' + title : ''} · REV 2026.05`
      return h('div', { class: 'accession-line', 'aria-hidden': 'true' }, [
        h('span', { class: 'accession-line__mark', innerHTML: REG_MARK }),
        h('span', { class: 'accession-line__text' }, label),
      ])
    }
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

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(HomeMasthead),
      'home-hero-image': () => h(HeroRobot),
      'nav-bar-content-after': () => [h(ConfidenceLens), h(ZenToggle)],
      'doc-before': () => [h(AccessionLine), h(LensBanner)],
      'doc-after': () => [h(RelatedReads), h(ProgressControl), h(SeriesFooter)],
    })
  },
  setup() {
    onMounted(setupLightbox)
  },
}
