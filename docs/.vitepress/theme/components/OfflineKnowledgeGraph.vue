<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const graphUrl = computed(() => withBase('/graphs/graphify.html'))
</script>

<template>
  <section class="graphify-shell">
    <div class="graphify-toolbar">
      <div>
        <span>KG HUD</span>
        <strong>全息语义拓扑</strong>
      </div>
      <a :href="graphUrl" target="_blank" rel="noreferrer">全屏控制台</a>
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
  width: min(1360px, calc(100vw - var(--vp-sidebar-width, 272px) - 106px));
  margin: 30px 0 38px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 3px;
  background:
    linear-gradient(#010308, #010308) padding-box,
    linear-gradient(135deg, rgba(66, 244, 255, 0.94), rgba(116, 255, 176, 0.6), rgba(255, 77, 150, 0.52)) border-box;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.46), 0 0 56px rgba(66, 244, 255, 0.1);
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
}

.graphify-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 0 46px rgba(66, 244, 255, 0.045);
  z-index: 2;
}

.graphify-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent 0 49.9%, rgba(66, 244, 255, 0.14) 50%, transparent 50.1% 100%),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 4px);
  opacity: 0.14;
  mix-blend-mode: screen;
}

.graphify-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(66, 244, 255, 0.3);
  background:
    linear-gradient(90deg, rgba(66, 244, 255, 0.2), transparent 44%, rgba(116, 255, 176, 0.1)),
    rgba(1, 3, 8, 0.98);
}

.graphify-toolbar div {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.graphify-toolbar span {
  color: #74ffb0;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.graphify-toolbar strong {
  color: #f7fbff;
  font-size: 13px;
  white-space: nowrap;
  text-shadow: 0 0 16px rgba(66, 244, 255, 0.5);
}

.graphify-toolbar a {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 11px;
  border: 1px solid rgba(66, 244, 255, 0.48);
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(66, 244, 255, 0.13), rgba(66, 244, 255, 0.04));
  color: #dff8ff;
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
  clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 0 100%);
}

.graphify-toolbar a:hover {
  border-color: rgba(116, 255, 176, 0.72);
  background: rgba(66, 244, 255, 0.16);
  text-decoration: none;
}

.graphify-frame {
  display: block;
  width: 100%;
  height: min(82vh, 920px);
  min-height: 680px;
  border: 0;
  background: #010308;
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
