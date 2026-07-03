<script setup>
import { ref, onBeforeUnmount, onMounted, computed } from 'vue'
import { withBase } from 'vitepress'
import Strands from './Strands.vue'

const isVisible = ref(true)
const robotOpacity = ref(0)
const textOpacity = ref(0)
const coreReady = ref(false)
const isFirstVisit = ref(true)

let timer = null
let robotTimer = null
let textTimer = null
let coreTimer = null
let handleSkip = null

// 检查是否首次访问
const checkFirstVisit = () => {
  try {
    const visited = localStorage.getItem('vp-visited-loader-v5')
    if (visited) {
      isFirstVisit.value = false
      return false
    }
    localStorage.setItem('vp-visited-loader-v5', '1')
    return true
  } catch (e) {
    return true
  }
}

// 显示时长：首次访问保留完整启动感，后续访问快速掠过
const displayDuration = computed(() => isFirstVisit.value ? 2400 : 720)

// 跳过加载动画
const skip = () => {
  if (!isVisible.value) return
  isVisible.value = false
}

onMounted(() => {
  checkFirstVisit()

  // 键盘/鼠标跳过
  handleSkip = () => skip()
  window.addEventListener('keydown', handleSkip, { once: true })
  window.addEventListener('click', handleSkip, { once: true })

  coreTimer = setTimeout(() => { coreReady.value = true }, 80)
  robotTimer = setTimeout(() => { robotOpacity.value = 1 }, 220)
  textTimer = setTimeout(() => { textOpacity.value = 1 }, 580)

  // 自动关闭
  timer = setTimeout(() => {
    skip()
  }, displayDuration.value)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(robotTimer)
  clearTimeout(textTimer)
  clearTimeout(coreTimer)
  if (handleSkip) {
    window.removeEventListener('keydown', handleSkip)
    window.removeEventListener('click', handleSkip)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="loading-screen" @click="skip">
      <!-- Strands 能量流 -->
      <div class="strands-layer">
        <Strands
          :colors="['#22d3ee', '#38bdf8', '#8b5cf6', '#10b981']"
          :count="6"
          :speed="0.34"
          :amplitude="1.25"
          :waviness="1.9"
          :thickness="0.75"
          :glow="3.4"
          :taper="2"
          :spread="1.35"
          :intensity="0.92"
          :saturation="1.7"
          :opacity="0.9"
          :scale="1"
        />
      </div>

      <div class="loading-grid" aria-hidden="true"></div>
      <div class="loading-vignette" aria-hidden="true"></div>

      <!-- 中央内容 -->
      <div class="loading-center" :class="{ 'is-ready': coreReady }">
        <!-- 机器人剪影 -->
        <div class="boot-core" :style="{ opacity: robotOpacity }" aria-hidden="true">
          <span class="orbit orbit-a"></span>
          <span class="orbit orbit-b"></span>
          <span class="orbit orbit-c"></span>
          <span class="scan-line"></span>
          <span class="core-glow"></span>
          <div class="robot-silhouette">
            <img :src="withBase('/hero-robot.svg')" alt="" />
          </div>
        </div>

        <!-- 品牌文字 -->
        <div class="brand-text" :style="{ opacity: textOpacity }">
          <div class="brand-cn">具身星图</div>
          <div class="brand-en">Embodied AI Atlas</div>
          <div class="boot-modules" aria-hidden="true">
            <span>VLA</span>
            <span>WAM</span>
            <span>DATA</span>
          </div>
        </div>
      </div>

      <div class="boot-progress" aria-hidden="true">
        <span></span>
      </div>

      <!-- 跳过提示 -->
      <div class="skip-hint">点击或按任意键进入</div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 44%, rgba(34, 211, 238, 0.18), transparent 28rem),
    radial-gradient(circle at 72% 30%, rgba(139, 92, 246, 0.16), transparent 30rem),
    linear-gradient(145deg, #050914 0%, #08111f 48%, #0d1825 100%);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
}

.strands-layer {
  position: absolute;
  inset: 0;
  opacity: 0.72;
  pointer-events: none;
  mix-blend-mode: screen;
}

.loading-grid {
  position: absolute;
  inset: -2px;
  opacity: 0.28;
  background-image:
    linear-gradient(rgba(125, 211, 252, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 211, 252, 0.1) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at 50% 50%, #000 0%, transparent 72%);
  animation: grid-drift 8s linear infinite;
}

.loading-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 9, 20, 0.12), rgba(5, 9, 20, 0.82)),
    radial-gradient(circle at 50% 48%, transparent 0 22rem, rgba(0, 0, 0, 0.28) 38rem);
  pointer-events: none;
}

.loading-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transform: translateY(6px);
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.loading-center.is-ready {
  transform: translateY(0);
}

.boot-core {
  position: relative;
  width: 214px;
  height: 214px;
  margin-bottom: 1.75rem;
  display: grid;
  place-items: center;
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.core-glow {
  position: absolute;
  width: 118px;
  height: 118px;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(56, 189, 248, 0.38), transparent 64%),
    radial-gradient(circle, rgba(16, 185, 129, 0.28), transparent 72%);
  filter: blur(4px);
  animation: core-breathe 1.8s ease-in-out infinite;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(125, 211, 252, 0.34);
  border-radius: 999px;
  box-shadow: 0 0 28px rgba(34, 211, 238, 0.18);
}

.orbit::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #67e8f9;
  box-shadow: 0 0 14px rgba(103, 232, 249, 0.9);
}

