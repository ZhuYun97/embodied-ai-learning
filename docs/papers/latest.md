---
title: 每日最新论文
description: VLA / WAM / 具身数据每日新论文候选池,按日期记录最新 arXiv 与公开论文,标注已细读、待细读、观察、暂缓和排除状态,作为新闻与正式论文细读之间的收录队列。
aside: false
pageClass: paper-radar-page
---

# 每日最新论文

<p class="paper-radar-intro"><strong>每日论文队列</strong> · 候选 → 细读。产业新闻见 <a href="/embodied-ai-learning/news/">具身新闻</a>。</p>

<div class="latest-paper-hero">
  <div>
    <span class="latest-paper-hero__eyebrow">PAPER RADAR · 2026-07-09</span>
    <p class="latest-paper-hero__title">7 月 9 日 · VLA / WAM / DATA-EVAL / HUMANOID-TACTILE</p>
    <p class="latest-paper-hero__text">今日从 arXiv cs.RO / cs.CV / cs.AI 最新提交与论文项目页中筛出 20 篇强相关候选;VLA 主线集中在 latent memory、proprioception-vision grounding、test-time primitive guidance 和离散 token 导航,WAM 侧出现 LingBot-Video、LingBot-World 2.0、WAM-TTT 与 world-model admissibility,数据评测侧补上 EmbodiedGen V2、ABot-C0、teleop retargeting 与 robot safety,触觉/人形/接触密集操作侧则由 TouchWorld、VR+LLM humanoid teleop、deformable tool force estimation 等推进。</p>
  </div>
  <div class="latest-paper-stats" aria-label="论文队列统计">
    <span><b>20</b>今日新增</span>
    <span><b>0</b>已细读</span>
    <span><b>6</b>VLA</span>
    <span><b>4</b>WAM</span>
    <span><b>5</b>DATA/EVAL</span>
    <span><b>5</b>HUMANOID/TACTILE</span>
  </div>
</div>

<div class="paper-track-strip" aria-label="方向说明">
  <span class="paper-track paper-track--vla">VLA · 模型策略</span>
  <span class="paper-track paper-track--wam">WAM · 世界模型</span>
  <span class="paper-track paper-track--data">DATA · 数据侧</span>
  <span class="paper-track paper-track--vla">HUMANOID · 全身操作</span>
  <span class="paper-track paper-track--wam">TACTILE · 接触感知</span>
</div>

<div class="paper-filter-panel" data-paper-filter-panel>
  <div class="paper-filter-panel__head">
    <span>分类筛选</span>
    <output data-paper-filter-count>全部论文</output>
  </div>
  <div class="paper-filter-panel__controls" role="group" aria-label="按论文分类筛选">
    <button type="button" class="paper-filter-chip is-active" data-paper-filter="all">全部</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="vla">VLA</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="wam">WAM</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="data">DATA/EVAL</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="humanoid">HUMANOID</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="tactile">TACTILE</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="p0">P0 优先</button>
    <button type="button" class="paper-filter-chip" data-paper-filter="done">已细读</button>
  </div>
</div>

