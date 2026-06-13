<!--
  ThemeToggle —— 日夜模式切换开关(Uiverse.io @rishichawda「fluffy-robin-48」移植,
  源码取自 uiverse-io/galaxy 官方镜像)。白天 = 天蓝底 + 太阳 + 云,黑夜 = 深蓝底 +
  月亮(带陨石坑)+ 星星,按钮滑动 + 图层透明度全靠原版 CSS(:checked + svg)驱动。
  接入:checkbox 双向绑定 VitePress isDark(写 isDark.value 即触发主题切换与持久化);
  替换桌面导航栏默认 .VPSwitchAppearance(移动端抽屉菜单仍用默认开关)。
  移植说明:galaxy 镜像省略了 <defs> 滤镜定义,为避免悬空 filter 引用在部分浏览器
  不渲染,已剥离 filter 属性(仅损失细微投影);尺寸经 font-size 缩放适配 64px 导航栏。
-->
<template>
  <label id="theme-toggle-button" title="切换深浅色模式">
    <input
      id="toggle"
      type="checkbox"
      :checked="isDark"
      aria-label="切换深浅色模式"
      @change="isDark = $event.target.checked"
    />
    <svg viewBox="0 0 69.667 44" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(3.5 3.5)" id="Component_15_1">
        <g transform="matrix(1, 0, 0, 1, -3.5, -3.5)">
          <rect fill="#83cbd8" transform="translate(3.5 3.5)" rx="17.5" height="35" width="60.667" id="container"></rect>
        </g>
        <g transform="translate(2.333 2.333)" id="button">
          <g id="sun">
            <g transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
              <circle fill="#f8e664" transform="translate(5.83 5.83)" r="15.167" cy="15.167" cx="15.167" id="sun-outer-2"></circle>
            </g>
            <g transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
              <path fill="rgba(246,254,247,0.29)" transform="translate(9.33 9.33)" d="M11.667,0A11.667,11.667,0,1,1,0,11.667,11.667,11.667,0,0,1,11.667,0Z" id="sun-3"></path>
            </g>
            <circle fill="#fcf4b9" transform="translate(8.167 8.167)" r="7" cy="7" cx="7" id="sun-inner"></circle>
          </g>
          <g id="moon">
            <g transform="matrix(1, 0, 0, 1, -31.5, -5.83)">
              <circle fill="#cce6ee" transform="translate(31.5 5.83)" r="15.167" cy="15.167" cx="15.167" id="moon-3"></circle>
            </g>
            <g fill="#a6cad0" transform="translate(-24.415 -1.009)" id="patches">
              <circle transform="translate(43.009 4.496)" r="2" cy="2" cx="2"></circle>
              <circle transform="translate(39.366 17.952)" r="2" cy="2" cx="2"></circle>
              <circle transform="translate(33.016 8.044)" r="1" cy="1" cx="1"></circle>
              <circle transform="translate(51.081 18.888)" r="1" cy="1" cx="1"></circle>
              <circle transform="translate(33.016 22.503)" r="1" cy="1" cx="1"></circle>
              <circle transform="translate(50.081 10.53)" r="1.5" cy="1.5" cx="1.5"></circle>
            </g>
          </g>
        </g>
        <g transform="matrix(1, 0, 0, 1, -3.5, -3.5)">
          <path fill="#fff" transform="translate(-3466.47 -160.94)" d="M3512.81,173.815a4.463,4.463,0,0,1,2.243.62.95.95,0,0,1,.72-1.281,4.852,4.852,0,0,1,2.623.519c.034.02-.5-1.968.281-2.716a2.117,2.117,0,0,1,2.829-.274,1.821,1.821,0,0,1,.854,1.858c.063.037,2.594-.049,3.285,1.273s-.865,2.544-.807,2.626a12.192,12.192,0,0,1,2.278.892c.553.448,1.106,1.992-1.62,2.927a7.742,7.742,0,0,1-3.762-.3c-1.28-.49-1.181-2.65-1.137-2.624s-1.417,2.2-2.623,2.2a4.172,4.172,0,0,1-2.394-1.206,3.825,3.825,0,0,1-2.771.774c-3.429-.46-2.333-3.267-2.2-3.55A3.721,3.721,0,0,1,3512.81,173.815Z" id="cloud"></path>
        </g>
        <g fill="#def8ff" transform="translate(3.585 1.325)" id="stars">
          <path transform="matrix(-1, 0.017, -0.017, -1, 24.231, 3.055)" d="M.774,0,.566.559,0,.539.458.933.25,1.492l.485-.361.458.394L1.024.953,1.509.592.943.572Z"></path>
          <path transform="matrix(-0.777, 0.629, -0.629, -0.777, 23.185, 12.358)" d="M1.341.529.836.472.736,0,.505.46,0,.4.4.729l-.231.46L.605.932l.4.326L.9.786Z"></path>
          <path transform="matrix(0.438, 0.899, -0.899, 0.438, 23.177, 29.735)" d="M.015,1.065.475.9l.285.365L.766.772l.46-.164L.745.494.751,0,.481.407,0,.293.285.658Z"></path>
          <path transform="translate(12.677 0.388) rotate(104)" d="M1.161,1.6,1.059,1,1.574.722.962.607.86,0,.613.572,0,.457.446.881.2,1.454l.516-.274Z"></path>
          <path transform="matrix(-0.07, 0.998, -0.998, -0.07, 11.066, 15.457)" d="M.873,1.648l.114-.62L1.579.945,1.03.62,1.144,0,.706.464.157.139.438.7,0,1.167l.592-.083Z"></path>
          <path transform="translate(8.326 28.061) rotate(11)" d="M.593,0,.638.724,0,.982l.7.211.045.724.36-.64.7.211L1.342.935,1.7.294,1.063.552Z"></path>
          <path transform="translate(5.012 5.962) rotate(172)" d="M.816,0,.5.455,0,.311.323.767l-.312.455.516-.215.323.456L.827.911,1.343.7.839.552Z"></path>
          <path transform="translate(2.218 14.616) rotate(169)" d="M1.261,0,.774.571.114.3.487.967,0,1.538.728,1.32l.372.662.047-.749.728-.218L1.215.749Z"></path>
        </g>
      </g>
    </svg>
  </label>
