<script setup>
// 小红书实采导航板:全量 169 条按六类筛选 + 标题/作者搜索 + 按快照点赞排序。
// 数据 = xhs-data.json(由 SRC .omc/research/xhs-build-data.py 从实采 merged.json 烘焙,
// 分类规则与 2026-06-12 首版表格逐条一致);本组件零主张,只做既有数据的呈现与筛选。
import { ref, computed, watch } from 'vue'
import data from './xhs-data.json'

const PAGE = 30
const CAT_SHORT = {
  edu: '学习教程',
  tech: '技术解读',
  job: '求职招聘',
  industry: '行业观察',
  demo: '实测现场',
  misc: '综合观察',
}
const CAT_EMOJI = Object.fromEntries(data.cats.map((c) => [c.key, c.emoji]))

const activeCat = ref('all')
const query = ref('')
const shown = ref(PAGE)

const counts = computed(() => {
  const m = { all: data.posts.length }
  for (const p of data.posts) m[p.cat] = (m[p.cat] || 0) + 1
  return m
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return data.posts.filter(
    (p) =>
      (activeCat.value === 'all' || p.cat === activeCat.value) &&
      (!q || p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
  )
})
const visible = computed(() => filtered.value.slice(0, shown.value))
const remaining = computed(() => Math.max(0, filtered.value.length - shown.value))

function pickCat(k) {
  activeCat.value = k
  shown.value = PAGE
}
watch(query, () => (shown.value = PAGE))

const fmtLikes = (n) => (n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, '') + '万' : String(n))
const TABS = computed(() => [
  { key: 'all', emoji: '⊕', label: '全部' },
  ...data.cats.map((c) => ({ key: c.key, emoji: c.emoji, label: CAT_SHORT[c.key] })),
])
</script>

<template>
  <div class="xhs-board">
    <!-- HUD 口径条:全部为真实采集元数据,非装饰假数 -->
    <div class="xhs-hud" role="note" aria-label="采集口径">
      <span class="xhs-hud__dot" aria-hidden="true"></span>
      <span class="xhs-hud__line">
        SNAPSHOT {{ data.snapshot }} · {{ data.rawCards }} 卡 → {{ data.posts.length }} 条去重 · 按快照点赞排序
      </span>
      <span class="xhs-hud__queries">
        <i class="xhs-hud__qlabel">检索</i>
        <em v-for="q in data.queries" :key="q" class="xhs-hud__q">{{ q }}</em>
      </span>
    </div>

    <!-- 工具栏:分类筛选 + 搜索(粘性) -->
    <div class="xhs-toolbar">
      <div class="xhs-tabs" role="group" aria-label="按分类筛选">
        <button
          v-for="t in TABS"
          :key="t.key"
          type="button"
          class="xhs-tab"
          :class="{ 'is-on': activeCat === t.key }"
          :style="{ '--cat-c': t.key === 'all' ? 'var(--vp-c-brand-1)' : `var(--c-${t.key})` }"
          :aria-pressed="String(activeCat === t.key)"
          @click="pickCat(t.key)"
        >
          <span class="xhs-tab__emoji" aria-hidden="true">{{ t.emoji }}</span>
          <span class="xhs-tab__label">{{ t.label }}</span>
          <span class="xhs-tab__n">{{ counts[t.key] || 0 }}</span>
        </button>
      </div>
      <label class="xhs-search">
        <span class="xhs-search__prompt" aria-hidden="true">&gt;</span>
        <input
          v-model="query"
          type="search"
          placeholder="搜标题 / 作者…"
          aria-label="搜索帖子标题或作者"
        />
      </label>
    </div>

    <!-- 卡片墙 -->
    <div v-if="visible.length" :key="activeCat + '|' + query" class="xhs-grid">
      <a
        v-for="(p, i) in visible"
        :key="p.id"
        class="xhs-card"
        :style="{ '--cat-c': `var(--c-${p.cat})`, '--i': i % 12 }"
        :href="`https://www.xiaohongshu.com/explore/${p.id}`"
        target="_blank"
        rel="noopener"
        :title="p.title"
      >
        <span class="xhs-card__top">
          <span class="xhs-card__cat">
            <i aria-hidden="true">{{ CAT_EMOJI[p.cat] }}</i>{{ CAT_SHORT[p.cat] }}
          </span>
          <span v-if="i < 3 && !query" class="xhs-card__rank" :title="`当前视图按赞第 ${i + 1}`">#0{{ i + 1 }}</span>
          <span class="xhs-card__ext" aria-hidden="true">↗</span>
        </span>
        <span class="xhs-card__title">{{ p.title }}</span>
        <span class="xhs-card__meta">
          <span class="xhs-card__author">{{ p.author }}</span>
          <span class="xhs-card__likes" :title="`快照点赞 ${p.likes}`">
            <i aria-hidden="true">♥</i>{{ fmtLikes(p.likes) }}<span class="sr-only"> 赞</span>
          </span>
        </span>
      </a>
    </div>

    <!-- 空态 -->
    <div v-else class="xhs-empty" role="status">
      <span class="xhs-empty__sign" aria-hidden="true">∅</span>
      <p>没有匹配「{{ query }}」的帖子 — 换个词,或清掉筛选再试。</p>
      <button type="button" class="xhs-empty__reset" @click="query = ''; pickCat('all')">清除筛选</button>
    </div>

    <!-- 载入更多 -->
    <div v-if="remaining" class="xhs-more">
      <button type="button" @click="shown += PAGE">
        载入更多 <span class="xhs-more__n">+{{ Math.min(PAGE, remaining) }}</span>(还剩 {{ remaining }} 条)
      </button>
    </div>

    <p class="xhs-footnote">♥ 为 {{ data.snapshot }} 快照赞数,非实时;口径详见页首「读表口径」。</p>
  </div>
