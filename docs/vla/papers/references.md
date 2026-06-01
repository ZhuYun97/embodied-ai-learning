---
description: VLA 与具身智能深度调研报告的参考文献聚合页,汇总全站一手信源即论文原文与官方页面,去重后按奠基模型、前沿模型等主题整理为可检索的参考文献表,并标注关联细读与自评数据。
title: 主要信源与参考文献
---

> [← 返回主报告](../index.md)

# 主要信源 / 参考文献聚合页

本页汇总全站一手信源(论文原文 / 官方一手页面),去重后按主题整理为可检索的参考文献表。
来源:[主报告附录](../index.md)、各 [细读](./) 子文档、[具身数据专题第八节](embodied-data.md)。

**说明**:
- ⚠️ = 提出方 / 厂商自评数据,非独立第三方复现,引用时请谨慎。
- 「关联细读」列指向本站已有的逐篇细读文档;无细读的条目仅给一手 URL。
- 日期 2026-05-30,领域演进极快,多数信源为 2024–2026 预印本 / 官方页面;部分 arXiv 编号落在 2026,极新、社区尚未充分审视。

---

## 0. 目录速览(主题导航)

```mermaid
graph LR
    A[参考文献] --> B[1 奠基模型]
    A --> C[2 前沿模型]
    A --> D[3 基准 Benchmark]
    A --> E[4 数据集]
    A --> F[5 采集范式]
    A --> G[6 综述与方法]
    B -.RT-1/RT-2/Octo/OpenVLA/π0/Diffusion Policy.-> B
    C -.GR00T/Gemini/WALL-OSS/Qwen-VLA/RynnVLA/π*0.6/CogACT.-> C
```