</template>

<script setup>
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<style>
/* From Uiverse.io by rishichawda */
/* The switch - the box around the slider */
#theme-toggle-button {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 7em;
  cursor: pointer;
}

/* Hide default HTML checkbox */
#toggle {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

#container,
#patches,
#stars,
#button,
#sun,
#moon,
#cloud {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.25s;
}

/* night sky background */
#toggle:checked + svg #container {
  fill: #2b4360;
}

/* move button to right when checked */
#toggle:checked + svg #button {
  transform: translate(28px, 2.333px);
}

/* show/hide sun and moon based on checkbox state */
#sun {
  opacity: 1;
}

#toggle:checked + svg #sun {
  opacity: 0;
}

#moon {
  opacity: 0;
}

#toggle:checked + svg #moon {
  opacity: 1;
}

/* show or hide background items on checkbox state */
#cloud {
  opacity: 1;
}

#toggle:checked + svg #cloud {
  opacity: 0;
}

#stars {
  opacity: 0;
}

#toggle:checked + svg #stars {
  opacity: 1;
}

/* —— 站点适配:缩放进 64px 导航栏,替换默认开关(移动端抽屉菜单保留默认) —— */
#theme-toggle-button {
  font-size: 6px;
  display: flex;
  align-items: center;
  margin-left: 12px;
}
.VPNavBar .VPNavBarAppearance .VPSwitchAppearance,
.VPNavBar > .wrapper .VPSwitchAppearance {
  display: none !important;
}
@media (max-width: 767px) {
  #theme-toggle-button { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  #container, #patches, #stars, #button, #sun, #moon, #cloud { transition: none; }
}
</style>
