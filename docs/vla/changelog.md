---
description: 具身智能学习站更新日志,按时间倒序记录 VLA 深度调研站点的内容与功能演进——从初版 12 篇细读到补齐 17 篇、新增数据/基准/机器人本体专题、实验结果表、信息架构重构与站点优化。
---

# 更新日志

本站持续生长,这里按时间倒序记录主要更新。⚠️ 标记的自评数据与"待核"缺口在各页内就地标注。

## 2026-06-01

**新增 SmolVLA 细读(小型高效开源 VLA),模型细读扩到 26 篇**
- 📄 **新增 [SmolVLA 细读](/vla/papers/smolvla)**(arXiv:2506.01844,Hugging Face / LeRobot 团队):**平民化 VLA**——主力仅 **0.45B 参数**(冻结 **SmolVLM-2** 主干 + ~100M 流匹配动作专家),三连砍计算(**冻结 VLM** 只训动作专家 + **层跳过**只用前 16 层 LLM + 每帧 **64 视觉 token**),配 **异步推理栈**(Client-Server 解耦感知/预测与执行,任务完成快约 30%)。只吃 **481 个社区数据集筛出的 2.29 万条 episode**(Qwen2.5-VL-3B 自动清洗标注)。⚠️ **LIBERO 平均 87.3** 追平 π0(3.3B)的 86.0、超 OpenVLA(7B)的 76.5;真机 SO-100 多任务 **78.3**;相比 π0 **训练快约 40%、显存少 6×**;单 GPU 可训、消费级 GPU/CPU 可部署,代码/权重/数据全开源(Apache,集成 LeRobot)。
- 🧭 **全站接入**:顶栏「VLA 调研 · 更多代表模型」与 `/vla/` 侧栏加入口;首页「VLA:按技术路线浏览」**连续·扩散/流匹配**卡、[总报告导航表](/vla/)、[发展时间线](/vla/papers/timeline)(2025.06 节点)、[参考文献](/vla/papers/references)、[规格大表](/vla/papers/models-spec)(26 模型 × 12 维)同步登记;自动联动「相关细读」页脚与可信度透镜。
- 🔢 **数量口径 25→26**:全站指代「模型细读数」处(首页 feature 卡、guide、resources、references、models-spec、时间线定位)统一更新为 **26 篇**。**顺带修正**:上轮 SteerVLA 声称已更新 guide/resources 至 25,实际两文件仍停在 24——本轮一并直接修到真实值 **26**。
- 🔎 **事实纪律**:LIBERO/Meta-World/真机数字均为**作者自评**(未见独立第三方同口径复现,尽管已全开源、复现门槛低);原文 episode 数标注不一致(Table 1 标题「~10M」vs 表体「22.9K episode / 10.6M 帧」),采信 **22.9K episode** 并就地标注;SimplerEnv 原文未评测,不予补造。

**新增 SteerVLA 细读(本站首篇自动驾驶域 VLA),模型细读扩到 25 篇**
- 📄 **新增 [SteerVLA 细读](/vla/papers/steervla)**(arXiv:2602.08440,Stanford/UC Berkeley,Levine/Finn/Sadigh/Mees 等;ICLR 2026 投稿):把机器人圈的「可操控(steerability)」分层范式迁到**自动驾驶长尾**——高层 VLM 规划器读场景/历史车状态/路由指令,产出**短推理链 + 细粒度语言 meta-action**;低层 VLA 据观测 + meta-action **回归未来 waypoint**;核心是两级间的**「语言接口」**(高层推理锚定到低层控制)+ 用 **VLM 对真机/仿真数据做事后(hindsight)稠密语言标注**喂监督。⚠️ 闭环 **Bench2Drive 总驾驶分 +4.77、长尾子集 Bench2Drive-LongTail +8.04**(长尾对照前 SOTA SimLingo)。
- 🌐 **首次进入自动驾驶域**:此前 24 篇细读全为机器人操作/人形,SteerVLA 是首篇驾驶 VLA;在 [规格大表](/vla/papers/models-spec) 标「自动驾驶」域、动作空间为 waypoint 轨迹,**横比成功率不与操作类基准混算**。
- 🧭 **全站接入**:顶栏「VLA 调研 · 更多代表模型」与 `/vla/` 侧栏加入口;[总报告导航表](/vla/)、[发展时间线](/vla/papers/timeline)(2026.02 节点)、[参考文献](/vla/papers/references)、[规格大表](/vla/papers/models-spec)(25 模型 × 12 维)同步登记;自动联动「相关细读」页脚与可信度透镜。
- 🔢 **数量口径 24→25**:全站指代「模型细读数」处(首页 feature 卡、guide、resources、references、models-spec、时间线定位)统一更新为 **25 篇**(历史 changelog 行不改写)。
- 🔎 **事实纪律**:论文为投稿中、2026-02 极新预印本、无第三方复现,定量全标 ⚠️;**meta-action 确切词表、高低层主干型号、模仿学习具名数据集、完整结果表与五项城市驾驶技能逐项分**一手摘要/项目页未给出,一律标 **待核** 不予编造(arXiv PDF ~13.5MB、全文 HTML 整理时尚未可解析,定量以 arXiv 摘要 / 项目页 / OpenReview 三处交叉为准)。

