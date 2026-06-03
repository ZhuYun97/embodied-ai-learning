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
    <!-- 图例 -->
    <section class="nf-card nf-legend">
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

/* ===== 图例卡:玻璃拟态 + 顶部三色发丝(呼应工具栏/卡片) ===== */
.nf-card {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 28px;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--tech-card-bg, var(--vp-c-bg-soft));
  backdrop-filter: blur(10px) saturate(1.1);
  -webkit-backdrop-filter: blur(10px) saturate(1.1);
  overflow: hidden;
}
.nf-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2563eb, #22d3ee, #8b5cf6);
  opacity: 0.7;
}
.nf-group { flex: 1 1 320px; min-width: 0; }
.nf-key {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.nf-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.nf-items li { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.nf-divider { width: 1px; align-self: stretch; background: var(--vp-c-divider); }

.nf-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.nf-chip--hot { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
.nf-chip--major { background: rgba(245, 158, 11, 0.14); color: #d97706; }
.nf-chip--normal { background: rgba(100, 116, 139, 0.12); color: #475569; }
.nf-chip--ok { background: rgba(34, 197, 94, 0.12); color: #16a34a; }
.nf-chip--todo { background: rgba(234, 179, 8, 0.14); color: #ca8a04; }
.nf-desc { font-size: 0.82rem; color: var(--vp-c-text-2); line-height: 1.5; }

/* ===== 关于本页:三条说明,左侧图标圆点 ===== */
.nf-notes {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
.nf-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, background 0.2s;
}
.nf-note:hover { border-color: var(--vp-c-brand-soft); }
.nf-note__ic {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px; height: 30px;
  font-size: 0.95rem;
  border-radius: 9px;
  background: var(--vp-c-default-soft);
}
.nf-note p {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}
.nf-note p strong { color: var(--vp-c-text-1); font-weight: 700; margin-right: 2px; }
.nf-note a { color: var(--vp-c-brand-1); text-decoration: none; font-weight: 500; }
.nf-note a:hover { text-decoration: underline; }
.nf-note--bot { background: var(--vp-c-brand-softer); border-color: transparent; }
.nf-note--bot .nf-note__ic { background: rgba(37, 99, 235, 0.12); }

@media (max-width: 640px) {
  .nf-divider { display: none; }
  .nf-card { gap: 16px; }
}

/* ===== 暗色:玻璃更通透,色块更亮 ===== */
:global(.dark) .nf-chip--hot { background: rgba(239, 68, 68, 0.2); color: #f87171; }
:global(.dark) .nf-chip--major { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
:global(.dark) .nf-chip--normal { background: rgba(148, 163, 184, 0.18); color: #cbd5e1; }
:global(.dark) .nf-chip--ok { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
:global(.dark) .nf-chip--todo { background: rgba(234, 179, 8, 0.2); color: #fde047; }

/* ===== 档案皮肤:暖纸 + 氧化红 + 衬线 ===== */
:global(html.skin-archive) .nf-card,
:global(html.skin-archive) .nf-note { background: #F5F1E8; border-color: #D4C4A8; }
:global(html.skin-archive) .nf-card::before { background: linear-gradient(90deg, #9A3324, #C97B5A); }
:global(html.skin-archive) .nf-note--bot { background: rgba(154, 51, 36, 0.06); }
:global(html.skin-archive) .nf-note a { color: #9A3324; }
</style>
