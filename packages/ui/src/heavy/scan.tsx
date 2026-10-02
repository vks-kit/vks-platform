import * as React from "react"
import jsQR from "jsqr"
import { Camera, ImagePlus, SwitchCamera } from "lucide-react"
import { cn } from "../lib/cn"
import { Button } from "../components/button"
import { shrinkPhoto } from "@vks-kit/core"

type BD = { detect: (s: CanvasImageSource) => Promise<{ rawValue: string }[]> }
/** Native BarcodeDetector when the phone has it (fast, no CPU), jsQR fallback otherwise. */
async function makeDetector(): Promise<(v: HTMLVideoElement, c: HTMLCanvasElement) => Promise<string | null>> {
  const B = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => BD }).BarcodeDetector
  if (B) { const d = new B({ formats: ["qr_code"] }); return async (v) => (await d.detect(v))[0]?.rawValue ?? null }
  return async (v, c) => {
    const w = 320, h = Math.round((v.videoHeight / v.videoWidth) * w) || 240; c.width = w; c.height = h
    const g = c.getContext("2d", { willReadFrequently: true })!; g.drawImage(v, 0, 0, w, h)
    return jsQR(g.getImageData(0, 0, w, h).data, w, h)?.data ?? null
  }
}

/** Live QR scanner. Calls onScan once per code (same code ignored for 2 s). Stops the camera when unmounted. */
export function QrScanner({ onScan, onError, className }: { onScan: (text: string) => void; onError?: (e: Error) => void; className?: string }) {
  const video = React.useRef<HTMLVideoElement>(null), canvas = React.useRef<HTMLCanvasElement>(null)
  const [facing, setFacing] = React.useState<"environment" | "user">("environment"), [err, setErr] = React.useState<string | null>(null)
  React.useEffect(() => {
    let stop = false, stream: MediaStream | null = null, raf = 0, last = "", lastAt = 0
    ;(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing, width: { ideal: 640 } }, audio: false })
        if (stop) return stream.getTracks().forEach((t) => t.stop())
        const v = video.current!; v.srcObject = stream; await v.play()
        const detect = await makeDetector(); let busy = false, tick = 0
        const loop = async () => {
          if (stop) return
          if (!busy && ++tick % 4 === 0 && v.readyState >= 2) { // ~15 checks/s at 60 fps, gentle on cheap phones
            busy = true
            try { const t = await detect(v, canvas.current!); if (t && (t !== last || Date.now() - lastAt > 2000)) { last = t; lastAt = Date.now(); onScan(t) } } catch { /* frame failed, next one */ }
            busy = false
          }
          raf = requestAnimationFrame(loop)
        }
        loop()
      } catch (e) { setErr((e as Error).message); onError?.(e as Error) }
    })()
    return () => { stop = true; cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()) }
  }, [facing])
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-black", className)}>
      <video ref={video} playsInline muted className="aspect-square w-full object-cover" />
      <canvas ref={canvas} className="hidden" />
      <div className="pointer-events-none absolute inset-8 rounded-2xl border-4 border-gold/90 vks-ripple" />
      <button type="button" aria-label="switch camera" onClick={() => setFacing(facing === "environment" ? "user" : "environment")} className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full bg-black/50 text-white"><SwitchCamera className="size-5" /></button>
      {err && <div role="alert" className="absolute inset-x-0 bottom-0 bg-destructive p-3 text-sm text-destructive-foreground">{err}</div>}
    </div>
  )
}

/** Take a photo with the phone camera (or pick one), shrink to ~1280 px JPEG, hand back a Blob + preview URL. */
export function PhotoCapture({ onPhoto, label = "ຖ່າຍຮູບ", maxEdge = 1280, quality = 0.7, className }: { onPhoto: (p: { blob: Blob; url: string; bytes: number }) => void; label?: string; maxEdge?: number; quality?: number; className?: string }) {
  const input = React.useRef<HTMLInputElement>(null), [busy, setBusy] = React.useState(false)
  return (
    <div className={className}>
      <input ref={input} type="file" accept="image/*" capture="environment" className="hidden" onChange={async (e) => {
        const f = e.target.files?.[0]; if (!f) return; setBusy(true)
        try { const blob = await shrinkPhoto(f, maxEdge, quality); onPhoto({ blob, url: URL.createObjectURL(blob), bytes: blob.size }) } finally { setBusy(false); e.target.value = "" }
      }} />
      <Button type="button" variant="action" size="lg" disabled={busy} onClick={() => input.current?.click()}>{busy ? <ImagePlus className="animate-pulse" /> : <Camera />}{label}</Button>
    </div>
  )
}

