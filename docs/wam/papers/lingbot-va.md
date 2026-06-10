---
title: LingBot-VA 细读:因果视频-动作世界模型(蚂蚁灵波)
description: 蚂蚁集团灵波(Robbyant)的 LingBot-VA(arXiv:2601.21998《Causal World Modeling for Robot Control》):自回归扩散框架,在交错序列里同时学帧预测与策略执行,MoT 共享潜空间 + 闭环 rollout + 异步推理。
---

# LingBot-VA 细读

> **WAM 论文细读** · 联合·扩散:把视觉动态预测与动作推断统一进一条交错自回归扩散序列 · arXiv:2601.21998
> [← WAM 总览](/wam/) · [主报告](/vla/)

## TL;DR

LingBot-VA(蚂蚁集团灵波 / Robbyant,论文《Causal World Modeling for Robot Control》,arXiv:2601.21998)的核心主张是:**视频世界建模与视觉-语言预训练并列,为机器人学习提供一个全新且独立的基础**——视频世界模型通过理解「动作与视觉动态之间的因果」获得「想象近未来」的能力。据此 LingBot-VA 提出一个**自回归扩散框架,同时学习帧预测与策略执行**,三处关键设计:(1)用 **Mixture-of-Transformers(MoT)** 驱动的**共享潜空间**整合视觉与动作 token;(2)**闭环 rollout 机制**,以真值观测持续获取环境反馈;(3)**异步推理流水线**,把动作预测与电机执行并行化以支持高效控制。它在综述(arXiv:2605.12090)Fig 2 中归入 **Joint·扩散** 支。论文摘要未给定量;一篇第三方鲁棒性研究(arXiv:2603.22078)在 RoboTwin 2.0-Plus 上报其成功率 **74.2%** ⚠️。

## 一、定位与动机

LingBot-VA 的立场鲜明:**把"视频世界建模"摆成与"视觉-语言预训练"并列的、独立的机器人学习基础**,而非附属于 VLA 的一个模块。其直觉是——视频世界模型能理解「动作如何引起视觉动态变化」的因果关系,从而具备**想象近未来**的能力;把这种"预演"能力接进策略,就能让控制不只反应当下、还能据预测的未来动态行动。

由此它落在 WAM 综述的 **Joint·扩散** 支:不像级联式"先生成整段未来视频、再抽动作",LingBot-VA 把**帧预测与策略执行放进同一条交错(interleaved)的自回归扩散序列**里同时学习,使"视觉动态预测"与"动作推断"在架构上统一、但概念上仍各自清晰。

论文 12 位作者(Lin Li, Qihang Zhang, Yiming Luo, Shuai Yang, Ruilin Wang, Fei Han, Mingrui Yu, Zelin Gao, Nan Xue, Xing Zhu, Yujun Shen, Yinghao Xu),蚂蚁集团灵波(Robbyant);提交 2026-01-29(修订 2026-03-22);项目页 technology.robbyant.com/lingbot-va,代码 GitHub robbyant/lingbot-va。综述列其为 RSS 2026(待核确认)。

## 二、方法与架构

LingBot-VA 是一个**自回归扩散框架**,同时学习帧预测(frame prediction)与策略执行(policy execution)。摘要给出三处"精心设计":

- **共享潜空间 + MoT**:用 **Mixture-of-Transformers(MoT)** 架构把**视觉与动作 token 整合进一个共享潜空间**。视觉动态预测与动作推断在同一交错序列内联合建模,但由 MoT 的不同专家承载,以在统一中保留二者的概念区分。
- **闭环 rollout 机制**:在推理/rollout 中**以真值观测持续获取环境反馈**(closed-loop rollout with ground-truth observations),避免纯生成式预演随步数累积漂移——与 [DreamZero](/wam/papers/dreamzero) 的 KV-cache 观测替换思路相通。
- **异步推理流水线**:把**动作预测与电机执行并行化**(asynchronous inference),以满足实时控制的时延要求——这是把生成式世界模型塞进闭环控制的常见工程手段(参见 [X-WAM](/wam/papers/x-wam) 的异步去噪、DreamZero 的异步执行)。

