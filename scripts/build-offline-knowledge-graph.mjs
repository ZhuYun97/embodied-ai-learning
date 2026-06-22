#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import paperLoader from '../docs/.vitepress/data/papers.data.mjs'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const DOCS = path.join(ROOT, 'docs')
const PUBLIC_GRAPH_DIR = path.join(DOCS, 'public', 'graphs')
const GRAPHIFY_OUT = path.join(ROOT, 'graphify-out')
const SITE_JSON = path.join(PUBLIC_GRAPH_DIR, 'offline-knowledge-graph.json')
const GRAPHIFY_JSON = path.join(GRAPHIFY_OUT, 'graph.json')
const GRAPH_REPORT = path.join(GRAPHIFY_OUT, 'GRAPH_REPORT.md')

const INTERNAL_DOC_DIRS = new Set(['ecosystem', 'vla', 'wam'])
const SKIP_DIRS = new Set(['.vitepress', 'public', 'node_modules', 'dist'])
const MAX_RELATED_PER_DOC = 8
const MIN_SHARED_ENTITIES = 3
const MAX_SECTION_ENTITY_EDGES = 8

const ENTITY_GROUPS = [
  {
    type: 'concept',
    items: [
      ['concept:vla', 'VLA', ['VLA', 'Vision-Language-Action', '视觉-语言-动作', '视觉语言动作']],
      ['concept:wam', 'WAM', ['WAM', 'World Action Model', '世界-动作模型', '世界动作模型']],
      ['concept:action-token', '动作 token', ['动作 token', 'action token', '离散 token', '动作分词', 'FAST']],
      ['concept:action-chunk', '动作分块', ['动作分块', 'action chunk', 'chunking', 'horizon 动作', '短 horizon']],
      ['concept:flow-matching', '流匹配', ['流匹配', 'flow matching', 'flow-matching', '流模型']],
      ['concept:diffusion-policy', '扩散策略', ['Diffusion Policy', '扩散策略', '去噪扩散', 'diffusion policy']],
      ['concept:dit-action', 'DiT 动作头', ['DiT 动作头', 'DiT action', '动作专家', 'Action Expert', 'Transformer 去噪器']],
      ['concept:dual-system', '双系统', ['双系统', 'System 1', 'System-1', 'System 2', 'System-2', '快慢系统', '分层']],
      ['concept:knowledge-insulation', '知识隔离', ['知识隔离', 'Knowledge Insulation', 'KI 配方', 'stop-gradient', 'stop gradient']],
      ['concept:online-rl', '在线 RL', ['在线 RL', 'online RL', '真机 RL', 'on-policy', 'RECAP', 'RL Token']],
      ['concept:world-model', '世界模型', ['世界模型', 'world model', '视频世界模型', 'future state', '未来状态']],
      ['concept:predictive-policy', '预测式策略', ['预测式', '预演未来', '预测当策略', 'predictive policy', 'planning with video']],
      ['concept:latent-action', '潜动作', ['潜动作', 'latent action', 'ActionVAE', '动作码', '隐式动作']],
      ['concept:affordance', 'Affordance', ['affordance', '可供性', '可操作性']],
      ['concept:spatial-3d', '3D 空间表征', ['3D 空间', '点云', 'Point Cloud', 'Ego3D', 'depth', '深度']],
      ['concept:memory-imagination', '记忆/想象', ['记忆', 'memory', '想象', 'imagination', 'future imagination']],
      ['concept:state-action-align', '状态动作对齐', ['状态动作对齐', 'state-action', '统一 state-action', '动作空间统一']],
      ['concept:h2r-retarget', 'H2R 重定向', ['H2R', 'human-to-robot', '人到机器人', '重定向', 'retarget']],
      ['concept:motion-control', '运控层', ['运控', '运动控制', 'IK', 'MPC', '阻抗控制', '轨迹生成', 'waypoint']],
      ['concept:co-training', 'Co-training', ['co-training', '联合训练', '协同训练', '梯度桥接', 'joint training']],
      ['concept:sim2real', 'Sim2Real', ['sim2real', 'sim-to-real', '仿真到现实', '仿真真机']],
      ['concept:cross-embodiment', '跨本体', ['跨本体', 'cross embodiment', '跨机器人', '多本体']],
      ['concept:inference-deploy', '推理部署', ['推理部署', '量化', '缓存', '延迟', '实时控制', '并行解码']],
    ],
  },
  {
    type: 'data',
    items: [
      ['data:oxe', 'Open X-Embodiment', ['Open X-Embodiment', 'OXE', 'RT-X']],
      ['data:droid', 'DROID', ['DROID']],
      ['data:bridge', 'BridgeData', ['BridgeData', 'Bridge Data', 'Bridge V2', 'BridgeData V2']],
      ['data:robomind', 'RoboMIND', ['RoboMIND']],
      ['data:agibot-world', 'AgiBot World', ['AgiBot World', 'AgiBotWorld']],
      ['data:rh20t', 'RH20T', ['RH20T']],
      ['data:aloha', 'ALOHA 数据', ['ALOHA', 'ACT 数据']],
      ['data:language-table', 'Language-Table', ['Language-Table', 'Language Table']],
      ['data:ego-video', '第一视角视频', ['第一视角', 'egocentric', 'Ego4D', '人类视频', '网络视频']],
      ['data:cosmos', 'Cosmos', ['Cosmos', 'OpenMDW', 'NVIDIA Open Model']],
      ['data:ewk', 'EWK', ['EWK', '8.6M video-text']],
      ['data:qwen-38100h', 'Qwen 38.1k h', ['38,100h', '38100h', '38.1k h']],
    ],
  },
  {
    type: 'benchmark',
    items: [
      ['bench:libero', 'LIBERO', ['LIBERO']],
      ['bench:simpler', 'SimplerEnv', ['SimplerEnv', 'Simpler Env']],
      ['bench:robocasa', 'RoboCasa', ['RoboCasa']],
      ['bench:calvin', 'CALVIN', ['CALVIN']],
      ['bench:robotwin', 'RoboTwin', ['RoboTwin']],
      ['bench:roboarena', 'RoboArena', ['RoboArena']],
      ['bench:robochallenge', 'RoboChallenge', ['RoboChallenge', 'Table30']],
      ['bench:ebench', 'EBench', ['EBench']],
      ['bench:worldarena', 'WorldArena', ['WorldArena']],
      ['bench:rmbench', 'RMBench', ['RMBench']],
      ['bench:metaworld', 'Meta-World', ['Meta-World', 'MetaWorld']],
    ],
  },
  {
    type: 'robot',
    items: [
      ['robot:widowx', 'WidowX', ['WidowX']],
      ['robot:franka', 'Franka', ['Franka', 'Panda']],
      ['robot:aloha', 'ALOHA 本体', ['ALOHA', '双臂遥操作']],
      ['robot:unitree-g1', 'Unitree G1', ['Unitree G1', '宇树 G1']],
      ['robot:fourier-gr1', 'Fourier GR-1', ['Fourier GR-1', 'GR-1']],
      ['robot:arx', 'ARX', ['ARX']],
      ['robot:figure', 'Figure', ['Figure AI', 'Figure 03', 'Figure 02']],
      ['robot:bytedexter', 'ByteDexter', ['ByteDexter', 'ByteMini']],
      ['robot:google-robot', 'Google Robot', ['Google Robot', 'Everyday Robot']],
      ['robot:ur5', 'UR5', ['UR5', 'UR10']],
      ['robot:xarm', 'xArm', ['xArm']],
      ['robot:agilex', 'AgileX', ['AgileX']],
    ],
  },
  {
    type: 'org',
    items: [
      ['org:qwen', 'Qwen', ['Qwen', '阿里 Qwen', '通义千问']],
      ['org:pi', 'Physical Intelligence', ['Physical Intelligence', 'PI', 'π0', 'π0.5', 'π0.6', 'π0.7']],
      ['org:nvidia', 'NVIDIA', ['NVIDIA', 'GR00T', 'Cosmos']],
      ['org:deepmind', 'Google DeepMind', ['Google DeepMind', 'DeepMind', 'Gemini Robotics', 'RT-2']],
      ['org:xsquare', 'X Square', ['X Square', 'X²Robot', '自变量']],
      ['org:damo', 'Alibaba DAMO', ['DAMO', '达摩院', 'Alibaba']],
      ['org:agibot', 'AgiBot', ['AgiBot', '智元']],
      ['org:seed', 'ByteDance Seed', ['ByteDance Seed', '字节 Seed', 'Seed']],
      ['org:tsinghua', 'Tsinghua', ['清华', 'Tsinghua']],
      ['org:shanghai-ai-lab', '上海 AI Lab', ['上海 AI Lab', '上海人工智能实验室']],
      ['org:berkeley', 'UC Berkeley', ['UC Berkeley', 'Berkeley', 'BAIR']],
      ['org:stanford', 'Stanford', ['Stanford']],
      ['org:mit', 'MIT', ['MIT', 'CSAIL']],
      ['org:tri', 'Toyota TRI', ['Toyota TRI', 'TRI', 'Toyota Research']],
      ['org:figure', 'Figure AI', ['Figure AI']],
      ['org:galaxea', 'Galaxea', ['Galaxea', '星海图']],
      ['org:gigaai', 'GigaAI', ['GigaAI', 'GigaBrain', 'GigaWorld']],
      ['org:westlake', 'Westlake', ['西湖大学', 'Westlake']],
      ['org:inria', 'Inria', ['Inria']],
    ],
  },
]

