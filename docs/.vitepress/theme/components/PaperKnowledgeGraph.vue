<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as paperData } from '../../data/papers.data.mjs'
import { ROUTE_COLORS } from '../route-colors.mjs'

const W = 1180
const H = 940
const VLA_SET = new Set(['离散 token', '连续 · 扩散/流匹配', '混合 · 连续回归', '分层 · 双系统/推理', '新范式探索'])
const KNOWLEDGE_KINDS = new Set(['concept', 'data', 'benchmark', 'robot', 'org'])
const KNOWLEDGE_RELATIONS = new Set(['concept', 'data', 'benchmark', 'robot', 'org'])

const graphMode = ref('paper')
const trackFilter = ref('all')
const relationFilter = ref('all')
const routeFilter = ref('all')
const knowledgeKindFilter = ref('all')
const query = ref('')
const activeId = ref('')

const BRIDGES = [
  ['rt1', 'rt2', '离散动作前史'],
  ['rt2', 'openvla', '动作 token 开源化'],
  ['openvla', 'openvla-oft', '离散→连续回归'],
  ['diffusion-policy', 'octo', '扩散策略规模化'],
  ['pi0', 'pi05', 'PI 系列'],
  ['pi05', 'pi06', 'PI 系列'],
  ['pi06', 'pi07', 'PI 系列'],
  ['pi0', 'groot-n1', '流匹配/DiT'],
  ['groot-n1', 'groot-n2', 'NVIDIA VLA→WAM'],
  ['qwen-vla', 'qwen-robotmanip', 'Qwen 操作分支'],
  ['qwen-vla', 'qwen-robotnav', 'Qwen 导航分支'],
  ['qwen-vla', 'qwen-robotworld', 'Qwen 世界模型分支'],
  ['wall-oss', 'wall-oss-05', 'WALL 梯度桥接'],
  ['rynnvla', 'rynnvla-002', 'Rynn VLA→WAM'],
  ['worldvla', 'rynnvla-002', '自回归联合建模'],
  ['uwm', 'x-wam', '耦合扩散改进'],
  ['dreamzero', 'groot-n2', 'WAM 架构延伸'],
  ['dreamzero', 'gigaworld-policy', '零样本策略同族'],
  ['genie-envisioner', 'ge-sim-2', '智元世界模拟'],
  ['go-1', 'genie-envisioner', 'AgiBot 数据生态'],
  ['gr-3', 'gr-dexter', 'Seed 双臂→灵巧手'],
  ['memoryvla', 'memoryvla-plusplus', '记忆→想象'],
  ['steervla', 'steerable-policies', '分层可控策略'],
  ['qwen-robotmanip', 'qwen-robotworld', '数据合成/世界模型'],
]

const IMPORTANT = new Set([
  'rt2', 'openvla', 'pi0', 'pi05', 'pi06', 'pi07', 'groot-n1', 'qwen-vla',
  'qwen-robotmanip', 'qwen-robotnav', 'qwen-robotworld', 'rynnvla', 'rynnvla-002',
  'worldvla', 'dreamzero', 'x-wam', 'groot-n2', 'diffusion-policy', 'octo',
])

const KIND_META = {
  track: { label: '主线', color: '#38bdf8' },
  route: { label: '路线', color: '#34d399' },
  paper: { label: '论文', color: '#c084fc' },
  concept: { label: '知识概念', color: '#22d3ee' },
  data: { label: '数据', color: '#34d399' },
  benchmark: { label: '基准', color: '#f59e0b' },
  robot: { label: '本体', color: '#fb7185' },
  org: { label: '机构', color: '#a78bfa' },
}

