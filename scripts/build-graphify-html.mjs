#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const GRAPHIFY_OUT = path.join(ROOT, 'graphify-out')
const GRAPHIFY_JSON = path.join(GRAPHIFY_OUT, 'graph.json')
const GRAPHIFY_LABELS = path.join(GRAPHIFY_OUT, '.graphify_labels.json')
const GRAPHIFY_HTML = path.join(GRAPHIFY_OUT, 'graph.html')
const PUBLIC_GRAPH_HTML = path.join(ROOT, 'docs', 'public', 'graphs', 'graphify.html')
const PUBLIC_VIS_NETWORK = path.join(ROOT, 'docs', 'public', 'graphs', 'vis-network.min.js')

const TYPE_SCORE = {
  track: 1000,
  route: 900,
  concept: 760,
  data: 720,
  benchmark: 720,
  robot: 700,
  org: 680,
  paper: 520,
  topic: 420,
  ecosystem: 360,
  index: 300,
  page: 260,
  home: 220,
  section: 0,
}

function findGraphifyBin() {
  const candidates = [
    process.env.GRAPHIFY_BIN,
    path.join(ROOT, 'tmp', 'graphify-venv', 'bin', 'graphify'),
    'graphify',
  ].filter(Boolean)

  for (const candidate of candidates) {
    const isPath = candidate.includes(path.sep)
    if (isPath && !fs.existsSync(candidate)) continue
    const result = spawnSync(candidate, ['--help'], { cwd: ROOT, encoding: 'utf-8' })
    if (result.status === 0) return candidate
  }

  throw new Error('Graphify CLI not found. Install graphifyy or set GRAPHIFY_BIN=/path/to/graphify.')
}

function buildCommunityLabels(graph) {
  const groups = new Map()
  for (const node of graph.nodes || []) {
    if (node.community === undefined || node.community === null) continue
    const cid = Number(node.community)
    if (!groups.has(cid)) groups.set(cid, [])
    groups.get(cid).push(node)
  }

  const labels = {}
  for (const [cid, nodes] of groups.entries()) {
    const ranked = nodes
      .filter((node) => node.type !== 'section')
      .map((node) => ({
        node,
        score: (TYPE_SCORE[node.type] || 100) + Number(node.degree || 0),
      }))
      .sort((a, b) => b.score - a.score || String(a.node.label).localeCompare(String(b.node.label), 'zh-Hans-CN'))

    const seen = new Set()
    const parts = []
    for (const { node } of ranked) {
      const label = String(node.label || '').trim()
      if (!label || seen.has(label.toLowerCase())) continue
      seen.add(label.toLowerCase())
      parts.push(label)
      if (parts.length >= 3) break
    }
    labels[String(cid)] = parts.length ? parts.join(' / ') : `Community ${cid}`
  }
  return labels
}

function main() {
  const graphify = findGraphifyBin()
  execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'build-offline-knowledge-graph.mjs')], {
    cwd: ROOT,
    stdio: 'inherit',
  })
  execFileSync(graphify, ['cluster-only', ROOT, '--no-label'], {
    cwd: ROOT,
    stdio: 'inherit',
  })

  const graph = JSON.parse(fs.readFileSync(GRAPHIFY_JSON, 'utf-8'))
  fs.writeFileSync(GRAPHIFY_LABELS, JSON.stringify(buildCommunityLabels(graph), null, 2) + '\n', 'utf-8')
  execFileSync(graphify, ['export', 'html', '--graph', GRAPHIFY_JSON, '--labels', GRAPHIFY_LABELS, '--node-limit', '3000'], {
    cwd: ROOT,
    stdio: 'inherit',
  })

  fs.mkdirSync(path.dirname(PUBLIC_GRAPH_HTML), { recursive: true })
  fs.copyFileSync(GRAPHIFY_HTML, PUBLIC_GRAPH_HTML)
  enhanceGraphifyHtml()
  console.log(`[graphify-html] wrote ${path.relative(ROOT, PUBLIC_GRAPH_HTML)}`)
}

