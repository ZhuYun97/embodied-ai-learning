import { ref } from 'vue'

export const HOME_PAGES = [
  {
    id: 'overview',
    index: '01',
    label: '星图',
    shortLabel: '总览',
    description: '站点定位与研究规模',
  },
  {
    id: 'explore',
    index: '02',
    label: '导航',
    shortLabel: '旋转菜单',
    description: '六个核心研究入口',
  },
  {
    id: 'vla',
    index: '03',
    label: 'VLA',
    shortLabel: '动作模型',
    description: '视觉—语言—动作路线',
  },
  {
    id: 'wam',
    index: '04',
    label: 'WAM',
    shortLabel: '世界模型',
    description: '世界—动作建模范式',
  },
  {
    id: 'about',
    index: '05',
    label: '关于',
    shortLabel: '研究方法',
    description: '研究原则与更多入口',
  },
]

export const activeHomePage = ref('overview')
export const activeExploreNode = ref(0)

let homePageNavigator = null

export function setActiveHomePage(page) {
  if (HOME_PAGES.some((item) => item.id === page)) {
    activeHomePage.value = page
    return true
  }
  return false
}

export function setActiveExploreNode(index) {
  const next = Number(index)
  if (!Number.isInteger(next) || next < 0) return false
  activeExploreNode.value = next
  return true
}

export function setHomePageNavigator(navigator) {
  homePageNavigator = typeof navigator === 'function' ? navigator : null
}

export function requestHomePage(page, options = {}) {
  if (homePageNavigator) return homePageNavigator(page, options)
  return setActiveHomePage(page)
}
