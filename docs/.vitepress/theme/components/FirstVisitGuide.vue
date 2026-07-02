<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'

const STORAGE_KEY = 'atlas-first-visit-guide-v1'

const route = useRoute()
const mounted = ref(false)
const open = ref(false)
const stepIndex = ref(0)
const dismissed = ref(false)

const steps = [
  {
    tag: 'START',
    title: '先从两条主线进入',
    body: 'VLA 看“视觉-语言-动作”策略如何输出动作,WAM 看世界模型如何预测未来状态与动作。首页路线卡适合按方向扫读。',
    primary: ['打开 VLA 总报告', '/vla/'],
    secondary: ['打开 WAM 总览', '/wam/'],
  },
  {
    tag: 'RADAR',
    title: '追最新进展看每日论文',
    body: '每日论文队列会把当天候选按 VLA、WAM、数据评测、人形触觉等分类,并标 P0/P1 优先级和是否已细读。',
    primary: ['看每日最新论文', '/papers/latest'],
    secondary: ['看更新日志', '/vla/changelog'],
  },
  {
    tag: 'MAP',
    title: '用图谱建立全局结构',
    body: '谱系图负责时间轴,知识图谱负责概念、机构、数据、基准之间的关系。适合先定位路线,再点回细读。',
    primary: ['打开知识图谱', '/ecosystem/paper-graph'],
    secondary: ['打开发展时间线', '/vla/papers/timeline'],
  },
  {
    tag: 'DATA',
    title: '需要横向比较就看表',
    body: '全模型规格表对比主干、动作表示、数据规模和开源状态;统一基准榜则专门处理成绩口径,避免跨 benchmark 硬比。',
    primary: ['看规格大表', '/vla/papers/models-spec'],
    secondary: ['看统一基准榜', '/vla/papers/leaderboard'],
  },
  {
    tag: 'TRUST',
    title: '所有结论都看可信度',
    body: '站内用“✅ 已核 / ⚠️ 自评 / 待核”区分证据强度。VLA 页面右上角的可信度透镜可以暗化自评和待核数据。',
    primary: ['看如何阅读', '/vla/guide'],
    secondary: ['看术语表', '/vla/papers/glossary'],
  },
]

const active = computed(() => steps[stepIndex.value])
const progress = computed(() => `${stepIndex.value + 1}/${steps.length}`)
const isHome = computed(() => route.path === '/' || route.path === '/index.html')

function markSeen() {
  dismissed.value = true
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch (e) {}
}

function closePanel(remember = false) {
  open.value = false
  if (remember) markSeen()
}

function openPanel() {
  open.value = true
}

function nextStep() {
  if (stepIndex.value < steps.length - 1) stepIndex.value += 1
  else closePanel(true)
}

function prevStep() {
  if (stepIndex.value > 0) stepIndex.value -= 1
}

function onKeydown(event) {
  if (!open.value) return
  if (event.key === 'Escape') closePanel()
  if (event.key === 'ArrowRight') nextStep()
  if (event.key === 'ArrowLeft') prevStep()
}

