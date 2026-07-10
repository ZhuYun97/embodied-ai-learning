<script setup>
import { withBase } from 'vitepress'

const REPO = 'https://github.com/ZhuYun97/embodied-ai-learning'

const importance = [
  { label: '重磅', cls: 'hot', desc: '巨额融资、IPO、顶会最佳论文、旗舰产品与战略合作' },
  { label: '重要', cls: 'major', desc: 'SOTA 论文、主流模型、B+ 轮融资与重要数据集' },
  { label: '关注', cls: 'normal', desc: '常规论文、中小额融资与一般产品迭代' },
]

const credibility = [
  { label: '已核', cls: 'ok', desc: '官方发布、权威媒体、会议官网或交易所公告' },
  { label: '待核', cls: 'todo', desc: '社交媒体传播、二手转述或尚未获得独立印证的消息' },
]
</script>

<template>
  <footer class="news-footer">
    <details class="nf-details">
      <summary class="nf-summary">
        <span class="nf-summary__copy">
          <span class="nf-eyebrow">READING NOTES · 阅读说明</span>
          <strong>如何理解本页内容</strong>
        </span>
        <span class="nf-summary__meta">收录范围 · 可信度 · 数据说明</span>
        <span class="nf-chevron" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
          </svg>
        </span>
      </summary>

      <div class="nf-body">
        <section class="nf-section" aria-labelledby="nf-scope-title">
          <header class="nf-section__head">
            <span aria-hidden="true">01</span>
            <h2 id="nf-scope-title">收录范围</h2>
          </header>
          <p>
            聚焦具身智能领域的 VLA、世界动作模型、人形机器人与通用机器人基础模型，兼顾研究进展、产品发布和产业动态。
          </p>
          <nav class="nf-links" aria-label="相关内容">
            <a :href="withBase('/vla/papers/timeline')">发展时间线</a>
            <a :href="withBase('/vla/changelog')">本站更新日志</a>
          </nav>
        </section>

        <section class="nf-section" aria-labelledby="nf-trust-title">
          <header class="nf-section__head">
            <span aria-hidden="true">02</span>
            <h2 id="nf-trust-title">可信度</h2>
          </header>
          <p>每条消息尽量交叉核查，并明确区分已确认信息与仍需验证的线索。</p>
          <ul class="nf-legend" aria-label="可信度图例">
            <li v-for="item in credibility" :key="item.label">
              <span :class="['nf-status', `nf-status--${item.cls}`]">{{ item.label }}</span>
              <span>{{ item.desc }}</span>
            </li>
          </ul>
        </section>

        <section class="nf-section" aria-labelledby="nf-data-title">
          <header class="nf-section__head">
            <span aria-hidden="true">03</span>
            <h2 id="nf-data-title">数据说明</h2>
          </header>
          <p>列表按重要程度和时间倒序组织，重要程度用于辅助浏览，不代表投资或研究建议。</p>
          <ul class="nf-scale" aria-label="重要程度图例">
            <li v-for="item in importance" :key="item.label">
              <span :class="['nf-level', `nf-level--${item.cls}`]">{{ item.label }}</span>
              <span>{{ item.desc }}</span>
            </li>
          </ul>
          <p class="nf-automation">
            页面由
            <a :href="`${REPO}/blob/main/.github/workflows/news-bot.yml`" target="_blank" rel="noopener noreferrer">news-bot</a>
            每日更新；标注“自动采集”的条目由机器人添加。发现错误可前往
            <a :href="`${REPO}/issues`" target="_blank" rel="noopener noreferrer">Issue</a>
            反馈，也欢迎在
            <a :href="REPO" target="_blank" rel="noopener noreferrer">GitHub</a>
            提交可核实的线索。
          </p>
        </section>
      </div>
    </details>
  </footer>
</template>

<style scoped>
.news-footer {
  margin-top: 48px;
  color: var(--vp-c-text-1);
}

.nf-details {
  overflow: clip;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 72%, transparent);
}

