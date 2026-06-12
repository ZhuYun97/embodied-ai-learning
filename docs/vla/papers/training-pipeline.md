---
description: 一个具身/VLA 模型从 VLM 初始化到上机要走完的多阶段流水线:阶段0 VLM 预训练→1 机器人数据预训练→2 协同训练(网络+跨本体)→3 后训练对齐→4 真机 RL 经验→5 蒸馏部署,串联本站 13 篇训练相关已核事实,只讲训练一侧的数据、目标函数与配方取舍。
title: 具身模型训练全流程
---

# 具身模型训练全流程:从预训练到部署

> **定位**:本篇是《VLA 发展深度调研报告》「具身基础」专题,聚焦「训练」一侧——一个具身/VLA 模型从初始化到上机,要经过哪些阶段、各阶段用什么数据与什么训练目标、配方上的关键取舍。模型架构本身见各细读,数据来源见 [具身数据全景](embodied-data)。
> **方法**:综合本站 13 篇训练相关页的已核事实串联而成,不引入未经本站核查的新数字。
> **可信度标注**:⚠️=提出方自评未独立复现;✅=经核查确认;待核=一手未给。

## 摘要

一句话主线:**具身模型训练不是「拿数据 fit 一个网络」,而是一条把「互联网语义广度 → 真机动作精度 → 廉价规模放大 → 分布外鲁棒性」逐层叠上去的多阶段流水线**——先用网络视觉-语言数据撑起语义先验,再用跨本体机器人数据把动作能力灌进去,用协同训练防止前者被后者冲刷,最后用目标本体后训练和真机 RL 经验把模仿学习的上限顶破。各阶段的分歧点高度集中在三件事上:**动作怎么表示(离散 token vs 连续流匹配)、异构本体怎么对齐(跨本体归一化)、不同来源数据怎么配比(co-training 权重)**。

<div class="pipe" aria-label="具身模型训练六阶段">
<a class="pipe__step" data-tone="slate" href="#一、训练全景-多阶段流水线"><i>0</i><strong>VLM 预训练初始化</strong><span>互联网图文先验</span></a>
<span class="pipe__arr">→</span>
<a class="pipe__step" data-tone="cyan" href="#二、训练目标函数-离散-连续-混合"><i>1</i><strong>机器人数据预训练</strong><span>动作能力注入</span></a>
<span class="pipe__arr">→</span>
<a class="pipe__step" data-tone="blue" href="#三、协同训练与数据配比"><i>2</i><strong>协同训练</strong><span>网络数据 + 跨本体</span></a>
<span class="pipe__arr">→</span>
<a class="pipe__step" data-tone="violet" href="#五、后训练与对齐"><i>3</i><strong>后训练</strong><span>目标本体对齐</span></a>
<span class="pipe__arr">→</span>
<a class="pipe__step" data-tone="rose" href="#六、第四阶段-真机-rl-与经验"><i>4</i><strong>真机 RL 经验</strong><span>RECAP / SimpleVLA-RL</span></a>
<span class="pipe__arr">→</span>
<a class="pipe__step" data-tone="emerald" href="#七、蒸馏与部署"><i>5</i><strong>蒸馏与部署</strong><span>连续专家高频上机</span></a>
</div>
<p class="eb-legend">示意(自绘,逻辑分解);点击各阶段跳到本页对应章节——阶段 0/1 的数据与目标函数展开在 §一/§二。</p>

需要先说清楚:这条「阶段0→5」是**逻辑分解而非每个模型都全走一遍**。多数模型只走其中几段——OpenVLA/Octo 基本止于阶段1~2,π0 走到 0~3,π0.5 把 0~3 压成两阶段配方,π\*0.6 才真正用上阶段4,蒸馏/高频部署(阶段5)在不同模型里是训练技法(知识隔离)或推理工程(实时动作分块),并非独立训练阶段。下文逐段拆解。

## 一、训练全景:多阶段流水线

下表把六个阶段的目标、数据、目标函数、代表工作与产出拉成一条线。**代表工作列只标该阶段最具代表性的做法,不代表该模型只做这一段。**

