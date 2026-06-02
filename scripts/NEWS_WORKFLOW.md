# 新闻抓取工作流

自动抓取具身智能/机器人领域最新新闻并合并到网站数据库。

## 快速使用

在 Claude Code 中调用 skill:
```
/fetch-news
```

## 工作流程

### 1. 多源搜索
使用 WebSearch 覆盖以下查询:
- `embodied AI robotics news [月份] 2026`
- `humanoid robot news latest [月份] 2026`
- `VLA vision language action model news 2026`
- `robot deployment production news 2026` (量产)
- `robotics funding Series [A/B/C] 2026` (融资)
- `open source robotics model 2026` (开源)

时间范围:优先最近 7 天,最多 30 天。

### 2. 详细抓取
使用 WebFetch 提取关键信息:

**必需字段**:
- date: 事件日期 YYYY-MM-DD
- title: 中文标题(30-50字)
- source_name, source_url: 原始来源
- importance: hot / major / normal
- credibility: verified / todo

**内容字段**:
- summary: 200-400字 markdown,关键信息**加粗**
- category: 数组,可选值见下方分类表

**可选字段**:
- related_site_page: 站内链接如 `/vla/papers/pi07`

### 3. 重要程度分级

**🔥 hot(重磅)**:
- 头部公司重大战略(OpenAI/Nvidia/Google/Tesla)
- 重大融资(≥5亿美元)或 IPO
- 里程碑技术突破(开源大模型、产能飞跃)
- 行业首创

**⭐ major(重要)**:
- 中等融资(1-5亿美元)
- 新品发布(头部公司)
- 大规模部署(>1000台)
- 重要开源项目

**📌 normal(关注)**:
- 行业预测/趋势报告
- 学术会议/竞赛
- 小规模部署(<1000台)

### 4. 可信度判断

**✅ verified(已核)**:
- 多个独立来源确认(Reuters/Forbes + 公司官方)
- 第三方验证的数据

**⚠️ todo(待核)**:
- 单一来源
- 公司自评数据未经独立验证(在摘要开头用 ⚠️ 标注)

### 5. 数据格式

保存到 `tmp/news-fetched.json`:
```json
{
  "fetched_at": "2026-06-02",
  "news": [
    {
      "title": "Nvidia × Unitree 发布首个人形机器人参考设计",
      "date": "2026-06-01",
      "fetched_at": "2026-06-02",
      "importance": "hot",
      "credibility": "verified",
      "category": ["产品发布", "人形机器人"],
      "summary": "**Nvidia** 在 GTC Taipei 发布...",
      "source_name": "Interesting Engineering",
      "source_url": "https://...",
      "related_site_page": null,
      "fingerprint": "nvidiaunitreeblackwellgpu|20260601"
    }
  ]
}
```

**fingerprint 生成**:
```javascript
const words = title.replace(/[×·()（）]/g, ' ').trim().split(/\s+/);
const fp = words.slice(0, 5).join('').toLowerCase().replace(/[^a-z0-9]/g, '') 
  + '|' + date.replace(/-/g, '');
```

### 6. 合并到数据库

```bash
node scripts/news-merge.mjs
```

脚本自动:
- 基于 fingerprint 去重
- 转换为站点 schema
- 写入 `docs/news/news-data.json`
- 更新 `.bot-state.json`

### 7. 构建部署

```bash
npm run docs:build
git add docs/news/news-data.json docs/news/.bot-state.json
git commit -m "新闻收录:[日期]具身智能重大事件([N]条)

🔥 重磅([N]条):
- [标题]

⭐ 重要([N]条):
- [标题]

📌 关注([N]条):
- [标题]

数据来源:WebSearch + WebFetch 交叉核实
全站新闻总数:[旧] → [新] 条

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push
```

## 类别标签

可选值(支持多选):
- 论文发表、模型发布、产品发布、数据集发布、开源代码
- 融资上市、行业动态、合作协议、公司战略
- 人形机器人、评测基准、学术会议、竞赛
- 产能里程碑

## 数据源覆盖

**已覆盖**(通过 WebSearch):
- 科技媒体:TechCrunch, Forbes, Reuters, CNBC, The Verge
- 行业垂直:Robotics & Automation News, Interesting Engineering
- AI 资讯:AIBase, Silicon ANGLE
- 学术:arXiv 公告

**未覆盖**(需认证):
- Twitter/X(需 API key)
- LinkedIn
- Discord/Slack 社区

## 重点关注实体

搜索时主动用以下公司/机构名称作关键词，确保不遗漏。

