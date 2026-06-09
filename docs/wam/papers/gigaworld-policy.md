---
title: GigaWorld-Policy 细读:动作中心、推理期可关掉视频的高效世界-动作模型
description: 细读 GigaWorld-Policy(arXiv:2603.17240,GigaAI):把 WAM 做成「动作中心」——训练时联合预测动作 + 生成未来视频,用因果掩码让动作 token 读不到未来帧,于是推理时可直接关掉视频生成;在 AgileX 真机比 Motus 约快 9× 而成功率更高。基座为 5B Wan 2.2 流匹配 DiT。
---

# GigaWorld-Policy 细读

> **WAM 论文细读** · 联合 · 扩散(动作中心:流匹配联合「动作 + 未来视频」,推理期视频可选)· arXiv:[2603.17240](https://arxiv.org/abs/2603.17240)(v1 2026-03-18,v2 03-21)
> **机构**:GigaAI(极佳视界)· 项目页 [gigaai-research.github.io/GigaWorld-Policy](https://gigaai-research.github.io/GigaWorld-Policy/)(CC BY-NC-SA 4.0;未见代码/权重链接)
> [← WAM 总览](/wam/) · [主报告](/vla/)

## TL;DR

GigaWorld-Policy 的一句话主张:**把世界-动作模型(WAM)从「视频中心」改成「动作中心」**。多数 WAM(如 [WorldVLA](/wam/papers/worldvla)、[UWM](/wam/papers/uwm))推理时要先迭代去噪生成未来视频、再据此出动作——既慢,又让动作精度被视频质量绑架。GigaWorld-Policy 反过来:**训练时**联合优化两件事——以当前观测预测未来动作序列、并以「预测出的动作」为条件生成未来视频;但用一个**因果注意力掩码**强制让动作 token **只读观测/状态、读不到未来视频 token**。于是**推理时可以把视频分支整支关掉**,只跑动作的 ODE 积分:单次推理 360ms(对比 Motus 3231ms,≈ 9×,A100),真机平均成功率反而更高。

基座是 **5B 的 Wan 2.2 扩散 Transformer(流匹配)**,动作块长 48、未来帧步长 Δ=12(即预测 K=4 帧),动作与视频两个流匹配损失加权(λ_action=5、λ_video=1)联合训练。

> ⚠️ **可信度提示**:arXiv ID ✅ 已核(标题、作者「GigaAI」、项目页一致)。下列**全部成功率 / 速度 / 数据效率数字均为作者论文自评**(RoboTwin 2.0 自跑 + 单臂真机 20 trials/任务),非独立第三方复现;RoboTwin 为公开基准但成绩由作者自测。本站按 ⚠️ 标注,不当既成事实。

## 一、定位与动机

WAM 用预训练视频生成模型作底座学策略,潜力已被反复验证,但作者指出两个真实瓶颈:

1. **推理开销大**:联合推断「未来视觉动态 + 对应动作」要跑迭代扩散采样,延迟高;
2. **表征纠缠**:视频与动作表征耦合,导致**动作精度强依赖未来视频的预测质量**,长程上像素级误差还会累积。

GigaWorld-Policy 的回答:**让动作成为中心、让视频成为可选的训练辅助信号**——用视频生成在训练期给动作注入「物理可行性」约束,但在部署期把这条贵的链路摘掉。

## 二、方法与架构

### 2.1 动作中心的联合训练

训练同时优化两支:**(i)** 由当前观测预测未来动作序列;**(ii)** 以「预测出的动作」+ 当前观测为条件,生成未来视频。两支都用**流匹配**目标,合并损失 `ℒ = λ_video·ℒ_video + λ_action·ℒ_action`(λ_action=5、λ_video=1)。视频监督相当于给动作一个「视觉动力学」约束,鼓励物理上说得通的动作。

### 2.2 因果掩码:让动作读不到未来视频(关键)

自注意力按角色分块掩码(论文 Fig.4):状态/观测 token 互相可见;**动作 token 可读 {状态, 观测},但不可读未来视频 token**;未来视频 token 才读 {状态, 观测, 动作}。这条单向约束**杜绝了「未来帧信息泄漏进动作生成」**——也正是「推理期可关掉视频」的前提:动作本来就没依赖视频分支。

### 2.3 基座与 token 化

- **基座**:5B Wan 2.2 扩散 Transformer(flow matching)。
- **输入**:多视角 RGB(左/前/右合成一张大图)+ 本体状态/动作经线性投影成 token + 语言走预训练编码器 + 交叉注意力。
- **token 化**:视觉用 VAE 编码成时空 token(2D 网格位置编码);动作/状态用 1D 时序位置编码。动作块长 48,未来观测步长 Δ=12。

### 2.4 推理:摘掉视频、只积分动作

动作初始化 `a⁽⁰⁾~𝒩(0,I)`,沿学到的速度场从 s=0 积分到 s=1 即得动作——**完全跳过视频 token**,这就是 ≈9× 加速的来源;若需要,视频分支可经 KV cache 复用、按需开启。

## 三、实验与关键结果

> 下列均为作者自评 ⚠️。

- **RoboTwin 2.0(50 任务,2,500 干净 + 25,000 随机化示范)**:均值 π0.5 0.43 / X-VLA 0.73 / Motus 0.89 / **GigaWorld 0.87**。即:仿真均值与 Motus **基本持平(略低)、但快约 9×**;论文以「相对 π0.5 +95%」作标题口径(0.87 vs 0.43)⚠️。
- **真机(AgileX PiPER 6-DoF 单臂,4 任务,各 50 示范 / 20 trials)**:均值 π0.5 0.69 / Motus 0.76 / **GigaWorld 0.83**——即真机比 Motus **+0.07(论文称 +7%)**、比 π0.5 **+0.14**。
- **推理延迟(A100,Table 3)**:π0.5 225ms · GigaBrain-0 452ms · Cosmos-Policy 1413ms · Motus 3231ms · **GigaWorld 360ms**。
- **数据效率(Fig.7)**:仅用 10% 训练数据即达到 VLA 的最高成功率。
- **消融**:① 预训练成分——从零 0.45 → 仅视频初始化 0.57 → 仅具身预训练 0.73 → **二者兼有 0.83**;② 未来帧步长 Δ——Δ=12(K=4)最佳 0.83;③ 因果掩码 0.83 vs 无约束自注意力 0.81。
- **预训练数据(~10,000 小时)**:人类第一视角 EgoDex 800h / Ego4D 3,500h / SSv2 200h;真机 Agibot 2,500h / Open X-Embodiment 3,500h / RoboMind 300h / DROID 350h / RDT 25h / ATARA 10h;网络视频先验用 Wan。

## 四、与本站谱系的关系

- **「视频可选」对照「视频必生」**:与 [WorldVLA](/wam/papers/worldvla)、[UWM](/wam/papers/uwm) 成对照——后者推理仍要生成未来,GigaWorld 把它降为训练期辅助。
- **保护视频先验的掩码**,与 [WALL-WM](/wam/papers/wall-wm) 的「逐层单向跨注意力(只让动作读视频、不反向写)」异曲同工——都在隔离动作↔未来视频、避免动作被视频拖累。
- **同场基线**:RoboTwin 2.0 上对比 [π0.5](/vla/papers/pi05)、X-VLA、Motus;延迟对比里出现 **Cosmos-Policy**(NVIDIA Cosmos 世系策略,见 [Cosmos 3](/wam/papers/cosmos3))与 **GigaBrain-0**(GigaAI 同门)。
- **范式归位**:流匹配联合「动作 + 视频」,属本站 taxonomy「联合 · 扩散」一支,但以「动作中心 + 视频可选」为独特切口。

## 五、局限与存疑

1. **全部为作者自评 ⚠️**:RoboTwin 自跑、真机仅 20 trials/任务,样本偏小;无独立复现。
2. **真机评测面窄**:仅单臂 AgileX PiPER、4 个任务,未覆盖双臂/灵巧/长程。
3. **仿真均值并未超 Motus**(0.87 vs 0.89),卖点是「同档精度 + 9× 速度 + 真机更稳」,而非全面 SOTA——宜如实理解。
4. **未释放代码/权重**(仅项目页,CC BY-NC-SA 4.0),复现待核;且「视频可选」省的是**推理**算力,训练仍需联合生成视频,训练成本未减。

## 参考文献

- GigaWorld-Policy: An Efficient Action-Centered World-Action Model. arXiv:**2603.17240**(v1 2026-03-18 / v2 03-21,GigaAI)。<https://arxiv.org/abs/2603.17240>
- 项目页:<https://gigaai-research.github.io/GigaWorld-Policy/>(CC BY-NC-SA 4.0)
- 对读:[WorldVLA](/wam/papers/worldvla) · [UWM](/wam/papers/uwm) · [WALL-WM](/wam/papers/wall-wm) · [Cosmos 3](/wam/papers/cosmos3) · [π0.5](/vla/papers/pi05)

> 体例声明:本页 arXiv ID 经 ✅ 核验;一切成功率 / 加速比 / 数据效率为**作者自评 ⚠️**,非第三方复现。RoboTwin 为公开基准但成绩由作者自测。引用数据请连同 ⚠️ 一并保留。
