import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'
import './custom.css'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    let zoom

    const initZoom = () => {
      if (zoom) zoom.detach()
      // 流程图(Mermaid SVG)与论文框架图均支持点击放大
      zoom = mediumZoom('.vp-doc .mermaid svg, .vp-doc p > img', {
        background: 'rgba(13, 17, 32, 0.92)',
        margin: 28,
      })
    }

    // Mermaid 为客户端异步渲染,多次重试以捕获后插入的 SVG
    const refresh = () => {
      [120, 400, 900, 1600].forEach((t) => setTimeout(initZoom, t))
    }

    onMounted(refresh)
    watch(
      () => route.path,
      () => nextTick(refresh)
    )
  },
}
