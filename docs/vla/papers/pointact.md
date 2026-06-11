---
title: PointACT 细读:把分层 3D 点云塞进动作解码——冻结 VLM + 点云动作专家 + 多尺度点-动作交互(Inria,Cordelia Schmid 组)
description: PointACT(arXiv:2605.21414,RSS 2026 录用)是 Inria/ENS/CNRS/PSL(Cordelia Schmid 组)的双系统 3D-aware VLA:冻结 Qwen2.5-VL 主干 + 约 300M 可训点云动作专家,用"瓶颈窗口自注意力(bottleneck window self-attention)"让动作 token 在 Point Transformer v3 的各层尺度上与点云稠密交互。作者报告 LIBERO 四套件均值 96.0、RLBench-10Tasks 均值 82.3(较 EO1 约 +9 点,作者表述为 +10%)、真机 SO-100/UR5 多数任务最优;全部数字为作者报告 ⚠️。代码 coming soon、尚未放出。
---

# PointACT 细读

> **VLA 论文细读** · 分层·双系统/推理 · Inria(Cordelia Schmid 组)
> [← 主报告](/vla/) · [WAM 总览](/wam/)

> ✅ **2026-06-11 实查** — 本页对照一手论文 arXiv:[2605.21414v1](https://arxiv.org/abs/2605.21414)(*PointACT: Vision-Language-Action Models with Multi-Scale Point-Action Interaction*,2026-05-20,RSS 2026 录用)写成。**取数说明**:arXiv HTML 版本正文在方法章节中途截断(只渲染到瓶颈窗口注意力一段),实验表格不在 HTML 文本层;本页所有数值改由官方 PDF 文本层(`pdftotext` 本地抽取,10.4k 词全文)逐一核对得到,均为**作者报告值 ⚠️**。开源状态为 2026-06-11 实查。

## TL;DR

PointACT 是 **Inria / École normale supérieure / CNRS / PSL(Cordelia Schmid 组,作者 Shizhe Chen、Paul Pacaud、Cordelia Schmid)** 的一篇 **双系统(dual-system)3D-aware VLA**,RSS 2026 录用。核心主张:**现有 VLA 大多只用 2D 视觉表征,难以做精细几何与空间 grounding,而物理世界本质是 3D**——于是把**分层 3D 点云表征直接接进动作解码过程**。架构上它沿用 π0 / GR00T 式双系统分工(见 §一),**冻结 VLM 主干 Qwen2.5-VL,只从零训练一个约 300M 参数的"点云动作专家(point-action expert)"**;点云走 **Point Transformer v3(PTv3,带大规模 3D 场景预训练权重)**编码,再以**多尺度点-动作交互**让"会演化的动作 token"在 PTv3 各层尺度上对点云**稠密注意**——其中关键是一个**瓶颈窗口自注意力(bottleneck window self-attention)**:把点云切成 K 个不相交的空间窗口,动作 token 作为"latent bottleneck"在每个窗口内聚合局部几何,再跨层重复,从而同时接触局部细节与全局结构,而避免对 N 个点做全量自注意力。评测覆盖**仿真 LIBERO 四套件 + RLBench-10Tasks**,以及**真机 SO-100(6-DoF 打印臂)与 UR5**。作者报告(⚠️,详见 §三):LIBERO 均值 **96.0**(与 GR00T-N1.6 的 97.0 接近)、RLBench-10Tasks 均值 **82.3**(较复现的 EO1 73.2 约 +9 点,作者表述为 **"+10% over SOTA pretrained VLAs"**),真机两平台多数任务最优;消融显示**把点云塞进 VLM 主干(monolithic)反而把 RLBench 拉到 18.6**,而双系统 + 点云动作专家是关键。开源状态(实查):**代码 "coming soon",尚未放出**——项目页除 arXiv 与作者主页外无任何代码/权重链接,目前不可复现。

## 一、定位与动机

PointACT 想补的是 VLA 的一块结构性短板:**主干视觉-语言模型是 2D 的,而操作发生在 3D**。论文摘要把动机讲得很直接——多数 VLA "rely primarily on 2D visual representations, which limit their ability to reason about fine-grained geometry and spatial grounding"。它的答案不是再训一个 3D 大模型,而是**在保留 2D 语义先验的前提下,把分层 3D 几何"紧耦合(tightly coupling)"进动作生成**。

它在双系统谱系里的站位,论文引言交代得很清楚:**"recent methods … such as π0 and GR00T adopt a dual-system framework that decouples high-level perception and planning from low-level control. In these systems, the VLM is typically kept frozen, and its output representations are fed into a lightweight action expert for continuous action generation."** ⚠️ 注意:这句"decouples high-level perception and planning from low-level control"在原文中是**用来描述 π0、GR00T 等既有双系统范式**的(引言的相关工作铺垫),PointACT **沿用并继承**这一分工——冻结 VLM 做高层感知/语义,轻量动作专家做低层控制——而它自己的贡献落在**动作专家这一侧如何吃进 3D 点云**。

因此 PointACT 的真正命题不是"要不要双系统",而是**"3D 信息该在哪一层、以多细的粒度进入双系统"**。论文为此做了一组系统性对照(见 §三 Table III):(a)**monolithic**——把点云塞进 VLM 主干一起微调;(b)**dual-system**——点云只在动作专家侧、且多为粗粒度全局特征;(c)PointACT——点云在动作专家内**多尺度、细粒度**地与动作 token 交互。其结论是 (c) 用**最少的可训参数(300M)拿到最好的结果**,而 (a) 在更难的 RLBench 上崩盘(18.6)。

机构与谱系:出自 **Inria / ENS / CNRS / PSL Research University**,Cordelia Schmid 组——与本站此前收录的 3D 操作策略(如 3DLotus,本文亦作真机基线)同源,延续该组"用 3D 几何强化操作"的研究线。

## 二、方法与架构(据论文 §III–IV)

**双系统骨架** — **VLM 主干为 Qwen2.5-VL**(论文为与 monolithic 基线"公平对比"而沿用与 EO1/GR00T 同款主干;LIBERO 表中 PointACT 整机标注 **3B**,即 ≈3B 的 Qwen2.5-VL 主干 + 可训动作专家)。语言、图像、机器人状态、点云各自编码成 token;**VLM 主干冻结(frozen)**,只训练动作专家——摘要强调"**even larger gains when the vision–language backbone is frozen and the action expert is trained from scratch**"。

**点云分支** — 编码器为 **Point Transformer v3(PTv3)**,带**大规模 3D 场景数据预训练权重**。输入为带颜色的 3D 点;预处理:**工作空间包围盒裁剪 → 1cm 体素化(voxelization)→ 最多 4096 点**。

**多尺度点-动作交互(核心贡献)** — 动作 token 在 PTv3 的**层级各尺度**上与点 token 交互:
1. **瓶颈窗口自注意力**:把该层的点云切成 **K 个不相交的空间窗口**,动作 token 充当"latent bottleneck",**在每个窗口内做自注意力以聚合局部几何上下文**——这样把"动作 token × N 个点"的全量注意力,降成窗口内的稀疏交互(论文称受 [46] 启发),解决 N 很大时的算力问题;
2. **跨尺度处理**:动作 token 先与窗口化的点做自注意力,再与 VLM 输出 embedding 做交叉注意力;
3. **层级整合**:在 PTv3 各层重复上述过程,动作 token 因而"conditioned on a spectrum of geometric information"(局部细节 ↔ 全局结构)。

**动作头与动作形式** — 论文给两种(随基准而异,非扩散):**回归头**(L₂,预测 delta 末端位移,LIBERO 用,**动作块 H=16**);**分类头**(交叉熵,预测关键位姿 keypoint pose,RLBench 用,**动作块 H=1**,因关键帧动作本身已较长程)。真机 UR5 用 **8D 绝对末端位姿**(下一关键点),因为手柄遥操采关键点比连续微步更省事。

**规模与训练** — 动作专家约 **300M** 可训参数;缩放实验给出 **Small ≈59M / Base ≈167M / Large ≈314M** 三档(Fig. 5)。优化器 AdamW,学习率 5×10⁻⁵、cosine decay。LIBERO 用过滤后的成功演示训练、每任务跑 50 个评测 episode(每套件 500 个);RLBench 用 **每任务 100 条演示**,其余方法成绩"directly taken from [42]"。

## 三、实验与关键结果

> ⚠️ **本节所有数值为作者报告值**(RSS 2026 录用稿,预印本未见第三方独立复现);均经官方 PDF 文本层逐一核对,非 HTML/图形臆测。"+10%"为作者对外表述,实际为 RLBench-10Tasks 均值 82.3 vs 复现 EO1 73.2(约 +9.1 点)。

| 设置 | 关键数值(作者报告 ⚠️) | 出处 |
|---|---|---|
| **LIBERO 四套件**(Spatial / Object / Goal / Long → 均值) | PointACT **97.4 / 99.6 / 96.2 / 90.6 → 96.0**;GR00T-N1.6 平均 **97.0**;EO1(复现)平均 **93.1**;SpatialVLA(4B)**88.2 / 89.9 / 78.6 / 55.5 → 78.1** | 论文 Table I |
| **RLBench-10Tasks**(逐任务 → 均值) | PointACT(3B)**91 / 99 / 96 / 59 / 81 / 99 / 99 / 69 / 90 / 40 → 均值 82.3**;EO1 均值 **73.2** | 论文 Table II |
| **架构对照**(可训参数 → LIBERO-Spatial / RLBench) | Monolithic(EO1+Point,3B)**94.0 / 18.6**;Dual GR00T(arch)(1B)**87.0 / 50.8**;Dual+Point(1B)**92.0 / 69.7**;**PointACT(300M)97.4 / 82.3** | 论文 Table III |
| **多尺度交互消融**(RLBench 成功率) | GR00T(arch)**50.8** → 跨尺度聚合 **65.2 / 65.6** → 粗粒度全局 **69.7** → PointACT 细粒度交互 **82.3** | 论文 Table IV |
| **图像条件消融**(LIBERO-Spatial / RLBench) | 去掉图像 **94.2 / 79.8** → 带图像 **97.4 / 82.3** | 论文 Table V |
| **真机 SO-100**(10 trials,列:π0 / GR00T-N1.5 / PointACT) | Put Banana In Plate **10 / 8 / 10**;Put Sock In Drawer **2 / 5 / 9**;Open Microwave **7 / 5 / 8** | 论文 Table VI |
| **真机 UR5**(10 trials,列:π0 / GR00T-N1.5 / 3DLotus / PointACT) | Stack Cup **0 / 0 / 7 / 7**;Close Drawer **9 / 9 / 2 / 7**;Put Grapes&Banana **0 / 0 / 0 / 4** | 论文 Table VII |

**几个值得读出来的判断(论文自述,⚠️)**:

- **赢在 RLBench 与精细 3D,而非 LIBERO**:LIBERO 已接近饱和,PointACT 均值 96.0 与 GR00T-N1.6 的 97.0 实际打平;真正拉开差距的是 **RLBench-10Tasks(82.3 vs EO1 73.2)** 与需要精细几何的真机任务。
- **"点云塞进主干"是反模式**:Monolithic 把点云注入 VLM 主干后,RLBench 仅 **18.6**——论文称这"may interfere with learned representations",印证了**双系统 + 动作专家侧注入**的设计取向。
- **细粒度交互不可省**:Table IV 显示,**仅把多尺度点特征做聚合(65.2/65.6/69.7)远不如细粒度点-动作交互(82.3)**——"Simply aggregating point features across scales is insufficient"。
- **3D 预训练偏向大模型**:PTv3 预训练域(楼宇级场景)与桌面操作存在较大 domain gap;预训练"对大模型增益更大、对小模型帮助不大";但**最小档动作专家也已优于无点云专家的基线**。
- **真机失败模式**:Close Drawer 因抽屉**透明**导致点云噪声/缺失,纯几何的 3DLotus 跌到 2/10、PointACT 7/10(融合 RGB 后仍受影响);UR5 抓取失败多源于平行夹爪的小位姿误差(尤其葡萄)。

## 四、与本站谱系的关系

- **双系统/动作专家这一脉的延续**:PointACT 在引言直接把 [π0](/vla/papers/pi0)、GR00T 列为"冻结 VLM + 轻量动作专家"双系统范式的代表并予以继承——它不改这套分工,而是改造**动作专家如何吃 3D**。与 [Helix](/vla/papers/helix) 的双系统(System 1 / System 2)对照:Helix 的分层是**高频运动 ↔ 低频语义**两网协同,PointACT 的"分层"则是**几何尺度的分层**(PTv3 各层 × 多尺度点-动作交互),两者都挂在"双系统"标签下但切分维度不同。
- **3D / 空间路线的同台对照**:[SpatialVLA](/vla/papers/spatialvla) 在本文 LIBERO 表中作为 4B 基线(均值 78.1),代表"把 3D/空间先验编码进 2D-VLA 表征"的路线;PointACT 则是"**显式点云 + 动作专家侧多尺度注入**"的路线——同样追求空间 grounding,但 PointACT 把几何放在动作解码端而非主干表征端,这也是它与 SpatialVLA 在方法学上的分野。
- **推理/分层取向的旁证**:与 [ECoT](/vla/papers/ecot) 的"具身思维链(embodied chain-of-thought)显式推理"相比,PointACT 不做语言化的中间推理,而是把"空间推理"内化为**点-动作的几何注意力**——是同一"让策略更会想"的诉求下,语义推理 vs 几何推理的两种实现。

## 五、局限与存疑

- **数字均为作者报告 ⚠️**:虽已逐项核对一手 PDF,但 RSS 2026 稿仍属预印本性质、未见第三方独立复现;"+10%"为对外表述(实际约 +9.1 点 over EO1),应按作者口径理解。
- **不可复现(实查)**:**代码 "coming soon"、尚未放出**;项目页除 arXiv、作者主页外无任何代码/权重链接,GitHub/HuggingFace 仓库均未见——多尺度点-动作交互与瓶颈窗口注意力目前无法独立验证。
- **论文自陈的失败模式**:① **单视角遮挡**(perceptual occlusion,需多视角融合);② **缺乏失败恢复**(轨迹偏离后无反应式纠正);③ **工具中介操作**(间接操纵与次级空间约束仍弱)。
- **依赖深度/标定**:点云由深度相机 + 已知内外参重建,透明/反光物体(如 Close Drawer 抽屉)会令点云噪声化、直接拖累 3D 分支——真机鲁棒性受"点云质量"上限约束。
- **HTML 截断、部分细节待核**:arXiv HTML 版正文中途截断,本页数值取自 PDF 文本层;少量训练基础设施细节(如 GPU 数/总步数)与个别图(Fig. 5 缩放曲线的逐点数值)**待核**,本页遵循"不读图取数"原则未予转抄。
- **LIBERO 已近饱和**:在 LIBERO 上 PointACT 与 GR00T-N1.6 基本打平,3D 增益主要体现在 RLBench 与真机精细任务——其"3D 优势"的边界值得后续在更广基准上观察。

## 参考文献

- 一手论文:arXiv:[2605.21414v1](https://arxiv.org/abs/2605.21414) *PointACT: Vision-Language-Action Models with Multi-Scale Point-Action Interaction*(Shizhe Chen, Paul Pacaud, Cordelia Schmid;Inria / ENS / CNRS / PSL;2026-05-20;cs.RO / cs.CV;**Accepted to RSS 2026**)。
- 官方项目页:[cshizhe.github.io/projects/pointact.html](https://cshizhe.github.io/projects/pointact.html)(实查:**代码 "coming soon",无代码/权重链接**)。
- 关键组件出处(论文引用):VLM 主干 **Qwen2.5-VL**;点云编码器 **Point Transformer v3(PTv3)**;对照/基线方法 **π0、GR00T(-N1.5/N1.6)、EO1、SpatialVLA、3DLotus、Act3D**。

> 体例声明:✅ 为本站实查(arXiv 解析、PDF 文本层核对、代码放出状态);⚠️ 为作者报告/自评口径(预印本未经第三方复现);**待核** 表示一手源未给出或不可机读、不以外部记忆或常识补全。