## 2026-05-31

**WAM 细读扩到 12 篇 + 首页「WAM 按范式浏览」路线网格**
- 📄 **新增 8 篇 WAM 细读**,把覆盖从"全是联合·扩散"补到全 taxonomy:级联·显式 [UniPi](/wam/papers/unipi)(2302.00111)·[Gen2Act](/wam/papers/gen2act)(2409.16283);级联·隐式 [VPP](/wam/papers/vpp)(2412.14803,CALVIN +18.6%/真机 +31.6% ⚠️)·[LAPA](/wam/papers/lapa)(2410.11758);联合·自回归 [GR-1](/wam/papers/gr-1)(2312.13139,CALVIN 94.9%/零样本 85.4% ⚠️,字节 GR 系开端)·[WorldVLA](/wam/papers/worldvla)(2506.21539,达摩院);联合·扩散新增 [LingBot-VA](/wam/papers/lingbot-va)(**蚂蚁灵波**,2601.21998,RoboTwin2.0-Plus 74.2% ⚠️/据第三方鲁棒性研究)、[τ0-WM](/wam/papers/tau0-wm)(**智元/上海创智·罗剑岚团队**,2026-05-31 开源,5B/~3 万小时;提议→推演→评估修正的测试时搜索)。WAM 细读共 **13 篇**。
- 🧭 **首页新增「WAM:按范式浏览」**路线网格(4 卡:级联·显式/隐式、联合·自回归/扩散),与「VLA:按技术路线浏览」并列;原 VLA 区块改名对称。
- 🗂️ WAM 顶栏与侧栏**改按路线分组**(级联/联合,联合再分自回归/扩散),不再平铺。每篇均经一手 arXiv 摘要核查,定量标 ⚠️、一手未给标待核。

