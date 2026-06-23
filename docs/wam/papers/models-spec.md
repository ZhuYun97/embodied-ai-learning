---
title: WAM 全模型规格对比(29 篇横向)
description: 本站收录的 29 篇世界-行动模型(WAM)细读横向一览:机构、发布、范式、开源状态、未来预测形式、动作生成方式、主干与参数、训练数据、代表结果。所有格值取自各细读页,口径各异、禁止跨行比数值;⚠️ 自评 / ✅ 已核 / 待核 三级标注原样保留。
---

# WAM 全模型规格对比:29 篇细读横向一览

> **本页是什么**:把本站 WAM 全部 29 篇细读拍平成三张横向对比表——「档案」「技术规格」「代表结果」。每个格值都取自对应细读页(细读页本身经多源核查),2026-06-10 整理、2026-06-11 增补 5 行(WAV / MotuBrain / OA-WAM / RoboDream / HiMem-WAM),2026-06-18 增补 Qwen-RobotWorld;**绝大多数定量为提出方/厂商自评 ⚠️**。VLA 主线的同类页面见 [VLA 全模型规格对比](/vla/papers/models-spec)。

[![GPT-IMAGE2 生成的模型规格对比图:多模型卡片按主干、动作头、数据、频率、许可和本体形态横向排列](/figures/models-spec-cover-gpt-image2.jpg)](/figures/models-spec-cover-gpt-image2.jpg)

*读图方式:WAM 规格表先看范式、未来预测形式与动作生成方式,再看主干/参数/数据和代表结果;第三张结果表只作口径索引,不能横向比强弱。*

::: warning 读表铁律(先读这个)
1. **第三张表的数值不可横向比**。各家用的基准、任务、口径完全不同:WALL-WM 的 **Task Progress 是 0–100 连续分、不是成功率**;DreamZero 的「>2×」是对**自家选定基线**;Cosmos 3 的 RoboArena 名次**随时间变动**(本页为 2026-06 快照);τ0-WM 数值为论文作者自评(2026-06-11 已对照一手论文 2606.01027 校订,不再是媒体转述)。本表只回答「谁、什么范式、什么规格、开没开源」,不回答「谁更强」。
2. 标记体例:**⚠️ = 提出方自评**(非第三方复现)/ **✅ = 经核查** / **待核 = 一手源未给,本站不编造**(可开顶栏「可信度透镜」暗化存疑格)。
3. 「机构:待核」≠ 没有机构——不少 arXiv 摘要不署机构,本站不以外部检索硬填;个别页面标注了「据公开检索/项目页,待核」的,原样保留。
4. 行序 = 谱系图线序(范式)+ 线内时间,与首页路线卡、侧栏完全一致。
:::

## 一、档案:谁 · 何时 · 什么范式 · 开没开源

