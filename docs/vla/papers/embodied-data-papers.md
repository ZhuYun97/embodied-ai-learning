---
title: 具身数据论文索引
description: 具身智能与 VLA/WAM 数据相关论文索引,按真机数据集、人类视频、仿真合成数据、数据处理、数据筛选与评测基准聚合本站已收录论文和一手信源。
---

# 具身数据论文索引

> [← 返回主报告](../index.md) · [具身数据全景](embodied-data.md) · [具身数据处理](data-processing.md) · [评测基准全景](benchmarks.md)

本页不是新的长篇综述,而是一个**论文入口页**:把本站已经分散在「具身数据全景」「数据处理」「WAM 数据引擎」「基准评测」里的数据相关论文按用途收拢。读数据方向时,建议先用本页定位,再跳到专题页或细读页。

## 一、怎么读

| 你关心的问题 | 优先读 | 读完应得到什么 |
|---|---|---|
| 数据从哪里来 | [具身数据全景](embodied-data.md) | 真机、网络视觉语言、人类视频、仿真/合成数据四层金字塔 |
| 原始轨迹怎么变训练样本 | [具身数据处理](data-processing.md) | 清洗、标注、动作归一化、分块、伪标签、采样配比、格式 |
| 哪些数据集最重要 | 本页 §二 + [具身数据全景 §二](embodied-data.md#二主流真机数据集横向对比) | OXE、DROID、AgiBot、BridgeData 等的规模、模态、开源性 |
| 合成数据能不能用 | 本页 §四 + [RoboDream](/wam/papers/robodream) + [Supervise What Survives](supervise-what-survives.md) | 生成数据适合做什么、不适合伪造什么 |
| 怎么筛掉低质量轨迹 | 本页 §五 + [World Value Models](/wam/papers/world-value-models) | value / quality / influence 作为数据筛选信号的边界 |
| 用什么基准验证数据效果 | [评测基准全景](benchmarks.md) | SimplerEnv、LIBERO、CALVIN、RoboCasa、RoboArena 等口径差异 |

## 二、真机遥操作与跨本体数据集

这组论文决定了 VLA 的公共训练底座。重点不是只看规模,而是看本体、模态、采集方式、许可证和是否能跨本体复用。

| 论文 / 数据集 | 类型 | 站内位置 | 一句话 |
|---|---|---|---|
| RT-1 | 单本体真机遥操作 | [RT-1 细读](rt1.md) · [数据全景](embodied-data.md#二主流真机数据集横向对比) | Google EDR 单臂,早期大规模语言条件真机操作数据 |
| BC-Z | 语言/视频条件真机数据 | [数据全景](embodied-data.md#二主流真机数据集横向对比) | Google/Berkeley/Stanford,连接语言、视频条件与机器人控制 |
| Language-Table | 桌面推动与语言交互 | [数据全景](embodied-data.md#二主流真机数据集横向对比) | 近 60 万语言标注轨迹,常作为 OXE 子集与语言条件操作基底 |
| BridgeData V2 | WidowX 桌面操作 | [数据全景](embodied-data.md#二主流真机数据集横向对比) | 60,096 条轨迹,低成本真实场景采集代表 |
| RH20T | 多臂多模态遥操作 | [数据全景](embodied-data.md#二主流真机数据集横向对比) | RGB-D、力觉、音频并存,适合看多模态采集复杂度 |
| RoboSet | Franka 厨房技能 | [数据全景](embodied-data.md#二主流真机数据集横向对比) | 真实厨房技能集,注意规模口径与网传数字差异 |
| DROID | in-the-wild 真机数据 | [数据全景](embodied-data.md#二主流真机数据集横向对比) · [数据处理 §2.6](data-processing.md#26-标定一致性治理与事后重标定droid) | 7.6 万轨迹 / 350h / 13 机构,也是很多 2026 数据合成工作的底座 |
| RoboMIND | 多本体 + 失败示范 | [数据全景](embodied-data.md#二主流真机数据集横向对比) · [数据处理 §2.1](data-processing.md#21-多阶段人工质检--结构化失败类目robomind) | 107k 轨迹、4 本体、失败原因标注,适合看质量控制 |
| AgiBot World | 百万级人形/双臂数据 | [数据全景](embodied-data.md#二主流真机数据集横向对比) · [GO-1](go-1.md) | 约 100 万轨迹 / 2976.4h,代表厂商工厂化采集路线 |
| OXE / RT-X | 跨机构跨本体聚合 | [数据全景](embodied-data.md#二主流真机数据集横向对比) · [RT-2](rt2.md) · [OpenVLA](openvla.md) · [Octo](octo.md) | 22 本体、60 个已有数据集聚合,VLA 公共底座 |

**读表提醒**:OXE 是聚合集,不要把它和 RT-1、BridgeData V2 等子集重复计数;episode、trajectory、hour 也不能直接横比。

## 三、人类视频与第一视角数据

人类视频的价值是便宜、海量、语义丰富,但问题是没有机器人动作标签。因此这一类论文通常要和潜动作、逆动力学、手部关键点或 retarget 方法一起看。

| 论文 / 数据集 | 类型 | 站内位置 | 一句话 |
|---|---|---|---|
| Ego4D | 大规模第一视角视频 | [数据全景 §三](embodied-data.md#三人类视频与第一视角数据) | 3670 小时第一视角视频,适合作为人类动态先验 |
| Ego-Exo4D | ego + exo 同步视频 | [数据全景 §三](embodied-data.md#三人类视频与第一视角数据) | 同步多视角能缓解第一视角到第三视角的观测 gap |
| EPIC-Kitchens | 厨房第一视角 | [数据全景 §三](embodied-data.md#三人类视频与第一视角数据) | 操作语义丰富,但仍需动作翻译 |
| Something-Something V2 | 细粒度手物动作 | [数据全景 §三](embodied-data.md#三人类视频与第一视角数据) | 强时序动作语义,常用于操作相关表征预训练 |
| EgoDex | 眼镜/手部姿态采集 | [数据全景 §三](embodied-data.md#三人类视频与第一视角数据) | 代表“人类视频 + 3D 姿态”的新采集趋势 |
| EgoMimic | 人类到机器人模仿 | [数据全景 §三](embodied-data.md#三人类视频与第一视角数据) | 关注 human-to-robot transfer 和本体差异 |
| LAPA | 潜动作预训练 | [WAM: LAPA](/wam/papers/lapa) | 把无动作视频转成可学习的 latent action,是人类视频进入策略训练的关键桥 |
| Gen2Act | 人类视频到动作 | [WAM: Gen2Act](/wam/papers/gen2act) | 级联路线:先从人类视频生成/规划,再转动作 |

## 四、仿真、合成数据与世界模型数据引擎

这一类工作最容易被过度宣传。本站目前的基本口径是:合成数据有价值,但要区分它在提供**几何/视觉/覆盖率**,还是在伪造**动作标签**。

| 论文 / 系统 | 类型 | 站内位置 | 一句话 |
|---|---|---|---|
| MimicGen | 仿真轨迹生成 | [数据全景 §四](embodied-data.md#四仿真与合成数据) | 从少量人类演示批量生成任务轨迹,仿真数据扩量代表 |
| RoboCasa | 厨房仿真与合成基准 | [评测基准 §四](benchmarks.md#四robocasa本轮重点补齐) · [数据全景 §四](embodied-data.md#四仿真与合成数据) | 既是基准,也是合成数据和 sim-real co-training 的主要舞台 |
| ManiSkill2 / 3 | 仿真平台 | [数据全景 §四](embodied-data.md#四仿真与合成数据) · [评测基准 §五](benchmarks.md#五仿真操作扩展基准对照) | 程序化任务、特权状态和可复现实验环境 |
| DreamGen | 视频世界模型生成数据 | [数据全景 §四](embodied-data.md#四仿真与合成数据) | 生成机器人视频并回收伪动作,需要警惕动作噪声 |
| Cosmos | 世界模型基座 | [Cosmos 3](/wam/papers/cosmos3) | 被多个机器人数据合成/仿真工作当作基础生成模型 |
| RoboDream | 数据合成引擎 | [RoboDream](/wam/papers/robodream) | 以 robot-only 运动作锚,生成场景/物体,更像离线数据扩增器而非 policy |
| Qwen-RobotWorld | 语言条件视频世界模型 | [Qwen-RobotWorld](/wam/papers/qwen-robotworld) | 用 EWK 数据生成未来视觉轨迹,服务合成数据、评测和规划 |
| Supervise What Survives | 生成视频几何监督 | [Supervise What Survives](supervise-what-survives.md) | 只监督生成视频里可靠保留下来的几何信号,不硬造动作标签 |
| GE-Sim 2.0 | 动作条件神经仿真 | [GE-Sim 2.0](/wam/papers/ge-sim-2) | 更接近“给动作,预测未来帧”的闭环仿真器 |

## 五、数据清洗、配比、筛选与 scaling

这组论文不一定“发一个新数据集”,但决定数据能不能真正变成策略能力。

| 主题 | 站内位置 | 代表论文 / 方法 | 重点问题 |
|---|---|---|---|
| 清洗与失败标注 | [数据处理 §二](data-processing.md#二数据清洗与质量管控) | RoboMIND, AgiBot World | 技术伪影要删,语义失败要标注和分流 |
| 标定治理 | [数据处理 §2.6](data-processing.md#26-标定一致性治理与事后重标定droid) | DROID recalibration | 多相机外参漂移会污染 3D/几何学习 |
| 语言与子任务标注 | [数据处理 §三](data-processing.md#三标注与语言对齐) | VLM 自动标注 + 人工复核 | 指令、子目标、奖励和动作片段如何对齐 |
| 动作归一化与分词 | [数据处理 §四](data-processing.md#四动作处理-核心) | OXE, OpenVLA, π0, FAST | 先统一量纲与动作维度,再离散化或连续生成 |
| 伪标签生成 | [数据处理 §六](data-processing.md#六伪标签生成) | IDM, latent action, hand keypoints | 无动作视频如何获得可训练监督 |
| 数据配比 | [数据处理 §七](data-processing.md#七数据配比与采样) | n^0.43, Re-Mix | 多源数据怎么采样,避免大源压死小源 |
| scaling laws | [数据全景 §六](embodied-data.md#六数据配比与-scaling-规律) | Data Scaling Laws, GR00T scaling | 数据量、多样性、质量和本体覆盖如何共同决定收益 |
| 价值/质量筛选 | [World Value Models](/wam/papers/world-value-models) | World Value Models, Suboptimal-Value-Bench | 用世界模型理解任务进展,筛掉次优/失败/卡住轨迹 |
| 知识隔离 | [Knowledge Insulation](knowledge-insulation.md) | KI, co-training | 防止动作数据训练破坏 VLM 的互联网语义能力 |

## 六、基准与评测也属于数据问题

很多 benchmark 本身就是“数据集 + 协议”。读论文时要把训练数据、评测数据、协议口径分开。

| 基准 / 数据 | 类型 | 站内位置 | 最容易踩的坑 |
|---|---|---|---|
| SimplerEnv | real-to-sim 操作评测 | [评测基准 §一](benchmarks.md#一simplerenv) | Visual Matching 和 Variant Aggregation 口径不可混 |
| LIBERO | 终身学习 / 组合泛化 | [评测基准 §二](benchmarks.md#二libero) | 高分不等于真机泛化 |
| CALVIN | 长程链式语言操作 | [评测基准 §三](benchmarks.md#三calvin) | ABCD 划分、5-step 平均长度等口径要标清 |
| RoboCasa | 厨房仿真 / 合成数据 | [评测基准 §四](benchmarks.md#四robocasa本轮重点补齐) | 官方 300-task、30-demo、24-atomic、repo 25-task 四种口径不能横比 |
| RoboTwin | 双臂/多本体仿真 | [评测基准 §六](benchmarks.md#六双臂人形移动操作基准) | 1.0 / 2.0、仿真 / 真机挑战赛不是同一口径 |
| RoboArena | 真机众包双盲评测 | [评测基准 §七](benchmarks.md#七真机评测与竞技场) | 真机 ranking 依赖任务池、本体和统计协议 |
| DreamGen Bench / WorldModelBench | 世界模型视频评测 | [Qwen-RobotWorld](/wam/papers/qwen-robotworld) · [评测基准 §附](benchmarks.md#附世界模型--视频生成评测与-wam-调研线呼应) | 视觉生成分数不能直接当机器人成功率 |

## 七、当前缺口

本站已有“数据全景”和“数据处理”,但还可以继续补三类内容:

1. **单篇数据集细读**:DROID、AgiBot World、RoboMIND、OXE 都值得拆成独立细读页,现在主要集中在专题表格里。
2. **数据筛选方法细读**:DemInf、QoQ、CUPID、Re-Mix、Data Scaling Laws 还没有逐篇细读。
3. **合成数据可信度对照**:RoboDream、Qwen-RobotWorld、DreamGen、Supervise What Survives 可以进一步做“哪些监督可信”的横向表。

## 八、站内阅读顺序

1. 先读 [具身数据全景](embodied-data.md):建立数据来源地图。
2. 再读 [具身数据处理](data-processing.md):理解数据如何变成训练 batch。
3. 然后按本页分类跳到 [RoboDream](/wam/papers/robodream)、[Qwen-RobotWorld](/wam/papers/qwen-robotworld)、[Supervise What Survives](supervise-what-survives.md)、[World Value Models](/wam/papers/world-value-models)。
4. 最后读 [评测基准全景](benchmarks.md):检查这些数据是否真的带来可比的下游收益。
