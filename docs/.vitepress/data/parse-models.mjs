// 规格大表解析器(地基 / keystone)
// 把唯一手写真源 papers/models-spec.md 的「主对比大表」解析成带可信度标记的结构化数据。
// 设计原则(对应本站事实核查 ethos):
//   - 不静默编造:读不准的单元格写进 report,而非强行抽成干净值。
//   - 单一真源:只解析现有 .md,绝不引入第二份手维护数据(零漂移)。
//   - 每个规格字段都带 confidence ∈ {sourced, self_reported, unverified, mixed}。
// 这是 Spec Explorer / 可信度透镜 / 相关细读页脚 / 血缘图节点元数据 等的共同数据层。

/** 单元格可信度分类:⚠️=自评 / 待核=一手未给 / 两者都有=mixed / 否则=sourced(细读为出处) */
export function classifyConfidence(text) {
  const hasTodo = /待核/.test(text)
  const hasWarn = /⚠️|⚠/.test(text)
  if (hasTodo && hasWarn) return 'mixed'
  if (hasTodo) return 'unverified'
  if (hasWarn) return 'self_reported'
  return 'sourced'
}

/** 动作表示 → 5 路线粗分类(对齐本站 mermaid 自带的「四条路 + 一条另类路」taxonomy) */
export function classifyRoute(text) {
  if (/混合/.test(text)) return '混合/分层'
  if (/视频生成/.test(text)) return '视频生成预训练'
  if (/潜动作/.test(text)) return '混合/分层' // GO-1 ViLLA:离散潜动作 + 扩散专家,归入混合
  if (/离散\s*token/.test(text)) return '离散 token 自回归'
  if (/扩散|DiT|流匹配|DDPM/.test(text)) return '连续(扩散/流匹配)'
  if (/L1/.test(text)) return 'L1 回归'
  if (/回归/.test(text)) return 'L1 回归' // Helix enc-dec 直出连续动作,最近的桶
  return '其他'
}

/** 主干 VLM → 家族 key(用于「同主干」chip);无法识别返回 null(不臆测) */
export function backboneFamily(text) {
  if (/PaliGemma/i.test(text)) return 'PaliGemma'
  if (/Gemma\s*3|Gemma3/i.test(text)) return 'Gemma3'
  if (/Qwen/i.test(text)) return 'Qwen'
  if (/Llama|LLaMA/i.test(text)) return 'Llama'
  if (/InternVL/i.test(text)) return 'InternVL'
  if (/Eagle/i.test(text)) return 'Eagle-2'
  if (/Gemini/i.test(text)) return 'Gemini'
  if (/PaLI|PaLM/i.test(text)) return 'PaLI/PaLM'
  if (/Chameleon/i.test(text)) return 'Chameleon'
  if (/无\s*(大\s*)?LLM|无\s*VLM|非\s*VLA|无独立\s*VLM/.test(text)) return '无独立 LLM'
  return null
}

/** 机构 → 归一化 key(用于「同机构」chip);只在识别到已知机构时返回,否则 null(避免乱配) */
export function orgKey(text) {
  if (/Physical Intelligence/i.test(text)) return 'Physical Intelligence'
  if (/X\s*Square|自变量/i.test(text)) return 'X Square Robot(自变量)'
  if (/DeepMind|Google/i.test(text)) return 'Google / DeepMind'
  if (/阿里|达摩院|Qwen/i.test(text)) return '阿里(达摩院 / Qwen)'
  if (/字节|Seed/i.test(text)) return '字节 Seed'
  if (/NVIDIA/i.test(text)) return 'NVIDIA'
  if (/智元|AgiBot/i.test(text)) return '智元 AgiBot'
  if (/清华/i.test(text)) return '清华系'
  if (/Figure/i.test(text)) return 'Figure AI'
  return null
}

/** 清洗模型名:去 **、前导 ⭐、反斜杠转义 */
function cleanName(raw) {
  return raw
    .replace(/⭐|★/g, '')
    .replace(/\*\*/g, '')
    .replace(/\\(.)/g, '$1')
    .trim()
}

/** 从「细读」列 [rt1.md](rt1.md) 抽 slug → rt1 */
function extractSlug(raw) {
  const m = raw.match(/\(([\w-]+)\.md\)/) || raw.match(/\[([\w-]+)\.md\]/)
  return m ? m[1] : null
}

/** 拆一行 markdown 表格(无内联管道)→ 去首尾空单元格 */
function splitRow(line) {
  const cells = line.split('|').map((c) => c.trim())
  // 去掉首尾因前后 | 产生的空串
  if (cells.length && cells[0] === '') cells.shift()
  if (cells.length && cells[cells.length - 1] === '') cells.pop()
  return cells
}

/** 解析年份 "2022.12" → 数值 2022.12(用于排序 / 同期判断);失败返回 null */
function parseYear(raw) {
  const m = raw.match(/(\d{4})(?:\.(\d{1,2}))?/)
  if (!m) return null
  return m[2] ? parseFloat(`${m[1]}.${m[2].padStart(2, '0')}`) : parseFloat(m[1])
}

