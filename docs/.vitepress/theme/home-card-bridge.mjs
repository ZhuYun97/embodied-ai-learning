export const HOME_CARD_BRIDGE_EXIT_MS = 56
export const HOME_CARD_BRIDGE_ENTER_MS = 600

const BRIDGE_QUERY = '(min-width: 960px) and (min-height: 681px) and (prefers-reduced-motion: no-preference)'
const BODY_REVEAL_DELAY_MS = 348
const HANDOFF_DELAY_MS = 438

const createElement = (tag, className, text = '') => {
  const element = document.createElement(tag)
  element.className = className
  if (text) element.textContent = text
  return element
}

const applyRect = (element, rect) => {
  element.style.left = `${rect.left}px`
  element.style.top = `${rect.top}px`
  element.style.width = `${rect.width}px`
  element.style.height = `${rect.height}px`
}

const validRect = (rect) => rect && rect.width > 1 && rect.height > 1

const copySurfaceStyle = (source, target, prefix) => {
  const style = window.getComputedStyle(source)
  target.style.setProperty(`--${prefix}-background`, style.background)
  target.style.setProperty(`--${prefix}-border-color`, style.borderColor)
  target.style.setProperty(`--${prefix}-radius`, style.borderRadius)
  target.style.setProperty(`--${prefix}-shadow`, style.boxShadow)
}

const copyTextStyle = (source, target) => {
  if (!source) return
  const style = window.getComputedStyle(source)
  target.style.font = style.font
  target.style.color = style.color
  target.style.letterSpacing = style.letterSpacing
  target.style.lineHeight = style.lineHeight
}

const makeSourceCard = (item, sourceIndex) => {
  const feature = item.querySelector('.VPFeature')
  const rect = feature?.getBoundingClientRect()
  if (!feature || !validRect(rect)) return null

  const card = createElement('div', 'home-card-bridge__card')
  card.dataset.sourceIndex = String(sourceIndex)
  card.setAttribute('aria-hidden', 'true')
  applyRect(card, rect)
  copySurfaceStyle(feature, card, 'bridge-source')

  card.appendChild(createElement('div', 'home-card-bridge__target-surface'))
  const source = createElement('div', 'home-card-bridge__source')
  const image = feature.querySelector('.VPImage')
  if (image) {
    const icon = document.createElement('img')
    icon.src = image.currentSrc || image.src
    icon.alt = ''
    source.appendChild(icon)
  }
  const sourceTitle = createElement(
    'strong',
    'home-card-bridge__source-title',
    feature.querySelector('.title')?.textContent?.trim() || '研究入口'
  )
  copyTextStyle(feature.querySelector('.title'), sourceTitle)
  source.appendChild(sourceTitle)
  source.appendChild(createElement('span', 'home-card-bridge__source-index', String(sourceIndex + 1).padStart(2, '0')))
  card.appendChild(source)
  card.appendChild(createElement('div', 'home-card-bridge__target'))

  return {
    element: card,
    rect,
    area: rect.width * rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    sourceIndex,
  }
}

const targetHeaderRect = (targetCard) => {
  const cardRect = targetCard.getBoundingClientRect()
  const tagRect = targetCard.querySelector('.route-tag')?.getBoundingClientRect()
  const titleRect = targetCard.querySelector('.route-card__title')?.getBoundingClientRect()
  if (!validRect(cardRect) || !validRect(tagRect) || !validRect(titleRect)) return null

  const contentBottom = Math.max(tagRect.bottom, titleRect.bottom)
  const height = Math.min(cardRect.height, Math.max(72, contentBottom - cardRect.top + 11))
  return {
    left: cardRect.left,
    top: cardRect.top,
    width: cardRect.width,
    height,
  }
}

const positionTargetCopy = (bridgeCard, targetCard, headerRect, scaleX, scaleY) => {
  const target = bridgeCard.element.querySelector('.home-card-bridge__target')
  if (!target) return
  target.replaceChildren()

  copySurfaceStyle(targetCard, bridgeCard.element, 'bridge-target')
  bridgeCard.element.style.setProperty('--bridge-inverse-x', String(1 / scaleX))
  bridgeCard.element.style.setProperty('--bridge-inverse-y', String(1 / scaleY))

  const tagSource = targetCard.querySelector('.route-tag')
  const titleSource = targetCard.querySelector('.route-card__title')
  const tagRect = tagSource?.getBoundingClientRect()
  const titleRect = titleSource?.getBoundingClientRect()

  const tag = createElement(
    'span',
    'home-card-bridge__target-tag',
    tagSource?.textContent?.trim() || 'VLA ROUTE'
  )
  const title = createElement(
    'strong',
    'home-card-bridge__target-title',
    titleSource?.textContent?.trim() || '技术路线'
  )
  copyTextStyle(tagSource, tag)
  copyTextStyle(titleSource, title)

  if (validRect(tagRect)) {
    tag.style.left = `${tagRect.left - headerRect.left}px`
    tag.style.top = `${tagRect.top - headerRect.top}px`
  }
  if (validRect(titleRect)) {
    title.style.left = `${titleRect.left - headerRect.left}px`
    title.style.top = `${titleRect.top - headerRect.top}px`
    title.style.width = `${titleRect.width}px`
  }

  target.append(tag, title)
}

const setTransformTarget = (card, targetRect) => {
  const scaleX = targetRect.width / card.rect.width
  const scaleY = targetRect.height / card.rect.height
  card.element.style.setProperty('--bridge-x', `${targetRect.left - card.rect.left}px`)
  card.element.style.setProperty('--bridge-y', `${targetRect.top - card.rect.top}px`)
  card.element.style.setProperty('--bridge-scale-x', String(scaleX))
  card.element.style.setProperty('--bridge-scale-y', String(scaleY))
  return { scaleX, scaleY }
}