| 阶段 | 目标 | 主要数据源 | 训练目标函数 | 代表工作 | 产出 |
|---|---|---|---|---|---|
| **0 VLM 预训练初始化** | 注入互联网级语义常识、防遗忘(动作信号为无,纯语义先验) | 底层网络视觉-语言数据(VQA/caption/定位) | 标准 VLM 自回归 next-token | 几乎所有现代 VLA 复用现成 VLM:[openvla](openvla) 用 Prismatic-7B、[pi0](pi0) 用 PaliGemma、[pi06](pi06) 用 Gemma3-4B+SigLIP-400M | 带开放世界语义的 VLM 主干 |
| **1 机器人数据预训练** | 把动作能力灌进 VLM,得到「广泛但不精专」的底座 | 真机遥操作 + 跨本体公开数据(OXE/Bridge/DROID) | 离散动作 token next-token 或连续流匹配/扩散 | [openvla](openvla) OXE 970k、[octo](octo) OXE 800k、[pi0](pi0) 预训练 700k 步 | 通用 VLA 底座 |
| **2 协同训练** | 防遗忘 + 跨本体正迁移:动作数据与网络/跨本体数据混批共训 | 真机 + 网络 VL + 跨本体 + 人类视频/仿真(详见 [embodied-data](embodied-data) §六) | 多源同目标混合(配比按权重) | [rt2](rt2) co-fine-tune、[pi05](pi05) 六类数据、[groot-n1](groot-n1) 跨金字塔采样 | 保住语义且能跨本体的策略 |
| **3 后训练(目标本体对齐)** | 专门化到具体下游任务/目标本体 | 高质量、精挑的小到中等目标域数据 | 同预训练目标(常加连续动作专家) | [pi0](pi0) 后训练微调、[pi05](pi05) 后训练 α=10、[knowledge-insulation](knowledge-insulation) 配方 | 上机可用的专用策略 |
| **4 真机 RL 与经验** | 突破模仿分布上限,定向移除失败模式 | on-policy 自主采集经验(带成功/失败奖励)+ 专家干预纠正 | 优势条件化 / GRPO 等 RL | [pi06](pi06) RECAP、[simplevla-rl](simplevla-rl) | 分布外更鲁棒、吞吐更高的策略 |
| **5 蒸馏与部署** | 训练用稳定信号、推理用高频连续控制 | (复用前述,不引入新数据源) | 训练侧离散监督 + 部署侧连续专家 | [knowledge-insulation](knowledge-insulation) 训离散推连续、[inference-deployment](inference-deployment) | 高频可上机模型 |

一条贯穿全表的主线(出自 [embodied-data](embodied-data)):**四层数据分工——真机撑动作精度、网络撑语义广度、人类视频/仿真撑规模多样性、RL 经验撑分布外鲁棒性**;自底向上数据量递减、本体特异性递增、动作信号从无到有、单位成本递增。

## 二、训练目标函数:离散 / 连续 / 混合

「动作怎么表示」直接决定训练目标函数,是各模型最根上的分歧。本站把它分为三路。

**(A)离散动作 token(next-token 交叉熵)。** 把动作当文本 token 进 VLM 词表,用原生自回归语言建模损失,只在动作 token 段上算 loss。
- **256-bin 均匀离散**:[rt2](rt2) 把除终止维外的 7 个连续维各均匀切 256 bin,一个动作 = 8 个整数 token;[openvla](openvla) 改用每维 1%/99% 分位数端点再均匀切分(而非 min-max),收益是忽略离群动作保住有效范围精度 ⚠️。**辟谣**:RT-2 用的就是最朴素的 256-bin 均匀离散,**没有** DCT+BPE——那是 [pi0-fast](pi0-fast)/FAST tokenizer 的做法,与 RT-2 无关 ✅。
- **FAST(DCT+BPE)**:对动作块做 1%/99% 分位归一化→[-1,1]→每维独立 DCT 转频域→量化丢高频得稀疏矩阵→展平后 BPE(默认词表 1024)压成稠密 token。FAST 对比朴素 256-bin(1 秒块)压缩比随频率上升:BridgeV2(5Hz)1.75×、DROID(15Hz)3.6×、Table Bussing(20Hz)5.0×、T-Shirt Folding(50Hz)13.2× ✅,**低频数据收益有限**。

