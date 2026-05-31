// VitePress 构建期数据加载器(build/dev 都在 Node 运行,结果静态内联进客户端 bundle)。
// 读取已同步的 models-spec.md → 解析 → 暴露 { models, stats, related, report } 给组件。
// 同时把「解析报告」打到构建日志:读不准的单元格在这里显形(诚实机制),维护者据此核对。
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseModelsSpec, computeRelated } from './parse-models.mjs'

const SPEC = fileURLToPath(new URL('../../vla/papers/models-spec.md', import.meta.url))

export default {
  watch: [SPEC],
  load(watchedFiles) {
    const file = (watchedFiles && watchedFiles[0]) || SPEC
    let md = ''
    try {
      md = fs.readFileSync(file, 'utf-8')
    } catch (e) {
      console.warn(`[models.data] 无法读取 ${file}:${e.message}`)
      return { models: [], stats: {}, related: {}, report: [{ level: 'error', msg: `读取失败:${e.message}` }] }
    }
    const { models, stats, report } = parseModelsSpec(md)
    const related = computeRelated(models)

    // 把解析报告打到构建日志(error/warn 醒目;info 折叠为计数)
    const errs = report.filter((r) => r.level === 'error')
    const warns = report.filter((r) => r.level === 'warn')
    const infos = report.filter((r) => r.level === 'info')
    if (report.length) {
      console.log(`\n[models.data] 规格解析:${models.length} 模型 | 旗标(自评/待核)${stats.flagged}/${stats.total} 格 | 报告 ${errs.length} error / ${warns.length} warn / ${infos.length} info`)
      for (const r of [...errs, ...warns]) console.log(`  · [${r.level}] ${r.msg}`)
      if (infos.length) console.log(`  · [info] ${infos.length} 条(动作路线归类提示,详见解析器)`)
    }
    return { models, stats, related, report }
  },
}
