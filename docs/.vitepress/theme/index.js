import DefaultTheme from 'vitepress/theme'
import { h, ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useData, withBase } from 'vitepress'
import { data as modelData } from '../data/models.data.mjs'
import './custom.css'

// =====================================================================
// 「专注阅读」切换:收起左右两侧(侧边栏 + 右侧目录),加宽正文。
// 状态写入 localStorage 并加在 <html>.zen-reading 上(config head 里有预渲染脚本防闪烁)。
// =====================================================================
const PANEL_ICON =
  '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><line x1="5" y1="3" x2="5" y2="13"/><line x1="11" y1="3" x2="11" y2="13"/></svg>'

const ZenToggle = {
  setup() {
    const route = useRoute()
    const on = ref(false)
    onMounted(() => {
      on.value =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('zen-reading')
    })
    const toggle = () => {
      on.value = !on.value
      document.documentElement.classList.toggle('zen-reading', on.value)
      try {
        localStorage.setItem('zen-reading', on.value ? '1' : '0')
      } catch (e) {}
    }
    return () => {
      // 仅在有左右侧栏的文档页(/vla/*)显示,首页/404 不显示
      if (!/\/vla\//.test(route.path)) return null
      return h(
        'button',
        {
          class: ['zen-toggle', { 'is-on': on.value }],
          type: 'button',
          onClick: toggle,
          'aria-pressed': String(on.value),
          title: on.value ? '退出专注模式(恢复左右侧栏)' : '专注阅读:收起左右侧栏',
        },
        [
          h('span', { class: 'zen-toggle__icon', innerHTML: PANEL_ICON }),
          h('span', { class: 'zen-toggle__label' }, on.value ? '退出专注' : '专注'),
        ]
      )
    }
  },
}

// =====================================================================
// 「可信度透镜」全局开关:循环 全部 → 暗化自评/待核 → 仅显已核。
// 配合 markdown 已给含 ⚠️/待核 的 <td> 打的 cred-warn / cred-todo class(见 config.mjs),
// 通过 <html>.lens-dim / .lens-strict 暗化(从不删除,保持诚实)。
// 仅暗化已被标记的数据,绝不制造或抹去信息。
// =====================================================================
const lens = reactive({ mode: '' }) // '' | 'dim' | 'strict'
const LENS_KEY = 'cred-lens'
const LENS_CYCLE = { '': 'dim', dim: 'strict', strict: '' }
const LENS_META = {
  '': { label: '可信度', title: '可信度透镜:全部显示。点击 → 暗化自评/待核数据' },
  dim: { label: '暗化自评', title: '可信度透镜:已暗化 ⚠️ 自评与待核数据。点击 → 仅显已核' },
  strict: { label: '仅显已核', title: '可信度透镜:仅突出已核数据(⚠️/待核 大幅淡出)。点击 → 恢复全部' },
}
const SHIELD_ICON =
  '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.5l5 2v4c0 3-2.2 5.2-5 6-2.8-.8-5-3-5-6v-4l5-2z"/><path d="M5.8 8l1.6 1.6L10.4 6"/></svg>'

const ConfidenceLens = {
  setup() {
    const route = useRoute()
    onMounted(() => {
      try {
        const l = localStorage.getItem(LENS_KEY)
        lens.mode = l === 'dim' || l === 'strict' ? l : ''
      } catch (e) {}
    })
    const cycle = () => {
      lens.mode = LENS_CYCLE[lens.mode]
      const el = document.documentElement
      el.classList.remove('lens-dim', 'lens-strict')
      if (lens.mode) el.classList.add('lens-' + lens.mode)
      try {
        localStorage.setItem(LENS_KEY, lens.mode)
      } catch (e) {}
    }
    return () => {
      if (!/\/vla\//.test(route.path)) return null
      const meta = LENS_META[lens.mode]
      return h(
        'button',
        {
          class: ['lens-toggle', { 'is-on': lens.mode !== '' }],
          type: 'button',
          onClick: cycle,
          'aria-label': meta.title,
          title: meta.title,
        },
        [
          h('span', { class: 'lens-toggle__icon', innerHTML: SHIELD_ICON }),
          h('span', { class: 'lens-toggle__label' }, meta.label),
        ]
      )
    }
  },
}

// 透镜横幅:透镜开启时,统计「当前页」实际含 ⚠️/待核 的单元格数并提示(数字来自 DOM,不硬编码)。
const LensBanner = {
  setup() {
    const route = useRoute()
    const count = ref(0)
    const recount = () => {
      if (typeof document === 'undefined') return
      requestAnimationFrame(() => {
        count.value = document.querySelectorAll('.vp-doc .cred-warn, .vp-doc .cred-todo').length
      })
    }
    onMounted(recount)
    watch(() => route.path, () => nextTick(recount))
    watch(() => lens.mode, () => nextTick(recount))
    return () => {
      if (lens.mode === '' || count.value === 0) return null
      const verb = lens.mode === 'strict' ? '已大幅淡出' : '已暗化'
      return h('div', { class: 'lens-banner', role: 'status' }, [
        h('span', { class: 'lens-banner__dot' }),
        h('span', null, `可信度透镜:本页 ${count.value} 处「自评 ⚠️ / 待核」数据${verb}(其余为细读出处)。`),
      ])
    }
  },
}

// =====================================================================
// 「相关细读」自动页脚:在模型细读页底部,按 机构 / 主干家族 / 动作路线 给出兄弟模型,
// 每条带可解释 chip(同机构·X / 同主干·Y / 同·Z 路线)。数据来自 models-spec.md 解析器,
// 确定性 + 可解释,绝非黑箱推荐;非模型页自动隐藏。
// =====================================================================
const RelatedReads = {
  setup() {
    const route = useRoute()
    return () => {
      const m = route.path.match(/\/vla\/papers\/([\w-]+)/)
      if (!m) return null
      const slug = m[1]
      const rel = (modelData.related && modelData.related[slug]) || []
      if (!rel.length) return null
      return h('nav', { class: 'related-reads', 'aria-label': '相关细读' }, [
        h('div', { class: 'related-reads__title' }, '相关细读'),
        h(
          'ul',
          { class: 'related-reads__list' },
          rel.map((sib) =>
            h('li', { class: 'related-reads__item' }, [
              h('a', { class: 'related-reads__link', href: withBase(`/vla/papers/${sib.slug}`) }, sib.name),
              h(
                'span',
                { class: 'related-reads__chips' },
                sib.reasons.map((r) =>
                  h('span', { class: ['rr-chip', `rr-chip--${r.kind}`] }, r.label)
                )
              ),
            ])
          )
        ),
      ])
    }
  },
}

// =====================================================================
// 阅读进度跟踪:localStorage 记录已读页;滚动到底自动标记,亦可手动切换。
// 作为共享状态层(未来学习路径 / 闪卡复用)。只记录访问,不主张任何内容。
// =====================================================================
const READ_KEY = 'read-pages'
const progress = reactive({ set: new Set(), ready: false })
function loadProgress() {
  if (progress.ready) return
  try {
    progress.set = new Set(JSON.parse(localStorage.getItem(READ_KEY) || '[]'))
  } catch (e) {}
  progress.ready = true
}
function saveProgress() {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...progress.set]))
  } catch (e) {}
}
function setRead(path, on) {
  const next = new Set(progress.set)
  if (on) next.add(path)
  else next.delete(path)
  progress.set = next
  saveProgress()
}
// 从 sidebar 配置统计「全站可读页」总数(分母),去重
function countCorpus(sidebar) {
  const links = new Set()
  const walk = (items) => {
    if (!Array.isArray(items)) return
    for (const it of items) {
      if (it.link) links.add(it.link.replace(/\/$/, ''))
      if (it.items) walk(it.items)
    }
  }
  if (Array.isArray(sidebar)) walk(sidebar)
  else if (sidebar && typeof sidebar === 'object') for (const k of Object.keys(sidebar)) walk(sidebar[k])
  return links.size
}

