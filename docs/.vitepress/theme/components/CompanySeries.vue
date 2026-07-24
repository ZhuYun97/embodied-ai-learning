<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false,
  },
})

const series = [
  {
    id: 'alibaba',
    group: 'BIG TECH · CHINA',
    name: '阿里巴巴',
    unit: 'Qwen / DAMO',
    logo: '/logos/alibaba.png',
    accent: '#ff6a00',
    summary: '从统一 VLA、操作与导航执行器，延伸到具身大脑和自回归世界模型。',
    route: ['统一基座', '任务分支', '世界模型'],
    links: [
      { label: 'Qwen-VLA', href: '/vla/papers/qwen-vla', type: 'VLA' },
      { label: 'Qwen-Robot 导读', href: '/news/qwen-robot', type: '专题' },
      { label: 'Qwen-RobotManip', href: '/vla/papers/qwen-robotmanip', type: 'VLA' },
      { label: 'Qwen-RobotNav', href: '/vla/papers/qwen-robotnav', type: 'NAV' },
      { label: 'Qwen-RobotWorld', href: '/wam/papers/qwen-robotworld', type: 'WAM' },
      { label: 'RynnBrain', href: '/vla/papers/rynnbrain', type: 'S2' },
      { label: 'RynnVLA-001', href: '/vla/papers/rynnvla', type: 'VLA' },
      { label: 'WorldVLA', href: '/wam/papers/worldvla', type: 'WAM' },
      { label: 'RynnVLA-002', href: '/wam/papers/rynnvla-002', type: 'WAM' },
    ],
  },
  {
    id: 'nvidia',
    group: 'BIG TECH · GLOBAL',
    name: 'NVIDIA',
    unit: 'GR00T / Cosmos',
    logo: '/logos/nvidia.png',
    accent: '#76b900',
    summary: '沿双系统 VLA、隐式世界建模与全模态世界模型，搭建 Physical AI 底座。',
    route: ['GR00T N1', '隐式世界', 'WAM / Cosmos'],
    links: [
      { label: 'GR00T N1', href: '/vla/papers/groot-n1', type: 'VLA' },
      { label: 'FLARE', href: '/wam/papers/flare', type: 'WAM' },
      { label: 'GR00T N2', href: '/wam/papers/groot-n2', type: 'WAM' },
      { label: 'Cosmos 3', href: '/wam/papers/cosmos3', type: 'WORLD' },
    ],
  },
  {
    id: 'google',
    group: 'BIG TECH · GLOBAL',
    name: 'Google',
    unit: 'Robotics / DeepMind',
    logo: '/logos/deepmind.png',
    accent: '#4285f4',
    summary: '从规模化机器人 Transformer，到网络知识迁移，再到 Gemini 具身推理与控制。',
    route: ['RT-1', 'RT-2', 'Gemini Robotics'],
    links: [
      { label: 'RT-1', href: '/vla/papers/rt1', type: 'VLA' },
      { label: 'RT-2', href: '/vla/papers/rt2', type: 'VLA' },
      { label: 'Gemini Robotics', href: '/vla/papers/gemini-robotics', type: 'VLA' },
    ],
  },
  {
    id: 'bytedance',
    group: 'BIG TECH · CHINA',
    name: '字节跳动',
    unit: 'Seed · GR 系列',
    logo: '/logos/bytedance.png',
    accent: '#2f6bff',
    summary: '从早期视频生成预训练研究出发，转向通用 VLA，再扩展到双臂灵巧手系统。',
    route: ['视频预训', '通用 VLA', '灵巧操作'],
    links: [
      { label: 'GR-1 · 早期研究', href: '/wam/papers/gr-1', type: 'WAM ⚠' },
      { label: 'GR-3', href: '/vla/papers/gr-3', type: 'VLA' },
      { label: 'GR-Dexter', href: '/vla/papers/gr-dexter', type: 'DEX' },
    ],
  },
  {
    id: 'physical-intelligence',
    group: 'FRONTIER LAB',
    name: 'Physical Intelligence',
    unit: 'π 系列',
    logo: '/logos/pi.png',
    accent: '#8b5cf6',
    summary: '围绕流匹配动作专家持续演进：高频控制、开放世界、真机 RL 与可操控通才。',
    route: ['Flow VLA', '开放世界', '经验学习'],
    links: [
      { label: 'π0', href: '/vla/papers/pi0', type: 'VLA' },
      { label: 'π0-FAST', href: '/vla/papers/pi0-fast', type: 'TOKEN' },
      { label: 'π0.5', href: '/vla/papers/pi05', type: 'VLA' },
      { label: 'π0.6', href: '/vla/papers/pi06', type: 'RL' },
      { label: 'π0.7', href: '/vla/papers/pi07', type: 'VLA' },
      { label: 'Knowledge Insulation', href: '/vla/papers/knowledge-insulation', type: 'METHOD' },
      { label: 'RL Token', href: '/vla/papers/rl-token', type: 'RL' },
      { label: 'Steerable Policies', href: '/vla/papers/steerable-policies', type: 'JOINT' },
    ],
  },
  {
    id: 'agibot',
    group: 'EMBODIED COMPANY',
    name: '智元 AgiBot',
    unit: 'GO / Genie Envisioner',
    logo: '/logos/zhiyuan.png',
    accent: '#14b8a6',
    summary: '同时推进潜动作策略与视频世界平台，把策略、评估和仿真串成闭环。',
    route: ['潜动作', '世界基座', '闭环仿真'],
    links: [
      { label: 'GO-1', href: '/vla/papers/go-1', type: 'VLA' },
      { label: 'Genie Envisioner', href: '/wam/papers/genie-envisioner', type: 'WAM' },
      { label: 'GE-Sim 2.0', href: '/wam/papers/ge-sim-2', type: 'SIM' },
      { label: 'τ0-WM', href: '/wam/papers/tau0-wm', type: '联合' },
    ],
  },
  {
    id: 'x-square',
    group: 'EMBODIED COMPANY',
    name: '自变量 X²Robot',
    unit: 'WALL / X-Tokenizer',
    logo: '/logos/zibianliang.png',
    accent: '#06b6d4',
    summary: '从开放 VLA 到语义动作 tokenizer，形成离散监督与连续动作生成协同演进的路线。',
    route: ['开放 VLA', '混合动作头', '语义 tokenizer'],
    links: [
      { label: 'WALL-OSS', href: '/vla/papers/wall-oss', type: 'VLA' },
      { label: 'WALL-OSS-0.5', href: '/vla/papers/wall-oss-05', type: 'VLA' },
      { label: 'WALL-WM', href: '/wam/papers/wall-wm', type: 'WAM' },
      { label: 'X-Tokenizer', href: '/vla/papers/x-tokenizer', type: 'TOKEN' },
    ],
  },
  {
    id: 'gigaai',
    group: 'EMBODIED COMPANY',
    name: 'GigaAI',
    unit: 'GigaBrain / GigaWorld',
    logo: '/logos/gigaai.png',
    accent: '#f59e0b',
    summary: '让世界模型同时承担合成数据与强化学习环境，推动策略持续自改进。',
    route: ['世界生成', '策略训练', '真机 RL'],
    links: [
      { label: 'GigaBrain-0.5M*', href: '/vla/papers/gigabrain-05m', type: 'VLA' },
      { label: 'GigaWorld-Policy', href: '/wam/papers/gigaworld-policy', type: 'WAM' },
    ],
  },
]

