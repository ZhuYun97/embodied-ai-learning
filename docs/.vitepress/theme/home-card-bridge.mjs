export const HOME_CARD_BRIDGE_ENTER_MS = 640

const BRIDGE_QUERY = '(min-width: 960px) and (min-height: 681px) and (prefers-reduced-motion: no-preference)'
const REVEAL_DELAY_MS = 370

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

const makeSourceCard = (item, sourceIndex) => {
  const feature = item.querySelector('.VPFeature')
  const rect = feature?.getBoundingClientRect()
  if (!feature || !validRect(rect)) return null

  const card = createElement('div', 'home-card-bridge__card')
  card.dataset.sourceIndex = String(sourceIndex)
  card.setAttribute('aria-hidden', 'true')
  applyRect(card, rect)

  const source = createElement('div', 'home-card-bridge__source')
  const image = feature.querySelector('.VPImage')
  if (image) {
    const icon = document.createElement('img')
    icon.src = image.currentSrc || image.src
    icon.alt = ''
    source.appendChild(icon)
  }
  source.appendChild(createElement('strong', 'home-card-bridge__source-title', feature.querySelector('.title')?.textContent?.trim() || '研究入口'))
  source.appendChild(createElement('span', 'home-card-bridge__source-index', String(sourceIndex + 1).padStart(2, '0')))
  card.appendChild(source)
  card.appendChild(createElement('div', 'home-card-bridge__target'))

  return {
    element: card,
    rect,
    area: rect.width * rect.height,
    centerX: rect.left + rect.width / 2,
    sourceIndex,
  }
}

const addTargetCopy = (bridgeCard, targetCard) => {
  const target = bridgeCard.element.querySelector('.home-card-bridge__target')
  if (!target) return
  target.replaceChildren()
  target.appendChild(createElement('span', 'home-card-bridge__target-tag', targetCard.querySelector('.route-tag')?.textContent?.trim() || 'VLA ROUTE'))
  target.appendChild(createElement('strong', 'home-card-bridge__target-title', targetCard.querySelector('.route-card__title')?.textContent?.trim() || '技术路线'))
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

  const auxiliary = allCards.reduce((smallest, card) => card.area < smallest.area ? card : smallest)
  const mappedCards = allCards
    .filter((card) => card !== auxiliary)
    .sort((a, b) => a.centerX - b.centerX)

  const layer = createElement('div', 'home-card-bridge')
  layer.setAttribute('aria-hidden', 'true')
  layer.setAttribute('inert', '')
  mappedCards.forEach((card, index) => {
    card.element.dataset.targetSlot = String(index)
    card.element.style.setProperty('--bridge-delay', `${index * 12}ms`)
    layer.appendChild(card.element)
  })
  auxiliary.element.classList.add('is-auxiliary')
  auxiliary.element.style.setProperty('--bridge-fade-delay', '160ms')
  layer.appendChild(auxiliary.element)
  document.body.appendChild(layer)

  root.dataset.homeCardBridge = 'explore-vla'
  root.classList.add('home-card-bridge-active')

  return {
    root,
    layer,
    mappedCards,
    auxiliary,
    allCards,
    wasOrbitPaused,
    revealTimer: null,
  }
}

export const playHomeCardBridge = (bridge) => {
  if (!bridge?.layer?.isConnected) return false
  const targetCards = Array.from(document.querySelectorAll(".home-page-panel[data-page='vla'] .route-card")).slice(0, 5)
  const intro = document.querySelector(".home-page-panel[data-page='vla'] .home-track-intro")
  const targetRects = targetCards.map((card) => card.getBoundingClientRect())
  const introRect = intro?.getBoundingClientRect()
  if (targetCards.length < 5 || targetRects.some((rect) => !validRect(rect)) || !validRect(introRect)) return false

  bridge.mappedCards.forEach((card, index) => addTargetCopy(card, targetCards[index]))
  void bridge.layer.offsetHeight

  bridge.mappedCards.forEach((card, index) => {
    applyRect(card.element, targetRects[index])
    card.element.classList.add('is-targeting')
  })

  const auxiliaryWidth = 88
  const auxiliaryHeight = 26
  applyRect(bridge.auxiliary.element, {
    left: introRect.left + introRect.width / 2 - auxiliaryWidth / 2,
    top: introRect.top + introRect.height / 2 - auxiliaryHeight / 2,
    width: auxiliaryWidth,
    height: auxiliaryHeight,
  })
  bridge.auxiliary.element.classList.add('is-targeting')
  bridge.layer.classList.add('is-morphing')
  bridge.root.classList.add('home-card-bridge-targeting')

  bridge.revealTimer = window.setTimeout(() => {
    if (!bridge.layer.isConnected) return
    bridge.root.classList.add('home-card-bridge-revealing')
    bridge.layer.classList.add('is-revealing')
  }, REVEAL_DELAY_MS)
  return true
}

export const cleanupHomeCardBridge = (bridge) => {
  if (bridge?.revealTimer) window.clearTimeout(bridge.revealTimer)
  bridge?.layer?.remove()
  if (typeof document === 'undefined') return

  const root = bridge?.root || document.documentElement
  root.classList.remove(
    'home-card-bridge-active',
    'home-card-bridge-preparing',
    'home-card-bridge-targeting',
    'home-card-bridge-revealing'
  )
  delete root.dataset.homeCardBridge
  if (bridge && !bridge.wasOrbitPaused) root.classList.remove('explore-orbit-paused')
  document.querySelectorAll('.home-card-bridge').forEach((element) => element.remove())
}
