---
layout: home

hero:
  name: "具身星图"
  text: "Embodied AI Atlas"
  tagline: 从经典 VLA 到前沿 WAM，把论文谱系、硬数据与产业生态连成一张可检索的研究地图
  actions:
    - theme: brand
      text: 从 VLA 开始 →
      link: /vla/
    - theme: alt
      text: 探索 WAM 前沿
      link: /wam/
    - theme: alt
      text: 查看今日论文
      link: /papers/latest

features:
  - icon: { src: /icons/route.svg, width: 28, height: 28 }
    title: 双主线研究地图
    details: 从 VLA 的动作生成，到 WAM 的世界预测，沿两条主线理解技术演进。
    link: /vla/
    linkText: 打开研究总览
  - icon: { src: /icons/book.svg, width: 28, height: 28 }
    title: 88 篇论文细读
    details: 按架构、数据、训练与实验拆解关键论文，不止停留在摘要层面。
    link: /vla/#📄-论文细读导航
    linkText: 进入论文导航
  - icon: { src: /icons/shield-check.svg, width: 28, height: 28 }
    title: 可追溯事实核查
    details: 多源检索与 3 票复核，明确区分作者自评、交叉验证与待核信息。
    link: /vla/guide
    linkText: 查看核查体例
  - icon: { src: /icons/newspaper.svg, width: 28, height: 28 }
    title: 每日前沿雷达
    details: 汇总最新论文、公司、融资与数据集动态，每条信息尽量回到一手来源。
    link: /papers/latest
    linkText: 查看今日更新
  - icon: { src: /icons/chart.svg, width: 28, height: 28 }
    title: 50+ 基准硬数据
    details: 统一整理评测成绩、适用边界与术语口径，帮助你更可靠地读表。
    link: /vla/papers/benchmarks
    linkText: 打开基准速查
  - icon: { src: /icons/globe.svg, width: 28, height: 28 }
    title: 可交互知识图谱
    details: 在论文关系、全站知识、公司生态与就业地图之间切换观察尺度。
    link: /ecosystem/paper-graph
    linkText: 进入知识图谱
---

<script setup>
import HomePagePanel from './.vitepress/theme/components/HomePagePanel.vue'
</script>

<HomePagePanel page="vla">

## VLA：按动作生成路线浏览

<div class="home-track-intro home-track-intro--vla">
  <div class="home-track-intro__copy">
    <span class="home-track-intro__eyebrow">RESEARCH TRACK 01 · VISION → LANGUAGE → ACTION</span>
    <p>VLA 的核心问题是：模型如何把视觉观察与语言指令，转化为可执行、可泛化的机器人动作。下面按“动作如何生成”拆成五条路线。</p>
  </div>
  <div class="home-track-intro__meta" aria-label="VLA 研究维度">
    <span><b>输入</b> 视觉 + 语言</span>
    <span><b>输出</b> 动作序列</span>
    <span><b>关注</b> 泛化 + 控制</span>
  </div>
  <a class="home-track-intro__cta" href="vla/">打开 VLA 完整总览 <span aria-hidden="true">↗</span></a>
</div>

