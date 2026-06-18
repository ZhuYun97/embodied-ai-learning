---
description: Qwen-RobotManip 技术报告解读(arXiv:2606.17846,Qwen):面向机器人操作的 VLA 基座,用 Qwen3.5-4B + flow-matching DiT 动作专家,以 80 维统一 state-action 表示、camera-frame EEF delta 和 human-to-robot 合成管线对齐多本体数据,构建约 38,100 小时开源/人类视频预训练语料。
title: Qwen-RobotManip 细读
---

# Qwen-RobotManip:对齐先于规模的操作 VLA 基座

> **论文**: Qwen-RobotManip Technical Report: Alignment Unlocks Scale for Robotic Manipulation Foundation Models  
> **arXiv**: [2606.17846](https://arxiv.org/abs/2606.17846)(v1 2026-06-16; v2 2026-06-17) · **项目**: [QwenLM/Qwen-RobotManip](https://github.com/QwenLM/Qwen-RobotManip) · **官方发布**: [Qwen 博客](https://qwen.ai/blog?id=qwen-robotmanip) / [PDF](https://qianwen-res.oss-accelerate.aliyuncs.com/qwenrobot/papers/Qwen_RobotManip.pdf)<br>
> **路线**: 连续操作 VLA · Qwen3.5-4B backbone + flow-matching DiT action expert · 多本体 state-action 对齐 · human-to-robot 数据合成

> [← 返回主报告](../index.md)

---

> ⚠️ **可信度提示**:本文是 Qwen 团队 2026-06 技术报告,极新、非同行评审;所有 benchmark、RoboChallenge 名次、与 π0.5 / StarVLA / X-VLA 等对比均为作者自评或作者提交口径,尚无独立第三方复现。本页只把它作为"Qwen 在 manipulation 方向的最新技术路线"收集与归位。

## TL;DR

Qwen-RobotManip 不是单纯数据集论文,也不是 Qwen-VLA 的小改版。它的核心命题是:**机器人操作数据不能只靠"堆量",必须先把多本体、多坐标系、多动作格式对齐,否则规模越大冲突越多**。

它的技术组合是:

1. **Qwen3.5-4B 视觉语言主干**负责多视角感知、语言理解与语义推理;
2. **flow-matching DiT 动作专家**负责连续动作生成,10 层、hidden 768、12 heads,推理用 4 步 Euler 积分;
3. **80 维统一 state-action 表示**把单臂、双臂、灵巧手、未来移动底盘等动作槽位放进一个 canonical vector;
4. **camera-frame end-effector delta**把 EEF 动作对齐到视觉观测坐标,降低跨本体迁移时的几何冲突;
5. **human-to-robot synthesis**把第一人称人手视频重定向到 15 种机器人平台,与开源机器人数据一起形成约 **38,100 小时**预训练语料。

一句话:它把 Qwen-VLA 的"统一基座"往**操作数据工程和跨本体对齐**方向推进了一步。

---

## 官方博客补充:它在 Qwen-Robot Suite 里的角色

Qwen 官方博客在 2026-06-16 把 Qwen-RobotManip 作为 **Release** 发布,并把它放回 [Qwen-Robot Suite](https://qwen.ai/blog?id=qwen-robotsuite) 的语境里:RobotManip 不是孤立模型,而是 Qwen-Robot 系列里负责**机器人操作(manipulation)** 的分支。

博客相比论文更强调三点:

1. **发布叙事**:语言/多模态基础模型能 scaling,是因为异构数据可以被统一对齐、低成本数据能互相增强;机器人操作要复用这条路,必须同时解决本体、传感器、任务域和动作格式的异构性。
2. **Qwen-Omni 联动 demo**:官方展示了 Qwen-Omni 观察场景、用语音随机提出操作任务并实时判断执行结果,Qwen-RobotManip 在没有预定义任务列表的情况下执行这些指令。这个 demo 更像开放式指令跟随展示,不等同于独立 benchmark。
3. **真机泛化口径**:官方页面把"新场景、未见语言指令、跨构型迁移"作为真机亮点,并特别强调 RoboChallenge Table30 v1 通用赛道 **45% SR / 59.83 process score**、排名第 1、领先第三名 20%。

所以这页解读的重点可以再收紧一点:Qwen-RobotManip 的关键词不是"更大的机械臂数据",而是 **alignment + scale**。先让多源操作数据在统一接口里不打架,再让 3.8 万小时级数据真正发挥规模效应。

## 1. 定位:为什么不是纯数据工作

这篇报告的数据贡献非常重,但目标仍是**操作策略模型**。论文真正要验证的是:能否把语言/多模态大模型里的 scaling recipe 迁移到 manipulation,即先把异构数据放进统一表述,再用大规模训练换泛化。

它把挑战拆成三层对齐:

| 对齐层 | 解决什么 |
|---|---|
| **Representation alignment** | 不同机器人 state/action 维度不一致、关节命名和控制约定不同 |
| **Motion alignment** | 同一 EEF 运动在 base/world/camera frame 下数值差异巨大 |
| **Behavior alignment** | 人类第一人称演示、仿真轨迹、真机遥操作在动作粒度和视觉分布上不一致 |

因此它更像一篇 **"操作 VLA 基座 + 数据对齐配方 + OOD 评测体系"** 的技术报告,而不是只发布一个数据集。

## 2. 方法与架构

[![Qwen-RobotManip 官方框架图:Qwen-VL 主干、上下文 token 与 flow-matching DiT 动作头](/paper-images/qwen-robotmanip_arch.png)](/paper-images/qwen-robotmanip_arch.png)

> **图注(据原文 Figure 3 转述)**:Qwen-RobotManip 用 Qwen-VL 同时编码多视角视觉 token、结构化本体 prompt 与历史上下文 token,再把最后层 hidden states 通过交替 cross-attention 注入 DiT 动作头。右侧 DiT 在 state + noisy actions 上预测 flow-matching velocity field;下方两块分别对应 **80 维统一 state-action 表示** 与 **camera-frame EEF delta**。也就是说,这张图把本页后面三件事连在一起:表示对齐、历史上下文注入、以及面向多本体的 EEF 运动对齐。

### 2.1 Qwen-VL 主干 + DiT 动作专家

模型采用解耦式架构:

- **Vision-language backbone**:Qwen3.5-4B,多视角图像与语言指令在同一 transformer 中早融合,最后层 hidden states 供动作专家 cross-attention。
- **Action expert**:Diffusion Transformer / flow-matching action head。它在 state + noisy action token 上做 self-attention,再交替 cross-attend 到视觉 token 与语言 token;机器人 proprioceptive state 由两层 MLP 编码后拼到 noisy action 前。
- **训练目标**:flow matching velocity field;推理时用 **4 步 Euler integration**,目标是低延迟实时控制。

### 2.2 80 维统一 state-action 表示

为多本体训练,论文定义一个 **80-dimensional canonical vector**:

| 区块 | 维度 | 含义 |
|---|---:|---|
| 左臂 block | 29 | 7 维关节 + 9 维 EEF pose + 1 维夹爪 + 12 维灵巧手 |
| 右臂 block | 29 | 同上 |
| reserved | 22 | 预留给移动底盘、额外自由度等 |

不同机器人只填自己存在的槽位,不存在的维度置零,并用 mask 排除 loss。这比简单 concat + zero padding 更强,因为每个槽位有固定语义。

### 2.3 camera-frame EEF delta

跨本体最容易出问题的是 EEF 坐标系:同一视觉上相似的动作,在 base frame 或 local frame 下数值可能完全不同。Qwen-RobotManip 采用 **camera-frame delta pose** 表示 EEF motion,让"图像里看起来相似"的动作在 action space 里也更接近。代价是训练和部署都需要相机内外参。

## 3. 数据:38,100 小时从哪里来

论文声称只使用开源机器人数据与人类视频,不依赖私有采集,构成约 **38,100 小时**操作预训练语料:

| 来源 | 规模/作用 |
|---|---|
| 开源机器人数据 | 约 **11,420 小时**,覆盖单臂、双臂、ALOHA、移动操作等真实机器人轨迹,包括 OXE、RoboMIND、DROID、RH20T 等 |
| 人类第一人称手部视频 | 约 **1,933 小时**,通过 MANO / keypoint 等中间表征抽取人手动作和物体交互先验 |
| **human-to-robot synthesis** | 把人类演示经动作重定向、手部去除/补绘、仿真渲染和深度辅助融合迁移到 **15 个机器人本体/平台**,形成约 **24,808 小时**合成示范 |
| 清洗与一致性检查 | 官方博客概括为 5 个 state-action 过滤阶段 + 3 个跨模态检查;论文细节包括趋势对齐、极值移除、FK 一致性、base-frame alignment 等 |

这部分是它相对 Qwen-VLA 更"数据层"的地方:重点不只是收集数据,而是把数据变成**同一 action/state 接口可以吸收的训练信号**。

## 4. 实验:重点看 OOD,不是只看 LIBERO

作者认为标准 IID benchmark 不能区分"真的学到可泛化结构"和"记住分布内模式",因此重点采用 OOD 设置:

| 评测 | 口径 | 作者报告 |
|---|---|---|
| LIBERO / RoboTwin IID | 标准分布内操作 | LIBERO **99.2%**, RoboTwin Easy/Hard **93.7% / 94.0%** ⚠️ |
| LIBERO-Plus | 视觉/相机/机器人初始位姿等扰动 | 对 π0.5: **91.4 vs 84.4** ⚠️ |
| RoboTwin-Clean2Rand Hard | clean 训练、randomized 测试 | 对 π0.5: **69.4 vs 47.9** ⚠️ |
| EBench | Isaac Sim 室内操作泛化 | 对 π0.5: **45.6 vs 27.1** ⚠️ |
| RoboCasa365 | 厨房长程/原子操作 | 总分 **35.9**;Composite-Unseen **14.9%**,官方称约为次优的 3 倍 ⚠️ |
| RoboTwin-IF | 新 instruction-following benchmark | 对 π0.5: **72.2 vs 49.6**(官方博客写作约 72.0,+22.4) ⚠️ |
| RoboTwin-XE | zero-shot cross-embodiment | camera-frame EEF 平均 **23.9%**,优于 joint-space 口径 ⚠️ |
| RoboChallenge Table30 v1 | generalist track | **45% SR / 59.83 process score**,作者称第 1,领先第三名 20% ⚠️ |

官方博客还补了更面向读者的真机口径:在桌面操作 ID/OOD 设置中分别报告 **88.6% / 87.5%** 成功率;在 130 条遥操作示范的 few-shot adaptation 中多数任务优于基线;在 CobotMagic + ARX 联合微调后,ARX 未见任务平均 **55.0%**。它还把"物体滑落后自主重试"作为规模预训练涌现出的 reactive error recovery 现象来展示。

仍需注意:这些真机结果也是作者报告,且不同平台、不同任务和不同评测协议不完全可横比。

## 5. 局限与风险

1. **合成数据有分布缺口**:human-to-robot retargeting 与 inpainting 可能引入伪影,数据规模不等于数据质量。
2. **OOD 仍以仿真为主**:LIBERO-Plus、RoboTwin-C2R、EBench、RoboCasa365 都主要是仿真评测;真机广域泛化还需要更多第三方验证。
3. **固定 action chunk 与推理延迟限制反应性**:论文结尾也承认当前系统不适合所有需要亚秒级反应的任务。
4. **对比口径由作者设定**:π0.5、StarVLA、X-VLA 等基线配置是否最优,需要独立复现确认。
5. **官方 demo 不等于 benchmark**:Qwen-Omni 联动展示很有传播性,但它说明的是开放式指令跟随潜力,不能直接替代受控评测。

## 6. 在谱系中的位置

- **相对 [Qwen-VLA](qwen-vla.md)**:Qwen-VLA 是统一操作/导航/轨迹的基座总模型;Qwen-RobotManip 是更专注 manipulation 的后续,重点从"统一任务"转向"统一多本体操作数据"。
- **相对 Qwen-Robot Suite**:官方博客把它归入 Qwen-Robot 系列的操作分支;与导航、世界建模等方向相比,它解决的是连续控制、跨本体 state-action 对齐和操作数据规模化。
- **相对 [π0](pi0.md) / [GR00T N1](groot-n1.md)**:同属 VL backbone + flow/DiT action expert 路线,但 Qwen-RobotManip 把主要创新放在 canonical state-action 和 camera-frame EEF 对齐上。
- **相对数据专题**:它不是纯数据集,但很适合在[具身数据全景](embodied-data.md)和[数据处理](data-processing.md)里作为"跨本体数据对齐"案例。

一句话:**Qwen-RobotManip 的核心不是"Qwen 又训了个机械臂模型",而是提出一套 alignment-first 的 manipulation scaling recipe:先把多本体状态、EEF 运动和行为数据对齐,再让 38,100 小时开源/人类视频语料真正变成可训练规模。**

---

## 来源

- 论文:Qwen-RobotManip Technical Report: Alignment Unlocks Scale for Robotic Manipulation Foundation Models. arXiv:2606.17846(v1 2026-06-16, v2 2026-06-17). <https://arxiv.org/abs/2606.17846>
- 官方博客:Qwen-RobotManip: Alignment Unlocks Scale for Robotic Manipulation Foundation Models(Release,2026-06-16). <https://qwen.ai/blog?id=qwen-robotmanip>
- 官方 PDF:<https://qianwen-res.oss-accelerate.aliyuncs.com/qwenrobot/papers/Qwen_RobotManip.pdf>
- Qwen-Robot Suite 官方入口:<https://qwen.ai/blog?id=qwen-robotsuite>
- GitHub:<https://github.com/QwenLM/Qwen-RobotManip>
- 架构图:本仓库 `docs/public/paper-images/qwen-robotmanip_arch.png`(arXiv 源码 `figures/method-0616.pdf`,原文 Figure 3 方法总览图)

> 说明:本页数字来自 arXiv 技术报告与作者公开页面,均按作者自评 ⚠️ 处理;尚未见第三方统一复现。
