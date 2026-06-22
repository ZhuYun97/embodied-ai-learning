---
title: 离线全站知识图谱
description: 从本站 Markdown、站内链接、论文目录与本地实体词典离线生成的全站知识图谱,不依赖模型 API。
---

# 离线全站知识图谱

从现有 Markdown 和站内结构直接构建的全站知识图谱。它覆盖 VLA / WAM 细读、横切专题、生态页、新闻数据、概念、数据集、基准、本体、机构与 arXiv 来源。GitHub 等外部域名不进入图谱,所有节点和关系都由本地规则抽取或来自站内既有目录,不使用模型 API。

<script setup>
import OfflineKnowledgeGraph from '../.vitepress/theme/components/OfflineKnowledgeGraph.vue'
</script>

<OfflineKnowledgeGraph />

## 构建口径

- **文档节点**:来自 `docs/` 下的 VitePress Markdown。
- **论文节点**:复用 `papers.data.mjs` 的 VLA / WAM 论文目录、路线与日期。
- **实体节点**:本地词典抽取概念、数据集、基准、本体与机构。
- **关系边**:站内链接、章节归属、实体提及、arXiv 引用、共享实体关系。
- **可信度**:`CURATED` 表示站内人工目录关系,`EXTRACTED` 表示本地可复现抽取,`DERIVED` 表示共享实体推导关系。

## 相关入口

- [论文知识图谱](/ecosystem/paper-graph):人工维护的论文与知识节点图谱,适合稳定学习导航。
- [生态总览](/ecosystem/):公司关系图谱、就业地图与公司目录。