const KNOWLEDGE_NODES = [
  { id: 'concept:action-token', kind: 'concept', label: '动作 token', lane: 'concept-a', detail: '把动作离散进语言词表,RT-2 / OpenVLA 路线的核心接口。', link: '/vla/papers/glossary' },
  { id: 'concept:action-chunk', kind: 'concept', label: '动作分块', lane: 'concept-a', detail: '一次生成短 horizon 动作序列,降低推理频率并提升连续性。', link: '/vla/papers/glossary' },
  { id: 'concept:flow-matching', kind: 'concept', label: '流匹配', lane: 'concept-a', detail: '连续动作生成的主流训练目标,π0 / GR00T / Qwen-RobotManip 常用。', link: '/vla/papers/glossary' },
  { id: 'concept:diffusion-policy', kind: 'concept', label: '扩散策略', lane: 'concept-a', detail: '条件去噪生成连续动作,是连续操作策略的重要起点。', link: '/vla/papers/diffusion-policy' },
  { id: 'concept:dit-action', kind: 'concept', label: 'DiT 动作头', lane: 'concept-a', detail: '用 Transformer 去噪器承载连续动作专家。', link: '/vla/papers/models-spec' },
  { id: 'concept:dual-system', kind: 'concept', label: '双系统', lane: 'concept-a', detail: '慢速语义推理与快速控制执行解耦。', link: '/vla/papers/dual-system-architecture' },
  { id: 'concept:knowledge-insulation', kind: 'concept', label: '知识隔离', lane: 'concept-a', detail: '隔离动作梯度对语言/视觉知识的破坏,PI 系列关键配方。', link: '/vla/papers/knowledge-insulation' },
  { id: 'concept:online-rl', kind: 'concept', label: '在线 RL', lane: 'concept-a', detail: '从真机/环境反馈继续优化策略。', link: '/vla/papers/rl-token' },
  { id: 'concept:world-model', kind: 'concept', label: '世界模型', lane: 'concept-b', detail: '显式或隐式预测未来状态,连接 WAM 与预测式 VLA。', link: '/wam/' },
  { id: 'concept:predictive-policy', kind: 'concept', label: '预测式策略', lane: 'concept-b', detail: '先预演未来,再反推动作或选择动作。', link: '/vla/papers/predictive-vla' },
  { id: 'concept:latent-action', kind: 'concept', label: '潜动作', lane: 'concept-b', detail: '从视频中学习可复用的隐式动作码。', link: '/vla/papers/embodied-data' },
  { id: 'concept:affordance', kind: 'concept', label: 'Affordance', lane: 'concept-b', detail: '以可供性作为任务相关中间表征。', link: '/vla/papers/affordancevla' },
  { id: 'concept:spatial-3d', kind: 'concept', label: '3D 空间表征', lane: 'concept-b', detail: '把点云、深度或空间位置显式接入策略。', link: '/vla/papers/spatialvla' },
  { id: 'concept:memory-imagination', kind: 'concept', label: '记忆/想象', lane: 'concept-b', detail: '用过去记忆与未来想象补足单步反应策略。', link: '/vla/papers/memoryvla-plusplus' },
  { id: 'concept:state-action-align', kind: 'concept', label: '状态动作对齐', lane: 'concept-b', detail: '跨本体 state/action 接口统一,决定多机器人数据能否混训。', link: '/vla/papers/qwen-robotmanip' },
  { id: 'concept:h2r-retarget', kind: 'concept', label: 'H2R 重定向', lane: 'concept-b', detail: '把人类动作/视频转成机器人可训练动作。', link: '/vla/papers/data-processing' },
  { id: 'concept:motion-control', kind: 'concept', label: '运控层', lane: 'concept-b', detail: 'IK、轨迹、约束和底层控制把策略动作落到硬件。', link: '/vla/papers/motion-control' },
  { id: 'concept:inference-deploy', kind: 'concept', label: '推理部署', lane: 'concept-b', detail: '量化、缓存、并行化与实时控制频率约束。', link: '/vla/papers/inference-deployment' },

  { id: 'data:oxe', kind: 'data', label: 'OXE', detail: '跨机构多本体机器人数据底座。', link: '/vla/papers/embodied-data' },
  { id: 'data:droid', kind: 'data', label: 'DROID', detail: 'Franka 真实遥操作数据,常用于微调和泛化评测。', link: '/vla/papers/embodied-data' },
  { id: 'data:bridge', kind: 'data', label: 'BridgeData', detail: 'WidowX/Bridge 系列桌面操作数据。', link: '/vla/papers/embodied-data' },
  { id: 'data:robomind', kind: 'data', label: 'RoboMIND', detail: '多本体具身数据集,常被作为规模化数据来源。', link: '/vla/papers/embodied-data' },
  { id: 'data:ego-video', kind: 'data', label: '第一视角视频', detail: '人类操作视频提供语义与动态先验,需伪动作/重定向。', link: '/vla/papers/embodied-data' },
  { id: 'data:qwen-38100h', kind: 'data', label: 'Qwen 38.1k h', detail: 'Qwen-RobotManip 官方报告的操作训练语料规模口径。', link: '/vla/papers/qwen-robotmanip' },
  { id: 'data:cosmos', kind: 'data', label: 'Cosmos', detail: 'NVIDIA 世界基础模型/数据与仿真底座。', link: '/wam/papers/cosmos3' },

  { id: 'bench:libero', kind: 'benchmark', label: 'LIBERO', detail: '语言条件桌面操作评测,常用于 VLA 横评。', link: '/vla/papers/benchmarks' },
  { id: 'bench:simpler', kind: 'benchmark', label: 'SimplerEnv', detail: '真机对齐仿真评测,RT/OpenVLA 系常用。', link: '/vla/papers/benchmarks' },
  { id: 'bench:calvin', kind: 'benchmark', label: 'CALVIN', detail: '长程链式桌面操作评测。', link: '/vla/papers/benchmarks' },
  { id: 'bench:robocasa', kind: 'benchmark', label: 'RoboCasa', detail: '厨房长程与组合泛化操作基准。', link: '/vla/papers/benchmarks' },
  { id: 'bench:robotwin', kind: 'benchmark', label: 'RoboTwin', detail: '双臂/跨本体/指令跟随评测族。', link: '/vla/papers/benchmarks' },
  { id: 'bench:robochallenge', kind: 'benchmark', label: 'RoboChallenge', detail: '真实机器人挑战赛口径,含 Table30 v1。', link: '/vla/papers/benchmarks' },
  { id: 'bench:ebench', kind: 'benchmark', label: 'EBench', detail: 'Isaac Sim 室内操作泛化评测。', link: '/vla/papers/benchmarks' },

  { id: 'robot:widowx', kind: 'robot', label: 'WidowX', detail: 'Bridge / SimplerEnv 常见桌面单臂平台。', link: '/vla/papers/robots' },
  { id: 'robot:franka', kind: 'robot', label: 'Franka', detail: '学术界常用 7-DoF 协作臂,DROID/CALVIN 相关。', link: '/vla/papers/robots' },
  { id: 'robot:aloha', kind: 'robot', label: 'ALOHA', detail: '双臂遥操作与长程桌面操作常用本体。', link: '/vla/papers/robots' },
  { id: 'robot:unitree-g1', kind: 'robot', label: 'Unitree G1', detail: 'GR00T 系列常见人形迁移目标。', link: '/vla/papers/robots' },
  { id: 'robot:gr1', kind: 'robot', label: 'Fourier GR-1', detail: 'GR00T N1/N1.5 相关人形平台。', link: '/vla/papers/robots' },
  { id: 'robot:arx', kind: 'robot', label: 'ARX', detail: 'Qwen-RobotManip few-shot 真机适配涉及的平台。', link: '/vla/papers/robots' },
  { id: 'robot:figure', kind: 'robot', label: 'Figure', detail: 'Helix 所在的人形本体体系。', link: '/vla/papers/robots' },

  { id: 'org:qwen', kind: 'org', label: 'Qwen', detail: 'Qwen-VLA / Qwen-Robot 系列。', link: '/news/qwen-robot' },
  { id: 'org:pi', kind: 'org', label: 'PI', detail: 'Physical Intelligence, π0 / π0.5 / π0.6 / π0.7 系列。', link: '/vla/papers/pi0' },
  { id: 'org:nvidia', kind: 'org', label: 'NVIDIA', detail: 'GR00T / Cosmos / DreamZero 相关生态。', link: '/vla/papers/groot-n1' },
  { id: 'org:deepmind', kind: 'org', label: 'DeepMind', detail: 'Gemini Robotics 与 RT 系列源头。', link: '/vla/papers/gemini-robotics' },
  { id: 'org:xsquare', kind: 'org', label: 'X Square', detail: 'WALL-OSS / WALL-WM / Wall-OSS-0.5。', link: '/vla/papers/wall-oss' },
  { id: 'org:damo', kind: 'org', label: 'DAMO', detail: 'RynnVLA / RynnBrain / RynnVLA-002。', link: '/vla/papers/rynnvla' },
  { id: 'org:agibot', kind: 'org', label: 'AgiBot', detail: 'GO-1 / Genie Envisioner / GE-Sim 2.0 相关。', link: '/vla/papers/go-1' },
  { id: 'org:seed', kind: 'org', label: 'ByteDance Seed', detail: 'GR-3 / GR-Dexter 双臂与灵巧手路线。', link: '/vla/papers/gr-3' },
]

