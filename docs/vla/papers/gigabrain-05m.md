---
description: GigaBrain-0.5M* 解读(arXiv:2602.12099,GigaAI/极佳视界)。提出 RAMP(Reinforcement leArning via world Model-conditioned Policy)——把世界模型既当预训练数据引擎、又当 RL 训练引擎:世界模型联合预测「未来状态 token + 价值」,以此为条件微调策略,再真机滚动采集、世界模型与策略联合自改进。动作头为混合形态:Embodied CoT 的离散动作 token(自回归)+ 流匹配动作 DiT 的连续动作块。基座 GigaBrain-0.5 预训练 10,931h、其中 61%(6,653h)由世界模型 GigaWorld 合成(项目页口径)。
title: GigaBrain-0.5M* 细读
---

# GigaBrain-0.5M*:用「世界模型驱动的强化学习(RAMP)」训出来的 VLA

> **arXiv**: [2602.12099](https://arxiv.org/abs/2602.12099)(v1 2026-02-12,**v2 2026-02-26,本页以 v2 为准**)
> **机构**: GigaAI(极佳视界)· 作者署名 GigaBrain Team(Boyuan Wang, Bohan Li, …, Zheng Zhu 等 25 人)· 项目页 [gigabrain05m.github.io](https://gigabrain05m.github.io)
> **路线**: 端到端 VLA;**RAMP = 世界模型条件的策略强化学习** + **混合动作头**(离散动作 token + 流匹配动作 DiT);基座 **GigaBrain-0.5**(预训练 10,931h,其中 **61%/6,653h** 由世界模型 [GigaWorld](/wam/papers/gigaworld-policy) 合成 —— 项目页口径)
> **归位**: **VLA·新范式(世界模型驱动的 RL 训练)**

> [← 返回主报告](../index.md)

---

## TL;DR

GigaBrain-0.5M* 的一句话主张:**让同一个世界模型同时扮演「数据引擎」与「RL 引擎」两个角色,把 VLA 从「只会模仿」推到「能从经验里自我改进」。**

VLA 直接从当前观测预测多步动作块,受限于「场景理解窄、对未来缺乏预判」。本文的解法是一套叫 **RAMP**(**R**einforcement le**A**rning via world **M**odel-conditioned **P**olicy)的训练范式,四步迭代:

1. **世界模型预训练**:用大规模真机操作数据训一个世界模型 $\mathcal{W}_\phi$(主干为 **Wan2.2**),让它**联合预测未来视觉状态 $z_\text{future}$ 与价值估计 $v_t$**;
2. **条件化微调策略**:把基座策略 GigaBrain-0.5 的动作**条件在「未来状态 token + 价值」两路信号上**,引导动作朝更优结果走;
3. **真机滚动采集**:策略上真机执行,必要时人工介入接管,攒出「自主 + 专家」混合数据集;
4. **联合自改进**:用滚动数据**同时精修世界模型与策略**,形成持续自我提升的闭环。

作者把 RAMP 与 [π*0.6](/vla/papers/pi06) 的 **RECAP** 对照,并从理论上论证「**RECAP 是 RAMP 的退化特例**——只用稀疏优势(0/1)作条件、丢掉了未来潜状态的信息」。自评(⚠️)在 Laundry Folding / Box Packing / Espresso Preparation 等硬任务上比 RECAP **约 +30%**。

**动作头形态(本页重点结论,已从正文确认,非待核)**:**混合**——高层是 **Embodied 思维链(Embodied CoT)** 的「自回归子目标语言 + 离散动作 token」,底层是 **动作 Diffusion Transformer(DiT)+ 流匹配(flow matching)** 出连续动作块。即「**高层离散自回归 + 底层流匹配**」的分层混合,与 [π0.6](/vla/papers/pi06) 同构。

> ⚠️ **可信度提示(本站体例)**:
> 1. 内部 8 任务的成功率与「+30%」增益**均为作者自评**;
> 2. RoboChallenge 的 **51.67% / 排名第一**为**论文自述、截至 2026-02-09 的公开排行榜口径**,且对应的是**中间迭代版 GigaBrain-0.1**(非本篇主角 0.5M*);
> 3. 「**GigaWorld**」这一名字与「**61%**」**出自项目页**;**arXiv 正文只称 "world model"(Wan2.2 主干),全文未出现 "GigaWorld" 字样**——两套口径分别标注;
> 4. 代码/权重:GitHub 仓库与 HF 组织**确实存在并已开放** GigaBrain-0/0.1 基座权重与 GigaWorld-0-Video,但**本篇主角 GigaBrain-0.5M* 的专属权重本次未见对应 checkpoint(待核)**;
> 5. 型号后缀「**M**」的确切含义**论文未定义(待核)**。

---

## 1. 要解决的问题

主流 VLA「**从当前观测直接预测多步动作块**」存在两个内生短板(摘要原话):**场景理解受限(constrained scene understanding)**、**对未来的预判能力弱(weak future anticipation)**。纯模仿学习还有个天花板:**只会复现示范、难以超越示范**。

近期把 RL 引入 VLA 的工作(如 [SimpleVLA-RL](/vla/papers/simplevla-rl)、[RL-token](/vla/papers/rl-token)、π*0.6 的 RECAP)各有切入。本文的判断是:**与其只给策略一个稀疏的标量奖励/优势信号,不如把「会预测未来 + 会估值」的世界模型直接接进训练回路**——既补「预判」,又给策略一个信息量更大的条件信号,从而突破模仿上限。

---

## 2. 方法与架构

### 2.1 RAMP:世界模型条件的策略强化学习

RAMP 的全称是 **Reinforcement leArning via world Model-conditioned Policy**,核心是让世界模型 $\mathcal{W}_\phi$ **同时输出两路监督/条件信号**,再让策略「读着它们」做动作:

- **未来视觉状态 $z_\text{future}$**:世界模型对「接下来会发生什么」的潜表征;
- **价值估计 $v_t$**:对当前/未来状态好坏的打分。

策略 $\pi$(即 GigaBrain-0.5)在微调阶段**把动作条件在 $(z_\text{future}, v_t)$ 上**,等于在「能看见未来、知道好坏」的前提下决策。四阶段闭环(见 TL;DR):**预训世界模型 → 条件化微调策略 → 真机滚动采集(含人工介入)→ 世界模型与策略联合精修**,可反复迭代自改进。

> 与 RECAP 的关系(口径:论文自述+理论论证):「RAMP 受 π*0.6 的 RECAP 启发,二者都用额外信息作为 VLA 的条件;但 **RECAP 只用稀疏优势(0/1)作输入,信息增益有限**」,作者进而证明「**RECAP 本质上是 RAMP 的退化特例——忽略了未来潜状态信息的那种情形**」。

### 2.2 动作头:混合形态(离散 token + 流匹配,正文已确认)

这是本页要钉死的一个点。正文对动作生成给出**两条并存**的机制:

- **离散动作 token(自回归)**:作为 **Embodied 思维链(Embodied CoT)**的一部分——「Embodied CoT 由**自回归的子目标语言 + 离散动作 token** 组成」;
- **连续动作块(扩散/流匹配)**:用「一个**动作 Diffusion Transformer(DiT)+ 流匹配**来预测动作块」,训练目标含流匹配损失项,噪声插值为线性 $a^\tau=\tau\, a_\text{chunk}+(1-\tau)\,\epsilon$ 的标准形式(具体损失写法以正文公式为准)。

**结论:动作头是「混合(hybrid)」**——高层离散自回归(语言子目标 + 离散动作 token)、底层流匹配 DiT(连续动作块)。**不是单一离散、也不是单一扩散**;这一形态与 [π0.6](/vla/papers/pi06) 的「高层离散自回归 + 底层流匹配」分层范式一致。

### 2.3 基座 GigaBrain-0.5 与「世界模型当数据引擎」

- **基座规模(双口径)**:
  - **项目页口径**:「GigaBrain-0.5 预训练于 **10,931 小时**多样视觉经验,其中 **61%(6,653 小时)由我们的世界模型 [GigaWorld](https://giga-world-0.github.io/) 合成**」;
  - **arXiv 正文口径**:「预训练数据 **超 10,000 小时**,含 **6,000+ 小时世界模型生成数据 + 约 4,000 小时真机采集数据**」(正文**不**点名 GigaWorld,只称 "world model")。
  - 两者一致(≈6 成由世界模型合成),仅**命名与精度口径不同**。
- **同门拼图**:这台「数据引擎/RL 世界模型」与本站 [GigaWorld-Policy](/wam/papers/gigaworld-policy)(GigaAI,Wan2.2 流匹配 DiT 的「动作中心」世界-动作模型)同属 GigaWorld 家族,主干都落在 **Wan2.2** 上;本篇是「**用世界模型训 VLA**」,GigaWorld-Policy 是「**把世界模型本身做成动作中心**」,互为另一半拼图。

### 2.4 与 RoboChallenge 的关系(口径:论文自述,截至 2026-02-09)

正文涉及 RoboChallenge 有两处,照搬不改写:

- **额外后训练**:在 **8 个内部自设任务**之外,「**额外在公开基准 RoboChallenge 的 30 个任务上做了后训练**」;
- **排行榜成绩**:「**一个中间迭代版本(GigaBrain-0.1)截至 2026-02-09 在排行榜排名第一**,平均成功率 **51.67%**,比 **π0.5(42.67%)高 9%**」。

注意:登顶 RoboChallenge 的口径是**中间版 GigaBrain-0.1**,**不是**本篇主角 GigaBrain-0.5M*;且为**论文自述的某一时点排行榜**,本站按公开基准、时点口径标注。

---

## 3. 关键设计与创新点

1. **一个世界模型,两个角色**:既是**预训练数据引擎**(合成约 6 成预训练经验),又是 **RL 训练引擎**(提供「未来状态 + 价值」双条件并参与联合精修)——这是本文相对一般「VLA+RL」工作的最大结构差异。
2. **从稀疏优势升级到稠密条件**:把 RECAP 的「0/1 稀疏优势」换成「未来潜状态 $z_\text{future}$ + 价值 $v_t$」的稠密条件,理论上把 RECAP 收编为自家退化特例。
3. **混合动作头**:Embodied CoT 的离散动作 token(可推理)+ 流匹配 DiT 的连续动作块(可精细),兼顾「会想」与「手稳」。
4. **真机自改进闭环**:第 3/4 阶段的「人工介入采集 → 世界模型与策略联合精修」给出可持续的数据飞轮。

---

## 4. 实验与关键结果

> ⚠️ 除 RoboChallenge 排行榜(公开基准、时点口径)外,以下为**作者自评**。

- **主结果(内部 8 任务)**:「RAMP 在所有评测任务上达到近乎满分的成功率,显著超过全部基线;在 **Box Packing 与 Espresso Preparation** 上提升尤为明显,**比 RECAP 基线高约 30 个百分点**」;另一处概述为「在 **Laundry Folding、Box Packing、Espresso Preparation** 等硬任务上**约 +30%**」。⚠️
- **任务集**:Laundry Folding、Box Packing、Espresso Preparation,以及 Table Bussing、Paper Towel Preparation、Juice Preparation、Box Moving、Laundry Collection 等(对标 [π*0.6](/vla/papers/pi06)/RECAP 的同类长程操作任务)。
- **RoboChallenge**:中间版 GigaBrain-0.1 截至 **2026-02-09** 排行榜第一,平均成功率 **51.67%**,较 π0.5(42.67%)**+9%**(公开基准/时点口径)。
- **长程真机部署**:摘要称在真实机器人部署上实现「可靠的长程执行」与「约 30% 的性能提升」。⚠️

---

## 5. 局限与争议

1. **内部任务全为自评**:8 任务成功率与「+30%」均作者自评,缺第三方复现;唯 RoboChallenge 是公开基准但仍是论文自述的某时点排名。
2. **命名链路待厘清**:GigaBrain-0.1(RoboChallenge 登顶)/ 0.5(基座)/ 0.5M*(RL 版)之间的关系正文交代不完全统一,**「M」后缀含义未定义(待核)**。
3. **正文未点名 GigaWorld**:「GigaWorld + 61%」是项目页口径,arXiv 正文只称 world model(Wan2.2 主干);把数据引擎与 RL 世界模型直接等同需谨慎(正文未明确两者是否为同一模型)。
4. **主角权重未见**:GitHub(`open-gigaai/giga-brain-0`,Apache-2.0)与 HF 组织 `open-gigaai` 已放出 GigaBrain-0 / GigaBrain-0.1-3.5B-Base 基座权重与 GigaWorld-0-Video,但**GigaBrain-0.5M* 的权重/ RAMP 训练代码本次未见对应 checkpoint(待核)**,目前仅见技术报告与项目页。
5. **依赖世界模型保真度**:RAMP 的增益建立在「世界模型能可靠预测未来 + 估值」之上;世界模型失真则条件信号失真,风险与收益同源。

---

## 6. 在 VLA 谱系中的位置

- **新范式坐标:世界模型驱动的 RL 训练**。相对「VLA + 稀疏奖励 RL」的 [SimpleVLA-RL](/vla/papers/simplevla-rl) / [RL-token](/vla/papers/rl-token),本篇把**世界模型的「未来状态 + 价值」当稠密条件**注入策略,并让世界模型**参与数据生成与联合精修**——RL 的「环境/奖励」由一个会预测的世界模型来扮演。
- **对 RECAP 的承接与超越(口径:论文自评)**。直接把 [π*0.6](/vla/papers/pi06) 的 **RECAP**(优势条件策略,Physical Intelligence)设为头号对照,并论证 RECAP 是 RAMP 的退化特例;评测任务也刻意对齐 π*0.6(折衣、装箱、做意式咖啡)。
- **与 [GigaWorld-Policy](/wam/papers/gigaworld-policy) 是同门的「另一半拼图」**。两篇都来自 GigaAI、主干都在 Wan2.2:GigaWorld-Policy 解「**怎么把世界模型做成高效的动作中心模型**」,本篇解「**怎么用世界模型把 VLA 训得更强**」;前者偏推理期效率,后者偏训练期范式。
- **动作头谱系**:与 [π0.6](/vla/papers/pi06) 一致地走「**高层离散自回归 + 底层流匹配**」的混合路线,而非单一离散 token 或单一扩散策略。

一句话:**GigaBrain-0.5M* 用 RAMP 把「世界模型」同时坐实为「预训练数据引擎」和「RL 训练引擎」,以「未来状态 + 价值」的稠密条件把 RECAP 收编为退化特例,自评在折衣/装箱/意式咖啡等硬任务比 RECAP 约 +30%;动作头是「离散动作 token + 流匹配 DiT」的混合形态(已确认);代价是内部数字全为自评、命名链路与「GigaWorld/61%」的正文口径需厘清、主角权重尚未释放(待核)。**

---

## 来源

- 论文:GigaBrain-0.5M*: a VLA That Learns From World Model-Based Reinforcement Learning. arXiv:**2602.12099**(v1 2026-02-12;**v2 2026-02-26**)。GigaAI(极佳视界),GigaBrain Team。<https://arxiv.org/abs/2602.12099> · 全文 <https://arxiv.org/html/2602.12099v2>
- 项目页(「GigaWorld + 61%(6,653h/10,931h)」「代码/权重」口径来源):<https://gigabrain05m.github.io>
- 代码/权重(已存在,已核):GitHub `open-gigaai/giga-brain-0`(Apache-2.0)<https://github.com/open-gigaai/giga-brain-0> · HF 组织 `open-gigaai`(已放 GigaBrain-0 / GigaBrain-0.1-3.5B-Base / GigaWorld-0-Video;**0.5M* 权重未见,待核**)<https://huggingface.co/open-gigaai>
- 同门拼图:[GigaWorld-Policy](/wam/papers/gigaworld-policy)(GigaAI,Wan2.2 动作中心世界-动作模型)
- 对照基线:[π0.6 / π*0.6(RECAP)](/vla/papers/pi06) · RL 训 VLA 对照 [SimpleVLA-RL](/vla/papers/simplevla-rl) · [RL-token](/vla/papers/rl-token)

> 说明:第 4 节除 RoboChallenge(公开基准、2026-02-09 时点口径)外均为**作者自评**(⚠️);「GigaWorld」「61%」为**项目页口径**(arXiv 正文只称 world model / Wan2.2 主干、未点名);「M」后缀含义与 GigaBrain-0.5M* 专属权重均**未确认(待核)**——以上按本站 ⚠️/待核 体例处理。
