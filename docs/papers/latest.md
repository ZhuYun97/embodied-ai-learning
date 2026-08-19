---
title: 每日最新论文
description: VLA / WAM / 具身数据每日新论文候选池,按日期记录最新 arXiv 与公开论文,标注已细读、待细读、观察、暂缓和排除状态,作为新闻与正式论文细读之间的收录队列。
aside: false
sidebar: false
pageClass: paper-radar-page
---

<header class="paper-brief">
  <div class="paper-brief__lead">
    <div class="paper-brief__meta"><span>DAILY BRIEF</span><time datetime="2026-08-19">2026.08.19</time></div>
    <h1>每日论文雷达</h1>
    <p class="paper-brief__dek">今日筛出 15 篇强相关候选，聚焦层级 VLA 与通用 WAM、策略安全和后训练、接触数据、力触觉控制及人形长程任务。</p>
    <dl class="paper-brief__stats" aria-label="论文队列统计">
      <div><dt>候选</dt><dd data-paper-stat="latest">15</dd></div>
      <div><dt>P0</dt><dd data-paper-stat="p0">6</dd></div>
      <div><dt>已细读</dt><dd data-paper-stat="done">0</dd></div>
      <div><dt>更新</dt><dd data-paper-stat="date">08.19</dd></div>
    </dl>
    <nav class="paper-brief__links" aria-label="相关研究入口">
      <a href="/embodied-ai-learning/autoresearch/">论文 Ideas</a>
      <a href="/embodied-ai-learning/news/">具身新闻</a>
      <a href="/embodied-ai-learning/vla/papers/timeline">发展时间线</a>
    </nav>
  </div>
  <section class="paper-brief__signals" aria-labelledby="paper-brief-signals">
    <div class="paper-brief__signals-head"><h2 id="paper-brief-signals">今日信号</h2><span>04</span></div>
    <ol>
      <li><span class="paper-brief__no">01</span><span class="paper-brief__track">HIERARCHICAL VLA</span><strong>用世界模型和测试时搜索扩展长程子任务决策算力</strong><span class="paper-brief__paper">τ₀-VLA</span></li>
      <li><span class="paper-brief__no">02</span><span class="paper-brief__track">GENERALIST WAM</span><strong>以像素动作流统一跨具身预测、评测与控制</strong><span class="paper-brief__paper">Hydra-0</span></li>
      <li><span class="paper-brief__no">03</span><span class="paper-brief__track">SAFE VLA</span><strong>把任务成功与接触安全规范拆开并用运行时自动机核验</strong><span class="paper-brief__paper">ManiGuard</span></li>
      <li><span class="paper-brief__no">04</span><span class="paper-brief__track">CONTACT DATA</span><strong>用视觉、力矩、触觉和人类配对示范补齐工业接触数据</strong><span class="paper-brief__paper">PRISM</span></li>
    </ol>
  </section>
</header>

<div class="paper-filter-panel" data-paper-filter-panel>
  <div class="paper-filter-panel__top">
    <label class="paper-filter-search">
      <span class="visually-hidden">搜索论文</span>
      <i aria-hidden="true"></i>
      <input type="search" data-paper-search placeholder="搜索标题、摘要或标签…" autocomplete="off" />
      <kbd>/</kbd>
    </label>
    <div class="paper-filter-panel__head">
      <span>RESEARCH INBOX</span>
      <output data-paper-filter-count aria-live="polite">显示 494 篇</output>
    </div>
    <button type="button" class="paper-filter-clear" data-paper-filter-clear hidden>清除筛选</button>
  </div>
  <div class="paper-filter-row">
    <span class="paper-filter-row__label">方向</span>
    <div class="paper-filter-panel__controls" role="group" aria-label="按研究方向筛选">
      <button type="button" class="paper-filter-chip is-active" data-paper-filter-group="track" data-paper-filter="all">全部方向</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="track" data-paper-filter="vla">VLA</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="track" data-paper-filter="wam">WAM</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="track" data-paper-filter="data">DATA/EVAL</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="track" data-paper-filter="humanoid">HUMANOID</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="track" data-paper-filter="tactile">TACTILE</button>
    </div>
  </div>
  <div class="paper-filter-row">
    <span class="paper-filter-row__label">优先级 / 状态</span>
    <div class="paper-filter-panel__controls" role="group" aria-label="按优先级和状态筛选">
      <button type="button" class="paper-filter-chip is-active" data-paper-filter-group="status" data-paper-filter="any">全部状态</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="status" data-paper-filter="p0">P0 优先</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="status" data-paper-filter="todo">待细读</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="status" data-paper-filter="done">已细读</button>
      <button type="button" class="paper-filter-chip" data-paper-filter-group="status" data-paper-filter="watch">观察</button>
    </div>
  </div>
</div>

<h2 id="papers-2026-08-19" class="paper-day-heading">2026-08-19</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 τ₀-VLA × Hydra-0 × ManiGuard × FetchMan × PRISM × Prism-GRPO：从长程推理、跨具身世界建模、规范安全、仿真数据、接触数据到 VLA 后训练，检查通用机器人策略的完整扩展闭环。</p>
  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured"><div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>40,115H DATA</span><span>TEST-TIME SEARCH</span><span>MULTI-EMBODIMENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.16885" target="_blank" rel="noreferrer">τ₀-VLA: a Hierarchical Robot Foundation Model with World-Model-Guided Test-Time Computation</a></h3><p>高层策略结合执行记忆生成子任务，并按难度用世界模型搜索候选后再提交，低层策略跨多种具身执行；以 40,115 小时异构真机数据训练，测试时算力扩展可提升分布内外的子任务预测与长程闭环成功率。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.16885" target="_blank" rel="noreferrer">arXiv</a><a href="https://tau0-vla.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>ACTION FLOW</span><span>CROSS-EMBODIMENT</span><span>INVERSE MODE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.18077" target="_blank" rel="noreferrer">Hydra-0: Action Flow for Generalist World Modeling and Control</a></h3><p>把机器人动作表示为像素运动的 action flow，使世界模型跨具身、任务、环境与视频生成骨干共享控制接口；除动作后果预测和开环评测外，还出现从人类示范目标物体流反推动作并映射到可执行控制的逆模式。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.18077" target="_blank" rel="noreferrer">arXiv</a><a href="https://nvidia-isaac.github.io/video_to_data/hydra-0/" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>SAFETY BENCH</span><span>8K DEMOS</span><span>23K ROLLOUTS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17386" target="_blank" rel="noreferrer">MANIGUARD: A Benchmark and Data Suite for Specification-Grounded Safety Evaluation and Improvement of Robotic Manipulation</a></h3><p>以独立于任务成功的 LTLf 安全规范构建 200 个接触任务、1,000 个分布偏移场景和 8,000 条安全标注示范；超过 2.3 万次 VLA rollout 显示 6–21% 的成功执行仍违反规范，且单纯扩充示范不能消除缺口。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17386" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>150K SCENES</span><span>FLOW-GRPO</span><span>ZERO-SHOT G1</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17027" target="_blank" rel="noreferrer">FetchMan: Learning Visual Humanoid Loco-Manipulation Policies from Simulated Experiences</a></h3><p>在 15 万场景中生成行走抓取示范，发现行为克隆的数据规模扩展很快触顶，再用稀疏奖励 Flow-GRPO 突破上限；零样本部署到 Unitree G1，在未见场景完成走近并抓取，真机成功率 73.3%。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17027" target="_blank" rel="noreferrer">arXiv</a><a href="https://orayyan.com/fetchman" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>5K+ TRAJECTORIES</span><span>FORCE + TACTILE</span><span>INDUSTRIAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17962" target="_blank" rel="noreferrer">PRISM: Precision and contact-rich Real-world Industrial Skill Dataset with Multimodal Sensing</a></h3><p>面向 25 类以上精密工业操作发布 5,000 余条机器人轨迹与配对人类示范、总计 45 小时；同步记录多视角 RGB-D、六维力矩、触觉和本体状态，为高精度接触控制补上区别于家庭短程抓放的数据基准。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17962" target="_blank" rel="noreferrer">arXiv</a><a href="https://tengbo-yu.github.io/PRISM/" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>VLA RL</span><span>QUALITY SIGNAL</span><span>56% FEWER ROLLOUTS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17423" target="_blank" rel="noreferrer">Prism-GRPO: Faster VLA Policy Optimization via Splitting Same-outcome Groups</a></h3><p>在二元成败之外加入轨迹级执行质量，把全成或全败、原本零优势而被丢弃的 rollout 组拆出训练信号，同时保证成功始终优于失败；RoboTwin 达到目标成功率最多少用 56% rollout，并抑制奖励投机后迁移到真机。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17423" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>CODE POLICY</span><span>TRAINING-FREE</span><span>RECOVERY LOOP</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.16978" target="_blank" rel="noreferrer">VLCP: Vision Language Control Policy Closed-Loop Code Replanning for Robot Manipulation</a></h3><p>冻结 VLM 直接编写 Python 控制函数，并每隔 K 步根据多视角、状态和状态差量重写失败代码；57 个任务汇总成功率由单次开放环查询的 3.5% 升至 35.1%，失败抓取可在同一 episode 内恢复。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.16978" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>SKILL LIBRARY</span><span>EXPERIENCE MEMORY</span><span>NO RETRAINING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17209" target="_blank" rel="noreferrer">Teach and Grow: An Agent-Centered Architecture for General Robot Learning</a></h3><p>多模态 agent 将少量成功示范诱导为可复用 Skill Blocks，在新场景组合技能与几何工具，并把成功、失败和修复写入经验记忆；新任务无需任务级策略重训，且提出以有效可复用经验衡量教学需求的扩展律假设。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17209" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--tactile"><div class="paper-ticket__meta"><span>FAST-SLOW REFLEX</span><span>FORCE CONTROL</span><span>FROZEN POLICY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17432" target="_blank" rel="noreferrer">UniReflex: Plug-and-Play Force Control for Pretrained Generative Policies via Fast-Slow Reflex</a></h3><p>从冻结生成策略的动作头潜表示驱动快速反射网络，预测各向异性刚度方向，并以门控在位置规划和力主导执行间切换；无需慢骨干微调即可改善真机双臂接触稳定性，反向延迟低 25–66 倍。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17432" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>STEREO VLA</span><span>PROPRIO ROUTING</span><span>33-DOF HUMANOID</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17453" target="_blank" rel="noreferrer">EATR-Stereo: Embodiment-Aware Routing of Paired Stereo Evidence for Humanoid Vision-Language-Action Control</a></h3><p>保留预训练 VLA 主视角 token，同时用本体历史选择性路由对齐后的辅助立体证据；33 自由度真机人形在百秒级搜索—接近—抓取—放置任务取得 60% 全程成功，严重非对称遮挡下恢复率达 80%。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17453" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>TEST-TIME AUGMENT</span><span>HEADROOM</span><span>RETRIEVAL GAP</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17484" target="_blank" rel="noreferrer">Reuse Before You Retrieve: Diagnosing Headroom and Complementarity for Test-Time Augmentation of Embodied Multimodal Policies</a></h3><p>用“可恢复余量”和“检索互补性”判断冻结 VLA 应多采样自身行为还是引入外部示范；episode 级重试选择在多种骨干上最多恢复 21 个成功率点，而检索只在动作先验缺口较大时收益明显。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17484" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>SYSTEM-2 AGENT</span><span>INTERRUPTIBLE</span><span>UNITREE G1</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17584" target="_blank" rel="noreferrer">HODAgent: Towards On-Demand, Responsive Humanoids for Physical World Human Interaction</a></h3><p>以半双工的环境交互、规划、执行和层级记忆维持服务任务状态，使人形在运动中接受新请求、保留进度、改写计划并核验结果；Unitree G1 真机原子、组合和完整任务通过率分别为 92%、72% 和 63.3%。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17584" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>VISUAL CUES</span><span>VLA SAFETY</span><span>7 MODELS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17600" target="_blank" rel="noreferrer">LIBERO-VIFO: Benchmarking the Capability and Safety of Visual Cue Following in Vision-Language-Action Models</a></h3><p>用八类视觉线索和四套协议分开测试授权线索跟随与未授权跟随；七种 VLA 的线索理解并不稳定转化为执行，却能在无语言指令时执行线索指向任务，揭示新的视觉注入安全面。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17600" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--tactile"><div class="paper-ticket__meta"><span>TACTILE-ONLY</span><span>6-DOF POSE</span><span>ALLEGRO V5</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17601" target="_blank" rel="noreferrer">Physics-Informed Sliding-Window Particle Filtering for Tactile-Only In-Hand 6-DoF Object Pose Refinement</a></h3><p>以接触距离、力方向、摩擦锥和零力负证据构造 SE(3) 粒子滤波似然，并用滑窗与对称性感知重采样维持多峰信念；在 Allegro Hand V5 遮挡场景中优于触觉几何及学习基线。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17601" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>MG-VQA</span><span>ACTIVE MANIPULATION</span><span>SIM-TO-REAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.17129" target="_blank" rel="noreferrer">PROBE: Manipulation-Grounded Visual Question Answering with VLM Agents</a></h3><p>把必须移动遮挡物后才能回答的问题定义为操作扎根 VQA，提供 150 个仿真任务、抓推工具和 agent 蒸馏配方；工具型前沿 VLM 平均优于纯感知 8 点，微调 agent 再提升 11.5 点并完成真机迁移。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.17129" target="_blank" rel="noreferrer">arXiv</a></div></article>
  </div>
</div>

<h2 id="papers-2026-08-17" class="paper-day-heading">2026-08-17</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 hint² × BICPO-VLA × AdvDex × PRM-as-a-Judge 1.5 × Reflex：分别检查长程约束、异步交接、跨具身数据、过程级评测和动态反应如何补齐 VLA 部署闭环。</p>
  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured"><div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>HIERARCHICAL WM</span><span>LTL GUIDANCE</span><span>REAL UR5E</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13678" target="_blank" rel="noreferrer">hint²: Hierarchical World Models for Inference-Time Temporal Logic Guidance</a></h3><p>用高层世界模型预测动作引发的任务谓词转移、低层动力学模型预测即时状态演化，在推理时共同引导短动作块满足长程 LTL 规范；在 CALVIN 超过既有引导方法，并在真实 UR5e 完成含活性与安全约束的复杂指令。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13678" target="_blank" rel="noreferrer">arXiv</a><a href="https://anonymous-hint2.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>ASYNCHRONOUS VLA</span><span>FLOW-DPO</span><span>HANDOFF STATE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13924" target="_blank" rel="noreferrer">BICPO-VLA: Behavior-Identified Continuation Preference Optimization for Smooth Asynchronous Vision-Language-Action Control</a></h3><p>先识别请求时刻的目标行为，再以 Haar 子空间分解加速动作块生成，最后把已执行旧动作滚动到真实交接状态并做行为匹配的 Flow-DPO，联合处理推理延迟、状态漂移和动作不连续。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13924" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>HUMAN + ROBOT DATA</span><span>TACTILE</span><span>JOINT-ALIGNED ACTION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.14028" target="_blank" rel="noreferrer">AdvDex: Learning Dexterous Manipulation from Human Demonstrations via Joint-Aligned Actions and Adversarial Learning</a></h3><p>发布含运动学与触觉监督的人类操作数据 OmniShare，并以 SE(3) 腕位姿加 15 个手指关节统一人手、灵巧手和夹爪动作；域对抗表征支持零样本人到机器人迁移及少样本适配。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.14028" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>PROCESS REWARD</span><span>DENSE PROGRESS</span><span>ROBOPULSE++</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.14284" target="_blank" rel="noreferrer">PRM-as-a-Judge 1.5: A Toolkit for Robot Process Assessment</a></h3><p>把 rollout 视频转为稠密进度曲线，并从失败侧进展、回撤后恢复和成功侧执行质量细分机器人能力；同时发布 RoboPulse++ 检验过程奖励模型可靠性与可复现评测工具。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.14284" target="_blank" rel="noreferrer">arXiv</a><a href="https://prm-as-a-judge.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>REACTION-CRITICAL</span><span>LATENCY BENCH</span><span>LATENT FUTURE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.14379" target="_blank" rel="noreferrer">Reflex: Enabling Fast and Predictive Vision-Language-Action Models for Reaction-Critical Manipulation</a></h3><p>ReflexBench 以六类动态任务和可配置同步/异步延迟补足静态操作评测；ReflexVLA 用潜在未来预测、多帧融合、批量视觉编码与 CUDA Graph 回放提升动态成功率，并完成真机验证。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.14379" target="_blank" rel="noreferrer">arXiv</a><a href="https://reflexvla.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>TOOL-INJECTION</span><span>30K TRAJECTORIES</span><span>AGENTIC VLA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.14047" target="_blank" rel="noreferrer">Evolve Vision-Language-Action Model into an Agent with On-the-fly Tool-use</a></h3><p>ART 为任意 VLA 注入低层视觉、高层 affordance 和具身增强工具，以 3 万条工具调用轨迹训练长程推理；仿真和真机平均成功率较主流基线提升 20%，同时降低动作搜索与数据需求。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.14047" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>FLAT OBJECTS</span><span>DEFORMABLE</span><span>SIM BENCHMARK</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.14049" target="_blank" rel="noreferrer">FlatLab: A Unified Methodology Framework and Simulation-Based Benchmark for Robotic Manipulation of Flat Objects</a></h3><p>针对薄片物体难抓取与材质变化，拆分策略生成和动作原语执行，并提供覆盖刚性、可变形物体的高保真仿真、多模态采集、标准任务与评测协议。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.14049" target="_blank" rel="noreferrer">arXiv</a><a href="https://flatlab-web.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>FAILURE DIAGNOSIS</span><span>ONTOLOGY</span><span>VERIFIED REPAIR</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div><h3><a href="https://arxiv.org/abs/2608.13901" target="_blank" rel="noreferrer">Ontology-Grounded World Models for Failure Diagnosis and Closed-Loop Repair in Physical AI Systems</a></h3><p>在事件视觉世界模型之上增加类型化谓词、纠错路由和验证门控，把失败条件保留为可执行诊断记录；在 LIBERO-Plus 报告 85% 总成功率，但尚未单独量化本体模块贡献或真机恢复。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13901" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>ACTIVE EVALUATION</span><span>FAILURE COVERAGE</span><span>PAIRED SYSTEMS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13719" target="_blank" rel="noreferrer">Coverage Aware Active Evaluation for Failure Discovery with Paired Systems</a></h3><p>用廉价代理系统的大量评测和少量目标系统结果学习残差风险，再以支持度感知互信息兼顾真实度与失败多样性；在驾驶、操作和四足任务发现的严重失败最多达到基线两倍。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13719" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>ACTIVE PERCEPTION</span><span>AMBIGUITY</span><span>REAL ROBOT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13605" target="_blank" rel="noreferrer">Active Perception for Embodied Disambiguation</a></h3><p>让机器人在遮挡、受限视角或文字不可读时主动换位观察，由 VLM 基于累计证据决定继续观察、向用户澄清或完成目标选择；真机实验统一了物理取证与语言消歧。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13605" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--tactile"><div class="paper-ticket__meta"><span>ROBOTIC SKIN</span><span>PRESSURE + PROXIMITY</span><span>15K CYCLES</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.14406" target="_blank" rel="noreferrer">Effect of Twisted-Yarn Architecture on Pressure and Proximity Sensing Characteristics of Textile Capacitive Sensors for Robotic Skin</a></h3><p>系统比较一、二、四层银包覆绞纱的压力—接近感知权衡；四层结构在 100 kHz 达到最高灵敏度并稳定运行 1.5 万次，4×4 阵列集成机械臂后实现实时触碰与接近检测。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.14406" target="_blank" rel="noreferrer">arXiv</a></div></article>
  </div>
</div>