.nf-summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 34px;
  gap: 18px;
  align-items: center;
  padding: 17px 18px 17px 20px;
  cursor: pointer;
  list-style: none;
  transition: background-color 160ms ease;
}

.nf-summary::-webkit-details-marker {
  display: none;
}

.nf-summary:hover {
  background: color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent);
}

.nf-summary:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -3px;
  border-radius: 12px;
}

.nf-summary__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.nf-eyebrow {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.12em;
  color: var(--vp-c-brand-1);
}

.nf-summary strong {
  font-size: 0.95rem;
  font-weight: 650;
  line-height: 1.45;
  letter-spacing: -0.01em;
}

.nf-summary__meta {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.nf-chevron {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
}

.nf-chevron svg {
  transition: transform 180ms ease;
}

.nf-details[open] .nf-summary {
  border-bottom: 1px solid var(--vp-c-divider);
}

.nf-details[open] .nf-chevron svg {
  transform: rotate(180deg);
}

.nf-body {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 26px 24px 28px;
}

.nf-section {
  min-width: 0;
  padding: 0 24px;
}

.nf-section:first-child {
  padding-left: 0;
}

.nf-section:last-child {
  padding-right: 0;
}

.nf-section + .nf-section {
  border-left: 1px solid var(--vp-c-divider);
}

.nf-section__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.nf-section__head > span {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.66rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.nf-section h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 680;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.nf-section p {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.72;
  color: var(--vp-c-text-2);
}

.nf-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 15px;
}

.nf-links a,
.nf-automation a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
  text-underline-offset: 3px;
}

.nf-links a:hover,
.nf-automation a:hover {
  text-decoration: underline;
}

.nf-links a::after {
  content: '↗';
  margin-left: 4px;
  font-size: 0.72em;
}

.nf-legend,
.nf-scale {
  display: grid;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.nf-legend li,
.nf-scale li {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 9px;
  align-items: start;
  font-size: 0.73rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.nf-status,
.nf-level {
  display: inline-flex;
  min-height: 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1.35;
  white-space: nowrap;
  background: var(--vp-c-bg);
}

.nf-status--ok {
  border-color: color-mix(in srgb, #16a34a 34%, var(--vp-c-divider));
  color: #16803d;
}

.nf-status--todo {
  border-color: color-mix(in srgb, #d97706 34%, var(--vp-c-divider));
  color: #b25f08;
}

.nf-level--hot {
  border-color: color-mix(in srgb, #dc2626 32%, var(--vp-c-divider));
  color: #c82b2b;
}

.nf-level--major {
  border-color: color-mix(in srgb, #d97706 32%, var(--vp-c-divider));
  color: #ad5e09;
}

.nf-level--normal {
  color: var(--vp-c-text-2);
}

.nf-automation {
  margin-top: 16px !important;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 14px;
}

:global(.dark) .nf-status--ok {
  color: #70c98b;
}

:global(.dark) .nf-status--todo {
  color: #e1a04e;
}

:global(.dark) .nf-level--hot {
  color: #e87979;
}

:global(.dark) .nf-level--major {
  color: #dca35c;
}

@media (max-width: 880px) {
  .nf-body {
    grid-template-columns: 1fr;
    padding: 4px 20px;
  }

  .nf-section,
  .nf-section:first-child,
  .nf-section:last-child {
    padding: 22px 0;
  }

  .nf-section + .nf-section {
    border-top: 1px solid var(--vp-c-divider);
    border-left: 0;
  }
}

@media (max-width: 560px) {
  .news-footer {
    margin-top: 36px;
  }

  .nf-summary {
    grid-template-columns: minmax(0, 1fr) 34px;
    gap: 12px;
    padding: 15px 14px 15px 16px;
  }

  .nf-summary__meta {
    display: none;
  }

  .nf-body {
    padding-inline: 16px;
  }

  .nf-eyebrow {
    font-size: 0.61rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nf-summary,
  .nf-chevron svg {
    transition: none;
  }
}
</style>