**(B)连续(扩散 / 流匹配)。** 不离散化,动作专家独立于 VLM 主干直接在连续空间生成动作块。
- **DDPM 扩散**:[octo](octo) 用条件去噪扩散建模连续多模态动作分布,对真实动作加噪、训去噪网络 ε_θ 预测所加噪声做 MSE;Transformer 主干每次只前向一次,多步去噪都发生在很小的扩散头内部 ✅。
- **条件流匹配**:[pi0](pi0) 直接对 p(A_t|o_t) 建模,加噪走线性插值/最优传输直线路径 A_t^τ=τ·A_t+(1−τ)·ε,回归速度场 v_θ 去匹配 u=ε−A_t(MSE),推理用前向欧拉积分(取 10 步)。[groot-n1](groot-n1) 同款流匹配(损失 L_fm=E‖V_θ−(ε−A_t)‖²),推理 K=4 步即可良好工作。两者都用偏置 Beta 分布采流时间步(Beta((s−τ)/s;1.5,1),s=0.999),把算力多投到高噪声困难区段——[pi0](pi0) 论证「给定观测预测均值动作比预测均值图像更难」⚠️。

**(C)混合(离散监督 + 连续生成并存)。** 同一模型里两套动作表示共存,训练用离散给主干稳定信号、推理用连续拿高频。这是 [pi05](pi05) 与 [knowledge-insulation](knowledge-insulation) 的核心:
- [pi05](pi05) 两阶段共享同一组合损失(原文 Eq.1):第一项是文本 + FAST 离散动作 token 的交叉熵,第二项是 action expert 的流匹配损失,α 是权衡系数;预训练 α=0、后训练 α=10.0,**两阶段本质区别就是 α 取值不同**。论文用注意力掩码确保两种动作表示彼此不互相 attend。
- 离散与连续各有代价:[pi0-fast](pi0-fast) 自评比扩散 π0 少 5× GPU 训练时、收敛少 3× 步数,但推理约 750ms/块(自回归,4090)vs 约 100ms(流匹配)✅。这正是混合路线想两头通吃的动机。

## 三、协同训练与数据配比

协同训练(co-training)是阶段2的核心动作:**把机器人动作数据与网络/跨本体数据混进同一批次共训**,而非先预训再单独微调。数据配比的全景与 scaling law 见 [embodied-data](embodied-data) §六,这里只串训练侧关键事实。

**为什么必须 co-train(防遗忘)。** [rt2](rt2) 把机器人轨迹与互联网 VQA/caption 混入同一批次共同训练,通过逐步提高机器人数据采样权重平衡配比;消融显示**只在机器人数据上微调会遗忘网络预训练学到的抽象视觉概念**,co-fine-tune 是泛化与涌现能力(符号理解/推理/人物识别)的关键来源 ⚠️,RT-2-X 相对 RT-2 在 emergent skill 泛化上约 +50% ⚠️。

**配比不是越多越好,而是有结构。** [pi05](pi05) 用六类异构数据 co-train(MM 移动操作 / ME 多环境静态 / CE 跨本体含 OXE / HL 高层子任务 / WD 网络数据 / VI 口头指令),其消融结论很关键:
- 去掉 CE 或 ME 都显著降低性能,**两者都去损害最严重**(跨本体/多环境是泛化支柱,退化百分点待核)⚠️;
- 去掉 WD(网络数据)对**分布内任务影响不显著,但严重损害对未见物体(OOD)的语言理解与泛化** ⚠️。

**配比可以自动优化,人工配方往往不是最优。** Re-Mix 用分布鲁棒优化(group DRO)把 OXE 的 11 个 RT-X 域各当一个 domain,自动学权重,自评平均超过均匀权重 38%、超过人工专家配比 32% ⚠️。[pi0](pi0) 则按每个 task-robot 组合样本数 n 以 n^0.43 子线性重加权(压低过采样组合如叠衣服、抬高长尾),0.43 是 PI 经验值、无理论推导、未做敏感性消融 ✅;正是 n^0.43 把大体量开源数据压到 9.1% 有效份额(自有 90.9%)✅,配方与该组成强耦合。

