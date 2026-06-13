<!--
  Lightfall —— OGL 坠落光束隧道背景(React Bits Lightfall 的 Vue 3 移植)。
  机制:全屏三角 + 片元着色器,在隧道坐标里渲染随机坠落的彩色光束(twinkle 闪烁、
  density 频率、zoom 视场),叠柔和环境辉光;鼠标位置注入一团跟随光、烘亮附近光束
  (mouseDampening 时间常数做缓动)。着色器/uniform 与原版逐字一致,仅外壳改 Vue。
  移植说明:ogl 经动态 import(独立 chunk,仅首页运行时加载,不压全站包);
  背景层 pointer-events:none → 指针挂 window 并按容器 rect 映射;
  paused/prefers-reduced-motion → 冻结渲染(只画一帧);WebGL 失败 → 静默降级(透明)。
-->
<template>
  <div ref="containerEl" class="lightfall-container" :style="mixBlendMode ? { mixBlendMode } : null"></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  colors: { type: Array, default: () => ['#A6C8FF', '#5227FF', '#FF9FFC'] },
  backgroundColor: { type: String, default: '#0A29FF' },
  speed: { type: Number, default: 1 },
  streakCount: { type: Number, default: 8 },
  streakWidth: { type: Number, default: 1 },
  streakLength: { type: Number, default: 1 },
  glow: { type: Number, default: 1 },
  density: { type: Number, default: 1 },
  twinkle: { type: Number, default: 1 },
  zoom: { type: Number, default: 2 },
  backgroundGlow: { type: Number, default: 1 },
  opacity: { type: Number, default: 1 },
  mouseInteraction: { type: Boolean, default: true },
  mouseStrength: { type: Number, default: 1 },
  mouseRadius: { type: Number, default: 0.6 },
  mouseDampening: { type: Number, default: 0.15 },
  mixBlendMode: { type: String, default: '' },
  dpr: { type: Number, default: 0 },
})

const MAX_COLORS = 8
const hexToRGB = (hex) => {
  const c = hex.replace('#', '').padEnd(6, '0')
  return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255]
}
const prepColors = (input) => {
  const base = (input && input.length ? input : ['#A6C8FF', '#5227FF', '#FF9FFC']).slice(0, MAX_COLORS)
  const count = base.length
  const arr = []
  for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[Math.min(i, base.length - 1)]))
  const avg = [0, 0, 0]
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0]
    avg[1] += arr[i][1]
    avg[2] += arr[i][2]
  }
  avg[0] /= count
  avg[1] /= count
  avg[2] /= count
  return { arr, count, avg }
}

const vertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `
precision highp float;
uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;
uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;
uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}
vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}
vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}
void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);
  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;
  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);
  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }
  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);
  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }
  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
  o = vec4(colr, uOpacity);
}
void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`

const containerEl = ref(null)
let cleanup = null

onMounted(async () => {
  const container = containerEl.value
  if (!container) return
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let OGL
  try {
    OGL = await import('ogl')
  } catch (e) {
    return
  }
  const { Renderer, Program, Mesh, Triangle } = OGL

  let renderer
  try {
    renderer = new Renderer({
      dpr: props.dpr || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true,
    })
  } catch (e) {
    return
  }
  const gl = renderer.gl
  const canvas = gl.canvas
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  container.appendChild(canvas)

  const { arr, count, avg } = prepColors(props.colors)
  const uniforms = {
    iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
    iMouse: { value: [0, 0] },
    iTime: { value: 0 },
    uColor0: { value: arr[0] }, uColor1: { value: arr[1] }, uColor2: { value: arr[2] }, uColor3: { value: arr[3] },
    uColor4: { value: arr[4] }, uColor5: { value: arr[5] }, uColor6: { value: arr[6] }, uColor7: { value: arr[7] },
    uColorCount: { value: count },
    uBgColor: { value: hexToRGB(props.backgroundColor) },
    uMouseColor: { value: avg },
    uSpeed: { value: props.speed },
    uStreakCount: { value: Math.max(1, Math.min(16, Math.round(props.streakCount))) },
    uStreakWidth: { value: props.streakWidth },
    uStreakLength: { value: props.streakLength },
    uGlow: { value: props.glow },
    uDensity: { value: props.density },
    uTwinkle: { value: props.twinkle },
    uZoom: { value: props.zoom },
    uBgGlow: { value: props.backgroundGlow },
    uOpacity: { value: props.opacity },
    uMouseEnabled: { value: props.mouseInteraction ? 1 : 0 },
    uMouseStrength: { value: props.mouseStrength },
    uMouseRadius: { value: props.mouseRadius },
  }

  const program = new Program(gl, { vertex, fragment, uniforms })
  const geometry = new Triangle(gl)
  const mesh = new Mesh(gl, { geometry, program })

  const resize = () => {
    const rect = container.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    renderer.setSize(rect.width, rect.height)
    uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(container)

  const mouseTarget = [0, 0]
  let lastTime = 0
  // 背景层 pointer-events:none → 指针挂 window,按 canvas rect 映射(出界即停在边界)
  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect()
    const scale = renderer.dpr || 1
    mouseTarget[0] = (e.clientX - rect.left) * scale
    mouseTarget[1] = (rect.height - (e.clientY - rect.top)) * scale
    if (props.mouseDampening <= 0) uniforms.iMouse.value = [mouseTarget[0], mouseTarget[1]]
  }
  if (props.mouseInteraction) window.addEventListener('pointermove', onPointerMove, { passive: true })

  // 滚出视口即暂停渲染(光束是持续动画、无空闲停帧 → 省 GPU);回到视口恢复
  let onScreen = true
  const io = new IntersectionObserver(
    (entries) => { onScreen = entries[0]?.isIntersecting ?? true },
    { threshold: 0 }
  )
  io.observe(container)

  let raf = null
  let destroyed = false
  const loop = (t) => {
    if (destroyed) return
    raf = requestAnimationFrame(loop)
    if (!onScreen) return
    uniforms.iTime.value = t * 0.001
    if (props.mouseDampening > 0) {
      if (!lastTime) lastTime = t
      const dt = (t - lastTime) / 1000
      lastTime = t
      const tau = Math.max(1e-4, props.mouseDampening)
      let factor = 1 - Math.exp(-dt / tau)
      if (factor > 1) factor = 1
      const cur = uniforms.iMouse.value
      cur[0] += (mouseTarget[0] - cur[0]) * factor
      cur[1] += (mouseTarget[1] - cur[1]) * factor
    } else {
      lastTime = t
    }
    if (!reduce) {
      try {
        renderer.render({ scene: mesh })
      } catch (e) {}
    }
  }
  if (reduce) {
    // 静帧:渲染一次即停
    uniforms.iTime.value = 9
    try { renderer.render({ scene: mesh }) } catch (e) {}
  } else {
    raf = requestAnimationFrame(loop)
  }

  cleanup = () => {
    destroyed = true
    if (raf) cancelAnimationFrame(raf)
    if (props.mouseInteraction) window.removeEventListener('pointermove', onPointerMove)
    ro.disconnect()
    io.disconnect()
    if (canvas.parentElement === container) container.removeChild(canvas)
    const callIfFn = (obj, key) => { if (obj && typeof obj[key] === 'function') obj[key].call(obj) }
    callIfFn(program, 'remove')
    callIfFn(geometry, 'remove')
    callIfFn(mesh, 'remove')
    callIfFn(renderer, 'destroy')
  }
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>

<style>
.lightfall-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
