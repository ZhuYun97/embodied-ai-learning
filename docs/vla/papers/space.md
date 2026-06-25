---
title: SPACE 细读:用笛卡尔状态增量统一跨机器人动作表示
description: SPACE(arXiv 2606.24049)用 Cartesian state delta 作为跨机器人通用动作表示,再通过 Action Adapter 转成机器人专属控制命令,面向 generalist policy 的多本体数据混训。
---

# SPACE:用笛卡尔状态增量统一跨机器人动作表示

> **arXiv**: [2606.24049](https://arxiv.org/abs/2606.24049) | **时间**: 2026.06 | **路线**: VLA · 跨本体动作表示
> [← 返回 VLA 总览](/vla/) · [具身数据处理](data-processing)

## TL;DR

SPACE 直面跨机器人数据混训中的动作不一致问题:同一个末端运动,在不同机械臂上对应不同关节命令、不同控制接口和不同动力学。它提出用 **Cartesian state delta** 作为统一动作语义,再用 **Action Adapter** 转成具体机器人命令。

一句话:策略先学“末端应该怎么变”,adapter 再负责“这台机器人怎么做到”。

## 方法

```mermaid
flowchart LR
  OBS["观测 + 指令"] --> POLICY["Generalist Policy"]
  POLICY --> DELTA["Cartesian state delta<br/>通用动作表示"]
  DELTA --> ADAPT["Action Adapter<br/>机器人专属转换"]
  ADAPT --> CMD["本体控制命令"]
```

这个设计把跨本体问题拆开:

- 通用策略输出与机器人形态较少绑定的笛卡尔状态增量。
- 每个本体用 adapter 转成自己的控制命令。
- 部署时若动力学或硬件细节变化,优先调 adapter,不一定重训整套 VLA。

## 谱系位置

- 与 [Learning Action Priors](learning-action-priors):SPACE 统一动作接口,Action Priors 学动作分布先验。
- 与 [RDT-1B](rdt-1b):都关心物理可解释/统一动作空间,SPACE 更明确服务跨本体混训。
- 与 [具身数据处理](data-processing):它可视为动作标签规范化的一种新方案。

## 局限与待核

- Cartesian delta 对灵巧手、接触力控或全身移动操作未必充分。
- adapter 的质量决定真实执行效果,不是把动作统一后问题就消失。
- 需要看跨硬件、同硬件不同单元以及动力学漂移实验是否覆盖足够广。

## 来源

- arXiv:[2606.24049](https://arxiv.org/abs/2606.24049).

