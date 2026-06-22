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
      <span class="atlas-kicker">LOCAL KG / TACTICAL VIEW</span>
      <strong>Embodied-AI Neural Topology</strong>
      <em>offline graphify render · no external links</em>
    </div>
    <div class="atlas-metrics">
      <span data-atlas-nodes>1368 nodes</span>
      <span data-atlas-edges>9159 edges</span>
      <span data-atlas-communities>40 sectors</span>
      <span>LOCAL / 0 API</span>
    </div>
  </section>
  <section id="atlas-telemetry" aria-label="Graph telemetry">
    <div><b>CORE</b><span data-atlas-hotspot>VLA</span></div>
    <div><b>TRACE</b><span data-atlas-trace>semantic links</span></div>
    <div><b>SYNC</b><span data-atlas-runtime>realtime canvas</span></div>
  </section>
  <section id="atlas-readouts" aria-label="Build readouts">
    <span>MODE // OFFLINE KNOWLEDGE GRAPH</span>
    <span>SOURCE // MARKDOWN + TAXONOMY + LOCAL DICT</span>
    <span>FILTER // INTERNAL NODES ONLY</span>
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
    --atlas-bg: #010308;
    --atlas-panel: rgba(2, 6, 12, 0.94);
    --atlas-line: rgba(78, 236, 255, 0.28);
    --atlas-text: #edf9ff;
    --atlas-muted: #8094aa;
    --atlas-cyan: #42f4ff;
    --atlas-blue: #5d8cff;
    --atlas-pink: #ff4d96;
    --atlas-gold: #ffd166;
    --atlas-green: #74ffb0;
    --atlas-red: #ff4b4b;
  }
  body {
    height: 100vh;
    overflow: hidden;
    display: flex;
    background:
      radial-gradient(circle at 42% 46%, rgba(66, 244, 255, 0.11), transparent 32%),
      radial-gradient(circle at 68% 50%, rgba(116, 255, 176, 0.08), transparent 30%),
      linear-gradient(90deg, rgba(66, 244, 255, 0.1), transparent 18%, transparent 82%, rgba(255, 77, 150, 0.08)),
      linear-gradient(180deg, rgba(116, 255, 176, 0.05), transparent 38%),
      var(--atlas-bg);
    color: var(--atlas-text);
    font-family: "SF Mono", "Cascadia Mono", "Roboto Mono", ui-monospace, Menlo, Consolas, monospace;
    letter-spacing: 0;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(66, 244, 255, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(66, 244, 255, 0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.38), #000 26%, #000 74%, rgba(0, 0, 0, 0.22));
  }
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 20;
    pointer-events: none;
    background:
      repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 4px),
      linear-gradient(90deg, rgba(255, 77, 150, 0.05), transparent 24%, transparent 76%, rgba(66, 244, 255, 0.04));
    mix-blend-mode: overlay;
    opacity: 0.18;
  }
  #graph-stage {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 50% 48%, rgba(66, 244, 255, 0.08), transparent 34%),
      linear-gradient(180deg, rgba(66, 244, 255, 0.04), transparent 24%),
      #010308;
  }
  #graph-stage::before {
    content: "";
    position: absolute;
    inset: 16px;
    z-index: 5;
    pointer-events: none;
    border: 1px solid rgba(66, 244, 255, 0.28);
    clip-path: polygon(0 0, 160px 0, 160px 1px, 1px 1px, 1px 120px, 0 120px, 0 0, 100% 0, 100% 120px, calc(100% - 1px) 120px, calc(100% - 1px) 1px, calc(100% - 160px) 1px, calc(100% - 160px) 0, 100% 0, 100% 100%, calc(100% - 160px) 100%, calc(100% - 160px) calc(100% - 1px), calc(100% - 1px) calc(100% - 1px), calc(100% - 1px) calc(100% - 120px), 100% calc(100% - 120px), 100% 100%, 0 100%, 0 calc(100% - 120px), 1px calc(100% - 120px), 1px calc(100% - 1px), 160px calc(100% - 1px), 160px 100%, 0 100%);
    box-shadow: 0 0 34px rgba(66, 244, 255, 0.18), inset 0 0 52px rgba(66, 244, 255, 0.035);
  }
  #graph-stage::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -18%;
    height: 18%;
    z-index: 6;
    pointer-events: none;
    background: linear-gradient(180deg, transparent, rgba(66, 244, 255, 0.1), transparent);
    mix-blend-mode: screen;
  }
  #atlas-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      linear-gradient(rgba(66, 244, 255, 0.075) 1px, transparent 1px),
      linear-gradient(90deg, rgba(66, 244, 255, 0.075) 1px, transparent 1px),
      linear-gradient(120deg, transparent 0 49%, rgba(116, 255, 176, 0.055) 49.4%, transparent 50.8% 100%);
    background-size: 56px 56px, 56px 56px, 210px 210px;
    opacity: 0.72;
  }
  #atlas-grid::before,
  #atlas-grid::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  #atlas-grid::before {
    background:
      linear-gradient(90deg, transparent 0 49.8%, rgba(66, 244, 255, 0.2) 50%, transparent 50.2% 100%),
      linear-gradient(180deg, transparent 0 49.8%, rgba(66, 244, 255, 0.16) 50%, transparent 50.2% 100%);
    opacity: 0.42;
  }
  #atlas-grid::after {
    background:
      linear-gradient(135deg, transparent 0 48%, rgba(66, 244, 255, 0.055) 49%, transparent 50% 100%);
    mix-blend-mode: screen;
    opacity: 0.42;
  }
  #graph {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  #graph::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 52% 48%, transparent 0 42%, rgba(1, 3, 8, 0.12) 56%, rgba(1, 3, 8, 0.78) 100%),
      linear-gradient(90deg, rgba(1, 3, 8, 0.76), transparent 17%, transparent 78%, rgba(1, 3, 8, 0.58));
  }
  #atlas-hud {
    position: absolute;
    top: 18px;
    left: 20px;
    right: 22px;
    z-index: 8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    pointer-events: none;
  }
  #atlas-hud > div:first-child {
    display: grid;
    gap: 4px;
    min-width: 330px;
    padding: 11px 16px 12px;
    border: 1px solid rgba(66, 244, 255, 0.58);
    border-left: 3px solid var(--atlas-cyan);
    border-radius: 2px;
    background:
      linear-gradient(90deg, rgba(66, 244, 255, 0.12), rgba(2, 6, 12, 0.88) 36%, rgba(2, 6, 12, 0.76)),
      rgba(2, 6, 12, 0.86);
    box-shadow: 0 18px 70px rgba(0, 0, 0, 0.44), 0 0 42px rgba(66, 244, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.09);
    backdrop-filter: blur(12px);
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  #atlas-hud strong {
    font-size: 15px;
    line-height: 1.1;
    color: #ffffff;
    text-shadow: 0 0 16px rgba(65, 230, 255, 0.62);
    text-transform: uppercase;
  }
  #atlas-hud em {
    color: #8aa5b8;
    font-size: 10px;
    font-style: normal;
    font-weight: 760;
    text-transform: uppercase;
  }
  .atlas-kicker {
    color: var(--atlas-green);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.2em;
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
    border: 1px solid rgba(66, 244, 255, 0.34);
    border-radius: 2px;
    background:
      linear-gradient(180deg, rgba(66, 244, 255, 0.08), transparent),
      rgba(2, 6, 12, 0.76);
    color: #e6fbff;
    font-size: 11px;
    font-weight: 760;
    text-transform: uppercase;
    box-shadow: 0 0 24px rgba(66, 244, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(12px);
  }
  #atlas-telemetry {
    position: absolute;
    top: 104px;
    right: 22px;
    z-index: 8;
    width: 250px;
    display: grid;
    gap: 7px;
    pointer-events: none;
  }
  #atlas-telemetry div {
    position: relative;
    display: grid;
    grid-template-columns: 58px 1fr;
    align-items: center;
    min-height: 34px;
    padding: 7px 10px;
    border: 1px solid rgba(66, 244, 255, 0.24);
    border-right: 3px solid rgba(116, 255, 176, 0.72);
    background: rgba(2, 6, 12, 0.68);
    box-shadow: 0 0 24px rgba(66, 244, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.055);
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
    backdrop-filter: blur(10px);
  }
  #atlas-telemetry b {
    color: var(--atlas-green);
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.14em;
  }
  #atlas-telemetry span {
    overflow: hidden;
    color: #e9fbff;
    font-size: 11px;
    font-weight: 760;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }
  #atlas-readouts {
    position: absolute;
    left: 20px;
    bottom: 18px;
    z-index: 8;
    display: grid;
    gap: 6px;
    pointer-events: none;
  }
  #atlas-readouts span {
    width: max-content;
    max-width: 360px;
    padding: 6px 9px;
    border-left: 2px solid var(--atlas-green);
    background: rgba(2, 6, 12, 0.7);
    color: #bfffd3;
    font-size: 10px;
    font-weight: 780;
    letter-spacing: 0.08em;
    box-shadow: 0 0 18px rgba(116, 255, 176, 0.1);
  }
  #sidebar {
    width: 354px;
    background: var(--atlas-panel);
    border-left: 1px solid rgba(66, 244, 255, 0.38);
    box-shadow: -28px 0 72px rgba(0, 0, 0, 0.48), -1px 0 34px rgba(66, 244, 255, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(18px);
    z-index: 9;
  }
  #search-wrap {
    padding: 14px;
    border-bottom: 1px solid var(--atlas-line);
    background: linear-gradient(180deg, rgba(65, 230, 255, 0.05), transparent);
  }
  #search {
    width: 100%;
    height: 42px;
    background: rgba(4, 5, 12, 0.78);
    border: 1px solid rgba(132, 178, 255, 0.24);
    color: #f7fbff;
    padding: 0 12px;
    border-radius: 2px;
    font-size: 13px;
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 28px rgba(93, 228, 255, 0.08);
  }
  #search:focus {
    border-color: rgba(65, 230, 255, 0.78);
    box-shadow: 0 0 0 2px rgba(65, 230, 255, 0.14), 0 0 42px rgba(65, 230, 255, 0.13);
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
    color: #95f8ff;
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
    background: rgba(65, 230, 255, 0.045);
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
    border-radius: 2px;
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
    background: var(--atlas-cyan);
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
  @media (max-width: 1100px) {
    .atlas-metrics {
      display: none;
    }
    #sidebar {
      width: 314px;
    }
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
    #atlas-telemetry {
      display: none;
    }
    #atlas-readouts {
      left: 12px;
      bottom: 12px;
    }
    #atlas-readouts span {
      max-width: calc(100vw - 32px);
    }
  }
