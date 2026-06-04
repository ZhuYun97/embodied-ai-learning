---
description: RoboVLMs 系统实证研究,用 8+ 个 VLM 主干、4 类 VLA 结构、600+ 组对照实验回答建 VLA 到底什么重要:选哪个主干、用什么结构、何时加跨本体数据,并据此提出刷新 CALVIN/SimplerEnv/真机 SOTA 的 RoboVLMs 框架。
title: RoboVLMs 细读
---

# RoboVLMs:构建 VLA,到底什么才重要(系统实证)

> **arXiv**: [2412.14058](https://arxiv.org/abs/2412.14058) | **机构**: 清华大学 / ByteDance Research / 中科院自动化所(CASIA MAIS-NLPR) / 上海交通大学 / 新加坡国立大学(NUS) | **时间**: 2024.12
> **路线**: 新范式 · 系统实证(VLM 选型 / VLA 结构 / 跨本体 的对照研究)

> [← 返回主报告](../index.md)

> ⚠️ **可信度提示**:本文是一篇**实证(empirical)研究**,核心价值是"对照结论"而非单一新模型。下文报告的全部成功率、平均任务长度均为**作者自评**(CALVIN / SimplerEnv 仿真 + 自建真机基准),并非独立第三方复现;论文 v1 题为《Towards Generalist Robot Policies: What Matters in Building Vision-Language-Action Models》,后续版本标题调整为《What Matters in Building Vision-Language-Action Models for Generalist Robots》,arXiv ID 不变。

---

## TL;DR

在 RoboVLMs 之前,把视觉-语言模型(VLM)改造成视觉-语言-动作模型(VLA)的做法五花八门——主干各不相同、动作怎么接、要不要历史、要不要跨本体数据,各家结论难以横向比较。**RoboVLMs 的贡献不是"又一个新模型",而是一套受控的大规模对照实验**:覆盖 **8+ 个 VLM 主干、4 类 VLA 结构、600+ 组实验**,系统回答三个核心设计问题——**(1) 选哪个主干?(2) 动作/历史的结构怎么搭?(3) 何时引入跨本体数据?**

三条主要实证结论:
- **主干**:在大规模视觉-语言数据上充分预训练、且原生支持图文细粒度对齐的 VLM(论文中 **KosMos-2、PaliGemma** 明显优于其它)更适合做 VLA。
- **结构**:**连续动作 > 离散动作**;**带多步历史观测**至关重要;在历史建模方式里,**独立的策略头(policy head)结构**在泛化与数据效率上最优。
- **跨本体数据**:仅用 Open X-Embodiment 做**预训练本身收益不明显**,但"**跨本体预训练 → 目标本体微调**"的两段式(post-training)能带来增益。

据此,作者把"最优配方"固化为一个少手工设计的开源框架 **RoboVLMs**,在 CALVIN、SimplerEnv 与自建真机基准上均刷新 SOTA(如 CALVIN ABCD→D 平均任务长度 **4.49 / 5**,零样本 ABC→D **4.25 / 5**,均为自评)。

---

## 1. 问题:建 VLA 的设计空间缺乏系统对照

VLA 把预训练 VLM 迁移到机器人操作,被寄望继承其语义理解与泛化能力。但"怎么从 VLM 造出一个好 VLA"在工程上是一个**巨大的设计空间**,而此前各工作往往只验证了空间里的"一个点":

- **主干维度**:有人用 LLaVA、有人用 Flamingo/RoboFlamingo、有人用 Qwen-VL……主干规模、预训练数据、是 encoder-decoder 还是 decoder-only,差异巨大。
- **结构维度**:动作用**离散 token**(类 [RT-2](rt2)/[OpenVLA](openvla) 的自回归量化)还是**连续向量**(MLP/扩散头)?要不要**历史观测**?历史怎么喂进去?
- **数据维度**:要不要用 [Octo](octo)/OpenVLA 那样的**跨本体大数据**([Open X-Embodiment](octo))?在预训练阶段加,还是只在微调阶段用?

这些选择彼此耦合,导致**跨论文结论无法直接比较**——主干、结构、数据往往同时不同,无法归因。RoboVLMs 的出发点正是:**在统一代码与统一评测下,把这些变量逐一拆开做对照**,给出一本"设计指南(guidebook)"。

---

## 2. 方法与架构(RoboVLMs 框架 + 实验设计)

### 2.1 统一框架:把"VLM→VLA"拆成可插拔的组件

RoboVLMs 提供一个统一的模块化框架:**任意 VLM 主干 + 可选的历史建模模块 + 可选的动作解码方式**,从而能在同一套训练/评测管线下,公平地切换组合并测成功率。动作默认采用 **7 自由度**表示(末端位姿 6D:平移 + 欧拉角姿态,外加 1 维夹爪开合);连续动作归一化到 [−1,1],用 MSE(位姿)+ BCE(夹爪)训练;离散动作则将每维量化为 **256 个 bin** 映射到词表 token。模型还支持**动作分块(action chunking)**,一次预测长度为 L 的动作序列。

### 2.2 四类 VLA 结构(本研究的核心对照轴)

论文沿**两个维度**组织 VLA 结构:**动作空间**(离散 / 连续)× **历史建模**(单步 / 多步历史),得到四种代表性形态:

1. **One-Step 离散动作**:仅用当前观测,VLM 自回归输出离散动作 token(最接近 RT-2 / OpenVLA 风格)。
2. **One-Step 连续动作**:仅用当前观测,VLM 输出一个可学习 token,经 MLP 回归出连续动作向量。
3. **Interleaved 连续动作(交错历史)**:把多步"观测 + 可学习 token"交错拼成长序列 `([OBS]_{t-H+1},[LRN]),…,([OBS]_t,[LRN])` 一起喂给 VLM 融合后逐步回归动作(仅 decoder-only 可用)。
4. **Policy-Head 连续动作(策略头历史)**:VLM 对**每一步观测独立编码**输出 token,再由一个**独立的策略头**(RNN / Transformer)聚合历史 token `[LRN]_{t-H+1:t}` 预测动作(encoder-decoder 与 decoder-only 都适用)。

> ```mermaid
> flowchart LR
>   subgraph 输入
>     I["图像观测 o_t + 语言指令 l"]
>   end
>   I --> V["VLM 主干<br/>(8+ 候选: KosMos-2 / PaliGemma /<br/>Flamingo / Qwen-VL / LLaVA / MoonDream / UForm …)"]
>   V --> A1["① One-Step 离散<br/>自回归动作 token"]
>   V --> A2["② One-Step 连续<br/>MLP 回归"]
>   V --> A3["③ Interleaved 历史<br/>观测·token 交错序列"]
>   V --> A4["④ Policy-Head 历史<br/>独立策略头聚合历史 ★最优"]
>   A1 & A2 & A3 & A4 --> ACT["7-DoF 动作 (末端位姿6D + 夹爪)"]
> ```
> *示意图(自绘,据论文描述,非原图)*

### 2.3 实验设计规模

围绕三个设计问题,作者跑了 **8+ 个 VLM 主干、4 类策略结构、600+ 组实验**(论文摘要原文:"over 8 VLM backbones, 4 policy architectures, and over 600 distinct designed experiments")。主干覆盖 **KosMos-2(2B)、PaliGemma(3B)、Flamingo 系列(3B/4B/9B)、Qwen-VL、LLaVA、MoonDream、UForm** 等,既含 encoder-decoder 也含 decoder-only。评测同时包含仿真与真机,并在不同数据规模(约 0.1×–5×)与少样本设定下测数据效率与泛化。

---

## 3. 关键结论(论文的实证发现)

> 以下为论文给出的**实证发现**;具体名次/数值见第 4 节,均为作者自评。

**Q1 — 选哪个主干?** 在大规模图文数据上**充分预训练**、且具备良好细粒度视觉-语言对齐能力的 VLM 更适合做 VLA。论文中 **KosMos-2 与 PaliGemma 明显优于其它主干**;一些主干(如 LLaVA、Qwen-VL)需要额外的视觉 token 重采样才能用。**更大的 VLM 通常更"数据高效"。**

**Q2 — 结构怎么搭?**
- **连续动作显著优于离散动作**,且在更长任务时序上优势更明显;
- **多步历史观测至关重要**——只用单步当前观测(One-Step)的模型明显落后;
- 在两种历史建模方式中,**Policy-Head(独立策略头)优于 Interleaved(交错序列)**:它既**保留了 VLM 原生的图文融合能力**,又能有效整合历史,同时**省去交错长序列带来的显存 / 算力开销**,在新场景零样本泛化与数据效率上都更好。
- 综合即:**"多步历史观测输入 + 连续动作输出 + 策略头结构"是最优配方**;论文据此选用 **KosMos-2 主干 + Policy-Head 连续动作** 作为 RoboVLMs 的代表配置。

**Q3 — 何时加跨本体数据?** 仅用 Open X-Embodiment 做**预训练本身,并不带来明显增益**(论文 Finding:"pre-training with cross-embodiment data does not lead to substantial performance improvements");但采用"**跨本体预训练 → 目标本体微调**"的两段式时能看到收益,且在少样本设定下,预训练有助于提升单任务成功率与平均任务长度。**结论倾向于:把跨本体数据用在"后训练/微调前的预训练"链路,而非指望它单独解决问题。**

---

## 4. 实验与关键结果

> ⚠️ 下列数值均为论文/项目页**作者自评**(CALVIN、SimplerEnv 仿真 + 自建真机基准);SimplerEnv 具体逐项数值论文主要置于附录,正文以"取得最高平均表现"描述,**逐项数字 待核**。

**CALVIN(长程语言条件操作,连续完成 5 个子任务,指标:平均完成任务数 Avg. Len. ∈ [0,5])**

| 设定 | 模型 | 成功率(首任务) | Avg. Len.(/5) |
|---|---|---|---|
| ABCD→D | RoboVLMs(KosMos-2, Policy-Head) | 0.826 | **4.49** |
| ABCD→D | GR-1(此前 SOTA) | 0.731 | 4.21 |
| ABC→D(零样本泛化) | RoboVLMs(KosMos-2, P.H.) | — | **4.25** |
| ABC→D(零样本泛化) | GR-1 | — | 3.06 |

- 在**零样本泛化设定 ABC→D**(训练未见 D 环境)上,RoboVLMs 由 GR-1 的 3.06 提升到 **4.25**,平均任务长度差距尤为明显,体现策略头结构对新场景的鲁棒性。

**SimplerEnv(仿真,WidowX+Bridge 与 Google Robot 两套环境)**
- 论文称其最优 VLA "在 WidowX+Bridge 与 Google Robot 两套环境上都取得**最高平均表现**",对不同设定具鲁棒性;逐项成功率见附录(**待核**)。
- 跨本体相关对照中给出示例数字:经 OXE 预训练再微调,Google Robot 约 **52%** vs 仅微调约 **48%**(作者自评,示意性证据)。

**真机(自建基准,20 个任务 / 5 种设定 / 每任务 3 次 rollout)**
- 最优配置(KosMos-2, Policy-Head)"在所有评测设定下均取得最佳表现",在 Simple 与 Unseen Background 等设定上优势突出,并展现出基线所缺乏的**自我纠错**行为(作者自评)。

**开源**:论文声明开源全部细节——代码、模型、数据集与工具链,以及训练/评测配方(robovlms.github.io)。

---

## 5. 局限与争议

- **自评为主、缺第三方复现**:所有 SOTA 数字来自作者自评(含自建真机基准),CALVIN/SimplerEnv 之外的可比性需谨慎;真机 20 任务规模相对有限。
- **结论的外推边界**:实验主要集中在**单臂、桌面级操作**与上述基准;"连续动作 / 策略头 / 历史更好"的结论在**双臂、移动操作、高频灵巧控制**等场景是否同样成立,论文未充分覆盖。
- **跨本体结论与他人不完全一致**:论文给出"跨本体预训练单独收益有限"的结论,而 [Octo](octo)/[OpenVLA](openvla) 等以 Open X-Embodiment 大规模预训练为核心卖点——这更可能是**数据配比、目标本体、评测口径**差异所致,应理解为"在其设定下的发现",而非对跨本体路线的否定。
- **算力 / 序列长度权衡**:历史步数 H 越大通常越好,但带来显存与算力开销;Interleaved 结构的长序列代价正是 Policy-Head 被偏好的原因之一,实际部署需权衡。
- **标题/版本变动**:同一 arXiv 条目存在两个标题版本(见顶部提示),引用时需注意。

---

## 6. 在 VLA 谱系中的位置

RoboVLMs 在谱系里扮演的是**"方法论标尺 / 元研究"**角色,而非又一条独立技术路线:

- **对离散自回归路线**([RT-2](rt2)、[OpenVLA](openvla)):RoboVLMs 用统一对照得出"**连续动作普遍优于离散**"的结论,为后续多数转向连续/扩散动作头的工作提供了实证背书。
- **对跨本体大数据路线**([Octo](octo)、OpenVLA / Open X-Embodiment):给出了一个相对"冷静"的结论——**跨本体预训练宜作"两段式"的前置环节**,而非万灵药。
- **对 VLM 主干选型**:把"主干预训练质量 / 图文对齐能力"提到一等重要的位置,与 [π0](pi0)、[GR00T N1](groot-n1) 等强调强 VLM 底座的后续工作方向一致。
- 总体而言,RoboVLMs 像是一份"**建 VLA 的工程指南**":它本身的 KosMos-2 + Policy-Head 配置刷新了当时基准,但更长远的价值在于把"主干 / 结构 / 数据"三条设计轴的取舍**讲清楚、可复现**,成为后来者搭建 VLA 时的对照基线。

---
## 来源
- <https://arxiv.org/abs/2412.14058>
- <https://robovlms.github.io/>
- <https://github.com/Robot-VLAs/RoboVLMs>
