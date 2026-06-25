---
title: Action ControlNet 细读:给 VLA 异步控制补一层实时稳定器
description: Action ControlNet(arXiv 2606.25985)面向 VLA 推理延迟与异步控制问题,在慢速策略输出与高频机器人执行之间加入控制网络,缓解动作滞后、抖动和部署不稳定。
---

# Action ControlNet:给 VLA 异步控制补一层实时稳定器

> **arXiv**: [2606.25985](https://arxiv.org/abs/2606.25985)(*Action ControlNet: Improving VLA Robot Control with Asynchronous Action Prediction*) | **时间**: 2026.06 | **路线**: VLA · 推理部署 / 异步控制
> [← 返回 VLA 总览](/vla/) · [推理加速与部署](/vla/papers/inference-deployment)

## TL;DR

Action ControlNet 关注一个很实际的问题:VLA 很聪明,但推理慢;机器人执行又需要高频、低抖动的控制流。二者一旦异步,旧动作、新观测和网络延迟会错位,导致动作滞后或不稳定。

它的思路是在 VLA 与机器人之间补一层 **ControlNet 式动作控制模块**,把低频/滞后的策略预测转成更稳定的高频执行动作。它不是要替代 VLA,而是让 VLA 的输出更适合真实控制回路。

## 问题

许多 VLA 用 action chunk 缓解推理慢,但 chunk 本身也有代价:

- chunk 预测时看到的是过去观测,执行时世界已变化。
- 接触任务中几百毫秒误差就可能导致夹爪错位。
- 高层策略重规划频率低,底层执行需要更平滑和更及时。

因此部署问题不只是“模型再快一点”,还包括“慢策略如何接入快控制”。

## 方法位置

```mermaid
flowchart LR
  OBS["当前/历史观测"] --> VLA["慢速 VLA<br/>动作块预测"]
  VLA --> CTRL["Action ControlNet<br/>异步动作修正/稳定"]
  OBS --> CTRL
  CTRL --> ROBOT["高频机器人控制"]
```

站内可把它看作 [推理加速与部署](inference-deployment) 的新样本:VLA 不一定每步都实时输出,但需要一个控制层把语义动作变成稳定运动。

## 谱系位置

- 与 [π0](pi0)、[OpenVLA-OFT](openvla-oft):这些工作解决连续动作和并行解码,Action ControlNet 进一步处理执行时序错配。
- 与 [GR00T N1](groot-n1) / [Helix](helix):它们通过快慢系统拆分控制频率;Action ControlNet 则从通用 VLA 输出侧补实时控制适配层。
- 与 [运控算法基础](motion-control):VLA 输出最终仍要落到控制回路,这篇正好连接模型层和控制层。

## 局限与待核

- 额外控制网络会引入新接口和训练数据需求。
- 若 VLA 高层语义判断本身错误,稳定器只能改善执行平滑性,不能纠正目标错误。
- 作者自评需要结合真实机器人频率、延迟设置和任务难度看,不能只看平均成功率。

## 来源

- arXiv:[2606.25985](https://arxiv.org/abs/2606.25985) *Action ControlNet: Improving VLA Robot Control with Asynchronous Action Prediction*.