</style>`
}

function graphifyAtlasScript() {
  return `<script>
(function enhanceAtlas() {
  if (typeof network === 'undefined' || typeof nodesDS === 'undefined' || typeof edgesDS === 'undefined') return;
  const stats = document.getElementById('stats')?.textContent?.trim();
  const statMatch = stats?.match(/(\\d+) nodes · (\\d+) edges · (\\d+) communities/);
  if (statMatch) {
    document.querySelector('[data-atlas-nodes]').textContent = statMatch[1] + ' nodes';
    document.querySelector('[data-atlas-edges]').textContent = statMatch[2] + ' edges';
    document.querySelector('[data-atlas-communities]').textContent = statMatch[3] + ' sectors';
    document.querySelector('[data-atlas-trace]').textContent = statMatch[2] + ' semantic links';
    document.querySelector('[data-atlas-runtime]').textContent = statMatch[3] + ' sectors locked';
  }

  const colorByNode = new Map(RAW_NODES.map((node) => [node.id, node.color?.background || '#8bdcff']));
  const highDegree = Math.max(1, ...RAW_NODES.map((node) => Number(node.degree || 0)));
  const topNode = [...RAW_NODES].sort((a, b) => Number(b.degree || 0) - Number(a.degree || 0))[0];
  if (topNode) {
    document.querySelector('[data-atlas-hotspot]').textContent = topNode.label + ' · ' + Number(topNode.degree || 0);
  }
  const layout = buildAtlasLayout();
  const sectorCenters = layout.sectors;
  nodesDS.update(RAW_NODES.map((node) => {
    const degree = Number(node.degree || 0);
    const isCommand = degree >= 250 || node.id.startsWith('track:') || node.id.startsWith('route:');
    const isHub = isCommand || degree >= 150 || node.file_type === 'paper';
    const glow = Math.max(10, Math.min(34, 10 + (degree / highDegree) * 34));
    const pos = layout.nodes.get(node.id) || { x: 0, y: 0 };
    const baseColor = node.color?.background || '#42f4ff';
    return {
      id: node.id,
      x: pos.x,
      y: pos.y,
      shape: isCommand ? 'diamond' : 'dot',
      borderWidth: isHub ? 3.6 : 1.8,
      color: {
        ...(node.color || {}),
        background: baseColor,
        border: isHub ? '#f5fdff' : baseColor,
        highlight: { background: '#ffffff', border: baseColor },
        hover: { background: '#ffffff', border: baseColor },
      },
      shadow: isHub ? { enabled: true, color: baseColor, size: Math.min(glow, 22), x: 0, y: 0 } : false,
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
      hoverWidth: strong ? 3.2 : 1.8,
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

  network.on('afterDrawing', (ctx) => {
    drawTacticalOverlay(ctx, sectorCenters);
  });

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
    const nodesOut = new Map();
    const sectorOut = new Map();

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
        nodesOut.set(node.id, {
          x: Math.round(center.x + Math.cos(localAngle) * localRadius * degreePull),
          y: Math.round(center.y + Math.sin(localAngle) * localRadius * degreePull),
        });
      });
      const legend = LEGEND.find((item) => item.cid === cid);
      sectorOut.set(cid, {
        x: Math.round(center.x),
        y: Math.round(center.y),
        ring,
        radius: Math.round(spread * 0.72 + 34),
        color: legend?.color || '#41e6ff',
        label: (legend?.label || 'Sector ' + cid).slice(0, 38),
        count: nodes.length,
      });
    });
    return { nodes: nodesOut, sectors: sectorOut };
  }

  function drawTacticalOverlay(ctx, sectors) {
    if (!sectors || sectors.size === 0) return;
    ctx.save();
    const ranked = Array.from(sectors.values()).sort((a, b) => b.count - a.count).slice(0, 18);
    ranked.forEach((sector, index) => {
      const labelY = sector.y - sector.radius - 28;
      const labelX = sector.x - 82;
      const width = Math.min(250, Math.max(110, sector.label.length * 7.2));
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = 'rgba(3, 5, 8, 0.76)';
      ctx.strokeStyle = sector.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(labelX, labelY, width, 26);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = sector.color;
      ctx.font = '700 10px ui-monospace, Menlo, Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('S' + String(index + 1).padStart(2, '0') + ' / ' + sector.count, labelX + 7, labelY + 10);
      ctx.fillStyle = '#dffbff';
      ctx.font = '700 11px ui-monospace, Menlo, Consolas, monospace';
      ctx.fillText(sector.label, labelX + 7, labelY + 22, width - 14);
    });
    ctx.restore();
  }
})();
</script>`
}

main()
