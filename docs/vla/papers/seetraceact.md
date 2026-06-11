---
title: SeeTraceAct 细读:可见性感知的潜在轨迹规划,从跨本体示范视频学 one-shot demo-conditioned VLA(Georgia Tech / AI2 / JHU / UW)
description: SeeTraceAct(arXiv 2606.02745,Georgia Tech × Allen Institute for AI × Johns Hopkins × UW)是一种 one-shot demo-conditioned VLA——策略以单段(可跨本体,如人类)示范视频为条件完成未见任务。它在 GR00T N1.5 基座上加一个 visibility-aware 的未来末端执行器视觉迹线(end-effector trace)预测辅助目标:把示范编码进 visual latent plan(See),训练期解码出各相机视角的未来 trace 及其可见性(Trace),推理期丢弃 trace decoder、直接从 latent plan 出动作(Act);validity head 解决末端离开视野时坐标 ill-posed 的监督难题。提出并(声明)开源 RoboCasa-DC 基准(RoboCasa 的 demo-conditioned 扩展,含 GR-1 人形配对视频)。自评 ⚠️:RoboCasa-DC 四设定全部最优、真实世界平均成功率 +12.5pp(37.5%→50.0%)。
---

# SeeTraceAct 细读

> **VLA 论文细读** · 新范式探索(可见性感知潜在轨迹规划) · GT/AI2/JHU/UW
> [← 主报告](/vla/) · [WAM 总览](/wam/)

> 署名提示(✅ 2026-06-11 实查 arXiv v1):本文署名机构为 **Georgia Institute of Technology / Allen Institute for AI(AI2)/ Johns Hopkins University / University of Washington**。**Dieter Fox** 在本文署名 **AI2 + UW**(非 NVIDIA),**Jaemin Cho** 署名 **AI2 + JHU**,**Zsolt Kira** 署名 **Georgia Tech**。NVIDIA 仅以两种身份出现——其一是基座 **GR00T N1.5** 出自 NVIDIA(文献 [25]),其二是致谢中的 **NVIDIA Academic Grant Program** 资助——**均非本文署名机构**,本页不将本工作归于 NVIDIA。

## TL;DR

SeeTraceAct 是一种 **one-shot demo-conditioned VLA**:不靠为新任务采集昂贵的遥操作数据,而是让策略**以单段示范视频为条件**完成一个未见任务,且该示范**可来自不同本体**(cross-embodiment,例如人类用手演示一次)。论文的诊断是:已有端到端 demo-conditioned 方法(Vid2Robot / UniSkill / ViVLA)在**需要精确定位小目标区域**的 precision-sensitive 任务(按咖啡机按钮、开关水龙头)上常失手。SeeTraceAct 的处方是给策略加一个**可见性感知的未来末端执行器视觉迹线(visibility-aware future end-effector trace)预测**辅助目标——名字即流程:**See**(把示范+当前视图+指令编码进一个 *visual latent plan*)→ **Trace**(训练期从 latent plan 解码出各相机视角下的未来 2D 迹线及其**可见性**)→ **Act**(从 latent plan 出动作);**trace decoder 只在训练期用,推理期丢弃**。关键设计 *validity head*:末端执行器可能离开某个视角、其图像坐标变成 ill-posed 的回归目标,validity head 预测"该点是否在画面内",让离屏点仍提供学习信号而不污染表征。基座为 **GR00T N1.5**(VLM + flow-matching action expert),示范视频用 **V-JEPA 2** 编码并经 **Perceiver Resampler** 压成 32 个 video tokens。论文还提出并(声明)开源 **RoboCasa-DC** 基准——RoboCasa 的 demo-conditioned 扩展,带逐 episode 配对的 **GR-1 人形**示范视频做跨本体代理。自评 ⚠️(预印本,未经第三方复现):RoboCasa-DC **四个设定全部成功率最优**;真实世界(Franka Panda,人类示范条件)平均成功率 **37.5% → 50.0%(+12.5pp)**。**开源状态(✅ 2026-06-11 实查):GitHub 仓库已建但为占位 README("Code and data will be updated soon"),代码、RoboCasa-DC 基准数据与权重均尚未实际放出。**