function enhanceGraphifyHtml() {
  if (!fs.existsSync(PUBLIC_VIS_NETWORK)) {
    console.warn(`[graphify-html] ${path.relative(ROOT, PUBLIC_VIS_NETWORK)} missing; keeping Graphify CDN script tag`)
    return
  }

  const html = fs.readFileSync(PUBLIC_GRAPH_HTML, 'utf-8')
  const local = '<script src="./vis-network.min.js"></script>'
  const updated = html
    .replace(
      /<script src="https:\/\/unpkg\.com\/vis-network@9\.1\.6\/standalone\/umd\/vis-network\.min\.js"[\s\S]*?<\/script>/,
      local
    )
    .replace(
      /<title>graphify - [\s\S]*?<\/title>/,
      '<title>Graphify 离线全站知识图谱</title>'
    )
    .replace(/<style>[\s\S]*?<\/style>/, graphifyAtlasStyles())
    .replace(
      '<body>\n<div id="graph"></div>',
      `<body>
<main id="graph-stage">
  <div id="atlas-grid" aria-hidden="true"></div>
  <div id="graph"></div>
  <section id="atlas-hud" aria-label="Knowledge graph overview">
    <div>
      <span class="atlas-kicker">Embodied-AI Atlas</span>
      <strong>Graphify Knowledge Field</strong>
    </div>
    <div class="atlas-metrics">
      <span data-atlas-stats>1368 nodes · 9159 edges · 40 communities</span>
      <span>Offline · Local</span>
    </div>
  </section>
</main>`
    )
    .replace('</body>', `${graphifyAtlasScript()}\n</body>`)
  fs.writeFileSync(PUBLIC_GRAPH_HTML, updated, 'utf-8')
}