const KNOWLEDGE_EDGES = [
  ['rt2', 'concept:action-token', '动作离散化'],
  ['openvla', 'concept:action-token', '继承动作 token'],
  ['pi0-fast', 'concept:action-token', 'FAST 分词'],
  ['pi0-fast', 'concept:action-chunk', '高频动作块'],
  ['diffusion-policy', 'concept:diffusion-policy', '范式源头'],
  ['diffusion-policy', 'concept:action-chunk', '动作分块'],
  ['octo', 'concept:diffusion-policy', '扩散策略'],
  ['pi0', 'concept:flow-matching', '流匹配'],
  ['pi0', 'concept:action-chunk', '动作块'],
  ['pi0', 'concept:dit-action', '动作专家'],
  ['cogact', 'concept:dit-action', '认知+动作头'],
  ['groot-n1', 'concept:dual-system', '双系统'],
  ['groot-n1', 'concept:flow-matching', '流匹配'],
  ['groot-n1', 'concept:dit-action', 'DiT 动作头'],
  ['qwen-vla', 'concept:state-action-align', '统一动作接口'],
  ['qwen-robotmanip', 'concept:flow-matching', '流匹配'],
  ['qwen-robotmanip', 'concept:state-action-align', '跨本体对齐'],
  ['qwen-robotmanip', 'concept:h2r-retarget', '人到机器人合成'],
  ['qwen-robotmanip', 'concept:motion-control', '操作执行接口'],
  ['qwen-robotnav', 'concept:motion-control', 'waypoint 执行'],
  ['gemini-robotics', 'concept:dual-system', '云端/本机解耦'],
  ['helix', 'concept:dual-system', '快慢系统'],
  ['pi06', 'concept:knowledge-insulation', 'KI 配方'],
  ['pi06', 'concept:online-rl', '真机经验学习'],
  ['pi07', 'concept:knowledge-insulation', 'KI 延展'],
  ['pi07', 'concept:online-rl', '组合泛化/RL'],
  ['simplevla-rl', 'concept:online-rl', '在线 RL'],
  ['rl-token', 'concept:online-rl', 'RL Token'],
  ['spatialvla', 'concept:spatial-3d', '空间 VLA'],
  ['pointact', 'concept:spatial-3d', '点云动作专家'],
  ['affordancevla', 'concept:affordance', '中间表征'],
  ['memoryvla', 'concept:memory-imagination', '记忆增强'],
  ['memoryvla-plusplus', 'concept:memory-imagination', '记忆+想象'],
  ['openvla-oft', 'concept:inference-deploy', '并行解码'],
  ['faster', 'concept:inference-deploy', '流匹配加速'],
  ['faster', 'concept:motion-control', '实时执行'],
  ['inference-deployment', 'concept:inference-deploy', '部署专题'],
  ['motion-control', 'concept:motion-control', '运控专题'],

  ['vpp', 'concept:predictive-policy', '预测性表征'],
  ['vpp', 'concept:world-model', '视频预测'],
  ['worldvla', 'concept:world-model', '世界+动作'],
  ['rynnvla', 'concept:latent-action', 'ActionVAE'],
  ['rynnvla', 'concept:world-model', '视频生成先验'],
  ['rynnvla-002', 'concept:world-model', '联合建模'],
  ['dreamzero', 'concept:world-model', '零样本策略'],
  ['groot-n2', 'concept:world-model', 'WAM 架构'],
  ['qwen-robotworld', 'concept:world-model', '视频世界模型'],
  ['genie-envisioner', 'concept:world-model', '世界模拟'],
  ['genie-envisioner', 'concept:latent-action', '潜动作'],
  ['x-wam', 'concept:world-model', '耦合扩散'],
  ['cosmos3', 'concept:world-model', '全模态世界模型'],
  ['tau0-wm', 'concept:predictive-policy', '测试时搜索'],
  ['gigaworld-policy', 'concept:online-rl', '世界模型 RL'],

  ['openvla', 'data:oxe', '预训练数据'],
  ['octo', 'data:oxe', '预训练数据'],
  ['rt2', 'data:oxe', 'RT-X 数据生态'],
  ['openvla-oft', 'data:droid', '微调/评测'],
  ['pi0', 'data:bridge', '预训练/评测'],
  ['qwen-robotmanip', 'data:qwen-38100h', '训练语料'],
  ['qwen-robotmanip', 'data:robomind', '开源机器人数据'],
  ['qwen-robotmanip', 'data:ego-video', '人类视频'],
  ['groot-n1', 'data:ego-video', '数据金字塔'],
  ['rynnvla', 'data:ego-video', '视频先验'],
  ['cosmos3', 'data:cosmos', '世界模型底座'],
  ['groot-n2', 'data:cosmos', 'NVIDIA 生态'],

  ['openvla', 'bench:simpler', '评测'],
  ['cogact', 'bench:simpler', '评测'],
  ['openvla-oft', 'bench:libero', '评测'],
  ['octo', 'bench:libero', '评测'],
  ['pi0', 'bench:libero', '评测'],
  ['qwen-robotmanip', 'bench:libero', 'LIBERO-Plus'],
  ['qwen-robotmanip', 'bench:robocasa', 'RoboCasa365'],
  ['qwen-robotmanip', 'bench:robotwin', 'RoboTwin'],
  ['qwen-robotmanip', 'bench:robochallenge', 'Table30 v1'],
  ['qwen-robotmanip', 'bench:ebench', '评测'],
  ['vpp', 'bench:calvin', 'CALVIN ABC-D'],
  ['dreamzero', 'bench:robocasa', '厨房任务'],
  ['groot-n1', 'bench:robocasa', '评测'],

  ['openvla', 'robot:widowx', 'Bridge/WidowX'],
  ['octo', 'robot:widowx', '多本体'],
  ['openvla-oft', 'robot:franka', 'Franka 微调'],
  ['gemini-robotics', 'robot:franka', '真机'],
  ['gemini-robotics', 'robot:aloha', '双臂'],
  ['qwen-robotmanip', 'robot:aloha', '双臂平台'],
  ['qwen-robotmanip', 'robot:franka', '真机平台'],
  ['qwen-robotmanip', 'robot:arx', 'few-shot'],
  ['groot-n1', 'robot:gr1', '人形平台'],
  ['groot-n1', 'robot:unitree-g1', '迁移目标'],
  ['helix', 'robot:figure', '人形本体'],

  ['qwen-vla', 'org:qwen', 'Qwen 系'],
  ['qwen-robotmanip', 'org:qwen', 'Qwen 系'],
  ['qwen-robotnav', 'org:qwen', 'Qwen 系'],
  ['qwen-robotworld', 'org:qwen', 'Qwen 系'],
  ['pi0', 'org:pi', 'PI 系'],
  ['pi05', 'org:pi', 'PI 系'],
  ['pi06', 'org:pi', 'PI 系'],
  ['pi07', 'org:pi', 'PI 系'],
  ['groot-n1', 'org:nvidia', 'NVIDIA'],
  ['groot-n2', 'org:nvidia', 'NVIDIA'],
  ['cosmos3', 'org:nvidia', 'NVIDIA'],
  ['gemini-robotics', 'org:deepmind', 'DeepMind'],
  ['wall-oss', 'org:xsquare', 'X Square'],
  ['wall-oss-05', 'org:xsquare', 'X Square'],
  ['wall-wm', 'org:xsquare', 'X Square'],
  ['rynnvla', 'org:damo', 'DAMO'],
  ['rynnvla-002', 'org:damo', 'DAMO'],
  ['rynnbrain', 'org:damo', 'DAMO'],
  ['go-1', 'org:agibot', 'AgiBot'],
  ['genie-envisioner', 'org:agibot', 'AgiBot'],
  ['ge-sim-2', 'org:agibot', 'AgiBot'],
  ['gr-3', 'org:seed', 'ByteDance Seed'],
  ['gr-dexter', 'org:seed', 'ByteDance Seed'],
]