## 一、定位与动机

VLA 把预训练 VLM 改造成机器人策略很有前景,但**部署到新任务通常要先用遥操作采专家轨迹做 post-training**——这需要专用硬件与大量人工,是 VLA 跨任务/本体/环境扩展的核心瓶颈。一条可扩展的替代路线是:**让终端用户对着相机把任务演示一次**,策略就以这段单次示范为条件去执行。这就是 **one-shot demo-conditioned VLA**。难点在于 **cross-embodiment gap**:人手与机械臂形态不同,直接把人类示范"翻译"成机器人动作本就困难。

已有路线分两支:(1) 显式 kinematic retargeting(OKAMI / DITTO / DemoDiffusion 等)——能做显式跨本体迁移,但需要超出终端用户能力的本体/任务专门工程;(2) 端到端、直接以示范为条件(XSkill / UniSkill / Vid2Robot / ViVLA)。SeeTraceAct **选端到端这一支**,并指出其通病:在"成功与否取决于精确定位一小块交互区域"的任务上表现脆弱。它的核心主张是——**用一个可见性感知的视觉迹线辅助目标,逼策略学会精确的空间 grounding**,而不是只把示范当成一个模糊的"任务向量"。

在本站谱系里,SeeTraceAct 属于 **VLA 主线·新范式探索**:它不改 action head 的基本范式(仍是连续动作块 + flow matching),而是**在表征层引入一个"中间空间计划"**(visual latent plan + 显式 trace 监督),用更结构化的辅助监督换取从一次(跨本体)示范中提炼可执行运动的能力。

## 二、方法与架构(据论文 §3、附录 B)

**基座**:SeeTraceAct 构建在 **GR00T N1.5**([25],NVIDIA 开源基座)之上——一个 **VLM + flow-matching action expert** 的结构;在其上增补三件东西:**video encoding 模块、形成 visual latent plan 的 learnable query tokens、以及 trace decoder**。(论文未给出 SeeTraceAct 的总参数量——**待核**;仅说明基座为 GR00T N1.5。)

**问题设定(§3.1)**:训练期对每个 seen task 有若干元组 `(ξ, D, l)`——`ξ` 是策略本体的专家轨迹(含相机视图 `o`、机器人状态 `q`、动作 `a`),`D` 是**可能来自不同本体**的任务匹配示范视频,`l` 是语言指令。评测期对 unseen task 只给单段示范 `D` 与指令 `l`,策略在每步预测一个动作块 `A_t = {a_t, …, a_{t+H-1}}`。

**Video tokens(§3.2)**:示范 `D` 先用 **V-JEPA 2**([2],在含 action-centric 数据 Something-Something、Kinetics 的大规模视频上自监督预训练)编码;再叠一个 **Perceiver Resampler**,把特征**从 8,192 压到 32 个 video tokens**(64 帧 ×256×256,3D patch 2×16×16 → 8192,见附录 B),拼到 VLM 的图文 token 序列后面。因果注意力下,video tokens 能 attend 到图文 token,使示范表征**随上下文变化**而非整段固定。

**Visual latent plan(§3.2)**:在输入 token 之后再追加**一组可学习 query tokens**(数量与未来迹线点数一致,**N=5**),它们在因果注意力下 attend 到图、文、视频 token,其最终 hidden states 即 **visual latent plan `z_t`**——一个被训练去编码"未来任务推进"的潜表征,用来 condition 动作生成。

