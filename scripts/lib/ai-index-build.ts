/**
 * Builds the AI catalogue (llms.txt + one markdown file per docs entry) from the docs registry.
 * Pure: returns path -> content so the guard test can check the committed files are fresh.
 */
import { docs, guides } from "../../apps/docs/src/docs/registry"
import { GROUP_ORDER, type Doc } from "../../apps/docs/src/docs/types"
import { componentDecls, namesInImport } from "./source-scan"

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim()
const cell = (s = "") => oneLine(s).replace(/\|/g, "\\|")
const fence = (code: string, lang = "tsx") => "```" + lang + "\n" + code.trim() + "\n```"

function docPage(d: Doc, decls: ReturnType<typeof componentDecls>): string {
  const out: string[] = [`# ${d.name}`, "", `> ${oneLine(d.desc)}`, ""]
  out.push(`- Group: ${d.group}${d.badge ? ` · ${d.badge}` : ""}`, `- Source: \`${d.file}\``, `- Live docs: #/docs/${d.slug}`, "", fence(d.importLine, "ts"), "")
  const names = namesInImport(d.importLine).filter((n) => decls.has(n))
  if (names.length) {
    out.push("## When to use", "")
    for (const n of names) out.push(`- **${n}**: ${decls.get(n)!.doc ?? "(no doc comment)"}`)
    out.push("")
  }
  if (d.usage) out.push("## Usage", "", d.usage.trim(), "")
  out.push("## Example", "", fence(d.code), "")
  for (const e of d.examples ?? []) {
    out.push(`### ${e.title}`, "")
    if (e.note) out.push(oneLine(e.note), "")
    out.push(fence(e.code), "")
  }
  if (d.props?.length) {
    out.push("## Props", "", "| Prop | Type | Default | Notes |", "| --- | --- | --- | --- |")
    for (const p of d.props) out.push(`| ${cell(p.name)} | ${cell(p.type)} | ${cell(p.def ?? "")} | ${cell(p.desc)} |`)
    out.push("")
  }
  if (d.notes?.length) { out.push("## Notes", ""); for (const n of d.notes) out.push(`- ${oneLine(n)}`); out.push("") }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n"
}

/** linkBase: "docs/ai/" for the repo-root copy, "ai/" for the copy the docs site serves. */
function llms(linkBase: string): string {
  const out = [
    "# VKS UI (@vks/ui)", "",
    "> Shared React 19 + Tailwind v4 design system for VKS Security apps (Guard Navy + Gold, Lao-first, mobile-first). Search this list before building any UI: reuse a part if it fits, extend it with a prop/variant if it almost fits, and only then add a new part to packages/ui + apps/gallery + apps/docs.", "",
    "Rules: import only from \"@vks/ui\" (icons from \"@vks/ui/icons\", heavy parts from \"@vks/ui/charts\" | \"/map\" | \"/kanban\" | \"/scan\"); colours only via theme tokens; see AGENTS.md.", "",
  ]
  for (const g of GROUP_ORDER) {
    const items = docs.filter((d) => d.group === g)
    if (!items.length) continue
    out.push(`## ${g}`, "")
    for (const d of items) out.push(`- [${d.name}](${linkBase}${d.slug}.md): ${oneLine(d.desc)} Exports: ${namesInImport(d.importLine).join(", ")}`)
    out.push("")
  }
  out.push("## Optional", "")
  for (const g of guides) out.push(`- [${g.name}](${linkBase}${g.slug}.md): ${oneLine(g.desc)}`)
  return out.join("\n").trimEnd() + "\n"
}

const guidePage = (g: (typeof guides)[number]) =>
  `# ${g.name}\n\n> ${oneLine(g.desc)}\n\n- Group: ${g.group}\n- Live docs: #/docs/${g.slug}\n\nThis is a prose guide; read it on the docs site (npm run dev:docs).\n`

/** Every generated file, keyed by repo-relative path. */
export function buildAiIndex(): Map<string, string> {
  const decls = componentDecls()
  const files = new Map<string, string>()
  files.set("llms.txt", llms("docs/ai/"))
  files.set("apps/docs/public/llms.txt", llms("ai/"))
  for (const d of docs) { const md = docPage(d, decls); files.set(`docs/ai/${d.slug}.md`, md); files.set(`apps/docs/public/ai/${d.slug}.md`, md) }
  for (const g of guides) { const md = guidePage(g); files.set(`docs/ai/${g.slug}.md`, md); files.set(`apps/docs/public/ai/${g.slug}.md`, md) }
  return files
}