const ENTITY_DEFS = ENTITY_GROUPS.flatMap((group) =>
  group.items.map(([id, label, aliases]) => ({
    id,
    label,
    type: group.type,
    aliases,
    regexes: aliases.map(aliasToRegex),
  }))
)

function aliasToRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (/^[A-Za-z0-9 .:+*/_-]+$/.test(alias)) {
    return new RegExp(`(^|[^A-Za-z0-9])${escaped}([^A-Za-z0-9]|$)`, 'gi')
  }
  return new RegExp(escaped, 'g')
}

function walkMarkdown(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue
      walkMarkdown(path.join(dir, ent.name), out)
    } else if (ent.isFile() && ent.name.endsWith('.md') && ent.name !== '404.md') {
      const rel = path.relative(DOCS, path.join(dir, ent.name)).split(path.sep).join('/')
      const first = rel.split('/')[0]
      if (INTERNAL_DOC_DIRS.has(first) || rel === 'index.md') out.push(rel)
    }
  }
  return out
}

function readDoc(rel) {
  const raw = fs.readFileSync(path.join(DOCS, rel), 'utf-8')
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const meta = {}
  if (fm) {
    for (const line of fm[1].split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/)
      if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
  const h1 = body.match(/^#\s+(.+)$/m)
  return {
    rel,
    raw,
    body,
    title: sanitizeGraphText(meta.title || (h1 ? cleanInline(h1[1]) : titleFromRel(rel))),
    description: sanitizeGraphText(meta.description || ''),
  }
}

function cleanInline(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#]/g, '')
    .trim()
}

function sanitizeGraphText(s) {
  return String(s || '')
    .replace(/arxiv\.org\/(?:abs|pdf)\/\d{4}\.\d{4,5}/gi, '')
    .replace(/arXiv[:：]?\s*\d{4}\.\d{4,5}/gi, '')
    .replace(/arXiv\s*[\/·|,，:：-]*/gi, '')
    .replace(/\(\s*[,，;；/|\s]*\)/g, '')
    .replace(/\s+([,，;；:：。])/g, '$1')
    .replace(/([（(])\s*[,，;；/|\s]+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function titleFromRel(rel) {
  return rel.replace(/(^|\/)index\.md$/, '$1index').replace(/\.md$/, '')
}

function urlFromRel(rel) {
  return '/' + rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
}

function docId(rel) {
  return `doc:${rel.replace(/\.md$/, '')}`
}

function sectionId(rel, index) {
  return `section:${rel.replace(/\.md$/, '')}:${index}`
}

function nodeTypeForDoc(rel, paperByRel) {
  if (paperByRel.has(rel)) return 'paper'
  if (rel === 'index.md') return 'home'
  if (rel.startsWith('ecosystem/')) return 'ecosystem'
  if (rel.includes('/papers/')) return 'topic'
  if (rel.endsWith('/index.md')) return 'index'
  return 'page'
}

function extractSections(doc) {
  const lines = doc.body.split(/\r?\n/)
  const heads = []
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{2,3})\s+(.+)$/)
    if (m) heads.push({ level: m[1].length, title: cleanInline(m[2]), line: i })
  }
  return heads.map((h, i) => {
    const next = heads.find((n, j) => j > i && n.level <= h.level)
    const block = lines.slice(h.line, next ? next.line : lines.length).join('\n')
    return { ...h, title: sanitizeGraphText(h.title), index: i, text: stripMarkdown(block).slice(0, 6000) }
  })
}

function stripMarkdown(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_>#|:-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractMarkdownLinks(doc, docsByRel) {
  const links = []
  const patterns = [
    /\[[^\]]+]\(([^)]+)\)/g,
    /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/g,
  ]
  for (const re of patterns) {
    for (const m of doc.raw.matchAll(re)) {
      const target = resolveInternalLink(doc.rel, m[1], docsByRel)
      if (target && target !== doc.rel) links.push(target)
    }
  }
  return Array.from(new Set(links))
}