const papers = computed(() => paperData.papers || [])
const paperBySlug = computed(() => Object.fromEntries(papers.value.map((p) => [p.slug, p])))
const routeOptions = computed(() => (paperData.routes || []).filter((r) => {
  if (trackFilter.value === 'all') return true
  return trackFilter.value === 'vla' ? VLA_SET.has(r) : !VLA_SET.has(r)
}))

function sideOf(route) {
  return VLA_SET.has(route) ? 'vla' : 'wam'
}

function paperVisible(p) {
  if (trackFilter.value !== 'all' && p.track.toLowerCase() !== trackFilter.value) return false
  if (routeFilter.value !== 'all' && p.route !== routeFilter.value) return false
  return true
}

function knowledgeVisible(n) {
  return graphMode.value === 'knowledge' && (knowledgeKindFilter.value === 'all' || n.kind === knowledgeKindFilter.value)
}

function edgeKindFor(targetId) {
  const node = KNOWLEDGE_NODES.find((n) => n.id === targetId)
  return node?.kind || 'concept'
}

function setGraphMode(mode) {
  graphMode.value = mode
  relationFilter.value = mode === 'knowledge' ? 'knowledge' : 'all'
}

function geomFor(side) {
  if (trackFilter.value !== 'all') {
    return { trackX: 130, hubX: 132, minX: 210, maxX: 1094 }
  }
  return side === 'vla'
    ? { trackX: 305, hubX: 305, minX: 76, maxX: 542 }
    : { trackX: 875, hubX: 875, minX: 638, maxX: 1112 }
}

function pathBetween(a, b) {
  const mx = (a.x + b.x) / 2
  const bend = Math.abs(a.y - b.y) < 4 ? -26 : 0
  return `M ${a.x} ${a.y} C ${mx} ${a.y + bend} ${mx} ${b.y + bend} ${b.x} ${b.y}`
}

function layoutKnowledgeNodes() {
  const lanes = {
    'concept-a': { y: 660, minX: 60, maxX: 1120 },
    'concept-b': { y: 708, minX: 60, maxX: 1120 },
    data: { y: 772, minX: 84, maxX: 1096 },
    benchmark: { y: 824, minX: 84, maxX: 1096 },
    robot: { y: 876, minX: 94, maxX: 1086 },
    org: { y: 916, minX: 94, maxX: 1086 },
  }
  const grouped = new Map()
  for (const n of KNOWLEDGE_NODES.filter(knowledgeVisible)) {
    const lane = n.lane || n.kind
    if (!grouped.has(lane)) grouped.set(lane, [])
    grouped.get(lane).push(n)
  }
  const out = []
  for (const [lane, list] of grouped.entries()) {
    const g = lanes[lane] || lanes.data
    list.forEach((n, i) => {
      const x = list.length === 1 ? (g.minX + g.maxX) / 2 : g.minX + (i / (list.length - 1)) * (g.maxX - g.minX)
      out.push({
        ...n,
        x,
        y: g.y,
        r: 6,
        w: n.kind === 'org' ? 106 : 112,
        h: 25,
        color: KIND_META[n.kind]?.color || '#22d3ee',
        track: KIND_META[n.kind]?.label || '知识节点',
        route: n.kind === 'concept' ? '知识概念' : KIND_META[n.kind]?.label,
      })
    })
  }
  return out
}

