---
title: AffordanceVLA 细读:用结构化 affordance 预测做面向任务的中间表征,桥接感知与动作(北大 / 港科大广州 / 港中文 / Knowin AI)
description: AffordanceVLA(arXiv 2606.06155,v1 2026-06-04)提出把"结构化 affordance 预测(structured affordance forecasting)"作为面向任务的中间表征,缓解 VLM 语义空间与底层控制策略之间的结构性错配。三个递进组件 Which2Act(物体级 grounding,视觉潜变量重建)/ Where2Act(2D 交互定位,affordance map)/ How2Act(3D 几何推理,体素 + 10-DoF 布局)接入 Mixture-of-Transformer(MoT)三专家,经三阶段课程训练;在 LIBERO、CALVIN ABC→D 与真机分阶段评测(数字全 ⚠️ 作者自评)。
---

# AffordanceVLA 细读

> **VLA 论文细读** · 新范式探索(affordance 中间表征) · 机构:北京大学 / 港科大(广州) / 港中文 / Knowin AI
> [← 主报告](/vla/) · [WAM 总览](/wam/)

> ✅ **2026-06-11 实查** — 本页逐节对照一手论文 arXiv HTML [2606.06155](https://arxiv.org/abs/2606.06155)(*AffordanceVLA: A Vision-Language-Action Model Empowering Action Generation through Affordance-Aware Understanding*,v1 提交日 **4 Jun 2026**,cs.RO/cs.CV/cs.MM)写成;实验数值全部从论文 HTML 的表格文本(非图片)直接抽取并复核。机构、GitHub 放出状态为 2026-06-11 实查。
>
> 机构核查结论:**前期"机构未确认"已更正**——论文 HTML 署名区(`ltx_role_affiliation` 标注,共 4 个)明确列出四家机构,本页按论文原文写,**非外部检索补全**。

## TL;DR

AffordanceVLA 出自 **北京大学 · 香港科技大学(广州)· 香港中文大学 · Knowin AI**(13 位作者,首位 Qize Yu;原文标注共同一作 † 与通讯作者 ∗,但上标在 HTML 未干净绑定到具体姓名,本页不臆测通讯人)。核心主张:**VLM 的语义空间与具身控制策略之间存在"结构性错配(structural mismatch)",直接把动作损失反传进 VLM 主干,监督信号既不够信息量、也与语义空间对不齐**;因此应引入一个**面向任务的中间表征(task-oriented intermediate representation)**——**结构化 affordance 预测(structured affordance forecasting)**——来"接地"感知与动作。具体把操作先验拆成三个递进组件:**Which2Act**(物体级 grounding,用冻结编码器 Flux VAE 重建目标物视觉潜变量、抑制干扰)→ **Where2Act**(2D 交互定位,预测 affordance map)→ **How2Act**(3D 几何推理:体素形状扩散 + 10-DoF 空间布局回归)。三者接入一个 **Mixture-of-Transformer(MoT)** 三专家结构(Understanding / Affordance Generation / Action Expert),以 **UAA(Understanding-Affordance-Action)单向渐进注意力**做严格因果的专家间注意力;视觉编码器为 **SigLIP**,动作专家走 **flow-matching**(Euler 10 步去噪)输出 action chunk。训练为**三阶段课程**(affordance grounding 预训练 → affordance 增强的机器人协同训练 → 目标任务后训练),并配一条**自动 affordance 标注/增广流水线**(用 **Qwen3-VL-235B** 做逐关键帧标注)以补稠密 affordance 标签的稀缺。⚠️ 作者自评(预印本、未经第三方复现):**LIBERO** 四套件均值 **95.8%**、**CALVIN ABC→D** 平均完成链长 **4.33**、真机 Basic/Complex 均值 **88.3 / 82.9**。开源(2026-06-11 实查):**GitHub 仓库为真**(`Skywalker-yqz/AffordanceVLA`,MIT、371 KB Python、29 星);**总参数量论文未给 → 待核**。

## 一、定位与动机

AffordanceVLA 属本站 VLA 主线的**"新范式探索 · 显式中间表征"**一路:不直接学"像素/语义 → 动作"的端到端映射,而是先预测一个**结构化的、面向任务的中间量(affordance)**,再让动作以它为条件生成。论文(§1)的诊断很具体:主流 VLA 把 VLM 主干与动作模块耦合以继承网络规模视觉-语言先验,但**动作损失被直接反传进 VLM 主干**——这个信号"既不够信息量、也与 VLM 语义空间不对齐",于是精确的"感知-动作映射"难学,且控制目标会让主干的视觉-语言能力**被侵蚀(eroded)**。

作者的解法是给主干一个**"语义锚(semantic anchor)"**:affordance 这种监督**贴近 VLM 语义空间、又直接服务于动作**,因此一方面提供比纯动作损失更丰富的训练信号,另一方面**保住主干的指令跟随能力不漂移**。论文 §6(Representation Decoupling: Backbone vs. Decoder)进一步用"冻结主干、只换弱解码器"的解耦实验论证:affordance 子目标损失主要优化的是**主干表征**而非解码器——这是其"affordance 作中间表征"主张的内部证据(⚠️ 同为作者自评)。

affordance 的三层语义对应三个组件:**Which2Act**(该操作哪个物体——物体级 grounding,抑制干扰物)、**Where2Act**(在物体何处交互——2D 可交互区域)、**How2Act**(如何以 3D 几何方式操作——形状与位姿)。论文称这三类线索分别提供"空间接地(spatially grounded)、语义条件(semantically conditioned)、动作耦合(action-coupled)"的中间表征,从而**自然地桥接视觉、语言与动作**。

## 二、方法与架构(据论文 §3,附录 §8)

**三个 affordance 组件(递进式建模操作先验)**

- **Which2Act(物体级 grounding)**:用一个**冻结的预训练编码器(论文举例 Flux VAE)**抽取目标物的连续视觉潜变量 $z_q\in\mathbb{R}^{C\times H\times W}$,以 **MSE** 重建之($\mathcal{L}_\text{which}$),目的是把注意力锚到任务相关物体、抑制干扰。
- **Where2Act(2D 交互定位)**:预测一张 **2D affordance map** 标出可交互区域,以**二元交叉熵(BCE)** 对齐 ground-truth mask($\mathcal{L}_\text{where}$)。
- **How2Act(3D 几何推理)**:分两支——(a)**3D 形状生成**,用条件扩散过程预测体素潜变量($\mathcal{L}_\text{shape}$);(b)**空间布局回归**,输出 **10-DoF 空间布局向量**(rotation / scale / translation),用 **Smooth-L1**($\mathcal{L}_\text{layout}$)。

**MoT 三专家 + UAA 注意力**:整体是一个 **Mixture-of-Transformer(MoT)**,含三个专门专家——**Understanding Expert**($\mathcal{M}_{und}$,把视觉+语言融合成指令感知表征 $h_t^{und}$)、**Affordance Generation Expert**(解码出结构化 affordance token $A_t$)、**Action Expert**(以 affordance 为条件合成 action chunk $a_{t:t+k}$)。三者由一个 **UAA(Understanding→Affordance→Action)单向渐进注意力**串联,保证**严格因果的专家间注意力**(下游专家只能注意到上游已生成的表征)。视觉编码器为 **SigLIP**(据延迟表 Table 9);动作生成走 **flow-matching**(Euler,10 步去噪)。

> **参数量待核**:论文正文与附录均**未给出模型总参数量**;消融中的无 affordance 基线记为 "No-Afd (**Pi0 Arch**)",提示其与 [π0](/vla/papers/pi0) 同源的架构取向,但**底层 VLM 具体型号/参数本页不臆测 → 待核**。附录 Table 6 给出的是 **affordance 生成专家的 token 数**($N_\text{gen}$:完整版 388、fast 版 64),非参数量。

**自动 affordance 数据流水线(附录 §8)**:为补"机器人数据缺稠密 affordance 标签"之短,作者搭了一条自动标注/增广流水线,在 **Step 2b** 用 **Qwen3-VL-235B** 做**逐关键帧 affordance 标注**;并以"affordance 点是否落在对应 bbox 内"做一致性校验(论文自述 100% 落入 ⚠️)。**注:Qwen3-VL-235B 仅用于数据标注,不是策略主干。**

**部署延迟(Table 9,RTX 5090)**:总计 **~176 ms / 次** → **~5.7 Hz** 实时控制。分解:预处理 ~6 + SigLIP 图像编码 ~22 + Understanding+Affordance Generation ~52 + 10 步动作去噪(Euler flow matching)~92 + 杂项 ~4(ms,均 ⚠️ 作者自测)。action chunk 长度随任务变:Stage II/CALVIN 用 30、LIBERO 用 6、真机用 50。

**三阶段训练课程(渐进式数据配方,16× H200)**

| 阶段 | 目标 | 数据(Table 7) | 训练范围 |
|---|---|---|---|
| **Stage I** affordance grounding 预训练 | 学 affordance 接地先验 | **PRISM** 412K(point+bbox VQA,源自 GraspMolmo)、**AGD20K** 20K(heatmap VQA)、**RefSpatial** 2500K(bbox+heatmap VQA) | 仅训 Affordance Generation Expert + 可学习 query;Vision Encoder / Understanding / Action **冻结**(300K 步)|
| **Stage II** affordance 增强的机器人协同训练 | 让 affordance 与控制对齐 | **A1(InternData)** 149K 条 Franka 真机轨迹(in-house);另含流水线合成的 affordance 标注 | 动作损失 + affordance 损失(权重 0.5:1,230K 步)|
| **Stage III** 目标任务后训练 | 适配评测/真机 | **LIBERO**、**CALVIN**(公开);真机用 **DROID 子集(~150K)** + in-house Franka 任务(每任务 80–200 示范)| Afd:Act 权重 0.15:1;仿真 20 epoch、真机 40 epoch |

## 三、实验与关键结果

> ⚠️ **可信度提示**:下列所有数值均为**作者自评**(预印本,单一团队设置,未经独立第三方在统一条件下复现)。本页数字从论文 HTML 表格的**文本**直接抽取(非读图取数),但"自评"属性不因此改变,故全表标 ⚠️。

**LIBERO(Table 1,4 套件,各 50 rollouts,成功率 %,⚠️)**

| Method | Spatial | Object | Goal | Long | **Avg.** |
|---|---|---|---|---|---|
| OpenVLA | 84.7 | 88.4 | 79.2 | 53.7 | 76.5 |
| SpatialVLA | 88.2 | 89.9 | 78.6 | 55.5 | 78.1 |
| CoT-VLA | 87.5 | 91.6 | 87.6 | 69.0 | 83.9 |
| ThinkAct | 88.3 | 91.4 | 87.1 | 70.9 | 84.4 |
| π0 (Pi0) | 98.0 | 96.8 | 94.4 | 88.4 | 94.4 |
| GR00T-N1 | 94.4 | 97.6 | 93.0 | 90.6 | 93.9 |
| F1-VLA | 98.2 | 97.8 | 95.4 | **91.3** | 95.7 |
| AffordanceVLA(w/o stage II)| 88.5 | 91.7 | 91.3 | 73.3 | 86.2 |
| **AffordanceVLA(full)** | **98.6** | **98.4** | **96.2** | 89.8 | **95.8** |

**CALVIN ABC→D(Table 2,zero-shot OOD,1000 rollouts,完成连续 1–5 任务成功率 % 与平均链长,⚠️)**

| Method | 1/5 | 2/5 | 3/5 | 4/5 | 5/5 | **Avg. Len** |
|---|---|---|---|---|---|---|
| RoboFlamingo | 82.4 | 61.9 | 46.6 | 33.1 | 23.5 | 2.48 |
| SuSIE | 87.0 | 69.0 | 49.0 | 38.0 | 26.0 | 2.69 |
| GR-1 | 85.4 | 71.2 | 59.6 | 49.7 | 40.1 | 3.06 |
| OpenVLA | 91.3 | 77.8 | 62.0 | 52.1 | 43.5 | 3.27 |
| CLOVER | 96.0 | 83.5 | 70.8 | 57.5 | 45.4 | 3.53 |
| UniVLA | 95.5 | 85.8 | 75.4 | 66.9 | 56.5 | 3.80 |
| π0 (Pi0) | 93.8 | 85.0 | 76.7 | 68.6 | 60.1 | 3.84 |
| Seer | 94.4 | 87.2 | 79.9 | 72.2 | 64.3 | 3.98 |
| VPP | 95.3 | 88.2 | 80.3 | 72.9 | 64.5 | 4.01 |
| Seer-Large | 96.3 | 91.6 | 86.1 | 80.3 | 74.0 | 4.28 |
| AffordanceVLA(w/o stage II)| 93.4 | 84.7 | 75.4 | 68.1 | 58.9 | 3.81 |
| **AffordanceVLA(full)** | **96.8** | **92.0** | **87.5** | **80.8** | **75.9** | **4.33** |

**消融(Table 3,LIBERO 均值 / CALVIN Avg.Len,⚠️)**

| 配置 | LIBERO Avg | CALVIN Avg.Len | 解读 |
|---|---|---|---|
| **No-Afd(Pi0 Arch)** 无 affordance | 92.4 | 3.93 | 无 affordance 的 Pi0 式架构基线 |
| **Frozen-Afd** 冻结 affordance | 67.1 | 2.83 | affordance 不参与优化反而大幅拖垮 |
| **w/o stage II**(去协同训练) | 86.2 | 3.81 | **低于 No-Afd**:affordance 若不经 Stage II 与控制对齐,反而有害 |
| w/o Which2Act | 94.6 | 4.20 | 去单个组件影响有限 |
| w/o Where2Act | 93.2 | 4.13 | 同上 |
| w/o How2Act | 93.7 | 4.01 | 同上 |
| Block-wise Tokens(改注意力) | 90.3 | 3.89 | 验证 UAA 渐进注意力设计 |
| **AffordanceVLA(full)** | **95.8** | **4.33** | 完整配方 |

**真机(Table 5,Franka,每任务 15 次,成功率 %,⚠️)**:Basic 任务均值 **AffordanceVLA 88.3 vs π0 70.8**;Complex 任务均值 **82.9 vs 44.8**。代表性子项:Drawer-pick **86.7 vs 46.7**、Toaster-toast **86.7 vs 26.7**、Close-microwave 93.3 vs 86.7——复杂场景的差距明显大于基础场景。

**关键读法(诚实标注)**:① 完整模型相对**无 affordance 的 Pi0 式架构**(No-Afd)在其设置下约 +3.4(LIBERO 均值)/ +0.40(CALVIN 链长),是 affordance 价值的主要内部证据;但相对**最强公开基线**优势很薄——LIBERO 均值仅比 F1-VLA 高 **0.1**(95.8 vs 95.7),且在最难的 **LIBERO-Long 上 F1-VLA(91.3)、GR00T-N1(90.6)反超** AffordanceVLA(89.8);CALVIN 链长仅比 Seer-Large 高 **0.05**(4.33 vs 4.28)。② **w/o stage II(86.2/3.81)竟低于 No-Afd(92.4/3.93)**——说明收益高度依赖三阶段课程(尤其 Stage II 协同训练),"光加 affordance 不做对齐"会倒退,这点与 [τ0-WM](/wam/papers/tau0-wm) "加测试时算力本身不保证收益"的观察异曲同工。

## 四、与本站谱系的关系

- **与 [ECoT](/vla/papers/ecot)(同属"显式中间表征"路数,但表征形态相反)**:ECoT 让 VLA 在动作前生成一条**语言形式的推理链**(任务→计划→子任务→运动基元→夹爪像素→物体 bbox→动作),自回归、token 多(约 350)、控制频率低;AffordanceVLA 把"动作前先想清楚"换成**结构化的视觉/几何 affordance**(视觉潜变量 + 2D map + 3D 几何),在 MoT 里并行解码、~176 ms 实时。值得注意:ECoT 推理链尾部已含"夹爪 2D 像素 + 物体 bbox"这类**空间 affordance 雏形**,AffordanceVLA 可看作把这一支**专门化、结构化、并从语言态升级到视觉/3D 几何态**的一条路线。
- **与 [SteerVLA](/vla/papers/steervla)(都在重做"语义↔控制"的接口,但接口位置不同)**:SteerVLA 主张高层 VLM 与底层 VLA 之间**不该只用一句粗指令做接口**,改用**丰富的语言接口**(meta-action + 推理轨迹)把推理"接地"到控制(自动驾驶、两网络之间);AffordanceVLA 同样认定"VLM 语义↔底层控制"的接口需要更强表征,但它把接口做成**单模型 MoT 内部的 affordance token**(机器人操作、专家之间)。两者一外化为跨网络语言、一内化为专家间 affordance,问题意识相通。

## 五、局限与存疑

- **公开基准领先幅度很薄**:LIBERO 均值仅 +0.1 over F1-VLA,CALVIN 链长 +0.05 over Seer-Large,且在 LIBERO-Long 子套件被两条基线反超(见 §三);"SOTA"成色更多体现在**真机复杂任务**与**相对自家无-affordance 基线**的对比,而非公开榜显著拉开。
- **全部为作者自评 ⚠️**:LIBERO/CALVIN/真机均为单一团队结果,无独立第三方在统一条件下复现;真机每任务仅 15 次试验,样本量小。
- **总参数量待核**:论文未给模型总参数;底层 VLM 具体型号未在正文明示(仅有 "No-Afd = Pi0 Arch" 的间接提示),本页不臆测。
- **affordance 标签依赖大模型生成**:稠密 affordance 标注由自动流水线 + **Qwen3-VL-235B** 合成,其标注质量与"100% 落入 bbox"的一致性校验均为作者自述 ⚠️,标注偏差对下游影响未由外部评估。
- **收益强依赖配方**:w/o stage II 反而低于无 affordance 基线(见 §三),说明 affordance 中间表征的增益不可与三阶段课程解耦,迁移到其他训练管线时能否复现存疑。
- **开源完整度待核**:GitHub 代码仓库实查存在(见下),但**预训练/各阶段权重(checkpoint)的放出状态本页未单独核验 → 待核**;能否完整复现三阶段训练有待确认。
- **日期小异**:arXiv v1 提交日为 **4 Jun 2026**(权威),但论文 HTML 正文排版日期串印作 "April 10, 2026",疑为 LaTeX `\date` 残留;本页以 arXiv 提交日为准。

## 参考文献

- 一手论文:arXiv:[2606.06155](https://arxiv.org/abs/2606.06155) *AffordanceVLA: A Vision-Language-Action Model Empowering Action Generation through Affordance-Aware Understanding*(v1,提交日 4 Jun 2026;cs.RO/cs.CV/cs.MM)。作者(13):Qize Yu, Jiadi You, Yuran Wang, Jiaqi Liang, Bowen Ping, Yang Tian, Yue Chen, Minghong Cai, Zeying Gong, Ruihai Wu, Yinchuan Li, Junwei Liang, Yingcong Chen。
- 机构(论文 HTML `ltx_role_affiliation` 实查,共 4):[1] **Peking University(北京大学)**、[2] **Hong Kong University of Science and Technology (Guangzhou)(香港科技大学(广州))**、[3] **The Chinese University of Hong Kong(香港中文大学)**、[4] **Knowin AI**。
- 项目页:`skywalker-yqz.github.io/AffordanceVLA`(实查 HTTP 301→存在);代码:GitHub [`Skywalker-yqz/AffordanceVLA`](https://github.com/Skywalker-yqz/AffordanceVLA)(2026-06-11 实查:**MIT** 许可、**371,394 B(≈371 KB)Python**、**29 星**,创建 2026-06-05;LICENSE 文件 HTTP 200)。
- 评测基准:LIBERO(Spatial/Object/Goal/Long)、CALVIN ABC→D(zero-shot)、真机 Franka(Basic/Complex)。
- 训练数据:PRISM、AGD20K、RefSpatial(Stage I);A1(InternData)(Stage II);LIBERO/CALVIN、DROID 子集 + in-house(Stage III)。

> 体例声明:✅ 为本站实查(arXiv HTML 解析、GitHub 放出状态、表格数值逐项核对);⚠️ 为作者自评(预印本,未经第三方复现);**待核** 表示一手源未给出、不以外部记忆或常识补全。