function resolveInternalLink(fromRel, href, docsByRel) {
  if (!href || /^(https?:|mailto:|tel:)/i.test(href)) return null
  let clean = href.trim().replace(/^<|>$/g, '').split('#')[0].split('?')[0]
  if (!clean) return null
  if (clean.startsWith('/embodied-ai-learning/')) clean = clean.replace('/embodied-ai-learning/', '/')
  if (clean.startsWith('/')) clean = clean.slice(1)
  else clean = path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), clean))
  clean = clean.replace(/^docs\//, '')
  const candidates = []
  if (clean.endsWith('/')) candidates.push(clean + 'index.md')
  else if (clean.endsWith('.md')) candidates.push(clean)
  else {
    candidates.push(clean + '.md')
    candidates.push(clean + '/index.md')
  }
  return candidates.find((c) => docsByRel.has(c)) || null
}

function entityHits(text) {
  const hits = new Map()
  for (const ent of ENTITY_DEFS) {
    let count = 0
    for (const re of ent.regexes) {
      re.lastIndex = 0
      const matches = text.match(re)
      if (matches) count += matches.length
    }
    if (count > 0) hits.set(ent.id, count)
  }
  return hits
}

function edgeId(source, target, type) {
  return `${type}:${source}->${target}`.replace(/\s+/g, '_')
}

