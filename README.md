# 具身智能学习站 · Embodied AI Learning

一个持续生长的**具身智能(Embodied AI)学习笔记**站点。首个专题是 **VLA(视觉-语言-动作)模型发展深度调研**——从 RT-2 奠基,到 2026 年最新前沿(WALL-OSS、Qwen-VLA、π0.6/π*0.6 等)。

> 内容由 `deep-research` 工作流(多源检索 + 3 票对抗式事实核查)整理。凡标 ⚠️ 处为厂商/作者自评数据,非独立第三方复现。

## 内容

- **VLA 发展深度调研总报告**:`docs/vla/index.md` —— 发展主线(含 Mermaid 流程图)、代表模型、技术路线之争、基准横评、最新前沿、核查与局限。
- **12 篇论文细读**:`docs/vla/papers/` —— 每篇含官方框架图、逐模块拆解、关键数据表。

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

## 技术栈

[VitePress](https://vitepress.dev/) + [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid)(Mermaid 流程图渲染)。

## 许可

内容为学习整理用途;各论文版权归原作者,图片来自各论文/官方页面,仅作学术解读引用。
