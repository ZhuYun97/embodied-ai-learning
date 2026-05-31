---
title: GR00T N2 细读
description: NVIDIA 预览的下一代机器人基础模型 GR00T N2,基于 DreamZero 研究、构建于全新的世界-行动模型(WAM)架构,撰写时尚未完全释出。
---

# NVIDIA GR00T N2 细读

> **WAM 论文细读** · NVIDIA 预览的下一代机器人基础模型,从 VLA(N1.x)转向 WAM 架构的世代分水岭 · NVIDIA Isaac GR00T 系列(WAM 架构,基于 DreamZero)
> [← WAM 总览](/wam/) · [主报告](/vla/)

## TL;DR

GR00T N2 是 NVIDIA 预览(preview)的下一代机器人基础模型,官方表述为「based on DreamZero research」「built on a new world action model architecture」。它与本站已细读的 GR00T N1 是两种不同范式:N1 / N1.5 / N1.7 是 **VLA**(视觉-语言-动作,反应式 obs→action 映射),而 **N2 才是 WAM 架构**(联合建模「世界如何变化」与「机器人如何动作」)。NVIDIA 给出的关键厂商陈述包括:在新环境 / 新任务上帮助机器人成功的概率「比领先 VLA 高出 2 倍以上」,当前在 MolmoSpaces 与 RoboArena 上排名第一,「计划年底前可用」。

可信度提示:本页几乎所有数字、排名与能力均为 **NVIDIA 厂商陈述(⚠️)**,尚无第三方统一评测;凡一手源未给出或未释出者标「待核」。务必注意:**GR00T N2 在本页撰写时尚未完全释出**,以下内容基于预览阶段的官方表述,实测口径与权重均待核。

## 一、定位:N1.7(VLA)与 N2(WAM)的分野

GR00T 系列内部存在一条范式分水岭,必须先厘清,否则极易把两代混为一谈:

- **GR00T N1 / N1.5 / N1.7 — VLA。** 本站已对 N1 做过细读([GR00T N1](/vla/papers/groot-n1))。这一支属于视觉-语言-动作模型:把观测与语言指令映射到动作,不显式建模「我这样动、世界会如何演化」的时空物理动力学。**当前实际可用的模型是 N1.7**,而非 N2。
- **GR00T N2 — WAM。** N2 是 NVIDIA 预览的下一代,官方明确表述为「built on a **new world action model architecture**」「based on **DreamZero** research」。它不再只学反应式映射,而是转向世界-行动模型范式。

作为对照,**当前可用的 N1.7** 的官方画像(均厂商陈述 ⚠️):

- 开放的 VLA 模型、提供商用许可,面向通用人形机器人技能(含先进灵巧控制);
- 多模态输入(语言 + 图像);
- 相比 N1.6,在泛化与语言跟随上有提升,NVIDIA 归因于预训练纳入「**20K 小时 EgoScale 人类视频**」⚠️。

换言之:谈论「GR00T 的 WAM 化」时,指的是 **N2**;谈论「现在能下载、能商用的 GR00T」时,指的是 **N1.7(仍是 VLA)**。二者范式不同,不应互相代入数据或能力。

## 二、方法与架构(WAM 通用机制)

GR00T N2 的具体架构细节(参数规模、训练配方、权重)在预览阶段**未释出(待核)**。可据以理解 N2 的,是 NVIDIA 对其 WAM 范式给出的通用机制描述(glossary,均厂商陈述 ⚠️):

1. **视频预训练习得物理 / 运动先验。** 在大规模视频(含互联网视频与第一视角人类视频)上预训练,从中继承物理与运动先验。
2. **潜空间想象、从不生成完整图像。** 运行时接收文本指令与起始观测,预测「**目标转移的压缩表征**」,并据此**直接导出机器人指令**,而「**从不生成完整图像**(without ever generating full images)」——即在潜空间中「想象」转移,而非渲染完整像素帧。实现为统一的 **Joint Video-Action Diffusion Transformer(DiT)**。
3. **可解释性。** 可检视(预测)帧以定位失败,提供一条相对 VLA 黑箱映射更可审视的诊断路径。
4. **数据效率能力(均厂商陈述 ⚠️):**
   - 对未见任务 **zero-shot**(举例如解鞋带、熨烫);
   - **人→机迁移仅需 10–20 分钟无动作标签视频**;
   - **跨本体仅需 30 分钟 play data**。

   注:上述三项数字与 [DreamZero](/wam/papers/dreamzero) 一致,反映 N2 与 DreamZero 同源——它们应被理解为同一研究脉络下的能力声明,而非 N2 独立给出的新测点。

