---
description: 如何阅读本站——具身智能学习站的内容地图、推荐阅读路径、可信度标注约定(⚠️/✅/待核)与贡献反馈方式,帮助新读者快速上手 VLA 视觉-语言-动作模型深度调研。
---

# 如何阅读本站

本站是一份**持续生长的具身智能学习笔记**,当前主题是 **VLA(视觉-语言-动作)模型发展深度调研**。所有内容由 `deep-research` 多代理工作流(多源检索 + 对抗式事实核查)整理。这一页帮你快速找到该读什么。

## 这是什么 / 不是什么

- **是**:对 VLA 领域(2022–2026)的体系化梳理——发展脉络、30 篇核心论文细读、横切分析专题、数据/基准/机器人本体专题,附可信度标注与一手信源。
- **不是**:教程或代码库。本站重在"读懂领域脉络与关键结论",不提供可运行实现。
- **范围**:目前聚焦 VLA 操作(manipulation);世界模型已在[数据专题 §4](papers/embodied-data)分散覆盖(作数据引擎/生成式预训练先验),足式运动、导航等更广的具身子领域尚未单列。

## 推荐阅读路径

| 你的目标 | 建议路线 |
|---|---|
| **第一次了解 VLA** | [总报告](/vla/) 摘要 + 第一部分发展主线 → [发展时间线](timeline) → 任选 [RT-2](papers/rt2) / [π0](papers/pi0) 细读 |
| **快速建立全景** | [总报告](/vla/) 的论文细读导航表 + [术语速查表](papers/glossary) |
| **深挖某个模型** | 论文细读导航里点对应条目;每篇细读结构统一:TL;DR → 要解决的问题 → 方法与架构 → 实验结果表 → 局限 |
| **找数据/基准/硬件** | [具身数据全景](papers/embodied-data) · [数据集与基准](papers/benchmarks) · [实验机器人本体](papers/robots) |
| **查术语 / 找原文** | [术语速查表](papers/glossary) · [参考文献](papers/references) |

> 每篇细读底部都有「本系列」页脚,可一键跳到相关专题与速查页。

## 阅读优先级(论文太多?先读这些)

细读已有 20+ 篇,不必通读。按下面三档由浅入深、按需取用即可。

### 🥇 第一档 · 必读核心(建立主线,约 7 篇)

看懂"VLA 是什么、两条路线、效率之争、泛化前沿"的最小集——读完这几篇就有完整骨架:

1. [总报告](/vla/) —— **先读这个**,把握全局脉络与五阶段主线
2. [RT-2](papers/rt2) —— 范式奠基:动作即文本 token
3. [π0](papers/pi0) —— 连续流匹配 + 动作分块的代表作
4. [OpenVLA](papers/openvla) —— 开源平民化基线(最常被对标)
5. [OpenVLA-OFT](papers/openvla-oft) —— 离散 vs 连续的最硬定量证据 + 推理提速 26×
6. [π0.5](papers/pi05) —— 双系统/分层 + 开放世界泛化
7. [数据集与基准全景](papers/benchmarks) —— 学会"怎么读懂一个成绩数字"(口径/可信度)

### 🥈 第二档 · 推荐(按技术路线补全)

- **模型**:[Diffusion Policy](papers/diffusion-policy)(连续奠基)· [RT-1](papers/rt1)(离散前史)· [Octo](papers/octo) · [CogACT](papers/cogact) · [π0-FAST](papers/pi0-fast) · [GR00T N1](papers/groot-n1)(双系统) · [π0.6 / π*0.6](papers/pi06)(从经验学习)
- **横切/数据**:[全模型规格对比大表](papers/models-spec)(一页看全 30 模型)· [双系统架构原理](papers/dual-system-architecture) · [具身数据全景](papers/embodied-data)

### 🥉 第三档 · 选读(最新前沿 / 特定主题 / 补充)