const ProgressControl = {
  setup() {
    const route = useRoute()
    const { theme } = useData()
    let onScroll = null
    onMounted(() => {
      loadProgress()
      onScroll = () => {
        const doc = document.documentElement
        if (window.innerHeight + window.scrollY >= doc.scrollHeight - 240) {
          if (!progress.set.has(route.path)) setRead(route.path, true)
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true })
    })
    onUnmounted(() => {
      if (onScroll) window.removeEventListener('scroll', onScroll)
    })
    const isRead = computed(() => progress.ready && progress.set.has(route.path))
    const total = computed(() => countCorpus(theme.value.sidebar))
    const done = computed(() => {
      let n = 0
      for (const p of progress.set) if (/\/vla\//.test(p)) n++
      return n
    })
    return () => {
      if (!/\/vla\//.test(route.path)) return null
      const pct = total.value ? Math.min(100, Math.round((done.value / total.value) * 100)) : 0
      return h('div', { class: 'read-progress' }, [
        h(
          'button',
          {
            class: ['read-progress__btn', { 'is-read': isRead.value }],
            type: 'button',
            onClick: () => setRead(route.path, !isRead.value),
            'aria-pressed': String(isRead.value),
          },
          isRead.value ? '✓ 已读(点击取消)' : '标记为已读'
        ),
        h('div', { class: 'read-progress__meter', title: `本站已读 ${done.value} / ${total.value} 篇` }, [
          h('div', { class: 'read-progress__bar', style: { width: pct + '%' } }),
        ]),
        h('span', { class: 'read-progress__count' }, `已读 ${done.value}/${total.value}`),
      ])
    }
  },
}

// =====================================================================
// 「本系列」页脚导航:在所有 /vla/papers/* 细读与专题页底部提供跨页快捷入口。
// =====================================================================
const SERIES_LINKS = [
  ['/vla/', '← 总报告'],
  ['/vla/papers/embodied-data', '具身数据'],
  ['/vla/papers/data-processing', '数据处理'],
  ['/vla/papers/benchmarks', '数据集与基准'],
  ['/vla/papers/robots', '机器人本体'],
  ['/vla/papers/glossary', '术语表'],
  ['/vla/papers/timeline', '时间线'],
  ['/vla/papers/references', '参考文献'],
]

const SeriesFooter = {
  setup() {
    const route = useRoute()
    return () => {
      if (!/\/vla\/papers\//.test(route.path)) return null
      return h('nav', { class: 'series-footer', 'aria-label': '本系列导航' }, [
        h('span', { class: 'series-footer__label' }, '本系列'),
        ...SERIES_LINKS.map(([to, text]) =>
          h('a', { class: 'series-footer__link', href: withBase(to) }, text)
        ),
      ])
    }
  },
}

// Hero 规模读出条(home-hero-actions-after):本站规模一览。
// 数字与 feature 卡口径完全一致(62 篇=VLA39+WAM23 · 50+ 基准 · 57 公司 · 2 主线),不引入任何新主张。
const HERO_STATS = [
  { n: '62', unit: '篇', label: '论文细读' },
  { n: '50+', unit: '', label: '评测基准' },
  { n: '57', unit: '家', label: '生态公司' },
  { n: '2', unit: '条', label: '研究主线' },
]
const HeroStats = {
  setup() {
    // 数字「读出」:进入首屏即从 0 计数到目标值(tabular mono → HUD 遥测感)。
    // 直接动 text 节点,保留 .hero-stat__n 的渐变裁切;reduced-motion 直接显示终值。
    onMounted(() => {
      if (typeof window === 'undefined') return
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      document.querySelectorAll('.VPHome .hero-stat__n').forEach((el) => {
        const tn = el.firstChild
        if (!tn || tn.nodeType !== 3) return
        const raw = (tn.nodeValue || '').trim()
        const m = raw.match(/(\d+)/)
        if (!m) return
        const target = parseInt(m[1], 10)
        if (!target) return
        const prefix = raw.slice(0, m.index)
        const suffix = raw.slice(m.index + m[1].length)
        tn.nodeValue = prefix + '0' + suffix
        setTimeout(() => {
          let start = null
          const tick = (ts) => {
            if (start === null) start = ts
            const p = Math.min(1, (ts - start) / 850)
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target)
            tn.nodeValue = prefix + v + suffix
            if (p < 1) requestAnimationFrame(tick)
            else tn.nodeValue = raw
          }
          requestAnimationFrame(tick)
        }, 360)
      })
    })
    return () =>
      h(
        'dl',
        { class: 'hero-stats', 'aria-label': '本站规模一览' },
        HERO_STATS.map((s, i) =>
          h('div', { class: 'hero-stat', style: { '--i': i } }, [
            h('dt', { class: 'hero-stat__n' }, [
              s.n,
              s.unit ? h('span', { class: 'hero-stat__unit' }, s.unit) : null,
            ]),
            h('dd', { class: 'hero-stat__label' }, s.label),
          ])
        )
      )
  },
}

// Hero 机器人:科技线稿概念图(public/hero-robot.svg);辉光 + 轻浮动见 custom.css
const HeroRobot = {
  setup() {
    return () =>
      h('div', { class: 'hero-robot-wrap' }, [
        h('img', {
          class: 'hero-robot-img',
          src: withBase('/hero-robot.svg'),
          alt: '具身智能机器人概念图',
        }),
      ])
  },
}

// =====================================================================
// Hero 科技感增强层(HeroFX):深空氛围(第二层星云 + 漂浮星场)+ HUD 接口
// (载入启动扫描 + 四角取景框)。注入于 home-hero-before(.VPHome 内、内容 z-index:1 之下,
// 与既有 grid/aurora 同为 z-index:0 背景层)。星点坐标确定性硬编码 → SSR 安全;
// 动效见 custom.css,reduced-motion 全关,深空 FX(星场/扫描)以暗色为主。
// =====================================================================
const FX_STARS = Array.from({ length: 64 }, (_, i) => ({
  x: (i * 73 + 13) % 100,
  y: (i * 41 + 7) % 100,
  s: i % 3 === 0 ? 2.4 : i % 3 === 1 ? 1.4 : 1.9,
  tw: 3 + (i % 5),
  dl: ((i % 7) * 0.4).toFixed(1),
}))
// 数据流光束:细竖线坠落(Tron 风);x 位置 + 时长 + 延迟,确定性。
const FX_BEAMS = [
  { x: 14, d: 5.5, dl: 0 }, { x: 30, d: 7, dl: 1.3 }, { x: 46, d: 6, dl: 2.6 },
  { x: 62, d: 8, dl: 0.7 }, { x: 78, d: 6.5, dl: 3.1 }, { x: 91, d: 7.5, dl: 1.9 },
]
// 电路数据包:沿背景网格的横线(44px 行距,与 .VPHome::before 同原点)滑行的信号光点;
// 行号 / 时长 / 延迟全部确定性(SSR 安全),大部分时间留白、低频掠过。
const FX_PACKETS = [
  { row: 3, d: 9, dl: 1.2, rev: 0 },
  { row: 6, d: 12, dl: 5.4, rev: 1 },
  { row: 9, d: 10, dl: 8.8, rev: 0 },
  { row: 12, d: 13, dl: 3.1, rev: 1 },
]
const HeroFX = {
  setup() {
    return () =>
      h('div', { class: 'hero-fx', 'aria-hidden': 'true' }, [
        h('div', { class: 'hero-fx__glow' }),
        h(
          'div',
          { class: 'hero-fx__stars' },
          FX_STARS.map((st) =>
            h('i', {
              class: 'hero-fx__star',
              style: {
                left: st.x + '%',
                top: st.y + '%',
                '--s': st.s + 'px',
                '--tw': st.tw + 's',
                '--dl': st.dl + 's',
              },
            })
          )
        ),
        h(
          'div',
          { class: 'hero-fx__beams' },
          FX_BEAMS.map((b) =>
            h('i', {
              class: 'hero-fx__beam',
              style: { left: b.x + '%', '--bd': b.d + 's', '--bdl': b.dl + 's' },
            })
          )
        ),
        h(
          'div',
          { class: 'hero-fx__packets' },
          FX_PACKETS.map((p) =>
            h('i', {
              class: ['hero-fx__packet', p.rev ? 'is-rev' : ''],
              style: { top: `calc(${p.row} * 44px - 1px)`, '--pd': p.d + 's', '--pdl': p.dl + 's' },
            })
          )
        ),
        h('div', { class: 'hud-scan' }),
        h('span', { class: 'hud-corner hud-corner--tl' }),
        h('span', { class: 'hud-corner hud-corner--tr' }),
        h('span', { class: 'hud-corner hud-corner--bl' }),
        h('span', { class: 'hud-corner hud-corner--br' }),
      ])
  },
}

// =====================================================================
// 自定义科技 Hero(TechHero):跳出默认居中布局 → 不对称「终端 / HUD」版。
// 顶部状态读出条(闪烁光标)+ 大号渐变中文标题 + 等宽英文副标 + 「>」终端提示
// + 等宽按钮 + 实时读出条(数字 0→目标计数)+ 右侧机器人。内容取自 frontmatter.hero
// (单一来源,不重复维护);默认 .VPHero 由 custom.css 隐藏。reduced-motion 安全。
// =====================================================================
// 英文标题拆成「逐字」span(科幻入场:每个字母错峰点亮)。按词分组 + nowrap → 只在词间换行,词内不裂;
// span 全部 aria-hidden,父级用 aria-label 保留可读文本(屏幕阅读器读整句、不逐字念)。
function splitTitleChars(text) {
  const out = []
  let ci = 0
  text.split(' ').forEach((word, wi) => {
    if (wi > 0) out.push(' ') // 词间正常空格(可换行)
    out.push(
      h(
        'span',
        { class: 'thero__word' },
        word.split('').map((ch) =>
          h('span', { class: 'thero__char', 'aria-hidden': 'true', style: { '--ci': ci++ } }, ch)
        )
      )
    )
  })
  return out
}

// 打字机(开机序列用):清空后逐字回填,一次性;SSR / 无 JS / reduced-motion 下保持完整静态文本。
// keepHeight:打字前把父元素高度锁住,避免换行导致下方按钮跳动。
function typewrite(el, { delay = 0, cps = 55, keepHeight = false } = {}) {
  if (!el) return
  const full = el.textContent || ''
  if (!full) return
  if (keepHeight && el.parentElement) {
    el.parentElement.style.minHeight = el.parentElement.offsetHeight + 'px'
  }
  el.textContent = ''
  el.classList.add('is-typing')
  let i = 0
  setTimeout(() => {
    const t = setInterval(() => {
      i++
      el.textContent = full.slice(0, i)
      if (i >= full.length) {
        clearInterval(t)
        el.classList.remove('is-typing')
      }
    }, Math.max(8, 1000 / cps))
  }, delay)
}

const TechHero = {
  setup() {
    const { frontmatter } = useData()
    // 真实走秒时钟(诚实遥测:真时钟、非装饰假数)。reduced-motion 下保留——它是内容更新,不是动效。
    const clock = ref('UTC+8 --:--:--')
    let clockTimer = null
    onMounted(() => {
      if (typeof window === 'undefined') return
      const tick = () => {
        try {
          clock.value = 'UTC+8 ' + new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false })
        } catch (e) {
          clock.value = 'UTC+8 ' + new Date().toLocaleTimeString('en-GB', { hour12: false })
        }
      }
      tick()
      clockTimer = setInterval(tick, 1000)
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      bindHeroUnit(reduce)
      if (reduce) return
      // 开机序列:状态条 → 终端提示语,逐字打出(一次性;机器人物化见 custom.css robotMaterialize)
      typewrite(document.querySelector('.thero__bar-text'), { delay: 120, cps: 70 })
      typewrite(document.querySelector('.thero__lede-text'), { delay: 700, cps: 45, keepHeight: true })
      document.querySelectorAll('.thero__stat-n').forEach((el) => {
        const tn = el.firstChild
        if (!tn || tn.nodeType !== 3) return
        const raw = (tn.nodeValue || '').trim()
        const m = raw.match(/(\d+)/)
        if (!m) return
        const target = parseInt(m[1], 10)
        if (!target) return
        const prefix = raw.slice(0, m.index)
        const suffix = raw.slice(m.index + m[1].length)
        tn.nodeValue = prefix + '0' + suffix
        setTimeout(() => {
          let start = null
          const tick = (ts) => {
            if (start === null) start = ts
            const p = Math.min(1, (ts - start) / 900)
            const v = Math.round((1 - Math.pow(1 - p, 3)) * target)
            tn.nodeValue = prefix + v + suffix
            if (p < 1) requestAnimationFrame(tick)
            else tn.nodeValue = raw
          }
          requestAnimationFrame(tick)
        }, 420)
      })
    })
    onUnmounted(() => {
      if (clockTimer) clearInterval(clockTimer)
    })
    return () => {
      const hero = (frontmatter.value && frontmatter.value.hero) || {}
      const actions = Array.isArray(hero.actions) ? hero.actions : []
      return h('section', { class: 'thero' }, [
        h('div', { class: 'thero__bar' }, [
          h('span', { class: 'thero__bar-dot' }),
          h('span', { class: 'thero__bar-text' }, 'SYSTEM ONLINE · EMBODIED-AI ARCHIVE · VLA × WAM · 2022—2026'),
          h('span', { class: 'thero__bar-clock' }, clock.value),
          h('span', { class: 'thero__bar-cursor' }),
        ]),
        h('div', { class: 'thero__grid' }, [
          h('div', { class: 'thero__main' }, [
            h('h1', { class: 'thero__title' }, [
              h('span', { class: 'thero__title-zh' }, hero.name || '具身智能学习站'),
              h(
                'span',
                { class: 'thero__title-en', 'aria-label': hero.text || 'Embodied AI Learning' },
                splitTitleChars(hero.text || 'Embodied AI Learning')
              ),
            ]),
            h('p', { class: 'thero__lede' }, [
              h('span', { class: 'thero__prompt' }, '> '),
              h('span', { class: 'thero__lede-text' }, hero.tagline || ''),
            ]),
            h(
              'div',
              { class: 'thero__cta' },
              actions.map((a) =>
                h(
                  'a',
                  {
                    class: ['thero__btn', a.theme === 'brand' ? 'thero__btn--brand' : ''],
                    href: withBase(a.link || '/'),
                  },
                  a.text || ''
                )
              )
            ),
            h(
              'dl',
              { class: 'thero__readout', 'aria-label': '本站规模一览' },
              HERO_STATS.map((s, i) =>
                h('div', { class: 'thero__stat', style: { '--i': i } }, [
                  h('dt', { class: 'thero__stat-n' }, [
                    s.n,
                    s.unit ? h('span', { class: 'thero__stat-unit' }, s.unit) : null,
                  ]),
                  h('dd', { class: 'thero__stat-label' }, s.label),
                ])
              )
            ),
          ]),
          h('div', { class: 'thero__visual' }, [
            h('div', { class: 'thero__unit' }, [
              h('span', { class: 'tu-corner tu-corner--tl' }),
              h('span', { class: 'tu-corner tu-corner--tr' }),
              h('span', { class: 'tu-corner tu-corner--bl' }),
              h('span', { class: 'tu-corner tu-corner--br' }),
              h('span', { class: 'tu-tag tu-tag--tl' }, 'EMBODIED-UNIT'),
              h('span', { class: 'tu-tag tu-tag--tr' }, 'VLA · WAM'),
              h('div', { class: 'thero__robot-wrap', title: '点我 · 单元会回应' }, [
                h('img', {
                  class: 'thero__robot',
                  src: withBase('/hero-robot.svg'),
                  alt: '具身智能机器人概念图',
                }),
                h('span', { class: 'tu-mat', 'aria-hidden': 'true' }),
              ]),
              h('span', { class: 'tu-scan', 'aria-hidden': 'true' }),
              h('span', { class: 'tu-base' }, [
                h('span', { class: 'tu-base-dot' }),
                h('span', { class: 'tu-base-text' }, '运行中 · ONLINE'),
              ]),
            ]),
          ]),
        ]),
      ])
    }
  },
}

