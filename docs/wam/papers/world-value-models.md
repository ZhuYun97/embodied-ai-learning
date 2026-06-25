---
title: World Value Models 细读:把世界模型接到机器人价值估计
description: World Value Models(arXiv 2606.24742)把 world model 与 value estimation 结合,用于估计任务进展和数据质量,并提出 Suboptimal-Value-Bench,适合作为 WAM/世界模型在数据筛选与策略评估中的应用样本。
---

# World Value Models:把世界模型接到机器人价值估计

> **arXiv**: [2606.24742](https://arxiv.org/abs/2606.24742) | **时间**: 2026.06 | **路线**: WAM 相关 · 世界模型 / 价值评估 / 数据筛选
> [← WAM 总览](/wam/) · [具身数据处理](/vla/papers/data-processing)

## TL;DR

World Value Models 的核心判断是:机器人 value model 不能只看静态图像或稀疏视觉特征,它需要理解“任务正在往成功还是失败发展”。世界模型擅长建模时间和未来变化,因此可以为 value estimation 提供更合适的表征。

它不是典型“直接输出动作”的 WAM,但它把世界模型能力接入机器人策略训练中的价值估计、数据筛选和混合质量演示处理,值得进入 WAM 相关谱系。

## 问题

机器人数据常常混合了成功、失败、次优、卡住和绕远轨迹。只用二值成功标签会浪费大量中间信息;而普通 VLM backbone 对“任务进展”并不天然敏感。

这篇把问题转成:能否用 world model 的时间理解能力判断一段轨迹的价值?

## 方法位置

```mermaid
flowchart LR
  TRAJ["机器人轨迹"] --> WM["World Model 表征"]
  WM --> VALUE["Value Estimation"]
  VALUE --> FILTER["数据筛选 / 加权 / 进展评估"]
```

论文还提出 **Suboptimal-Value-Bench**,用于评价模型是否能识别次优轨迹和任务进展。

## 谱系位置

- 与 [GigaBrain-0.5M*](/vla/papers/gigabrain-05m):二者都把世界模型接入策略训练闭环,GigaBrain 更偏 RL 引擎,World Value Models 更偏价值估计。
- 与 [WAV](wav):WAV 是 world-value-action 一体化策略;本文更像把 value model 单独拎出来做系统研究。
- 与 [具身数据处理](/vla/papers/data-processing):可作为混合质量数据筛选/加权的工具。

## 局限与待核

- 价值估计未必等同真实策略成功率,需要闭环训练验证。
- benchmark 质量决定结论可信度;Suboptimal-Value-Bench 的标注一致性值得继续看。
- 作为 WAM 相关而非严格 WAM,本站归入“世界模型评估/数据处理”观察节点。

## 来源

- arXiv:[2606.24742](https://arxiv.org/abs/2606.24742).