**Visibility-aware trace decoder(§3.2、§3.3)**——本文的命门:从 `z_t` 解码出每个静态相机视角下的**未来末端执行器 2D 迹线**,两个 head:
- **regression head**:回归归一化的末端执行器 2D 图像坐标;
- **validity head**:用 BCE 预测每个迹点**是否落在画面内**。多视角下末端可能离开某视角,坐标变成 ill-posed 目标;validity head 让**离屏点仍提供监督**(masked regression,只对 `m=1` 的点算 L1),避免强行回归无意义坐标损害表征。
- 该 decoder **训练期才用,推理期丢弃**。

**训练目标(§3.3)**:总损失 = 动作预测损失(flow-matching velocity 回归,`L_act`)+ λ_trace × 视觉迹线损失;后者 = masked L1 回归损失 `L_reg` + λ_valid × validity BCE 损失 `L_valid`。超参(附录 B 表 4):**λ_valid=1.0,λ_trace=0.2,N=5 个未来迹点,temporal stride Δ=5**;action horizon **H=16**,推理 **K=4** 步 Euler 去噪。迹线标签由把末端执行器位置**投影进各静态相机视角**自动生成(仿真用模拟真值,真机沿 RT-Trajectory/HAMSTER 做法从轨迹投影)。

**推理(§3.3)**:VLM 处理当前视图+指令+示范得到 `ϕ_t, ψ_t, z_t`;action expert 从这些表征 + 状态 `q_t` + 噪声动作出发,经 4 步 flow-matching 去噪出动作块。**trace 这条支路完全不参与推理**——它的作用是"训练期把 latent plan 塑形成空间上可定位的计划"。

## 三、实验与关键结果

> ⚠️ **本节所有数字均为作者自评**(单一预印本、未经第三方复现);RoboCasa-DC 与真机基准均为本文自建/自评。下表数字一律视作 ⚠️。

**评测设置**:① **RoboCasa-DC**(仿真):24 个厨房操作任务、7-DoF Panda 臂、3 路相机(2 静态 + 1 腕部);两种 split,各留 5 个 unseen 任务、19 个训练——*category-balanced split*(CloseDrawer / TurnOffSinkFaucet / OpenDoubleDoor / CoffeeServeMug / PnPCounterToMicrowave)与 *precision-sensitive split*(TurnOffStove / CoffeePressButton / TurnOffSinkFaucet / PnPCounterToSink / PnPStoveToCounter);各 split 又分 **same-embodiment**(Panda 示范)与 **cross-embodiment**(GR-1 人形示范,作人类视频代理)。② **真机基准**:Franka Panda + 平行夹爪,第三人称外置相机 + 腕部相机;4 个 seen 任务各 150 对(Franka 轨迹 + 匹配的**人类**示范视频),4 个 unseen 任务各测 10 次。**基线**:Vid2Robot、UniSkill、ViVLA,**全部在同一 GR00T N1.5 基座上重实现**以求公平。

| 结果 | 数值(作者自评 ⚠️) | 出处 |
|---|---|---|
| RoboCasa-DC · category-balanced(Same-emb / Cross-emb) | SeeTraceAct **23.0% / 11.6%**;最强基线 Vid2Robot 21.5% / UniSkill 11.2% | 论文 Table 1 |
| RoboCasa-DC · precision-sensitive(Same-emb / Cross-emb) | SeeTraceAct **14.1% / 12.8%**;最强基线 Vid2Robot 12.6% / ViVLA 8.4% | 论文 Table 1 |
| 四设定全胜 | SeeTraceAct 在**全部 4 个设定**成功率最高;最大优势出现在 precision-sensitive × cross-embodiment(12.8% vs 8.4%,+4.4pp) | 论文 Table 1、§5.2 |
| precision vs category 优势对比 | 对最强基线的平均领先:category-balanced **+1.0pp** → precision-sensitive **+3.0pp** | 论文 §5.3 |
| 真机(4 unseen,各 10 次) | 平均成功率 **37.5% → 50.0%(+12.5pp)**(对最强基线) | 论文 §5.2、Fig. 5(摘要"+12.5pp"出处即此) |
| 24 任务全训(same-emb,50 seed/任务) | 平均:Vid2Robot 49.9 / UniSkill 42.1 / ViVLA 54.7 / **SeeTraceAct 54.8**(最高) | 论文 Table 5 |
| TIR 相关性(精度敏感度) | 任务的 target interaction ratio(TIR,目标交互区占画面比)与 SeeTraceAct 增益**负相关**:vs Vid2Robot ρ=−0.80(p<1e-5)、UniSkill ρ=−0.45(p<0.05)、ViVLA ρ=−0.52(p<0.01),vs 各任务最强基线 ρ=−0.63(p<1e-3) | 论文 §5.3、Table 5 |

