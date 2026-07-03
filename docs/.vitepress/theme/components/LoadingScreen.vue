<script setup>
import { ref, onMounted, computed } from 'vue'
import Strands from './Strands.vue'

const isVisible = ref(true)
const strandsReady = ref(false)
const isFirstVisit = ref(true)
const loadingText = ref('具身星图加载中')

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

// 显示时长：首次访问 1200ms，后续访问 400ms
const displayDuration = computed(() => isFirstVisit.value ? 1200 : 400)

// 跳过加载动画
const skip = () => {
  if (!isVisible.value) return
  isVisible.value = false
}

onMounted(() => {
  const firstVisit = checkFirstVisit()

  // 键盘/鼠标跳过
  const handleSkip = (e) => {
    // 任意键盘按键或点击跳过
    skip()
  }

  window.addEventListener('keydown', handleSkip, { once: true })
  window.addEventListener('click', handleSkip, { once: true })

  // 文字动画
  const textFrames = ['具身星图加载中', '具身星图加载中.', '具身星图加载中..', '具身星图加载中...']
  let textIndex = 0
  const textInterval = setInterval(() => {
    textIndex = (textIndex + 1) % textFrames.length
    loadingText.value = textFrames[textIndex]
  }, 400)

  // 等待 VitePress 完全渲染后淡出
  const timer = setTimeout(() => {
    loadingText.value = '准备就绪'
    setTimeout(() => {
      skip()
      clearInterval(textInterval)
    }, 200)
  }, displayDuration.value)

  // Cleanup
  return () => {
    clearTimeout(timer)
    clearInterval(textInterval)
    window.removeEventListener('keydown', handleSkip)
    window.removeEventListener('click', handleSkip)
  }
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="vp-loading-screen" @click="skip">
      <!-- Strands WebGL 流体背景 -->
      <div class="loading-bg">
        <Strands
          :colors="['#38bdf8', '#2563eb', '#7c3aed']"
          :count="3"
          :speed="0.3"
          :amplitude="1.2"
          :waviness="1.5"
          :thickness="0.8"
          :glow="3.0"
          :taper="2.5"
          :spread="1.2"
          :intensity="0.8"
          :saturation="1.8"
          :opacity="0.9"
          :scale="1.2"
          @vue:mounted="strandsReady = true"
        />
      </div>

      <!-- 前景内容 -->
      <div class="loading-content">
        <div class="loading-logo">
          <svg viewBox="0 0 256 256" fill="none">
            <circle cx="128" cy="128" r="96" stroke="url(#grad)" stroke-width="8" fill="none"/>
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#38bdf8"/>
                <stop offset="100%" style="stop-color:#2563eb"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ loadingText }}</div>
        <div class="loading-hint">点击任意位置或按任意键跳过</div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.vp-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  cursor: pointer;
}

.loading-bg {
  position: absolute;
  inset: 0;
  opacity: 0.6;
  pointer-events: none;
}

.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.loading-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  animation: logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes logo-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(56, 189, 248, 0.2);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.05em;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
  min-width: 180px;
  text-align: center;
}

.loading-hint {
  margin-top: 2rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.03em;
  animation: hint-fade 2s ease-in-out infinite;
}

@keyframes hint-fade {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .loading-logo {
    width: 60px;
    height: 60px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .loading-text {
    font-size: 0.8125rem;
  }

  .loading-hint {
    font-size: 0.6875rem;
  }
}

/* 降低动画减少motion */
@media (prefers-reduced-motion: reduce) {
  .loading-logo,
  .loading-spinner,
  .loading-hint {
    animation: none;
  }
}
</style>