**高仿真比例 co-train。** 真机稀缺时,Sim-and-Real Co-Training(MIT)自评 sim 占比约 0.99 往往最优、平均提升 37.9%,每任务仅 10 条真机演示即达 78–87% ⚠️;[groot-n1](groot-n1) 后训练以 1:1 把真机轨迹与合成神经轨迹混合 ⚠️。

## 四、跨本体归一化:协同训练的技术前提

跨本体 co-train 有个绕不开的前提:**异构本体共用一个模型,必须先统一动作空间,否则分位数跨本体无意义、负迁移**。本站把主流做法归为三套(机制性描述,均为中性事实):

- **OXE/RT-X(7D 粗对齐)**:统一映射成 7 维(x,y,z,roll,pitch,yaw,gripper)相对末端执行器动作空间;**归一化先于离散化**,去归一化按本体解释,保证 256-bin 跨本体语义一致。代价是只做粗对齐——不统一坐标系、不强制 absolute/relative/velocity 语义一致,这是跨数据集负迁移根因之一,且 7-DoF 无法表达灵巧手多指/双臂/移动底盘 ⚠️。
- **π0/π0.5(分位数归一化 + 零填充)**:[pi0](pi0) 按各数据集每维 1%/99% 分位数线性映射到 [-1,1](非 min/max,抗离群),state/action 零填充到最大本体维度(π0=18,即两条 6-DoF 臂 + 2 夹爪 + 移动底盘 + 升降躯干)。[-1,1] 与流匹配/扩散噪声尺度匹配。代价:零填充引入恒为 0 的死维浪费容量,分位裁剪截断真实极值(快速抛掷/猛拉)对动态任务有损 ⚠️。
- **GR00T(相对增量 + 每本体 MLP)**:[groot-n1](groot-n1) 动作 = 相对当前位姿增量(delta 而非绝对关节角);状态侧末端旋转用 6D 表示、动作侧用轴角;对每个本体配一个 MLP 把不同维度 state/action 投影到共享 embedding 维度。NVIDIA 自评「相对动作是跨本体关键」⚠️,但状态用 6D/动作用轴角的非对称选择缺充分对照实验。

此外,**无动作视频也要先归一化进同一空间**才能并入 co-train:[groot-n1](groot-n1)/LAPA 用 VQ-VAE 在相邻帧间学离散潜动作码本,把无动作视频与机器人动作统一到同一潜动作空间(详见第六节相关内容与 [data-processing](data-processing))。

工程红线(出自 [data-processing](data-processing)):**改 action_horizon/delta_indices 后必须重算 norm_stats**;[pi0](pi0)/openpi 训练前必须先跑 compute_norm_stats.py 生成含 q01/q99/std 的 norm_stats.json 与 checkpoint 一起存,否则极少使用维度的 q01/q99 过小会导致归一化后 state/action 爆炸。

## 五、后训练与对齐

阶段3把「广泛但不精专」的底座专门化到目标本体/任务。[pi0](pi0) 的两阶段配方是范式:预训练(700k 步)用大而杂混合数据得到能跟随语言的底座,**后训练/微调用高质量、精挑的小到中等数据**适配叠衣服、收桌等具体任务。[pi05](pi05) 把这一步压进同一组合损失:后训练阶段 α=10.0,在预训练好的离散 VLA 上**新增一个随机初始化的 action expert**,联合做 next-token 与流匹配,约 80k 步,并额外加入口头指令 VI、去掉跨本体 CE 以聚焦移动操作。

