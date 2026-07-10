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
    id: 'vla',
    index: '02',
    label: 'VLA',
    shortLabel: '动作模型',
    description: '视觉—语言—动作路线',
  },
  {
    id: 'wam',
    index: '03',
    label: 'WAM',
    shortLabel: '世界模型',
    description: '世界—动作建模范式',
  },
  {
    id: 'resources',
    index: '04',
    label: '资源',
    shortLabel: '研究入口',
    description: '论文、基准、图谱与方法',
  },
]

export const activeHomePage = ref('overview')

export function setActiveHomePage(page) {
  if (HOME_PAGES.some((item) => item.id === page)) {
    activeHomePage.value = page
  }
}