/* ── Capture stamp: the time / site / GPS card burned into patrol photos and video frames ── */

/** What the stamp prints. `site` is optional; `gps` is a ready string such as "17.97570, 102.63310 (±8 m)". */
export type CaptureStampData = { time: string; site?: string; gps: string; brand?: string }

const STAMP_FONT = '"Noto Sans Lao Variable", "Noto Sans Lao", "Segoe UI", system-ui, sans-serif'
const NO_BREAK_BEFORE = /[\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD]/   // Lao vowel/tone marks must stay with their letter

function stampWrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number): string[] {
  const out: string[] = []; let line = ""
  for (const ch of Array.from(text)) {
    const next = line + ch
    if (line && ctx.measureText(next).width > maxW && !NO_BREAK_BEFORE.test(ch) && ch !== " ") { out.push(line.trimEnd()); line = ch.trimStart() } else line = next
  }
  if (line) out.push(line)
  if (out.length > maxLines) { const keep = out.slice(0, maxLines); keep[maxLines - 1] = keep[maxLines - 1].replace(/.{0,1}$/, "…"); return keep }
  return out
}

function stampRound(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}

function stampCard(ctx: CanvasRenderingContext2D, lines: { label: string; value: string }[], corner: "tl" | "br", w: number, h: number, S: number, glass: boolean) {
  const labelPx = Math.max(10, Math.round(S * 0.024)), valPx = Math.max(12, Math.round(S * 0.034)), gap = Math.round(S * 0.006), group = Math.round(S * 0.012)
  const padX = Math.round(S * 0.022), padY = Math.round(S * 0.016), margin = Math.round(S * 0.03)
  const maxContent = Math.max(S * 0.3, Math.min(w * 0.62, w - 2 * margin - 2 * padX))
  let maxW = 0, total = padY
  const rows = lines.map((ln, i) => {
    ctx.font = `${labelPx}px ${STAMP_FONT}`; maxW = Math.max(maxW, ctx.measureText(ln.label).width)
    ctx.font = `700 ${valPx}px ${STAMP_FONT}`
    const v = stampWrap(ctx, ln.value, maxContent, 3); v.forEach((t) => { maxW = Math.max(maxW, ctx.measureText(t).width) })
    total += labelPx + gap + v.length * valPx + (v.length - 1) * gap + (i < lines.length - 1 ? group : 0)
    return { label: ln.label, v }
  })
  total += padY
  const boxW = maxW + padX * 2, right = corner === "br"
  const x = right ? w - margin - boxW : margin, y = right ? h - margin - total : margin, textX = right ? x + boxW - padX : x + padX
  stampRound(ctx, x, y, boxW, total, Math.round(S * 0.02))
  ctx.fillStyle = `rgba(7,11,20,${glass ? 0.48 : 0.62})`; ctx.fill()
  ctx.lineWidth = Math.max(1, S * 0.0014); ctx.strokeStyle = `rgba(255,255,255,${glass ? 0.14 : 0.18})`; ctx.stroke()
  ctx.textAlign = right ? "right" : "left"; ctx.textBaseline = "top"
  let cy = y + padY
  rows.forEach((r) => {
    ctx.font = `${labelPx}px ${STAMP_FONT}`; ctx.fillStyle = "#74ff8a"; ctx.fillText(r.label, textX, cy); cy += labelPx + gap
    ctx.font = `700 ${valPx}px ${STAMP_FONT}`; ctx.fillStyle = "#ffffff"
    r.v.forEach((t, j) => { ctx.fillText(t, textX, cy); cy += valPx + (j < r.v.length - 1 ? gap : 0) })
    cy += group
  })
}

