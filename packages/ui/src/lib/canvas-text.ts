/** Small canvas helpers shared by every "draw a card / receipt / stamp as an image" part. No React. */

/** Shrink a line until it fits max px (down to min), then cut it with …; returns the text and the size used. */
export function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, size: number, max: number, font: string, min = size * 0.7): [string, number] {
  let sz = size
  ctx.font = weight + " " + sz + "px " + font
  while (ctx.measureText(text).width > max && sz > min) { sz -= 1; ctx.font = weight + " " + sz + "px " + font }
  let t = text
  while (t.length > 1 && ctx.measureText(t).width > max) t = t.slice(0, -2) + "…"
  return [t, sz]
}

/** Wait until the given weights of a font are loaded (Lao text drawn before that falls back to boxes). Never throws. */
export async function loadFonts(font: string, weights: number[] = [400, 600, 700, 800], sample = "ກຂ"): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return
  await Promise.all(weights.map((w) => document.fonts.load(w + " 30px " + font, sample).catch(() => null)))
}

/** Load an image (logo, photo) for drawing; resolves null instead of failing. */
export const loadImage = (src: string) => new Promise<HTMLImageElement | null>((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src })