const graph = computed(() => {
  const nodeMap = new Map()
  const edges = []
  const routes = routeOptions.value.filter((r) => routeFilter.value === 'all' || r === routeFilter.value)
  const sides = trackFilter.value === 'all'
    ? ['vla', 'wam']
    : [trackFilter.value]

  for (const side of sides) {
    const trackLabel = side === 'vla' ? 'VLA' : 'WAM'
    const geom = geomFor(side)
    nodeMap.set(`track:${side}`, {
      id: `track:${side}`,
      kind: 'track',
      label: trackLabel,
      detail: side === 'vla' ? '视觉-语言-动作策略' : '世界-行动模型',
      x: geom.trackX,
      y: 52,
      r: 25,
      color: side === 'vla' ? '#38bdf8' : '#c084fc',
      track: trackLabel,
    })
  }

  const groupedRoutes = {
    vla: routes.filter((r) => sideOf(r) === 'vla'),
    wam: routes.filter((r) => sideOf(r) === 'wam'),
  }

  for (const side of Object.keys(groupedRoutes)) {
    const list = groupedRoutes[side]
    if (!list.length) continue
    const geom = geomFor(side)
    const startY = trackFilter.value === 'all' ? (side === 'vla' ? 150 : 128) : 132
    const gap = trackFilter.value === 'all' ? (side === 'vla' ? 112 : 92) : 94
    list.forEach((route, ri) => {
      const routeId = `route:${route}`
      const color = ROUTE_COLORS[route] || '#94a3b8'
      const y = startY + ri * gap
      nodeMap.set(routeId, {
        id: routeId,
        kind: 'route',
        label: route,
        detail: side === 'vla' ? 'VLA 技术路线' : 'WAM 范式路线',
        route,
        x: geom.hubX,
        y,
        r: 17,
        color,
        track: side === 'vla' ? 'VLA' : 'WAM',
      })
      edges.push({ id: `track-${route}`, type: 'track', source: `track:${side}`, target: routeId, label: '路线' })
      const src = (paperData.byRoute?.[route] || []).filter(paperVisible)
      src.forEach((p, pi) => {
        const t = src.length === 1 ? 0.5 : pi / (src.length - 1)
        const x = geom.minX + t * (geom.maxX - geom.minX)
        const wave = src.length > 7 ? (pi % 2 ? 18 : -18) : 0
        const paperId = `paper:${p.slug}`
        nodeMap.set(paperId, {
          ...p,
          id: paperId,
          kind: 'paper',
          label: p.display,
          detail: p.arxivId ? `arXiv:${p.arxivId}` : '日期待核',
          x,
          y: y + wave,
          r: IMPORTANT.has(p.slug) ? 7.5 : 5.8,
          color,
          track: p.track,
        })
        edges.push({ id: `belongs-${p.slug}`, type: 'belongs', source: routeId, target: paperId, label: '归属' })
        if (pi > 0) {
          edges.push({
            id: `lineage-${src[pi - 1].slug}-${p.slug}`,
            type: 'lineage',
            source: `paper:${src[pi - 1].slug}`,
            target: paperId,
            label: '路线演化',
          })
        }
      })
    })
  }

  for (const [from, to, label] of BRIDGES) {
    const a = paperBySlug.value[from]
    const b = paperBySlug.value[to]
    if (!a || !b || !paperVisible(a) || !paperVisible(b)) continue
    const source = `paper:${from}`
    const target = `paper:${to}`
    if (!nodeMap.has(source) || !nodeMap.has(target)) continue
    edges.push({ id: `bridge-${from}-${to}`, type: 'bridge', source, target, label })
  }

  if (graphMode.value === 'knowledge') {
    for (const n of layoutKnowledgeNodes()) nodeMap.set(n.id, n)
    for (const [paperSlug, target, label] of KNOWLEDGE_EDGES) {
      const p = paperBySlug.value[paperSlug]
      const source = `paper:${paperSlug}`
      if (!p || !paperVisible(p) || !nodeMap.has(source) || !nodeMap.has(target)) continue
      const type = edgeKindFor(target)
      edges.push({ id: `knowledge-${paperSlug}-${target}`, type, source, target, label })
    }
  }

  const nodes = [...nodeMap.values()]
  return { nodes, nodeMap, edges }
})

const visibleEdges = computed(() => {
  return graph.value.edges.filter((e) => {
    if (relationFilter.value === 'all') return true
    if (relationFilter.value === 'knowledge') return KNOWLEDGE_RELATIONS.has(e.type)
    if (relationFilter.value === 'bridge') return e.type === 'bridge'
    if (relationFilter.value === 'lineage') return e.type === 'lineage'
    if (relationFilter.value === 'belongs') return e.type === 'track' || e.type === 'belongs'
    return true
  })
})

const activeSet = computed(() => {
  if (!activeId.value) return new Set()
  const s = new Set([activeId.value])
  for (const e of visibleEdges.value) {
    if (e.source === activeId.value) s.add(e.target)
    if (e.target === activeId.value) s.add(e.source)
  }
  return s
})

const q = computed(() => query.value.trim().toLowerCase())
function matchesQuery(n) {
  if (!q.value) return true
  return [n.label, n.slug, n.route, n.track, n.arxivId, n.detail, KIND_META[n.kind]?.label]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(q.value))
}

function nodeDim(n) {
  if (activeId.value && !activeSet.value.has(n.id)) return true
  if (q.value && !matchesQuery(n)) return true
  return false
}

