<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'

const STORAGE_KEY = 'atlas-first-visit-guide-v1'
const FEATURE_TIP_KEYS = {
  lens: 'atlas-feature-tip-lens-v1',
  zen: 'atlas-feature-tip-zen-v1',
}

const route = useRoute()
const mounted = ref(false)
const open = ref(false)
const activeKey = ref('start')
const dismissed = ref(false)
const featureTip = ref(null)
const featureTipStyle = ref({})
let featureTimer = 0

const menuGroups = [
  {
    key: 'start',
    label: '入门',
    title: '第一次来先这样逛',
    body: '先用顶部菜单判断自己要看全局路线、最新论文、还是表格对比。本站不是线性教程,更像一张可跳转的研究地图。',
    links: [
      ['如何阅读本站', '/vla/guide'],
      ['具身入门', '/vla/papers/getting-started'],
      ['学习路线图', '/vla/papers/roadmap'],
    ],
  },
  {
    key: 'latest',
    label: '最新',
    title: '追进展走“最新”菜单',
    body: '每日论文、时间线、更新日志都在这里。适合先扫 P0/P1 和分类标签,再进入具体论文页细读。',
    links: [
      ['每日最新论文', '/papers/latest'],
      ['发展时间线', '/vla/papers/timeline'],
      ['更新日志', '/vla/changelog'],
    ],
  },
  {
    key: 'vla',
    label: 'VLA/WAM',
    title: '看主线走 VLA / WAM',
    body: 'VLA 关注视觉语言到动作,WAM 关注世界模型与动作预测。两条线可以对照看,不要只读单篇结论。',
    links: [
      ['VLA 调研总览', '/vla/'],
      ['WAM 调研总览', '/wam/'],
      ['全模型规格对比', '/vla/papers/models-spec'],
    ],
  },
  {
    key: 'data',
    label: '数据评测',
    title: '横向比较走“数据&评测”',
    body: '数据集、基准榜、模型规格表都强调口径。读排名前先看来源标注,避免把不同 benchmark 的数字硬比。',
    links: [
      ['数据集图鉴', '/vla/papers/datasets-catalog'],
      ['统一基准榜', '/vla/papers/leaderboard'],
      ['评测基准全景', '/vla/papers/benchmarks'],
    ],
  },
  {
    key: 'map',
    label: '图谱',
    title: '不知道去哪就开图谱',
    body: '知识图谱把论文、机构、数据、基准和概念连起来。适合从一个模型出发,顺藤摸到相关技术路线。',
    links: [
      ['知识图谱', '/ecosystem/paper-graph'],
      ['术语速查表', '/vla/papers/glossary'],
      ['外部资源导航', '/vla/papers/resources'],
    ],
  },
]

const active = computed(() => menuGroups.find((group) => group.key === activeKey.value) || menuGroups[0])
const isHome = computed(() => route.path === '/' || route.path === '/index.html')

function markSeen() {
  dismissed.value = true
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch (e) {}
}

function hasSeenFeature(key) {
  try {
    return localStorage.getItem(FEATURE_TIP_KEYS[key]) === '1'
  } catch (e) {
    return false
  }
}

function markFeatureSeen(key) {
  try {
    localStorage.setItem(FEATURE_TIP_KEYS[key], '1')
  } catch (e) {}
}

function closePanel(remember = false) {
  open.value = false
  if (remember) markSeen()
  scheduleFeatureTip(500)
}

function openPanel() {
  featureTip.value = null
  open.value = true
}

function selectGroup(key) {
  activeKey.value = key
}

function onKeydown(event) {
  if (!open.value) return
  if (event.key === 'Escape') closePanel()
}

function closeFeatureTip(remember = true) {
  if (remember && featureTip.value) markFeatureSeen(featureTip.value.key)
  featureTip.value = null
  if (remember) scheduleFeatureTip(500)
}

function buildFeatureTip(key, target) {
  const rect = target.getBoundingClientRect()
  const narrow = window.innerWidth <= 640
  featureTipStyle.value = narrow
    ? {}
    : {
        top: `${Math.round(rect.bottom + 10)}px`,
        right: `${Math.max(18, Math.round(window.innerWidth - rect.right))}px`,
      }

  featureTip.value =
    key === 'lens'
      ? {
          key,
          kicker: '可信度透镜',
          title: '第一次看到这个按钮?',
          body: '它用来切换证据强度视图:全部显示、暗化自评/待核、仅突出已核。看模型分数和排行榜时优先打开它。',
        }
      : {
          key,
          kicker: '专注模式',
          title: '长文细读可以用专注模式',
          body: '它会收起左侧目录和右侧大纲,把正文区域放宽。适合读论文细读、训练流程和长表格说明。',
        }
}

