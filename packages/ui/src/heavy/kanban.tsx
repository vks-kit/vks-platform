import * as React from "react"
import { createPortal } from "react-dom"
import {
  DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, pointerWithin, rectIntersection, useSensor, useSensors, useDroppable,
  type CollisionDetection, type DragEndEvent, type DragOverEvent, type DragStartEvent,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check, ChevronRight, GripVertical, Plus } from "lucide-react"
import { haptics } from "@vks-kit/core"
import { cn } from "../lib/cn"
import { useIsMobile } from "../lib/use-media"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../components/overlay"

export type KanbanTone = "muted" | "primary" | "warning" | "success" | "destructive"
export type KanbanCard = { id: string; column: string; title: string; meta?: string; tone?: KanbanTone }
export type KanbanColumn = { id: string; title: string; tone?: KanbanTone }

const DOT: Record<KanbanTone, string> = { muted: "bg-muted-foreground/50", primary: "bg-primary", warning: "bg-warning", success: "bg-success", destructive: "bg-destructive" }
const EDGE: Record<KanbanTone, string> = { muted: "before:bg-muted-foreground/40", primary: "before:bg-primary", warning: "before:bg-warning", success: "before:bg-success", destructive: "before:bg-destructive" }

/** Move a card to another column (and position). Pure, so it is unit tested. */
export function moveCard(cards: KanbanCard[], id: string, toColumn: string, overId?: string): KanbanCard[] {
  const from = cards.findIndex((c) => c.id === id); if (from < 0) return cards
  const moved = { ...cards[from], column: toColumn }, rest = cards.filter((c) => c.id !== id)
  const at = overId ? rest.findIndex((c) => c.id === overId) : -1
  if (at >= 0) { rest.splice(at, 0, moved); return rest }
  const lastInCol = rest.map((c) => c.column).lastIndexOf(toColumn)
  rest.splice(lastInCol >= 0 ? lastInCol + 1 : rest.length, 0, moved); return rest
}

/**
 * Resolve a drop: `overId` is a card id or a column id.
 * Same column → reorder; other column → move (before the card, or to the end of the column).
 * Returns null when the target is unknown. Pure, so it is unit tested.
 */
export function dropCard(cards: KanbanCard[], id: string, overId: string, columnIds: string[]): { cards: KanbanCard[]; to: string } | null {
  const a = cards.find((c) => c.id === id); if (!a) return null
  const overCard = cards.find((c) => c.id === overId)
  const to = overCard ? overCard.column : columnIds.includes(overId) ? overId : null
  if (!to) return null
  if (overCard && overCard.column === a.column) {
    if (overId === id) return { cards, to }
    return { cards: arrayMove(cards, cards.indexOf(a), cards.indexOf(overCard)), to }
  }
  if (!overCard && to === a.column) return { cards, to }
  return { cards: moveCard(cards, id, to, overCard?.id), to }
}

/** cardLines from Kanban props, read by every card body (desktop, drag overlay, phone). */
const LinesCtx = React.createContext<1 | undefined>(undefined)

