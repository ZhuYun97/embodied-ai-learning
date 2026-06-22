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

  const rawById = new Map(RAW_NODES.map((node) => [node.id, node]));
  const colorByNode = new Map(RAW_NODES.map((node) => [node.id, node.color?.background || '#8bdcff']));
  const highDegree = Math.max(1, ...RAW_NODES.map((node) => Number(node.degree || 0)));
  const topNode = [...RAW_NODES].sort((a, b) => Number(b.degree || 0) - Number(a.degree || 0))[0];
  if (topNode) {
    document.querySelector('[data-atlas-hotspot]').textContent = topNode.label + ' · ' + Number(topNode.degree || 0);
  }
  const layout = buildAtlasLayout();
  const sectorCenters = layout.sectors;
  const labelState = new Map();
  const nodeVisuals = new Map();
  nodesDS.update(RAW_NODES.map((node) => {
    const degree = Number(node.degree || 0);
    const isCommand = degree >= 250 || node.id.startsWith('track:') || node.id.startsWith('route:');
    const isHub = isCommand || degree >= 150 || node.file_type === 'paper';
    const glow = Math.max(10, Math.min(34, 10 + (degree / highDegree) * 34));
    const pos = layout.nodes.get(node.id) || { x: 0, y: 0 };
    const baseColor = node.color?.background || '#42f4ff';
    const visual = nodeVisualFor(node, baseColor, degree, isCommand, isHub);
    nodeVisuals.set(node.id, { ...visual, id: node.id, x: pos.x, y: pos.y });
    return {
      id: node.id,
      label: '',
      x: pos.x,
      y: pos.y,
      shape: visual.shape,
      size: visual.size,
      borderWidth: visual.borderWidth,
      borderWidthSelected: visual.borderWidth + 2.2,
      color: {
        ...(node.color || {}),
        background: visual.fill,
        border: visual.border,
        highlight: { background: visual.highlightFill, border: '#f7ffff' },
        hover: { background: visual.hoverFill, border: '#f7ffff' },
      },
      shadow: visual.tier !== 'node'
        ? { enabled: true, color: rgbaFromHex(baseColor, visual.tier === 'core' ? 0.42 : 0.28), size: Math.min(glow, 20), x: 0, y: 0 }
        : false,
      font: {
        ...(node.font || {}),
        color: '#f7fbff',
        strokeWidth: isHub ? 5 : 4,
        strokeColor: 'rgba(4, 5, 14, 0.92)',
        size: 0,
      },
    };
  }));

  edgesDS.update(RAW_EDGES.map((edge, index) => {
    const color = colorByNode.get(edge.from) || '#9edcff';
    const strong = edge.confidence === 'EXTRACTED';
    return {
      id: index,
      width: strong ? Math.max(0.45, Math.min(1.25, edge.width || 1)) : 0.35,
      color: { color, opacity: strong ? 0.18 : 0.07 },
      hoverWidth: strong ? 2.2 : 1.2,
      arrows: { to: { enabled: false } },
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
      selectionWidth: 2.4,
      arrows: { to: { enabled: false } },
    },
  });

  setTimeout(() => {
    network.fit({ animation: { duration: 700, easingFunction: 'easeInOutQuad' } });
    updateLabels();
  }, 80);

  network.on('beforeDrawing', (ctx) => {
    drawNodeAuras(ctx, network.getScale());
  });
  network.on('afterDrawing', (ctx) => {
    drawNodeTechDetails(ctx, network.getScale());
    drawTacticalOverlay(ctx, sectorCenters, network.getScale());
  });
  network.on('zoom', () => scheduleLabelUpdate());
  network.on('dragEnd', () => scheduleLabelUpdate());
  network.on('selectNode', () => scheduleLabelUpdate(true));
  network.on('deselectNode', () => scheduleLabelUpdate(true));

  let labelTimer = 0;
  function scheduleLabelUpdate(immediate = false) {
    clearTimeout(labelTimer);
    if (immediate) {
      updateLabels();
      return;
    }
    labelTimer = setTimeout(updateLabels, 90);
  }

  function localLabelIdsFor(scale, selectedIds) {
    const ids = new Set(selectedIds);
    if (!selectedIds.size) return ids;
    const limit = scale < 1 ? 6 : scale < 1.55 ? 14 : scale < 2.1 ? 24 : 36;
    const candidates = new Map();
    for (const selectedId of selectedIds) {
      for (const neighborId of network.getConnectedNodes(selectedId)) {
        const node = rawById.get(neighborId);
        if (!node || ids.has(neighborId)) continue;
        const degree = Number(node.degree || 0);
        const score = degree
          + (node.file_type === 'paper' ? 90 : 0)
          + (node.file_type === 'concept' ? 50 : 0)
          + (node.id.startsWith('route:') || node.id.startsWith('track:') ? 45 : 0);
        if (!candidates.has(neighborId) || candidates.get(neighborId).score < score) {
          candidates.set(neighborId, { id: neighborId, score });
        }
      }
    }
    Array.from(candidates.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .forEach((item) => ids.add(item.id));
    return ids;
  }

  function labelLevelFor(node, scale, selectedIds, localLabelIds) {
    const degree = Number(node.degree || 0);
    if (selectedIds.has(node.id)) return 4;
    if (localLabelIds.has(node.id)) return scale < 1.15 ? 2 : scale < 1.8 ? 3 : 4;
    if (scale < 0.38) return degree >= 420 || node.id.startsWith('track:') ? 1 : 0;
    if (scale < 0.62) return degree >= 300 || node.id.startsWith('track:') || node.id.startsWith('route:') ? 1 : 0;
    if (scale < 0.86) return degree >= 180 || node.file_type === 'paper' || node.id.startsWith('track:') || node.id.startsWith('route:') ? 2 : 0;
    if (scale < 1.16) return degree >= 140 || (node.file_type === 'paper' && degree >= 80) ? 3 : 0;
    if (scale < 1.55) return degree >= 110 || (node.file_type === 'paper' && degree >= 65) || node.id.startsWith('route:') || node.id.startsWith('track:') ? 3 : 0;
    if (scale < 2.15) return degree >= 75 || (node.file_type === 'paper' && degree >= 45) || node.id.startsWith('route:') || node.id.startsWith('track:') ? 3 : 0;
    return degree >= 38 || node.file_type === 'paper' || node.id.startsWith('route:') || node.id.startsWith('track:') ? 4 : 0;
  }

  function updateLabels() {
    const scale = network.getScale();
    const selectedIds = new Set(network.getSelectedNodes());
    const localLabelIds = localLabelIdsFor(scale, selectedIds);
    const updates = [];
    for (const node of RAW_NODES) {
      const level = labelLevelFor(node, scale, selectedIds, localLabelIds);
      const fontSize = level === 0 ? 0 : level === 1 ? 12 : level === 2 ? 13 : level === 3 ? 14 : 15;
      const next = level === 0 ? '' : node.label;
      const stateKey = next + '|' + fontSize;
      if (labelState.get(node.id) === stateKey) continue;
      labelState.set(node.id, stateKey);
      updates.push({
        id: node.id,
        label: next,
        font: {
          ...(node.font || {}),
          color: '#f7fbff',
          strokeWidth: level >= 3 ? 6 : 5,
          strokeColor: 'rgba(1, 3, 8, 0.96)',
          size: fontSize,
        },
      });
    }
    if (updates.length) nodesDS.update(updates);
  }

  function revealNodeLabel(nodeId) {
    const node = rawById.get(nodeId);
    if (!node) return;
    labelState.delete(node.id);
    nodesDS.update({
      id: node.id,
      label: node.label,
      font: {
        ...(node.font || {}),
        color: '#ffffff',
        strokeWidth: 6,
        strokeColor: 'rgba(1, 3, 8, 0.98)',
        size: 15,
      },
    });
  }

  network.on('hoverNode', (params) => revealNodeLabel(params.node));
  network.on('blurNode', () => scheduleLabelUpdate(true));
  network.on('animationFinished', () => scheduleLabelUpdate(true));

  function nodeVisualFor(node, baseColor, degree, isCommand, isHub) {
    const baseSize = Number(node.size || 10);
    const isPaper = node.file_type === 'paper';
    const isMajor = isHub || degree >= 75 || node.id.startsWith('org:') || node.id.startsWith('data:');
    const tier = isCommand ? 'core' : isHub ? 'hub' : isMajor ? 'major' : 'node';
    const shape = isCommand ? 'diamond' : isPaper ? 'square' : 'dot';
    const size = tier === 'core'
      ? Math.max(18, Math.min(32, baseSize * 0.86 + 7))
      : tier === 'hub'
        ? Math.max(14, Math.min(26, baseSize * 0.86 + 4))
        : tier === 'major'
          ? Math.max(9, Math.min(18, baseSize * 0.9))
          : Math.max(6.4, Math.min(12.5, baseSize * 0.82));
    return {
      tier,
      shape,
      size,
      baseColor,
      fill: mixHex(baseColor, '#020711', tier === 'node' ? 0.18 : tier === 'major' ? 0.26 : 0.34),
      border: mixHex(baseColor, '#f1ffff', tier === 'node' ? 0.18 : tier === 'major' ? 0.32 : 0.48),
      hoverFill: mixHex(baseColor, '#eaffff', 0.4),
      highlightFill: mixHex(baseColor, '#ffffff', 0.54),
      borderWidth: tier === 'core' ? 3.8 : tier === 'hub' ? 2.8 : tier === 'major' ? 2 : 1.25,
      auraAlpha: tier === 'core' ? 0.36 : tier === 'hub' ? 0.24 : tier === 'major' ? 0.13 : 0,
      degree,
    };
  }

  function drawNodeAuras(ctx, scale) {
    const visuals = visibleNodeVisuals(scale).filter((visual) => visual.auraAlpha > 0);
    if (!visuals.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const visual of visuals) {
      const radius = visual.size * (visual.tier === 'core' ? 2.9 : visual.tier === 'hub' ? 2.25 : 1.75);
      const gradient = ctx.createRadialGradient(visual.x, visual.y, visual.size * 0.35, visual.x, visual.y, radius);
      gradient.addColorStop(0, rgbaFromHex(visual.baseColor, visual.auraAlpha));
      gradient.addColorStop(0.58, rgbaFromHex(visual.baseColor, visual.auraAlpha * 0.2));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(visual.x, visual.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawNodeTechDetails(ctx, scale) {
    const visuals = visibleNodeVisuals(scale).filter((visual) => (
      visual.tier !== 'node' || (scale > 1.1 && visual.degree >= 10)
    ));
    if (!visuals.length) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const visual of visuals) {
      if (visual.shape === 'diamond') {
        drawDiamondNode(ctx, visual, scale);
      } else if (visual.shape === 'square') {
        drawSquareNode(ctx, visual, scale);
      } else {
        drawRoundNode(ctx, visual, scale);
      }
      drawNodeGlint(ctx, visual, scale);
    }
    ctx.restore();
  }

  function drawRoundNode(ctx, visual, scale) {
    const ring = visual.size + (visual.tier === 'node' ? 2.2 : 3.4) / scale;
    ctx.setLineDash(visual.tier === 'node' ? [] : [5 / scale, 3.5 / scale]);
    ctx.lineWidth = (visual.tier === 'core' ? 1.9 : visual.tier === 'hub' ? 1.45 : 1.05) / scale;
    ctx.strokeStyle = rgbaFromHex(visual.baseColor, visual.tier === 'node' ? 0.44 : 0.78);
    ctx.beginPath();
    ctx.arc(visual.x, visual.y, ring, 0, Math.PI * 2);
    ctx.stroke();
    if (visual.tier === 'hub' || visual.tier === 'core') {
      drawCardinalTicks(ctx, visual, ring + 4.5 / scale, ring + 12 / scale, scale);
    }
  }

  function drawDiamondNode(ctx, visual, scale) {
    const radius = visual.size + 4.5 / scale;
    ctx.setLineDash([]);
    ctx.lineWidth = 1.45 / scale;
    ctx.strokeStyle = rgbaFromHex(visual.baseColor, 0.86);
    drawDiamondPath(ctx, visual.x, visual.y, radius);
    ctx.stroke();
    ctx.lineWidth = 0.85 / scale;
    ctx.strokeStyle = rgbaFromHex('#ffffff', 0.62);
    drawDiamondPath(ctx, visual.x, visual.y, visual.size * 0.62);
    ctx.stroke();
    drawCardinalTicks(ctx, visual, radius + 4 / scale, radius + 13 / scale, scale);
  }

  function drawSquareNode(ctx, visual, scale) {
    const radius = visual.size + 3 / scale;
    ctx.setLineDash([4 / scale, 3 / scale]);
    ctx.lineWidth = 1.1 / scale;
    ctx.strokeStyle = rgbaFromHex(visual.baseColor, 0.68);
    ctx.strokeRect(visual.x - radius, visual.y - radius, radius * 2, radius * 2);
    if (visual.tier === 'hub') {
      drawCardinalTicks(ctx, visual, radius + 3 / scale, radius + 10 / scale, scale);
    }
  }

  function drawCardinalTicks(ctx, visual, inner, outer, scale) {
    ctx.setLineDash([]);
    ctx.lineWidth = (visual.tier === 'core' ? 1.6 : 1.05) / scale;
    ctx.strokeStyle = rgbaFromHex(visual.baseColor, visual.tier === 'core' ? 0.9 : 0.68);
    for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
      ctx.beginPath();
      ctx.moveTo(visual.x + Math.cos(angle) * inner, visual.y + Math.sin(angle) * inner);
      ctx.lineTo(visual.x + Math.cos(angle) * outer, visual.y + Math.sin(angle) * outer);
      ctx.stroke();
    }
  }

  function drawNodeGlint(ctx, visual, scale) {
    if (visual.tier === 'node' && scale < 1.25) return;
    const radius = Math.max(1.2 / scale, visual.size * 0.12);
    ctx.setLineDash([]);
    ctx.fillStyle = rgbaFromHex('#ffffff', visual.tier === 'node' ? 0.5 : 0.74);
    ctx.beginPath();
    ctx.arc(visual.x - visual.size * 0.32, visual.y - visual.size * 0.32, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawDiamondPath(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius, y);
    ctx.closePath();
  }

  function visibleNodeVisuals(scale) {
    const center = network.getViewPosition();
    const width = container.clientWidth || window.innerWidth || 1280;
    const height = container.clientHeight || window.innerHeight || 720;
    const margin = 180 / Math.max(scale, 0.12);
    const bounds = {
      left: center.x - width / (2 * scale) - margin,
      right: center.x + width / (2 * scale) + margin,
      top: center.y - height / (2 * scale) - margin,
      bottom: center.y + height / (2 * scale) + margin,
    };
    const positions = network.getPositions();
    const visible = [];
    for (const node of RAW_NODES) {
      const visual = nodeVisuals.get(node.id);
      if (!visual) continue;
      const pos = positions[node.id] || visual;
      if (pos.x < bounds.left || pos.x > bounds.right || pos.y < bounds.top || pos.y > bounds.bottom) continue;
      visible.push({ ...visual, x: pos.x, y: pos.y });
    }
    return visible;
  }

  function rgbaFromHex(hex, alpha) {
    const rgb = hexToRgb(hex);
    return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')';
  }

  function mixHex(hex, target, amount) {
    const a = hexToRgb(hex);
    const b = hexToRgb(target);
    const mix = (from, to) => Math.round(from + (to - from) * amount);
    return '#' + [mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('');
  }

  function hexToRgb(hex) {
    const fallback = { r: 66, g: 244, b: 255 };
    if (typeof hex !== 'string') return fallback;
    const normalized = hex.trim().replace('#', '');
    if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(normalized)) return fallback;
    const full = normalized.length === 3
      ? normalized.split('').map((char) => char + char).join('')
      : normalized;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  }

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

  function drawTacticalOverlay(ctx, sectors, scale) {
    if (!sectors || sectors.size === 0 || scale < 0.7 || scale > 1.18) return;
    ctx.save();
    const maxLabels = scale < 1.05 ? 6 : 10;
    const ranked = Array.from(sectors.values()).sort((a, b) => b.count - a.count).slice(0, maxLabels);
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