const totalLinks = computed(() => series.reduce((sum, item) => sum + item.links.length, 0))

const hrefFor = (href) => /^https?:\/\//i.test(href) ? href : withBase(href)
const isExternal = (href) => /^https?:\/\//i.test(href)
</script>

<template>
  <section
    class="company-series"
    :class="{ 'company-series--compact': props.compact }"
    aria-labelledby="company-series-title"
  >
    <header class="company-series__header">
      <div class="company-series__heading">
        <span class="company-series__eyebrow">COMPANY RESEARCH TRACKS · VLA × WAM</span>
        <component :is="props.compact ? 'h2' : 'h1'" id="company-series-title">
          大厂系列专题
        </component>
        <p>
          不按单篇发布时间堆列表，而是把同一公司连续发布的模型整理成技术路线，快速看清它们如何从动作策略走向世界模型。
        </p>
      </div>

      <dl class="company-series__stats" aria-label="专题收录统计">
        <div><dt>研究线</dt><dd>{{ String(series.length).padStart(2, '0') }}</dd></div>
        <div><dt>细读入口</dt><dd>{{ String(totalLinks).padStart(2, '0') }}</dd></div>
      </dl>

      <a
        v-if="props.compact"
        class="company-series__all"
        :href="withBase('/news/company-series')"
      >查看完整专题 <span aria-hidden="true">→</span></a>
      <a
        v-else
        class="company-series__back"
        :href="withBase('/news/')"
      ><span aria-hidden="true">←</span> 返回最新动态</a>
    </header>

    <div class="company-series__grid" role="list">
      <article
        v-for="(item, index) in series"
        :id="item.id"
        :key="item.id"
        class="company-series__card"
        :style="{ '--series-accent': item.accent }"
        role="listitem"
      >
        <header class="company-series__card-head">
          <span class="company-series__logo">
            <img :src="withBase(item.logo)" :alt="item.name + ' 标志'" loading="lazy" />
          </span>
          <div>
            <span>{{ item.group }}</span>
            <h3>{{ item.name }}</h3>
            <small>{{ item.unit }}</small>
          </div>
          <b>{{ String(index + 1).padStart(2, '0') }}</b>
        </header>

        <p class="company-series__summary">{{ item.summary }}</p>

        <ol class="company-series__route" :aria-label="item.name + ' 技术路线'">
          <li v-for="stage in item.route" :key="stage">{{ stage }}</li>
        </ol>

        <nav class="company-series__links" :aria-label="item.name + ' 系列细读'">
          <a
            v-for="link in (props.compact ? item.links.slice(0, 3) : item.links)"
            :key="link.href"
            :href="hrefFor(link.href)"
            :target="isExternal(link.href) ? '_blank' : undefined"
            :rel="isExternal(link.href) ? 'noopener' : undefined"
          >
            <span>{{ link.label }}</span>
            <small>{{ link.type }}</small>
          </a>
        </nav>

        <a
          v-if="props.compact"
          class="company-series__card-more"
          :href="withBase('/news/company-series#' + item.id)"
        >
          <template v-if="item.links.length > 3">其余 {{ item.links.length - 3 }} 个入口</template>
          <template v-else>查看路线说明</template>
          <span aria-hidden="true">↗</span>
        </a>
      </article>
    </div>

    <footer v-if="!props.compact" class="company-series__note">
      <p>
        <strong>阅读口径</strong>
        本页只整理站内已有连续细读的公司研究线，不把厂商自评成绩直接视作横向排名；每篇页面仍保留来源、可信度和局限说明。
      </p>
      <a :href="withBase('/ecosystem/brain-ranking')">查看公司分档与证据核验 <span aria-hidden="true">→</span></a>
    </footer>
  </section>