export const canUseHomeCardBridge = (fromPage, toPage) => {
  if (fromPage !== 'explore' || toPage !== 'vla') return false
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  return window.matchMedia?.(BRIDGE_QUERY).matches ?? false
}

export const prepareHomeCardBridge = () => {
  if (typeof document === 'undefined') return null
  const root = document.documentElement
  const sourceItems = Array.from(document.querySelectorAll('.VPHome .VPFeatures .items > .item')).slice(0, 6)
  if (sourceItems.length < 6) return null

  document.querySelectorAll('.home-card-bridge').forEach((element) => element.remove())
  const wasOrbitPaused = root.classList.contains('explore-orbit-paused')
  root.classList.add('explore-orbit-paused', 'home-card-bridge-preparing')
  void sourceItems[0].offsetHeight

  const allCards = sourceItems
    .map(makeSourceCard)
    .filter(Boolean)
  if (allCards.length < 6) {
    root.classList.remove('home-card-bridge-preparing')
    if (!wasOrbitPaused) root.classList.remove('explore-orbit-paused')
    return null
  }

  const layer = createElement('div', 'home-card-bridge')
  layer.setAttribute('aria-hidden', 'true')
  layer.setAttribute('inert', '')
  allCards.forEach((card) => {
    card.element.style.zIndex = String(Math.max(1, Math.round(card.area)))
    layer.appendChild(card.element)
  })
  document.body.appendChild(layer)

  root.dataset.homeCardBridge = 'explore-vla'
  root.classList.add('home-card-bridge-active')

  return {
    root,
    layer,
    allCards,
    mappedCards: [],
    auxiliary: null,
    targetCards: [],
    wasOrbitPaused,
    revealTimer: null,
    handoffTimer: null,
  }
}

export const playHomeCardBridge = (bridge) => {
  if (!bridge?.layer?.isConnected) return false
  const targetCards = Array.from(document.querySelectorAll(".home-page-panel[data-page='vla'] .route-card")).slice(0, 5)
  const headerRects = targetCards.map(targetHeaderRect)
  if (targetCards.length < 5 || headerRects.some((rect) => !validRect(rect))) return false

  const mapping = bridge.allCards.reduce((best, auxiliary) => {
    const cards = bridge.allCards
      .filter((card) => card !== auxiliary)
      .sort((a, b) => a.centerX - b.centerX || a.sourceIndex - b.sourceIndex)
    const cost = cards.reduce((total, card, index) => {
      const target = headerRects[index]
      const targetCenterX = target.left + target.width / 2
      const targetCenterY = target.top + target.height / 2
      return total + ((card.centerX - targetCenterX) ** 2) + ((card.centerY - targetCenterY) ** 2)
    }, 0)
    return !best || cost < best.cost ? { auxiliary, cards, cost } : best
  }, null)
  const auxiliary = mapping.auxiliary
  const mappedCards = mapping.cards

  bridge.mappedCards = mappedCards
  bridge.auxiliary = auxiliary
  bridge.targetCards = targetCards

  mappedCards.forEach((card, index) => {
    const targetRect = headerRects[index]
    const { scaleX, scaleY } = setTransformTarget(card, targetRect)
    card.element.dataset.targetSlot = String(index)
    card.element.style.setProperty('--bridge-delay', `${32 + (index * 4)}ms`)
    card.element.style.setProperty('--bridge-content-delay', `${index * 6}ms`)
    positionTargetCopy(card, targetCards[index], targetRect, scaleX, scaleY)
    targetCards[index].style.setProperty('--bridge-header-height', `${targetRect.height}px`)
  })

  auxiliary.element.classList.add('is-auxiliary')

  void bridge.layer.offsetHeight
  mappedCards.forEach((card) => card.element.classList.add('is-targeting'))
  auxiliary.element.classList.add('is-targeting')
  bridge.layer.classList.add('is-morphing')
  bridge.root.classList.add('home-card-bridge-targeting')

  bridge.revealTimer = window.setTimeout(() => {
    if (!bridge.layer.isConnected) return
    bridge.root.classList.add('home-card-bridge-revealing')
    bridge.layer.classList.add('is-revealing')
  }, BODY_REVEAL_DELAY_MS)
  bridge.handoffTimer = window.setTimeout(() => {
    if (!bridge.layer.isConnected) return
    bridge.root.classList.add('home-card-bridge-handoff')
    bridge.layer.classList.add('is-handing-off')
  }, HANDOFF_DELAY_MS)
  return true
}

export const cleanupHomeCardBridge = (bridge) => {
  if (bridge?.revealTimer) window.clearTimeout(bridge.revealTimer)
  if (bridge?.handoffTimer) window.clearTimeout(bridge.handoffTimer)
  bridge?.targetCards?.forEach((card) => card.style.removeProperty('--bridge-header-height'))
  bridge?.layer?.remove()
  if (typeof document === 'undefined') return

  const root = bridge?.root || document.documentElement
  root.classList.remove(
    'home-card-bridge-active',
    'home-card-bridge-preparing',
    'home-card-bridge-targeting',
    'home-card-bridge-revealing',
    'home-card-bridge-handoff'
  )
  delete root.dataset.homeCardBridge
  if (bridge && !bridge.wasOrbitPaused) root.classList.remove('explore-orbit-paused')
  document.querySelectorAll('.home-card-bridge').forEach((element) => element.remove())
}
