let size = 0
let pixelCount = 0
let canvas = null
let ctx = null
let queue = null
let visited = null
let maskA = null
let maskB = null

function initialize(nextSize) {
  if (!Number.isFinite(nextSize) || nextSize <= 0) throw new Error('Invalid hero chroma-key size')
  size = nextSize
  pixelCount = size * size
  canvas = new OffscreenCanvas(size, size)
  ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Unable to create hero chroma-key context')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  queue = new Int32Array(pixelCount)
  visited = new Uint8Array(pixelCount)
  maskA = new Uint8Array(pixelCount)
  maskB = new Uint8Array(pixelCount)
}

function keyFrame(bitmap) {
  if (!ctx || !canvas) throw new Error('Hero chroma-key worker is not initialized')
  const vw = bitmap.width
  const vh = bitmap.height
  if (!vw || !vh) throw new Error('Hero video frame has no dimensions')
  const s = Math.min(vw, vh)
  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(bitmap, vw - s, 0, s, s, 0, 0, size, size)
  const img = ctx.getImageData(0, 0, size, size)
  const d = img.data
  // 底色参考 = 四角均值(逐帧自适应光照/暗角)
  let rr = 0
  let rg = 0
  let rb = 0
  for (const p of [(2 * size + 2), (2 * size + size - 3), ((size - 3) * size + 2), ((size - 3) * size + size - 3)]) {
    rr += d[p * 4]
    rg += d[p * 4 + 1]
    rb += d[p * 4 + 2]
  }
  rr /= 4
  rg /= 4
  rb /= 4
  const TOL2 = 56 * 56
  visited.fill(0)
  let qh = 0
  let qt = 0
  const tryPush = (p) => {
    if (visited[p]) return
    const i = p * 4
    const dr = d[i] - rr
    const dg = d[i + 1] - rg
    const db = d[i + 2] - rb
    if (dr * dr + dg * dg + db * db < TOL2) {
      visited[p] = 1
      queue[qt++] = p
    }
  }
  for (let x = 0; x < size; x++) {
    tryPush(x)
    tryPush(pixelCount - size + x)
  }
  for (let y = 1; y < size - 1; y++) {
    tryPush(y * size)
    tryPush(y * size + size - 1)
  }
  while (qh < qt) {
    const p = queue[qh++]
    const x = p % size
    if (x > 0) tryPush(p - 1)
    if (x < size - 1) tryPush(p + 1)
    if (p >= size) tryPush(p - size)
    if (p < pixelCount - size) tryPush(p + size)
  }
  // —— 边缘整形:收边 1px(去沾底色的最外圈)→ 两道 3×3 盒模糊软化蒙版 → 去边 ——
  for (let p = 0; p < pixelCount; p++) maskA[p] = visited[p] ? 0 : 255
  for (let p = 0; p < pixelCount; p++) {
    if (!maskA[p]) {
      maskB[p] = 0
      continue
    }
    const x = p % size
    maskB[p] =
      (x > 0 && !maskA[p - 1]) ||
      (x < size - 1 && !maskA[p + 1]) ||
      (p >= size && !maskA[p - size]) ||
      (p < pixelCount - size && !maskA[p + size])
        ? 0
        : 255
  }
  // 两轮 H+V 盒模糊(半径 1,边界夹取)≈ 高斯软化,过渡带约 4px
  for (let round = 0; round < 2; round++) {
    for (let p = 0; p < pixelCount; p++) {
      const x = p % size
      const l = x > 0 ? maskB[p - 1] : maskB[p]
      const r = x < size - 1 ? maskB[p + 1] : maskB[p]
      maskA[p] = (l + maskB[p] + r) / 3
    }
    for (let p = 0; p < pixelCount; p++) {
      const u = p >= size ? maskA[p - size] : maskA[p]
      const dn = p < pixelCount - size ? maskA[p + size] : maskA[p]
      maskB[p] = (u + maskA[p] + dn) / 3
    }
  }
  for (let p = 0; p < pixelCount; p++) {
    const a = maskB[p]
    const i = p * 4
    d[i + 3] = a
    // 去边:半透明过渡像素按 alpha 反混掉底色成分,消除浅紫描边
    if (a > 24 && a < 250) {
      d[i] = Math.max(0, Math.min(255, (d[i] * 255 - (255 - a) * rr) / a))
      d[i + 1] = Math.max(0, Math.min(255, (d[i + 1] * 255 - (255 - a) * rg) / a))
      d[i + 2] = Math.max(0, Math.min(255, (d[i + 2] * 255 - (255 - a) * rb) / a))
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.transferToImageBitmap()
}

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'init') {
    try {
      initialize(data.size)
    } catch (error) {
      self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) })
    }
    return
  }
  if (data.type !== 'frame' || !data.bitmap) return

  const inputBitmap = data.bitmap
  let outputBitmap = null
  try {
    outputBitmap = keyFrame(inputBitmap)
    self.postMessage({ type: 'frame', bitmap: outputBitmap }, [outputBitmap])
    outputBitmap = null
  } catch (error) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) })
  } finally {
    outputBitmap?.close()
    inputBitmap.close()
  }
})
