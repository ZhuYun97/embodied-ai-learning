<script setup>
import { ref, onMounted, computed } from 'vue'
import { withBase } from 'vitepress'
import Strands from './Strands.vue'

const isVisible = ref(true)
const robotOpacity = ref(0)
const textOpacity = ref(0)
const isFirstVisit = ref(true)

// 检查是否首次访问
const checkFirstVisit = () => {
  try {
    const visited = localStorage.getItem('vp-visited')
    if (visited) {
      isFirstVisit.value = false
      return false
    }
    localStorage.setItem('vp-visited', '1')
    return true
  } catch (e) {
    return true
  }
}

// 显示时长：首次访问 1500ms，后续访问 600ms
const displayDuration = computed(() => isFirstVisit.value ? 1500 : 600)

// 跳过加载动画
const skip = () => {
  if (!isVisible.value) return
  isVisible.value = false
}

onMounted(() => {
  const firstVisit = checkFirstVisit()

  // 键盘/鼠标跳过
  const handleSkip = () => skip()
  window.addEventListener('keydown', handleSkip, { once: true })
  window.addEventListener('click', handleSkip, { once: true })

  // 机器人渐入动画
  setTimeout(() => { robotOpacity.value = 1 }, 200)
  setTimeout(() => { textOpacity.value = 1 }, 600)

  // 自动关闭
  const timer = setTimeout(() => {
    skip()
  }, displayDuration.value)

  // Cleanup
  return () => {
    clearTimeout(timer)
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
          :colors="['#38bdf8', '#2563eb', '#7c3aed', '#06b6d4']"
          :count="5"
          :speed="0.4"
          :amplitude="1.5"
          :waviness="2"
          :thickness="0.9"
          :glow="4.0"
          :taper="2"
          :spread="1.5"
          :intensity="1.0"
          :saturation="2.0"
          :opacity="1"
          :scale="1"
        />
      </div>

      <!-- 中央内容 -->
      <div class="loading-center">
        <!-- 机器人剪影 -->
        <div class="robot-silhouette" :style="{ opacity: robotOpacity }">
          <img :src="withBase('/hero-robot.svg')" alt="Embodied AI" />
        </div>

        <!-- 品牌文字 -->
        <div class="brand-text" :style="{ opacity: textOpacity }">
          <div class="brand-cn">具身星图</div>
          <div class="brand-en">Embodied AI Atlas</div>
        </div>
      </div>

      <!-- 跳过提示 -->
      <div class="skip-hint">按任意键继续</div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0e1a;
  cursor: pointer;
  overflow: hidden;
}

.strands-layer {
  position: absolute;
  inset: 0;
  opacity: 0.85;
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
}

/* 机器人剪影 */
.robot-silhouette {
  width: 160px;
  height: 160px;
  margin-bottom: 2rem;
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 40px rgba(56, 189, 248, 0.6))
          drop-shadow(0 0 80px rgba(37, 99, 235, 0.4));
}

.robot-silhouette img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: robot-float 3s ease-in-out infinite;
}

@keyframes robot-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
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
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #7c3aed 100%);
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
  letter-spacing: 0.15em;
  color: rgba(148, 163, 184, 0.8);
  text-transform: uppercase;
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
  letter-spacing: 0.05em;
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
  .robot-silhouette {
    width: 120px;
    height: 120px;
    margin-bottom: 1.5rem;
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
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .robot-silhouette img {
    animation: none;
  }

  .skip-hint {
    animation: none;
    opacity: 0.5;
  }

  .robot-silhouette,
  .brand-text {
    transition: opacity 0.3s ease;
  }
}
</style>
