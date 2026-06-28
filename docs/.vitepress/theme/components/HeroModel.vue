<!--
  HeroModel —— 首屏「具身单元」3D 模型(替换原镭光人视频 .thero__robot--video)。
  机制:GLTFLoader 加载 public/models/model.glb(几何 + 漫反射already内嵌),运行时再挂上
  法线 / 粗糙度 / 金属度三张 PBR 贴图;RoomEnvironment(PMREM)做基础 IBL,叠一盏青色边光
  贴合站点 HUD 调性。透明画布悬浮在单元辉光底上,沿用 .thero__robot 的物化揭示 + 浮动动画。
  移植要点(对齐 GridDistortion):three 经动态 import(独立 chunk,仅首页运行时加载,不压全站);
  画布 pointer-events:none → 既不抢单元的悬停视差/点击脉冲/彩蛋,模型跟随鼠标转头 + 随框 3D 倾斜;
  prefers-reduced-motion → 渲染一帧静态 3/4 视角不跟随;离屏 / 标签页隐藏自动停帧;
  WebGL 创建或模型加载失败 → 静默留空(单元取景框与辉光仍在),不报错。
-->
<template>
  <canvas
    ref="el"
    class="thero__robot thero__robot--model"
    role="img"
    aria-label="具身单元 · 交互式 3D 模型"
  ></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const el = ref(null)
let cleanup = null

