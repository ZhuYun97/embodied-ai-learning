<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const graphUrl = computed(() => withBase('/graphs/graphify.html'))
</script>

<template>
  <section class="graphify-shell">
    <div class="graphify-toolbar">
      <div>
        <span>Graphify Atlas</span>
        <strong>本地知识星图</strong>
      </div>
      <a :href="graphUrl" target="_blank" rel="noreferrer">打开沉浸视图</a>
    </div>
    <iframe
      class="graphify-frame"
      :src="graphUrl"
      title="Graphify 离线知识图谱"
      loading="lazy"
    />
  </section>
</template>

<style scoped>
.graphify-shell {
  position: relative;
  width: min(1360px, calc(100vw - 38px));
  margin: 30px 0 38px 50%;
  overflow: hidden;
  transform: translateX(-50%);
  border: 1px solid transparent;
  border-radius: 8px;
  background:
    linear-gradient(#07070d, #07070d) padding-box,
    linear-gradient(135deg, rgba(93, 228, 255, 0.7), rgba(255, 140, 168, 0.54), rgba(255, 209, 102, 0.5)) border-box;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.38);
}

.graphify-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  z-index: 2;
}

.graphify-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(132, 178, 255, 0.18);
  background:
    linear-gradient(90deg, rgba(93, 228, 255, 0.12), transparent 45%),
    rgba(9, 12, 24, 0.94);
}

.graphify-toolbar div {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.graphify-toolbar span {
  color: #5de4ff;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.graphify-toolbar strong {
  color: #f7fbff;
  font-size: 13px;
  white-space: nowrap;
}

.graphify-toolbar a {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 11px;
  border: 1px solid rgba(93, 228, 255, 0.36);
  border-radius: 8px;
  background: rgba(93, 228, 255, 0.08);
  color: #dff8ff;
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
}

.graphify-toolbar a:hover {
  border-color: rgba(93, 228, 255, 0.72);
  background: rgba(93, 228, 255, 0.14);
  text-decoration: none;
}

.graphify-frame {
  display: block;
  width: 100%;
  height: min(82vh, 920px);
  min-height: 680px;
  border: 0;
  background: #050509;
}

@media (max-width: 700px) {
  .graphify-shell {
    width: calc(100vw - 24px);
    margin-top: 20px;
  }

  .graphify-frame {
    height: 76vh;
    min-height: 560px;
  }

  .graphify-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .graphify-toolbar div {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