/**
 * 解析 models-spec.md 主表。
 * @returns {{models:Array, columns:string[], stats:Object, report:Array}}
 */
export function parseModelsSpec(md) {
  const report = []
  const lines = md.split('\n')
  const headerIdx = lines.findIndex((l) => /^\|\s*模型\s*\|\s*年份\s*\|/.test(l))
  if (headerIdx < 0) {
    report.push({ level: 'error', msg: '主对比大表表头(| 模型 | 年份 | …)未找到 —— 表头改动会断掉所有交互组件,请检查 models-spec.md。' })
    return { models: [], columns: [], stats: {}, report }
  }
  const columns = splitRow(lines[headerIdx])
  const EXPECT = 12
  if (columns.length !== EXPECT) {
    report.push({ level: 'warn', msg: `主表列数为 ${columns.length},期望 ${EXPECT};列序若变动需同步本解析器。` })
  }

  const models = []
  for (let i = headerIdx + 2; i < lines.length; i++) {
    const line = lines[i]
    if (!/^\s*\|/.test(line)) break // 表格结束
    const c = splitRow(line)
    if (c.length < EXPECT) {
      report.push({ level: 'warn', msg: `第 ${i + 1} 行单元格数 ${c.length} < ${EXPECT},已跳过:${line.slice(0, 40)}…` })
      continue
    }
    const [name, year, org, backbone, encoder, params, action, freq, corpus, system, license, deepread] = c
    const slug = extractSlug(deepread)
    if (!slug) report.push({ level: 'warn', msg: `「${cleanName(name)}」未能从细读列解析出 slug:${deepread}` })

    const model = {
      name: cleanName(name),
      slug,
      year: { raw: year, num: parseYear(year) },
      org: { raw: org, key: orgKey(org) },
      backbone: { raw: backbone, family: backboneFamily(backbone), confidence: classifyConfidence(backbone) },
      encoder: { raw: encoder, confidence: classifyConfidence(encoder) },
      params: { raw: params, confidence: classifyConfidence(params) },
      action: { raw: action, route: classifyRoute(action), confidence: classifyConfidence(action) },
      freq: { raw: freq, confidence: classifyConfidence(freq) },
      corpus: { raw: corpus, confidence: classifyConfidence(corpus) },
      system: { raw: system },
      license: { raw: license, confidence: classifyConfidence(license) },
    }
    if (model.action.route === '其他') {
      report.push({ level: 'info', msg: `「${model.name}」动作表示未命中已知路线,归入「其他」:${action.slice(0, 30)}…` })
    }
    models.push(model)
  }

  if (!models.length) report.push({ level: 'error', msg: '主表未解析到任何数据行。' })

  // 可信度统计(规格 6 字段:主干/参数/动作/频率/语料/许可)
  const FIELDS = ['backbone', 'params', 'action', 'freq', 'corpus', 'license']
  const stats = { models: models.length, total: models.length * FIELDS.length, sourced: 0, self_reported: 0, unverified: 0, mixed: 0, byField: {} }
  for (const f of FIELDS) stats.byField[f] = { sourced: 0, self_reported: 0, unverified: 0, mixed: 0 }
  for (const m of models) {
    for (const f of FIELDS) {
      const conf = m[f].confidence
      stats[conf]++
      stats.byField[f][conf]++
    }
  }
  stats.flagged = stats.self_reported + stats.unverified + stats.mixed // 非「细读为出处」的格子数

  return { models, columns, stats, report }
}

/**
 * 为每个模型计算「相关细读」兄弟(确定性、可解释:只按共享属性,无 ML / 无黑箱)。
 * 评分:同机构 +3 / 同主干家族 +2 / 同路线 +1 / 同年 +0.5;取分值最高的前 maxN。
 * @returns {Object} slug → [{slug,name,reasons:[{kind,label}]}]
 */
export function computeRelated(models, maxN = 5) {
  const out = {}
  for (const a of models) {
    if (!a.slug) continue
    const scored = []
    for (const b of models) {
      if (b === a || !b.slug) continue
      const reasons = []
      let score = 0
      if (a.org.key && b.org.key && a.org.key === b.org.key) { score += 3; reasons.push({ kind: 'org', label: `同机构·${a.org.key}` }) }
      if (a.backbone.family && b.backbone.family && a.backbone.family === b.backbone.family) { score += 2; reasons.push({ kind: 'backbone', label: `同主干·${a.backbone.family}` }) }
      if (a.action.route !== '其他' && a.action.route === b.action.route) { score += 1; reasons.push({ kind: 'route', label: `同·${a.action.route}` }) }
      if (a.year.num && b.year.num && Math.abs(a.year.num - b.year.num) < 0.001) { score += 0.5; reasons.push({ kind: 'year', label: `同期·${b.year.raw}` }) }
      if (score > 0) scored.push({ slug: b.slug, name: b.name, score, reasons })
    }
    scored.sort((x, y) => y.score - x.score)
    out[a.slug] = scored.slice(0, maxN).map(({ slug, name, reasons }) => ({ slug, name, reasons }))
  }
  return out
}
