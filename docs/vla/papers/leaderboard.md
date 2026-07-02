---
description: VLA 基准统一榜 · SimplerEnv / LIBERO / CALVIN / RoboCasa 四大仿真基准逐模型成绩可筛选排序,带口径/可信度/来源一站式查表。补齐分散在 benchmarks.md 与各模型页的成绩,按 split/protocol/credibility 筛选,避免跨口径横比陷阱。
title: 统一基准榜
---

> [← 返回主报告](../index.md)

# 统一基准榜:四大仿真基准可比排行

> **定位**:本榜是 [VLA 评测基准全景](benchmarks.md)的**可交互视图**,把分散在 benchmarks.md 各章节与 40+ 模型细读页的成绩,收敛成一张**可筛选 / 排序 / 按口径分组**的统一榜。benchmarks.md 保持权威 prose(方法论 / 读表铁律 / 口径演进),本榜是"给急着看排名的人"的快速通道。
>
> **覆盖**:四大主流仿真操作基准 **SimplerEnv / LIBERO / CALVIN / RoboCasa**(官方 multitask 口径)。
>
> **未纳入**(见 [下方清单](#未纳入清单)):SimplerEnv Variant Aggregation / CALVIN ABCD→D / RoboCasa 其他口径(30-demo / 24-atomic / Isaac-GR00T repo)/ 扩展基准(ManiSkill / RLBench / Meta-World 等)/ 双臂人形 / 真机 / VQA / VLN。后续可扩展。
>
> **可信度标注**:⚠️ 自评 / ✅ 已核 / 待核 / 细读为出处,与 benchmarks.md 同源。每条带回链到对应章节。
>
> **数据源**:手工策展自 benchmarks.md(转录日期 2026-07-01),共 82 条 entry。带 `sourceSection` 回链,便于核对与漂移溯源。

---

## 交互榜

<BenchmarkBoard />

---

## 未纳入清单

本榜首期覆盖四大仿真可比基准,以下**有意未纳入**(非遗漏,是口径 / 统计严谨性 / 数据可得性限制):

### SimplerEnv
- **Variant Aggregation**(域随机化口径):benchmarks.md §1.4 仅给 4 个模型的聚合均值(0–1 scale),样本过少 + 口径与 Visual Matching 不可比。
- **第三方复现值**(如 open-pi-zero 逐任务):作者明确声明"请勿等同于官方数",榜不纳入避免误读。见 benchmarks.md §1.5。

### CALVIN
- **ABCD→D split**:与 ABC→D 零样本环境迁移**不可比**(ABCD→D 见过 D 环境)。benchmarks.md §3.4 仅给 GR-1 一个数(4.21 avg-len),样本不足。
- **D→D split**:单环境,难度低,主流论文不报。

### RoboCasa
- **口径 B(GR00T 30-demo 低数据档)**:只有 GR00T N1.5 / N1 两个数,不可横比其他模型(benchmarks.md §4.4)。
- **口径 C(原论文 24-atomic single-task)**:与 multitask 训练方式不可比(benchmarks.md §4.5)。
- **口径 D(Isaac-GR00T repo 25-task)**:任务集与官方不一致,待核(benchmarks.md §4.6)。
- 本榜仅保留 **口径 A(官方 multitask-300)**,维护方统一评测,4 模型同口径可比。

### 扩展 / 其他维度
- **ManiSkill / RLBench / Meta-World / COLOSSEUM**:口径分裂(版本 / 任务子集 / 评测设置各论文不一致),见 benchmarks.md §五。
- **双臂 / 人形 / 移动**(RoboTwin / BiGym / HumanoidBench 等):度量指标异构(SR / reward / RE / Q-score),暂无横向可比表,见 benchmarks.md §六。
- **真机评测**(RoboArena / RoboChallenge):RoboChallenge Table30 有维护方统一数,但样本少(3 模型),见 benchmarks.md §七。
- **具身推理 / VQA**(ERQA / RoboVQA / VLABench 等):与操作成功率度量不同轴,见 benchmarks.md §八。
- **视觉语言导航**(R2R / RxR / VLN-CE 等):导航度量(SR / SPL),与操作任务不同域,见 benchmarks.md §九。

> 📌 **后续扩展原则**:仅当某基准满足 **(1) 维护方统一口径 / 严格同设定可比;(2) 样本 ≥ 5 模型** 两条时,纳入榜。否则在 benchmarks.md prose 里讨论即可。

---

## 关联阅读

- **[VLA 评测基准全景](benchmarks.md)** — 权威 prose:方法论 / 读表铁律 / 口径演进 / 各基准详述
- **[全模型规格对比](models-spec.md)** — 26 个 VLA 的主干 / 动作表示 / 参数 / 语料 / 许可 横向对照表
- **[实验机器人本体](robots.md)** — 评测平台硬件侧
- **[具身模型训练全流程](training-pipeline.md)** — 训练侧

---

## 维护记录

- **2026-07-01**:首版上线,覆盖 SimplerEnv(Google Robot + WidowX VM)/ LIBERO(平均成功率)/ CALVIN(ABC→D avg-len)/ RoboCasa(官方 multitask-300),共 82 条 entry。
