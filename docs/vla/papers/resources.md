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

这些是社区维护的、按主题组织的 VLA / 具身智能论文清单,适合追踪最新工作、按 action tokenization / 子领域系统浏览。本站的 30 篇细读是"精读",这些列表是"广度索引",互补使用。

| 合集 | 维护方 | ⭐(核查时) | 范围与特点 |
|---|---|---|---|
| [awesome-embodied-vla-va-vln](https://github.com/jonyzhang2023/awesome-embodied-vla-va-vln) | jonyzhang2023 | ~3.2k | 覆盖最广之一:VLA + 视觉-语言导航(VLN)+ 视觉-动作(VA)+ 多模态机器人学习,SOTA 研究清单 |
| [Awesome-Embodied-Robotics-and-Agent](https://github.com/zchoi/Awesome-Embodied-Robotics-and-Agent) | zchoi | ~1.8k | 具身机器人 + VLM/LLM:综述、VLA、自进化智能体、规划、导航、基准,2025–2026 持续更新 |
| [Awesome-VLA-Papers](https://github.com/Psi-Robot/Awesome-VLA-Papers) | Psi-Robot | ~543 | **本站已收录的 [Action Tokenization 综述](references.md)(arXiv:2507.01925)的配套论文列表**,按 8 类动作 token 组织——与本站[术语表 · 动作生成路线](glossary.md)的分类法同源 |
| [awesome-physical-ai](https://github.com/keon/awesome-physical-ai) | keon | ~266 | Physical AI 视角:VLA + 世界模型 + 具身推理 + 机器人基础模型,500+ 论文按子主题分(CC0) |
| [Awesome-Embodied-AI](https://github.com/wadeKeith/Awesome-Embodied-AI) | wadeKeith | ~210 | 330+ 资源、10 大轨道:综述 / VLA / 数据集 / 仿真器 / 基准 / 人形 / 机器人学习 / 安全,工具向收录全 |

> 💡 选用建议:想要**最大广度**看 jonyzhang2023(含 VLN);按**动作 token 分类法**系统读看 Psi-Robot;关注**世界模型 / Physical AI** 看 keon;要**数据集 / 仿真器 / 工具**清单看 wadeKeith。

---

## 二、关键综述(理解全局的入口)

本站主报告与术语表的分类框架多源自这几篇综述,原文见:

- **VLA 综述:动作 tokenization 视角**(arXiv:2507.01925)—— 8 类动作 token 分类法,上面 Psi-Robot 合集即其配套。
- **首篇 VLA 综述**(arXiv:2405.14093)—— ① VLA 组件 ② 控制策略 ③ 高层任务规划器 三大方向。
- **VLA 三阶段时间线综述**(arXiv:2505.04769)—— 基础融合(2022–23)→ 专业化与具身推理(2024)→ 泛化与安全部署(2025)。

> 这三篇的解读散见于[主报告 §1.2](../index.md)与各细读;完整信源与更多综述见 [参考文献 §6](references.md)。

---

## 三、基准与仿真平台(官方站)

评测口径与逐模型成绩的解读见本站 [数据集与基准全景](benchmarks.md);下面是各基准/仿真器的**官方一手站点**,用于跑评测、查协议:

| 平台 | 官方站 | 用途 |
|---|---|---|
| SimplerEnv | [github.com/simpler-env/SimplerEnv](https://github.com/simpler-env/SimplerEnv) | 真机对齐仿真评测(Google Robot / WidowX) |
| LIBERO | [github.com/Lifelong-Robot-Learning/LIBERO](https://github.com/Lifelong-Robot-Learning/LIBERO) | 130 语言条件任务,4 套件解耦泛化 |
| CALVIN | [github.com/mees/calvin](https://github.com/mees/calvin) | 长程链式语言条件操作(ABC→D 等划分) |
| RoboCasa | [robocasa.ai](https://robocasa.ai) | 厨房场景大规模仿真 + 合成数据 |
| Open X-Embodiment | [robotics-transformer-x.github.io](https://robotics-transformer-x.github.io) | 跨本体数据集 + RT-X 系列(既是数据也是基准底座) |

---

## 四、大规模数据集与采集平台(官方站)

数据金字塔与横评见 [具身数据全景](embodied-data.md) 与 [具身数据处理](data-processing.md);官方下载/文档入口:

- **Open X-Embodiment**:[robotics-transformer-x.github.io](https://robotics-transformer-x.github.io) —— 22 本体聚合,VLA 公共底座
- **DROID**:[droid-dataset.github.io](https://droid-dataset.github.io) —— 大规模真机操作数据集
- **AgiBot World**:[opendrivelab.com/AgiBot-World](https://opendrivelab.com/AgiBot-World) —— 智元百万级真机轨迹(配 [GO-1 细读](go-1.md))
- **BridgeData V2**:[rail-berkeley.github.io/bridgedata](https://rail-berkeley.github.io/bridgedata) —— WidowX 桌面操作
- **Ego4D**:[ego4d-data.org](https://ego4d-data.org) —— 3670 小时第一视角人类视频(人类视频层来源)

---

## 五、开源框架与代码

如何选框架、各库覆盖哪些模型与权重,本站已整理成专页:

- 📦 **[开源代码库与权重对照](codebases.md)** —— openpi(π 系列)/ OpenVLA(含 OFT)/ LeRobot(+SmolVLA)/ Isaac-GR00T / Octo 的维护方、动作头、可下载权重、仿真真机依赖对照。

> 本页不重复列各库 URL(详见上面对照表),避免与 codebases 维护分叉。

---

## 六、机构研究博客 / 一手动态

追踪前沿模型的第一手发布(本站多篇细读的信源即来自这些):

- **Physical Intelligence(π 系列)**:[pi.website](https://www.pi.website) —— π0 / π0.5 / π0.6 / π0.7 / 知识隔离的博客与论文
- **NVIDIA GEAR Lab(GR00T)**:[research.nvidia.com/labs/gear](https://research.nvidia.com/labs/gear) —— GR00T N1.x 系列、DreamGen、Cosmos
- **Figure AI(Helix)**:[figure.ai/news](https://www.figure.ai/news) —— Helix / Helix-02 新闻稿(⚠️ 无论文,见 [Helix 细读](helix.md))
- **Google DeepMind 机器人**:[deepmind.google/discover/blog](https://deepmind.google/discover/blog) —— Gemini Robotics 等

> ⚠️ 厂商博客多含自评数据与营销框架;采信时对照本站 ⚠️/✅/待核 标注与[共性失败模式](failure-modes.md)的批判视角。

---

## 相关页面

- [参考文献(本站论文一手信源聚合)](references.md) · [发展时间线](timeline.md) · [术语速查表](glossary.md)
- [如何阅读本站 · 阅读优先级](../guide)(论文太多时先读哪些)

---

*本页为外部资源导航,链接经核实存在;⭐/活跃度为 2026-05 核查快照,会变动。资源收录以"高质量 + 与 VLA/具身操作相关"为准,欢迎在 [GitHub 仓库](https://github.com/ZhuYun97/embodied-ai-learning) 补充。*