<div class="paper-day-heading">2026-07-09</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得优先细读四条线:第一是 VLA 的长程记忆和状态接地,LaMem-VLA、GeoProp、PriGo、GemNav 都在补从当前观测到可执行动作之间的时间和几何归因;第二是 WAM 从视频生成进一步走向可控、可适配和可验证,LingBot-Video、LingBot-World 2.0、WAM-TTT、world-model admissibility 值得连读;第三是数据与评测基础设施继续前移,EmbodiedGen V2、ABot-C0、Smooth Operator 把仿真、运动语料和遥操作质量做成训练入口;第四是触觉和人形交互明显升温,TouchWorld、VR+LLM humanoid teleop、deformable tool force estimation 都指向接触闭环。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>VIDEO PRETRAINING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07675" target="_blank" rel="noreferrer">LingBot-Video</a></h3>
      <p>面向 embodied intelligence 重新设计 MoE DiT 视频预训练,把机器人、导航和 egocentric 视频纳入数据画像,并用物理合理性和任务完成奖励对齐视频世界模型。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07675" target="_blank" rel="noreferrer">arXiv</a><a href="https://technology.robbyant.com/lingbot-video" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LATENT MEMORY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07608" target="_blank" rel="noreferrer">LaMem-VLA</a></h3>
      <p>把历史经验重构成 short/long-term latent memory token,直接编织进 VLA 连续嵌入序列,解决长程任务里仅靠当前观测或外部检索难以参与动作推理的问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07608" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/quhongyu/LaMem-VLA" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>FOUNDATION MODEL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07287" target="_blank" rel="noreferrer">TouchWorld</a></h3>
      <p>把 vision-language 子任务规划、tactile world-model prediction、visuo-tactile action chunk 和高频 tactile residual correction 分层,用触觉同时做接触预测和快速反馈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07287" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>SIM WORLD ENGINE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07459" target="_blank" rel="noreferrer">EmbodiedGen V2</a></h3>
      <p>把 sim-ready 3D asset、交互 affordance、任务世界、多房间场景和 stateful vibe coding 统一成可编辑仿真流水线,服务导航、操作和移动操作策略训练。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07459" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>STATE GROUNDING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07101" target="_blank" rel="noreferrer">GeoProp</a></h3>
      <p>把机器人 proprioception 投影到图像平面采样局部视觉特征,形成 grounded state token 并加入短程 look-ahead 坐标,给通用操作策略一个轻量几何归纳偏置。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07101" target="_blank" rel="noreferrer">arXiv</a><a href="https://alibaba-damo-academy.github.io/GeoProp/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>TEST-TIME ADAPT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06988" target="_blank" rel="noreferrer">WAM-TTT</a></h3>
      <p>用未标注人类视频在测试时写入 frozen WAM 的轻量 adaptive memory,通过视频预测和 human-robot 对齐让 world-action model 向新任务偏好迁移。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06988" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>EVAL SAFETY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07196" target="_blank" rel="noreferrer">Validate the Dream Before You Trust Its Verdict</a></h3>
      <p>把生成式 world model 作为闭环测试 oracle 前先做 admissibility ladder 认证,指出视觉质量指标不能替代 action-following 和安全判决可信度。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07196" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>INTERACTIVE WORLD</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07534" target="_blank" rel="noreferrer">LingBot-World 2.0</a></h3>
      <p>把 LingBot-World 扩展到无限交互时长、720p 60fps 实时蒸馏、多样化动作事件和 agentic harness,更偏可交互世界模拟器路线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07534" target="_blank" rel="noreferrer">arXiv</a><a href="https://technology.robbyant.com/lingbot-world-v2" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>QUADRUPED</span><span>MOTION DATA</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07370" target="_blank" rel="noreferrer">ABot-C0</a></h3>
      <p>用条件视频生成、动作捕捉、遥操作和人工设计构建 16,074 段物理可行动作片段,训练四足机器人 motion-control foundation 与真实部署栈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07370" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TEST-TIME GUIDANCE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07076" target="_blank" rel="noreferrer">PriGo</a></h3>
      <p>给 diffusion / flow manipulation policies 增加 test-time primitive guidance,通过 PANet 预测 primitive distribution 并可微地修正动作,减少表面动作相关性带来的泛化失效。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07076" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>NAVIGATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06882" target="_blank" rel="noreferrer">GemNav</a></h3>
      <p>用 frozen MLLM 语言塔 LoRA 做短中程视觉导航,把 waypoint 和导航信号统一成离散 token,弱化专用视觉编码器和连续 action head 依赖。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06882" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>RETARGETING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07491" target="_blank" rel="noreferrer">Smooth Operator</a></h3>
      <p>提出 sampling-based hand retargeter,面向 VLA/VAM 所需高质量遥操作数据降低 jitter 和操作者负担,并用真实用户实验评估复杂操作成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07491" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>VR TELEOP</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07430" target="_blank" rel="noreferrer">Immersive Social Interaction with VR and LLM-Assisted Humanoids</a></h3>
      <p>用 Apple Vision Pro、语音控制、VR 手腕/手指跟踪和 LLM locomotion command 模块遥操作 Unitree H1,同时记录第一视角、多模态命令、关节和 gaze 数据。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07430" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ONBOARD VLM</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07403" target="_blank" rel="noreferrer">Multi-Agent Robotic Control with Onboard VLMs</a></h3>
      <p>把多个小型 VLM 专家和 Megamind 编排 agent 部署到板载硬件,在工业仓库移动操作场景中处理巡检、维护、搜索、质检和人类请求。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07403" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>MULTI-ROBOT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06990" target="_blank" rel="noreferrer">Closed-Loop Multi-Agent Framework for Multi-Robot Manipulation</a></h3>
      <p>用层级 LLM agent 把长程任务分解、物理执行反馈和多机器人协同闭环结合起来,针对跨 workspace、接触丰富和执行不确定性的操作任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06990" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>IMITATION</span><span>OBJECT-CENTRIC</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07129" target="_blank" rel="noreferrer">Compositional Motion Generation with Object-Centric Neural Fields</a></h3>
      <p>把 object-centric neural fields 和 temporal MoE movement primitives 连接起来,从示范中学习可组合的操作轨迹,保持物体几何变化与动作生成的一致表示。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07129" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>FORCE ESTIMATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07574" target="_blank" rel="noreferrer">Context-Aware Force Estimation for Deformable Tool Manipulation</a></h3>
      <p>针对机器人环境拭子这类一次性柔性工具,用 wrist force 和 proprioception 学习 tip-level contact force,并通过 few-shot FiLM context 适应表面和工具顺应性变化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07574" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>ROBOT SAFETY</span><span>INITIATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07420" target="_blank" rel="noreferrer">Initiation Safety</a></h3>
      <p>把 generalist robot safety 中的“是否应该开始第一个难撤销社交动作”单独建模为 initiation authorization,补 motion guardrail 和对话安全之外的许可层。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07420" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SOFT ROBOT</span><span>MANIPULATOR</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07622" target="_blank" rel="noreferrer">ELEANOR</a></h3>
      <p>构建 85 cm 连续柔性象鼻式机械臂,通过 3D 打印体素化结构和 tendon actuation 获得全身抓取与高顺应性,对软体大尺度操作硬件有参考价值。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07622" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>IMITATION</span><span>SPECTRAL SKILL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06978" target="_blank" rel="noreferrer">SPECTRA</a></h3>
      <p>用频域 movement primitive 同时保留 task-space 几何和 joint-space 执行约束,避免事后滤波、裁剪或 time scaling 破坏关键末端轨迹。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06978" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-07-08</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得优先细读四条线:第一是 VLA 从二维视觉动作模型继续补 3D 几何、部署数据和推理效率,Lift3D-VLA、LingBot-VLA 2.0、SIEVE、ActionCache 都值得优先跟;第二是 WAM/4D 世界模型明显升温,RynnWorld-4D、RynnWorld-Teleop、MECo-WAM、RoboTALES 分别覆盖 RGB-D-flow 预测、数字遥操作、机械直觉和任务对齐想象;第三是数据和评测侧开始更重视可生成数据、抓取 SE(3) 质量、人形交互力和 embodied occupancy;第四是人形与灵巧手继续向接触密集操作推进,WristMimic、LAMP、DexTele 都有真实或物理仿真约束。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>3D GEOMETRY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06564" target="_blank" rel="noreferrer">Lift3D-VLA</a></h3>
      <p>把 VLA 显式抬升到点云几何和时序动作空间,通过 2D 模型 lifting 与 temporal action token 建模补现有 3D 编码的信息损失和动态操作不足。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06564" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>4D WORLD MODEL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06559" target="_blank" rel="noreferrer">RynnWorld-4D</a></h3>
      <p>从单张 RGB-D 图像和语言指令联合生成未来 RGB、depth 与 optical flow,用 RGB-DF 表征把世界预测向低层末端动作需要的 4D 动态靠拢。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06559" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DIGITAL TELEOP</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06558" target="_blank" rel="noreferrer">RynnWorld-Teleop</a></h3>
      <p>提出 digital teleoperation,让操作者手部 pose 驱动机器人中心的生成式世界模型合成第一视角视频,再把 pose stream 作为可重定向动作标签扩展模仿学习数据。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06558" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DATA SELECTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06442" target="_blank" rel="noreferrer">SIEVE</a></h3>
      <p>把示教轨迹拆成可复用 primitive 与 transition interface,按结构覆盖度选择 medoid 轨迹,针对 VLA imitation learning 中的冗余、噪声和长程组成覆盖不足。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06442" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>WHOLE-BODY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06438" target="_blank" rel="noreferrer">WristMimic</a></h3>
      <p>用 wrist 作为全身运动和接触丰富手部操作之间的分界,身体与手腕跟踪人体运动,手指则通过物体轨迹和接触结果学习抓取与操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06438" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>PRACTICAL SCALE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06403" target="_blank" rel="noreferrer">LingBot-VLA 2.0</a></h3>
      <p>把 LingBot-VLA 扩展到约 60,000 小时预训练数据、20 种机器人配置、双臂/头腰底盘/灵巧手动作空间与预测式动态建模,更偏真实部署工程化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06403" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>INFERENCE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06370" target="_blank" rel="noreferrer">ActionCache</a></h3>
      <p>给 flow-matching VLA 加外部动作缓存,用相似上下文检索历史中间动作 warm-start 去噪过程,目标是在不训练的情况下减少实时部署延迟。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06370" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>REAL-WORLD RL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06323" target="_blank" rel="noreferrer">LAMP</a></h3>
      <p>为灵巧手学习 history-conditioned latent motion prior,让在线 residual RL 在低维手部 latent action 空间探索,降低真实硬件上接触断裂和高维动作误差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06323" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SKILL COMPOSITION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06256" target="_blank" rel="noreferrer">Semantic Handoff Failures</a></h3>
      <p>在 BEHAVIOR-1K 中诊断长程 household task 的 skill handoff 问题:单个 VLA skill 达成 postcondition 后,终态可能仍不适合作为下一个 skill 起点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06256" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>SYNTHETIC NAV</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06165" target="_blank" rel="noreferrer">Image2Sim</a></h3>
      <p>把单张全景图自动转换成可交互 3D 场景并生成 embodied navigation 训练数据,用 VLM、深度、GSplat 和 asset retrieval 串起低成本仿真数据引擎。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06165" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>FORCE EVAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06052" target="_blank" rel="noreferrer">ThorArena</a></h3>
      <p>面向人形物理交互评测,采集带双手交互力的真人全身动作示范,用于衡量 motion-force 条件下的 tracking、稳定性和控制鲁棒性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06052" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>SIM FUTURES</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.06018" target="_blank" rel="noreferrer">RoboTALES</a></h3>
      <p>用层级 LLM planner 和 VLM critic 约束视频生成模型的 imagined futures,让世界模型想象更贴合任务子目标,再从内部表征训练机器人策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.06018" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DIAGNOSIS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05966" target="_blank" rel="noreferrer">Imagined Rollouts are Kinematic, Not Dynamic</a></h3>
      <p>提出 imagined Kinematic-Consistency Error 诊断长程 world model failure,指出模型常在运动学外观上想象,但没有随物理参数跨 regime 变化出动态响应。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05966" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>TELEOP</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05883" target="_blank" rel="noreferrer">DexTele</a></h3>
      <p>双臂灵巧遥操作系统,结合视觉 motion retargeting、motion-graph encoder、latent optimization 与 VLM+MPC 自适应抓取,处理跨平台和合规接触。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05883" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATASET</span><span>GRASP SE(3)</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05869" target="_blank" rel="noreferrer">GraspIT</a></h3>
      <p>连接仿真和真实抓取 SE(3) 姿态生成的数据集,用 Isaac Sim slip-test 给候选抓取打连续质量分,并把标签回投到真实 RGB-D 场景。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05869" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED AI</span><span>3D SCENE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05780" target="_blank" rel="noreferrer">GEM-Occ</a></h3>
      <p>为 embodied AI 引入 generative 3D occupancy prediction,从 ego-centric observation 推断语义占据,补齐导航和操作任务中对不可见空间结构的场景理解。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05780" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>VISUAL PROMPT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05765" target="_blank" rel="noreferrer">FORGE</a></h3>
      <p>通过 VLM 从视觉提示中推断 object states、目标状态和 functional keypoints,把工具使用与 manipulation generalization 组织成更可解释的 prompt-conditioned 流程。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05765" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>PHYSICAL INTUITION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05468" target="_blank" rel="noreferrer">MECo-WAM</a></h3>
      <p>从机械直觉角度改造 world-action model,把 mass、elasticity、collision 等物理属性作为可解释信号,尝试提升长期操作预测与动作生成的一致性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05468" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-07-07</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得优先细读四条线:第一是 VLA 部署鲁棒性和组合泛化,CamVLA、InternVLA-A1.5、Cortex、SEAM 分别补自由相机、潜在前瞻、长程规划对齐和 action chunk 平滑;第二是 WAM 继续从视频预测靠近可控操作,DSWAM、KAM-WM、Mask2Real-WM、GeoMoLa 都在把世界模型信号转成动作接口;第三是数据和评测侧出现 Deform360 与 RoboDojo,一个补真实多视角视触觉可变形物体数据,一个补 sim+real 通用操作评测;第四是接触密集操作继续升温,线缆、灵巧手、触觉芯片和人形 WBC 都有新信号。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>FREE CAMERA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05396" target="_blank" rel="noreferrer">CamVLA</a></h3>
      <p>把末端动作先预测到 camera-centric 坐标再转换到机器人控制,目标是在不显式输入相机外参的情况下处理部署时相机重装、移位和自由视角变化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05396" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>DATASET</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05390" target="_blank" rel="noreferrer">Deform360</a></h3>
      <p>面向可变形物体 world model 的真实多视角视触觉数据集,覆盖 198 个日常物体和 1,980 段交互,适合比较 2D pixel、3D 几何和触觉动态建模路线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05390" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LONG HORIZON</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05377" target="_blank" rel="noreferrer">Cortex</a></h3>
      <p>把高层 VLM 规划和低层 VLA 执行做双向对齐,用 32 个规范化 skill primitives 与可执行性原则缩小语义规划和运动执行之间的落差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05377" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>NEUROMORPHIC</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05241" target="_blank" rel="noreferrer">GelNeuro</a></h3>
      <p>把 GelSight Mini 光学触觉前端和 Speck2f 神经形态 SoC 直接集成,用 DVS 事件和脉冲卷积网络做低延迟、低功耗纹理识别。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05241" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>NAVIGATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.05122" target="_blank" rel="noreferrer">Green for Go, Red for No</a></h3>
      <p>用实时语义分割把可通行区域标绿、不可通行区域标红,评估 visual grounding 对 VLA navigation waypoint error 和场景歧义的影响。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.05122" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>FORESIGHT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04988" target="_blank" rel="noreferrer">InternVLA-A1.5</a></h3>
      <p>在原生 VLM backbone 上同时保留 VQA/子任务预测和连续动作生成,把未来预测改成 latent querying,用视频生成器先验增强组合泛化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04988" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>SIM2REAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04940" target="_blank" rel="noreferrer">Zero-Shot Dexterous Force-Based Grasping</a></h3>
      <p>用密集触觉和关节力矩反馈训练灵巧手接触控制,强调快速触觉仿真、电流到力矩映射和 zero-shot sim2real 部署。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04940" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DUAL SYSTEM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04927" target="_blank" rel="noreferrer">DSWAM</a></h3>
      <p>把 VLM 式显式子任务分解接到 video-based world/action model 的物理执行能力,并尝试给 VLA 与 WAM 做更公平的真实机器人对比。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04927" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>SYNTHESIS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04880" target="_blank" rel="noreferrer">PRISM</a></h3>
      <p>从单张目标环境图像和自然语言任务生成个性化机器人数据集,把场景重建、运动合成和任务轨迹生成串成面向用户环境适配的数据管线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04880" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>WBC</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04837" target="_blank" rel="noreferrer">Athena-WBC</a></h3>
      <p>面向长尾人形全身控制,用 capability-aligned policy experts 处理高动态转移和平衡关键动作中“多采样仍学不好”的能力错配问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04837" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ACTION CONDITION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04816" target="_blank" rel="noreferrer">CAC-VLA</a></h3>
      <p>学习 context-gated action conditioning,让视觉语言表征显式服务于连续动作生成,减少 action expert 独自补齐多模态语义到控制信号的压力。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04816" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>DIFFUSION POLICY</span><span>EXECUTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04739" target="_blank" rel="noreferrer">Spatial Attention</a></h3>
      <p>用 action log-likelihood 对观测的梯度敏感度动态调整 diffusion policy 的 action chunk 执行时长,在响应性和计算成本之间自适应折中。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04739" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>MOTION LATENT</span><span>3D GEOMETRY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04714" target="_blank" rel="noreferrer">GeoMoLa</a></h3>
      <p>通过预测 manipulation 中点云随时间的 4D 几何变化来学习离散 motion latent,让动作抽象更关注真实物理运动而不是外观重建。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04714" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>REASONING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04681" target="_blank" rel="noreferrer">Do VLAs Mean What They Say?</a></h3>
      <p>区分 embodied CoT 的 functional reasoning 和 faithful reasoning,质疑 VLA 口头推理是否真实反映动作预测内部因果链。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04681" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>AFFORDANCE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04652" target="_blank" rel="noreferrer">KAM-WM</a></h3>
      <p>从冻结 latent video world model 的单步 latent velocity 里抽取 Kinematic Affordance Map,给少样本 manipulation policy 提供交互区域和粗运动方向。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04652" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEFORMABLE</span><span>SIM2REAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04616" target="_blank" rel="noreferrer">SILO</a></h3>
      <p>用 GPU 并行仿真训练多阶段线缆 routing RL policy,覆盖不同线缆几何和变形模式,目标是减少线性可变形物体任务的数据需求。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04616" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>ROBOT VLM</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04610" target="_blank" rel="noreferrer">RoboVista</a></h3>
      <p>提出 Robot Question Answering 模块化评测框架,从真实机器人应用中拆出可解释的视觉语言决策组件,诊断 VLM 是否适配多样机器人场景。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04610" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ACTION CHUNK</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04609" target="_blank" rel="noreferrer">SEAM</a></h3>
      <p>针对 flow-matching VLA 的 action chunk 边界不连续问题,提出无需训练的 inference-time 平滑执行方法,减少相邻 chunk 落到不兼容轨迹模态。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04609" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DEMONSTRATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04591" target="_blank" rel="noreferrer">Simple-to-Complex Structured Demonstrations</a></h3>
      <p>把示教数据从简单到复杂组织起来,把 demonstration organization 作为影响 VLA 学习效率、稳定性和泛化的关键变量来研究。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04591" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>SIM2REAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04546" target="_blank" rel="noreferrer">Mask2Real-WM</a></h3>
      <p>把 action-conditioned dexterous world model 拆成 mask dynamics 与 photorealistic rendering 两段,用分割空间缩小 sim2real gap,再把 mask 转成真实 RGB 未来。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04546" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LANGUAGE OPT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04517" target="_blank" rel="noreferrer">VLA Grounder</a></h3>
      <p>不更新黑盒 VLA 权重,而是优化语言条件空间,把人类指令转成更贴合目标物外观、空间关系和 grounding cues 的短命令。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04517" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>SIM+REAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.04434" target="_blank" rel="noreferrer">RoboDojo</a></h3>
      <p>统一仿真与真实机器人通用 manipulation 评测,包含 42 个仿真任务和 18 个真实任务,覆盖多维能力而不是只测短程或单技能任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.04434" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-07-03</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得优先细读三条线:第一是 VLA 部署可靠性,Neuro-Symbolic Safety、VLA-Corrector、DiG、VLAFlow 都在补安全、闭环自纠错和动作分布漂移检测;第二是 WAM 从“预测视频”继续靠近动态 3D 操作、视频-触觉联合预测和可控长程世界模拟,PhysMani、Bridge-WA、VT-WAM、WorldDirector 值得优先跟;第三是真实数据/评测侧很强,AutoSERL 用单条示教跑实机 RL,ManipArena 和 VLA-Arena 继续把 VLA/WAM 评测做成更可复现的基准,同时 EAGLE-360 和 ComplexMimic 补上具身主动探索与人-场景交互模仿。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SAFETY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01378" target="_blank" rel="noreferrer">Neuro-Symbolic Safety Guidance for VLAs</a></h3>
      <p>把符号安全约束插入 flow-matching VLA 的去噪过程,对预测动作轨迹做 minimum-norm correction,从单步避障转向预测性碰撞规避。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01378" target="_blank" rel="noreferrer">arXiv</a><a href="https://willenglish.tech" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SIM2REAL</span><span>POLICY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01410" target="_blank" rel="noreferrer">BIFROST</a></h3>
      <p>用 paired cross-domain data 学共享 history encoder,让视觉导航、接触操作和 visual servoing policy 通过跨域 bisimulation 表征做 zero-shot sim2real。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01410" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>RL</span><span>ONE DEMO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01651" target="_blank" rel="noreferrer">AutoSERL</a></h3>
      <p>用单条示教自动化实机 RL 的滑窗干预、安全恢复和干预终止,在插入、悬挂、铰链等接触密集 manipulation 任务上减少人工介入。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01651" target="_blank" rel="noreferrer">arXiv</a><a href="https://autoserl.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>IMAGINATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01684" target="_blank" rel="noreferrer">TacImag</a></h3>
      <p>从视觉和本体感觉预测触觉表征,让部署时没有触觉硬件的机器人仍能利用接触先验;真实任务中 imagined force field 与 tactile image 分别提升接触/纹理任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01684" target="_blank" rel="noreferrer">arXiv</a><a href="https://tacimag.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>REWARD</span><span>VLM FEEDBACK</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01721" target="_blank" rel="noreferrer">CoRe</a></h3>
      <p>把 VLM 反馈拆成 formal reward 的迭代设计和 residual reward 的视频偏好学习,用于十个仿真和五个真实 manipulation 任务的偏好对齐 RL。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01721" target="_blank" rel="noreferrer">arXiv</a><a href="https://core-2026.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ACTION CHUNK</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01804" target="_blank" rel="noreferrer">VLA-Corrector</a></h3>
      <p>不改 VLA backbone,用 latent-space vision monitor 检测预测视觉演化与实际观测的偏差,触发 chunk 截断和在线梯度引导重规划。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01804" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>3D DYNAMICS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01938" target="_blank" rel="noreferrer">PhysMani</a></h3>
      <p>把 divergence-free Gaussian velocity field 作为 physics-principled 3D world model,再把预测的未来 3D 动态接入 action policy,面向快速运动目标操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01938" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/gaoyuezhou/PhysMani" target="_blank" rel="noreferrer">Code/Data</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>FLOW POLICY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02092" target="_blank" rel="noreferrer">Guided Action Flow</a></h3>
      <p>给 flow-matching action policy 加 Guiding Window 和 confidence-aware guidance,在相同数据预算下提升复杂灵巧操作的收敛和轨迹质量。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02092" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>3D BRIDGE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02195" target="_blank" rel="noreferrer">Bridge-WA</a></h3>
      <p>用结构化 3D Gaussian 场景和 object-centric action token 把 video/3D world model 接到动作生成,目标是补齐 WAM 里状态预测到控制的接口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02195" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>ACTUATOR</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02205" target="_blank" rel="noreferrer">Actuator Reality Shaping</a></h3>
      <p>把系统辨识从“复刻硬件”改成“重塑仿真 actuator reality”,减少人形 sim-to-real 中电机/传动误差对全身控制策略的破坏。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02205" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>NAVIGATION</span><span>FLOW FIELD</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02222" target="_blank" rel="noreferrer">CoFL-S</a></h3>
      <p>把低层视觉语言动作表示成局部可查询 sector flow field,用帧级子指令、动作、轨迹和稠密 flow supervision 训练连续时间导航接口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02222" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ACTIVE VISION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02322" target="_blank" rel="noreferrer">Moving Eye</a></h3>
      <p>把可移动相机/视角选择纳入 VLA 决策,让 policy 在长程操作中主动获取更有用的视觉证据,而不是固定视角被动执行。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02322" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>TELEOP</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02332" target="_blank" rel="noreferrer">HEFT</a></h3>
      <p>面向 175cm 全尺寸人形的重载遥操作,用 privileged motion guidance 和 windowed payload curriculum 学习带噪 VR 参考下的稳健全身跟踪。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02332" target="_blank" rel="noreferrer">arXiv</a><a href="https://heft.axell.top" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DATA EFFICIENCY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02403" target="_blank" rel="noreferrer">ACID</a></h3>
      <p>从 action-conditioned interaction data 中做更高效的 world/action model 学习,关注少数据下预测-控制耦合的样本效率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02403" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>ACTIVE VISION</span><span>CAMERA MOTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02417" target="_blank" rel="noreferrer">LIME</a></h3>
      <p>从 egocentric video 挖掘多意图相机运动监督,给自由语言意图预测下一视角的相对 SE(3) 目标位姿,把主动观察变成可学习动作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02417" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>GENERATIVE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02431" target="_blank" rel="noreferrer">WorldSample</a></h3>
      <p>用真实 rollout 后训练 world model 生成高保真 synthetic transitions,再通过 Policy-Paced Learning 控制样本选择,降低实机 RL 的交互成本。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02431" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>PRETRAIN</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02466" target="_blank" rel="noreferrer">TAP</a></h3>
      <p>先用廉价无语言交互数据和 inverse dynamics 学可迁移 motor priors,再用少量专家数据做语言 grounding,把 VLA 的“会动”和“会听指令”拆开训练。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02466" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>RUNTIME</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02501" target="_blank" rel="noreferrer">Embodied.cpp</a></h3>
      <p>面向具身 VLA/robot policy 的轻量运行时与系统实现信号,关注从模型到本地机器人执行栈的部署效率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02501" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>WAM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02503" target="_blank" rel="noreferrer">VT-WAM</a></h3>
      <p>把视频-触觉联合预测纳入 world-action model,用视觉和触觉未来状态帮助接触密集任务中的动作选择和失败预判。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02503" target="_blank" rel="noreferrer">arXiv</a><a href="https://vt-wam.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>WORLD SIM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02517" target="_blank" rel="noreferrer">WorldDirector</a></h3>
      <p>把 LLM 编排的 3D 轨迹和相机运动作为视频生成控制信号,强调长程事件中的动态对象持久记忆、身份保持和可控视角探索。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02517" target="_blank" rel="noreferrer">arXiv</a><a href="https://worlddirector.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED</span><span>ACTIVE SEARCH</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02479" target="_blank" rel="noreferrer">EAGLE-360</a></h3>
      <p>面向 360 度全景环境的具身主动视觉搜索,用全局到局部探索、RoPE Rolling 和 70K+ 轮 VQA 数据提升目标定位与错误恢复。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02479" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>EGOCENTRIC</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02075" target="_blank" rel="noreferrer">HandsOnWorld</a></h3>
      <p>从野外单目第一视角视频重建 3D 手部轨迹,构建 EgoVid-Pro 并用 Plucker Hand Map 解耦相机和手部运动,适合作为手控具身视频世界模型的数据路线参考。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02075" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>ARTICULATED</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02045" target="_blank" rel="noreferrer">PWM-ArtGen</a></h3>
      <p>把关节物体建模为动态系统,联合学习视觉动态与运动学参数,用 Part World Model 生成/恢复可操作物体的结构先验。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02045" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>HSI IMITATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.02034" target="_blank" rel="noreferrer">ComplexMimic</a></h3>
      <p>面向复杂 3D 场景中的物理人-场景交互模仿,用 imitation/interaction 双专家和难度感知蒸馏处理 Mocap 不完美与碰撞适应。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.02034" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/LuPan23/ComplexMimic" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>FLOW</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01586" target="_blank" rel="noreferrer">VLAFlow</a></h3>
      <p>cross-list 新文,围绕连续动作 VLA 的 flow matching/action generation 建模,适合作为 VLA-Corrector、DiG 等动作流可靠性工作的横向对照。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01586" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>MANIP BENCH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2603.28545" target="_blank" rel="noreferrer">ManipArena</a></h3>
      <p>replacement 重要更新:标准化真实机器人 manipulation generalization 评测,覆盖 20 个任务、10,812 条专家轨迹、13.5M frames 和 VLA/WAM policy 对比。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2603.28545" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>RELIABILITY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2512.01715" target="_blank" rel="noreferrer">DiG</a></h3>
      <p>用 observation feature 到 action representation 的 sliced-Wasserstein transport cost 作为 VLA action chunk 可靠性信号,在分布漂移和长程任务下做 gate/refinement。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2512.01715" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SAFETY BENCH</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2512.11891" target="_blank" rel="noreferrer">AEGIS / VLSA</a></h3>
      <p>replacement 更新:给 VLA 插入 control-barrier-function 安全约束层,并用 SafeLIBERO 评估 obstacle avoidance 和 task success 的共同提升。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2512.11891" target="_blank" rel="noreferrer">arXiv</a><a href="https://vlsa-aegis.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SKILL</span><span>IMITATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2512.18368" target="_blank" rel="noreferrer">AtomSkill</a></h3>
      <p>从多任务示教里学习语义对齐 atomic skill space,再用 keypose imagination 做长程 skill chaining,适合作为技能抽象/行为分段路线参考。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2512.18368" target="_blank" rel="noreferrer">arXiv</a><a href="https://atom-skill.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>VLA BENCH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2512.22539" target="_blank" rel="noreferrer">VLA-Arena</a></h3>
      <p>replacement 更新:开源 VLA benchmark 框架,从任务结构、语言命令和视觉观察三个轴拆解难度,适合和 ManipArena 共同跟踪。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2512.22539" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-07-02</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得优先细读三条线:第一是 VLA 的可组合泛化和少样本部署适配,EmbodimentSemantic、ACT-VLA、DART、FurnitureVLA 分别从空间关系、动作组合、域迁移和长程装配补短板;第二是 WAM 从视频预测转向 3D/4D 结构化世界状态和可用于评测的神经模拟器;第三是触觉/接触数据继续变大,CHORD 和 H-Tac 都把人类示教或人类触觉数据转成机器人可用的接触先验。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SPATIAL EVAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00020" target="_blank" rel="noreferrer">EmbodimentSemantic</a></h3>
      <p>构建面向具身操作轨迹的空间 scene-graph 数据集和 benchmark,用支撑、包含、遮挡、深度等关系诊断 VLM/VLA 的空间 grounding。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00020" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PLANNING</span><span>SYMBOLS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00031" target="_blank" rel="noreferrer">Joint Discovery of Object and Action Symbols</a></h3>
      <p>从随机交互数据中联合发现对象类别和高层 manipulation primitive,再用 effect trajectory 中间状态做离散规划。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00031" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEX</span><span>CONTACT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00033" target="_blank" rel="noreferrer">CHORD</a></h3>
      <p>把人类示教转成 object-centric contact wrench guidance,用于长程刚体和 articulated object 灵巧操作 RL,并给出 4,739 个双手任务 benchmark。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00033" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>3D DYNAMICS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00148" target="_blank" rel="noreferrer">3D Point World Models</a></h3>
      <p>先补全局部点云再学习 action-conditioned 3D dynamics,缓解视频 world model 的几何漂移,面向 model-based planning 做更可靠 rollout。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00148" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SKILLS</span><span>CODE-AS-POLICY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00272" target="_blank" rel="noreferrer">ASPIRE</a></h3>
      <p>NVIDIA GEAR 的开放式机器人技能发现系统,通过执行 trace、失败诊断、修复合成和技能库沉淀,让 code-as-policy 技能跨任务复用。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00272" target="_blank" rel="noreferrer">arXiv</a><a href="https://research.nvidia.com/labs/gear/aspire/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>MLLM</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00302" target="_blank" rel="noreferrer">Wake up for Touch!</a></h3>
      <p>用 mask-isolated tactile alignment 给多模态 LLM 接入触觉,冻结关键视觉语言参数,只更新 dormant subspace 以减少触觉学习对通用能力的破坏。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00302" target="_blank" rel="noreferrer">arXiv</a><a href="http://mmai.ewha.ac.kr/splash/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>COMPOSITION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00351" target="_blank" rel="noreferrer">ACT-VLA</a></h3>
      <p>从已有任务的 latent task representation 合成新的物理有效示教,让 VLA 组合已学 sub-skill,降低对额外人工遥操作数据的依赖。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00351" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>REWARD</span><span>VLM</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00483" target="_blank" rel="noreferrer">VLM-AR3L</a></h3>
      <p>让 VLM 同时产生 absolute state reward 和 relative progress reward,把语言目标下的视觉观察转成 RL 可用的稳定奖励信号。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00483" target="_blank" rel="noreferrer">arXiv</a><a href="https://vlm-ar3l.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ONE-SHOT ADAPT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00666" target="_blank" rel="noreferrer">DART</a></h3>
      <p>用 domain-specific weight vector arithmetic 做 VLA 单样本域适配,覆盖相机位姿变化和相近机器人平台迁移。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00666" target="_blank" rel="noreferrer">arXiv</a><a href="https://twkang43.github.io/projects/dart" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/snumprlab/dart" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>MOBILE MANIP</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00678" target="_blank" rel="noreferrer">ABot-M0.5</a></h3>
      <p>面向移动操作的统一 world-action model,用中间 latent action、双层 MoT 和 dream-forcing 处理导航-操作动作混杂与 autoregressive 误差累积。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00678" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/amap-cvlab/ABot-Manipulation" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>TUTORIAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.00836" target="_blank" rel="noreferrer">From World Models to World Action Models</a></h3>
      <p>用 design-space 统一 observation/state world model 与 world action model,梳理 imagine-then-execute、joint video-action modeling 等范式。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.00836" target="_blank" rel="noreferrer">arXiv</a><a href="https://clearlab-sustech.github.io/WorldModelSurvey/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>POLICY</span><span>SPEED</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01051" target="_blank" rel="noreferrer">AutoSpeed</a></h3>
      <p>无需阶段或速度标注,让现有 visuomotor policy 学习 stage-adaptive motion speed 和预测 horizon,提升不同难度阶段的执行效率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01051" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>EVAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01060" target="_blank" rel="noreferrer">RoboWorld</a></h3>
      <p>用快速 autoregressive video world model 加 task-progress-aware VLM 打分评估 generalist robot policy,主打替代部分实机评测吞吐瓶颈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01060" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>PRETRAIN</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01067" target="_blank" rel="noreferrer">H-Tac / TTP</a></h3>
      <p>160 小时人类第一视角触觉-动作数据、300+ 任务和 135K episodes,再用统一触觉/动作空间做 human-to-robot tactile pre-training。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01067" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>POLICY</span><span>TEST-TIME</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01111" target="_blank" rel="noreferrer">FAR</a></h3>
      <p>把失败重试变成 test-time recovery 数据,用 failure-contrastive preference adaptation 和轻量动作扰动避免重复同一失败轨迹。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01111" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>4D PLANNING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01166" target="_blank" rel="noreferrer">Structured 4D Latent Predictive Model</a></h3>
      <p>在结构化 latent 空间预测 3D 场景随时间演化,再把未来场景交给 goal-conditioned inverse dynamics 转成可执行动作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01166" target="_blank" rel="noreferrer">arXiv</a><a href="https://structured-4d-model.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>BIMANUAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.01212" target="_blank" rel="noreferrer">FurnitureVLA</a></h3>
      <p>真实尺度双臂家具装配 VLA,结合仿真专家数据、VR 双臂示教和 progress signal,处理最多 7 个子任务、1550 步的长程装配。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.01212" target="_blank" rel="noreferrer">arXiv</a><a href="https://dannymcy.github.io/furniturevla/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>MEDICAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.23531" target="_blank" rel="noreferrer">BiliVLA</a></h3>
      <p>把胆道内镜导航写成 instruction-conditioned visuomotor learning,结合 scene-aware supervision 与 GRPO 提升真实 phantom 上的动作可靠性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.23531" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>POLICY</span><span>3D TOKENS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2603.17720" target="_blank" rel="noreferrer">VolumeDP</a></h3>
      <p>把图像特征 lift 到 volumetric representation,选择任务相关 voxel 作为空间 token,减少 2D 视觉到 3D 动作的错配。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2603.17720" target="_blank" rel="noreferrer">arXiv</a><a href="https://yzc0731.github.io/VolumeDP/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PHYSICS</span><span>SENSORLESS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2605.26284" target="_blank" rel="noreferrer">PhyPush</a></h3>
      <p>只用单次 push 的末端速度估计物体质量和摩擦系数,通过 Newton/Coulomb physics-guided loss 替代特权力觉输入。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2605.26284" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SIM2REAL</span><span>TABLE TENNIS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28805" target="_blank" rel="noreferrer">Physics Models for Sim-to-Real Transfer in Robot Table Tennis</a></h3>
      <p>用高速旋转乒乓球的空气动力学、球台接触和球拍接触模型提升仿真保真度,支撑职业级机器人乒乓策略 sim-to-real。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28805" target="_blank" rel="noreferrer">arXiv</a><a href="https://ace.ai.sony/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>WHOLE-BODY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2506.12851" target="_blank" rel="noreferrer">KungfuBot</a></h3>
      <p>面向功夫和舞蹈等高动态人形技能,通过动作处理、retargeting 和自适应跟踪容差训练 whole-body control policy。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2506.12851" target="_blank" rel="noreferrer">arXiv</a><a href="https://kungfubot.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-07-01</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得优先细读三条线:第一是 VLA 后训练和推理时扩展,Z-1、SARL、ELASTIC 都把“部署后怎么变强”具体化;第二是触觉/力觉从附加输入变成可迁移表征、未来接触预测和数据基准;第三是人形/具身数据开始围绕 human-present、ego-exo human video、Unitree G1 触觉操作和实验室精密操作扩张。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>EVAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30686" target="_blank" rel="noreferrer">Position: VLA Models Cannot Be Verified to Perform Physical Reasoning</a></h3>
      <p>把 VLA 成功率拆成语义匹配与物理决策两个不可辨识来源,指出现有 benchmark 很难证明 VLM backbone 真有物理泛化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30686" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEX</span><span>PRETRAIN</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30749" target="_blank" rel="noreferrer">From Grasps to Dexterity</a></h3>
      <p>把 35.5 万条 dexterous grasp 轨迹用于低层控制器预训练,再迁移到 articulated tool use,说明抓取数据可作为接触操作先验。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30749" target="_blank" rel="noreferrer">arXiv</a><a href="https://yingyuan0414.github.io/grasp2dexterity/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>FORCE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30988" target="_blank" rel="noreferrer">MuSe</a></h3>
      <p>研究如何把有限力觉数据接入预训练 vision-only policy,通过多阶段融合、未来多模态预测和 replay 保住原传感器能力。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30988" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>BENCH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31037" target="_blank" rel="noreferrer">Labimus</a></h3>
      <p>面向有机化学实验室的人形灵巧操作仿真与 benchmark,用精度感知评测区分“完成动作”和“满足实验容差”。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31037" target="_blank" rel="noreferrer">arXiv</a><a href="https://labimus.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>SIM2REAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31101" target="_blank" rel="noreferrer">Efficient Sim-to-Real Transfer of World-Action Models from Synthetic Priors</a></h3>
      <p>基于 Cosmos Policy 和 AnyTask 合成演示,尝试把 world-action model 从仿真零样本迁移到真实 Franka 操作,是 WAM 落地链路的重要信号。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31101" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TEST-TIME</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31132" target="_blank" rel="noreferrer">ELASTIC</a></h3>
      <p>给 diffusion/flow 机器人策略学习状态相关的推理时计算分配,在 pi0.5 实机上用更低延迟接近 best-of-10 成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31132" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>MEMORY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31167" target="_blank" rel="noreferrer">MIRTH</a></h3>
      <p>给 VLA 加长短期 temporal memory hub、互信息 latent reasoning token 和并行动作解码,主打缓解单帧 VLA 的时序短视。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31167" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>TRANSFER</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31236" target="_blank" rel="noreferrer">TactX</a></h3>
      <p>跨 resistive、magnetic、vision-based 触觉传感器学习共享 latent,让一类传感器训练的策略可零样本迁移到另一类传感器。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31236" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PLANNING</span><span>SYMBOLIC RL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31260" target="_blank" rel="noreferrer">Plan Right, Then Plan Tight</a></h3>
      <p>用从视频或任务构造的 BDDL 规格作为可验证接口,给 embodied planner 提供毫秒级 dense reward 和长度自适应训练信号。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31260" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>3D GUIDANCE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31329" target="_blank" rel="noreferrer">3D HAMSTER</a></h3>
      <p>让层级 VLA 的 planner 直接输出 3D waypoint,避免 2D 轨迹投到点云策略时产生错误深度与几何畸变。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31329" target="_blank" rel="noreferrer">arXiv</a><a href="https://davian-robotics.github.io/3D_HAMSTER/" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/DAVIAN-Robotics/3D_HAMSTER" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>REWARD</span><span>VIDEO</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31377" target="_blank" rel="noreferrer">Stage-Transition Dense Reward Modeling</a></h3>
      <p>从非结构化专家视频推断任务阶段,给长程 manipulation RL 提供阶段转移和阶段内进度两类视觉 dense reward。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31377" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>PRUNING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31382" target="_blank" rel="noreferrer">Revisiting Parameter Redundancy in VLA Models</a></h3>
      <p>用 VLM-to-VLA 适配过程中的参数漂移定位可剪枝模块,在 OpenVLA 和 pi0.5 上做 recovery-free 参数裁剪诊断。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31382" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>GENERATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31451" target="_blank" rel="noreferrer">UniTac</a></h3>
      <p>把触觉理解和触觉生成统一到 multimodal model,同时建模传感器属性与物体属性,面向跨传感器触觉表征。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31451" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>POLICY</span><span>FLOW</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31493" target="_blank" rel="noreferrer">ChronoFlow-Policy</a></h3>
      <p>用过去、当前、未来的物体和夹爪稀疏 3D keypoint flow 统一描述交互动态,再与 diffusion policy 联合训练。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31493" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SURVEY</span><span>ROBUSTNESS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31494" target="_blank" rel="noreferrer">Robustness of Robotic Manipulation</a></h3>
      <p>系统整理 manipulation robustness 的定义、概率/控制论表述、评测指标和感知/规划/控制/策略学习/硬件机制。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31494" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>HRI</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31682" target="_blank" rel="noreferrer">HABIT</a></h3>
      <p>10K+ episodes、160+ 小时的人在场机器人操作数据,把 collaborator、coworker、supervisor 作为数据多样性新轴。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31682" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31694" target="_blank" rel="noreferrer">RCT</a></h3>
      <p>机器人采集的 touch-vision-language 触觉数据集,强调按接触序列和 held-out material 评测,暴露现有 tactile split 泄漏问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31694" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TACTILE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31723" target="_blank" rel="noreferrer">UniTacVLA</a></h3>
      <p>把 tactile latent、tactile chain-of-thought 与未来触觉预测接入 VLA,再用触觉-动作混合控制器修正低频 action chunk。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31723" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31836" target="_blank" rel="noreferrer">RoboTacDex</a></h3>
      <p>Unitree G1 上的视觉-触觉-动作人形灵巧操作数据集,6K trajectories 覆盖双臂灵巧手、多视角 RGB-D、触觉和语义标注。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31836" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>RL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31846" target="_blank" rel="noreferrer">Z-1</a></h3>
      <p>基于 pi0.5 的 flow-based VLA RL 后训练,用 RoboCasa 公共数据 SFT 后做 task-wise GRPO,主打无私有示教提升策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31846" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEX</span><span>ZERO-DEMO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31909" target="_blank" rel="noreferrer">CoDex</a></h3>
      <p>无需人工示教,由 VLM 推断功能性约束,再用解析优化和 RL 发现 spray bottle、glue gun 等可执行灵巧功能操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31909" target="_blank" rel="noreferrer">arXiv</a><a href="https://robin-lab.cs.utexas.edu/CoDex/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SEMANTIC RL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31958" target="_blank" rel="noreferrer">Semantic Action Reinforcement Learning</a></h3>
      <p>不直接在机器人动作空间做 RL,而是在 generalist policy 的语言 prompt 空间学习组合技能,用于超出 zero-shot 能力的长程任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31958" target="_blank" rel="noreferrer">arXiv</a><a href="https://semantic-action-rl.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>SAFETY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.31993" target="_blank" rel="noreferrer">OopsieVerse</a></h3>
      <p>给 household manipulation 引入 damage-aware simulator 和 benchmark,把接触力、温度、液体等损伤纳入 VLA/策略安全评估。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.31993" target="_blank" rel="noreferrer">arXiv</a><a href="https://robin-lab.cs.utexas.edu/oopsieverse/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>HUMAN VIDEO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.32009" target="_blank" rel="noreferrer">Human-as-Humanoid</a></h3>
      <p>把同步 ego-exo 人类视频恢复并 retarget 成 60-DoF 人形 action chunk,用于高自由度 humanoid VLA 训练和零样本部署。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.32009" target="_blank" rel="noreferrer">arXiv</a><a href="https://zgc-embodyai.github.io/Human-as-Humanoid" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PREFERENCE</span><span>RLHF</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.32027" target="_blank" rel="noreferrer">Freeform Preference Learning</a></h3>
      <p>让标注者用自然语言定义速度、安全、摆放质量等偏好轴,学习 language-conditioned reward 并训练可按偏好 steering 的操作策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.32027" target="_blank" rel="noreferrer">arXiv</a><a href="https://freeform-pl.github.io/fpl.website/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>VIDEO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.32028" target="_blank" rel="noreferrer">DVG-WM</a></h3>
      <p>把 embodied world model 拆成 dynamics learning 与 visual synthesis 两段,用高效级联机制提升 LIBERO 和实机平台上的视频预测速度与质量。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.32028" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-06-30</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得盯三条线:VLA 不再只是堆大模型,而是在 action tokenizer、ECoT supervision、test-time RL、事件相机和触觉提示上补闭环短板;WAM 从“生成好看视频”推进到物理诊断、动作一致性、导航规划和可替代 rollout 的模拟器;数据侧则继续围绕人类视频、action-free demo、单次示教和全身 retargeting 扩张。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>EVAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28385" target="_blank" rel="noreferrer">RoboGaze</a></h3>
      <p>用多 agent VLM 对机器人 world model 生成视频做结构化诊断,按物理、时序和任务逻辑定位 glitch,比单一 VLM judge 更像可用评测工具。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28385" target="_blank" rel="noreferrer">arXiv</a><a href="https://robogaze-eval.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DIAG</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28455" target="_blank" rel="noreferrer">Event-Conditioned Diagnostics</a></h3>
      <p>把 free-motion、collision、occlusion 等事件条件拆开,诊断 passive object-state world model 内部是否真的编码运动学、接触与物体恒存。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28455" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>SLAM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28712" target="_blank" rel="noreferrer">J-LAW</a></h3>
      <p>把 metric localization 和 action-conditioned latent world model 写进同一个 factor graph,同时优化位姿、latent state 和可规划 landmark。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28712" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>SIM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28804" target="_blank" rel="noreferrer">ViPSim</a></h3>
      <p>针对长程 embodied world model 中动作低维、视频高维造成的几何漂移,协同 visual space 与 parameter space 改善 rollout 一致性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28804" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>POLICY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29501" target="_blank" rel="noreferrer">A2World</a></h3>
      <p>用带真实动作标注的大规模多视角 manipulation 数据预训练 action-conditioned diffusion world model,一份权重同时服务 simulator 和 action prediction。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29501" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>NAV</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30367" target="_blank" rel="noreferrer">FutureNav</a></h3>
      <p>把 VLN 做成 unified world-action modeling:同时建模未来观测和动作序列,补直接 action generation 缺少未来状态推演的问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30367" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>NAV</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29908" target="_blank" rel="noreferrer">SWAM</a></h3>
      <p>从起点/目标 RGB 直接生成中间 RGB-D 与动作轨迹,把导航 WAM 从候选验证范式推向单次 task-centric joint generation。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29908" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TACTILE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29089" target="_blank" rel="noreferrer">TAP-VLA</a></h3>
      <p>不改 VLA 架构,把视触觉传感器 shear field 叠到多视角 RGB 中,让接触力以视觉 annotation 方式进入预训练分布。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29089" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TEST-TIME RL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29892" target="_blank" rel="noreferrer">T²VLA</a></h3>
      <p>利用离散动作 VLA 的生成置信度做内生 reward,在测试时自举策略改进,覆盖 OpenVLA-OFT 和 pi 系列范式。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29892" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TOKENIZER</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30113" target="_blank" rel="noreferrer">SA-VLA</a></h3>
      <p>把 robot state 注入 VQ action tokenizer,让同一离散 token 可按当前关节、物体和接触状态解码为不同连续动作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30113" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>TOKENIZER</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.14752" target="_blank" rel="noreferrer">X-Tokenizer</a></h3>
      <p>自变量把 Wall-OSS-0.5 的动作分词器路线正式独立成论文/代码/权重:SRQ 用 q0 学语义意图,q1-q3 保留运动残差,2.4M 轨迹/2B action frames 预训练,作为混合离散-连续 VLA 的冻结语义动作接口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.14752" target="_blank" rel="noreferrer">arXiv</a><a href="https://x-square-robot.github.io/X-Tokenizer_projectPage/" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/X-Square-Robot/X-Tokenizer" target="_blank" rel="noreferrer">Code</a><a href="https://huggingface.co/x-square-robot/X-Tokenizer" target="_blank" rel="noreferrer">HF</a><a href="/vla/papers/x-tokenizer">细读</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ECoT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30552" target="_blank" rel="noreferrer">ZR-0</a></h3>
      <p>用 dense embodied chain-of-thought 监督对齐跨 embodiment 表征,推理时跳过 ECoT 生成,动作专家仍以 flow matching 输出 action chunk。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30552" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/RUCKBReasoning/ZR-0" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>EVENT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29384" target="_blank" rel="noreferrer">Event-VLA</a></h3>
      <p>用事件相机补低光、近暗场景下的 RGB 失效,通过 action-query routing 保住 RGB-language 预训练语义并增强动作鲁棒性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29384" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SYSTEM</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30456" target="_blank" rel="noreferrer">VLA on Real-World UR5</a></h3>
      <p>围绕 OpenVLA / OpenVLA-OFT 的真实 UR5e 部署复现,把问题从模型能力拆到数据采集、RLDS 转换、坐标系和时序对齐。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30456" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>GEOMETRY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29936" target="_blank" rel="noreferrer">OpenSPM</a></h3>
      <p>用 key spatial pose memory + 高频 flow-matching action generation 弥补端到端 VLA 在开放桌面操作里几何约束不足的问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29936" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>HUMAN VIDEO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28813" target="_blank" rel="noreferrer">Human2Any</a></h3>
      <p>从人类视频学习 object-object interaction priors,再结合机器人侧可达性和运动规划,迁移到不同 embodiment 与任务场景。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28813" target="_blank" rel="noreferrer">arXiv</a><a href="https://human2any.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>ACTION-FREE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29517" target="_blank" rel="noreferrer">CORE</a></h3>
      <p>不转移动作,从 action-free visual demonstrations 抽 terminal object configuration、空间关系与接触约束,作为 visual goal prototype 注入策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29517" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>PROMPT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30457" target="_blank" rel="noreferrer">Behavior Prompting Policy</a></h3>
      <p>把单条人类示教作为 behavior prompt,当前观察作为 query,用 in-context visuomotor policy 做新任务操作,并强调任务多样性是核心数据变量。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30457" target="_blank" rel="noreferrer">arXiv</a><a href="https://behavior-prompting.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>KEYPOSE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29028" target="_blank" rel="noreferrer">Keypose Exploration</a></h3>
      <p>用 VLM 做语义事件检测 + 轨迹分析自动标注 keypose,再借 reachability map 过滤候选关键位姿,探索跨 embodiment 迁移。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29028" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/YupuLu/keypose_labelling" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>BC</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29201" target="_blank" rel="noreferrer">Behavior Uncloning</a></h3>
      <p>把不想要的行为模式从 BC policy 权重中“重定向”出去,避免重新清洗全量数据或上线时增加 steering 开销,还覆盖 Diffusion Policy 与 Pi0.5 VLA。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29201" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>OFFLINE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29898" target="_blank" rel="noreferrer">Critical Interval MSE</a></h3>
      <p>只在任务关键片段上算动作误差,并做 rollout-time 行为对齐,试图让 offline validation loss 更接近真实机器人成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29898" target="_blank" rel="noreferrer">arXiv</a><a href="https://ci-mse.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>RL</span><span>DATA QUALITY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29834" target="_blank" rel="noreferrer">STEAM</a></h3>
      <p>用自监督 temporal-offset ensemble 给真实机器人轨迹打 frame-level advantage,从混合质量数据里识别停滞、失败和恢复片段。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29834" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>RETARGET</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29940" target="_blank" rel="noreferrer">WARP</a></h3>
      <p>离线把人类姿态 retarget 成唯一、精确的 whole-body mobile manipulation action,目标是减少 embodiment gap 导致的动作多模态。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29940" target="_blank" rel="noreferrer">arXiv</a><a href="https://warp-retarget.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>CONTROL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28476" target="_blank" rel="noreferrer">FADA</a></h3>
      <p>少量目标域样本对齐 humanoid dynamics,用 Planner-IDM 三阶段框架解决 terrain、payload、actuator response 带来的控制迁移偏差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28476" target="_blank" rel="noreferrer">arXiv</a><a href="https://lecar-lab.github.io/FADA-humanoid/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>VLA DATA</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.30645" target="_blank" rel="noreferrer">VLK</a></h3>
      <p>在重建场景中合成 egocentric image、language command 与 humanoid-compatible kinematic trajectory,补人形 loco-manipulation 监督缺口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.30645" target="_blank" rel="noreferrer">arXiv</a><a href="https://vision-language-kinematics.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>POLICY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.29941" target="_blank" rel="noreferrer">Seeing Touch from Motion</a></h3>
      <p>统一 optical tactile raw image 与 motion field,建模 tactile motion correlation,面向接触丰富任务里的细粒度接触状态提取。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.29941" target="_blank" rel="noreferrer">arXiv</a><a href="https://shengqi77.github.io/Seeing-Touch-from-Motion/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-06-29</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今天最值得盯三条线:VLA 的状态/空间 grounding 与冗余压缩;WAM/视频世界模拟器的物理一致性与长时记忆;数据侧从 teleop 清洗、real-to-sim 场景生成扩展到云原生仿真基础设施。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27872" target="_blank" rel="noreferrer">S²-VLA</a></h3>
      <p>用 belief state 跟踪长程任务阶段,动态融合视觉、语言意图和动作序列,补 VLA 长程操作中的累计误差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27872" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27677" target="_blank" rel="noreferrer">DiM-WAM</a></h3>
      <p>给 world-action model 加多尺度历史事件记忆和进度监督,针对长程任务中的遗忘与阶段感知不足。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27677" target="_blank" rel="noreferrer">arXiv</a><a href="https://wangkai-casia.github.io/dim-wam/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>SIM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28128" target="_blank" rel="noreferrer">PhysisForcing</a></h3>
      <p>用物理信息区域的像素/语义特征监督强化机器人视频世界模拟器,关注接触与物体运动的一致性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28128" target="_blank" rel="noreferrer">arXiv</a><a href="https://dagroup-pku.github.io/PhysisForcing.github.io/#" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/DAGroup-PKU/PhysisForcing" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>SIM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28276" target="_blank" rel="noreferrer">SimFoundry</a></h3>
      <p>从视频自动构建 real-to-sim 场景与 digital cousins,用于策略学习、泛化与仿真评测。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28276" target="_blank" rel="noreferrer">arXiv</a><a href="https://research.nvidia.com/labs/gear/simfoundry/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>BC</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28320" target="_blank" rel="noreferrer">WARP-RM</a></h3>
      <p>自监督学习 dense relative progress reward,再用 WARP-BC 上调高优势 action chunk,服务混合质量 teleop 数据清洗。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28320" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28133" target="_blank" rel="noreferrer">Translation as a Bridging Action</a></h3>
      <p>用相对 wrist translation 作为人类到双臂机器人的共享动作桥,避开手指接触差异与 6DoF 人手噪声。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28133" target="_blank" rel="noreferrer">arXiv</a><a href="https://translation-as-a-bridging-action.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>3D</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27663" target="_blank" rel="noreferrer">Direct Action-Head Injection of a Grounded 3D Point</a></h3>
      <p>把 grounded 3D point 直接注入 action head,而不是只做语言/视觉 prompt,用轻量模块提升空间与任务泛化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27663" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>EFFICIENCY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27755" target="_blank" rel="noreferrer">Drop-Then-Recovery</a></h3>
      <p>系统测 VLA 模型冗余:语言 backbone 在标准操作任务里高度可删,视觉与 action pathway 则更敏感。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27755" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/s1ghhh/VLADrop" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>EDGE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27807" target="_blank" rel="noreferrer">SpikeVLA</a></h3>
      <p>把视觉编码、跨模态推理与动作策略都做成 spiking 架构,面向低功耗实时 embodied navigation/control。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27807" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLM</span><span>NAV</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27871" target="_blank" rel="noreferrer">LocalNav</a></h3>
      <p>把 frontier VLM 的空间语义推理蒸馏到 4B 本地 VLM,再用 RLVR/量化降低移动机器人 ObjectNav 延迟。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27871" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEX</span><span>COMPOSITION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28323" target="_blank" rel="noreferrer">DexCompose</a></h3>
      <p>通过 finger-level action ownership 与双残差模块复用已有灵巧手 policy,处理单手多任务组合中的动作冲突。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28323" target="_blank" rel="noreferrer">arXiv</a><a href="https://devon018.github.io/DexCompose-Webpage/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>BIMANUAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28192" target="_blank" rel="noreferrer">PA-BiCoop</a></h3>
      <p>把双臂动态分成 primary/auxiliary 角色,共享全局 encoder、分工 decoder,面向通用双臂协作操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28192" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>RL</span><span>DEX</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27475" target="_blank" rel="noreferrer">SCORE</a></h3>
      <p>real-to-sim-to-real policy improvement:用生成式 base policy 的 support 约束仿真 RL,减少 dynamics mismatch 带来的不可迁移动作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27475" target="_blank" rel="noreferrer">arXiv</a><a href="https://weirdlabuw.github.io/score/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>CONTACT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27581" target="_blank" rel="noreferrer">SceneBot</a></h3>
      <p>用 per-link contact labels 和 hindsight scene reconstruction 统一 free-space、地形穿越与接触丰富全身操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27581" target="_blank" rel="noreferrer">arXiv</a><a href="https://ericcsr.github.io/scenebot/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27676" target="_blank" rel="noreferrer">CWI</a></h3>
      <p>把上肢 manipulation MoCap 与下肢稳定 locomotion 解耦,再 distill 成仅依赖双手位姿与速度/高度命令的全身策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27676" target="_blank" rel="noreferrer">arXiv</a><a href="https://cwi-ral.github.io/CWI-RAL-Webpage" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>DATA</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27813" target="_blank" rel="noreferrer">Booster Lab</a></h3>
      <p>数据中心化 humanoid locomotion 管线:motion curation、real-to-sim 适配、AMP RL 与 sim-to-real 部署。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27813" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>INFRA</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27962" target="_blank" rel="noreferrer">Cloud-Native Simulation Infrastructure</a></h3>
      <p>面向具身智能训练、评测和数据采集的云原生仿真基础设施,强调弹性调度、容器化模拟和闭环数据优化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27962" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MOTION DATA</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28237" target="_blank" rel="noreferrer">Unleashing Infinite Motion</a></h3>
      <p>用 LLM prompt + video diffusion 生成四足机器人动作视频,再 lift 成 3D reference trajectory 训练真实 Go2 tracking policy。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28237" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/GaoLii/Quad-Imaginarium.git" target="_blank" rel="noreferrer">Data</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MULTI-AGENT</span><span>P2</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.28182" target="_blank" rel="noreferrer">LLawCo</a></h3>
      <p>从多智能体失败中抽取 cooperation laws,再写入 embodied agents 的 CoT,对应具身集体智能的协作行为建模。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.28182" target="_blank" rel="noreferrer">arXiv</a><a href="https://www.merl.com/research/highlights/LLawCo" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>RL</span><span>SAFETY</span><span>P2</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27766" target="_blank" rel="noreferrer">RS-Diffuser</a></h3>
      <p>用 distributional value critic 引导 diffusion planner,在 risky robot navigation 等任务里做风险敏感离线规划。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27766" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-06-26</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:今日新增明显偏“大系统”:ABC 把开放数据/训练/评测打通;WAM 进入 continual IL、触觉和幻觉诊断;VLA 侧集中在路由、test-time scaling、安全、阶段监督与物理反思。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>VLA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://abc.bot/" target="_blank" rel="noreferrer">Scalable Behavior Cloning with Open Data, Training, and Evaluation</a></h3>
      <p>ABC 开放 manipulation BC stack;ABC-130K 标称 3500 小时、13 万+ episode、195 个任务,值得放进数据 scaling 主线。</p>
      <div class="paper-ticket__links"><a href="https://abc.bot/abc.pdf" target="_blank" rel="noreferrer">Paper</a><a href="https://abc.bot/" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/amazon-far/abc" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27374" target="_blank" rel="noreferrer">World Action Models Enable Continual Imitation Learning with Recurrent Generative Replays</a></h3>
      <p>把 WAM 用作 recurrent generative replay,面向 continual imitation learning 的灾难遗忘与数据复用问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27374" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27355" target="_blank" rel="noreferrer">RouterVLA</a></h3>
      <p>把上线前 smoke test rollout 变成 frozen VLA experts 的路由监督;适合归入多专家 VLA 部署选择。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27355" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27295" target="_blank" rel="noreferrer">LA4VLA</a></h3>
      <p>Language-action pretraining 不看视觉先学动作先验,用于削弱视觉捷径、补足低层动作语言监督。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27295" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/MINT-SJTU/LA4VLA" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27268" target="_blank" rel="noreferrer">E-TTS</a></h3>
      <p>Embodied test-time scaling 框架,把 reasoning scaling 与 action scaling 接到历史感知迭代 refine 和 VLM verifier。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27268" target="_blank" rel="noreferrer">arXiv</a><a href="https://27yw.github.io/E-TTS-Web/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>BENCH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27079" target="_blank" rel="noreferrer">ForesightSafety-VLA</a></h3>
      <p>13 类安全 taxonomy 的 VLA 诊断基准,把物理交互、指令侧、感知侧风险拆开评测。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27079" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27326" target="_blank" rel="noreferrer">Hallucination in World Models is Predictable and Preventable</a></h3>
      <p>围绕低覆盖 state-action 区域的 world model hallucination,并给出 MMBench2 数据和覆盖感知缓解策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27326" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>HUMANOID</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27239" target="_blank" rel="noreferrer">HumanoidUMI</a></h3>
      <p>用 VR 与 UMI-like gripper 做 robot-free humanoid whole-body 数据采集,重点在从人类关键点到全身控制的桥接。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27239" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>TACTILE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26663" target="_blank" rel="noreferrer">Tactile-WAM</a></h3>
      <p>把触觉未来状态纳入 WAM,并用 tactile asymmetric attention 处理视频 token 对触觉预测的污染。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26663" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27146" target="_blank" rel="noreferrer">PhysReflect-VLA</a></h3>
      <p>执行时加入物理可行性判断、动作解释与 LLM self-reflection,目标是提高闭环 VLA 的可靠性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27146" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>MOE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27144" target="_blank" rel="noreferrer">PAMAE</a></h3>
      <p>把单一 flow-matching action expert 换成 phase-aware sparse MoE,对应“任务阶段一致性”的动作生成问题。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27144" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DATA</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26801" target="_blank" rel="noreferrer">Structured Stage and Keyframe Supervision</a></h3>
      <p>StaKe 用 gripper state 自动构造阶段分类和关键帧预测辅助监督,专治 gripper-event 附近失败。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26801" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>BENCH</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26443" target="_blank" rel="noreferrer">WatchAct</a></h3>
      <p>视频 + 语言 + 对齐仿真场景 + 可执行 LIBERO task,用于“看人类行为再操作”的 behavior-grounded benchmark。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26443" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>AGENT</span><span>VLA 相关</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27251" target="_blank" rel="noreferrer">OmniAct</a></h3>
      <p>面向 everyday physical autonomy 的异步层级 agent 架构,把 planner、memory、verification 和 cyber-physical action space 组合起来。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27251" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DEX</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2606.27325" target="_blank" rel="noreferrer">DexAC-WM</a></h3>
      <p>重新审视高 DoF dexterous action conditioning,避免把异质动作维度做粗糙统一聚合。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.27325" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MANIP</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26423" target="_blank" rel="noreferrer">CoStream</a></h3>
      <p>把复杂接触丰富操作拆成可组合 simple behaviors,对 GPU 插槽等长程装配任务有启发。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26423" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>MANIP</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26603" target="_blank" rel="noreferrer">Handheld + Teleoperated Supervision via State-Gated Experts</a></h3>
      <p>指出 UMI-style handheld 数据在 free-space 有效但接触阶段可能失真,用 state-gated experts 混合 targeted teleop。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26603" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>DATA</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26855" target="_blank" rel="noreferrer">Humanoid-DART</a></h3>
      <p>用 diffusion trajectory generation + RL tracking 扩展稀疏示范,面向人形 loco-manipulation 技能扩增。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26855" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>CONTROL</span><span>P2</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26588" target="_blank" rel="noreferrer">ReStruct</a></h3>
      <p>inference-time 通过 task-structure reconfiguration 做机器人行为 steering,不改权重但引入物理可行性约束。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26588" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>WAM 相关</span><span>P2</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2606.26201" target="_blank" rel="noreferrer">OmniContact</a></h3>
      <p>用 contact flow 串联 humanoid loco-manipulation meta-skills,可作为接触表示与恢复策略样本。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2606.26201" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<div class="paper-day-heading">2026-06-25</div>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>本期判断</strong>:VLA 聚焦后训练/跨本体/几何/部署;WAM 扩到导航、人形和价值评估;DATA 标出合成、筛选、动作标签和数据引擎。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/insight">InSight</a></h3>
      <p>可 steer 的 primitive VLA + 自主发现缺失技能,把“补数据”变成按技能缺口闭环。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/insight">细读</a><a href="https://arxiv.org/abs/2606.24884" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/g3vla">G³VLA</a></h3>
      <p>把相机内参、射线和投影关系显式注入多视角 VLA,补齐“多相机但不懂几何”的短板。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/g3vla">细读</a><a href="https://arxiv.org/abs/2606.24472" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/learning-action-priors">Learning Action Priors</a></h3>
      <p>先学习跨本体 action prior,再接视觉语言条件,适合放进跨机器人动作迁移主线。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/learning-action-priors">细读</a><a href="https://arxiv.org/abs/2606.26095" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/force-vla">FORCE</a></h3>
      <p>VLA reinforcement fine-tuning 候选,把纯模仿学习继续推向在线强化微调。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/force-vla">细读</a><a href="https://arxiv.org/abs/2606.26006" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/road-vla">ROAD-VLA</a></h3>
      <p>online post-training + self-distillation,对应部署分布下的持续自适应问题。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/road-vla">细读</a><a href="https://arxiv.org/abs/2606.25800" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>DATA</span><span>P0</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/wam/papers/world-value-models">World Value Models</a></h3>
      <p>把 world model 接到 value estimation,用于任务进展判断与混合质量数据筛选。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/wam/papers/world-value-models">细读</a><a href="https://arxiv.org/abs/2606.24742" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/action-controlnet">Action ControlNet</a></h3>
      <p>处理慢 VLA 推理与高频机器人控制之间的异步错位,偏部署和控制稳定性。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/action-controlnet">细读</a><a href="https://arxiv.org/abs/2606.25985" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/reflective-vla">Reflective VLA</a></h3>
      <p>把 observation-action-consequence 组织进上下文,与记忆增强和反思式策略相邻。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/reflective-vla">细读</a><a href="https://arxiv.org/abs/2606.25215" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/space">SPACE</a></h3>
      <p>用 Cartesian state delta 统一跨机器人动作表示,再通过 adapter 落到具体本体。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/space">细读</a><a href="https://arxiv.org/abs/2606.24049" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>DATA</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/supervise-what-survives">Supervise What Survives</a></h3>
      <p>生成机器人视频只用于几何监督,不把合成视频硬转成伪动作标签。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/supervise-what-survives">细读</a><a href="https://arxiv.org/abs/2606.24448" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/wam/papers/navwm">NavWM</a></h3>
      <p>导航 world model:生成多路径候选并用未来视觉想象做 foresight 评估。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/wam/papers/navwm">细读</a><a href="https://arxiv.org/abs/2606.24101" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/wam/papers/motionwam">MotionWAM</a></h3>
      <p>把 WAM 推向人形实时全身移动操作,与 WOLF-VLA 形成 VLA/WAM 对照。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/wam/papers/motionwam">细读</a><a href="https://arxiv.org/abs/2606.09215" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>P1</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/wam/papers/omega-eva">ω-EVA</a></h3>
      <p>Envision-Verify-Act 闭环,在执行前用潜在世界模型设想并验证动作后果。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/wam/papers/omega-eva">细读</a><a href="https://arxiv.org/abs/2606.09457" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>P2</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/wolf-vla">WOLF-VLA</a></h3>
      <p>whole-body humanoid VLA 候选,把 VLA 从桌面操作扩到人形移动操作。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/wolf-vla">细读</a><a href="https://arxiv.org/abs/2606.25591" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA 相关</span><span>P2</span><span class="paper-status paper-status--done">已细读</span></div>
      <h3><a href="/embodied-ai-learning/vla/papers/svp-il">SVP-IL</a></h3>
      <p>spatial visual prompts 作为更细的模仿学习接口,与可操控策略和空间接地相关。</p>
      <div class="paper-ticket__links"><a href="/embodied-ai-learning/vla/papers/svp-il">细读</a><a href="https://arxiv.org/abs/2606.25360" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>
