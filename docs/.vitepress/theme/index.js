import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import './custom.css'

// 自定义轻量灯箱:点击流程图(Mermaid SVG)或论文框架图全屏放大
// 用事件委托,天然兼容 Mermaid 的异步渲染与路由切换,无需重复绑定
let bound = false

function setupLightbox() {
  if (bound || typeof document === 'undefined') return
  bound = true

  const overlay = document.createElement('div')
  overlay.className = 'zoom-lightbox'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-label', '放大预览')
  const stage = document.createElement('div')
  stage.className = 'zoom-lightbox__stage'
  overlay.appendChild(stage)
  document.body.appendChild(overlay)

  const close = () => {
    overlay.classList.remove('is-open')
    setTimeout(() => {
      stage.innerHTML = ''
    }, 180)
  }

  const open = (node) => {
    stage.innerHTML = ''
    const clone = node.cloneNode(true)
    const isSvg = clone.tagName.toLowerCase() === 'svg'
    clone.removeAttribute('style')
    if (isSvg) {
      // 去掉固定宽高,保留 viewBox,让 CSS 用视口高度驱动等比放大
      clone.removeAttribute('width')
      clone.removeAttribute('height')
    }
    clone.classList.add('zoom-lightbox__content')
    stage.appendChild(clone)
    overlay.classList.add('is-open')
  }

  overlay.addEventListener('click', close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close()
  })

  // 事件委托:点击流程图 SVG 或正文框架图
  document.addEventListener('click', (e) => {
    const t = e.target
    if (!t || !t.closest) return
    const svg = t.closest('.vp-doc .mermaid svg')
    const img =
      t.tagName === 'IMG' && t.closest('.vp-doc p') ? t : null
    const node = svg || img
    if (!node) return
    e.preventDefault()
    e.stopPropagation()
    open(node)
  })
}

export default {
  extends: DefaultTheme,
  setup() {
    onMounted(setupLightbox)
  },
}