function CardBody({ card, lifted, phone }: { card: KanbanCard; lifted?: boolean; phone?: boolean }) {
  const lines = React.useContext(LinesCtx)
  return (
    <div className={cn("relative flex items-start gap-2 overflow-hidden rounded-xl border bg-card p-3 pl-3.5 text-card-foreground",
      "before:absolute before:inset-y-0 before:left-0 before:w-1", EDGE[card.tone ?? "muted"],
      lifted ? "rotate-2 scale-[1.04] shadow-[0_18px_40px_-12px_rgb(0_0_0/.35)] ring-2 ring-primary/30" : "shadow-sm transition-shadow hover:shadow-md")}>
      <div className={cn("min-w-0 flex-1", phone && "py-0.5")}>
        <div className={cn("font-semibold leading-normal", lines === 1 && "truncate")} title={lines === 1 ? card.title : undefined}>{card.title}</div>
        {card.meta && <div className={cn("mt-0.5 text-xs leading-normal text-muted-foreground", lines === 1 && "truncate")} title={lines === 1 ? card.meta : undefined}>{card.meta}</div>}
      </div>
      {phone ? <ChevronRight aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" /> : <GripVertical aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />}
    </div>
  )
}

function Card({ card, onOpen }: { card: KanbanCard; onOpen?: (c: KanbanCard) => void }) {
  const s = useSortable({ id: card.id, data: { type: "card" } })
  return (
    <div ref={s.setNodeRef} {...s.attributes} {...s.listeners} onClick={onOpen ? () => onOpen(card) : undefined}
      style={{ transform: CSS.Translate.toString(s.transform), transition: s.transition, touchAction: "manipulation" }}
      className={cn("cursor-grab select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
        s.isDragging && "opacity-35 [&>div]:border-dashed [&>div]:shadow-none")}>
      <CardBody card={card} />
    </div>
  )
}

function Column({ col, cards, onAdd, onOpen, emptyLabel, addLabel }: { col: KanbanColumn; cards: KanbanCard[]; onAdd?: (col: string) => void; onOpen?: (c: KanbanCard) => void; emptyLabel: string; addLabel: string }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id, data: { type: "column" } })
  return (
    <section ref={setNodeRef} aria-label={col.title}
      className={cn("flex w-[82%] max-w-[20rem] shrink-0 snap-start flex-col rounded-2xl bg-muted/60 p-2 transition-[box-shadow,background-color] duration-200 md:w-auto md:max-w-none",
        isOver && "bg-muted ring-2 ring-primary/40")}>
      <header className="flex items-center gap-2 px-2 pb-2 pt-1">
        <span className={cn("size-2 rounded-full", DOT[col.tone ?? "muted"])} />
        <h3 className="min-w-0 flex-1 truncate text-sm font-bold leading-normal">{col.title}</h3>
        <span key={cards.length} className="vks-badge-pop min-w-6 rounded-full bg-background px-2 py-0.5 text-center text-xs font-semibold tabular-nums text-muted-foreground">{cards.length}</span>
      </header>
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-24 flex-1 flex-col gap-2">
          {cards.map((c) => <Card key={c.id} card={c} onOpen={onOpen} />)}
          {cards.length === 0 && (
            <div className={cn("grid min-h-24 flex-1 place-items-center rounded-xl border-2 border-dashed px-3 text-center text-xs leading-normal text-muted-foreground transition-colors",
              isOver ? "border-primary/50 bg-primary/5" : "border-border")}>{emptyLabel}</div>
          )}
        </div>
      </SortableContext>
      {onAdd && (
        <button type="button" onClick={() => onAdd(col.id)}
          className="vks-press mt-2 flex min-h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground">
          <Plus className="size-4" />{addLabel}
        </button>
      )}
    </section>
  )
}