onMounted(() => {
  mounted.value = true
  try {
    dismissed.value = localStorage.getItem(STORAGE_KEY) === '1'
  } catch (e) {
    dismissed.value = false
  }
  if (!dismissed.value) {
    window.setTimeout(() => {
      open.value = true
    }, isHome.value ? 900 : 1400)
  }
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <button
      class="first-guide-launcher"
      type="button"
      :aria-expanded="open ? 'true' : 'false'"
      aria-controls="first-guide-panel"
      @click="openPanel"
    >
      <span class="first-guide-launcher__mark" aria-hidden="true">?</span>
      <span>导览</span>
    </button>

    <Transition name="first-guide-fade">
      <div v-if="open" class="first-guide-shell" role="presentation">
        <button class="first-guide-scrim" type="button" aria-label="关闭导览" @click="closePanel()" />
        <section
          id="first-guide-panel"
          class="first-guide-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="first-guide-title"
        >
          <div class="first-guide-head">
            <span class="first-guide-kicker">首次使用导览 · {{ progress }}</span>
            <button class="first-guide-icon-btn" type="button" aria-label="关闭导览" @click="closePanel()">
              ×
            </button>
          </div>

          <div class="first-guide-step">
            <span class="first-guide-tag">{{ active.tag }}</span>
            <h2 id="first-guide-title">{{ active.title }}</h2>
            <p>{{ active.body }}</p>
          </div>

          <div class="first-guide-links" aria-label="推荐入口">
            <a class="first-guide-link first-guide-link--primary" :href="withBase(active.primary[1])">
              {{ active.primary[0] }}
            </a>
            <a class="first-guide-link" :href="withBase(active.secondary[1])">
              {{ active.secondary[0] }}
            </a>
          </div>

          <div class="first-guide-steps" aria-label="导览步骤">
            <button
              v-for="(step, i) in steps"
              :key="step.tag"
              class="first-guide-dot"
              :class="{ 'is-active': i === stepIndex }"
              type="button"
              :aria-label="`跳到第 ${i + 1} 步:${step.title}`"
              :aria-current="i === stepIndex ? 'step' : undefined"
              @click="stepIndex = i"
            />
          </div>

          <div class="first-guide-actions">
            <button class="first-guide-text-btn" type="button" :disabled="stepIndex === 0" @click="prevStep">
              上一步
            </button>
            <button class="first-guide-text-btn" type="button" @click="closePanel(true)">
              不再自动显示
            </button>
            <button class="first-guide-next" type="button" @click="nextStep">
              {{ stepIndex === steps.length - 1 ? '完成' : '下一步' }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.first-guide-launcher {
  position: fixed;
  right: max(18px, env(safe-area-inset-right));
  bottom: max(18px, env(safe-area-inset-bottom));
  z-index: 70;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 13px 0 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 38%, var(--vp-c-divider));
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  color: var(--vp-c-text-1);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(16px);
  font-size: 13px;
  font-weight: 650;
  line-height: 1;
  cursor: pointer;
}

.first-guide-launcher__mark {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  color: white;
  font-size: 13px;
  font-weight: 800;
}

.first-guide-shell {
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;
}

.first-guide-scrim {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(15, 23, 42, 0.14);
  pointer-events: auto;
}

.first-guide-panel {
  position: absolute;
  right: max(18px, env(safe-area-inset-right));
  bottom: calc(max(18px, env(safe-area-inset-bottom)) + 54px);
  width: min(420px, calc(100vw - 28px));
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 26%, var(--vp-c-divider));
  border-radius: 12px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-bg) 96%, transparent), var(--vp-c-bg-soft));
  box-shadow: 0 22px 70px rgba(15, 23, 42, 0.24);
  pointer-events: auto;
  overflow: hidden;
}

.first-guide-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-top: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 70%, transparent);
  pointer-events: none;
}

.first-guide-head,
.first-guide-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.first-guide-head {
  padding: 16px 16px 0;
}

.first-guide-kicker {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.first-guide-icon-btn {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.first-guide-step {
  padding: 18px 18px 0;
}

.first-guide-tag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 28%, var(--vp-c-divider));
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 750;
}

.first-guide-step h2 {
  margin: 10px 0 8px;
  color: var(--vp-c-text-1);
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: 0;
}

.first-guide-step p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.first-guide-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 16px 18px 0;
}

.first-guide-link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.first-guide-link--primary {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: white;
}

.first-guide-steps {
  display: flex;
  gap: 7px;
  padding: 16px 18px 0;
}

.first-guide-dot {
  flex: 1;
  height: 5px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-text-3) 26%, transparent);
  cursor: pointer;
}

.first-guide-dot.is-active {
  background: var(--vp-c-brand-1);
}

.first-guide-actions {
  padding: 16px 18px 18px;
}

.first-guide-text-btn,
.first-guide-next {
  min-height: 34px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.first-guide-text-btn {
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
}

.first-guide-text-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.first-guide-next {
  min-width: 82px;
  border: 1px solid var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
}

.first-guide-fade-enter-active,
.first-guide-fade-leave-active {
  transition: opacity 0.18s ease;
}

.first-guide-fade-enter-from,
.first-guide-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .first-guide-launcher {
    right: 14px;
    bottom: 14px;
  }

  .first-guide-panel {
    right: 14px;
    left: 14px;
    bottom: 68px;
    width: auto;
  }

  .first-guide-links {
    grid-template-columns: 1fr;
  }

  .first-guide-actions {
    flex-wrap: wrap;
  }

  .first-guide-next {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .first-guide-fade-enter-active,
  .first-guide-fade-leave-active {
    transition: none;
  }
}
</style>
