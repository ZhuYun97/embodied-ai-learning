---
title: Cosmos 3 细读
description: NVIDIA Cosmos 3 全模态世界模型——MoT 两塔(AR 推理塔 + 扩散生成塔)统一 语言/图像/视频/音频/动作,OpenMDW 开源;发布时登顶 RoboArena 真机策略榜、约两天后被千寻 Spirit v1.6 反超。
---

# NVIDIA Cosmos 3 细读

> **WAM 论文细读** · NVIDIA「全模态世界模型」(Omnimodal World Model)——把 VLM / 视频生成 / 世界模拟 / 机器人策略收编进**单一 MoT 模型**,主打具身智能(Physical AI)通用底座。
> [← WAM 总览](/wam/) · [主报告](/vla/) · [🏆 分档榜](/ecosystem/brain-ranking)

> 📄 **arXiv** [2606.02800](https://arxiv.org/abs/2606.02800) · NVIDIA Research(Cosmos Lab)· 2026-06-01 · 291 作者 · **技术报告(非同行评审)** · 代码/权重/合成数据/基准以 **OpenMDW-1.1** 开源(HF `nvidia/cosmos3` · GitHub `nvidia-cosmos`)。

## TL;DR

Cosmos 3 是 NVIDIA 提出的**全模态世界模型家族**:用一套 **Mixture-of-Transformers(MoT,非 MoE)两塔架构**——**AR 推理塔**(因果自注意力,管理解/推理)+ **扩散生成塔**(全注意力 + 去噪,管图像/视频/音频/动作生成),两塔参数独立但**共享联合注意力**(单向 推理→生成)——把**语言 / 图像 / 视频 / 音频 / 动作**五种模态统一进同一参数集。一次前向即可分别扮演 **VLM、视频生成器、世界模拟器、机器人策略**,等于把前代分立的 Cosmos-Reason(VLM)/ Cosmos-Predict(视频世界模型)/ Cosmos-Transfer(受控生成)/ Cosmos-Policy(策略)**收编为一**。分 **Nano(16B)/ Super(64B)** 两档(另有未发布的 Edge 4B),以约 **20 万亿多模态 token** 训练,推理塔骨干**复用阿里 Qwen3-VL**。

**可信度提示**:✅ = 可一手核(arXiv 存在、OpenMDW 开源权重/代码、Qwen3-VL 骨干);⚠️ = **NVIDIA / 官方博客自评**(全部「SOTA / 第一」、20T token、规模);**待核** = 一手未明确或仅媒体口径(精确分数、Edge 规模、RoboArena 各家分)。**所有「第一」均为厂商自评,无顶会同行评审、无统一第三方复现。**

## 一、动机:为什么要「全模态世界模型」

Cosmos 3 之前,NVIDIA 自家 Cosmos 已拆成 **Cosmos-Predict**(视频世界模型)、**Cosmos-Transfer**(受控生成)、**Cosmos-Reason**(物理推理 VLM)、**Cosmos-Policy**(策略)四套独立系统。开发者要在它们之间手动编排「理解→生成→动作」链,痛点是:多模型串接**延迟叠加、误差累积**;**模态割裂**(推理模型不生成视频、视频模型不出关节角,动作永远依赖额外「最后一英里」模型);难以**端到端联合后训练**。Cosmos 3 的目标:**一套参数、一次前向**,同时当 VLM、正/逆向动力学模型与策略网络。⚠️(官方陈述)

## 二、架构:MoT 两塔

NVIDIA 明确强调这是 **MoT(Mixture-of-Transformers)而非 MoE**——区别在于 MoE 在 FFN 层路由专家,而 MoT 是**两套完整 Transformer 参数(AR + DM)共享同一注意力算子**,路由发生在**序列级**。⚠️(官方澄清,媒体转述)

| 塔 | 机制 | 职责 |
|----|------|------|
| **Reasoner Tower(AR)** | 因果自注意力 + 下一 token 预测 | 视觉-语言推理、物理常识、CoT、指代定位 |
| **Generator Tower(DM)** | 全注意力 + 迭代去噪(扩散) | 图像 / 视频 / 音频 / **动作**连续量生成 |

两塔每层参数独立,但经 **Joint Attention** 交互,信息**单向 推理→生成**(AR token 不被 DM 反向更新);共享 **3D 多模态旋转位置编码(3D mRoPE)**,把视频 / 音频 / 动作 token 对齐到同一时间轴。⚠️(HF 博客 / 官方陈述)

**五模态 tokenization**:文本=离散 token(AR);图像=ViT→共享空间(256/480/720p 多纵横比);视频=VAE→连续 latent→DM(默认 189 帧、最多 400 帧);音频=VAE→DM(与帧同步);**动作=领域感知向量→JSON**(每帧 9D~57D,随本体而变)。

**「灵活输入-输出」即同一权重的多重身份**:`文本+图/视→文本`=VLM;`文本→图/视`=文生图 / 视频;`文本+图/视+动作→视频`=正向动力学;`文本+视频→动作`=逆向动力学;`图+文→视频+动作`=**策略**。⚠️

## 三、规模与训练

| 变体 | 总参数 | AR 塔 | DM 塔 | 目标硬件 |
|------|--------|-------|-------|---------|
| **Cosmos 3 Nano** | 16B | 8B(Qwen3-VL 8B 骨干) | 8B | RTX PRO 6000 工作站 |
| **Cosmos 3 Super** | 64B | 32B(Qwen3-VL 32B 骨干) | 32B | Hopper / Blackwell 数据中心 |
| **Cosmos 3 Edge** | 4B(**待核**) | — | — | 边缘实时,**尚未发布** |

另有在 Nano/Super 上后训练的专项权重:`Nano-Policy-DROID`(机器人策略)、`Super-Text2Image`、`Super-Image2Video`。

**训练**:约 **20 万亿多模态 token**⚠️(官方/媒体);HF model card 给出 **1.3B 样本、跨 393 个数据集**;构成上**合成数据占主体**(Qwen3-VL 合成字幕 1,115M、合成图像约 29M),真实数据含 UMI / AgiBot / DROID / YouTube / Egocentric 等;**动作样本仅约 8M(占比 ~0.6%)**——机器人侧数据量相对极小。阶段:预训练(联合两塔、五模态)→ 后训练(SFT 领域定制 + 动作后训练:正/逆向动力学 + 策略)。具体后训练算法与算力(GPU·时)**待核**。

## 四、它「收编」了什么

| 前代能力 | 前代模型 | Cosmos 3 实现 |
|---------|---------|--------------|
| 视觉-语言模型 | Cosmos-Reason 2 | AR 推理塔(支持长上下文推理) |
| 视频生成 / 世界模拟 | Cosmos-Predict 2.5 | DM 生成塔 + 灵活模态配置 |
| 受控生成 / 迁移 | Cosmos-Transfer 2.5 | 条件输入(文本+图/视+动作)控制生成 |
| 机器人策略 / 世界-动作 | Cosmos-Policy(独立) | JSON 动作 token 由同一模型直出,无需外部 VLA 编排 |

## 五、结果(几乎全为自评)

- **理解 / 生成 SOTA**⚠️:官方称在 VANTAGE-Bench、TAR、Physics-IQ、PAI-Bench、R-Bench、RoboLab 等**开源榜**「第一」——但**精确分数全文/博客均未给出(待核)**。
- **Artificial Analysis 文生图 / 图生视频 第一**⚠️:`Super-Text2Image`、`Super-Image2Video` 被第三方 Artificial Analysis 评为**开源子榜第一**;媒体补充其在含闭源的大榜上「仅次于 Nano Banana 2」——即**开源第一、非绝对第一**;具体评分**待核**。(Artificial Analysis 是第三方评测方,属较硬信号,但仍单一来源。)
- **RoboArena 真机策略(DROID 平台,NVIDIA × 斯坦福 × 伯克利 共建)**——**时间戳口径,务必小心**:发布时(2026-06-01)`Cosmos3-Nano-Policy` **1881 分**称开源策略第一;**约两天后(06-03)被千寻智能 Spirit v1.6(1924)反超**,NVIDIA 投资支持的 DreamZero 1763 列第三。⚠️📰(分数为媒体口径 The Next Web / Gizmochina / 36kr,**非一手**;π0.5 / GR00T N2 当时分数未披露)。**这正印证本站[分档榜](/ecosystem/brain-ranking)的判断:RoboArena 名次随快照漂移、且榜由 NVIDIA 共建、无中立裁定——「写报告时第一」不等于持续第一。**
- **支持本体**(动作维度):单臂 Franka 10D / 双臂 Franka 20D / AgiBot 29D / UR 10D / Google Robot 10D / WidowX 10D / 自我中心 57D / 通用相机 9D 等;RoboArena=真机,RoboLab=仿真。

## 六、开源(分量重)

代码 + **Nano/Super 及各专项权重** + 6 个合成数据集(机器人 / 物理 / 空间推理 / 人体运动 / 驾驶 / 仓储)+ 评测基准,均以 **Linux Foundation 的 OpenMDW-1.1** 许可放出(允许商用,条款与 Apache-2.0 有别,生产部署前需核条款);Diffusers 已集成 `Cosmos3OmniPipeline`。✅(可一手核:HF/GitHub)。相比 GR00T N1 当年的「非商用 license」,这次开放更彻底,强化了 NVIDIA「机器人界底座 / 安卓」的定位。

## 七、与谱系的关系

- **Cosmos 1→2→3 的统一**:1.x(Predict/Transfer 分立)→ 2.x(Predict 2.5 三合一 + Reason 2 独立 VLM)→ **3(MoT 单模型统一 AR 推理 + DM 生成 + 动作)**。
- **骨干复用 [Qwen3-VL](/ecosystem/brain-ranking)**:AR 塔由阿里 Qwen3-VL(8B/32B)初始化——NVIDIA 自身对推理能力的增量与 Qwen3-VL 本身贡献**难以解耦**。
- **与 WAM 谱系**:同属 NVIDIA「世界-行动模型」路线,可与本站 [GR00T N2](/wam/papers/groot-n2)、[DreamZero](/wam/papers/dreamzero) 对读(N2「based on DreamZero」、走潜空间想象;Cosmos 3 走「全模态生成 + 动作 token」)。VLA 对照见 [GR00T N1](/vla/papers/groot-n1)。

## 八、局限与存疑

- **官方自述局限**(HF model card):生成有**时间不一致、运动不稳、接触/碰撞物理不准、音画不同步、长时域动作-状态漂移**;推理会**幻觉/因果与空间几何出错**;**无显式物理仿真器、不保物体永久性**;**分布外质量下降,明确不适用于安全关键场景(机器人控制 / 自动驾驶 / 科学仿真)**。
- **技术报告非同行评审**,自评成分重,无统一第三方复现。
- **RoboArena 时间戳 + 利益相关**:发布即第一、两天被超;榜由 NVIDIA 共建。
- **Artificial Analysis 仅开源子榜第一**,且未公开分数。
- **动作数据极少(~0.6%)**,机器人泛化受限;**Edge 版未发布**,边缘生产就绪存疑。
- **骨干依赖 Qwen3-VL**,贡献归属难分。

## 参考文献

- NVIDIA, *Cosmos 3: Omnimodal World Models for Physical AI*. arXiv [2606.02800](https://arxiv.org/abs/2606.02800)(2026-06-01,技术报告)。摘要、开源(OpenMDW-1.1)为一手;架构/规模/SOTA 多来自官方博客与 HF model card(⚠️ 自评)。
- HF 博客 / `nvidia/cosmos3` model card(MoT 两塔、3D mRoPE、Nano 16B / Super 64B、1.3B 样本 / 393 数据集、本体维度、limitations)。⚠️/✅(开源物可核)。
- NVIDIA Cosmos Lab 项目页 / Developer Blog / Newsroom(20T token、统一四能力、Cosmos 1→3 谱系)。⚠️。
- RoboArena 事件:The Next Web / Gizmochina / 36kr(Cosmos3-Nano-Policy 1881 → Spirit v1.6 1924 反超 → DreamZero 1763)。📰 媒体口径、非一手、待核。

> 可信度体例:✅ = 一手可核(arXiv / OpenMDW 开源权重代码 / Qwen3-VL 骨干);⚠️ = NVIDIA 官方或媒体转述的自评(所有「SOTA / 第一」、20T token、规模);📰/**待核** = 仅媒体口径或一手未明确(精确分数、Edge 规模、RoboArena 各家分、后训练算法)。技术报告非同行评审。
