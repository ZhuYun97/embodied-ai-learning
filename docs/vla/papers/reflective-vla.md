---
title: Reflective VLA 细读:用 observation-action-consequence 让策略学会反思上下文
description: Reflective VLA(arXiv 2606.25215)把 observation-action-consequence 组织成上下文,让 VLA 在执行前后利用行动后果进行反思式决策,与 MemoryVLA、ECoT 和在线自适应路线相邻。
---

# Reflective VLA:用行动后果作为上下文的反思式策略

> **arXiv**: [2606.25215](https://arxiv.org/abs/2606.25215)(*Reflective VLA: Learning from Observation-Action-Consequence Contexts*) | **时间**: 2026.06 | **路线**: VLA · 记忆 / 反思 / 上下文学习
> [← 返回 VLA 总览](/vla/) · [MemoryVLA](memoryvla)

## TL;DR

Reflective VLA 把 VLA 的输入从“当前观测 + 指令”扩展成 **observation-action-consequence** 上下文:不仅看自己做了什么动作,还看动作造成了什么结果。这个设定让模型能在上下文里学到“刚才为什么失败/为什么有效”,从而调整下一步。

它不是普通 CoT,因为重点不是生成一段语言解释,而是把行动后果作为策略上下文的一部分。

## 问题

传统 VLA 很像单步反应器:看到当前图像和任务,直接输出动作。长程任务里,真正重要的是历史:

- 哪一步已经完成?
- 上一步动作有没有推动目标物?
- 失败是因为抓偏、力度不够,还是目标判断错了?

如果模型看不到 action consequence,它就很难从自己的执行轨迹里纠错。

## 方法位置

```mermaid
flowchart LR
  O1["观测 o_t"] --> A1["动作 a_t"]
  A1 --> C1["后果 c_t"]
  C1 --> CTX["O-A-C 上下文"]
  CTX --> POL["Reflective VLA"]
  POL --> A2["下一步动作"]
```

站内归为 **新范式探索 / 反思上下文**。它与记忆增强 VLA 相邻,但粒度更偏“动作后果链”。

## 谱系位置

- 与 [MemoryVLA](memoryvla) / [MemoryVLA++](memoryvla-plusplus):MemoryVLA 保存历史感知/认知状态;Reflective VLA 强调历史动作造成的 consequence。
- 与 [ECoT](ecot):ECoT 借助具身推理文本;Reflective VLA 更像把交互因果直接放进上下文。
- 与 [ROAD-VLA](road-vla):ROAD-VLA 把在线经验写回训练;Reflective VLA 先在上下文内利用经验。

## 局限与待核

- O-A-C 上下文长度增长会带来推理成本和历史压缩问题。
- consequence 如何标注或抽取,直接决定模型能否学到有效反思。
- 若任务反馈稀疏或视觉变化不明显,后果信号可能很弱。

## 来源

- arXiv:[2606.25215](https://arxiv.org/abs/2606.25215) *Reflective VLA: Learning from Observation-Action-Consequence Contexts*.

