// 学习路线图数据源(roadmap graph nodes)
// 节点 = 站内已有页面,按 stage(基础→核心→进阶→前沿)分列,按 track 着色,带前置依赖连线。
// 设计原则:
//   - 不造新内容:所有节点链到已存在的页面,路线图是"导航层",不是内容层。
//   - 与 getting-started 互补:getting-started 是线性 7 步文字路径,路线图是可视化多轨地图。

/**
 * 节点 schema
 */
export const NODE_SCHEMA = {
  id: 'string (unique key, kebab-case)',
  label: 'string (显示标签,简短)',
  stage: '基础 | 核心 | 进阶 | 前沿',
  track: '通用 | VLA | WAM | 数据 | 训练评测 | 工程',
  link: 'string (站内路径 /vla/...)',
  prereq: 'string[] (前置节点 id 数组,画连线用)',
  description: 'string (hover 提示,可选)',
}

/**
 * Track 配色映射(复用站点变量)
 */
export const TRACK_COLORS = {
  通用: { bg: 'rgba(148, 163, 184, 0.14)', border: '#94a3b8', text: '#94a3b8' },
  VLA: { bg: 'var(--ar-cyan-soft)', border: 'var(--ar-cyan)', text: 'var(--ar-cyan)' },
  WAM: { bg: 'var(--ar-purple-soft)', border: 'var(--ar-purple)', text: 'var(--ar-purple)' },
  数据: { bg: 'var(--ar-teal-soft)', border: 'var(--ar-teal)', text: 'var(--ar-teal)' },
  训练评测: { bg: 'var(--ar-gold-soft)', border: 'var(--ar-gold)', text: 'var(--ar-gold)' },
  工程: { bg: 'rgba(244, 114, 182, 0.14)', border: '#f472b6', text: '#f472b6' },
}

/**
 * 路线图节点数据(手工策展,seed 自站内已有页面)
 */