<h2 id="papers-2026-08-14" class="paper-day-heading">2026-08-14</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 RoboSynChallenge × Temporal GRPO × H2R-Bench × DreamX-Phi × ContactGuard × VLA Progress Probe：从数据生成、策略后训练、世界模拟到部署监控，检查具身模型的训练—评测—安全闭环。</p>
  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--data paper-ticket--featured"><div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>SYNTHETIC DATA</span><span>REAL-WORLD EVAL</span><span>VLA + WAM BASELINES</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.12416" target="_blank" rel="noreferrer">RoboSynChallenge: Mastering Real-World Dexterity via Generalizing Synthesized Manipulation Skills</a></h3><p>以大规模合成状态—动作试次训练通用操作策略，再只在未见真实环境完成最终评测；统一提供 Transformer、Diffusion、VLA 与 WAM 基线，为“合成数据是否真正提升真机泛化”建立可复现竞赛协议。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.12416" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>STAGE CREDIT</span><span>GRPO</span><span>ROBOTWIN 2.0</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13026" target="_blank" rel="noreferrer">Temporal GRPO: Beyond Trajectory-Level Credit in Vision-Language-Action Reinforcement Learning</a></h3><p>把任务拆成可检测阶段，将同阶段 rollout 的相对优势只施加到对应动作区间，避免后段失败惩罚前段正确行为；在 RoboTwin 2.0 提升成功率与样本效率，并在 LIBERO-Long 保留共享前置技能。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13026" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>HUMAN-TO-ROBOT</span><span>VIDEO WORLD MODEL</span><span>11 MODELS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13049" target="_blank" rel="noreferrer">H2R-Bench: Benchmarking Human-to-Robot Manipulation Video Generation in World Models</a></h3><p>以人类第一视角示范、目标机器人约束和接触/动作/物体响应标注评测 11 个视频生成模型，覆盖六类操作与两种具身；结果显示领先模型仍频繁破坏具身一致性、功能接触和任务完成。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13049" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>ACTION-CONDITIONED VIDEO</span><span>SE(3) CONTROL</span><span>WORLD ARENA 2.0</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13489" target="_blank" rel="noreferrer">DreamX-Phi 1.0: Action-Conditioned Video World Model for Robotic Manipulation</a></h3><p>用逐臂 SE(3) 几何编码约束动作路径，以深度分支和 SAM3/V-JEPA 教师维持场景几何与小物体一致性，再蒸馏为少步生成器；在 WorldArena 2.0 两赛道分列第一、第二。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13489" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>PRE-CONTACT MONITOR</span><span>LATENT FUTURE</span><span>ABORT SIGNAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13438" target="_blank" rel="noreferrer">ContactGuard: Pre-Contact Execution Monitoring with Action-Conditioned Latent World Models</a></h3><p>在即将接触前按策略动作块滚动预测多视角视觉潜变量，再用少量标注训练失败探针决定是否中止；无需修改底层策略即可在真实接触密集任务中把故障发现提前到物体被推、漏抓或滑落之前。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13438" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>MECH INTERP</span><span>TASK PROGRESS</span><span>OOD MONITOR</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13474" target="_blank" rel="noreferrer">Decoding Task Progress from VLA Representations</a></h3><p>从 π0.5 残差流用线性探针读出归一化剩余时间，信号在机器人数据训练前的 PaliGemma 骨干中已存在，并可泛化到未见任务；作为无标签 OOD 监控器可检测进度停滞，但尚不能有效引导策略。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13474" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>DEXTEROUS HAND</span><span>COPILOT TELEOP</span><span>NESTED POLICY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13362" target="_blank" rel="noreferrer">NestDex: Nested Policy Learning with Copilot Assisted Teleoperation for Dexterous Manipulation</a></h3><p>让操作者只控制手臂并以单自由度离合器调节已学习手部技能，视觉语言选择器负责阶段切换；由更稳定、完整的示范训练独立外层臂手策略，降低接触密集灵巧操作的数据采集负担。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13362" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>PHYSICS-GROUNDED VLN</span><span>4 HUMANOIDS</span><span>SIM-TO-REAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.12860" target="_blank" rel="noreferrer">HumanoidVLN: A Physics-Grounded Simulator and Benchmark for Vision-Language Navigation Across Diverse Humanoid Embodiments</a></h3><p>在 Isaac Sim 统一四种不同形态人形、真实动力学控制器与 933 条碰撞感知参考轨迹；四模型×四具身评测揭示 VLN、控制器和形态耦合，并用 Unitree G1 小规模实机验证仿真误差相关性。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.12860" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>153H MOTION</span><span>12K PREFERENCES</span><span>CONTACT QUALITY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13555" target="_blank" rel="noreferrer">HumanTracker: Towards Comprehensive and Human-Aligned Motion Tracking Benchmark</a></h3><p>以约 153 小时专业表演者动作扩展人形跟踪测试覆盖，并从 12K 对偏好训练 HumanScore；相较逐帧运动学误差，该指标更能捕捉足滑、错误接触和支撑不稳等人类显著感知的物理缺陷。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13555" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>ACTION-SUPERVISED ROI</span><span>DINOv3</span><span>DATA EFFICIENCY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13422" target="_blank" rel="noreferrer">Attention from Action, for Action: Emergent Visual Bottlenecks for Policy Learning</a></h3><p>Seeker 仅用动作监督从冻结 DINOv3 特征学习随任务进度变化的视觉 ROI，并用于 RGB 裁剪、背景增广和点云过滤；真机域内成功率从最佳基线 48.3% 提至 76.7%，视觉偏移下从 20% 提至 60%。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13422" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>EVENT-LEVEL WM</span><span>SURGICAL ROBOT</span><span>LONG HORIZON</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13103" target="_blank" rel="noreferrer">S2-HWM: Sparse Event-Structured Hierarchical World Model for Long-Horizon Surgical Robot Manipulation</a></h3><p>从原始潜轨迹学习稀疏事件证据，调度事件级管理器、原子动作 worker 与可变时长转移模型；SurRoL PegTransfer 成功率 98.7%，比扁平 DreamerV3 世界模型高 22.7 个百分点。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13103" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>ACTIVE PRACTICE</span><span>BUDGET OPTIMAL</span><span>LONG HORIZON</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div><h3><a href="https://arxiv.org/abs/2608.13415" target="_blank" rel="noreferrer">Deliberate Practice: Learning Robot Skills under a Budget</a></h3><p>把有限自主练习时间分配给既可在预算内掌握、又能解锁高累计回报计划的技能，并用双线性规划精确求解；仿真与真实长程操作表明，该策略能比启发式采样更有效地获取有用技能。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13415" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--tactile"><div class="paper-ticket__meta"><span>CONTACT + FORCE</span><span>EGOCENTRIC RGB</span><span>SIM-TO-REAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.13014" target="_blank" rel="noreferrer">EgoPHI: Estimating Contact and Force from Egocentric Vision</a></h3><p>从单目第一视角 RGB 和物体几何联合恢复手与物体网格上的稠密接触及三维力分布，用物理仿真扩充力监督，并以八名参与者、多个触摸和抓取类型的实体传感物体验证 sim-to-real。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.13014" target="_blank" rel="noreferrer">arXiv</a></div></article>
  </div>
</div>

<h2 id="papers-2026-08-13" class="paper-day-heading">2026-08-13</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 G0.5 × StellaVLA × RIFT × MiDAS × World Tokens × HandEdit：比较统一自回归、上下文适配、无 rollout 未来条件、单示范在线学习、训练期世界监督和人类视频数据迁移六条扩展 VLA 能力的路线。</p>
  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured"><div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>AUTOREGRESSIVE VLA</span><span>CROSS-EMBODIMENT TOKEN</span><span>REASONING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11739" target="_blank" rel="noreferrer">G0.5: One Autoregressive Stream for Robot Reasoning and Action</a></h3><p>以单一 Transformer 和统一目标交错生成推理与动作 token，并用可学习跨具身 tokenizer、原生思维链和视觉记忆承载异构机器人数据；在真机、BEHAVIOR、LIBERO、RoboTwin 2.0 与 SimplerEnv 等七类设置领先强基线。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11739" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>STRUCTURED DEMO</span><span>TEST-TIME ADAPTATION</span><span>OOD</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11671" target="_blank" rel="noreferrer">StellaVLA: In-Context Structured Demonstration for Generalizable Vision-Language-Action Models</a></h3><p>自动把原始轨迹转成任务计划、子目标与三维运动语言，用一次检索示范在测试时适配场景、视角、物体和具身变化；VLA-Arena 总分 0.63，LIBERO-Plus 成功率 85.1%，推理仍只运行实时动作专家。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11671" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>FUTURE KV CACHE</span><span>ONE PASS</span><span>LOW LATENCY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11521" target="_blank" rel="noreferrer">Keep the Future, Drop the Rollout: RIFT for World Action Models</a></h3><p>通过干预实验分离未来缓存的生产与消费，再以 anticipation tokens 一次前向构造完整未来 K/V cache；LIBERO 保持 98.8% 成功率并将动作块延迟降低 68.2%–89.1%，证明 WAM 部署不必迭代生成视频。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11521" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>ONE DEMO</span><span>OFFLINE-TO-ONLINE RL</span><span>YAM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11363" target="_blank" rel="noreferrer">Adaptation of Generalist Robot Policies with Minimal Data</a></h3><p>MiDAS 先用一到少量示范行为克隆锚定预训练 VLA，再对残差策略做 value-based 在线强化学习；在 LIBERO、RoboCasa 和双臂 YAM 上，从单示范脆弱策略经约六小时自主交互获得可靠新任务能力。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11363" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--wam"><div class="paper-ticket__meta"><span>TRAINING-ONLY WM</span><span>WORLD TOKENS</span><span>VLA LATENCY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.09730" target="_blank" rel="noreferrer">World Tokens: Enhancing Embodied Policies with Training-Time World Modeling</a></h3><p>World Adapter 把 VLM 特征压成同时驱动未来视频去噪与动作专家的 world tokens，以预测梯度塑造控制表征；部署时移除世界模型分支，在不承担在线视频生成成本下取得有竞争力的 LIBERO、SIMPLER 与真机结果。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.09730" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>200M EDITS</span><span>26 URDFS</span><span>HUMAN-TO-ROBOT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.12122" target="_blank" rel="noreferrer">HandEdit: A Unified Benchmark for Egocentric Human-to-Robot Dexterous Hand Image Editing</a></h3><p>构建超过两亿条具身感知编辑实例，覆盖 26 种手与手臂 URDF，并以手部、手臂双赛道和通用、VLM、具身专用指标评测 11 种基线，为从海量人类第一视角视频扩展灵巧操作数据提供统一入口。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.12122" target="_blank" rel="noreferrer">arXiv</a><a href="https://handedit.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>DUAL ARM</span><span>HAND PRIOR</span><span>DATA COVERAGE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11769" target="_blank" rel="noreferrer">Policy-Induced Hand Priors in Humanoid Dual-Arm Manipulation</a></h3><p>用 HandPriorScore、残余手偏置和目标响应性诊断 17 种初始姿态下的选手偏置，发现聚合成功率会掩盖姿态—策略交互；扩大姿态覆盖或针对薄弱构型增广数据可显著改善双臂鲁棒性。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11769" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>EMBODIED HARNESS</span><span>SCENE GRAPH</span><span>EXIT CODE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11246" target="_blank" rel="noreferrer">Towards the Harness of Embodied Agents</a></h3><p>Thea 把机器人能力封装为可调用工具，并以持久场景图补足物理状态读取、以“评测即退出码”判断动作终止、成功与失败原因，使 agentic loop 能在真实环境组合技能完成长程任务。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11246" target="_blank" rel="noreferrer">arXiv</a><a href="https://eit-hai.github.io" target="_blank" rel="noreferrer">项目页</a></div></article>
    <article class="paper-ticket paper-ticket--vla"><div class="paper-ticket__meta"><span>SKILL EVOLUTION</span><span>FROZEN MODEL</span><span>TRAIN-FREE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div><h3><a href="https://arxiv.org/abs/2608.11350" target="_blank" rel="noreferrer">Self-Evolving Embodied Agents via Skill-Harness Evolution</a></h3><p>SHAPER 冻结模型参数，通过目标环境 rollout 让同一模型迭代可复用技能与 context-code harness；在 VLABench 和 ESI-Bench 对不同底层动作接口优于纯执行、微调与多种测试时扩展基线。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11350" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--data"><div class="paper-ticket__meta"><span>OUTDOOR VLN</span><span>CONTINUOUS ACTION</span><span>DYNAMIC WORLD</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.11901" target="_blank" rel="noreferrer">DaViNCi: A Dataset Towards Outdoor Vision-and-Language Navigation with Continuous Actions and Dynamic Elements</a></h3><p>在六张户外地图提供 6,933 条轨迹，同时引入连续动作与不可预测动态元素；实验量化动作粒度和动态环境造成的显著成功率下降，为更贴近现实的户外 VLN 与 sim-to-real 评测补位。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11901" target="_blank" rel="noreferrer">arXiv</a></div></article>
    <article class="paper-ticket paper-ticket--humanoid"><div class="paper-ticket__meta"><span>LOCO-MANIPULATION</span><span>SMPC DATA</span><span>G1 + SPOT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div><h3><a href="https://arxiv.org/abs/2608.12063" target="_blank" rel="noreferrer">Learning Loco-Manipulation From SMPC Demonstrations With Sparse Offline-to-Online RL</a></h3><p>以仿真 SMPC 自动生成大规模离线示范解决探索瓶颈，再用稀疏任务奖励训练离线到在线 RL；配合动态稳定控制器后策略可超过优化教师，并跨带臂 Spot 与 G1 人形完成 sim-to-real 部署。</p><div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.12063" target="_blank" rel="noreferrer">arXiv</a></div></article>
  </div>
</div>

