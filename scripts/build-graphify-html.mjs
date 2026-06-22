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
  localizeGraphifyHtml()
  console.log(`[graphify-html] wrote ${path.relative(ROOT, PUBLIC_GRAPH_HTML)}`)
}

function localizeGraphifyHtml() {
  if (!fs.existsSync(PUBLIC_VIS_NETWORK)) {
    console.warn(`[graphify-html] ${path.relative(ROOT, PUBLIC_VIS_NETWORK)} missing; keeping Graphify CDN script tag`)
    return
  }

  const html = fs.readFileSync(PUBLIC_GRAPH_HTML, 'utf-8')
  const local = '<script src="./vis-network.min.js"></script>'
  const updated = html.replace(
    /<script src="https:\/\/unpkg\.com\/vis-network@9\.1\.6\/standalone\/umd\/vis-network\.min\.js"[\s\S]*?<\/script>/,
    local
  ).replace(
    /<title>graphify - [\s\S]*?<\/title>/,
    '<title>Graphify 离线全站知识图谱</title>'
  )
  fs.writeFileSync(PUBLIC_GRAPH_HTML, updated, 'utf-8')
}

main()