| 模型 | 范式(本站) | 机构 | 发布 · arXiv | 开源(代码/权重) |
|---|---|---|---|---|
| [UniPi](/wam/papers/unipi) | 级联·显式 | 待核(摘要未明列) | 2023-02 · 2302.00111 | 待核 |
| [Gen2Act](/wam/papers/gen2act) | 级联·显式 | 待核(摘要未明列) | 2024-09 · 2409.16283 | 待核 |
| [Veo-Act](/wam/papers/veo-act) | 级联·显式 | 清华大学 | 2026-04 · 2604.04502 | 未释放代码/权重 |
| [VPP](/wam/papers/vpp) | 级联·隐式 | 待核(页面未明列) | 2024-12 · 2412.14803 | 待核 |
| [LAPA](/wam/papers/lapa) | 级联·隐式 | 待核(摘要未明列) | 2024-10 · 2410.11758 | 待核 |
| [DexWorldModel](/wam/papers/dexworldmodel) | 级联·隐式 | DexForce AI | 2026-04 · 2604.16484 | 无代码/权重(论文 CC BY 4.0) |
| [GR-1](/wam/papers/gr-1) | 联合·自回归 | 待核(推断字节系,页面标待核) | 2023-12 · 2312.13139 | 待核 |
| [WorldVLA](/wam/papers/worldvla) | 联合·自回归 | 阿里达摩院 | 2025-06 · 2506.21539 | 代码开源(许可待核) |
| [RynnVLA-002](/wam/papers/rynnvla-002) | 联合·自回归 | 阿里达摩院 | 2025-11 · 2511.17502 | 代码+权重 Apache-2.0 全开 |
| [UWM](/wam/papers/uwm) | 联合·扩散 | 待核(摘要未明列) | 2025-04 · 2504.02792 | 待核 |
| [DreamZero](/wam/papers/dreamzero) | 联合·扩散 | 待核(36 作者,lead S. Ye) | 2026-02 · 2602.15922 | 待核 |
| [X-WAM](/wam/papers/x-wam) | 联合·扩散 | 待核(摘要未明列) | 2026-04 · 2604.26694 | 待核 |
| [LingBot-VA](/wam/papers/lingbot-va) | 联合·扩散 | 蚂蚁集团灵波 | 2026-01 · 2601.21998 | 代码开源(许可待核) |
| [τ0-WM](/wam/papers/tau0-wm) | 联合·扩散 | 智元 Finch/上海创智(罗剑岚团队) | 2026-06 · 2606.01027(v1 05-31) | 部分开源 ✅实查:VAM 权重+推理代码已放;ACVS 权重与 TTC 代码未放(称后续) |
| [GR00T N2](/wam/papers/groot-n2) | 联合·扩散 | NVIDIA | 待核(预览,未释出) | 未释出(称年底可用,待核) |
| [LaDi-WM](/wam/papers/ladi-wm) | 联合·扩散 | 国防科大/北大/深大系(据公开检索,待核) | 2025-05 · 2505.11528 | 待核 |
| [WALL-WM](/wam/papers/wall-wm) | 联合·扩散 | 自变量机器人(X Square) | 2026-06 · 2606.01955 | 代码/权重未放出(仓 CC BY-NC-ND) |
| [GigaWorld-Policy](/wam/papers/gigaworld-policy) | 联合·扩散 | GigaAI 极佳视界 | 2026-03 · 2603.17240 | 未释放(项目页 CC BY-NC-SA) |
| [WAV](/wam/papers/wav) | 联合·扩散 | 西湖大学 MiLAB(王东林组)·南大苏州 | 2026-04 · 2604.14732 | 部分 ✅实查:代码已放(Win-commit/WAV),权重未放、无 LICENSE |
| [MotuBrain](/wam/papers/motubrain) | 联合·扩散 | 生数科技·清华 TSAIL(署名 MotuBrain Team) | 2026-04 · 2604.27792 | 未开源 ✅实查(项目页 302 跳公司主页,无代码/权重) |
| [UVA](/wam/papers/uva) | 联合·混合 | Stanford(据项目页,待核) | 2025-03 · 2503.00200 | 待核(有项目页) |
| [FLARE](/wam/papers/flare) | 联合·混合 | NVIDIA GEAR 等 | 2025-05 · 2505.15659 | 待核 |
| [OA-WAM](/wam/papers/oa-wam) | 联合·混合 | 清华深圳 TBSI(丁文伯)·上交·NTU | 2026-05 · 2605.06481 | 待核(文称已放 ckpt 与训练脚本,全文无链接、GitHub 检索无果) |
| [HiMem-WAM](/wam/papers/himem-wam) | 联合·混合 | 港大 × INFIFORCE × 华中科大等(6 机构 15 作者) | 2026-06 · 2606.10363(v1 06-09,观察级) | 未见开源 ✅实查(全文与摘要页均无代码/项目页链接) |
| [Cosmos 3](/wam/papers/cosmos3) | 跨范式·基座 | NVIDIA Research | 2026-06 · 2606.02800 | OpenMDW-1.1 开源(可商用)✅ |
| [Qwen-RobotWorld](/wam/papers/qwen-robotworld) | 跨范式·基座/数据引擎 | 阿里巴巴 Qwen 团队 | 2026-06 · 2606.17030 | 官方博客公开;代码/权重待核 |
| [Genie Envisioner](/wam/papers/genie-envisioner) | 跨范式·平台 | 智元 AgiBot | 2025-08 · 2508.05635 | 代码开源(许可待核) |
| [GE-Sim 2.0](/wam/papers/ge-sim-2) | 跨范式·仿真 | 智元·北航·LV-NUS·天大 | 2026-05 · 2605.27491 | 待核(仅项目页) |
| [RoboDream](/wam/papers/robodream) | 跨范式·数据引擎 | 丰田研究院 TRI · USC | 2026-06 · 2606.02577 | 未开源 ✅实查(repo 仅占位 README,"code release coming soon") |

