---
title: DreamZero 细读：World Action Models are Zero-shot Policies
description: 把「预演未来→反推动作」放进推理主回路的联合 video+action 世界-行动模型,作者主张 WAM 本身即零样本策略。
---

# DreamZero 细读

> **WAM 论文细读** · 建于预训练视频扩散主干之上、把世界模型当作策略本体的 Joint 类 WAM · arXiv:2602.15922
> [← WAM 总览](/wam/) · [主报告](/vla/)

## TL;DR

DreamZero(《World Action Models are Zero-shot Policies》)是一个建立在预训练视频扩散主干之上、联合建模 video 与 action 的世界-行动模型(WAM)。其核心主张是:WAM 不只是策略的训练先验,而本身即一个零样本策略——把「预演未来世界状态→反推动作」直接放进推理主回路。作者自评 ⚠️ 在真机新任务/新环境上较 SOTA VLA 取得「>2x improvement」,并通过模型与系统优化让一个 14B 自回归视频扩散模型实现 7Hz 实时闭环控制。论文还报告了仅靠 10–20 分钟 video-only 示范的跨本体迁移与 30 分钟 play data 的少样本本体适配能力(均为作者自评 ⚠️)。本篇所有定量成绩均为作者自评,尚无第三方统一评测。

## 一、定位与动机

论文出发点是一个对当前主流 VLA 的诊断(作者自评 ⚠️):SOTA VLA 擅长**语义泛化**(理解任务、物体、指令),却难以泛化到**新环境中未见过的物理动作**。DreamZero 的回应是用 video 作为「世界如何演化」的稠密表征来学习物理动力学,通过预测未来世界状态与动作来获得对物理规律的建模能力。

它的关键立场体现在标题里:**World Action Models are Zero-shot Policies**。与其把世界模型当作辅助训练信号,DreamZero 主张联合建模 video 与 action 后,模型推理时「预演未来、反推动作」的回路本身就是策略——零样本即可执行。这一立场使它在 WAM taxonomy 中归入 **Joint 类**(联合建模 video 与 action,而非分阶段的预测器 + 策略),可参见 [预测式 VLA](/vla/papers/predictive-vla) 与 [WAM 总览](/wam/)中的分类讨论。

作者机构未在摘要列出(待核);论文为 36 作者署名,lead 为 Seonghyeon Ye,提交于 2026-02-17。

## 二、方法与架构

- **主干**(据 WAM 综述 arXiv:2605.12090 §4.2.2 的归纳):DreamZero 直接建于预训练的 **Wan2.1 图生视频(image-to-video)主干**之上,仅加**轻量的 state/action 编码器与一个 action decoder**;在 WAM taxonomy 中属 **Joint · 扩散 · 单流(Unified-Stream)· 显式未来预测**——视频潜与动作潜在同一去噪序列里联合优化。
- **联合建模**:同时建模 **video + action**。video 充当「世界如何演化」的稠密表征,用于学习物理动力学;action 与之联合训练,使模型能从**异构机器人数据**高效学习多样技能,而**不依赖重复示范**(作者自评 ⚠️)。
- **闭环不漂移**:据综述,为在闭环里持续以真实观测为条件而不累积生成漂移,DreamZero 在每段动作执行后用**基于 KV-cache 的观测替换**(KV-cache-based observation replacement)把想象帧替换为真实观测。
- **推理回路即策略**:把「预测未来世界状态 → 反推动作」放进推理主回路,因此 WAM 本身即零样本策略,无需额外的策略头分阶段训练(这是与「预测仅作训练先验」路线的本质区别,见第四节)。
- **实时化系统优化**:为让 **14B autoregressive video diffusion model** 达到 **7Hz 实时闭环控制**,据综述引入了一套系统级优化——**异步执行(async execution)+ DiT 缓存 + 量化 + CUDA-graph 编译**(作者/综述陈述 ⚠️)。
- **跨本体 / 少样本适配**:支持用其他机器人或人类的 **video-only 示范**进行跨本体迁移;并可用少量 **play data** 做 few-shot 本体适配,同时保留 zero-shot 泛化能力(数值见下节)。