onMounted(async () => {
  if (typeof window === 'undefined') return
  const canvas = el.value
  if (!canvas) return

  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // —— three + 加载器动态载入(失败即静默回退)——
  let THREE, GLTFLoader, RoomEnvironment
  try {
    THREE = await import('three')
    ;({ GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js'))
    ;({ RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js'))
  } catch (e) {
    return
  }

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch (e) {
    return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)

  // —— 灯光:暖白主光 + 青色边光(HUD 调性)+ 冷蓝补光;环境光来自 RoomEnvironment IBL ——
  const key = new THREE.DirectionalLight(0xffffff, 2.4)
  key.position.set(1.4, 2.0, 2.4)
  const rim = new THREE.DirectionalLight(0x38bdf8, 2.0) // 青色边光,勾出轮廓辉光
  rim.position.set(-2.0, 0.8, -1.8)
  const fill = new THREE.DirectionalLight(0x88aaff, 0.55)
  fill.position.set(-1.6, -0.4, 1.2)
  const amb = new THREE.AmbientLight(0xb8c6ff, 0.25)
  scene.add(key, rim, fill, amb)

  // —— PMREM 环境贴图(柔和反射 / 让 PBR「活」起来);背景保持透明 ——
  let pmrem = null
  let envRT = null
  try {
    pmrem = new THREE.PMREMGenerator(renderer)
    envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = envRT.texture
  } catch (e) {
    /* IBL 失败不致命,定向光仍可照明 */
  }

  // —— 模型容器(自转作用在它上面;不动相机)——
  const pivot = new THREE.Group()
  scene.add(pivot)

  // —— 把 3 张 PBR 数据贴图挂到材质上(法线/粗糙度/金属度;diffuse 已在 GLB 内)——
  const texLoader = new THREE.TextureLoader()
  const loadData = (path) =>
    new Promise((resolve) => {
      texLoader.load(
        withBase(path),
        (t) => {
          // 数据贴图必须线性色彩空间;flipY:false 对齐 glTF 的 UV 朝向
          t.colorSpace = THREE.LinearSRGBColorSpace
          t.flipY = false
          t.wrapS = t.wrapT = THREE.RepeatWrapping
          t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
          resolve(t)
        },
        undefined,
        () => resolve(null),
      )
    })

  let disposed = false
  let raf = 0
  let dirty = true // 需要重绘标记(仅在转头中 / 尺寸 / 可见性变化时绘帧)

  // —— 鼠标交互:头部朝光标方向转(替代自转);平滑 lerp,指针离开窗口回正 ——
  let targetYaw = 0
  let targetPitch = 0
  const onPointerMove = (e) => {
    if (reduce) return
    const nx = (e.clientX / window.innerWidth) * 2 - 1 // -1..1
    const ny = (e.clientY / window.innerHeight) * 2 - 1
    targetYaw = Math.max(-1, Math.min(1, nx)) * 0.6 // ±~34°
    targetPitch = Math.max(-1, Math.min(1, ny)) * 0.2 // ±~11°
    dirty = true
  }
  const recenter = () => {
    targetYaw = 0
    targetPitch = 0
    dirty = true
  }

  // —— 相机取景:按模型包围盒自动构图(不写死,鲁棒)——
  const frameModel = (root) => {
    const box = new THREE.Box3().setFromObject(root)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    // 把模型挪到 pivot 原点居中,使自转绕身体中轴
    root.position.sub(center)
    const maxDim = Math.max(size.x, size.y)
    const fov = (camera.fov * Math.PI) / 180
    let dist = (maxDim / 2 / Math.tan(fov / 2)) * 1.18 // 1.18 留边
    camera.position.set(0, size.y * 0.06, dist) // 极轻俯视
    camera.lookAt(0, 0, 0)
    camera.near = dist / 10
    camera.far = dist * 10
    camera.updateProjectionMatrix()
    // 静止朝向:允许动效时正面朝观者(随后跟随鼠标转头);reduced-motion 给个静态微 3/4
    pivot.rotation.y = reduce ? -0.3 : 0
  }

  const [normalMap, roughnessMap, metalnessMap] = await Promise.all([
    loadData('/models/texture_normal.png'),
    loadData('/models/texture_roughness.png'),
    loadData('/models/texture_metallic.png'),
  ])
  if (disposed) return

  const loader = new GLTFLoader()
  loader.load(
    withBase('/models/model.glb'),
    (gltf) => {
      if (disposed) return
      const root = gltf.scene
      root.traverse((o) => {
        if (!o.isMesh) return
        const m = o.material
        if (!m) return
        if (normalMap) {
          m.normalMap = normalMap
          m.normalScale = new THREE.Vector2(1, 1)
        }
        if (roughnessMap) {
          m.roughnessMap = roughnessMap
          m.roughness = 1 // 由贴图调制
        }
        if (metalnessMap) {
          m.metalnessMap = metalnessMap
          m.metalness = 1 // 由贴图调制(非金属处贴图≈0)
        }
        m.envMapIntensity = 0.9
        if (m.map) m.map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
        m.needsUpdate = true
      })
      pivot.add(root)
      frameModel(root)
      dirty = true
    },
    undefined,
    () => {
      /* 模型加载失败:留空 */
    },
  )

  // —— 渲染循环:平滑转头朝向 target;转动中才重绘,settled 即停帧;离屏/隐藏停帧 ——
  let visible = true
  const EASE = 0.12
  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    if (!reduce && pivot.children.length) {
      const ny = pivot.rotation.y + (targetYaw - pivot.rotation.y) * EASE
      const nx = pivot.rotation.x + (targetPitch - pivot.rotation.x) * EASE
      if (Math.abs(ny - pivot.rotation.y) > 1e-4 || Math.abs(nx - pivot.rotation.x) > 1e-4) {
        pivot.rotation.y = ny
        pivot.rotation.x = nx
        dirty = true
      }
    }
    if (dirty) {
      renderer.render(scene, camera)
      dirty = false
    }
  }

  // —— 尺寸:方形画布,随容器宽度变化 ——
  const resize = () => {
    const w = canvas.clientWidth || 1
    const h = w // 1:1
    renderer.setSize(w, h, false)
    camera.aspect = 1
    camera.updateProjectionMatrix()
    dirty = true
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // —— 离屏停帧 ——
  const io = new IntersectionObserver(
    (ents) => {
      visible = ents[0]?.isIntersecting ?? true
      if (visible) dirty = true
    },
    { threshold: 0.01 },
  )
  io.observe(canvas)

  // —— 标签页隐藏停帧 ——
  const onVis = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf), (raf = 0)
    } else if (!raf && !disposed) {
      dirty = true
      tick()
    }
  }
  document.addEventListener('visibilitychange', onVis)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('mouseleave', recenter)
  window.addEventListener('blur', recenter)

  tick()

  cleanup = () => {
    disposed = true
    if (raf) cancelAnimationFrame(raf)
    document.removeEventListener('visibilitychange', onVis)
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('mouseleave', recenter)
    window.removeEventListener('blur', recenter)
    ro.disconnect()
    io.disconnect()
    scene.traverse((o) => {
      if (o.isMesh) {
        o.geometry?.dispose()
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        mats.forEach((m) => {
          if (!m) return
          ;['map', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach((k) => m[k]?.dispose())
          m.dispose()
        })
      }
    })
    normalMap?.dispose()
    roughnessMap?.dispose()
    metalnessMap?.dispose()
    envRT?.texture?.dispose()
    pmrem?.dispose()
    renderer.dispose()
  }
})

onBeforeUnmount(() => {
  if (cleanup) cleanup()
})
</script>