/**
 * Use to burn the capture stamp into a photo or video frame: top-left time, bottom-right site + GPS, top-right brand pill.
 * Draws on any 2D canvas (no React), sizes scale with the frame; for a live preview use CaptureStamp, for a ready Blob use stampPhoto.
 */
export function drawCaptureStamp(ctx: CanvasRenderingContext2D, w: number, h: number, data: CaptureStampData) {
  const S = Math.min(w, h)
  ctx.save()
  ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = Math.round(S * 0.01); ctx.shadowOffsetY = Math.round(S * 0.003)
  stampCard(ctx, [{ label: "CAPTURED", value: data.time }], "tl", w, h, S, false)
  ctx.shadowColor = "rgba(0,0,0,0.85)"; ctx.shadowBlur = Math.round(S * 0.014)
  const br = [...(data.site ? [{ label: "SITE", value: data.site }] : []), { label: "GPS", value: data.gps }]
  stampCard(ctx, br, "br", w, h, S, true)
  ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = Math.round(S * 0.006)
  const px = Math.max(12, Math.round(S * 0.034)), text = data.brand ?? "VKS"
  ctx.font = `800 ${px}px ${STAMP_FONT}`
  const tw = ctx.measureText(text).width, padX = Math.round(S * 0.018), padY = Math.round(S * 0.012), margin = Math.round(S * 0.03)
  const bw = tw + padX * 2, bh = px + padY * 2, x = w - margin - bw, y = margin
  stampRound(ctx, x, y, bw, bh, Math.round(S * 0.014)); ctx.fillStyle = "rgba(116,255,138,0.16)"; ctx.fill()
  ctx.lineWidth = Math.max(1, S * 0.0014); ctx.strokeStyle = "rgba(116,255,138,0.45)"; ctx.stroke()
  ctx.fillStyle = "#cfffd8"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(text, x + bw / 2, y + bh / 2 + S * 0.002)
  ctx.restore()
}

/** Use for the stamp's time text ("2026-09-10 14:32:05", local time); pass your own string if you need another format. */
export function stampTime(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/** Use to stamp a photo File/Blob: shrinks to maxEdge, burns drawCaptureStamp in, returns a JPEG Blob; for QR or plain photos use PhotoCapture instead. */
export async function stampPhoto(src: Blob, data: CaptureStampData, maxEdge = 1280, quality = 0.7): Promise<Blob> {
  const bmp = await createImageBitmap(src), r = Math.min(maxEdge / bmp.width, maxEdge / bmp.height, 1)
  const w = Math.round(bmp.width * r), h = Math.round(bmp.height * r), c = document.createElement("canvas"); c.width = w; c.height = h
  const ctx = c.getContext("2d")!; ctx.drawImage(bmp, 0, 0, w, h); bmp.close?.()
  if (document.fonts?.ready) await document.fonts.ready
  drawCaptureStamp(ctx, w, h, data)
  return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/jpeg", quality))
}

/** Use as a live-camera overlay that shows exactly what drawCaptureStamp will burn in (same code); for the final image use stampPhoto. */
export function CaptureStamp({ data, className }: { data: CaptureStampData; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null), box = React.useRef<HTMLDivElement>(null)
  const { time, site, gps, brand } = data
  React.useEffect(() => {
    const c = ref.current, b = box.current; if (!c || !b) return
    const draw = () => {
      const w = Math.max(1, Math.round(b.clientWidth)), h = Math.max(1, Math.round(b.clientHeight)), dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = w * dpr; c.height = h * dpr; const ctx = c.getContext("2d")!; ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h)
      drawCaptureStamp(ctx, w, h, { time, site, gps, brand })
    }
    draw(); const ro = new ResizeObserver(draw); ro.observe(b); document.fonts?.ready.then(draw)
    return () => ro.disconnect()
  }, [time, site, gps, brand])
  return <div ref={box} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}><canvas ref={ref} className="size-full" /></div>
}