function edgeDim(e) {
  if (activeId.value && e.source !== activeId.value && e.target !== activeId.value) return true
  if (!q.value) return false
  const a = graph.value.nodeMap.get(e.source)
  const b = graph.value.nodeMap.get(e.target)
  return !matchesQuery(a || {}) && !matchesQuery(b || {})
}

function showLabel(n) {
  if (KNOWLEDGE_KINDS.has(n.kind)) return true
  return n.kind !== 'paper' || IMPORTANT.has(n.slug) || activeId.value === n.id || (q.value && matchesQuery(n))
}

const readout = computed(() => {
  const node = activeId.value ? graph.value.nodeMap.get(activeId.value) : null
  if (node) {
    const rel = visibleEdges.value
      .filter((e) => e.source === node.id || e.target === node.id)
      .map((e) => e.label)
      .slice(0, 4)
    return { node, rel }
  }
  const p = graph.value.nodes.filter((n) => n.kind === 'paper').length
  const r = graph.value.nodes.filter((n) => n.kind === 'route').length
  const k = graph.value.nodes.filter((n) => KNOWLEDGE_KINDS.has(n.kind)).length
  const b = visibleEdges.value.filter((e) => e.type === 'bridge').length
  const ke = visibleEdges.value.filter((e) => KNOWLEDGE_RELATIONS.has(e.type)).length
  return { stat: { papers: p, routes: r, knowledge: k, knowledgeEdges: ke, bridges: b, edges: visibleEdges.value.length } }
})

function clearRouteIfHidden() {
  if (routeFilter.value !== 'all' && !routeOptions.value.includes(routeFilter.value)) routeFilter.value = 'all'
}

function nodeClass(n) {
  return ['pkg-node', 'node-' + n.kind, { dim: nodeDim(n), selected: n.route && routeFilter.value === n.route, hit: q.value && matchesQuery(n), clickable: n.kind === 'route' || n.link }]
}

function handleNodeClick(n) {
  if (n.kind === 'route') {
    routeFilter.value = n.route
    return
  }
  if (n.link && typeof window !== 'undefined') window.location.href = withBase(n.link)
}

function handleNodeKey(e, n) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleNodeClick(n)
  }
}
</script>

