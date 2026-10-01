import * as React from "react"
import { createPortal } from "react-dom"
import { useIsMobile } from "./use-media"
import { FLOAT_CARD } from "./panel"

/** true on phones: menus and popovers dock to the bottom as a sheet instead of floating next to the trigger. */
export const useSheetMode = () => useIsMobile("(max-width: 639px)")

/** Extra class for a Radix popper content when it should behave as a bottom sheet (see .vks-sheet-mode in animations.css). */
export const SHEET_CLS = "vks-sheet-mode vks-sheet-up mx-auto mb-2 w-[calc(100%-1rem)] max-w-md p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] focus:outline-none " + FLOAT_CARD

/** Dimmed backdrop + grabber shown with a sheet-mode popper. Decorative: Radix already handles outside-tap dismissal. */
export const SheetScrim = () => createPortal(<div aria-hidden className="vks-scrim pointer-events-none fixed inset-0 z-40 bg-[color-mix(in_oklab,var(--foreground)_35%,transparent)]" data-state="open" />, document.body)
export const SheetGrabber = () => <div aria-hidden className="vks-grabber" style={{ margin: "4px auto 8px" }} />
/** Cancel row at the bottom of a sheet-mode menu/popover (Esc-equivalent, so Radix closes and restores focus). */
export const SheetCancel = ({ label = "ຍົກເລີກ" }: { label?: string }) => (
  <button type="button" onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))}
    className="vks-press mt-1 flex min-h-12 w-full items-center justify-center rounded-2xl border-t border-border pt-0.5 text-[15px] font-bold leading-normal hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</button>
)