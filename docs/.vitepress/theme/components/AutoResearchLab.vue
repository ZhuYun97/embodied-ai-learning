<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const BASE_PATH = import.meta.env.BASE_URL || '/'
const MARKDOWN_MODULES = import.meta.glob('../../../**/*.md', { query: '?raw', import: 'default' })

const DAILY_DIRECTIONS = [
  {
    id: 'latest',
    label: '最新论文雷达',
    scope: 'latest',
    focus: 'P0/P1 新论文、已细读候选与可验证 claim。',
    seed: '从每日最新论文队列和站内细读里筛出 3 个当日可推进 paper ideas。',
  },
  {
    id: 'data',
    label: '具身数据闭环',
    scope: 'data',
    focus: '数据采集、自动标注、失败回流和 VLA 后训练。',
    seed: '围绕具身数据 scaling、自动标注和失败驱动后训练生成当日 paper ideas。',
  },
  {
    id: 'wam',
    label: 'WAM / WLA',
    scope: 'wam',
    focus: '世界模型、未来预测、候选动作 critic 与真实执行成功率。',
    seed: '围绕 WAM / WLA 如何服务 VLA 控制和评测生成当日 paper ideas。',
  },
  {
    id: 'vla',
    label: 'VLA 后训练',
    scope: 'vla',
    focus: '动作接口、跨本体迁移、post-training 和部署反馈。',
    seed: '围绕 VLA 后训练、动作接口和部署反馈生成当日 paper ideas。',
  },
  {
    id: 'all',
    label: '全站交叉',
    scope: 'all',
    focus: '把 VLA、WAM、数据、评测与产业信号交叉成新问题。',
    seed: '结合全站落盘论文和最新研究信号生成当日 paper ideas。',
  },
]

const MODES = [
  { id: 'deep', label: 'Deep Discovery' },
  { id: 'quick', label: 'Quick Ideas' },
]

const FRONTIER_SIGNALS = [
  {
    title: 'WLA: World-Language-Action unified model',
    date: '2026-06-04',
    url: 'https://arxiv.org/abs/2606.05979',
    tags: ['VLA', 'WAM', 'CONTROL'],
    signal: '把 world modeling、language reasoning、action synthesis 放进统一 AR Transformer,用 World Expert / Action Expert 与 meta-query 连接预测和动作。',
    ideaHook: '把站内 WAM 与 VLA 细读合成“世界预测如何影响动作接口”的 idea。',
  },
  {
    title: 'DreamZero: World Action Models are zero-shot policies',
    date: '2026-02-17',
    url: 'https://arxiv.org/abs/2602.15922',
    tags: ['WAM', 'CONTROL', 'DATA'],
    signal: 'WAM 用视频扩散骨干联合建模未来世界状态和动作,强调跨环境、跨本体和视频演示迁移。',
    ideaHook: '把未来想象变成 VLA 候选动作的 critic / data filter。',
  },
  {
    title: 'World Model for Robot Learning survey',
    date: '2026-04-30',
    url: 'https://arxiv.org/html/2605.00080v1',
    tags: ['WAM', 'EVAL', 'DATA'],
    signal: '综述把机器人世界模型分成 policy coupling、simulator/evaluation、robotic video generation 等角色,并指出 evaluation 与 physical consistency 仍碎片化。',
    ideaHook: '把站内模型细读整理成一个可测的 evaluation protocol idea。',
  },
  {
    title: 'Robots Need More Than VLAs & World Models',
    date: '2026-06-05',
    url: 'https://arxiv.org/html/2606.06556v1',
    tags: ['DATA', 'EVAL', 'CONTROL'],
    signal: '提出 physical data engine / embodied autolabelling / deployment feedback loop,把失败、接触、物体状态和奖励错误转成结构化监督。',
    ideaHook: '把“数据处理页 + 最新论文队列”转成物理可用标签自动生成的 idea。',
  },
]

const DAILY_SOURCE_POOL = {
  agibotFactory: {
    title: '智元 G2 真实工厂 6 天直播:64828 次产线任务',
    url: 'https://www.agibot.com/article/231/detail/83.html',
    bucket: 'news',
    tags: ['NEWS', 'DEPLOY', 'WAM', 'EVAL'],
  },
  ubtechTianjin: {
    title: '优必选天津经开区北方智能制造基地与具身智能创新中心',
    url: 'https://epaper.tianjinwe.com/tjrb/html/2026-06/29/content_143084_3583702.htm',
    bucket: 'news',
    tags: ['NEWS', 'DEPLOY', 'DATA'],
  },
  zhifangFunding: {
    title: '智平方近 50 亿元融资:具身大脑与全栈机器人生态',
    url: 'https://finance.eastmoney.com/a/202606293785696480.html',
    bucket: 'news',
    tags: ['NEWS', 'VLA', 'EVAL'],
  },
  archonFunding: {
    title: '源策未来数亿元种子轮:通用全身具身大脑',
    url: 'https://www.stcn.com/article/detail/3984618.html',
    bucket: 'news',
    tags: ['NEWS', 'VLA', 'CONTROL'],
  },
  faradayShipments: {
    title: 'Faraday Future EAI 机器人 6 月销售/出货/交付 105 台',
    url: 'https://investors.ff.com/news-releases/news-release-details/faraday-future-founder-and-global-ceo-yt-jia-shares-weekly-5',
    bucket: 'news',
    tags: ['NEWS', 'DEPLOY', 'EVAL'],
  },
  tau0Wm: {
    title: 'τ0-WM:统一视频-动作世界模型',
    url: withBase('/wam/papers/tau0-wm'),
    bucket: 'wam',
    tags: ['WAM', 'CONTROL', 'EVAL'],
  },
  lingbotVa: {
    title: 'LingBot-VA:因果视频-动作世界模型',
    url: withBase('/wam/papers/lingbot-va'),
    bucket: 'wam',
    tags: ['WAM', 'CONTROL'],
  },
  rynnvla: {
    title: 'RynnVLA-002:VLA 与世界模型联合共训',
    url: withBase('/wam/papers/rynnvla-002'),
    bucket: 'wam',
    tags: ['WAM', 'VLA', 'CONTROL'],
  },
  brainRanking: {
    title: '具身大脑公司分档榜',
    url: withBase('/ecosystem/brain-ranking'),
    bucket: 'ecosystem',
    tags: ['NEWS', 'EVAL', 'VLA'],
  },
  xSquareFunding: {
    title: 'X Square Robot 连续四轮融资:Physical AI 基座模型',
    url: 'https://www.prnewswire.com/apac/news-releases/x-square-robot-secures-four-consecutive-financing-rounds-surpasses-us2-8-billion-valuation-in-push-for-physical-ai-foundation-models-302813098.html',
    bucket: 'news',
    tags: ['NEWS', 'VLA', 'DATA', 'DEPLOY'],
  },
  stridingFoundation: {
    title: 'Striding AI 机器人基础系统:世界模型、强化学习与部署工程',
    url: 'https://www.momenta.media/article/striding-ai-announces-robotics-foundation-system-plans',
    bucket: 'news',
    tags: ['NEWS', 'VLA', 'WAM', 'DEPLOY'],
  },
  bmwFigure03: {
    title: 'BMW Spartanburg 项目引入 Figure 03 人形机器人',
    url: 'https://humanoidroboticstechnology.com/industry-news/figure-03-humanoids-at-bmw-group-project-in-spartanburg/',
    bucket: 'news',
    tags: ['NEWS', 'DEPLOY', 'VLA', 'EVAL'],
  },
  koreaHumanoidChallenge: {
    title: '韩国 2026 Humanoid Challenge 制造业场景验证',
    url: 'https://www.ajudaily.com/view/20250629135149621',
    bucket: 'news',
    tags: ['NEWS', 'EVAL', 'HUMANOID', 'DEPLOY'],
  },
  tapVla: {
    title: 'TAP-VLA:把触觉 shear field 作为视觉标注注入 VLA',
    url: 'https://arxiv.org/abs/2606.29089',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'TACTILE', 'CONTROL'],
  },
  t2vla: {
    title: 'T²VLA:用离散动作 VLA 置信度做 test-time RL',
    url: 'https://arxiv.org/abs/2606.29892',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'EVAL'],
  },
  saVla: {
    title: 'SA-VLA:state-aware action tokenizer',
    url: 'https://arxiv.org/abs/2606.30113',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'DATA'],
  },
  zr0: {
    title: 'ZR-0:dense embodied chain-of-thought 对齐跨本体表征',
    url: 'https://arxiv.org/abs/2606.30552',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'EVAL'],
  },
  eventVla: {
    title: 'Event-VLA:事件相机增强低光场景动作鲁棒性',
    url: 'https://arxiv.org/abs/2606.29384',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'DEPLOY'],
  },
  criticalIntervalMse: {
    title: 'Critical Interval MSE:关键片段 offline validation loss',
    url: 'https://arxiv.org/abs/2606.29898',
    bucket: 'latest',
    tags: ['LATEST', 'EVAL', 'VLA', 'DATA'],
  },
  steam: {
    title: 'STEAM:frame-level advantage 识别真实轨迹停滞、失败与恢复片段',
    url: 'https://arxiv.org/abs/2606.29834',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'EVAL', 'CONTROL'],
  },
  dailyPapers0630: {
    title: '每日最新论文 2026-06-30:VLA / WAM / DATA-EVAL / HUMANOID-TACTILE',
    url: withBase('/papers/latest'),
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'DATA', 'EVAL'],
  },
  dailyPapers0702: {
    title: '每日最新论文 2026-07-02:VLA / WAM / DATA-EVAL / HUMANOID-TACTILE',
    url: withBase('/papers/latest'),
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'DATA', 'EVAL', 'TACTILE'],
  },
  embodimentSemantic: {
    title: 'EmbodimentSemantic:具身操作轨迹空间 scene-graph benchmark',
    url: 'https://arxiv.org/abs/2607.00020',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'EVAL', 'DATA'],
  },
  chord: {
    title: 'CHORD:object-centric contact wrench guidance 与双手任务 benchmark',
    url: 'https://arxiv.org/abs/2607.00033',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'CONTROL', 'DATA'],
  },
  pointWorldModels3d: {
    title: '3D Point World Models:action-conditioned 3D dynamics',
    url: 'https://arxiv.org/abs/2607.00148',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
  aspire: {
    title: 'ASPIRE:开放式机器人技能发现与 code-as-policy 技能库',
    url: 'https://arxiv.org/abs/2607.00272',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'CONTROL', 'EVAL'],
  },
  actVla: {
    title: 'ACT-VLA:latent task representation 合成组合技能示教',
    url: 'https://arxiv.org/abs/2607.00351',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DATA', 'CONTROL'],
  },
  dartVla: {
    title: 'DART:VLA 单样本域适配与 domain weight arithmetic',
    url: 'https://arxiv.org/abs/2607.00666',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DEPLOY', 'CONTROL'],
  },
  abotM05: {
    title: 'ABot-M0.5:移动操作 World-Action Model',
    url: 'https://arxiv.org/abs/2607.00678',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'VLA', 'CONTROL'],
  },
  roboWorld: {
    title: 'RoboWorld:用视频世界模型替代部分实机 policy 评测',
    url: 'https://arxiv.org/abs/2607.01060',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'EVAL', 'CONTROL'],
  },
  hTac: {
    title: 'H-Tac / TTP:人类第一视角触觉-动作预训练',
    url: 'https://arxiv.org/abs/2607.01067',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'DATA', 'CONTROL'],
  },
  structured4d: {
    title: 'Structured 4D Latent Predictive Model:结构化 3D 场景未来预测',
    url: 'https://arxiv.org/abs/2607.01166',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
  furnitureVla: {
    title: 'FurnitureVLA:真实尺度双臂家具长程装配 VLA',
    url: 'https://arxiv.org/abs/2607.01212',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'HUMANOID', 'CONTROL'],
  },
  xSquareWallWmRelease: {
    title: '自变量开源 WALL-WM:从定长动作块转向事件级预测',
    url: 'https://www.prnewswire.com/news-releases/x-square-robot-open-sources-wall-wm-shifting-robot-world-modeling-from-chunks-to-events-302785692.html',
    bucket: 'news',
    tags: ['NEWS', 'WAM', 'VLA', 'DATA'],
  },
  xSquareXrzeroG0: {
    title: '自变量 XRZero-G0 + G0-Dataset:无本体数据采集与混合训练',
    url: 'https://www.prnewswire.com/news-releases/x-square-robot-open-sources-xrzero-g0-to-scale-robot-learning-with-interfaces-data-quality-and-ratios-302796281.html',
    bucket: 'news',
    tags: ['NEWS', 'DATA', 'VLA', 'DEPLOY'],
  },
  dailyPapers0701: {
    title: '每日最新论文 2026-07-01:VLA 后训练 / 触觉迁移 / 人形数据',
    url: withBase('/papers/latest'),
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'DATA', 'EVAL', 'TACTILE'],
  },
  physicalReasoningUnverifiable: {
    title: 'Position: VLA Models Cannot Be Verified to Perform Physical Reasoning',
    url: 'https://arxiv.org/abs/2606.30686',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'EVAL'],
  },
  elastic: {
    title: 'ELASTIC:状态相关的 VLA 推理时计算分配',
    url: 'https://arxiv.org/abs/2606.31132',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DEPLOY', 'CONTROL'],
  },
  z1: {
    title: 'Z-1:基于 pi0.5 的 flow-based VLA RL 后训练',
    url: 'https://arxiv.org/abs/2606.31846',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'EVAL'],
  },
  sarl: {
    title: 'Semantic Action Reinforcement Learning:在 prompt 空间学习组合技能',
    url: 'https://arxiv.org/abs/2606.31958',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'DATA'],
  },
  muse: {
    title: 'MuSe:有限力觉数据接入预训练 vision-only policy',
    url: 'https://arxiv.org/abs/2606.30988',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'DATA', 'CONTROL'],
  },
  tactx: {
    title: 'TactX:跨触觉传感器共享 latent 迁移',
    url: 'https://arxiv.org/abs/2606.31236',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'DATA', 'DEPLOY'],
  },
  rct: {
    title: 'RCT:机器人采集的 touch-vision-language 触觉数据集',
    url: 'https://arxiv.org/abs/2606.31694',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'DATA', 'EVAL'],
  },
  unitacVla: {
    title: 'UniTacVLA:触觉 latent / CoT / 未来预测接入 VLA',
    url: 'https://arxiv.org/abs/2606.31723',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'TACTILE', 'CONTROL'],
  },
  habit: {
    title: 'HABIT:人在人场景下的机器人操作数据',
    url: 'https://arxiv.org/abs/2606.31682',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'HUMANOID', 'DEPLOY'],
  },
  roboTacDex: {
    title: 'RoboTacDex:Unitree G1 视觉-触觉-动作人形灵巧操作数据集',
    url: 'https://arxiv.org/abs/2606.31836',
    bucket: 'latest',
    tags: ['LATEST', 'HUMANOID', 'TACTILE', 'DATA'],
  },
  humanAsHumanoid: {
    title: 'Human-as-Humanoid:ego-exo 人类视频恢复为 60-DoF 人形 action chunk',
    url: 'https://arxiv.org/abs/2606.32009',
    bucket: 'latest',
    tags: ['LATEST', 'HUMANOID', 'DATA', 'CONTROL'],
  },
  labimus: {
    title: 'Labimus:有机化学实验室人形灵巧操作 benchmark',
    url: 'https://arxiv.org/abs/2606.31037',
    bucket: 'latest',
    tags: ['LATEST', 'HUMANOID', 'EVAL', 'CONTROL'],
  },
  dailyPapers0703: {
    title: '每日最新论文 2026-07-03:VLA 可靠性 / 3D-WAM / 真实评测',
    url: withBase('/papers/latest'),
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'DATA', 'EVAL', 'TACTILE'],
  },
  neuroSymbolicSafety: {
    title: 'Neuro-Symbolic Safety Guidance for VLAs',
    url: 'https://arxiv.org/abs/2607.01378',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'EVAL'],
  },
  autoSerl: {
    title: 'AutoSERL:单条示教自动化实机 RL',
    url: 'https://arxiv.org/abs/2607.01651',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'CONTROL', 'DEPLOY'],
  },
  tacImag: {
    title: 'TacImag:从视觉和本体感觉想象触觉表征',
    url: 'https://arxiv.org/abs/2607.01684',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'WAM', 'CONTROL'],
  },
  vlaCorrector: {
    title: 'VLA-Corrector:视觉偏差触发 action chunk 截断和重规划',
    url: 'https://arxiv.org/abs/2607.01804',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'DEPLOY'],
  },
  physMani: {
    title: 'PhysMani:physics-principled 3D world model 接入 action policy',
    url: 'https://arxiv.org/abs/2607.01938',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
  bridgeWa: {
    title: 'Bridge-WA:用结构化 3D Gaussian 和 object-centric action token 桥接 WAM 与动作',
    url: 'https://arxiv.org/abs/2607.02195',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'VLA', 'CONTROL'],
  },
  vtWam: {
    title: 'VT-WAM:视频-触觉联合预测的 world-action model',
    url: 'https://arxiv.org/abs/2607.02503',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'TACTILE', 'CONTROL'],
  },
  worldDirector: {
    title: 'WorldDirector:LLM 编排 3D 轨迹和相机运动控制世界模拟',
    url: 'https://arxiv.org/abs/2607.02517',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'DATA', 'EVAL'],
  },
  manipArena: {
    title: 'ManipArena:标准化真实机器人 manipulation generalization 评测',
    url: 'https://arxiv.org/abs/2603.28545',
    bucket: 'latest',
    tags: ['LATEST', 'EVAL', 'VLA', 'WAM'],
  },
  vlaArena: {
    title: 'VLA-Arena:开源 VLA benchmark 框架',
    url: 'https://arxiv.org/abs/2512.22539',
    bucket: 'latest',
    tags: ['LATEST', 'EVAL', 'VLA'],
  },
  dig: {
    title: 'DiG:用分布漂移信号 gate/refine VLA action chunk',
    url: 'https://arxiv.org/abs/2512.01715',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DEPLOY', 'EVAL'],
  },
  vlaFlow: {
    title: 'VLAFlow:连续动作 VLA 的 flow matching/action generation 建模',
    url: 'https://arxiv.org/abs/2607.01586',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'DEPLOY'],
  },
  dailyPapers0707: {
    title: '每日最新论文 2026-07-07:自由相机 VLA / 可控 WAM / 视触觉评测',
    url: withBase('/papers/latest'),
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'DATA', 'EVAL', 'TACTILE'],
  },
  camVla: {
    title: 'CamVLA:camera-centric 动作预测处理自由相机部署',
    url: 'https://arxiv.org/abs/2607.05396',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DEPLOY', 'CONTROL'],
  },
  deform360: {
    title: 'Deform360:真实多视角视触觉可变形物体数据集',
    url: 'https://arxiv.org/abs/2607.05390',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'DATA', 'WAM'],
  },
  cortex: {
    title: 'Cortex:高层 VLM 规划和低层 VLA 执行双向对齐',
    url: 'https://arxiv.org/abs/2607.05377',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'EVAL'],
  },
  gelNeuro: {
    title: 'GelNeuro:光学触觉前端与神经形态 SoC 集成',
    url: 'https://arxiv.org/abs/2607.05241',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'DEPLOY', 'DATA'],
  },
  internVlaA15: {
    title: 'InternVLA-A1.5:latent querying 未来预测增强组合泛化',
    url: 'https://arxiv.org/abs/2607.04988',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'CONTROL'],
  },
  dswam: {
    title: 'DSWAM:双系统 world-action model',
    url: 'https://arxiv.org/abs/2607.04927',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'VLA', 'CONTROL'],
  },
  athenaWbc: {
    title: 'Athena-WBC:人形 whole-body control 信号',
    url: 'https://arxiv.org/abs/2607.04837',
    bucket: 'latest',
    tags: ['LATEST', 'HUMANOID', 'CONTROL', 'DEPLOY'],
  },
  geoMola: {
    title: 'GeoMoLa:3D geometry motion latent for world/action modeling',
    url: 'https://arxiv.org/abs/2607.04714',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'DATA'],
  },
  kamWm: {
    title: 'KAM-WM:knowledge/affordance world model',
    url: 'https://arxiv.org/abs/2607.04652',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
  seam: {
    title: 'SEAM:VLA action chunk smoothing / execution alignment',
    url: 'https://arxiv.org/abs/2607.04609',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DEPLOY', 'CONTROL'],
  },
  mask2realWm: {
    title: 'Mask2Real-WM:从 mask 世界模型到 sim2real 操作',
    url: 'https://arxiv.org/abs/2607.04546',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'DEPLOY', 'CONTROL'],
  },
  roboDojo: {
    title: 'RoboDojo:统一仿真与真实机器人通用 manipulation 评测',
    url: 'https://arxiv.org/abs/2607.04434',
    bucket: 'latest',
    tags: ['LATEST', 'EVAL', 'VLA', 'WAM'],
  },
  dailyPapers0708: {
    title: '每日最新论文 2026-07-08:3D VLA / 4D WAM / 人形触觉',
    url: withBase('/papers/latest'),
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'WAM', 'DATA', 'EVAL', 'TACTILE'],
  },
  lift3dVla: {
    title: 'Lift3D-VLA:把 VLA 显式抬升到点云几何和时序动作空间',
    url: 'https://arxiv.org/abs/2607.06564',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'DATA'],
  },
  rynnWorld4d: {
    title: 'RynnWorld-4D:RGB-D-flow 未来世界预测',
    url: 'https://arxiv.org/abs/2607.06559',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
  rynnWorldTeleop: {
    title: 'RynnWorld-Teleop:digital teleoperation 生成式世界模型',
    url: 'https://arxiv.org/abs/2607.06558',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'DATA', 'CONTROL'],
  },
  sieve: {
    title: 'SIEVE:按 primitive/interface 结构覆盖度选择示教轨迹',
    url: 'https://arxiv.org/abs/2607.06442',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DATA', 'EVAL'],
  },
  wristMimic: {
    title: 'WristMimic:用 wrist 连接全身运动与接触丰富手部操作',
    url: 'https://arxiv.org/abs/2607.06438',
    bucket: 'latest',
    tags: ['LATEST', 'HUMANOID', 'DATA', 'CONTROL'],
  },
  lingbotVla20: {
    title: 'LingBot-VLA 2.0:60,000 小时数据与多机器人部署配置',
    url: 'https://arxiv.org/abs/2607.06403',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DATA', 'DEPLOY'],
  },
  actionCache: {
    title: 'ActionCache:给 flow-matching VLA 加外部动作缓存',
    url: 'https://arxiv.org/abs/2607.06370',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'DEPLOY', 'CONTROL'],
  },
  lamp: {
    title: 'LAMP:真实灵巧手 latent motion prior 与 residual RL',
    url: 'https://arxiv.org/abs/2607.06323',
    bucket: 'latest',
    tags: ['LATEST', 'TACTILE', 'CONTROL', 'DEPLOY'],
  },
  semanticHandoffFailures: {
    title: 'Semantic Handoff Failures:长程 household task 的 skill handoff 诊断',
    url: 'https://arxiv.org/abs/2607.06256',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'EVAL', 'CONTROL'],
  },
  image2sim: {
    title: 'Image2Sim:单张全景图到可交互 3D 场景和 embodied navigation 数据',
    url: 'https://arxiv.org/abs/2607.06165',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'WAM', 'EVAL'],
  },
  thorArena: {
    title: 'ThorArena:带双手交互力的人形物理交互评测',
    url: 'https://arxiv.org/abs/2607.06052',
    bucket: 'latest',
    tags: ['LATEST', 'HUMANOID', 'EVAL', 'CONTROL'],
  },
  roboTales: {
    title: 'RoboTALES:任务对齐 imagined futures 训练机器人策略',
    url: 'https://arxiv.org/abs/2607.06018',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
  imaginedRolloutsKinematic: {
    title: 'Imagined Rollouts are Kinematic, Not Dynamic',
    url: 'https://arxiv.org/abs/2607.05966',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'EVAL'],
  },
  dexTele: {
    title: 'DexTele:双臂灵巧遥操作系统',
    url: 'https://arxiv.org/abs/2607.05883',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'TACTILE', 'CONTROL'],
  },
  graspIt: {
    title: 'GraspIT:仿真和真实抓取 SE(3) 质量数据集',
    url: 'https://arxiv.org/abs/2607.05869',
    bucket: 'latest',
    tags: ['LATEST', 'DATA', 'EVAL', 'CONTROL'],
  },
  forge: {
    title: 'FORGE:视觉提示推断 object states 与 functional keypoints',
    url: 'https://arxiv.org/abs/2607.05765',
    bucket: 'latest',
    tags: ['LATEST', 'VLA', 'CONTROL', 'EVAL'],
  },
  mecoWam: {
    title: 'MECo-WAM:机械直觉 world-action model',
    url: 'https://arxiv.org/abs/2607.05468',
    bucket: 'latest',
    tags: ['LATEST', 'WAM', 'CONTROL', 'EVAL'],
  },
}

const DAILY_IDEA_ANCHORS = {
  '2026-06-29': '2026-06-29 今日产业信号 × 站内 WAM/VLA 细读',
  '2026-06-30': '2026-06-30 今日论文雷达 × 6/30 产业部署信号',
  '2026-07-01': '2026-07-01 今日论文雷达 × VLA 后训练 × 触觉/人形数据信号',
  '2026-07-02': '2026-07-02 今日论文雷达 × 自变量开源补录 × 3D/触觉/长程装配信号',
  '2026-07-03': '2026-07-03 今日论文雷达 × VLA 可靠性 × 3D/触觉 WAM 评测',
  '2026-07-07': '2026-07-07 今日论文雷达 × 自由相机 VLA × 可控 WAM × 视触觉评测',
  '2026-07-08': '2026-07-08 今日论文雷达 × 3D VLA × 4D WAM × 人形触觉',
}

