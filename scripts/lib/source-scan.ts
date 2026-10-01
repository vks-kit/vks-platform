/**
 * Plain-text scanners shared by `scripts/ai-index.ts` and `tests/guardrails.test.ts`.
 * No parser dependency: the UI kit keeps one export per line, so line scanning is enough.
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

export const ROOT = fileURLToPath(new URL("../..", import.meta.url)).replace(/[\\/]$/, "")
export const rel = (p: string) => relative(ROOT, p).split(sep).join("/")

/** Every file under `dir` whose name matches `re`, skipping node_modules and dist. */
export function walk(dir: string, re: RegExp, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, re, out)
    else if (re.test(name)) out.push(p)
  }
  return out
}

export type ExportDecl = { name: string; file: string; line: number; doc?: string }

const EXPORT_RE = /^export (?:async )?(?:function|const|class) ([A-Za-z_$][\w$]*)/

/** PascalCase component name. Excludes constants like BRAND or LAO_MONTHS, keeps short tags like TR / TH / TD. */
export const isComponentName = (n: string) => /^[A-Z]/.test(n) && !n.includes("_") && !/^[A-Z0-9]{4,}$/.test(n)

/** The JSDoc block that ends on the line directly above `idx`, flattened to one string. */
function docAbove(lines: string[], idx: number): string | undefined {
  let i = idx - 1
  if (i < 0 || !lines[i].trim().endsWith("*/")) return undefined
  const end = i
  while (i >= 0 && !lines[i].includes("/**")) i--
  if (i < 0) return undefined
  return lines.slice(i, end + 1).join("\n")
    .replace(/^\s*\/\*\*\s?/, "").replace(/\s*\*\/\s*$/, "")
    .split("\n").map((l) => l.replace(/^\s*\*\s?/, "").trim()).filter(Boolean).join(" ")
}

/** Top-level `export function|const|class` declarations in one file, with their JSDoc. */
export function scanExports(file: string): ExportDecl[] {
  const lines = readFileSync(file, "utf8").split(/\r?\n/)
  const out: ExportDecl[] = []
  lines.forEach((l, i) => { const m = l.match(EXPORT_RE); if (m) out.push({ name: m[1], file: rel(file), line: i + 1, doc: docAbove(lines, i) }) })
  return out
}

/** Source files that make up the public UI kit: components/ and heavy/. */
export const uiSourceFiles = () => [
  ...walk(join(ROOT, "packages/ui/src/components"), /\.tsx?$/),
  ...walk(join(ROOT, "packages/ui/src/heavy"), /\.tsx?$/),
]

/** Map of exported component name -> declaration, across the whole UI kit. */
export function componentDecls(): Map<string, ExportDecl> {
  const map = new Map<string, ExportDecl>()
  for (const f of uiSourceFiles()) for (const d of scanExports(f)) if (isComponentName(d.name) && !map.has(d.name)) map.set(d.name, d)
  return map
}

/** Names inside `import { A, type B, C as D } from "..."`. */
export function namesInImport(line: string): string[] {
  const m = line.match(/\{([^}]*)\}/)
  if (!m) return []
  return m[1].split(",").map((s) => s.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim()).filter(Boolean)
}