> 说明:带「据综述」的架构细节(Wan2.1 主干、KV-cache 观测替换、实时化优化、单流归类)取自 WAM 综述 arXiv:2605.12090 §4.2.2 对 DreamZero 的转述(⚠️ 综述/作者陈述);训练目标与扩散调度的更细节实现仍**待核**。

## 三、实验与关键结果

以下全部为**论文作者自评 ⚠️**,尚无基准维护方或第三方统一评测,故不标 ✅。

| 维度 | 设置 | 结果(作者自评 ⚠️) |
|---|---|---|
| 真机新任务/新环境泛化 | 对比 SOTA VLA | >2x improvement |
| 实时闭环控制 | 14B autoregressive video diffusion model | 7Hz real-time closed-loop control |
| 跨本体迁移 | 其他机器人或人类 video-only 示范,仅 10–20 分钟数据,unseen 任务 | >42% relative improvement |
| 少样本本体适配 | 仅 30 minutes of play data,迁移到新本体 | 完成迁移并保留 zero-shot 泛化 |
| 对比基线绝对数值 | — | 待核(一手源未在所给摘要给出) |

要点解读:
- 「>2x」与「>42% relative」均为**相对提升**,所给语料未给出基线的绝对成功率或具体任务集构成,故基线与任务细节标「待核」。
- 7Hz 实时性建立在 14B 自回归视频扩散模型上,是论文主张「世界模型可作为在线策略」可行性的关键支撑——若离线生成则无法闭环。
- 跨本体迁移仅需 10–20 分钟、且可用 **video-only**(无动作标签)示范,是其「从异构数据学习、不依赖重复示范」主张的直接证据(作者自评 ⚠️)。

## 四、与本站谱系的关系

- **NVIDIA GR00T N2**:据本站记录,GR00T N2「based on DreamZero research」,即把 DreamZero 的世界-行动模型思想落到具体本体平台上。详见 WAM 细读 [GR00T N2](/wam/papers/groot-n2)。
- **与 RynnVLA 的关键对照**:DreamZero 与 [RynnVLA](/vla/papers/rynnvla) 构成一组干净的路线对照——RynnVLA 是「**预测当训练先验、推理时丢弃未来帧**」,世界模型只在训练阶段塑形表征;DreamZero 是「**预测当策略主体**」,推理主回路里持续预演未来并反推动作。两者刚好坐落在「世界模型用在训练 vs 用在推理」这条轴的两端。
- **taxonomy 归属**:在 WAM 分类中属 **Joint 类**(联合建模 video 与 action),与 [预测式 VLA](/vla/papers/predictive-vla) 所讨论的 predictive 路线、以及 [WAM 总览](/wam/)中的其他条目(如 [GR00T N2](/wam/papers/groot-n2)、[X-WAM](/wam/papers/x-wam)、[UWM](/wam/papers/uwm))共同构成本站对 WAM 的谱系刻画。
- 评测基准侧可对照本站 [数据集与基准](/vla/papers/benchmarks) 页;但需注意本篇所有成绩为作者自评,未进入统一评测口径。

## 五、局限与存疑

- **全部成绩为作者自评 ⚠️**:>2x、>42% relative、7Hz、10–20 分钟、30 分钟等均出自论文作者,尚无第三方统一评测交叉验证,不应按 ✅ 解读。
- **基线与任务集不透明(待核)**:所给语料未给出对比基线的绝对数值、具体任务清单、本体型号与评测协议,相对提升的可比性无法独立判断。
- **方法细节缺口(待核)**:扩散主干的具体规格、动作解码与训练目标、实现 7Hz 的系统优化手段,在所给摘要中未展开。
- **机构信息缺失(待核)**:36 作者的署名机构未在摘要列出。
- **路线固有风险**:把视频预测放进闭环推理意味着对世界模型的物理保真度与延迟高度敏感;摘要未给出预测漂移、长程闭环稳定性等失败模式分析(待核)。

## 参考文献

- Seonghyeon Ye 等(36 作者),《World Action Models are Zero-shot Policies》,arXiv:2602.15922,提交于 2026-02-17。

> 体例声明:本页所有定量/成绩为论文作者自评(标 ⚠️),尚无基准维护方或第三方统一评测(故不使用 ✅);标「待核」者为一手源在所给语料中未给出、未作任何外部补全。
