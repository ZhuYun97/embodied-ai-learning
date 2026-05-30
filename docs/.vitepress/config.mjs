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
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/embodied-ai-learning/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#6d6df0' }],
    ['meta', { property: 'og:title', content: '具身智能学习站' }],
    ['meta', { property: 'og:description', content: 'VLA 模型发展深度调研 + 12 篇论文细读' }],
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
            { text: '📊 总报告', link: '/vla/' },
          ],
        },
        {
          text: '论文细读 · 奠基与两条路线',
          collapsed: false,
          items: [
            { text: 'RT-2（范式奠基）', link: '/vla/papers/rt2' },
            { text: 'OpenVLA', link: '/vla/papers/openvla' },
            { text: 'Octo', link: '/vla/papers/octo' },
            { text: 'π0', link: '/vla/papers/pi0' },
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
  },
}))
