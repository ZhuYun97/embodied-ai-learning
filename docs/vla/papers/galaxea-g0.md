---
description: Galaxea G0 解读(arXiv:2509.00576,2025-09,星海图 Galaxea)。先放出 500 小时、10 万条轨迹、单一统一本体(R1 Lite)采集的 Galaxea Open-World 真实世界数据集,再在其上构建 G0 双系统:System-2(G0-VLM,基于 Qwen2.5-VL)做多模态高层规划、System-1(G0-VLA,流匹配)做细粒度执行,二者异步不同频运行;以「跨本体预训练 → 单本体预训练 → 任务后训练」三段式课程训练,作者自评里「单本体预训练 + Galaxea 数据集」是性能关键。
title: Galaxea G0 细读
---

# Galaxea G0:Open-World 真实世界数据集 + 「VLM 规划 / VLA 执行」双系统与三段式课程

> **arXiv**: [2509.00576](https://arxiv.org/abs/2509.00576)(v1 2025-08-30)
> **机构**: 星海图 Galaxea(作者:Tao Jiang, Tianyuan Yuan, Yicheng Liu, Chenhao Lu, Jianning Cui, Xiao Liu, Shuiqi Cheng, Jiyang Gao, Huazhe Xu, Hang Zhao)· 项目页 [opengalaxea.github.io/G0](https://opengalaxea.github.io/G0/) · 组织 [OpenGalaxea](https://github.com/OpenGalaxea/GalaxeaVLA)
> **路线**: 数据集 + 双系统分层 VLA —— **System-2 G0-VLM(多模态规划,基于 [Qwen2.5-VL](https://arxiv.org/abs/2502.13923))** + **System-1 G0-VLA(流匹配细粒度执行)**,二者**异步、不同频**;以**三段式课程**(跨本体 → 单本体 → 任务后训练)训练
> **归位**: VLA · 新范式(双系统分层)

> [← 返回主报告](../index.md)

---

## TL;DR

Galaxea G0 这篇报告做了两件事:**先建数据底座,再造双系统模型**。

1. **Galaxea Open-World Dataset**:一份在**真实人类生活/工作环境**里采集的大规模机器人行为数据集 —— **500 小时**高保真数据、**10 万(100K)条**演示轨迹、**150** 个任务类别、**50** 个真实场景、横跨 **11** 处物理场地(住宅 / 餐饮 / 零售 / 办公),涉及 **1,600+** 个物体与 **58** 项操作技能;**全程用单一统一本体**(Galaxea R1 Lite,23-DoF 移动双臂)采集,并配**子任务级语言标注**。论文反复强调:**用一致本体 + 细粒度语言标注**,是它区别于「拼接式」开源聚合数据的关键。

2. **G0 双系统框架**:**System-2 = G0-VLM**(基于 Qwen2.5-VL)做**高层多模态规划** —— 理解人的高层指令、拆解成子任务;**System-1 = G0-VLA**(流匹配动作生成 + 预训练视觉编码器)做**细粒度执行** —— 感知环境、读子任务指令、产出动作。两者**异步、不同频运行**(论文称这样同时利于训练与真机部署;**具体频率未给 → 待核**)。

训练用**三段式课程**:① **跨本体预训练**(约 1,000h OXE + 500h Galaxea + 200h 自有数据的混合)→ ② **单本体预训练**(在 Galaxea 标注数据上用流匹配损失训完整 VLA)→ ③ **任务后训练**(每任务**最多 100 条**轨迹微调)。摘要给出的核心发现:**「单本体预训练阶段 + Galaxea Open-World 数据集」是取得强性能的关键一环**。

> ⚠️ **可信度提示**:
> - 第 4 节全部性能数字为**作者自评**,无独立第三方复现;且原文多以**图(progress score 柱状图)**呈现,**逐任务精确数值本细读未抄录 → 待核**。
> - 双系统**异步运行的具体控制频率**论文未明确给出 → **待核**。
> - **第三方采用信号 → 待核(见 §6)**:本任务预设「站内 WALL-OSS 细读记载其训练数据含 Galaxea 子集」,但**经核 [WALL-OSS 细读](/vla/papers/wall-oss) 全文,其数据来源仅列「自采动作数据 / 开源动作数据 / 多模态 VQA」三类(原文 Figure 5),未出现 Galaxea / 星海图 / Open-World 任何字样**(`grep -i galaxea` 零命中)。故该「✅ 级采用信号」**不成立 / 待核**,本文不予引用。
> - **机构**:arXiv 摘要页未直接印出机构归属;「星海图 Galaxea」由 OpenGalaxea 组织、Galaxea R1 本体与项目页推断,**高置信但属推断**。
> - **G0Plus**(§7)细节来自 **2026-01-04 GitHub 开源发布**,**不在** arXiv:2509.00576 v1 论文中。

---

## 1. 要解决的问题

VLA 的两个老问题,被这篇报告同时盯上:

- **数据「拼接」之痛**:多数 VLA 在 Open X-Embodiment 这类**跨本体、跨相机、跨标注规范**的聚合数据上训练,异构性放大了对齐难度,且**缺少细粒度、子任务级的语言标注**。Galaxea 的回应是**反其道而行**——用**单一统一本体**在真实场景里**自采**,把「本体一致性 + 语言标注密度」一次性拉满。
- **「会想」与「会做」的错配**:一个模型若既要做高层多步规划、又要出高频精细动作,两种目标往往互相拖累。G0 的回应是**显式分层的双系统**:让擅长语义推理的 VLM 负责「想」、让流匹配动作专家负责「做」,**异步不同频**各司其职。

主张可以浓缩成一句:**先用「一致本体 + 密集语言标注」的真实数据打底,再用「VLM 规划 + VLA 执行」的双系统把语义与控制解耦**,并以**三段式课程**把「跨本体广度」与「单本体精度」依次注入。

---

## 2. 方法与架构

### 2.1 Galaxea Open-World Dataset:一致本体 + 子任务级标注

| 维度 | 数值 | 出处 |
|---|---|---|
| 总时长 | **500 小时**高保真数据 | 论文摘要 / HTML |
| 演示轨迹 | **100K(10 万)条** | 论文 HTML |
| 任务类别 | **150** 类 | 论文 HTML |
| 真实场景 | **50** 个不同真实场景 | 论文 HTML |
| 物理场地 | **11** 处(住宅 / 餐饮 / 零售 / 办公) | 论文 HTML |
| 物体 | **1,600+** 个独特物体 | 论文 HTML |
| 技能 | **58** 项操作技能 | 论文 HTML |
| 采集本体 | **Galaxea R1 Lite**:23-DoF 移动双臂(两条 6-DoF 臂 + 3-DoF 躯干 + 全向底盘),**单一统一本体** | 论文 HTML |
| 标注 | **子任务级(subtask-level)语言标注** | 论文摘要 |

要点:**所有演示用同一套机器人本体采集**,配**精确的子任务级语言标注**,同时服务训练与评测——这正是它对「跨本体聚合数据」的差异化卖点。

### 2.2 G0 双系统:VLM 规划(System-2)+ VLA 执行(System-1)

- **System-2 / G0-VLM(高层规划)**:**基于 Qwen2.5-VL**,职责是**解读人的高层指令并拆解为子任务**(多模态规划)。
- **System-1 / G0-VLA(细粒度执行)**:职责是**感知环境、理解子任务指令、输出动作**;采用**流匹配(flow-matching)动作生成** + **预训练视觉编码器**。
- **耦合方式**:两套系统**异步、不同频运行**,论文称这样**同时利于训练与真机部署**。⚠️ **具体频率(System-2 / System-1 各自 Hz)论文未给 → 待核**。

直觉:VLM「慢思考」拆解长程目标,VLA「快执行」贴着本体出高频动作,异步解耦让「想」不拖累「做」。这与 [Helix](/vla/papers/helix)、[GR00T N1](/vla/papers/groot-n1) 等「System-2 推理 + System-1 控制」的分层范式同源(对照见 [双系统架构专题](/vla/papers/dual-system-architecture))。

### 2.3 三段式课程:跨本体 → 单本体 → 任务后训练

| 阶段 | 训练内容 | 数据 | 备注 |
|---|---|---|---|
| ① **跨本体预训练** | 注入跨本体操作广度 | **约 1,000h OXE 轨迹 + 500h Galaxea Open-World + 200h 自有数据** 的混合 | 论文 HTML |
| ② **单本体预训练** | 在统一本体上训练**完整 VLA** | **Galaxea 标注数据**,用**流匹配损失** | 论文 HTML |
| ③ **任务后训练** | 任务专属微调 | **每任务最多 100 条轨迹** | 论文 HTML |

> **摘要原文级结论**:作者发现 **「单本体预训练阶段,连同 Galaxea Open-World 数据集,对取得强性能起到关键作用」**(*"the single-embodiment pre-training stage, together with the Galaxea Open-World Dataset, plays a critical role"*)。

---

## 3. 关键设计与创新点

1. **一致本体 + 子任务级标注的真实世界数据集**:不走「跨本体聚合」,而用**单一统一本体**在 11 处真实场地自采 500h / 10 万条 / 150 任务 / 1,600+ 物体,配密集语言标注——把数据一致性与可监督性拉满。
2. **显式分层双系统(G0-VLM + G0-VLA)**:语义规划与高频控制**解耦**,**异步不同频**运行,兼顾训练效率与真机部署。
3. **三段式课程**:用「跨本体广度 → 单本体精度 → 任务专属」的渐进配方,把异构先验与本体专精分阶段注入。
4. **「单本体预训练是关键」的实证主张**:作者把强性能主要归功于**单本体预训练 + 自有数据集**,并指出**纯跨本体预训练在某些本体专属动作上甚至不如从零训**(见 §4)——这是对「越多跨本体数据越好」的一个反直觉提醒。

---

## 4. 实验与关键结果

> ⚠️ 全部为**作者自评**,无第三方复现。评测覆盖**桌面操作(tabletop manipulation)、少样本学习(few-shot learning)、长程移动操作(long-horizon mobile manipulation)** 三大块;原文多以**图**呈现 progress score,**逐任务精确数值本细读未抄录 → 待核**。

- **预训练权重对比(原文 Figure 9)**:**G0(Full)取得最高的平均 progress score**;仅 Stage-2(单本体预训练)在**语言跟随与全身控制**上已表现强劲。⚠️
- **少样本迁移(原文 Figure 10)**:在**仅 20 条轨迹**微调下,**经 Stage-2 预训练的模型显著优于未经预训练者**。⚠️
- **本体专属动作(原文 Figure 11)**:**Stage-2 明显改善底盘 / 躯干控制**;而**仅跨本体预训练表现更弱,某些情况下甚至不如从零训练**。⚠️(此为难得的「负面发现」,支撑 §3 第 4 点)
- **G0-VLM 评测(原文 Table 1)**:微调后的 G0-VLM 在四项任务的**指令准确率上超基线 50%+**。⚠️

一句话:作者用三块评测论证「**单本体预训练 + Galaxea 数据集**」是涨点关键,并坦承**纯跨本体预训练并非越多越好**;但所有数字均为自评、且多以图呈现,精确值待核。

---

## 5. 局限与争议

1. **全为自评 + 图形化呈现**:三类评测数字均作者自评,无第三方复现;核心结果以 progress-score 柱状图给出,**逐任务精确值待核**。
2. **双系统频率未公开**:「异步不同频」是其卖点,但**System-2 / System-1 的具体控制频率论文未给 → 待核**,难以横向比较实时性。
3. **数据集一致性的双刃剑**:单一本体(R1 Lite)采集利于对齐,但也意味着**数据分布绑定特定本体**,跨本体泛化能力如何仍依赖 OXE 那部分跨本体预训练——而后者据作者自评在本体专属动作上反而偏弱。
4. **第三方采用待核**:截至本次核查,**未在站内 [WALL-OSS 细读](/vla/papers/wall-oss) 中找到 Galaxea 被采用的证据**(详见 §6);论文本身亦未提第三方使用。
5. **机构归属属推断**:arXiv 摘要页未直接印机构;星海图 Galaxea 由 OpenGalaxea 组织名、Galaxea R1 本体与项目页推断(高置信但非论文页面直证)。

---

## 6. 第三方采用信号:核查与结论(待核)

本任务预设:**「站内 WALL-OSS 细读记载其训练数据含 Galaxea 子集,是少有的 ✅ 级第三方采用信号」**。**经实测核查,该预设不成立:**

- 对 [`papers/wall-oss.md`](/vla/papers/wall-oss) 执行 `grep -i 'galaxea'`(并扩展检索 `星海图 / open-world / G0`)**全部零命中**;
- 通读 WALL-OSS 细读全文,其**数据来源**仅在 §2.4 表述为 **「自采动作数据、开源动作数据、多模态 VQA」三大类(原文 Figure 5)**,以及泛指的「多本体(multi-embodiment)机器人数据」——**未点名 Galaxea / 星海图 / Open-World Dataset**。

**结论**:站内现有材料**无法证实** WALL-OSS 采用了 Galaxea 数据集,该采用信号**记为「待核」**,本文据铁律**不予作为 ✅ 信号引用**。若日后在 WALL-OSS 原文或其数据卡中查到 Galaxea 子集的明确出处,再行补录。

（**开源可得性**本身是确凿的:数据集已上 [HuggingFace](https://huggingface.co/datasets/OpenGalaxea/Galaxea-Open-World-Dataset) 与 [ModelScope](https://www.modelscope.cn/datasets/Galaxea/Galaxea-Open-World-Dataset),但「可得」不等于「被某模型采用」,二者需分开看待。)

---

## 7. 开源与许可证

| 资源 | 地址 | 许可证 |
|---|---|---|
| 论文 | [arXiv:2509.00576](https://arxiv.org/abs/2509.00576) · [HTML](https://arxiv.org/html/2509.00576v1) | — |
| 项目页 | [opengalaxea.github.io/G0](https://opengalaxea.github.io/G0/)(现重定向至 GalaxeaVLA) | 页面 CC BY-SA 4.0 |
| 代码(原 G0) | [github.com/OpenGalaxea/G0](https://github.com/OpenGalaxea/G0) | 见模型卡 |
| 代码(GalaxeaVLA) | [github.com/OpenGalaxea/GalaxeaVLA](https://github.com/OpenGalaxea/GalaxeaVLA) | **双许可**:2026-01-04 前提交 **Apache-2.0**;2026-01-04 起 **G0 PLUS Community License**(仅非商用,商用需单独商业许可) |
| 数据集 | [HF datasets/OpenGalaxea/Galaxea-Open-World-Dataset](https://huggingface.co/datasets/OpenGalaxea/Galaxea-Open-World-Dataset) · [ModelScope](https://www.modelscope.cn/datasets/Galaxea/Galaxea-Open-World-Dataset) | **CC BY-NC-SA 4.0** |
| 模型(G0) | [HF OpenGalaxea/G0-VLA](https://huggingface.co/OpenGalaxea/G0-VLA)(`G0_3B_base.pt`,Stage-2 预训练权重) | **CC BY-NC-SA 4.0**(模型卡:*"All the data and code within this repo are under CC BY-NC-SA 4.0"*) |

> 论文 v1 仅称「数据集与模型将在数周内开源」;上述许可证以**已落地的 GitHub / HuggingFace 仓库**为准。注意**原 G0-VLA 模型卡为 CC BY-NC-SA 4.0**,而 **GalaxeaVLA 仓库自 2026-01-04 起改用更受限的 G0 PLUS Community License(非商用)** —— 引用 / 商用前务必区分。

**G0Plus(2026-01-04,有一手源)**:据 [GalaxeaVLA 仓库](https://github.com/OpenGalaxea/GalaxeaVLA) README,星海图于 **2026-01-04 开源 G0Plus**(「最新的多任务机器人操作预训练 VLA 模型」,配 "Pick Up Anything" 演示);其中 **G0Plus_3B-base 用 2k 小时+真机数据训练**、**G0Tiny_250M-base 用 1k 小时 R1 Pro 遥操数据**;**2026-02-12** 又更新了「在更大规模遥操 + 网页数据上训练」的 G0Plus 权重。⚠️ 以上**均来自开源发布,不在 arXiv v1 论文内**。

---

## 8. 在 VLA 谱系中的位置

- **双系统分层一族(对照 [Helix](/vla/papers/helix) / [GR00T N1](/vla/papers/groot-n1) / [双系统架构专题](/vla/papers/dual-system-architecture))**:G0 的「**G0-VLM 慢规划 + G0-VLA 快执行、异步不同频**」与 Helix「System-2/System-1」、GR00T N1「推理 + 控制」是同一分层范式;差异在 G0 把**自建真实数据集 + 三段式课程**作为配套主线,且把强性能主要归因于**单本体预训练**。
- **与单模型路线([WALL-OSS](/vla/papers/wall-oss))成对照**:WALL-OSS 反对分层、主打「单模型 Unified Cross-Level CoT」把推理与动作压进同一前向;G0 则**显式分层、异步解耦**。两者恰好是「**统一 vs 分层**」的两极样本。(注:WALL-OSS 是否采用 Galaxea 数据集**待核**,见 §6。)
- **数据范式样本(对照 [具身数据专题](/vla/papers/embodied-data))**:在「跨本体聚合」(OXE 式)与「单本体自采」两条数据路线里,Galaxea Open-World 是后者的**重量级真实世界样本**(500h / 10 万条 / 一致本体 / 子任务级标注),并以自评数据为「单本体专采 > 纯跨本体聚合」提供了一个论据。

一句话:**Galaxea G0 用「一致本体 + 子任务级语言标注」的 500 小时真实世界数据集打底,在其上构建「G0-VLM 规划 + G0-VLA 执行」的异步双系统,并以「跨本体 → 单本体 → 任务后训练」三段式课程训练;作者自评显示「单本体预训练 + 自有数据集」才是涨点关键、纯跨本体预训练反而在本体专属动作上偏弱。代价是全部数字自评且多以图呈现、双系统频率未公开;而「WALL-OSS 采用其数据集」这一第三方信号经核查站内材料并不成立,记为待核。**

---

## 来源

- 论文:Galaxea Open-World Dataset and G0 Dual-System VLA Model. arXiv:**2509.00576**(v1 2025-08-30,星海图 Galaxea)。<https://arxiv.org/abs/2509.00576> · 全文 <https://arxiv.org/html/2509.00576v1>
- 项目页:<https://opengalaxea.github.io/G0/>(重定向至 <https://opengalaxea.github.io/GalaxeaVLA/>)
- 代码:<https://github.com/OpenGalaxea/G0> · <https://github.com/OpenGalaxea/GalaxeaVLA>
- 数据集:HF <https://huggingface.co/datasets/OpenGalaxea/Galaxea-Open-World-Dataset> · ModelScope <https://www.modelscope.cn/datasets/Galaxea/Galaxea-Open-World-Dataset>
- 模型:HF <https://huggingface.co/OpenGalaxea/G0-VLA>(`G0_3B_base.pt`)
- 站内勾连:[WALL-OSS](/vla/papers/wall-oss)(单模型对照;Galaxea 采用信号待核)· [Helix](/vla/papers/helix) / [双系统架构专题](/vla/papers/dual-system-architecture)(双系统对照)· [具身数据专题](/vla/papers/embodied-data)(数据范式)

> 说明:第 4 节全部数字为**作者自评**且原文多以图呈现(逐任务精确值待核);双系统具体频率论文未给(待核);机构归属由 OpenGalaxea 组织 / Galaxea R1 本体推断;**「WALL-OSS 训练数据含 Galaxea 子集」经站内核查不成立,记为待核**;G0Plus 细节来自 2026-01 开源发布、不在 arXiv v1 论文内。均按本站 ⚠️/待核 体例处理。