**WAM 总览按综述全文深化(读 arXiv:2605.12090 原文)**
- 📚 通读综述全文(Fig 2 / Table 2 / Fig 6 / §2 形式化),把 [WAM 总览](/wam/) 从"摘要级"升级到"原文级":新增**三个目标函数**($\mathcal{L}_{VLA}/\mathcal{L}_{WM}/\mathcal{L}_{WAM}$)与**级联因子分解** $p(o',a|o,l)=p(a|o',o,l)p(o'|o,l)$;补 **WAM vs VAM / Video Policy / AWM** 辨析(§2.2)。
- 🗂️ **taxonomy 细化到叶**:Cascaded→**显式/隐式**;Joint·自回归→**显式解耦 / 统一离散 / 预测潜**(含 Table 2 主干与规模);Joint·扩散→**单流(显式/隐式)/ 多流(跨注意力·隐状态·共享编码器)**;mermaid 重绘。
- ✅ **纠偏**:综述 Fig 2 把 **VPP 归 Cascaded·隐式、WorldVLA 归 Joint·自回归**——更正此前"预测式 VLA 都属 Joint 类"的说法(它横跨两支);π0.7 被综述归 Cascaded·显式。
- 🔬 **DreamZero 细读补全**:据综述 §4.2.2 补 **Wan2.1 图生视频主干**、KV-cache 观测替换、异步执行+DiT缓存+量化+CUDA-graph 实时化,归 Joint·扩散·单流。
- 📊 数据生态补**具名数据集**(OXE/UMI/ManiSkill2/Ego4D…);评测补**具名基准族**(FVD、VideoPhy/Physics-IQ、WorldSimBench、LIBERO/RoboArena…);开放挑战补综述 §7(多模态超越 RGB、数据配比、因果对齐评测缺口、安全)。

**信息架构重构:VLA / WAM 双轨 + WAM 论文细读**
- 🧭 **顶栏改为双轨制**:首页 / **VLA 调研** / **WAM 调研** / 速查 / 关于。原「论文细读 / 专题 / 横切分析」三个下拉收进「VLA 调研」;新建并列的「WAM 调研」(总览 + 论文细读)。
- 🌍 **WAM 升级为独立调研轨**(新建 `/wam/` 目录树):原 WAM 专题页迁为 [WAM 总览](/wam/),并**新增 5 篇 WAM 论文细读**——[DreamZero](/wam/papers/dreamzero)(零样本策略,arXiv:2602.15922)、[X-WAM](/wam/papers/x-wam)(统一 4D + 异步去噪,2604.26694)、[UWM](/wam/papers/uwm)(耦合视频+动作扩散,2504.02792)、[Genie Envisioner](/wam/papers/genie-envisioner)(智元统一世界平台,2508.05635)、[GR00T N2](/wam/papers/groot-n2)(NVIDIA,基于 DreamZero、WAM 架构,区别于 N1.7 VLA)。每篇经一手 arXiv/官方源核查,定量几乎全标 ⚠️、一手未给标待核。
- 🔧 **管线与交叉链**:`sync.sh` 新增 `/wam/` 同步;首页加 WAM hero 入口与功能卡;predictive-vla / guide 反向链至 WAM 轨;WAM 从「横切分析」组移出(横切回到 7 个)。

**新增 WAM 专题 + 站点交互功能层**
- 🌍 **新增 [世界-行动模型 WAM 专题](/wam/)**(同日稍后重构为独立 WAM 调研轨,见上):2025–2026 兴起的具身基础模型范式——**联合预测「未来状态+动作」**而非仅生成动作。以综述 arXiv:2605.12090(OpenMOSS)为权威源,梳理 **Cascaded/Joint** taxonomy(含 mermaid)、5 篇代表模型细读(DreamZero 2602.15922:14B 自回归视频扩散 7Hz 闭环 ⚠️ / X-WAM 2604.26694:统一 4D + ANS、RoboCasa 79.2% ⚠️ / UWM / 智元 Genie Envisioner / NVIDIA GR00T 2)、数据生态与三维评测协议(视觉保真/物理常识/动作合理性)。明确边界:[预测式 VLA](papers/predictive-vla) 是 WAM 的早期 Joint 切片,[RynnVLA](papers/rynnvla) 是「预测当先验」对照「WAM 预测当策略主体」;横切专题扩到 **8 个**。全程经一手 arXiv 摘要对抗式核查,定量几乎全标 ⚠️ 自评、一手未给标待核。
- ⚙️ **站点交互功能层(地基 + 4 快赢)**:构建期解析 `models-spec.md` 为带可信度标记的结构化数据(keystone,零漂移);**可信度透镜**(全局开关,一键暗化 ⚠️/待核 单元格,横幅按页实数提示)、**相关细读自动页脚**(按机构/主干/路线给确定性兄弟模型 + 可解释 chip)、**阅读进度跟踪**(localStorage,滚动自动标记 + 全站进度条)、**llms.txt / llms-full.txt + 逐页原始 .md.txt 导出**(供外部 LLM 摄取,⚠️/✅/待核 标记原样保留)。

**按需补全(读者反馈驱动)**
- 📄 **新增 [GR-3 细读](papers/gr-3.md)**(字节跳动 Seed,arXiv:2507.15493):Qwen2.5-VL-3B + flow-matching DiT(4B)、三源配方(网页VL+VR人类轨迹+真机)、ByteMini 22-DoF 双臂移动本体;补齐"中国大厂×主流路线"空白(细读扩到 **24 篇**)。
- 📄 **新增 [预测式 VLA 专题](papers/predictive-vla.md)**(VPP/DreamVLA/WorldVLA):兑现 embodied-data §4.1 挂出的"待补"承诺——世界模型作策略主体(推理时预演未来→反推动作),与 RynnVLA"预测只当训练先验"对照;回填 §4.1 占位为正式链接。核查纠偏 VPP CALVIN 提升为 **+18.6%**(非网传 41.5%)。
- 📄 **新增 [Knowledge Insulation(知识隔离)细读](papers/knowledge-insulation.md)**(arXiv:2505.23705):此前只散见于 π0.6/术语表,现单列;stop-gradient 梯度桥 + FAST 离散监督主干 + co-training,π0.6/π0.7 的训练配方。归入横切/方法专题。
- 📄 **新增 [Wall-OSS-0.5 细读](papers/wall-oss-05.md)**(自变量技术报告《Pretrain Once, Act Anywhere》):MoT 双专家 + Vision-Aligned RVQ 分词器 + Action-Space Supervision + 梯度桥接 co-training;细读扩到 **23 篇**。与 π 系 stop-gradient 相反、保留端到端梯度。核查时纠偏其"保住通用 VL"——实为以通用 VQA 换具身 grounding(见该页 §5)。
- 🧭 **新增[阅读优先级](guide)**:guide 增三档(🥇 必读核心约 7 篇 / 🥈 推荐 / 🥉 选读),回应"论文太多"。
- 🔗 **新增 [外部资源导航](papers/resources.md)**:5 个经核实的社区 Awesome 合集(jonyzhang2023 ~3.2k⭐、zchoi ~1.8k⭐、Psi-Robot、keon、wadeKeith)+ 综述 / 基准仿真官方站 / 数据集 / 机构博客;与"参考文献"互补。
- ℹ️ 说明:OpenVLA-OFT(arXiv:2502.19645)经核实**早已有细读**,未重复新建。

**信息架构重构(workflow 四维审计 + 分批落地)**
- 🧭 **统一数量口径为 17 篇**:全站(OG/Twitter meta、报告导航、参考文献、本站结构)从历史的"16 篇"统一更新为 **17 篇模型细读 / 24 个 papers 页面**(新增 π0.7 后的真实计数)。
- 🔗 **顶栏「论文细读」改逐篇下拉**:从仅锚点跳转扩成"奠基与两条路线 / 2025H2–2026 前沿"两组逐篇入口;专题/速查名称与侧边栏对齐。
- 📝 **主报告补全失配条目**:§二补 Diffusion Policy、CogACT 介绍并声明"只展开精选代表、完整清单见导航";§五新增 5.4 Gemini Robotics、5.5 π0.7 正文小节(此前导航表已列、正文却无落点);摘要补 2025H2–2026 前沿覆盖。
- 📊 **去重与权威源约定**:报告 §4.2 标注四大基准"以[《数据集与基准全景》](papers/benchmarks)为权威源";导航表注明"按时间排序里程碑以[发展时间线](papers/timeline)为准";§5.4 重复的 GR00T 迭代并回 §2.3。
- 🛠️ **guide / changelog 纳入源真相管线**:此前两页只活在发布镜像、无法从源端维护,现移回 `具身智能/` 源端并由 `sync.sh` 同步,消除脱管线风险。
- 🧹 **细读模板统一**:实验小节标题统一为「实验与关键结果」,返回链接统一引用块样式,frontmatter 补 `title`;内部链接相对写法统一。
- 🗄️ **清理站点边界**:与主题无关的孤儿文件移出源根目录。

**内容补缺(workflow 缺口分析 + 分批补齐)**
- 📈 **细读扩到 22 篇**:新增 5 篇模型细读——RDT-1B(1.2B 扩散双臂基座)、GO-1(智元 ViLLA 潜动作桥接)、MemoryVLA(感知-认知记忆库)、SpatialVLA(Ego3D + 自适应动作网格的 3D VLA,含 3D-VLA/PointVLA 对照)、Helix(Figure 人形双系统,⚠️ 无论文)。
- 🧩 **新增 5 篇横切分析专题**:全模型规格对比大表(22×12 维)、双系统/分层架构原理、推理加速与量化部署、开源代码库与权重对照、共性失败模式(失败显微镜)——均为重组站内已核查内容的跨模型对照页。
- 🧹 **一致性修订**:术语表补 ECoT(具身思维链)条目;数据专题补"世界模型三种定位"小节并把 guide 的"世界模型尚未覆盖"改正为"已分散覆盖";顶栏新增「横切分析」下拉与「更多代表模型」细读组。
- 🔎 **事实纪律**:5 篇新细读经 web 研究 + arXiv 编号逐一核验(尤其 SpatialVLA 与同名 VQA 基准消歧);自评数据标 ⚠️、一手未给标"待核"、Helix 因无论文全程标厂商声明级。

**此前累积内容(并入本次日志补记)**
- 🆕 **新增 π0.7 细读**(Physical Intelligence,2026.04):可操控通才 + 组合泛化,不微调追平 π*0.6 RL 专家。
- 🧪 **基准专题深度版**:《数据集与基准全景》扩展为 12 节,SimplerEnv/LIBERO/CALVIN/RoboCasa 逐模型成绩 + 口径对照 + 第三方复现。
- 🛠️ **新增专题《具身数据处理》**:从原始采集到可训练样本的清洗/标注/动作&观测处理/伪标签/配比/格式流水线。
- 🎨 **首页科技感 + 机器人配图**:渐变辉光标题、科技网格/极光背景、原创霓虹线稿机器人 hero 与四形态分组图标。

## 2026-05-30

**内容**
- 📊 **补充实验结果表**:为 rt2 / openvla / pi0 / pi0-fast / groot-n1 / pi05 / wall-oss 七篇细读的「实验与关键结果」补上定量速览表(数字取自已核语料,8 条新数字经对抗核查全部为真实"待核"缺口,0 条证伪)。至此当时的 16 篇细读均带实验表。
- 🤖 **新增专题《实验机器人本体》**:19 个实验本体对照表(平台/厂商/形态/自由度/末端/真机或仿真/关联模型与数据集)+ 跨本体迁移要点。
- 🧪 **新增专题《数据集与基准全景》**:SimplerEnv / LIBERO / CALVIN / RoboCasa 四大评测逐模型成绩表;**补齐了一直缺失的 RoboCasa 排行榜**(同口径 DP < π0 < π0.5 < GR00T N1.5)。
- 📚 **细读扩充到 16 篇**:新增 RT-1、Diffusion Policy、CogACT、Gemini Robotics。
- 📖 **新增速查页**:术语速查表 / 发展时间线 / 参考文献聚合。
- 📊 **新增专题《具身数据全景》**:四层数据金字塔 + 10 个真机数据集横评 + 采集范式成本 + co-training / scaling。
- ✅ **事实核查更正**:修正 CogACT SimplerEnv 82.7%(误传,实为 74.8%)、Gemini Robotics 的 ASIMOV 安全数值来源与口径等。

**站点功能**
- 🔗 SEO:sitemap.xml、每页 description、Open Graph 分享大图(`og.png`)与 Twitter Card。
- 🧭 导航:顶栏「专题/速查」下拉、每篇细读底部「本系列」页脚导航、GitHub 链接与「编辑本页」。
- 🎨 视觉:Swiss / 编辑式极简主题(slate 中性 + 蓝色强调)、深色模式、流程图/框架图点击放大灯箱。
- 🛠️ 工程:Mermaid 中文裁切修复、LaTeX 公式渲染、一键同步发布脚本 `sync.sh`、GitHub Actions 自动部署。

## 初版

- 🚀 **具身智能学习站上线**:VLA 发展深度调研总报告 + 12 篇论文细读(RT-2 / OpenVLA / Octo / π0 / π0-FAST / OpenVLA-OFT / GR00T N1 / π0.5 + WALL-OSS / Qwen-VLA / RynnVLA / π0.6)。
