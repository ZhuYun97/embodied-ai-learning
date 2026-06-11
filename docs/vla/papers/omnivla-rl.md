---
title: OmniVLA-RL 细读:MoT 三专家(reasoning/spatial/action)+ Conditional Flow Matching + Flow-GSPO 在线 RL(碧桂园服务 AI Lab / ECNU 等)
description: OmniVLA-RL(arXiv 2604.17706,v2 2026-04-24)用 Mix-of-Transformers 整合 reasoning / spatial / action 三专家,reasoning expert 由 PaLiGemma 初始化、spatial expert 用 VGGT,action expert 以 Conditional Flow Matching 建模连续动作块;在线 RL 阶段提出 Flow-GSPO(把流匹配重表述为 SDE 再接 GSPO)。作者自评 ⚠️ LIBERO 平均 97.6%、LIBERO-Plus 80.3%(仅见于全文,摘要仅称 "decent overall performance")。机构非头部名录,本站以「第二梯队·观察级」收录。
---

# OmniVLA-RL 细读

> **VLA 论文细读** · 连续·扩散/流匹配 · ECNU/碧桂园服务 AI Lab 等
> [← 主报告](/vla/) · [WAM 总览](/wam/)

> ⚠️ **收录定位提示** — 本工作机构(碧桂园服务 AI Lab / Omni AI / VBot / 华东师范大学)均**非本站头部名录**,且其 arXiv **摘要页定量缺失**(仅称 "decent overall performance"、无任何数字),关键成绩只出现在**全文**。综合"摘要表述含糊 + 无开源 + 预印本未经第三方复现",本站以**「第二梯队·观察级」**收录;本页所有定量数字均为作者自评 ⚠️,谨慎对待。详见 [§五](#五局限与存疑)。

## TL;DR

OmniVLA-RL 是 **碧桂园服务(Country Garden Services)AI Lab × Omni AI × VBot × 华东师范大学(ECNU)** 的 VLA 工作(arXiv:[2604.17706](https://arxiv.org/abs/2604.17706),v1 2026-04-20 / v2 2026-04-24;7 位作者,通讯兼共同一作 **Haoxiang Jie**,邮箱 `jiehaoxiang@bgyfw.com`)。核心主张:用 **Mix-of-Transformers(MoT)** 把 **reasoning / spatial / action 三个专家**在共享 Transformer 层上协同——**reasoning expert** 由 **PaLiGemma** 初始化(**SigLIP** 视觉编码器);**spatial expert** 用 **VGGT** 抽取细粒度几何特征、以点云 / 相机参数 / 表面法向重建为辅助监督;**action expert** 走 **action chunking**(动作分块,H=16)经线性投影进入潜空间,用 **Conditional Flow Matching(CFM)** 建模连续动作分布。一个 **Block-wise Causal Attention** 把 spatial+semantic token 当作"全可见前缀(omni-visible prefix)"、对 action token 施加严格因果/单向约束,避免动作端的随机噪声"污染"场景理解。在线 RL 阶段提出 **Flow-GSPO**:先借 Fokker-Planck 把确定性 **ODE 重表述为 SDE**,再与 **GSPO**(摘要写作 Group **Segmented** Policy Optimization ⚠️ 命名见 §五)在 action-block 粒度结合,做带 clip + KL 约束的策略优化。三阶段训练:Stage I 大规模 3D 数据集 → Stage II 全量 **DROID** → Stage III 在 **LIBERO / LIBERO-Plus** 上在线 RL。⚠️ 作者自评(**仅见于全文,摘要无数字**):**LIBERO 平均 97.6%**(Spatial/Object 99.2、Goal 98.5、Long 93.5),**LIBERO-Plus 经 Flow-GSPO 达 80.3%**(SFT 基线 41.2%)。**开源状态(2026-06-11 实查):未见放出**——arXiv 摘要页与全文均无代码 / 项目页链接,Web 检索亦未见官方仓库。

## 一、定位与动机

OmniVLA-RL 自陈要补三个洞(据摘要原文):现有 VLA **空间感知不精(imprecise spatial perception)**、**多模态融合次优(suboptimal multimodal fusion)**、**强化学习不稳(instability in RL)**。它的两手对应解法是:

- **架构侧**:用 MoT 让语言 / 视觉 / 空间三类特征做"深度双向交互",并显式塞进一个 **spatial expert**(VGGT + 几何重建辅助监督)以补强空间几何——这是它区别于"纯 VLM + 动作头"VLA 的卖点。
- **训练侧**:把在线 RL 直接做在**流匹配动作策略**上。流匹配是确定性 ODE、本身不便做策略梯度,作者用 **Flow-GSPO** 先 ODE→SDE 注入可控随机性、再套 GSPO 族目标,声称由此换来"动作精度 + 训练鲁棒性"。

在本站谱系中,它落在 **VLA 主线 · 连续动作 · 扩散/流匹配**路线(action expert = Conditional Flow Matching),并叠加**在线 RL**这一支。需要先把话说在前面:**本工作的机构均非头部名录,且摘要表述异常含糊(见 [§五](#五局限与存疑))**,本站按「第二梯队·观察级」收录,页内数字一律标 ⚠️。

机构与署名(按论文署名原文):**Haoxiang Jie¹·∗·†、Yaoyuan Yan¹·∗、Xiangyu Wei³、Kailin Wang¹、Hongjie Yan²·⁴、Zhiyou Heng¹、Daocheng Chen¹**;¹ **AI Lab, Country Garden Services**(碧桂园服务)、² **Omni AI**、³ **VBot**、⁴ **East China Normal University**(华东师范大学)。∗ 共同贡献、† 通讯作者——**通讯作者为第一作者 Haoxiang Jie**(隶属碧桂园服务 AI Lab);ECNU 仅作为 Hongjie Yan 的第二隶属(²·⁴)出现。即:**论文主体与通讯口径在碧桂园服务 AI Lab,而非 ECNU**。

## 二、方法与架构

**Mix-of-Transformers(MoT)总体** — 三个专家共享 Transformer 层、各司其职:

- **Reasoning Expert** — 复用预训练视觉-语言模型 **PaLiGemma**:以 **SigLIP** 作视觉编码器抽高层语义特征,语言 token 经 decoder-only Transformer 主干处理。
- **Spatial Expert** — 用 **VGGT** 抽取细粒度(几何)特征并整合进 Transformer 主干,生成空间表征;以**点云、相机参数、表面法向(surface normal)重建损失**作辅助监督。这是 OmniVLA-RL 相对常规 VLA 的主要增量。
- **Action Expert** — 采 **action chunking** 策略,把动作序列经**线性投影(linear projector)**映入 Transformer 潜空间,用 **Conditional Flow Matching** 建模动作分布 `aₜ ~ p(a | z_spatial, z_sem, z_lang)`;CFM 损失为流匹配回归 `‖v_t(x_t,t;c) − (x₁−x₀)‖₂²`(据论文)。

**Block-wise Causal Attention** — 把 spatial 与 semantic token 视为"**全可见前缀(omni-visible prefix)**",对 action token 施加**严格因果、单向**的注意力约束;论文称此举可阻止动作生成端的随机噪声"污染场景理解(contaminating scene understanding)",从而把**感知**与**随机动作生成**解耦。

**Flow-GSPO(在线 RL)** — 思路是让确定性流匹配"能做策略优化":

1. 借 **Fokker-Planck 方程**把确定性 **ODE 重表述为 SDE**,得到带噪声项的动作演化更新式(论文给出 `A_t^{τ+δ} = A_t^τ + [v_θ + σ_τ²/2(·)]δ + σ_τ√δ·ε` 形式);噪声调度 `σ_τ = σ_max(1−τ)`,`σ_max=0.1`。
2. 在 **action-block 粒度**结合 **GSPO** 族目标:重要性比值 + clip + KL 散度正则。关键超参(据论文,Stage III):group size **G=8**、clip **ε=0.2**、KL 权重 **β=0.01**、去噪步 **K=10**、动作步长 **H=16**;优化器 AdamW(lr=1×10⁻⁵,weight decay=0.01),RL 更新 **200 步**、rollout buffer **每 10 步刷新**。

> 命名提示 ⚠️:论文**摘要**把 GSPO 展开为 "**Group Segmented** Policy Optimization";而 GSPO 原始提法(Qwen 团队)为 "**Group Sequence** Policy Optimization",且全文引用/正文中亦出现 "Sequence" 写法。两处不一致,本页以**摘要原文**记录并标注,孰为笔误**待核**。

**三阶段训练(据论文)**:**Stage I** 大规模 3D 数据集(预训练 spatial expert 的几何能力)→ **Stage II** 全量 **DROID** 数据集(从 Stage I checkpoint 出发、**全参数解冻**)→ **Stage III** 任务环境(**LIBERO / LIBERO-Plus**)上在线 RL,**解冻 Action Expert** 做策略优化。**注**:论文**未明示模型总参数量**(reasoning expert 由 PaLiGemma 初始化,但 backbone 规模/总参数**待核**)。

## 三、实验与关键结果

> ⚠️ **本节所有数字均为作者自评**:成绩出自仿真基准 **LIBERO / LIBERO-Plus**(公共基准,但**预印本未经第三方复现、且代码未放出**);更要紧的是这些数字**只出现在全文,arXiv 摘要仅称 "decent overall performance"、不含任何数值**(见 [§五](#五局限与存疑))。

| 结果 | 数值(作者自评 ⚠️) | 出处(据论文呈现) |
|---|---|---|
| LIBERO 四套件平均成功率 | **97.6%** | Table 1 |
| ├ LIBERO-Spatial | 99.2%(Rank 1) | Table 1 |
| ├ LIBERO-Object | 99.2%(Rank 1) | Table 1 |
| ├ LIBERO-Goal | 98.5%(Rank 1) | Table 1 |
| └ LIBERO-Long | 93.5%(Rank 1) | Table 1 |
| 对 π₀.₅(自陈前 SOTA)增量 | Spatial/Goal +0.4%~+0.5%;Long +1.1% | Table 1(正文) |
| 对 π₀ 增量 | +21.1%(绝对) | Table 1(正文) |
| LIBERO-Plus:Flow-GSPO 终值 | **80.3%**(自 SFT 基线 41.2%,**+39.1%**) | Table 2(消融) |
| LIBERO-Plus:PPO 变体 | 78.7%(+37.5%) | Table 2 |
| LIBERO-Plus:GRPO 变体 | 65.7%(+24.5%) | Table 2 |
| LIBERO-Plus:去掉 Spatial Expert | 32.9%(−8.3%,"最大降幅") | Table 2 |
| Flow-GSPO 收敛曲线 | 前 50 步即 >70%;100 步后 >80%;较 GRPO 高约 **+14.6%**;较 PPO 更单调 | Fig.4(图形呈现) |

**关键读法**:

- **LIBERO 已近饱和**:97%+ 处于该基准上沿,相对 π₀.₅ 的增量仅 +0.4%~+1.1% —— 主表更像"打平/微超 SOTA"而非拉开差距。真正的卖点在 **LIBERO-Plus**(更强扰动的鲁棒性版本)上靠在线 RL 把 SFT 的 41.2% 抬到 80.3%。
- **消融支持两大组件**:去掉 spatial expert 降幅最大(−8.3% → 32.9%),Flow-GSPO 优于 PPO/GRPO 变体(80.3 vs 78.7 / 65.7)—— 这两点是论文论证 MoT-spatial 与 Flow-GSPO 的主要证据。
- ⚠️ **数值与图表对应关系按论文呈现引用**;逐套件 Rank、增量口径、Fig.4 曲线本页不读图取数,仅录论文文字结论。

## 四、与本站谱系的关系

- **MoT + 流匹配 = π 范式的近亲** — OmniVLA-RL 的"PaLiGemma reasoning expert + 流匹配 action expert + 跨专家共享/分块注意力"基本就是 [π0](/vla/papers/pi0) 那一套配方;它的增量是**多挂了一个 spatial expert(VGGT + 几何重建监督)**,并把动作建模显式称作 Conditional Flow Matching。可把本工作读作"**π0 式骨架 + 空间专家 + 在线 RL**"的拼装。
- **在线 RL 对照** — 与 [SimpleVLA-RL](/vla/papers/simplevla-rl) 同属"给 VLA 做在线 RL"这一支,但落点不同:SimpleVLA-RL 走 GRPO 式 RL,OmniVLA-RL 则针对**流匹配动作策略**专门设计 Flow-GSPO(ODE→SDE 再接 GSPO 族目标),解决"确定性流匹配不便做策略梯度"的问题。两者可对读 RL 算法在连续动作 VLA 上的不同接法。
- **真机 RL 的反差** — 与 [π0.6 / π*0.6](/vla/papers/pi06) 的 RECAP **真机** RL 形成鲜明对照:OmniVLA-RL 的 RL **只在仿真**(LIBERO / LIBERO-Plus)内完成、无真机结果;π0.6 则把 RL 推到真实机器人闭环。OmniVLA-RL 的鲁棒性增益目前停留在仿真扰动基准上,真机泛化**待核**。

## 五、局限与存疑

**核查警示(本工作的收录定位)**:

- **摘要定量缺失**:arXiv 摘要仅以 "**decent overall performance**" 和 "surpasses mainstream existing methods" 等含糊措辞带过,**无任何数字**;LIBERO 97.6% / LIBERO-Plus 80.3% 等关键成绩**只见于全文**。这种"摘要不亮数、正文才给数"的写法,叠加下述因素,使本工作的可信度需打折——本站据此以**「第二梯队·观察级」**收录。
- **机构非头部名录**:署名机构为碧桂园服务(Country Garden Services)AI Lab、Omni AI、VBot、华东师范大学,均非具身/VLA 领域头部团队;通讯口径在碧桂园服务 AI Lab。
- **未开源(2026-06-11 实查)**:arXiv 摘要页与 HTML 全文均**无代码 / 项目页 / 权重链接**;Web 检索未见官方 GitHub 仓库或项目主页。**无法第三方复现**。

**其他存疑 / 待核项**:

- **全部为作者自评 ⚠️**:虽用公共基准 LIBERO / LIBERO-Plus,但预印本未经第三方复现,且无代码佐证。
- **LIBERO 近饱和**:主表对 π₀.₅ 仅 +0.4%~+1.1%,边际信息有限;真正增益集中在 LIBERO-Plus 的 RL 段。
- **总参数量未给**:论文未明示 backbone / 模型总参数;reasoning expert 由 PaLiGemma 初始化、spatial 用 VGGT,但合计规模**待核**。
- **GSPO 命名不一致**:摘要 "Group **Segmented**" vs 原始 GSPO "Group **Sequence**"(全文亦见 Sequence 写法),孰为笔误**待核**(见 §二)。
- **RL 仅在仿真**:无真机实验,sim-to-real 泛化**待核**。
- **表/图归属**:Table 1 / Table 2 / Fig.4 的编号按论文呈现引用;Fig.4 为曲线图,本页未读图取数。

## 参考文献

- 一手论文:arXiv:[2604.17706](https://arxiv.org/abs/2604.17706) *OmniVLA-RL: A Vision-Language-Action Model with Spatial Understanding and Online RL*(v1 2026-04-20 / v2 2026-04-24;AI Lab, Country Garden Services × Omni AI × VBot × East China Normal University;通讯 Haoxiang Jie)。HTML 全文:[arxiv.org/html/2604.17706](https://arxiv.org/html/2604.17706)。
- 基准:**LIBERO**、**LIBERO-Plus**(仿真操作基准);训练数据含 **DROID**(Stage II)。
- 相关基座/方法(论文引用,本页不外链):PaLiGemma(reasoning expert 初始化)、SigLIP(视觉编码器)、VGGT(spatial expert)、GSPO(策略优化族)。
- 开源状态:**实查未见放出**(2026-06-11;arXiv 全文与摘要页均无代码/项目页链接,Web 检索未见官方仓库)。

> 体例声明:✅ 为本站实查(arXiv 解析、开源放出状态、Web 检索);⚠️ 为作者自评或厂商口径(预印本未经第三方复现);**待核** 表示一手源未给出、不以外部记忆或常识补全。机构按论文署名原文记录。
