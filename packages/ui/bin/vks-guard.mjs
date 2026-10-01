#!/usr/bin/env node
/** vks-guard [dir=src]: fails (exit 1) when an app breaks the VKS UI house rules. Add it to your "test" or CI script. */
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { scan } from "./guard-lib.mjs"

const dir = resolve(process.argv[2] ?? "src")
if (!existsSync(dir)) { console.error(`vks-guard: folder not found: ${dir}`); process.exit(2) }
const hits = scan(dir)
if (!hits.length) { console.log("vks-guard: OK, no rule violations"); process.exit(0) }
for (const h of hits) console.error(`${h.where}  [${h.rule}]  ${h.text}\n    -> ${h.fix}`)
console.error(`\nvks-guard: ${hits.length} violation(s)`)
process.exit(1)