**消融(Table 2,cross-embodiment,category-balanced 与 precision-sensitive 两 split 平均 ⚠️)**:

| 配置 | 成功率(⚠️) |
|---|---|
| GR00T N1.5 基座(无示范) | 9.0% |
| SeeTraceAct w/o trace supervision | 9.4% |
| SeeTraceAct w/o validity head | **8.2%(降幅最大)** |
| SeeTraceAct w/o action-aware video encoder(V-JEPA 2 → SigLIP) | 9.2% |
| SeeTraceAct w/ 3D trace supervision(替代 2D) | 10.4% |
| **SeeTraceAct(完整)** | **12.2%** |

消融的几条结论(作者自述):(1)**光把示范喂进去不够**——去掉 trace 监督就掉回 9.4%,几乎等于无示范的 9.0%,说明"显式监督模型如何用视觉迹线 ground 示范"才是增益来源;(2)**validity head 最关键**——去掉后掉到 8.2%(低于无 trace 监督),印证"强迫回归离屏的 ill-defined 坐标会损害表征";(3)**2D 迹线优于 3D**——3D trace 监督(10.4%)虽好于其它消融但仍不及图像空间 2D 监督(12.2%),作者解释为 2D 信号与模型的视觉输入空间更匹配。

## 四、与本站谱系的关系

- **跨本体视频学动作**:与 [Gen2Act](/wam/papers/gen2act) 同走"**用人类/跨本体视频**为机器人提供任务指引"的思路;区别在 Gen2Act 经由"生成人类操作视频→再导出动作"的中间视频生成,SeeTraceAct 则**不生成未来视频帧**,而是把示范压成 visual latent plan,并用**末端执行器 2D 迹线 + 可见性**作为更轻、更聚焦于空间 grounding 的中间监督。
- **潜动作 vs 潜在轨迹规划**:与 [LAPA](/wam/papers/lapa) 形成清晰对照——LAPA 学的是从视频自监督得到的 **latent action**(潜动作 token),本文的 ViVLA 基线正是用开源 LAPA 表征作 latent action;SeeTraceAct 的 visual latent plan **不预测潜动作 token,而是预测可见性感知的未来视觉迹线**,把"中间抽象"从动作空间挪到了图像/空间定位空间。消融中 SeeTraceAct(12.2%)优于同基座的 ViVLA,作者据此论证"视觉迹线监督比潜动作预测更利于精确空间 grounding"⚠️。
- **中间表征再 act**:与 [ECoT](/vla/papers/ecot) 同属"先产出一个中间表征、再据此出动作"的家族——ECoT 用**语言链式推理**(embodied chain-of-thought)作中间步,SeeTraceAct 用**视觉迹线/视觉潜在计划**作中间步;两者都把"显式中间结构"当作提升可靠性的杠杆,但模态不同(语言 vs 空间迹线)。论文自身则把 visual latent plan 的思想溯到 ThinkAct/FastThinkAct(均为非本站页面,此处不另链)。

## 五、局限与存疑