function scheduleFeatureTip(delay = 900) {
  if (typeof window === 'undefined') return
  window.clearTimeout(featureTimer)
  featureTimer = window.setTimeout(async () => {
    if (open.value || featureTip.value) return
    await nextTick()
    const candidates = [
      ['lens', document.querySelector('.lens-toggle')],
      ['zen', document.querySelector('.zen-toggle')],
    ]
    const match = candidates.find(([key, target]) => target && !hasSeenFeature(key))
    if (!match) return
    buildFeatureTip(match[0], match[1])
  }, delay)
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
  } else {
    scheduleFeatureTip(1100)
  }
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.clearTimeout(featureTimer)
  window.removeEventListener('keydown', onKeydown)
})

watch(
  () => route.path,
  () => {
    closeFeatureTip(false)
    scheduleFeatureTip(1200)
  }
)
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
            <span class="first-guide-kicker">菜单导览</span>
            <button class="first-guide-icon-btn" type="button" aria-label="关闭导览" @click="closePanel()">
              ×
            </button>
          </div>

          <div class="first-guide-tabs" aria-label="站点菜单栏目">
            <button
              v-for="group in menuGroups"
              :key="group.key"
              class="first-guide-tab"
              :class="{ 'is-active': group.key === active.key }"
              type="button"
              :aria-current="group.key === active.key ? 'true' : undefined"
              @click="selectGroup(group.key)"
            >
              {{ group.label }}
            </button>
          </div>

          <div class="first-guide-step">
            <h2 id="first-guide-title">{{ active.title }}</h2>
            <p>{{ active.body }}</p>
          </div>

          <div class="first-guide-links" aria-label="推荐入口">
            <a
              v-for="(link, i) in active.links"
              :key="link[1]"
              class="first-guide-link"
              :class="{ 'first-guide-link--primary': i === 0 }"
              :href="withBase(link[1])"
              @click="markSeen"
            >
              {{ link[0] }}
            </a>
          </div>

          <div class="first-guide-actions">
            <button class="first-guide-text-btn" type="button" @click="closePanel(true)">
              不再自动显示
            </button>
            <button class="first-guide-next" type="button" @click="closePanel(true)">
              知道了
            </button>
          </div>
        </section>
      </div>
    </Transition>

    <Transition name="first-guide-fade">
      <section
        v-if="featureTip"
        class="feature-tip"
        :style="featureTipStyle"
        role="dialog"
        aria-modal="false"
        :aria-labelledby="`feature-tip-${featureTip.key}`"
      >
        <div class="feature-tip__head">
          <span>{{ featureTip.kicker }}</span>
          <button class="feature-tip__close" type="button" aria-label="关闭功能提示" @click="closeFeatureTip()">
            ×
          </button>
        </div>
        <h2 :id="`feature-tip-${featureTip.key}`">{{ featureTip.title }}</h2>
        <p>{{ featureTip.body }}</p>
        <button class="feature-tip__ok" type="button" @click="closeFeatureTip()">知道了</button>
      </section>
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
  width: min(520px, calc(100vw - 28px));
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
  padding: 14px 18px 0;
}

.first-guide-step h2 {
  margin: 0 0 8px;
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

.first-guide-tabs {
  display: flex;
  gap: 6px;
  padding: 14px 16px 0;
  overflow-x: auto;
}

.first-guide-tab {
  flex: 0 0 auto;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}

.first-guide-tab.is-active {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 62%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-bg));
  color: var(--vp-c-brand-1);
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

.feature-tip {
  position: fixed;
  top: var(--feature-tip-top, auto);
  right: var(--feature-tip-right, 18px);
  z-index: 75;
  width: min(330px, calc(100vw - 28px));
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider));
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 96%, var(--vp-c-bg-soft));
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.2);
}

.feature-tip__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 800;
}

.feature-tip__close {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.feature-tip h2 {
  margin: 8px 0 6px;
  color: var(--vp-c-text-1);
  font-size: 17px;
  line-height: 1.28;
  letter-spacing: 0;
}

.feature-tip p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.65;
}

.feature-tip__ok {
  min-height: 32px;
  margin-top: 12px;
  padding: 0 12px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

@media (max-width: 640px) {
  .first-guide-launcher {
    right: max(14px, env(safe-area-inset-right));
    bottom: max(14px, env(safe-area-inset-bottom));
  }

  .first-guide-panel {
    right: 14px;
    left: 14px;
    bottom: 68px;
    width: auto;
  }

  .feature-tip {
    top: auto !important;
    right: 14px !important;
    bottom: 68px;
  }

  .first-guide-links {
    grid-template-columns: 1fr;
  }

  .first-guide-actions {
    justify-content: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .first-guide-fade-enter-active,
  .first-guide-fade-leave-active {
    transition: none;
  }
}
</style>
