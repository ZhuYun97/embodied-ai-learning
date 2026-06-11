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
    <!-- 图例:深空 HUD 面板 -->
    <section class="nf-card nf-legend">
      <span class="nf-corners" aria-hidden="true"></span>
      <span class="nf-tag" aria-hidden="true">// LEGEND</span>
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
.news-footer { margin-top: 44px; }

/* ============================================================
   图例:深空 HUD 控制台(无论亮/暗都是深色面板,与生态图谱呼应)
   ============================================================ */
.nf-card {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 20px 36px;
  padding: 28px 28px 26px;
  border: 1px solid rgba(34, 211, 238, 0.32);
  border-radius: 16px;
  background:
    radial-gradient(ellipse 90% 70% at 50% -10%, rgba(34, 211, 238, 0.12), transparent 60%),
    radial-gradient(ellipse 70% 90% at 100% 100%, rgba(124, 58, 237, 0.12), transparent 60%),
    linear-gradient(180deg, #0c1530 0%, #070b1c 100%);
  box-shadow:
    inset 0 0 40px rgba(34, 211, 238, 0.06),
    0 16px 46px -20px rgba(13, 30, 80, 0.8);
  overflow: hidden;
}
/* 星点纹理 */
.nf-card > .nf-group,
.nf-card > .nf-divider { position: relative; z-index: 1; }
/* 顶部发光扫描线 */
.nf-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2563eb 16%, #22d3ee 50%, #a855f7 84%, transparent);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.9);
  z-index: 3;
}
/* 电路网格 */
.nf-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, #000 12%, transparent 80%);
  mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, #000 12%, transparent 80%);
}
/* HUD 角标(四角) */
.nf-corners { position: absolute; inset: 9px; z-index: 2; pointer-events: none; }
.nf-corners::before,
.nf-corners::after {
  content: '';
  position: absolute;
  width: 16px; height: 16px;
  border: 1.5px solid rgba(56, 224, 255, 0.75);
  filter: drop-shadow(0 0 3px rgba(56, 224, 255, 0.6));
}
.nf-corners::before { top: 0; left: 0; border-right: 0; border-bottom: 0; border-radius: 4px 0 0 0; }
.nf-corners::after { right: 0; bottom: 0; border-left: 0; border-top: 0; border-radius: 0 0 4px 0; }
/* 角落系统标签 */
.nf-tag {
  position: absolute;
  top: 11px; right: 16px;
  z-index: 2;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  color: rgba(56, 224, 255, 0.6);
}

.nf-group { flex: 1 1 320px; min-width: 0; }
.nf-key {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 15px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #38e0ff;
  text-shadow: 0 0 12px rgba(56, 224, 255, 0.5);
}
.nf-key::before { content: '❯'; color: #38e0ff; }
.nf-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
.nf-items li { display: flex; align-items: center; gap: 11px; flex-wrap: wrap; }
.nf-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent, rgba(56, 189, 248, 0.4), transparent);
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.3);
}

.nf-chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid transparent;
}
.nf-chip--hot { background: rgba(239, 68, 68, 0.16); color: #fca5a5; border-color: rgba(239, 68, 68, 0.5); box-shadow: 0 0 14px -2px rgba(239, 68, 68, 0.7); }
.nf-chip--major { background: rgba(245, 158, 11, 0.16); color: #fcd34d; border-color: rgba(245, 158, 11, 0.5); box-shadow: 0 0 14px -2px rgba(245, 158, 11, 0.7); }
.nf-chip--normal { background: rgba(148, 163, 184, 0.16); color: #cbd5e1; border-color: rgba(148, 163, 184, 0.4); }
.nf-chip--ok { background: rgba(34, 197, 94, 0.16); color: #86efac; border-color: rgba(34, 197, 94, 0.5); box-shadow: 0 0 14px -2px rgba(34, 197, 94, 0.7); }
.nf-chip--todo { background: rgba(234, 179, 8, 0.16); color: #fde047; border-color: rgba(234, 179, 8, 0.5); box-shadow: 0 0 14px -2px rgba(234, 179, 8, 0.7); }
.nf-desc { font-size: 0.82rem; color: rgba(203, 213, 235, 0.72); line-height: 1.5; }

/* ============================================================
   关于本页:深空信息条
   ============================================================ */
.nf-notes { display: grid; gap: 11px; margin-top: 14px; }
.nf-note {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 14px 18px;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 13px;
  background: linear-gradient(180deg, #0b1228, #080d1e);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.nf-note::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2.5px;
  background: linear-gradient(180deg, #22d3ee, #2563eb);
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.6);
}
.nf-note:hover {
  border-color: rgba(56, 189, 248, 0.5);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.18), 0 10px 30px -16px rgba(34, 211, 238, 0.5);
}
.nf-note__ic {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 32px; height: 32px;
  font-size: 0.98rem;
  border-radius: 9px;
  background: rgba(34, 211, 238, 0.1);
  border: 1px solid rgba(34, 211, 238, 0.25);
  box-shadow: inset 0 0 12px rgba(34, 211, 238, 0.12);
}
.nf-note p { margin: 0; font-size: 0.84rem; line-height: 1.65; color: rgba(203, 213, 235, 0.8); }
.nf-note p strong { color: #eaf2ff; font-weight: 700; margin-right: 2px; }
.nf-note a { color: #5cc8ff; text-decoration: none; font-weight: 600; }
.nf-note a:hover { text-decoration: underline; text-shadow: 0 0 8px rgba(92, 200, 255, 0.5); }
.nf-note--bot { border-color: rgba(139, 92, 246, 0.28); }
.nf-note--bot::before { background: linear-gradient(180deg, #818cf8, #a855f7); box-shadow: 0 0 10px rgba(139, 92, 246, 0.6); }
.nf-note--bot .nf-note__ic { background: rgba(139, 92, 246, 0.14); border-color: rgba(139, 92, 246, 0.3); }
.nf-note--bot p { font-family: var(--vp-font-family-mono, monospace); font-size: 0.8rem; }

@media (max-width: 640px) {
  .nf-divider { display: none; }
  .nf-card { gap: 18px; padding: 22px 18px; }
  .nf-tag { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .nf-note { transition: none; }
}

</style>