<h2 id="papers-2026-08-12" class="paper-day-heading">2026-08-12</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 FACT × Flex-π × SALT × Stage-JEPA WAM × VIScore：分别检查失败数据、多模态预测流、动作语义、阶段未来与规划质量如何改变世界—动作模型的训练和评测闭环。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>FAILURE DATA</span><span>CAUSAL FUTURE</span><span>PROGRESS SCORING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10232" target="_blank" rel="noreferrer">FACT: Failure-Aware Causal Training for World-Action Models</a></h3>
      <p>把未来视频和任务进度显式条件化于已执行动作，使失败 rollout 也能监督动作后果，并可在推理时为候选动作评分；仿真与真实双臂实验显示，加入失败数据可减少坏动作下的成功偏置幻觉。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10232" target="_blank" rel="noreferrer">arXiv</a><a href="https://fact-wam.github.io" target="_blank" rel="noreferrer">项目页</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>RGB + 3D + DINO</span><span>STREAM DROPOUT</span><span>6B WAM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10860" target="_blank" rel="noreferrer">Flex-π: A Multi-Stream World-Action Model with Compute Flexibility</a></h3>
      <p>发现冻结视频 VAE 几乎无损编码三维 pointmap，遂在同一潜空间联合去噪 RGB、几何、DINO 语义与动作；跨模态强制和流 dropout 让单一检查点可按算力选择动作单流或完整生成，在真实双臂精细操作上提升 2–7 倍。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10860" target="_blank" rel="noreferrer">arXiv</a><a href="https://flex-pi.github.io" target="_blank" rel="noreferrer">项目页</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>SEMANTIC TOKENIZER</span><span>VERB GROUNDING</span><span>BRIDGEV2</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10484" target="_blank" rel="noreferrer">Lost in Reconstruction: Aligning Action Representations with Language in Vision-Language-Action Models</a></h3>
      <p>SALT 在 VQ-VAE 动作 tokenizer 上增加由冻结 VLM 从量化动作潜变量恢复指令的目标，避免 L1/L2 重建抹去动词语义；SimplerEnv 平均成功率 71.9%，显著超过纯重建 tokenizer 的 42.7% 与 FAST 的 31.2%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10484" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>STAGE FUTURE</span><span>V-JEPA2</span><span>ROBOTWIN 2.0</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10780" target="_blank" rel="noreferrer">JEPA-WAM: Stage-Level Joint-Embedding Prediction for World-Action Models in Robot Manipulation</a></h3>
      <p>在短期物理未来之外显式预测下一任务阶段的语义潜目标，以冻结 V-JEPA2 编码器和目标条件 Stage-JEPA 增强 Motus；RoboTwin 2.0 的 50 项任务总体成功率 90.25%，成功 rollout 步数减少 5.97%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10780" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>LATENT DIAGNOSTIC</span><span>PLANNING QUALITY</span><span>OOD CORRELATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.11174" target="_blank" rel="noreferrer">VIScore: Diagnosing Planning-Relevant Quality in Latent World Models</a></h3>
      <p>用 Veracity、Influence 与 Sobriety 覆盖编码器、预测器和搜索规划器，衡量可达性、容量及规划幻觉；跨已见与未见模型和数据集，对跨任务成功率的 Spearman 相关均超过 0.75，优于直线度、状态 probe 与 empowerment。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.11174" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>SEMANTIC 3DGS</span><span>MOBILE MANIPULATION</span><span>OPEN VOCABULARY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10756" target="_blank" rel="noreferrer">Embodied Multimodal Grounding for Open-Vocabulary Mobile Manipulation via Semantic 3D Gaussian Splatting</a></h3>
      <p>以可刷新的局部 Semantic-3DGS 统一主动感知、语言定位、避障、底座选位和动作条件，并只在后部 action expert 注入三维语义；真实长程成功率 60%，高于 PointVLA 的 40% 和 DexVLA 的 28%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10756" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>SKILL TOKEN</span><span>CROSS-DOMAIN</span><span>FEW-SHOT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10600" target="_blank" rel="noreferrer">BooST: Bridging Semantics and Motions for Efficient Skill Transfer</a></h3>
      <p>先用跨模态 VQ-VAE 把高层语义意图与低层运动动力学压入统一技能表示，再蒸馏为轻量策略；仿真与真机验证少样本适配、跨域迁移和动态视觉干扰鲁棒性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10600" target="_blank" rel="noreferrer">arXiv</a><a href="https://boost-robots.github.io" target="_blank" rel="noreferrer">项目页</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>VLA SECURITY</span><span>BLACK-BOX ATTACK</span><span>PHYSICAL WORLD</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10393" target="_blank" rel="noreferrer">Hidden in Plain Sight: Diffusion-Based Unrestricted Robotic Attacks on Vision-Language-Action Models</a></h3>
      <p>DURA 沿预训练扩散模型潜轨迹生成自然外观的对抗贴片，仅凭受害模型动作即可执行黑盒定向攻击；仿真与真实机器人均暴露 VLA 物理部署中的新安全风险。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10393" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>DEFORMABLE</span><span>DATA FLYWHEEL</span><span>CHAMPION SYSTEM</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10718" target="_blank" rel="noreferrer">TCAM for Autonomous Deformable Manipulation: The RMC2 Champion System for WBCD 2026 Track 4</a></h3>
      <p>围绕 T 恤分层、搬运、对齐和抚平构建硬件—感知—数据—学习闭环，结合便携 UMI 与真机示范，并按失败物理因素定向补采和微调；决赛 25 次装载中 22 次达到表面平整要求。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10718" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>BIMANUAL GRASP</span><span>FORCE SIGNAL</span><span>SINGLE VIEW</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10383" target="_blank" rel="noreferrer">Real-World Cooperative Bimanual Dexterous Grasp of Large Objects from Single-View Observations</a></h3>
      <p>采集关节、视觉与力信号多模态数据，以 DDPM 从单视角分割点云生成双手关节抓取构型，再结合运动规划和在线抓取细化，在未知几何与姿态的大物体上实现稳定真机协同抓取。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10383" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>UNITREE G1</span><span>CONFINED SPACE</span><span>WHOLE BODY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10220" target="_blank" rel="noreferrer">Whole-Body Planning for Humanoids Navigating Confined Spaces via Self-Collision Avoidance References</a></h3>
      <p>在可达刚体体积上生成含可微碰撞约束的引导，再优化全阶多接触轨迹并训练残差 RL 跟踪策略；Unitree G1 在超过 NIST 应急标准的狭窄测试床完成 12–18 秒手脚复合接触任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10220" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>KV CACHE</span><span>MODEL CONFIDENCE</span><span>TRAINING-FREE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.10824" target="_blank" rel="noreferrer">Neural Introspection Gating for Adaptive KV-Cache Reuse in Vision-Language-Action Models</a></h3>
      <p>用动作 token 前两名 logit margin 作为零成本置信信号，在不确定时废弃视觉 KV cache 并完整重算；OpenVLA 系列在 LIBERO-Goal/Long 恢复盲目缓存损失的全部精度，同时保留 80% 计算节省。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.10824" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-08-11" class="paper-day-heading">2026-08-11</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 GWM-VLA × 4D-WAM × Vid2WAM × JEPA-WAM × SLIM：比较几何状态、轨迹场、生成式视频先验、联合嵌入和紧凑交互潜变量五条 WAM 路线。数据与评测侧优先 RoboGraph，检查“任务状态跨度”是否比动作序列长度更能解释长程失败。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>MULTI-VIEW GEOMETRY</span><span>LATENT WORLD MODEL</span><span>FLOW MATCHING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07619" target="_blank" rel="noreferrer">GWM-VLA: Geometry-Aware Latent World Modeling for Vision-Language-Action Learning</a></h3>
      <p>以 VGGT-Ω 聚合多视角几何状态，只预测目标腕部视角的下一步 patch token，并让同一潜在动作表征同时接受世界转移与真实动作监督；在保留局部交互信息的同时降低完整多视角预测成本，仿真和真机均验证视觉与环境偏移鲁棒性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07619" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TRAJECTORY FIELD</span><span>4D ALIGNMENT</span><span>MODEL-AGNOSTIC</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08023" target="_blank" rel="noreferrer">4D-WAM: Infusing Spatiotemporal Awareness into World Action Models through Trajectory Fields</a></h3>
      <p>从三维轨迹场向任意 WAM 注入时空监督：相邻帧的运动对齐塑造局部 4D 感知，起点—终点的目标对齐提供长程位置指导；跨多种底座在空间理解、执行精度、分布外泛化和鲁棒性上均获提升。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08023" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>VIDEO DIFFUSION PRIOR</span><span>PSEUDO ACTION</span><span>OFFLINE DISTILLATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08558" target="_blank" rel="noreferrer">Vid2WAM: Distilling Video Diffusion Priors into World Action Models</a></h3>
      <p>用大型视频扩散模型生成任务条件未来，并由逆动力学恢复具身专属伪动作，再以来源感知残差适配缓解合成动作噪声与真实示范冲突；部署时丢弃教师和逆动力学，在有限专家数据下提升新任务泛化与数据效率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08558" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>V-JEPA SPACE</span><span>SHARED PREDICTOR</span><span>DENSE CORRESPONDENCE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.09381" target="_blank" rel="noreferrer">JEPA-WAM: Learning Vision-Language-Action Policies with Joint-Embedding World Modeling</a></h3>
      <p>在预训练 V-JEPA 空间内以共享预测器耦合潜在状态转移和连续动作，预测保留 patch 对应的当前—未来联合目标；LIBERO-Plus 从零训练版本达 79.2%，π0.5 实例达 86.3%，并覆盖 RoboTwin 与真实双臂操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.09381" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>0.5B POLICY</span><span>MASKED TRAJECTORY</span><span>ACTION-GROUNDED LATENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.09771" target="_blank" rel="noreferrer">SLIM-0.5B: Learning Action-Grounded Predictive Latents for Robot Manipulation</a></h3>
      <p>以自监督遮蔽轨迹预测联合动作重建与未来潜变量预测，用紧凑 Mixture-of-Transformers 建模观察—动作交互，再以流匹配生成语言条件动作；无需额外具身预训练即可匹配或超过大型 VLA/WAM，并降低延迟和显存。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.09771" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TASK-STATE HORIZON</span><span>588 EPISODES</span><span>15 AGENTS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08036" target="_blank" rel="noreferrer">Compiling and Benchmarking Task-State Horizons for Embodied Agents</a></h3>
      <p>提出区别于动作长度的任务状态跨度 TSH，并用 RoboGraph 把空间、时间因果及失败干预编译成可执行符号图；84 个场景、588 个 episode 对 15 个模型的评测表明，长程瓶颈集中在维持、探索和更新任务相关状态。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08036" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>CROSS-LAYER ROUTING</span><span>0.5B</span><span>ZERO-SHOT SHIFT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07596" target="_blank" rel="noreferrer">LIRA: Local Cross-Layer Information Routing for Vision-Language-Action Decoding</a></h3>
      <p>让每个动作融合块从深度对齐的局部 VLM 层窗口路由互补任务证据，同时保持骨干、动作解码器和监督配方不变；0.5B 配置在 LIBERO-Plus 零样本迁移中把成功率由 59.1% 提至 78.0%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07596" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA AUDIT</span><span>INSTRUCTION MISMATCH</span><span>TRAINING-FREE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07895" target="_blank" rel="noreferrer">Auditing Instruction-Trajectory Mismatches in Multimodal Robot Demonstrations</a></h3>
      <p>针对“轨迹行为正确、语言标签错误”的隐蔽数据污染，以局部邻域一致性、全局原型相似度和熵加权多专家融合做训练后审计；在 LIBERO 注入错误与噪声真机数据上改善检测、纠标及下游策略，并量化过滤和重标的取舍。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07895" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VISUO-TACTILE</span><span>DEXTEROUS GRASP</span><span>POST-CONTACT REFINEMENT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07600" target="_blank" rel="noreferrer">AdaDexGrasp: Adaptive Dexterous Grasping via 3D Visuo-Tactile Representation Fusion</a></h3>
      <p>将物体几何与带手指身份的触觉信号统一到三维表征，同时支持接触前抓取生成、可行性预测与接触后细粒度自适应；仿真和真机均显示对多样物体的抓取成功率与泛化提升。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07600" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SURGICAL EVAL</span><span>MOTION-CENTRIC</span><span>ROLLOUT STABILITY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08070" target="_blank" rel="noreferrer">SurgWMBench: A Vision-Based Benchmark for World-Modeling Surgical Instrument Motion Planning</a></h3>
      <p>把手术世界模型评测从 FVD 等生成质量转向可执行运动：给定术中图像和历史器械轨迹，评估短期运动预测、连续 rollout 稳定性及输入扰动鲁棒性，为运动中心的手术动力学模型提供公开协议。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08070" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>SEMANTIC FORESIGHT</span><span>SPATIAL GROUNDING</span><span>VLM PLANNER</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08839" target="_blank" rel="noreferrer">SG-WAM: Text-Grounded and Spatial-aware Semantic Guidance for World-Action Models</a></h3>
      <p>用 VLM 规划器预测目标对象和场景几何两类语义 foresight，再共同引导未来视频与动作分支，修复独立文本编码器导致的指令—预测错位；仿真及真机均改善精确操作和指令遵循。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08839" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>ONLINE MEMORY</span><span>VALUE-GUIDED</span><span>LONG HORIZON</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08749" target="_blank" rel="noreferrer">OnEvoMemory: Evolving Memory through Online Robot Rollouts for Pretrained Robot Policies</a></h3>
      <p>维护近期上下文、高价值经验和显著转移，并从成功/失败 rollout 的结果学习保留哪些经历；离线示范初始化记忆先验，在线交互继续演化，使基础 VLA 更能识别任务阶段并避免重复已完成子任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08749" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>TEST-TIME TRAINING</span><span>REVERSIBLE UPDATE</span><span>FUTURE EVIDENCE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.09448" target="_blank" rel="noreferrer">VANE: Reliable Test-Time Training for Vision-Language-Action Models via Future Visual Representation Prediction</a></h3>
      <p>把候选部署时更新隔离于在线策略，用已执行动作造成的未来视觉结果验证后再提交，使适配具有选择性和可逆性；SimplerEnv WidowX 比对应 TTT 基线高 3.2 点，但 Google Robot 上收益仍依赖任务与具身。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.09448" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>ADAPTIVE EXECUTION</span><span>PROGRESS MONITOR</span><span>PLUG-AND-PLAY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.09492" target="_blank" rel="noreferrer">Rethink Before You Execute: Adaptive Execution for World Action Models</a></h3>
      <p>TempoWAM 根据当前观察、指令、剩余动作和执行历史估计进度，以任务相关的在线校准决定继续动作块还是重规划；真机简单任务少 26.9% WAM 推理且成功率不降，困难任务成功率提高 13.3 点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.09492" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>SPECULATIVE DECODING</span><span>NEAR CONTACT</span><span>WORLD-AWARE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.08725" target="_blank" rel="noreferrer">WA-SpecDec: World-Aware Speculative Decoding for Vision-Language-Action Models</a></h3>
      <p>在 VLA prefill 阶段注入世界模型的场景物理信息，让草稿与目标模型共享状态感知，在不改宽松接受规则的前提下区分自由空间和接触附近的动作偏差；同成功率下加速 1.5 倍，近接触失败平均少 18.6%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.08725" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>CODED MEMORY</span><span>MARKOVIAN VLA</span><span>HEURISTIC LEARNING</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.09410" target="_blank" rel="noreferrer">Skills in Weights, Memory in Code: Hybrid Learning for Memory-Dependent Robot Manipulation</a></h3>
      <p>HyMeS 把低层运动技能留在模仿学习权重中，由编码智能体根据 rollout 反馈迭代可执行启发式系统，负责高层记忆管理并驱动原本马尔可夫的 VLA；探索以代码记忆处理非马尔可夫长程操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.09410" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-08-10" class="paper-day-heading">2026-08-10</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 AtlasVLA × PILOT × TEMPO × WNM-3D：从持久状态、世界—动作表征、在线后训练与三维场景条件四个层面重构具身模型的“记忆—推理—控制”闭环；再用 Cross-View Action Consistency 检查视觉不变性是否真正落实到动作生成空间。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>PERSISTENT WORLD STATE</span><span>WRIST CAMERA</span><span>LONG HORIZON</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.06729" target="_blank" rel="noreferrer">AtlasVLA: Persistent World-Ego State Modeling for Vision-Language-Action Models</a></h3>
      <p>以 4D 持久世界状态记忆持续融合离开腕部相机视野的物体，并用 Ego-Working State Memory 记录自我状态与任务进展，再共同条件化 DiT 动作生成；仅用腕部相机便在 LIBERO-Long 和真实长程任务上分别比多视角基线高 9.4 与 17.5 个百分点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.06729" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>REPRESENTATIONAL DEDUCTION</span><span>MOTION COT</span><span>FEW-SHOT REAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.06994" target="_blank" rel="noreferrer">Decoupling Intention from Trajectory: A Representational Deduction Framework for World Action Models</a></h3>
      <p>PILOT 让动作分支显式预测潜在状态转移 token，并把它们保留为运动 CoT 来指导细粒度轨迹，从结构上解耦高层物理演化与低层动作生成；额外转移监督也缓解动作稀疏性，可作为主流 WAM 的少样本真机微调模块。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.06994" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>RL POST-TRAINING</span><span>TWO TIMESCALES</span><span>FROZEN VLM</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07314" target="_blank" rel="noreferrer">TEMPO: Semantic-Action Decoupled RL Post-Training for Vision-Language-Action Models</a></h3>
      <p>冻结视觉语言骨干，分别以慢速更新语义投影层、快速更新低层动作专家，避免在线 RL 的快速控制反馈破坏高层语义；在 CALVIN 与真机操作中优于预训练 VLA 和统一更新的 RL 后训练基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07314" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD NAVIGATION MODEL</span><span>3D SCENE PREFIX</span><span>CLOSED LOOP</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07267" target="_blank" rel="noreferrer">WNM-3D: A World Navigation Model with 3D Scene Conditioning for Closed-Loop VLN</a></h3>
      <p>把单目历史编码为固定长度的三维场景 token 前缀，通过块因果注意力同时条件化未来视图与动作生成，并结合监督微调、DAgger 和闭环策略优化；在 GN-Bench 上超过 VLM 导航策略及二维条件 WAM。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07267" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VIEWPOINT ROBUSTNESS</span><span>ACTION-FLOW CONSISTENCY</span><span>REAL ROBOT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.06965" target="_blank" rel="noreferrer">Cross-View Action Consistency for Camera-Robust Vision-Language-Action Policies</a></h3>
      <p>从同一 MuJoCo 状态渲染动作等价视角对，直接约束流式 VLA 在相同采样坐标的动作速度场一致，无需相机标签、外参或深度；LIBERO-Plus 达 87.2%，真机未见视角成功率由 53.3% 提至 74.4%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.06965" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>DUAL SYSTEM</span><span>MODEL ROUTING</span><span>93.4 HZ</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.06434" target="_blank" rel="noreferrer">Fast and Accurate: An Adaptive VLA Inference Framework through Environment-aware Model Selection</a></h3>
      <p>以强化学习切换策略在完全解耦的大型推理系统与轻量反应系统之间动态路由，支持模块替换且稀疏调用慢模型；LIBERO 保持大型基线成功率的同时把有效动作频率提升至 93.4 Hz，并验证真实双臂操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.06434" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>PHYSICAL GROUNDING</span><span>JEPA</span><span>LATENT IDENTIFIABILITY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.06799" target="_blank" rel="noreferrer">Is Forward Prediction Enough? Physical State Grounding for JEPA World Models</a></h3>
      <p>PSG-JEPA 在前向 latent 预测外增加单帧本体状态和多时域关节变化两类训练期 grounding，使潜空间更可辨识且不增加推理成本；从 probing、冻结 latent 规划到仿真与真机策略学习均优于 JEPA 世界模型基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.06799" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMAN VIDEO</span><span>CONTACT RETARGETING</span><span>DEXTEROUS HAND</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07045" target="_blank" rel="noreferrer">C2Dex: Contact-Consistent Reconstruction and Retargeting for Dexterous Manipulation from Monocular Video</a></h3>
      <p>从单目人类视频聚合物体坐标系中的稳定接触，既约束时序一致的手物重建，也作为跨手型重定向目标，再以残差 RL 精修；DexYCB/TACO 端到端成功率达 57.78%/26.67%，并完成多类真机接触操作回放。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07045" target="_blank" rel="noreferrer">arXiv</a><a href="https://k-jie.github.io/C2Dex/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>INTERVENTION DATA</span><span>ACTION CHUNK</span><span>BIMANUAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07065" target="_blank" rel="noreferrer">AutoIntervene: Calibrated Intervention for Action-Chunking Imitation Learning Policies</a></h3>
      <p>用成功轨迹构成视觉—动作支持记忆，分别校准策略转人工与人工返还策略的阈值；保留成功 rollout 中的干预片段作为 learner-induced state 纠正数据，在真实双臂任务上提高适配后成功率并减少人工控制时间。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07065" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>6D DYNAMIC TACTILE</span><span>7 KHZ</span><span>CONTACT LOCALIZATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07075" target="_blank" rel="noreferrer">Detection and Ranging of Transient Extrinsic Contacts Based on 6D Dynamic Tactile Sensing</a></h3>
      <p>在夹爪尖端用单个微型 6D IMU 以 7 kHz 捕获亚毫秒形变，并与机器人位姿经 EKF 融合，在 180 ms 内以约 7 mm 平均误差定位被抓物体的外部接触；可驱动毫秒级轨迹修正与纯触觉探索建图。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07075" target="_blank" rel="noreferrer">arXiv</a><a href="https://humitlab.github.io/TECDAR/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>MULTIMODAL FINGERTIP</span><span>BIMANUAL COORDINATION</span><span>HAPTIC HARDWARE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.07002" target="_blank" rel="noreferrer">A Haptic Robot Finger Designed for Guqin Instrument Playing</a></h3>
      <p>仿生指尖与指甲结构构成高精度多模态触觉手指，以古琴弦接触验证空弦/按音区分、泛音调节和触觉触发双手协同；虽非完整演奏系统，但为需要精细触觉与灵巧手控制的接触任务提供了硬件案例。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.07002" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-08-05" class="paper-day-heading">2026-08-05</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 State-aware VLA × BCP × UVT × LiLa-WAM × Track4Action：从输入状态、执行时机、学习目标、潜空间推理和 3D 变化监督五个维度重审 VLA/WAM 设计。人形方向优先 RoboReact，观察生成视频能否替代昂贵示范并通过闭环重落地变成可执行技能。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>PROPRIOCEPTION</span><span>CONTROLLED STUDY</span><span>96-FRAME HISTORY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03052" target="_blank" rel="noreferrer">How Should Vision-Language-Action Models Use Proprioceptive State?</a></h3>
      <p>固定骨干、数据、动作表示和评测协议，系统比较文本序列化、VLM 前缀、动作前缀、状态专家与特征调制五种状态接口，并把历史长度从 1 扫到 96 帧；覆盖 45 个原子任务和 20 个组合任务，为“状态何时有用、历史收益来自何处、应注入哪一层”给出可检验设计原则。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03052" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>ADAPTIVE HORIZON</span><span>FROZEN VLA</span><span>RL HEAD</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03483" target="_blank" rel="noreferrer">Continue or Replan? Bernoulli-Continuation Policy Learning for Adaptive Horizon Execution</a></h3>
      <p>给冻结 VLA 增加逐步“继续或重规划”的 continuation head，以轨迹结果和兼顾成功率/调用效率的奖励学习动作块执行长度。RoboTwin 50 任务平均成功率由 89.88% 升至 93.94%，可迁移到 π0.5；两项真机任务分别从 74% 升至 92%、44% 升至 84%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03483" target="_blank" rel="noreferrer">arXiv</a><a href="https://fleetfootwork.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VISUOMOTOR TARGET</span><span>SCENE TRANSITION</span><span>DATA-FREE CHANGE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03563" target="_blank" rel="noreferrer">Unified Visuomotor Targets: Supervising VLAs Beyond Physical Actions</a></h3>
      <p>不改架构、不增数据，把低层电机控制和视觉场景转移编码成统一潜变量目标，弥合 VLM 高层表征与动作监督之间的结构错配；在两类 VLA、仿真与真机双臂任务中同时改善训练效率、最终性能和有限预算下的鲁棒性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03563" target="_blank" rel="noreferrer">arXiv</a><a href="https://unified-visuomotor-targets.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>LATENT WAM</span><span>SINGLE 24GB GPU</span><span>VISUAL TRANSITION TOKEN</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03701" target="_blank" rel="noreferrer">LiLa-WAM: Lightweight Latent Reasoning World-Action Model for Robotic Manipulation</a></h3>
      <p>用未来状态预测与动作生成共同塑造紧凑潜空间，并以视觉特征空间中的方向作为无语言任务表示；可在单张 24GB GPU 上端到端训练，在 RoboTwin 2.0 的 50 项任务达到 90.48%，并覆盖 LIBERO 与真机操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03701" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>3D TRACKING</span><span>PRIVILEGED SUPERVISION</span><span>TRACKER-FREE DEPLOYMENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03727" target="_blank" rel="noreferrer">Track4Action: Distilling World-Centric 3D Tracker into Vision-Language-Action Policies</a></h3>
      <p>从示范视频片段提取动作造成的几何、运动、可见性与相机变化，将冻结 3D tracker 的世界中心表征蒸馏进当前观察 VLA，部署时无需视频或 tracker。零样本 LIBERO-Plus 达 82.3%，四项真机双臂任务平均 67.5%，比无对齐版本高 25 点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03727" target="_blank" rel="noreferrer">arXiv</a><a href="https://wing0night.github.io/track4action/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>GENERATED VIDEO</span><span>WHOLE-BODY HUMANOID</span><span>ONLINE REGROUNDING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03387" target="_blank" rel="noreferrer">RoboReact: Agentic Skill Distillation from Generated Egocentric Videos for Generalizable Whole-Body Manipulation</a></h3>
      <p>从单张第一视角 RGB-D 观察生成操作视频，经深度感知 3D 重建提取保持几何的交互关键帧并重定向到高自由度人形机器人；在线物体重落地与 VLM 引导迭代修正几何错配和执行偏差，在无遥操作、无人类示范下获得可泛化真机全身技能。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03387" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>EMBODIED VIDEO VAE</span><span>DISENTANGLEMENT</span><span>CONTROLLABLE LATENT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.02990" target="_blank" rel="noreferrer">EmbodiedVAE: Disentangled Video VAE for Efficient and Controllable Embodied Manipulation</a></h3>
      <p>以双编码器、单解码器和非对称时空压缩分离机械臂运动与背景，再用最优传输一致性约束保持运动潜变量的时间连贯；面向机器人世界模型提供更紧凑、可控的表示，平均重建 PSNR 比先进视频 VAE 高约 2 dB。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.02990" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>VALUE MODEL</span><span>FAILURE LABELS</span><span>REAL BIMANUAL</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.02958" target="_blank" rel="noreferrer">ValueFormer: A Causal Transformer Value Function with Stage-Aware Labels for Semi-Autonomous Vision-Language-Action Policies</a></h3>
      <p>把难点定位在逐帧价值标签而非 critic 架构：用阶段感知的成功后衰减回报保留失败前进展，并从错误区间监督可恢复失误。在 1,427 条真实双臂三明治组装轨迹上，critic 权重训练把完成率从 70% 提至 85%，同时支持 2 Hz 在线检测。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.02958" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>FORCE CONTROL</span><span>DIFFUSION POLICY</span><span>BIMANUAL DISASSEMBLY</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03103" target="_blank" rel="noreferrer">A Hierarchical Approach to Imitation Learning for Manipulation Tasks Requiring Time Varying Forces</a></h3>
      <p>DPA-FTG 将 5 Hz 扩散策略的技能规划与 60 Hz 力条件神经阻抗控制解耦，避免 action chunk 对断裂等快速力瞬变失明；在双臂电池拆解中以低频多模态规划配合高频接触稳定控制，超过 Reactive Diffusion Policy。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03103" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>CONTACT-IMPLICIT</span><span>MOTION RETARGETING</span><span>UNITREE G1</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03116" target="_blank" rel="noreferrer">Shooting for Contact: Contact-Implicit Multiple Shooting for Dynamic Motion Retargeting</a></h3>
      <p>把可微模拟器嵌入多重射击优化，无需预设接触时序即可联合处理摩擦、碰撞、自碰撞、关节与驱动约束，把运动学参考变成动态可行轨迹；加速模仿 RL，并在 Unitree G1 上零样本迁移接触爬行和 180° 跳转。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03116" target="_blank" rel="noreferrer">arXiv</a><a href="https://shooting-for-contact.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>PHYSICAL ATTACK</span><span>ATTENTION HIJACKING</span><span>ZERO-OVERHEAD DEFENSE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03231" target="_blank" rel="noreferrer">Structure-Aware Robust Fine-Tuning: Defending Vision-Language-Action Robots Against Physical Attention Hijacking</a></h3>
      <p>揭示可打印贴片会把动作条件注意力从任务区域劫持到局部攻击物，并提出只微调视觉编码器的结构感知防御，推理零额外开销；LIBERO 上显著降低 OpenVLA 受攻击失败率，PiPER 真机成功率由 23% 提至 65%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03231" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>ACTION-FREE VIDEO</span><span>OBJECT-CENTRIC REWARD</span><span>SUBTASK DISCOVERY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03753" target="_blank" rel="noreferrer">GORDON: Graph-based Object-centric Rewards for Decomposition of Long-Horizon Manipulation</a></h3>
      <p>从无动作视频的物体—关系图学习抗背景和机器人运动干扰的稠密奖励，并从奖励时间曲线自动发现长程子任务；七项 MAGICAL/ManiSkill3 操作中，长程任务平均成功率 74.4%，较最强学习基线约高 35 点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03753" target="_blank" rel="noreferrer">arXiv</a><a href="https://andreaprotopapa.github.io/gordon/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>HUMAN-IN-THE-LOOP</span><span>FLOW-MATCHED POLICY</span><span>LIGHTING SHIFT</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03872" target="_blank" rel="noreferrer">EvoHIL: Self-Evolving Reward and Flow-Matched Policy Optimization for Robust Human-in-the-Loop Reinforcement Learning</a></h3>
      <p>联合演化人类确认驱动的奖励模型、流匹配动作块生成器和视觉域适配，以已执行前缀稳定接触动作，并通过重光照离线回放适应外观变化；在 FR3 与 SO-101 的六项操作上改善成功率、标签一致性、平滑度和完成时间。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03872" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>PERCEPTIVE LOCOMOTION</span><span>MULTI-SKILL DISTILLATION</span><span>ZERO-SHOT REAL</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.02653" target="_blank" rel="noreferrer">Light-Loco-Parkour: Versatile Perceptive Whole-Body Locomotion via Multi-Skill Distillation</a></h3>
      <p>单一策略仅凭机载深度与速度命令，自主在行走、平衡、攀爬、下台阶和翻越间切换，无技能标签、门控或运行时动作图；用稀疏动作种子扩展地形配对参考，并零样本迁移到室内外真实人形硬件。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.02653" target="_blank" rel="noreferrer">arXiv</a><a href="https://light-loco-parkour.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED AGENT</span><span>AUDITABLE MEMORY</span><span>REPLAYABLE TRAJECTORY</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03924" target="_blank" rel="noreferrer">ETA: A New Agentic Paradigm for Embodied Tasks</a></h3>
      <p>以 Planner 每次选择一个工具、Interface 控制执行、World 返回结果与新观察的闭环替代纯端到端观察到动作；OpenETA 提供可替换规划器、组合技能、可审计记忆和可回放轨迹，把成功与失败交互沉淀为经验并连接仿真和真机。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03924" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>INFERENCE ENGINE</span><span>VLA + WAM</span><span>EDGE-CLOUD</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2608.03682" target="_blank" rel="noreferrer">PhyAI: Real-Time Physical AI at the Edge, Scalable Rollouts in the Cloud</a></h3>
      <p>以单一运行时覆盖 VLA/WAM 的评测、云端 RL rollout、边缘服务和机载部署，通过模型适配器保留条件、求解器与缓存差异；对 π0、π0.5、GR00T N1.7 和 MiniCPM-Robot 相比官方实现加速 1.40–4.65 倍，并提出 control-time Roofline 区分推理与环境瓶颈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2608.03682" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-08-03" class="paper-day-heading">2026-08-03</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 WCM × BWM × FBFM × ST-WAM：分别回答世界模型如何改善 VLA 强化学习的价值估计、如何充当数据与评测基础设施、如何在动作块内部注入真实反馈，以及如何抵御视觉分布偏移。再读组合泛化诊断，反向指导机器人数据应覆盖哪些指令依赖而不只是扩大任务数量。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WORLD CRITIC</span><span>VLA RL</span><span>149 TASKS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29613" target="_blank" rel="noreferrer">WCM: A World Critic Model for Vision-Language-Action Reinforcement Learning</a></h3>
      <p>指出单帧 critic 与机器人部分可观测控制存在结构错配，用轻量 LeJEPA 同时预测未来 latent 与估计价值，让表示显式学习跨时动态。兼容 π0、π0.5 和 OpenVLA-OFT，在四个基准 149 项任务及七项真机操作上验证，尤其提升分布外泛化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29613" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD SIMULATOR</span><span>DATA ENGINE</span><span>POLICY EVALUATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29302" target="_blank" rel="noreferrer">BWM: A Low-Cost High-Fidelity World Simulator for Robot Learning</a></h3>
      <p>Boundless World Model 以初始环境、动态视觉历史和时间对齐动作做有状态自回归未来预测，既生成动作对齐 rollout 扩充模仿学习数据，也用于风险预判、策略排序与闭环评测；开源模型、训练推理代码和接口，并在 WorldArena 多赛道排名第一。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29302" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>FEEDBACK FLOW</span><span>TRAINING-FREE</span><span>ONLINE CORRECTION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29235" target="_blank" rel="noreferrer">FBFM: A Training-Free Asynchronous Feedback Mechanism for Flow-Matching in World-Action Models Execution</a></h3>
      <p>把重落地从动作块边界推进到流匹配生成内部：用上一块动作和执行后的真实图像，通过掩码伪逆修正下一块的条件速度场，在不训练的前提下逐时间步抑制预测漂移。接入 DreamZero 与 LingBot-VA 后，在部分 LIBERO、RoboTwin2.0 任务提升超过 5%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29235" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>SEMANTIC-TEMPORAL WAM</span><span>VISUAL SHIFT</span><span>ROBUSTNESS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.28993" target="_blank" rel="noreferrer">ST-WAM: Semantic-Temporal World Action Model for Robust Manipulation under Visual Distribution Shifts</a></h3>
      <p>诊断 WAM 在视觉偏移下会把未来幻觉回训练域，转而联合预测 VAE 动态与 DINOv3 语义，并用当前上下文从 DINO 历史检索任务证据；推理时无需显式生成未来。相较 Fast-WAM，LIBERO-Plus 零样本提升 21.3 点，真机视觉偏移成功率由 25.8% 升至 61.5%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.28993" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>COMPOSITIONAL GENERALIZATION</span><span>DATA COVERAGE</span><span>DIAGNOSIS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29687" target="_blank" rel="noreferrer">Diagnosing Compositional Generalization in Sequential Robot Tasks</a></h3>
      <p>把组合泛化差距拆为边际指令、指令组合与上下文—动作三类偏移，说明数据价值取决于是否覆盖动作相关依赖，而非穷举指令元组；结构化覆盖四分之一任务空间即可恢复强分布外性能，对每项任务仅补一条示范便把成功率从 0.4% 提至 54.7%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29687" target="_blank" rel="noreferrer">arXiv</a><a href="https://yixiaowang7.github.io/compositional_generalization/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>CAMERA ROBUSTNESS</span><span>IMITATION LEARNING</span><span>PLÜCKER RAYS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29622" target="_blank" rel="noreferrer">RayViT: Ray-Conditioned Visual Representations for Viewpoint-Robust Imitation Learning</a></h3>
      <p>将 Plücker 射线图 patch 化后以门控交叉注意力注入预训练 ViT，显式补足 RGB 缺失的相机几何；RoboCasa 相机扰动下鲁棒性约提升 13 个百分点，真机多任务平均多完成 1.78 个阶段。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29622" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>TEMPORAL VLA</span><span>FIBONACCI SAMPLING</span><span>FLOW MATCHING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29596" target="_blank" rel="noreferrer">FibVLA: An Efficient Temporal Vision-Language-Action Model with Fibonacci Sampling</a></h3>
      <p>用对数式历史采样压缩视觉与本体长上下文，再以流匹配动作专家和 Fibonacci 递归推理兼顾长程规划与实时闭环反馈；在不重训大型视觉编码器的情况下改善动作平滑度、成功率和真机响应效率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29596" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>SAFE VLA</span><span>CONTROL BARRIER</span><span>FLOW MATCHING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29569" target="_blank" rel="noreferrer">Safe Vision Language Action Models via Barrier Enhanced Flow Matching</a></h3>
      <p>不在最终输出后附加安全滤波器，而把控制障碍函数直接嵌入流匹配去噪过程，用平滑聚合障碍约束整段 action chunk；无需安全专用数据或重训，在两种操作平台和二维导航中保持任务成功率并提供形式化安全保证。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29569" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>GENERATIVE POLICY</span><span>HISTORY INITIALIZATION</span><span>19.1 MS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29482" target="_blank" rel="noreferrer">Temporal Policy: History-Initialized Action Generation for Robotic Learning from Demonstration</a></h3>
      <p>以机器人近期历史代替无信息高斯噪声初始化随机插值流，把过去状态与未来动作显式耦合，使传输路径更直、成本降低近一个数量级；RTX 4080 推理延迟 19.1 ms，并保持先进基线成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29482" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>CONTACT-RICH</span><span>ACTION CHUNKING</span><span>PHASE ROUTING</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29285" target="_blank" rel="noreferrer">TRACT: Temporally Routed Action Chunks with Chronological Phase Authority for Contact-Rich Manipulation</a></h3>
      <p>解决 action chunk 跨越工序边界时整块沿用当前阶段标签的错配，以单一 CURRENT→NEXT 边界和任务图把未来查询路由到对应阶段；再用响应缺口积分补偿接触受阻，六种真机变体中完整方法达到 10/10 全序列成功。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29285" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TELEOPERATION</span><span>IMPEDANCE RETARGETING</span><span>ONE DEMO</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29271" target="_blank" rel="noreferrer">MDIR: A Task-Manifold Impedance Retargeting Method for Contact-Rich Teleoperation</a></h3>
      <p>从一条固定笛卡尔阻抗示范，按任务流形的做功、发力和支撑通道确定性重参数化为可执行变阻抗控制；在擦拭、取放与推动的 15 次闭环执行中全部通过任务检查，同时降低腕力峰值、冲量与力波动。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29271" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>WEARABLE TACTILE</span><span>HUMAN DATA</span><span>CONTACT REPRODUCTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29231" target="_blank" rel="noreferrer">TacPrint: A Wearable Fingertip Tactile Sensor for Human-to-Robot Contact Reproduction</a></h3>
      <p>用 24 个电容 taxel 的可穿戴指尖采集自然人类接触，经 real-to-sim-to-real 恢复稠密接触深度图；在人到机器人重放中，触觉补偿把抓取和擦拭成功率从 0% 提至 91.67% 与 90%，稠密反馈也明显优于原始 taxel。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29231" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>HUMANOID VLA</span><span>CLOSED MODEL</span><span>ITERATIVE SFT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29172" target="_blank" rel="noreferrer">CLIFT: Turning Gemini Robotics On-Device into Humanoid Specialists via Non-Invasive Closed-Loop Iterative Fine-Tuning</a></h3>
      <p>研究只能通过托管 SFT API、无法访问权重与梯度时，如何用部署 rollout 迭代改善闭源机器人基础模型；在真实人形机器人上适配 Gemini Robotics On-Device，聚焦敏捷、接触密集任务中的新状态、跟踪动态、延迟与控制器失败。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29172" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>RUNTIME SAFETY</span><span>VISUAL-ACTION CONSISTENCY</span><span>PLUG-AND-PLAY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.29169" target="_blank" rel="noreferrer">ActFovea: Runtime Safeguarding for VLA Policies via Spatiotemporal Visual-Action Consistency</a></h3>
      <p>由运动学、本体状态与近期动作构建接触相关的动作条件 fovea，检测视觉运动、观察新鲜度与动作转移是否一致，并在候选恢复动作验证后才继续执行；π0 在局部视觉遮挡下成功率从 49.3% 提至 90.3%，冻结画面时全部及时安全失败。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.29169" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-08-01" class="paper-day-heading">2026-08-01</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 TacWAM × Cross-Embodiment Transfer × RedFlow × World Action Planner × CFNBC：分别回答未来触觉如何监督控制、跨本体数据如何对齐、失败经验如何变成动作级纠错、世界模型如何进入搜索规划，以及新增示范应如何按策略脆弱性选择。再以 FoMo-FD 与 RoboBRIDGE 对照执行期监控和系统级恢复。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--tactile paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>TACTILE WAM</span><span>CONTACT MECHANICS</span><span>REAL ROBOT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.28391" target="_blank" rel="noreferrer">TacWAM: Anchor-Guided World Action Model with Mechanics-Aware Tactile Prediction</a></h3>
      <p>把触觉外观、稠密力场与形变流映射到统一预测空间，并以触觉历史建模接触力的时间演化；三模态注意力严格分离当前锚点、未来预测 token 与动作 token，使未来触觉只提供训练监督而不会成为部署时的特权输入。四项真机接触任务平均成功率 75.0%，比最强基线高 37.5 个百分点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.28391" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>CROSS-EMBODIMENT</span><span>BEHAVIOR ALIGNMENT</span><span>ACTION-FREE DATA</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27549" target="_blank" rel="noreferrer">Cross-Embodiment Transfer via Behavior-Aligned Representations</a></h3>
      <p>系统比较物体框、语言运动描述和机器人末端轨迹等跨本体不变、同时可预测动作的中间表示；结果显示末端轨迹最有利于 VLA 跨本体迁移，先验数据越大收益越明显，也能吸收无动作视频。仿真预训练策略迁移到真机新本体时，任务完成进度提升 28%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27549" target="_blank" rel="noreferrer">arXiv</a><a href="https://ajaysridhar.com/barx/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>FLOW VLA</span><span>FAILURE DATA</span><span>OFFLINE RL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27782" target="_blank" rel="noreferrer">RedFlow: Redirect Failure into Action-Level Corrections for Flow-matching VLA Policy</a></h3>
      <p>在相似上下文中定位致败动作并检索成功替代动作，把成功与失败 rollout 都转成稠密监督；自适应目标同时强化好动作、压制坏动作并把可恢复失败重定向到纠正目标。LIBERO 与三项真机任务均优于离线 RL 基线，真机成功率从 56.7% 提升到 74.7%，样本量约为强在线方法的十分之一。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27782" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD MODEL PLANNING</span><span>SEARCH</span><span>ZERO-SHOT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27599" target="_blank" rel="noreferrer">World Action Planner: Generalizable Decision-Making with Action-Conditioned World Models</a></h3>
      <p>让 VLM 提出初始动作计划，再通过多任务、姿态—图像条件世界模型想象结果，以优化和搜索迭代修正计划；目标不是从观察直接回归动作，而是显式利用物理落地的未来做决策。在组合任务、新布局和零样本场景中优于端到端 VLA 与 WAM 策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27599" target="_blank" rel="noreferrer">arXiv</a><a href="https://worldactionplanner.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA VALUE</span><span>COUNTERFACTUAL SENSITIVITY</span><span>ROBUSTNESS REPAIR</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27261" target="_blank" rel="noreferrer">It's Not Just More Demos: Counterfactual Action Sensitivity Coverage for Data-Efficient Robust Robot Imitation</a></h3>
      <p>生成应保持专家动作不变的成对干净/干扰观察，以策略输出的动作漂移直接测量其脆弱响应模式，再从候选池选择小而互补的修复集；无需在线 rollout 或成功标签。MuJoCo 与 SimplerEnv 中仅选 20–30 个候选便显著优于同预算随机采样，并接近大规模随机修复。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27261" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>FAILURE DETECTION</span><span>FLOW WORLD MODEL</span><span>CONFORMAL CALIBRATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27511" target="_blank" rel="noreferrer">Failure Detection for Surgical Robot Imitation Policies via Flow-Matching World Modeling</a></h3>
      <p>FoMo-FD 只从成功执行学习动作条件短期视觉动力学，以终点 latent 的逆输运不一致度检测观察—动作偏离，再在成功轨迹上共形校准阈值，无需任何失败示范。四项手术操作、20 类失败的仿真与 dVRK 真机实验中，腕部相机达到 96.6% 检出率和 1.3% 误报率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27511" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS DATA</span><span>KINESTHETIC GUIDANCE</span><span>TELEOPERATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27784" target="_blank" rel="noreferrer">DexDirect: Direct Kinesthetic Arm Guidance for Efficient Dexterous Demonstration Collection</a></h3>
      <p>操作者直接拖动重力补偿的六自由度机械臂控制手臂，同时用单摄像头把另一只手重定向到 16 关节、13 自由度灵巧手；相比纯视觉 AnyTeleop 与姿态跟踪 TeleDex，成功示范采集效率分别提升 17.2 倍和 3.2 倍，训练出的扩散策略在方块取放上达到 90% 成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27784" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>ROBOT AGENT</span><span>ORCHESTRATION</span><span>FAILURE RECOVERY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27881" target="_blank" rel="noreferrer">RoboBRIDGE: A Modular Framework for Bridging Policies to Robust Real-World Robotic Agents</a></h3>
      <p>在预训练 VLA 外组织监控、感知、规划、控制和机器人接口五个模块：快速检测失败并分层恢复，场景偏离计划时异步更新感知与重规划，并用技能级 LoRA 降低本体和域偏移。跨 LIBERO、RoboCasa、多平台真机和多种 VLA 骨干均超过独立策略与既有增强方案。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27881" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>COUNTERFACTUAL AUGMENTATION</span><span>DYNAMIC OBJECTS</span><span>ACTION MORPHING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27890" target="_blank" rel="noreferrer">Static In, Dynamic Out: Counterfactual Action Augmentation for Moving Object Manipulation</a></h3>
      <p>把只含静止目标的示范反事实地移动到未来物体位置，并形变 action chunk 以保持手—物相对位姿，从而训练目标条件策略；部署时仅需物体位姿预测器提供未来位置。三项仿真、五种运动模式及两项真机任务中提升动态目标成功率，同时保持静态目标性能。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27890" target="_blank" rel="noreferrer">arXiv</a><a href="https://sido-staticindynamicout.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>DEXTEROUS HAND</span><span>CROSS-SKILL</span><span>CROSS-MORPHOLOGY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.28198" target="_blank" rel="noreferrer">UniCross: Unified Cross-Skill Dexterous Manipulation Synthesis</a></h3>
      <p>把抓取、搬移、手内旋转和手内平移统一到相同状态、动作空间与目标结构中，避免专用约束破坏技能间连续性；由此蒸馏单一跨技能策略，既能泛化新物体、抵抗扰动，又能无缝串成长程操作，并可迁移到不同灵巧手机构。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.28198" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>ZERO-SHOT TRANSFER</span><span>DENSE CORRESPONDENCE</span><span>ONE DEMO</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.28382" target="_blank" rel="noreferrer">SemAnCorr: Semantic Anchored Correspondence for Zero-Shot Manipulation Skill Transfer</a></h3>
      <p>训练免费地联合优化位姿与对应关系选出语义一致锚点，再用 functional maps 把约束传播到物体表面，使稠密对应同时保持功能语义和局部几何一致；PartNet-Mobility 基准语义准确率达 90.8%，一条示范即可更可靠地迁移到几何差异显著的新物体。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.28382" target="_blank" rel="noreferrer">arXiv</a><a href="https://semancorr.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>TACTILE SENSOR</span><span>3D SHAPE + FORCE</span><span>1.09 MS</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.28416" target="_blank" rel="noreferrer">FasTac: A Curved Multispectral Vision-Based Tactile Sensor for High-Speed High-Precision 3D Shape and Force Perception</a></h3>
      <p>曲面指尖用单图像传感器同步多光谱光度立体恢复三维形状，并以位置感知动态卷积估计三轴力；FPGA 将从图像到法向与力的完整链路延迟压到 1.09 ms，深度误差 0.0415 mm，法向和剪切力归一化误差分别为 2.74% 与 2.39%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.28416" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>CONTACT-RICH</span><span>DIFFUSION POLICY</span><span>ADAPTIVE FREQUENCY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.28596" target="_blank" rel="noreferrer">FA-RDP: A Frequency-Adaptive Reactive Diffusion Policy for Contact-Rich Manipulation</a></h3>
      <p>用视觉—力多频 Transformer 与多模态指标，在接触前选择低频多步采样保留多种可行动作，接触后切到高频单步采样快速响应力反馈；流形一致性蒸馏让预测停留在机器人动作流形。三项接触密集任务中兼顾最高成功率与接触前轨迹多样性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.28596" target="_blank" rel="noreferrer">arXiv</a><a href="https://fa-rdp.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>CONTINUOUS-TIME WM</span><span>ODE</span><span>ROBOT CONTROL</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27924" target="_blank" rel="noreferrer">ODEWorld: A Continuous Predictive Architecture via Physical-Time Flow</a></h3>
      <p>在结构化 latent 中学习按物理时间演化的连续速度场，用 ODE 积分取代固定步长未来预测；既支持任意时间分辨率与反向预测，也通过对表示和速度场的约束缓解 latent collapse，在长程生成保持视觉质量的同时提供可用于策略学习的规划信息。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27924" target="_blank" rel="noreferrer">arXiv</a><a href="https://dstate.github.io/odeworld_website/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-30" class="paper-day-heading">2026-07-30</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 HumanCLAW × CheckVLA × Enfold × ContactFlow：四者分别隔离高层具身决策能力、用世界模型恢复动作 chunk 的执行反馈、把生成式未来蒸馏成低延迟控制表示，以及用接触轨迹建立跨人类与机器人本体的统一动作接口。再以 DLAM 和物理参数可识别性工作检查“从视频学动作/物理”究竟学到了什么。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--data paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>EMBODIED EVALUATION</span><span>HUMANOID</span><span>1,218 EPISODES</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27180" target="_blank" rel="noreferrer">HumanCLAW: Can Vision-Language Models Act Through a Body?</a></h3>
      <p>用受约束的人形身体把 VLM 每步原子技能命令翻译为亚秒级全身运动，在保留重力与碰撞后尽量排除平衡和电机执行误差，从而单独测量模型的动作决策智能；HumanCLAW-Bench 含 41 个室内场景、1,218 个长程第一视角找寻—导航—交互任务，九个先进 VLM 均未解决，最佳成功率仅 16.8%，主要缺口是持续追踪自身身体、到达状态和碰撞。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27180" target="_blank" rel="noreferrer">arXiv</a><a href="https://human-claw.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>ACTION-CONDITIONED WM</span><span>EXECUTION VERIFICATION</span><span>LONG-HORIZON</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.26789" target="_blank" rel="noreferrer">CheckVLA: Execution-Time Verification with Action-Conditioned World Model for Long-Horizon Mobile Manipulation</a></h3>
      <p>让冻结的动作条件世界模型预测已提交 action chunk 应产生的观察变化，以共形校准阈值判断是否干预，并结合推理延迟只重写仍可执行的动作后缀；RoboCasa365 上在相同调用预算下成功率由周期重规划的 27.6% 提升到 36.1%，在 5% episode 误报目标下及时召回率达 77.9%，显著高于仅看观察的异常检测。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.26789" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD GENERATOR</span><span>REPRESENTATION DISTILLATION</span><span>LOW LATENCY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.26657" target="_blank" rel="noreferrer">Enfold: Folding World-Generator Computation into Predictive Representations for Efficient Embodied Control</a></h3>
      <p>训练时把世界生成器从噪声未来逐步构造轨迹的多层中间状态，蒸馏进只读当前视觉与语言的编码器；部署时动作头直接使用该预测表示，不再执行生成分支，在 LIBERO、RoboTwin2.0 与真机任务保持强控制性能并将延迟降低 3.7 倍，Flash 版本达 10.1 倍，同时仍能响应人为场景变化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.26657" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>CONTACT FLOW</span><span>CROSS-EMBODIMENT</span><span>HUMAN VIDEO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.26579" target="_blank" rel="noreferrer">ContactFlow: A Video Action Conditioning that Transfers across Embodiments</a></h3>
      <p>以操作者与目标物体之间三维接触点的轨迹描述动作，主动丢弃具体本体外观和运动学，使人类示范与不同机器人共享同一世界模型条件；在 DROID 与真机桌面操作上，将联合训练的视频生成模型接入 propose—imagine—verify—act 流程，验证接触约束下的人机与跨机器人迁移。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.26579" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>LATENT ACTION</span><span>ACTION-FREE VIDEO</span><span>TEMPORAL COMPOSITION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27138" target="_blank" rel="noreferrer">DLAM: Distributional Latent Actions with Temporal Constraints</a></h3>
      <p>把相邻视频帧的潜在动作表示为对角高斯，并用等时间间隔三元组约束动作的组合与反转；显式建模共享中间帧造成的相关性，降低递归拼接时局部误差累积。冻结编码器后与机器人动作联合流匹配，在 MetaWorld MT50、LIBERO 和真机任务上较既有 latent-action 方法获得更一致的动态和更好策略迁移。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27138" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PHYSICAL IDENTIFIABILITY</span><span>MULTIMODAL WM</span><span>RH20T</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27017" target="_blank" rel="noreferrer">What Can Latent World Models Know? Physical Parameter Identifiability in Multimodal Predictive Representations</a></h3>
      <p>用可控 POKEWORLD 先证明质量、阻力和接触刚度能否从原始观察恢复，再判断它们是否进入世界模型 latent，区分环境不可观与目标没学到两类失败；结果表明输入决定信息上限、预测目标决定保留内容，例如刚度只有在预测触觉时才可读出，RH20T 的 4,258 条轨迹也复现了这一规律，说明只加数据无法补偿缺失的预测压力。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27017" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>SELF-IMPROVING ROBOT</span><span>AUTONOMOUS DATA</span><span>ZERO DEMONSTRATIONS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.26809" target="_blank" rel="noreferrer">Practice Makes Policies: Bootstrapping and Consolidating Robotic Capabilities from Zero Human Demonstrations</a></h3>
      <p>HERO 把启发式推理、历史案例复用与反射式执行组织成分层 agent，从零人类示范自主启动任务、积累可复用交互经验，并把高频行为逐步固化为闭环视觉运动策略；数据采集与任务执行共用一个持续演化循环，目标是让采集预算和策略形态随经验阶段动态切换。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.26809" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>EFFICIENT VLA</span><span>0.2B PARAMS</span><span>32 HZ</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.27205" target="_blank" rel="noreferrer">TurboVLA: Real-Time Vision-Language-Action Model at 32 Hz on an RTX 4090 with &lt;1 GB VRAM</a></h3>
      <p>绕开把视觉先投进大语言模型再解码动作的 V→L→A 路径，分别编码视觉与指令，用轻量双向交互直接形成任务条件表示并预测连续动作块；仅 0.2B 参数，在 RTX 4090 上以 0.9 GB 显存和 31.2 ms 延迟取得 LIBERO 平均 97.7% 成功率，给出小型实时 VLA 的简洁基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.27205" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/H-EmbodVis/TurboVLA" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>TEST-TIME STEERING</span><span>OFFLINE RL</span><span>FAILURE-AWARE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.26991" target="_blank" rel="noreferrer">RL²-VLA: Adaptive RL Latent Compositional Steering with Test-Time Scaling for Vision-Language-Action Models</a></h3>
      <p>从冻结 VLA action expert 的 latent 训练轻量离线 RL 策略，并在推理时组合两者的 flow velocity，以超出示范主模态的动作多样性修复域外失败；进一步只在预测基础 VLA 将失败时启动 steering，在 SIMPLER 与 PolaRiS 域外任务最多提升 17.3 个百分点，并给出真机迁移结果。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.26991" target="_blank" rel="noreferrer">arXiv</a><a href="https://rl2-vla.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-28" class="paper-day-heading">2026-07-28</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 Ordered Action Tokens × Physical Agency：前者重新设计 VLA 的低层动作接口，使 token 序列天然支持“先粗后细”的随时解码；后者把规划、结果验证和恢复从冻结策略中解耦出来，直接测量通用策略的编排缺口。再以 GRACE 检查部署时黑盒约束如何进入生成策略，以 Progress Reward Survey 补齐过程评测框架。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>ACTION TOKENIZATION</span><span>ANYTIME CONTROL</span><span>60+ TASKS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21670" target="_blank" rel="noreferrer">Ordered Action Tokens for Visuomotor Policy Learning</a></h3>
      <p>提出同时满足高压缩、完全可解码与有序 token 空间的 OAT：训练每个 token 前缀都能还原有效动作块，让早期 token 承载粗控制、后续 token 逐步修正残差，从而按推理预算动态权衡速度与动作精度；在三种策略骨干、五个仿真基准和真机共 60 余项任务上验证自回归控制与 VLA action-expert 共训练两种用法。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21670" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>PHYSICAL AGENT</span><span>VLA ORCHESTRATION</span><span>FAILURE RECOVERY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21725" target="_blank" rel="noreferrer">Addressing the Orchestration Gap in Generalist Robots via Physical Agency</a></h3>
      <p>Pigey 在冻结 VLA 或参数化技能外构建闭环编排器，负责高层规划、子目标分解、执行跟踪、结果验证和失败恢复，无需新增数据或后训练；LIBERO-PRO 从 12.8% 提升到 53.3%，真机推理受限任务从接近零提升到 90% 以上，并用“编排缺口”刻画运动技能单独运行与进入 agent 闭环后的性能差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21725" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>DIFFUSION POLICY</span><span>GRADIENT-FREE GUIDANCE</span><span>DEPLOYMENT CONSTRAINTS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21661" target="_blank" rel="noreferrer">GRACE: Gradient-Free Robot Action Generation via Combined Diffusion-MPPI Posterior Mean Estimation</a></h3>
      <p>用只需前向代价评估的 MPPI，在扩散反演每一步估计代价条件后验均值，把二值碰撞、关节限位和黑盒 rollout 代价等不可微约束注入预训练扩散策略；仿真优于扩散与采样基线，真实 7 自由度机械臂则避开了原策略每次都会碰撞的部署时障碍。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21661" target="_blank" rel="noreferrer">arXiv</a><a href="https://anonymous.4open.science/w/grace-70BB/" target="_blank" rel="noreferrer">Code / Videos</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PROGRESS REWARD</span><span>ROBOT EVALUATION</span><span>SURVEY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21655" target="_blank" rel="noreferrer">Progress Reward Modeling for Robotic Learning: A Comprehensive Survey</a></h3>
      <p>把只给最终成败的稀疏评测扩展到任务过程，按三层统一进度模型：外部接口规定观察、目标与输出信号，内部方法解释进度估计和奖励构造机制，数据与基准层追踪监督来源及评测究竟验证了什么；适合作为 VLA 价值模型、失败恢复和数据质量评估的共同索引。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21655" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>SYNTHETIC VIDEO</span><span>IMITATION LEARNING</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21648" target="_blank" rel="noreferrer">Learning Diverse Humanoid Tasks via Synthetic Video Scenarios without Real World Data</a></h3>
      <p>用生成式 AI 把文本提示转成同一任务的多样人类动作视频，再把这些合成示范作为人形机器人模仿学习资源，以降低真实采集成本并覆盖个体与执行风格差异；四个仿真场景显示策略能够完成任务并适应复杂动作变化，但尚缺真实机器人验证。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21648" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>WHOLE-BODY TACTILE</span><span>WITHDRAWAL REFLEX</span><span>HUMAN EVALUATION</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.22249" target="_blank" rel="noreferrer">Design and Human Evaluation of Tactile Withdrawal Reflexes for a Skin-Covered Robot Arm</a></h3>
      <p>把机械臂全身皮肤的压力变化映射为连续痛觉增益，并比较统一关节撤回、生物启发位置相关撤回和沿接触面法向的笛卡尔撤回；15 人研究中，简单且可预测的统一反射在安全感、人类相似度和自然度上最佳，而笛卡尔反射被认为最符合触碰方向，提示触觉安全行为的用户接受度不等于生物逼真度。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.22249" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-27" class="paper-day-heading">2026-07-27</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 Robot-Factored World Models × ViTacWorld：前者通过显式机器人渲染重新划分世界模型应学习的边界，后者把接触触觉纳入动作条件 rollout，并直接服务数据扩增与策略评估；再以 DynaMAC 和 Embodying Multi-Hand Policies 对照学习策略中的双臂协同与策略输出到实体多臂系统的安全执行。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>ROBOT WORLD MODEL</span><span>ROBOT RENDERING</span><span>CROSS-EMBODIMENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.22535" target="_blank" rel="noreferrer">Robot-Factored World Models via Robot Rendering</a></h3>
      <p>把动作命令先经控制器和运动学滚成部署时可得的名义轨迹，再用 URDF 渲染机器人几何并配对末端与场景深度，让世界模型专注学习接触后的物体响应，而非重复学习动作实现和机器人外观；该统一视觉接口优于向量动作条件基线，可零样本泛化到未见机器人本体，并能把人类手部示范重定向成机器人操作视频。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.22535" target="_blank" rel="noreferrer">arXiv</a><a href="https://bjkim95.github.io/rofacto/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VISUO-TACTILE WORLD MODEL</span><span>CONTACT-RICH</span><span>DATA AUGMENTATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.22530" target="_blank" rel="noreferrer">ViTacWorld: Scaling Visuo-Tactile World Models for Contact-Rich Robot Manipulation</a></h3>
      <p>用公开真实触觉数据、仿真环境和真实策略 rollout 预训练再适配动作条件视触觉世界模型，同步预测未来画面与触觉反馈；生成的 rollout 既扩增接触丰富任务的策略训练数据，也能在受控动作序列下评估策略结果，把触觉从单一策略输入扩展成可规模化的预测与评测信号。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.22530" target="_blank" rel="noreferrer">arXiv</a><a href="https://vitacworld.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>BIMANUAL MANIPULATION</span><span>DYNAMIC COOPERATION</span><span>SAMPLE EFFICIENCY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.22119" target="_blank" rel="noreferrer">One Hand Watches The Other: Dynamic Multi-Agent Cooperation for Sample-Efficient Bimanual Manipulation in Dynamic Environments</a></h3>
      <p>DynaMAC 把对侧机械臂视作动态任务参数，解除多流策略把参考系默认成外生静态变量的限制，无需显式主从关系即可统一动态物体操作与双臂协同；在新提出的 DynaBench 上相对概率和生成式基线提升超过 35 个百分点、示范量减少 20 倍，并可从静态示范零样本迁移到动态环境。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.22119" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MULTI-ARM EXECUTION</span><span>POLICY GROUNDING</span><span>COLLISION AVOIDANCE</span><span>SOCS 2026</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.22020" target="_blank" rel="noreferrer">Embodying Multi-Hand Manipulation Policies by Searching the Assignment and Null Spaces</a></h3>
      <p>面向输出抽象多手轨迹的学习策略，以 Conflict-Based Search 联合搜索轨迹到实体机械臂的离散分配和冗余机械臂的连续 Jacobian 零空间，在跟踪末端轨迹的同时满足关节约束并规避臂间碰撞；该框架补上跨本体策略从“手轨迹”到安全多臂执行的工程缺口，并给出理论完备性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.22020" target="_blank" rel="noreferrer">arXiv</a><a href="https://omcbsa.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>ACTION-CONDITIONED WORLD MODEL</span><span>ROBOTIC ULTRASOUND</span><span>MODEL-BASED LEARNING</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21918" target="_blank" rel="noreferrer">Action-Conditioned World Model for Goal Plane Probe Guidance in Robotic Ultrasound</a></h3>
      <p>先用潜在条件扩散模型从历史超声帧、探头运动和时间间隔预测未来观察，再以冻结世界模型提供奖励微调目标条件动作 Transformer，绕开显式模拟接触、组织形变和视角相关声学伪影的困难；真实闭环颈部扫描中，颈动脉与甲状腺目标平面引导成功率分别为 70% 和 65%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21918" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-24" class="paper-day-heading">2026-07-24</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 AXIS × Scale Up Strategically × TableVerse：三者分别回答如何持续增长高质量数据、如何诊断 VLA 的语言捷径并把诊断变成采集策略、以及如何从真实互联网布局规模化生成可交互训练环境；再以 FELT 检查视觉数据能否低成本补齐触觉监督，以 GS-Agent 与 PhysCoRe 对照生成式仿真和物理残差世界模型的两条路线。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--data paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>ROBOT DATA ENGINE</span><span>COMMUNITY TELEOP</span><span>VLA SCALING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21588" target="_blank" rel="noreferrer">AXIS: A Growable Community-Driven Data Engine for Scalable Robot Manipulation</a></h3>
      <p>把浏览器 MuJoCo 遥操作、自动任务生成与验证、成功检测、轨迹清洗及视觉—物理增强串成可持续增长的数据引擎；当前论文快照含 207 个任务和 5 万余轨迹，持续预训练使 π0.5 总成功率提升 5.8%，并在布局、传感噪声和相机扰动上呈现稳定缩放收益。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21588" target="_blank" rel="noreferrer">arXiv</a><a href="https://axisaiorg.github.io/AXIS-V1/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>COMPOSITIONAL GENERALIZATION</span><span>BIAS-AWARE EVAL</span><span>DATA COLLECTION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21582" target="_blank" rel="noreferrer">Scale Up Strategically: Learning Compositional Generalization via Bias-Aware Evaluation and Data Collection for Robotic Manipulation</a></h3>
      <p>用 Factor Dominance Rate 与 Hierarchy 定位策略对颜色、物体、空间、动词和尺寸等指令因子的捷径依赖；六个基础策略均呈现颜色强、动词与尺寸弱的相似排序，据此把固定采集预算倾斜到欠接地因子，仅用一半示范就在仿真和真机超过基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21582" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>REAL2SIM</span><span>TABLETOP DATA</span><span>100K ENVIRONMENTS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21017" target="_blank" rel="noreferrer">TableVerse: A Large-scale Tabletop Dataset with Real-world Grounded Layouts for Generalizable Manipulation</a></h3>
      <p>不再凭文本想象桌面布局，而从非结构化互联网图像确定性重建具有真实尺度、拓扑与机械稳定性的仿真环境，再自动生成无碰撞取放轨迹；TableVerse-100K 提供十万个独特、物理一致且带交互示范的桌面环境。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21017" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VISUO-TACTILE</span><span>SYNTHETIC TOUCH</span><span>CONTACT-RICH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.20683" target="_blank" rel="noreferrer">FELT: Generating Tactile Signals from Vision for Visuo-Tactile Manipulation</a></h3>
      <p>以冻结视觉编码器和轻量查询解码器从 RGB 单次前向生成左右手指压力图或潜在触觉特征，使既有纯视觉数据无需触觉硬件即可补充接触监督；在擦拭、插入和手内旋转等四项任务中，两种合成表示均优于纯视觉策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.20683" target="_blank" rel="noreferrer">arXiv</a><a href="https://felt-tactile.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>GENERATIVE SIMULATION</span><span>4D PHYSICAL WORLD</span><span>PHYSICS-IN-THE-LOOP</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21522" target="_blank" rel="noreferrer">GS-Agent: Creating 4D Physical Worlds With Generative Simulation</a></h3>
      <p>让多个专职 agent 通过代码操纵物理引擎，围绕资产、材质、布置、运动、相机与光照迭代接受多模态反馈，从自然语言构建可控且可运行的 4D 世界；输出覆盖液体、可变形体与刚体交互，强调生成结果是物理仿真而非仅像素视频。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21522" target="_blank" rel="noreferrer">arXiv</a><a href="https://umass-embodied-agi.github.io/gs-agent/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>DEFORMABLE WORLD MODEL</span><span>DIFFERENTIABLE PHYSICS</span><span>MATERIAL IDENTIFICATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.20653" target="_blank" rel="noreferrer">PhysCoRe: Physics-Corrected Residual World Models for Material-Aware Deformable Dynamics</a></h3>
      <p>把可微 MPM 模拟器与材质推断、动力学残差两个前馈网络耦合：前者从视觉估计逐粒子弹性，后者修正解析模拟器的系统偏差；少量交互即可适应新物体，并用预测不确定性引导后续探索，真实可变形操作序列上优于现有预测基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.20653" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>BIMANUAL MANIPULATION</span><span>COMPOSITIONAL DIFFUSION</span><span>ENERGY GUIDANCE</span><span>IROS 2026</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.21341" target="_blank" rel="noreferrer">Grasp, Handover, Rotate: Bimanual Object Reorientation via Compositional Diffusion and Energy-Based Optimization</a></h3>
      <p>BiCompoDiff 在抓取扩散模型的反向生成过程中注入碰撞规避、可微逆运动学平滑、交接可行性与再抓取安全等能量梯度，把抓取选择、双臂交接、再抓取和运动规划联合为一个可组合优化过程，面向直接放置受限的物体重定向。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.21341" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-23" class="paper-day-heading">2026-07-23</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 HOST × EgoRecovery：前者把单段人类示范转成推理时可执行的新技能，后者把人类第一视角失败恢复片段对齐到机器人纠错意图，二者共同指向“人类视频作为低成本策略增量”的数据范式；再以 KineBench 检查世界模型评测能否摆脱 IDM 误差归因，以 DEED 观察 VLA 从实验室到真实零售部署时数据后训练与经验驱动改进的系统瓶颈。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--data paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>HUMAN VIDEO</span><span>ONE-SHOT SKILL</span><span>INFERENCE-TIME ADAPTATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.20033" target="_blank" rel="noreferrer">Robots Acquire Manipulation Skills in Seconds from a Single Human Video</a></h3>
      <p>HOST 把人类视频与机器人轨迹映射到共享任务进度流形，依次预测当前进度、自身未来观测与动作，使机器人无需训练循环即可从单段视频注入新技能。平均 29 秒完成技能获取、成功率 62%，相对零样本基线提升 45%，且保留已有技能。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.20033" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED WORLD MODEL</span><span>IDM-FREE EVAL</span><span>6D KINEMATICS</span><span>ECCV 2026</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.19876" target="_blank" rel="noreferrer">KineBench: Benchmarking Embodied World Models via IDM-Free Kinematic Grounding</a></h3>
      <p>用级联视觉基础模型从生成视频逐帧提取 6D 末端位姿，再送入物理模拟器闭环执行，避免 IDM 在新物体和新场景上的误差污染世界模型归因；覆盖 ManiSkill3 的 20 项操作任务，并以平滑度和可操作度补充任务成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.19876" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>FAILURE RECOVERY</span><span>EGOCENTRIC HUMAN DATA</span><span>CORRECTIVE INTENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.19745" target="_blank" rel="noreferrer">EgoRecovery: Acquiring Failure Recovery Ability Through Human Recovery Demonstration</a></h3>
      <p>把人类第一视角恢复示范与少量机器人恢复数据对齐到共享纠错意图空间，并用恢复门控只在失败状态触发修正。该采集协议每小时得到的有效恢复数据超过机器人遥操作的 10 倍，真机实验优于机器人单独训练及直接人机联合训练。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.19745" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>HUMANOID VLA</span><span>POST-TRAINING</span><span>EXPERIENCE-DRIVEN</span><span>UNITREE G1</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.20345" target="_blank" rel="noreferrer">Closing the Lab-to-Store Gap: A Data-Efficient Post-Training and Experience-Driven Learning VLA Framework for Retail Humanoids</a></h3>
      <p>DEED 在 Unitree G1 超市补货任务上组合控制频率对齐、数据筛选、任务相关视觉高亮、文本优势前缀与视觉语言价值函数，把朴素微调下失败的 GR00T N1.6 策略用单张 GPU 改造成可工作的真实系统，强调部署瓶颈首先是数据与系统集成。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.20345" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>LANGUAGE-GUIDED GRASP</span><span>MULTI-EMBODIMENT</span><span>2.56M GRASPS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.20207" target="_blank" rel="noreferrer">SeededGrasp: Language-Guided Grasping in Complex Scenes with Multiple Embodiments</a></h3>
      <p>让预训练 VLM 只预测语言目标的种子点，再由轻量 flow-matching 模型生成 6DoF 抓取，将语义推理与几何执行解耦；同时发布首个复杂桌面场景多本体抓取集，含 256 万抓取位姿，仿真与真机成功率分别为 72% 和 78%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.20207" target="_blank" rel="noreferrer">arXiv</a><a href="https://uoft-isl.github.io/seeded-grasp/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>DIFFUSION POLICY</span><span>VIDEO-ACTION MODEL</span><span>REVISABLE DENOISING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.19919" target="_blank" rel="noreferrer">Diffusion ReRoll: Revisable Denoising for Robotic Sequential Prediction</a></h3>
      <p>对已局部稳定的时间段选择性重新加噪，使序列前后段在生成中反复修正而不锁死错误前缀；同一机制覆盖长时规划、动作生成与视频—动作联合预测，在 LIBERO-10 上相对 Diffusion Policy 平均成功率提升 56.5%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.19919" target="_blank" rel="noreferrer">arXiv</a><a href="https://seonsoo-p1.github.io/DiffusionReRoll/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TELEOPERATION</span><span>BIMANUAL MOBILE MANIPULATION</span><span>HAPTICS</span><span>OPEN SOURCE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.19479" target="_blank" rel="noreferrer">ModPack: An Extensible Teleoperation Interface for Bimanual Mobile Manipulation</a></h3>
      <p>以自包含可穿戴背包统一计算、电源、通信和存储，再插件化接入关节级触觉遥操作、移动操作与主动感知模块；跨两种机器人本体验证真实移动操作的数据采集与策略学习，并开放完整硬件设计和软件栈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.19479" target="_blank" rel="noreferrer">arXiv</a><a href="https://modpack-robotics.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-22" class="paper-day-heading">2026-07-22</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 Masked Visual Actions × WorldScape Policy 2.0：前者用统一像素动作接口把视频模型变成正向动力学、逆向策略与候选轨迹评估器，后者用长短期事件记忆补足 WAM 的任务进度跟踪；再以 RoboInter1.5 检查密集中间表征能否同时约束动作与世界 rollout，以 Agentic Real2Sim 观察自动构建可执行物理孪生的数据闭环。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WORLD MODEL</span><span>VISUAL ACTION</span><span>FORWARD / INVERSE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.19343" target="_blank" rel="noreferrer">Masked Visual Actions for Unified World Modeling</a></h3>
      <p>把任意实体的部分可见像素轨迹作为动作接口：暴露机器人运动时预测环境响应，暴露目标物体运动时反推出机器人行为。单一模型只用 15 小时真机与仿真遮罩视频微调，即可跨场景和本体用于 rollout 评估、候选未来排序与逆向动作合成。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.19343" target="_blank" rel="noreferrer">arXiv</a><a href="https://masked-visual-actions.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD ACTION MODEL</span><span>EVENT MEMORY</span><span>MANIPEVENT-5M</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18840" target="_blank" rel="noreferrer">WorldScape Policy 2.0: Empowering Steerable World Action Modeling with Reasoning-Augmented Memory</a></h3>
      <p>以 DiT prefill 保存短期视觉动力学，并把 VLM 历史整理成全局、局部活跃与事件边界记忆，实现进度感知检索和隐式子目标规划；同时构建近 500 万事件片段的 ManipEvent-5M，统一支持文本、目标图像和视频上下文控制。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18840" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>ROBOT DATA</span><span>INTERMEDIATE REPRESENTATION</span><span>VLA + WORLD MODEL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18709" target="_blank" rel="noreferrer">RoboInter1.5: A Holistic Intermediate Representation Suite for Embodied World Modeling and Robotic Manipulation</a></h3>
      <p>在 571 个场景、超过 23 万条操作轨迹上提供子任务、技能、物体与夹爪 grounding、可供性、抓取位姿、接触点和运动轨迹等十余类逐帧标注，并配套 VQA、VLA 与世界模型，验证中间表征既可规范动作空间也可约束未来状态生成。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18709" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>AGENTIC REAL2SIM</span><span>PHYSICAL TWIN</span><span>CROSS-DOMAIN</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.19190" target="_blank" rel="noreferrer">Agentic Real2Sim: Physics-based World Modeling with Vision-Language Agents</a></h3>
      <p>让视觉语言 agent 从真实交互视频恢复几何、物体状态、物理参数、相机与轨迹，自动装配可运行的 episodic twin；统一覆盖刚体操作、可变形物体和人形运动，开源权重 VLM 后端以远低于前沿模型的成本取得相近转换成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.19190" target="_blank" rel="noreferrer">arXiv</a><a href="https://ericchen321.github.io/agentic_real2sim.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>EMBODIED LLM</span><span>ON-DEVICE</span><span>HIGH-LEVEL INTERACTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18985" target="_blank" rel="noreferrer">Athena-Brain Technical Report: An Efficient Robot Brain for General Intelligence and Embodied Interaction</a></h3>
      <p>Athena-Brain-8B 通过通用 SFT、通用强化学习、具身专家训练与模型合并，兼顾通用推理和端侧高层具身交互；相对 Qwen3-8B thinking 保持相近通用能力但输出更短，在域内具身评测上超过同规模及若干更大的零样本模型。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18985" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VISUO-TACTILE SENSOR</span><span>SURGICAL ROBOT</span><span>OPEN SOURCE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18660" target="_blank" rel="noreferrer">MVP-Tac: A Miniaturized Dual-Modal Vision and Photoelastic Tactile Sensor for Robot-Assisted Minimally Invasive Surgery</a></h3>
      <p>以半透明膜和可控照明在同一微型光路中切换视觉与光弹性触觉，兼顾腔内导航和触诊；0–2 N 标定后，对暴露与皮下肿瘤模型的硬度分类分别达到 97% 和 92%，并开放设计、制造与固件。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18660" target="_blank" rel="noreferrer">arXiv</a><a href="https://mvp-tac.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>LEGGED BALANCE</span><span>KOOPMAN</span><span>REAL ROBOT DATA</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18760" target="_blank" rel="noreferrer">Koopman DCM: Unstable Eigenfunctions as Data-driven Representations for Legged Balancing</a></h3>
      <p>把腿式平衡中的发散运动分量推广为 Koopman 不稳定特征函数，仅用一小时真机数据学习可观测量；在真实双足机器人上改善参考步态跟踪，并与 MPC 结合形成基于状态的可行性约束。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18760" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-21" class="paper-day-heading">2026-07-21</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 RynnBrain 1.1 × POT-VLA：前者把统一跨本体动作空间、接触点预测和 3D grounding 纳入具身基础模型，后者用持久 3D 物体 token 把人形动作生成与结果验证闭环；再以 FM-VLA 检查力觉历史能否补足视觉记忆，以 Patch Policy 对照大 VLM 与轻量密集视觉策略的效率边界。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>EMBODIED FOUNDATION MODEL</span><span>CROSS-EMBODIMENT</span><span>3D GROUNDING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.17977" target="_blank" rel="noreferrer">RynnBrain 1.1: Towards More Capable and Generalizable Embodied Foundation Model</a></h3>
      <p>发布 2B、9B 与 122B-A10B 具身基础模型，引入接触点预测和原生 3D grounding，并以统一跨本体动作空间训练 VLA；在 Unitree G1、Astribot-S1 和天机五季真机上，多任务多本体联合训练优于逐任务训练。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.17977" target="_blank" rel="noreferrer">arXiv</a><a href="https://alibaba-damo-academy.github.io/RynnBrain" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/alibaba-damo-academy/RynnBrain" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>HUMANOID VLA</span><span>3D OBJECT TOKENS</span><span>CLOSED-LOOP VERIFICATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18016" target="_blank" rel="noreferrer">Closing the Loop in Humanoid VLA: Persistent 3D Object Tokens for Verifiable Loco-Manipulation</a></h3>
      <p>POT 用 RGB-D 维护带角色的持久 3D 物体记录，让同一状态同时条件化全身动作并执行几何谓词验证；POT-VLA 在 Unitree G1 八类真机任务上把匹配的 GR00T-N1.7 基线由 39/80 提升至 71/80。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18016" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VLA</span><span>FORCE MEMORY</span><span>CONTACT-RICH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18231" target="_blank" rel="noreferrer">FM-VLA: Force-based Memory for Vision-Language-Action Models in Contact-Rich Manipulation</a></h3>
      <p>用 VAE 把力时序压成紧凑记忆 token，补足视觉难以区分重复按压、擦拭次数等非马尔可夫接触事件；三项记忆依赖任务成功率超过 80%，且几乎不增加推理开销。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18231" target="_blank" rel="noreferrer">arXiv</a><a href="https://qft-333.github.io/FM-VLA-Page/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>ROBOT POLICY</span><span>DENSE VISUAL TOKENS</span><span>HIGH-FREQUENCY CONTROL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18236" target="_blank" rel="noreferrer">Patch Policy: Efficient Embodied Control via Dense Visual Representations</a></h3>
      <p>以 block-causal mask 让轻量 Transformer 直接消费预训练 ViT 的密集 patch token；横跨四套仿真和三套真机环境，相对全局池化表征提升 40%，仅用约 0.7% 参数量即比微调 OpenVLA-OFT 高 18%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18236" target="_blank" rel="noreferrer">arXiv</a><a href="https://patch-policy.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>POLICY ORCHESTRATION</span><span>EXECUTION MEMORY</span><span>LONG HORIZON</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18060" target="_blank" rel="noreferrer">RoboHarness: Memory-Driven Orchestration of Heterogeneous Robot Policies for Long-Horizon Planning</a></h3>
      <p>把 VLA、RL 与 TAMP 等异构控制系统封装为 agentic skills，用多模态执行记忆学习能力边界并路由，再以 Memory Bridge 把机器人引导到下一策略的分布内状态；覆盖 500 个定制任务和 135 次真机实验。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18060" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>SIM-TO-REAL</span><span>DYNAMICS MODEL</span><span>DOMAIN TRANSLATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18154" target="_blank" rel="noreferrer">World Translation: Minimizing Sim-to-Real Gap with Backward Dynamics Extraction and Unpaired Domain Translation</a></h3>
      <p>不再从可能无信息的历史前向猜测隐变量，而从已观测转移反向提取不可观测动力学，再以无配对域翻译在仿真与现实间保留动力学内容；覆盖人形、四足与机械臂，并在 Go2 真机改善策略迁移。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18154" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED PLANNING</span><span>UNIFIED BENCHMARK</span><span>FOUR SIMULATORS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.18062" target="_blank" rel="noreferrer">UniETP: Unifying Environments for Generalizable Embodied Task Planning</a></h3>
      <p>统一 AI2-THOR、VirtualHome、Habitat 与 BEHAVIOR 的观察和动作空间，并自动构造跨任务逻辑、实例 grounding 和指令理解难度的数据；以一致评测揭示当前具身任务规划模型的瓶颈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.18062" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/woyut/UniETP" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>ROBOT DATA</span><span>DUAL-ARM</span><span>OPEN SOURCE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.17970" target="_blank" rel="noreferrer">MEVION: Low-Cost Open-Source Data Collection System for Powerful and High-Speed Dual-Arm Manipulation</a></h3>
      <p>面向 ALOHA 难覆盖的高速重载采集，开放四条 6-DoF 手臂、最高 60 Nm 关节转矩的双臂 leader-follower 系统；整机约 1.4 万美元，并展示此前难采的强力、高速操作与模仿学习。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.17970" target="_blank" rel="noreferrer">arXiv</a><a href="https://haraduka.github.io/mevion-hardware/" target="_blank" rel="noreferrer">Project</a><a href="https://github.com/haraduka/mevion" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA ROBUSTNESS</span><span>REASONING</span><span>ADAPTIVE ATTACK</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.17786" target="_blank" rel="noreferrer">Reasoning as a Double-Edged Sword: Architecture and Cross-Stage Robustness in Vision-Language-Action Models</a></h3>
      <p>在 LIBERO 与 SimplerEnv 跨视觉、推理和动作阶段扰动无推理、文本 CoT 与潜在迭代 VLA；潜在迭代模型最脆弱，且看似有效的计划—动作一致性监控在自适应攻击下跌至随机水平。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.17786" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>FLOW POLICY</span><span>CONTACT PROGRESS</span><span>ACTION SELECTION</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.17651" target="_blank" rel="noreferrer">HCPG-Flow: Hierarchical Contact-Progress Guidance for Flow-Policy Robot Manipulation</a></h3>
      <p>用解析式、物体中心的接触进度指导替代依赖稀疏 replay 的 critic 候选排序：接触前关注末端接近，接触后切换任务进度；十项仿真任务提升成功率，四项真机任务将成功完成步数减少 17.4%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.17651" target="_blank" rel="noreferrer">arXiv</a><a href="https://hitxraz.github.io/HCPG-Flow/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-20" class="paper-day-heading">2026-07-20</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 Xiaomi-Robotics-1 × AC-VLA：前者把 UMI 真机轨迹预训练推到十万小时，后者直指大规模 VLA 仍会出现的组合泛化短板；再以 Data and Learning Where it Matters 检查“关键接触段密集采数”的低成本路线，并用 IMBench 验证物理推理能否真正落到可执行动作。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>VLA</span><span>100K HOURS</span><span>SCALING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15330" target="_blank" rel="noreferrer">Xiaomi-Robotics-1: Scaling Vision-Language-Action Models with over 100K Hours of Real-World Trajectories</a></h3>
      <p>以超过 10 万小时 UMI 真机操作轨迹预训练 VLA，并用自动标注流水线生成场景状态变化语言；模型在数据量和参数量上呈稳定 scaling，RoboCasa365 成功率达 57.6%，也能用少量数据适配灵巧新任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15330" target="_blank" rel="noreferrer">arXiv</a><a href="https://robotics.xiaomi.com" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>COMPOSITIONAL OOD</span><span>MASKING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15714" target="_blank" rel="noreferrer">AC-VLA: Robust Out-of-Distribution Action Execution via Compositional Learning</a></h3>
      <p>把 VLA 的组合失败归因于整段轨迹过拟合与腕部视觉捷径，以指令分解、轨迹对齐生成子任务监督，并按夹爪状态非对称遮蔽腕部视图；无需改架构即可接入 π0.5，LIBERO-OOD 组合任务提升约 28 个百分点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15714" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>CONTACT-RICH</span><span>TARGETED DATA</span><span>OFFLINE RL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15982" target="_blank" rel="noreferrer">Data and Learning Where it Matters for Contact-Rich Manipulation</a></h3>
      <p>不再端到端密集采集整条轨迹，而只在接触关键段自动采数并用离线深度强化学习训练，其余自由空间运动交给规划器；四项真机任务仅用 2–2.5 小时数据即达 96% 平均成功率，强基线为 55%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15982" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MANIPULATION EVAL</span><span>PHYSICAL REASONING</span><span>14K TRAJECTORIES</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15641" target="_blank" rel="noreferrer">IMBench: A Benchmark for Intuitive Robotic Manipulation</a></h3>
      <p>以 35 项任务和 1.4 万条筛选轨迹，把感知、物理推理、动作生成与迭代执行放进同一评测，覆盖接触富集操作、工具使用和多阶段依赖；结果显示 VLM 难产出可执行计划，先进 VLA 也难满足约束并跨场景泛化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15641" target="_blank" rel="noreferrer">arXiv</a><a href="https://imbench.org" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VISUO-TACTILE</span><span>ACTIVE PALM</span><span>DEXTEROUS GRIPPER</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15448" target="_blank" rel="noreferrer">VTAP Gripper: Synergizing Fingertip Sensing and a Visuo-Tactile Active Palm for Dexterous In-Hand Manipulation</a></h3>
      <p>把视觉触觉主动掌面与带触觉阵列的可重构柔顺手指协同起来，并用分阶段手势条件重定向连接人手与三指结构；覆盖脆弱物抓取、针筒手内重定向、3 mm 物体分离及视觉触觉插孔。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15448" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VISUO-TACTILE</span><span>POSE BELIEF</span><span>ACTIVE PROBING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.16123" target="_blank" rel="noreferrer">BayesContact: Uncertain Pose Estimation via Visuo-Tactile Proposals and Simulation-based Inference</a></h3>
      <p>以粒子信念融合深度与力矩接触证据，用渲染器和物理仿真器近似观测似然，并以信息增益主动选择探测动作；在仿真几何与真机插孔中，相比纯视觉提高 30% 的位姿可观测性与插入成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.16123" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>DEXTEROUS HAND</span><span>RECONFIGURABLE ROBOT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.16187" target="_blank" rel="noreferrer">Handroid: Bridging Dexterous Hand and Humanoid</a></h3>
      <p>同一套 27 自由度机电本体可重构为 20 自由度灵巧手或桌面人形，统一支持遥操作、抓取、手内操作、行走与动作编辑；真机展示从本体重构、移动、对接到灵巧取放的长时序任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.16187" target="_blank" rel="noreferrer">arXiv</a><a href="https://handroid.org" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>TACTILE LOCALIZATION</span><span>3D ALIGNMENT</span><span>100 OBJECTS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.16146" target="_blank" rel="noreferrer">VTLoc: Learning-based Tactile Contact Localization in Visual Point Clouds</a></h3>
      <p>从触觉读数在物体三维点云中定位接触点，以伪点云重建对齐视觉—触觉几何，再迭代细化位置；在新建的 100 个真实物体基准上降低单次触摸的局部—全局对应歧义。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.16146" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMAN MOTION DATA</span><span>EGO-EXO</span><span>SMART GLASSES</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15868" target="_blank" rel="noreferrer">EgoExoMoCap: Distributed Ego-Exo Human Motion Capture</a></h3>
      <p>让两名或更多参与者各戴一副智能眼镜，联合第一视角和互拍视角、头腕追踪及 DINOv3 特征恢复全局人体运动；在两套野外数据上对噪声和遮挡保持稳健，为低门槛真实人类交互数据采集提供新路径。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15868" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>TACTILE SENSOR</span><span>OPTICAL FIBER</span><span>INTERPRETABLE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15746" target="_blank" rel="noreferrer">Towards Artificial Nerves: Biomimetic Optical-Fiber Tactile Sensing for Robots</a></h3>
      <p>OptiTac 让软皮肤的每个机械针连接一根光纤，模仿机械感受器到神经的结构，把信号从触面引出同时保留高空间分辨率；将触觉当图像后即可用可解释解析方法估计接触位置、尺寸与形状。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15746" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-17" class="paper-day-heading">2026-07-17</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 RoboTTT × DriftWorld：前者把 8K 步交互历史压缩进推理期快速权重，打开机器人策略的上下文规模轴；后者用单次前向的 drifting 生成替代扩散迭代，让世界模型真正进入在线搜索。再以 Open-AoE 检查低成本人类视频到 VLA/WAM 的数据链，以 BadWAM × WA-LQR 对照 WAM 的新攻击面与训练外稳健控制。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--vla paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>ROBOT FOUNDATION MODEL</span><span>LONG CONTEXT</span><span>TEST-TIME TRAINING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15275" target="_blank" rel="noreferrer">RoboTTT: Context Scaling for Robot Policies</a></h3>
      <p>把测试时训练嵌入 VLA 等机器人基础模型，以推理期梯度更新形成快速权重，将最长 8K 步历史压进固定延迟的循环状态；真机总体性能较单步上下文提升 87%，并完成基线从未完成的五分钟十阶段装配。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15275" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD MODEL</span><span>ONE-STEP GENERATION</span><span>PLANNING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15065" target="_blank" rel="noreferrer">DriftWorld: Fast World Modeling through Drifting</a></h3>
      <p>训练 action-conditioned drift、推理仅单次前向生成未来帧，在五类机器人基准达到 30+ FPS、平均快于扩散世界模型 17 倍；除在线动作搜索外，rollout 分数与真实策略排名相关性最高达 0.99。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15065" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EGOCENTRIC DATA</span><span>HUMAN-TO-ROBOT</span><span>OPEN TOOLCHAIN</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14183" target="_blank" rel="noreferrer">Open-AoE: An Open Egocentric Manipulation Dataset and Toolchain for Embodied Learning</a></h3>
      <p>首版由 500 余名贡献者用 400 余部手机采集约 2,000 小时自然场景操作视频，提供文本、MANO 手姿、相机轨迹与原子动作；配套处理、跨本体重定向及 VLA/WAM/世界模型训练工具链。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14183" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM SAFETY</span><span>ADVERSARIAL ATTACK</span><span>IMAGINATION-ACTION DRIFT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15207" target="_blank" rel="noreferrer">BadWAM: When World-Action Models Dream Right but Act Wrong</a></h3>
      <p>定义 World-Action Drift Attack：微小视觉扰动可让 WAM 的未来想象保持合理、执行动作却发生有害偏移；统一评测显式 action-only 与更隐蔽的 imagination-preserving 攻击，前者将成功率由 96.5% 降至 43.1%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15207" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>VLA</span><span>FORCE FEEDBACK</span><span>ONLINE DAGGER</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14236" target="_blank" rel="noreferrer">Never Too Late for Force: Accelerating VLA Post-Training with Reactive Force Injection</a></h3>
      <p>LIFT 在预训练 VLA 动作专家旁接入可刷新的反应式专家，以 6D 末端力记忆和零初始化交叉注意力处理接触状态；结合在线 DAgger 人工纠偏，在折毛巾、插书与汉诺塔放环上更快学成。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14236" target="_blank" rel="noreferrer">arXiv</a><a href="https://lift-policy.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>TACTILE VLA</span><span>FUTURE CONTACT</span><span>REPRESENTATION PROBING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14609" target="_blank" rel="noreferrer">Representation-Aligned Tactile Grounding for Contact-Rich Robotic Manipulation</a></h3>
      <p>线性探测发现未来触觉最适合从动作专家中间层预测，而非视觉语言特征或最终动作；据此用轻量 LTP 预测紧凑触觉 embedding，把动作表征对齐未来接触后果，真机优于错位及多接口监督。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14609" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>STREAMING INFERENCE</span><span>KV CACHE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14695" target="_blank" rel="noreferrer">Reflex: Real-Time VLA Control through Streaming Inference</a></h3>
      <p>利用感知编码对 flow timestep 不变的性质，把注意力上下文拆成静态、滑动与动态区，实现固定输入下与全批等价的 O(1) 增量缓存；配合异步流水与算子融合达到 50 Hz，推理加速 2.58 倍。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14695" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>MECHANISTIC INTERPRETABILITY</span><span>OPTIMAL CONTROL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14943" target="_blank" rel="noreferrer">Steering Robustness into World Action Models via Mechanistic Interpretability and Optimal Control</a></h3>
      <p>先诊断不同 WAM 激活空间中稳健特征的低维线性可分性，再以模型最优控制构造 WA-LQR 反馈 steering；在 Cosmos-Policy 与 DiT4DiT 上跨任务提升相机、夹爪和视觉噪声扰动稳健性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14943" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>AERIAL ROBOT</span><span>ACTION-ONLY INFERENCE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14997" target="_blank" rel="noreferrer">AeroAct: Action-Centered World-Action Models for Language-Conditioned Quadrotor Flight</a></h3>
      <p>把 action-centered WAM 首次落到真实四旋翼：训练用未来第一视角帧监督，部署直接解码局部轨迹动作块而不生成视频；结合双仿真渲染、低成本手持采集与 self-guidance，在真机完成语言条件飞行。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14997" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--humanoid">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>BEHAVIOR FOUNDATION MODEL</span><span>SCALING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.15163" target="_blank" rel="noreferrer">Scaling Behavior Foundation Model for Humanoid Robots</a></h3>
      <p>联合研究全局帧运动跟踪范式、on-policy rollout 数量、参考动作多样性与 Humanoid Transformer 架构的规模配方；仿真和真机均改善全身控制，测试集全局模式 MPKPE 较既有控制器降低 82%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.15163" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>POLICY EVALUATION</span><span>ACTIVE TESTING</span><span>REAL WORLD</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14439" target="_blank" rel="noreferrer">Active Real-World Factor-Based Evaluation for Generalist Robot Policies</a></h3>
      <p>把真机策略评测重写为序贯实验设计，以概率代理模型在结构化任务因素空间主动选择最大信息增益配置；在三任务 2,331 次真机评测中，通常比随机测试节省至少 20–40% 试验。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14439" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>DEXTEROUS HAND</span><span>TACTILE HARDWARE</span><span>OPEN SOURCE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14487" target="_blank" rel="noreferrer">MIDAS Hand: Modular low-Impedance Direct-drive Anthropomorphic Sensing Hand</a></h3>
      <p>开源人尺度低阻抗灵巧手集成 16 自由度、283 个三轴触觉 taxel，整机 700 g、物料成本低于 3,000 美元且三小时内可装配；同步开放设计、控制、触觉 API、仿真、重定向与遥操作栈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14487" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>REPRESENTATION STEERING</span><span>FLOW MATCHING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14280" target="_blank" rel="noreferrer">DiMaS: Distribution Matching for Steering Vision-Language-Action Models</a></h3>
      <p>发现 VLA 行为特征虽可线性解码却不可线性 steering，提出在流匹配 VLA 内部表示分布间做 transport；在两类先进 VLA 上实现细粒度行为控制，并刻画跨任务迁移何时衰减。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14280" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>GRASPING BENCHMARK</span><span>SEMANTIC CONSTRAINTS</span><span>EXECUTION</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14341" target="_blank" rel="noreferrer">Beyond Visual Grasping: Benchmarking Complex Grasping from Detection to Execution</a></h3>
      <p>GCA-Bench 把抓取评测从孤立姿态检测扩展到含场景推理、语义约束与多步执行的复杂动作；从传统检测管线到端到端基础模型的多类基线成功率均低于 70%，并给出失败模式与新指标。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14341" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED SAFETY</span><span>SPATIAL RELATIONS</span><span>PROCESS EVALUATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14543" target="_blank" rel="noreferrer">SafeRelBench: A Spatial-Relation-Aware Benchmark for Process-Level Safety in VLM-Driven Embodied Agents</a></h3>
      <p>用 507 个可执行样本评测支撑、包含与邻近关系引发的过程级风险；七种 VLM 具身 agent 常能完成任务却在危险动作前违反安全条件，揭示终态成功与执行安全间的系统缺口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14543" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>FORCE PROXY</span><span>ACT</span><span>CONTACT-RICH</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14578" target="_blank" rel="noreferrer">Beyond Implicit Force: Evaluating Explicit Force-Torque Proxies in Action Chunking with Transformers</a></h3>
      <p>拆解 leader-follower 遥操作跟踪误差隐含的接触线索，发现移除此信号会让 ACT 在力关键阶段严重失败；仅用电流或关节 effort 构造的扭矩 proxy 即可恢复并进一步提升四类真机接触任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14578" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA ROBUSTNESS</span><span>PHYSICAL ATTACK</span><span>COLOR</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14698" target="_blank" rel="noreferrer">Lights, Camera, Malfunction: When Illumination Robustness Leaves VLA Models Blind to Color</a></h3>
      <p>FLARE 聚光物理攻击可在黑盒下把 VLA 成功率降至零；论文进一步发现朴素增强会让模型错误忽略颜色，并提出保色对抗训练 ChromaGuard，真机良性与受攻击任务分别达到 97.5%/92.5%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14698" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--tactile">
      <div class="paper-ticket__meta"><span>HAPTIC FUSION</span><span>IN-HAND TRACKING</span><span>OCCLUSION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14842" target="_blank" rel="noreferrer">KineFuse: Kinematic-Aware Haptic Fusion for In-Hand Occluded-Object Pose Tracking</a></h3>
      <p>将本体、近端力矩与二值接触压成手指级 token，补足视觉在手内操作中的遮挡；序列评测会把编码器差异放大至 15 倍，4-token 结构优于扁平及关节级融合，并提升闭环重定向成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14842" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LIFELONG LEARNING</span><span>REPLAY</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14852" target="_blank" rel="noreferrer">Towards Human-like Physical Intelligence: Lifelong Vision-Language-Action Learning for Robotic Manipulation</a></h3>
      <p>LifelongVLA 用短期与长期 LoRA 路径及任务门控显式平衡可塑性和稳定性，再以缓存高效随机 replay 保存旧技能；在 xArm 真机顺序学习中改善新技能扩展与旧行为保持。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14852" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>ACTION SUPERVISION</span><span>REPRESENTATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14635" target="_blank" rel="noreferrer">Action QFormer: Structured Representation Shaping under Action Supervision in Vision-Language-Action Models</a></h3>
      <p>指出动作监督既塑造可执行表示，也可能破坏语言与物体 grounding；以指令条件 query 在动作生成前重组多模态信息，零样本 sim-to-real 导航成功率由 18.8% 提至 56.3%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14635" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-16" class="paper-day-heading">2026-07-16</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 GigaWorld-Policy-0.5 × REAL：前者把 WAM 的未来视觉监督留在训练期、把部署收敛为低延迟动作解码，后者给出无 oracle 感知的开放世界移动操作训练—评测—真机闭环；再以 Anchor-Align × Semantic Anchoring 对照两种 VLA 语义保持机制，以 WANDA 和 PhysClaw-0 观察单示范合成与可记忆语言纠错如何降低数据成本。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WAM</span><span>ACTION-ONLY INFERENCE</span><span>AUTORESEARCH</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13960" target="_blank" rel="noreferrer">GigaWorld-Policy-0.5: A Faster and Stronger WAM Empowered by AutoResearch</a></h3>
      <p>训练时混合动作条件世界建模与 WAM 目标，让未来视觉动力学继续提供稠密监督；推理时通过 Mixture-of-Transformers 只激活动作专家，在 RTX 4090 上达到 85 ms 延迟，并用 agent-based AutoResearch 搜索训练配置。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13960" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MOBILE MANIPULATION</span><span>OPEN WORLD</span><span>INTERACTIVE AGENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13653" target="_blank" rel="noreferrer">Exploratory, Communicative, and Deployable: Vision-Driven Embodied Agents for Open-World Mobile Manipulation</a></h3>
      <p>REAL 在无特权状态的 sim-to-real 一致接口中统一主动探索、视觉 grounding 与意图澄清，并发布含 241 项任务的 REAL-Bench；经 SFT 与在线 RL 的 agent 在双臂移动机器人 60 次真机测试中达到 78.3% 端到端成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13653" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/InternRobotics/REAL" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>REPRESENTATION ANCHORING</span><span>LANGUAGE-ACTION ALIGNMENT</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13429" target="_blank" rel="noreferrer">Generalizable VLA Finetuning via Representation Anchoring and Language-Action Alignment</a></h3>
      <p>Anchor-Align 用冻结 VLM 逐层蒸馏抑制行为克隆对预训练表征的覆盖，并把动作转为运动方向标签，在同一机器人观测上联合语言与动作预测；两种 VLA 的 xArm7 真机成功率分别由 28%/37% 提升到 54%/60%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13429" target="_blank" rel="noreferrer">arXiv</a><a href="https://anchoralignvla.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>SEMANTIC MANIFOLD</span><span>OOD GENERALIZATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13597" target="_blank" rel="noreferrer">Semantic Anchoring for Robotic Action Representations</a></h3>
      <p>系统探测 VLA 微调中动作表征语义结构的退化，并把它与任务成功和 OOD 泛化同步关联；训练期将动作表征拆成共享语义与私有通道并锚定预训练语义流形，部署不增加模块，真机 OOD 最高提升 21.5%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13597" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA SYNTHESIS</span><span>MOBILE MANIPULATION</span><span>ONE DEMO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13154" target="_blank" rel="noreferrer">Worlds in One Demo: A Synthetic Data Engine for Learning Open-World Mobile Manipulation</a></h3>
      <p>WANDA 从一条 RGB-D 示范重建高斯场景与交互轨迹，重排接触片段、扩展纠错状态，并把轨迹合成到日常照片生成的不同 3D 世界；由此覆盖空间、长程与跨环境泛化，还支持跨本体零样本部署。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13154" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA COLLECTION</span><span>LANGUAGE CORRECTION</span><span>CORRECTIVE MEMORY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14047" target="_blank" rel="noreferrer">PhysClaw-0: A Symbiotic Agentic System for Robot Autonomy via Language Corrections</a></h3>
      <p>让收集、验证和复位循环自主运行，仅在重试预算耗尽时请求远程语言纠正；LLM 将纠正写入可跨轮复用的 Corrective Memory，桌面清理中以 16% 的人工工作时间匹配遥操作数据训练出的策略表现。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14047" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>INDUSTRIAL BENCHMARK</span><span>MULTIMODAL POLICY</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.14021" target="_blank" rel="noreferrer">Industrial Dexterity Benchmark: A Hardware-Software Benchmarking Platform for Industrial Dexterous Manipulation</a></h3>
      <p>发布面向数据中心线缆、汽车线束与齿轮箱装配的实体 benchmark 板，以及 DAG-ROS 模仿学习框架和融合 RGB、点云、关节、腕力的 AG-iDP3；多视角扩散策略在线缆抓插任务达到 78% 成功率。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.14021" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>AGENTIC RL</span><span>FAILURE RECOVERY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13818" target="_blank" rel="noreferrer">Learning Robust Execution in Robotic Manipulation with Agentic Reinforcement Learning</a></h3>
      <p>用两项运行时指标判断执行是否退化，再让高层 agent 在少量执行模式间选择恢复策略、回到曾访问的正常状态，而非重学低层动作；LIBERO 标准设置最高提升 13.7%，扰动设置最高提升 39.2%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13818" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MULTIMODAL ENCODER</span><span>PROPRIOCEPTION</span><span>FORCE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13522" target="_blank" rel="noreferrer">Kepler-Encoder-v0.1: Towards a Multimodal Embedding Model for Robots</a></h3>
      <p>训练时以 masked cross-modal prediction 融合视觉、本体与力矩，评测时仅输入视觉，却能在 RH20T 多机器人上更好恢复末端与力状态；同一冻结潜空间还能作为无需训练的异常状态监测器。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13522" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>DEFORMABLE OBJECT</span><span>ACTIVE SENSING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13479" target="_blank" rel="noreferrer">Topology-Agnostic Mesh Reconstruction of Deformable Objects from Sparse Touch</a></h3>
      <p>用统一的 permutation-invariant cross-attention 从少量触点重建绳、布料与软体三类不同拓扑的完整网格；深度集成不确定性还能主动选择下一触点，在无视觉和强自遮挡条件下降低误差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13479" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MANIPULATION DATA</span><span>TEMPORAL REVERSAL</span><span>AUTONOMOUS COLLECTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13455" target="_blank" rel="noreferrer">Reverse to Advance: Teleoperation-Cost Effective Hard Policy Learning from Reversed Easy Tasks</a></h3>
      <p>利用困难任务与其逆向简单任务的难度不对称，自主交替收集并时间反转简单轨迹，再以运动学先验和 critic advantage 过滤噪声；仿真和真机高精度操作均减少困难任务遥操作需求。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13455" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LONG HORIZON</span><span>STAGE INTERFACE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13605" target="_blank" rel="noreferrer">An Empirical Study on Stage-Information Interfaces for VLA Fine-Tuning</a></h3>
      <p>在 GR00T N1.6 与 LIBERO-10 上比较完整指令、当前阶段文本及归一化阶段序号，发现显式阶段信息并不天然有益；延续微调时序号状态在三组配对实验均胜出，为长程 VLA 接口设计提供负结果与基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13605" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>ONE DEMONSTRATION</span><span>FORWARD / REVERSE</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13882" target="_blank" rel="noreferrer">Learning Forward &amp; Reverse Skills from a Single Unfinished Demonstration for Constrained Manipulation Tasks</a></h3>
      <p>把单条甚至未完成示范拆成 DMP 非接触段与几何驱动分割的螺旋接触段，以导纳修正完成示范之外的轨迹并直接反向执行；在插销、电池、开锁和拧螺丝上优于 one-shot 基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13882" target="_blank" rel="noreferrer">arXiv</a><a href="https://tuwien-asl.github.io/LfD-Screw/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-15" class="paper-day-heading">2026-07-15</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 FlowWAM × VistaVLA：前者用光流统一 WAM 的动作预测与世界建模，后者把 3D 高斯中的几何—语义压缩为 VLA 控制 token；再以 ExToken 和 DenseReward 串起高效在线探索与失败感知奖励，以 Jetson-PI 检验 VLA 端侧实时部署。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WAM</span><span>OPTICAL FLOW</span><span>VIDEO PRETRAINING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13017" target="_blank" rel="noreferrer">FlowWAM: Optical Flow as a Unified Action Representation for World Action Models</a></h3>
      <p>把光流视频作为与 RGB 视频同构、同时携带像素运动的动作表征，在共享视频扩散骨干中统一策略模式与世界模型模式；还能直接利用无动作标签视频预训练，在 RoboTwin 与 WorldArena 均超过 VLA/WAM 基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13017" target="_blank" rel="noreferrer">arXiv</a><a href="https://flow-wam.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>3D GAUSSIANS</span><span>SEMANTIC GROUNDING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12356" target="_blank" rel="noreferrer">VistaVLA: Geometry- and Semantic-Aware 3D Gaussian-Grounded VLA for Robotic Manipulation</a></h3>
      <p>把多视角视觉—语言特征提升到 3D 高斯，形成兼具几何锚点与语义的视角一致表征，再以 Merge-then-Query 压缩 99% token；七项真机任务平均提升 22.8%，困难 OOD 相对 VLA-Adapter 提升 30.0%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12356" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>RL FINE-TUNING</span><span>STRUCTURED EXPLORATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12931" target="_blank" rel="noreferrer">ExToken: Structured Exploration for Efficient Vision-Language-Action Reinforcement Fine-tuning</a></h3>
      <p>指出 VLA-RL 的关键瓶颈是轨迹多样性而非 rollout 数量，并用离线示范归纳的离散行为 token 条件化探索；部署时由状态条件选择器挑选行为模式，在受限交互预算下加快收敛并提升仿真与真机操作表现。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12931" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>REWARD MODEL</span><span>FAILURE SYNTHESIS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.13033" target="_blank" rel="noreferrer">DenseReward: Dense Reward Learning via Failure Synthesis for Robotic Manipulation</a></h3>
      <p>在仿真中自动合成碰撞、漏抓、掉落与恢复等物理失败轨迹，无需人工标注即可训练视觉—语言稠密奖励模型；逐帧任务进度估计优于通用 VLM 和现有机器人奖励模型，并能为 MPC 与 RL 提供有效反馈。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.13033" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>EDGE DEPLOYMENT</span><span>ASYNCHRONOUS CONTROL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12659" target="_blank" rel="noreferrer">Jetson-PI: Towards Onboard Real-Time Robot Control via Foresight-Aligned Asynchronous Inference</a></h3>
      <p>用未来校正模块处理异步推理的感知—执行错位，以置信度调度减少反应时间，并结合 CUDA 图复用等系统优化；Jetson Orin 控制频率较朴素 PyTorch 提升 8.66 倍，LIBERO 成功率也超过 VLASH。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12659" target="_blank" rel="noreferrer">arXiv</a><a href="https://github.com/PKU-SEC-Lab/Jetson-PI" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>ACTION CHUNKING</span><span>CONTINUITY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12992" target="_blank" rel="noreferrer">ChunkFlow: Towards Continuity-Consistent Chunked Policy Learning</a></h3>
      <p>针对 action chunk 边界抖动，把每个 chunk 划为冻结、可编辑与未来区域，并在训练中加入接缝及一、二阶连续性损失；结合历史扰动、scheduled sampling 与 AWAC，在 CALVIN、LIBERO 和真机上改善成功率—稳定性权衡。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12992" target="_blank" rel="noreferrer">arXiv</a><a href="https://cytoderm-ai.github.io/chunkflow" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EMBODIED VLM</span><span>PHYSICAL REASONING</span><span>EFFICIENT MOE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12894" target="_blank" rel="noreferrer">Hy-Embodied-VLM-1.0: Efficient Physical-World Agents</a></h3>
      <p>围绕动作相关状态理解、动作转移推理和顺序自适应推理构建数据与训练体系；仅激活 3B 参数的 MoE 模型在 38 项具身感知、物理理解与推理评测中有 19 项达到同规模最佳，并支持多轮长程具身任务。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12894" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>VALUE CORRECTION</span><span>DEFORMABLE OBJECT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12892" target="_blank" rel="noreferrer">UR-VC: Unsupervised Robotic Value Correction for Time-Derived Progress Proxies</a></h3>
      <p>利用跨示范中相似状态出现在不同时间点的规律，离线修正把归一化时间误当任务进度的标签偏差；无需人工奖励或额外价值模型，即可捕捉布料操作中的回退与非匀速进展，并用于 VLA 优势条件训练。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12892" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA SAFETY</span><span>BACKDOOR DEFENSE</span><span>INFERENCE-TIME</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12571" target="_blank" rel="noreferrer">TrustVLA: Mechanism-Guided Inference-Time Defense Against Vision-Language-Action Backdoors</a></h3>
      <p>从 BadVLA 与 INFUSE 中归纳出注意力驱动、空间紧凑且具因果性的触发器内部足迹，据此在推理时检测异常证据演化、定位区域并局部修复；仅需少量干净校准集，无需重训即可降低攻击成功率并保持正常任务性能。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12571" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WORLD MODEL</span><span>HIERARCHICAL PLANNING</span><span>LONG HORIZON</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12547" target="_blank" rel="noreferrer">Mind the Gap: Promises and Pitfalls of Hierarchical Planning in LeWorldModel</a></h3>
      <p>冻结 LeWorldModel 低层控制器并增加潜在子目标规划，发现层级化并不会自动改善长程控制，主要瓶颈是高层搜索分布与低层动作空间错配；把搜索约束到训练轨迹宏动作附近后，PushT 长距离成功率提升 14.7 个百分点。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12547" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>LOCO-MANIPULATION</span><span>VISION RL</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.12702" target="_blank" rel="noreferrer">Vision-Based Dribbling for Humanoid Soccer via Privileged Representation Learning</a></h3>
      <p>把时序深度编码器直接嵌入强化学习策略，使人形机器人无需显式状态估计即可兼顾平衡、控球与对手感知；仿真 Booster T1 在标称运球与静态障碍下表现强，但面对主动移动对手成功率仍为 46%，适合作为视觉闭环基线观察。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.12702" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-14" class="paper-day-heading">2026-07-14</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 Lumo-2 × WALA：前者研究潜在世界动力学、动作与多模态对齐如何形成预测推理，后者把无动作视频的语义—几何变化转成可执行潜在动作；再以 Xiaomi-Robotics-U0 观察世界基础模型作为具身数据引擎的规模路线，以 Robot-Centric Pointmaps 检验低改造成本的跨视角 VLA 泛化。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WAM</span><span>LATENT WORLD-ACTION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11270" target="_blank" rel="noreferrer">Towards Predictive, Aligned, and Scalable Robot Learning</a></h3>
      <p>Lumo-2 在潜空间学习物理视觉转移并据此生成动作，以分阶段模态预对齐把动作表征依次对齐世界动力学、视觉和语言；系统分析 latent world modelling、对齐、规模律与 OOD 泛化，在长程和灵巧真机任务上超过 VLA/WAM 基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11270" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LATENT ACTION</span><span>ACTION-FREE VIDEO</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11397" target="_blank" rel="noreferrer">WALA: Learning Executable Latent Actions from Action-Labeled Demonstrations and Action-Free Videos</a></h3>
      <p>先从视频的 DINOv3 特征差分与稠密深度差分学习语义—几何潜在动作，再用有动作示范把它对齐可执行控制并训练 latent world model；RoboCasa 平均成功率达 75.2%，也提升真实操作的性能与泛化。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11397" target="_blank" rel="noreferrer">arXiv</a><a href="https://liujiahao2077.github.io/WALA.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>WAM</span><span>DATA SYNTHESIS</span><span>MULTI-VIEW</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11643" target="_blank" rel="noreferrer">Xiaomi-Robotics-U0: Unified Embodied Synthesis with World Foundation Model</a></h3>
      <p>以 38B 多模态自回归模型统一图像、编辑、具身场景、跨本体 transfer 与视频生成，保留基础生成模型泛化并强化多视角几何一致性；合成数据把 π0.5 的困难 OOD 真机成功率从 36.9% 提至 63.2%。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11643" target="_blank" rel="noreferrer">arXiv</a><a href="https://robotics.xiaomi.com/xiaomi-robotics-u0.html" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>3D REPRESENTATION</span><span>VIEWPOINT GENERALIZATION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11498" target="_blank" rel="noreferrer">See like a Robot: Robot-Centric Pointmaps for Vision-Language-Action Models</a></h3>
      <p>把每个像素改写为机器人坐标系中的 3D 点，在保持预训练 2D VLA 所需稠密网格接口的同时消除相机观察坐标与动作坐标错配；对 π0.5、SmolVLA 均有增益，真机相机移到未见位置时优势进一步扩大。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11498" target="_blank" rel="noreferrer">arXiv</a><a href="https://davian-robotics.github.io/pointmap/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>MULTI-FRAME POLICY</span><span>BIMANUAL MOBILE</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11884" target="_blank" rel="noreferrer">Mixture of Frames Policy: Multi-Frame Action Denoising for Bimanual Mobile Manipulation</a></h3>
      <p>不再固定单一动作坐标系，而让 frame-specialized denoiser 在末端、基座等多个坐标系同步去噪并融合回规范状态；新的 SE(3) 参数化支持对中间噪声状态做精确可微变换，在九项仿真和两项真机双臂移动操作中胜过单坐标系基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11884" target="_blank" rel="noreferrer">arXiv</a><a href="https://mofpo.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>ONE DEMONSTRATION</span><span>SIM-TO-REAL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11874" target="_blank" rel="noreferrer">A Minimalist Retargeting-Guided Reinforcement Learning Recipe for Dexterous Manipulation</a></h3>
      <p>REGRIND 从单条人类示范保留手—物空间与接触关系地重定向，再以物体中心关键点残差 RL 跟踪，并通过系统辨识零样本迁移到两种多指手；剪刀和螺丝刀等接触丰富工具任务同时给出实用 sim-to-real 因素分析。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11874" target="_blank" rel="noreferrer">arXiv</a><a href="https://yunhaifeng.com/REGRIND" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>TELEOPERATION</span><span>CONTACT TRANSITION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11481" target="_blank" rel="noreferrer">Towards Human-level Dexterous Teleoperation</a></h3>
      <p>TeleDexter 用手—物协同跟踪把操作员意图映射为学习到的低层接触执行，以连续子目标和混合奖励覆盖重抓、物内重定位及指步；两种灵巧手、七项长程工具任务真机平均成功率 75%，采集示范还能训练自主策略。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11481" target="_blank" rel="noreferrer">arXiv</a><a href="https://bigai-dex.github.io/blog/teledexter/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>ACTION REPRESENTATION</span><span>VISUAL CONSEQUENCE</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11427" target="_blank" rel="noreferrer">EDAR: Learning Environment-Dependent Action Representations for Robotic Manipulation</a></h3>
      <p>把动作 token 同时锚定可执行控制结构与场景条件下的预期视觉后果，使同一控制片段在不同环境中的不同语义显式进入表征；在仿真和真机操作上改善策略学习，长程任务收益尤其明显。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11427" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>HUMANOID</span><span>SENSOR DESIGN</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11690" target="_blank" rel="noreferrer">Requirement-Driven Design of Whole-Body Social Tactile Sensing via Virtual Human-Robot Interaction</a></h3>
      <p>从 VR 触觉交互数据反推人形机器人全身皮肤的覆盖位置与空间分辨率，而非先定硬件；18 名参与者、5,520 次试验形成开放数据，并为九类重复出现的社交触摸手势给出传感器密度基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11690" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>LOCOMOTION</span><span>GRANULAR TERRAIN</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11855" target="_blank" rel="noreferrer">Robust bipedal locomotion on flowable slopes via foot-driven terrain manipulation</a></h3>
      <p>从足端主动调节颗粒地形响应，而非只靠身体控制抵消扰动：实验揭示中等 cleat 间距可让基质应力保持在屈服阈值附近，并据此设计可调深度足，在 1.4 kg 与 15 kg 双足平台验证最高 30° 流动斜坡行走。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11855" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>EVAL</span><span>HRI</span><span>ERROR ANTICIPATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11570" target="_blank" rel="noreferrer">ERR@HRI 3.0 Challenge: Multimodal Detection of Errors and Anticipation in Human-Robot Interactions</a></h3>
      <p>发布 BAD 与 Bad Idea 两套自然场景原始视频数据，分别评测旁观者对机器人/人类失败的自发反应识别，以及失败发生前的结果预判；还设置跨数据集泛化轨道，并报告挑战赛参赛方法与基线。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11570" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>ROADMAP</span><span>SYSTEM STACK</span><span>P1</span><span class="paper-status paper-status--watch">观察</span></div>
      <h3><a href="https://arxiv.org/abs/2607.11689" target="_blank" rel="noreferrer">From World Action Models to Embodied Brains: A Roadmap for Open-World Physical Intelligence</a></h3>
      <p>把 WAM 进展整理为模型角色与表征、目标与标准化、系统组合三组缺口，并提出 embodied brain、physical harness、共享契约和闭环后训练组成的模块化栈；适合作为路线图观察，但当前标注为 ongoing work。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.11689" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-13" class="paper-day-heading">2026-07-13</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 CD-LAM × FlowDAgger：前者修正无动作视频中的潜在动作偏差，后者用少量人类介入适配冻结的 VLA/WAM；触觉线重点看 TACTIC × TactiDex，分别覆盖多接触预测控制与接触级评测；再以 CLAP 和 AgenticFocus 观察轻量 VLA 与人形数据路线。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WAM</span><span>LATENT ACTION</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09185" target="_blank" rel="noreferrer">Causally Debiased Latent Action Model for Embodied Action Conditioned World Models</a></h3>
      <p>识别重建式 latent action model 会把背景与未触碰物体混入动作表征的问题，以本体中心重建、动作对比学习和潜空间校准组成 CD-LAM；在 2B/14B 世界模型上提升动作可控性，并将机器人动作适配更新量压低 12 倍以上。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09185" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>HUMAN-IN-THE-LOOP</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08877" target="_blank" rel="noreferrer">FlowDAgger: Human-in-the-Loop Adaptation of Generative Robot Policies in Latent Space</a></h3>
      <p>把人类纠正动作反演成冻结 flow/diffusion 策略中本应生成该动作的噪声，仅训练轻量 latent policy 即可用少量介入适配 action-head VLA 与 WAM，同时保留未参与适配的原有技能。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08877" target="_blank" rel="noreferrer">arXiv</a><a href="https://microsoft.github.io/FlowDAgger" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>CONTACT MPC</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09218" target="_blank" rel="noreferrer">Tactile and Vision Conditioned Contact-Centric Control for Whole-Arm Manipulation</a></h3>
      <p>TACTIC 将 RGB-D、分布式触觉与 proximity 表征送入动作条件潜在动力学，并以接触 Jacobian 注入解析运动学；预测接触配置和作用力后，用接触感知 MPC 完成真实机器人的全臂多接触操作。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09218" target="_blank" rel="noreferrer">arXiv</a><a href="https://emprise.cs.cornell.edu/tactic/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>TACTILE</span><span>DEXTEROUS BENCHMARK</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09190" target="_blank" rel="noreferrer">TactiDex: A Real-World Tactile-Guided Benchmark for Human-Like Dexterous Manipulation</a></h3>
      <p>建立对齐全手触觉、多粒度运动学与物体状态的真实灵巧操作数据和标准指标，并用三分量触觉奖励统一引导、类人接触对齐与约束，把 human-to-robot transfer 从运动模仿推进到接触级物理一致性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09190" target="_blank" rel="noreferrer">arXiv</a><a href="https://tactidex.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LANGUAGE-ACTION GROUNDING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08974" target="_blank" rel="noreferrer">CLAP: Direct VLM-to-VLA Adaptation via Language-Action Grounding</a></h3>
      <p>不改 VLM 骨干结构，而是在数值动作 token 前先生成自然语言动作描述，以缩小语言预训练分布与连续控制输出的落差；单轮微调的 2B 模型在 LIBERO 达 90.8%，并提供 0.8B/2B/4B 同源模型族用于尺度对照。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08974" target="_blank" rel="noreferrer">arXiv</a><a href="https://omron-sinicx.github.io/clap/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>DATA SYNTHESIS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08857" target="_blank" rel="noreferrer">AgenticFocus: Object-Preserving Mixed Reality Synthesis from Human FPV Video for Dexterous Humanoid Learning</a></h3>
      <p>把普通第一视角人类视频转成可训练人形策略的混合现实示范：恢复手部遮挡的物体几何、重建完整手部运动，再经相机相对对齐与分层合成完成跨本体重定向，输出视觉、机器人动作与状态同步的数据。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08857" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>ACTION REPRESENTATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09648" target="_blank" rel="noreferrer">B-spline Policy: Accelerating Manipulation Policies via B-spline Action Representations</a></h3>
      <p>用结点和控制点定义的连续 B-spline 曲线替代离散 action chunk，使动作可平滑缩放并由低层控制器以更高频率执行；可直接接入现有策略学习管线，在保持成功率的同时缩短仿真与真实任务完成时间。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09648" target="_blank" rel="noreferrer">arXiv</a><a href="https://b-spline-policy.github.io" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>MANIPULATION</span><span>RL POST-TRAINING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09590" target="_blank" rel="noreferrer">PAC-ACT: Post-training Actor-Critic for Action Chunking Transformers</a></h3>
      <p>把 ACT 的在线强化学习后训练改写为 chunk 级 actor-critic，并用混合行为先验约束保持预训练动作分布；在工业精密接触任务中兼顾低延迟、成功率与力安全，Contour 任务中将超过 60 N 的读数比例降低 46 倍。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09590" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DATA</span><span>HUMAN RETARGETING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09519" target="_blank" rel="noreferrer">DemoBridge: A Simulation-in-the-Loop Toolkit for Single-View Human Demonstration Retargeting</a></h3>
      <p>把单视角 RGB stereo 手部示范转成物理验证的机械臂轨迹；统一优化整段关节轨迹、候选抓取与碰撞约束，并由仿真逐阶段验证、失败回溯重规划，产物还能直接作为策略学习 rollout。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09519" target="_blank" rel="noreferrer">arXiv</a><a href="https://gitlab.kuleuven.be/u0123974/demo-bridge/" target="_blank" rel="noreferrer">Code</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VIDEO-TO-ACTION</span><span>GEOMETRIC VALIDATION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09191" target="_blank" rel="noreferrer">GenVid2Robot: From Video Generation to Robot Manipulation via Rigid-Geometric Consistency</a></h3>
      <p>不把生成视频当作可直接回放的示范，而以真实首帧 RGB-D 锚点和稀疏相对 SE(3) 检验候选运动；仅将几何一致、抓取约束和运动学可行的轨迹迁移到真机，并用有界深度补偿减小执行偏差。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09191" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VIDEO-TO-ACTION</span><span>FEASIBILITY COMPLETION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09365" target="_blank" rel="noreferrer">PhysV2A: Reachability-Gated and Semantic-Mask-Constrained Feasibility Completion for Video-to-Robot Manipulation</a></h3>
      <p>把视频恢复的 6D 物体运动与每个候选抓取刚性耦合成整段 TCP 假设，以可达性门控筛掉不可执行轨迹；再由 VLM 辅助的语义掩码区分关键与可放松维度，在有限语义偏差内改善可操作性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09365" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>CONTACT</span><span>ONE-SHOT LFD</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09515" target="_blank" rel="noreferrer">One-Shot Multimodal Learning from Demonstration with Force-Constrained Elastic Maps</a></h3>
      <p>从单次示范联合分割空间轨迹与力信号，并把外力约束写入 elastic map 的凸优化编码；在 UR5e 腕力传感和 Kinova 指力传感两套平台、五项真实任务上复现运动与接触特性。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09515" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>LONG-HORIZON</span><span>IMPLICIT SKILLS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.09234" target="_blank" rel="noreferrer">Implicit-Behavior Coordination from Unlabeled Sub-Task Demonstrations for Rearrangement Tasks</a></h3>
      <p>不预定义技能、边界或切换逻辑，而从混合的无标签子任务示范中学习多模态行为，再由 critic 对候选动作做价值引导选择；在 Habitat 长程整理任务中接近带行为克隆技能的 oracle planner。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.09234" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>PERCEPTION-ACTION</span><span>3D GAUSSIANS</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08948" target="_blank" rel="noreferrer">SplatCtrl: Perception-Action Coupling via Gaussian Scene Representations and Reactive Robot Control</a></h3>
      <p>从动态 3D Gaussian 场导出连续可微的碰撞距离，再纳入 control barrier function，把 RGB-D 实时场景重建与反应式机械臂控制闭合为一条链；在仿真、真机和共享人机空间中验证动态避碰。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08948" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-10" class="paper-day-heading">2026-07-10</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先细读 LingBot-VA 2.0 × EgoWAM，比较“原生视频—动作预训练”与“非像素世界目标”两条 WAM 路线；再读 Latent Memory Palace × TFP，区分自适应潜在推理与事件敏感记忆；具身侧重点跟进 ContactMimic 与 DexVerse。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WAM</span><span>VIDEO-ACTION PRETRAINING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08639" target="_blank" rel="noreferrer">Native Video-Action Pretraining for Generalizable Robot Control</a></h3>
      <p>提出 LingBot-VA 2.0：不再改造面向数字内容的视频生成器，而是从语义视觉—动作 tokenizer、因果预训练、稀疏 MoE 到异步闭环推理原生构建具身视频—动作基础模型。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08639" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--wam">
      <div class="paper-ticket__meta"><span>WAM</span><span>HUMAN-ROBOT TRANSFER</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08436" target="_blank" rel="noreferrer">EgoWAM</a></h3>
      <p>固定策略骨干、动作头与数据配比，只比较 Pixel、DINO 和 3D motion flow 世界预测目标；结果显示抽象外观并分离相机运动的表征更适合把野外第一视角人类视频迁移到双臂机器人。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08436" target="_blank" rel="noreferrer">arXiv</a><a href="https://gatech-rl2.github.io/egowam.github.io/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LATENT REASONING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08724" target="_blank" rel="noreferrer">Latent Memory Palace</a></h3>
      <p>把连续控制中的推理写成自回归潜变量上的变分推断，并用潜空间强化学习优化；同一框架既形成可自适应分配测试时算力的策略，也产生可变长度动作 tokenizer。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08724" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>AGENT HARNESS</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08448" target="_blank" rel="noreferrer">Harness VLA</a></h3>
      <p>把 frozen VLA 暴露为可重试的接触丰富 primitive，由带执行记忆的 agent 负责语义重接地、非接触动作与重新 staging，在不微调 VLA 的情况下扩大其部署工作域。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08448" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>CONTACT CONTROL</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08742" target="_blank" rel="noreferrer">ContactMimic</a></h3>
      <p>在关键点轨迹之外显式跟踪身体部位二值接触命令，用轨迹增强打破姿态与接触标签的伪相关，使人形机器人能按需产生或抑制接触，并在 5 种动作上完成 sim-to-real。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08742" target="_blank" rel="noreferrer">arXiv</a><a href="https://lixinyao11.github.io/contactmimic-page/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>BENCHMARK</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08751" target="_blank" rel="noreferrer">DexVerse</a></h3>
      <p>提供 100 项灵巧操作任务、3 种机械臂、6 种灵巧手、可控视觉变化和 3,180 条多模态 VR 示范，并用 Diffusion Policy、DP3、OpenVLA 与 π0.5 暴露跨任务和跨本体泛化缺口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08751" target="_blank" rel="noreferrer">arXiv</a><a href="https://ycyao216.github.io/DexVerse.site/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>EVENT-SENSITIVE MEMORY</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08283" target="_blank" rel="noreferrer">TFP</a></h3>
      <p>用 Liquid Time-Constant 动力学维护 episode-local 任务进度信念，并调制 flow-matching 动作解码器，让记忆在接触、释放和子目标转换附近主动更新，而非仅作为被动历史上下文。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08283" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>DEXTEROUS</span><span>RETARGETING</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08341" target="_blank" rel="noreferrer">AnyDexRT</a></h3>
      <p>以自监督指尖对应、少量人类引导与接触分类器替代手工目标和精确标定，面向不同仿人灵巧手提供 calibration-free 的遥操作重定向与示范采集接口。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08341" target="_blank" rel="noreferrer">arXiv</a><a href="https://chenxi-wang.github.io/projects/anydexrt/" target="_blank" rel="noreferrer">Project</a></div>
    </article>
    <article class="paper-ticket paper-ticket--vla">
      <div class="paper-ticket__meta"><span>VLA</span><span>LIGHTWEIGHT</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.08575" target="_blank" rel="noreferrer">FabriVLA</a></h3>
      <p>将 1B 级 InternVL3.5 骨干与带门控动作 token 自注意力、浅层 VLM 特征融合的 flow-matching action head 单阶段联合训练，探索紧凑 VLA 的精细多任务操作上限。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.08575" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>SURGICAL TELEOP</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07972" target="_blank" rel="noreferrer">In vivo feasibility study of humanoid robots in surgery</a></h3>
      <p>用通用器械建立人形机器人腹腔镜遥操作框架，从台架、干实验用户研究到活体猪实验系统评估精度、控制、安全与临床准备度，是通用人形进入高风险精细操作的少见实证。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07972" target="_blank" rel="noreferrer">arXiv</a><a href="https://doi.org/10.1038/s41586-026-10796-x" target="_blank" rel="noreferrer">Nature</a></div>
    </article>
    <article class="paper-ticket paper-ticket--data">
      <div class="paper-ticket__meta"><span>HUMANOID</span><span>LOCOMOTION</span><span>P1</span><span class="paper-status paper-status--todo">待细读</span></div>
      <h3><a href="https://arxiv.org/abs/2607.07830" target="_blank" rel="noreferrer">HumoSlope</a></h3>
      <p>以斜坡局部支撑面上的 ZMP 正则和生物力学步态适配器抑制蹲伏退化，部署时只用本体感知，在真实户外草坡实现最高 32.1° 的盲走连续穿越。</p>
      <div class="paper-ticket__links"><a href="https://arxiv.org/abs/2607.07830" target="_blank" rel="noreferrer">arXiv</a></div>
    </article>
  </div>