function addNode(nodes, node) {
  if (!nodes.has(node.id)) nodes.set(node.id, node)
}

function addEdge(edges, edge) {
  if (edge.source === edge.target) return
  const id = edge.id || edgeId(edge.source, edge.target, edge.type)
  const old = edges.get(id)
  if (old) {
    old.weight = Math.max(old.weight || 1, edge.weight || 1)
    old.evidence = Array.from(new Set([...(old.evidence || []), ...(edge.evidence || [])])).slice(0, 8)
    return
  }
  edges.set(id, {
    id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    label: edge.label || edge.type,
    weight: edge.weight || 1,
    confidence: edge.confidence || 'EXTRACTED',
    evidence: edge.evidence || [],
  })
}

function topEntries(map, limit) {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit)
}

function slugifyLabel(s) {
  return s.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

function build() {
  const paperData = paperLoader.load()
  const paperByRel = new Map()
  for (const p of paperData.papers || []) {
    const rel = `${p.track === 'VLA' ? 'vla' : 'wam'}/papers/${p.slug}.md`
    paperByRel.set(rel, p)
  }

  const docRels = walkMarkdown(DOCS).sort()
  const docs = docRels.map(readDoc)
  const docsByRel = new Map(docs.map((d) => [d.rel, d]))
  const nodes = new Map()
  const edges = new Map()
  const docEntitySets = new Map()
  const docEntityCounts = new Map()

  addNode(nodes, { id: 'track:VLA', label: 'VLA', type: 'track', url: '/vla/' })
  addNode(nodes, { id: 'track:WAM', label: 'WAM', type: 'track', url: '/wam/' })

  for (const ent of ENTITY_DEFS) {
    addNode(nodes, { id: ent.id, label: ent.label, type: ent.type })
  }

  for (const p of paperData.papers || []) {
    const routeId = `route:${p.route}`
    addNode(nodes, { id: routeId, label: p.route, type: 'route', track: p.track })
    addEdge(edges, {
      source: `track:${p.track}`,
      target: routeId,
      type: 'taxonomy',
      label: '路线',
      confidence: 'CURATED',
    })
  }

  for (const doc of docs) {
    const p = paperByRel.get(doc.rel)
    const id = docId(doc.rel)
    const type = nodeTypeForDoc(doc.rel, paperByRel)
    addNode(nodes, {
      id,
      label: doc.title,
      type,
      url: urlFromRel(doc.rel),
      rel: doc.rel,
      description: doc.description,
      track: p?.track,
      route: p?.route,
      date: p?.date,
    })

    if (p) {
      const routeId = `route:${p.route}`
      addEdge(edges, {
        source: routeId,
        target: id,
        type: 'taxonomy',
        label: '收录',
        confidence: 'CURATED',
      })
    }

    const cleanText = stripMarkdown(doc.body)
    const hits = entityHits(`${doc.title}\n${doc.description}\n${cleanText}`)
    docEntitySets.set(id, new Set(hits.keys()))
    docEntityCounts.set(id, hits)
    for (const [entId, count] of hits) {
      addEdge(edges, {
        source: id,
        target: entId,
        type: 'mentions',
        label: '提及',
        weight: Math.min(10, count),
        confidence: 'EXTRACTED',
      })
    }

    const sections = extractSections(doc)
    for (const sec of sections) {
      const sid = sectionId(doc.rel, sec.index)
      addNode(nodes, {
        id: sid,
        label: sec.title,
        type: 'section',
        url: `${urlFromRel(doc.rel)}#${slugifyLabel(sec.title)}`,
        rel: doc.rel,
        parent: id,
        level: sec.level,
      })
      addEdge(edges, {
        source: id,
        target: sid,
        type: 'contains',
        label: `H${sec.level}`,
        confidence: 'EXTRACTED',
      })
      for (const [entId, count] of topEntries(entityHits(sec.text), MAX_SECTION_ENTITY_EDGES)) {
        addEdge(edges, {
          source: sid,
          target: entId,
          type: 'section-mentions',
          label: '章节提及',
          weight: Math.min(8, count),
          confidence: 'EXTRACTED',
        })
      }
    }

    for (const targetRel of extractMarkdownLinks(doc, docsByRel)) {
      addEdge(edges, {
        source: id,
        target: docId(targetRel),
        type: 'links-to',
        label: '站内链接',
        confidence: 'EXTRACTED',
        evidence: [doc.rel],
      })
    }

  }

  addRelatedEdges(nodes, edges, docEntitySets)
  annotateDegrees(nodes, edges)

  const graph = {
    meta: {
      title: 'Embodied AI Offline Knowledge Graph',
      generatedAt: new Date().toISOString(),
      mode: 'offline-local',
      apiCalls: 0,
      source: {
        markdownDocs: docs.length,
        entityDefinitions: ENTITY_DEFS.length,
        paperCatalog: (paperData.papers || []).length,
      },
      extraction: [
        'Markdown frontmatter and headings',
        'VitePress internal links',
        'Curated paper taxonomy from papers.data.mjs',
        'Deterministic entity dictionary matching',
        'Shared-entity relatedness edges',
      ],
    },
    nodes: Array.from(nodes.values()).sort((a, b) => a.id.localeCompare(b.id)),
    edges: Array.from(edges.values()).sort((a, b) => a.id.localeCompare(b.id)),
  }

  fs.mkdirSync(PUBLIC_GRAPH_DIR, { recursive: true })
  fs.mkdirSync(GRAPHIFY_OUT, { recursive: true })
  fs.writeFileSync(SITE_JSON, JSON.stringify(graph, null, 2) + '\n', 'utf-8')
  fs.writeFileSync(GRAPHIFY_JSON, JSON.stringify(toGraphifyGraph(graph), null, 2) + '\n', 'utf-8')
  fs.writeFileSync(GRAPH_REPORT, makeReport(graph), 'utf-8')
  return graph
}

function toGraphifyGraph(graph) {
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]))
  return {
    directed: true,
    nodes: graph.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      file_type: graphifyFileType(node.type),
      source_file: graphifyNodeSource(node),
      type: node.type,
      url: node.url || '',
      description: node.description || '',
      degree: node.degree || 0,
      track: node.track || '',
      route: node.route || '',
      parent: node.parent || '',
    })),
    edges: graph.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      relation: edge.label || edge.type,
      confidence: graphifyConfidence(edge.confidence),
      source_file: graphifyEdgeSource(edge, nodesById),
      weight: edge.weight || 1,
      type: edge.type,
      evidence: edge.evidence || [],
    })),
  }
}

