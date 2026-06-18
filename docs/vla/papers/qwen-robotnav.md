---
description: Qwen-RobotNav 技术报告解读(arXiv:2606.18112,Qwen):基于 Qwen3-VL 的可重配置导航模型,把 VLN、PointNav、ObjNav、Tracking 与自动驾驶统一为 waypoint trajectory prediction,通过任务模式与 observation context 参数(B、时间衰减、相机权重、采样模式)服务 agentic navigation。
title: Qwen-RobotNav 细读
---

# Qwen-RobotNav:把导航模型做成可重配置的 agent 执行器

> **论文**: Qwen-RobotNav Technical Report: A Scalable Navigation Model Designed for an Agentic Navigation System  
> **arXiv**: [2606.18112](https://arxiv.org/abs/2606.18112)(v1 2026-06-16) · **项目**: [QwenLM/Qwen-RobotNav](https://github.com/QwenLM/Qwen-RobotNav) · 官方博客: <https://qwen.ai/blog?id=qwen-robotnav>  
> **路线**: 具身导航 / VLN · Qwen3-VL backbone · task-adaptive observation encoding · agentic navigation executor

> [← 返回主报告](../index.md)

---

> ⚠️ **可信度提示**:本文是 Qwen 团队 2026-06 技术报告,全部 SOTA 结论、真实机器人 demo 与榜单对比均为作者报告。本站将其归入"分层/推理"而非 manipulation VLA:它主要输出 waypoint trajectory,不是机械臂低层动作策略。

## TL;DR

Qwen-RobotNav 的核心不是再造一个固定 VLN 模型,而是把导航模型做成**可被上层 agent 动态调用的执行器**。它认为导航任务之间最大的差异不是网络结构,而是**应该怎样消费观测历史**:

- VLN 要记住长程路标和历史;
- object search 要保留探索证据;
- target tracking 更依赖最近几帧;
- 自动驾驶要多视角、时序一致和局部反应。

因此它暴露一个参数化接口:

| 控制轴 | 作用 |
|---|---|
| **task mode** | VLN / PointNav / ObjNav / Tracking 等模式选择行为 |
| **visual token budget `B`** | 控制多相机多时刻总视觉 token 数 |
| **temporal decay `γ`** | 控制偏向最近帧还是覆盖长历史 |
| **camera weights `w_c`** | 给前/后/左/右等相机不同重要性 |
| **frame sampling mode** | random / latest,对应历史覆盖 vs 近期反应 |

训练时随机化这些参数,使模型推理时可以被外层 planner 临时重配置,不需要改架构或重新训练。

---

## 1. 定位:不是 manipulation VLA,而是导航基础模型

Qwen-RobotNav 仍然属于 embodied AI / robotics,但它与 Qwen-RobotManip 的输出对象不同:

| 模型 | 输出 | 典型任务 |
|---|---|---|
| Qwen-RobotManip | 连续机械臂 / EEF 动作块 | 抓取、摆放、装配、双臂操作 |
| Qwen-RobotNav | waypoint trajectory,每次输出 K=8 个 `(x,y,theta)` | VLN、PointNav、ObjNav、Tracking、自动驾驶 |

所以它更接近 **VLN / navigation foundation model**,并且适合放在"分层·双系统/推理"路线下:上层 planner 负责拆目标和选择模式,Qwen-RobotNav 负责执行局部导航段。

## 2. 架构:Qwen3-VL + 轻量 waypoint head

模型继承 Qwen3-VL:

- **Vision encoder**:SigLIP-2 ViT + dynamic-resolution + 2D RoPE;通过 patch merger 压缩视觉 token。
- **Language backbone**:Qwen3-VL LLM,处理视觉 token、语言指令和自然语言相机/时间标签。
- **Action head**:4 层 MLP,把最终 hidden state 映射到 **K=8 个 waypoint**,每个 waypoint 为 3 DoF `(x_k,y_k,theta_k)`,总计 24 维输出。

这意味着主体空间推理仍由 Qwen3-VL 完成,导航头非常轻。它不是为每个导航任务配专用 head,而是用 task mode 和 observation config 控制行为。

## 3. 方法核心:Task-Adaptive Observation Encoding

给定多视角历史观测、指令和配置 `Φ=(B, γ, {w_c}, m, b_min, b_max)`,模型先选帧,再按时间权重和相机权重分配 token budget:

| 参数 | 范围 / 形式 | 直觉 |
|---|---|---|
| `B` | 2048–4096 | 总视觉 token 预算 |
| `γ` | `[1,3]` | 越大越偏向最近帧 |
| `w_c` | 每相机权重 | 比如前视更重要,侧/后视较低 |
| sample mode | random / latest | random 覆盖长历史,latest 追求即时反应 |

作者强调:训练时所有参数都随机化,模型不在固定观察策略上过拟合。推理时,外层 agent 可以在一个 episode 里从"大历史搜索"切换到"短窗口跟踪"。

## 4. Agentic Navigation:上层想,Nav 执行

报告把 Qwen-RobotNav 放进两层系统:

1. **Upper planner LLM**(报告示例使用 Qwen3.6-Plus)把长程目标拆成 sub-goals;
2. 对每个 sub-goal,planner 选择 task mode 与 observation config;
3. Qwen-RobotNav 预测 waypoint trajectory 并执行;
4. 系统把轨迹和观测摘要写入 memory,供下一轮规划使用。

这个设计很像"导航工具调用":Qwen-RobotNav 是一个可重配置 navigation primitive,而不是自己承担全部长程推理。

## 5. 数据与实验

训练数据共 **15.6M samples**:

| 组成 | 占比 | 内容 |
|---|---:|---|
| 导航轨迹规划数据 | 约 85% | instruction following、PointNav、ObjNav、target tracking、autonomous driving |
| 导航相关 VL reasoning 数据 | 约 15% | 保留语言 grounding,避免只学成 reactive trajectory mapper |

作者报告的主要结果(均为自评 ⚠️):

| 评测 | 结果 |
|---|---|
| VLN-CE R2R Val-Unseen | Qwen-RobotNav-8B panoramic **72.1% SR / 66.6 SPL** |
| VLN-CE RxR Val-Unseen | Qwen-RobotNav-8B panoramic **76.5% SR / 65.7 SPL** |
| Monocular VLN | 单前视也能保持竞争力;R2R 4B **66.9% SR** |
| EVT-Bench tracking | 4B **90.0% tracking rate**,但 success rate 低于 tracking 专家 |
| ObjectNav / OVON | HM3D v2 等任务作者报告 SOTA 或强结果 |
| NAVSIM 自动驾驶 | 4B **91.4 PDMS** |
| EQA 系统 | 与 Qwen3.6-Plus 组合后在 HM-EQA / MT-EQA / EXPRESS-Bench 上报告新 SOTA |
| 真实机器人 | 在 Unitree Go2、室内公寓、展厅等场景展示 zero-shot real-world transfer |

## 6. 局限与读法

1. **它不是低层控制通才**:输出是 waypoint,最终运动控制还依赖平台控制器。
2. **泛化很大程度来自 Qwen3-VL 与数据混合**:单独 task-adaptive observation encoding 的贡献需要看消融。
3. **多任务训练有 trade-off**:报告中 tracking rate 很高,但 success rate 低于专用 tracking 模型,说明通才并不总是单项最优。
4. **真实世界展示偏定性**:真实机器人 demo 说明可行,但还不是统一第三方 benchmark。

## 7. 在谱系中的位置

- **相对 [Qwen-VLA](qwen-vla.md)**:Qwen-VLA 已把导航纳入统一 action-and-trajectory 框架;Qwen-RobotNav 则把导航单独拉出来,做成更 agent-friendly 的模型。
- **相对 [RynnBrain](rynnbrain.md)**:RynnBrain 更偏 System-2 具身大脑/空间推理;Qwen-RobotNav 更像 System-1/执行器,但暴露 task mode 和 context control 给上层推理模型。
- **相对 benchmarks 专题**:它涉及 VLN-CE、OVON、EVT-Bench、NAVSIM、EQA 等,后续更适合进入[评测基准全景](benchmarks.md)的导航/具身问答段落。

一句话:**Qwen-RobotNav 把 Qwen3-VL 的视觉语言空间理解改造成一个可被 agent 动态重配置的导航执行器;它的关键创新不是多一个导航头,而是把 observation context 作为推理时可控参数。**

---

## 来源

- 论文:Qwen-RobotNav Technical Report: A Scalable Navigation Model Designed for an Agentic Navigation System. arXiv:2606.18112(v1 2026-06-16). <https://arxiv.org/abs/2606.18112>
- 官方博客:<https://qwen.ai/blog?id=qwen-robotnav>
- GitHub:<https://github.com/QwenLM/Qwen-RobotNav>

> 说明:本页评测数字均按作者自评 ⚠️ 处理;没有把 VLN / Tracking / Driving 的不同指标横向比较。
