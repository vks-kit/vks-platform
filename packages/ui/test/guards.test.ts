/**
 * Guardrails for humans and AI agents. Plain file scanning, no extra packages.
 * If one fails, the message says exactly what to change. See AGENTS.md.
 */
import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { ROOT, rel, walk, componentDecls, namesInImport } from "../../../scripts/lib/source-scan"
import { buildAiIndex } from "../../../scripts/lib/ai-index-build"
import { docs } from "../../../apps/docs/src/docs/registry"

const appFiles = walk(join(ROOT, "apps"), /\.(tsx?|css)$/).filter((f) => !/[\\/](public|test)[\\/]/.test(f))
const read = (f: string) => readFileSync(f, "utf8")

/** Files allowed to show raw colours: the theming guide prints the token values on purpose. */
const HEX_ALLOW = new Set(["apps/docs/src/docs/guides.tsx"])

describe("apps use the design system, not its building blocks", () => {
  it("no direct Radix / cva / lucide / sonner imports in apps", () => {
    const bad: string[] = []
    const re = /from\s+["'](radix-ui|@radix-ui\/[^"']+|class-variance-authority|lucide-react|sonner)["']/
    for (const f of appFiles) read(f).split(/\r?\n/).forEach((l, i) => { if (re.test(l)) bad.push(`${rel(f)}:${i + 1}  ${l.trim()}`) })
    expect(bad, "Import from \"@vks/ui\" (icons: \"@vks/ui/icons\") instead").toEqual([])
  })

  it("no deep imports into packages/ui internals", () => {
    const bad: string[] = []
    for (const f of appFiles) read(f).split(/\r?\n/).forEach((l, i) => { if (/from\s+["'](@vks\/ui\/src|[./]+\/packages\/ui)/.test(l)) bad.push(`${rel(f)}:${i + 1}`) })
    expect(bad, "Use the public entry points: @vks/ui, @vks/ui/icons, /charts, /map, /kanban, /scan").toEqual([])
  })

  it("no raw colours in apps (hex / rgb / hsl / oklch)", () => {
    const bad: string[] = []
    const re = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{3}\b(?![\d])|\b(rgba?|hsla?|oklch)\(/
    for (const f of appFiles) {
      if (HEX_ALLOW.has(rel(f))) continue
      read(f).split(/\r?\n/).forEach((l, i) => {
        const hit = l.match(re)
        if (!hit) return
        if (/^#\d+$/.test(hit[0])) return                 // "#142" = a record number, not a colour
        if (/^\s*(\/\/|\*)/.test(l)) return              // comments
        bad.push(`${rel(f)}:${i + 1}  ${hit[0]}`)
      })
    }
    expect(bad, "Use a token: bg-primary, text-gold, var(--success)… (packages/ui/src/styles/theme.css)").toEqual([])
  })
})

describe("every component is findable", () => {
  const decls = componentDecls()

  it("every exported component has a doc comment", () => {
    const missing = [...decls.values()].filter((d) => !d.doc).map((d) => `${d.file}:${d.line}  ${d.name}`)
    expect(missing, 'Add /** Use for X; for Y use Z instead. */ above the export').toEqual([])
  })

  it("every exported component appears in some docs entry importLine", () => {
    const documented = new Set(docs.flatMap((d) => namesInImport(d.importLine)))
    const missing = [...decls.values()].filter((d) => !documented.has(d.name)).map((d) => `${d.name}  (${d.file})`)
    expect(missing, "Add it to an importLine (and a demo/example) in apps/docs/src/docs/*.tsx, then npm run ai:index").toEqual([])
  })

  it("docs slugs are unique", () => {
    const slugs = docs.map((d) => d.slug)
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it("llms.txt and docs/ai are up to date", () => {
    const stale: string[] = []
    for (const [p, c] of buildAiIndex()) {
      const abs = join(ROOT, p)
      if (!existsSync(abs) || read(abs).replace(/\r\n/g, "\n") !== c) stale.push(p)
    }
    expect(stale, "Run: npm run ai:index").toEqual([])
  })
})
