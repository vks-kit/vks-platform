import * as React from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { ChevronUp, Crosshair, Minus, Plus, X } from "lucide-react"
import { useIsMobile } from "../lib/use-media"
import { cn } from "../lib/cn"
import { PANEL_SHELL } from "../lib/panel"

export type Pin = {
  id: string; lat: number; lng: number; label?: string; tone?: "success" | "warning" | "danger" | "primary"
  /** Second line in the hover tip and the pin card (e.g. guard name, status). */
  sub?: string
  /** Small right-aligned meta (e.g. "08:12"). */
  meta?: string
}
/* Leaflet divIcons are raw HTML, so pins read theme tokens through CSS vars (see .vks-pin in animations.css). */
const toneVar = { success: "var(--success)", warning: "var(--warning)", danger: "var(--destructive)", primary: "var(--primary)" }
const icon = (t: Pin["tone"] = "primary", on = false) => L.divIcon({
  className: "vks-pin-wrap", iconSize: [30, 30], iconAnchor: [15, 15],
  html: '<span class="vks-pin' + (t === "danger" ? " vks-pin-live" : "") + (on ? " vks-pin-on" : "") + '" style="--pin:' + toneVar[t] + '"><i></i></span>',
})
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
/** Hover tip HTML: tone dot + title, optional sub line and meta. Styled by .vks-map-tip. */
const tipHtml = (p: Pin) =>
  '<span class="vks-map-tip-row"><b style="--pin:' + toneVar[p.tone ?? "primary"] + '"></b><span>' + esc(p.label ?? "") + "</span>" + (p.meta ? "<em>" + esc(p.meta) + "</em>" : "") + "</span>"
  + (p.sub ? '<small>' + esc(p.sub) + "</small>" : "")

const ctl = "flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted active:bg-muted focus-visible:bg-muted focus-visible:outline-none [&_svg]:size-[18px]"
const toneText = { success: "text-success", warning: "text-warning", danger: "text-destructive", primary: "text-primary dark:text-gold" }

/**
 * OpenStreetMap tiles via Leaflet, VKS-styled: glass +/- and "fit pins" controls (44 px), pulsing token pins
 * (danger pins keep pulsing), Noto Sans Lao card tooltips, an optional pin card that springs up from the bottom
 * when a pin is tapped (phones have no hover), and a tiny OSM credit (required by the tile licence).
 * On phones, with 2+ pins, a bottom sheet lists every pin (tap a row to fly there and open its card), because small pins are hard to hit
 * with a thumb; pass list={false} to turn it off. Import from "@vks-kit/ui/map" only where a map is shown. Point-in-radius check is in @vks-kit/core/geo.
 */
