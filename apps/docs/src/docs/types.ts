import type * as React from "react"
import type { Device, Example, Prop } from "./kit"

export type Group = "Getting Started" | "Foundations" | "Actions" | "Form" | "Dates" | "Feedback" | "Overlays" | "Data display" | "Layout & navigation" | "Mobile & touch" | "Heavy (lazy)"
export type Doc = {
  slug: string; name: string; group: Group; badge?: "New" | "Stable" | "Mobile" | "Lazy"
  desc: string; file: string; importLine: string
  demo: React.FC; code: string; usage?: string
  examples?: Example[]; props?: Prop[]; notes?: string[]
  /** Where this part makes sense: desktop only, phone only, or both (default). Drives the preview switcher. */
  device?: Device
  /** Phone preview shows this demo edge to edge (no page padding), like a real full-width screen. */
  bleed?: boolean
}
export const GROUP_ORDER: Group[] = ["Getting Started", "Foundations", "Actions", "Form", "Dates", "Feedback", "Overlays", "Data display", "Layout & navigation", "Mobile & touch", "Heavy (lazy)"]