type KanbanProps = {
  columns: KanbanColumn[]; cards: KanbanCard[]; onChange: (cards: KanbanCard[], moved: { id: string; to: string }) => void
  onAdd?: (column: string) => void; onOpen?: (card: KanbanCard) => void; emptyLabel?: string; addLabel?: string; className?: string
  /**
   * 0.6: 1 = the title and the meta each stay on one line (longer text ends in …, full text on hover), so every card in
   * a column has the same height. Use it for boards people scan by row (appointments, tasks). Default: text wraps.
   */
  cardLines?: 1
  /** Phone only: heading of the move list in the card sheet. */
  moveLabel?: string; /** Phone only: text of the button that calls onOpen from the card sheet. */ openLabel?: string
  /**
   * Phone only. "move" (default, 0.5.x behaviour): a tap shows the "move to" sheet, with onOpen as its last button.
   * "open" (recommended when the card has its own actions): a tap opens the card (onOpen), the way every other list
   * works, and moving is done inside the record.
   */
  phoneTap?: "open" | "move"
}
function KanbanDesktop({ columns, cards, onChange, onAdd, onOpen, emptyLabel = "ລາກບັດມາວາງບ່ອນນີ້", addLabel = "ເພີ່ມບັດ", className }: KanbanProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const colIds = React.useMemo(() => columns.map((c) => c.id), [columns])
  const [active, setActive] = React.useState<KanbanCard | null>(null)
  const [items, setItems] = React.useState(cards)
  const itemsRef = React.useRef(cards), startCol = React.useRef("")
  const set = (next: KanbanCard[]) => { itemsRef.current = next; setItems(next) }
  const view = active ? items : cards

  /* Pointer inside a card beats pointer inside its column; fall back to overlap (keyboard, or pointer in a gap). */
  const collide: CollisionDetection = React.useCallback((args) => {
    const hits = pointerWithin(args)
    if (hits.length) { const card = hits.find((h) => !colIds.includes(String(h.id))); return [card ?? hits[0]] }
    return rectIntersection(args)
  }, [colIds])

  const start = (e: DragStartEvent) => {
    const c = cards.find((x) => x.id === e.active.id) ?? null
    set(cards); setActive(c); startCol.current = c?.column ?? ""; haptics.tap()
  }
  const over = (e: DragOverEvent) => {
    if (!e.over) return
    const id = String(e.active.id), overId = String(e.over.id), cur = itemsRef.current
    const a = cur.find((c) => c.id === id), overCard = cur.find((c) => c.id === overId)
    const to = overCard ? overCard.column : colIds.includes(overId) ? overId : null
    if (!a || !to || to === a.column) return
    set(moveCard(cur, id, to, overCard?.id))
  }
  const end = (e: DragEndEvent) => {
    const id = String(e.active.id), cur = itemsRef.current
    setActive(null)
    if (!e.over) return
    const r = dropCard(cur, id, String(e.over.id), colIds)
    const next = r?.cards ?? cur, to = next.find((c) => c.id === id)?.column ?? startCol.current
    const changed = next.length !== cards.length || next.some((c, i) => c.id !== cards[i].id || c.column !== cards[i].column)
    if (!changed) return
    if (to !== startCol.current) haptics.success()
    onChange(next, { id, to })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={collide} onDragStart={start} onDragOver={over} onDragEnd={end} onDragCancel={() => setActive(null)}>
      <div className={cn("-mx-1 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto scroll-px-1 px-1 pb-3 md:mx-0 md:grid md:snap-none md:px-0 md:grid-flow-col md:auto-cols-[minmax(8.5rem,1fr)] md:gap-2 md:overflow-x-auto", className)}>
        {columns.map((c) => <Column key={c.id} col={c} cards={view.filter((k) => k.column === c.id)} onAdd={onAdd} onOpen={onOpen} emptyLabel={emptyLabel} addLabel={addLabel} />)}
      </div>
      {/* Portal: a transformed ancestor (page enter animation) would otherwise offset the fixed overlay. */}
      {typeof document !== "undefined" && createPortal(
        <DragOverlay zIndex={60} dropAnimation={{ duration: 260, easing: "cubic-bezier(.32,.72,0,1)" }}>{active && <CardBody card={active} lifted />}</DragOverlay>, document.body)}
    </DndContext>
  )
}

