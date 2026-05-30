import DefaultTheme from 'vitepress/theme'
import { h, onMounted } from 'vue'
import { useRoute, withBase } from 'vitepress'
import './custom.css'

// 「本系列」页脚导航:在所有 /vla/papers/* 细读与专题页底部,
// 提供一组跨页快捷入口(无需逐页 frontmatter),提升可发现性。
const SERIES_LINKS = [
  ['/vla/', '← 总报告'],
  ['/vla/papers/embodied-data', '具身数据'],
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

// 自定义轻量灯箱:点击/键盘放大流程图(Mermaid SVG)或论文框架图
// 事件委托 + MutationObserver,兼容 Mermaid 异步渲染与路由切换;键盘可达 + 焦点管理
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
      'doc-after': () => h(SeriesFooter),
    })
  },
  setup() {
    onMounted(setupLightbox)
  },
}
