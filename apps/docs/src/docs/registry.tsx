import type * as React from "react"
import { actionDocs } from "./actions"
import { formDocs } from "./form"
import { dateDocs } from "./dates"
import { feedbackDocs } from "./feedback"
import { dataDocs } from "./data"
import { layoutDocs } from "./layout"
import { heavyDocs } from "./heavy"
import { moreDocs } from "./more"
import { mobile2Docs } from "./mobile2"
import { desktopDocs } from "./desktop"
import { kit061Docs } from "./kit061"
import { domainDocs } from "./domain"
import { Introduction, Installation, Theming, Typography, Motion, MobileRules, LayoutRules, DesignThinking, Changelog } from "./guides"
import { designThinkingMd } from "./design-thinking"
import { ReportsGuide, FormsGuide } from "./pattern-guides"
import { reportsMd } from "./reports-guide"
import { formsMd } from "./form-guide"
import { Responsive } from "./responsive"
import { GROUP_ORDER, type Doc, type Group } from "./types"

export type Guide = { slug: string; name: string; group: Group; badge?: Doc["badge"]; desc: string; page: React.FC; /** Full text for the AI catalogue; without it the .md only links to the docs site. */ md?: () => string }
export const guides: Guide[] = [
  { slug: "introduction", name: "Introduction", group: "Getting Started", desc: "What @vks-kit/ui is and why it looks the way it does.", page: Introduction },
  { slug: "installation", name: "Installation", group: "Getting Started", desc: "Add the design system to a new app in the monorepo.", page: Installation },
  { slug: "theming", name: "Theming", group: "Foundations", desc: "Theme A (Guard Navy + Gold) and Theme E (Night Watch).", page: Theming },
  { slug: "typography", name: "Typography & Lao", group: "Foundations", desc: "Font, scale and the Lao text rules.", page: Typography },
  { slug: "motion", name: "Motion", group: "Foundations", badge: "New", desc: "The animation kit: small, fast, transform-only.", page: Motion },
  { slug: "mobile", name: "Mobile rules", group: "Getting Started", badge: "Mobile", desc: "The ten rules every VKS screen follows.", page: MobileRules },
  { slug: "layout-rules", name: "Layout rules", group: "Getting Started", badge: "New", desc: "Desktop vs mobile anatomy, the 768 px breakpoint and the motion rules.", page: LayoutRules },
  { slug: "design-thinking", name: "Design thinking", group: "Getting Started", badge: "New", desc: "One job per page, content first, hide what is used sometimes. The rules that keep VKS screens from getting cluttered.", page: DesignThinking, md: designThinkingMd },
  { slug: "responsive", name: "Desktop ↔ Mobile", group: "Getting Started", badge: "New", desc: "When a table becomes cards, a sidebar becomes a bottom nav, a dialog becomes a sheet. Live, at real widths.", page: Responsive },
  { slug: "forms", name: "Form pattern", group: "Getting Started", badge: "New", desc: "Lao labels, 16 px inputs, errors under the field, one submit button with four states, never lose what was typed.", page: FormsGuide, md: formsMd },
  { slug: "reports", name: "Reports (PDF & PPTX)", group: "Getting Started", badge: "New", desc: "House layout for PDF and PPTX reports: cover, KPI row, table, footer, and the Lao font settings each format needs.", page: ReportsGuide, md: reportsMd },
  { slug: "changelog", name: "Changelog", group: "Getting Started", desc: "What changed in each version.", page: Changelog },
]
export const docs: Doc[] = [...actionDocs, ...formDocs, ...dateDocs, ...feedbackDocs, ...dataDocs, ...layoutDocs, ...heavyDocs, ...moreDocs, ...mobile2Docs, ...desktopDocs, ...kit061Docs, ...domainDocs]

export type Entry = { slug: string; name: string; group: Group; badge?: Doc["badge"]; desc: string }
export const entries: Entry[] = [...guides, ...docs]
export const nav = GROUP_ORDER.map((g) => ({ group: g, items: entries.filter((e) => e.group === g) })).filter((x) => x.items.length)
export const flat = nav.flatMap((g) => g.items)
export const find = (slug: string) => ({ guide: guides.find((g) => g.slug === slug), doc: docs.find((d) => d.slug === slug) })