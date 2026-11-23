/**
 * Rule scanner shared by the `vks-guard` CLI and the monorepo tests.
 * Plain Node, no dependencies. Scans app source for the three house rules.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const SKIP = new Set(["node_modules", "dist", "build", ".git", "public", "test", "tests", "__tests__"])
const FILE = /\.(tsx?|css)$/
const IMPORT = /from\s+["'](radix-ui|@radix-ui\/[^"']+|class-variance-authority|lucide-react|sonner)["']/
const DEEP = /from\s+["'](@vks(?:-kit)?\/(?:ui|core|types)\/(?:src|bin)|[./]+\/packages\/(?:ui|core|types))/
const COLOUR = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{3}\b(?![\d])|\b(rgba?|hsla?|oklch)\(/

export function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (FILE.test(name)) out.push(p)
  }
  return out
}

/** Returns [{ rule, where, text, fix }] for every violation under `dir`. */
export function scan(dir, { allow = [] } = {}) {
  const hits = []
  for (const f of walk(dir)) {
    const where = relative(dir, f).replace(/\\/g, "/")
    if (allow.includes(where)) continue
    readFileSync(f, "utf8").split(/\r?\n/).forEach((l, i) => {
      const at = `${where}:${i + 1}`
      if (IMPORT.test(l)) hits.push({ rule: "direct-import", where: at, text: l.trim(), fix: 'Import from "@vks-kit/ui" (icons: "@vks-kit/ui/icons")' })
      if (DEEP.test(l)) hits.push({ rule: "deep-import", where: at, text: l.trim(), fix: "Use @vks-kit/ui, /icons, /theme.css, /charts, /map, /kanban, /scan, @vks-kit/core or @vks-kit/types" })
      const m = l.match(COLOUR)
      if (m && !/^#\d+$/.test(m[0]) && !/^\s*(\/\/|\*)/.test(l)) hits.push({ rule: "raw-colour", where: at, text: m[0], fix: "Use a token: bg-primary, text-gold, var(--success)" })
    })
  }
  return hits
}