- **2025H2–2026 前沿**:[WALL-OSS](papers/wall-oss) · [Qwen-VLA](papers/qwen-vla) · [RynnVLA-001](papers/rynnvla) · [Gemini Robotics](papers/gemini-robotics) · [π0.7](papers/pi07)
- **更多代表模型(12)**:[ECoT](papers/ecot) · [TinyVLA](papers/tinyvla) · [RoboVLMs](papers/robovlms) · [SimpleVLA-RL](papers/simplevla-rl) · [GR-3](papers/gr-3) · [RDT-1B](papers/rdt-1b) · [GO-1](papers/go-1) · [MemoryVLA](papers/memoryvla) · [SpatialVLA](papers/spatialvla) · [Helix](papers/helix) · [SmolVLA](papers/smolvla) · [SteerVLA](papers/steervla)
- **WAM 调研轨(独立)**:[WAM 总览](/wam/) · 细读 [DreamZero](/wam/papers/dreamzero) · [X-WAM](/wam/papers/x-wam) · [UWM](/wam/papers/uwm) · [Genie Envisioner](/wam/papers/genie-envisioner) · [GR00T N2](/wam/papers/groot-n2)
- **方法 / 工程横切**:[预测式 VLA](papers/predictive-vla) · [知识隔离 KI](papers/knowledge-insulation) · [具身数据处理](papers/data-processing) · [推理加速与部署](papers/inference-deployment) · [开源代码库对照](papers/codebases) · [共性失败模式](papers/failure-modes)
- **速查 / 参考**:[术语速查表](papers/glossary) · [发展时间线](papers/timeline) · [参考文献](papers/references) · [外部资源导航(Awesome 列表)](papers/resources) · [实验机器人本体](papers/robots)

> 优先级是"建立全局理解"视角的建议序;若你为特定目的而来(找某模型/某数据集/某工程问题),直接按上面的[推荐阅读路径](#推荐阅读路径)表或顶栏导航定位即可。

## 可信度标注约定

本站对"数字从哪来"非常较真,统一用三个标记:

| 标记 | 含义 |
|---|---|
| ⚠️ | **厂商/作者自评**,未经同行评审或独立第三方复现,采信时需谨慎 |
| ✅ | 经**本站对抗式事实核查**确认,或由基准维护方统一评测 |
| 待核 | 一手来源里**没有给出**该定量数字(常见于论文只给曲线图),不臆造 |

读基准表时还要注意**口径**:同一基准常有多套不可直接横比的设定(如 SimplerEnv 的 Visual Matching vs Variant Aggregation、RoboCasa 的 multitask vs 30-demo),表注里都有说明。同一份数据若同时出现在总报告与专题页,**以专题页为权威源**(总报告 §4.2 已注明指向[《数据集与基准全景》](papers/benchmarks))。

## 站点结构

- **总报告** — 发展主线、代表模型、技术路线之争、数据集与基准、最新前沿、核查与局限
- **论文细读 ×30** — 奠基与两条路线(11)+ 2025H2–2026 前沿(7:含 Wall-OSS-0.5)+ 更多代表模型(12:ECoT/TinyVLA/RoboVLMs/SimpleVLA-RL/GR-3/RDT-1B/GO-1/MemoryVLA/SpatialVLA/Helix/SmolVLA/SteerVLA)
- **横切分析专题 ×7** — 全模型规格对比 / 双系统架构原理 / 预测式 VLA / 知识隔离训练配方 / 推理加速与部署 / 开源代码库对照 / 共性失败模式
- **WAM 调研轨(独立)** — 总览(定义 / 级联 vs 联合 taxonomy / 数据与评测)+ 5 篇细读:DreamZero / X-WAM / UWM / Genie Envisioner / GR00T N2
- **专题** — 具身数据全景 / 具身数据处理 / 数据集与基准 / 实验机器人本体
- **速查与参考** — 术语速查表 / 发展时间线 / 参考文献
- **关于** — 本页 / [更新日志](changelog)

## 贡献与反馈

发现失效链接、数字错误或想补充内容,欢迎在 [GitHub 仓库](https://github.com/ZhuYun97/embodied-ai-learning) 提 issue 或 PR。每页右上角也有「在 GitHub 上编辑本页」入口。
