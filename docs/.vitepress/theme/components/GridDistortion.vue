<!--
  GridDistortion —— WebGL 网格扭曲背景(React Bits GridDistortion 的 Vue 3 移植)。
  机制:把图片贴在 grid×grid 细分平面上,DataTexture 存每格 UV 偏移;鼠标速度向
  周边格子注入偏移、每帧按 relaxation 衰减回弹,片元着色器按偏移采样产生「果冻」扭曲。
  移植说明:three 经动态 import(独立 chunk,仅首页运行时加载,不压全站);本层为
  pointer-events:none 背景 → 鼠标改挂 window 并按容器 rect 映射(出界即停止注入);
  新增空闲停帧(网格回弹完成 + 无输入 ≈1.2s → 停 rAF,mousemove 唤醒);
  prefers-reduced-motion / WebGL 创建失败 → 回退为静态 background-image。
-->
<template>
  <div
    ref="containerEl"
    class="distortion-container"
    :class="{ 'is-static': isStatic }"
    :style="isStatic ? { backgroundImage: `url(${imageSrc})` } : null"
  ></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  imageSrc: { type: String, required: true },
  grid: { type: Number, default: 15 },
  mouse: { type: Number, default: 0.1 },
  strength: { type: Number, default: 0.15 },
  relaxation: { type: Number, default: 0.9 },
})

const containerEl = ref(null)
const isStatic = ref(false)

let cleanup = null

onMounted(async () => {
  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    isStatic.value = true
    return
  }
  let THREE
  try {
    THREE = await import('three')
  } catch (e) {
    isStatic.value = true
    return
  }
  const container = containerEl.value
  if (!container) return

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch (e) {
    isStatic.value = true
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000)
  camera.position.z = 2

  const uniforms = {
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() },
    uTexture: { value: null },
    uDataTexture: { value: null },
  }

  const size = props.grid
  const initial = new Float32Array(4 * size * size)
  for (let i = 0; i < size * size; i++) {
    initial[i * 4] = Math.random() * 255 - 125
    initial[i * 4 + 1] = Math.random() * 255 - 125
  }
  const dataTexture = new THREE.DataTexture(initial, size, size, THREE.RGBAFormat, THREE.FloatType)
  dataTexture.needsUpdate = true
  uniforms.uDataTexture.value = dataTexture

  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms,
    transparent: true,
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform sampler2D uDataTexture;
      uniform sampler2D uTexture;
      uniform vec4 resolution;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        vec4 offset = texture2D(uDataTexture, vUv);
        gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
      }`,
  })
  const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1)
  const plane = new THREE.Mesh(geometry, material)
  scene.add(plane)

  const handleResize = () => {
    const rect = container.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const aspect = rect.width / rect.height
    renderer.setSize(rect.width, rect.height)
    plane.scale.set(aspect, 1, 1)
    const fw = aspect
    camera.left = -fw / 2
    camera.right = fw / 2
    camera.top = 0.5
    camera.bottom = -0.5
    camera.updateProjectionMatrix()
    uniforms.resolution.value.set(rect.width, rect.height, 1, 1)
  }

  const loader = new THREE.TextureLoader()
  loader.load(props.imageSrc, (texture) => {
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    uniforms.uTexture.value = texture
    handleResize()
    wake()
  })

  let ro = null
  if (window.ResizeObserver) {
    ro = new ResizeObserver(handleResize)
    ro.observe(container)
  } else {
    window.addEventListener('resize', handleResize)
  }

  const mouseState = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 }
  let lastInput = 0
  let raf = null
  let running = false
  let destroyed = false

  // 背景层 pointer-events:none → 鼠标挂 window,按容器 rect 映射,出界视为离开
  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect()
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      mouseState.vX = 0
      mouseState.vY = 0
      return
    }
    const x = (e.clientX - rect.left) / rect.width
    const y = 1 - (e.clientY - rect.top) / rect.height
    mouseState.vX = x - mouseState.prevX
    mouseState.vY = y - mouseState.prevY
    Object.assign(mouseState, { x, y, prevX: x, prevY: y })
    wake()
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true })

  const animate = () => {
    if (destroyed) return
    uniforms.time.value += 0.05
    const data = dataTexture.image.data
    let maxAbs = 0
    for (let i = 0; i < size * size; i++) {
      data[i * 4] *= props.relaxation
      data[i * 4 + 1] *= props.relaxation
      const a = Math.abs(data[i * 4]) + Math.abs(data[i * 4 + 1])
      if (a > maxAbs) maxAbs = a
    }
    const gridMouseX = size * mouseState.x
    const gridMouseY = size * mouseState.y
    const maxDist = size * props.mouse
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const distSq = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2
        if (distSq < maxDist * maxDist) {
          const idx = 4 * (i + size * j)
          const power = Math.min(maxDist / Math.sqrt(distSq || 0.001), 10)
          data[idx] += props.strength * 100 * mouseState.vX * power
          data[idx + 1] -= props.strength * 100 * mouseState.vY * power
        }
      }
    }
    dataTexture.needsUpdate = true
    renderer.render(scene, camera)
    // 空闲停帧:网格基本回弹 + 无输入 → 暂停,mousemove 唤醒
    if (maxAbs < 0.5 && performance.now() - lastInput > 1200) {
      running = false
      return
    }
    raf = requestAnimationFrame(animate)
  }

  function wake() {
    lastInput = performance.now()
    if (!running && !destroyed) {
      running = true
      raf = requestAnimationFrame(animate)
    }
  }

  handleResize()
  wake()

  cleanup = () => {
    destroyed = true
    running = false
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMouseMove)
    if (ro) ro.disconnect()
    else window.removeEventListener('resize', handleResize)
    geometry.dispose()
    material.dispose()
    dataTexture.dispose()
    if (uniforms.uTexture.value) uniforms.uTexture.value.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
  }
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>

<style>
.distortion-container {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.distortion-container.is-static {
  background-size: cover;
  background-position: center;
}
</style>