<div class="daily-paper-section daily-paper-section--data">
  <div class="daily-paper-section__head">
    <span>具身数据轨道</span>
    <p>这里补上数据方向的入口:它们不一定都是“模型范式”论文,但决定数据怎么采、怎么合成、怎么筛、怎么变成可训练监督。完整目录见 <a href="/embodied-ai-learning/vla/papers/embodied-data-papers">具身数据论文索引</a>。</p>
  </div>
  <div class="paper-data-list">
    <article class="paper-data-item">
      <div><span>DATA · P0</span><h3><a href="/embodied-ai-learning/wam/papers/robodream">RoboDream</a></h3></div>
      <p>世界模型作数据合成引擎,减少真机数据需求。</p>
      <a href="https://arxiv.org/abs/2606.02577" target="_blank" rel="noreferrer">arXiv</a>
    </article>
    <article class="paper-data-item">
      <div><span>DATA · WAM · P0</span><h3><a href="/embodied-ai-learning/wam/papers/qwen-robotworld">Qwen-RobotWorld</a></h3></div>
      <p>语言条件视频世界模型,服务合成数据、评测和规划。</p>
      <a href="https://arxiv.org/abs/2606.17030" target="_blank" rel="noreferrer">arXiv</a>
    </article>
    <article class="paper-data-item">
      <div><span>DATA · WAM · P1</span><h3><a href="/embodied-ai-learning/wam/papers/ge-sim-2">GE-Sim 2.0</a></h3></div>
      <p>闭环视频世界模拟器,给策略评估与过滤式 BC 提供数据引擎。</p>
      <a href="https://arxiv.org/abs/2605.27491" target="_blank" rel="noreferrer">arXiv</a>
    </article>
    <article class="paper-data-item">
      <div><span>DATA · WAM · P1</span><h3><a href="/embodied-ai-learning/wam/papers/world-value-models">World Value Models</a></h3></div>
      <p>判断任务进展与数据质量,筛掉次优/失败轨迹。</p>
      <a href="https://arxiv.org/abs/2606.24742" target="_blank" rel="noreferrer">arXiv</a>
    </article>
    <article class="paper-data-item">
      <div><span>DATA · VLA · P1</span><h3><a href="/embodied-ai-learning/vla/papers/supervise-what-survives">Supervise What Survives</a></h3></div>
      <p>只抽取可靠几何监督,不硬造伪动作标签。</p>
      <a href="https://arxiv.org/abs/2606.24448" target="_blank" rel="noreferrer">arXiv</a>
    </article>
  </div>
</div>

## 候选池

<div class="paper-pipeline">
  <div>
    <span class="paper-pipeline__label">待细读</span>
    <p>暂无。下一轮每日采收时,强相关但尚未写细读的论文先进入这里。</p>
  </div>
  <div>
    <span class="paper-pipeline__label">观察</span>
    <p>用于记录“可能重要,但还缺代码/项目页/足够信息”的论文。</p>
  </div>
  <div>
    <span class="paper-pipeline__label">暂缓 / 排除</span>
    <p>暂缓保留原因;排除用于记录泛 AI、弱相关或重复投稿,避免反复采收。</p>
  </div>
</div>

## 更新口径

- **P0**:强相关且会改变本站主线判断,优先细读。
- **P1**:值得收录,但可以短细读或观察级进入。
- **P2**:相关方向样本,用于补齐谱系边界。
- **已细读**:已有站内页面,但不代表全部结论已独立复现;定量仍按各页 ⚠️ / 待核 标注。
- **待细读**:已经确认值得看,但尚未成稿。
