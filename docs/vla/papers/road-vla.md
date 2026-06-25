---
title: ROAD-VLA 细读:面向在线自适应的 VLA 后训练
description: ROAD-VLA(arXiv 2606.25800)提出 Scalable Online Post-Training for VLA Models,用在线数据和自蒸馏式更新提升 VLA 在部署分布下的适应能力,属于 VLA 后训练/在线自适应路线。
---

# ROAD-VLA:面向在线自适应的 VLA 后训练

> **arXiv**: [2606.25800](https://arxiv.org/abs/2606.25800)(*ROAD-VLA: Scalable Online Post-Training for VLA Models with Self-Distillation*) | **时间**: 2026.06 | **路线**: VLA · online post-training / self-distillation
> [← 返回 VLA 总览](/vla/) · [VLA 在线 RL](/vla/papers/rl-token)

## TL;DR

ROAD-VLA 的关键词是 **online post-training**。它承认一个现实:预训练 VLA 到了真实部署场景,一定会遇到训练集没覆盖的相机、物体、摩擦、初始位姿和用户指令分布。与其只靠离线数据,不如让模型在部署中持续吸收在线经验。

它和 FORCE 的共同点是“VLA 后训练”,区别是 ROAD-VLA 更强调在线扩展和自蒸馏:把模型在新分布下的经验重新组织成可训练信号,让策略逐步适应。

## 问题

VLA 的泛化常被两个分布偏移击穿:

- **视觉偏移**:光照、背景、相机位姿、遮挡。
- **动力学/任务偏移**:物体质量、摩擦、摆放方式、长程步骤组合。

如果每次偏移都重新人工采集大量演示,成本太高;如果完全不更新,模型又会反复犯同样错误。

## 方法位置

```mermaid
flowchart LR
  BASE["基础 VLA"] --> DEPLOY["部署/在线交互"]
  DEPLOY --> BUFFER["在线经验池"]
  BUFFER --> DISTILL["自蒸馏 / 后训练"]
  DISTILL --> ADAPT["适应后 VLA"]
  ADAPT --> DEPLOY
```

ROAD-VLA 的价值在于把 VLA 从“一次训练后冻结”推向“部署后可继续学习”。这也是 2026 年 VLA 从 demo 走向产品化必须补上的训练环节。

## 谱系位置

- 与 [SimpleVLA-RL](simplevla-rl) 和 [FORCE](force-vla):同属后训练,ROAD-VLA 更强调在线数据规模化和自蒸馏。
- 与 [MemoryVLA](memoryvla):MemoryVLA 让模型在上下文内记住历史;ROAD-VLA 则把新经验写回参数或训练集。
- 与 [π0.7](pi07):π0.7 强调可操控和组合泛化;ROAD-VLA 更偏部署分布下的持续适应。

## 局限与待核

- 在线数据如果质量不控,自蒸馏可能把错误策略固化。
- 需要明确安全边界:哪些失败可以探索,哪些失败不能在线试错。
- 目前按预印本作者自评处理,尤其要看 online buffer、更新频率和硬件成本。

## 来源

- arXiv:[2606.25800](https://arxiv.org/abs/2606.25800) *ROAD-VLA: Scalable Online Post-Training for VLA Models with Self-Distillation*.