function graphifyFileType(type) {
  if (type === 'paper') return 'paper'
  if (['concept', 'data', 'benchmark', 'robot', 'org', 'route', 'track'].includes(type)) return 'concept'
  return 'document'
}

function graphifyNodeSource(node) {
  if (node.rel) return node.rel
  if (['track', 'route'].includes(node.type)) return 'docs/.vitepress/data/papers.data.mjs'
  return 'scripts/build-offline-knowledge-graph.mjs'
}

function graphifyEdgeSource(edge, nodesById) {
  if (edge.evidence?.[0]) return edge.evidence[0]
  return nodesById.get(edge.source)?.rel || nodesById.get(edge.target)?.rel || 'scripts/build-offline-knowledge-graph.mjs'
}

function graphifyConfidence(confidence) {
  if (confidence === 'DERIVED') return 'INFERRED'
  return 'EXTRACTED'
}

function addRelatedEdges(nodes, edges, docEntitySets) {
  const ids = Array.from(docEntitySets.keys())
  const candidates = []
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i]
      const b = ids[j]
      const setA = docEntitySets.get(a)
      const setB = docEntitySets.get(b)
      const shared = Array.from(setA).filter((x) => setB.has(x))
      if (shared.length < MIN_SHARED_ENTITIES) continue
      const na = nodes.get(a)
      const nb = nodes.get(b)
      const sameRoute = na?.route && na.route === nb?.route ? 2 : 0
      const sameTrack = na?.track && na.track === nb?.track ? 1 : 0
      candidates.push({ a, b, score: shared.length + sameRoute + sameTrack, shared })
    }
  }
  candidates.sort((x, y) => y.score - x.score)
  const perDoc = new Map()
  for (const c of candidates) {
    if ((perDoc.get(c.a) || 0) >= MAX_RELATED_PER_DOC) continue
    if ((perDoc.get(c.b) || 0) >= MAX_RELATED_PER_DOC) continue
    perDoc.set(c.a, (perDoc.get(c.a) || 0) + 1)
    perDoc.set(c.b, (perDoc.get(c.b) || 0) + 1)
    addEdge(edges, {
      source: c.a,
      target: c.b,
      type: 'related',
      label: `共现 ${c.shared.length}`,
      weight: Math.min(10, c.score),
      confidence: 'DERIVED',
      evidence: c.shared.slice(0, 6),
    })
  }
}

