---
description: Qwen-RobotWorld 技术报告解读(arXiv:2606.17030,Qwen):语言条件视频世界模型,用冻结 Qwen2.5-VL 作为动作/语义编码器、60 层 double-stream MMDiT 生成未来视觉轨迹,以 8.6M video-text pairs / 200M+ frames 的 EWK 数据统一 manipulation、driving、indoor navigation 与 human-to-robot transfer。
title: Qwen-RobotWorld 细读
---

# Qwen-RobotWorld:用自然语言统一动作接口的视频世界模型

> **论文**: Qwen-RobotWorld Technical Report: Unifying Embodied World Modeling through Language-Conditioned Video Generation  
> **arXiv**: [2606.17030](https://arxiv.org/abs/2606.17030)(v1 2026-06-15; v3 2026-06-17) · 官方博客: <https://qwen.ai/blog?id=qwen-robotworld>  
> **路线**: WAM / 世界模型基座 · language-conditioned video generation · Double-Stream MMDiT · Embodied World Knowledge(EWK)

> [← 返回 WAM 总览](../index.md)

---

> ⚠️ **可信度提示**:本文是 Qwen 团队 2026-06 技术报告,自评为主;EWMBench、DreamGen Bench、WorldModelBench、PBench 等分数不可与 VLA 成功率混比。本页把它归入 WAM 的"跨范式·基座/平台/仿真"类,而非 VLA 操作策略页。

## TL;DR

Qwen-RobotWorld 是 Qwen-Robot Suite 里最接近"数据层 / 仿真层 / 世界模型层"的一篇。它不直接输出机械臂动作,而是用**自然语言作为统一 action interface**,从当前观测和语言动作描述生成未来视觉轨迹。

它想服务三类下游:

1. **合成数据生成**:为 policy training augmentation 生成未来片段;
2. **虚拟评测环境**:为 policy evaluation 提供可扩展视觉世界;
3. **语言引导规划信号**:给下游控制器提供"如果这样做,世界会怎样变"的先验。

核心三件套:

- **Double-Stream MMDiT**:60 层双流 diffusion transformer,一支吃 Qwen2.5-VL 语义/动作编码,一支吃视频 VAE latent,每层 joint attention 融合;
- **EWK 数据集**:约 **8.6M video-text pairs / 200M+ frames**,覆盖 manipulation、autonomous driving、indoor navigation、human-to-robot transfer 与 general video;
- **General + Expert curriculum**:先学通用视觉先验,再逐步注入具身数据,保持 70% embodied / 30% general 的训练混合。

---

## 1. 定位:为什么放 WAM,不是 VLA

Qwen-RobotWorld 的建模对象是未来视觉状态,不是直接动作策略。它符合 WAM 的两个条件:

| 条件 | Qwen-RobotWorld 对应 |
|---|---|
| 预测世界如何变化 | 生成 language-conditioned future video trajectory |
| 与动作/意图耦合 | 把动作统一写成自然语言,由 Qwen2.5-VL 编码为 condition |

但它没有像 GR00T N2 / GigaWorld-Policy 那样直接给出可执行动作头,所以本站将它归入 **跨范式·基座/平台/仿真**:更像世界模型底座和数据/评测引擎。

## 2. 方法:Double-Stream MMDiT + Qwen2.5-VL action encoder

模型由三部分组成:

| 组件 | 作用 | 规模/细节 |
|---|---|---|
| **MLLM action encoder** | 冻结 Qwen2.5-VL,把语言动作/指令编码成条件 hidden states | 约 7B |
| **VAE state encoder/decoder** | 把视频帧编码为 latent,再从 latent 解码回视觉观测 | Wan-VAE,约 127M |
| **MMDiT transition function** | 双流去噪:understanding stream + generation stream,每层 joint attention | 60 blocks, hidden 3072,24 heads,约 20B |

报告强调用 MLLM 作为 action encoder 比 T5 / CLIP 这类轻量文本编码器更适合复杂具身动作,因为它能解析组合指令,也携带物理常识。

## 3. 数据:Embodied World Knowledge(EWK)

EWK 是这篇最重要的数据资产:

| 数据域 | 规模/作用 |
|---|---|
| manipulation | 约 **5.9M samples**,20+ robot morphologies,1300+ skills |
| autonomous driving | 约 **200K samples**,来自 Waymo、NVIDIA PhysicalAI-AD、Bench2Drive、Sekai 等 |
| indoor navigation | 6K+ language-guided episodes,来自 VLNVerse |
| human-to-robot transfer | MANO-to-robot pipeline 跨 14 robot morphologies |
| general video | 约 30%,补通用视觉先验 |

整体约 **8.6M video-text pairs / 200M+ observation frames**,并把 **20+ embodiment types / 500+ action categories** 映射到统一自然语言动作接口。这个数据组织方式解释了为什么它更像"数据 + 世界模型基座"工作。

## 4. 训练课程

训练分两阶段:

1. **General world priors**:T2I / T2V / TI2V 联合训练,用通用数据建立视觉形态和时序先验;T2I 用于稳住几何形态。
2. **Embodied specialization**:逐步加入具身数据,训练混合约 **70% embodied / 30% general**。具身部分里 manipulation 权重最高,约 90%;multi-view concatenation、navigation / driving 各约 5%。

这种配方的目标是:既别丢掉通用视频生成能力,又让模型对机器人操作、驾驶、室内导航这类具身转移更敏感。

## 5. 评测与结果

作者报告(均为自评 ⚠️):

| Benchmark | 口径 | 结果 |
|---|---|---|
| EWMBench | embodied motion fidelity | Overall **4.60**,作者称第 1 |
| DreamGen Bench | 机器人视频生成质量 | Total **4.952**,作者称第 1 |
| WorldModelBench | physical reasoning / instruction following | Total **8.99**,作者称开源模型第 1、总体第 3 |
| PBench | physical behavior evaluation | **0.804**,作者称超过所有开源模型 |
| RoboTwin-IF | zero-shot qualitative / robustness | 用于展示复杂指令下的视频转移能力 |

这些分数衡量的是**视频世界模型质量**,不是机械臂成功率。引用时必须保留 benchmark 名称和口径。

## 6. 局限与风险

1. **不是闭环策略**:它生成未来视觉,不直接保证动作可执行。
2. **评测依赖 VLM judge / benchmark 口径**:DreamGen、PBench 等含自动评审或多维打分,与真实机器人成功率距离很远。
3. **20B MMDiT + 7B MLLM 成本高**:作为数据引擎/世界模型可以接受,但直接上真机闭环很重。
4. **自然语言动作接口有表达瓶颈**:复杂力控、接触、精细轨迹被语言描述压缩后可能损失信息。

## 7. 在谱系中的位置

- **相对 [Qwen-VLA](/vla/papers/qwen-vla)**:Qwen-VLA 是直接策略基座;Qwen-RobotWorld 是世界模型/数据引擎,为策略训练、评测和规划提供未来视觉先验。
- **相对 [WorldVLA](worldvla.md)**:WorldVLA 把视觉与动作 token 放进同一自回归词表;Qwen-RobotWorld 则用 language-conditioned video diffusion,动作接口是自然语言。
- **相对 [Cosmos 3](cosmos3.md)**:Cosmos 3 是全模态基座,可生成动作;Qwen-RobotWorld 更专注 embodied video world modeling,并以 Qwen2.5-VL 作为冻结动作/语义编码器。

一句话:**Qwen-RobotWorld 是 Qwen-Robot 三件套里的"世界模拟器":它不直接控制机器人,而是把不同本体和任务下的动作统一成语言条件,生成未来视觉轨迹,服务合成数据、评测和规划。**

---

## 来源

- 论文:Qwen-RobotWorld Technical Report: Unifying Embodied World Modeling through Language-Conditioned Video Generation. arXiv:2606.17030(v1 2026-06-15, v3 2026-06-17). <https://arxiv.org/abs/2606.17030>
- 官方博客:<https://qwen.ai/blog?id=qwen-robotworld>

> 说明:本页所有 benchmark 数字均按 Qwen 团队自评 ⚠️ 处理;不把视频生成 benchmark 分数解释为机器人策略成功率。