function graphifyAtlasStyles() {
  return `<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    color-scheme: dark;
    --atlas-bg: #050509;
    --atlas-panel: rgba(13, 16, 28, 0.84);
    --atlas-line: rgba(132, 178, 255, 0.18);
    --atlas-text: #edf5ff;
    --atlas-muted: #92a2bd;
    --atlas-cyan: #5de4ff;
    --atlas-pink: #ff8ca8;
    --atlas-gold: #ffd166;
    --atlas-green: #8cffc1;
  }
  body {
    height: 100vh;
    overflow: hidden;
    display: flex;
    background:
      linear-gradient(135deg, rgba(93, 228, 255, 0.08), transparent 28%),
      linear-gradient(315deg, rgba(255, 140, 168, 0.08), transparent 32%),
      var(--atlas-bg);
    color: var(--atlas-text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.38), #000 26%, #000 74%, rgba(0, 0, 0, 0.22));
  }
  #graph-stage {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    isolation: isolate;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 30%),
      #07070d;
  }
  #atlas-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      linear-gradient(120deg, transparent 0 48%, rgba(93, 228, 255, 0.08) 49%, transparent 51% 100%),
      linear-gradient(60deg, transparent 0 50%, rgba(255, 209, 102, 0.06) 51%, transparent 53% 100%);
    background-size: 180px 180px, 240px 240px;
    opacity: 0.45;
  }
  #graph {
    position: absolute;
    inset: 0;
    z-index: 1;
  }
  #graph::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(5, 5, 9, 0.66), transparent 18%, transparent 80%, rgba(5, 5, 9, 0.46)),
      linear-gradient(180deg, rgba(5, 5, 9, 0.52), transparent 22%, transparent 84%, rgba(5, 5, 9, 0.5));
  }
  #atlas-hud {
    position: absolute;
    top: 18px;
    left: 20px;
    right: 22px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    pointer-events: none;
  }
  #atlas-hud > div:first-child {
    display: grid;
    gap: 4px;
    padding: 12px 14px;
    border: 1px solid rgba(93, 228, 255, 0.26);
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(11, 14, 26, 0.88), rgba(25, 19, 34, 0.72));
    box-shadow: 0 18px 70px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(14px);
  }
  #atlas-hud strong {
    font-size: 15px;
    line-height: 1.1;
    color: #ffffff;
    text-shadow: 0 0 18px rgba(93, 228, 255, 0.54);
  }
  .atlas-kicker {
    color: var(--atlas-cyan);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .atlas-metrics {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }
  .atlas-metrics span {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 7px 10px;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 8px;
    background: rgba(7, 9, 18, 0.68);
    color: #d7e4f8;
    font-size: 12px;
    font-weight: 700;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(12px);
  }
  #sidebar {
    width: 330px;
    background: var(--atlas-panel);
    border-left: 1px solid rgba(132, 178, 255, 0.22);
    box-shadow: -28px 0 72px rgba(0, 0, 0, 0.38);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(18px);
    z-index: 4;
  }
  #search-wrap {
    padding: 14px;
    border-bottom: 1px solid var(--atlas-line);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), transparent);
  }
  #search {
    width: 100%;
    height: 42px;
    background: rgba(4, 5, 12, 0.78);
    border: 1px solid rgba(132, 178, 255, 0.24);
    color: #f7fbff;
    padding: 0 12px;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 28px rgba(93, 228, 255, 0.08);
  }
  #search:focus {
    border-color: rgba(93, 228, 255, 0.78);
    box-shadow: 0 0 0 3px rgba(93, 228, 255, 0.12), 0 0 42px rgba(93, 228, 255, 0.14);
  }
  #search-results {
    max-height: 164px;
    overflow-y: auto;
    padding: 8px 14px;
    border-bottom: 1px solid var(--atlas-line);
    display: none;
    background: rgba(7, 9, 18, 0.86);
  }
  .search-item {
    padding: 7px 8px;
    cursor: pointer;
    border-radius: 6px;
    color: #e8f1ff;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search-item:hover {
    background: rgba(93, 228, 255, 0.12);
  }
  #info-panel {
    padding: 16px;
    border-bottom: 1px solid var(--atlas-line);
    min-height: 150px;
    background: rgba(255, 255, 255, 0.025);
  }
  #info-panel h3,
  #legend-wrap h3 {
    color: #aebbd3;
    font-size: 11px;
    font-weight: 850;
    margin-bottom: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  #info-content {
    color: #d2def1;
    font-size: 13px;
    line-height: 1.58;
  }
  #info-content .field {
    margin-bottom: 6px;
  }
  #info-content .field b {
    color: #ffffff;
    text-shadow: 0 0 16px rgba(255, 255, 255, 0.22);
  }
  #info-content .empty {
    color: #68748a;
    font-style: italic;
  }
  .neighbor-link {
    display: block;
    padding: 4px 8px;
    margin: 3px 0;
    border-radius: 5px;
    cursor: pointer;
    color: #dce8fa;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-left: 3px solid #333;
    background: rgba(255, 255, 255, 0.035);
  }
  .neighbor-link:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  #neighbors-list {
    max-height: 168px;
    overflow-y: auto;
    margin-top: 6px;
  }
  #legend-wrap {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
  }
  #legend-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 4px 0 8px;
  }
  #legend-controls label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #c9d6e9;
    font-size: 12px;
    user-select: none;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 30px;
    padding: 4px 4px;
    cursor: pointer;
    border-radius: 7px;
    color: #f1f6ff;
    font-size: 12px;
  }
  .legend-item:hover {
    background: rgba(255, 255, 255, 0.07);
  }
  .legend-item.dimmed {
    opacity: 0.33;
  }
  .legend-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 16px currentColor;
  }
  .legend-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .legend-count {
    color: #8390a8;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  .legend-cb,
  #select-all-cb {
    appearance: none;
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1.5px solid rgba(132, 178, 255, 0.42);
    border-radius: 4px;
    background: rgba(5, 7, 15, 0.92);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
  }
  .legend-cb:checked,
  #select-all-cb:checked {
    background: linear-gradient(135deg, var(--atlas-cyan), var(--atlas-pink));
    border-color: transparent;
    box-shadow: 0 0 16px rgba(93, 228, 255, 0.28);
  }
  .legend-cb:checked::after,
  #select-all-cb:checked::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 1.5px;
    width: 4px;
    height: 8px;
    border: solid #06101d;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  #select-all-cb:indeterminate {
    background: var(--atlas-gold);
    border-color: transparent;
  }
  #select-all-cb:indeterminate::after {
    content: "";
    position: absolute;
    left: 3px;
    top: 6px;
    width: 8px;
    height: 2px;
    background: #06101d;
  }
  #stats {
    padding: 12px 14px;
    border-top: 1px solid var(--atlas-line);
    color: #9ca9c0;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    background: rgba(255, 255, 255, 0.035);
  }
  @media (max-width: 860px) {
    body {
      display: block;
      overflow: auto;
    }
    #graph-stage {
      height: 72vh;
      min-height: 520px;
    }
    #sidebar {
      width: 100%;
      min-height: 360px;
      border-left: 0;
      border-top: 1px solid rgba(132, 178, 255, 0.22);
    }
    #atlas-hud {
      left: 12px;
      right: 12px;
      align-items: flex-start;
    }
    .atlas-metrics {
      display: none;
    }
  }
</style>`
}

