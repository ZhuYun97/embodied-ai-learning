# 具身智能学习站 · Embodied AI Learning

> 🌐 **在线访问:<https://zhuyun97.github.io/embodied-ai-learning/>**

一个持续生长的**具身智能(Embodied AI)学习笔记**站点,沿两条主线展开:

- **VLA(视觉-语言-动作)模型发展深度调研** —— 从 RT-1/RT-2 奠基,到 2026 年最新前沿(WALL-OSS、Qwen-VLA、π0.6/π*0.6、π0.7、Gemini Robotics 等)。
- **WAM(世界-行动模型)前沿梳理** —— 联合预测「未来状态 + 动作」的新范式,按综述 taxonomy(级联 vs 联合)组织。

> 内容由 `deep-research` 工作流(多源检索 + 3 票对抗式事实核查)整理。可信度体例:⚠️=提出方/厂商自评;✅=经核查/基准维护方;待核=一手源未给出、不予编造。引用本站数据请连同标记一并保留。

## 内容

**VLA 调研轨**(`docs/vla/`)

- **发展深度调研总报告**:`docs/vla/index.md` —— 发展主线(含 Mermaid 流程图)、技术路线之争、基准横评、最新前沿、核查与局限。
- **24 篇论文细读**:`docs/vla/papers/` —— 从 RT-1 到 π0.7,每篇含官方框架图、逐模块拆解(架构 / 数据 / 实验 / 局限)、关键数据表。
- **专题综述 / 横切分析 / 速查**:具身数据全景、数据集与基准全景、实验机器人本体、全模型规格对比大表、双系统架构、预测式 VLA、推理部署、术语表、时间线、参考文献等。

**WAM 调研轨**(`docs/wam/`)

- **总览**:`docs/wam/index.md` —— 定义与损失、taxonomy(级联·显式/隐式 × 联合·自回归/扩散)、数据与评测生态。
- **13 篇论文细读**:`docs/wam/papers/` —— UniPi、Gen2Act、VPP、LAPA、GR-1、WorldVLA、UWM、DreamZero、X-WAM、LingBot-VA、τ0-WM、Genie Envisioner、GR00T N2。

## 站点特性

- **双配色主题**:导航栏「配色」按钮一键切换「科技蓝」(默认)⇄「实验室档案」(暖纸衬线),状态本地记忆。
- **可信度透镜**:一键暗化 / 仅显已核数据,数据表的 ⚠️ 自评与待核单元格带常驻边缘标记。
- **阅读进度**:标记已读 + 全站进度条;**相关细读**按机构 / 主干 / 路线自动推荐兄弟模型。
- **专注阅读**:收起左右侧栏,加宽正文。
- **流程图 / 框架图点击放大**(灯箱)、LaTeX 公式、Mermaid 图(CJK 防裁切)。
- 构建期导出 `llms.txt` / `llms-full.txt` + 每页原始 `.md.txt`,便于外部 LLM 摄取时保留可信度标记。
- 全程尊重 `prefers-reduced-motion`,关键流程满足 WCAG AA 对比度。

## 本地预览

```bash
npm install
npm run docs:dev      # 本地开发服务器
npm run docs:build    # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview  # 预览构建产物
```

## 部署

推送到 `main` 分支后,GitHub Actions(`.github/workflows/deploy.yml`)会自动构建并发布到 GitHub Pages。

> ⚠️ 若仓库名不是 `embodied-ai-learning`,请同步修改 `docs/.vitepress/config.mjs` 里的 `base` 字段为 `/<你的仓库名>/`。

## news-bot 配置(可选,启用每日自动新闻)

[`/news/`](https://zhuyun97.github.io/embodied-ai-learning/news/) 板块支持**每日自动检索 + 直接发布**(C 方案,LLM 直发,无人工审核——出错可 `git revert` 回滚)。**默认禁用**,启用步骤:

1. **创建 Anthropic API key**:<https://console.anthropic.com/settings/keys>
2. **加到 GitHub Secret**:仓库 Settings → Secrets and variables → Actions → New repository secret
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-...`
3. **确认 workflow 写权限**:Settings → Actions → General → Workflow permissions = **Read and write permissions**(允许 bot push commit)
4. **启用 cron**:打开 [`.github/workflows/news-bot.yml`](.github/workflows/news-bot.yml),确认 `schedule` 字段未被注释。默认每日 UTC 02:00 = 北京时间 10:00。
5. **首次手动测试**:Actions → News Bot → Run workflow(可选 dry_run 模式只跑不 commit)

**风险与维护**:
- ⚠️ **LLM 可能编造或误读**(我们已观察到工作流误把"25 亿元"读成"25 billion"等先例);bot 写入的条目尾部带 🤖 标识,与人工整理区分。
- 📅 建议每周末**人工抽审**最近 7 天 bot 提交,有问题直接 `git revert <commit>`。
- 💰 API 成本估算:每次调用 ~$0.5-1.5,日更约 $15-45/月。
- 🔧 想退到「PR 审核」更安全模式:把 `news-bot.yml` 末尾的 `git push` 改成 `gh pr create`,bot 改为开 PR 等人工 merge。
- 🛑 完全停用:把 cron 那行注释掉,只保留 `workflow_dispatch` 用于手动触发。

**本地手动跑**(供调试,需 `export ANTHROPIC_API_KEY=...`):
```bash
npm install                # 装 @anthropic-ai/sdk
npm run news:run           # = fetch + merge
npm run docs:build         # 验证 markdown 不被破坏
```

详情:[`scripts/news-prompt.md`](scripts/news-prompt.md)(prompt 文本)、[`scripts/fetch-news.mjs`](scripts/fetch-news.mjs)、[`scripts/news-merge.mjs`](scripts/news-merge.mjs)。

## 技术栈

[VitePress](https://vitepress.dev/) + [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid)(Mermaid 流程图)+ [markdown-it-mathjax3](https://github.com/tani/markdown-it-mathjax3)(LaTeX 公式)。

## 许可

内容为学习整理用途;各论文版权归原作者,图片来自各论文/官方页面,仅作学术解读引用。
