/* One look for every attached bottom panel on a phone (Sheet, Dialog, ConfirmDialog, DetailPopover, SnapSheet).
   Change it here and all of them follow. */
/** shell: radius, border, colour, shadow (no padding; SnapSheet uses this alone). */
export const PANEL_SHELL = "rounded-t-[1.75rem] border-t border-border bg-popover text-popover-foreground shadow-[0_-12px_40px_-12px_rgb(20_23_61/.35)]"
/** shell + phone padding. */
export const PANEL_SURFACE = PANEL_SHELL + " p-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
/** floating iOS card (ActionSheet, ShareSheet, Menu/Popover/ContextMenu on phones): inset, radius 24. */
export const FLOAT_CARD = "rounded-[1.5rem] border bg-card text-card-foreground shadow-[0_-10px_40px_-20px_rgb(20_23_61/.45)]"
/** the dock that holds a floating card (+ its Cancel pill) at the bottom edge. */
export const FLOAT_DOCK = "vks-sheet-up fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md space-y-2 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] focus:outline-none"
/** the separate Cancel pill under a floating card. */
export const FLOAT_CANCEL = "vks-btn vks-btn-soft flex min-h-13 w-full items-center justify-center rounded-full border bg-card text-[15px] font-bold leading-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
/** the round close button in the top-right corner. */
export const PANEL_CLOSE = "vks-press absolute right-1.5 top-1.5 flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
/** centred-card look from 768 px (Dialog / ConfirmDialog only). */
export const PANEL_DESKTOP = "md:inset-x-auto md:bottom-auto md:w-[calc(100%-2rem)] md:rounded-2xl md:border md:p-6 md:shadow-[0_24px_60px_-20px_rgb(20_23_61/.45)]"
