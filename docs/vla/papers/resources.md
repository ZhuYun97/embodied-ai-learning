---
title: 外部资源导航
description: 具身智能 / VLA 领域公开高质量外部资源导航——精选社区 Awesome 论文合集、关键综述、基准与仿真平台官方站、大规模数据集、开源框架与机构研究博客,每条均经核实存在,与本站「参考文献」(已覆盖论文的一手信源)互补。
---

# 外部资源导航(Awesome 列表 / 一手站点)

> [← 返回主报告](../index.md)

> **本页定位**:汇总**站外**公开的高质量资源(社区合集、综述、基准/数据集官方站、机构博客),作为继续深挖的"出口"。它与 [参考文献](references.md)(本站**已覆盖论文**的一手 arXiv/官网信源聚合)互补:references 是"本站讲过的东西出处",本页是"本站之外去哪看更多"。
> **核实说明**:每个链接均经访问核实存在;⭐ star 数、活跃度等为**截至 2026-05 核查时的快照**,会随时间变化,仅供判断热度参考。

---

## 一、社区 Awesome 论文合集(持续更新的论文清单)

这些是社区维护的、按主题组织的 VLA / 具身智能论文清单,适合追踪最新工作、按 action tokenization / 子领域系统浏览。本站的细读是"精读",这些列表是"广度索引",互补使用。

<div class="res-grid" data-tone="cyan">
<a class="res-card" href="https://github.com/jonyzhang2023/awesome-embodied-vla-va-vln" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">awesome-embodied-vla-va-vln</span>
<span class="res-card__desc">覆盖最广之一:VLA + 视觉-语言导航(VLN)+ 视觉-动作(VA)+ 多模态机器人学习,SOTA 研究清单。</span>
<span class="res-card__meta"><span>维护:jonyzhang2023</span><span class="res-card__star">⭐ ~3.2k</span></span>
</a>
<a class="res-card" href="https://github.com/zchoi/Awesome-Embodied-Robotics-and-Agent" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Awesome-Embodied-Robotics-and-Agent</span>
<span class="res-card__desc">具身机器人 + VLM/LLM:综述、VLA、自进化智能体、规划、导航、基准,2025–2026 持续更新。</span>
<span class="res-card__meta"><span>维护:zchoi</span><span class="res-card__star">⭐ ~1.8k</span></span>
</a>
<a class="res-card" href="https://github.com/Psi-Robot/Awesome-VLA-Papers" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Awesome-VLA-Papers</span>
<span class="res-card__desc">Action Tokenization 综述(arXiv:2507.01925)的配套论文列表,按 8 类动作 token 组织——与本站术语表的动作生成路线分类法同源。</span>
<span class="res-card__meta"><span>维护:Psi-Robot</span><span class="res-card__star">⭐ ~543</span></span>
</a>
<a class="res-card" href="https://github.com/keon/awesome-physical-ai" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">awesome-physical-ai</span>
<span class="res-card__desc">Physical AI 视角:VLA + 世界模型 + 具身推理 + 机器人基础模型,500+ 论文按子主题分(CC0)。</span>
<span class="res-card__meta"><span>维护:keon</span><span class="res-card__star">⭐ ~266</span></span>
</a>
<a class="res-card" href="https://github.com/wadeKeith/Awesome-Embodied-AI" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Awesome-Embodied-AI</span>
<span class="res-card__desc">330+ 资源、10 大轨道:综述 / VLA / 数据集 / 仿真器 / 基准 / 人形 / 机器人学习 / 安全,工具向收录全。</span>
<span class="res-card__meta"><span>维护:wadeKeith</span><span class="res-card__star">⭐ ~210</span></span>
</a>
</div>

> 💡 选用建议:想要**最大广度**看 jonyzhang2023(含 VLN);按**动作 token 分类法**系统读看 Psi-Robot(系[参考文献](references.md)已收综述的配套列表,与[术语表 · 动作生成路线](glossary.md)分类法同源);关注**世界模型 / Physical AI** 看 keon;要**数据集 / 仿真器 / 工具**清单看 wadeKeith。

---

## 二、关键综述(理解全局的入口)

本站主报告与术语表的分类框架多源自这几篇综述,原文直达:

<div class="res-grid" data-tone="violet">
<a class="res-card" href="https://arxiv.org/abs/2507.01925" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">arXiv</span><span class="res-card__host">arxiv.org</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">VLA 综述:动作 tokenization 视角</span>
<span class="res-card__desc">8 类动作 token 分类法;上面的 Psi-Robot 合集即其配套论文列表。</span>
<span class="res-card__meta"><span class="res-card__star">arXiv:2507.01925</span></span>
</a>
<a class="res-card" href="https://arxiv.org/abs/2405.14093" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">arXiv</span><span class="res-card__host">arxiv.org</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">首篇 VLA 综述</span>
<span class="res-card__desc">① VLA 组件 ② 控制策略 ③ 高层任务规划器,三大方向的最早系统梳理。</span>
<span class="res-card__meta"><span class="res-card__star">arXiv:2405.14093</span></span>
</a>
<a class="res-card" href="https://arxiv.org/abs/2505.04769" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">arXiv</span><span class="res-card__host">arxiv.org</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">VLA 三阶段时间线综述</span>
<span class="res-card__desc">基础融合(2022–23)→ 专业化与具身推理(2024)→ 泛化与安全部署(2025)。</span>
<span class="res-card__meta"><span class="res-card__star">arXiv:2505.04769</span></span>
</a>
</div>

> 这三篇的解读散见于[主报告 §1.2](../index.md)与各细读;完整信源与更多综述见 [参考文献 §6](references.md)。