<div class="route-grid" aria-label="VLA 技术路线">
  <div class="route-card">
    <span class="route-tag">离散 token</span>
    <h3 class="route-card__title">动作即文本 token</h3>
    <p class="route-card__question">如何让语言模型直接预测机器人动作？</p>
    <div class="route-facts route-facts--vla" aria-label="离散 token 路线关键维度">
      <span><small>输出</small><b>离散动作</b></span>
      <span><small>生成</small><b>自回归</b></span>
      <span><small>接口</small><b>LLM 原生</b></span>
      <span><small>权衡</small><b>复用 / 误差</b></span>
    </div>
    <div class="route-links">
      <a href="vla/papers/rt1">RT-1</a>
      <a href="vla/papers/rt2">RT-2</a>
      <a href="vla/papers/openvla">OpenVLA</a>
      <a href="vla/papers/pi0-fast">π0-FAST</a>
      <a href="vla/papers/spatialvla">SpatialVLA</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">连续 · 扩散/流匹配</span>
    <h3 class="route-card__title">连续动作生成</h3>
    <p class="route-card__question">如何稳定生成高频、多峰连续动作？</p>
    <div class="route-facts route-facts--vla" aria-label="连续动作路线关键维度">
      <span><small>输出</small><b>连续动作块</b></span>
      <span><small>生成</small><b>扩散 / 流</b></span>
      <span><small>控制</small><b>高频灵巧</b></span>
      <span><small>侧重</small><b>多峰分布</b></span>
    </div>
    <div class="route-links">
      <a href="vla/papers/diffusion-policy">Diffusion Policy</a>
      <a href="vla/papers/octo">Octo</a>
      <a href="vla/papers/pi0">π0</a>
      <a href="vla/papers/cogact">CogACT</a>
      <a href="vla/papers/groot-n1">GR00T N1</a>
      <a href="vla/papers/qwen-robotmanip">Qwen-RobotManip</a>
      <a href="vla/papers/wolf-vla">WOLF-VLA</a>
      <a href="vla/papers/learning-action-priors">Learning Action Priors</a>
      <a href="vla/papers/gr-3">GR-3</a>
      <a href="vla/papers/gr-dexter">GR-Dexter</a>
      <a href="vla/papers/rdt-1b">RDT-1B</a>
      <a href="vla/papers/tinyvla">TinyVLA</a>
      <a href="vla/papers/smolvla">SmolVLA</a>
      <a href="vla/papers/omnivla-rl">OmniVLA-RL</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">混合 · 连续回归</span>
    <h3 class="route-card__title">语义规划与精细控制融合</h3>
    <p class="route-card__question">如何兼顾语义规划与低层控制精度？</p>
    <div class="route-facts route-facts--vla" aria-label="混合回归路线关键维度">
      <span><small>输出</small><b>混合动作</b></span>
      <span><small>规划</small><b>高层语义</b></span>
      <span><small>控制</small><b>连续回归</b></span>
      <span><small>权衡</small><b>泛化 / 精度</b></span>
    </div>
    <div class="route-links">
      <a href="vla/papers/openvla-oft">OpenVLA-OFT</a>
      <a href="vla/papers/pi05">π0.5</a>
      <a href="vla/papers/wall-oss">WALL-OSS</a>
      <a href="vla/papers/wall-oss-05">Wall-OSS-0.5</a>
      <a href="vla/papers/x-tokenizer">X-Tokenizer</a>
      <a href="vla/papers/space">SPACE</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">分层 · 双系统/推理</span>
    <h3 class="route-card__title">快慢分层，推理可控</h3>
    <p class="route-card__question">如何让慢推理与快速闭环协作？</p>
    <div class="route-facts route-facts--vla" aria-label="双系统路线关键维度">
      <span><small>架构</small><b>双系统</b></span>
      <span><small>策略</small><b>快慢分层</b></span>
      <span><small>控制</small><b>快速闭环</b></span>
      <span><small>权衡</small><b>深度 / 时延</b></span>
    </div>
    <div class="route-links">
      <a href="vla/papers/ecot">ECoT</a>
      <a href="vla/papers/helix">Helix</a>
      <a href="vla/papers/go-1">GO-1</a>
      <a href="vla/papers/galaxea-g0">Galaxea G0</a>
      <a href="vla/papers/rynnbrain">RynnBrain</a>
      <a href="vla/papers/qwen-robotnav">Qwen-RobotNav</a>
      <a href="vla/papers/steervla">SteerVLA</a>
      <a href="vla/papers/steerable-policies">Steerable Policies</a>
      <a href="vla/papers/insight">InSight</a>
      <a href="vla/papers/pointact">PointACT</a>
      <a href="vla/papers/svp-il">SVP-IL</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">新范式探索</span>
    <h3 class="route-card__title">统一基座与经验学习</h3>
    <p class="route-card__question">如何从视频、真机反馈与记忆持续进化？</p>
    <div class="route-facts route-facts--vla" aria-label="新范式路线关键维度">
      <span><small>预训</small><b>视频基座</b></span>
      <span><small>优化</small><b>真机 RL</b></span>
      <span><small>记忆</small><b>长期反思</b></span>
      <span><small>目标</small><b>持续进化</b></span>
    </div>
    <div class="route-links">
      <a href="vla/papers/robovlms">RoboVLMs</a>
      <a href="vla/papers/simplevla-rl">SimpleVLA-RL</a>
      <a href="vla/papers/qwen-vla">Qwen-VLA</a>
      <a href="vla/papers/rynnvla">RynnVLA</a>
      <a href="vla/papers/pi06">π0.6 / π*0.6</a>
      <a href="vla/papers/pi07">π0.7</a>
      <a href="vla/papers/gemini-robotics">Gemini Robotics</a>
      <a href="vla/papers/memoryvla">MemoryVLA</a>
      <a href="vla/papers/memoryvla-plusplus">MemoryVLA++</a>
      <a href="vla/papers/gigabrain-05m">GigaBrain-0.5M*</a>
      <a href="vla/papers/atomicvla">AtomicVLA</a>
      <a href="vla/papers/seetraceact">SeeTraceAct</a>
      <a href="vla/papers/affordancevla">AffordanceVLA</a>
      <a href="vla/papers/g3vla">G³VLA</a>
      <a href="vla/papers/supervise-what-survives">Supervise What Survives</a>
      <a href="vla/papers/force-vla">FORCE</a>
      <a href="vla/papers/road-vla">ROAD-VLA</a>
      <a href="vla/papers/reflective-vla">Reflective VLA</a>
      <a href="vla/papers/action-controlnet">Action ControlNet</a>
    </div>
  </div>