</template>

<style>
/* 本页加宽(非 scoped::has 仅命中含导航板的文档页);右侧大纲已由 frontmatter aside:false 关闭 */
.VPDoc:has(.xhs-board) .content-container { max-width: 1080px !important; }
</style>

<style scoped>
.xhs-board {
  /* 六类色 + 点赞玫红(浅色取深、深色取亮,保证两种皮肤可读) */
  --c-edu: #059669;
  --c-tech: #0e7fa8;
  --c-job: #b45309;
  --c-industry: #2563eb;
  --c-demo: #7c3aed;
  --c-misc: #64748b;
  --c-like: #e11d48;
  margin-top: 12px;
}
.dark .xhs-board,
:global(.dark) .xhs-board {
  --c-edu: #34d399;
  --c-tech: #22d3ee;
  --c-job: #fbbf24;
  --c-industry: #60a5fa;
  --c-demo: #a78bfa;
  --c-misc: #94a3b8;
  --c-like: #fb7185;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ---------- HUD 口径条 ---------- */
.xhs-hud {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  padding: 9px 14px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 26%, var(--vp-c-divider));
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, var(--vp-c-bg-soft));
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
}
.xhs-hud__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 8px color-mix(in srgb, var(--vp-c-brand-1) 70%, transparent);
  flex: none;
}
.xhs-hud__line { font-weight: 600; color: var(--vp-c-text-1); }
.xhs-hud__queries {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}
.xhs-hud__qlabel { font-style: normal; opacity: 0.7; }
.xhs-hud__q {
  font-style: normal;
  padding: 1px 7px;
  border-radius: 99px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-size: 10.5px;
}

/* ---------- 工具栏(粘性) ---------- */
.xhs-toolbar {
  position: sticky;
  top: calc(var(--vp-nav-height) + 10px);
  z-index: 12;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin: 14px 0 16px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.xhs-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  flex: 1 1 420px;
  min-width: 0;
}
.xhs-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, color 0.18s, transform 0.12s;
}
.xhs-tab:hover {
  border-color: color-mix(in srgb, var(--cat-c) 55%, var(--vp-c-divider));
  color: var(--vp-c-text-1);
}
.xhs-tab:active { transform: scale(0.97); }
.xhs-tab.is-on {
  border-color: color-mix(in srgb, var(--cat-c) 65%, transparent);
  background: color-mix(in srgb, var(--cat-c) 12%, var(--vp-c-bg-soft));
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.xhs-tab__emoji { font-size: 12px; }
.xhs-tab__n {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 99px;
  background: color-mix(in srgb, var(--cat-c) 16%, transparent);
  color: color-mix(in srgb, var(--cat-c) 78%, var(--vp-c-text-1));
}
.xhs-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 1 185px;
  min-width: 150px;
  padding: 6px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.xhs-search:focus-within {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 60%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent);
}
.xhs-search__prompt {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
.xhs-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-family: inherit;
}
.xhs-search input::placeholder { color: var(--vp-c-text-3); }