export function MapView({ pins, height = 320, onPin, center = [17.9757, 102.6331], zoom = 12, tips = "hover", card, renderCard, list, flush }: {
  pins: Pin[]; height?: number | string; onPin?: (id: string) => void; center?: [number, number]; zoom?: number
  /** "hover" (default): tip on hover / focus. "always": labels stay on the map. "none": no tips. */
  tips?: "hover" | "always" | "none"
  /** Tapping a pin opens a card at the bottom of the map. On by default when renderCard is given. */
  card?: boolean
  /** Custom body for the pin card (buttons, photo, etc.). Title, tone and close button are drawn for you. */
  renderCard?: (pin: Pin) => React.ReactNode
  /** Phone pin list sheet. Default: on for phones when there are 2+ pins. */
  /** Phone only: draw edge to edge (no rounded corners or border) so the map fills a full-width screen. Desktop is unchanged. */
  flush?: boolean
  list?: boolean
}) {
  const mobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const sheet = React.useRef<HTMLDivElement>(null), peek = React.useRef<HTMLDivElement>(null)
  const [drag, setDrag] = React.useState<number | null>(null), [hide, setHide] = React.useState(0)
  const y0 = React.useRef(0)
  React.useLayoutEffect(() => {
    const s = sheet.current, p = peek.current; if (!s || !p) return
    const f = () => setHide(Math.max(0, s.offsetHeight - p.offsetHeight))
    f(); const ro = new ResizeObserver(f); ro.observe(s); return () => ro.disconnect()
  })
  const el = React.useRef<HTMLDivElement>(null), map = React.useRef<L.Map | null>(null), layer = React.useRef<L.LayerGroup | null>(null)
  const [sel, setSel] = React.useState<Pin | null>(null)
  // keep the last card mounted while it plays its exit animation
  const [shown, setShown] = React.useState<Pin | null>(null)
  React.useEffect(() => {
    if (sel) { setShown(sel); return }
    const t = setTimeout(() => setShown(null), 240)
    return () => clearTimeout(t)
  }, [sel])
  const view = sel ?? shown
  const showCard = card ?? !!renderCard
  const showList = (list ?? mobile) && pins.length > 1
  const pick = (p: Pin) => { map.current?.flyTo([p.lat, p.lng], Math.max(map.current.getZoom(), 15), { duration: 0.5 }); setOpen(false); if (showCard) setSel(p); onPin?.(p.id) }
  const fit = React.useCallback((animate = true) => {
    const m = map.current; if (!m) return
    if (pins.length) m.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])), { padding: [36, 36], maxZoom: 16, animate })
    else m.setView(center, zoom, { animate })
  }, [pins, center, zoom])
  React.useEffect(() => {
    if (!el.current || map.current) return
    map.current = L.map(el.current, { zoomControl: false, attributionControl: false, zoomSnap: 0.5 }).setView(center, zoom)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map.current)
    layer.current = L.layerGroup().addTo(map.current)
    map.current.on("click", () => setSel(null))
    return () => { map.current?.remove(); map.current = null }
  }, [])
  React.useEffect(() => {
    const g = layer.current; if (!g || !map.current) return
    g.clearLayers()
    pins.forEach((p) => {
      const mk = L.marker([p.lat, p.lng], { icon: icon(p.tone, sel?.id === p.id), keyboard: true, title: p.label ?? "" }).addTo(g)
      if (p.label && tips !== "none" && !(showCard && sel?.id === p.id))
        mk.bindTooltip(tipHtml(p), { direction: "top", offset: [0, -14], permanent: tips === "always", className: "vks-map-tip" + (tips === "always" ? " vks-map-tip-fixed" : "") })
      mk.on("click", (e) => { L.DomEvent.stopPropagation(e); if (showCard) setSel(p); onPin?.(p.id) })
    })
  }, [pins, onPin, tips, showCard, sel])
  React.useEffect(() => { fit(false) }, [pins]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (sel && !pins.some((p) => p.id === sel.id)) setSel(null) }, [pins, sel])
  const rowOf = (p: Pin) => (
    <button type="button" tabIndex={open || p === pins[0] ? 0 : -1} onClick={() => pick(p)} className="flex min-h-16 w-full items-center gap-3 px-4 text-left active:bg-muted">
      <span className={"grid size-11 shrink-0 place-items-center rounded-full bg-current/10 " + toneText[p.tone ?? "primary"]}><span className="size-3 rounded-full bg-current" /></span>
      <span className="min-w-0 flex-1 border-b py-2.5"><span className="flex items-baseline gap-2"><span className="truncate text-[15px] font-semibold">{p.label}</span>{p.meta && <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{p.meta}</span>}</span>{p.sub && <span className="block truncate text-sm text-muted-foreground">{p.sub}</span>}</span>
    </button>
  )
  return (
    <div style={{ height }} className={cn("relative isolate z-0 overflow-hidden", flush ? "max-md:rounded-none max-md:border-0 md:rounded-2xl md:border md:shadow-[0_12px_32px_-20px_rgb(20_23_61/.35)]" : "rounded-2xl border shadow-[0_12px_32px_-20px_rgb(20_23_61/.35)]")}>
      <div ref={el} className="vks-map absolute inset-0" />
      <div className={cn("pointer-events-none absolute inset-0 z-[400] shadow-[inset_0_0_0_1px_rgb(255_255_255/.08),inset_0_-40px_40px_-40px_rgb(20_23_61/.25)]", flush ? "max-md:rounded-none md:rounded-2xl" : "rounded-2xl")} />
      <div inert={showList && !sel ? true : undefined} className={"absolute right-3 top-3 z-[500] flex flex-col gap-2 transition-opacity duration-200 " + (showList && !sel ? "pointer-events-none opacity-0" : "opacity-100")}>
        <div className="vks-glass flex flex-col overflow-hidden rounded-2xl border shadow-[0_8px_20px_-10px_rgb(20_23_61/.45)]">
          <button type="button" aria-label="ຊູມເຂົ້າ" onClick={() => map.current?.zoomIn()} className={ctl}><Plus /></button>
          <span className="mx-2.5 h-px bg-border" />
          <button type="button" aria-label="ຊູມອອກ" onClick={() => map.current?.zoomOut()} className={ctl}><Minus /></button>
        </div>
        <button type="button" aria-label="ເບິ່ງທຸກຈຸດ" onClick={() => fit()} className={ctl + " vks-glass rounded-2xl border shadow-[0_8px_20px_-10px_rgb(20_23_61/.45)] text-primary dark:text-gold"}><Crosshair /></button>
      </div>
      {showList && (
        <div ref={sheet} inert={sel ? true : undefined} className={"absolute inset-x-0 bottom-0 z-[550] leading-normal will-change-transform " + PANEL_SHELL}
          style={{ transform: sel ? "translate3d(0,calc(100% + 4rem),0)" : "translate3d(0," + Math.min(hide, Math.max(0, (open ? 0 : hide) + (drag ?? 0))) + "px,0)", transition: drag === null ? "transform .3s var(--ease-out-quint)" : "none" }}>
          <div className="absolute -top-14 right-3">
            <button type="button" aria-label="ເບິ່ງທຸກຈຸດ" onClick={() => fit()} className={ctl + " vks-glass rounded-full border shadow-[0_8px_20px_-10px_rgb(20_23_61/.45)] text-primary dark:text-gold"}><Crosshair /></button>
          </div>
          <div ref={peek}>
            <div role="button" tabIndex={0} aria-expanded={open} aria-label={open ? "ຫຍໍ້ລາຍການ" : "ຂະຫຍາຍລາຍການ"}
              className="flex h-8 w-full cursor-grab touch-none items-center justify-center"
              onPointerDown={(e) => { y0.current = e.clientY; setDrag(0); e.currentTarget.setPointerCapture(e.pointerId) }}
              onPointerMove={(e) => { if (drag !== null) setDrag(e.clientY - y0.current) }}
              onPointerUp={() => { const d = drag ?? 0; setDrag(null); if (Math.abs(d) < 8) setOpen(!open); else setOpen(d < 0) }}
              onPointerCancel={() => setDrag(null)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open) } }}>
              <span aria-hidden className="h-1 w-10 rounded-full bg-foreground/25" />
            </div>
            <div className="flex items-baseline justify-between px-4 pb-1">
              <p className="text-base font-bold">{pins.length} ຈຸດ</p>
              <button type="button" onClick={() => setOpen(!open)} className="-mr-2 flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-semibold text-primary active:bg-muted dark:text-gold">{open ? "ຫຍໍ້" : "ເບິ່ງທັງໝົດ"}<ChevronUp className={"size-4 transition-transform duration-300 " + (open ? "rotate-180" : "")} /></button>
            </div>
            {rowOf(pins[0])}
          </div>
          <ul className="max-h-56 overflow-y-auto overscroll-contain pb-3" aria-hidden={!open}>
            {pins.slice(1).map((p) => <li key={p.id}>{rowOf(p)}</li>)}
          </ul>
        </div>
      )}
      {view && showCard && (
        <div key={view.id} role="dialog" aria-label={view.label} data-state={sel ? "open" : "closed"} className="vks-map-card vks-glass absolute inset-x-3 bottom-3 z-[600] rounded-2xl border p-3 pr-2 leading-normal shadow-[0_16px_36px_-16px_rgb(20_23_61/.55)] sm:left-auto sm:w-80">
          <div className="flex items-start gap-2.5">
            <span className={"mt-1.5 size-2.5 shrink-0 rounded-full bg-current " + toneText[view.tone ?? "primary"]} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2"><p className="truncate font-semibold">{view.label}</p>{view.meta && <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{view.meta}</span>}</div>
              {view.sub && <p className="text-sm text-muted-foreground">{view.sub}</p>}
            </div>
            <button type="button" aria-label="ປິດ" onClick={() => setSel(null)} className="-my-1.5 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted [&_svg]:size-4"><X /></button>
          </div>
          {renderCard && <div className="mt-2.5">{renderCard(view)}</div>}
        </div>
      )}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className={"absolute right-2 z-[500] rounded-full bg-card/70 px-1.5 text-[9px] leading-normal text-muted-foreground/80 backdrop-blur " + ((sel && showCard) || showList ? "top-1.5 left-2 right-auto" : "bottom-1.5")}>© OSM</a>
    </div>
  )
}