### 🌍 国际公司

| 公司 | 代表产品/方向 |
|------|-------------|
| Physical Intelligence (π) | π0 / π0.5 / π0.7 VLA 系列 |
| Figure AI | Figure 03 / Helix-02 人形机器人 |
| Boston Dynamics | Atlas 电动人形机器人 |
| Agility Robotics | Digit 双足机器人 |
| 1X Technologies | Neo 人形机器人 |
| Apptronik | Apollo 人形机器人 |
| Sanctuary AI | Phoenix 人形机器人 |
| Skild AI | 通用机器人大脑 |
| Humanoid (UK) | HMND 01 工业人形机器人 |
| Mecka AI | 人类动作数据采集 |
| Human Archive | 多模态具身数据 |
| MicroAGI | 家庭场景数据采集 |
| Nvidia (Isaac GR00T) | 机器人开发平台 |
| Google DeepMind | Gemini Robotics / RT 系列 |
| OpenAI Robotics | 具身智能部门 |
| Tesla (Optimus) | 人形机器人量产 |
| Microsoft (Muse) | 游戏/世界模型 |
| Hugging Face (LeRobot) | 开源机器人学习 |

### 🇨🇳 国内公司

| 公司 | 代表产品/方向 |
|------|-------------|
| 宇树科技 (Unitree) | H2 / G1 人形机器人，四足机器人 |
| 智元机器人 (AgiBot) | A2 人形机器人 / AgiBotWorld 数据集 |
| 自变量机器人 (X²Robot) | Wall-OSS / Wall-OSS-0.5 VLA |
| 银河通用 (Galaxy General) | Galbot G1 人形机器人 |
| 宇感科技 (Genisom AI) | 四足 + 人形机器人量产 |
| 逐际动力 (LimX Dynamics) | 双足 / 人形机器人 |
| 傅利叶智能 (Fourier) | GR-1 / GR-2 人形机器人 |
| 优必选 (UBTECH) | Walker 系列人形机器人 |
| 达闼机器人 (CloudMinds) | 云端大脑机器人 |
| 华为 / 诺亚方舟实验室 | 具身 AI 研究 |
| 腾讯机器人实验室 | 机器人研究 |
| 小米机器人 | CyberOne 人形机器人 |
| 深势科技 | 科学 AI / 世界模型 |
| PaXini (帕西尼) | 具身数据出口/流通 |

### 🏛️ 科研机构

| 机构 | 代表方向 |
|------|---------|
| Stanford Robotics Center | 移动操作 / 通用机器人 |
| UC Berkeley (RAIL) | RL / 仿真到现实 |
| MIT CSAIL | 规划 / 操作 |
| CMU Robotics Institute | 感知 / 操作 / 移动 |
| ETH Zurich (RSL) | 四足运动控制 / 全身控制 |
| University of Washington | 人机交互 / 操作 |
| Google DeepMind Robotics | RT 系列 / Gemini Robotics |
| 清华大学 (CoRE) | VLA / 具身推理 |
| 北京大学 | 具身智能 / 世界模型 |
| 上海 AI Lab | 开源具身模型 |
| 浙江大学 | 灵巧手 / 操作 |
| 中科院自动化所 | 具身认知 |
| 香港中文大学 | 双手操作 |

### 搜索模板

遍历上述实体时，使用以下查询格式：
```
"[公司名]" robotics news 2026
"[公司名]" announcement [本月] 2026
site:twitter.com "[公司名]" (需 API，暂不支持)
```

## 注意事项

1. **时效性**:优先最近 7 天
2. **交叉验证**:重大新闻必须 2+ 来源确认
3. **摘要质量**:关键数字/公司/产品**加粗**
4. **去重检查**:运行前查看 `docs/news/.bot-state.json`
5. **站内链接**:涉及已有细读论文时补充 related_site_page
6. **可信度标注**:公司自评数据在摘要开头用 ⚠️ 标注

## 示例输出

```
✅ 新闻抓取完成
- 搜索覆盖:3 个查询,共 28 条结果
- 详细抓取:7 条(🔥3 / ⭐3 / 📌1)
- 合并结果:新增 7 条,跳过 0 条
- 全站新闻总数:29 条

已提交:commit 9d30212
已推送:https://github.com/ZhuYun97/embodied-ai-learning
```

## 未来扩展

1. Twitter API 抓取(需配置 TWITTER_API_KEY)
2. RSS 订阅(arXiv cs.RO, HuggingFace Robotics)
3. GitHub Actions 定时任务
4. 多语言来源(36kr, 机器之心)