const DAILY_IDEA_PACKS = {
  '2026-07-08': [
    {
      title: '3D-Grounded VLA Contract: 把几何、数据覆盖和动作缓存写进同一个接口',
      thesis: '让 VLA action head 不再只消费 2D 视觉 token,而是显式接收点云几何、primitive/interface 覆盖度和可检索动作缓存,把部署时的几何错配和推理延迟一起处理。',
      tension: 'Lift3D-VLA 把 VLA 抬到点云和时序动作空间,LingBot-VLA 2.0 强调真实部署规模,SIEVE 和 ActionCache 分别处理数据覆盖与实时推理,但这些信号还没有统一成动作接口规范',
      motivation: '7 月 8 日的 VLA 线索很集中:一边是 3D 几何和真实部署规模,另一边是数据选择和推理加速。最值得写成 paper 的问题不是再加一个 3D encoder,而是定义“什么几何证据、什么训练覆盖、什么历史动作可以进入同一个 action contract”。',
      contributions: [
        '提出 3D-grounded action contract:每个动作 token 绑定局部点云、目标物状态、primitive/interface 覆盖和缓存可复用性。',
        '把示教选择从轨迹级 medoid 扩展到 action-contract 覆盖,让后训练优先补齐几何和接口盲区。',
        '设计 cache-aware decoding,只在 contract 相似且几何状态一致时复用历史动作中间状态。',
      ],
      method: [
        '用 Lift3D-VLA 式点云 lifting 生成局部 3D action tokens,并用 LingBot-VLA 2.0 的多机器人配置抽象本体条件。',
        '用 SIEVE 的 primitive/interface 分解给每条轨迹打结构覆盖分,训练时按 coverage gap 采样。',
        '用 ActionCache 检索相似 contract 的历史去噪中间动作,并加入几何一致性门控避免错误 warm-start。',
      ],
      evaluation: '自由相机重装、遮挡、长程装配和多本体任务;指标包括 3D 目标误差、成功率、coverage gap 降幅、推理延迟、缓存误用率和跨机器人适配样本数。',
      novelty: 90,
      feasibility: 72,
      academicVerdict: '像一篇完整 VLA 接口论文;关键要把“contract”落成可测变量,否则容易变成多模块拼装。',
      whyNow: '今天 3D VLA、部署级数据规模、结构化轨迹选择和动作缓存同时出现,正好说明 action interface 需要被重新定义。',
      sourceIds: ['lift3dVla', 'lingbotVla20', 'sieve', 'actionCache', 'dailyPapers0708'],
      frontierId: 'lift3dVla',
    },
    {
      title: 'Digital-Teleop WAM Engine: 用 4D 世界想象生成可训练遥操作数据',
      thesis: '把 digital teleoperation、4D RGB-D-flow 预测和任务对齐 imagined futures 组合成数据引擎,先在世界模型中生成、筛选和标注动作,再进入真实策略后训练。',
      tension: 'RynnWorld-4D 和 RynnWorld-Teleop 给了生成式世界和手部 pose 标签,RoboTALES/MECo-WAM 强调任务目标和机械直觉,但缺少一套判断生成数据是否真的可训练的过滤协议',
      motivation: '7 月 8 日的 WAM 线索不只是“会生成未来”,而是开始触碰数据生产:操作者 hand pose 可以驱动世界模型生成机器人第一视角视频,4D rollout 又能给 RGB、depth、flow 和物理属性监督。下一步自然是把它变成可控的数据 flywheel。',
      contributions: [
        '提出 digital-teleop data loop:手部 pose 先驱动 4D WAM 生成候选轨迹,再由任务 critic 和机械一致性 critic 过滤。',
        '定义 trainability score,同时考察 RGB-D-flow 一致性、接触/机械属性合理性和任务子目标推进。',
        '给出真实少量锚定数据 + 大量 WAM 合成遥操作数据的混合训练配方。',
      ],
      method: [
        '用 RynnWorld-Teleop 生成机器人中心第一视角视频与 pose stream,并用 RynnWorld-4D 预测 depth/flow 作为几何监督。',
        '用 RoboTALES 式层级 planner/VLM critic 约束 imagined futures 是否对齐任务,再用 MECo-WAM 式物理属性检查机械直觉。',
        '把通过过滤的轨迹转成 VLA/WAM 后训练数据,并用少量真实 teleop episode 做分布校准。',
      ],
      evaluation: '合成轨迹可训练率、真实成功率、动态一致性误差、任务子目标达成率、真实 teleop 节省比例和生成数据导致的失败类型。',
      novelty: 89,
      feasibility: 68,
      academicVerdict: '非常有新意,但依赖生成式 WAM 质量;最小 pilot 可以先在仿真和日志重放中验证 trainability score。',
      whyNow: '4D 世界预测、digital teleop 和任务对齐世界想象在同一天集中出现,数据引擎主线已经露出来了。',
      sourceIds: ['rynnWorld4d', 'rynnWorldTeleop', 'roboTales', 'mecoWam', 'imaginedRolloutsKinematic'],
      frontierId: 'rynnWorldTeleop',
    },
    {
      title: 'Wrist-to-Contact Humanoid Bench: 用腕部边界统一全身模仿、灵巧手和力交互评测',
      thesis: '把 wrist 作为全身运动和灵巧接触之间的显式边界,在同一 benchmark 中评估人形全身跟踪、手部接触控制、遥操作 retargeting 和交互力稳定性。',
      tension: 'WristMimic、LAMP、DexTele、ThorArena 和 GraspIT 分别覆盖腕部边界、latent motion prior、遥操作、交互力和抓取 SE(3) 质量,但评测仍分散在全身控制、灵巧手和抓取数据三套口径中',
      motivation: '人形操作越来越像“身体把手腕放到正确状态,手再完成接触密集动作”。7 月 8 日的论文正好把这个分界点说清楚:WristMimic 直接用 wrist 分层,LAMP/DexTele 处理手部 latent 与遥操作,ThorArena/GraspIT 则补评测和抓取质量。',
      contributions: [
        '提出 wrist-to-contact benchmark:先评估腕部可达与稳定,再评估手部接触、滑移、抓取 SE(3) 和交互力。',
        '定义跨任务指标 handoff quality,衡量全身策略交给手部策略的初始条件是否可执行。',
        '把遥操作、latent motion prior 和抓取质量标签统一成训练/评测闭环。',
      ],
      method: [
        '用 WristMimic 式身体-手腕分层产生候选腕部轨迹,再让 LAMP 式 latent hand policy 完成接触操作。',
        '用 DexTele 的 retargeting 和 GraspIT 的 SE(3) 质量分构造任务初始条件与失败标签。',
        '用 ThorArena 的 motion-force 变量评估交互力、稳定性和全身控制鲁棒性。',
      ],
      evaluation: 'wrist handoff success、接触稳定性、滑移率、抓取 SE(3) 质量、交互力误差、全身平衡失败率和遥操作数据复用效率。',
      novelty: 86,
      feasibility: 76,
      academicVerdict: '适合做 benchmark/system paper;贡献要集中在 wrist handoff quality,不要散成普通人形数据合集。',
      whyNow: '同一天出现 wrist 分层、人形交互力、真实灵巧手 RL、双臂遥操作和抓取质量数据,说明评测边界该合并了。',
      sourceIds: ['wristMimic', 'lamp', 'dexTele', 'thorArena', 'graspIt'],
      frontierId: 'wristMimic',
    },
  ],
  '2026-07-07': [
    {
      title: 'Calibration-Free VLA Deployment: 自由相机、潜在前瞻和 action chunk 稳定性的联合协议',
      thesis: '让 VLA 在相机重装、视角漂移和长程执行中不依赖显式外参重标定,而是用 camera-centric 动作、latent foresight 和 chunk smoothing 形成部署级闭环。',
      tension: 'CamVLA 处理自由相机,InternVLA-A1.5 用 latent querying 做未来预测,Cortex 补高低层规划执行对齐,SEAM 关注 action chunk 平滑,但它们还没有变成统一的上线前部署测试',
      motivation: '7 月 7 日的 VLA 重点是部署鲁棒性而不是模型规模。实际机器人最常见的问题是相机移动、视角遮挡、长程 skill 切换和 chunk 抖动,这几篇刚好分别击中一个点。',
      contributions: [
        '提出 calibration-free deployment protocol,用相机扰动、任务阶段切换和 action chunk drift 作为核心 stress test。',
        '把 camera-centric action、latent foresight 和 chunk smoothing 组合成一个轻量部署 wrapper。',
        '输出错误归因表,区分相机外参错配、前瞻预测错误、规划执行 handoff 错误和 chunk 抖动。',
      ],
      method: [
        '用 CamVLA 式 camera-centric 动作预测替代固定相机外参输入,并在训练中随机化相机位姿。',
        '用 InternVLA-A1.5 的未来 latent query 预测下一阶段视觉/子任务状态,作为 Cortex 式 skill handoff 前置检查。',
        '在执行端加入 SEAM 式 action chunk smoothing 和异常截断,记录每类部署扰动下的失败来源。',
      ],
      evaluation: '相机重装成功率、长程任务完成率、skill handoff 失败率、action chunk jerk、重规划次数和无标定上线时间。',
      novelty: 87,
      feasibility: 74,
      academicVerdict: '很适合做部署鲁棒性 paper;重点是给出可复现实验协议,而不只是复刻四个模块。',
      whyNow: '自由相机、latent foresight、长程 handoff 和 chunk 稳定性同日出现,部署鲁棒性主线已经足够清晰。',
      sourceIds: ['camVla', 'internVlaA15', 'cortex', 'seam', 'dailyPapers0707'],
      frontierId: 'camVla',
    },
    {
      title: 'Affordance-WAM Executor: 让世界模型直接输出可执行动作接口',
      thesis: '把 WAM 从视频/状态预测器推进为 affordance-conditioned executor,让预测结果能直接约束动作 token、mask-to-real 迁移和 3D motion latent。',
      tension: 'DSWAM、KAM-WM、Mask2Real-WM 和 GeoMoLa 都在把世界模型信号转成动作接口,但缺少统一比较“预测信号怎么影响执行”的 ablation',
      motivation: '7 月 7 日的 WAM 论文共同指向一个问题:世界模型如果只是预测未来,很难证明它对控制有价值;它必须给出 affordance、mask、motion latent 或 dual-system 动作约束,并且能在真实或仿真评测中提升执行。',
      contributions: [
        '提出 affordance-WAM executor:世界模型输出 affordance map、3D motion latent 和 action-token constraints 三类执行信号。',
        '设计 dual-system ablation,比较视觉预测、affordance 预测、mask-to-real 迁移和 3D latent 约束对成功率的边际贡献。',
        '把 WAM 评测和 RoboDojo 式 sim+real manipulation 任务绑定,避免只看生成质量。',
      ],
      method: [
        '用 KAM-WM 生成 affordance/state signal,用 GeoMoLa 表示 3D motion latent,再用 DSWAM 式高低层双系统接入策略。',
        '在 mask-rich 仿真中用 Mask2Real-WM 训练可迁移世界状态,再转到真实机器人执行。',
        '对同一批 VLA 候选动作分别加入无 WAM、video WAM、affordance WAM 和 executor WAM 约束。',
      ],
      evaluation: 'sim+real 成功率、affordance grounding F1、3D motion latent 误差、动作约束误杀率、真实执行提升和闭环延迟。',
      novelty: 88,
      feasibility: 69,
      academicVerdict: 'WAM 方法味很强;风险是系统较重,第一版可以把 executor 限定为 rerank/constraint 而非端到端控制。',
      whyNow: '今天多篇 WAM 都在从“看未来”走向“约束动作”,正好需要一个 executor 口径把路线拉齐。',
      sourceIds: ['dswam', 'kamWm', 'mask2realWm', 'geoMola', 'roboDojo'],
      frontierId: 'kamWm',
    },
    {
      title: 'Deformable Contact Arena: 真实视触觉数据到 sim-real 通用评测',
      thesis: '围绕可变形物体、触觉事件和人形全身接触构建统一评测,专门测现有 VLA/WAM 在布料、线缆、软物体和接触力变化下的失败模式。',
      tension: 'Deform360 给真实多视角视触觉可变形数据,RoboDojo 给 sim+real 操作评测,GelNeuro 和 Athena-WBC 则把低延迟触觉与人形全身控制推到前台,但它们还没有共用一个 contact-rich protocol',
      motivation: '硬物体桌面任务已经不能代表部署难点。7 月 7 日的数据/评测线说明,可变形、触觉和全身控制会成为下一批真实失败来源,需要一个能同时评价感知、世界预测和动作执行的 arena。',
      contributions: [
        '提出 deformable contact arena,覆盖可变形物体、多视角视觉、触觉事件、全身控制和 sim-real 转换。',
        '定义五类失败:形变估计错、接触状态错、触觉延迟错、全身稳定错和 sim-real 物性错。',
        '给出 VLA、WAM、diffusion policy 和 whole-body controller 的统一任务表。',
      ],
      method: [
        '用 Deform360 构造真实视触觉片段和形变状态标签,再在 RoboDojo 风格环境中复现任务变量。',
        '接入 GelNeuro 低延迟触觉事件作为实时 contact prompt,并给 Athena-WBC 式全身控制任务设约束。',
        '比较纯视觉、视触觉、WAM rollout 和 WBC-aware policy 在同一失败 taxonomy 下的表现。',
      ],
      evaluation: '形变状态误差、接触阶段 F1、触觉延迟敏感性、任务成功率、全身稳定性、sim-real ranking agreement 和失败类型覆盖率。',
      novelty: 84,
      feasibility: 78,
      academicVerdict: '适合做 benchmark paper;优势是评测问题清楚,要注意控制任务规模避免建设成本过高。',
      whyNow: '真实可变形视触觉数据、通用 manipulation 评测、低功耗触觉和人形 WBC 同日出现,评测整合窗口正好打开。',
      sourceIds: ['deform360', 'roboDojo', 'gelNeuro', 'athenaWbc', 'dailyPapers0707'],
      frontierId: 'deform360',
    },
  ],
  '2026-07-03': [
    {
      title: 'Runtime Safety Governor: 面向 flow VLA 的预测性安全与自纠错层',
      thesis: '在不重训 VLA backbone 的情况下,给 flow/action-chunk policy 加一个运行时 governor,同时处理符号安全约束、视觉偏差监测、分布漂移和在线重规划。',
      tension: 'Neuro-Symbolic Safety、VLA-Corrector、DiG 和 VLAFlow 都在处理部署可靠性,但安全约束、视觉自纠错和分布漂移仍是分开的 runtime 机制',
      motivation: '7 月 3 日的 VLA 可靠性线很强:有符号安全引导、有视觉偏差触发的重规划、有 action chunk drift 检测,还有 flow policy 主干。最自然的 paper 是把这些做成一层可插拔的 runtime safety governor。',
      contributions: [
        '提出 runtime safety governor,输入 VLA action chunk 与观测流,输出 correction、truncate、rerank 或 safe-stop 四类动作。',
        '把符号约束、视觉预测偏差和 representation drift 统一成风险分数,并记录每次干预的可解释原因。',
        '建立 flow VLA 安全评测,同时报告任务成功率和安全约束满足率。',
      ],
      method: [
        '用 Neuro-Symbolic Safety 的 minimum-norm correction 作为硬约束层,先处理碰撞和 forbidden zone。',
        '用 VLA-Corrector 的 latent vision monitor 检测实际观测与预测演化差异,触发 chunk 截断和重规划。',
        '用 DiG 的 distribution shift 信号和 VLAFlow 的连续动作轨迹特征判断是否需要降低速度或请求新规划。',
      ],
      evaluation: 'SafeLIBERO/ManipArena/VLA-Arena 风格任务;指标包括碰撞率、任务成功率、误干预率、漂移检测 AUROC、平均延迟和人类接管次数。',
      novelty: 89,
      feasibility: 75,
      academicVerdict: '很像强 pilot 候选;核心要证明多信号 governor 比单一安全层或单一重规划器更稳。',
      whyNow: '这一天的 VLA 新文几乎都在补 runtime 可靠性,已经足够支撑一个统一安全层。',
      sourceIds: ['neuroSymbolicSafety', 'vlaCorrector', 'dig', 'vlaFlow', 'manipArena'],
      frontierId: 'vlaCorrector',
    },
    {
      title: '3D-Tactile WAM Bridge: 用几何动态和想象触觉连接世界模型与动作',
      thesis: '让 WAM 同时预测 3D 动态、触觉未来和 object-centric action token,把世界预测从“视频好看”转成接触密集任务的动作约束。',
      tension: 'PhysMani、Bridge-WA、VT-WAM 和 TacImag 都把 WAM 推向 3D、触觉和动作接口,但缺少同一任务中验证三类预测谁真正提升控制的实验',
      motivation: '7 月 3 日 WAM 线索非常清楚:3D dynamics、3D Gaussian/action token bridge、视频-触觉未来预测、无触觉硬件时的触觉想象。它们共同提出一个问题:哪种世界预测最能减少接触操作失败?',
      contributions: [
        '提出 3D-tactile WAM bridge,把未来 3D flow、触觉状态和 object-centric action token 作为动作 critic 输入。',
        '定义 contact-progress score,衡量预测的几何接近、触觉接触和动作 token 是否共同推进任务。',
        '给出 3D-only、tactile-only、video-only 和 fused WAM 的控制贡献对照。',
      ],
      method: [
        '用 PhysMani 式 3D velocity field 预测物体和末端未来动态,用 Bridge-WA 式 3D scene/action token 连接 policy。',
        '用 VT-WAM 和 TacImag 预测触觉未来或 imagined force field,作为滑移、空抓和过力风险信号。',
        '对 VLA 候选动作进行 WAM rerank,只执行 contact-progress score 最高且风险低的动作。',
      ],
      evaluation: '快速运动目标、插入、抓取、纹理/接触任务;指标包括真实成功率、滑移预警、3D 预测误差、触觉预测误差、rerank agreement 和闭环延迟。',
      novelty: 88,
      feasibility: 67,
      academicVerdict: '方法潜力高,但硬件和数据要求更重;建议先做离线 rerank sanity check。',
      whyNow: '同一天出现 3D WAM、3D-action bridge、VT-WAM 和触觉想象,说明 WAM 的下一步是“几何 + 接触”的动作接口。',
      sourceIds: ['physMani', 'bridgeWa', 'vtWam', 'tacImag', 'worldDirector'],
      frontierId: 'vtWam',
    },
    {
      title: 'One-Demo-to-Benchmark Loop: 从单条示教实机 RL 到可复现 VLA/WAM 评测',
      thesis: '把单条示教启动的实机 RL、标准化 manipulation benchmark 和运行时可靠性监控连成闭环,让新策略先在可复现评测里证明“少数据变强”而不是只报 demo 成功。',
      tension: 'AutoSERL 证明单条示教可启动实机 RL,ManipArena/VLA-Arena 负责评测口径,VLA-Corrector/DiG 负责运行时诊断,但少数据改进和标准评测还没有闭环',
      motivation: '真实机器人论文最容易卡在“我这个 demo 成了,但别人能不能复现”。7 月 3 日同时出现 AutoSERL、ManipArena、VLA-Arena 和 runtime reliability 线索,适合把少示教改进放进统一评测流水线。',
      contributions: [
        '提出 one-demo-to-benchmark loop:每次少数据 RL 改进都必须经过标准任务、运行时诊断和失败回放三道门。',
        '把 human intervention、runtime correction、benchmark score 和失败类型统一记录为策略改进日志。',
        '比较 single-demo RL、VLA runtime correction 和两者组合的真实收益。',
      ],
      method: [
        '用 AutoSERL 式单示教启动 RL,自动生成滑窗干预、安全恢复和干预终止数据。',
        '把训练前后策略放入 ManipArena/VLA-Arena 任务表,并记录 VLA-Corrector/DiG 风险信号。',
        '将失败片段回流成下一轮干预窗口或安全 governor 规则,形成小闭环。',
      ],
      evaluation: '单示教样本效率、benchmark 排名稳定性、干预次数下降、失败复现率、runtime correction 触发率和跨任务泛化。',
      novelty: 82,
      feasibility: 80,
      academicVerdict: '工程可行性最好,适合先做系统/pipeline paper;主线要锁定复现评测,不要变成普通 RL demo。',
      whyNow: '少示教实机 RL 和标准化 VLA/WAM benchmark 同天出现,刚好能把“变强”转成可复现的评测闭环。',
      sourceIds: ['autoSerl', 'manipArena', 'vlaArena', 'vlaCorrector', 'dig'],
      frontierId: 'autoSerl',
    },
  ],
  '2026-07-02': [
    {
      title: 'Semantic-Contact Graph VLA: 把空间关系和接触力统一成可执行场景图',
      thesis: '让 VLA 不只看物体和语言,而是显式预测“空间关系 + 接触阶段 + 可施力方向”的 semantic-contact graph,再把它作为动作生成和失败诊断的中间接口。',
      tension: 'EmbodimentSemantic 诊断空间 grounding,CHORD/H-Tac 扩大接触与触觉先验,但二者还没有变成 VLA 可直接消费的统一表示',
      motivation: '7 月 2 日论文队列里,EmbodimentSemantic 把具身轨迹拆成支撑、包含、遮挡、深度等空间关系;CHORD 和 H-Tac 则把接触 wrench、人类触觉-动作数据推到前台。FurnitureVLA 又显示长程装配失败往往发生在对齐、插入、支撑和双臂接触阶段。一个自然 idea 是把“看懂空间”和“摸懂接触”合成同一张动作前场景图。',
      contributions: [
        '提出 semantic-contact graph:节点为物体/手/工具,边同时带空间关系、接触阶段、wrench 可行方向和风险标签。',
        '把 scene graph 作为 VLA 的中间监督与动作前 critic,区分语言理解错误、空间关系错误和接触执行错误。',
        '构建长程装配/灵巧操作评测,衡量 graph 质量是否能预测真实 task progress,而不是只看 VQA 准确率。',
      ],
      method: [
        '用 EmbodimentSemantic 式空间关系标签初始化 graph schema,再用 CHORD contact wrench 与 H-Tac tactile-action 数据补接触边。',
        '训练轻量 graph head 从多视角图像和语言中预测 semantic-contact graph,并把 graph embedding 接入冻结或低秩微调的 VLA action head。',
        '在 FurnitureVLA 类双臂装配和桌面灵巧操作中做 graph ablation:无 graph、纯空间 graph、纯接触 graph、完整 semantic-contact graph。',
      ],
      evaluation: '空间关系 F1、接触阶段识别、wrench 方向误差、长程 task progress、接触失败召回率和 graph 错误到动作失败的因果归因。',
      novelty: 91,
      feasibility: 73,
      academicScores: {
        novelty: 8.7,
        hypothesis: 8.6,
        method: 8.2,
        evaluation: 8.4,
        feasibility: 7.1,
        differentiation: 8.5,
        paperFit: 8.6,
        riskControl: 7.2,
      },
      academicVerdict: '最像一篇完整 VLA 方法论文;关键是把 graph 用作动作接口,否则容易退化成又一个感知 benchmark。',
      whyNow: '今天空间 grounding、接触 wrench、人类触觉预训练和长程双臂装配同时出现,说明“空间-接触中间表示”正好卡在多个方向交汇处。',
      sourceIds: ['embodimentSemantic', 'chord', 'hTac', 'furnitureVla', 'dailyPapers0702'],
      frontierId: 'embodimentSemantic',
    },
    {
      title: 'Geometry-First WAM Critic: 用 3D/4D 世界模型评估 VLA 候选动作',
      thesis: '把 WAM critic 从 RGB 视频保真度转向 3D/4D 几何状态预测,让动作筛选直接依赖物体位姿、遮挡恢复、碰撞风险和 task progress。',
      tension: '3D Point World Models 与 Structured 4D LPM 都把世界模型推向结构化几何,而 RoboWorld / ABot-M0.5 需要把这种预测变成 policy 评测和动作选择',
      motivation: '今天 WAM 线非常清楚:3D Point World Models 关注 action-conditioned 3D dynamics,Structured 4D LPM 预测场景随时间演化,RoboWorld 用视频世界模型替代部分实机评测,ABot-M0.5 则把 world-action model 放进移动操作。问题是:世界模型到底该预测好看的未来视频,还是预测足够准的几何未来来决定动作是否值得执行?',
      contributions: [
        '提出 geometry-first WAM critic:输入 VLA/移动操作候选动作,输出 3D/4D progress、collision、occlusion recovery 和 object-state consistency 分数。',
        '把 WAM 评测从 FVD/LPIPS 等视觉指标改成与真实执行成功相关的几何-任务指标。',
        '给出视频 critic、latent critic、3D point critic 和 4D structured critic 的统一对照协议。',
      ],
      method: [
        '对同一批候选动作分别 rollout RGB/video WAM、3D point WAM 与 structured 4D latent predictor。',
        '从预测结果抽取 object pose delta、接触/碰撞、目标距离和 task-progress-aware VLM 分数,组合成动作 rerank score。',
        '在移动操作和桌面操作中执行 top-k rerank 动作,比较真实成功率、提前拒绝失败动作能力和闭环延迟。',
      ],
      evaluation: '真实成功率提升、failure AUROC、几何误差与成功率相关性、误杀可执行动作比例、推理延迟和替代实机评测的 ranking agreement。',
      novelty: 88,
      feasibility: 70,
      academicScores: {
        novelty: 8.3,
        hypothesis: 8.5,
        method: 8.1,
        evaluation: 8.9,
        feasibility: 6.8,
        differentiation: 8.3,
        paperFit: 8.4,
        riskControl: 7.4,
      },
      academicVerdict: '适合做 WAM/EVAL paper;最小 pilot 可以先用公开仿真和日志重放验证 critic 排名是否贴近真实成功率。',
      whyNow: '7 月 2 日 WAM 候选集中出现 3D、4D、移动操作和替代实机评测四条线,正好能把“世界模型能不能评动作”落成可检验 protocol。',
      sourceIds: ['pointWorldModels3d', 'structured4d', 'roboWorld', 'abotM05', 'xSquareWallWmRelease'],
      frontierId: 'pointWorldModels3d',
    },
    {
      title: 'Robot-Free Skill Composer: 用无本体数据、技能发现和一例适配生成可组合 VLA 训练集',
      thesis: '把 XRZero-G0 式无本体数据、ASPIRE 式技能发现、ACT-VLA 的组合示教和 DART 的单样本域适配连成数据引擎,自动生成“可训练、可迁移、可验证”的组合技能数据。',
      tension: '无本体数据解决规模,技能发现解决复用,ACT-VLA/DART 解决组合和域适配,但缺少一个把它们调度成训练集的闭环',
      motivation: '自变量 XRZero-G0 强调 robot-free demonstration 与少量真机数据混合,ACT-VLA 从 latent task representation 合成组合示教,ASPIRE 把失败诊断和 code-as-policy 技能沉淀成库,DART 则用单样本做 VLA 域适配。它们共同指向一个问题:能不能不再手工决定采什么数据,而由技能缺口自动生成下一批可训练数据?',
      contributions: [
        '提出 skill-gap -> data recipe 调度器:发现缺失 primitive 后,自动选择无本体采集、技能合成、单样本域适配或少量真机锚定。',
        '给出 trainability score:在进入 VLA 后训练前,先用 inspection / replay / one-shot adaptation 过滤不可训练示教。',
        '构建组合技能数据闭环 benchmark,衡量每新增一类数据对组合泛化和跨域部署的边际贡献。',
      ],
      method: [
        '用 ASPIRE 式执行 trace 和失败诊断提取 skill gap,把 gap 映射到 primitive、对象关系、动作接口和域差异。',
        '用 XRZero-G0 采集 robot-free 多视角示教,用 ACT-VLA 生成组合示教候选,再用 DART 做一例目标域权重适配。',
        '训练前用可训练性检查器过滤轨迹,并用 10:1 robot-free/real anchoring 比例做数据配方搜索。',
      ],
      evaluation: '组合泛化成功率、robot-free 数据有效产出率、真机数据节省倍数、单样本域适配增益、技能库复用率和失败类型覆盖率。',
      novelty: 86,
      feasibility: 76,
      academicScores: {
        novelty: 8.1,
        hypothesis: 8.2,
        method: 8.4,
        evaluation: 8.2,
        feasibility: 7.4,
        differentiation: 7.9,
        paperFit: 8.2,
        riskControl: 7.5,
      },
      academicVerdict: '工程可行性最好,很适合先做一版数据引擎/系统论文;贡献要避免散,主线应锁定“skill gap 决定数据配方”。',
      whyNow: '今天的论文队列和自变量补录同时把无本体数据、组合示教、技能发现和少样本适配摆到桌面上,已经足够拼成一个闭环数据引擎。',
      sourceIds: ['xSquareXrzeroG0', 'aspire', 'actVla', 'dartVla', 'dailyPapers0702'],
      frontierId: 'xSquareXrzeroG0',
    },
  ],
  '2026-07-01': [
    {
      title: 'Verifiability-Gated VLA Post-training: 先证明物理推理,再做部署后变强',
      thesis: '把 VLA 后训练从“成功率继续涨”改成“物理推理可验证 + 推理时计算可分配 + RL 改进可归因”的闭环,避免把语义匹配误当物理能力。',
      tension: 'Position paper 指出现有 VLA 很难证明物理推理,Z-1/SARL/ELASTIC 又在推进后训练和推理时扩展,但这些改进需要一个可证伪的物理评测门控',
      motivation: '7 月 1 日最关键的张力是:一边是 VLA 不能被现有 benchmark 验证为真正物理推理,另一边是 RL 后训练、semantic action RL 和 inference scaling 都在快速推进。如果不先建立可验证门控,后训练很可能只强化数据偏见或语言捷径。',
      contributions: [
        '提出 verifiability gate:每个后训练增益必须通过物理变量反事实、视觉语义捷径剥离和动作因果归因三类检查。',
        '把 ELASTIC 的状态相关计算分配纳入 gate,只在物理不确定性高的阶段增加推理预算。',
        '给 Z-1/SARL 式后训练输出增益归因表,区分语义 prompt 改进、动作优化和真实物理决策改进。',
      ],
      method: [
        '构造同语义不同物理的任务配对,例如质量、摩擦、支撑、遮挡和容器关系变化,测试 VLA 是否改变动作。',
        '在通过 gate 的关键阶段运行 ELASTIC 式自适应推理预算,并记录成功率和延迟曲线。',
        '用 Z-1 的 flow-based RL 与 SARL 的 prompt-space RL 做对照,检查后训练是否提升物理变量敏感性。',
      ],
      evaluation: '物理反事实成功率、semantic shortcut gap、推理预算收益曲线、后训练退化率、真实任务成功率和可归因增益比例。',
      novelty: 88,
      feasibility: 78,
      academicVerdict: '非常适合作为 VLA 评测+后训练 paper;亮点是把“能不能验证”变成后训练前置条件。',
      whyNow: '同一天出现 VLA 物理推理不可验证的 position 和多条后训练路线,正好需要一个 gate 防止盲目后训练。',
      sourceIds: ['physicalReasoningUnverifiable', 'elastic', 'z1', 'sarl', 'dailyPapers0701'],
      frontierId: 'physicalReasoningUnverifiable',
    },
    {
      title: 'Tactile Transfer Contract: 面向通用策略的跨传感器触觉接口',
      thesis: '把力觉、触觉 latent、触觉 CoT 和触觉数据 split 统一成一个 transfer contract,让不同触觉硬件训练出的策略可以在 VLA/通用策略中稳定迁移。',
      tension: 'MuSe、TactX、RCT、UniTacVLA 和 RoboTacDex 分别解决力觉融合、跨传感器 latent、数据泄漏、触觉 VLA 和人形触觉数据,但缺少统一接口说明什么触觉监督能迁移',
      motivation: '7 月 1 日触觉方向不是单点热闹,而是出现了完整链条:有限力觉怎么接入 vision-only policy,不同触觉传感器怎么共享 latent,数据集 split 怎么防泄漏,触觉如何进入 VLA,以及人形平台怎么采集视触觉动作数据。',
      contributions: [
        '提出 tactile transfer contract:包含传感器属性、接触阶段、触觉 latent、动作修正频率和数据 split 约束。',
        '定义 leakage-aware tactile benchmark,避免按物体或材质泄漏导致的虚假跨传感器泛化。',
        '给出 VLA 接入触觉的三种方式:prompt、latent token、low-frequency action correction。',
      ],
      method: [
        '用 MuSe 多阶段融合做 vision-only policy 的触觉增量训练,记录原视觉能力保持情况。',
        '用 TactX/UniTacVLA 的共享 tactile latent 和未来触觉预测作为 contract 表示,再在 RCT split 上做跨材质评测。',
        '把 RoboTacDex 的人形视触觉动作片段作为跨本体 stress test,比较单一传感器和 contract 表示。',
      ],
      evaluation: '跨传感器零样本成功率、held-out material 准确率、触觉预测误差、视觉能力遗忘、动作修正收益和不同硬件迁移成本。',
      novelty: 86,
      feasibility: 72,
      academicVerdict: '适合做触觉/VLA 接口论文;重点是防止变成传感器融合综述,必须有明确 contract 和 split。',
      whyNow: '同一天触觉数据、触觉迁移、触觉 VLA 和人形触觉操作同时出现,接口问题比单个模型更值得抓。',
      sourceIds: ['muse', 'tactx', 'rct', 'unitacVla', 'roboTacDex'],
      frontierId: 'unitacVla',
    },
    {
      title: 'Human-Present Humanoid Data Loop: 把人在场、ego-exo 视频和实验室容差变成训练闭环',
      thesis: '面向人形机器人,把人在场协作数据、ego-exo 人类视频 retarget、Unitree G1 触觉操作和实验室精密容差统一成数据闭环,让模型不仅模仿人,还知道何时需要避让、协作和满足精度。',
      tension: 'HABIT、Human-as-Humanoid、RoboTacDex 和 Labimus 分别补人在场、多视角人类视频、人形触觉操作和实验室容差,但人形数据仍缺少从 human context 到 action chunk 质量的统一评估',
      motivation: '人形数据开始从“人在视频里做动作”变成“机器人在人旁边做事”。7 月 1 日的论文把人在场、ego-exo retarget、触觉灵巧操作和实验室精密场景放在一起,说明数据闭环需要同时考虑人类上下文、动作 retarget 和任务容差。',
      contributions: [
        '提出 human-present data loop,把 collaborator/coworker/supervisor 三类人在场角色转成策略条件变量。',
        '定义 retargetability score,衡量 ego-exo 人类视频能否恢复成稳定的人形 action chunk。',
        '把实验室精密容差和触觉接触状态纳入任务进度标签,避免只模仿姿态不满足任务。',
      ],
      method: [
        '用 HABIT 的人在场 episodes 标注人类角色、距离、协作/监督状态和安全约束。',
        '用 Human-as-Humanoid 将 ego-exo 人类视频恢复为高自由度 action chunk,并用 RoboTacDex 检查触觉/语义标注可用性。',
        '在 Labimus 风格任务中用精度容差和接触结果评估 retarget 后动作是否真正完成任务。',
      ],
      evaluation: '人在场安全违规率、retargetability score、action chunk 稳定性、触觉接触质量、实验容差满足率和跨任务数据复用率。',
      novelty: 84,
      feasibility: 77,
      academicVerdict: '适合做人形数据系统论文;贡献要聚焦数据质量和 retargetability,不要只堆数据来源。',
      whyNow: '人在场数据、ego-exo 人类视频、人形触觉数据和实验室 benchmark 同日出现,人形数据闭环的变量已经齐了。',
      sourceIds: ['habit', 'humanAsHumanoid', 'roboTacDex', 'labimus', 'dailyPapers0701'],
      frontierId: 'humanAsHumanoid',
    },
  ],
  '2026-06-29': [
    {
      title: 'Factory-WAM: 从真实产线直播中学习可执行世界模型',
      thesis: '把真实工厂运行轨迹从展示素材变成 WAM/VLA critic 的训练与评测数据,预测下一步动作是否会带来任务进度、异常恢复或人工干预。',
      tension: '真实产线开始产生长时序轨迹,但 WAM 仍缺少和生产成功率绑定的训练目标',
      motivation: '智元 G2 已经把 8 台机器人放到手机产线直播验证,优必选也在建设区域化制造与二次开发平台;站内 τ0-WM、LingBot-VA 等路线说明视频-动作世界模型正在具备“预测未来 + 辅助动作选择”的技术底座。',
      contributions: [
        '提出 production event graph:把搬运、插槽、避障、换电、异常恢复拆成可学习的事件节点。',
        '把 WAM 评价目标从 RGB 保真度改成 progress / intervention / recovery 三类可执行信号。',
        '构建真实产线轨迹到 VLA 候选动作重排序的闭环协议,让世界模型服务生产成功率。',
      ],
      method: [
        '从产线视频或日志中抽取 phase、contact、object state、human intervention 与 recovery segment。',
        '训练或冻结 WAM 作为短 horizon critic,对 VLA 采样出的候选动作打 progress/risk 分。',
        '用 top-k action rerank 替代单次动作输出,比较无 critic、视觉相似度 critic 与 Factory-WAM critic。',
      ],
      evaluation: '物料搬运、插槽对位、补料/换电等任务;指标包括干预率下降、异常提前预警 AUROC、单位时间产出、真实成功率和闭环延迟。',
      novelty: 91,
      feasibility: 68,
      academicScores: {
        novelty: 8.6,
        hypothesis: 8.1,
        method: 7.8,
        evaluation: 7.4,
        feasibility: 6.7,
        differentiation: 8.2,
        paperFit: 8.2,
        riskControl: 6.8,
      },
      academicVerdict: '适合做真实部署数据驱动的 WAM paper,短板是产线轨迹可得性,先用公开或自有日志验证 progress/risk 标签。',
      whyNow: '今天的产业新闻给了少见的长时序真实工厂信号,正好可以把 WAM 从“会想象”推向“会判断是否值得执行”。',
      sourceIds: ['agibotFactory', 'ubtechTianjin', 'tau0Wm', 'lingbotVa'],
      frontierId: 'agibotFactory',
    },
    {
      title: 'Embodied-Brain ClaimBench: 给“具身大脑”融资叙事做可核评测',
      thesis: '把“通用全身具身大脑”“机器人大脑”“全栈智能体”等公司叙事转成可复现 benchmark,区分模型能力、硬件能力和场景交付能力。',
      tension: '具身大脑公司融资快速升温,但外界很难判断能力来自模型泛化、本体工程还是场景脚本',
      motivation: '智平方和源策未来今天都围绕“具身大脑/全身具身大脑”释放融资信号;这类说法如果没有统一评测协议,很容易把商业叙事和技术能力混在一起。',
      contributions: [
        '提出 embodied-brain claim taxonomy:感知、语言规划、全身控制、异常恢复、跨场景迁移、在线部署六类 claim。',
        '把每类 claim 绑定最小可验证任务,并要求区分 zero-shot、few-shot、脚本化流程和人工接管。',
        '给出融资新闻/公司白皮书到评测需求的 claim extraction 流程,为站内生态榜提供技术证据层。',
      ],
      method: [
        '收集公司公开材料中的能力句子,标注 claim 类型、证据等级和可测变量。',
        '为每类 claim 生成 2 个 tabletop + 2 个移动操作 + 1 个全身协调任务的最小协议。',
        '用同一评价表比较 VLA/WAM/全身控制系统,并单独记录人工接管和场景工程量。',
      ],
      evaluation: 'claim 可核率、跨评测者一致性、脚本依赖度、任务泛化得分、人工接管率和复现实验成本。',
      novelty: 86,
      feasibility: 82,
      academicScores: {
        novelty: 7.8,
        hypothesis: 8.4,
        method: 7.4,
        evaluation: 8.5,
        feasibility: 8.4,
        differentiation: 7.6,
        paperFit: 8,
        riskControl: 8,
      },
      academicVerdict: '适合做 benchmark / workshop paper,核心要把 claim taxonomy、证据等级和跨评审一致性做扎实。',
      whyNow: '融资事件正在把“具身大脑”推成关键词,现在补一个 ClaimBench 可以让后续公司/模型对比更不玄学。',
      sourceIds: ['zhifangFunding', 'archonFunding', 'brainRanking', 'rynnvla'],
      frontierId: 'zhifangFunding',
    },
    {
      title: 'Deployment-Calibrated VLA: 用出货与运行数据校准机器人风险预测',
      thesis: '把机器人出货量、运行小时和任务次数纳入 VLA/WAM 风险模型校准,让 demo 成功率可以外推到真实部署可靠性。',
      tension: '机器人开始披露交付和产线任务数,但论文指标仍主要停留在单次任务成功率',
      motivation: 'Faraday Future 披露 EAI 机器人月度销售/出货/交付数据,智元披露数万次产线任务;这说明行业开始出现 deployment scale signal,可以反向推动论文评测从“成功率”走向“可靠性曲线”。',
      contributions: [
        '提出 deployment-calibrated risk curve:把累计任务数、运行小时、干预事件映射到模型置信度校准。',
        '区分 demo success、batch success、uptime reliability 三层指标,避免把单次成功率误当规模部署能力。',
        '把风险校准结果反馈给数据采集策略,优先补齐高频低置信的部署失败簇。',
      ],
      method: [
        '把任务执行日志聚合为 hours-to-failure、intervention interval、task family drift 三类部署变量。',
        '训练轻量 risk head 校准 VLA/WAM 的 action confidence,输出是否需要重规划、降速或请求接管。',
        '用部署风险分数驱动 failure-to-data 队列,只补采最能改善可靠性曲线的样本。',
      ],
      evaluation: 'ECE/Brier 校准误差、干预事件召回率、单位小时故障率、成功率随任务数衰减曲线、补采样本效率。',
      novelty: 83,
      feasibility: 72,
      academicScores: {
        novelty: 8.2,
        hypothesis: 8.1,
        method: 7.7,
        evaluation: 8,
        feasibility: 7,
        differentiation: 7.9,
        paperFit: 8,
        riskControl: 7.3,
      },
      academicVerdict: '适合写 deployment reliability 方向论文,但需要尽快确认真实运行日志或可公开替代日志的可得性。',
      whyNow: '今天的出货与长时序任务披露让“规模部署可靠性”第一次有了可量化入口,可以反过来定义下一代 VLA/WAM 评测。',
      sourceIds: ['faradayShipments', 'agibotFactory', 'tau0Wm', 'rynnvla'],
      frontierId: 'faradayShipments',
    },
  ],
  '2026-06-30': [
    {
      title: 'Confidence-to-Policy: 用 VLA 自置信驱动测试时后训练',
      thesis: '把离散动作 VLA 的生成置信度、关键片段误差和部署失败片段合成一个 test-time policy improvement loop,让策略在真实环境试运行中小步自我修正。',
      tension: 'VLA 开始出现 test-time RL 与关键片段 validation,但部署场景仍缺少“何时相信模型、何时改策略”的闭环判据',
      motivation: 'T²VLA 把动作生成置信度转成内生 reward,Critical Interval MSE 和 STEAM 则把失败/关键片段从离线数据里显式挖出来;同时 BMW/Figure 与 X Square 的部署/融资信号说明真实机器人很快会产生大量短 rollout。今天最适合把“置信度”从日志指标变成后训练触发器。',
      contributions: [
        '提出 confidence-to-policy loop:把 action confidence、critical interval error、frame-level advantage 三个信号统一成测试时更新权重。',
        '给出 safety-gated update:只在高可逆、低风险、短 horizon 子任务里允许策略自举改进。',
        '建立部署数据 replay benchmark,比较无更新、离线重训、test-time RL 与 confidence-gated update。',
      ],
      method: [
        '用 T²VLA 式生成置信度构造内生 reward,但加入 critical interval mask,避免被非关键帧噪声带偏。',
        '用 STEAM 类 temporal-offset ensemble 标出停滞、失败和恢复片段,只对这些片段触发小步策略更新。',
        '在真实 UR5/移动操作或仿真重放中限制更新步数,并记录更新前后动作分布漂移。',
      ],
      evaluation: '关键片段成功率、ECE/Brier 置信校准、失败恢复率、更新后退化率、单位 rollout 改善幅度和安全拒绝率。',
      novelty: 90,
      feasibility: 74,
      academicScores: {
        novelty: 7.8,
        hypothesis: 8.9,
        method: 8.2,
        evaluation: 8.8,
        feasibility: 8.1,
        differentiation: 7.4,
        paperFit: 8.3,
        riskControl: 7.6,
      },
      academicVerdict: '短期最值得跑 pilot,但贡献必须从 T²VLA 中区分出来:安全门控、关键片段和校准置信度要成为核心机制。',
      whyNow: '今天论文队列首次把 VLA test-time RL、关键片段误差和轨迹质量估计同时推到前台,正好能形成一条可写 paper 的后训练闭环。',
      sourceIds: ['t2vla', 'criticalIntervalMse', 'steam', 'bmwFigure03', 'dailyPapers0630'],
      frontierId: 't2vla',
    },
    {
      title: 'State-Aware Action Tokens: 面向跨本体部署的动作 token 自适应解码',
      thesis: '让同一个离散动作 token 根据 robot state、接触阶段和本体差异解码为不同连续动作,把 action tokenizer 从压缩工具升级为跨机器人部署接口。',
      tension: 'SA-VLA 证明 state-aware tokenizer 有价值,ZR-0 强调跨本体表征,但两者之间还缺少面向部署的动作接口协议',
      motivation: 'SA-VLA 把 robot state 注入 VQ action tokenizer,ZR-0 用 dense ECoT 对齐跨 embodiment 表征;新闻侧 X Square 与 Striding AI 都在强调机器人基础系统/Physical AI 基座模型。一个自然的问题是:通用模型到底该输出固定动作,还是输出可由本体状态解码的动作 token?',
      contributions: [
        '提出 state-aware action token contract:token 表示意图/阶段,robot state decoder 负责本体化连续动作。',
        '把 dense ECoT 中的任务阶段、接触意图和空间关系蒸馏到 action-token decoder 的条件变量。',
        '设计跨本体消融,区分失败来自高层策略、tokenizer 压缩损失还是本体解码器。',
      ],
      method: [
        '以 SA-VLA tokenizer 为主干,加入关节状态、末端位姿、接触状态和目标物关系作为 decoder context。',
        '用 ZR-0 式 dense embodied CoT 生成阶段标签,训练时作为辅助监督,推理时只保留轻量 stage embedding。',
        '在单臂、移动操作和人形上复用同一 token sequence,只替换 state decoder 与低层控制约束。',
      ],
      evaluation: '跨本体成功率、token reuse ratio、动作平滑度、接触错误率、少量目标本体数据适配效率和 decoder-only fine-tune 增益。',
      novelty: 88,
      feasibility: 70,
      academicScores: {
        novelty: 8.9,
        hypothesis: 8.4,
        method: 8.3,
        evaluation: 7.2,
        feasibility: 6.3,
        differentiation: 8.8,
        paperFit: 8.8,
        riskControl: 6.8,
      },
      academicVerdict: '长期主论文潜力最高,但第一版要收窄成 embodiment-conditioned decoder,否则实验规模会失控。',
      whyNow: '今日 VLA 论文同时出现 action tokenizer 和跨本体 ECoT,产业侧又在讲通用机器人大脑,动作 token 接口正好是二者之间最硬的研究缝隙。',
      sourceIds: ['saVla', 'zr0', 'xSquareFunding', 'stridingFoundation', 'dailyPapers0630'],
      frontierId: 'saVla',
    },
    {
      title: 'Contact-Prompted VLA: 把触觉与事件视觉变成可迁移接触提示',
      thesis: '不重训 VLA 主干,把触觉 shear field、事件相机和接触阶段提示包装成视觉/动作 prompt,专门提升低光、遮挡和细粒度接触任务的鲁棒性。',
      tension: 'TAP-VLA 和 Event-VLA 都在补 RGB 的感知盲区,但缺少统一的 contact prompt 表示来服务真实工厂任务',
      motivation: 'TAP-VLA 用触觉 shear field 作为视觉 annotation,Event-VLA 用事件相机补低光动态信息;韩国 Humanoid Challenge 与 BMW/Figure 这类制造业场景的共同难点恰好是接触、遮挡、低光和安全接管。今天的 idea 应该把“更多传感器”收敛成一个 VLA 可消费的接触提示接口。',
      contributions: [
        '提出 contact prompt abstraction:把触觉运动场、事件流和阶段标签统一成局部接触风险图。',
        '无需改 VLA 主干,把 contact prompt 渲染进多视角 RGB 或作为 action-query routing 的辅助 token。',
        '给出接触密集任务的鲁棒性评测,区分低光、遮挡、滑移、空抓和接触过力五类失败。',
      ],
      method: [
        '从触觉图像估计 shear/motion field,从事件相机估计高速边缘变化,投影到末端/物体局部坐标。',
        '把局部 contact prompt 叠加到 RGB 或生成 compact token,接入冻结 VLA 的视觉 encoder / action query。',
        '用少量接触任务数据做 prompt adapter,和纯 RGB、触觉早融合、事件相机单独分支对照。',
      ],
      evaluation: '低光成功率、滑移检测召回、空抓率、接触力超限率、跨物体泛化和 prompt adapter 所需样本量。',
      novelty: 85,
      feasibility: 76,
      academicScores: {
        novelty: 7.4,
        hypothesis: 8.1,
        method: 7.8,
        evaluation: 8.1,
        feasibility: 6.9,
        differentiation: 6.8,
        paperFit: 7.8,
        riskControl: 7.1,
      },
      academicVerdict: '适合做鲁棒操作技术论文,需要证明 contact prompt abstraction 优于触觉/事件视觉的简单早融合。',
      whyNow: '今天 VLA 队列同时出现触觉注入和事件视觉路线,而制造业落地新闻给了明确场景压力:接触失败比语言理解更先卡住部署。',
      sourceIds: ['tapVla', 'eventVla', 'koreaHumanoidChallenge', 'bmwFigure03', 'dailyPapers0630'],
      frontierId: 'tapVla',
    },
  ],
}