**[知识隔离 KI](knowledge-insulation) 是这一步的关键配方进化。** 它不是新模型,而是一套训练配方,解决「给预训练 VLM 主干外挂连续动作专家(流匹配/扩散)会损害主干语义知识、拖慢训练」的问题。核心三件套:
1. **梯度隔离(stop-gradient)**:动作专家只读取主干特征(前向信息照常流动),但梯度不回传进主干预训练权重——注意力概率分解为主干→主干(正常梯度)、动作→主干(键经 stop-gradient,前向可读、梯度为 0)、动作→动作(正常梯度);
2. **主干用 FAST 离散动作 token 做 next-token**,给主干一个稳定、不依赖随机初始化专家的训练信号;
3. **网络数据 co-training**:主干联合训练机器人动作(FAST 离散)+ 通用图文 VL + 带语言标注的机器人规划数据。

因为梯度被隔离,流匹配损失权重 α 可直接取 1(无需小心调小);总损失 = 语言/离散 token 预测损失 + α × 流匹配损失。诊断动机很清楚:动作专家初始化随机,早期大而嘈杂的动作梯度会冲刷掉主干预训练学到的视觉-语言知识,表现为语言跟随变差、新物体泛化退化、训练变慢。KI 自评:相对 π0 训练步数效率约 7.5×、推理保持 10 Hz(对比 π0-FAST 自回归约 1.3 Hz),LIBERO-90 达 96.0%、DROID 0.55±0.09 vs π0 0.49±0.09,均为作者自跑 ⚠️。消融要点(均 ⚠️):去掉梯度隔离→主干知识被污染、泛化掉点;去掉离散 token 监督→训练变慢;去掉网络数据 co-train→新物体泛化明显下降(贡献最大)。**这套配方后来成为 [pi06](pi06)/π\*0.6 与 [pi07](pi07) 的标配。**

架构侧如何选择「梯度是否回传主干」是一条横切线索(见 [dual-system-architecture](dual-system-architecture)):[groot-n1](groot-n1) N1 是端到端联合优化、梯度回传主干;[pi0](pi0) 动作 token 走独立专家权重、同一前向联合训练、梯度端到端回传;而 [pi06](pi06)/[pi07](pi07) 用 KI 的 stop-gradient 在梯度维度切断动作专家回流——**这是 KI 的定义性特征**。

## 六、第四阶段:真机 RL 与经验

模仿学习的上限是演示分布。要顶破它,需要引入第四类数据——**on-policy 自主采集经验**。本站有两条代表路径。

**RECAP([pi06](pi06) / π\*0.6,Physical Intelligence)。** 方法名全称 RL with Experience and Corrections via Advantage-conditioned Policies,在 π0.6 基座上额外增加对二值化优势值的条件能力。它把三类异构数据融进一个自我改进循环:① 人类遥操作示范 + ② on-policy 自主采集(带成功/失败奖励标签)+ ③ 专家遥操作干预纠正。每轮迭代三步——数据采集、价值函数训练、优势条件训练:
- **分布式价值函数**:用到目前为止全部数据,训一个大型、多任务、语言条件的分布式价值函数,能检测失败并预测到完成还需多少步,价值归一化到 (-1,0)、0 表示成功;价值函数由一个独立、更小的预训练 VLM 初始化(SigLIP-400M + Gemma-270M + value head)。
- **优势条件萃取**:优势按 A(o,a)=r_{t:t+N}+V(o_{t+N})−V(o_t) 估计,经二值化塞进 VLA 前缀作为条件,推理时把该指标置为最优即可从含次优数据的混合数据中萃取更优策略。[data-processing](data-processing) 给出更细的工程口径:回报离散到 B=201 个 value bin 交叉熵拟合,每任务阈值设为约 30% 演示数据为正优势,专家干预期间动作强制标为正优势(假设专家纠正总是好动作),推理固定喂 Advantage: positive ✅。
- **为何不用策略梯度**:RECAP 用 advantage-conditioning(类 Decision-Transformer)而非策略梯度,把好/坏动作都用上、不丢弃失败数据,训练稳定、可复用模仿学习管线;论文论证直接拟合 off-policy Q 函数对大模型 + 真机异构数据既不稳定也难扩展 ⚠️。
- **自评增益**:在最难真实任务(叠多样衣物、组装纸箱、专业咖啡机做意式浓缩)上,π\*0.6 相对模仿基线吞吐量翻倍以上(>2×)、失败率约减半(~50%),增益集中于最难任务,可用相对少量数据定向移除特定失败模式 ⚠️。具体数字 [data-processing](data-processing) 有照录:叠衣吞吐 ~20→~60 次/小时、组装纸箱 ~60%→~95%、意式咖啡 ~40%→>90% ⚠️,均无第三方复现。

