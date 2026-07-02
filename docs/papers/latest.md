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
    <span class="latest-paper-hero__eyebrow">PAPER RADAR · 2026-07-02</span>
    <p class="latest-paper-hero__title">7 月 2 日 · VLA / WAM / DATA-EVAL / HUMANOID-TACTILE</p>
    <p class="latest-paper-hero__text">今日 arXiv cs.RO new 53 篇 + cross-list/replacement 41 篇中筛出 22 篇强相关候选;VLA 继续围绕组合泛化、单样本域适配和长程双臂装配展开,WAM 明显转向 3D/4D 结构化预测和可替代实机评测的神经模拟器,触觉预训练与接触灵巧操作仍在加速。</p>
  </div>
  <div class="latest-paper-stats" aria-label="论文队列统计">
    <span><b>22</b>今日新增</span>
    <span><b>0</b>已细读</span>
    <span><b>5</b>VLA</span>
    <span><b>5</b>WAM</span>
    <span><b>6</b>DATA/EVAL</span>
    <span><b>6</b>HUMANOID/TACTILE</span>
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
