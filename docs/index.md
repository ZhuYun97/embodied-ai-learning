---
layout: home

hero:
  name: "具身智能学习站"
  text: "Embodied AI Learning"
  tagline: 梳理具身智能两条主线 —— VLA 发展脉络 × WAM(世界-行动模型)最新前沿
  actions:
    - theme: brand
      text: VLA 调研报告 →
      link: /vla/
    - theme: brand
      text: WAM 世界-行动模型 →
      link: /wam/
    - theme: alt
      text: 论文细读导航
      link: /vla/#-论文细读导航

features:
  - icon: { src: /icons/route.svg, width: 28, height: 28 }
    title: 发展主线
    details: 五阶段演进 + 四条暗线 + Mermaid 流程图,梳理 VLA 如何从"动作即文本 token"一路走到"从经验中强化学习"。
    link: /vla/#一范式演进与奠基
    linkText: 查看主线
  - icon: { src: /icons/book.svg, width: 28, height: 28 }
    title: 24 篇论文细读
    details: 奠基与两条路线 + 2025H2–2026 前沿 + 更多代表模型三组共 24 篇,从 RT-1 到 π0.7 逐模块拆解(架构 / 数据 / 实验 / 局限)。
    link: /vla/papers/rt1
    linkText: 从 RT-1 开始
  - icon: { src: /icons/chart.svg, width: 28, height: 28 }
    title: 基准横评硬数据
    details: SimplerEnv / LIBERO / CALVIN / RoboCasa 四大基准逐模型成绩表,标注口径与可信度,含 RoboCasa 排行榜与数据来源专题。
    link: /vla/papers/benchmarks
    linkText: 看数据集与基准
  - icon: { src: /icons/globe.svg, width: 28, height: 28 }
    title: WAM 世界-行动模型(新轨)
    details: 2025–2026 前沿范式——联合预测「未来状态+动作」。综述 taxonomy(级联 vs 联合)+ DreamZero / X-WAM / UWM / Genie Envisioner / GR00T N2 五篇细读。
    link: /wam/
    linkText: 进入 WAM 调研
---

## VLA:按技术路线浏览

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
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">新范式探索</span>
    <div class="route-card__title">统一基座 / 第三条路 / 从经验学习</div>
    <p>统一多任务多本体基座、视频生成预训练→动作、真机强化学习。</p>
    <div class="route-links">
      <a href="vla/papers/qwen-vla">Qwen-VLA</a>
      <a href="vla/papers/rynnvla">RynnVLA</a>
      <a href="vla/papers/pi06">π0.6 / π*0.6</a>
      <a href="vla/papers/pi07">π0.7</a>
      <a href="vla/papers/gemini-robotics">Gemini Robotics</a>
    </div>
  </div>
</div>

## WAM:按范式浏览

世界-行动模型(WAM)按综述 taxonomy 分「级联」与「联合」两支,联合再分自回归 / 扩散,点击进入对应细读(范式总览见 [WAM 调研](wam/)):

<div class="route-grid">
  <div class="route-card">
    <span class="route-tag">级联 · 显式</span>
    <div class="route-card__title">先生成像素未来,再抽动作</div>
    <p>显式合成未来视频/几何,再用逆动力学或几何抽取得到动作——动作抽取可独立于本体。</p>
    <div class="route-links">
      <a href="wam/papers/unipi">UniPi</a>
      <a href="wam/papers/gen2act">Gen2Act</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">级联 · 隐式</span>
    <div class="route-card__title">潜空间预测 → 隐式逆动力学</div>
    <p>在压缩潜表征上预测未来、不解码回像素,再据此出动作,以换取实时性。</p>
    <div class="route-links">
      <a href="wam/papers/vpp">VPP</a>
      <a href="wam/papers/lapa">LAPA</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">联合 · 自回归</span>
    <div class="route-card__title">token 化,因果联合生成</div>
    <p>把未来帧与动作序列化进 token 空间、因果解码联合建模;需治早期误差级联。</p>
    <div class="route-links">
      <a href="wam/papers/gr-1">GR-1</a>
      <a href="wam/papers/worldvla">WorldVLA</a>
    </div>
  </div>
  <div class="route-card">
    <span class="route-tag">联合 · 扩散</span>
    <div class="route-card__title">并行去噪,未来+动作同生</div>
    <p>用扩散/流匹配并行生成未来与动作,绕开自回归串行瓶颈,利于高频闭环。</p>
    <div class="route-links">
      <a href="wam/papers/uwm">UWM</a>
      <a href="wam/papers/dreamzero">DreamZero</a>
      <a href="wam/papers/x-wam">X-WAM</a>
      <a href="wam/papers/lingbot-va">LingBot-VA</a>
      <a href="wam/papers/tau0-wm">τ0-WM</a>
      <a href="wam/papers/groot-n2">GR00T N2</a>
    </div>
  </div>
</div>

## 关于本站

本站是一个**持续生长的具身智能学习笔记**,沿两条主线展开:**VLA(视觉-语言-动作)模型发展深度调研** 与 **WAM(世界-行动模型)前沿梳理**,各配一组逐篇论文细读。

所有内容由 `deep-research` 工作流(多源检索 + 3 票对抗式事实核查)整理,**凡标 ⚠️ 处为厂商/作者自评数据**,非独立第三方复现,采信时请注意。领域演进极快(2022–2026),多数一手信源为 2024–2026 预印本/官方页面。

> 📌 入口推荐:VLA 线先读 [发展深度调研总报告](/vla/) 把握全局,再按[论文细读导航](/vla/#-论文细读导航)逐篇深入;WAM 线从 [WAM 总览(定义 / taxonomy)](/wam/) 进入。第一次来?看 [如何阅读本站](/vla/guide) 与[更新日志](/vla/changelog)。

