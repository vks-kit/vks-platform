/**
 * npm run ai:index
 * Regenerates llms.txt and docs/ai/*.md (plus the copies under apps/docs/public) from the docs registry,
 * and deletes stale .md files, so the AI catalogue can never drift from the docs.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { ROOT } from "./lib/source-scan"
import { buildAiIndex } from "./lib/ai-index-build"

const files = buildAiIndex()
for (const dir of ["docs/ai", "apps/docs/public/ai"]) {
  const abs = join(ROOT, dir)
  if (!existsSync(abs)) continue
  for (const f of readdirSync(abs)) if (f.endsWith(".md") && !files.has(`${dir}/${f}`)) rmSync(join(abs, f))
}
for (const [p, c] of files) { const abs = join(ROOT, p); mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, c) }
const pages = [...files.keys()].filter((p) => p.startsWith("docs/ai/")).length
console.log(`ai:index wrote llms.txt + ${pages} pages (docs/ai and apps/docs/public/ai)`)