export const nodes = [
  // ===== 基础阶段(入门概念 + 术语) =====
  {
    id: 'getting-started',
    label: '具身入门 · 5 分钟上手',
    stage: '基础',
    track: '通用',
    link: '/vla/papers/getting-started',
    prereq: [],
    description: '大白话讲清具身智能/VLA/WAM,核心概念速记',
  },
  {
    id: 'guide',
    label: '如何阅读本站',
    stage: '基础',
    track: '通用',
    link: '/vla/guide',
    prereq: [],
    description: '可信度标注/信源分级/阅读路径',
  },
  {
    id: 'glossary',
    label: '术语速查表',
    stage: '基础',
    track: '通用',
    link: '/vla/papers/glossary',
    prereq: [],
    description: '180+ 术语中英对照 + 释义',
  },

  // ===== 核心阶段(主报告 + 奠基论文) =====
  {
    id: 'vla-report',
    label: 'VLA 总报告',
    stage: '核心',
    track: 'VLA',
    link: '/vla/',
    prereq: ['getting-started'],
    description: '76 篇论文细读,技术路线/生态/数据全景',
  },
  {
    id: 'wam-report',
    label: 'WAM 总览',
    stage: '核心',
    track: 'WAM',
    link: '/wam/',
    prereq: ['getting-started'],
    description: '33 篇论文细读,世界模型 5 大范式',
  },
  {
    id: 'rt-1',
    label: 'RT-1 · 奠基',
    stage: '核心',
    track: 'VLA',
    link: '/vla/papers/rt1',
    prereq: ['vla-report'],
    description: 'Transformer 首次跑通真机操作',
  },
  {
    id: 'rt-2',
    label: 'RT-2 · 视觉-语言融合',
    stage: '核心',
    track: 'VLA',
    link: '/vla/papers/rt2',
    prereq: ['rt-1'],
    description: 'VLM 骨架接上动作头,泛化跃升',
  },
  {
    id: 'openvla',
    label: 'OpenVLA · 首个开源 VLA',
    stage: '核心',
    track: 'VLA',
    link: '/vla/papers/openvla',
    prereq: ['rt-2'],
    description: '7B 开源,OXE 数据训练,社区基线',
  },
  {
    id: 'diffusion-policy',
    label: 'Diffusion Policy',
    stage: '核心',
    track: 'VLA',
    link: '/vla/papers/diffusion-policy',
    prereq: ['vla-report'],
    description: '扩散生成连续动作,精度高',
  },
  {
    id: 'pi0',
    label: 'π0 · 流匹配 VLA',
    stage: '核心',
    track: 'VLA',
    link: '/vla/papers/pi0',
    prereq: ['diffusion-policy'],
    description: 'Flow Matching 动作预测,Physical Intelligence 旗舰',
  },

  // ===== 进阶阶段(数据/训练/评测专题) =====
  {
    id: 'embodied-data',
    label: '具身数据全景',
    stage: '进阶',
    track: '数据',
    link: '/vla/papers/embodied-data',
    prereq: ['vla-report'],
    description: '数据金字塔:真机/人类视频/仿真/合成',
  },
  {
    id: 'datasets-catalog',
    label: '数据集图鉴',
    stage: '进阶',
    track: '数据',
    link: '/vla/papers/datasets-catalog',
    prereq: ['embodied-data'],
    description: '真机/仿真数据集可筛选目录',
  },
  {
    id: 'data-processing',
    label: '具身数据处理',
    stage: '进阶',
    track: '数据',
    link: '/vla/papers/data-processing',
    prereq: ['embodied-data'],
    description: '清洗/归一化/配比策略',
  },
  {
    id: 'training-pipeline',
    label: '训练全流程',
    stage: '进阶',
    track: '训练评测',
    link: '/vla/papers/training-pipeline',
    prereq: ['vla-report'],
    description: '预训练→协同训练→后训练→真机 RL',
  },
  {
    id: 'benchmarks',
    label: '评测基准全景',
    stage: '进阶',
    track: '训练评测',
    link: '/vla/papers/benchmarks',
    prereq: ['vla-report'],
    description: 'SimplerEnv/LIBERO/CALVIN/RoboCasa 四大基准 + 读表铁律',
  },
  {
    id: 'leaderboard',
    label: '统一基准榜',
    stage: '进阶',
    track: '训练评测',
    link: '/vla/papers/leaderboard',
    prereq: ['benchmarks'],
    description: '四大仿真基准可筛选排行',
  },
  {
    id: 'robots',
    label: '实验机器人本体',
    stage: '进阶',
    track: '工程',
    link: '/vla/papers/robots',
    prereq: ['vla-report'],
    description: 'Franka/UR/ALOHA/人形本体对比',
  },
  {
    id: 'motion-control',
    label: '运控算法基础',
    stage: '进阶',
    track: '工程',
    link: '/vla/papers/motion-control',
    prereq: ['robots'],
    description: 'IK/轨迹规划/阻抗控制',
  },

  // ===== 前沿阶段(SOTA 模型 + 新兴方向) =====
  {
    id: 'cogact',
    label: 'CogACT · 思维链 VLA',
    stage: '前沿',
    track: 'VLA',
    link: '/vla/papers/cogact',
    prereq: ['pi0'],
    description: 'VLA + CoT,SimplerEnv SOTA',
  },
  {
    id: 'qwen-vla',
    label: 'Qwen-VLA',
    stage: '前沿',
    track: 'VLA',
    link: '/vla/papers/qwen-vla',
    prereq: ['openvla'],
    description: '阿里 72B VLA,LIBERO 97.9%',
  },
  {
    id: 'groot-n1',
    label: 'GR00T N1.5',
    stage: '前沿',
    track: 'VLA',
    link: '/vla/papers/groot-n1',
    prereq: ['pi0'],
    description: 'NVIDIA 人形 VLA,DreamGen 数据放大',
  },
  {
    id: 'genie-2',
    label: 'Genie 2',
    stage: '前沿',
    track: 'WAM',
    link: '/wam/papers/genie-2',
    prereq: ['wam-report'],
    description: 'Google 世界模型,可交互视频生成',
  },
  {
    id: 'wall-e',
    label: 'WALL-E',
    stage: '前沿',
    track: 'WAM',
    link: '/wam/papers/wall-e',
    prereq: ['wam-report'],
    description: '字节世界模型,WLA 架构',
  },
  {
    id: 'models-spec',
    label: '全模型规格对比',
    stage: '前沿',
    track: 'VLA',
    link: '/vla/papers/models-spec',
    prereq: ['vla-report'],
    description: '26 个 VLA 的主干/动作/参数/许可横向对照',
  },
  {
    id: 'ecosystem',
    label: '生态总览 · 公司地图',
    stage: '前沿',
    track: '通用',
    link: '/ecosystem/',
    prereq: [],
    description: '具身智能公司/投资/知识图谱',
  },
]

/**
 * 统计数据
 */
export function computeStats(nodes) {
  const byStage = {
    基础: nodes.filter((n) => n.stage === '基础').length,
    核心: nodes.filter((n) => n.stage === '核心').length,
    进阶: nodes.filter((n) => n.stage === '进阶').length,
    前沿: nodes.filter((n) => n.stage === '前沿').length,
  }
  const byTrack = {
    通用: nodes.filter((n) => n.track === '通用').length,
    VLA: nodes.filter((n) => n.track === 'VLA').length,
    WAM: nodes.filter((n) => n.track === 'WAM').length,
    数据: nodes.filter((n) => n.track === '数据').length,
    训练评测: nodes.filter((n) => n.track === '训练评测').length,
    工程: nodes.filter((n) => n.track === '工程').length,
  }
  return {
    total: nodes.length,
    byStage,
    byTrack,
  }
}

// VitePress 数据加载器 default export
export default {
  watch: [],
  load() {
    const stats = computeStats(nodes)
    console.log(
      `\n[roadmap.data] 学习路线图节点:${nodes.length} 个 | 阶段分布:基础 ${stats.byStage.基础} / 核心 ${stats.byStage.核心} / 进阶 ${stats.byStage.进阶} / 前沿 ${stats.byStage.前沿} | 轨道分布:通用 ${stats.byTrack.通用} / VLA ${stats.byTrack.VLA} / WAM ${stats.byTrack.WAM} / 数据 ${stats.byTrack.数据} / 训练评测 ${stats.byTrack.训练评测} / 工程 ${stats.byTrack.工程}`
    )
    return { nodes, TRACK_COLORS, stats, NODE_SCHEMA }
  },
}
