<script setup>
// 小红书账号种子清单(编辑性内容,与 2026-06-12 首版文字逐条同源):
// ✅ = 双源核验(官方 AMA 实名 × 开源指南);⚠️ = 单源(开源指南收录,方向未逐一核)。
// 不放账号主页链接 —— 实采未抓取主页 URL,不编造。
const GROUPS = [
  {
    mark: 'ok',
    sign: '✅',
    title: '学者实名账号',
    note: '小红书官方「具身智能 AMA」实名答题 × 开源指南双源互证',
    members: [
      { name: '许华哲Harry', sub: '清华 / 星海图' },
      { name: 'RHOSLab #PI-李永露', sub: '上海交大' },
      { name: '周博宇', sub: '南科大 / 微分智飞' },
      { name: '高飞', sub: '浙大 / 微分智飞' },
      { name: '穆尧_YaoMarkMu', sub: '上海交大 · 身份双源' },
    ],
  },
  {
    mark: 'warn',
    sign: '⚠️',
    title: '开源指南收录博主',
    note: 'Embodied-AI-Guide「博主(小红书)」栏,标注「长期跟进价值高」;方向未逐一核',
    link: { text: 'Embodied-AI-Guide ↗', href: 'https://github.com/TianxingChen/Embodied-AI-Guide' },
    members: [
      { name: 'WhynotTV' },
      { name: '李弘扬' },
      { name: '朱政' },
      { name: '丁琰' },
      { name: 'YY硕', sub: '本次实采可见 · 活跃互证' },
      { name: 'Mango-Man' },
      { name: '正合时宜', sub: '本次实采可见 · 活跃互证' },
      { name: '心言任永亮' },
      { name: 'York Yang-Dyna Robotics' },
      { name: '哲伦班长' },
    ],
  },
  {
    mark: 'ok',
    sign: '✅',
    title: '公司与机构号',
    note: '王兴兴曾在小红书发机器人视频回应质疑(量子位报道);其余为本次实采可见的活跃机构号',
    members: [
      { name: '王兴兴', sub: '宇树 CEO' },
      { name: '千寻智能Spirit AI', sub: '机构号 · 实采可见' },
      { name: '小米招聘', sub: '机构号 · 实采可见' },
      { name: '人大高瓴GeWu-Lab', sub: '机构号 · 实采可见' },
    ],
  },
]
</script>

<template>
  <div class="xhs-accts">
    <section v-for="g in GROUPS" :key="g.title" class="xhs-acct-group" :data-mark="g.mark">
      <header class="xhs-acct-head">
        <span class="xhs-acct-sign" aria-hidden="true">{{ g.sign }}</span>
        <strong>{{ g.title }}</strong>
        <small>
          {{ g.note }}
          <a v-if="g.link" :href="g.link.href" target="_blank" rel="noopener">{{ g.link.text }}</a>
        </small>
      </header>
      <ul class="xhs-acct-chips">
        <li v-for="m in g.members" :key="m.name" class="xhs-acct-chip">
          <span class="xhs-acct-name">{{ m.name }}</span>
          <span v-if="m.sub" class="xhs-acct-sub">{{ m.sub }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.xhs-accts {
  --mk-ok: #059669;
  --mk-warn: #b45309;
  display: grid;
  gap: 12px;
  margin-top: 12px;
}
.dark .xhs-accts {
  --mk-ok: #34d399;
  --mk-warn: #fbbf24;
}
.xhs-acct-group {
  position: relative;
  padding: 12px 16px 13px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid color-mix(in srgb, var(--mk-c) 70%, transparent);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}
.xhs-acct-group[data-mark='ok'] { --mk-c: var(--mk-ok); }
.xhs-acct-group[data-mark='warn'] { --mk-c: var(--mk-warn); }
.xhs-acct-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  margin-bottom: 9px;
}
.xhs-acct-sign { font-size: 12px; }
.xhs-acct-head strong {
  font-size: 14px;
  color: color-mix(in srgb, var(--mk-c) 55%, var(--vp-c-text-1));
}
.xhs-acct-head small {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}
.xhs-acct-head small a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
}
.xhs-acct-head small a:hover { text-decoration: underline; }
.xhs-acct-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.xhs-acct-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  background: var(--vp-c-bg);
  transition: border-color 0.16s, transform 0.12s;
}
.xhs-acct-chip:hover {
  border-color: color-mix(in srgb, var(--mk-c) 50%, var(--vp-c-divider));
  transform: translateY(-1px);
}
.xhs-acct-name {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.xhs-acct-sub {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
}
@media (prefers-reduced-motion: reduce) {
  .xhs-acct-chip:hover { transform: none; }
}
</style>