function graphifyAtlasScript() {
  return `<script>
(function enhanceAtlas() {
  if (typeof network === 'undefined' || typeof nodesDS === 'undefined' || typeof edgesDS === 'undefined') return;
  const stats = document.getElementById('stats')?.textContent?.trim();
  const statsSlot = document.querySelector('[data-atlas-stats]');
  if (stats && statsSlot) statsSlot.textContent = stats;

  const colorByNode = new Map(RAW_NODES.map((node) => [node.id, node.color?.background || '#8bdcff']));
  const highDegree = Math.max(1, ...RAW_NODES.map((node) => Number(node.degree || 0)));
  const layout = buildAtlasLayout();
  nodesDS.update(RAW_NODES.map((node) => {
    const degree = Number(node.degree || 0);
    const isHub = degree >= 150 || node.file_type === 'paper' || node.id.startsWith('track:') || node.id.startsWith('route:');
    const glow = Math.max(10, Math.min(34, 10 + (degree / highDegree) * 34));
    const pos = layout.get(node.id) || { x: 0, y: 0 };
    return {
      id: node.id,
      x: pos.x,
      y: pos.y,
      borderWidth: isHub ? 3.6 : 1.8,
      shadow: { enabled: true, color: node.color?.background || '#8bdcff', size: isHub ? glow : glow * 0.7, x: 0, y: 0 },
      font: {
        ...(node.font || {}),
        color: '#f7fbff',
        strokeWidth: isHub ? 5 : 4,
        strokeColor: 'rgba(4, 5, 14, 0.92)',
        size: isHub ? Math.max(13, node.font?.size || 0) : node.font?.size || 0,
      },
    };
  }));

  edgesDS.update(RAW_EDGES.map((edge, index) => {
    const color = colorByNode.get(edge.from) || '#9edcff';
    const strong = edge.confidence === 'EXTRACTED';
    return {
      id: index,
      width: strong ? Math.max(0.55, Math.min(2.4, edge.width || 1.2)) : 0.6,
      color: { color, opacity: strong ? 0.34 : 0.16 },
      smooth: { type: 'dynamic', roundness: 0.2 },
    };
  }));

  network.setOptions({
    physics: { enabled: false },
    interaction: {
      hover: true,
      tooltipDelay: 80,
      hideEdgesOnDrag: true,
      zoomView: true,
      dragView: true,
    },
    nodes: {
      shape: 'dot',
      chosen: {
        node(values) {
          values.borderWidth = Math.max(values.borderWidth || 2, 5);
          values.shadowSize = 32;
        },
      },
    },
    edges: {
      smooth: { type: 'dynamic', roundness: 0.2 },
      selectionWidth: 4,
    },
  });

  setTimeout(() => {
    network.fit({ animation: { duration: 700, easingFunction: 'easeInOutQuad' } });
  }, 80);

  function buildAtlasLayout() {
    const groups = new Map();
    for (const node of RAW_NODES) {
      const cid = Number.isFinite(Number(node.community)) ? Number(node.community) : 0;
      if (!groups.has(cid)) groups.set(cid, []);
      groups.get(cid).push(node);
    }
    const rankedGroups = Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length || a[0] - b[0]);
    const ringCounts = [1, 10, 15, 14];
    const ringRadii = [0, 560, 980, 1360];
    const ringSeen = [0, 0, 0, 0];
    const out = new Map();

    rankedGroups.forEach(([cid, nodes], groupIndex) => {
      const ring = groupIndex === 0 ? 0 : groupIndex <= 10 ? 1 : groupIndex <= 25 ? 2 : 3;
      const positionInRing = ringSeen[ring]++;
      const countInRing = ringCounts[ring] || Math.max(1, ringSeen[ring]);
      const angle = ring === 0
        ? 0
        : (Math.PI * 2 * positionInRing) / countInRing + ring * 0.19 + (cid % 5) * 0.025;
      const center = {
        x: Math.cos(angle) * ringRadii[ring],
        y: Math.sin(angle) * ringRadii[ring] * 0.74,
      };
      const sortedNodes = [...nodes].sort((a, b) => Number(b.degree || 0) - Number(a.degree || 0));
      const spread = Math.max(84, Math.min(230, 22 * Math.sqrt(sortedNodes.length)));
      const normalizer = Math.max(1, Math.sqrt(sortedNodes.length));
      sortedNodes.forEach((node, nodeIndex) => {
        const localAngle = nodeIndex * 2.399963229728653 + cid * 0.41;
        const localRadius = nodeIndex === 0 ? 0 : (Math.sqrt(nodeIndex) / normalizer) * spread;
        const degreePull = Math.max(0.55, 1 - Math.min(0.42, Number(node.degree || 0) / highDegree));
        out.set(node.id, {
          x: Math.round(center.x + Math.cos(localAngle) * localRadius * degreePull),
          y: Math.round(center.y + Math.sin(localAngle) * localRadius * degreePull),
        });
      });
    });
    return out;
  }
})();
</script>`
}

main()
