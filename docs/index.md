---
layout: home

hero:
  name: "具身智能学习站"
  text: "Embodied AI Learning"
  tagline: 从 VLA 模型的发展脉络,到 2026 年最新前沿 —— 经多源检索 + 对抗式事实核查整理
  actions:
    - theme: brand
      text: VLA 发展深度调研 →
      link: /vla/
    - theme: alt
      text: 论文细读导航
      link: /vla/#-论文细读导航

features:
  - icon: { src: /icons/route.svg, width: 28, height: 28 }
    title: 发展主线
    details: 五阶段演进 + 四条暗线 + Mermaid 流程图,梳理 VLA 如何从"动作即文本 token"走到"从经验中强化学习"。
    link: /vla/#一范式演进与奠基
    linkText: 查看主线
  - icon: { src: /icons/book.svg, width: 28, height: 28 }
    title: 16 篇论文细读
    details: RT-1 / RT-2 / Diffusion Policy / OpenVLA / Octo / π0 / CogACT / π0-FAST / OpenVLA-OFT / GR00T N1 / π0.5 + 5 篇前沿(WALL-OSS / Qwen-VLA / RynnVLA / π0.6 / Gemini Robotics),每篇逐模块拆解。
    link: /vla/papers/rt1
    linkText: 从 RT-1 开始
  - icon: { src: /icons/chart.svg, width: 28, height: 28 }
    title: 基准横评硬数据
    details: SimplerEnv / LIBERO / CALVIN / RoboCasa 四大基准逐模型成绩表,标注口径与可信度;含本轮补齐的 RoboCasa 排行榜与数据来源专题。
    link: /vla/papers/benchmarks
    linkText: 看数据集与基准
  - icon: { src: /icons/trend.svg, width: 28, height: 28 }
    title: 2025H2–2026 最新前沿
    details: 自变量 WALL-OSS、阿里 Qwen-VLA / RynnVLA、Physical Intelligence π0.6 / π*0.6(RECAP 真机强化学习)。
    link: /vla/#五2025h22026-最新前沿
    linkText: 看前沿
---

## 按技术路线浏览

VLA 沿"动作如何生成"分化为几条技术路线,点击进入对应论文细读:

<div class="route-grid">
  <div class="route-card">
    <span class="route-tag">离散 token</span>
    <div class="route-card__title">动作即文本 token</div>
    <p>把动作离散化为词表 token,自回归逐 token 生成——简单、直接复用 VLM。</p>
    <div class="route-links">
      <a href="vla/papers/rt1">RT-1</a>
      <a href="vla/papers/rt2">RT-2</a>
      <a href="vla/papers/openvla">OpenVLA</a>
      <a href="vla/papers/pi0-fast">π0-FAST</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">连续 · 扩散/流匹配</span>
    <div class="route-card__title">连续动作生成</div>
    <p>用扩散/流匹配直接生成连续动作块,支持动作分块与高频灵巧控制。</p>
    <div class="route-links">
      <a href="vla/papers/diffusion-policy">Diffusion Policy</a>
      <a href="vla/papers/octo">Octo</a>
      <a href="vla/papers/pi0">π0</a>
      <a href="vla/papers/cogact">CogACT</a>
      <a href="vla/papers/groot-n1">GR00T N1</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">混合 · 连续回归</span>
    <div class="route-card__title">两条路融合</div>
    <p>高层离散 token + 底层流匹配,或改用 L1 连续回归——兼顾语义与精度。</p>
    <div class="route-links">
      <a href="vla/papers/openvla-oft">OpenVLA-OFT</a>
      <a href="vla/papers/pi05">π0.5</a>
      <a href="vla/papers/wall-oss">WALL-OSS</a>
      <a href="vla/papers/pi06">π0.6</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">新范式探索</span>
    <div class="route-card__title">统一基座 / 第三条路 / 从经验学习</div>
    <p>统一多任务多本体基座、视频生成预训练→动作、真机强化学习。</p>
    <div class="route-links">
      <a href="vla/papers/qwen-vla">Qwen-VLA</a>
      <a href="vla/papers/rynnvla">RynnVLA</a>
      <a href="vla/papers/pi06">π*0.6</a>
      <a href="vla/papers/gemini-robotics">Gemini Robotics</a>
    </div>
  </div>
</div>

## 关于本站

本站是一个**持续生长的具身智能学习笔记**,当前首个专题是 **VLA(视觉-语言-动作)模型发展深度调研**。

所有内容由 `deep-research` 工作流(多源检索 + 3 票对抗式事实核查)整理,**凡标 ⚠️ 处为厂商/作者自评数据**,非独立第三方复现,采信时请注意。领域演进极快(2022–2026),多数一手信源为 2024–2026 预印本/官方页面。

> 📌 入口推荐:先读 [VLA 发展深度调研总报告](/vla/) 把握全局,再按[论文细读导航](/vla/#-论文细读导航)逐篇深入。

## 专题与速查

- 📊 [具身数据全景梳理](/vla/papers/embodied-data) —— 四层数据金字塔、10 个真机数据集横评、采集范式与 scaling
- 🧪 [数据集与基准全景](/vla/papers/benchmarks) —— SimplerEnv / LIBERO / CALVIN / RoboCasa 四大评测逐模型成绩表
- 🤖 [实验机器人本体](/vla/papers/robots) —— 19 个实验本体(单臂/双臂/人形)对照表与跨本体迁移要点
- 📖 [术语速查表](/vla/papers/glossary) —— 流匹配 / 动作分块 / 双系统 / co-training 等术语一页速查
- 🗓️ [发展时间线](/vla/papers/timeline) —— 2022→2026 里程碑一览,定位 16 篇细读
- 🔗 [参考文献](/vla/papers/references) —— 全站一手信源(arXiv / 官网)聚合
