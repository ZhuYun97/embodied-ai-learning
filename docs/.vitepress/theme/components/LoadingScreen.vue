<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(true)

onMounted(() => {
  // 等待 VitePress 完全渲染后淡出
  setTimeout(() => {
    isVisible.value = false
  }, 100)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="isVisible" class="vp-loading-screen">
      <svg class="vp-loading-logo" viewBox="0 0 256 256" fill="none">
        <circle cx="128" cy="128" r="96" stroke="url(#grad)" stroke-width="8" fill="none"/>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#38bdf8"/>
            <stop offset="100%" style="stop-color:#2563eb"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="vp-loading-spinner"></div>
      <div class="vp-loading-text">加载中...</div>
    </div>
  </Transition>
</template>

<style scoped>
.vp-loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  pointer-events: none;
}

.vp-loading-logo {
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

.vp-loading-spinner {
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

.vp-loading-text {
  margin-top: 1.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