const ACADEMIC_SCORE_DIMENSIONS = [
  { key: 'novelty', label: '新颖性', short: '新颖' },
  { key: 'hypothesis', label: '假设清晰度', short: '假设' },
  { key: 'method', label: '方法深度', short: '方法' },
  { key: 'evaluation', label: '评测闭环', short: '评测' },
  { key: 'feasibility', label: '实验可行性', short: '可行' },
  { key: 'differentiation', label: '近期工作区分度', short: '区分' },
  { key: 'paperFit', label: '投稿潜力', short: '投稿' },
  { key: 'riskControl', label: '风险可控性', short: '风险' },
]

const ACADEMIC_CARD_KEYS = ['novelty', 'method', 'evaluation', 'feasibility']

const TAG_RULES = [
  { tag: 'WLA', terms: ['wla', 'world-language-action', 'world language action', '世界-语言-动作'] },
  { tag: 'VLA', terms: ['vla', '视觉-语言-动作', 'vision-language-action', 'openvla', 'qwen-vla', 'π0', 'pi0'] },
  { tag: 'WAM', terms: ['wam', '世界模型', 'world model', 'world-action', 'world action', 'future visual'] },
  { tag: 'DATA', terms: ['数据', 'dataset', 'data', '合成', '筛选', '标注', '伪标签', '采集', 'scaling', 'rlds', 'lerobot'] },
  { tag: 'EVAL', terms: ['评测', 'benchmark', '基准', '成功率', '自评', '复现', 'roboarena'] },
  { tag: 'CONTROL', terms: ['动作', '控制', 'action', 'trajectory', 'waypoint', 'delta', '跨本体', '运控'] },
  { tag: 'DEPLOY', terms: ['部署', '推理', '量化', '实时', 'latency', 'online', 'post-training'] },
  { tag: 'NEWS', terms: ['新闻', '融资', '发布', '产品', '公司', '产业'] },
]

const STOP = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'what', 'how', 'why', 'are', 'was', 'were',
  '一个', '哪些', '如何', '什么', '主要', '以及', '还是', '之间', '是否', '可以', '进行', '研究',
])

const dailyClock = ref(Date.now())
const mode = ref('quick')
const corpus = ref([])
const loading = ref(true)
const loadError = ref('')
const result = ref(null)
const lastRunAt = ref('')
const corpusSource = ref('')
const dailyPaperArchive = ref({})
const selectedIdeaId = ref('')
const selectedIdeaDate = ref(localDateKey(new Date()))
let timer = 0

const currentDateKey = computed(() => localDateKey(new Date(dailyClock.value)))

const selectedDailyPapers = computed(() => dailyPaperArchive.value[selectedIdeaDate.value]?.papers || [])

const ideaHistoryOptions = computed(() => {
  const keys = new Set([...Object.keys(dailyPaperArchive.value), ...Object.keys(DAILY_IDEA_PACKS)])
  return [...keys]
    .sort((a, b) => b.localeCompare(a))
    .map((key) => ({
      key,
      label: formatIdeaDateLabel(key),
      archived: key !== currentDateKey.value,
    }))
})

const today = computed(() => dateFromKey(selectedIdeaDate.value || currentDateKey.value))

const todayKey = computed(() => today.value.toLocaleDateString('zh-CN', {
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
}))

const dailyDirection = computed(() => {
  if (selectedDailyPapers.value.length) {
    const tracks = [...new Set(selectedDailyPapers.value.map(paper => paper.track).filter(Boolean))]
    return {
      id: 'daily',
      label: '当日论文交叉',
      scope: 'latest',
      focus: `基于该日 ${selectedDailyPapers.value.length} 篇论文，交叉 ${tracks.join(' / ')} 信号生成独立 Ideas。`,
      seed: `结合 ${selectedIdeaDate.value} 论文雷达中的 ${tracks.join('、')} 证据生成当日专属 paper ideas。`,
    }
  }
  const date = today.value
  const dayIndex = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000)
  return DAILY_DIRECTIONS[Math.abs(dayIndex) % DAILY_DIRECTIONS.length]
})

const dailySeed = computed(() => `${todayKey.value} · ${dailyDirection.value.seed}`)

const selectedIdea = computed(() => {
  if (!selectedIdeaId.value || !result.value?.ideas?.length) return null
  return result.value.ideas.find((idea) => idea.id === selectedIdeaId.value) || null
})

const selectedIdeaIndex = computed(() => {
  if (!selectedIdea.value || !result.value?.ideas?.length) return -1
  return result.value.ideas.findIndex((idea) => idea.id === selectedIdea.value.id)
})

const corpusStats = computed(() => {
  const stats = { all: corpus.value.length, vla: 0, wam: 0, data: 0, latest: 0, news: 0, ecosystem: 0 }
  for (const doc of corpus.value) {
    if (doc.bucket in stats) stats[doc.bucket] += 1
    if (doc.tags.includes('DATA')) stats.data += 1
  }
  return stats
})

function cleanText(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+]\(([^)]+)\)/g, (m) => m.replace(/\(([^)]+)\)/, ''))
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  const lower = String(text || '').toLowerCase()
  const out = []
  const latin = lower.match(/[a-z0-9][a-z0-9+._/-]{1,}/g) || []
  for (const t of latin) {
    if (!STOP.has(t) && t.length > 1) out.push(t)
  }
  const han = lower.match(/[\u4e00-\u9fff]{2,}/g) || []
  for (const seq of han) {
    if (!STOP.has(seq)) out.push(seq)
    if (seq.length > 2) {
      for (let i = 0; i < seq.length - 1; i++) out.push(seq.slice(i, i + 2))
    }
  }
  return [...new Set(out)].slice(0, 80)
}

function bucketFromUrl(url) {
  if (url.includes('/papers/latest')) return 'latest'
  if (url.includes('/news/')) return 'news'
  if (url.includes('/ecosystem/')) return 'ecosystem'
  if (url.includes('/wam/')) return 'wam'
  if (url.includes('/vla/')) return 'vla'
  return 'all'
}