---

## 三、基准与仿真平台(官方站)

评测口径与逐模型成绩的解读见本站 [数据集与基准全景](benchmarks.md);下面是各基准/仿真器的**官方一手站点**,用于跑评测、查协议:

<div class="res-grid" data-tone="blue">
<a class="res-card" href="https://github.com/simpler-env/SimplerEnv" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">SimplerEnv</span>
<span class="res-card__desc">真机对齐仿真评测(Google Robot / WidowX)。</span>
</a>
<a class="res-card" href="https://github.com/Lifelong-Robot-Learning/LIBERO" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">LIBERO</span>
<span class="res-card__desc">130 语言条件任务,4 套件解耦泛化。</span>
</a>
<a class="res-card" href="https://github.com/mees/calvin" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">GitHub</span><span class="res-card__host">github.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">CALVIN</span>
<span class="res-card__desc">长程链式语言条件操作(ABC→D 等划分)。</span>
</a>
<a class="res-card" href="https://robocasa.ai" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">robocasa.ai</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">RoboCasa</span>
<span class="res-card__desc">厨房场景大规模仿真 + 合成数据。</span>
</a>
<a class="res-card" href="https://robotics-transformer-x.github.io" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">robotics-transformer-x.github.io</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Open X-Embodiment</span>
<span class="res-card__desc">跨本体数据集 + RT-X 系列(既是数据也是基准底座)。</span>
</a>
</div>

---

## 四、大规模数据集与采集平台(官方站)

数据论文入口见 [具身数据论文索引](embodied-data-papers.md);数据金字塔与横评见 [具身数据全景](embodied-data.md) 与 [具身数据处理](data-processing.md);官方下载/文档入口:

<div class="res-grid" data-tone="emerald">
<a class="res-card" href="https://robotics-transformer-x.github.io" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">robotics-transformer-x.github.io</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Open X-Embodiment</span>
<span class="res-card__desc">22 本体聚合,VLA 公共底座。</span>
</a>
<a class="res-card" href="https://droid-dataset.github.io" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">droid-dataset.github.io</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">DROID</span>
<span class="res-card__desc">大规模真机操作数据集。</span>
</a>
<a class="res-card" href="https://opendrivelab.com/AgiBot-World" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">opendrivelab.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">AgiBot World</span>
<span class="res-card__desc">智元百万级真机轨迹。</span>
</a>
<a class="res-card" href="https://rail-berkeley.github.io/bridgedata" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">rail-berkeley.github.io</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">BridgeData V2</span>
<span class="res-card__desc">WidowX 桌面操作。</span>
</a>
<a class="res-card" href="https://ego4d-data.org" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">官网</span><span class="res-card__host">ego4d-data.org</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Ego4D</span>
<span class="res-card__desc">3670 小时第一视角人类视频(人类视频层来源)。</span>
</a>
</div>

> AgiBot World 配套站内 [GO-1 细读](go-1.md)。

---

## 五、开源框架与代码

如何选框架、各库覆盖哪些模型与权重,本站已整理成专页:

- 📦 **[开源代码库与权重对照](codebases.md)** —— openpi(π 系列)/ OpenVLA(含 OFT)/ LeRobot(+SmolVLA)/ Isaac-GR00T / Octo 的维护方、动作头、可下载权重、仿真真机依赖对照。

> 本页不重复列各库 URL(详见上面对照表),避免与 codebases 维护分叉。

---

## 六、机构研究博客 / 一手动态

追踪前沿模型的第一手发布(本站多篇细读的信源即来自这些):

<div class="res-grid" data-tone="amber">
<a class="res-card" href="https://www.pi.website" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">博客</span><span class="res-card__host">pi.website</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Physical Intelligence(π 系列)</span>
<span class="res-card__desc">π0 / π0.5 / π0.6 / π0.7 / 知识隔离的博客与论文。</span>
</a>
<a class="res-card" href="https://research.nvidia.com/labs/gear" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">博客</span><span class="res-card__host">research.nvidia.com</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">NVIDIA GEAR Lab(GR00T)</span>
<span class="res-card__desc">GR00T N1.x 系列、DreamGen、Cosmos。</span>
</a>
<a class="res-card" href="https://www.figure.ai/news" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">博客</span><span class="res-card__host">figure.ai</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Figure AI(Helix)</span>
<span class="res-card__desc">Helix / Helix-02 新闻稿;⚠️ 无论文。</span>
</a>
<a class="res-card" href="https://deepmind.google/discover/blog" target="_blank" rel="noopener">
<span class="res-card__top"><span class="res-card__kind">博客</span><span class="res-card__host">deepmind.google</span><span class="res-card__ext">↗</span></span>
<span class="res-card__name">Google DeepMind 机器人</span>
<span class="res-card__desc">Gemini Robotics 等。</span>
</a>
</div>

> ⚠️ 厂商博客多含自评数据与营销框架;采信时对照本站 ⚠️/✅/待核 标注与[共性失败模式](failure-modes.md)的批判视角。Figure 无论文背景见 [Helix 细读](helix.md)。

---

## 相关页面

- [参考文献(本站论文一手信源聚合)](references.md) · [发展时间线](timeline.md) · [术语速查表](glossary.md)
- [如何阅读本站 · 阅读优先级](../guide)(论文太多时先读哪些)

---

*本页为外部资源导航,链接经核实存在;⭐/活跃度为 2026-05 核查快照,会变动。资源收录以"高质量 + 与 VLA/具身操作相关"为准,欢迎在 [GitHub 仓库](https://github.com/ZhuYun97/embodied-ai-learning) 补充。*