**SimpleVLA-RL(在线 RL 微调)。** 见 [simplevla-rl](simplevla-rl):标准「采样—评估—更新」在线 RL 闭环,只用 outcome-level 0/1 规则奖励(成功=1/失败=0,直接从仿真成功判定读出,不训奖励模型),优化器用 GRPO(组内相对优势做 PPO 式裁剪,省掉 value/critic 网络),基座为 OpenVLA-OFT(自回归 VLA,LLaMA2-7B 主干)。稳定化技巧:去掉 KL 正则、采用非对称裁剪 clip-higher(ε_low=0.2、ε_high=0.28)鼓励探索。两条关键认知:
- **冷启动假设**:RL 作用是「把基座本就具备的微弱能力放大」,每任务只给 1 条示范做冷启动 SFT 再 RL,就能逼近满数据 SFT 水平 ⚠️;
- **RL 不能无中生有**:若基座对任务初始成功率约 0%,RL 几乎得不到正奖励、提升≈0——SimpleVLA-RL 是「放大器」而非「冷启动器」(中性事实)。

突破模仿上限的直接证据是 **pushcut 现象**:RL 会「发明」示范里没有的解法,如「移动罐子」任务示范是「抓取—移动—放置」,RL 学到直接「把罐子推到目标位」的 push-driven shortcut ⚠️。自评数字(均 ⚠️、单团队复现):LIBERO-Long 86.5→98.5、RoboTwin 1.0 OpenVLA-OFT 39.8→70.4、真机 4 任务 17.5→38.5(作者称约相对 +120%)。**对 π0/π0.5 等扩散式 VLA 的适配仅在代码 roadmap 中、论文正文证据较少(待核)。**

## 七、蒸馏与部署

严格意义的「知识蒸馏」本站训练相关页着墨很少——[knowledge-insulation](knowledge-insulation)、[pi06](pi06)、[simplevla-rl](simplevla-rl) 等均**无独立的模型蒸馏/量化部署训练细节**(SimpleVLA-RL 的「不需要价值网络蒸馏」是算法选择而非模型蒸馏)。因此本节落点是与「上机高频」直接相关的训练—部署衔接,数字不足处标待核,完整部署对比见 [inference-deployment](inference-deployment)。

**训练用离散、部署用连续。** 这是混合路线(第二节 C)的部署逻辑:[knowledge-insulation](knowledge-insulation) 训练时用 FAST 离散 token 给主干稳定监督,推理时用连续动作专家拿高频(保持 10 Hz);动机正是纯 π0-FAST 式离散自回归推理慢(逐 token,约 1.3 Hz)。[pi07](pi07) 进一步用 real-time action chunking(RTC),训练时模拟 0–12 timestep 延迟,对应最大推理延迟约 240ms(社区报道最坏约 127ms,口径不同,待核)。

**量化部署。** [openvla](openvla) 给出可核实口径:bfloat16 加载推理需约 15–16.8 GB 显存、RTX 4090 上约 6 Hz;4-bit(int4)量化可把显存降到 7.0 GB,Bridge 成功率 71.9%(int4)与 bfloat16 的 71.3% 基本持平 ⚠️;LoRA 微调(rank=32,所有线性层)仅训约 1.4% 参数即可基本匹配全量微调(Franka-Tabletop 68.2% vs 69.7%)⚠️,单卡约 60 GB(全量需多卡 FSDP 与 160+ GB)。

**云端部署作为退路。** [rt2](rt2) 因 55B 主干无法直接跑桌面/车载 GPU,改为部署在多 TPU 云、机器人通过网络远程查询(可并发多台);实测 RT-2-PaLI-X-55B 约 1–3 Hz、5B 约 5 Hz;作者把量化、蒸馏列为未来方向(中性事实)。这正说明「蒸馏/部署」在 RT-2 时代还是未解问题,而 KI/RTC/量化是后续给出的不同答案。

