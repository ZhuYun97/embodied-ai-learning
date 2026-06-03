<script setup>
import { withBase } from 'vitepress'

const REPO = 'https://github.com/ZhuYun97/embodied-ai-learning'

const importance = [
  { icon: '🔥', label: '重磅', cls: 'hot', desc: '巨额融资 · IPO · 顶会最佳论文 · 旗舰产品 · 战略合作' },
  { icon: '⭐', label: '重要', cls: 'major', desc: 'SOTA 论文 · 主流模型 · B+ 轮融资 · 重要数据集' },
  { icon: '📌', label: '关注', cls: 'normal', desc: '常规论文 · 中小额融资 · 一般迭代' },
]
const credibility = [
  { icon: '✅', label: '已核', cls: 'ok', desc: '官方发布 · 权威媒体 · 会议官网 · 交易所公告' },
  { icon: '⚠️', label: '待核', cls: 'todo', desc: '社媒传播 · 转述 · 传闻' },
]
</script>

<template>
  <footer class="news-footer">
    <!-- 图例:HUD 面板 -->
    <section class="nf-card nf-legend">
      <span class="nf-corners" aria-hidden="true"></span>
      <div class="nf-group">
        <span class="nf-key">重要程度</span>
        <ul class="nf-items">
          <li v-for="it in importance" :key="it.label">
            <span :class="['nf-chip', `nf-chip--${it.cls}`]">{{ it.icon }} {{ it.label }}</span>
            <span class="nf-desc">{{ it.desc }}</span>
          </li>
        </ul>
      </div>
      <div class="nf-divider" aria-hidden="true"></div>
      <div class="nf-group">
        <span class="nf-key">可信度</span>
        <ul class="nf-items">
          <li v-for="it in credibility" :key="it.label">
            <span :class="['nf-chip', `nf-chip--${it.cls}`]">{{ it.icon }} {{ it.label }}</span>
            <span class="nf-desc">{{ it.desc }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 关于本页 -->
    <section class="nf-notes">
      <div class="nf-note">
        <span class="nf-note__ic">🎯</span>
        <p><strong>范围</strong> 聚焦具身智能(VLA、WAM、人形 / 通用机器人基础模型)。学术里程碑见 <a :href="withBase('/vla/papers/timeline')">发展时间线</a>,本站更新见 <a :href="withBase('/vla/changelog')">更新日志</a>。</p>
      </div>
      <div class="nf-note">
        <span class="nf-note__ic">📋</span>
        <p><strong>声明</strong> 多源核查、不编造来源,按 🔥→⭐→📌 与时间倒序排列。欢迎在 <a :href="REPO" target="_blank" rel="noopener">GitHub</a> 提交线索(附可核实来源)。</p>
      </div>
      <div class="nf-note nf-note--bot">
        <span class="nf-note__ic">🤖</span>
        <p><strong>自动维护</strong> 本页由 <a :href="`${REPO}/blob/main/.github/workflows/news-bot.yml`" target="_blank" rel="noopener">news-bot</a> 每日定时(Claude API + web_search / web_fetch)自动更新;带 🤖 的条目为机器人添加,如发现错误请提 <a :href="`${REPO}/issues`" target="_blank" rel="noopener">Issue</a>。</p>
      </div>
    </section>
  </footer>
</template>

<style scoped>
.news-footer {
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid var(--vp-c-divider);
}

/* ============================================================
   图例:HUD 面板 —— 玻璃 + 青光描边 + 电路网格 + 角标 + 发光发丝
   ============================================================ */
.nf-card {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 30px;
  padding: 24px 26px;
  border: 1px solid rgba(34, 211, 238, 0.24);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(34, 211, 238, 0.05), transparent 42%),
    var(--tech-card-bg, var(--vp-c-bg-soft));
  box-shadow:
    inset 0 0 24px rgba(34, 211, 238, 0.05),
    0 10px 34px -18px rgba(37, 99, 235, 0.35);
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  overflow: hidden;
}
/* 顶部发光扫描线 */
.nf-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2563eb 18%, #22d3ee 50%, #8b5cf6 82%, transparent);
  box-shadow: 0 0 14px rgba(34, 211, 238, 0.7);
  z-index: 2;
}
/* 电路网格(顶部渐隐) */
.nf-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(34, 211, 238, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(34, 211, 238, 0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 0%, #000 10%, transparent 78%);
  mask-image: radial-gradient(ellipse 85% 75% at 50% 0%, #000 10%, transparent 78%);
}
.nf-card > .nf-group,
.nf-card > .nf-divider { position: relative; z-index: 1; }
/* HUD 角标(左上 + 右下) */
.nf-corners { position: absolute; inset: 8px; z-index: 1; pointer-events: none; }
.nf-corners::before,
.nf-corners::after {
  content: '';
  position: absolute;
  width: 14px; height: 14px;
  border: 1.5px solid rgba(34, 211, 238, 0.55);
}
.nf-corners::before { top: 0; left: 0; border-right: 0; border-bottom: 0; border-radius: 3px 0 0 0; }
.nf-corners::after { right: 0; bottom: 0; border-left: 0; border-top: 0; border-radius: 0 0 3px 0; }

.nf-group { flex: 1 1 320px; min-width: 0; }
.nf-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}
.nf-key::before { content: '❯'; color: #06b6d4; font-weight: 700; }
.nf-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.nf-items li { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.nf-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent, rgba(34, 211, 238, 0.3), transparent);
}

.nf-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 11px;
  border-radius: 999px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  border: 1px solid transparent;
}
.nf-chip--hot { background: rgba(239, 68, 68, 0.1); color: #dc2626; border-color: rgba(239, 68, 68, 0.32); box-shadow: 0 0 12px -3px rgba(239, 68, 68, 0.5); }
.nf-chip--major { background: rgba(245, 158, 11, 0.12); color: #d97706; border-color: rgba(245, 158, 11, 0.34); box-shadow: 0 0 12px -3px rgba(245, 158, 11, 0.5); }
.nf-chip--normal { background: rgba(100, 116, 139, 0.1); color: #475569; border-color: rgba(100, 116, 139, 0.3); }
.nf-chip--ok { background: rgba(34, 197, 94, 0.1); color: #16a34a; border-color: rgba(34, 197, 94, 0.32); box-shadow: 0 0 12px -3px rgba(34, 197, 94, 0.5); }
.nf-chip--todo { background: rgba(234, 179, 8, 0.12); color: #ca8a04; border-color: rgba(234, 179, 8, 0.34); box-shadow: 0 0 12px -3px rgba(234, 179, 8, 0.5); }
.nf-desc { font-size: 0.82rem; color: var(--vp-c-text-2); line-height: 1.5; }

/* ============================================================
   关于本页:HUD 信息条
   ============================================================ */
.nf-notes { display: grid; gap: 10px; margin-top: 16px; }
.nf-note {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
/* 左侧青色光条 */
.nf-note::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #22d3ee, #2563eb);
  opacity: 0.5;
  transition: opacity 0.2s, box-shadow 0.2s;
}
.nf-note:hover {
  border-color: rgba(34, 211, 238, 0.35);
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.12);
}
.nf-note:hover::before { opacity: 1; box-shadow: 0 0 10px rgba(34, 211, 238, 0.7); }
.nf-note__ic {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px; height: 30px;
  font-size: 0.95rem;
  border-radius: 9px;
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: inset 0 0 10px rgba(34, 211, 238, 0.08);
}
.nf-note p { margin: 0; font-size: 0.84rem; line-height: 1.65; color: var(--vp-c-text-2); }
.nf-note p strong { color: var(--vp-c-text-1); font-weight: 700; margin-right: 2px; }
.nf-note a { color: var(--vp-c-brand-1); text-decoration: none; font-weight: 500; }
.nf-note a:hover { text-decoration: underline; }
.nf-note--bot { background: var(--vp-c-brand-softer); }
.nf-note--bot::before { background: linear-gradient(180deg, #60a5fa, #8b5cf6); opacity: 0.7; }
.nf-note--bot .nf-note__ic { background: rgba(37, 99, 235, 0.12); border-color: rgba(37, 99, 235, 0.2); }
.nf-note--bot p { font-family: var(--vp-font-family-mono, monospace); font-size: 0.8rem; }

@media (max-width: 640px) {
  .nf-divider { display: none; }
  .nf-card { gap: 18px; padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .nf-note, .nf-note::before { transition: none; }
}

/* ============================================================
   暗色:深空 + 强霓虹
   ============================================================ */
:global(.dark) .nf-card {
  border-color: rgba(34, 211, 238, 0.28);
  background:
    linear-gradient(180deg, rgba(34, 211, 238, 0.07), transparent 42%),
    var(--tech-card-bg, var(--vp-c-bg-soft));
  box-shadow:
    inset 0 0 30px rgba(34, 211, 238, 0.07),
    0 12px 40px -18px rgba(34, 211, 238, 0.3);
}
:global(.dark) .nf-card::after {
  background-image:
    linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px);
}
:global(.dark) .nf-chip--hot { background: rgba(239, 68, 68, 0.18); color: #f87171; box-shadow: 0 0 14px -3px rgba(248, 113, 113, 0.6); }
:global(.dark) .nf-chip--major { background: rgba(245, 158, 11, 0.18); color: #fbbf24; box-shadow: 0 0 14px -3px rgba(251, 191, 36, 0.6); }
:global(.dark) .nf-chip--normal { background: rgba(148, 163, 184, 0.16); color: #cbd5e1; }
:global(.dark) .nf-chip--ok { background: rgba(34, 197, 94, 0.18); color: #4ade80; box-shadow: 0 0 14px -3px rgba(74, 222, 128, 0.6); }
:global(.dark) .nf-chip--todo { background: rgba(234, 179, 8, 0.18); color: #fde047; box-shadow: 0 0 14px -3px rgba(253, 224, 71, 0.6); }

/* ============================================================
   档案皮肤:暖纸 + 氧化红角标(去青光)
   ============================================================ */
:global(html.skin-archive) .nf-card,
:global(html.skin-archive) .nf-note { background: #F5F1E8; border-color: #D4C4A8; box-shadow: none; }
:global(html.skin-archive) .nf-card {
  border-color: rgba(154, 51, 36, 0.25);
  background: linear-gradient(180deg, rgba(154, 51, 36, 0.04), transparent 42%), #F5F1E8;
}
:global(html.skin-archive) .nf-card::before { background: linear-gradient(90deg, transparent, #9A3324 30%, #C97B5A 70%, transparent); box-shadow: none; }
:global(html.skin-archive) .nf-card::after,
:global(html.skin-archive) .nf-chip { box-shadow: none; }
:global(html.skin-archive) .nf-corners::before,
:global(html.skin-archive) .nf-corners::after { border-color: rgba(154, 51, 36, 0.5); }
:global(html.skin-archive) .nf-key { color: #9A3324; }
:global(html.skin-archive) .nf-key::before { color: #C97B5A; }
:global(html.skin-archive) .nf-divider { background: linear-gradient(180deg, transparent, rgba(154, 51, 36, 0.3), transparent); }
:global(html.skin-archive) .nf-note::before { background: linear-gradient(180deg, #C97B5A, #9A3324); }
:global(html.skin-archive) .nf-note--bot { background: rgba(154, 51, 36, 0.06); }
:global(html.skin-archive) .nf-note a { color: #9A3324; }
</style>
