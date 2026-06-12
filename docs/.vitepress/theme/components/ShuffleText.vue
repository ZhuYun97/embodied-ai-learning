<!--
  ShuffleText —— 逐字「滑条洗牌」字效(React Bits Shuffle 的 Vue 3 移植)。
  机制:每个字符包成 overflow:hidden 的等宽槽,槽内是一条字形滑条
  [真字, 滚动副本 ×shuffleTimes, 首副本](direction=right 时的重排),
  滑条从 -steps*w 滑到 0,副本依次掠过、真字落位;evenodd 模式奇数位先行、
  偶数位在 oddTotal*0.7 处接力,组内按 stagger 错峰。
  移植说明:原版依赖 gsap+SplitText+ScrollTrigger;此处用 Web Animations API
  (power3.out ≈ cubic-bezier(0.165,0.84,0.44,1))+ IntersectionObserver 等效实现,
  不引入运行时依赖;动效时序数学与原版一致。SSR 渲染纯文本(SEO/读屏由根节点
  aria-label 兜底,内部字符结构 aria-hidden),is-ready 前 visibility:hidden 防闪。
  respectReducedMotion=true 时直接显示静态文本、不绑悬停。
-->
<template>
  <component
    :is="tag"
    ref="rootEl"
    class="shuffle-parent"
    :class="[{ 'is-ready': ready }, className]"
    :style="{ textAlign }"
    :aria-label="text"
  >
    <span ref="contentEl" class="shuffle-content" aria-hidden="true">{{ text }}</span>
  </component>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  className: { type: String, default: '' },
  shuffleDirection: { type: String, default: 'right' },
  duration: { type: Number, default: 0.35 },
  maxDelay: { type: Number, default: 0 },
  ease: { type: String, default: 'power3.out' },
  threshold: { type: Number, default: 0.1 },
  rootMargin: { type: String, default: '-100px' },
  tag: { type: String, default: 'p' },
  textAlign: { type: String, default: 'center' },
  shuffleTimes: { type: Number, default: 1 },
  animationMode: { type: String, default: 'evenodd' },
  loop: { type: Boolean, default: false },
  loopDelay: { type: Number, default: 0 },
  stagger: { type: Number, default: 0.03 },
  scrambleCharset: { type: String, default: '' },
  colorFrom: { type: String, default: '' },
  colorTo: { type: String, default: '' },
  triggerOnce: { type: Boolean, default: true },
  respectReducedMotion: { type: Boolean, default: true },
  triggerOnHover: { type: Boolean, default: true },
})
const emit = defineEmits(['shuffle-complete'])

// GSAP ease 名 → CSS 缓动近似;也接受原生 cubic-bezier()/关键字字符串
const EASE_MAP = {
  'power1.out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'power2.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power3.out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  'power4.out': 'cubic-bezier(0.23, 1, 0.32, 1)',
}

const rootEl = ref(null)
const contentEl = ref(null)
const ready = ref(false)

let playing = false
let destroyed = false
let wrappers = []
let anims = []
let observer = null
let loopTimer = null
let hoverBound = false

const isVertical = () => props.shuffleDirection === 'up' || props.shuffleDirection === 'down'
const cssEase = () => EASE_MAP[props.ease] || (typeof props.ease === 'string' ? props.ease : 'ease-out')

function cancelAnims() {
  anims.forEach((a) => {
    try {
      a.cancel()
    } catch (e) {}
  })
  anims = []
}

