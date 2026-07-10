<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const graphUrl = computed(() => withBase('/graphs/graphify.html'))
</script>

<template>
  <section class="graphify-shell" aria-label="离线全站知识图谱">
    <div class="graphify-orb graphify-orb--one" aria-hidden="true"></div>
    <div class="graphify-orb graphify-orb--two" aria-hidden="true"></div>
    <header class="graphify-toolbar">
      <div class="graphify-toolbar__identity">
        <span><i aria-hidden="true"></i> GRAPHIFY / LOCAL</span>
        <strong>全站语义星图</strong>
        <p>从论文、概念、数据、基准、本体与机构中探索连接。</p>
      </div>
      <div class="graphify-toolbar__actions">
        <div class="graphify-mini-stats" aria-label="图谱规模">
          <span><b>213</b>节点</span>
          <span><b>3.4K</b>关系</span>
          <span><b>10</b>社区</span>
        </div>
        <a :href="graphUrl" target="_blank" rel="noreferrer">全屏探索 <b aria-hidden="true">↗</b></a>
      </div>
    </header>
    <div class="graphify-stage">
      <iframe
        class="graphify-frame"
        :src="graphUrl"
        title="Graphify 离线知识图谱"
        loading="lazy"
      />
      <div class="graphify-controls-hint" aria-hidden="true">
        <span><kbd>滚轮</kbd> 缩放</span>
        <span><kbd>拖拽</kbd> 平移</span>
        <span><kbd>点击</kbd> 聚焦</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.graphify-shell {
  position: relative;
  width: min(1360px, calc(100vw - var(--vp-sidebar-width, 272px) - 106px));
  margin: 30px 0 38px;
  overflow: hidden;
  border: 1px solid rgba(112, 211, 255, 0.2);
  border-radius: 22px;
  background:
    radial-gradient(circle at 12% 0, rgba(74, 189, 255, 0.16), transparent 34%),
    radial-gradient(circle at 88% 6%, rgba(139, 124, 255, 0.13), transparent 30%),
    linear-gradient(145deg, rgba(8, 15, 31, 0.98), rgba(3, 8, 20, 0.99));
  box-shadow:
    0 34px 100px rgba(1, 4, 13, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.025) inset,
    0 0 70px rgba(72, 179, 255, 0.08);
}

.graphify-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  z-index: 4;
}

.graphify-shell::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  background:
    linear-gradient(110deg, rgba(255, 255, 255, 0.055), transparent 18%, transparent 82%, rgba(122, 107, 255, 0.04)),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.018) 0 1px, transparent 1px 5px);
  opacity: 0.36;
}

.graphify-toolbar {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  min-height: 88px;
  padding: 16px 18px 15px 20px;
  border-bottom: 1px solid rgba(112, 211, 255, 0.14);
  background:
    linear-gradient(90deg, rgba(62, 170, 255, 0.08), transparent 48%, rgba(139, 124, 255, 0.06)),
    rgba(4, 10, 24, 0.78);
  backdrop-filter: blur(22px);
}

.graphify-toolbar__identity {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.graphify-toolbar__identity > span {
  display: flex;
  align-items: center;
  gap: 7px;
}

.graphify-toolbar__identity i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #65ddff;
  box-shadow: 0 0 14px rgba(101, 221, 255, 0.9);
}

.graphify-toolbar__identity span {
  color: #7de3ff;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.graphify-toolbar__identity strong {
  color: #f5f9ff;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.graphify-toolbar__identity p {
  margin: 0;
  color: rgba(204, 220, 244, 0.58);
  font-size: 12px;
}

.graphify-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.graphify-mini-stats {
  display: flex;
  gap: 5px;
}

.graphify-mini-stats span {
  display: grid;
  min-width: 56px;
  gap: 1px;
  padding: 6px 8px;
  border: 1px solid rgba(124, 211, 255, 0.12);
  border-radius: 9px;
  background: rgba(8, 18, 39, 0.72);
  color: rgba(196, 212, 237, 0.5);
  font-size: 9px;
  text-align: center;
}

.graphify-mini-stats b {
  color: #edf7ff;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.graphify-toolbar a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid rgba(101, 221, 255, 0.34);
  border-radius: 11px;
  background: linear-gradient(135deg, rgba(84, 195, 255, 0.18), rgba(139, 124, 255, 0.12));
  color: #eaf8ff;
  font-size: 12px;
  font-weight: 750;
  text-decoration: none;
  box-shadow: 0 10px 28px rgba(30, 120, 210, 0.12);
}

.graphify-toolbar a:hover {
  border-color: rgba(129, 230, 255, 0.7);
  background: linear-gradient(135deg, rgba(84, 195, 255, 0.28), rgba(139, 124, 255, 0.2));
  transform: translateY(-1px);
  text-decoration: none;
}

.graphify-stage {
  position: relative;
  z-index: 3;
  background: #030716;
}

.graphify-frame {
  display: block;
  width: 100%;
  height: min(84vh, 940px);
  min-height: 700px;
  border: 0;
  background: #030716;
}

.graphify-controls-hint {
  position: absolute;
  left: 50%;
  bottom: 14px;
  z-index: 2;
  display: flex;
  gap: 4px;
  padding: 5px;
  border: 1px solid rgba(117, 209, 255, 0.14);
  border-radius: 12px;
  background: rgba(4, 10, 25, 0.76);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(14px);
  transform: translateX(-50%);
  pointer-events: none;
}

.graphify-controls-hint span {
  padding: 5px 8px;
  color: rgba(204, 221, 242, 0.58);
  font-size: 10px;
  white-space: nowrap;
}

.graphify-controls-hint kbd {
  border: 0;
  border-radius: 5px;
  background: rgba(91, 197, 255, 0.1);
  color: #a9eaff;
  font: inherit;
  font-weight: 800;
  box-shadow: none;
}

.graphify-orb {
  position: absolute;
  z-index: 1;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  filter: blur(76px);
  opacity: 0.13;
  pointer-events: none;
}

.graphify-orb--one {
  top: -160px;
  left: 6%;
  background: #45c8ff;
}

.graphify-orb--two {
  top: -170px;
  right: 8%;
  background: #8b7cff;
}

@media (max-width: 700px) {
  .graphify-shell {
    width: calc(100vw - 24px);
    margin-top: 20px;
    border-radius: 16px;
  }

  .graphify-frame {
    height: 76vh;
    min-height: 560px;
  }

  .graphify-toolbar {
    align-items: flex-start;
    flex-direction: column;
    padding: 15px;
  }

  .graphify-toolbar__actions {
    width: 100%;
    justify-content: space-between;
  }

  .graphify-mini-stats span {
    min-width: 48px;
  }

  .graphify-controls-hint {
    display: none;
  }
}
</style>
