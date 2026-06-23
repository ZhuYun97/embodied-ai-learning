---
title: 知识图谱
description: 合并论文策展图谱与 Graphify 离线全站图谱,一页切换浏览 VLA / WAM 论文网络和全站 Markdown 语义拓扑。
---

# 🧠 知识图谱

这里合并了两个互补视图:**论文策展图谱**适合稳定学习导航,看 VLA / WAM 论文、技术路线、概念、数据、基准、本体与机构之间的人工标注关系;**离线全站图谱**适合浏览全站 Markdown、站内链接与本地实体词典自动抽取出的更大范围语义网络。两者都不依赖模型 API 来补图谱关系。

<script setup>
import KnowledgeGraphHub from '../.vitepress/theme/components/KnowledgeGraphHub.vue'
</script>

<KnowledgeGraphHub />

## 读图口径

- **论文策展图谱**:主线节点是 VLA / WAM,路线节点覆盖动作 token、连续扩散/流匹配、分层双系统、联合自回归、联合扩散等;论文节点来自首页路线卡与细读页档案,知识节点覆盖概念、数据、基准、本体与机构。桥接关系与知识关联为人工维护,用于学习导航,不是严格引用计量图。
- **离线全站图谱**:文档节点来自 `docs/` 下的 VitePress Markdown,论文节点复用 `papers.data.mjs` 的目录、路线与日期,实体节点由本地词典抽取概念、数据集、基准、本体与机构;关系边来自站内链接、实体提及和共享实体推导。
- **Graphify 产物**:`npm run graph:html` 会重建离线 JSON,再生成 `/graphs/graphify.html`;动态新闻、arXiv 编号与外部 GitHub 链接不进入离线图谱。
- **可信度**:`CURATED` 表示站内人工目录关系,`EXTRACTED` 表示本地可复现抽取,`DERIVED` 表示共享实体推导关系。

## 相关入口

- [Graphify 全屏控制台](/graphs/graphify.html):离线全站图谱的大屏渲染版本。
- [生态总览](/ecosystem/):公司关系图谱、就业地图与公司目录。
- [VLA 论文细读导航](/vla/#-论文细读导航):按 VLA 技术路线浏览。
- [WAM 总览](/wam/):按 WAM 范式路线浏览。
