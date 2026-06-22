<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const graphUrl = computed(() => withBase('/graphs/graphify.html'))
</script>

<template>
  <section class="graphify-shell">
    <div class="graphify-toolbar">
      <a :href="graphUrl" target="_blank" rel="noreferrer">新窗口打开 Graphify 图谱</a>
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
  width: min(1280px, calc(100vw - 48px));
  margin: 28px 0 36px 50%;
  overflow: hidden;
  transform: translateX(-50%);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #0f0f1a;
}

.graphify-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 8px 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.graphify-toolbar a {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.graphify-toolbar a:hover {
  text-decoration: underline;
}

.graphify-frame {
  display: block;
  width: 100%;
  height: min(78vh, 860px);
  min-height: 620px;
  border: 0;
  background: #0f0f1a;
}

@media (max-width: 700px) {
  .graphify-shell {
    width: calc(100vw - 24px);
    margin-top: 20px;
  }

  .graphify-frame {
    height: 72vh;
    min-height: 540px;
  }
}
</style>