</template>

<style scoped>
.company-series {
  --series-border: color-mix(in srgb, var(--vp-c-text-1) 13%, transparent);
  --series-surface: color-mix(in srgb, var(--vp-c-bg) 93%, var(--vp-c-brand-soft));
  position: relative;
  margin: 12px 0 52px;
  color: var(--vp-c-text-1);
}
:global(.company-series-page .VPDoc) {
  overflow-x: clip;
  padding-bottom: 64px;
  background:
    radial-gradient(900px 420px at 12% 0%, color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent), transparent 70%),
    var(--vp-c-bg-soft);
}
:global(.company-series-page .VPDoc:not(.has-sidebar) > .container) {
  max-width: 1440px !important;
}
:global(.company-series-page .VPDoc:not(.has-sidebar) > .container > .content) {
  max-width: 100% !important;
}
:global(.company-series-page .content-container) {
  max-width: 1180px;
}

.company-series__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px 36px;
  align-items: end;
  margin-bottom: 22px;
  padding: 24px 0;
  border-block: 1px solid var(--series-border);
}
.company-series__heading { min-width: 0; }
.company-series__eyebrow {
  color: var(--vp-c-brand-1);
  font: 700 0.68rem/1.2 var(--vp-font-family-mono);
  letter-spacing: 0.08em;
}
.company-series__heading h1,
.company-series__heading h2 {
  margin: 10px 0 7px;
  padding: 0;
  border: 0;
  font-size: clamp(1.55rem, 2.8vw, 2.25rem);
  font-weight: 790;
  letter-spacing: -0.04em;
  line-height: 1.08;
}
.company-series__heading h1::before,
.company-series__heading h1::after,
.company-series__heading h2::before,
.company-series__heading h2::after,
.company-series__card h3::before,
.company-series__card h3::after {
  content: none !important;
  display: none !important;
}
.company-series__heading p {
  max-width: 64ch;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.88rem;
  line-height: 1.7;
}
.company-series__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(76px, 1fr));
  gap: 10px;
  margin: 0;
}
.company-series__stats > div {
  min-width: 82px;
  padding: 11px 13px;
  border: 1px solid var(--series-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--vp-c-bg) 84%, transparent);
}
.company-series__stats dt {
  color: var(--vp-c-text-3);
  font: 650 0.63rem/1 var(--vp-font-family-mono);
}
.company-series__stats dd {
  margin: 7px 0 0;
  color: var(--vp-c-text-1);
  font: 760 1.15rem/1 var(--vp-font-family-mono);
}
.company-series__all,
.company-series__back {
  justify-self: end;
  color: var(--vp-c-brand-1);
  font-size: 0.76rem;
  font-weight: 700;
  text-decoration: none;
}
.company-series__all { grid-column: 2; }
.company-series__back { grid-column: 1 / -1; justify-self: start; }