体系定位上:NVIDIA **Cosmos** 是 world foundation models(物理 AI 基础设施),而 **WAM 是其「动作使能(action-enabled)」变体**——把世界基础模型的基础设施引向机器人控制。GR00T N2 即落在这条「Cosmos → WAM → 机器人控制」的路径上。

## 三、关键声明与基准

以下为 NVIDIA 对 GR00T N2 给出的关键声明,**全部为厂商陈述(⚠️),无第三方统一评测**:

- **成功率。** 在新环境 / 新任务上帮助机器人成功的概率「**比领先的 VLA 高出 2 倍以上**(more than twice as often)」⚠️。注:对照基线、任务集合、评测协议等口径**待核**。
- **排名。** 当前在 **MolmoSpaces** 与 **RoboArena**(通才机器人策略)上**排名第一**⚠️。注:这两个榜单的评测细则、提交时点、是否第三方维护等**待核**。
- **可用性。** 「**计划年底前可用**(slated to be available by the end of the year)」——即本页**撰写时尚未完全释出(待核)**。

需要强调:上述「2 倍以上」「排名第一」是 N2(WAM)的声明,**不可挪用到 N1.7(VLA)**;而 N1.7 的「20K 小时 EgoScale」「相比 N1.6 提升」同样是厂商陈述(⚠️),亦不可反向挪用到 N2。

## 四、与本站谱系的关系

- **与 [GR00T N1](/vla/papers/groot-n1) 同谱系、不同世代。** N1 是更早世代、属 **VLA**;N2 是 WAM 世代。二者同属 NVIDIA GR00T 血脉,但范式已切换。
- **基于 DreamZero。** N2「based on DreamZero research」,其能力数字(zero-shot、人→机 10–20 分钟、跨本体 30 分钟)与 [DreamZero](/wam/papers/dreamzero) 一致,见本站 WAM 细读 [DreamZero](/wam/papers/dreamzero)。
- **更早的 GR-1 是 Joint·自回归工作。** 在 NVIDIA / GR 谱系中,GR-1 属更早的 Joint·自回归一脉,可视为这条技术血脉的早期世代。

## 五、局限与存疑

- **尚未完全释出。** N2 在本页撰写时仅为预览,「计划年底前可用」;权重、论文、架构细节、训练配方均**未释出(待核)**。本页不应被当作对一个已发布模型的细读。
- **全为厂商陈述、无第三方复现。** 「2 倍以上」「MolmoSpaces / RoboArena 排名第一」均为 NVIDIA 自评(⚠️);对照基线与评测协议**待核**,跨工作横比需谨慎。
- **能力数字的来源归属。** N2 的 zero-shot / 数据效率数字与 DreamZero 一致,应理解为同源声明,而非 N2 独立测得的新结果。
- **N1.7 与 N2 易被混淆。** 当前可下载、可商用的是 N1.7(VLA);N2(WAM)的优越性声明不可代入 N1.7。任何把「2 倍以上」算到「现在能用的 GR00T」头上的表述都是错误归属。
- **MolmoSpaces / RoboArena 的成熟度待核。** 这两个榜单是否由独立第三方维护、评测是否可复现,语料未给出,均**待核**。

## 参考文献

- NVIDIA glossary,「World Action Model」词条(WAM 定义与通用机制、与 VLA 的辨析、Cosmos 关系)。⚠️ 厂商陈述。
- NVIDIA 关于 GR00T N2 的官方陈述(「based on DreamZero research」「built on a new world action model architecture」、成功率「2 倍以上」、MolmoSpaces / RoboArena 排名第一、「计划年底前可用」)。⚠️ 厂商陈述;尚无第三方统一评测。
- NVIDIA 关于 GR00T N1.7 的官方陈述(开放 VLA、商用许可、多模态输入、20K 小时 EgoScale 人类视频、相比 N1.6 提升)。⚠️ 厂商陈述。

> 可信度体例:⚠️ = NVIDIA 厂商陈述,尚无第三方统一评测;**待核** = 一手源未给出或未释出。本页不使用 ✅。GR00T N2 撰写时尚未完全释出。
