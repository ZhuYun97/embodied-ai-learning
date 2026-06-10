---
description: RynnBrain 解读(arXiv:2602.14979,阿里达摩院 DAMO Academy)。面向具身智能的时空基座模型,定位 System-2「具身大脑」(理解/推理/规划/定位,非动作生成层):统一第一视角理解、时空定位、物理落地推理、物理感知规划四大能力;全部从 Qwen3-VL 初始化,论文称 2B/8B/30B-A3B 三档,GitHub 仓库实际放出含 4B 共四档基座 + CoP/Nav/Plan/VLA 后训练变体;在 20 项具身 + 8 项视觉理解基准上自评领先(⚠️ 全为作者自评)。代码 Apache 2.0 开源,权重上 HuggingFace/ModelScope。
title: RynnBrain 细读
---

# RynnBrain:统一第一视角理解·时空定位·物理推理·物理感知规划的开放具身基座(System-2「具身大脑」)

> **arXiv**: [2602.14979](https://arxiv.org/abs/2602.14979)(v1 2026-02-13)
> **机构**: 阿里巴巴达摩院(DAMO Academy, Alibaba Group)· 26 位作者 · 项目页 [alibaba-damo-academy.github.io/RynnBrain.github.io](https://alibaba-damo-academy.github.io/RynnBrain.github.io/)
> **路线**: **System-2 具身基座(physics-aware embodied brain)** —— 在保留 VLM 语义广度的同时,把模型显式结构化到**物理空间 / 时间动态 / 本体约束**上,产出**理解 + 定位 + 规划**而非直接动作;基座为 [Qwen3-VL](https://github.com/QwenLM)。**本篇归位:VLA·新范式(双系统上层 System-2 基座)**
> **开源**: 代码 **Apache 2.0**;权重在 [HuggingFace](https://huggingface.co/collections/Alibaba-DAMO-Academy/rynnbrain) / [ModelScope](https://www.modelscope.cn/collections/DAMO_Academy/RynnBrain) · 代码 [github.com/alibaba-damo-academy/RynnBrain](https://github.com/alibaba-damo-academy/RynnBrain)

> [← 返回主报告](../index.md)

---

## TL;DR

RynnBrain 是达摩院推出的**开放具身基座模型**,核心主张:走向通用具身智能需要一个**既保留 VLM 语义广度、又显式围绕物理空间 / 时间 / 本体约束组织**的统一基座。它不是动作生成层(System-1),而是**System-2「具身大脑」**——负责看懂第一视角世界、在时空中定位、做物理落地的推理与规划,把结果交给下游动作策略执行。

它把「具身大脑」拆成**四大核心能力**,统一在一个模型里:

1. **全面第一视角理解(comprehensive egocentric understanding)**:空间理解、具身问答、第一视角计数、OCR、细粒度视频理解;
2. **多样时空定位(diverse spatio-temporal localization)**:在整段情节记忆(episodic memory)中**定位物体、目标区域、并预测轨迹**;
3. **物理落地推理(physically grounded reasoning)**:一种**交错推理(interleaved reasoning)**策略——在**文本推理**与**空间定位**之间交替,使推理链「锚」在物理环境上,而非纯文字 CoT;
4. **物理感知规划(physics-aware planning)**:把 **affordance / 区域 / 物体的位置信息**直接并入**规划输出**。

工程上,所有模型**从 Qwen3-VL 初始化**;预训练把**图像与视频统一为视觉模态**,并引入**离散坐标 token(归一化到 [0,1000])**让「定位」成为可生成的输出空间;后训练再按 CoP / Nav / Plan / VLA 四条下游线分别精修。

> ⚠️ **可信度提示**:全文 **20 项具身基准 + 8 项视觉理解基准**的所有领先结论**均为作者自评**;本页具体数字系**二次转写自 arXiv HTML**,**精确表号 / 小数位待核**(见 §4)。**模型档位以 GitHub 仓库为准**:论文正文写 **2B / 8B / 30B-A3B 三档**,但仓库实际放出**含全新 4B 共四档基座**(详见 §2.2 与下方差异说明)。✅ 标题与 arXiv ID 已核实一致;✅ 代码已开源(Apache 2.0),权重在 HuggingFace / ModelScope 可下载。

---

## 1. 要解决的问题

通用 VLM 语义广、会「说」,但在具身场景里有三道坎:**不懂第一视角的物理世界、说不准「在哪」、规划不落地**。RynnBrain 的论点是:

- **语义广度 ≠ 具身能力**:直接拿通用 VLM 当机器人大脑,缺的是对**物理空间、时间动态、本体约束**的显式结构化;
- **「理解」与「定位」割裂**:推理常是纯文本 CoT,不接物理坐标,导致「想得对、指不准」;
- **规划不带物理信息**:计划层若不携带 affordance / 区域 / 物体的位置,下游动作就难以执行。

RynnBrain 的主张:**用一个统一基座同时承载「理解—定位—推理—规划」四件事**,并通过**离散坐标 token**把「定位」变成模型可直接生成的输出,使推理与规划**全程锚定物理空间**——这正是「physics-aware embodied brain」的含义:它是**双系统里的上层 System-2**,把结构化的具身意图交给 System-1 动作层去执行。

---

## 2. 方法与架构

### 2.1 统一时空表征 + 物理落地输出空间

- **统一视觉模态**:预训练把**图像与视频**视作同一种视觉模态统一建模(便于跨「单帧 / 情节记忆」处理);
- **离散坐标 token**:把空间定位**归一化到 [0,1000]** 编成离散坐标 token,和文本 token **混排在同一序列**里,用**标准 next-token prediction** 训练——于是「在哪 / 走哪 / 抓哪」成为可生成输出;
- **交错推理(interleaved reasoning)**:推理时在**文本**与**空间定位**之间交替,使推理链落在物理坐标上(物理落地推理),并把位置信息进一步并入规划(物理感知规划)。

### 2.2 模型谱系与规格(⚠️ 以仓库为准,注明与论文差异)

所有模型**从 Qwen3-VL 对应档位初始化**(Qwen3-VL-2B / 4B / 8B / 30B-A3B-Instruct)。**30B-A3B 为 MoE**(A3B = 约 3B 激活参数;论文提到以 expert parallel、world size = 2 部署)。

| 维度 | 论文正文 | GitHub 仓库实放(以此为准) |
|---|---|---|
| 基座档位 | **2B / 8B / 30B-A3B**(三档) | **2B / 4B / 8B / 30B-A3B**(四档,**4B 为仓库新增**) |
| 后训练变体 | CoP / Nav / Plan / VLA | RynnBrain-CoP-8B、RynnBrain-Nav-8B、RynnBrain-Plan-8B、**RynnBrain-Plan-30B-A3B** 等 |

> **差异说明**:论文摘要 / 正文按 **2B / 8B / 30B-A3B 三档**叙述(下游含 Plan-30B-A3B 等),但 GitHub README 的 model zoo **额外放出 RynnBrain-4B**(基于 Qwen3-VL-4B-Instruct,README 标注「brand-new RynnBrain-4B」),故**实际共四档基座**。本页以**仓库**为准并标注此差异。

四条**后训练下游线**:

- **RynnBrain-CoP**(Chain-of-Point,链式指点 / 复杂空间推理);
- **RynnBrain-Nav**(视觉语言导航 VLN);
- **RynnBrain-Plan**(操作任务规划);
- **RynnBrain-VLA**(视觉-语言-动作;**这一支才下探到动作层**)。

### 2.3 训练配方(据论文)

**预训练**:统一时空表征 + 离散坐标输出,**逾 2000 万样本**,混合「文本 / 坐标」token 序列上做 next-token prediction。

**后训练**(分线精修):

- **CoP**:冷启动 SFT(1 epoch、batch 128、lr 1×10⁻⁵)+ **GRPO** 强化学习(group size G=5);
- **Nav(VLN)**:R2R / RxR 约 **450K clips** + **300K ScaleVLN** 样本,全参 SFT(1 epoch、batch 256);
- **操作规划(Plan)**:仅用**数百条**自建多轮对话样本微调;
- **VLA**:**flow matching** + **单流 Diffusion Transformer(DiT)**,在遥操作 pick-and-place 数据上训 **60k steps**。

> 上述为**训练配置**(非性能自评);具体超参以论文与仓库为准,个别细节本页**待核**。

---

## 3. 关键设计与创新点

1. **System-2 定位明确**:不做动作生成本身,而做**理解 + 定位 + 规划**的「具身大脑」,与下游 System-1 动作层解耦——属**双系统架构的上层基座**。
2. **离散坐标 token → 定位可生成**:把空间定位[0,1000]离散化进语言序列,使「在哪 / 走哪 / 抓哪」与文本**同口径生成**,这是「physics-aware」的落点。
3. **交错推理(文本 ⇄ 空间)**:推理链锚定物理坐标,缓解纯文本 CoT「想得对、指不准」。
4. **四能力一体 + 四下游变体**:一个基座覆盖第一视角理解 / 时空定位 / 物理推理 / 物理规划,再分线后训练成 CoP / Nav / Plan / VLA。
5. **多档全开源**:2B/4B/8B/30B-A3B 多档基座 + 专用变体,代码 Apache 2.0,权重上 HF / ModelScope,且自建多个具身评测集(RynnBrain-Grounding / Area / Affordance / Trajectory)。

---

## 4. 实验与关键结果

> ⚠️ **全部为作者自评**;且本页数字**二次转写自 arXiv HTML**,**精确表号 / 小数位待核**。完整 20+8 基准表请以论文为准。

**评测覆盖**:**20 项具身基准 + 8 项通用视觉理解基准**。

- **20 项具身基准**(据论文):VSI-Bench、MMSI、ERQA、RoboSpatial、EgoTaskQA、EgoTextVQA(indoor)、Open-X VQA、QAEgo4D、MindCube、RefSpatial-Bench、ShareRobot-Affordance、ShareRobot-Trajectory、Cornell-Grasp、VMRD-Grasp、**RynnBrain-Grounding / -Area / -Affordance / -Trajectory**(自建)、R2R、RxR。
- **8 项视觉理解基准**:AI2D、ChartQA、DocVQA、MVBench、RealWorldQA、InfoVQA、EgoSchema、VideoMME。

**自评亮点(⚠️ 作者自评;RynnBrain-8B vs 对照)**:

- 自建 **Grounding**:**81.6%**,大幅高于 RoboBrain 2.0(18.6%);
- 自建 **Affordance**:**90.4%**,高于 MiMo-Embodied(84.4%);
- 第一视角物体类指标:**71.2%**,高于 Qwen3-VL(41.8%)。

> 论文总结称「RynnBrain 基座在上述 20+8 基准上**显著优于**现有具身基座模型」——**该结论与全部数字均为作者自评(⚠️)**;**逐基准表号 / 完整对照矩阵待核**。

---

## 5. 局限与争议

1. **全为自评、无第三方复测**:20+8 基准的领先均出自论文自评(⚠️);本页数字为二次转写,**精确表号 / 小数位待核**。
2. **论文 vs 仓库档位口径不一**:正文写 2B/8B/30B-A3B 三档,仓库实放含 4B 共四档——**以仓库为准**,但说明此差异本身提示「论文与发布不完全同步」。
3. **它不直接产动作**:RynnBrain 是 System-2 大脑,真机闭环表现取决于下游 System-1 动作层(其 RynnBrain-VLA 支为一种衔接);作为「脑」的规划质量与作为「手」的执行成败需分开看。
4. **权重许可需逐卡确认**:仓库 About 标 **Apache 2.0**(代码);**权重是否单独条款未见明示**,建议**以各 HF / ModelScope 模型卡为准(待核)**。
5. **坐标 token 的精度上限**:[0,1000] 离散化对超精细操作的定位分辨率影响,论文未给本页可引的边界数字——**待核**。

---

## 6. 在 VLA 谱系中的位置

- **达摩院「脑—手」两条线的「脑」**。RynnBrain 是 **System-2 具身大脑**(理解 / 定位 / 推理 / 规划);同门的 [RynnVLA-001](/vla/papers/rynnvla) 则走**生成式视频预训练 + ActionVAE** 的**动作生成(System-1)**路线。二者一上层一下层,正好拼出双系统的「想」与「做」。
- **System-2 基座的横向对照**。它与 Google DeepMind 的 [Gemini Robotics-ER](/vla/papers/gemini-robotics)(embodied reasoning VLM:3D 检测、pointing、抓取、轨迹等具身中间表征)是**同一层级的对手**——都把「具身推理 / 定位」显式拉成一层能力,供下游动作策略消费。RynnBrain 的差异点在**离散坐标 token + 文本⇄空间交错推理**与**多档全开源**。
- **双系统架构专题的活样本**。把它放进 [双系统架构](/vla/papers/dual-system-architecture) 看更清楚:**上层慢思考(System-2)出结构化意图,下层快执行(System-1)出动作**;RynnBrain 专攻上层,且明确不替代动作层。

一句话:**RynnBrain 用「统一时空表征 + 离散坐标 token + 文本⇄空间交错推理」,把通用 VLM 改造成显式围绕物理空间 / 时间 / 本体的 System-2「具身大脑」,从 Qwen3-VL 出 2B/4B/8B/30B-A3B 多档基座并分线成 CoP/Nav/Plan/VLA;自评在 20 具身 + 8 视觉基准上大幅领先(⚠️ 全为作者自评、表号待核),代码 Apache 2.0、权重开放下载,是达摩院「脑—手」布局里对位 Gemini Robotics-ER 的那颗「脑」。**

---

## 来源

- 论文:RynnBrain: Open Embodied Foundation Models. arXiv:**2602.14979**(v1 2026-02-13)。DAMO Academy, Alibaba Group(26 位作者)。<https://arxiv.org/abs/2602.14979> · 全文 <https://arxiv.org/html/2602.14979>
- 代码:<https://github.com/alibaba-damo-academy/RynnBrain>(README model zoo;License **Apache 2.0**)
- 权重:HuggingFace <https://huggingface.co/collections/Alibaba-DAMO-Academy/rynnbrain> · ModelScope <https://www.modelscope.cn/collections/DAMO_Academy/RynnBrain>
- 项目页:<https://alibaba-damo-academy.github.io/RynnBrain.github.io/>
- 同门 / 对照:[RynnVLA-001](/vla/papers/rynnvla) · [Gemini Robotics-ER](/vla/papers/gemini-robotics) · [双系统架构](/vla/papers/dual-system-architecture)

> 说明:第 4 节全部数字为**作者自评**,且系二次转写自 arXiv HTML,**精确表号 / 小数位待核**;**模型档位以 GitHub 仓库为准**(论文 3 档、仓库 4 档,差异已在 §2.2 标注);**权重单独许可**建议以各模型卡为准(待核)。均按本站 ⚠️/✅/待核 体例处理。