> 据相关报道与同名工作,灵波体系内另有一个 **LingBot-VLA**(VLA 基础模型,Qwen2.5-VL + MoT 动作专家、约 2 万小时遥操作数据、GM-100 基准),与本页的 **LingBot-VA(世界-动作模型)** 是不同工作,勿混淆;LingBot-VLA 的细节本页不展开(待核)。MoT 专家划分、潜空间构造、扩散调度与训练目标等实现细节,摘要未给(待核)。

## 三、实验与关键结果

- **原论文摘要未给出定量结果**(成功率、对比基线等),故自评数值此处标 **待核**。
- **第三方鲁棒性研究的成绩** ⚠️:一篇对比研究《Do World Action Models Generalize Better than VLAs? A Robustness Study》(arXiv:2603.22078)在视觉/语言扰动下评测多个 WAM 与 VLA,报告 **LingBot-VA 在 RoboTwin 2.0-Plus 成功率 74.2%**(同表中 Cosmos-Policy 在 LIBERO-Plus 报 82.2%)。该研究结论是 WAM 整体鲁棒性强、较多数 VLA 泛化更好,但 π0.5 等经充分多样数据训练的 VLA 在部分任务可追平。注:此数字出自该对比研究、非基准维护方统一榜单,仍标 ⚠️;RoboTwin 见本站 [数据集与基准](/vla/papers/benchmarks)。

## 四、与本站谱系的关系

- **综述归类**:LingBot-VA 在综述 Fig 2 中属 **Joint·扩散** 支(扩散基生成式联合世界-动作建模)。其 MoT 共享潜空间属"单流/多流"中偏多流(专家分担)的实现,确切单/多流归属 **待核**。
- **机制对读**:闭环 rollout(真值观测反馈)≈ [DreamZero](/wam/papers/dreamzero) 的 KV-cache 观测替换;注意力/因果一致性与动作误差控制可与 [WorldVLA](/wam/papers/worldvla) 的注意力掩码对读;异步实时化与 [X-WAM](/wam/papers/x-wam) 的 ANS 同属"压住生成开销"的工程路线。
- **被后来者列为基线**:[WALL-WM](/wam/papers/wall-wm)(真机 Task Progress 四套件)与 [DexWorldModel](/wam/papers/dexworldmodel)(RoboTwin)都把 LingBot-VA 列入对比(均为各自作者自评 ⚠️),可去两页看相对位置。
- **机构**:出自**蚂蚁集团灵波(Robbyant)**,是本站收录的首个蚂蚁系 WAM 工作。

## 五、局限与存疑

- **原论文无自评定量**:摘要未给成功率/数据规模,本页定量主要来自第三方鲁棒性研究(74.2% on RoboTwin 2.0-Plus ⚠️),且为对比研究而非统一榜单,跨工作横比需谨慎。
- **单/多流归属待核**:MoT 共享潜空间在综述"单流 vs 多流"中的确切归类未明(待核)。
- **实现细节缺位**:MoT 专家结构、潜空间与 token 化、扩散调度、训练数据规模与来源等摘要未给(待核)。
- **与 LingBot-VLA 易混**:灵波另有 VLA 基础模型 LingBot-VLA,二者不同工作,本页只覆盖世界-动作模型 LingBot-VA。

## 参考文献

- Lin Li, Qihang Zhang, Yiming Luo, Shuai Yang, Ruilin Wang, Fei Han, Mingrui Yu, Zelin Gao, Nan Xue, Xing Zhu, Yujun Shen, Yinghao Xu. *Causal World Modeling for Robot Control*(LingBot-VA). arXiv:**2601.21998**,提交 2026-01-29(修订 2026-03-22);蚂蚁集团灵波 / Robbyant。项目页 technology.robbyant.com/lingbot-va;代码 GitHub robbyant/lingbot-va。
- 第三方对比:《Do World Action Models Generalize Better than VLAs? A Robustness Study》,arXiv:**2603.22078**(LingBot-VA RoboTwin 2.0-Plus 74.2%、Cosmos-Policy LIBERO-Plus 82.2% 等)。
- 归类据 WAM 综述 arXiv:2605.12090 Fig 2(Joint·扩散支)。

> 体例声明:⚠️ 为提出方/研究方自评数字,尚无基准维护方统一第三方评测;**待核** 表示一手源未给出、不以外部记忆或常识补全。本页不使用 ✅。