</div>

<div class="home-track-footer">
  <p><strong>想先建立全局坐标？</strong> 时间轴、模型谱系与完整论文导航都已整理在专题总览中。</p>
  <a href="vla/">进入 VLA 调研总览 <span aria-hidden="true">→</span></a>
</div>

</HomePagePanel>

<HomePagePanel page="wam">

## WAM：按世界—动作建模范式浏览

<div class="home-track-intro home-track-intro--wam">
  <div class="home-track-intro__copy">
    <span class="home-track-intro__eyebrow">RESEARCH TRACK 02 · WORLD ↔ ACTION MODELING</span>
    <p>WAM 不只回答“下一步做什么”，还显式或隐式预测“做了之后世界会怎样”。下面按级联、联合与跨范式底座组织。</p>
  </div>
  <div class="home-track-intro__meta" aria-label="WAM 研究维度">
    <span><b>条件</b> 状态 + 指令</span>
    <span><b>预测</b> 未来 + 动作</span>
    <span><b>关注</b> 闭环 + 长时程</span>
  </div>
  <a class="home-track-intro__cta" href="wam/">打开 WAM 完整总览 <span aria-hidden="true">↗</span></a>
</div>

<div class="route-grid route-grid--wam" aria-label="WAM 建模范式">
  <div class="route-card">
    <span class="route-tag">级联 · 显式</span>
    <h3 class="route-card__title">先生成像素未来，再抽动作</h3>
    <p class="route-card__question">显式未来能否改善可解释规划？</p>
    <div class="route-pipeline" aria-label="显式级联建模流程">
      <span>观测</span><i>→</i><span>像素未来</span><i>→</i><span>IDM</span><i>→</i><span>动作</span>
    </div>
    <div class="route-facts route-facts--wam" aria-label="显式级联路线坐标">
      <span><small>世界表示</small><b>像素</b></span>
      <span><small>动作耦合</small><b>级联</b></span>
      <span><small>核心侧重</small><b>可解释</b></span>
    </div>
    <div class="route-links">
      <a href="wam/papers/unipi">UniPi</a>
      <a href="wam/papers/gen2act">Gen2Act</a>
      <a href="wam/papers/veo-act">Veo-Act</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">级联 · 隐式</span>
    <h3 class="route-card__title">潜空间预测 → 隐式逆动力学</h3>
    <p class="route-card__question">不解码像素能否保留可控未来？</p>
    <div class="route-pipeline" aria-label="隐式级联建模流程">
      <span>观测</span><i>→</i><span>潜未来</span><i>→</i><span>隐式 IDM</span><i>→</i><span>动作</span>
    </div>
    <div class="route-facts route-facts--wam" aria-label="隐式级联路线坐标">
      <span><small>世界表示</small><b>潜空间</b></span>
      <span><small>动作耦合</small><b>级联</b></span>
      <span><small>核心侧重</small><b>实时</b></span>
    </div>
    <div class="route-links">
      <a href="wam/papers/vpp">VPP</a>
      <a href="wam/papers/lapa">LAPA</a>
      <a href="wam/papers/dexworldmodel">DexWorldModel</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">联合 · 自回归</span>
    <h3 class="route-card__title">Token 化，因果联合生成</h3>
    <p class="route-card__question">如何用统一因果序列建模未来与动作？</p>
    <div class="route-pipeline" aria-label="联合自回归建模流程">
      <span>状态 token</span><i>→</i><span>未来 token</span><i>↔</i><span>动作 token</span>
    </div>
    <div class="route-facts route-facts--wam" aria-label="联合自回归路线坐标">
      <span><small>世界表示</small><b>Token</b></span>
      <span><small>动作耦合</small><b>联合</b></span>
      <span><small>核心侧重</small><b>长时程</b></span>
    </div>
    <div class="route-links">
      <a href="wam/papers/gr-1">GR-1</a>
      <a href="wam/papers/worldvla">WorldVLA</a>
      <a href="wam/papers/rynnvla-002">RynnVLA-002</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">联合 · 扩散</span>
    <h3 class="route-card__title">并行去噪，未来与动作同生</h3>
    <p class="route-card__question">如何并行生成多模态未来与连续动作？</p>
    <div class="route-pipeline" aria-label="联合扩散建模流程">
      <span>噪声</span><i>→</i><span>未来 + 动作</span><i>→</i><span>并行去噪</span>
    </div>
    <div class="route-facts route-facts--wam" aria-label="联合扩散路线坐标">
      <span><small>世界表示</small><b>多模态</b></span>
      <span><small>动作耦合</small><b>联合</b></span>
      <span><small>核心侧重</small><b>高频闭环</b></span>
    </div>
    <div class="route-links">
      <a href="wam/papers/uwm">UWM</a>
      <a href="wam/papers/dreamzero">DreamZero</a>
      <a href="wam/papers/x-wam">X-WAM</a>
      <a href="wam/papers/lingbot-va">LingBot-VA</a>
      <a href="wam/papers/tau0-wm">τ0-WM</a>
      <a href="wam/papers/groot-n2">GR00T N2</a>
      <a href="wam/papers/ladi-wm">LaDi-WM</a>
      <a href="wam/papers/wall-wm">WALL-WM</a>
      <a href="wam/papers/gigaworld-policy">GigaWorld-Policy</a>
      <a href="wam/papers/wav">WAV</a>
      <a href="wam/papers/motubrain">MotuBrain</a>
      <a href="wam/papers/motionwam">MotionWAM</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">联合 · 混合</span>
    <h3 class="route-card__title">自回归 + 扩散混合</h3>
    <p class="route-card__question">如何让规划与连续控制各取所长？</p>
    <div class="route-pipeline" aria-label="联合混合建模流程">
      <span>AR 长程规划</span><i>→</i><span>Diffusion</span><i>→</i><span>连续控制</span>
    </div>
    <div class="route-facts route-facts--wam" aria-label="联合混合路线坐标">
      <span><small>世界表示</small><b>混合</b></span>
      <span><small>动作耦合</small><b>联合</b></span>
      <span><small>核心侧重</small><b>长时程</b></span>
    </div>
    <div class="route-links">
      <a href="wam/papers/uva">UVA</a>
      <a href="wam/papers/flare">FLARE</a>
      <a href="wam/papers/oa-wam">OA-WAM</a>
      <a href="wam/papers/himem-wam">HiMem-WAM</a>
      <a href="wam/papers/navwm">NavWM</a>
      <a href="wam/papers/omega-eva">ω-EVA</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">跨范式 · 基座/平台/仿真</span>
    <h3 class="route-card__title">世界模型基座 · 平台 · 仿真器</h3>
    <p class="route-card__question">如何把世界建模变成可复用基础设施？</p>
    <div class="route-pipeline" aria-label="世界模型基座建模流程">
      <span>视频 / 仿真</span><i>→</i><span>世界底座</span><i>→</i><span>规划 · 控制 · 评测</span>
    </div>
    <div class="route-facts route-facts--wam" aria-label="世界模型基座路线坐标">
      <span><small>世界表示</small><b>多源</b></span>
      <span><small>动作耦合</small><b>平台</b></span>
      <span><small>核心侧重</small><b>跨任务复用</b></span>
    </div>
    <div class="route-links">
      <a href="wam/papers/cosmos3">Cosmos 3</a>
      <a href="wam/papers/qwen-robotworld">Qwen-RobotWorld</a>
      <a href="wam/papers/genie-envisioner">Genie Envisioner</a>
      <a href="wam/papers/ge-sim-2">GE-Sim 2.0</a>
      <a href="wam/papers/robodream">RoboDream</a>
      <a href="wam/papers/world-value-models">World Value Models</a>
    </div>
  </div>