## 二、技术规格:预测什么 · 怎么出动作 · 多大 · 吃什么数据

WAM 的两条核心轴是「**未来预测的形式/空间**」(像素视频 / 潜表征 / 离散 token / 多模态)与「**动作如何从预测中产生**」(逆动力学抽取 / 联合去噪 / 同词表自回归 / 测试时搜索)。

| 模型 | 未来预测(形式/空间) | 动作生成 | 主干 / 参数 | 训练数据 |
|---|---|---|---|---|
| [UniPi](/wam/papers/unipi) | 像素未来帧(文生视频) | 逆动力学从相邻帧抽动作 | 待核 | 互联网视频+语言嵌入;规模待核 |
| [Gen2Act](/wam/papers/gen2act) | 人类视频(零样本生成) | 策略以生成视频为条件 | 待核 | 机器人数据比视频少一个量级 ⚠️ |
| [Veo-Act](/wam/papers/veo-act) | 像素未来帧(Veo-3 生成) | 多头逆动力学 + π0.5 执行 | Veo-3(闭源)规划;IDM 用 DINOv3 | IDM:30万仿真+10万随机+15万真机帧对 |
| [VPP](/wam/papers/vpp) | VDM 预测性视觉表征(潜空间) | 隐式逆动力学(条件于预测表征) | 预训练视频基础模型微调;参数待核 | 机器人+互联网人类操作;规模待核 |
| [LAPA](/wam/papers/lapa) | 离散潜动作(刻画帧间变化) | 微调把潜动作解码为真实动作 | latent VLA;参数待核 | 互联网级无动作视频+机器人微调 |
| [DexWorldModel](/wam/papers/dexworldmodel) | 未来 DINOv3 潜特征(不回像素) | 动作流匹配解码动作块(τ=16) | MoT,自 Wan2.2-5B 初始化 | RoboMind+AgiBot+InternData-A1;合成后训练 |
| [GR-1](/wam/papers/gr-1) | 未来图像帧(自回归) | 独立动作头(与视觉解耦) | GPT 式因果 Transformer;~195M(据综述,待核) | 视频生成式预训练+机器人微调 |
| [WorldVLA](/wam/papers/worldvla) | 未来图像(统一离散词表) | 同词表自回归+注意力掩码 | Chameleon 基 MLLM;约 7B(据综述) | 待核 |
| [RynnVLA-002](/wam/papers/rynnvla-002) | 下一帧图像(65,536 统一词表) | 离散动作 token + 连续动作头 | Chameleon 基自回归;基座参数待核 | 真机自采约 500 条示范 + LIBERO |
| [UWM](/wam/papers/uwm) | 像素视频(2D) | 视频+动作统一扩散联合去噪 | 统一 transformer;参数待核 | 多任务机器人数据+无动作视频 |
| [DreamZero](/wam/papers/dreamzero) | 未来视频帧(显式) | 视频-动作同序列联合去噪 | Wan2.1 基;14B 自回归视频扩散 ⚠️ | 异构机器人数据;规模待核 |
| [X-WAM](/wam/papers/x-wam) | 多视角 RGB-D 视频(4D) | 异步去噪 ANS:动作少步快解 | 预训练视频扩散 DiT;参数待核 | >5,800 小时机器人数据 ⚠️ |
| [LingBot-VA](/wam/papers/lingbot-va) | 近未来视频帧 | 交错自回归(MoT 共享潜空间) | MoT;参数待核 | 待核 |
| [τ0-WM](/wam/papers/tau0-wm) | 多视角未来潜变量(联合流匹配) | 测试时搜索(升级式):RCS 初筛→不可靠才 ACVS 推演+LAR 修正 | 5.5B(5B Wan2.2 视频 DiT + 0.5B 动作分支) | 27,300h(真机17.8K+UMI6.5K+人类3K+rollout/失败轨迹) |
| [GR00T N2](/wam/papers/groot-n2) | 潜空间目标转移表征 | Joint Video-Action DiT | 待核(预览未释出) | 大规模视频预训练;待核 |
| [LaDi-WM](/wam/papers/ladi-wm) | VFM 对齐潜表征演化(DINO+CLIP) | 扩散策略+预测态迭代精炼 | 潜扩散+VFM;参数待核 | 待核 |
| [WALL-WM](/wam/papers/wall-wm) | 多视角未来视频(事件锚定) | 动作 DiT(单向跨注意力+流匹配) | Wan2.2-5B 塔+动作 DiT+冻结 Qwen3.5-9B | 多本体+无本体+少样本锚定;总规模待核 |
| [GigaWorld-Policy](/wam/papers/gigaworld-policy) | 未来视频(动作中心,推理可关) | 流匹配 ODE;推理跳过视频分支 | Wan 2.2 DiT;5B | ~10,000 小时人类 ego+真机 ⚠️ |
| [WAV](/wam/papers/wav) | 多视角未来视频潜轨迹 + 轨迹价值(回报作 flow 生成目标) | 流匹配动作块;推理时潜噪声空间 MPPI 式迭代(K≈3)收敛后一次解码 | 2.2B ⚠️;DiT + 冻结 T5-XXL,README 实查依赖 GE-Base-fast + LTX-Video 组件 | 无自述大规模预训练(承 GE-Base 底座);LIBERO 微调 + 真机 Piper 自采 |
| [MotuBrain](/wam/papers/motubrain) | 视频流(UniDiffuser 统一调度两路连续模态) | 三流 MoT(text/video/action),中段 50% 层 V-A 联合注意,flow matching | 视频基座为生数 Vidu;参数量未公布(待核) | 四级数据金字塔(互联网视频→ego→异构本体→目标本体);绝对规模未公布(待核) |
| [UVA](/wam/papers/uva) | 视频-动作联合潜表征 | 动作扩散头(推理跳过视频头) | Transformer+VAE(kl-f16);参数待核 | 每任务约 500 条真机轨迹 |
| [FLARE](/wam/papers/flare) | 未来观测潜表征(不重建像素) | 动作流匹配+潜表征对齐损失 | 流匹配 DiT;参数待核 | 机器人示范+人类 ego 视频 |
| [OA-WAM](/wam/papers/oa-wam) | 逐对象槽位状态回归(N+1 槽,addr 32d + cnt 256d,MSE;非像素/视频 token) | 流匹配动作头(16 步动作块,4 步 Euler) | ~7B Chameleon 风格主干(暖启 Chameleon-7B) | 三阶段全仿真/开源:Stage0 ~2.5T token(web 60% + OXE 20% + DROID/RoboCasa/Bridge),~166k A100-h |
| [HiMem-WAM](/wam/papers/himem-wam) | 多视角光流潜动作(DPFlow,仅训练期监督;推理因果、不生成未来) | 分层潜动作链:Qwen3-VL planner 出 skill latent → executor 展开低层动作块 → 解码器出控制 | planner = Qwen3-VL-4B;总参数待核 | 待核(以细读页为准) |
| [Cosmos 3](/wam/papers/cosmos3) | 五模态生成(视频/图/音/动作) | 生成塔直出 JSON 动作 token | MoT 两塔;Nano 16B / Super 64B ⚠️ | ~20T 多模态 token ⚠️(动作仅约 0.6%) |
| [Qwen-RobotWorld](/wam/papers/qwen-robotworld) | 语言条件未来视频轨迹(操作/驾驶/导航/人机迁移) | 非直接策略;自然语言作 action interface,生成未来视觉用于数据/评测/规划 | 冻结 Qwen2.5-VL 7B action encoder + Wan-VAE 127M + MMDiT 20B | EWK:8.6M video-text pairs / 200M+ frames;20+ embodiments / 500+ action categories ⚠️ |
| [Genie Envisioner](/wam/papers/genie-envisioner) | 指令条件视频(结构化潜空间) | GE-Act 流匹配解码出动作 | GE-Base 视频扩散底座;参数待核 | ~3,000h / >100 万 episodes ⚠️ |
| [GE-Sim 2.0](/wam/papers/ge-sim-2) | 多视角未来画面+16 维本体状态 | 不直接出动作(闭环模拟器) | Cosmos-Predict2-2B 基;2B | 数千小时真机(重训)⚠️ |
| [RoboDream](/wam/papers/robodream) | 多视角 photorealistic RGB 演示视频(机器人运动作渲染锚点,条件化场景/对象先验) | 非策略:数据合成引擎(下游统一 Diffusion Policy 另训) | Cosmos-Predict2 2B 微调 | DROID ~40k episodes(限有相机标定);2×8 A100 约一周 |