.company-series__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.company-series__card {
  --series-accent: var(--vp-c-brand-1);
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  scroll-margin-top: calc(var(--vp-nav-height, 64px) + 18px);
  overflow: hidden;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--series-accent) 25%, var(--series-border));
  border-radius: 14px;
  background:
    linear-gradient(150deg, color-mix(in srgb, var(--series-accent) 8%, transparent), transparent 42%),
    var(--series-surface);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.055);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.company-series__card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 2px;
  background: linear-gradient(90deg, var(--series-accent), transparent 78%);
}
.company-series__card:hover,
.company-series__card:focus-within {
  border-color: color-mix(in srgb, var(--series-accent) 52%, var(--series-border));
  box-shadow:
    0 16px 42px rgba(15, 23, 42, 0.1),
    0 0 24px color-mix(in srgb, var(--series-accent) 10%, transparent);
  transform: translateY(-2px);
}
.company-series__card-head {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 11px;
  align-items: center;
}
.company-series__logo {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--series-accent) 28%, var(--series-border));
  border-radius: 11px;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
}
.company-series__logo img {
  width: 27px;
  height: 27px;
  object-fit: contain;
}
.company-series__card-head > div { min-width: 0; }
.company-series__card-head > div > span {
  display: block;
  overflow: hidden;
  color: color-mix(in srgb, var(--series-accent) 78%, var(--vp-c-text-1));
  font: 700 0.59rem/1 var(--vp-font-family-mono);
  letter-spacing: 0.055em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.company-series__card h3 {
  margin: 5px 0 2px;
  padding: 0;
  border: 0;
  font-size: 1rem;
  font-weight: 760;
  letter-spacing: -0.025em;
  line-height: 1.2;
}
.company-series__card-head small {
  display: block;
  overflow: hidden;
  color: var(--vp-c-text-3);
  font-size: 0.68rem;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.company-series__card-head > b {
  align-self: start;
  color: color-mix(in srgb, var(--series-accent) 72%, var(--vp-c-text-3));
  font: 700 0.72rem/1 var(--vp-font-family-mono);
}
.company-series__summary {
  min-height: 3.1em;
  margin: 15px 0 13px;
  color: var(--vp-c-text-2);
  font-size: 0.77rem;
  line-height: 1.55;
}
.company-series__route {
  display: flex;
  gap: 0;
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}
.company-series__route li {
  position: relative;
  flex: 1;
  min-width: 0;
  padding-top: 9px;
  color: var(--vp-c-text-3);
  font: 650 0.59rem/1.25 var(--vp-font-family-mono);
  text-align: center;
}
.company-series__route li::before {
  content: '';
  position: absolute;
  top: 2px;
  right: 0;
  left: 0;
  height: 1px;
  background: color-mix(in srgb, var(--series-accent) 32%, var(--series-border));
}
.company-series__route li::after {
  content: '';
  position: absolute;
  top: -1px;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--series-accent);
  box-shadow: 0 0 10px color-mix(in srgb, var(--series-accent) 55%, transparent);
  transform: translateX(-50%);
}
.company-series__links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
  margin-top: auto;
}
.company-series__links a {
  display: flex;
  min-width: 0;
  min-height: 36px;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
  padding: 8px 9px;
  border: 1px solid var(--series-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--vp-c-bg) 82%, transparent);
  color: var(--vp-c-text-2);
  font-size: 0.69rem;
  font-weight: 650;
  text-decoration: none;
}
.company-series__links a > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.company-series__links a small {
  flex: 0 0 auto;
  color: color-mix(in srgb, var(--series-accent) 76%, var(--vp-c-text-2));
  font: 700 0.54rem/1 var(--vp-font-family-mono);
}
.company-series__links a:hover,
.company-series__links a:focus-visible {
  border-color: color-mix(in srgb, var(--series-accent) 55%, var(--series-border));
  color: var(--vp-c-text-1);
}
.company-series__card-more {
  display: flex;
  justify-content: space-between;
  margin-top: 11px;
  color: color-mix(in srgb, var(--series-accent) 78%, var(--vp-c-text-1));
  font-size: 0.66rem;
  font-weight: 700;
  text-decoration: none;
}