| # | 主题 | 条数 | 一句话 |
|---|---|---|---|
| [1](#1-奠基模型) | 奠基模型 | 9 | RT 系列、Octo、OpenVLA(-OFT)、π0(-FAST)、Diffusion Policy |
| [2](#2-前沿模型2024-2026) | 前沿模型 | 11 | GR00T N1.x、Gemini Robotics、WALL-OSS、Qwen-VLA、RynnVLA、π0.5/π*0.6、CogACT、Helix |
| [3](#3-基准-benchmark) | 基准 | 6 | SimplerEnv、LIBERO、CALVIN、MemoryVLA、VOTE、3D Diffuser Actor、GR-1 |
| [4](#4-数据集) | 数据集 | 16 | OXE、BridgeData V2、DROID、AgiBot World、Ego4D、Cosmos … |
| [5](#5-采集范式与数据生成) | 采集范式 | 11 | ALOHA 系列、UMI、AirExo、DexCap、MimicGen、DreamGen、Genie/LAPA … |
| [6](#6-综述-方法-scaling) | 综述/方法 | 6 | 首篇 VLA 综述、Action Tokenization、知识隔离、Scaling Laws … |

---

## 1. 奠基模型

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **RT-1** (Robotics Transformer 1) | Google 2022 | arxiv.org/abs/2212.06817 | [📄 rt1](rt1.md) | EfficientNet + Transformer,离散动作 256 bin,验证"规模换泛化" |
| **RT-2** (VLA 分水岭) | Google DeepMind 2023 | arxiv.org/abs/2307.15818 · ar5iv.org/abs/2307.15818 | [📄 rt2](rt2.md) | 动作=文本 token,首证网络知识可迁移到机器人控制(PaLI-X / PaLM-E) |
| **Octo** | UC Berkeley 2024 | arxiv.org/abs/2405.12213 | [📄 octo](octo.md) | 开源通用机器人策略,OXE 上预训练 |
| **OpenVLA** | Stanford/Berkeley 2024 | arxiv.org/abs/2406.09246 | [📄 openvla](openvla.md) | 7B 开源 VLA,Prismatic VLM 基座 |
| **OpenVLA-OFT** | 2025 (RSS 2025) | arxiv.org/abs/2502.19645 · openvla-oft.github.io | [📄 openvla-oft](openvla-oft.md) | 离散-vs-连续动作的关键定量证据来源 |
| **Diffusion Policy** | Columbia/Stanford/Toyota 2023 | arxiv.org/abs/2303.04137 · github.com/real-stanford/diffusion_policy | [📄 diffusion-policy](diffusion-policy.md) | 扩散模型生成动作序列,视觉运动策略奠基 |
| **π0 (pi-zero)** | Physical Intelligence 2024 | arxiv.org/abs/2410.24164 | [📄 pi0](pi0.md) | 流匹配动作专家 + VLM 主干 |
| **π0-FAST** | Physical Intelligence 2025 | arxiv.org/abs/2501.09747 · pi.website/research/fast | [📄 pi0-fast](pi0-fast.md) | FAST 频域离散动作分词 ⚠️ |
| **OXE** (Open X-Embodiment) | 跨机构 2023 | arxiv.org/abs/2310.08864 · robotics-transformer-x.github.io | — | 既是数据集又是奠基性跨本体训练基础(见 [§4](#4-数据集)) |

---

## 2. 前沿模型(2024–2026)

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **GR00T N1** | NVIDIA GEAR 2025 | arxiv.org/abs/2503.14734 | [📄 groot-n1](groot-n1.md) | 人形通用基座,双系统架构 |
| **GR00T N1.5 / N1.6 / N1.7** | NVIDIA GEAR 2025 | research.nvidia.com/labs/gear/gr00t-n1_5/ · …/gr00t-n1_6/ · huggingface.co/blog/nvidia/gr00t-n1-7 · github.com/NVIDIA/Isaac-GR00T | [📄 groot-n1](groot-n1.md) | 迭代版本(官方页面,⚠️ 自评) |
| **Gemini Robotics** | Google DeepMind 2025 | arxiv.org/abs/2503.20020 | [📄 gemini-robotics](gemini-robotics.md) | Gemini 2.0 基座的 VLA |
| **CogACT** | Microsoft 2024 | arxiv.org/abs/2411.19650 · github.com/microsoft/CogACT · huggingface.co/CogACT | [📄 cogact](cogact.md) | 认知-动作组件化 VLA |
| **WALL-OSS** | X-Square Robot 2025 | arxiv.org/abs/2509.11766 · github.com/X-Square-Robot/wall-x · huggingface.co/x-square-robot | [📄 wall-oss](wall-oss.md) | 端到端具身基座,Qwen2.5-VL MoE ~4B,流匹配 + FAST 双分支 ⚠️ |
| **Qwen-VLA** | Qwen 团队 2026 | arxiv.org/abs/2605.30280 · github.com/QwenLM/Qwen-VLA | [📄 qwen-vla](qwen-vla.md) | ⚠️ arXiv 编号落在 2026,极新 |
| **RynnVLA-001** | 达摩院 + 湖畔 2025 (ICRA 2026) | arxiv.org/abs/2509.15212 · huggingface.co/Alibaba-DAMO-Academy/RynnVLA-001-7B-Base | [📄 rynnvla](rynnvla.md) | 7B,视频生成预训练→动作"第三条路" ⚠️ |
| **π0.5 (pi-zero-five)** | Physical Intelligence 2025 | arxiv.org/abs/2504.16054 · pi.website/blog/pi05 | [📄 pi05](pi05.md) | 开放世界泛化 |
| **π*0.6 (pi-star-0.6 / RECAP)** | Physical Intelligence 2025.11 | arxiv.org/abs/2511.14759 · pi.website/blog/pistar06 · website.pi-asset.com/pi06star/PI06_model_card.pdf | [📄 pi06](pi06.md) | 真机 RL 改进,最难任务吞吐翻倍、失败率约减半 ⚠️ |
| **Figure Helix** | Figure AI 2025 | figure.ai/news/helix | — | 仅官方新闻页(无论文) ⚠️ |
| **SteerVLA** | Stanford/Berkeley 2026 | arxiv.org/abs/2602.08440 · steervla.github.io · openreview.net/forum?id=fS6UPyXF4A | [📄 steervla](steervla.md) | 自动驾驶域:高层 VLM 语言 meta-action 操控低层 VLA waypoint;⚠️ ICLR 2026 投稿,Bench2Drive 长尾 +8.04 |

---

## 3. 基准 Benchmark

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **SimplerEnv** | 2024 | arxiv.org/abs/2405.05941 · github.com/simpler-env/SimplerEnv | — | 仿真评测桥接真机 |
| **LIBERO** | NeurIPS 2023 (Liu & Zhu) | github.com/Lifelong-Robot-Learning/LIBERO | — | 终身机器人学习基准 |
| **CALVIN** | 2021 | arxiv.org/abs/2112.03227 · github.com/mees/calvin | — | 长程语言条件操作基准 |
| **MemoryVLA** | 2025 | arxiv.org/abs/2508.19236 | — | 横评数据源(记忆机制) |
| **VOTE** | 2025 | arxiv.org/abs/2507.05116 | — | 横评数据源 |
| **3D Diffuser Actor** | 2024 | arxiv.org/abs/2402.10885 | — | CALVIN/横评对照 |
| **GR-1** | ICLR 2024 | gr1-manipulation.github.io | — | 视频预训练操作策略,横评对照 |

---

## 4. 数据集

### 真机数据集

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **OXE** (Open X-Embodiment) | 跨机构 2023 | arxiv.org/abs/2310.08864 · robotics-transformer-x.github.io | [📄 embodied-data](embodied-data.md) | 跨本体聚合数据集 |
| **BridgeData V2** | UC Berkeley 2023 | arxiv.org/abs/2308.12952 · rail-berkeley.github.io/bridgedata | [📄 embodied-data](embodied-data.md) | |
| **DROID** | 跨机构 2024 | arxiv.org/abs/2403.12945 · droid-dataset.github.io | [📄 embodied-data](embodied-data.md) | |
| **RH20T** | 2023 | arxiv.org/abs/2307.00595 | [📄 embodied-data](embodied-data.md) | |
| **RoboSet** | 2023 | arxiv.org/abs/2309.01918 · robopen.github.io/roboset | [📄 embodied-data](embodied-data.md) | 官方 28,500 条(网传 98,500 有误)|
| **AgiBot World** | 智元 OpenDriveLab 2025 | arxiv.org/abs/2503.06669 · opendrivelab.com/AgiBot-World | [📄 embodied-data](embodied-data.md) | |
| **RoboMIND** | 2024 | arxiv.org/abs/2412.13877 | [📄 embodied-data](embodied-data.md) | |
| **Language-Table** | Google 2022 | arxiv.org/abs/2210.06407 | [📄 embodied-data](embodied-data.md) | |
| **BC-Z** | Google 2022 | arxiv.org/abs/2202.02005 | [📄 embodied-data](embodied-data.md) | |

### 人类视频与第一视角

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **Ego4D** | 跨机构 2021 | arxiv.org/abs/2110.07058 | [📄 embodied-data](embodied-data.md) | |
| **Ego-Exo4D** | 跨机构 2023 | arxiv.org/abs/2311.18259 | [📄 embodied-data](embodied-data.md) | |
| **EPIC-Kitchens** | 2018 | arxiv.org/abs/1804.02748 | [📄 embodied-data](embodied-data.md) | |
| **Something-Something V2** | 2017 | arxiv.org/abs/1706.04261 | [📄 embodied-data](embodied-data.md) | |
| **EgoDex** | Apple 2025 | arxiv.org/abs/2505.11709 · github.com/apple/ml-egodex | [📄 embodied-data](embodied-data.md) | |

### 仿真与合成 / 世界模型

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **MimicGen** | NVIDIA 2023 | arxiv.org/abs/2310.17596 | [📄 embodied-data](embodied-data.md) | |
| **RoboCasa** | 2024 | arxiv.org/abs/2406.02523 | [📄 embodied-data](embodied-data.md) | |
| **ManiSkill2** | UCSD/Hao Su 2023 | arxiv.org/abs/2302.04659 | [📄 embodied-data](embodied-data.md) | |
| **ManiSkill3** | UCSD/Hao Su 2024 | arxiv.org/abs/2410.00425 | [📄 embodied-data](embodied-data.md) | 30,000+ FPS,比同类快 10–1000× ⚠️ |
| **Isaac Sim / Lab** | NVIDIA 2023–25 | arxiv.org/abs/2511.04831 | [📄 embodied-data](embodied-data.md) | sim-to-real / 域随机化主力框架 |
| **DreamGen** | NVIDIA GEAR 2025 | arxiv.org/abs/2505.12705 | [📄 embodied-data](embodied-data.md) | RoboCasa 上最高 333× 放大 ⚠️,已有真机仍 +8.8% ⚠️ |
| **Cosmos** (世界基础模型) | NVIDIA 2025–26 | arxiv.org/abs/2501.03575 | [📄 embodied-data](embodied-data.md) | open-weight CC-BY-4.0,约 1 亿级片段,4B–14B |

---

## 5. 采集范式与数据生成

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **ALOHA** | Stanford 2023 | arxiv.org/abs/2304.13705 | [📄 embodied-data](embodied-data.md) | 低成本双臂遥操作 |
| **Mobile ALOHA** | Stanford 2024 | arxiv.org/abs/2401.02117 | [📄 embodied-data](embodied-data.md) | 移动底盘版 |
| **ALOHA 2** | Google DeepMind 2024 | arxiv.org/abs/2405.02292 | [📄 embodied-data](embodied-data.md) | |
| **UMI** (Universal Manipulation Interface) | Stanford 2024 | arxiv.org/abs/2402.10329 | [📄 embodied-data](embodied-data.md) | 手持夹爪采集 |
| **FastUMI-100K** | 2025 | arxiv.org/html/2510.08022v1 | [📄 embodied-data](embodied-data.md) | |
| **AirExo** | 2023 | arxiv.org/abs/2309.14975 | [📄 embodied-data](embodied-data.md) | 外骨骼采集 |
| **AirExo-2** | 2025 | arxiv.org/abs/2503.03081 | [📄 embodied-data](embodied-data.md) | |
| **DexCap** | Stanford 2024 | arxiv.org/abs/2403.07788 | [📄 embodied-data](embodied-data.md) | 灵巧手动作捕捉 |
| **Genie** (生成式交互环境) | DeepMind 2024 | arxiv.org/abs/2402.15391 | [📄 embodied-data](embodied-data.md) | |
| **LAPA** (潜动作预训练) | 2024 | arxiv.org/abs/2410.11758 | [📄 embodied-data](embodied-data.md) | |
| **EgoMimic** | 2024 | arxiv.org/abs/2410.24221 | [📄 embodied-data](embodied-data.md) | 第一视角模仿 |

---

## 6. 综述 / 方法 / Scaling

| 标题 / 缩写 | 团队·年份 | arXiv / 官网 URL | 关联细读 | 备注 |
|---|---|---|---|---|
| **首篇 VLA 综述** | 2024.05 | arxiv.org/abs/2405.14093 | [📄 主报告 §综述视角](../index.md) | ① VLA 组件 ② 控制策略 ③ 高层任务规划器 |
| **Action Tokenization 综述** | 2025 | arxiv.org/abs/2507.01925 | [📄 主报告](../index.md) | 8 类动作 token 分类 |
| **VLA 三阶段时间线综述** | 2025 | arxiv.org/abs/2505.04769 | [📄 主报告](../index.md) | 基础融合→具身推理→泛化与安全部署 |
| **Knowledge Insulation(知识隔离)** | Physical Intelligence 2025 | arxiv.org/abs/2505.23705 · pi.website/research/knowledge_insulation | [📄 pi06](pi06.md) | 隔离预训练 VLM 主干,连续专家梯度不回传 |
| **Data Scaling Laws (机器人)** | 2024 | arxiv.org/abs/2410.18647 | [📄 embodied-data](embodied-data.md) | |
| **Re-Mix(数据配比)** | 2024 | arxiv.org/abs/2408.14037 | [📄 embodied-data](embodied-data.md) | |
| **Sim-and-Real Co-Training** | 2025 | arxiv.org/abs/2503.24361 | [📄 embodied-data](embodied-data.md) | 仿真-真机协同训练 |

---

## 附:按 arXiv 编号速查表

| arXiv ID | 名称 | 主题 |
|---|---|---|
| 1706.04261 | Something-Something V2 | 数据集 |
| 1804.02748 | EPIC-Kitchens | 数据集 |
| 2110.07058 | Ego4D | 数据集 |
| 2112.03227 | CALVIN | 基准 |
| 2202.02005 | BC-Z | 数据集 |
| 2210.06407 | Language-Table | 数据集 |
| 2212.06817 | RT-1 | 奠基模型 |
| 2302.04659 | ManiSkill2 | 数据集 |
| 2303.04137 | Diffusion Policy | 奠基模型 |
| 2304.13705 | ALOHA | 采集范式 |
| 2307.00595 | RH20T | 数据集 |
| 2307.15818 | RT-2 | 奠基模型 |
| 2308.12952 | BridgeData V2 | 数据集 |
| 2309.01918 | RoboSet | 数据集 |
| 2309.14975 | AirExo | 采集范式 |
| 2310.08864 | OXE | 奠基/数据集 |
| 2310.17596 | MimicGen | 采集范式 |
| 2311.18259 | Ego-Exo4D | 数据集 |
| 2401.02117 | Mobile ALOHA | 采集范式 |
| 2402.10329 | UMI | 采集范式 |
| 2402.10885 | 3D Diffuser Actor | 基准 |
| 2402.15391 | Genie | 采集范式 |
| 2403.07788 | DexCap | 采集范式 |
| 2403.12945 | DROID | 数据集 |
| 2405.02292 | ALOHA 2 | 采集范式 |
| 2405.05941 | SimplerEnv | 基准 |
| 2405.12213 | Octo | 奠基模型 |
| 2405.14093 | 首篇 VLA 综述 | 综述 |
| 2406.02523 | RoboCasa | 数据集 |
| 2406.09246 | OpenVLA | 奠基模型 |
| 2408.14037 | Re-Mix | 方法 |
| 2410.00425 | ManiSkill3 | 数据集 |
| 2410.11758 | LAPA | 采集范式 |
| 2410.18647 | Data Scaling Laws | 方法 |
| 2410.24164 | π0 | 奠基模型 |
| 2410.24221 | EgoMimic | 采集范式 |
| 2411.19650 | CogACT | 前沿模型 |
| 2412.13877 | RoboMIND | 数据集 |
| 2501.03575 | Cosmos | 数据集 |
| 2501.09747 | π0-FAST | 奠基模型 |
| 2502.19645 | OpenVLA-OFT | 奠基模型 |
| 2503.03081 | AirExo-2 | 采集范式 |
| 2503.06669 | AgiBot World | 数据集 |
| 2503.14734 | GR00T N1 | 前沿模型 |
| 2503.20020 | Gemini Robotics | 前沿模型 |
| 2503.24361 | Sim-and-Real Co-Training | 方法 |
| 2504.16054 | π0.5 | 前沿模型 |
| 2505.04769 | VLA 三阶段时间线综述 | 综述 |
| 2505.11709 | EgoDex | 数据集 |
| 2505.12705 | DreamGen | 数据集 |
| 2505.23705 | Knowledge Insulation | 方法 |
| 2507.01925 | Action Tokenization 综述 | 综述 |
| 2507.05116 | VOTE | 基准 |
| 2508.19236 | MemoryVLA | 基准 |
| 2509.11766 | WALL-OSS | 前沿模型 |
| 2509.15212 | RynnVLA-001 | 前沿模型 |
| 2510.08022 | FastUMI-100K | 采集范式 |
| 2511.04831 | Isaac Lab | 数据集 |
| 2511.14759 | π*0.6 | 前沿模型 |
| 2605.30280 ⚠️ | Qwen-VLA | 前沿模型 |

---

*本页为《VLA 发展深度调研报告》信源聚合,综合主报告附录 + 25 篇细读 + 具身数据专题第八节,去重整理。⚠️ 标记处为提出方/厂商自评数据。*