function build() {
  cancelAnims()
  wrappers = []
  const content = contentEl.value
  if (!content) return
  // ① 按词分组渲染 char span(词内 nowrap → 只在词间换行),先全量测量(读写分批)
  content.textContent = ''
  const charEls = []
  props.text.split(' ').forEach((word, wi) => {
    if (wi > 0) content.appendChild(document.createTextNode(' '))
    if (!word) return
    const w = document.createElement('span')
    w.className = 'shuffle-word'
    word.split('').forEach((ch) => {
      const c = document.createElement('span')
      c.className = 'shuffle-char'
      c.textContent = ch
      w.appendChild(c)
      charEls.push(c)
    })
    content.appendChild(w)
  })
  const sizes = charEls.map((c) => {
    const r = c.getBoundingClientRect()
    return { w: r.width, h: r.height }
  })
  // ② 把每个字符包进等宽槽 + 滑条
  const rolls = Math.max(1, Math.floor(props.shuffleTimes))
  const rand = (set) => set.charAt(Math.floor(Math.random() * set.length)) || ''
  const vertical = isVertical()
  charEls.forEach((ch, i) => {
    const { w, h } = sizes[i]
    if (!w) return
    const parent = ch.parentElement
    const wrap = document.createElement('span')
    wrap.className = 'shuffle-char-wrapper'
    wrap.style.width = w + 'px'
    if (vertical) wrap.style.height = h + 'px'
    const strip = document.createElement('span')
    strip.className = 'shuffle-strip'
    if (vertical) strip.style.whiteSpace = 'normal'
    parent.insertBefore(wrap, ch)
    wrap.appendChild(strip)
    const mk = (node) => {
      node.style.display = vertical ? 'block' : 'inline-block'
      node.style.width = w + 'px'
      node.style.textAlign = 'center'
      return node
    }
    const firstOrig = mk(ch.cloneNode(true))
    ch.setAttribute('data-orig', '1')
    mk(ch)
    strip.appendChild(firstOrig)
    for (let k = 0; k < rolls; k++) {
      const c = ch.cloneNode(true)
      c.removeAttribute('data-orig')
      if (props.scrambleCharset) c.textContent = rand(props.scrambleCharset)
      strip.appendChild(mk(c))
    }
    strip.appendChild(ch)
    // direction=right/down:真字提到最前、首副本垫到最后(从负位移滑回 0)
    if (props.shuffleDirection === 'right' || props.shuffleDirection === 'down') {
      const firstCopy = strip.firstElementChild
      strip.insertBefore(ch, strip.firstChild)
      strip.appendChild(firstCopy)
    }
    const steps = rolls + 1
    let startX = 0
    let finalX = 0
    let startY = 0
    let finalY = 0
    if (props.shuffleDirection === 'right') startX = -steps * w
    else if (props.shuffleDirection === 'left') finalX = -steps * w
    else if (props.shuffleDirection === 'down') startY = -steps * h
    else if (props.shuffleDirection === 'up') finalY = -steps * h
    strip.dataset.sx = String(startX)
    strip.dataset.fx = String(finalX)
    strip.dataset.sy = String(startY)
    strip.dataset.fy = String(finalY)
    strip.style.transform = `translate(${startX}px, ${startY}px)`
    if (props.colorFrom) strip.style.color = props.colorFrom
    wrappers.push(wrap)
  })
}

function resetStrips() {
  wrappers.forEach((wrap) => {
    const strip = wrap.firstElementChild
    if (!strip) return
    strip.style.transform = `translate(${strip.dataset.sx || 0}px, ${strip.dataset.sy || 0}px)`
    if (props.scrambleCharset) {
      const kids = Array.from(strip.children)
      for (let i = 1; i < kids.length - 1; i++) {
        kids[i].textContent = props.scrambleCharset.charAt(
          Math.floor(Math.random() * props.scrambleCharset.length)
        )
      }
    }
  })
}

function cleanupToStill() {
  // 落定后还原成自然文本流(撤掉定宽槽,真字清掉内联样式)
  wrappers.forEach((wrap) => {
    const strip = wrap.firstElementChild
    const real = strip && strip.querySelector('[data-orig="1"]')
    if (real && wrap.parentNode) {
      real.style.width = ''
      real.style.display = ''
      real.style.textAlign = ''
      real.removeAttribute('data-orig')
      wrap.parentNode.replaceChild(real, wrap)
    }
  })
  wrappers = []
  anims = []
}