## 三、代表结果:各家口径,**禁止跨行比数值**

| 模型 | 主要评测 | 头条结果(原页口径) |
|---|---|---|
| [UniPi](/wam/papers/unipi) | 待核(摘要未给基准) | 摘要未给任何定量(待核) |
| [Gen2Act](/wam/papers/gen2act) | 真实世界多场景(自建) | 零样本操作未见物体/新动作(定性 ⚠️) |
| [Veo-Act](/wam/papers/veo-act) | 仿真+真机灵巧手(基线 π0.5/VPP) | 仿真 0.50→0.80、真机 0.25→0.79 ⚠️ |
| [VPP](/wam/papers/vpp) | CALVIN ABC-D + 真机 | CALVIN 相对 SOTA +18.6%、真机灵巧 +31.6% ⚠️ |
| [LAPA](/wam/papers/lapa) | 真实世界操作(未具名) | 超 SOTA VLA(定性)⚠️;数值待核 |
| [DexWorldModel](/wam/papers/dexworldmodel) | RoboTwin(50 任务)+ 真机零样本 | RoboTwin 94.00% ⚠️;零样本超真机微调基线 |
| [GR-1](/wam/papers/gr-1) | CALVIN | 标准 94.9%(基线 88.9%)、零样本 85.4% ⚠️ |
| [WorldVLA](/wam/papers/worldvla) | LIBERO | 优于独立动作/世界模型(定性 ⚠️;数值待核) |
| [RynnVLA-002](/wam/papers/rynnvla-002) | LIBERO + 真机 SO100 | LIBERO 均 97.4% ⚠️;真机去世界模型 80→30 ⚠️ |
| [UWM](/wam/papers/uwm) | 待核 | 更泛化更鲁棒(定性 ⚠️,无数值) |
| [DreamZero](/wam/papers/dreamzero) | 真机新任务/新环境(自选基线) | 较 SOTA VLA >2×;14B @7Hz 闭环 ⚠️ |
| [X-WAM](/wam/papers/x-wam) | RoboCasa / RoboTwin 2.0 | 79.2% / 90.7% 平均成功率 ⚠️ |
| [LingBot-VA](/wam/papers/lingbot-va) | RoboTwin 2.0-Plus(第三方研究) | 原文无定量;第三方报 74.2% ⚠️ |
| [τ0-WM](/wam/papers/tau0-wm) | 四项自建长程任务(Toolbox/School Bag/Faucet/Badminton,基线 π0.5/Fast-WAM) | 自评平均最高(Fig.4 图形,逐任务数值论文未列);TTC 消融(单次尝试)均值 0.43→0.60、Pen→Box 0.30→0.50 ⚠️ |
| [GR00T N2](/wam/papers/groot-n2) | MolmoSpaces / RoboArena | 称较领先 VLA 高 2×、两榜第一 ⚠️(预览,不可复核) |
| [LaDi-WM](/wam/papers/ladi-wm) | LIBERO-LONG + 真机 | LIBERO-LONG +27.9%、真机 +20% ⚠️ |
| [WALL-WM](/wam/papers/wall-wm) | 真机自建四套件 | Task Progress(0–100,非成功率)事件模式全胜 ⚠️ |
| [GigaWorld-Policy](/wam/papers/gigaworld-policy) | RoboTwin 2.0 + AgileX 真机 | 较 Motus ≈9× 加速、成功率 0.83 ⚠️ |
| [WAV](/wam/papers/wav) | LIBERO 四套件(单模型)+ 真机 Piper 三任务 | LIBERO 均值 98.1 ⚠️(99.6/100.0/98.6/94.4,本站逐格核对口径自洽);真机较 GE-ACT 35.6%→75.6% ⚠️ |
| [MotuBrain](/wam/papers/motubrain) | RoboTwin 2.0 + WorldArena | RoboTwin clean/randomized 95.8/96.1 ⚠️(自评榜首;π0.5 82.7/76.8);WorldArena EWMScore 63.77 ⚠️ |
| [UVA](/wam/papers/uva) | PushT/Libero10 + 真机 UMI | Libero10 0.93、PushT 0.98;推理 0.23s(UniPi 24.07s)⚠️ |
| [FLARE](/wam/papers/flare) | RoboCasa(24)+ GR-1 tabletop(24) | 多任务 SOTA、较基线最多约 +26% ⚠️ |
| [OA-WAM](/wam/papers/oa-wam) | LIBERO + SimplerEnv WidowX + LIBERO-Plus(OOD 留出) | LIBERO 均值 97.8 ⚠️(较 VLA-JEPA +0.6);SimplerEnv 79.3 ⚠️;LIBERO-Plus 几何轴自评 SOTA |
| [HiMem-WAM](/wam/papers/himem-wam) | LIBERO + LIBERO-PLUS(零样本)+ RMBench + 真机 | LIBERO 97.7 ⚠️;LIBERO-PLUS 76.0 ⚠️;RMBench 26.3 ⚠️;真机硬任务较 π0.5 +22.5% ⚠️(v1 仅 2 天,观察级) |
| [Cosmos 3](/wam/papers/cosmos3) | RoboArena | 发布登顶(1881),约 2 天后被 Spirit v1.6(1924)反超 ⚠️(2026-06 快照) |
| [Qwen-RobotWorld](/wam/papers/qwen-robotworld) | EWMBench / DreamGen / WorldModelBench / PBench | EWMBench 4.60、DreamGen 4.952、WorldModelBench 8.99、PBench 0.804 ⚠️(视频世界模型 benchmark,非策略成功率) |
| [Genie Envisioner](/wam/papers/genie-envisioner) | 待核(无统一第三方评测) | GE-Act 200ms 出 54 步轨迹;新本体 1h 示范 ⚠️ |
| [GE-Sim 2.0](/wam/papers/ge-sim-2) | WorldArena | 2B 登顶(称超 Sora/Veo)⚠️;过滤式 BC 真机 +15pp ⚠️ |
| [RoboDream](/wam/papers/robodream) | 自建 4 真机任务(Franka/DROID;部分成功计半分) | Real-50 36.3% → 混合生成数据 62.5%,Mix-200 72.5% 后饱和 ⚠️;prop-free 采集 ~2.2× 快 ⚠️ |

