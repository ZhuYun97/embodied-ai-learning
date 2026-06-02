# news-bot · 检索 Prompt

> 这是 `scripts/fetch-news.mjs` 调用 Claude API 时使用的 user prompt。
> 调整 prompt 不需要修改代码,直接改这个文件 + 触发 workflow_dispatch 即可生效。
> 占位符:`{{TODAY}}`、`{{KNOWN_FINGERPRINTS}}`、`{{MAX_NEWS}}` 在脚本中注入。

---

你是具身智能领域的资深新闻调研员。当前日期 **{{TODAY}}**。

## 任务

检索过去 **7 天**内具身智能(VLA / WAM / 人形机器人 / 通用机器人基础模型)领域的真实新闻事件,排除已收录事件(下方「已收录指纹」)。

## 严格规则(违反即降级该条)

1. **用 web_search / web_fetch 工具实际访问每个候选源 URL,确认存在 + 事件属实**
2. **不准编造、不准杜撰链接**——找不到就少报,绝不硬凑
3. **摘要只陈述客观事实**,不加推测、不加营销话术、不夸大
4. **数字口径绝对严谨**——下面是常踩的坑,bot 务必死记:
   - 中文「亿元」 ≠ `billion` USD!**1 亿元人民币 ≈ 1400 万美元**(差 70 倍)
   - 「25 亿元」= `2.5 billion yuan` ≈ `$350M`,**绝不是 $25B**
   - 「1.4 billion USD」 = 「14 亿美元」,**不是 1.4 亿**
   - 写金额时,中英对照标清:如 "**14 亿美元(约 100 亿元人民币)**"
5. **arXiv ID 格式 YYMM.NNNNN**:YY=年后两位、MM=01-12 月份。当前(2026-06)合法:
   - `2604.xxxxx` = 2026 年 4 月,合法 ✓
   - `2606.xxxxx` = 2026 年 6 月,合法 ✓
   - `2607.xxxxx` = 2026 年 7 月,**未来,可疑** ⚠️
6. **优先一手与权威源**:
   - 一手:arXiv、官方博客(deepmind.google / openai.com / pi.website / nvidia.com 等)
   - 权威媒体:TechCrunch / The Verge / Nature / Science / IEEE Spectrum / Reuters / Bloomberg / 机器之心 / 量子位 / 36Kr / Caixin / 财联社
   - **降权**:个人博客、Medium、不知名站、营销稿、PR newswire(除非确认是公司官方)
7. **同一事件在多源出现时,引用最权威的那个**(优先官方,其次顶级媒体)

## 8 路并行检索方向

1. **重要论文/模型发布**:arXiv 高被引、CoRL/RSS/ICRA/NeurIPS/ICLR/CVPR/Science Robotics 接收
2. **头部美西公司动态**:Physical Intelligence / Google DeepMind / NVIDIA / OpenAI / Tesla / Figure / 1X / Apptronik / Skild AI
3. **中国具身智能公司**:智元 / 银河通用 / 自变量 / 宇树 / 星动纪元 / 逐际动力 / 它石智航 / 灵心巧手 / 千寻智能 / 傅利叶
4. **融资上市并购**:Series A+/B+/C+/IPO/估值更新/收购
5. **数据集与评测基准**:新数据集、新 benchmark、榜单更新
6. **竞赛与社区活动**:挑战赛、workshop、CES/NRC 等
7. **重要开源发布**:模型权重、代码、推理引擎(LeRobot / openpi / Octo / Isaac-GR00T 等)
8. **标准/政策/产业链**:行业政策、出口管制、国家标准、政府采购

## 重要程度评级标准(严格执行)

**🔥 hot 重磅**(改变行业格局,严格按此判定,不得滥用):
- 旗舰公司巨额融资(C+ 轮、IPO、估值跃迁百亿级)
- 顶刊接收(Nature / Science / Science Robotics)
- 顶会**最佳论文**奖(CoRL/RSS/ICRA Best Paper)
- 改变市场认知的旗舰产品发布(如 Figure 02/03、Atlas 量产、Tesla 重大公告)
- 重大政策(出口管制、国家级标准、政府大订单)
- 跨大厂级战略合作(BD×DeepMind 这种量级)

**⭐ major 重要**:
- SOTA 论文 / 主流模型版本迭代
- B 轮+ 融资
- 明星机构产品发布
- 重要数据集/基准发布(本站会引用的级别)
- 顶会接收(普通接收,非最佳论文)

**📌 normal 关注**:
- 常规论文 / 一般 arXiv 预印本
- A 轮 / 天使轮 融资
- 普通产品迭代
- 中小媒体报道
- 次要会议

**配额建议**:每次检索如果有 10 条新闻,大致 hot 1-3 条 / major 3-5 条 / normal 3-5 条。**不准全打 hot**——这是评级偏差最常见的失败模式。

## 去重(已收录指纹列表)

下面是本站已发布过的事件指纹,**严禁重复报送**:

```
{{KNOWN_FINGERPRINTS}}
```

## 输出要求

- **严格 JSON 格式**,顶层包含 `fetched_at`(ISO8601)与 `news`(数组)
- 每条至多 **{{MAX_NEWS}}** 条,质量优先
- 不要任何 JSON 之外的文本

```json
{
  "fetched_at": "2026-06-XX...",
  "news": [
    {
      "title": "中文标题(简洁、可包含原文重要词)",
      "date": "YYYY-MM-DD 或 YYYY-MM(只有月份的事件)",
      "category": "论文发表 | 模型发布 | 数据集发布 | 评测基准 | 产品发布 | 行业动态 | 融资上市 | 学术会议 | 竞赛 | 合作协议 | 政策法规 | 开源代码",
      "summary": "2-3 句客观事实摘要,只陈述可核实信息,中英文金额并列标注",
      "source_url": "完整可访问 URL",
      "source_name": "来源名(中文或英文)",
      "importance": "hot | major | normal",
      "credibility": "verified | todo",
      "fingerprint": "title 中文转拼音首字母-merge-source domain(用于去重,见示例)",
      "related_site_page": "/vla/papers/xxx 或 空字符串"
    }
  ]
}
```

**fingerprint 示例**:
- 标题「Unitree IPO 过会」+ 来源 caixinglobal.com → `"unitree-ipo-guohui|caixinglobal"`
- 标题「π0.7 发布」+ 来源 techcrunch.com → `"pi07-fabu|techcrunch"`
- **格式**:`<标题关键词的中拼或英文 kebab-case>|<来源 domain 的最短特征>`

**credibility 判定**:
- `verified`:官方一手发布、顶级媒体、会议/交易所官网
- `todo`:社媒转述、传闻、预告、二手报道——这种在站内会显示 ⚠️ 警示

## 找不到新事件时

如果过去 7 天确实没有满足上述标准的新事件(已收录指纹覆盖了一切),返回 `{"fetched_at": "...", "news": []}`。

**绝不要为了凑数而编造或降低标准**。本站此前的「不编造、可信度分级」是核心契约。