</div>

<h2 id="papers-2026-07-09" class="paper-day-heading">2026-07-09</h2>

<div class="daily-paper-section">
  <p class="paper-day-note"><strong>编辑建议</strong>优先连读 LaMem-VLA × GeoProp × PriGo 理解“记忆—状态—动作”链路；WAM 侧把 LingBot-Video、WAM-TTT 与 world-model admissibility 放在一起看；TouchWorld 则是本期最值得跟踪的接触闭环样本。</p>

  <div class="paper-queue-grid">
    <article class="paper-ticket paper-ticket--wam paper-ticket--featured">
      <div class="paper-ticket__meta"><span class="paper-editor-pick">EDITOR PICK</span><span>WAM</span><span>VIDEO PRETRAINING</span><span>P0</span><span class="paper-status paper-status--todo">待细读</span></div>
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

<h2 id="papers-2026-07-08" class="paper-day-heading">2026-07-08</h2>

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

<h2 id="papers-2026-07-07" class="paper-day-heading">2026-07-07</h2>

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

<h2 id="papers-2026-07-03" class="paper-day-heading">2026-07-03</h2>

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

<h2 id="papers-2026-07-02" class="paper-day-heading">2026-07-02</h2>

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

<h2 id="papers-2026-07-01" class="paper-day-heading">2026-07-01</h2>

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