.company-series__note {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  margin-top: 18px;
  padding: 16px 18px;
  border: 1px dashed var(--series-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 76%, transparent);
}
.company-series__note p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  line-height: 1.6;
}
.company-series__note strong {
  margin-right: 8px;
  color: var(--vp-c-text-1);
}
.company-series__note a {
  flex: 0 0 auto;
  color: var(--vp-c-brand-1);
  font-size: 0.72rem;
  font-weight: 700;
  text-decoration: none;
}

.company-series--compact {
  margin: -1px 0 30px;
}
.company-series--compact .company-series__header {
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  margin-bottom: 13px;
  padding: 15px 0;
}
.company-series--compact .company-series__heading h2 {
  margin: 6px 0 3px;
  font-size: 1.28rem;
}
.company-series--compact .company-series__heading p {
  max-width: 70ch;
  font-size: 0.76rem;
  line-height: 1.55;
}
.company-series--compact .company-series__stats > div {
  min-width: 72px;
  padding: 9px 11px;
}
.company-series--compact .company-series__all {
  grid-column: auto;
  white-space: nowrap;
}
.company-series--compact .company-series__grid {
  display: flex;
  gap: 11px;
  overflow-x: auto;
  padding: 2px 2px 12px;
  scroll-snap-type: x proximity;
  scrollbar-color: color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent) transparent;
  scrollbar-width: thin;
}
.company-series--compact .company-series__card {
  flex: 0 0 264px;
  min-height: 264px;
  padding: 15px;
  scroll-snap-align: start;
}
.company-series--compact .company-series__summary {
  min-height: 3.1em;
  margin: 12px 0;
}
.company-series--compact .company-series__links {
  grid-template-columns: 1fr;
}
.company-series--compact .company-series__links a {
  min-height: 32px;
  padding-block: 6px;
}

@media (max-width: 959px) {
  .company-series__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .company-series--compact .company-series__header {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .company-series--compact .company-series__stats { display: none; }
  .company-series--compact .company-series__all { grid-column: 2; grid-row: 1; }
}

@media (max-width: 639px) {
  .company-series { margin-bottom: 38px; }
  .company-series__header,
  .company-series--compact .company-series__header {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .company-series__stats { justify-self: start; }
  .company-series__all,
  .company-series--compact .company-series__all {
    grid-column: 1;
    grid-row: auto;
    justify-self: start;
  }
  .company-series__grid { grid-template-columns: 1fr; }
  .company-series__card { padding: 16px; }
  .company-series__links a { min-height: 42px; }
  .company-series--compact .company-series__links a { min-height: 42px; }
  .company-series__note {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .company-series--compact .company-series__heading p { display: none; }
  .company-series--compact .company-series__grid { margin-inline: -4px; }
  .company-series--compact .company-series__card {
    flex-basis: min(84vw, 286px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .company-series__card { transition: none; }
  .company-series__card:hover,
  .company-series__card:focus-within { transform: none; }
  .company-series--compact .company-series__grid { scroll-behavior: auto; }
}
</style>
