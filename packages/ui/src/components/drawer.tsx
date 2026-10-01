import * as React from "react"
import { Sheet, SheetContent, SheetTitle } from "./overlay"
import { useIsMobile } from "../lib/use-media"
import { ArrowLeft } from "lucide-react"
import { CloseButton } from "./close-button"

/**
 * Detail panel. Desktop: slides in from the right beside the list.
 * Phone: full-screen page with a sticky back header (rule 5 in the kit: detail = full-screen overlay + back).
 */
export function Drawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const mobile = useIsMobile()
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side={mobile ? "fullscreen" : "right"} className={mobile ? "flex flex-col p-0" : "flex w-full max-w-md flex-col p-0"}>
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card px-3 py-3">
          {mobile
            ? <button type="button" aria-label="ກັບຄືນ" onClick={onClose} className="vks-press flex size-11 items-center justify-center rounded-full hover:bg-muted"><ArrowLeft /></button>
            : <CloseButton onClick={onClose} />}
          <SheetTitle className="text-base">{title}</SheetTitle>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && <div className="border-t bg-card p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </SheetContent>
    </Sheet>
  )
}