## 八、代表模型训练配方速查

横比七个代表模型的训练配方(初始化 / 预训练数据 / 动作表示·目标函数 / 后训练·RL),带互链与可信度标记。

| 模型 | 初始化 | 预训练数据 | 动作表示 / 目标函数 | 后训练 / RL |
|---|---|---|---|---|
| **[rt2](rt2)** | PaLI-X(5B/55B)/ PaLM-E(12B) | 网络 VQA/图文 + 机器人轨迹 co-fine-tune | 256-bin 均匀离散,8 整数 token,next-token 交叉熵(**非** DCT+BPE ✅) | 无独立后训练;co-fine-tune 即训练范式;消融称 co-fine-tune 显著优于纯机器人微调 ⚠️ |
| **[openvla](openvla)** | Prismatic-7B VLM(SigLIP+DINOv2,7B Llama2) | OXE 970k 真机演示,沿用 Octo 混合权重,DROID 末 1/3 阶段移除 | 7 维各 256-bin、1%/99% 分位端点切分;仅动作 token 算交叉熵;微调视觉编码器关键 ⚠️ | LoRA(rank=32,~1.4% 参数)≈ 全量微调 ⚠️;int4 量化 7.0 GB 持平 ⚠️ |
| **[octo](octo)** | 从零(语言用 t5-base 编码,浅卷积 patch stem) | OXE 800k 子集(25 个数据集精选);夹爪对齐 +1 张开/0 闭合,缺相机零填充 | 条件去噪扩散(DDPM),预测动作块;实测优于 MSE 回归与离散 token ✅ | 可组合微调:约 100 条目标域轨迹/50k 步,主干预训练权重整体保留 |
| **[pi0](pi0)** | PaliGemma(SigLIP-So400m + Gemma 2B,~3B)+ 从零 ~300M 动作专家 | 自有 ~10k 小时(903M timesteps)+ 开源 9.1%(OXE/Bridge/DROID);n^0.43 重加权 ✅ | 条件流匹配,H=50 动作块,10 步欧拉积分;1%/99% 分位归一化 + 零填充到 18 维 | 两阶段:预训练 700k 步→后训练微调到叠衣/收桌等下游任务 ⚠️(自评结果) |
| **[pi05](pi05)** | 标准 web VLM 初始化 | 六类异构 co-train(MM/ME/CE/HL/WD/VI);约 100 个家庭环境/约 400 小时移动操作 | 组合损失 Eq.1:FAST 离散交叉熵 + 流匹配;**预训练 α=0(~280k 步)→后训练 α=10(~80k 步)** | 后训练新增随机初始化 action expert,加 VI、去 CE,专门化到家庭移动操作;消融 CE/ME 是泛化支柱 ⚠️ |
| **[pi06](pi06) / π\*0.6** | Gemma3-4B + SigLIP-400M;动作专家 ~860M | π0.5 六类数据 + 追加多机器人平台数据 | 流匹配(连续)+ FAST(离散)双输出,用 [KI](knowledge-insulation) 配方(stop-gradient + 离散监督 + 网络 co-train) | **RECAP 真机 RL**:示范 + on-policy 经验 + 专家干预,分布式价值函数 + 二值优势条件;最难任务吞吐 >2×、失败率约减半 ⚠️ |
| **[groot-n1](groot-n1) N1** | Eagle-2 VLM(SmolLM2 + SigLIP-2);GR00T-N1-2B ~2.2B(VLM ~1.34B) | 跨整座金字塔 co-train;真机 GR-1 ~88h + 神经轨迹 ~827h(~10×)+ DexMimicGen 仿真 + 7 个人类第一视角视频集 | 流匹配(velocity prediction),H=16,K=4 步;相对末端增量,每本体一 MLP,min-max 归一化;端到端联合优化、梯度回传 | 后训练真机:合成神经轨迹 1:1 co-train;跨本体迁移 Unitree G1(N1.5)1000 条遥操作 ⚠️;无 RL、无蒸馏内容 |

