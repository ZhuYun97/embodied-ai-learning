import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 注意:base 需与 GitHub 仓库名一致(项目页 https://<user>.github.io/<repo>/)
export default withMermaid(defineConfig({
  title: '具身智能学习站',
  description: '具身智能 (Embodied AI) 学习笔记 — 从 VLA 模型发展脉络到 2026 年最新前沿',
  lang: 'zh-CN',
  base: '/embodied-ai-learning/',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  // 启用 LaTeX 数学公式渲染(需 markdown-it-mathjax3,已在 devDependencies)
  markdown: {
    math: true,
    // 给所有正文图片加 loading=lazy + decoding=async,并按尺寸表注入 width/height 消除 CLS
    config: (md) => {
      const DIMS = {
        'groot-n1_arch_detail.webp': [996, 516], 'groot-n1_arch.webp': [997, 520],
        'groot-n1_datapyramid.webp': [529, 327], 'octo_arch.webp': [1661, 804],
        'octo_dataset.webp': [1661, 1519], 'openvla_arch.webp': [1661, 617],
        'openvla-oft_arch.webp': [2000, 313], 'openvla-oft_overview.webp': [2000, 1164],
        'pi0_arch.webp': [996, 278], 'pi0-fast_arch.webp': [1661, 1565],
        'pi0-fast_method.webp': [1661, 604], 'pi05_arch.webp': [1661, 691],
        'pi05_data.webp': [1660, 992], 'pi06_arch.webp': [1660, 486],
        'pi06_recap.webp': [2000, 1601], 'qwen-vla_arch.webp': [2000, 982],
        'rt2_arch.webp': [822, 304], 'rt2_results.webp': [2000, 480],
        'rynnvla_arch.webp': [793, 386], 'rynnvla_pipeline.webp': [793, 309],
        'wall-oss_arch.webp': [897, 455], 'wall-oss_pipeline.webp': [797, 271],
      }
      const orig = md.renderer.rules.image
      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        token.attrSet('loading', 'lazy')
        token.attrSet('decoding', 'async')
        const src = token.attrGet('src') || ''
        const name = src.split('/').pop()
        if (DIMS[name]) {
          token.attrSet('width', String(DIMS[name][0]))
          token.attrSet('height', String(DIMS[name][1]))
        }
        return orig ? orig(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
      }
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/embodied-ai-learning/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { property: 'og:title', content: '具身智能学习站' }],
    ['meta', { property: 'og:description', content: 'VLA 模型发展深度调研 + 16 篇论文细读' }],
  ],

  themeConfig: {
    logo: '/favicon.svg',
    siteTitle: '具身智能学习站',

    nav: [
      { text: '首页', link: '/' },
      { text: 'VLA 调研', link: '/vla/' },
      { text: '论文细读', link: '/vla/#-论文细读导航' },
    ],

    sidebar: {
      '/vla/': [
        {
          text: 'VLA 发展深度调研',
          items: [
            { text: '总报告', link: '/vla/' },
          ],
        },
        {
          text: '专题综述',
          collapsed: false,
          items: [
            { text: '具身数据全景梳理', link: '/vla/papers/embodied-data' },
            { text: '数据集与基准全景', link: '/vla/papers/benchmarks' },
          ],
        },
        {
          text: '论文细读 · 奠基与两条路线',
          collapsed: false,
          items: [
            { text: 'RT-1（离散前史）', link: '/vla/papers/rt1' },
            { text: 'RT-2（范式奠基）', link: '/vla/papers/rt2' },
            { text: 'Diffusion Policy（连续奠基）', link: '/vla/papers/diffusion-policy' },
            { text: 'OpenVLA', link: '/vla/papers/openvla' },
            { text: 'Octo', link: '/vla/papers/octo' },
            { text: 'π0', link: '/vla/papers/pi0' },
            { text: 'CogACT（认知+扩散）', link: '/vla/papers/cogact' },
            { text: 'π0-FAST', link: '/vla/papers/pi0-fast' },
            { text: 'OpenVLA-OFT', link: '/vla/papers/openvla-oft' },
            { text: 'GR00T N1', link: '/vla/papers/groot-n1' },
            { text: 'π0.5', link: '/vla/papers/pi05' },
          ],
        },
        {
          text: '论文细读 · 2025H2–2026 前沿',
          collapsed: false,
          items: [
            { text: 'WALL-OSS（自变量）', link: '/vla/papers/wall-oss' },
            { text: 'Qwen-VLA（阿里）', link: '/vla/papers/qwen-vla' },
            { text: 'RynnVLA-001（达摩院）', link: '/vla/papers/rynnvla' },
            { text: 'π0.6 / π*0.6', link: '/vla/papers/pi06' },
            { text: 'Gemini Robotics（DeepMind）', link: '/vla/papers/gemini-robotics' },
          ],
        },
        {
          text: '速查与参考',
          collapsed: false,
          items: [
            { text: '术语速查表', link: '/vla/papers/glossary' },
            { text: '发展时间线', link: '/vla/papers/timeline' },
            { text: '参考文献', link: '/vla/papers/references' },
          ],
        },
      ],
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新',
    search: { provider: 'local' },
    darkModeSwitchLabel: '主题',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
  },

  mermaid: {
    theme: 'default',
    // 用系统字体(同步可用)做测量与渲染,避免异步 Inter 导致 CJK 节点文字被截断
    fontFamily: '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC","Source Han Sans SC",sans-serif',
    // htmlLabels:false → 用 SVG <text> 渲染,getComputedTextLength 自测量,
    // 测量字体 == 渲染字体,彻底避免 CJK 节点文字被裁切
    htmlLabels: false,
    themeVariables: {
      fontFamily: '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif',
    },
    flowchart: {
      htmlLabels: false,
      useMaxWidth: true,
      nodeSpacing: 50,
      rankSpacing: 58,
      padding: 16,
    },
  },
}))
