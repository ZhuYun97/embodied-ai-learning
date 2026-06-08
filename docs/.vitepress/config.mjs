import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'node:fs'
import path from 'node:path'

// 注意:base 需与 GitHub 仓库名一致(项目页 https://<user>.github.io/<repo>/)
export default withMermaid(defineConfig({
  title: '具身智能学习站',
  description: '具身智能 (Embodied AI) 学习笔记 — 从 VLA 模型发展脉络到 2026 年最新前沿',
  lang: 'zh-CN',
  base: '/embodied-ai-learning/',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  // SEO:生成 sitemap.xml(GitHub Pages 项目页完整域名)
  sitemap: {
    hostname: 'https://zhuyun97.github.io/embodied-ai-learning/',
  },

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

      // 可信度透镜:给含 ⚠️/待核 的表格单元格打 class,供全局透镜按可信度暗化。
      // 顺序:td_open → inline(.content 在块解析期已就绪)→ td_close。
      const addCredClass = (token, cls) => {
        const cur = token.attrGet('class')
        token.attrSet('class', cur ? `${cur} ${cls}` : cls)
      }
      md.core.ruler.push('cred-cells', (state) => {
        const t = state.tokens
        for (let i = 0; i < t.length; i++) {
          if (t[i].type !== 'td_open') continue
          const inline = t[i + 1]
          if (!inline || inline.type !== 'inline') continue
          const txt = inline.content
          if (/待核/.test(txt)) addCredClass(t[i], 'cred-todo')
          else if (/⚠️|⚠/.test(txt)) addCredClass(t[i], 'cred-warn')
        }
      })
    },
  },

  // 构建期导出:llms.txt(链接索引)+ llms-full.txt(全文)+ 每页原始 .md.txt。
  // 目的:外部 LLM / 本站未来 RAG 摄取语料时,⚠️/✅/待核 标记与出处声明原样保留,
  // 不会把自评数字洗成裸事实。纯静态产物,无运行时。
  buildEnd: async (siteConfig) => {
    try {
      const ORIGIN = 'https://zhuyun97.github.io/embodied-ai-learning/'
      const srcDir = siteConfig.srcDir
      const outDir = siteConfig.outDir

      // 递归收集内容 .md(跳过 .vitepress / node_modules / dist)
      const files = []
      const walk = (dir) => {
        for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
          if (ent.name.startsWith('.') || ent.name === 'node_modules' || ent.name === 'dist') continue
          const full = path.join(dir, ent.name)
          if (ent.isDirectory()) walk(full)
          else if (ent.name.endsWith('.md') && ent.name !== '404.md') files.push(full)
        }
      }
      walk(srcDir)
      files.sort()

      // 清洗:去 frontmatter、去 Mermaid 代码块、去裸 HTML 块;保留 ⚠️/✅/待核 与正文 markdown
      const clean = (raw) =>
        raw
          .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
          .replace(/```mermaid[\s\S]*?```/g, '[流程图(Mermaid),详见网页]')
          .replace(/<div[\s\S]*?<\/div>/g, '')
          .replace(/<[^>\n]+>/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      const titleOf = (raw, rel) => {
        // 只认 frontmatter 顶格 title:(避免抓到 features 等嵌套缩进键)
        const fmBlock = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        if (fmBlock) {
          const t = fmBlock[1].match(/^title:\s*(.+)$/m)
          if (t) return t[1].trim().replace(/^["']|["']$/g, '')
        }
        const h1 = raw.match(/^#\s+(.+)$/m)
        if (h1) return h1[1].trim()
        return rel === 'index.md' ? '具身智能学习站(首页)' : rel
      }
      const urlOf = (rel) => ORIGIN + rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')

      const index = []
      const fullParts = []
      for (const file of files) {
        const rel = path.relative(srcDir, file).split(path.sep).join('/')
        const raw = fs.readFileSync(file, 'utf-8')
        const title = titleOf(raw, rel)
        const url = urlOf(rel)
        const body = clean(raw)
        index.push(`- [${title}](${url}): 原始 markdown ${ORIGIN}${rel}.txt`)
        fullParts.push(`# ${title}\n来源:${url}\n\n${body}`)
        // 每页原始 .md.txt(镜像目录结构)
        const outRaw = path.join(outDir, rel + '.txt')
        fs.mkdirSync(path.dirname(outRaw), { recursive: true })
        fs.writeFileSync(outRaw, raw, 'utf-8')
      }

      // 特殊处理:news/index.md 从 news-data.json 生成纯文本镜像
      const newsDataPath = path.join(srcDir, 'news/news-data.json')
      if (fs.existsSync(newsDataPath)) {
        const newsData = JSON.parse(fs.readFileSync(newsDataPath, 'utf-8'))

        // 按 fetched_at 分组
        const groups = new Map()
        for (const item of newsData) {
          const key = item.fetched_at
          if (!groups.has(key)) groups.set(key, [])
          groups.get(key).push(item)
        }

        // 生成 markdown 格式
        const newsMd = ['# 具身智能新闻\n']
        const sortedGroups = Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0]))

        for (const [date, items] of sortedGroups) {
          newsMd.push(`## ${date} (${items.length} 条)\n`)

          // 按重要程度排序
          items.sort((a, b) => {
            const order = { hot: 0, major: 1, normal: 2 }
            return order[a.importance] - order[b.importance]
          })

          for (const item of items) {
            const impIcon = { hot: '🔥', major: '⭐', normal: '📌' }[item.importance]
            const credIcon = item.credibility === 'verified' ? '✅' : '⚠️'
            const botIcon = item.bot ? ' 🤖' : ''

            newsMd.push(`### ${impIcon} ${item.title} ${credIcon}${botIcon}\n`)
            newsMd.push(`${item.summary}\n`)

            // 元信息
            const meta = []
            if (item.sources && item.sources.length > 0) {
              meta.push(`来源: ${item.sources.map(s => `${s.name}(${s.url})`).join(' · ')}`)
            }
            if (item.category && item.category.length > 0) {
              meta.push(`类别: ${item.category.map(c => `#${c}`).join(' ')}`)
            }
            if (item.date) {
              meta.push(`事件时间: ${item.date}`)
            }
            if (item.related && item.related.length > 0) {
              meta.push(`相关: ${item.related.map(r => r.label).join(' · ')}`)
            }
            newsMd.push(meta.join(' · ') + '\n')
          }
        }

        // 写入 news/index.md.txt
        const newsOutPath = path.join(outDir, 'news/index.md.txt')
        fs.mkdirSync(path.dirname(newsOutPath), { recursive: true })
        fs.writeFileSync(newsOutPath, newsMd.join('\n'), 'utf-8')
      }

      const header = `# 具身智能学习站 · Embodied AI Learning\n\n> VLA 模型发展深度调研 + 24 篇论文细读 + 横切分析专题。经多源检索与对抗式事实核查整理。\n> 可信度体例:⚠️=提出方/厂商自评;✅=经核查/基准维护方;待核=一手源未给出、不予编造。\n> 引用本站数据请连同上述标记一并保留。\n\n`
      fs.writeFileSync(path.join(outDir, 'llms.txt'), header + index.join('\n') + '\n', 'utf-8')
      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), header + fullParts.join('\n\n---\n\n') + '\n', 'utf-8')
      console.log(`[buildEnd] 已导出 llms.txt / llms-full.txt + ${files.length} 页原始 .md.txt`)
    } catch (e) {
      console.warn('[buildEnd] llms 导出失败(不阻断构建):', e.message)
    }
  },

  head: [
    // 预渲染恢复「专注阅读」状态,避免刷新时左右侧栏闪烁
    ['script', {}, "try{if(localStorage.getItem('zen-reading')==='1')document.documentElement.classList.add('zen-reading')}catch(e){}"],
    // 预渲染恢复「可信度透镜」状态(dim=暗化自评/待核,strict=仅显已核),避免刷新闪烁
    ['script', {}, "try{var l=localStorage.getItem('cred-lens');if(l==='dim'||l==='strict')document.documentElement.classList.add('lens-'+l)}catch(e){}"],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/embodied-ai-learning/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // 站点字体:Inter(正文/中文回退)+ JetBrains Mono(等宽代码/链接 chip)+ Orbitron(科幻显示体:英文标题/数字/HUD)
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Orbitron:wght@500;600;700;800;900&display=swap' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: '具身智能学习站' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '具身智能学习站' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:url', content: 'https://zhuyun97.github.io/embodied-ai-learning/' }],
    ['meta', { property: 'og:title', content: '具身智能学习站 · Embodied AI Learning' }],
    ['meta', { property: 'og:description', content: 'VLA 模型发展深度调研 + 24 篇论文细读 + 横切分析专题,经多源检索与对抗式事实核查整理。' }],
    ['meta', { property: 'og:image', content: 'https://zhuyun97.github.io/embodied-ai-learning/og.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '具身智能学习站 · Embodied AI Learning' }],
    ['meta', { name: 'twitter:description', content: 'VLA 模型发展深度调研 + 24 篇论文细读 + 横切分析专题,经对抗式事实核查整理。' }],
    ['meta', { name: 'twitter:image', content: 'https://zhuyun97.github.io/embodied-ai-learning/og.png' }],
  ],

  themeConfig: {
    logo: { light: '/logo-light.svg', dark: '/logo-dark.svg', alt: '具身智能学习站' },
    siteTitle: '具身智能学习站',

    nav: [
      { text: '首页', link: '/' },
      {
        text: 'VLA 调研',
        items: [
          {
            text: 'VLA 调研报告',
            items: [
              { text: '总报告', link: '/vla/' },
            ],
          },
          {
            text: '论文细读 · 奠基与两条路线',
            items: [
              { text: 'RT-1（离散前史）', link: '/vla/papers/rt1' },
              { text: 'RT-2（范式奠基）', link: '/vla/papers/rt2' },
              { text: 'Diffusion Policy', link: '/vla/papers/diffusion-policy' },
              { text: 'OpenVLA', link: '/vla/papers/openvla' },
              { text: 'Octo', link: '/vla/papers/octo' },
              { text: 'π0', link: '/vla/papers/pi0' },
              { text: 'CogACT', link: '/vla/papers/cogact' },
              { text: 'π0-FAST', link: '/vla/papers/pi0-fast' },
              { text: 'OpenVLA-OFT', link: '/vla/papers/openvla-oft' },
              { text: 'GR00T N1', link: '/vla/papers/groot-n1' },
              { text: 'π0.5', link: '/vla/papers/pi05' },
            ],
          },
          {
            text: '论文细读 · 2025H2–2026 前沿',
            items: [
              { text: 'WALL-OSS', link: '/vla/papers/wall-oss' },
              { text: 'Wall-OSS-0.5', link: '/vla/papers/wall-oss-05' },
              { text: 'Qwen-VLA', link: '/vla/papers/qwen-vla' },
              { text: 'RynnVLA-001', link: '/vla/papers/rynnvla' },
              { text: 'π0.6 / π*0.6', link: '/vla/papers/pi06' },
              { text: 'Gemini Robotics', link: '/vla/papers/gemini-robotics' },
              { text: 'π0.7', link: '/vla/papers/pi07' },
            ],
          },
          {
            text: '论文细读 · 更多代表模型',
            items: [
              { text: 'GR-3（字节 Seed）', link: '/vla/papers/gr-3' },
              { text: 'RDT-1B（扩散基座）', link: '/vla/papers/rdt-1b' },
              { text: 'GO-1（潜动作桥接）', link: '/vla/papers/go-1' },
              { text: 'MemoryVLA（记忆增强）', link: '/vla/papers/memoryvla' },
              { text: 'SpatialVLA（3D/空间）', link: '/vla/papers/spatialvla' },
              { text: 'Helix（人形双系统）', link: '/vla/papers/helix' },
              { text: 'ECoT（推理 CoT）', link: '/vla/papers/ecot' },
              { text: 'TinyVLA（高效紧凑）', link: '/vla/papers/tinyvla' },
              { text: 'RoboVLMs（系统实证）', link: '/vla/papers/robovlms' },
              { text: 'SimpleVLA-RL（在线 RL）', link: '/vla/papers/simplevla-rl' },
              { text: 'SmolVLA（小型高效·开源）', link: '/vla/papers/smolvla' },
              { text: 'SteerVLA（自动驾驶·分层操控）', link: '/vla/papers/steervla' },
              { text: 'Steerable Policies（可操控分层·操作）', link: '/vla/papers/steerable-policies' },
            ],
          },
          {
            text: '横切分析',
            items: [
              { text: '全模型规格对比', link: '/vla/papers/models-spec' },
              { text: '双系统架构原理', link: '/vla/papers/dual-system-architecture' },
              { text: '预测式 VLA(世界模型作策略)', link: '/vla/papers/predictive-vla' },
              { text: '知识隔离训练配方', link: '/vla/papers/knowledge-insulation' },
              { text: '推理加速与部署', link: '/vla/papers/inference-deployment' },
              { text: '开源代码库对照', link: '/vla/papers/codebases' },
              { text: '共性失败模式', link: '/vla/papers/failure-modes' },
            ],
          },
        ],
      },
      {
        text: 'WAM 调研',
        items: [
          {
            text: 'WAM 调研',
            items: [
              { text: '总览(定义 / taxonomy)', link: '/wam/' },
            ],
          },
          {
            text: '细读 · 级联(先预测后动作)',
            items: [
              { text: 'UniPi(文生视频规划·奠基)', link: '/wam/papers/unipi' },
              { text: 'Gen2Act(零样本人类视频)', link: '/wam/papers/gen2act' },
              { text: 'VPP(预测性视觉表征)', link: '/wam/papers/vpp' },
              { text: 'LAPA(潜动作预训练)', link: '/wam/papers/lapa' },
              { text: 'LaDi-WM(潜扩散世界模型·CoRL25)', link: '/wam/papers/ladi-wm' },
            ],
          },
          {
            text: '细读 · 联合(预测+动作共建)',
            items: [
              { text: 'GR-1(视频生成预训练·自回归)', link: '/wam/papers/gr-1' },
              { text: 'WorldVLA(自回归动作世界模型)', link: '/wam/papers/worldvla' },
              { text: 'UWM(耦合视频+动作扩散)', link: '/wam/papers/uwm' },
              { text: 'UVA(统一视频动作·解耦双头)', link: '/wam/papers/uva' },
              { text: 'FLARE(未来潜表征对齐)', link: '/wam/papers/flare' },
              { text: 'DreamZero(零样本策略)', link: '/wam/papers/dreamzero' },
              { text: 'X-WAM(统一 4D)', link: '/wam/papers/x-wam' },
              { text: 'LingBot-VA(蚂蚁灵波)', link: '/wam/papers/lingbot-va' },
              { text: 'τ0-WM(智元/上海创智·测试时搜索)', link: '/wam/papers/tau0-wm' },
              { text: 'Genie Envisioner(智元)', link: '/wam/papers/genie-envisioner' },
              { text: 'GR00T N2(NVIDIA)', link: '/wam/papers/groot-n2' },
            ],
          },
        ],
      },
      {
        text: '具身基础',
        items: [
          {
            text: '通用专题(VLA × WAM 共用)',
            items: [
              { text: '具身入门 · 新手起步', link: '/vla/papers/getting-started' },
              { text: '具身数据全景梳理', link: '/vla/papers/embodied-data' },
              { text: '具身数据处理', link: '/vla/papers/data-processing' },
              { text: '具身模型训练全流程', link: '/vla/papers/training-pipeline' },
              { text: '评测基准全景', link: '/vla/papers/benchmarks' },
              { text: '实验机器人本体', link: '/vla/papers/robots' },
            ],
          },
        ],
      },
      {
        text: '新闻',
        link: '/news/',
        activeMatch: '^/news/',
      },
      {
        text: '生态图谱',
        activeMatch: '^/ecosystem/',
        items: [
          { text: '生态全景图(图谱 / 地图 / 目录)', link: '/ecosystem/' },
          { text: '🧠 具身大脑公司分档榜', link: '/ecosystem/brain-ranking' },
        ],
      },
      {
        text: '速查',
        items: [
          { text: '术语速查表', link: '/vla/papers/glossary' },
          { text: '发展时间线', link: '/vla/papers/timeline' },
          { text: '参考文献', link: '/vla/papers/references' },
          { text: '外部资源导航', link: '/vla/papers/resources' },
        ],
      },
      {
        text: '关于',
        items: [
          { text: '如何阅读本站', link: '/vla/guide' },
          { text: '更新日志', link: '/vla/changelog' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ZhuYun97/embodied-ai-learning' },
    ],

    editLink: {
      pattern: 'https://github.com/ZhuYun97/embodied-ai-learning/edit/main/docs/:path',
      text: '在 GitHub 上编辑本页',
    },

    sidebar: {
      '/vla/': [
        {
          text: 'VLA 发展深度调研',
          items: [
            { text: '总报告', link: '/vla/' },
          ],
        },
        {
          text: '通用专题(VLA × WAM 共用)',
          collapsed: false,
          items: [
            { text: '具身入门 · 新手起步', link: '/vla/papers/getting-started' },
            { text: '具身数据全景梳理', link: '/vla/papers/embodied-data' },
            { text: '具身数据处理', link: '/vla/papers/data-processing' },
            { text: '具身模型训练全流程', link: '/vla/papers/training-pipeline' },
            { text: '评测基准全景', link: '/vla/papers/benchmarks' },
            { text: '实验机器人本体', link: '/vla/papers/robots' },
          ],
        },
        {
          text: '横切分析专题',
          collapsed: false,
          items: [
            { text: '全模型规格对比大表', link: '/vla/papers/models-spec' },
            { text: '双系统 / 分层架构原理', link: '/vla/papers/dual-system-architecture' },
            { text: '预测式 VLA(世界模型作策略)', link: '/vla/papers/predictive-vla' },
            { text: '知识隔离:VLA 训练配方(KI)', link: '/vla/papers/knowledge-insulation' },
            { text: '推理加速与量化部署', link: '/vla/papers/inference-deployment' },
            { text: '开源代码库与权重对照', link: '/vla/papers/codebases' },
            { text: '共性失败模式(失败显微镜)', link: '/vla/papers/failure-modes' },
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
            { text: 'Wall-OSS-0.5（梯度桥接·可部署）', link: '/vla/papers/wall-oss-05' },
            { text: 'Qwen-VLA（阿里）', link: '/vla/papers/qwen-vla' },
            { text: 'RynnVLA-001（达摩院）', link: '/vla/papers/rynnvla' },
            { text: 'π0.6 / π*0.6', link: '/vla/papers/pi06' },
            { text: 'Gemini Robotics（DeepMind）', link: '/vla/papers/gemini-robotics' },
            { text: 'π0.7（PI 最新）', link: '/vla/papers/pi07' },
          ],
        },
        {
          text: '论文细读 · 更多代表模型',
          collapsed: false,
          items: [
            { text: 'GR-3（字节 Seed 双臂移动）', link: '/vla/papers/gr-3' },
            { text: 'RDT-1B（扩散双臂基座）', link: '/vla/papers/rdt-1b' },
            { text: 'GO-1（智元 ViLLA 潜动作）', link: '/vla/papers/go-1' },
            { text: 'MemoryVLA（记忆增强）', link: '/vla/papers/memoryvla' },
            { text: 'SpatialVLA（3D/空间 VLA）', link: '/vla/papers/spatialvla' },
            { text: 'Helix（Figure 人形双系统）', link: '/vla/papers/helix' },
            { text: 'ECoT（推理 CoT）', link: '/vla/papers/ecot' },
            { text: 'TinyVLA（高效紧凑）', link: '/vla/papers/tinyvla' },
            { text: 'RoboVLMs（系统实证）', link: '/vla/papers/robovlms' },
            { text: 'SimpleVLA-RL（在线 RL）', link: '/vla/papers/simplevla-rl' },
            { text: 'SmolVLA（小型高效·开源）', link: '/vla/papers/smolvla' },
            { text: 'SteerVLA（自动驾驶·分层操控）', link: '/vla/papers/steervla' },
            { text: 'Steerable Policies（可操控分层·操作）', link: '/vla/papers/steerable-policies' },
          ],
        },
        {
          text: '速查与参考',
          collapsed: false,
          items: [
            { text: '术语速查表', link: '/vla/papers/glossary' },
            { text: '发展时间线', link: '/vla/papers/timeline' },
            { text: '参考文献', link: '/vla/papers/references' },
            { text: '外部资源导航(Awesome 列表)', link: '/vla/papers/resources' },
          ],
        },
        {
          text: '关于本站',
          collapsed: false,
          items: [
            { text: '如何阅读本站', link: '/vla/guide' },
            { text: '更新日志', link: '/vla/changelog' },
          ],
        },
      ],
      '/wam/': [
        {
          text: 'WAM 调研',
          items: [
            { text: '总览:定义 / taxonomy / 数据评测', link: '/wam/' },
          ],
        },
        {
          text: '细读 · 级联 · 显式',
          collapsed: false,
          items: [
            { text: 'UniPi（文生视频规划·奠基）', link: '/wam/papers/unipi' },
            { text: 'Gen2Act（零样本人类视频）', link: '/wam/papers/gen2act' },
          ],
        },
        {
          text: '细读 · 级联 · 隐式',
          collapsed: false,
          items: [
            { text: 'VPP（预测性视觉表征）', link: '/wam/papers/vpp' },
            { text: 'LAPA（潜动作预训练）', link: '/wam/papers/lapa' },
            { text: 'LaDi-WM（潜扩散世界模型·CoRL25）', link: '/wam/papers/ladi-wm' },
          ],
        },
        {
          text: '细读 · 联合 · 自回归',
          collapsed: false,
          items: [
            { text: 'GR-1（视频生成预训练）', link: '/wam/papers/gr-1' },
            { text: 'WorldVLA（自回归动作世界模型）', link: '/wam/papers/worldvla' },
          ],
        },
        {
          text: '细读 · 联合 · 扩散',
          collapsed: false,
          items: [
            { text: 'UWM（耦合视频+动作扩散）', link: '/wam/papers/uwm' },
            { text: 'UVA（统一视频动作·解耦双头）', link: '/wam/papers/uva' },
            { text: 'FLARE（未来潜表征对齐）', link: '/wam/papers/flare' },
            { text: 'DreamZero（零样本策略）', link: '/wam/papers/dreamzero' },
            { text: 'X-WAM（统一 4D · 异步去噪）', link: '/wam/papers/x-wam' },
            { text: 'LingBot-VA（蚂蚁灵波·因果世界模型）', link: '/wam/papers/lingbot-va' },
            { text: 'τ0-WM（智元/上海创智·测试时搜索）', link: '/wam/papers/tau0-wm' },
            { text: 'Genie Envisioner（智元 AgiBot）', link: '/wam/papers/genie-envisioner' },
            { text: 'GR00T N2（NVIDIA）', link: '/wam/papers/groot-n2' },
          ],
        },
        {
          text: '通用专题(VLA × WAM 共用)',
          collapsed: false,
          items: [
            { text: '具身入门 · 新手起步', link: '/vla/papers/getting-started' },
            { text: '具身数据全景梳理', link: '/vla/papers/embodied-data' },
            { text: '具身数据处理', link: '/vla/papers/data-processing' },
            { text: '具身模型训练全流程', link: '/vla/papers/training-pipeline' },
            { text: '评测基准全景', link: '/vla/papers/benchmarks' },
            { text: '实验机器人本体', link: '/vla/papers/robots' },
          ],
        },
        {
          text: '相关(VLA 调研轨)',
          collapsed: false,
          items: [
            { text: '预测式 VLA(WAM 早期切片)', link: '/vla/papers/predictive-vla' },
            { text: 'RynnVLA-001(预测当先验)', link: '/vla/papers/rynnvla' },
            { text: 'GR00T N1(VLA 世代)', link: '/vla/papers/groot-n1' },
            { text: 'VLA 调研报告', link: '/vla/' },
          ],
        },
      ],
      '/ecosystem/': [
        {
          text: '具身智能生态',
          items: [
            { text: '生态全景图(图谱 / 地图 / 目录)', link: '/ecosystem/' },
            { text: '🧠 具身大脑公司分档榜', link: '/ecosystem/brain-ranking' },
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
