import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../lib/cn"

/** Round 44 px close X with a quiet muted hover and the shared press; every built-in close (Alert, Banner, Dialog, Sheet, Drawer) uses these classes. */
export const CLOSE_BUTTON = "vks-press vks-close inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4"

/** Use for any "close this" X on a card, banner or panel (Lao label "ປິດ", 44 px hit area). For a back arrow on a pushed page use the PageHeader back button instead; for a text "ຍົກເລີກ" use Button variant="ghost" instead. */
export function CloseButton({ className, children, "aria-label": label = "ປິດ", type = "button", ...p }: React.ComponentProps<"button">) {
  return <button type={type} aria-label={label} className={cn(CLOSE_BUTTON, className)} {...p}>{children ?? <X />}</button>
}