function inferTags(title, text, bucket) {
  const hay = `${title} ${text}`.toLowerCase()
  const tags = new Set()
  if (bucket === 'vla') tags.add('VLA')
  if (bucket === 'wam') tags.add('WAM')
  if (bucket === 'latest') tags.add('LATEST')
  if (bucket === 'news') tags.add('NEWS')
  for (const rule of TAG_RULES) {
    if (rule.terms.some((term) => hay.includes(term.toLowerCase()))) tags.add(rule.tag)
  }
  return [...tags].slice(0, 5)
}

function parseCorpus(raw) {
  return raw
    .split(/\n\n---\n\n/g)
    .map((block, index) => {
      const title = block.match(/^#\s+(.+)$/m)?.[1]?.trim()
      const url = block.match(/^来源:\s*(.+)$/m)?.[1]?.trim()
      if (!title || !url) return null
      const text = cleanText(block.replace(/^#\s+.+$/m, '').replace(/^来源:\s*.+$/m, ''))
      const bucket = bucketFromUrl(url)
      const tags = inferTags(title, text, bucket)
      return { id: `${index}-${title}`, title, url, text, bucket, tags, tokens: tokenize(`${title} ${text}`) }
    })
    .filter(Boolean)
}

function titleFromMarkdown(raw, rel) {
  const fmBlock = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fmBlock) {
    const title = fmBlock[1].match(/^title:\s*(.+)$/m)
    if (title) return title[1].trim().replace(/^["']|["']$/g, '')
  }
  const h1 = raw.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return rel === 'index.md' ? '具身星图' : rel.replace(/\.md$/, '')
}

function stripMarkdown(raw) {
  return raw
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/```mermaid[\s\S]*?```/g, '[流程图,详见网页]')
    .replace(/<div[\s\S]*?<\/div>/g, '')
    .trim()
}

function routeFromRel(rel) {
  const route = rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  return withBase(`/${route}`)
}

async function loadMarkdownFallback() {
  const docs = []
  for (const [file, load] of Object.entries(MARKDOWN_MODULES)) {
    const rel = file.replace(/^(\.\.\/){3}/, '')
    if (!rel || rel === '404.md' || rel.startsWith('.vitepress/')) continue
    const raw = await load()
    docs.push({
      title: titleFromMarkdown(raw, rel),
      url: routeFromRel(rel),
      text: stripMarkdown(raw).slice(0, 4000),
    })
  }
  return normalizeDocs(docs)
}

function normalizeDocs(docs) {
  return docs
    .map((doc, index) => {
      const title = doc.title?.trim()
      const url = doc.url?.trim()
      if (!title || !url) return null
      const text = cleanText(doc.text || '')
      const bucket = bucketFromUrl(url)
      const tags = inferTags(title, text, bucket)
      return { id: `${index}-${title}`, title, url, text, bucket, tags, tokens: tokenize(`${title} ${text}`) }
    })
    .filter(Boolean)
}

function scopeMatch(doc) {
  const currentScope = dailyDirection.value.scope
  if (currentScope === 'all') return true
  if (currentScope === 'data') return doc.tags.includes('DATA')
  if (currentScope === 'latest') return doc.bucket === 'latest' || doc.tags.includes('LATEST') || doc.title.includes('每日最新论文')
  return doc.bucket === currentScope
}

function scoreDoc(doc, qTokens) {
  const title = doc.title.toLowerCase()
  const text = doc.text.toLowerCase()
  let score = 0
  for (const t of qTokens) {
    if (title.includes(t)) score += 16
    const first = text.indexOf(t)
    if (first >= 0) score += 5 + Math.max(0, 5 - Math.floor(first / 900))
    if (doc.tokens.includes(t)) score += 2
  }
  if (qTokens.some((t) => ['数据', 'dataset', 'data', '合成', '筛选', '标注'].includes(t)) && doc.tags.includes('DATA')) score += 10
  if (qTokens.some((t) => ['world', '世界', 'wam', '想象', '未来'].includes(t)) && doc.tags.includes('WAM')) score += 8
  if (qTokens.some((t) => ['vla', '动作', 'action', '控制'].includes(t)) && doc.tags.includes('VLA')) score += 8
  if (doc.bucket === 'latest' || doc.tags.includes('LATEST')) score += 16
  if (/(2026-06-25|P0|P1|每日最新论文|PAPER RADAR)/i.test(`${doc.title} ${doc.text}`)) score += 6
  return score
}

function splitSentences(text) {
  return cleanText(text)
    .split(/(?<=[。！？.!?])\s+|\s{2,}|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 18 && s.length <= 220)
}

function snippetFor(doc, qTokens) {
  const scored = splitSentences(doc.text).map((sentence) => {
    const lower = sentence.toLowerCase()
    let score = 0
    for (const t of qTokens) if (lower.includes(t)) score += 1
    for (const tag of doc.tags) if (lower.includes(tag.toLowerCase())) score += 0.5
    return { sentence, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return (scored.find((s) => s.score > 0)?.sentence || scored[0]?.sentence || doc.text.slice(0, 160)).trim()
}

function dedupeSentences(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const key = item.text.replace(/[，。,.!！?？\s]/g, '').slice(0, 28)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

function buildFocus(topDocs) {
  const counts = new Map()
  for (const doc of topDocs) for (const tag of doc.tags) counts.set(tag, (counts.get(tag) || 0) + 1)
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([tag]) => tag)
}

function compactTitle(title) {
  return title
    .replace(/\s*细读[:：].*$/u, '')
    .replace(/\s*深度调研.*$/u, '')
    .replace(/\s*全景.*$/u, '全景')
    .trim()
}

function pickEvidence(evidence, tags, fallbackCount = 3) {
  const tagged = evidence.filter((doc) => tags.some((tag) => doc.tags.includes(tag) || doc.bucket === tag.toLowerCase()))
  return (tagged.length ? tagged : evidence).slice(0, fallbackCount)
}

function buildFrontierMatches(qTokens, focus) {
  return FRONTIER_SIGNALS
    .map((signal) => {
      const hay = `${signal.title} ${signal.signal} ${signal.ideaHook}`.toLowerCase()
      let score = 0
      for (const tag of signal.tags) if (focus.includes(tag)) score += 12
      for (const token of qTokens) if (hay.includes(token)) score += 5
      if (signal.tags.includes('DATA') && focus.includes('LATEST')) score += 4
      return { ...signal, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
}

function buildTensions(focus, evidence, frontiers) {
  const tensions = []
  if (focus.includes('DATA') || evidence.some((doc) => doc.tags.includes('DATA'))) {
    tensions.push({
      title: '数据闭环缺少触发器',
      problem: '站内材料已经覆盖采集、清洗、筛选和后训练,最新 physical data engine 方向也在强调失败回流,但还缺少“失败样本何时触发补采/合成/重标注”的可执行判据。',
      researchMove: '把失败类型、动作接口和数据操作绑定成一个 closed-loop data scheduler,让数据增长从规模叙事变成可检验机制。',
      sources: pickEvidence(evidence, ['DATA', 'VLA'], 2),
    })
  }
  if (focus.includes('WAM') || focus.includes('WLA') || frontiers.some((item) => item.tags.includes('WAM'))) {
    tensions.push({
      title: 'WAM 生成质量和策略成功率之间缺桥',
      problem: 'WLA / WAM 新工作把未来状态、语言和动作放进统一模型,但“想象得像”如何变成“执行得稳”仍没有统一协议。',
      researchMove: '设计一个 WAM/WLA-as-critic 协议,比较视觉一致性、任务进度估计和真实执行成功率。',
      sources: pickEvidence(evidence, ['WAM', 'EVAL'], 2),
    })
  }
  if (focus.includes('CONTROL')) {
    tensions.push({
      title: '跨本体动作表示仍是接口瓶颈',
      problem: 'EEF delta、waypoint、joint action、action prior 各自有效,但跨机器人迁移时缺统一中间层。',
      researchMove: '做一个 action-interface ablation,把同一任务拆成 token / delta / waypoint / prior 四种接口对照。',
      sources: pickEvidence(evidence, ['CONTROL', 'VLA'], 2),
    })
  }
  if (focus.includes('EVAL')) {
    tensions.push({
      title: '自评指标和可复现实验需要分层',
      problem: '每日论文队列里有大量 P0/P1 与已细读状态,但作者自评、厂商口径和第三方榜单容易混在一起。',
      researchMove: '把 evidence trust level 纳入 idea 筛选和实验表格,单独评估“指标可信度”对结论排序的影响。',
      sources: pickEvidence(evidence, ['EVAL', 'NEWS'], 2),
    })
  }
  if (!tensions.length) {
    tensions.push({
      title: '主题仍需收窄',
      problem: '当前 seed 覆盖太宽,先把对象限定到模型范式、数据流程、评测协议或部署约束之一。',
      researchMove: '从证据最多的两个标签开始做 pairwise contrast。',
      sources: evidence.slice(0, 2),
    })
  }
  return tensions.slice(0, 4)
}

function sourceTitles(docs) {
  return docs.map((doc) => compactTitle(doc.title)).filter(Boolean).slice(0, 3).join(' / ')
}

function localDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dateFromKey(key) {
  const match = String(key || '').match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return new Date()
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

function formatIdeaDateLabel(key) {
  const date = dateFromKey(key)
  const label = date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })
  if (key === localDateKey(new Date())) return `${label} · 今日`
  return `${label} · 已生成`
}

function dailySource(id) {
  const source = DAILY_SOURCE_POOL[id]
  if (!source) return null
  return {
    ...source,
    id,
    text: source.title,
    tokens: tokenize(source.title),
  }
}

const DAILY_META_LABELS = {
  'ACTION-ONLY INFERENCE': '低延迟动作解码',
  'MOBILE MANIPULATION': '开放世界移动操作',
  'OPEN WORLD': '开放世界泛化',
  'REPRESENTATION ANCHORING': '表征锚定',
  'LANGUAGE-ACTION ALIGNMENT': '语言—动作对齐',
  'SEMANTIC MANIFOLD': '语义流形保持',
  'OOD GENERALIZATION': '分布外泛化',
  'DATA SYNTHESIS': '合成数据引擎',
  'DATA COLLECTION': '自主数据采集',
  'ONE DEMO': '单示范扩展',
  'LANGUAGE CORRECTION': '语言纠错',
  'CORRECTIVE MEMORY': '纠错记忆',
  'FAILURE RECOVERY': '失败恢复',
  'AGENTIC RL': '智能体强化学习',
  'INDUSTRIAL BENCHMARK': '工业灵巧评测',
  'MULTIMODAL POLICY': '多模态控制',
  'PROPRIOCEPTION': '本体感知',
  'ACTIVE SENSING': '主动感知',
  'LONG HORIZON': '长程任务',
  'STAGE INTERFACE': '阶段信息接口',
}

function normalizeDailyPaperDays(days) {
  const archive = {}
  for (const day of Array.isArray(days) ? days : []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day?.date || '') || !Array.isArray(day.papers)) continue
    const papers = day.papers
      .filter(paper => paper?.title && paper?.url)
      .map((paper, index) => ({
        ...paper,
        id: `daily-${day.date}-${index}`,
        bucket: 'latest',
        tags: [...new Set(['LATEST', paper.track, ...(paper.meta || [])
          .filter(tag => !['P0', 'P1', 'WATCH', '待细读', '观察', '已细读', 'EDITOR PICK'].includes(tag))])].slice(0, 7),
        text: paper.summary || paper.title,
        tokens: tokenize(`${paper.title} ${paper.summary || ''} ${(paper.meta || []).join(' ')}`),
      }))
    if (papers.length) archive[day.date] = { date: day.date, note: day.note || '', papers }
  }
  return archive
}

function shortPaperName(paper) {
  const value = String(paper?.title || '').trim()
  const summaryName = String(paper?.summary || '').match(/^([A-Z][A-Za-z0-9²._-]{1,20})\s/)?.[1]
  if (summaryName) return summaryName
  const named = value.match(/^([^:：]{2,42})[:：]/)?.[1]
  if (named) return named.trim()
  return value.split(/\s+/).slice(0, 5).join(' ')
}

function paperAngle(paper) {
  const ignored = new Set(['VLA', 'WAM', 'DATA', 'HUMANOID', 'EMBODIED', 'AUTORESEARCH', 'EDITOR PICK', 'P0', 'P1', 'WATCH'])
  const tag = (paper.meta || []).find(item => item && !ignored.has(item) && !/待细读|观察|已细读/.test(item))
  return DAILY_META_LABELS[tag] || (tag ? tag.toLowerCase().replaceAll('-', ' ') : `${paper.track || '具身'}机制`)
}

function dailyEvidenceIdeas(seed, tensions) {
  const papers = selectedDailyPapers.value
  if (!papers.length) return null
  const ranked = [...papers].sort((a, b) => ({ P0: 0, P1: 1, WATCH: 2 }[a.priority] ?? 3) - ({ P0: 0, P1: 1, WATCH: 2 }[b.priority] ?? 3))
  const pick = (index) => ranked[index % ranked.length]
  const pairings = ranked.length === 1
    ? [[pick(0), pick(0)], [pick(0), pick(0)], [pick(0), pick(0)]]
    : [[pick(0), pick(1)], [pick(2), pick(3)], [pick(4), pick(5)]]
  const anchor = `${selectedIdeaDate.value} 当日论文雷达 · ${papers.length} 篇独立证据`

  return pairings.map(([left, right], index) => {
    const leftName = shortPaperName(left)
    const rightName = shortPaperName(right)
    const leftAngle = paperAngle(left)
    const rightAngle = paperAngle(right)
    const extra = pick(index + 6)
    const sources = [...new Map([left, right, extra].map(source => [source.url, source])).values()]
    const common = {
      id: `idea-${index}`,
      anchor,
      seed,
      sources,
      frontier: left,
      tension: tensions[index % Math.max(tensions.length, 1)]?.title || `${left.track} × ${right.track} 的证据张力`,
    }

    if (index === 0) {
      return attachAcademicReview({
        ...common,
        title: `${leftName} × ${rightName}: ${leftAngle}到${rightAngle}的闭环`,
        thesis: `把「${leftName}」的${leftAngle}机制接入「${rightName}」的${rightAngle}任务，检验两者联合是否比独立模块更能提升真实执行。`,
        motivation: `该日论文同时给出两条互补信号：${left.summary}；${right.summary}。值得研究的不是简单拼装，而是前一机制能否成为后一系统中可测、可消融的因果变量。`,
        contributions: [
          `提出 ${leftAngle} → ${rightAngle} 的显式接口与训练目标。`,
          `在同一任务和数据预算下分离「仅 ${leftName}」「仅 ${rightName}」与联合方案的边际贡献。`,
          '建立从离线代理指标到真实成功率、延迟和失败类型的闭环验证。',
        ],
        method: [
          `复现「${leftName}」的核心表示或训练信号，并输出可插拔中间变量。`,
          `把该变量接入「${rightName}」的策略、数据或评测链路，保持其余训练条件一致。`,
          '加入接口移除、随机替换和错误置信度三组消融，确认增益来自有效机制而非额外参数。',
        ],
        evaluation: '报告 ID/OOD 成功率、真实执行增益、推理延迟、样本效率和按失败类型拆分的改善，并检验离线代理分数与真机结果的相关性。',
        novelty: 88,
        feasibility: 73,
        whyNow: `${selectedIdeaDate.value} 的论文雷达首次把「${leftName}」与「${rightName}」放进同一证据窗口，适合立即验证二者之间的接口假设。`,
      })
    }

    if (index === 1) {
      return attachAcademicReview({
        ...common,
        title: `${leftName} Stress Test: 用 ${rightName} 检验${leftAngle}的迁移边界`,
        thesis: `把「${leftName}」从原始设置迁移到「${rightName}」覆盖的${rightAngle}条件，寻找其真正有效、失效和需要重新标定的边界。`,
        motivation: `「${leftName}」与「${rightName}」分别代表${leftAngle}和${rightAngle}。两者在同日出现，提供了一个比继续刷平均分更有价值的问题：前者的机制在后一类分布变化下是否仍成立。`,
        contributions: [
          `构建面向${rightAngle}的 ${leftName} 压力测试矩阵。`,
          '把性能下降归因到感知、表示、动作接口、数据覆盖或恢复策略，而非只报告总成功率。',
          '给出最小修复模块，并验证它不会损害原始任务表现。',
        ],
        method: [
          `抽取「${rightName}」中的环境、任务或数据变化变量，逐级注入「${leftName}」基线。`,
          '记录每一级扰动下的表征漂移、策略置信度、动作错误与恢复行为。',
          '只针对最主要失效变量增加轻量适配器，再与全量微调和数据扩增对照。',
        ],
        evaluation: '绘制扰动强度—成功率曲线，报告最坏组表现、校准误差、失败恢复率、适配样本量及原始能力遗忘。',
        novelty: 84,
        feasibility: 80,
        whyNow: `当日的「${rightName}」为「${leftName}」提供了新的可复现外部分布，能够把“泛化”从口号变成分层压力测试。`,
      })
    }

    return attachAcademicReview({
      ...common,
      title: `${leftName} / ${rightName} Protocol: 统一${leftAngle}与${rightAngle}的证据口径`,
      thesis: `围绕「${leftName}」和「${rightName}」建立统一评测协议，让${leftAngle}与${rightAngle}的改进能在同一变量、预算和失败分类下比较。`,
      motivation: `两项工作使用不同系统边界和指标，直接比较容易把模型、数据、硬件或评测差异误当成方法增益。该日最稳妥的第三个 Idea 是先统一证据口径。`,
      contributions: [
        `提出覆盖${leftAngle}和${rightAngle}的 claim—variable—metric 表。`,
        '固定数据、计算、示范和真机次数预算，区分模型增益与资源增益。',
        '发布失败分类与最小复现实验清单，使后续每日候选可以持续接入。',
      ],
      method: [
        `从「${leftName}」和「${rightName}」抽取核心 claim、输入输出与评测假设。`,
        '将每个 claim 映射到一个可反证变量、一个主指标和至少一个负对照。',
        '在共享任务子集上复现并做成统一报告模板，单独标记作者自评与第三方复核结果。',
      ],
      evaluation: '比较复现一致性、指标排序稳定性、资源归一化后的增益、失败覆盖率和跨评测者一致性。',
      novelty: 79,
      feasibility: 86,
      whyNow: `「${leftName}」与「${rightName}」在同一天进入候选池，正适合在结论固化前建立共享评测口径。`,
    })
  })
}

function roundAcademicScore(value) {
  return Math.round(value * 10) / 10
}

function clampAcademicScore(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 7
  const normalized = numeric > 10 ? numeric / 10 : numeric
  return roundAcademicScore(Math.max(0, Math.min(10, normalized)))
}

function defaultAcademicScores(idea) {
  const novelty = clampAcademicScore(idea.novelty)
  const feasibility = clampAcademicScore(idea.feasibility)
  const methodCount = Array.isArray(idea.method) ? idea.method.length : 0
  const contributionCount = Array.isArray(idea.contributions) ? idea.contributions.length : 0
  const sourceCount = Array.isArray(idea.sources) ? idea.sources.length : Array.isArray(idea.sourceIds) ? idea.sourceIds.length : 0
  const hypothesis = clampAcademicScore((idea.thesis || '').length > 48 ? 8 : 6.8)
  const method = clampAcademicScore(6.2 + Math.min(methodCount, 3) * 0.55 + Math.min(contributionCount, 3) * 0.22)
  const evaluation = clampAcademicScore((idea.evaluation || '').length > 42 ? 7.8 : 6.6)
  const differentiation = clampAcademicScore((novelty * 0.72) + Math.min(sourceCount, 4) * 0.28)
  const paperFit = clampAcademicScore((novelty * 0.34) + (hypothesis * 0.16) + (method * 0.2) + (evaluation * 0.2) + (differentiation * 0.1))
  const riskControl = clampAcademicScore((feasibility * 0.56) + (evaluation * 0.24) + 1.4)

  return {
    novelty,
    hypothesis,
    method,
    evaluation,
    feasibility,
    differentiation,
    paperFit,
    riskControl,
  }
}

function normalizeAcademicScores(idea) {
  const base = defaultAcademicScores(idea)
  const manual = idea.academicScores || {}
  return Object.fromEntries(ACADEMIC_SCORE_DIMENSIONS.map((item) => [
    item.key,
    clampAcademicScore(manual[item.key] ?? base[item.key]),
  ]))
}

function academicTierFromScore(score) {
  if (score >= 8.4) return '主论文候选'
  if (score >= 7.8) return '强 pilot 候选'
  if (score >= 7.2) return '可收窄推进'
  return '备选探索'
}

function academicVerdictFor(idea, score) {
  if (score >= 8.4) return '值得优先写一页 proposal,下一步重点压实最近工作对比和主实验闭环。'
  if ((idea.academicScores?.feasibility ?? idea.feasibility / 10) < 6.8) return '研究问题有潜力,但需要先做最小可行实验确认数据、平台或传感器条件。'
  if (score >= 7.8) return '适合进入 1-2 周 pilot,先证明核心假设,再扩展成完整方法。'
  return '更适合作为备选方向,先继续补近邻论文和反例,避免贡献停留在系统拼装。'
}

function attachAcademicReview(idea) {
  const academicScores = normalizeAcademicScores(idea)
  const academicScoreItems = ACADEMIC_SCORE_DIMENSIONS.map((item) => ({
    ...item,
    value: academicScores[item.key],
  }))
  const academicScore = roundAcademicScore(academicScoreItems.reduce((sum, item) => sum + item.value, 0) / academicScoreItems.length)
  const academicTier = idea.academicTier || academicTierFromScore(academicScore)
  return {
    ...idea,
    academicScores,
    academicScoreItems,
    academicCardScores: academicScoreItems.filter((item) => ACADEMIC_CARD_KEYS.includes(item.key)),
    academicScore,
    academicTier,
    academicVerdict: idea.academicVerdict || academicVerdictFor(idea, academicScore),
  }
}

function buildDailyPaperIdeas(seed, tensions) {
  const dateKey = localDateKey(today.value)
  const pack = DAILY_IDEA_PACKS[dateKey]
  if (!pack?.length) return dailyEvidenceIdeas(seed, tensions)
  const anchor = DAILY_IDEA_ANCHORS[dateKey] || `${dateKey} 当日站内语料 × 最新研究信号`
  return pack.map((item, index) => {
    const sources = item.sourceIds.map(dailySource).filter(Boolean)
    return attachAcademicReview({
      ...item,
      id: `idea-${index}`,
      anchor,
      seed,
      sources,
      frontier: dailySource(item.frontierId) || sources[0] || null,
      tension: item.tension || tensions[index % tensions.length]?.title || '当日证据张力',
    })
  })
}

function buildPaperIdeas(seed, focus, evidence, tensions, frontiers) {
  const dailyIdeas = buildDailyPaperIdeas(seed, tensions)
  if (dailyIdeas) return dailyIdeas

  const ideas = []
  const first = compactTitle(evidence[0]?.title || '站内核心证据')
  const second = compactTitle(evidence[1]?.title || '对照证据')
  const latestSources = pickEvidence(evidence, ['LATEST', 'DATA', 'VLA', 'WAM'], 4)
  const frontierByTag = (tag) => frontiers.find((item) => item.tags.includes(tag)) || frontiers[0]

  if (focus.includes('DATA') || focus.includes('VLA')) {
    ideas.push({
      title: 'Failure-to-Data: 面向 VLA 后训练的失败驱动数据引擎',
      thesis: '把 VLA 后训练从“继续收更多数据”改成“由失败类型自动决定补采、合成、过滤或重标注”。',
      motivation: `站内 ${sourceTitles(latestSources)} 已经把数据采集、处理、筛选和后训练放到同一问题链上;最新 physical data engine 方向进一步说明,真正的瓶颈不是数据量本身,而是失败能不能变成下一轮可训练监督。`,
      contributions: [
        '提出 failure primitive -> data action 的结构化映射,把失败样本分成补采、合成、过滤、重标注和奖励修正五类处理动作。',
        '给出一个不依赖外部大模型 API 的离线数据调度器,直接从站内论文里的动作接口、接触状态和任务进度变量抽取规则。',
        '建立同等数据预算下的 VLA 后训练评测协议,衡量“每新增 1% 成功率需要多少新样本”。',
      ],
      method: [
        '从失败 rollout 中解析 primitive、action-interface mismatch、接触状态错误和物体状态错误。',
        '用规则 + 轻量 embedding 检索决定 recollect / simulate / relabel / filter / reward-fix。',
        '对同一基座 VLA 跑 uniform replay、hard mining 和 failure-to-data scheduler 三组后训练。',
      ],
      evaluation: '2-3 个桌面操作任务;指标包括成功率、失败复现率、样本效率、错误标签修复率和新增数据成本。',
      novelty: focus.includes('DATA') ? 86 : 74,
      feasibility: 78,
      whyNow: frontierByTag('DATA')?.ideaHook || '最新数据引擎方向正在把失败反馈、自动标注和部署回流连成闭环。',
      frontier: frontierByTag('DATA'),
      sources: pickEvidence(evidence, ['DATA', 'VLA', 'CONTROL'], 3),
    })
  }

  if (focus.includes('WAM') || focus.includes('WLA') || focus.includes('EVAL') || frontiers.some((item) => item.tags.includes('WAM'))) {
    ideas.push({
      title: 'WLA Critic: 用世界-语言-动作模型给 VLA 候选动作打分',
      thesis: '把 WAM/WLA 从“生成未来状态”推进到“给 VLA 候选动作做执行前风险评估”。',
      motivation: `最新 WLA 与 DreamZero 式 WAM 都在把未来状态和动作联合建模;站内 ${sourceTitles(pickEvidence(evidence, ['WAM', 'VLA'], 3))} 则显示,真实瓶颈是这些预测信号如何服务闭环控制。`,
      contributions: [
        '提出 WLA-as-critic 接口:输入 VLA 的 K 个候选动作,输出任务进度、物理一致性和失败风险三类分数。',
        '把世界模型 rollout 评价从视觉保真度扩展为“是否值得执行”的策略选择问题。',
        '给出 WAM/WLA 分数与真实执行成功率之间的相关性基准,区分会想象和会控制。',
      ],
      method: [
        '用 VLA 采样 K 条短 horizon action plan,并保留语言目标、当前图像和动作接口。',
        '用 WAM/WLA 预测未来状态或 latent transition,提取 progress、contact consistency、collision/risk score。',
        '执行 top-1 / top-k rerank 后的动作,与无 critic、语言置信度 critic、value-only critic 对照。',
      ],
      evaluation: 'AUROC、失败提前预警率、误杀可执行动作比例、真实成功率提升和闭环延迟。',
      novelty: focus.includes('WAM') ? 88 : 76,
      feasibility: 70,
      whyNow: frontierByTag('WAM')?.ideaHook || 'WAM/WLA 最新工作正在把世界预测和动作生成合并,正好需要一个 grounding protocol。',
      frontier: frontierByTag('WAM') || frontierByTag('WLA'),
      sources: pickEvidence(evidence, ['WAM', 'EVAL', 'VLA'], 3),
    })
  }

  if (focus.includes('CONTROL') || focus.includes('VLA')) {
    ideas.push({
      title: 'Action Interface Router: 跨机器人本体的动作表示自适应选择',
      thesis: '让模型在 token、EEF delta、waypoint 和 action prior 之间自动选择动作接口,而不是为所有任务固定一种控制表示。',
      motivation: `站内动作先验、trajectory、waypoint 与运控页面已经说明动作接口会决定迁移上限;最新 WLA/WAM 趋势把 action head 做进统一模型后,更需要解释“什么任务该用什么动作表示”。`,
      contributions: [
        '提出 task geometry / contact phase / embodiment gap 三维条件下的动作接口选择问题。',
        '构建一个轻量 router,按任务阶段选择 token、delta、waypoint 或 learned prior head。',
        '给出跨本体消融:同一 demonstration 下只替换动作接口,评估迁移失败来自模型还是接口。',
      ],
      method: [
        '从站内论文抽取动作接口变量表:动作维度、时间粒度、接触敏感性、是否依赖本体标定。',
        '训练 router 预测接口类型,每个接口接一个小 action head,共享 VLA/WLA 表征。',
        '用少量目标本体数据适配,比较固定接口、多头平均和 router 选择。',
      ],
      evaluation: '跨本体成功率、样本效率、动作平滑度、接触状态错误率和控制频率。',
      novelty: focus.includes('CONTROL') ? 84 : 73,
      feasibility: 74,
      whyNow: frontierByTag('CONTROL')?.ideaHook || '跨本体迁移进入 WLA/WAM 主线后,动作接口本身变成可研究对象。',
      frontier: frontierByTag('CONTROL'),
      sources: pickEvidence(evidence, ['CONTROL', 'VLA', 'DATA'], 3),
    })
  }

  if (ideas.length < 3 || focus.includes('LATEST') || focus.includes('EVAL')) {
    ideas.push({
      title: 'Trust-Aware Paper Radar: 面向具身 AI 的可信 idea 筛选器',
      thesis: '把每日最新论文从“收录列表”升级为“可投稿 idea 的可信度排序器”。',
      motivation: `站内每日论文队列已经区分 P0/P1、已细读、待细读和观察;但最新论文越多,越需要把作者自评、厂商口径和第三方验证拆开,否则 idea 很容易被高调指标带偏。`,
      contributions: [
        '提出 evidence trust level: arXiv 一手、作者自评、厂商新闻、第三方榜单、站内细读五类证据分层。',
        '把 trust level 引入 idea 排序,输出 novelty、feasibility、verification cost 三个分数。',
        '给出 VLA/WAM/DATA 三轨每日论文的 idea mining benchmark。',
      ],
      method: [
        '解析站内每日论文页和细读页中的 ⚠️/✅/待核、P0/P1、arXiv 与代码链接。',
        '为每个候选 idea 绑定 supporting / contradicting / missing evidence 三类证据。',
        '比较原始热度排序、关键词排序和可信度加权排序对最终研究方向的影响。',
      ],
      evaluation: '人工专家打分一致性、后续细读转化率、不可验证 claim 占比、idea novelty/feasibility 排名稳定性。',
      novelty: 68,
      feasibility: 90,
      whyNow: '每日论文队列已经落盘,具备从“记录最新”走向“筛出可写 paper”所需的本地语料。',
      frontier: frontiers.find((item) => item.tags.includes('EVAL')) || frontiers[0],
      sources: pickEvidence(evidence, ['LATEST', 'EVAL', 'NEWS', 'VLA', 'WAM'], 3),
    })
  }

  if (ideas.length < 3) {
    ideas.push({
      title: 'Evidence-to-Benchmark: 从站内细读自动生成最小评测协议',
      thesis: '把站内论文细读里的 claim、失败模式和待核标记转成可复现实验清单,让 idea 从第一天就带验证路径。',
      motivation: `当前 seed 下站内证据更像材料池而非单一技术路线;这正适合做一个把 ${first} 与 ${second} 转成最小 benchmark 的方法论文。`,
      contributions: [
        '提出 claim -> variable -> metric 的抽取模板,把论文细读里的自然语言结论转成实验变量。',
        '把 ⚠️/✅/待核 显式纳入 benchmark design,避免把不可核声明混入主指标。',
        '输出每个研究方向的最小可证伪实验,降低从读论文到做实验的启动成本。',
      ],
      method: [
        '从站内页面抽取 claim、baseline、数据来源、动作接口、评测环境和失败模式。',
        '用规则把 claim 映射到变量表与 ablation 表,并要求每个变量能被复现或反证。',
        '对 VLA/WAM/DATA 三类页面分别生成 toy protocol,人工检查覆盖率和可执行性。',
      ],
      evaluation: '协议覆盖率、专家可执行性评分、遗漏关键变量比例、不可核 claim 过滤率。',
      novelty: 72,
      feasibility: 86,
      whyNow: '站内细读和每日论文队列已经沉淀了足够多结构化页面,可以开始把“阅读资产”转成“实验资产”。',
      frontier: frontiers.find((item) => item.tags.includes('EVAL')) || frontiers[0],
      sources: pickEvidence(evidence, ['EVAL', 'VLA', 'WAM', 'DATA', 'LATEST'], 3),
    })
  }

  return ideas.slice(0, 3).map((idea, index) => attachAcademicReview({
    ...idea,
    id: `idea-${index}`,
    anchor: `${first} × ${second}`,
    tension: tensions[index % tensions.length]?.title || '证据张力',
    seed,
  }))
}

function buildReadingQueue(evidence) {
  return evidence.slice(0, 7).map((doc, index) => {
    const purpose = doc.tags.includes('DATA')
      ? '抽取数据变量、失败类型和训练配方'
      : doc.tags.includes('WAM')
        ? '抽取 rollout / value / future prediction 信号'
        : doc.tags.includes('CONTROL')
          ? '抽取动作接口与跨本体迁移条件'
          : '抽取可核事实与待核边界'
    return { ...doc, index: index + 1, purpose }
  })
}

function buildIdeaMatrix(ideas, focus) {
  return ideas.map((idea) => ({
    title: idea.title,
    variable: focus.includes('DATA') ? '失败类型 / 数据操作 / 动作接口' : '模型接口 / 预测信号 / 执行反馈',
    baseline: idea.title.includes('Critic') ? 'VLA 直接执行、语言置信度 rerank、value-only rerank' : '原始 VLA/WAM 方法、uniform replay、固定动作接口',
    proof: idea.evaluation,
    check: '每个 claim 都必须绑定站内来源或最新一手论文,⚠️ 自评与 ✅ 第三方验证分开写。',
  }))
}

function buildPaperOutline(ideas, tensions) {
  const lead = ideas[0]
  return [
    { title: '1. Motivation', text: lead ? lead.motivation : '用最新研究信号和站内证据定义 why now。' },
    { title: '2. Gap', text: `把 ${tensions.map((item) => item.title).join(' / ')} 转成一条明确 research gap。` },
    { title: '3. Contributions', text: lead ? lead.contributions.join(' ') : '列出 2-3 个可被审稿人检查的贡献。' },
    { title: '4. Method', text: lead ? lead.method.join(' ') : '提出最小可实现方法,避免泛泛综述。' },
    { title: '5. Experiments', text: lead ? lead.evaluation : '做 ablation + 可信度分层 + 失败分析。' },
  ]
}

function buildNextActions(ideas) {
  const lead = ideas[0]?.title || '候选 idea'
  return [
    `锁定主 idea「${lead}」,只保留 6 篇最强证据和 2 篇反例。`,
    '把动机里的每一句 why now 改写成可引用来源,不要混用作者自评和第三方验证。',
    '把方法拆成 1 个主模块 + 2 个 ablation,先画出输入输出变量表。',
    '找最小实验场景或 toy benchmark,先验证方向性而不是追求完整系统。',
    '写 1 页 idea memo:Motivation / Contributions / Method / Evaluation / Risks。',
  ]
}

function clampScore(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function candidateFromIdea(idea) {
  return {
    title: idea.title,
    oneLiner: idea.thesis,
    problemAnchor: idea.motivation,
    hypothesis: idea.thesis,
    method: idea.method,
    tags: [...new Set([...(idea.sources || []).flatMap((doc) => doc.tags), idea.frontier?.tags || []].flat())].slice(0, 5),
    sources: idea.sources || [],
    risk: idea.title.includes('Critic') ? '世界模型分数可能只相关于视觉保真度,不相关于真实执行成功率。' : '需要把站内自然语言证据转成可复现实验变量,否则容易停留在综述层。',
    pilot: idea.evaluation,
    pilotHours: idea.title.includes('Critic') ? 2 : 1.5,
    novelty: idea.novelty,
    feasibility: idea.feasibility,
    origin: 'shortlisted',
  }
}

function buildExtraCandidates(evidence, frontiers) {
  return [
    {
      title: 'Coverage-Aware WAM: 面向低覆盖状态的幻觉风险门控',
      oneLiner: '把 world model hallucination 从生成质量问题改成 state-action coverage 的风险估计问题。',
      problemAnchor: '最新论文队列里已有 world model hallucination 与覆盖区域相关的信号,站内 WAM 细读也反复提到 rollout 漂移和物理一致性。',
      hypothesis: '如果在执行前估计 state-action coverage,就能过滤掉更可能幻觉的 WAM rollout,提升 critic 可靠性。',
      method: ['从演示轨迹估计 coverage proxy。', '给 WAM rollout 加 coverage-aware risk head。', '比较无门控、置信度门控和 coverage 门控。'],
      tags: ['WAM', 'EVAL', 'DATA'],
      sources: pickEvidence(evidence, ['WAM', 'EVAL', 'LATEST'], 3),
      risk: 'coverage proxy 可能过粗,需要证明它比简单不确定性更有用。',
      pilot: '用离线轨迹重放做 1 个 toy coverage split,测试风险分数与失败率相关性。',
      pilotHours: 1.5,
      novelty: 80,
      feasibility: 76,
      origin: 'generated',
    },
    {
      title: 'Stage-Aware VLA Post-training: 用关键帧阶段监督减少接触点失败',
      oneLiner: '把 gripper event / keyframe / task stage 变成 VLA 后训练的稀疏结构监督。',
      problemAnchor: '站内数据处理、动作接口和最新论文队列都显示,失败常集中在接触切换和关键帧附近。',
      hypothesis: '阶段监督能让同等数据量的 VLA 更稳地处理接触前后状态切换。',
      method: ['从轨迹中自动提取 gripper event 与关键帧。', '给 action head 加 phase-aware auxiliary loss。', '在接触密集任务上做去除阶段监督消融。'],
      tags: ['VLA', 'DATA', 'CONTROL'],
      sources: pickEvidence(evidence, ['VLA', 'DATA', 'CONTROL', 'LATEST'], 3),
      risk: '如果任务阶段标签噪声过大,辅助监督会误导动作生成。',
      pilot: '先在 1 个开源操作数据集上自动抽 keyframes,检查标签稳定性和失败集中度。',
      pilotHours: 2,
      novelty: 78,
      feasibility: 82,
      origin: 'generated',
    },
    {
      title: 'Human-to-Robot Data Quality Estimator: 第一视角视频到机器人监督的可迁移性评分',
      oneLiner: '在人类视频进入训练前,估计它能否被转成有效机器人动作监督。',
      problemAnchor: '具身数据页覆盖第一视角、人类示范和跨本体数据,但缺少一个输入训练前的数据可用性判据。',
      hypothesis: '只保留 kinematic gap 小、物体交互清晰、阶段可分的视频片段,比盲目扩大人类视频数据更有效。',
      method: ['抽取手/物体/视角稳定性特征。', '估计 retargeting difficulty 与 label confidence。', '按质量分层训练 VLA 或 action prior。'],
      tags: ['DATA', 'CONTROL', 'EVAL'],
      sources: pickEvidence(evidence, ['DATA', 'CONTROL', 'EVAL'], 3),
      risk: '质量评分可能和任务难度耦合,需要分离“难但有用”和“噪声大”。',
      pilot: '对 50-100 个视频片段人工打分,验证自动质量分和人工可迁移性判断的一致性。',
      pilotHours: 1,
      novelty: 76,
      feasibility: 84,
      origin: 'generated',
    },
    {
      title: 'Deployment Smoke-Test Router: 用上线前 rollout 选择 VLA 专家',
      oneLiner: '把短 smoke test 的失败轨迹转成 frozen VLA experts 的路由监督。',
      problemAnchor: '多专家 VLA 和部署选择已经进入每日论文队列,但多数路由仍依赖静态任务标签或语言描述。',
      hypothesis: '少量上线前 smoke rollout 比任务文本更能预测哪一个专家适合当前环境/本体。',
      method: ['对每个专家执行极短 horizon smoke rollout。', '抽取失败类型、时延和动作平滑度。', '训练 router 选择或组合专家。'],
      tags: ['VLA', 'DEPLOY', 'EVAL'],
      sources: pickEvidence(evidence, ['VLA', 'DEPLOY', 'EVAL', 'LATEST'], 3),
      risk: 'smoke test 成本必须低于专家切换收益,否则工程意义不足。',
      pilot: '离线重放已有 rollout,模拟只看前 N 秒能否预测最终成功率。',
      pilotHours: 1.5,
      novelty: 74,
      feasibility: 80,
      origin: 'generated',
    },
    {
      title: 'Tactile-WAM Failure Oracle: 触觉未来预测作为操作失败早预警',
      oneLiner: '把触觉未来状态预测接到 WAM critic,专门处理视觉难以发现的滑动、空抓和接触异常。',
      problemAnchor: '最新 WAM 方向开始加入触觉未来状态,而站内操作失败模式多发生在接触状态不可见或不稳定时。',
      hypothesis: '触觉未来预测能比纯视觉 WAM 更早发现接触失败,尤其在遮挡和小物体任务中。',
      method: ['把 tactile token 作为 WAM rollout 的辅助分支。', '训练 contact-risk score。', '比较视觉-only、触觉-only、多模态 critic。'],
      tags: ['WAM', 'CONTROL', 'EVAL'],
      sources: pickEvidence(evidence, ['WAM', 'CONTROL', 'EVAL', 'LATEST'], 3),
      risk: '触觉数据难收集,需要先证明小规模数据也能提供增益。',
      pilot: '用公开/自有小规模触觉片段做 binary failure prediction sanity check。',
      pilotHours: 2.5,
      novelty: 82,
      feasibility: 62,
      origin: 'generated',
    },
  ].map((candidate) => ({
    ...candidate,
    frontier: frontiers.find((item) => candidate.tags.some((tag) => item.tags.includes(tag))) || frontiers[0],
  }))
}

function closestExistingWork(candidate, evidence) {
  const tokens = tokenize(`${candidate.title} ${candidate.oneLiner} ${candidate.problemAnchor}`)
  const scored = evidence.map((doc) => {
    const hay = `${doc.title} ${doc.text}`.toLowerCase()
    let score = 0
    for (const token of tokens) if (hay.includes(token)) score += 1
    for (const tag of candidate.tags || []) if (doc.tags.includes(tag)) score += 2
    if (doc.bucket === 'latest') score += 1
    return { doc, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map(({ doc, score }) => ({ ...doc, matchScore: score }))
}

function noveltyCheck(candidate, evidence) {
  const closest = closestExistingWork(candidate, evidence)
  const top = closest[0]
  const noveltyPenalty = Math.min(18, Math.max(0, (top?.matchScore || 0) - 8))
  const score = clampScore((candidate.novelty || 70) - noveltyPenalty)
  const status = score >= 80 ? 'LOCAL NOVELTY: STRONG' : score >= 68 ? 'LOCAL NOVELTY: PLAUSIBLE' : 'TOO CLOSE LOCALLY'
  const closestTitle = top ? compactTitle(top.title) : '站内未找到近邻'
  return {
    score,
    status,
    closest,
    differentiation: `最近站内近邻是「${closestTitle}」。当前 idea 的区分点应写清:问题变量、干预模块、评测协议至少有一项不同。`,
  }
}

function reviewerRubric(candidate, novelty) {
  const clarity = candidate.method?.length >= 3 ? 8 : 6
  const feasibility = Math.round((candidate.feasibility || 70) / 10)
  const noveltyScore = Math.round(novelty.score / 10)
  const pilot = candidate.pilotHours <= 2 ? 8 : 5
  const reviewerScore = Math.min(10, Math.round((clarity + feasibility + noveltyScore + pilot) / 4))
  const concern = reviewerScore >= 8
    ? '主要风险在实验协议是否足够干净,需要把自评指标和可复现实验分开。'
    : '当前 idea 需要进一步收窄变量,否则贡献可能被审稿人认为只是系统集成。'
  return { reviewerScore, concern }
}

function rankCandidate(candidate, evidence, focus, index) {
  const novelty = noveltyCheck(candidate, evidence)
  const review = reviewerRubric(candidate, novelty)
  const focusBoost = (candidate.tags || []).filter((tag) => focus.includes(tag)).length * 4
  const pilotBoost = candidate.pilotHours <= 2 ? 6 : -5
  const finalScore = clampScore(novelty.score * 0.36 + (candidate.feasibility || 70) * 0.26 + review.reviewerScore * 6 + focusBoost + pilotBoost, 0, 96)
  return {
    ...candidate,
    id: `candidate-${index}`,
    novelty,
    reviewerScore: review.reviewerScore,
    reviewerConcern: review.concern,
    finalScore,
    pilotStatus: candidate.pilotHours <= 2 ? 'PAPER PILOT OK' : 'NEEDS MANUAL PILOT',
  }
}

function buildDiscoveryCandidates(ideas, evidence, focus, frontiers) {
  const seedCandidates = ideas.map(candidateFromIdea)
  const candidates = [...seedCandidates, ...buildExtraCandidates(evidence, frontiers)]
  const seen = new Set()
  return candidates
    .filter((candidate) => {
      const key = candidate.title.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((candidate, index) => rankCandidate(candidate, evidence, focus, index))
    .sort((a, b) => b.finalScore - a.finalScore)
}

function buildLandscape(focus, evidence, frontiers, tensions) {
  const rows = [
    {
      title: 'VLA 后训练与数据闭环',
      scope: '失败样本、数据操作、动作接口和部署回流。',
      gap: '缺少从失败类型到补采/合成/重标注的触发器。',
      tags: ['VLA', 'DATA'],
    },
    {
      title: 'WAM / WLA 作为执行前 critic',
      scope: '未来状态预测、语言目标、动作候选和真实成功率。',
      gap: '缺少把 world rollout 分数接到真实控制成功率的评测协议。',
      tags: ['WAM', 'WLA', 'EVAL'],
    },
    {
      title: '跨本体动作接口',
      scope: 'action token、EEF delta、waypoint、action prior 和 router。',
      gap: '缺少同一任务族下动作接口的最小充分表示对照。',
      tags: ['CONTROL', 'VLA'],
    },
    {
      title: '可信每日论文雷达',
      scope: 'P0/P1、已细读、待核、作者自评与第三方复现。',
      gap: '缺少从最新论文到可投稿 idea 的可信度排序机制。',
      tags: ['LATEST', 'EVAL'],
    },
  ]
  return rows
    .map((row) => ({
      ...row,
      active: row.tags.some((tag) => focus.includes(tag)) || row.tags.some((tag) => evidence.some((doc) => doc.tags.includes(tag))),
      evidence: pickEvidence(evidence, row.tags, 2),
      frontier: frontiers.find((item) => row.tags.some((tag) => item.tags.includes(tag))),
      tension: tensions.find((item) => row.tags.some((tag) => item.title.toUpperCase().includes(tag)))?.title,
    }))
    .sort((a, b) => Number(b.active) - Number(a.active))
}

function buildExperimentPlan(top) {
  if (!top) return []
  return [
    {
      block: 'E0 Sanity Pilot',
      goal: top.pilot,
      metric: '方向性信号是否为正,以及失败样例是否集中在假设变量上。',
      budget: top.pilotHours <= 2 ? `${top.pilotHours}h local / no GPU required first` : `${top.pilotHours}h+,先人工确认数据可得性`,
    },
    {
      block: 'E1 Main Ablation',
      goal: '只替换主方法模块,其余数据、基座和评测保持一致。',
      metric: '成功率、样本效率、失败类型分布、可信度标记。',
      budget: '1-2 个小任务或离线重放集。',
    },
    {
      block: 'E2 Negative Control',
      goal: '找一个理论上不该受益的任务/数据切片,防止方法只是过拟合排序规则。',
      metric: '无关切片不应显著提升,否则需要重写机制解释。',
      budget: '复用 E1 数据,只做分层分析。',
    },
  ]
}

function buildDiscoveryReport(seed, pipeline) {
  const ranked = pipeline.ranked.map((item, index) => {
    const sources = item.novelty.closest.slice(0, 2).map((doc) => doc.title).join(' / ')
    return `${index + 1}. ${item.title}
   - Score: ${item.finalScore} | Novelty: ${item.novelty.status} (${item.novelty.score}) | Reviewer: ${item.reviewerScore}/10 | Pilot: ${item.pilotStatus}
   - Motivation: ${item.problemAnchor}
   - Contribution: ${item.oneLiner}
   - Method: ${item.method.join(' ')}
   - Closest local work: ${sources || 'none'}
   - Concern: ${item.reviewerConcern}`
  }).join('\n\n')
  const eliminated = pipeline.eliminated.map((item) => `- ${item.title}: ${item.eliminateReason}`).join('\n')
  const plan = pipeline.experimentPlan.map((item) => `- ${item.block}: ${item.goal} Metric: ${item.metric} Budget: ${item.budget}`).join('\n')
  return `# Idea Discovery Report

Direction: ${seed}
Pipeline: local brief -> site literature landscape -> candidate generation -> local novelty check -> reviewer rubric -> refined proposal
Mode: offline, site corpus only, no external API calls

## Executive Summary
Recommended idea: ${pipeline.top?.title || 'none'}
Reason: highest combined score across local novelty, feasibility, reviewer rubric, and <=2h pilot feasibility.

## Literature Landscape
${pipeline.landscape.map((item) => `- ${item.title}: ${item.gap}`).join('\n')}

## Ranked Ideas
${ranked}

## Eliminated Ideas
${eliminated || '- none'}

## Refined Proposal
Problem anchor: ${pipeline.top?.problemAnchor || ''}
Method thesis: ${pipeline.top?.oneLiner || ''}
Dominant risk: ${pipeline.top?.risk || ''}

## Experiment Plan
${plan}

## Next Steps
- Turn the top idea into a one-page proposal.
- Verify closest work manually before writing claims.
- Run E0 sanity pilot before expanding the method.`
}

function buildDiscoveryPipeline(seed, focus, evidence, tensions, frontiers, ideas) {
  const candidates = buildDiscoveryCandidates(ideas, evidence, focus, frontiers)
  const ranked = candidates.slice(0, 5)
  const eliminated = candidates.slice(5, 8).map((item) => ({
    ...item,
    eliminateReason: item.pilotHours > 2
      ? '超过 2h paper pilot 预算,先标记为 needs manual pilot。'
      : item.novelty.score < 70
        ? '站内近邻过近,需要更清楚 differentiation 后再进入 top list。'
        : '综合分低于 top ideas,暂列备选。',
  }))
  const top = ranked[0]
  const landscape = buildLandscape(focus, evidence, frontiers, tensions)
  const experimentPlan = buildExperimentPlan(top)
  const pipeline = {
    constants: [
      'PILOT_MAX_HOURS = 2',
      'MAX_PILOT_IDEAS = 3',
      'CANONICAL_REPORT = IDEA_REPORT',
      'MODE = offline site corpus',
    ],
    phases: [
      { id: '0', title: 'Load Daily Direction', status: 'DONE', text: '用所选日期方向 + 站内语料替代外部 research brief。' },
      { id: '1', title: 'Literature Landscape', status: 'DONE', text: '从站内论文、每日论文和前沿信号抽取子方向、缺口和近邻。' },
      { id: '2', title: 'Idea Generation', status: 'DONE', text: `生成 ${candidates.length} 个候选,保留前 ${ranked.length} 个。` },
      { id: '3', title: 'Local Novelty Check', status: 'DONE', text: '用站内 corpus 查 closest work 与 differentiation,不联网调用 API。' },
      { id: '4', title: 'Reviewer Rubric', status: 'DONE', text: '按 novelty、feasibility、clarity、pilot cost 给审稿人式分数。' },
      { id: '4.5', title: 'Refined Proposal', status: 'READY', text: '为 top idea 输出 problem anchor、method thesis 和实验计划。' },
    ],
    landscape,
    candidates,
    ranked,
    eliminated,
    top,
    experimentPlan,
  }
  pipeline.report = buildDiscoveryReport(seed, pipeline)
  return pipeline
}

function runResearch() {
  if (!corpus.value.length) return
  dailyClock.value = Date.now()
  const direction = dailyDirection.value
  const q = dailySeed.value
  const qTokens = tokenize(`${q} ${direction.focus}`)
  const candidates = corpus.value
    .filter(scopeMatch)
    .map((doc) => ({ doc, score: scoreDoc(doc, qTokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  const dailyCandidates = selectedDailyPapers.value.map((doc, index) => ({ doc, score: 100 - index }))
  const baseCandidates = candidates.length ? candidates : corpus.value.filter(scopeMatch).map((doc) => ({ doc, score: 1 }))
  const ranked = [...dailyCandidates, ...baseCandidates]
    .filter((item, index, all) => all.findIndex(candidate => candidate.doc.url === item.doc.url) === index)
    .slice(0, 12)
  const evidence = ranked.map(({ doc, score }) => ({ ...doc, score, snippet: snippetFor(doc, qTokens) }))
  const focus = buildFocus(evidence)
  const frontiers = buildFrontierMatches(qTokens, focus)
  const tensions = buildTensions(focus, evidence, frontiers)
  const ideas = buildPaperIdeas(q, focus, evidence, tensions, frontiers)
  const discovery = buildDiscoveryPipeline(q, focus, evidence, tensions, frontiers, ideas)
  result.value = {
    seed: q,
    date: todayKey.value,
    daily: direction,
    focus,
    frontiers,
    evidence,
    tensions,
    ideas,
    discovery,
    readingQueue: buildReadingQueue(evidence),
    experiments: buildIdeaMatrix(ideas, focus),
    outline: buildPaperOutline(ideas, tensions),
    nextActions: buildNextActions(ideas),
    prompt: buildPrompt(q, evidence, focus, ideas, frontiers),
  }
  lastRunAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function openIdeaDetail(id) {
  selectedIdeaId.value = id
}

function closeIdeaDetail() {
  selectedIdeaId.value = ''
}

function buildPrompt(q, evidence, focus, ideas, frontiers) {
  const refs = evidence.slice(0, 8).map((doc, idx) => `${idx + 1}. ${doc.title} - ${doc.url}`).join('\n')
  const frontierRefs = frontiers.map((item, idx) => `${idx + 1}. ${item.title} (${item.date}) - ${item.url}`).join('\n')
  const selected = ideas[0]
  return `任务:生成论文 ideas,不是问答,也不是泛泛 research plan。
Idea seed: ${q}
候选主 idea: ${selected?.title || '待选'}
范围标签: ${focus.join(' / ') || '全站'}

最新研究信号:
${frontierRefs || '无'}

站内落盘证据,保留 ⚠️/✅/待核 标记,不要把作者自评写成已证实事实:
${refs}

输出:
1. 3 个 paper ideas,每个包含动机、贡献、方法、验证和风险
2. 每个 idea 至少引用 2 个站内证据 + 1 个最新研究信号
3. 明确 novelty / feasibility / why now,不要只写方向口号
4. 给出最小实验和 ablation,说明能证伪什么
5. 列出需要继续查的一手来源清单`
}

function assetUrl(path) {
  return `${BASE_PATH.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

async function loadCorpus() {
  loading.value = true
  loadError.value = ''
  corpusSource.value = ''
  try {
    let docs = []
    const jsonUrls = [...new Set([assetUrl('autoresearch-corpus.json'), withBase('/autoresearch-corpus.json')])]
    for (const url of jsonUrls) {
      const jsonRes = await fetch(url, { cache: 'no-store' })
      if (!jsonRes.ok) continue
      const contentType = jsonRes.headers.get('content-type') || ''
      if (!contentType.includes('json')) continue
      let payload
      try {
        payload = await jsonRes.json()
      } catch {
        continue
      }
      dailyPaperArchive.value = normalizeDailyPaperDays(payload.daily_papers)
      docs = normalizeDocs(payload.docs || [])
      if (docs.length) {
        corpusSource.value = 'JSON'
        break
      }
    }
    if (!docs.length) {
      const textUrls = [...new Set([assetUrl('llms-full.txt'), withBase('/llms-full.txt')])]
      for (const url of textUrls) {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) continue
        const raw = await res.text()
        if (/^\s*</.test(raw)) continue
        docs = parseCorpus(raw)
        if (docs.length) {
          corpusSource.value = 'FULLTEXT'
          break
        }
      }
    }
    if (!docs.length) {
      docs = await loadMarkdownFallback()
      if (docs.length) corpusSource.value = 'MARKDOWN'
    }
    if (!docs.length) throw new Error('empty corpus')
    const availableDates = [...new Set([
      ...Object.keys(dailyPaperArchive.value),
      ...Object.keys(DAILY_IDEA_PACKS),
    ])].sort((a, b) => b.localeCompare(a))
    if (!availableDates.includes(selectedIdeaDate.value) && availableDates.length) {
      selectedIdeaDate.value = availableDates[0]
    }
    corpus.value = docs
    runResearch()
  } catch (err) {
    loadError.value = `语料加载失败:${err.message}`
  } finally {
    loading.value = false
  }
}

watch(mode, () => {
  window.clearTimeout(timer)
  timer = window.setTimeout(runResearch, 420)
})

watch(selectedIdeaDate, () => {
  selectedIdeaId.value = ''
  window.clearTimeout(timer)
  if (corpus.value.length) timer = window.setTimeout(runResearch, 180)
})

watch(result, () => {
  if (selectedIdeaId.value && !selectedIdea.value) selectedIdeaId.value = ''
})

onMounted(loadCorpus)
</script>

<template>
  <section class="ar-lab">
    <header class="ar-hero">
      <div class="ar-title">
        <span class="ar-kicker">AUTO RESEARCH</span>
        <h1>每日研究灵感</h1>
        <p>从最新论文队列和站内语料里,提炼 3 个值得继续推进的 paper 选题。全流程离线运行,不调用外部 API。</p>
        <div class="ar-stats" aria-label="语料统计">
          <span>{{ corpusStats.all }} 文档</span>
          <span>{{ corpusStats.vla }} VLA</span>
          <span>{{ corpusStats.wam }} WAM</span>
          <span>{{ corpusStats.latest }} 最新</span>
          <span>{{ corpusStats.data }} DATA</span>
        </div>
      </div>
      <div class="ar-daily">
        <span class="ar-kicker">今日方向</span>
        <h2>{{ todayKey }} · {{ dailyDirection.label }}</h2>
        <p>{{ dailyDirection.focus }}</p>
        <label class="ar-history">
          <span>DATE</span>
          <select v-model="selectedIdeaDate" aria-label="选择 Ideas 日期">
            <option v-for="item in ideaHistoryOptions" :key="item.key" :value="item.key">
              {{ item.label }}
            </option>
          </select>
        </label>
      </div>

      <aside class="ar-run">
        <div class="ar-mode" role="group" aria-label="发现模式">
          <button
            v-for="item in MODES"
            :key="item.id"
            type="button"
            :class="{ on: mode === item.id }"
            @click="mode = item.id"
          >
            {{ item.label }}
          </button>
        </div>
        <button class="ar-runbtn" type="button" :disabled="loading" @click="runResearch">
          {{ loading ? '加载语料中' : '刷新该日 Ideas' }}
        </button>
        <p class="ar-note">
          <span v-if="loadError">{{ loadError }}</span>
          <span v-else>
            {{ corpusSource ? `语料源 ${corpusSource}。` : '' }}{{ lastRunAt ? `上次生成 ${lastRunAt}` : '' }}
          </span>
        </p>
      </aside>
    </header>

    <section v-if="result" class="ar-output">
      <section v-if="mode === 'deep' && result.discovery" class="ar-panel ar-discovery">
        <div class="ar-panel-head">
          <div>
            <span class="ar-panel__tag">LOCAL IDEA-DISCOVERY PIPELINE</span>
            <h2>该日 Idea Discovery</h2>
          </div>
          <a href="https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep/blob/main/skills/idea-discovery/SKILL.md" target="_blank" rel="noopener">
            skill source
          </a>
        </div>
        <p class="ar-lead">
          参考 idea-discovery 的筛选链路,但改成本地站内语料版:只用已落盘论文、每日论文和内置前沿信号做可解释筛选。
        </p>
        <div class="ar-constants">
          <span v-for="item in result.discovery.constants" :key="item">{{ item }}</span>
        </div>
        <div class="ar-phases">
          <article v-for="phase in result.discovery.phases" :key="phase.id" class="ar-phase">
            <header>
              <span>PHASE {{ phase.id }}</span>
              <b>{{ phase.status }}</b>
            </header>
            <h3>{{ phase.title }}</h3>
            <p>{{ phase.text }}</p>
          </article>
        </div>
      </section>

      <section v-if="mode === 'deep' && result.discovery" class="ar-panel ar-top-idea">
        <div class="ar-top-shell">
          <aside class="ar-score-tower" aria-label="Top idea score">
            <span>TOP IDEA</span>
            <b>{{ result.discovery.top.finalScore }}</b>
            <small>Reviewer {{ result.discovery.top.reviewerScore }}/10</small>
          </aside>
          <div class="ar-top-main">
            <div class="ar-top-head">
              <div>
                <span class="ar-panel__tag">RECOMMENDED PROPOSAL</span>
                <h2>{{ result.discovery.top.title }}</h2>
              </div>
              <div class="ar-chipline">
                <span>{{ result.discovery.top.novelty.status }}</span>
                <span>{{ result.discovery.top.pilotStatus }}</span>
                <span v-for="tag in result.discovery.top.tags" :key="`top-tag-${tag}`">{{ tag }}</span>
              </div>
            </div>
            <p class="ar-thesis">{{ result.discovery.top.oneLiner }}</p>
            <div class="ar-top-columns">
              <section>
                <h3>动机</h3>
                <p>{{ result.discovery.top.problemAnchor }}</p>
              </section>
              <section>
                <h3>方法</h3>
                <ol>
                  <li v-for="item in result.discovery.top.method" :key="`top-method-${item}`">{{ item }}</li>
                </ol>
              </section>
              <section>
                <h3>验证</h3>
                <p>{{ result.discovery.top.pilot }}</p>
                <small>{{ result.discovery.top.reviewerConcern }}</small>
              </section>
            </div>
            <div class="ar-evidence-strip">
              <span>closest local work</span>
              <a v-for="doc in result.discovery.top.novelty.closest" :key="`top-close-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">
                {{ doc.title }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div v-if="mode === 'deep' && result.discovery" class="ar-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">LITERATURE LANDSCAPE</span>
          <div class="ar-landscape">
            <article v-for="item in result.discovery.landscape" :key="item.title" class="ar-mini" :class="{ muted: !item.active }">
              <h3>{{ item.title }}</h3>
              <p>{{ item.scope }}</p>
              <strong>{{ item.gap }}</strong>
              <div class="ar-source-row">
                <a v-for="doc in item.evidence" :key="`${item.title}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a>
              </div>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">CANDIDATE FUNNEL</span>
          <div class="ar-funnel">
            <article
              v-for="item in result.discovery.candidates"
              :key="item.id"
              class="ar-funnel-row"
              :style="{ '--score': `${item.finalScore}%` }"
            >
              <span>{{ item.finalScore }}</span>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.novelty.status }} · Reviewer {{ item.reviewerScore }}/10 · {{ item.pilotStatus }}</p>
                <i class="ar-scorebar" aria-hidden="true"></i>
              </div>
            </article>
          </div>
        </section>
      </div>

      <section v-if="mode === 'deep' && result.discovery" class="ar-panel">
        <span class="ar-panel__tag">RANKED IDEAS AFTER LOCAL REVIEW</span>
        <div class="ar-ranked">
          <article v-for="(item, index) in result.discovery.ranked" :key="`rank-${item.id}`" class="ar-rank">
            <header>
              <span>#{{ index + 1 }}</span>
              <span>{{ item.finalScore }}/100</span>
            </header>
            <h3>{{ item.title }}</h3>
            <p>{{ item.oneLiner }}</p>
            <div class="ar-rank-metrics">
              <span>{{ item.novelty.status }}</span>
              <span>Reviewer {{ item.reviewerScore }}/10</span>
              <span>{{ item.pilotStatus }}</span>
            </div>
            <div class="ar-rank-grid">
              <section>
                <h4>Why</h4>
                <p>{{ item.problemAnchor }}</p>
              </section>
              <section>
                <h4>How</h4>
                <ul>
                  <li v-for="method in item.method.slice(0, 2)" :key="`${item.id}-rank-method-${method}`">{{ method }}</li>
                  <li v-if="item.method.length > 2">+{{ item.method.length - 2 }} method step in report</li>
                </ul>
              </section>
              <section>
                <h4>Check</h4>
                <p>{{ item.pilot }}</p>
              </section>
              <section>
                <h4>Risk</h4>
                <p>{{ item.risk }}</p>
              </section>
            </div>
            <div class="ar-source-row ar-source-row--compact">
              <a v-for="doc in item.novelty.closest.slice(0, 2)" :key="`${item.id}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a>
            </div>
          </article>
        </div>
      </section>

      <div v-if="mode === 'deep' && result.discovery" class="ar-grid ar-plan-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">EXPERIMENT PLAN</span>
          <div class="ar-outline">
            <article v-for="item in result.discovery.experimentPlan" :key="item.block">
              <b>{{ item.block }}</b>
              <p>{{ item.goal }}</p>
              <small>{{ item.metric }}</small>
              <small>{{ item.budget }}</small>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">WHY THIS IDEA WINS</span>
          <div class="ar-mini ar-decision">
            <h3>{{ result.discovery.top.title }}</h3>
            <p>{{ result.discovery.top.novelty.differentiation }}</p>
            <strong>{{ result.discovery.top.reviewerConcern }}</strong>
          </div>
        </section>
      </div>

      <section v-if="mode === 'deep' && result.discovery" class="ar-panel">
        <span class="ar-panel__tag">ELIMINATED / BACKUP IDEAS</span>
        <div class="ar-eliminated">
          <article v-for="item in result.discovery.eliminated" :key="`elim-${item.id}`" class="ar-mini">
            <h3>{{ item.title }}</h3>
            <p>{{ item.eliminateReason }}</p>
          </article>
        </div>
      </section>

      <div class="ar-panel ar-brief" :class="{ 'ar-brief--quick': mode === 'quick' }">
        <div class="ar-brief-head">
          <span class="ar-panel__tag">PAPER IDEAS</span>
          <div class="ar-focus">
            <span v-for="tag in result.focus" :key="tag">{{ tag }}</span>
          </div>
        </div>
        <h2 v-if="mode === 'deep'">{{ result.date }} · {{ result.daily.label }}</h2>
        <p v-if="mode === 'deep'" class="ar-daily-summary">{{ result.daily.focus }}</p>
        <div class="ar-ideas">
          <article
            v-for="(idea, index) in result.ideas"
            :key="idea.id"
            class="ar-idea"
            :class="{ 'is-selected': selectedIdeaId === idea.id }"
            role="button"
            tabindex="0"
            @click="openIdeaDetail(idea.id)"
            @keydown.enter.prevent="openIdeaDetail(idea.id)"
            @keydown.space.prevent="openIdeaDetail(idea.id)"
          >
            <button class="ar-idea-thumb" type="button" :aria-label="`查看 ${idea.title} 详情`" @click.stop="openIdeaDetail(idea.id)">
              <span class="ar-thumb-mark" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>OPEN</span>
            </button>
            <div class="ar-idea-body">
              <header>
                <span class="ar-idea-rank">#{{ index + 1 }}</span>
                <span class="ar-idea-tension">{{ idea.tension }}</span>
                <span class="ar-idea-score">{{ idea.academicTier }} · {{ idea.academicScore }}/10</span>
              </header>
              <h3>{{ idea.title }}</h3>
              <p>{{ idea.thesis }}</p>
              <div class="ar-academic-mini" aria-label="学术多维评分">
                <span v-for="item in idea.academicCardScores" :key="`${idea.id}-score-${item.key}`">
                  <b>{{ item.short }}</b>
                  <i>{{ item.value }}</i>
                </span>
              </div>
              <p class="ar-academic-verdict">{{ idea.academicVerdict }}</p>
              <div class="ar-why">
                <span>WHY NOW</span>
                <p>{{ idea.whyNow }}</p>
                <a v-if="idea.frontier" :href="idea.frontier.url" target="_blank" rel="noopener" @click.stop>{{ idea.frontier.title }}</a>
              </div>
              <div class="ar-idea-grid">
                <section>
                  <h4>动机</h4>
                  <p>{{ idea.motivation }}</p>
                </section>
                <section>
                  <h4>贡献</h4>
                  <ul class="ar-tight-list">
                    <li v-for="item in idea.contributions" :key="`${idea.id}-c-${item}`">{{ item }}</li>
                  </ul>
                </section>
                <section>
                  <h4>方法</h4>
                  <ul class="ar-tight-list">
                    <li v-for="item in idea.method" :key="`${idea.id}-m-${item}`">{{ item }}</li>
                  </ul>
                </section>
                <section>
                  <h4>验证</h4>
                  <p>{{ idea.evaluation }}</p>
                </section>
              </div>
              <div class="ar-source-row" @click.stop>
                <a v-for="doc in idea.sources" :key="`${idea.id}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">
                  {{ doc.title }}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <Teleport to="body">
        <div v-if="selectedIdea" class="ar-detail-backdrop" @click="closeIdeaDetail">
          <article
            class="ar-detail-sheet"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="`idea-detail-${selectedIdea.id}`"
            @click.stop
          >
            <header class="ar-detail-head">
              <div>
                <span class="ar-panel__tag">IDEA DETAIL</span>
                <h2 :id="`idea-detail-${selectedIdea.id}`">{{ selectedIdea.title }}</h2>
              </div>
              <button type="button" aria-label="关闭详情" @click="closeIdeaDetail">×</button>
            </header>

            <div class="ar-detail-meta">
              <span>#{{ selectedIdeaIndex + 1 }}</span>
              <span>{{ selectedIdea.tension }}</span>
              <span>学术总分 {{ selectedIdea.academicScore }}/10</span>
              <span>{{ selectedIdea.academicTier }}</span>
            </div>

            <p class="ar-detail-thesis">{{ selectedIdea.thesis }}</p>

            <section class="ar-detail-academic">
              <header>
                <span>学术多维评分</span>
                <strong>{{ selectedIdea.academicScore }}/10</strong>
              </header>
              <div class="ar-academic-grid">
                <span v-for="item in selectedIdea.academicScoreItems" :key="`detail-score-${selectedIdea.id}-${item.key}`">
                  <b>{{ item.label }}</b>
                  <i>{{ item.value }}/10</i>
                </span>
              </div>
              <p>{{ selectedIdea.academicVerdict }}</p>
            </section>

            <section class="ar-detail-why">
              <span>WHY NOW</span>
              <p>{{ selectedIdea.whyNow }}</p>
              <a v-if="selectedIdea.frontier" :href="selectedIdea.frontier.url" target="_blank" rel="noopener">
                {{ selectedIdea.frontier.title }}
              </a>
            </section>

            <div class="ar-detail-grid">
              <section>
                <h3>动机</h3>
                <p>{{ selectedIdea.motivation }}</p>
              </section>
              <section>
                <h3>核心贡献</h3>
                <ul>
                  <li v-for="item in selectedIdea.contributions" :key="`detail-c-${item}`">{{ item }}</li>
                </ul>
              </section>
              <section>
                <h3>方法路径</h3>
                <ul>
                  <li v-for="item in selectedIdea.method" :key="`detail-m-${item}`">{{ item }}</li>
                </ul>
              </section>
              <section>
                <h3>验证方式</h3>
                <p>{{ selectedIdea.evaluation }}</p>
              </section>
            </div>

            <section class="ar-detail-sources">
              <h3>站内证据与近邻论文</h3>
              <div class="ar-source-row">
                <a v-for="doc in selectedIdea.sources" :key="`detail-${selectedIdea.id}-${doc.id}`" :href="doc.url" target="_blank" rel="noopener">
                  {{ doc.title }}
                </a>
              </div>
            </section>
          </article>
        </div>
      </Teleport>

      <div v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">LATEST RESEARCH SIGNALS</span>
        <div class="ar-frontiers">
          <article v-for="item in result.frontiers" :key="item.url" class="ar-frontier">
            <header>
              <span>{{ item.date }}</span>
              <span>{{ item.tags.join(' / ') }}</span>
            </header>
            <h3><a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a></h3>
            <p>{{ item.signal }}</p>
            <strong>{{ item.ideaHook }}</strong>
          </article>
        </div>
      </div>

      <div v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">SITE PAPERS USED</span>
        <div class="ar-evidence">
          <article v-for="doc in result.evidence" :key="doc.id" class="ar-card">
            <header>
              <span>{{ doc.bucket.toUpperCase() }}</span>
              <span>score {{ Math.round(doc.score) }}</span>
            </header>
            <h3><a :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a></h3>
            <p>{{ doc.snippet }}</p>
            <div class="ar-tags">
              <span v-for="tag in doc.tags" :key="`${doc.id}-${tag}`">{{ tag }}</span>
            </div>
          </article>
        </div>
      </div>

      <div v-if="mode === 'deep'" class="ar-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">IDEA GAPS</span>
          <div class="ar-tensions">
            <article v-for="item in result.tensions" :key="item.title" class="ar-mini">
              <h3>{{ item.title }}</h3>
              <p>{{ item.problem }}</p>
              <strong>{{ item.researchMove }}</strong>
            </article>
          </div>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">EVALUATION BLUEPRINT</span>
          <div class="ar-matrix">
            <article v-for="row in result.experiments" :key="row.title">
              <span>{{ row.title }}</span>
              <p>{{ row.variable }}</p>
              <small>{{ row.baseline }}</small>
              <p>{{ row.proof }}</p>
              <small>{{ row.check }}</small>
            </article>
          </div>
        </section>
      </div>

      <div v-if="mode === 'deep'" class="ar-grid">
        <section class="ar-panel">
          <span class="ar-panel__tag">READING QUEUE</span>
          <ol class="ar-reading">
            <li v-for="doc in result.readingQueue" :key="`read-${doc.id}`">
              <a :href="doc.url" target="_blank" rel="noopener">{{ doc.title }}</a>
              <span>{{ doc.purpose }}</span>
            </li>
          </ol>
        </section>

        <section class="ar-panel">
          <span class="ar-panel__tag">PAPER SKELETON</span>
          <div class="ar-outline">
            <article v-for="section in result.outline" :key="section.title">
              <b>{{ section.title }}</b>
              <p>{{ section.text }}</p>
            </article>
          </div>
        </section>
      </div>

      <section v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">NEXT IDEA REFINEMENT</span>
        <ol class="ar-list">
          <li v-for="step in result.nextActions" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section v-if="mode === 'deep'" class="ar-panel">
        <span class="ar-panel__tag">COPYABLE IDEA_DISCOVERY REPORT</span>
        <pre>{{ result.discovery.report }}</pre>
      </section>
    </section>
  </section>
</template>

<style scoped>
.ar-lab {
  position: relative;
  isolation: isolate;
  display: grid;
  gap: 14px;
  margin-top: 10px;
  container-type: inline-size;
}

.ar-lab::before {
  content: '';
  position: absolute;
  inset: -14px -18px;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(rgba(56, 189, 248, 0.065) 1px, transparent 1px) 0 0 / 28px 28px,
    linear-gradient(90deg, rgba(56, 189, 248, 0.055) 1px, transparent 1px) 0 0 / 28px 28px,
    linear-gradient(135deg, rgba(246, 198, 103, 0.08), transparent 22%, transparent 70%, rgba(14, 165, 233, 0.06)),
    linear-gradient(180deg, rgba(14, 165, 233, 0.05), transparent 38%);
  mask-image: linear-gradient(180deg, transparent, #000 8%, #000 86%, transparent);
  opacity: 0.72;
}

.ar-lab,
.ar-lab * {
  box-sizing: border-box;
}

.ar-hero,
.ar-panel {
  position: relative;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  border: 1px solid rgba(96, 165, 250, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.14), transparent 40%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.82));
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.ar-hero::before,
.ar-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.12), transparent) 0 0 / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 32%);
}

.ar-hero::after,
.ar-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(135deg, transparent 0 42%, rgba(125, 211, 252, 0.08) 50%, transparent 58%) -90% 0 / 62% 100% no-repeat,
    linear-gradient(90deg, rgba(125, 211, 252, 0.06), transparent 16%, transparent 84%, rgba(246, 198, 103, 0.06));
  opacity: 0.34;
}

.ar-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.78fr);
  gap: 14px 20px;
  padding: 18px 20px;
}

.ar-title {
  grid-column: 1 / -1;
}

.ar-hero > *,
.ar-panel > *,
.ar-card,
.ar-idea,
.ar-frontier,
.ar-phase,
.ar-rank,
.ar-stats {
  min-width: 0;
}

.ar-hero > *,
.ar-panel > * {
  position: relative;
  z-index: 1;
}

.ar-kicker,
.ar-panel__tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #7dd3fc;
  font: 800 0.72rem/1 var(--font-display);
  letter-spacing: 0.08em;
}

.ar-kicker::before,
.ar-panel__tag::before {
  content: '';
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #38bdf8, #f6c667);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
}

.ar-hero h1,
.ar-panel h2 {
  margin: 0 !important;
  color: #f8fafc;
  font-size: clamp(1.35rem, 2.25vw, 2rem);
  line-height: 1.1;
  overflow-wrap: anywhere;
  border-top: 0 !important;
  padding-top: 0 !important;
}

.ar-hero .ar-title h1 {
  font-size: clamp(1.45rem, 1.9vw, 1.72rem) !important;
  line-height: 1.05 !important;
}

.ar-lab h1::before,
.ar-lab h1::after,
.ar-lab h2::before,
.ar-lab h2::after,
.ar-lab h3::before,
.ar-lab h3::after {
  content: none !important;
  display: none !important;
}

.ar-hero p {
  margin: 0;
  color: #aebbd0;
  font-size: 0.82rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.ar-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
}

.ar-title p {
  flex: none;
  max-width: 82ch;
}

.ar-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 3px 0 0;
}

.ar-stats span {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 3px 6px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.08);
  color: #dbeafe;
  font-size: 0.68rem !important;
  font-weight: 800;
  line-height: 1 !important;
}

.ar-daily {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 12px;
  min-width: 0;
  padding: 7px 9px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 7px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.08), transparent 56%),
    rgba(2, 6, 23, 0.3);
}

.ar-daily h2 {
  margin: 0 !important;
  color: #f8fafc;
  font-size: clamp(0.98rem, 1.35vw, 1.16rem);
  line-height: 1.16;
  border-top: 0 !important;
  padding-top: 0 !important;
}

.ar-daily p,
.ar-daily-summary {
  margin: 0;
  color: #aebbd0;
  font-size: 0.88rem;
  line-height: 1.35;
}

.ar-daily p {
  flex: 1 1 240px;
}

.ar-history {
  flex: 0 1 210px;
  display: grid;
  gap: 4px;
  min-width: 180px;
  margin-left: auto;
}

.ar-history span {
  color: #7dd3fc;
  font: 900 0.58rem/1 var(--font-display);
  letter-spacing: 0.1em;
}

.ar-history select {
  width: 100%;
  min-width: 0;
  padding: 6px 28px 6px 9px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(45, 212, 191, 0.06)),
    rgba(2, 6, 23, 0.72);
  color: #e0f2fe;
  font-size: 0.78rem;
  font-weight: 850;
  outline: none;
}

.ar-history select:focus {
  border-color: rgba(125, 211, 252, 0.62);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
}

.ar-mode,
.ar-tags,
.ar-focus,
.ar-constants {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-mode button,
.ar-runbtn,
.ar-tags span,
.ar-focus span,
.ar-constants span {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.64);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 800;
}

.ar-mode button {
  flex: 1 1 0;
  padding: 5px 8px;
  line-height: 1.1;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.ar-mode button.on {
  border-color: rgba(125, 211, 252, 0.6);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.22), rgba(45, 212, 191, 0.12));
  color: #e0f2fe;
  box-shadow: inset 0 0 0 1px rgba(125, 211, 252, 0.12), 0 0 18px rgba(14, 165, 233, 0.12);
}

.ar-run {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-content: center;
  align-items: center;
  gap: 9px 12px;
}

.ar-runbtn {
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(6, 182, 212, 0.95)),
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  color: white;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(14, 165, 233, 0.18);
  transition: transform 0.18s ease, filter 0.18s ease;
}

.ar-runbtn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.ar-runbtn:disabled {
  cursor: wait;
  opacity: 0.68;
}

.ar-note {
  grid-column: 1 / -1;
  margin: 0;
  color: #94a3b8;
  font-size: 0.74rem;
  line-height: 1.25;
  text-align: left;
}

.ar-output {
  display: grid;
  gap: 14px;
}

.ar-panel {
  padding: 14px;
}

.ar-brief-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ar-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.ar-panel-head a {
  flex: none;
  color: #7dd3fc;
  font-size: 0.8rem;
  font-weight: 900;
  text-decoration: none;
}

.ar-lead {
  max-width: 940px;
  margin: 10px 0 0;
  color: #aebbd0;
  line-height: 1.65;
}

.ar-constants {
  margin-top: 12px;
}

.ar-constants span {
  padding: 5px 9px;
  color: #a7f3d0;
}

.ar-top-idea {
  border-color: rgba(246, 198, 103, 0.34);
  background:
    linear-gradient(135deg, rgba(246, 198, 103, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.84));
}

.ar-top-shell {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.ar-score-tower {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 9px;
  min-height: 210px;
  padding: 18px 12px;
  border: 1px solid rgba(246, 198, 103, 0.32);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 20%, rgba(246, 198, 103, 0.22), transparent 42%),
    rgba(2, 6, 23, 0.5);
  text-align: center;
}

.ar-score-tower span,
.ar-score-tower small {
  color: #cbd5e1;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ar-score-tower b {
  color: #f8fafc;
  font: 900 3.6rem/0.9 var(--font-display);
}

.ar-top-main {
  display: grid;
  gap: 14px;
}

.ar-top-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.ar-top-head h2 {
  margin-bottom: 0;
}

.ar-chipline {
  display: flex;
  flex: 0 1 360px;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.ar-chipline span {
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #dbeafe;
  font-size: 0.72rem;
  font-weight: 900;
}

.ar-thesis {
  margin: 0;
  color: #f8fafc;
  font-size: 1.02rem;
  font-weight: 800;
  line-height: 1.55;
}

.ar-top-columns {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr;
  gap: 10px;
}

.ar-top-columns section {
  min-width: 0;
  padding: 13px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.38);
}

.ar-top-columns h3,
.ar-rank-grid h4 {
  margin: 0 0 7px;
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-top-columns p,
.ar-top-columns small {
  margin: 0;
  color: #aebbd0;
  line-height: 1.6;
}

.ar-top-columns ol {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 18px;
  color: #dbeafe;
  font-size: 0.86rem;
  line-height: 1.55;
}

.ar-evidence-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
  padding-top: 2px;
}

.ar-evidence-strip span {
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-evidence-strip a {
  max-width: 100%;
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #7dd3fc;
  font-size: 0.76rem;
  font-weight: 800;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.ar-brief ul,
.ar-list {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding-left: 20px;
  color: #cbd5e1;
  line-height: 1.65;
}

.ar-brief a {
  margin-left: 6px;
  color: #7dd3fc;
  font-size: 0.82rem;
  font-weight: 800;
}

.ar-focus {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
}

.ar-focus span {
  padding: 4px 7px;
  border-color: rgba(246, 198, 103, 0.26);
  background: rgba(246, 198, 103, 0.08);
  color: #f8d78a;
  font-size: 0.68rem;
}

.ar-ideas,
.ar-frontiers,
.ar-phases,
.ar-landscape,
.ar-funnel,
.ar-ranked,
.ar-eliminated,
.ar-tensions,
.ar-matrix,
.ar-outline {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.ar-ideas {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
}

.ar-idea,
.ar-frontier {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 34%),
    linear-gradient(135deg, rgba(20, 184, 166, 0.12), transparent 52%),
    rgba(15, 23, 42, 0.58);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.05);
}

.ar-idea {
  align-content: start;
  border-left: 3px solid rgba(246, 198, 103, 0.74);
}

.ar-idea-body {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.ar-idea-thumb {
  display: none;
}

.ar-brief--quick .ar-ideas {
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 10px;
}

.ar-brief--quick .ar-idea {
  position: relative;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: stretch;
  gap: 7px;
  padding: 10px 11px 10px 12px;
  border-color: rgba(125, 211, 252, 0.18);
  border-left: 0;
  background:
    linear-gradient(90deg, var(--idea-accent, #38bdf8) 0 3px, transparent 3px),
    linear-gradient(135deg, color-mix(in srgb, var(--idea-accent, #38bdf8) 12%, transparent), transparent 48%),
    rgba(15, 23, 42, 0.62);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.ar-brief--quick .ar-idea::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--idea-accent, #38bdf8) 58%, transparent), transparent 46%) 0 0 / 32px 1px no-repeat,
    linear-gradient(180deg, color-mix(in srgb, var(--idea-accent, #38bdf8) 46%, transparent), transparent 52%) 0 0 / 1px 36px no-repeat,
    linear-gradient(270deg, color-mix(in srgb, var(--idea-accent, #38bdf8) 42%, transparent), transparent 52%) 100% 100% / 34px 1px no-repeat,
    linear-gradient(0deg, color-mix(in srgb, var(--idea-accent, #38bdf8) 38%, transparent), transparent 52%) 100% 100% / 1px 34px no-repeat;
  opacity: 0.78;
}

.ar-brief--quick .ar-idea::after {
  content: '';
  position: absolute;
  inset: -20% auto -20% -28%;
  width: 18%;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--idea-accent, #38bdf8) 24%, transparent), transparent);
  opacity: 0;
  transform: skewX(-18deg);
  transition: transform 0.55s ease, opacity 0.2s ease;
}

.ar-brief--quick .ar-idea:nth-child(1) {
  --idea-accent: #f6c667;
}

.ar-brief--quick .ar-idea:nth-child(2) {
  --idea-accent: #38bdf8;
}

.ar-brief--quick .ar-idea:nth-child(3) {
  --idea-accent: #2dd4bf;
}

.ar-brief--quick .ar-idea:hover {
  border-color: color-mix(in srgb, var(--idea-accent, #38bdf8) 42%, rgba(125, 211, 252, 0.2));
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22), inset 0 1px rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}

.ar-brief--quick .ar-idea:hover::after {
  opacity: 1;
  transform: translateX(740%) skewX(-18deg);
}

.ar-brief--quick .ar-idea:focus-visible,
.ar-brief--quick .ar-idea.is-selected {
  outline: 2px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 62%, transparent);
  outline-offset: 2px;
}

.ar-brief--quick .ar-idea-body {
  position: relative;
  z-index: 1;
  gap: 7px;
}

.ar-brief--quick .ar-idea-thumb {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  min-height: 100%;
  padding: 8px 6px;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 34%, rgba(125, 211, 252, 0.12));
  border-radius: 7px;
  background:
    radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--idea-accent, #38bdf8) 24%, transparent), transparent 46%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 42%),
    rgba(2, 6, 23, 0.42);
  color: color-mix(in srgb, var(--idea-accent, #38bdf8) 72%, #f8fafc);
  cursor: pointer;
  overflow: hidden;
}

.ar-brief--quick .ar-idea-thumb::before {
  content: '';
  position: absolute;
  inset: 9px;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 22%, transparent);
  border-radius: 6px;
  opacity: 0.8;
}

.ar-brief--quick .ar-idea-thumb::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  top: 13px;
  height: 1px;
  background: color-mix(in srgb, var(--idea-accent, #38bdf8) 68%, #f8fafc);
  box-shadow: 0 0 12px color-mix(in srgb, var(--idea-accent, #38bdf8) 52%, transparent);
  opacity: 0.64;
  animation: arThumbScan 3.8s ease-in-out infinite;
}

.ar-brief--quick .ar-idea-thumb > span:last-child {
  position: relative;
  z-index: 1;
  font: 900 0.56rem/1 var(--font-display);
  letter-spacing: 0.08em;
}

.ar-thumb-mark {
  position: relative;
  z-index: 1;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 45%, transparent);
  border-radius: 50%;
  background:
    radial-gradient(circle, color-mix(in srgb, var(--idea-accent, #38bdf8) 60%, #f8fafc) 0 3px, transparent 4px),
    conic-gradient(from 42deg, transparent, color-mix(in srgb, var(--idea-accent, #38bdf8) 44%, transparent), transparent 42%);
  box-shadow: inset 0 0 18px color-mix(in srgb, var(--idea-accent, #38bdf8) 18%, transparent);
  animation: arThumbOrbit 14s linear infinite;
}

.ar-thumb-mark::before,
.ar-thumb-mark::after {
  content: '';
  position: absolute;
  background: color-mix(in srgb, var(--idea-accent, #38bdf8) 56%, #f8fafc);
  opacity: 0.72;
}

.ar-thumb-mark::before {
  left: 8px;
  right: 8px;
  top: 20px;
  height: 1px;
  transform: rotate(-24deg);
}

.ar-thumb-mark::after {
  left: 20px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  transform: rotate(28deg);
}

.ar-thumb-mark i {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--idea-accent, #38bdf8) 64%, #f8fafc);
  box-shadow: 0 0 12px color-mix(in srgb, var(--idea-accent, #38bdf8) 42%, transparent);
}

.ar-thumb-mark i:nth-child(1) {
  left: 9px;
  top: 12px;
}

.ar-thumb-mark i:nth-child(2) {
  right: 9px;
  top: 18px;
}

.ar-thumb-mark i:nth-child(3) {
  left: 18px;
  bottom: 8px;
}

.ar-idea-rank {
  display: inline-grid;
  min-width: 30px;
  height: 20px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 48%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--idea-accent, #38bdf8) 14%, rgba(2, 6, 23, 0.9));
  color: #f8fafc;
  font: 900 0.68rem/1 var(--font-display);
}

.ar-idea-tension {
  flex: 1 1 auto;
  min-width: 0;
  color: #9fb6d4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ar-idea-score {
  flex: 0 0 auto;
  color: #f8d78a;
  white-space: nowrap;
}

.ar-academic-mini {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.ar-academic-mini span {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 7px;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #38bdf8) 22%, rgba(148, 163, 184, 0.16));
  border-radius: 6px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 46%),
    color-mix(in srgb, var(--idea-accent, #38bdf8) 8%, rgba(2, 6, 23, 0.42));
}

.ar-academic-mini b,
.ar-academic-mini i {
  min-width: 0;
  font-style: normal;
  line-height: 1;
}

.ar-academic-mini b {
  color: #b7c9df;
  font-size: 0.66rem;
  font-weight: 900;
}

.ar-academic-mini i {
  color: #f8fafc;
  font: 900 0.72rem/1 var(--font-display);
}

.ar-academic-verdict {
  margin: -2px 0 0;
  color: #dbeafe !important;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.5 !important;
}

.ar-brief--quick .ar-idea-body > p,
.ar-brief--quick .ar-why p,
.ar-brief--quick .ar-idea-grid p,
.ar-brief--quick .ar-tight-list li {
  display: -webkit-box !important;
  overflow: hidden !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ar-brief--quick .ar-idea-body > p {
  -webkit-line-clamp: 1;
}

.ar-brief--quick .ar-why,
.ar-brief--quick .ar-source-row {
  display: none;
}

.ar-brief--quick .ar-academic-mini {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.ar-brief--quick .ar-academic-mini span {
  padding: 5px 6px;
}

.ar-brief--quick .ar-academic-verdict {
  display: -webkit-box !important;
  overflow: hidden !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.ar-brief--quick .ar-idea-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
}

.ar-brief--quick .ar-idea-grid section {
  max-height: 88px;
  overflow: hidden;
  padding: 7px 8px;
  border-color: rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 42%),
    rgba(2, 6, 23, 0.32);
}

.ar-brief--quick .ar-idea h3 {
  color: #f8fafc;
  font-size: 0.98rem;
  line-height: 1.25;
}

.ar-brief--quick .ar-idea-grid h4 {
  color: color-mix(in srgb, var(--idea-accent, #38bdf8) 55%, #f8fafc);
  font-size: 0.62rem;
  margin-bottom: 4px;
}

.ar-brief--quick .ar-idea-grid p,
.ar-brief--quick .ar-tight-list {
  font-size: 0.76rem;
  line-height: 1.38;
}

.ar-brief--quick .ar-idea-grid section:nth-child(4),
.ar-brief--quick .ar-tight-list li:nth-child(n + 2) {
  display: none;
}

.ar-frontiers {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
}

.ar-frontier {
  padding: 14px;
  border-color: rgba(45, 212, 191, 0.2);
  background:
    linear-gradient(135deg, rgba(45, 212, 191, 0.12), transparent 42%),
    rgba(2, 6, 23, 0.42);
}

.ar-phases {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
}

.ar-phase {
  padding: 13px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.34);
}

.ar-phase header,
.ar-idea header,
.ar-rank header,
.ar-funnel-row,
.ar-frontier header,
.ar-card header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  color: #7dd3fc;
  font: 800 0.68rem/1 var(--font-display);
  letter-spacing: 0.06em;
}

.ar-phase header b {
  color: #a7f3d0;
}

.ar-phase h3,
.ar-idea h3,
.ar-rank h3,
.ar-funnel-row h3,
.ar-frontier h3,
.ar-mini h3 {
  margin: 0;
  color: #f8fafc;
  font-size: 1.05rem;
  line-height: 1.35;
}

.ar-phase h3 {
  margin-top: 9px;
}

.ar-frontier h3 a {
  color: #f8fafc;
  text-decoration: none;
}

.ar-phase p,
.ar-idea p,
.ar-rank p,
.ar-funnel-row p,
.ar-frontier p,
.ar-mini p,
.ar-matrix p,
.ar-outline p {
  margin: 0;
  color: #aebbd0;
  line-height: 1.6;
}

.ar-landscape .muted {
  opacity: 0.66;
}

.ar-funnel-row {
  align-items: center;
  justify-content: flex-start;
  gap: 11px;
  padding: 11px 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.34);
  letter-spacing: 0;
}

.ar-funnel-row > span {
  display: grid;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgba(246, 198, 103, 0.28);
  border-radius: 50%;
  color: #f6c667;
  font: 900 0.9rem/1 var(--font-display);
}

.ar-funnel-row h3 {
  font-size: 0.9rem;
}

.ar-funnel-row p {
  margin-top: 4px;
  font-size: 0.78rem;
}

.ar-scorebar {
  display: block;
  width: 100%;
  height: 4px;
  margin-top: 8px;
  border-radius: 999px;
  background:
    linear-gradient(90deg, rgba(45, 212, 191, 0.9) var(--score), rgba(30, 41, 59, 0.92) var(--score));
}

.ar-why {
  display: grid;
  gap: 6px;
  padding: 11px 12px;
  border: 1px solid rgba(246, 198, 103, 0.22);
  border-radius: 7px;
  background: rgba(120, 53, 15, 0.12);
}

.ar-why span,
.ar-idea-grid h4,
.ar-frontier strong {
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-why a,
.ar-frontier strong {
  color: #7dd3fc;
  text-decoration: none;
}

.ar-idea-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ar-ranked {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
}

.ar-rank {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 15px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-left: 3px solid rgba(45, 212, 191, 0.72);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.12), transparent 50%),
    rgba(15, 23, 42, 0.52);
}

.ar-rank:first-child {
  border-color: rgba(246, 198, 103, 0.32);
  border-left-color: rgba(246, 198, 103, 0.9);
  background:
    linear-gradient(135deg, rgba(246, 198, 103, 0.12), transparent 44%),
    rgba(15, 23, 42, 0.58);
}

.ar-rank-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-rank-metrics span {
  padding: 4px 7px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.36);
  color: #dbeafe;
  font-size: 0.72rem;
  font-weight: 900;
}

.ar-rank-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.ar-rank-grid section {
  min-width: 0;
  padding: 11px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.34);
}

.ar-rank-grid p,
.ar-rank-grid li {
  color: #aebbd0;
  font-size: 0.84rem;
  line-height: 1.55;
}

.ar-rank-grid p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ar-rank-grid ul {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 17px;
}

.ar-idea-grid section,
.ar-mini,
.ar-matrix article,
.ar-outline article {
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 7px;
  background: rgba(2, 6, 23, 0.36);
}

.ar-idea-grid h4,
.ar-matrix span,
.ar-outline b {
  display: block;
  margin-bottom: 6px;
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ar-plan-grid {
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
}

.ar-decision {
  border-color: rgba(246, 198, 103, 0.24);
}

.ar-tight-list {
  display: grid;
  gap: 7px;
  margin: 0;
  padding-left: 18px;
  color: #dbeafe;
  font-size: 0.86rem;
  line-height: 1.56;
}

.ar-source-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ar-source-row a,
.ar-reading a {
  color: #7dd3fc;
  font-weight: 800;
  text-decoration: none;
}

.ar-source-row a {
  max-width: 100%;
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.22);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  font-size: 0.76rem;
  overflow-wrap: anywhere;
}

.ar-source-row--compact a {
  padding: 4px 7px;
  font-size: 0.7rem;
}

.ar-detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.18), transparent 34%),
    rgba(2, 6, 23, 0.78);
  backdrop-filter: blur(10px);
}

.ar-detail-sheet {
  position: relative;
  width: min(980px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  overflow: auto;
  padding: 18px;
  border: 1px solid rgba(125, 211, 252, 0.28);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(246, 198, 103, 0.1), transparent 34%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.96));
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.46), inset 0 1px rgba(255, 255, 255, 0.06);
}

.ar-detail-sheet::before,
.ar-detail-sheet::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
}

.ar-detail-sheet::before {
  background:
    linear-gradient(90deg, rgba(125, 211, 252, 0.55), transparent 72px) 0 0 / 72px 1px no-repeat,
    linear-gradient(180deg, rgba(125, 211, 252, 0.48), transparent 72px) 0 0 / 1px 72px no-repeat,
    linear-gradient(270deg, rgba(246, 198, 103, 0.38), transparent 72px) 100% 0 / 72px 1px no-repeat,
    linear-gradient(180deg, rgba(246, 198, 103, 0.32), transparent 72px) 100% 0 / 1px 72px no-repeat,
    linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.08), transparent) 0 44px / 100% 1px no-repeat;
}

.ar-detail-sheet::after {
  background: linear-gradient(115deg, transparent 0 36%, rgba(125, 211, 252, 0.1) 46%, transparent 56%) -80% 0 / 72% 100% no-repeat;
  opacity: 0.78;
  animation: arPanelSweep 8s ease-in-out infinite;
}

.ar-detail-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.ar-detail-head h2 {
  margin: 8px 0 0 !important;
  color: #f8fafc;
  font-size: clamp(1.28rem, 2vw, 1.82rem);
  line-height: 1.18;
  border-top: 0 !important;
  padding-top: 0 !important;
}

.ar-detail-head button {
  flex: none;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 7px;
  background: rgba(15, 23, 42, 0.72);
  color: #f8fafc;
  font-size: 1.45rem;
  line-height: 1;
  cursor: pointer;
}

.ar-detail-meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}

.ar-detail-meta span {
  padding: 5px 8px;
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.09);
  color: #dbeafe;
  font-size: 0.76rem;
  font-weight: 900;
}

.ar-detail-thesis {
  position: relative;
  z-index: 1;
  margin: 14px 0 0;
  color: #f8fafc;
  font-size: 1.02rem;
  font-weight: 800;
  line-height: 1.62;
}

.ar-detail-academic {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
  margin-top: 14px;
  padding: 13px;
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(14, 165, 233, 0.12), transparent 48%),
    rgba(2, 6, 23, 0.38);
}

.ar-detail-academic header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ar-detail-academic header span {
  color: #7dd3fc;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ar-detail-academic header strong {
  color: #f8d78a;
  font: 900 0.92rem/1 var(--font-display);
}

.ar-academic-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}

.ar-academic-grid span {
  min-width: 0;
  display: grid;
  gap: 5px;
  padding: 9px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 7px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 48%),
    rgba(15, 23, 42, 0.52);
}

.ar-academic-grid b,
.ar-academic-grid i {
  min-width: 0;
  font-style: normal;
}

.ar-academic-grid b {
  color: #cbd5e1;
  font-size: 0.76rem;
  line-height: 1.25;
}

.ar-academic-grid i {
  color: #f8fafc;
  font: 900 0.88rem/1 var(--font-display);
}

.ar-detail-academic p {
  margin: 0;
  color: #dbeafe;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.58;
}

.ar-detail-why {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 7px;
  margin-top: 14px;
  padding: 12px 13px;
  border: 1px solid rgba(246, 198, 103, 0.24);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(246, 198, 103, 0.12), transparent 55%),
    rgba(120, 53, 15, 0.12);
}

.ar-detail-why span,
.ar-detail-grid h3,
.ar-detail-sources h3 {
  margin: 0;
  color: #f6c667;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ar-detail-why p,
.ar-detail-grid p,
.ar-detail-grid li {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.62;
}

.ar-detail-why a {
  color: #7dd3fc;
  font-size: 0.84rem;
  font-weight: 900;
  text-decoration: none;
}

.ar-detail-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.ar-detail-grid section {
  position: relative;
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.17);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 38%),
    rgba(2, 6, 23, 0.38);
  overflow: hidden;
}

.ar-detail-grid section::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(125, 211, 252, 0.72), transparent 42%, rgba(246, 198, 103, 0.4));
  opacity: 0.58;
}

.ar-detail-grid ul {
  display: grid;
  gap: 7px;
  margin: 7px 0 0;
  padding-left: 18px;
}

.ar-detail-grid h3 {
  margin-bottom: 7px;
}

.ar-detail-sources {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
}

.ar-detail-sources .ar-source-row {
  margin-top: 9px;
}

.ar-mini strong,
.ar-matrix small,
.ar-outline small,
.ar-reading span,
.ar-frontier strong {
  display: block;
  margin-top: 8px;
  color: #dbeafe;
  font-size: 0.82rem;
  line-height: 1.55;
}

.ar-evidence {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 12px;
  margin-top: 14px;
}

.ar-card {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.54);
}

.ar-card h3 {
  margin: 0;
  font-size: 1rem;
  line-height: 1.35;
}

.ar-card h3 a {
  color: #f8fafc;
  text-decoration: none;
}

.ar-card p {
  margin: 0;
  color: #aebbd0;
  font-size: 0.86rem;
  line-height: 1.58;
}

.ar-tags span {
  padding: 4px 7px;
  border-radius: 4px;
  color: #a7f3d0;
}

.ar-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.ar-reading {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding-left: 20px;
}

.ar-reading li {
  color: #cbd5e1;
  line-height: 1.55;
}

.ar-panel pre {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  max-height: 320px;
  overflow: auto;
  margin: 12px 0 0;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 6px;
  background: rgba(2, 6, 23, 0.74);
  color: #dbeafe;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.6;
}

@keyframes arThumbScan {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.34;
  }

  45% {
    transform: translateY(34px);
    opacity: 0.86;
  }
}

@keyframes arThumbOrbit {
  to {
    transform: rotate(360deg);
  }
}

@keyframes arPanelSweep {
  0%,
  76%,
  100% {
    background-position: -80% 0;
    opacity: 0;
  }

  88% {
    background-position: 180% 0;
    opacity: 0.72;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ar-thumb-mark,
  .ar-brief--quick .ar-idea-thumb::after,
  .ar-detail-sheet::after {
    animation: none;
  }

  .ar-brief--quick .ar-idea,
  .ar-brief--quick .ar-idea::after,
  .ar-runbtn,
  .ar-mode button {
    transition: none;
  }
}

@media (max-width: 860px) {
  .ar-hero,
  .ar-grid {
    grid-template-columns: 1fr;
  }

  .ar-top-shell,
  .ar-top-columns,
  .ar-idea-grid,
  .ar-rank-grid {
    grid-template-columns: 1fr;
  }

  .ar-score-tower {
    min-height: auto;
    grid-template-columns: auto auto auto;
    justify-content: start;
    padding: 14px;
  }

  .ar-score-tower b {
    font-size: 2.1rem;
  }

  .ar-top-head {
    display: grid;
  }

  .ar-history {
    flex-basis: 100%;
    margin-left: 0;
  }

  .ar-chipline {
    justify-content: flex-start;
  }

  .ar-run {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .ar-mode {
    min-width: 0;
  }
}

@container (max-width: 760px) {
  .ar-title p {
    display: none;
  }

  .ar-stats {
    display: none;
  }

  .ar-daily {
    display: none;
  }

  .ar-run {
    grid-template-columns: 1fr;
  }

  .ar-note {
    display: none;
  }

  .ar-mode {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@container (max-width: 520px) {
  .ar-hero {
    grid-template-columns: 1fr;
  }

  .ar-brief--quick .ar-idea {
    grid-template-columns: 54px minmax(0, 1fr);
    padding: 9px;
  }

  .ar-brief--quick .ar-idea-thumb {
    padding: 6px 4px;
  }

  .ar-thumb-mark {
    width: 34px;
    height: 34px;
  }

  .ar-brief--quick .ar-idea-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ar-brief--quick .ar-idea-grid section {
    max-height: 78px;
    padding: 6px;
  }

  .ar-brief--quick .ar-idea-grid p,
  .ar-brief--quick .ar-tight-list li {
    -webkit-line-clamp: 1;
  }

  .ar-academic-mini,
  .ar-brief--quick .ar-academic-mini,
  .ar-academic-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ar-detail-backdrop {
    padding: 10px;
  }

  .ar-detail-sheet {
    width: min(100%, calc(100vw - 20px));
    max-height: calc(100vh - 20px);
    padding: 14px;
  }

  .ar-detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .ar-hero,
  .ar-panel {
    padding: 12px;
  }

  .ar-hero {
    gap: 10px;
  }

  .ar-title p {
    display: none;
  }

  .ar-stats {
    margin-top: 8px;
  }

  .ar-run {
    grid-template-columns: 1fr;
  }

  .ar-panel-head,
  .ar-rank header,
  .ar-idea header {
    display: grid;
  }

  .ar-brief--quick .ar-idea header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .ar-brief--quick .ar-idea-tension {
    display: none;
  }

  .ar-funnel-row {
    align-items: start;
  }

  .ar-funnel-row > span {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .ar-thesis,
  .ar-top-columns p,
  .ar-top-columns small {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }

  .ar-top-columns li {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ar-rank {
    gap: 10px;
    padding: 13px;
  }

  .ar-rank h3 {
    font-size: 0.98rem;
  }

  .ar-rank-grid section {
    padding: 9px;
  }

  .ar-rank-grid section:nth-child(4) {
    display: none;
  }
}

/* AutoResearch visual polish v3 */
.ar-lab,
.ar-detail-backdrop {
  --ar-polish-v3: 1;
  --ar-bg: #10130f;
  --ar-surface: rgba(22, 25, 22, 0.86);
  --ar-surface-strong: rgba(27, 30, 26, 0.94);
  --ar-line: rgba(216, 203, 169, 0.18);
  --ar-line-strong: rgba(216, 184, 110, 0.34);
  --ar-text: #f3f0e7;
  --ar-muted: #b9c0b3;
  --ar-soft: #87917f;
  --ar-gold: #d8b86e;
  --ar-sage: #9eb7a2;
  --ar-cyan: #8fc9d7;
  color: var(--ar-text);
}

.ar-lab {
  gap: 18px;
  margin-top: 18px;
}

.ar-lab::before {
  inset: -28px -22px;
  background:
    linear-gradient(180deg, rgba(216, 184, 110, 0.07), transparent 22%),
    linear-gradient(135deg, rgba(158, 183, 162, 0.09), transparent 36%),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.026) 0 1px, transparent 1px 24px),
    #0c100d;
  mask-image: linear-gradient(180deg, #000 0%, #000 88%, transparent);
  opacity: 1;
}

.ar-lab :where(
  .ar-kicker,
  .ar-panel__tag,
  .ar-history span,
  .ar-mode button,
  .ar-runbtn,
  .ar-score-tower span,
  .ar-score-tower small,
  .ar-phase header,
  .ar-idea header,
  .ar-rank header,
  .ar-funnel-row,
  .ar-frontier header,
  .ar-card header,
  .ar-why span,
  .ar-idea-grid h4,
  .ar-frontier strong,
  .ar-rank-grid h4,
  .ar-detail-academic header span,
  .ar-detail-why span,
  .ar-detail-grid h3,
  .ar-detail-sources h3
) {
  letter-spacing: 0 !important;
}

.ar-hero,
.ar-panel {
  border: 1px solid var(--ar-line);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 34%),
    linear-gradient(135deg, rgba(216, 184, 110, 0.08), transparent 36%),
    linear-gradient(180deg, var(--ar-surface-strong), rgba(12, 16, 13, 0.91));
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24), inset 0 1px rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(1.08);
}

.ar-hero::before,
.ar-panel::before {
  background:
    linear-gradient(90deg, rgba(216, 184, 110, 0.58), transparent 170px) 0 0 / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.052), transparent 42%);
}

.ar-hero::after,
.ar-panel::after,
.ar-detail-sheet::after,
.ar-brief--quick .ar-idea::after {
  content: none;
  display: none;
}

.ar-hero {
  grid-template-columns: minmax(0, 1.28fr) minmax(300px, 0.72fr);
  grid-template-areas:
    "title daily"
    "title run";
  gap: 14px;
  min-height: 330px;
  padding: 28px;
}

.ar-title {
  grid-area: title;
  justify-content: center;
  gap: 18px;
  padding: 8px 22px 8px 0;
}

.ar-daily {
  grid-area: daily;
}

.ar-run {
  grid-area: run;
}

.ar-kicker,
.ar-panel__tag {
  gap: 8px;
  color: var(--ar-gold);
  font: 800 0.78rem/1.1 var(--font-display);
}

.ar-kicker::before,
.ar-panel__tag::before {
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, var(--ar-gold), rgba(158, 183, 162, 0.64));
  box-shadow: none;
}

.ar-hero .ar-title h1 {
  max-width: 720px;
  color: var(--ar-text);
  font-size: clamp(2.4rem, 6vw, 5.4rem) !important;
  line-height: 0.96 !important;
  text-wrap: balance;
}

.ar-hero p {
  max-width: 690px;
  color: var(--ar-muted);
  font-size: 1rem;
  line-height: 1.72;
}

.ar-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  width: min(100%, 700px);
  margin-top: 4px;
}

.ar-stats span {
  justify-content: center;
  min-height: 42px;
  padding: 9px 10px;
  border-color: rgba(216, 203, 169, 0.2);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 54%),
    rgba(255, 255, 255, 0.045);
  color: var(--ar-text);
  font-size: 0.8rem !important;
}

.ar-daily,
.ar-run {
  border: 1px solid rgba(216, 203, 169, 0.18);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 48%),
    rgba(255, 255, 255, 0.042);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.055);
}

.ar-daily {
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 18px;
}

.ar-daily h2 {
  color: var(--ar-text);
  font-size: clamp(1.08rem, 1.35vw, 1.32rem);
  line-height: 1.28;
}

.ar-daily p,
.ar-daily-summary {
  color: var(--ar-muted);
  font-size: 0.94rem;
  line-height: 1.62;
}

.ar-history {
  width: 100%;
  min-width: 0;
  margin-left: 0;
}

.ar-history span {
  color: var(--ar-soft);
  font-size: 0.7rem;
}

.ar-history select {
  min-height: 38px;
  border-color: rgba(216, 203, 169, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 58%),
    #151914;
  color: var(--ar-text);
}

.ar-history select:focus {
  border-color: rgba(216, 184, 110, 0.62);
  box-shadow: 0 0 0 3px rgba(216, 184, 110, 0.13);
}

.ar-run {
  grid-template-columns: 1fr;
  align-content: end;
  gap: 12px;
  padding: 16px;
}

.ar-mode {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.ar-mode button,
.ar-runbtn,
.ar-tags span,
.ar-focus span,
.ar-constants span {
  border-color: rgba(216, 203, 169, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  color: var(--ar-muted);
}

.ar-mode button {
  min-height: 38px;
  padding: 8px 10px;
}

.ar-mode button.on {
  border-color: rgba(216, 184, 110, 0.52);
  background:
    linear-gradient(180deg, rgba(216, 184, 110, 0.18), rgba(216, 184, 110, 0.08)),
    rgba(255, 255, 255, 0.04);
  color: var(--ar-text);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.07);
}

.ar-runbtn {
  min-height: 42px;
  background:
    linear-gradient(135deg, rgba(216, 184, 110, 0.98), rgba(158, 183, 162, 0.9)),
    #d8b86e;
  color: #11150f;
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.24);
}

.ar-runbtn:hover {
  filter: brightness(1.04) saturate(1.02);
  transform: translateY(-1px);
}

.ar-note {
  color: var(--ar-soft);
  font-size: 0.8rem;
}

.ar-output {
  gap: 18px;
}

.ar-panel {
  padding: 20px;
}

.ar-panel h2,
.ar-hero h1 {
  color: var(--ar-text);
}

.ar-brief {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.048), transparent 30%),
    linear-gradient(135deg, rgba(143, 201, 215, 0.07), transparent 32%),
    linear-gradient(180deg, rgba(27, 30, 26, 0.95), rgba(13, 17, 14, 0.94));
}

.ar-brief-head {
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(216, 203, 169, 0.12);
}

.ar-focus span {
  border-color: rgba(216, 184, 110, 0.24);
  background: rgba(216, 184, 110, 0.1);
  color: #ead391;
}

.ar-brief--quick .ar-ideas {
  gap: 12px;
  margin-top: 16px;
}

.ar-brief--quick .ar-idea {
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 0;
  min-height: 218px;
  padding: 0;
  border: 1px solid rgba(216, 203, 169, 0.16);
  border-left: 1px solid rgba(216, 203, 169, 0.16);
  border-radius: 8px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--idea-accent, #d8b86e) 52%, transparent) 0 3px, transparent 3px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 40%),
    rgba(255, 255, 255, 0.038);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.06);
}

.ar-brief--quick .ar-idea::before {
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--idea-accent, #d8b86e) 38%, transparent), transparent 28%) 0 0 / 100% 1px no-repeat,
    linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.034));
  opacity: 1;
}

.ar-brief--quick .ar-idea:hover {
  border-color: color-mix(in srgb, var(--idea-accent, #d8b86e) 42%, rgba(216, 203, 169, 0.18));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 255, 255, 0.075);
  transform: translateY(-2px);
}

.ar-brief--quick .ar-idea:nth-child(1) {
  --idea-accent: #d8b86e;
}

.ar-brief--quick .ar-idea:nth-child(2) {
  --idea-accent: #9eb7a2;
}

.ar-brief--quick .ar-idea:nth-child(3) {
  --idea-accent: #8fc9d7;
}

.ar-brief--quick .ar-idea-thumb {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 14px;
  border: 0;
  border-right: 1px solid rgba(216, 203, 169, 0.12);
  border-radius: 0;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--idea-accent, #d8b86e) 14%, transparent), transparent 62%),
    rgba(0, 0, 0, 0.12);
  color: color-mix(in srgb, var(--idea-accent, #d8b86e) 76%, var(--ar-text));
}

.ar-brief--quick .ar-idea-thumb::before,
.ar-brief--quick .ar-idea-thumb::after {
  content: none;
  display: none;
}

.ar-thumb-mark {
  width: 48px;
  height: 48px;
  border: 1px solid color-mix(in srgb, var(--idea-accent, #d8b86e) 42%, rgba(216, 203, 169, 0.12));
  border-radius: 8px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--idea-accent, #d8b86e) 32%, transparent), transparent 54%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.085), transparent 48%),
    rgba(255, 255, 255, 0.035);
  box-shadow: none;
  animation: none;
}

.ar-thumb-mark::before {
  left: 12px;
  right: 12px;
  top: 23px;
  height: 1px;
  background: currentColor;
  opacity: 0.72;
  transform: rotate(-28deg);
}

.ar-thumb-mark::after {
  left: 23px;
  top: 12px;
  bottom: 12px;
  width: 1px;
  background: currentColor;
  opacity: 0.46;
  transform: rotate(28deg);
}

.ar-thumb-mark i {
  display: none;
}

.ar-brief--quick .ar-idea-thumb > span:last-child {
  color: var(--ar-muted);
  font-size: 0.7rem;
  letter-spacing: 0 !important;
}

.ar-brief--quick .ar-idea-body {
  gap: 10px;
  padding: 17px 18px 16px;
}

.ar-brief--quick .ar-idea header {
  align-items: center;
  color: var(--ar-soft);
  font-size: 0.74rem;
}

.ar-idea-rank {
  min-width: 36px;
  height: 24px;
  border-color: color-mix(in srgb, var(--idea-accent, #d8b86e) 42%, rgba(216, 203, 169, 0.16));
  border-radius: 7px;
  background: color-mix(in srgb, var(--idea-accent, #d8b86e) 14%, rgba(255, 255, 255, 0.035));
  color: var(--ar-text);
}

.ar-idea-tension {
  color: var(--ar-soft);
}

.ar-idea-score {
  color: color-mix(in srgb, var(--idea-accent, #d8b86e) 74%, var(--ar-text));
}

.ar-brief--quick .ar-idea h3 {
  color: var(--ar-text);
  font-size: clamp(1.08rem, 1.5vw, 1.3rem);
  line-height: 1.32;
  text-wrap: balance;
}

.ar-brief--quick .ar-idea-body > p {
  color: var(--ar-muted) !important;
  font-size: 0.92rem;
  line-height: 1.58 !important;
  -webkit-line-clamp: 2;
}

.ar-academic-mini {
  gap: 8px;
}

.ar-academic-mini span,
.ar-brief--quick .ar-academic-mini span {
  min-height: 36px;
  padding: 7px 8px;
  border-color: rgba(216, 203, 169, 0.14);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 52%),
    rgba(255, 255, 255, 0.04);
}

.ar-academic-mini b {
  color: var(--ar-soft);
}

.ar-academic-mini i {
  color: var(--ar-text);
}

.ar-academic-verdict {
  color: #e4dfcf !important;
  font-weight: 650;
}

.ar-brief--quick .ar-idea-grid {
  gap: 8px;
}

.ar-brief--quick .ar-idea-grid section {
  max-height: none;
  min-height: 84px;
  padding: 10px;
  border-color: rgba(216, 203, 169, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.036);
}

.ar-brief--quick .ar-idea-grid h4 {
  margin-bottom: 6px;
  color: color-mix(in srgb, var(--idea-accent, #d8b86e) 72%, var(--ar-text));
  font-size: 0.7rem;
  text-transform: none;
}

.ar-brief--quick .ar-idea-grid p,
.ar-brief--quick .ar-tight-list {
  color: var(--ar-muted);
  font-size: 0.8rem;
  line-height: 1.48;
}

.ar-top-idea,
.ar-rank:first-child {
  border-color: rgba(216, 184, 110, 0.3);
  background:
    linear-gradient(135deg, rgba(216, 184, 110, 0.1), transparent 34%),
    linear-gradient(180deg, var(--ar-surface-strong), rgba(12, 16, 13, 0.92));
}

.ar-score-tower,
.ar-top-columns section,
.ar-rank,
.ar-rank-grid section,
.ar-idea-grid section,
.ar-mini,
.ar-matrix article,
.ar-outline article,
.ar-phase,
.ar-card,
.ar-frontier,
.ar-funnel-row,
.ar-detail-academic,
.ar-detail-grid section,
.ar-detail-why {
  border-color: rgba(216, 203, 169, 0.14);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.046), transparent 46%),
    rgba(255, 255, 255, 0.036);
}

.ar-score-tower {
  border-color: rgba(216, 184, 110, 0.26);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.055);
}

.ar-score-tower b {
  color: var(--ar-text);
}

.ar-score-tower span,
.ar-score-tower small,
.ar-phase p,
.ar-idea p,
.ar-rank p,
.ar-funnel-row p,
.ar-frontier p,
.ar-mini p,
.ar-matrix p,
.ar-outline p,
.ar-top-columns p,
.ar-top-columns small,
.ar-rank-grid p,
.ar-rank-grid li,
.ar-detail-why p,
.ar-detail-grid p,
.ar-detail-grid li,
.ar-card p,
.ar-reading li {
  color: var(--ar-muted);
}

.ar-thesis,
.ar-detail-thesis {
  color: var(--ar-text);
}

.ar-top-columns h3,
.ar-rank-grid h4,
.ar-why span,
.ar-idea-grid h4,
.ar-frontier strong,
.ar-matrix span,
.ar-outline b,
.ar-detail-why span,
.ar-detail-grid h3,
.ar-detail-sources h3 {
  color: var(--ar-gold);
}

.ar-chipline span,
.ar-rank-metrics span,
.ar-detail-meta span,
.ar-source-row a,
.ar-reading a,
.ar-evidence-strip a {
  border-color: rgba(216, 203, 169, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
  color: color-mix(in srgb, var(--ar-cyan) 78%, var(--ar-text));
}

.ar-source-row a:hover,
.ar-reading a:hover,
.ar-frontier h3 a:hover,
.ar-card h3 a:hover {
  color: var(--ar-text);
}

.ar-detail-backdrop {
  background: rgba(9, 12, 10, 0.82);
  backdrop-filter: blur(16px);
}

.ar-detail-sheet {
  border-color: rgba(216, 203, 169, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.052), transparent 34%),
    linear-gradient(135deg, rgba(216, 184, 110, 0.09), transparent 34%),
    rgba(18, 22, 18, 0.98);
}

.ar-detail-sheet::before {
  background:
    linear-gradient(90deg, rgba(216, 184, 110, 0.54), transparent 110px) 0 0 / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.052), transparent 40%);
}

.ar-detail-head {
  border-bottom-color: rgba(216, 203, 169, 0.14);
}

.ar-detail-head button {
  border-color: rgba(216, 203, 169, 0.18);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.ar-panel pre {
  border-color: rgba(216, 203, 169, 0.16);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.24);
  color: #e4dfcf;
}

@media (max-width: 980px) {
  .ar-hero {
    grid-template-columns: 1fr;
    grid-template-areas:
      "title"
      "daily"
      "run";
    min-height: 0;
    padding: 22px;
  }

  .ar-title {
    padding-right: 0;
  }

  .ar-hero .ar-title h1 {
    font-size: clamp(2.15rem, 12vw, 4.2rem) !important;
  }

  .ar-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@container (max-width: 760px) {
  .ar-title p {
    display: block;
  }

  .ar-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ar-daily {
    display: grid;
  }

  .ar-run {
    grid-template-columns: 1fr;
  }
}

@container (max-width: 620px) {
  .ar-hero,
  .ar-panel {
    padding: 16px;
  }

  .ar-brief--quick .ar-idea {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .ar-brief--quick .ar-idea-thumb {
    display: none;
  }

  .ar-brief--quick .ar-idea-body {
    padding: 15px;
  }

  .ar-brief--quick .ar-academic-mini,
  .ar-academic-mini,
  .ar-academic-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ar-brief--quick .ar-idea-grid {
    display: none;
  }
}

@media (max-width: 560px) {
  .ar-hero {
    gap: 12px;
  }

  .ar-hero .ar-title h1 {
    font-size: clamp(2rem, 16vw, 3.2rem) !important;
  }

  .ar-hero p {
    font-size: 0.92rem;
    line-height: 1.62;
  }

  .ar-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }

  .ar-stats span {
    min-height: 36px;
    padding: 7px 8px;
  }

  .ar-daily,
  .ar-run {
    padding: 14px;
  }

  .ar-daily p {
    font-size: 0.88rem;
    line-height: 1.52;
  }

  .ar-brief-head {
    display: grid;
    align-items: start;
  }

  .ar-brief--quick .ar-idea-body {
    gap: 9px;
  }

  .ar-brief--quick .ar-academic-verdict {
    -webkit-line-clamp: 2;
  }
}

/* AutoResearch visual polish v4: quiet research board */
.ar-lab,
.ar-detail-backdrop {
  --ar-polish-v4: 1;
  --ar-paper-bg: #111318;
  --ar-paper-panel: rgba(20, 23, 29, 0.88);
  --ar-paper-panel-soft: rgba(255, 255, 255, 0.045);
  --ar-paper-border: rgba(236, 229, 216, 0.13);
  --ar-paper-border-strong: rgba(236, 229, 216, 0.24);
  --ar-paper-text: #f4f1ea;
  --ar-paper-muted: #c5c0b4;
  --ar-paper-soft: #928f87;
  --ar-paper-amber: #d9ba72;
  --ar-paper-blue: #8fbde8;
  --ar-paper-green: #9ab8a2;
  color: var(--ar-paper-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.ar-lab {
  gap: 16px;
  margin-top: 12px;
}

.ar-lab::before {
  display: none;
}

.ar-hero,
.ar-panel {
  border: 1px solid var(--ar-paper-border);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.018)),
    linear-gradient(135deg, rgba(217, 186, 114, 0.055), transparent 34%),
    var(--ar-paper-panel);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.22), inset 0 1px rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px) saturate(1.04);
}

.ar-hero::before,
.ar-panel::before {
  background:
    linear-gradient(90deg, rgba(217, 186, 114, 0.52), transparent 130px) 0 0 / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent 34%);
}

.ar-hero::after,
.ar-panel::after,
.ar-brief--quick .ar-idea::after {
  content: none;
  display: none;
}

.ar-hero {
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  grid-template-areas:
    "title daily"
    "title run";
  min-height: 0;
  gap: 12px;
  padding: 24px;
}

.ar-title {
  grid-area: title;
  justify-content: center;
  gap: 14px;
  padding: 0 18px 0 0;
}

.ar-daily {
  grid-area: daily;
}

.ar-run {
  grid-area: run;
}

.ar-kicker,
.ar-panel__tag {
  gap: 8px;
  color: var(--ar-paper-amber);
  font: 750 0.72rem/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0 !important;
  text-transform: none;
}

.ar-kicker::before,
.ar-panel__tag::before {
  width: 24px;
  height: 1px;
  background: linear-gradient(90deg, var(--ar-paper-amber), rgba(154, 184, 162, 0.72));
  box-shadow: none;
}

.ar-hero .ar-title h1 {
  max-width: 660px;
  color: var(--ar-paper-text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: clamp(2.25rem, 4.8vw, 4.1rem) !important;
  font-weight: 850;
  line-height: 1.04 !important;
  letter-spacing: 0 !important;
  text-wrap: balance;
}

.ar-hero p {
  max-width: 620px;
  color: var(--ar-paper-muted);
  font-size: 0.96rem;
  line-height: 1.7;
}

.ar-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 7px;
  width: min(100%, 640px);
  margin-top: 2px;
}

.ar-stats span {
  justify-content: center;
  min-height: 38px;
  padding: 8px 9px;
  border-color: rgba(236, 229, 216, 0.14);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.042);
  color: var(--ar-paper-text);
  font-size: 0.76rem !important;
  box-shadow: none;
}

.ar-daily,
.ar-run {
  border: 1px solid rgba(236, 229, 216, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.055);
}

.ar-daily {
  display: grid;
  gap: 10px;
  padding: 15px;
}

.ar-daily h2 {
  color: var(--ar-paper-text);
  font-size: clamp(1.02rem, 1.3vw, 1.22rem);
  line-height: 1.34;
}

.ar-daily p,
.ar-daily-summary {
  color: var(--ar-paper-muted);
  font-size: 0.9rem;
  line-height: 1.58;
}

.ar-history {
  width: 100%;
  min-width: 0;
  margin-left: 0;
}

.ar-history span {
  color: var(--ar-paper-soft);
  font: 700 0.68rem/1.1 Inter, ui-sans-serif, system-ui, sans-serif;
  letter-spacing: 0 !important;
}

.ar-history select {
  min-height: 36px;
  border-color: rgba(236, 229, 216, 0.15);
  border-radius: 8px;
  background: rgba(12, 14, 18, 0.72);
  color: var(--ar-paper-text);
  font-size: 0.78rem;
}

.ar-history select:focus {
  border-color: rgba(217, 186, 114, 0.56);
  box-shadow: 0 0 0 3px rgba(217, 186, 114, 0.12);
}

.ar-run {
  grid-template-columns: 1fr;
  align-content: end;
  gap: 10px;
  padding: 14px;
}

.ar-mode {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.ar-mode button,
.ar-runbtn,
.ar-tags span,
.ar-focus span,
.ar-constants span {
  border-color: rgba(236, 229, 216, 0.13);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.042);
  color: var(--ar-paper-muted);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.ar-mode button {
  min-height: 36px;
  padding: 8px 10px;
}

.ar-mode button.on {
  border-color: rgba(217, 186, 114, 0.46);
  background: rgba(217, 186, 114, 0.12);
  color: var(--ar-paper-text);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.06);
}

.ar-runbtn {
  min-height: 40px;
  background:
    linear-gradient(135deg, rgba(232, 207, 145, 0.96), rgba(154, 184, 162, 0.92)),
    #d9ba72;
  color: #111318;
  box-shadow: none;
}

.ar-runbtn:hover {
  filter: brightness(1.03);
  transform: translateY(-1px);
}

.ar-note {
  color: var(--ar-paper-soft);
  font-size: 0.78rem;
}

.ar-output {
  gap: 16px;
}

.ar-panel {
  padding: 18px;
}

.ar-panel h2,
.ar-panel h3,
.ar-hero h1 {
  color: var(--ar-paper-text);
}

.ar-brief {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02)),
    linear-gradient(135deg, rgba(143, 189, 232, 0.055), transparent 28%),
    var(--ar-paper-panel);
}

.ar-brief-head {
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(236, 229, 216, 0.1);
}

.ar-focus span {
  padding: 5px 8px;
  border-color: rgba(217, 186, 114, 0.22);
  background: rgba(217, 186, 114, 0.1);
  color: #e8cf91;
  font-size: 0.7rem;
}

.ar-brief--quick .ar-ideas {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.ar-brief--quick .ar-idea {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  min-height: 292px;
  padding: 0;
  border: 1px solid rgba(236, 229, 216, 0.13);
  border-left: 1px solid rgba(236, 229, 216, 0.13);
  border-radius: 8px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--idea-accent, #d9ba72) 11%, transparent), transparent 48%),
    rgba(255, 255, 255, 0.036);
  box-shadow: none;
}

.ar-brief--quick .ar-idea::before {
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--idea-accent, #d9ba72) 62%, transparent), transparent 42%) 0 0 / 100% 2px no-repeat;
  opacity: 0.9;
}

.ar-brief--quick .ar-idea:hover {
  border-color: color-mix(in srgb, var(--idea-accent, #d9ba72) 40%, rgba(236, 229, 216, 0.16));
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
  transform: translateY(-2px);
}

.ar-brief--quick .ar-idea:nth-child(1) {
  --idea-accent: #d9ba72;
}

.ar-brief--quick .ar-idea:nth-child(2) {
  --idea-accent: #8fbde8;
}

.ar-brief--quick .ar-idea:nth-child(3) {
  --idea-accent: #9ab8a2;
}

.ar-brief--quick .ar-idea-thumb {
  display: none;
}

.ar-brief--quick .ar-idea-body {
  gap: 10px;
  padding: 16px;
}

.ar-brief--quick .ar-idea header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: var(--ar-paper-soft);
  font: 700 0.72rem/1.2 Inter, ui-sans-serif, system-ui, sans-serif;
}

.ar-idea-rank {
  min-width: 34px;
  height: 24px;
  border-color: color-mix(in srgb, var(--idea-accent, #d9ba72) 36%, rgba(236, 229, 216, 0.16));
  border-radius: 7px;
  background: color-mix(in srgb, var(--idea-accent, #d9ba72) 12%, rgba(255, 255, 255, 0.04));
  color: var(--ar-paper-text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.ar-idea-tension {
  flex: 1 1 100%;
  margin-top: 4px;
  color: var(--ar-paper-soft);
  white-space: normal;
}

.ar-idea-score {
  margin-left: auto;
  color: color-mix(in srgb, var(--idea-accent, #d9ba72) 74%, var(--ar-paper-text));
}

.ar-brief--quick .ar-idea h3 {
  color: var(--ar-paper-text);
  font-size: 1.02rem;
  font-weight: 780;
  line-height: 1.38;
  text-wrap: balance;
}

.ar-brief--quick .ar-idea-body > p {
  color: var(--ar-paper-muted) !important;
  font-size: 0.86rem;
  line-height: 1.56 !important;
  -webkit-line-clamp: 3;
}

.ar-academic-mini,
.ar-brief--quick .ar-academic-mini {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.ar-academic-mini span,
.ar-brief--quick .ar-academic-mini span {
  min-height: 34px;
  padding: 7px 8px;
  border-color: rgba(236, 229, 216, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
}

.ar-academic-mini b {
  color: var(--ar-paper-soft);
  font-size: 0.66rem;
}

.ar-academic-mini i {
  color: var(--ar-paper-text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}

.ar-academic-verdict {
  color: #e7e1d5 !important;
  font-size: 0.82rem;
  font-weight: 620;
  line-height: 1.5 !important;
}

.ar-brief--quick .ar-academic-verdict {
  display: -webkit-box !important;
  overflow: hidden !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ar-brief--quick .ar-why,
.ar-brief--quick .ar-source-row,
.ar-brief--quick .ar-idea-grid {
  display: none;
}

.ar-score-tower,
.ar-top-columns section,
.ar-rank,
.ar-rank-grid section,
.ar-idea-grid section,
.ar-mini,
.ar-matrix article,
.ar-outline article,
.ar-phase,
.ar-card,
.ar-frontier,
.ar-funnel-row,
.ar-detail-academic,
.ar-detail-grid section,
.ar-detail-why {
  border-color: rgba(236, 229, 216, 0.11);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
}

.ar-top-idea,
.ar-rank:first-child {
  border-color: rgba(217, 186, 114, 0.24);
  background:
    linear-gradient(135deg, rgba(217, 186, 114, 0.08), transparent 30%),
    var(--ar-paper-panel);
}

.ar-score-tower b,
.ar-thesis,
.ar-detail-thesis,
.ar-frontier h3 a,
.ar-card h3 a {
  color: var(--ar-paper-text);
}

.ar-score-tower span,
.ar-score-tower small,
.ar-phase p,
.ar-idea p,
.ar-rank p,
.ar-funnel-row p,
.ar-frontier p,
.ar-mini p,
.ar-matrix p,
.ar-outline p,
.ar-top-columns p,
.ar-top-columns small,
.ar-rank-grid p,
.ar-rank-grid li,
.ar-detail-why p,
.ar-detail-grid p,
.ar-detail-grid li,
.ar-card p,
.ar-reading li {
  color: var(--ar-paper-muted);
}

.ar-top-columns h3,
.ar-rank-grid h4,
.ar-why span,
.ar-idea-grid h4,
.ar-frontier strong,
.ar-matrix span,
.ar-outline b,
.ar-detail-why span,
.ar-detail-grid h3,
.ar-detail-sources h3 {
  color: var(--ar-paper-amber);
  text-transform: none;
}

.ar-chipline span,
.ar-rank-metrics span,
.ar-detail-meta span,
.ar-source-row a,
.ar-reading a,
.ar-evidence-strip a {
  border-color: rgba(236, 229, 216, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: color-mix(in srgb, var(--ar-paper-blue) 78%, var(--ar-paper-text));
}

@media (max-width: 980px) {
  .ar-hero {
    grid-template-columns: 1fr;
    grid-template-areas:
      "title"
      "daily"
      "run";
    padding: 18px;
  }

  .ar-title {
    padding-right: 0;
  }

  .ar-hero .ar-title h1 {
    font-size: clamp(2rem, 10vw, 3.4rem) !important;
  }

  .ar-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@container (max-width: 760px) {
  .ar-brief--quick .ar-ideas {
    grid-template-columns: 1fr;
  }

  .ar-brief--quick .ar-idea {
    min-height: 0;
  }
}

@media (max-width: 560px) {
  .ar-detail-backdrop {
    padding: 10px;
  }

  .ar-detail-sheet {
    width: calc(100vw - 20px);
    max-height: calc(100dvh - 20px);
    padding: 14px;
  }

  .ar-detail-grid {
    grid-template-columns: 1fr;
  }

  .ar-hero,
  .ar-panel {
    padding: 15px;
  }

  .ar-hero .ar-title h1 {
    font-size: clamp(2rem, 14vw, 3rem) !important;
  }

  .ar-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ar-brief--quick .ar-idea-body {
    padding: 14px;
  }

  .ar-brief--quick .ar-idea-body > p {
    -webkit-line-clamp: 2;
  }
}
</style>

<!--
  Page-level layout overrides (unscoped). The frontmatter sets
  `aside: false`, which frees the doc column from its default ~688px
  cap so this multi-panel lab can use its intended full width. Here we
  keep that width tasteful: capped and centered on ultra-wide screens.
-->
<style>
.ar-page .content-container {
  max-width: 1280px;
  margin-inline: auto;
}

.ar-page .VPDoc {
  padding-bottom: 40px;
}
</style>