/* Phone board: one column per screen (tabs + swipe). A tap opens the "move to" sheet, or the card (phoneTap="open"). No drag, so it never fights page scrolling. */
function KanbanPhone({ columns, cards, onChange, onAdd, onOpen, addLabel = "ເພີ່ມບັດ", moveLabel = "ຍ້າຍໄປ", openLabel = "ເບິ່ງລາຍລະອຽດ", className, phoneTap }: KanbanProps) {
  const tapOpens = phoneTap === "open" && !!onOpen
  const [idx, setIdx] = React.useState(0), [picked, setPicked] = React.useState<string | null>(null)
  const track = React.useRef<HTMLDivElement>(null), tabs = React.useRef<(HTMLButtonElement | null)[]>([])
  const card = cards.find((c) => c.id === picked)
  const go = (i: number) => { const el = track.current; if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" }); setIdx(i) }
  const onScroll = () => { const el = track.current; if (!el) return; const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth)); if (i !== idx && i >= 0 && i < columns.length) { setIdx(i); haptics.tap() } }
  React.useEffect(() => { tabs.current[idx]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }) }, [idx])
  const move = (to: string) => {
    if (!card) return
    setPicked(null)
    if (to === card.column) return
    haptics.success(); onChange(moveCard(cards, card.id, to), { id: card.id, to })
  }
  return (
    <div className={cn("space-y-3", className)}>
      <div role="tablist" aria-label="columns" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {columns.map((c, i) => { const n = cards.filter((k) => k.column === c.id).length, on = i === idx
          return <button key={c.id} ref={(el) => { tabs.current[i] = el }} role="tab" aria-selected={on} type="button" onClick={() => go(i)}
            className={cn("vks-press flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold leading-normal transition-colors",
              on ? "border-transparent bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
            <span className={cn("size-2 rounded-full", on ? "bg-primary-foreground" : DOT[c.tone ?? "muted"])} />{c.title}
            <span key={n} className={cn("vks-badge-pop min-w-6 rounded-full px-1.5 text-center text-xs tabular-nums", on ? "bg-primary-foreground/20" : "bg-muted")}>{n}</span>
          </button> })}
      </div>
      <div ref={track} onScroll={onScroll} className="-mx-1 flex snap-x snap-mandatory items-start overflow-x-auto px-1 [scrollbar-width:none]">
        {columns.map((c) => { const list = cards.filter((k) => k.column === c.id)
          return <section key={c.id} aria-label={c.title} className="w-full shrink-0 snap-center space-y-2 px-0.5 pb-2">
            {list.map((k) => <button key={k.id} type="button" onClick={() => (tapOpens ? onOpen!(k) : setPicked(k.id))} aria-haspopup="dialog"
              className="vks-press block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><CardBody card={k} phone /></button>)}
            {list.length === 0 && <div className="grid min-h-32 place-items-center rounded-xl border-2 border-dashed px-3 text-center text-sm leading-normal text-muted-foreground">ບໍ່ມີບັດໃນຄໍລຳນີ້</div>}
            {onAdd && <button type="button" onClick={() => onAdd(c.id)} className="vks-press flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed text-sm font-medium text-muted-foreground"><Plus className="size-4" />{addLabel}</button>}
          </section> })}
      </div>
      <Sheet open={!!card} onOpenChange={(o) => !o && setPicked(null)}>
        <SheetContent side="bottom">
          {card && <div className="space-y-3 leading-normal">
            <div className="pr-10"><SheetTitle>{card.title}</SheetTitle>{card.meta && <SheetDescription>{card.meta}</SheetDescription>}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{moveLabel}</div>
            <div className="space-y-1.5">
              {columns.map((c) => { const here = c.id === card.column
                return <button key={c.id} type="button" onClick={() => move(c.id)} aria-current={here || undefined}
                  className={cn("vks-press flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 text-left font-semibold", here ? "border-primary bg-primary/5" : "bg-card")}>
                  <span className={cn("size-2.5 rounded-full", DOT[c.tone ?? "muted"])} /><span className="min-w-0 flex-1 truncate">{c.title}</span>
                  {here && <Check className="size-4 text-primary" />}
                </button> })}
            </div>
            {onOpen && <button type="button" onClick={() => { setPicked(null); onOpen(card) }} className="vks-press flex min-h-12 w-full items-center justify-center gap-1 rounded-xl bg-muted text-sm font-semibold">{openLabel}<ChevronRight className="size-4" /></button>}
          </div>}
        </SheetContent>
      </Sheet>
    </div>
  )
}

/**
 * Task board. Desktop: drag cards between columns (mouse drags after 4 px; keyboard: Space + arrows; cards move live while dragging).
 * Desktop columns stay on one row and share the width (min 8.5rem); more than fit scroll sideways, never wrap to a second row.
 * Phone: no dragging — one column per screen with a tab strip (name + count) and swipe between columns; a tap opens the "move to" sheet, or with phoneTap="open" the card itself (onOpen).
 * Use for status boards (todo / doing / done); for a plain list use ListGroup instead. Import from "@vks-kit/ui/kanban".
 */
export function Kanban(props: KanbanProps) {
  const mobile = useIsMobile()
  return <LinesCtx.Provider value={props.cardLines}>{mobile ? <KanbanPhone {...props} /> : <KanbanDesktop {...props} />}</LinesCtx.Provider>
}
