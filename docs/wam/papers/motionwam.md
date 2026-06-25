---
title: MotionWAM 细读:面向人形实时全身移动操作的世界-动作模型
description: MotionWAM(arXiv 2606.09215)面向 humanoid loco-manipulation,把视频世界模型中间去噪特征接入全身动作生成,用统一 motion token 覆盖移动、躯干、足部交互与手部操作。
---

# MotionWAM:面向人形实时全身移动操作的世界-动作模型

> **arXiv**: [2606.09215](https://arxiv.org/abs/2606.09215) | **时间**: 2026.06 | **路线**: WAM · 人形全身移动操作 / 联合扩散
> [← WAM 总览](/wam/) · [WOLF-VLA](/vla/papers/wolf-vla)

## TL;DR

MotionWAM 是 WAM 往人形机器人全身控制推进的一篇代表。它面向实时 loco-manipulation,将策略条件化在视频世界模型的中间去噪特征上,并用统一 **motion token** 覆盖下肢移动、躯干、身高、足部交互与手部操作。

如果说桌面 WAM 主要处理“手怎样改变物体”,MotionWAM 处理的是“整个身体怎样在世界里移动并完成操作”。

## 方法位置

```mermaid
flowchart LR
  OBS["第一人称视觉"] --> WM["视频世界模型<br/>中间去噪特征"]
  WM --> TOK["统一 motion token"]
  TOK --> BODY["全身动作<br/>移动 + 操作"]
```

它的关键在于把世界模型特征用作动作生成条件,而不是只做离线数据增强或未来视频展示。

## 谱系位置

- 与 [WOLF-VLA](/vla/papers/wolf-vla):两者都走人形全身路线;WOLF-VLA 更偏 VLA,MotionWAM 更偏 WAM。
- 与 [GR00T N2](groot-n2):都在 NVIDIA/人形 WAM 叙事附近,强调世界模型与动作架构融合。
- 与 [GigaWorld-Policy](gigaworld-policy):都属于动作中心的世界模型策略路线,但 MotionWAM 明确面向实时全身运动。

## 结果与局限

新闻采收时论文自评称,在 9 个 Unitree G1 真机任务上整体成功率相对同等示范微调的 VLA 基线高出 30% 以上。此处全部按作者自评处理。

需要重点关注:

- 是否开源训练和控制接口。
- 全身动作是否依赖强低层控制器。
- 第一人称视觉在遮挡、快速转身和接触场景下是否稳定。

## 来源

- arXiv:[2606.09215](https://arxiv.org/abs/2606.09215).