.orbit-a {
  width: 190px;
  height: 92px;
  transform: rotate(-17deg);
  animation: orbit-turn-a 2.6s linear infinite;
}

.orbit-a::after {
  top: 12px;
  right: 28px;
}

.orbit-b {
  width: 156px;
  height: 156px;
  border-color: rgba(167, 139, 250, 0.28);
  animation: orbit-turn-b 3.2s linear infinite reverse;
}

.orbit-b::after {
  left: 16px;
  bottom: 28px;
  background: #a78bfa;
  box-shadow: 0 0 14px rgba(167, 139, 250, 0.85);
}

.orbit-c {
  width: 96px;
  height: 196px;
  transform: rotate(23deg);
  border-color: rgba(52, 211, 153, 0.24);
  animation: orbit-turn-c 3.8s linear infinite;
}

.orbit-c::after {
  top: 30px;
  left: 8px;
  background: #34d399;
  box-shadow: 0 0 14px rgba(52, 211, 153, 0.85);
}

.scan-line {
  position: absolute;
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.95), transparent);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.72);
  animation: scan-pass 1.55s ease-in-out infinite;
}

.robot-silhouette {
  position: relative;
  width: 118px;
  height: 118px;
  display: grid;
  place-items: center;
  border-radius: 32px;
  background:
    linear-gradient(145deg, rgba(15, 23, 42, 0.68), rgba(8, 17, 31, 0.28)),
    radial-gradient(circle at 50% 22%, rgba(34, 211, 238, 0.18), transparent 64%);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 22px 60px rgba(2, 6, 23, 0.46),
    0 0 42px rgba(34, 211, 238, 0.25);
}

.robot-silhouette img {
  width: 74%;
  height: 74%;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.5));
  animation: robot-float 2.6s ease-in-out infinite;
}

@keyframes robot-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes orbit-turn-a {
  from { transform: rotate(-17deg); }
  to { transform: rotate(343deg); }
}

@keyframes orbit-turn-b {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbit-turn-c {
  from { transform: rotate(23deg); }
  to { transform: rotate(383deg); }
}

@keyframes scan-pass {
  0%, 100% {
    opacity: 0;
    transform: translateY(-58px);
  }
  18%, 82% {
    opacity: 1;
  }
  50% {
    transform: translateY(58px);
  }
}

@keyframes core-breathe {
  0%, 100% {
    opacity: 0.72;
    transform: scale(0.96);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes grid-drift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(72px, 72px, 0); }
}

/* 品牌文字 */
.brand-text {
  text-align: center;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
}

.brand-cn {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0;
  background: linear-gradient(135deg, #e0f2fe 0%, #38bdf8 42%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 40px rgba(56, 189, 248, 0.3);
}

.brand-en {
  font-family: 'Orbitron', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
  color: rgba(148, 163, 184, 0.8);
  text-transform: uppercase;
}

.boot-modules {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.boot-modules span {
  display: inline-flex;
  align-items: center;
  min-width: 54px;
  height: 28px;
  justify-content: center;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.48);
  color: rgba(226, 232, 240, 0.82);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  animation: module-pop 1.4s ease-in-out infinite;
}

.boot-modules span:nth-child(2) {
  animation-delay: 0.16s;
}

.boot-modules span:nth-child(3) {
  animation-delay: 0.32s;
}

.boot-progress {
  position: absolute;
  left: 50%;
  bottom: 4.6rem;
  width: min(280px, calc(100vw - 64px));
  height: 3px;
  transform: translateX(-50%);
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.16);
  box-shadow: 0 0 24px rgba(34, 211, 238, 0.14);
}

.boot-progress span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, #22d3ee, #38bdf8, #a78bfa);
  animation: boot-fill 1.75s cubic-bezier(0.24, 0.8, 0.24, 1) forwards;
}

@keyframes module-pop {
  0%, 100% {
    border-color: rgba(125, 211, 252, 0.24);
    transform: translateY(0);
  }
  50% {
    border-color: rgba(125, 211, 252, 0.48);
    transform: translateY(-2px);
  }
}

@keyframes boot-fill {
  from { transform: scaleX(0.08); }
  to { transform: scaleX(1); }
}

/* 跳过提示 */
.skip-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.5);
  letter-spacing: 0;
  pointer-events: none;
  animation: hint-pulse 2s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* 淡入淡出 */
.fade-enter-active {
  transition: opacity 0.4s ease;
}

.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .boot-core {
    width: 172px;
    height: 172px;
    margin-bottom: 1.5rem;
  }

  .orbit-a {
    width: 154px;
    height: 74px;
  }

  .orbit-b {
    width: 128px;
    height: 128px;
  }

  .orbit-c {
    width: 80px;
    height: 158px;
  }

  .robot-silhouette {
    width: 96px;
    height: 96px;
    border-radius: 24px;
  }

  .brand-cn {
    font-size: 1.5rem;
  }

  .brand-en {
    font-size: 0.75rem;
  }

  .skip-hint {
    bottom: 1.5rem;
    font-size: 0.6875rem;
  }

  .boot-progress {
    bottom: 3.8rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .loading-grid,
  .robot-silhouette img,
  .orbit,
  .scan-line,
  .core-glow,
  .boot-modules span,
  .boot-progress span {
    animation: none;
  }

  .boot-progress span {
    transform: scaleX(1);
  }

  .skip-hint {
    animation: none;
    opacity: 0.5;
  }

  .boot-core,
  .brand-text {
    transition: opacity 0.3s ease;
  }
}
</style>
