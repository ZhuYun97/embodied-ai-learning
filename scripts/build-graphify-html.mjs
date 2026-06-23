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
      <span class="atlas-kicker">LOCAL KG / GRAPHIFY VIEW</span>
      <strong>Embodied-AI Knowledge Graph</strong>
      <em>offline graphify render · internal notes only</em>
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
    <div><b>LINKS</b><span data-atlas-trace>semantic links</span></div>
    <div><b>SCOPE</b><span data-atlas-runtime>offline canvas</span></div>
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
    --atlas-bg: #040806;
    --atlas-panel: rgba(4, 8, 6, 0.94);
    --atlas-line: rgba(34, 197, 94, 0.18);
    --atlas-text: rgba(220, 255, 220, 0.9);
    --atlas-muted: rgba(220, 255, 220, 0.42);
    --atlas-green: #22c55e;
    --atlas-green2: #4ade80;
    --atlas-amber: #f59e0b;
    --atlas-amber2: #fbbf24;
  }
  body {
    height: 100vh;
    overflow: hidden;
    display: flex;
    background:
      radial-gradient(circle at 48% 46%, rgba(34, 197, 94, 0.08), transparent 34%),
      radial-gradient(circle at 66% 55%, rgba(245, 158, 11, 0.045), transparent 28%),
      linear-gradient(90deg, rgba(34, 197, 94, 0.055), transparent 18%, transparent 82%, rgba(245, 158, 11, 0.035)),
      linear-gradient(180deg, rgba(34, 197, 94, 0.035), transparent 38%),
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
      linear-gradient(rgba(34, 197, 94, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 197, 94, 0.04) 1px, transparent 1px);
    background-size: 48px 48px;
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
      linear-gradient(90deg, rgba(34, 197, 94, 0.035), transparent 24%, transparent 76%, rgba(245, 158, 11, 0.03));
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
      radial-gradient(circle at 50% 48%, rgba(34, 197, 94, 0.06), transparent 34%),
      linear-gradient(180deg, rgba(34, 197, 94, 0.035), transparent 24%),
      #040806;
  }
  #graph-stage::before {
    content: "";
    position: absolute;
    inset: 16px;
    z-index: 5;
    pointer-events: none;
    border: 1px solid rgba(34, 197, 94, 0.18);
    clip-path: polygon(0 0, 160px 0, 160px 1px, 1px 1px, 1px 120px, 0 120px, 0 0, 100% 0, 100% 120px, calc(100% - 1px) 120px, calc(100% - 1px) 1px, calc(100% - 160px) 1px, calc(100% - 160px) 0, 100% 0, 100% 100%, calc(100% - 160px) 100%, calc(100% - 160px) calc(100% - 1px), calc(100% - 1px) calc(100% - 1px), calc(100% - 1px) calc(100% - 120px), 100% calc(100% - 120px), 100% 100%, 0 100%, 0 calc(100% - 120px), 1px calc(100% - 120px), 1px calc(100% - 1px), 160px calc(100% - 1px), 160px 100%, 0 100%);
    box-shadow: 0 0 34px rgba(34, 197, 94, 0.08), inset 0 0 52px rgba(34, 197, 94, 0.025);
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
    background: linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.08), transparent);
    mix-blend-mode: screen;
  }
  #atlas-grid {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      linear-gradient(rgba(34, 197, 94, 0.055) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 197, 94, 0.055) 1px, transparent 1px);
    background-size: 48px 48px, 48px 48px;
    opacity: 0.58;
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
      linear-gradient(90deg, transparent 0 49.8%, rgba(34, 197, 94, 0.105) 50%, transparent 50.2% 100%),
      linear-gradient(180deg, transparent 0 49.8%, rgba(34, 197, 94, 0.085) 50%, transparent 50.2% 100%);
    opacity: 0.34;
  }
  #atlas-grid::after {
    background:
      linear-gradient(135deg, transparent 0 48%, rgba(245, 158, 11, 0.032) 49%, transparent 50% 100%);
    mix-blend-mode: screen;
    opacity: 0.32;
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
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-left: 3px solid var(--atlas-green);
    border-radius: 2px;
    background:
      linear-gradient(90deg, rgba(34, 197, 94, 0.09), rgba(4, 8, 6, 0.88) 36%, rgba(4, 8, 6, 0.76)),
      rgba(4, 8, 6, 0.86);
    box-shadow: 0 18px 70px rgba(0, 0, 0, 0.44), 0 0 34px rgba(34, 197, 94, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  #atlas-hud strong {
    font-size: 15px;
    line-height: 1.1;
    color: rgba(220, 255, 220, 0.92);
    text-shadow: 0 0 16px rgba(34, 197, 94, 0.28);
    text-transform: uppercase;
  }
  #atlas-hud em {
    color: var(--atlas-muted);
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
    border: 1px solid rgba(34, 197, 94, 0.26);
    border-radius: 2px;
    background:
      linear-gradient(180deg, rgba(34, 197, 94, 0.065), transparent),
      rgba(4, 8, 6, 0.76);
    color: rgba(220, 255, 220, 0.88);
    font-size: 11px;
    font-weight: 760;
    text-transform: uppercase;
    box-shadow: 0 0 22px rgba(34, 197, 94, 0.055), inset 0 1px 0 rgba(255, 255, 255, 0.055);
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
    border: 1px solid rgba(34, 197, 94, 0.22);
    border-right: 3px solid rgba(74, 222, 128, 0.56);
    background: rgba(4, 8, 6, 0.68);
    box-shadow: 0 0 22px rgba(34, 197, 94, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.045);
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
    color: rgba(220, 255, 220, 0.86);
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
    border-left: 1px solid rgba(34, 197, 94, 0.22);
    box-shadow: -28px 0 72px rgba(0, 0, 0, 0.48), -1px 0 34px rgba(34, 197, 94, 0.05);
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
    background: rgba(4, 8, 6, 0.86);
  }
  .search-item {
    padding: 7px 8px;
    cursor: pointer;
    border-radius: 6px;
    color: rgba(220, 255, 220, 0.82);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search-item:hover {
    background: rgba(34, 197, 94, 0.08);
  }
  #info-panel {
    padding: 16px;
    border-bottom: 1px solid var(--atlas-line);
    min-height: 150px;
    background: rgba(255, 255, 255, 0.025);
  }
  #info-panel h3,
  #legend-wrap h3 {
    color: var(--atlas-green2);
    font-size: 11px;
    font-weight: 850;
    margin-bottom: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  #info-content {
    color: rgba(220, 255, 220, 0.72);
    font-size: 13px;
    line-height: 1.58;
  }
  #info-content .field {
    margin-bottom: 6px;
  }
  #info-content .field b {
    color: rgba(220, 255, 220, 0.92);
  }
  #info-content .empty {
    color: rgba(220, 255, 220, 0.28);
    font-style: italic;
  }
  .neighbor-link {
    display: grid;
    gap: 2px;
    min-width: 0;
    padding: 5px 8px;
    margin: 3px 0;
    border-radius: 5px;
    cursor: pointer;
    color: rgba(220, 255, 220, 0.72);
    font-size: 12px;
    overflow: hidden;
    border-left: 3px solid rgba(34, 197, 94, 0.32);
    background: rgba(34, 197, 94, 0.035);
  }
  .neighbor-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .neighbor-relation {
    overflow: hidden;
    color: rgba(220, 255, 220, 0.34);
    font-size: 10px;
    font-weight: 700;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .neighbor-note {
    color: rgba(220, 255, 220, 0.34);
    font-size: 10px;
  }
  .neighbor-link:hover {
    background: rgba(34, 197, 94, 0.075);
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
    color: rgba(220, 255, 220, 0.72);
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
    color: rgba(220, 255, 220, 0.82);
    font-size: 12px;
  }
  .legend-item:hover {
    background: rgba(34, 197, 94, 0.055);
  }
  .legend-item.dimmed {
    opacity: 0.33;
  }
  .legend-dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: none;
  }
  .legend-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .legend-count {
    color: rgba(220, 255, 220, 0.36);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }
  .legend-cb,
  #select-all-cb {
    appearance: none;
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1.5px solid rgba(34, 197, 94, 0.32);
    border-radius: 4px;
    background: rgba(4, 8, 6, 0.92);
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
  }
  .legend-cb:checked,
  #select-all-cb:checked {
    background: var(--atlas-green);
    border-color: transparent;
    box-shadow: none;
  }
  .legend-cb:checked::after,
  #select-all-cb:checked::after {
    content: "";
    position: absolute;
    left: 4px;
    top: 1.5px;
    width: 4px;
    height: 8px;
    border: solid #040806;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  #select-all-cb:indeterminate {
    background: var(--atlas-amber);
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

  const graphifyPalette = {
    bg: '#040806',
    green: '#22c55e',
    green2: '#4ade80',
    amber: '#f59e0b',
    amber2: '#fbbf24',
    dim: '#203026',
  };
  const overviewNodeLimit = Number.POSITIVE_INFINITY;
  const overviewSkeletonLimit = 140;
  const rawById = new Map(RAW_NODES.map((node) => [node.id, node]));
  const highDegree = Math.max(1, ...RAW_NODES.map((node) => Number(node.degree || 0)));
  const topNode = [...RAW_NODES].sort((a, b) => Number(b.degree || 0) - Number(a.degree || 0))[0];
  const overviewNodeIds = buildOverviewNodeIds();
  const edgeRecords = RAW_EDGES.map((edge, index) => {
    const fromId = edge.from || edge.source;
    const toId = edge.to || edge.target;
    return {
      id: index,
      edge,
      fromId,
      toId,
      from: rawById.get(fromId),
      to: rawById.get(toId),
    };
  });
  const neighborRecordsById = buildNeighborRecords();
  if (topNode) {
    document.querySelector('[data-atlas-hotspot]').textContent = topNode.label + ' · ' + Number(topNode.degree || 0);
  }
  const layout = buildAtlasLayout();
  const labelState = new Map();
  const visibilityState = new Map();
  const edgeVisibilityState = new Map();
  const nodeVisuals = new Map();
  nodesDS.update(RAW_NODES.map((node) => {
    const degree = Number(node.degree || 0);
    const isCommand = degree >= 250 || node.id.startsWith('track:') || node.id.startsWith('route:');
    const isHub = isCommand || degree >= 150 || node.file_type === 'paper';
    const pos = layout.nodes.get(node.id) || { x: 0, y: 0 };
    const baseColor = accentForNode(node, degree, isCommand, isHub);
    const visual = nodeVisualFor(node, baseColor, degree, isCommand, isHub);
    node.color = {
      ...(node.color || {}),
      background: visual.baseColor,
      border: visual.baseColor,
      highlight: { background: visual.highlightFill, border: visual.highlightBorder },
    };
    nodeVisuals.set(node.id, { ...visual, id: node.id, x: pos.x, y: pos.y });
    return {
      id: node.id,
      label: '',
      hidden: true,
      x: pos.x,
      y: pos.y,
      shape: visual.shape,
      size: visual.size,
      borderWidth: visual.borderWidth,
      borderWidthSelected: visual.borderWidth + 1.1,
      color: {
        ...(node.color || {}),
        background: visual.fill,
        border: visual.border,
        highlight: { background: visual.highlightFill, border: visual.highlightBorder },
        hover: { background: visual.hoverFill, border: visual.highlightBorder },
      },
      shadow: false,
      font: {
        ...(node.font || {}),
        color: Number(node.degree || 0) >= 220 || nodeKind(node) === 'paper' ? graphifyPalette.amber2 : graphifyPalette.green2,
        strokeWidth: isHub ? 5 : 4,
        strokeColor: 'rgba(4, 8, 6, 0.92)',
        size: 0,
      },
    };
  }));

  edgesDS.update(edgeRecords.map((record) => {
    const edge = record.edge;
    const color = edgeAccentFor(record.from, record.to);
    const strong = edge.confidence === 'EXTRACTED';
    return {
      id: record.id,
      hidden: true,
      width: strong ? Math.max(0.32, Math.min(0.72, edge.width || 1)) : 0.22,
      color: { color, opacity: strong ? 0.08 : 0.025 },
      hoverWidth: strong ? 1.35 : 0.8,
      arrows: { to: { enabled: false } },
      smooth: false,
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
          values.borderWidth = Math.max(values.borderWidth || 2, 3.4);
          values.shadow = false;
          values.shadowSize = 0;
        },
      },
    },
    edges: {
      smooth: false,
      selectionWidth: 2.4,
      arrows: { to: { enabled: false } },
    },
  });

  setTimeout(() => {
    restyleLegend();
    updateVisibility(0.48);
    network.fit({ animation: { duration: 700, easingFunction: 'easeInOutQuad' } });
    updateLabels();
  }, 80);

  network.on('beforeDrawing', (ctx) => {
    drawGraphifySkeleton(ctx, network.getScale());
  });
  network.on('afterDrawing', (ctx) => {
    drawNodeTechDetails(ctx, network.getScale());
  });
  network.on('zoom', () => scheduleLabelUpdate());
  network.on('zoom', () => scheduleVisibilityUpdate());
  network.on('dragEnd', () => scheduleLabelUpdate());
  network.on('selectNode', () => scheduleLabelUpdate(true));
  network.on('selectNode', (params) => {
    updateVisibility();
    if (params.nodes?.[0]) {
      setTimeout(() => network.focus(params.nodes[0], { scale: Math.max(1.1, network.getScale()), animation: { duration: 220 } }), 0);
    }
  });
  network.on('deselectNode', () => {
    scheduleLabelUpdate(true);
    updateVisibility();
  });

  let labelTimer = 0;
  function scheduleLabelUpdate(immediate = false) {
    clearTimeout(labelTimer);
    if (immediate) {
      updateLabels();
      return;
    }
    labelTimer = setTimeout(updateLabels, 90);
  }

  let visibilityTimer = 0;
  function scheduleVisibilityUpdate() {
    clearTimeout(visibilityTimer);
    visibilityTimer = setTimeout(() => updateVisibility(), 120);
  }

  function updateVisibility(forcedScale) {
    const scale = typeof forcedScale === 'number' ? forcedScale : network.getScale();
    const selectedIds = new Set(network.getSelectedNodes());
    const neighborIds = localVisibleNeighborIdsFor(scale, selectedIds);
    const nodeUpdates = [];
    for (const node of RAW_NODES) {
      const hidden = !visibleAtScale(node, scale, selectedIds, neighborIds);
      if (visibilityState.get(node.id) === hidden) continue;
      visibilityState.set(node.id, hidden);
      nodeUpdates.push({ id: node.id, hidden });
      if (hidden) labelState.delete(node.id);
    }
    if (nodeUpdates.length) nodesDS.update(nodeUpdates);

    const edgeUpdates = [];
    for (const record of edgeRecords) {
      const hidden = !edgeVisibleAtScale(record, scale, selectedIds, neighborIds);
      if (edgeVisibilityState.get(record.id) === hidden) continue;
      edgeVisibilityState.set(record.id, hidden);
      edgeUpdates.push({ id: record.id, hidden });
    }
    if (edgeUpdates.length) edgesDS.update(edgeUpdates);
    if (nodeUpdates.length || edgeUpdates.length) scheduleLabelUpdate(true);
  }

  function visibleAtScale(node, scale, selectedIds, neighborIds) {
    const degree = Number(node.degree || 0);
    if (selectedIds.has(node.id) || neighborIds.has(node.id)) return true;
    if (overviewNodeIds.has(node.id)) return true;
    if (node.id.startsWith('track:') || node.id.startsWith('route:')) return scale >= 0.9 || degree >= 160;
    if (scale < 0.58) return degree >= 72;
    if (scale < 0.9) return degree >= 105;
    if (scale < 1.25) return degree >= 66;
    if (scale < 1.65) return degree >= 38;
    if (scale < 2.2) return true;
    return true;
  }

  function localVisibleNeighborIdsFor(scale, selectedIds) {
    const ids = new Set();
    if (!selectedIds.size) return ids;
    const limit = scale < 1 ? 18 : scale < 1.55 ? 38 : scale < 2.15 ? 76 : 140;
    for (const selectedId of selectedIds) {
      const ranked = network.getConnectedNodes(selectedId)
        .map((neighborId) => rawById.get(neighborId))
        .filter(Boolean)
        .sort((a, b) => nodeVisibilityScore(b) - nodeVisibilityScore(a) || String(a.label).localeCompare(String(b.label), 'zh-Hans-CN'))
        .slice(0, limit);
      for (const node of ranked) ids.add(node.id);
    }
    return ids;
  }

  function edgeVisibleAtScale(record, scale, selectedIds, neighborIds) {
    if (visibilityState.get(record.fromId) === true || visibilityState.get(record.toId) === true) return false;
    if (selectedIds.size) {
      return (selectedIds.has(record.fromId) && neighborIds.has(record.toId))
        || (selectedIds.has(record.toId) && neighborIds.has(record.fromId))
        || (selectedIds.has(record.fromId) && selectedIds.has(record.toId));
    }

    const fromDegree = Number(record.from?.degree || 0);
    const toDegree = Number(record.to?.degree || 0);
    const maxDegree = Math.max(fromDegree, toDegree);
    const minDegree = Math.min(fromDegree, toDegree);
    const type = String(record.edge.type || record.edge.label || record.edge.title || '');
    const bothOverview = overviewNodeIds.has(record.fromId) && overviewNodeIds.has(record.toId);
    const hasCore = record.fromId === topNode?.id || record.toId === topNode?.id;
    const structural = /taxonomy|related|links-to|站内|共现|路线/.test(type);

    if (scale < 0.58) {
      return bothOverview && (hasCore || (maxDegree >= 250 && minDegree >= 145) || (structural && minDegree >= 170));
    }
    if (scale < 0.9) {
      return bothOverview && (hasCore || structural || maxDegree >= 180 || minDegree >= 120);
    }
    if (scale < 1.25) {
      return bothOverview || (maxDegree >= 150 && minDegree >= 60) || (structural && maxDegree >= 95 && minDegree >= 42);
    }
    if (scale < 1.65) {
      return maxDegree >= 70 && minDegree >= 28;
    }
    if (scale < 2.2) {
      return true;
    }
    return true;
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
    const kind = nodeKind(node);
    const isRoute = node.id.startsWith('track:') || node.id.startsWith('route:');
    if (selectedIds.has(node.id)) return 4;
    if (localLabelIds.has(node.id)) return scale < 1.15 ? 2 : scale < 1.8 ? 3 : 4;
    if (node.id === topNode?.id) return scale < 0.62 ? 1 : 2;
    if (scale < 0.38) return degree >= 190 ? 1 : 0;
    if (scale < 0.62) return degree >= 145 || isRoute ? 1 : 0;
    if (scale < 0.86) return degree >= 90 || isRoute ? 2 : 0;
    if (scale < 1.16) return degree >= 82 || (kind === 'paper' && degree >= 72) || isRoute ? 3 : 0;
    if (scale < 1.55) return degree >= 64 || (kind === 'paper' && degree >= 56) || isRoute ? 3 : 0;
    if (scale < 2.15) return degree >= 45 || (kind === 'paper' && degree >= 36) || isRoute ? 3 : 0;
    return degree >= 28 || kind === 'paper' || isRoute ? 4 : 0;
  }

  function updateLabels() {
    const scale = network.getScale();
    const selectedIds = new Set(network.getSelectedNodes());
    const localLabelIds = localLabelIdsFor(scale, selectedIds);
    const updates = [];
    for (const node of RAW_NODES) {
      const isHidden = visibilityState.get(node.id) === true;
      const level = isHidden ? 0 : labelLevelFor(node, scale, selectedIds, localLabelIds);
      const fontSize = level === 0 ? 0 : level === 1 ? 12 : level === 2 ? 13 : level === 3 ? 14 : 15;
      const next = level === 0 ? '' : node.label;
      const labelColor = Number(node.degree || 0) >= 220 || nodeKind(node) === 'paper'
        ? graphifyPalette.amber2
        : graphifyPalette.green2;
      const stateKey = next + '|' + fontSize;
      if (labelState.get(node.id) === stateKey) continue;
      labelState.set(node.id, stateKey);
      updates.push({
        id: node.id,
        label: next,
        font: {
          ...(node.font || {}),
          color: labelColor,
          strokeWidth: level >= 3 ? 6 : 5,
          strokeColor: 'rgba(4, 8, 6, 0.96)',
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
        color: Number(node.degree || 0) >= 220 || nodeKind(node) === 'paper' ? graphifyPalette.amber2 : graphifyPalette.green2,
        strokeWidth: 6,
        strokeColor: 'rgba(4, 8, 6, 0.98)',
        size: 15,
      },
    });
  }

  network.on('hoverNode', (params) => revealNodeLabel(params.node));
  network.on('blurNode', () => scheduleLabelUpdate(true));
  network.on('animationFinished', () => scheduleLabelUpdate(true));
  installSidebarNeighborInfo();

  function nodeKind(node) {
    const rawKind = node.file_type || node.type || node._file_type || 'unknown';
    if (['paper', 'topic', 'index', 'page', 'home', 'ecosystem'].includes(rawKind)) return rawKind;
    const prefix = String(node.id || '').split(':')[0];
    const prefixKind = {
      bench: 'benchmark',
      concept: 'concept',
      data: 'data',
      doc: 'document',
      org: 'org',
      robot: 'robot',
      route: 'route',
      track: 'track',
    }[prefix];
    return prefixKind || rawKind;
  }

  function buildOverviewNodeIds() {
    const ids = new Set();
    if (topNode) ids.add(topNode.id);
    const ranked = [...RAW_NODES]
      .sort((a, b) => nodeVisibilityScore(b) - nodeVisibilityScore(a) || String(a.label).localeCompare(String(b.label), 'zh-Hans-CN'));
    for (const node of ranked) {
      ids.add(node.id);
      if (ids.size >= overviewNodeLimit) break;
    }
    return ids;
  }

  function nodeVisibilityScore(node) {
    const degree = Number(node?.degree || 0);
    const kind = nodeKind(node || {});
    const typeBoost = {
      concept: 130,
      org: 96,
      data: 82,
      benchmark: 78,
      robot: 66,
      route: 58,
      track: 58,
      index: 48,
      topic: 34,
      ecosystem: 30,
      paper: 24,
      document: 22,
      page: 18,
      home: 12,
    }[kind] || 0;
    return degree + typeBoost + (node?.id === topNode?.id ? 1000 : 0);
  }

  function accentForNode(node, degree, isCommand, isHub) {
    const kind = nodeKind(node);
    if (isCommand || degree >= 300 || node.id === topNode?.id) return graphifyPalette.amber;
    if (kind === 'paper' || kind === 'route' || kind === 'track') return graphifyPalette.amber2;
    return isHub || degree >= 40 ? graphifyPalette.green2 : graphifyPalette.green;
  }

  function edgeAccentFor(from, to) {
    const endpoints = [from, to].filter(Boolean);
    if (endpoints.some((node) => Number(node.degree || 0) >= 250 || nodeKind(node) === 'paper')) {
      return graphifyPalette.amber;
    }
    return graphifyPalette.green;
  }

  function communityColorFor(node) {
    if (!node) return graphifyPalette.green;
    const direct = node.color?.background || node.color?.border;
    if (isHexColor(direct)) return direct;
    const cid = Number(node.community);
    const legend = LEGEND.find((item) => Number(item.cid) === cid);
    return isHexColor(legend?.color) ? legend.color : graphifyPalette.green;
  }

  function buildNeighborRecords() {
    const byId = new Map();
    for (const record of edgeRecords) {
      if (!record.fromId || !record.toId || record.fromId === record.toId) continue;
      if (!rawById.has(record.fromId) || !rawById.has(record.toId)) continue;
      addNeighborRecord(byId, record.fromId, record.toId, record);
      addNeighborRecord(byId, record.toId, record.fromId, record);
    }
    for (const [nodeId, neighbors] of byId.entries()) {
      const ranked = Array.from(neighbors.values())
        .map((item) => ({
          ...item,
          labels: Array.from(item.labels),
        }))
        .sort((a, b) => neighborScore(b) - neighborScore(a) || String(rawById.get(a.id)?.label || a.id).localeCompare(String(rawById.get(b.id)?.label || b.id), 'zh-Hans-CN'));
      byId.set(nodeId, ranked);
    }
    return byId;
  }

  function addNeighborRecord(byId, sourceId, targetId, record) {
    if (!byId.has(sourceId)) byId.set(sourceId, new Map());
    const neighbors = byId.get(sourceId);
    if (!neighbors.has(targetId)) {
      neighbors.set(targetId, {
        id: targetId,
        labels: new Set(),
        weight: 0,
        confidenceScore: 0,
        edgeCount: 0,
      });
    }
    const item = neighbors.get(targetId);
    const edge = record.edge || {};
    const label = String(edge.label || edge.type || edge.title || '').replace(/\\s*\\[[^\\]]+]\\s*$/, '').trim();
    if (label) item.labels.add(label);
    item.weight += Number(edge.weight || edge.width || 1);
    item.edgeCount += 1;
    item.confidenceScore += edge.confidence === 'CURATED' ? 8 : edge.confidence === 'EXTRACTED' ? 4 : 1;
  }

  function neighborScore(item) {
    const node = rawById.get(item.id) || {};
    const kind = nodeKind(node);
    const typeBoost = {
      paper: 34,
      concept: 26,
      route: 22,
      track: 22,
      data: 18,
      benchmark: 18,
      org: 16,
      robot: 14,
      topic: 10,
    }[kind] || 0;
    return item.confidenceScore + item.weight + item.edgeCount * 3 + Number(node.degree || 0) * 0.18 + typeBoost;
  }

  function installSidebarNeighborInfo() {
    const atlasShowInfo = function(nodeId) {
      const raw = rawById.get(nodeId);
      const dsNode = nodesDS.get(nodeId);
      const node = raw || dsNode;
      if (!node) return;
      const neighbors = neighborRecordsById.get(nodeId) || [];
      const visibleNeighbors = neighbors.slice(0, 80);
      const neighborItems = visibleNeighbors.map((item) => {
        const rawNeighbor = rawById.get(item.id);
        const dsNeighbor = nodesDS.get(item.id);
        const label = rawNeighbor?.label || dsNeighbor?.label || item.id;
        const color = dsNeighbor?.color?.background || rawNeighbor?.color?.background || '#4ade80';
        const relation = item.labels.slice(0, 2).join(' / ') || 'related';
        return '<span class="neighbor-link" style="border-left-color:' + atlasEsc(color) + '" onclick="focusNode(' + atlasEsc(JSON.stringify(item.id)) + ')" title="' + atlasEsc(label + ' · ' + relation) + '">'
          + '<span class="neighbor-label">' + atlasEsc(label) + '</span>'
          + '<span class="neighbor-relation">' + atlasEsc(relation) + '</span>'
          + '</span>';
      }).join('');
      const neighborBlock = neighbors.length
        ? '<div class="field" style="margin-top:8px;color:#aaa;font-size:11px">Neighbors (' + neighbors.length + ')</div><div id="neighbors-list">' + neighborItems + '</div>'
          + (neighbors.length > visibleNeighbors.length ? '<div class="field neighbor-note">Showing top ' + visibleNeighbors.length + ' by relation strength</div>' : '')
        : '<div class="field neighbor-note" style="margin-top:8px">No recorded neighbors</div>';
      document.getElementById('info-content').innerHTML =
        '<div class="field"><b>' + atlasEsc(node.label || node.id) + '</b></div>'
        + '<div class="field">Type: ' + atlasEsc(node.file_type || node.type || dsNode?._file_type || 'unknown') + '</div>'
        + '<div class="field">Community: ' + atlasEsc(node.community_name || dsNode?._community_name || '-') + '</div>'
        + '<div class="field">Source: ' + atlasEsc(node.source_file || dsNode?._source_file || '-') + '</div>'
        + '<div class="field">Degree: ' + atlasEsc(node.degree ?? dsNode?._degree ?? '-') + '</div>'
        + neighborBlock;
    };
    const atlasFocusNode = function(nodeId) {
      network.focus(nodeId, { scale: 1.4, animation: true });
      network.selectNodes([nodeId]);
      atlasShowInfo(nodeId);
      updateVisibility();
      scheduleLabelUpdate(true);
    };
    window.showInfo = atlasShowInfo;
    window.focusNode = atlasFocusNode;
    try { showInfo = atlasShowInfo; } catch (_) {}
    try { focusNode = atlasFocusNode; } catch (_) {}
  }

  function atlasEsc(value) {
    if (typeof esc === 'function') return esc(value);
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function restyleLegend() {
    document.querySelectorAll('.legend-item').forEach((item, index) => {
      const legend = LEGEND[index];
      const tone = isHexColor(legend?.color) ? legend.color : graphifyPalette.green;
      const dot = item.querySelector('.legend-dot');
      if (dot) {
        dot.style.background = rgbaFromHex(tone, 0.34);
        dot.style.border = '1px solid ' + rgbaFromHex(tone, 0.82);
        dot.style.boxShadow = 'none';
      }
    });
  }

  function nodeVisualFor(node, baseColor, degree, isCommand, isHub) {
    const baseSize = Number(node.size || 10);
    const isMajor = isHub || degree >= 75 || node.id.startsWith('org:') || node.id.startsWith('data:');
    const tier = isCommand ? 'core' : isHub ? 'hub' : isMajor ? 'major' : 'node';
    const shape = 'dot';
    const communityColor = communityColorFor(node);
    const muted = mixHex(baseColor, '#9fb7a5', 0.22);
    const size = tier === 'core'
      ? Math.max(14, Math.min(24, baseSize * 0.62 + 4))
      : tier === 'hub'
        ? Math.max(10, Math.min(18, baseSize * 0.62 + 2.5))
        : tier === 'major'
          ? Math.max(6.6, Math.min(12, baseSize * 0.58))
          : Math.max(3.6, Math.min(7, baseSize * 0.42));
    return {
      tier,
      shape,
      size,
      baseColor: muted,
      communityColor,
      fill: mixHex(muted, graphifyPalette.bg, tier === 'node' ? 0.72 : tier === 'major' ? 0.64 : 0.54),
      border: mixHex(muted, graphifyPalette.bg, tier === 'node' ? 0.24 : tier === 'major' ? 0.14 : 0.04),
      hoverFill: mixHex(muted, graphifyPalette.bg, 0.42),
      highlightFill: mixHex(muted, graphifyPalette.bg, 0.34),
      highlightBorder: muted,
      borderWidth: tier === 'core' ? 1.45 : tier === 'hub' ? 1.15 : tier === 'major' ? 0.9 : 0.55,
      degree,
    };
  }

  function drawGraphifySkeleton(ctx, scale) {
    if (!topNode || scale > 1.08) return;
    const positions = network.getPositions([...overviewNodeIds]);
    const center = positions[topNode.id];
    if (!center) return;
    const ids = [...overviewNodeIds]
      .filter((id) => id !== topNode.id && visibilityState.get(id) !== true && positions[id])
      .sort((a, b) => Number(rawById.get(b)?.degree || 0) - Number(rawById.get(a)?.degree || 0))
      .slice(0, scale < 0.58 ? overviewSkeletonLimit : Math.min(overviewSkeletonLimit + 18, overviewNodeLimit));
    if (!ids.length) return;

    ctx.save();
    ctx.lineCap = 'round';
    ids.forEach((id, index) => {
      const node = rawById.get(id);
      const target = positions[id];
      if (!node || !target) return;
      const degree = Number(node.degree || 0);
      const color = degree >= 220 ? graphifyPalette.amber : graphifyPalette.green;
      ctx.setLineDash([]);
      ctx.lineWidth = (degree >= 250 ? 0.9 : 0.58) / Math.max(scale, 0.2);
      ctx.strokeStyle = rgbaFromHex(color, index < 8 ? 0.16 : 0.09);
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawNodeTechDetails(ctx, scale) {
    const visuals = visibleNodeVisuals(scale).filter((visual) => (
      visual.tier === 'core' || visual.tier === 'hub' || (scale > 1.15 && visual.tier === 'major')
    ));
    if (!visuals.length) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const visual of visuals) {
      drawRoundNode(ctx, visual, scale);
      drawNodeCoreDot(ctx, visual, scale);
    }
    ctx.restore();
  }

  function drawRoundNode(ctx, visual, scale) {
    const ring = visual.size + (visual.tier === 'core' ? 4.5 : visual.tier === 'hub' ? 2.8 : 1.8) / scale;
    ctx.setLineDash([]);
    ctx.lineWidth = (visual.tier === 'core' ? 0.9 : visual.tier === 'hub' ? 0.76 : 0.58) / scale;
    ctx.strokeStyle = rgbaFromHex(visual.communityColor, visual.tier === 'core' ? 0.5 : visual.tier === 'hub' ? 0.42 : 0.32);
    ctx.beginPath();
    ctx.arc(visual.x, visual.y, ring + 1.8 / scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = (visual.tier === 'core' ? 0.78 : visual.tier === 'hub' ? 0.62 : 0.5) / scale;
    ctx.strokeStyle = rgbaFromHex(visual.baseColor, visual.tier === 'core' ? 0.45 : visual.tier === 'hub' ? 0.34 : 0.22);
    ctx.beginPath();
    ctx.arc(visual.x, visual.y, ring, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawNodeCoreDot(ctx, visual, scale) {
    const radius = Math.max(1.2 / scale, visual.size * (visual.tier === 'core' ? 0.22 : 0.18));
    ctx.setLineDash([]);
    ctx.fillStyle = rgbaFromHex(visual.baseColor, visual.tier === 'core' ? 0.88 : visual.tier === 'hub' ? 0.68 : 0.46);
    ctx.beginPath();
    ctx.arc(visual.x, visual.y, radius, 0, Math.PI * 2);
    ctx.fill();
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
      if (visibilityState.get(node.id) === true) continue;
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

  function isHexColor(value) {
    return typeof value === 'string' && /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value.trim());
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
    const topCid = Number.isFinite(Number(topNode?.community)) ? Number(topNode.community) : null;
    const rankedGroups = Array.from(groups.entries()).sort((a, b) => {
      if (topCid !== null && a[0] === topCid) return -1;
      if (topCid !== null && b[0] === topCid) return 1;
      return b[1].length - a[1].length || a[0] - b[0];
    });
    const ringCounts = [1, 10, 15, 14];
    const ringRadii = [0, 430, 760, 1040];
    const ringSeen = [0, 0, 0, 0];
    const nodesOut = new Map();

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
      const spread = Math.max(72, Math.min(170, 18 * Math.sqrt(sortedNodes.length)));
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
    });
    return { nodes: nodesOut };
  }
})();
</script>`
}

main()