// =====================================================================
// 右缘章节定位轨(HomeRail):HERO / VLA / WAM / ABOUT 四节点,滚动高亮、点击平滑跳转。
// 真导航非装饰:分区从 DOM 实测(h2 / coda),标签取 h2 冒号前缀;仅 ≥1280px 显示。
// 随 home-hero-before 槽只在首页挂载;SSR 首帧渲染 null(分区列表 mounted 后才有)。
// =====================================================================
const HomeRail = {
  setup() {
    const items = ref([])
    const active = ref(0)
    let onScroll = null
    onMounted(() => {
      if (typeof document === 'undefined') return
      const list = []
      const hero = document.querySelector('.VPHome .thero')
      if (hero) list.push({ label: 'HERO', el: hero })
      document.querySelectorAll('.VPHome .vp-doc h2').forEach((h2) => {
        const label = ((h2.textContent || '').split(/[::]/)[0] || 'SEC').trim().toUpperCase().slice(0, 6)
        list.push({ label, el: h2 })
      })
      const coda = document.querySelector('.VPHome .home-coda')
      if (coda) list.push({ label: 'ABOUT', el: coda })
      if (list.length < 2) return
      items.value = list
      onScroll = () => {
        const mid = window.scrollY + window.innerHeight * 0.38
        let idx = 0
        list.forEach((it, i) => {
          if (it.el.getBoundingClientRect().top + window.scrollY <= mid) idx = i
        })
        active.value = idx
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    })
    onUnmounted(() => {
      if (onScroll) window.removeEventListener('scroll', onScroll)
    })
    const go = (it) => {
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      it.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
    return () =>
      !items.value.length
        ? null
        : h(
            'nav',
            { class: 'home-rail', 'aria-label': '页面分区导航' },
            items.value.map((it, i) =>
              h(
                'button',
                {
                  class: ['home-rail__item', { 'is-active': i === active.value }],
                  type: 'button',
                  onClick: () => go(it),
                  'aria-current': i === active.value ? 'true' : undefined,
                },
                [h('i', { class: 'home-rail__dot' }), h('span', { class: 'home-rail__label' }, it.label)]
              )
            )
          )
  },
}

// =====================================================================
// 自定义轻量灯箱:点击/键盘放大流程图(Mermaid SVG)或论文框架图
// =====================================================================
let bound = false

function setupLightbox() {
  if (bound || typeof document === 'undefined') return
  bound = true

  const overlay = document.createElement('div')
  overlay.className = 'zoom-lightbox'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.setAttribute('aria-label', '放大预览,按 Esc 关闭')
  overlay.tabIndex = -1
  const stage = document.createElement('div')
  stage.className = 'zoom-lightbox__stage'
  overlay.appendChild(stage)
  document.body.appendChild(overlay)

  let lastFocused = null

  const close = () => {
    overlay.classList.remove('is-open')
    if (lastFocused && lastFocused.focus) lastFocused.focus()
    lastFocused = null
    setTimeout(() => {
      stage.innerHTML = ''
    }, 180)
  }

  const open = (node) => {
    lastFocused = document.activeElement
    stage.innerHTML = ''
    const clone = node.cloneNode(true)
    const isSvg = clone.tagName.toLowerCase() === 'svg'
    clone.removeAttribute('style')
    clone.removeAttribute('tabindex')
    clone.removeAttribute('role')
    clone.removeAttribute('aria-label')
    if (isSvg) {
      clone.removeAttribute('width')
      clone.removeAttribute('height')
    }
    clone.classList.add('zoom-lightbox__content')
    stage.appendChild(clone)
    overlay.classList.add('is-open')
    // 等可见性生效后再移焦点入对话框(visibility:hidden 元素无法聚焦)
    requestAnimationFrame(() => overlay.focus())
  }

  const resolveTarget = (t) => {
    if (!t || !t.closest) return null
    const svg = t.closest('.vp-doc .mermaid svg')
    if (svg) return svg
    if (t.tagName === 'IMG' && t.closest('.vp-doc p')) return t
    return null
  }

  overlay.addEventListener('click', close)

  document.addEventListener('keydown', (e) => {
    // 对话框打开时:Esc 关闭,Tab 困在对话框内(简易焦点陷阱)
    if (overlay.classList.contains('is-open')) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        overlay.focus()
      }
      return
    }
    // 未打开时:Enter / Space 在可放大元素上触发放大
    if (e.key === 'Enter' || e.key === ' ') {
      const node = resolveTarget(document.activeElement)
      if (node) {
        e.preventDefault()
        open(node)
      }
    }
  })

  document.addEventListener('click', (e) => {
    const node = resolveTarget(e.target)
    if (!node) return
    e.preventDefault()
    e.stopPropagation()
    open(node)
  })

  // 将可放大元素标记为可聚焦 + 语义(兼容 Mermaid 异步渲染)
  const tagZoomable = () => {
    document.querySelectorAll('.vp-doc .mermaid svg, .vp-doc p > img').forEach((el) => {
      if (el.dataset.zoomable) return
      el.dataset.zoomable = '1'
      el.setAttribute('tabindex', '0')
      el.setAttribute('role', 'button')
      const isSvg = el.tagName.toLowerCase() === 'svg'
      const base = isSvg ? '流程图' : el.getAttribute('alt') || '图片'
      el.setAttribute('aria-label', `${base},按 Enter 放大`)
    })
  }
  tagZoomable()
  if ('MutationObserver' in window) {
    let debounce
    new MutationObserver(() => {
      clearTimeout(debounce)
      debounce = setTimeout(tagZoomable, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 惊喜层(delight):仅主页 + 全站控制台签名。克制、双皮肤通用、reduced-motion 安全。
//  ① 控制台签名(面向开发者/研究者,附开源链接 + 彩蛋提示)
//  ② Hero 机器人悬停"抬头"(见 custom.css)
//  ③ Konami(↑↑↓↓←→←→BA)→ 机器人庆祝旋转 + ⊕/✦ 粒子 + 轻提示
// =====================================================================
// 轻提示 toast(delight 通用)
function delightToast(msg) {
  const toast = document.createElement('div')
  toast.className = 'delight-toast'
  toast.textContent = msg
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('is-in'))
  setTimeout(() => { toast.classList.remove('is-in'); setTimeout(() => toast.remove(), 420) }, 2600)
}

// Hero 全息单元交互:悬停问候 + 指针视差倾斜 + 点击核心脉冲与「角色内」台词 + 连点成就。
// 台词均与本站内容强相关(VLA π 策略 / WAM 世界模型 / 动作分块 / 三级可信度),非通用填充。
const ROBOT_DEFAULT = '运行中 · ONLINE'
const ROBOT_HELLO = '你好,研究员 · HELLO'
const ROBOT_LINES = [
  '校准位姿 · CALIBRATING',
  '载入策略 · π-POLICY',
  '想象未来 · WORLD-MODEL',
  '动作分块 · ACTION-CHUNK',
  '自评存疑,待复现 · ⚠',
  '双主线就绪 · VLA × WAM',
]
function bindHeroUnit(reduce) {
  if (typeof document === 'undefined') return
  const unit = document.querySelector('.thero__unit')
  if (!unit || unit.dataset.delight) return
  unit.dataset.delight = '1'
  const wrap = unit.querySelector('.thero__robot-wrap')
  const baseText = unit.querySelector('.tu-base-text')
  if (!wrap) return
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  if (fine && !reduce) {
    unit.addEventListener('pointermove', (e) => {
      const r = unit.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      wrap.style.setProperty('--ry', (px * 14).toFixed(2) + 'deg')
      wrap.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg')
    })
  }
  unit.addEventListener('pointerenter', () => { if (baseText) baseText.textContent = ROBOT_HELLO })
  unit.addEventListener('pointerleave', () => {
    wrap.style.setProperty('--ry', '0deg')
    wrap.style.setProperty('--rx', '0deg')
    if (baseText) baseText.textContent = ROBOT_DEFAULT
  })
  let clicks = 0
  wrap.addEventListener('click', () => {
    clicks++
    if (baseText) baseText.textContent = ROBOT_LINES[(clicks - 1) % ROBOT_LINES.length]
    if (!reduce) {
      const p = document.createElement('span')
      p.className = 'tu-pulse'
      p.setAttribute('aria-hidden', 'true')
      wrap.appendChild(p)
      setTimeout(() => p.remove(), 900)
    }
    if (clicks === 5) delightToast('🛰 单元已校准 · 继续探索 ⊕')
  })
}

// =====================================================================
// 首页功能卡「椭圆旋转环」中央能量核标签注入(纯装饰,aria-hidden)。
// .VPFeatures .items 是 SPA 重建节点 → 注入一次后用 MutationObserver 兜底重注;
// 标签默认 display:none,仅 ≥1080px 环形 media 内显形(见 custom.css)。
// =====================================================================
function setupFeatureHub() {
  if (typeof document === 'undefined') return
  const inject = () => {
    const items = document.querySelector('.VPHome .VPFeatures .items')
    if (!items) return
    // 中央机器人
    if (!items.querySelector('.feat-hub')) {
      const hub = document.createElement('div')
      hub.className = 'feat-hub'
      hub.setAttribute('aria-hidden', 'true')
      const img = document.createElement('img')
      img.className = 'feat-hub__robot'
      img.src = withBase('/hero-robot.svg')
      img.alt = '具身智能机器人'
      hub.appendChild(img)
      items.appendChild(hub)
    }
    // 轨道线:沿卡片同一 3D 公式 (rx·sinθ, -yt·cosθ, -rz·cosθ) 撒点 → 精确勾出卡片轨迹。
    // 60 个静止点(密=更像实线)+ 4 个沿轨道流动的能量脉冲(--a 动画,能量在轨道上跑)。
    if (!items.querySelector('.feat-orbit-dot')) {
      const N = 90
      for (let i = 0; i < N; i++) {
        const d = document.createElement('i')
        d.className = 'feat-orbit-dot'
        d.style.setProperty('--a', (i * (360 / N)).toFixed(2) + 'deg')
        d.setAttribute('aria-hidden', 'true')
        items.appendChild(d)
      }
      const P = 4
      for (let i = 0; i < P; i++) {
        const p = document.createElement('i')
        p.className = 'feat-orbit-pulse'
        p.style.setProperty('--p', i)
        p.setAttribute('aria-hidden', 'true')
        items.appendChild(p)
      }
    }
  }
  inject()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(inject, 150)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 滚动入场(scroll-reveal):首页正文区块进入视口时错峰升起。
// 仅给元素「加 .reveal-up class」→ 无 JS 时元素从不隐藏;reduced-motion 直接跳过 → 全部照常显示。
// 隐藏/动画终态见 custom.css(@media no-preference 内,用独立 translate,不干扰卡片 hover transform)。
// 目标:章节标题 / 引导段 / 路线卡(网格内左→右错峰)/ 关于×继续 合并卡。环形 Feature 卡不动(其 transform 即轨道位姿)。
// =====================================================================
let revealBound = false
function setupReveal() {
  if (revealBound || typeof window === 'undefined') return
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return
  revealBound = true
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
  )
  const add = (el, delay) => {
    if (!el || el.dataset.reveal) return
    el.dataset.reveal = '1'
    if (delay) el.style.setProperty('--rd', delay.toFixed(2) + 's')
    el.classList.add('reveal-up')
    io.observe(el)
  }
  const scan = () => {
    const doc = document.querySelector('.VPHome .vp-doc')
    if (!doc) return
    // 正文被两层匿名 wrapper 包着(.vp-doc > div > div > 区块);以 route-grid 的父级为准定位真正的区块容器,避免写死层级
    const anyGrid = doc.querySelector('.route-grid')
    const container = anyGrid
      ? anyGrid.parentElement
      : doc.querySelector(':scope > div > div') || doc.querySelector(':scope > div') || doc
    container
      .querySelectorAll(':scope > h2, :scope > p, :scope > blockquote, :scope > .home-coda')
      .forEach((el) => add(el, 0.04))
    container.querySelectorAll(':scope > .route-grid').forEach((grid) => {
      Array.from(grid.children).forEach((card, i) => add(card, 0.06 * (i + 1)))
    })
  }
  scan()
  // SPA 切回首页 / markdown 异步水合:兜底重扫(已标 data-reveal 的跳过)
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(scan, 160)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// VLA/WAM 路线卡 强化悬停:注入光斑层 + 随光标 3D 倾斜(--rx/--ry 倾角、--mx/--my 光斑位置)。
// 仅 pointer:fine + 允许动效时绑定倾斜;光斑层始终注入(CSS 控制悬停显隐)。SPA 重建 → MutationObserver 兜底重绑。
// =====================================================================
let cardTiltBound = false
function setupCardTilt() {
  if (cardTiltBound || typeof window === 'undefined') return
  cardTiltBound = true
  const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const bind = () => {
    document.querySelectorAll('.VPHome .route-card').forEach((card) => {
      if (card.dataset.tilt) return
      card.dataset.tilt = '1'
      if (!card.querySelector('.route-card__spot')) {
        const spot = document.createElement('i')
        spot.className = 'route-card__spot'
        spot.setAttribute('aria-hidden', 'true')
        card.insertBefore(spot, card.firstChild)
      }
      if (!fine || reduce) return
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%')
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%')
        card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg')
        card.style.setProperty('--rx', (-(py - 0.5) * 8).toFixed(2) + 'deg')
      })
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg')
        card.style.setProperty('--ry', '0deg')
      })
    })
  }
  bind()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(bind, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

// =====================================================================
// 路线卡「×N 入口计数」chip:从 DOM 数出每张卡的链接数,追加到链接区末尾。
// 数字完全派生自页面已有链接 → 不引入第 5 个手工维护的「篇数」面,永不失同步。
// SPA 重建 → MutationObserver 兜底重注(已注入的卡跳过)。
// =====================================================================
let routeCountBound = false
function setupRouteCounts() {
  if (routeCountBound || typeof document === 'undefined') return
  routeCountBound = true
  const inject = () => {
    document.querySelectorAll('.VPHome .route-links').forEach((box) => {
      if (box.querySelector('.route-count')) return
      const n = box.querySelectorAll('a').length
      if (!n) return
      const s = document.createElement('span')
      s.className = 'route-count'
      s.textContent = '×' + n
      s.title = `本卡 ${n} 个细读入口`
      box.appendChild(s)
    })
  }
  inject()
  if ('MutationObserver' in window) {
    let t
    new MutationObserver(() => {
      clearTimeout(t)
      t = setTimeout(inject, 200)
    }).observe(document.body, { childList: true, subtree: true })
  }
}

let delightBound = false
function celebrateRobot() {
  delightToast('🤖 你发现了彩蛋 — ⊕ keep researching')
  const wrap = document.querySelector('.VPHome .thero__robot-wrap')
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!wrap || reduce) return
  wrap.classList.remove('delight-spin')
  void wrap.offsetWidth
  wrap.classList.add('delight-spin')
  const marks = ['⊕', '✦', '◆', '✕']
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span')
    s.className = 'delight-particle'
    s.textContent = marks[i % marks.length]
    const ang = (Math.PI * 2 * i) / 14
    const dist = 90 + (i % 3) * 26
    s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px')
    s.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px')
    wrap.appendChild(s)
    setTimeout(() => s.remove(), 1300)
  }
}
function setupDelight() {
  if (delightBound || typeof window === 'undefined') return
  delightBound = true
  try {
    console.log(
      '%c⊕ 具身智能学习站 · Embodied AI Learning',
      'color:#2563eb;font-weight:700;font-size:14px'
    )
    console.log(
      '%cVLA × WAM 研究档案 · 多源检索 + 对抗式事实核查\n开源 https://github.com/ZhuYun97/embodied-ai-learning\n彩蛋:在主页试试  ↑ ↑ ↓ ↓ ← → ← → B A',
      'color:#64748b;font-size:12px;line-height:1.7'
    )
  } catch (e) {}
  const seq = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a']
  let pos = 0
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase()
    pos = k === seq[pos] ? pos + 1 : k === seq[0] ? 1 : 0
    if (pos === seq.length) { pos = 0; if (document.querySelector('.VPHome')) celebrateRobot() }
  })
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => [h(HeroFX), h(TechHero), h(HomeRail)],
      'nav-bar-content-after': () => [h(ConfidenceLens), h(ZenToggle)],
      'doc-before': () => [h(LensBanner)],
      'doc-after': () => [h(RelatedReads), h(ProgressControl), h(SeriesFooter)],
    })
  },
  setup() {
    onMounted(setupLightbox)
    onMounted(setupDelight)
    onMounted(setupFeatureHub)
    onMounted(setupReveal)
    onMounted(setupCardTilt)
    onMounted(setupRouteCounts)
  },
}