</div>

<div class="home-track-footer">
  <p><strong>想看范式如何演进？</strong> 从级联预测到联合生成，完整时间轴与论文谱系都在 WAM 专题页。</p>
  <a href="wam/">进入 WAM 调研总览 <span aria-hidden="true">→</span></a>
</div>

</HomePagePanel>

<HomePagePanel page="about">

<div class="home-coda" id="about">
  <div class="home-coda__main">
    <span class="home-coda__eyebrow">// ABOUT · 一张持续生长的研究星图</span>
    <p class="home-coda__title">把复杂前沿，整理成一张可验证、可导航的研究地图</p>
    <p class="home-coda__sub">沿 <strong>VLA（视觉—语言—动作）</strong> 与 <strong>WAM（世界—动作模型）</strong> 两条主线，串联论文细读、知识图谱、硬数据与产业生态。</p>
    <div class="home-coda__proof" aria-label="本站研究方法">
      <div><b>01</b><span><strong>多源检索</strong>回到论文、项目页与一手资料交叉比对</span></div>
      <div><b>02</b><span><strong>对抗核查</strong>3 票复核，作者自评不会被当作独立结论</span></div>
      <div><b>03</b><span><strong>持续维护</strong>跟进论文、模型、数据集与公司动态</span></div>
    </div>
    <p class="home-coda__hint">第一次来？先看 <a href="vla/guide">如何阅读本站</a>；想建立全局坐标，从 <a href="vla/">VLA 总览</a> 或 <a href="wam/">WAM 总览</a> 开始。</p>
    <p class="home-coda__term" aria-hidden="true">$ keep_researching <span class="home-coda__flag">--forever</span><span class="home-coda__caret"></span></p>
  </div>
  <figure class="home-coda__visual">
    <img
      src="/images/home-about-embodied-intelligence.jpg"
      width="1080"
      height="1920"
      alt="佩戴霓虹光带视觉装置的未来机器人侧脸"
      decoding="async"
      fetchpriority="low"
    >
    <figcaption>
      <span>EMBODIED FUTURES</span>
      <strong>感知 · 推理 · 行动</strong>
    </figcaption>
  </figure>
  <nav class="home-coda__links" aria-label="更多入口">
    <a href="autoresearch/">论文 Ideas</a>
    <a href="vla/papers/getting-started">新手入门</a>
    <a href="papers/latest">每日论文</a>
    <a href="ecosystem/">生态图谱</a>
    <a href="news/">最新新闻</a>
    <a href="vla/papers/benchmarks">基准速查</a>
    <a href="vla/guide">如何阅读</a>
    <a href="https://github.com/ZhuYun97/embodied-ai-learning" target="_blank" rel="noreferrer">GitHub 开源 ↗</a>
  </nav>
</div>

</HomePagePanel>
