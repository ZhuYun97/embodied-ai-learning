---
title: HiMem-WAM 细读:分层潜动作 + 边界触发记忆门控的世界-动作模型(港大 × INFIFORCE × 华科)
description: HiMem-WAM(arXiv 2606.10363,v1 2026-06-09)把 WAM 的"动作相关视觉动态"折进训练期监督——低层 motion-centric latent actions(DPFlow 光流变分 tokenizer)+ 高层 skill latents(边界发现/变长池化)+ 边界触发的门控外部记忆;推理全因果,不在测试时生成未来视频或估计光流。LIBERO 97.7 / LIBERO-PLUS(零样本)76.0 / RMBench 26.3 / 真机双臂 10 任务,数字均作者自评 ⚠️。本站第二梯队·观察级收录。
---

# HiMem-WAM 细读

> **WAM 论文细读** · 联合·混合(分层潜动作 + 边界触发记忆门控,推理因果) · 港大(HKU)× INFIFORCE × 华中科技大学(HUST)
> [← WAM 总览](/wam/) · [主报告](/vla/)

> 🔭 **2026-06-11 观察级收录** — 本页据一手论文 arXiv:[2606.10363](https://arxiv.org/abs/2606.10363)(*HiMem-WAM: Hierarchical Memory-Gated World Action Models for Robotic Manipulation*,**v1 2026-06-09**,cs.RO)逐节抽取。论文极新(仅 2 天),全部结果为作者自评、未经第三方复现;机构已自署名区一手溯源(见 [§一](#一定位与动机)),开源状态为 2026-06-11 实查。归本站 **第二梯队·观察级**,理由见 [§五](#五局限与存疑)。

## TL;DR

HiMem-WAM 是 **港大(HKU)× INFIFORCE × 华中科技大学(HUST)**(另含清华/武大/南科大,共 6 个署名机构,15 位作者,通讯 **Mingqi Yuan、Jiayu Chen**,项目负责人 **Xiaoquan Sun**)的一篇 WAM 工作。它要解决的痛点是:**现有 WAM 在长程操作里缺乏"任务相关记忆"**。其方案是一个**分层、记忆门控的统一世界-动作策略**,把三件事拼进同一个因果策略里:

1. **motion-centric latent actions(低层潜动作)** — 用变分 tokenizer 把多视角**光流(DPFlow)** + 观测编码成紧凑运动空间(flow 重建 + 有标签时的动作对齐 + KL 正则);
2. **high-level skill latents(高层技能潜变量)** — 对低层序列做**边界预测 + 变长片段池化**的层次切块,得到结构化时序抽象;
3. **boundary-triggered memory(边界触发记忆门控)** — 一个外部记忆库,read gate 取历史上下文喂 planner,write gate 由**预测的 skill 边界分**决定"只在技能切换处写入"紧凑任务状态。

关键设计取向:**未来视觉动态只在训练期当监督**(低层 tokenizer 学光流),**推理期保持因果——不生成未来视频、不估计光流**(对照 §二 Eq.1 因式分解)。planner backbone 为 **Qwen3-VL-4B-Instruct**;训练分三阶段(I 离线低层 tokenizer → II 技能发现 + 无记忆潜策略预训练 → III 接门控记忆微调,带 teacher-forced 记忆 warmup)。⚠️ 自评结果:**LIBERO 97.7%**、**LIBERO-PLUS(零样本)76.0%**、**RMBench 26.3%**、真机硬任务**较 π0.5 均值高 22.5%**。开源:**论文全文 + arXiv 摘要页均未给出代码/项目链接,实查未见开源**。

## 一、定位与动机

VLA 直接端到端预测动作,常对部署偏移(光照、相机视角变化)不鲁棒;WAM 用"未来预测 / 视频生成 / 潜在动力学"学到动作相关的视觉动态先验,鲁棒性更好,但**长程任务仍低效、且缺乏对"已完成子任务 / 任务进度"这类任务相关记忆的保持**(论文引 RMBench 指出固定长度的观测历史不足以保留任务相关信息)。HiMem-WAM 的主张是:**把世界模型的"动作相关动态"内化进分层潜动作的表示学习里(训练期监督),而非在推理时显式生成未来**;再叠一层"只在技能边界稀疏写入"的门控记忆,补上长程记忆。

**归组判断(本站):联合·混合。** 理由有三:

- **是"联合/统一"而非"级联"**:论文 Figure 2 明确把它框为"extends unified world action modeling with a memory expert"。世界-动态知识通过 latent-action 预训练**内化进同一个因果策略**,并与动作预测**联合**建模(§二 Eq.1 把 skill latent、motion latent、动作三层联合因式分解);它**不**走"先生成整段未来(显式视频/隐式潜在未来)→ 再抽动作"的级联管线——论文反复强调推理期不生成未来、不估光流。其中 z^h→Z^l→a 的层次是**单一策略内部的抽象分解**,不是 WM→policy 的两段级联。
- **是"混合"而非纯自回归 / 纯扩散**:它**糅合了异构机制**——变分(VAE 式)光流 tokenizer + 层次技能发现(边界预测 + 变长池化)+ VLM planner(Qwen3-VL)+ 边界门控外部记忆 + 回归/NLL 动作解码器。动作头是 **L2 回归或 NLL**(§二),既非 GPT 式逐 token 自回归、也非扩散/流匹配动作头(论文里的 diffusion / flow-matching 字样全属基线:DP、π0、X-VLA 等)。
- 故落在 **联合·混合**,而非级联·显式/隐式、联合·自回归、联合·扩散。

**机构溯源(一手,自论文 HTML 署名区抽取)。** 6 个署名机构:① The University of Hong Kong;② INFIFORCE;③ Huazhong University of Science and Technology;④ Tsinghua University;⑤ Wuhan University;⑥ Southern University of Science and Technology。第一作者/项目负责人 **Xiaoquan Sun**(†)署 ②③(INFIFORCE + 华科);两位通讯 **Mingqi Yuan**、**Jiayu Chen**(∗)均署 ①②(港大 + INFIFORCE),邮箱均为 `@hku.hk`。即:**港大 × INFIFORCE 为核心、华科深度参与**的多机构学术合作。其中 INFIFORCE 为署名机构原文(本站此前无收录,不外检评估其背景)。

## 二、方法与架构(据论文 §3)

**策略因式分解(Eq.1)** — 在时刻 t,策略接收多视角 RGB 观测 o_t、本体感受 p_t、指令 ℓ、外部记忆 M_t,输出动作块 a_{t:t+K-1};核心是把它经**高层 skill latent z_t^h** 与**低层 latent-action chunk Z_{t:t+K-1}^l** 因式分解:

> π_θ(a | o,p,ℓ,M) = ∫ p(a | Z^l, o, p) · p(Z^l | z^h, o, p, M) · p(z^h | o, p, ℓ, M) dZ^l dz^h

三个角色分离:**选当前技能(z^h)→ 把技能展开成短程运动(Z^l)→ 把运动落地为本体相关控制(a)**。论文原话:"Future visual dynamics are used only as training supervision, so inference remains causal and does not require video generation or optical-flow estimation."

**低层 latent actions(motion-centric)** — 对每个 transition 用 **DPFlow** 算多视角光流 Φ_t;变分 tokenizer 把短程上下文 c_t=(o_t, o_{t+1}, p_t, ℓ, Φ_t) 编码成 q_φ(z_t^l|c_t)=N(μ,diag(σ²))(重参数化采样)。损失 = **光流重建(L1)+ 有动作标签时的动作对齐(L2,掩码 𝕀^act)+ KL 正则**。注:光流与未来观测**仅用于构造监督**,部署策略不需要(论文 Table 5 明确区分"离线监督 vs 在线输入")。

**高层 skill latents** — 对低层序列做 H 级层次切块:逐级算相邻 token 的**边界分**(基于归一化 q/k 的相似度),阈值化得边界集合,再对变长片段做**注意力池化**得到上一级 skill 表示(Eq.4 起);技能发现损失含 next-latent 预测、motion 重建、片段比例约束、一致性等项。

**记忆门控模块** — 外部记忆库 M 存 skill 级 token。**read gate**:c_t^m=Attn(W_q x_t, W_k M, W_v M),x̃_t=x_t+α_t^r·W_m c_t^m,α_t^r=σ(G_r(·));**write gate**:α_t^w=σ(G_w(x̃_t, ẑ^h, b̂)),仅当 **α_t^w>η** 时才用 U_ψ 更新记忆,否则保持不变(Eq.6/32)。write gate 由**预测的边界分 b̂** 控制——**只在技能切换处写入**;门控损失用 BCE 对齐边界标签,并以 ℓ1 鼓励**稀疏读写**。planner 为 **Qwen3-VL-4B-Instruct**:h_t^plan=QwenPlan(o_t, ℓ, P_p(p_t), P_m(c_t^m)),再经头 H_z、H_b 出 skill latent ẑ^h 与边界分 b̂(Eq.27/28)。

**动作生成** — executor π^exec 由 (x̃_t, ẑ^h) 展开低层 latent-action chunk;**动作解码器 D_act** 把 chunk 映射为可执行控制 â_{t:t+K-1}=D_act(Ẑ^l, x̃_t)。动作损失 L_act 给了两式:**L2 回归(Eq.38)** 或 **负对数似然 NLL(Eq.39)**——即支持确定性/概率式解码,而非以扩散/流匹配为主线。推理时"读记忆→预测 skill→展开低层 chunk→解码动作→仅 α^w>η 时写一条记忆",**全程因果**,保留标准 action-chunking 接口。

**三阶段训练(论文 Figure 1 / 附录 A.6)** — **Stage I** 从演示中离线学低层 latent-action tokenizer(光流监督);**Stage II** 学从视频+语言预测潜动作(技能发现 + 潜策略预训练,**记忆关闭**);**Stage III** 接门控记忆做历史感知的动作预测微调(含 teacher-forced 记忆 warmup)。

**参数规模**:planner backbone = Qwen3-VL-4B-Instruct(~4B);**模型总参数论文未明确给出(待核)**。

## 三、实验与关键结果

> ⚠️ 全部数值为**作者自评**(预印本 v1,未经第三方复现)。指标 = 成功率(SR);LIBERO/LIBERO-PLUS 每任务 50 rollouts,RMBench 每任务 100 rollouts。

| 评测 | HiMem-WAM(⚠️) | 对照 / 备注(⚠️) | 出处 |
|---|---|---|---|
| **LIBERO**(标准 4 套件) | **97.7** 均值(Spatial 98.2 / Object 99.8 / Goal 98.4 / Long 94.5) | Fast-WAM 97.6、AtomVLA 97.0、π0 94.2、OpenVLA 76.5——**已近饱和,与 Fast-WAM 实质持平** | 论文 Table 2 |
| **LIBERO-PLUS**(零样本,仅用标准 LIBERO 训练) | **76.0** 均值(7 类扰动) | 全表最高:HoloBrain-0 75.3、OpenVLA-OFT 71.4、RIPT-VLA 70.2、π0 56.1、WorldVLA 25.6 | 论文 Table 3 |
| └ 分扰动轴 | Cam 78.2 / **Init 38.1** / Lang 76.6 / Light 92.2 / BG 91.0 / Noise 80.7 / Layout 74.9 | **Init(初始位姿扰动)是所有方法的共同弱项** | 论文 Table 3 |
| **RMBench**(记忆相关长程任务) | **26.3** 总均值(M(1) 任务 31.6 / M(n) 任务 19.8) | 约为最强基线(≈10.8%)的 **2.4 倍**;但**绝对 SR 仍低** | 论文 Table 1 |
| **真机**(双臂 AgileX Piper ×2,6-DoF;4× RealSense D435i;10 任务;ST 设定) | Joint Pos:Easy 100/100,Medium 80/82.5,**Hard 15→35**;EE Pose:Easy 90/100,Medium 67.5/75,**Hard 10→30**(w/o → w/ Stage II) | Stage II 潜动作预训练在 **Hard 任务增益最大**;论文称真机硬任务**较 π0.5 均值高 22.5%** | 论文 Table 4 + 正文 |
| **消融**(Stage II) | LIBERO 96.6 → **97.7**(+1.1);LIBERO-PLUS 72.2 → **76.0**(+3.8) | 扰动下增益更大 → 潜动作捕捉"任务完成运动"而非过拟合 | 论文 Table 2/3 |

**关键观察(论文自述)**:① **分层潜动作主要在"鲁棒性"上见效**——LIBERO-PLUS(部署扰动、零样本)增益(+3.8)大于干净 LIBERO(+1.1);② **记忆模块主要利好"记忆相关长程任务"**——抽象/概念上对 RMBench 这类需要跨长程保留任务信息的任务有实质帮助(论文 Conclusion/Abstract 口径);③ 真机评测含 **ST(干净)/ GE(部署扰动)** 两设定,GE 引入物体位姿变化、未见干扰物、布局/高度变化等——本页对 Figure 3(图形呈现 ST/GE × 难度的 SR)**遵循"不读图取数"**,仅录 Table 4(ST 设定、动作表征 × Stage II)数值与正文文字结论。

## 四、与本站谱系的关系

- **记忆路线对照([MemoryVLA](/vla/papers/memoryvla) / [MemoryVLA++](/vla/papers/memoryvla-plusplus))**:论文**显式援引** MemoryVLA(arXiv:2508.19236)并划清界限——"Unlike dense history aggregation or fixed memory windows, HiMem-WAM writes compact task states **only at learned skill boundaries**"。即 MemoryVLA 走**稠密历史聚合 / 感知-认知双记忆**,HiMem-WAM 走**稀疏、边界触发的写入**:记忆只在技能切换处增长(写入次数 ≈ 技能数,而非时间步数),由 write gate + ℓ1 稀疏约束控制。是"如何省着用记忆"这条线上与 MemoryVLA 系的直接对话。
- **潜动作对照([LAPA](/wam/papers/lapa))**:HiMem 的低层 latent actions 与 LAPA"从无动作标签视频学潜动作"同源思路,但三点不同——① 以**光流(DPFlow)**为载体做 motion-centric 监督;② 在其上再叠**高层 skill latent**(LAPA 为单层);③ 潜动作主要作**表示/监督**,与动作解码、记忆门控统一进一个因果策略。论文未引 LAPA,此为本站对读。
- **O(1) 记忆对照([DexWorldModel](/wam/papers/dexworldmodel))**:DexWorldModel 追求**常数 O(1) 记忆**;HiMem-WAM **未声称 O(1)**(全文无 "O(1)"/"constant" 表述),其外部记忆库随技能边界**稀疏增长**——同属"压缩历史"哲学,但一个走定长压缩、一个走"边界稀疏写入",压缩粒度与上界不同,可并置参照。

## 五、局限与存疑

**观察级定位(如实交代)**。本站将 HiMem-WAM 归 **第二梯队·观察级**,叠加三点:

1. **极新**:v1 仅 2026-06-09(本页 2026-06-11 撰),**结果与署名后续版本可能变动**;
2. **机构信号**:机构已自署名区**一手溯源**(港大/INFIFORCE/华科等,见 §一),但核心署名主体之一 **INFIFORCE** 本站此前无收录、其工作积累在**不外检**的前提下无法评估;
3. **全为作者自评、未见开源**(下),暂无第三方复现锚点。

**论文自陈局限(§6 Limitations)**:① **训练管线算力开销可观**——含光流提取、潜动作学习、技能发现、记忆策略训练多环节;② **多阶段设计带来工程复杂度**,性能依赖学到的潜动作 / 技能边界 / 记忆更新的质量;③ **真机评测仅在一个特定双臂平台 + 10 个任务**上进行,虽覆盖不同难度与扰动,但**更多任务、更大数据规模、多样本体**的验证仍待补,框架可扩展性有待进一步检验。

**本站补充存疑**:

- **LIBERO 近饱和**:97.7 vs Fast-WAM 97.6,且 Object(99.8 < 100.0)、Long(94.5 < 95.2)反被 Fast-WAM 反超——HiMem 在干净 LIBERO 上**实质持平**,卖点不在此而在扰动鲁棒性(LIBERO-PLUS)与记忆任务(RMBench)。
- **RMBench 绝对值仍低**:26.3% 虽约为最强基线 2.4 倍,但**绝对成功率不高**,记忆相关长程操作远未解决。
- **记忆模块(Stage III)缺干净独立消融行**:提取到的表中,LIBERO/LIBERO-PLUS 给了 "w/o Stage II",但**未见 "w/o memory" 的 RMBench 对照行**;"记忆模块利好记忆相关任务"为论文 Abstract/Conclusion 口径,本页按 ⚠️ 记。
- **总参数未明确**:仅知 planner backbone 为 Qwen3-VL-4B-Instruct(~4B),全模型总参数论文未给(待核)。
- **真机 π0.5 对比**:"硬任务较 π0.5 均值高 22.5%" 为正文表述,逐任务 π0.5 真机数值散见 Figure 3(图形),本页不读图取数。
- **开源状态(2026-06-11 实查)**:**论文 HTML 全文(含 intro / conclusion / 附录)与 arXiv 摘要页均无 GitHub / 项目页 / 代码 URL**;arXiv 摘要页亦无 Comments 字段标注代码。**实查未见开源**——核心管线(光流 tokenizer、技能发现、记忆门控)目前**无法独立复现**。

## 参考文献

- 一手论文:arXiv:[2606.10363](https://arxiv.org/abs/2606.10363) *HiMem-WAM: Hierarchical Memory-Gated World Action Models for Robotic Manipulation*(v1 2026-06-09,cs.RO;港大 × INFIFORCE × 华科,另含清华/武大/南科大;通讯 Mingqi Yuan、Jiayu Chen)。
- 论文署名机构(自 HTML `ltx_authors` 署名区一手抽取):① The University of Hong Kong;② INFIFORCE;③ Huazhong University of Science and Technology;④ Tsinghua University;⑤ Wuhan University;⑥ Southern University of Science and Technology。
- 论文内引用的对照工作:MemoryVLA(arXiv:2508.19236,记忆 VLA,被 §2 援引并对比);RMBench、LIBERO-PLUS 为评测基准。
- 开源:截至 2026-06-11 实查,论文与 arXiv 摘要页**未给出**代码/项目链接。

> 体例声明:✅ 为本站实查(arXiv 解析、署名区一手抽取、开源放出状态);⚠️ 为作者自评(预印本 v1,未经第三方复现);**待核** 表示一手源未给出、不以外部记忆或常识补全。本页归组(联合·混合)为本站按论文自述所作判断;晚于本站 WAM 综述基线,Cascaded/Joint taxonomy 无权威外部归属。
