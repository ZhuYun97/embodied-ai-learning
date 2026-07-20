# 具身星图 · Embodied AI Atlas

> 从经典 VLA 到前沿 WAM，把论文谱系、模型规格、基准硬数据与产业生态连成一张可检索、可追溯的具身智能研究地图。

**[在线访问](https://zhuyun97.github.io/embodied-ai-learning/)** · [VLA 路线](https://zhuyun97.github.io/embodied-ai-learning/vla/) · [WAM 路线](https://zhuyun97.github.io/embodied-ai-learning/wam/) · [最新论文](https://zhuyun97.github.io/embodied-ai-learning/papers/latest) · [具身新闻](https://zhuyun97.github.io/embodied-ai-learning/news/) · [知识图谱](https://zhuyun97.github.io/embodied-ai-learning/ecosystem/paper-graph)

## 这是什么

具身星图是一个持续更新的具身智能学习与研究站，围绕两条主线组织内容：

- **VLA（Vision-Language-Action）**：追踪模型如何把视觉观察与语言指令转化为机器人动作，覆盖离散动作 token、连续动作生成、双系统架构、推理与持续学习等路线。
- **WAM（World-Action Model）**：关注联合预测未来状态与动作的模型，梳理级联式、联合式、自回归与扩散等技术范式。

这里不只汇总论文摘要。每篇细读尽量回到论文、项目页、代码仓库和官方公告，拆解架构、数据、训练、实验与局限；涉及实验成绩时明确区分作者自评、独立验证和待核信息。

## 你可以在这里找到

- **88 篇核心论文细读**：沿 VLA / WAM 技术谱系理解关键工作，而不是按发布日期堆叠链接。
- **模型与基准对比**：统一整理模型规格、评测成绩、适用边界和指标口径。
- **数据集图鉴与学习路线**：从数据来源、任务类型、机器人本体到训练评测，提供可执行的阅读路径。
- **每日前沿雷达**：分别追踪最新论文，以及模型发布、机器人产品、融资、产业落地、政策标准等非论文新闻。
- **产业生态地图**：整理国内外公司、科研机构、代表产品、融资信息与就业城市。
- **双知识图谱**：人工策展图谱用于稳定学习导航，Graphify 离线图谱用于探索全站主题与引用关系。

## 可信度约定

本站把“可追溯”放在“看起来完整”之前：

- `⚠️`：作者、厂商或提出方自评，尚无独立复现。
- `✅`：已由基准维护方、独立来源或多源信息核查。
- `待核`：一手来源未提供或信息不足，不做推测性补全。
- `🤖`：自动化流程新增的新闻条目，保留来源链接并接受后续人工抽审。

引用本站整理的数据时，请同时保留对应的可信度标记。

## 站点能力

- 科技蓝 / 实验室档案双配色主题
- 可信度透镜、阅读进度和专注阅读模式
- Mermaid 流程图、LaTeX 公式、框架图灯箱
- 论文关系图、全站知识图谱、公司与就业地图
- 构建期导出 `llms.txt`、`llms-full.txt` 和逐页 `.md.txt`，便于 LLM 摄取时保留来源与可信度语境
- 响应式布局、深浅主题与 `prefers-reduced-motion` 支持

## 本地运行

需要 Node.js 18 或更高版本。

```bash
npm install
npm run docs:dev
```

常用命令：

```bash
npm run docs:build    # 构建 VitePress 站点
npm run docs:preview  # 预览构建结果
npm run graph:build   # 重建离线知识图谱数据
npm run graph:html    # 重建 Graphify 图谱页面
npm run news:run      # 本地运行新闻抓取与合并流程
```

`graph:html` 需要本机可用的 Graphify CLI；也可通过 `GRAPHIFY_BIN=/path/to/graphify` 指定路径。新闻抓取依赖相应环境变量，日常内容维护无需配置付费 API。

## 内容结构

```text
docs/
├── vla/          # VLA 总览、论文细读与专题分析
├── wam/          # WAM 总览、论文细读与专题分析
├── papers/       # 每日论文雷达
├── news/         # 具身智能产业新闻
├── ecosystem/    # 公司、机构、就业与知识图谱
├── datasets/     # 数据集图鉴
├── models/       # 模型规格与对比
└── roadmap/      # 学习路线图
```

## 部署与技术栈

站点使用 **VitePress** 构建，并结合 Mermaid、MathJax、Cytoscape、Three.js 与离线 Graphify 图谱。推送到 `main` 后，GitHub Actions 会自动构建并发布到 GitHub Pages。

如果 fork 后修改了仓库名，请同步调整 `docs/.vitepress/config.mjs` 中的 `base`。

## 许可与引用

本项目用于学习、研究与信息整理。论文、图片和产品资料的版权归原作者或发布方所有，本站仅作解读与引用。使用具体数据或结论时，请优先回到条目提供的一手来源核验。