## 四、几条跨行观察(只谈格局,不比数值)

- **基座收敛**:2026 年的新一批(DexWorldModel / WALL-WM / GigaWorld-Policy / DreamZero)不约而同地从 **Wan 系视频生成模型**初始化——视频生成基座正在成为 WAM 的「公共底盘」;NVIDIA 系则自带 Cosmos 底座(GE-Sim 2.0、RoboDream 均基于 Cosmos-Predict2)。但 2026-04 之后的新批显示底盘在**多元化**:MotuBrain 用生数 Vidu、WAV 实查依赖 GE-Base/LTX-Video——「Wan 一统」并未发生。
- **「像素 vs 潜空间」分野贯穿三类范式**:像素派(UniPi / UWM / DreamZero / WALL-WM)赌「看得见的未来」带来可解释与数据引擎能力;潜空间派(VPP / LAPA / LaDi-WM / FLARE / DexWorldModel / GR00T N2)赌实时性与表征效率——后者在 2025H2 起明显增多。
- **推理期把世界模型「关掉」成为新趋势**:GigaWorld-Policy(因果掩码,可跳视频分支)、UVA(推理跳过视频头)、RynnVLA-002(解耦查询,作策略时不 roll out 未来帧)殊途同归——训练期联合、推理期轻装。
- **开源谱系两极**:Apache-2.0 全开(RynnVLA-002)与 OpenMDW 可商用(Cosmos 3)在一端;多数处于「代码开源但许可待核」或「论文先行、权重未放」之间;真正第三方可复核的评测在本表中几乎缺位——这正是 WAM 相比 VLA(有 RoboChallenge / LIBERO 公共基准传统)更年轻的标志。

---

> 📌 配套阅读:[WAM 总览(定义 / taxonomy)](/wam/) · [VLA 全模型规格对比](/vla/papers/models-spec)(姊妹页)· [评测基准全景](/vla/papers/benchmarks) · 谱系图见 [WAM 总览](/wam/) 开头(按时间轴)。各格出处 = 对应细读页;发布年月 = arXiv ID 前四位派生(无 ID 者按站内核对口径标注)。