> 注:GR00T 演进中 N1.5 改为**冻结 Eagle VLM**(VLM 不再随动作头微调),换来语言指令跟随大涨与更稳语义泛化(中性事实)——与 π0 系「动作专家梯度是否污染主干」是同一问题的不同答案。

## 九、缺口与待核

诚实列出本站训练相关页**未覆盖或一手未给**的训练细节:

- **真正的「知识蒸馏」几乎是空白**。本站训练页里 [knowledge-insulation](knowledge-insulation)/[pi06](pi06)/[pi07](pi07)/[simplevla-rl](simplevla-rl) 均无 teacher-student 蒸馏、无量化感知训练(QAT)细节;阶段5 目前只能靠「训离散推连续 + RTC + 事后 int4 量化」拼出,缺独立蒸馏训练事实。
- **π0.5 消融的具体退化百分点待核**:CE/ME/WD/VI 去除后「显著退化」「逼近作弊上界」均为定性,绝对数字一手未给(本站标待核)。
- **π0.6 / π\*0.6 / KI 的训练数据、价值函数与模型权重均未开源**,RECAP 的 B=201、30% 阈值、C_fail、纠正样本占比等为作者设计/未全公开。
- **真机 RL 的第三方复现缺失**:RECAP 与 SimpleVLA-RL 的全部增益均为单团队自评;SimpleVLA-RL 对扩散式 VLA(π0/π0.5)的适配仅在 roadmap、正文证据少;0/1 稀疏奖励在更长程/更开放任务上的可扩展性待核。
- **推理延迟口径冲突**:[pi07](pi07) RTC 最坏延迟原文 240ms vs 社区 127ms,未调和(待核)。
- **跨本体 scaling law 的外推性存疑**:Lu et al. 2024《Data Scaling Laws》幂律来自单论文 4 任务/单臂 Franka,外推到多本体/人形/长程任务未必成立,属任务特定 scaling law ⚠️。
- **总训练步数/总数据量/学习率等数值**在多数模型(尤其 [pi06](pi06)/[pi07](pi07))一手未显式给出,本站未编造。

## 来源

本篇综合自本站以下训练相关细读页(及各页已列的一手 arXiv,详见对应页「来源」节):

- [embodied-data](embodied-data) — 四层数据金字塔、§六协同训练与配比、跨本体归一化、scaling law、第四层 RECAP
- [data-processing](data-processing) — 动作处理固定管线、分词四路线、归一化、伪标签、配比采样、RECAP 优势条件化工程口径
- [knowledge-insulation](knowledge-insulation) — KI 三件套配方、stop-gradient、单阶段统一训练
- [dual-system-architecture](dual-system-architecture) — 梯度是否回传主干、端到端联合训练 vs 知识隔离
- [openvla](openvla) — OXE 970k 预训练、256-bin 分位离散、LoRA、int4 量化
- [octo](octo) — OXE 800k、DDPM 扩散动作头、可组合微调
- [rt2](rt2) — 256-bin 离散、symbol tuning、co-fine-tune、TPU 云部署、DCT 辟谣
- [pi0](pi0) — 两阶段配方、条件流匹配、动作专家、18 维归一化零填充、n^0.43
- [pi05](pi05) — 两阶段 α 配方、组合损失 Eq.1、六类数据消融、分层推理
- [pi06](pi06) — π0.6 基座、KI 配方、RECAP 真机 RL、分布式价值函数与优势条件
- [pi07](pi07) — π0.6-MEM 基线、四模态富上下文、混合质量数据、RTC、world model 子目标
- [groot-n1](groot-n1) — 双系统端到端联合训练、流匹配、跨本体 MLP、神经轨迹 co-train、Unitree G1 迁移
- [simplevla-rl](simplevla-rl) — 在线 RL(0/1 奖励 + GRPO)、冷启动、去 KL/clip-higher、pushcut

延伸:[inference-deployment](inference-deployment)(部署与推理性能横比)、[benchmarks](benchmarks)(评测口径)、[glossary](glossary)(术语)、[models-spec](models-spec)/[codebases](codebases)(模型规格与代码库索引)。
