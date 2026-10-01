/**
 * One place that shrinks a phone photo before upload: ~1280 px long side, JPEG q=0.7 (about 180 KB).
 * Browser only (uses canvas). Server side savePhoto() will accept the resulting Blob and store it in R2.
 */
export function fitSize(w: number, h: number, maxSide = 1280) {
  const scale = Math.min(1, maxSide / Math.max(w, h))
  return { width: Math.round(w * scale), height: Math.round(h * scale) }
}
export async function shrinkPhoto(file: Blob, maxSide = 1280, quality = 0.7): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const { width, height } = fitSize(bmp.width, bmp.height, maxSide)
  const c = document.createElement("canvas")
  c.width = width; c.height = height
  c.getContext("2d")!.drawImage(bmp, 0, 0, width, height)
  return await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/jpeg", quality))
}