function play() {
  const strips = wrappers.map((w) => w.firstElementChild).filter(Boolean)
  if (!strips.length) return
  playing = true
  cancelAnims()
  const D = props.duration * 1000
  const easing = cssEase()
  const animTo = (strip, delayMs) => {
    const kf = [
      { transform: `translate(${strip.dataset.sx || 0}px, ${strip.dataset.sy || 0}px)` },
      { transform: `translate(${strip.dataset.fx || 0}px, ${strip.dataset.fy || 0}px)` },
    ]
    anims.push(strip.animate(kf, { duration: D, delay: delayMs, easing, fill: 'forwards' }))
    if (props.colorFrom && props.colorTo) {
      anims.push(
        strip.animate([{ color: props.colorFrom }, { color: props.colorTo }], {
          duration: D,
          delay: delayMs,
          easing,
          fill: 'forwards',
        })
      )
    }
  }
  if (props.animationMode === 'evenodd') {
    // 与原版同时序:奇数位 0 起步,偶数位在 oddTotal*0.7 接力,组内 stagger 错峰
    const odd = strips.filter((_, i) => i % 2 === 1)
    const even = strips.filter((_, i) => i % 2 === 0)
    const oddTotal = props.duration + Math.max(0, odd.length - 1) * props.stagger
    const evenStart = odd.length ? oddTotal * 0.7 : 0
    odd.forEach((s, i) => animTo(s, i * props.stagger * 1000))
    even.forEach((s, i) => animTo(s, (evenStart + i * props.stagger) * 1000))
  } else {
    strips.forEach((s) => animTo(s, Math.random() * props.maxDelay * 1000))
  }
  Promise.all(anims.map((a) => a.finished.catch(() => {}))).then(() => {
    if (destroyed) return
    playing = false
    if (props.loop) {
      emit('shuffle-complete')
      loopTimer = setTimeout(() => {
        if (!destroyed) {
          resetStrips()
          play()
        }
      }, props.loopDelay * 1000)
      return
    }
    cleanupToStill()
    if (props.colorTo && contentEl.value) contentEl.value.style.color = props.colorTo
    emit('shuffle-complete')
  })
}

function runShuffle() {
  if (playing) return
  build()
  play()
  ready.value = true
}

function onHover() {
  if (!ready.value || playing) return
  runShuffle()
}

onMounted(() => {
  const reduce =
    props.respectReducedMotion &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    ready.value = true
    emit('shuffle-complete')
    return
  }
  const start = () => {
    if (destroyed || !rootEl.value) return
    // rootMargin 形如 '-100px' → 收紧视口底边(对齐原版 ScrollTrigger start 偏移)
    const m = /^(-?\d+(?:\.\d+)?)(px|%)?$/.exec(props.rootMargin || '')
    const margin = m ? `0px 0px ${m[1]}${m[2] || 'px'} 0px` : '0px'
    observer = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue
          runShuffle()
          if (props.triggerOnce && observer) {
            observer.disconnect()
            observer = null
          }
        }
      },
      { threshold: props.threshold, rootMargin: margin }
    )
    observer.observe(rootEl.value)
    if (props.triggerOnHover && !hoverBound) {
      hoverBound = true
      rootEl.value.addEventListener('mouseenter', onHover)
    }
  }
  // 字体就绪后再测量/触发,避免按回落字体定宽
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start)
  else start()
})

onBeforeUnmount(() => {
  destroyed = true
  cancelAnims()
  clearTimeout(loopTimer)
  if (observer) observer.disconnect()
  if (hoverBound && rootEl.value) rootEl.value.removeEventListener('mouseenter', onHover)
})
</script>

<style>
.shuffle-parent {
  display: inline-block;
  white-space: normal;
  word-wrap: break-word;
  visibility: hidden;
}
.shuffle-parent.is-ready {
  visibility: visible;
}
.shuffle-word {
  display: inline-block;
  white-space: nowrap;
}
.shuffle-char-wrapper {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: bottom;
}
.shuffle-strip {
  display: inline-block;
  white-space: nowrap;
  will-change: transform;
}
.shuffle-char {
  display: inline-block;
  text-align: center;
}
</style>