- **真机评测面窄(论文自陈)**:真实世界仅在**桌面单臂**(Franka)4 个 unseen 任务、各 10 次上验证,跨本体/跨环境/跨任务的更广评测留作 future work。
- **依赖未来迹线标签(论文自陈)**:辅助目标假设训练期可拿到未来 trace 标签;论文称可用 motion tracker 或 foundation model 获取(如 LLARVA/TraceVLA/ThinkAct/MolmoAct/RT-Trajectory 的做法),但这本身是额外前提。
- **绝对成功率偏低(论文自陈)**:RoboCasa-DC 上即便最优,绝对成功率仍很低(cross-embodiment 多在 10%+ 量级),作者明确承认 demo-conditioned 机器人学习"仍有很大改进空间"。
- **全部为作者自评 ⚠️**:无第三方复现;基线 Vid2Robot/ViVLA 因无官方实现而由作者**重实现**于同一基座,UniSkill 用其官方 ISD 模块——基线强度依赖作者的重实现质量。
- **开源声明 vs 实查不符(✅ 2026-06-11 实查)**:论文摘要与 §4 称"introduce and **release** RoboCasa-DC"、并给出 GitHub 链接,但实查 `github.com/jaehyeon-son/SeeTraceAct` **仅含一个占位 README**("This repository will host the code and benchmark data… Code and data will be updated soon"),仓库 size 0 KB、无 license、1 star、最近 push 2026-05-31——**代码、RoboCasa-DC 基准数据、权重均尚未实际放出**,目前**不可复现**。
- **参数量待核**:论文未给出 SeeTraceAct(或其 GR00T N1.5 基座)的具体参数量——**待核**,本页不以外部记忆补全。
- **主结果部分以图呈现**:真机逐任务成功率在 Fig. 5 以柱状图给出,本页只录文字明示的平均值(37.5%→50.0%),遵循"不读图取数"。

## 参考文献

- 一手论文:arXiv:[2606.02745](https://arxiv.org/abs/2606.02745) *SeeTraceAct: Visibility-Aware Latent Planning from Cross-Embodiment Demonstration Videos*(v1,2026-06-01,[cs.RO])。作者 Jaehyeon Son、Junhyun Kim、Kyle Kam、Jeremiah Coholich、Seok Joon Kim、Jinhoo Kim、Chris Dongjoo Kim、Jaemin Cho、Dieter Fox、Zsolt Kira;署名机构 **Georgia Institute of Technology / Allen Institute for AI / Johns Hopkins University / University of Washington**。HTML 全文:https://arxiv.org/html/2606.02745 。
- 代码/基准:GitHub `jaehyeon-son/SeeTraceAct`(✅ 2026-06-11 实查:**仅占位 README,"Code and data will be updated soon",代码/RoboCasa-DC 数据/权重均未放出**;无 license,1 star)。论文未提供独立项目主页。
- 基座与关键依赖:**GR00T N1/N1.5**(NVIDIA,arXiv 2503.14734,[25]);**V-JEPA 2**(arXiv 2506.09985,[2]);**RoboCasa**(RSS 2024,[23],RoboCasa-DC 的母环境);π₀(arXiv 2410.24164,[3])。
- 对比基线:Vid2Robot(RSS 2024,[14])、UniSkill(CoRL 2025,[17])、ViVLA(*See once, then act*,arXiv 2512.07582,[6]);ViVLA 重实现中用到开源 **LAPA**(*Latent Action Pretraining from Videos*,ICLR 2025,[30])。
- 致谢资助:NSF Grant No. 2239292、**NVIDIA Academic Grant Program**(资助方,非署名机构)。

> 体例声明:✅ 为本站实查(arXiv v1 解析、GitHub 放出状态实测);⚠️ 为作者自评(单一预印本,未经第三方复现);**待核** 表示一手源未给出、不以外部记忆或常识补全。本页对照一手论文 arXiv:2606.02745v1 逐节核对;数值以论文 Table 1/2/5、§5.2–5.4 为准。