/* ---------- 卡片墙 ---------- */
.xhs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(244px, 1fr));
  gap: 12px;
}
.xhs-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 13px 14px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 11px;
  background: var(--vp-c-bg-soft);
  text-decoration: none !important;
  color: var(--vp-c-text-1);
  overflow: hidden;
  transition: transform 0.16s, border-color 0.16s, box-shadow 0.16s;
}
.xhs-card::before {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--cat-c), transparent 72%);
  opacity: 0.55;
}
.xhs-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--cat-c) 55%, var(--vp-c-divider));
  box-shadow: 0 6px 22px color-mix(in srgb, var(--cat-c) 16%, transparent);
}
.xhs-card__top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.xhs-card__cat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: color-mix(in srgb, var(--cat-c) 80%, var(--vp-c-text-1));
}
.xhs-card__cat i { font-style: normal; font-size: 11px; }
.xhs-card__rank {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--cat-c) 45%, transparent);
  color: color-mix(in srgb, var(--cat-c) 80%, var(--vp-c-text-1));
}
.xhs-card__ext {
  margin-left: auto;
  font-size: 12px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transform: translate(-2px, 2px);
  transition: opacity 0.16s, transform 0.16s;
}
.xhs-card:hover .xhs-card__ext { opacity: 1; transform: none; }
.xhs-card__title {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(13.5px * 1.5 * 2);
}
.xhs-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  font-size: 11.5px;
  color: var(--vp-c-text-2);
}
.xhs-card__author {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.xhs-card__likes {
  margin-left: auto;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-like);
}
.xhs-card__likes i {
  font-style: normal;
  font-size: 11px;
  transition: transform 0.16s;
}
.xhs-card:hover .xhs-card__likes i { transform: scale(1.25); }

/* ---------- 空态 / 载入更多 / 脚注 ---------- */
.xhs-empty {
  padding: 44px 16px;
  text-align: center;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
}
.xhs-empty__sign {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 26px;
  margin-bottom: 6px;
  color: var(--vp-c-text-3);
}
.xhs-empty p { margin: 0 0 12px; font-size: 13px; }
.xhs-empty__reset {
  padding: 5px 16px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
  border-radius: 99px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
  color: var(--vp-c-brand-1);
  font-size: 12.5px;
  cursor: pointer;
  transition: background 0.18s;
}
.xhs-empty__reset:hover { background: color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent); }
.xhs-more { text-align: center; margin-top: 18px; }
.xhs-more button {
  padding: 7px 22px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 38%, var(--vp-c-divider));
  border-radius: 99px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s, transform 0.12s;
}
.xhs-more button:hover {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg-soft));
}
.xhs-more button:active { transform: scale(0.97); }
.xhs-more__n {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  color: var(--vp-c-brand-1);
}
.xhs-footnote {
  margin: 16px 0 0;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

/* ---------- 入场动效(reduced-motion 全关) ---------- */
@media (prefers-reduced-motion: no-preference) {
  .xhs-card {
    animation: xhs-in 0.34s cubic-bezier(0.22, 0.8, 0.36, 1) both;
    animation-delay: calc(min(var(--i), 11) * 26ms);
  }
  @keyframes xhs-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }
}

@media (max-width: 640px) {
  .xhs-toolbar { position: static; }
  .xhs-grid { grid-template-columns: 1fr 1fr; gap: 9px; }
  .xhs-card { padding: 11px 12px 10px; }
  .xhs-card__title { font-size: 12.5px; }
}
@media (max-width: 430px) {
  .xhs-grid { grid-template-columns: 1fr; }
}
</style>
