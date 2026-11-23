import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../lib/cn"

/**
 * Use for a long thing shown only in part (a list preview, a table on a dashboard tile, a screenshot in the docs): it
 * fades out at its foot instead of being cut at an arbitrary line, so it reads as "this goes on". It is a mask, not a
 * colour laid over the foot, so it fades into whatever it sits on, in both themes. Give expandable to add one
 * "ເບິ່ງທັງໝົດ" button that opens the rest (and "ຫຍໍ້" to fold it again). Keep real content in the top part and let
 * the fade fall on filler or older rows. For a list that must be read in full use DataTable; for paging use Pagination.
 */
export function FadeCrop({ height = 280, fadeFrom = 58, fadeTo = 96, expandable, moreLabel = "ເບິ່ງທັງໝົດ", lessLabel = "ຫຍໍ້", open: openProp, onOpenChange, className, children }: {
  /** Height of the visible part, px or any CSS length. Default 280. */
  height?: number | string
  /** Where the fade starts and ends, % of the height. Default 58 → 96. */
  fadeFrom?: number
  fadeTo?: number
  /** Adds a button that shows the rest. */
  expandable?: boolean
  moreLabel?: string
  lessLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}) {
  const [own, setOwn] = React.useState(false)
  const open = openProp ?? own
  const set = (o: boolean) => { if (openProp === undefined) setOwn(o); onOpenChange?.(o) }
  const mask = "linear-gradient(to bottom, #000 " + fadeFrom + "%, transparent " + fadeTo + "%)"
  return (
    <div className={cn("relative min-w-0", className)}>
      <div className={cn("min-w-0", !open && "overflow-hidden")}
        style={open ? undefined : { height: typeof height === "number" ? height + "px" : height, maskImage: mask, WebkitMaskImage: mask }}>
        {children}
      </div>
      {expandable && (
        <div className={cn("flex justify-center", open ? "mt-2" : "absolute inset-x-0 bottom-0")}>
          <button type="button" aria-expanded={open} onClick={() => set(!open)}
            className="vks-press inline-flex min-h-11 items-center gap-1.5 rounded-full border bg-card px-4 text-sm font-semibold text-foreground shadow-sm hover:bg-muted [&_svg]:size-4">
            {open ? lessLabel : moreLabel}<ChevronDown className={cn("transition-transform duration-200", open && "rotate-180")} aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
