---
title: Qwen-Robot 系列专题
description: Qwen-RobotManip、Qwen-RobotNav 与 Qwen-RobotWorld 三篇 2026 年 6 月技术报告的专题介绍,梳理它们与 Qwen-VLA 的关系、技术分工、数据层贡献和阅读路线。
sidebar: false
aside: false
---
<div class="qr-topic">
<section class="qr-hero">
<div class="qr-hero__main">
<p class="qr-kicker">NEWS SPECIAL · 2026.06 · QWEN ROBOT</p>
<h1>Qwen-Robot 系列专题</h1>
<p class="qr-lede">Qwen 团队连续放出 <strong>Qwen-RobotManip</strong>、<strong>Qwen-RobotNav</strong>、<strong>Qwen-RobotWorld</strong> 三篇机器人技术报告。它们不是简单的厂商专题,更像 Qwen-VLA 之后拆出来的三条工程化分支:操作、导航、世界模型。</p>
<div class="qr-actions">
<a href="../vla/papers/qwen-vla">先看 Qwen-VLA</a>
<a href="../ecosystem/paper-graph">打开知识图谱</a>
<a href="../news/">返回最新动态</a>
</div>
</div>
<div class="qr-hero__panel" aria-label="Qwen-Robot 系列速览">
<div class="qr-stat">
<strong>3</strong>
<span>篇技术报告</span>
</div>
<div class="qr-stat">
<strong>2 + 1</strong>
<span>VLA 分支 + WAM 分支</span>
</div>
<div class="qr-stat">
<strong>38,100h</strong>
<span>Manip 操作语料 ⚠️</span>
</div>
<div class="qr-stat">
<strong>8.6M</strong>
<span>World video-text pairs ⚠️</span>
</div>
</div>
</section>
<div class="qr-note" role="note">
<strong>可信度提示</strong>
<span>三篇都是 2026 年 6 月的技术报告,极新、非同行评审。本文把 arXiv、官方博客、GitHub/项目页视为一手来源可核;但 LIBERO、RoboTwin、VLN、EWMBench 等性能数字均按作者自评处理,不做跨论文硬排名。</span>
</div>
<section class="qr-section">
<div class="qr-section__head">
<p class="qr-kicker">// 01 · 系列关系</p>
<h2>从一个总命题,拆成三条工程分支</h2>
<p>Qwen-VLA 是“一个模型覆盖操作、导航、轨迹预测”的总基座;Qwen-Robot 三篇把这个命题拆成更具体的系统模块。</p>
</div>
<div class="qr-map">
<a class="qr-map__root" href="../vla/papers/qwen-vla">
<span>Qwen-VLA</span>
<strong>统一操作 / 导航 / 轨迹预测基座</strong>
</a>
<div class="qr-map__branches">
<a class="qr-branch qr-branch--manip" href="../vla/papers/qwen-robotmanip">
<span>Manip</span>
<strong>操作 VLA</strong>
<em>多本体 state-action 对齐 · camera-frame EEF delta</em>
</a>
<a class="qr-branch qr-branch--nav" href="../vla/papers/qwen-robotnav">
<span>Nav</span>
<strong>导航执行器</strong>
<em>task mode · token budget · temporal decay</em>
</a>
<a class="qr-branch qr-branch--world" href="../wam/papers/qwen-robotworld">
<span>World</span>
<strong>视频世界模型</strong>
<em>EWK 数据 · action encoder · double-stream MMDiT</em>
</a>
</div>
</div>
</section>
<section class="qr-section">
<div class="qr-section__head">
<p class="qr-kicker">// 02 · 三篇分别讲什么</p>
<h2>同属 Qwen-Robot,但贡献点完全不同</h2>
</div>
<div class="qr-paper-grid">
<article class="qr-paper qr-paper--manip">
<div class="qr-paper__top">
<span>VLA · 连续操作</span>
<strong>Qwen-RobotManip</strong>
</div>
<p>把 Qwen-VLA 往机械臂操作推进,重点是多本体 state-action 对齐与操作数据规模化。</p>
<ul>
<li>Qwen3.5-4B VL backbone + flow-matching DiT action expert。</li>
<li>80 维 canonical state-action vector:左右臂、EEF、夹爪、灵巧手固定语义槽位。</li>
<li>camera-frame EEF delta 减少跨本体几何冲突。</li>
<li>human-to-robot synthesis 与开源机器人轨迹共同构成约 38,100 小时操作预训练语料 ⚠️。</li>
</ul>
<div class="qr-paper__links">
<a href="https://arxiv.org/abs/2606.17846" target="_blank" rel="noopener">arXiv</a>
<a href="https://qwen.ai/blog?id=qwen-robotmanip" target="_blank" rel="noopener">官方博客</a>
<a href="https://github.com/QwenLM/Qwen-RobotManip" target="_blank" rel="noopener">GitHub</a>
<a href="../vla/papers/qwen-robotmanip">站内细读</a>
</div>
<p class="qr-verdict">判断:数据对齐是关键贡献,但最终目标仍是 manipulation policy。</p>
</article>
<article class="qr-paper qr-paper--nav">
<div class="qr-paper__top">
<span>VLA · 分层/导航</span>
<strong>Qwen-RobotNav</strong>
</div>
<p>把 Qwen3-VL 改造成可被上层 agent 调用的导航执行器,输出 waypoint trajectory。</p>
<ul>
<li>统一 VLN、PointNav、ObjNav、Tracking、自动驾驶等任务。</li>
<li>输出 K=8 个 waypoint,每个 waypoint 是 <code>(x, y, theta)</code>。</li>
<li>task-adaptive observation encoding:task mode、视觉 token budget、时间衰减、相机权重、采样模式均可调。</li>
<li>上层 planner 拆任务,Qwen-RobotNav 执行局部导航段。</li>
</ul>
<div class="qr-paper__links">
<a href="https://arxiv.org/abs/2606.18112" target="_blank" rel="noopener">arXiv</a>
<a href="https://qwen.ai/blog?id=qwen-robotnav" target="_blank" rel="noopener">官方博客</a>
<a href="https://github.com/QwenLM/Qwen-RobotNav" target="_blank" rel="noopener">GitHub</a>
<a href="../vla/papers/qwen-robotnav">站内细读</a>
</div>
<p class="qr-verdict">判断:更像 System-1 navigation primitive / executor,不是通用操作 VLA。</p>
</article>
<article class="qr-paper qr-paper--world">
<div class="qr-paper__top">
<span>WAM · 世界模型/数据引擎</span>
<strong>Qwen-RobotWorld</strong>
</div>
<p>不直接输出机器人动作,而是把动作写成自然语言条件,从当前观测生成未来视觉轨迹。</p>
<ul>
<li>冻结 Qwen2.5-VL 作为 action / semantic encoder。</li>
<li>使用 Wan-VAE + 60 层 double-stream MMDiT 生成未来视频 latent。</li>
<li>构建 EWK:8.6M video-text pairs / 200M+ frames ⚠️。</li>
<li>下游目标是合成数据、虚拟评测和规划先验,不是直接闭环控制。</li>
</ul>
<div class="qr-paper__links">
<a href="https://arxiv.org/abs/2606.17030" target="_blank" rel="noopener">arXiv</a>
<a href="https://qwen.ai/blog?id=qwen-robotworld" target="_blank" rel="noopener">官方博客</a>
<a href="../wam/papers/qwen-robotworld">站内细读</a>
</div>
<p class="qr-verdict">判断:最接近世界模型 / 数据引擎。引用 benchmark 时不能解释为机器人成功率。</p>
</article>
</div>
</section>
<section class="qr-section qr-split">
<div>
<p class="qr-kicker">// 03 · 是否都是数据层工作</p>
<h2>不是。更准确是“数据工程很重,但系统目标不同”</h2>
<div class="qr-matrix">
<div class="qr-matrix__row qr-matrix__head">
<span>论文</span><span>数据层权重</span><span>模型/系统层权重</span><span>一句话判断</span>
</div>
<div class="qr-matrix__row">
<span>Qwen-RobotManip</span><span>高</span><span>高</span><span>数据对齐是关键贡献,但目标是操作策略。</span>
</div>
<div class="qr-matrix__row">
<span>Qwen-RobotNav</span><span>中</span><span>高</span><span>重点是导航模型接口与 agentic execution。</span>
</div>
<div class="qr-matrix__row">
<span>Qwen-RobotWorld</span><span>很高</span><span>高</span><span>世界模型 + embodied video 数据引擎。</span>
</div>
</div>
</div>
<aside class="qr-callout">
<strong>阅读时的关键分界</strong>
<p>Manip 和 World 的数据工程很重;Nav 更偏模型接口与系统组合。所以不能把三篇都简单归成“数据工作”。</p>
</aside>
</section>
<section class="qr-section">
<div class="qr-section__head">
<p class="qr-kicker">// 04 · 建议阅读顺序</p>
<h2>按“总基座 → 操作 → 导航 → 世界模型”读</h2>
</div>
<ol class="qr-steps">
<li><a href="../vla/papers/qwen-vla">Qwen-VLA</a><span>理解“统一操作 / 导航 / 轨迹预测”的总模型命题。</span></li>
<li><a href="../vla/papers/qwen-robotmanip">Qwen-RobotManip</a><span>看操作数据如何对齐到统一 action space。</span></li>
<li><a href="../vla/papers/qwen-robotnav">Qwen-RobotNav</a><span>看导航如何从单任务模型变成可配置 executor。</span></li>
<li><a href="../wam/papers/qwen-robotworld">Qwen-RobotWorld</a><span>看 Qwen 系列如何用世界模型扩展数据、评测和规划。</span></li>
<li><a href="../ecosystem/paper-graph">知识图谱</a><span>查看 Qwen-VLA 到三条分支的桥接关系。</span></li>
</ol>
</section>
<footer class="qr-footer">
<a href="../news/">具身智能新闻</a>
<a href="../vla/changelog">2026-06-18 更新日志</a>
<a href="../ecosystem/paper-graph">知识图谱</a>
</footer>
</div>