<h2 id="papers-2026-06-30" class="paper-day-heading">2026-06-30</h2>

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

<h2 id="papers-2026-06-29" class="paper-day-heading">2026-06-29</h2>

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

<h2 id="papers-2026-06-26" class="paper-day-heading">2026-06-26</h2>

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

<h2 id="papers-2026-06-25" class="paper-day-heading">2026-06-25</h2>

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

## 队列状态

<div class="paper-pipeline" data-paper-pipeline>
  <div data-paper-pipeline-status="todo">
    <span class="paper-pipeline__label">待细读</span>
    <b data-paper-status-count="todo">—</b>
    <p>已经完成相关性判断、尚未形成站内细读的研究条目。</p>
  </div>
  <div data-paper-pipeline-status="done">
    <span class="paper-pipeline__label">已细读</span>
    <b data-paper-status-count="done">—</b>
    <p>已有站内页面，可继续沿引用、复现与上下游模型深入。</p>
  </div>
  <div data-paper-pipeline-status="watch">
    <span class="paper-pipeline__label">观察</span>
    <b data-paper-status-count="watch">—</b>
    <p>方向可能重要，但仍缺项目页、代码或足够证据。</p>
  </div>
</div>

<details class="paper-methodology">
  <summary>更新口径与可信度说明</summary>
  <ul>
    <li><strong>P0</strong>：强相关且可能改变本站主线判断，优先细读。</li>
    <li><strong>P1</strong>：值得收录，可作为短细读或观察级条目。</li>
    <li><strong>P2</strong>：相关方向样本，用于补齐谱系边界。</li>
    <li><strong>已细读</strong>：已有站内页面，但不代表全部结论已独立复现；定量信息仍以各页核查标注为准。</li>
    <li><strong>待细读</strong>：已确认值得跟进，但尚未形成完整研究笔记。</li>
  </ul>
</details>
