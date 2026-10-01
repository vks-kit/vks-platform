import * as React from "react"
import { cn } from "../lib/cn"

/*
 * Official VKS mark, redrawn as vector from the brand file used by the QC dashboard
 * (Drive 1o7UGoZhLBG43hm-5eao8UYB4YjeQ_IhT, 959 px JPEG). Geometry traced on a 1000 grid.
 * variant="full"  = official colours, identical in both themes (it is a badge with its own field).
 * variant="mono"  = one colour (currentColor), for tiny sizes, stamps and print.
 */
const C = 470, CY = 482

/* laurel: leaf pairs along a curve from beside the shield top down to the blade (traced) */
function laurelLeaves() {
  const out: { x: number; y: number; r: number }[] = []
  const P0 = [262, 380], P1 = [240, 650], P2 = [418, 724]
  for (let i = 0; i < 10; i++) {
    const t = i / 9.4, u = 1 - t
    const x = u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], y = u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]
    const dx = 2 * u * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]), dy = 2 * u * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1])
    out.push({ x, y, r: (Math.atan2(dy, dx) * 180) / Math.PI + 90 }) // leaf tip points up the stem
  }
  return out
}
const LEAVES = laurelLeaves()
const leaf = "M0 -26 C 11 -15 11 9 0 26 C -11 9 -11 -15 0 -26 Z"

function Laurel({ mirror, mono }: { mirror?: boolean; mono?: boolean }) {
  return (
    <g transform={mirror ? "translate(940 0) scale(-1 1)" : undefined} fill={mono ? "currentColor" : "var(--logo-gold)"} stroke={mono ? "none" : "var(--logo-navy)"} strokeWidth="5" strokeLinejoin="round">
      {LEAVES.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.r.toFixed(1)})`}>
          <path d={leaf} transform={i === 0 ? undefined : "translate(-16 0) rotate(-30)"} />
          {i > 0 && <path d={leaf} transform="translate(16 0) rotate(30)" />}
        </g>
      ))}
    </g>
  )
}

/**
 * Official company names. Use these instead of typing the name by hand.
 * "VKS" is only the acronym. Lao uses composed sara-am (ຳ U+0EB3) so string compares match VKS data.
 */
export const BRAND = {
  short: "VKS",
  name: "Viengkham Security Service",
  legal: "Viengkham Security Service Sole Co., Ltd.",
  lo: "ວຽງຄຳບໍລິການຄວາມປອດໄພ",
  legalLo: "ບໍລິສັດ ວຽງຄຳບໍລິການຄວາມປອດໄພ ຈຳກັດຜູ້ດຽວ",
} as const

/** Use for the full VKS logo mark (variant="mono" for single-colour). For a square app icon / avatar-style tile use LogoTile instead; for brand strings use BRAND. */
export function Logo({ className, title = BRAND.name, variant = "full" }: { className?: string; title?: string; variant?: "full" | "mono" }) {
  const mono = variant === "mono"
  const navy = mono ? "currentColor" : "var(--logo-navy)"
  const id = React.useId().replace(/:/g, "")
  return (
    <svg role="img" aria-label={title} viewBox="88 100 764 764" className={cn("size-10 shrink-0", className)}>
      {/* octagon badge */}
      <polygon points="318,120 622,120 832,330 832,634 622,844 318,844 108,634 108,330" fill={mono ? "none" : "var(--logo-field)"} stroke={navy} strokeWidth="24" strokeLinejoin="miter" />
      <Laurel mono={mono} /><Laurel mirror mono={mono} />
      {/* blade below the shield */}
      <path d="M455 680 L455 748 L470 766 L485 748 L485 680 Z" fill={mono ? "none" : "var(--logo-steel)"} stroke={navy} strokeWidth="5" strokeLinejoin="round" />
      {/* shield */}
      <clipPath id={id}><path d="M318 386 C 380 356 420 346 470 346 C 520 346 560 356 622 386 L 622 470 C 622 590 552 668 470 690 C 388 668 318 590 318 470 Z" /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x="300" y="330" width="340" height="380" fill={mono ? "none" : "var(--logo-steel-2)"} />
        <rect x="360" y="330" width="53" height="380" fill={mono ? "none" : "var(--logo-steel)"} stroke={navy} strokeWidth="4" />
        <rect x="527" y="330" width="53" height="380" fill={mono ? "none" : "var(--logo-steel)"} stroke={navy} strokeWidth="4" />
        <rect x="413" y="330" width="114" height="380" fill={navy} />
      </g>
      <path d="M318 386 C 380 356 420 346 470 346 C 520 346 560 356 622 386 L 622 470 C 622 590 552 668 470 690 C 388 668 318 590 318 470 Z" fill="none" stroke={navy} strokeWidth="5" />
      {/* V K S, stacked, rounded stroke letters */}
      <g fill="none" stroke={mono ? "var(--logo-field)" : "var(--logo-letter)"} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round">
        <path d="M449 385 L449 436 L470 470 L491 436 L491 385" />
        <path d="M449 494 L449 568 M449 534 L491 494 M461 526 L491 568" />
        <path d="M491 600 Q491 588 470 588 Q449 588 449 606 Q449 622 470 624 Q491 626 491 644 Q491 662 470 662 Q449 662 449 650" />
      </g>
      {/* hilt: grip with wraps, crossguard with curled ends, pommel */}
      <g fill={mono ? "currentColor" : "var(--logo-gold)"} stroke={navy} strokeWidth="5" strokeLinejoin="round">
        <path d="M452 300 L452 226 L488 226 L488 300 Z" />
        <path d="M398 310 C 398 300 405 298 412 302 L 528 302 C 535 298 542 300 542 310 C 542 318 535 320 528 316 L 412 316 C 405 320 398 318 398 310 Z" />
        <path d="M449 222 L449 208 C449 196 459 194 470 194 C481 194 491 196 491 208 L491 222 Z" />
      </g>
      {!mono && <g stroke="var(--logo-navy)" strokeWidth="5" strokeLinecap="round"><path d="M452 244 L488 232 M452 262 L488 250 M452 280 L488 268 M452 298 L488 286" /></g>}
      <path d="M455 316 L455 346 L485 346 L485 316 Z" fill={mono ? "none" : "var(--logo-steel)"} stroke={navy} strokeWidth="5" />
    </svg>
  )
}

/** Logo on the navy app tile (PWA icon, splash, login). */
export function LogoTile({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center justify-center rounded-[22%] bg-[var(--logo-navy)] p-[12%] shadow-lg", className)}><Logo className="size-full" /></span>
}