function annotateDegrees(nodes, edges) {
  const degree = new Map()
  for (const e of edges.values()) {
    degree.set(e.source, (degree.get(e.source) || 0) + 1)
    degree.set(e.target, (degree.get(e.target) || 0) + 1)
  }
  for (const node of nodes.values()) {
    const d = degree.get(node.id) || 0
    node.degree = d
    node.size = Math.max(18, Math.min(72, 16 + Math.sqrt(d + 1) * 9))
  }
}

function makeReport(graph) {
  const byType = countBy(graph.nodes, 'type')
  const edgeTypes = countBy(graph.edges, 'type')
  const hubs = graph.nodes
    .filter((n) => !['section'].includes(n.type))
    .sort((a, b) => (b.degree || 0) - (a.degree || 0))
    .slice(0, 25)
  const lines = [
    '# Offline Knowledge Graph Report',
    '',
    `Generated: ${graph.meta.generatedAt}`,
    '',
    'This graph was built locally from repository files only. API calls: 0.',
    '',
    '## Scope',
    '',
    `- Markdown documents: ${graph.meta.source.markdownDocs}`,
    `- Curated entity definitions: ${graph.meta.source.entityDefinitions}`,
    `- Paper catalog entries: ${graph.meta.source.paperCatalog}`,
    `- Nodes: ${graph.nodes.length}`,
    `- Edges: ${graph.edges.length}`,
    '',
    '## Node Types',
    '',
    ...Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Edge Types',
    '',
    ...Object.entries(edgeTypes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Top Hubs',
    '',
    ...hubs.map((n, i) => `${i + 1}. ${n.label} (${n.type}) - degree ${n.degree}`),
    '',
    '## Notes',
    '',
    '- EXTRACTED edges come from internal links, headings, or exact dictionary matches.',
    '- CURATED edges come from the existing paper taxonomy.',
    '- DERIVED edges connect pages that share multiple extracted entities.',
    '- No model inference was used, so missing synonyms should be fixed by extending the local dictionary.',
    '',
  ]
  return lines.join('\n')
}

function countBy(items, key) {
  const out = {}
  for (const item of items) out[item[key]] = (out[item[key]] || 0) + 1
  return out
}

const graph = build()
console.log(`[offline-kg] wrote ${path.relative(ROOT, SITE_JSON)} (${graph.nodes.length} nodes, ${graph.edges.length} edges)`)
console.log(`[offline-kg] wrote ${path.relative(ROOT, GRAPHIFY_JSON)} and ${path.relative(ROOT, GRAPH_REPORT)}`)
