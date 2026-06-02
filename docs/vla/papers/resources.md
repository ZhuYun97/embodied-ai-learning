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

**WAM 世界-行动模型补充:**

除了上述 VLA 专属合集,以下是**世界模型**(World Models)/ **WAM**(World-Action Models)主题的论文合集,覆盖视频世界模型、具身世界模型、未来状态预测等方向:

| 合集 | 维护方 | ⭐(核查时) | 范围与特点 |
|---|---|---|---|
| [Awesome-World-Models](https://github.com/leofan90/Awesome-World-Models) | leofan90 | ~1.7k | **最活跃的世界模型综合合集**,涵盖基础论文、综述、数据集、基准,按通用视频生成 / 具身AI / 自动驾驶分类,接受社区贡献 |
| [Awesome-Video-World-Models-with-AR-Diffusion](https://github.com/gracezhao1997/Awesome-Video-World-Models-with-AR-Diffusion) | gracezhao1997 | ~574 | 自回归扩散范式的视频世界模型(Genie 3/Matrix-Game),按算法/应用/基础设施组织,包含具身AI/自动驾驶章节,**每周更新** |
| [AwesomeWorldModels](https://github.com/Li-Zn-H/AwesomeWorldModels) | Li-Zn-H | ~312 | 具身AI世界模型综述,按决策耦合/时间结构/表征类型分类,**强机器人操作焦点**(RoboDreamer/RoboScape/TesserAct/FLARE),覆盖操作/驾驶/导航 |
| [awesome-world-models-for-robots](https://github.com/operator22th/awesome-world-models-for-robots) | operator22th | ~136 | **机器人专属世界模型**资源,涵盖基准(HumanoidBench)/数据集(Physical AI/AgiBot World)/基础模型(NVIDIA Cosmos),关联 ICLR/RSS/NeurIPS 2025 研讨会 |
| [Awesome-Embodied-World-Model](https://github.com/tsinghua-fib-lab/Awesome-Embodied-World-Model) | tsinghua-fib-lab | ~112 | **配套 arXiv:2510.16732 综述**的官方论文列表,分视频生成模型/3D重建/潜空间世界模型,强调机器人操作(FlowDreamer/ORV/TesserAct/WorldVLA) |
| [awesome-humanoid-robot-learning](https://github.com/YanjieZe/awesome-humanoid-robot-learning) | YanjieZe | ~2.4k | 人形机器人学习论文,跨 loco-manipulation/遥操作/sim-to-real,**标注真机实验与开源代码**,覆盖 HumanPlus/GR00T/HOVER/人形基准 |
| [Awesome-LLM-Robotics](https://github.com/GT-RIPL/Awesome-LLM-Robotics) | GT-RIPL | ~4.4k | 大语言/多模态模型用于机器人/RL,涵盖推理/规划/操作/导航/仿真/安全,包含 RT-1/RT-2/PaLM-E/视觉-语言-动作模型 |
| [Awesome-VLA](https://github.com/Orlando-CS/Awesome-VLA) | Orlando-CS | ~119 | VLA 模型集合,收录旗舰模型(ABot-M0/RT-2/π0/Helix/Gemini Robotics),涵盖具身推理/3D理解/操作/人形控制,含场景生成/QA/感知/决策数据集与基准 |

> 💡 **WAM 选用建议**:想要**世界模型全局广度**看 leofan90(1.7k★);关注**自回归扩散范式**看 gracezhao1997;聚焦**机器人操作的世界模型**看 Li-Zn-H 或 operator22th;要配**综述论文的官方列表**看 tsinghua-fib-lab(2510.16732)。这些合集与上面 VLA 合集互补:VLA 侧重动作生成策略,WAM 侧重联合建模未来状态与动作。

---

## 二、关键综述(理解全局的入口)

本站主报告与术语表的分类框架多源自这几篇综述,原文见:

**VLA 视觉-语言-动作模型:**
- **VLA 综述:动作 tokenization 视角**(arXiv:2507.01925)—— 8 类动作 token 分类法,上面 Psi-Robot 合集即其配套。
- **首篇 VLA 综述**(arXiv:2405.14093)—— ① VLA 组件 ② 控制策略 ③ 高层任务规划器 三大方向。
- **VLA 三阶段时间线综述**(arXiv:2505.04769)—— 基础融合(2022–23)→ 专业化与具身推理(2024)→ 泛化与安全部署(2025)。

> 这三篇的解读散见于[主报告 §1.2](../index.md)与各细读;完整信源与更多综述见 [参考文献 §6](references.md)。

**WAM 世界-行动模型:**
- **具身AI中的世界模型综述**(arXiv:2510.16732)—— **首篇聚焦具身AI的世界模型综述**,清华出品,分 ① 视频生成模型 ② 3D场景重建 ③ 潜空间世界模型(级联式/联合式),覆盖 30+ 主流工作(DreamerV3/DIAMOND/UniPi/FLARE),配套 [Awesome 合集](https://github.com/tsinghua-fib-lab/Awesome-Embodied-World-Model)。本站 [WAM 总览](../../wam/index.md) 的分类法源自此综述。
- **物理模拟器与世界模型综述**(arXiv:2507.00917)—— 从传统物理仿真到数据驱动世界模型的演进路径,跨RL/视频预测/自动驾驶/机器人操作,涵盖 MuJoCo/Isaac Sim 等仿真器与 Genie/DIAMOND/Genesis 等世界模型的互补关系。
- **世界模型综合调研**(arXiv:2411.14499)—— 通用世界模型综述,跨游戏/驾驶/具身操作,分类法覆盖模型无关 vs 模型学习、确定性 vs 随机性、显式 vs 隐式表征,结合基准(Atari/CARLA/LIBERO)评测横向对比。
- **视频生成演进为世界模拟器路线图**(arXiv:2511.08585)—— **从 Sora 到可控世界模拟器**的演进综述,分析视频生成模型如何集成物理先验/动作条件/交互控制,覆盖自回归扩散(Genie 3/Matrix-Game)/ 流匹配 / 潜空间压缩技术,是 WAM 落地路径的前瞻性分析。

> 💡 WAM 综述与 VLA 综述的互补关系:VLA 综述聚焦"给定观测预测动作"(感知→决策链),WAM 综述聚焦"联合建模未来状态与动作"(想象→验证链)。arXiv:2510.16732 是理解本站 WAM 分类法的首选;2511.08585 是理解生成范式演进的前瞻视角。

---

## 三、基准与仿真平台(官方站)

评测口径与逐模型成绩的解读见本站 [评测基准全景](benchmarks.md);下面是各基准/仿真器的**官方一手站点**,用于跑评测、查协议:

**VLA 仿真操作基准(成功率为主):**

| 平台 | 官方站 | 用途 |
|---|---|---|
| SimplerEnv | [github.com/simpler-env/SimplerEnv](https://github.com/simpler-env/SimplerEnv) | 真机对齐仿真评测(Google Robot / WidowX) |
| LIBERO | [github.com/Lifelong-Robot-Learning/LIBERO](https://github.com/Lifelong-Robot-Learning/LIBERO) | 130 语言条件任务,4 套件解耦泛化 |
| CALVIN | [github.com/mees/calvin](https://github.com/mees/calvin) | 长程链式语言条件操作(ABC→D 等划分) |
| RoboCasa | [robocasa.ai](https://robocasa.ai) | 厨房场景大规模仿真 + 合成数据 |
| Open X-Embodiment | [robotics-transformer-x.github.io](https://robotics-transformer-x.github.io) | 跨本体数据集 + RT-X 系列(既是数据也是基准底座) |

**WAM 过程可信度评测基准:**

| 基准 | 官方站 | 用途 |
|---|---|---|
| WorldScore | [world-score.github.io](https://world-score.github.io) | 多维世界模型评测(视觉保真/物理一致性/时间连贯性/动作对齐度),内置 Physics-IQ 等子任务,可评测 Genie/UniPi/Pandora 等 WAM |
| WorldArena | [huggingface.co/spaces/WorldArena/leaderboard](https://huggingface.co/spaces/WorldArena/leaderboard) | 众包人类评分的世界模型排行榜,按真实感/物理合理性/动作响应性排序,类似 Chatbot Arena 的盲测机制 |
| Physics-IQ | [physics-iq.github.io](https://physics-iq.github.io) | 物理常识推理基准,评测世界模型对刚体动力学/流体/碰撞/重力的预测能力,覆盖 800+ 物理场景问答 |
| WorldBench | [arxiv.org/abs/2408.01718](https://arxiv.org/abs/2408.01718) | 联合评测视频世界模型与动作条件生成,整合 BAIR Robot Pushing / RoboNet / Something-Something V2 等数据集,支持 FVD/LPIPS/SSIM 等指标 |

> 💡 **VLA × WAM 基准关系**:VLA 主流基准(SimplerEnv/LIBERO/CALVIN/RoboCasa)侧重**任务成功率**,WAM 专属基准(WorldScore/Physics-IQ)增加**过程可信度**维度(视觉保真/物理常识/动作合理性)。两类基准有重叠:部分 WAM 也在 LIBERO/CALVIN 上报成功率以保持可比性,详见 [评测基准全景 §9.5](benchmarks.md)。

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

**VLA 旗舰产品线:**

- **Physical Intelligence(π 系列)**:[pi.website](https://www.pi.website) —— π0 / π0.5 / π0.6 / π0.7 / 知识隔离的博客与论文
- **NVIDIA GEAR Lab(GR00T)**:[research.nvidia.com/labs/gear](https://research.nvidia.com/labs/gear) —— GR00T N1.x 系列、DreamGen、Cosmos(世界模型见下)
- **Figure AI(Helix)**:[figure.ai/news](https://www.figure.ai/news) —— Helix / Helix-02 新闻稿(⚠️ 无论文,见 [Helix 细读](helix.md))
- **Google DeepMind 机器人**:[deepmind.google/discover/blog](https://deepmind.google/discover/blog) —— Gemini Robotics、RT-X 系列(Genie 系列见下)

**WAM 世界模型一手动态:**

- **Google DeepMind Genie**:[deepmind.google/discover/blog/?tag=genie](https://deepmind.google/discover/blog/?tag=genie) —— Genie 3(2025):文本→3D 交互世界,支持任意视角导航+动作条件,应用于机器人训练与仿真
- **NVIDIA Cosmos**:[developer.nvidia.com/cosmos](https://developer.nvidia.com/cosmos) —— Cosmos 3(2025):生成式世界基础模型,从视频生成→物理仿真→机器人 sim-to-real 全栈,包含视频世界模型 tokenizer/扩散生成器/物理引擎集成,支持 Isaac Sim 接口
- **Meta V-JEPA**:[ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture](https://ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture) —— V-JEPA 2(2025):Yann LeCun 主推的联合嵌入预测架构视频版本,学习物理世界抽象表征,用于机器人世界建模与规划
- **World Labs**:[worldlabs.ai](https://www.worldlabs.ai) —— Marble(2025):文本/图像→3D 场景生成+物理交互的世界模拟器,Fei-Fei Li 主导,目标是「为 AI 建造空间智能」
- **1X Technologies**:[1x.tech/discover/1x-world-model-challenge](https://www.1x.tech/discover/1x-world-model-challenge) —— 1X World Model Challenge(2025):人形机器人世界模型竞赛,提供 NEO Beta 机器人真机数据,鼓励社区开发预测未来状态的世界模型
- **生数科技 Motubrain**:[motubrain.com](https://www.motubrain.com) —— Motubrain World Model(2025):中国团队主打的端到端世界模型,从视频生成到机器人操作闭环,整合物理仿真与强化学习
- **OpenMOSS 社区**:[github.com/OpenMOSS](https://github.com/OpenMOSS) —— MOSS-VLA-World(配套 arXiv:2510.16732 综述):清华出品的世界模型与 VLA 集成实验框架,提供基准数据集+评测工具,是 [Awesome-Embodied-World-Model](https://github.com/tsinghua-fib-lab/Awesome-Embodied-World-Model) 合集的官方代码库

> ⚠️ 厂商博客多含自评数据与营销框架;采信时对照本站 ⚠️/✅/待核 标注与[共性失败模式](failure-modes.md)的批判视角。
>
> 💡 **VLA × WAM 机构互补关系**:VLA 旗舰机构(π/Figure/NVIDIA GEAR)侧重真机操作与动作策略,WAM 旗舰机构(DeepMind Genie/Meta V-JEPA/World Labs)侧重生成未来状态与场景模拟。NVIDIA Cosmos 横跨两侧(既做世界模型也做机器人控制),是当前产业界少见的全栈尝试。

---

## 相关页面

- [参考文献(本站论文一手信源聚合)](references.md) · [发展时间线](timeline.md) · [术语速查表](glossary.md)
- [如何阅读本站 · 阅读优先级](../guide)(论文太多时先读哪些)

---

*本页为外部资源导航,链接经核实存在;⭐/活跃度为 2026-05 核查快照,会变动。资源收录以"高质量 + 与 VLA/具身操作相关"为准,欢迎在 [GitHub 仓库](https://github.com/ZhuYun97/embodied-ai-learning) 补充。*