<template>
  <div class="pkg">
    <div class="pkg-toolbar">
      <div class="seg" role="group" aria-label="图谱粒度">
        <button :class="{ on: graphMode === 'knowledge' }" @click="setGraphMode('knowledge')">多类型知识</button>
        <button :class="{ on: graphMode === 'paper' }" @click="setGraphMode('paper')">论文网络</button>
      </div>
      <div class="seg" role="group" aria-label="论文主线筛选">
        <button :class="{ on: trackFilter === 'all' }" @click="trackFilter = 'all'; routeFilter = 'all'">全部</button>
        <button :class="{ on: trackFilter === 'vla' }" @click="trackFilter = 'vla'; clearRouteIfHidden()">VLA</button>
        <button :class="{ on: trackFilter === 'wam' }" @click="trackFilter = 'wam'; clearRouteIfHidden()">WAM</button>
      </div>
      <select v-model="routeFilter" class="route-select" aria-label="技术路线">
        <option value="all">全部路线</option>
        <option v-for="r in routeOptions" :key="r" :value="r">{{ r }}</option>
      </select>
      <select v-if="graphMode === 'knowledge'" v-model="knowledgeKindFilter" class="route-select route-select--kind" aria-label="知识节点类型">
        <option value="all">全部知识节点</option>
        <option value="concept">知识概念</option>
        <option value="data">数据</option>
        <option value="benchmark">基准</option>
        <option value="robot">机器人本体</option>
        <option value="org">机构</option>
      </select>
      <div class="seg seg--relation" role="group" aria-label="关系类型">
        <button :class="{ on: relationFilter === 'all' }" @click="relationFilter = 'all'">全部关系</button>
        <button v-if="graphMode === 'knowledge'" :class="{ on: relationFilter === 'knowledge' }" @click="relationFilter = 'knowledge'">知识关联</button>
        <button :class="{ on: relationFilter === 'belongs' }" @click="relationFilter = 'belongs'">路线归属</button>
        <button :class="{ on: relationFilter === 'lineage' }" @click="relationFilter = 'lineage'">路线演化</button>
        <button :class="{ on: relationFilter === 'bridge' }" @click="relationFilter = 'bridge'">跨线桥接</button>
      </div>
      <input v-model="query" class="paper-search" type="search" placeholder="搜索论文 / 概念 / 数据 / arXiv" aria-label="搜索图谱节点" />
    </div>

    <div class="pkg-stage">
      <svg :viewBox="`0 0 ${W} ${H}`" class="pkg-svg" role="img" aria-label="VLA 与 WAM 论文知识图谱">
        <defs>
          <filter id="pkg-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="pkg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
          </marker>
        </defs>

        <g class="pkg-grid" aria-hidden="true">
          <path v-for="x in 11" :key="'x' + x" :d="`M ${x * 98} 84 V 920`" />
          <path v-for="y in 10" :key="'y' + y" :d="`M 42 ${y * 86 + 46} H 1138`" />
        </g>

        <g class="pkg-edges">
          <path
            v-for="e in visibleEdges"
            :key="e.id"
            :d="pathBetween(graph.nodeMap.get(e.source), graph.nodeMap.get(e.target))"
            :class="['pkg-edge', 'edge-' + e.type, { dim: edgeDim(e), active: activeId && (e.source === activeId || e.target === activeId) }]"
          />
        </g>

        <g class="pkg-nodes">
          <template v-for="n in graph.nodes" :key="n.id">
            <g
              v-if="n.kind === 'paper'"
              :class="nodeClass(n)"
              :style="{ '--c': n.color }"
              @mouseenter="activeId = n.id"
              @mouseleave="activeId = ''"
              @focus="activeId = n.id"
              @blur="activeId = ''"
              @click="handleNodeClick(n)"
              @keydown="handleNodeKey($event, n)"
              tabindex="0"
              role="link"
            >
              <circle :cx="n.x" :cy="n.y" :r="n.r + 7" class="node-touch" />
              <circle :cx="n.x" :cy="n.y" :r="n.r" class="node-core" />
              <text v-if="showLabel(n)" :x="n.x" :y="n.y + 19" class="node-label">{{ n.label }}</text>
            </g>
            <g
              v-else
              :class="nodeClass(n)"
              :style="{ '--c': n.color }"
              @mouseenter="activeId = n.id"
              @mouseleave="activeId = ''"
              @click="handleNodeClick(n)"
              @keydown="handleNodeKey($event, n)"
              :tabindex="n.kind === 'route' || n.link ? 0 : undefined"
              :role="n.link ? 'link' : n.kind === 'route' ? 'button' : undefined"
            >
              <circle v-if="n.kind === 'track'" :cx="n.x" :cy="n.y" :r="n.r" class="node-hub" />
              <rect v-else-if="n.kind === 'route'" :x="n.x - 75" :y="n.y - 17" width="150" height="34" rx="8" class="node-route" />
              <rect v-else :x="n.x - n.w / 2" :y="n.y - n.h / 2" :width="n.w" :height="n.h" :rx="n.kind === 'concept' ? 13 : 7" class="node-knowledge" />
              <text :x="n.x" :y="n.y + 4" :class="n.kind === 'track' ? 'track-label' : n.kind === 'route' ? 'route-label' : 'knowledge-label'">{{ n.label }}</text>
            </g>
          </template>
        </g>
      </svg>

    </div>

    <div class="pkg-footer">
      <aside class="pkg-readout" aria-live="polite">
        <div class="ro-tag">GRAPH READOUT</div>
        <template v-if="readout.node">
          <div class="ro-name">{{ readout.node.label }}</div>
          <div class="ro-meta">
            <span>{{ KIND_META[readout.node.kind]?.label || readout.node.track }}</span>
            <span v-if="readout.node.track && readout.node.kind === 'paper'">{{ readout.node.track }}</span>
            <span v-if="readout.node.route">{{ readout.node.route }}</span>
            <span v-if="readout.node.date">{{ readout.node.date }}</span>
          </div>
          <div v-if="readout.node.detail" class="ro-detail">{{ readout.node.detail }}</div>
          <div v-if="readout.rel?.length" class="ro-rel">
            <span v-for="r in readout.rel" :key="r">{{ r }}</span>
          </div>
        </template>
        <template v-else>
          <div class="ro-name">{{ readout.stat.papers }} 篇论文 · {{ readout.stat.knowledge }} 个知识节点</div>
          <div class="ro-meta">
            <span>{{ readout.stat.edges }} 条可视关系</span>
            <span>{{ readout.stat.knowledgeEdges }} 条知识关联</span>
            <span>{{ readout.stat.routes }} 条路线</span>
            <span>{{ readout.stat.bridges }} 条跨线桥接</span>
          </div>
          <div class="ro-detail">论文节点来自首页路线卡与细读页档案;知识节点人工标注概念、数据、基准、本体和机构关系,点击可进入对应专题或细读。</div>
        </template>
      </aside>

      <div class="pkg-legend" aria-label="图例">
        <span><i class="lg lg-track"></i>VLA / WAM 主线</span>
        <span><i class="lg lg-route"></i>技术路线 / 范式</span>
        <span><i class="lg lg-paper"></i>论文细读</span>
        <span><i class="lg lg-concept"></i>知识概念</span>
        <span><i class="lg lg-data"></i>数据 / 基准</span>
        <span><i class="lg lg-robot"></i>本体 / 机构</span>
        <span><i class="ln ln-belongs"></i>路线归属</span>
        <span><i class="ln ln-lineage"></i>路线演化</span>
        <span><i class="ln ln-bridge"></i>跨线桥接</span>
        <span><i class="ln ln-knowledge"></i>知识关联</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pkg {
  margin: 14px 0 28px;
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 14px;
  background:
    radial-gradient(circle at 24% 10%, rgba(34, 211, 238, 0.13), transparent 32%),
    radial-gradient(circle at 80% 22%, rgba(192, 132, 252, 0.12), transparent 30%),
    #080d19;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.04), 0 16px 42px rgba(8, 13, 28, 0.32);
}
.pkg-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 13px 14px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.14);
  background: rgba(7, 12, 24, 0.78);
}
.seg {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
}
.seg button,
.route-select,
.paper-search {
  font: 700 12px var(--vp-font-family-mono, monospace);
  color: #cbd5e1;
}
.seg button {
  border: 0;
  border-radius: 6px;
  padding: 6px 10px;
  background: transparent;
  cursor: pointer;
}
.seg button.on {
  color: #04111f;
  background: #67e8f9;
}
.route-select,
.paper-search {
  height: 33px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.72);
  padding: 0 10px;
}
.route-select { max-width: 240px; }
.route-select--kind { max-width: 180px; }
.paper-search { min-width: 210px; margin-left: auto; }
.pkg-stage {
  position: relative;
  overflow-x: auto;
}
.pkg-svg {
  display: block;
  min-width: 920px;
  width: 100%;
  height: auto;
}
.pkg-grid path {
  stroke: rgba(148, 163, 184, 0.045);
  stroke-width: 1;
}
.pkg-edge {
  fill: none;
  stroke-width: 1.35;
  stroke: rgba(148, 163, 184, 0.34);
  transition: opacity 0.16s ease, stroke-width 0.16s ease;
}
.edge-track { stroke-dasharray: 5 7; opacity: 0.55; }
.edge-belongs { opacity: 0.28; }
.edge-lineage {
  stroke: rgba(125, 211, 252, 0.52);
  stroke-width: 1.7;
}
.edge-bridge {
  stroke: #f0abfc;
  stroke-width: 2.1;
  stroke-dasharray: 8 5;
}
.edge-concept {
  stroke: rgba(34, 211, 238, 0.58);
  stroke-width: 1.65;
}
.edge-data {
  stroke: rgba(52, 211, 153, 0.54);
  stroke-width: 1.55;
}
.edge-benchmark {
  stroke: rgba(245, 158, 11, 0.58);
  stroke-width: 1.55;
}
.edge-robot {
  stroke: rgba(251, 113, 133, 0.54);
  stroke-width: 1.55;
}
.edge-org {
  stroke: rgba(167, 139, 250, 0.54);
  stroke-width: 1.55;
}
.pkg-edge.dim { opacity: 0.08; }
.pkg-edge.active { opacity: 1; stroke-width: 3; filter: url(#pkg-glow); }
.pkg-node { cursor: default; transition: opacity 0.16s ease; }
.pkg-node.clickable { cursor: pointer; }
.pkg-node.dim { opacity: 0.16; }
.node-touch { fill: transparent; }
.node-core {
  fill: #08111f;
  stroke: var(--c);
  stroke-width: 2.4;
}
.node-paper.hit .node-core,
.pkg-node.clickable:hover .node-core,
.pkg-node.clickable:focus-visible .node-core {
  fill: color-mix(in srgb, var(--c) 24%, #08111f);
  stroke-width: 4;
  filter: url(#pkg-glow);
}
.node-hub {
  fill: rgba(8, 17, 31, 0.94);
  stroke: var(--c);
  stroke-width: 2.6;
  filter: url(#pkg-glow);
}
.node-route {
  fill: rgba(8, 17, 31, 0.9);
  stroke: color-mix(in srgb, var(--c) 70%, transparent);
  stroke-width: 1.4;
}
.node-knowledge {
  fill: rgba(8, 17, 31, 0.9);
  stroke: color-mix(in srgb, var(--c) 76%, transparent);
  stroke-width: 1.35;
}
.node-concept .node-knowledge {
  fill: rgba(10, 35, 48, 0.88);
}
.node-data .node-knowledge {
  fill: rgba(10, 42, 33, 0.86);
}
.node-benchmark .node-knowledge {
  fill: rgba(47, 34, 12, 0.86);
}
.node-robot .node-knowledge {
  fill: rgba(52, 19, 28, 0.86);
}
.node-org .node-knowledge {
  fill: rgba(36, 25, 62, 0.86);
}
.node-route:hover,
.node-knowledge:hover,
.pkg-node.selected .node-route,
.pkg-node.hit .node-knowledge,
.pkg-node.clickable:focus-visible .node-knowledge {
  fill: color-mix(in srgb, var(--c) 18%, #08111f);
}
.pkg-node.clickable:focus-visible {
  outline: none;
}
.pkg-node.clickable:focus-visible .node-route,
.pkg-node.clickable:focus-visible .node-knowledge {
  stroke-width: 2.8;
  filter: url(#pkg-glow);
}
.track-label,
.route-label,
.node-label,
.knowledge-label {
  pointer-events: none;
  text-anchor: middle;
  paint-order: stroke;
  stroke: #080d19;
}
.track-label {
  fill: #f8fafc;
  font: 800 15px var(--vp-font-family-mono, monospace);
  letter-spacing: 0;
  stroke-width: 4px;
}
.route-label {
  fill: #e2e8f0;
  font: 700 11px var(--vp-font-family-mono, monospace);
  stroke-width: 3px;
}
.knowledge-label {
  fill: #e5edf7;
  font: 800 10px var(--vp-font-family-mono, monospace);
  stroke-width: 3px;
}
.node-label {
  fill: #cbd5e1;
  font: 700 9.5px var(--vp-font-family-mono, monospace);
  stroke-width: 3px;
}
.pkg-footer {
  display: flex;
  gap: 14px;
  align-items: stretch;
  padding: 12px 14px 14px;
  border-top: 1px solid rgba(56, 189, 248, 0.14);
  background: rgba(7, 12, 24, 0.48);
}
.pkg-readout {
  flex: 1 1 360px;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: 10px;
  background: rgba(7, 12, 24, 0.95);
  box-shadow: inset 0 0 0 1px rgba(56, 189, 248, 0.05);
  font-family: var(--vp-font-family-mono, monospace);
}
.ro-tag {
  color: #67e8f9;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0;
}
.ro-name {
  margin-top: 5px;
  color: #f8fafc;
  font-weight: 800;
  font-size: 15px;
}
.ro-meta,
.ro-rel {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
}
.ro-meta span,
.ro-rel span {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 999px;
  padding: 2px 7px;
  color: #aab4c5;
  font-size: 11px;
}
.ro-detail {
  margin-top: 8px;
  color: #8a94a6;
  font-size: 12px;
  line-height: 1.55;
}
.pkg-legend {
  display: flex;
  flex-wrap: wrap;
  flex: 0 1 460px;
  gap: 12px 16px;
  align-content: center;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.52);
  color: #94a3b8;
  font: 700 11px var(--vp-font-family-mono, monospace);
}
.lg,
.ln {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}
.lg { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #67e8f9; }
.lg-route { border-radius: 3px; border-color: #34d399; }
.lg-paper { width: 8px; height: 8px; border-color: #c084fc; }
.lg-concept { border-radius: 999px; width: 16px; border-color: #22d3ee; }
.lg-data { border-radius: 3px; border-color: #34d399; }
.lg-robot { border-radius: 3px; border-color: #fb7185; }
.ln { width: 22px; height: 0; border-top: 2px solid rgba(148, 163, 184, 0.55); }
.ln-lineage { border-top-color: #7dd3fc; }
.ln-bridge { border-top-color: #f0abfc; border-top-style: dashed; }
.ln-knowledge { border-top-color: #22d3ee; }

@media (max-width: 760px) {
  .pkg-toolbar { align-items: stretch; }
  .seg,
  .route-select,
  .paper-search { width: 100%; }
  .route-select { max-width: none; }
  .seg { justify-content: space-between; }
  .seg button { flex: 1; padding-inline: 7px; }
  .paper-search { margin-left: 0; min-width: 0; }
  .pkg-footer { flex-direction: column; padding: 12px; }
  .pkg-readout,
  .pkg-legend { flex-basis: auto; width: auto; }
}
</style>
