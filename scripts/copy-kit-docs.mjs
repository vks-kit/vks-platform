// prepack for @vks/ui: copies llms.txt + docs/ai into packages/ui/docs so AI docs travel with the kit.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const out = resolve(root, "packages/ui/docs")
rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
if (existsSync(resolve(root, "llms.txt"))) cpSync(resolve(root, "llms.txt"), resolve(out, "llms.txt"))
if (existsSync(resolve(root, "docs/ai"))) cpSync(resolve(root, "docs/ai"), resolve(out, "ai"), { recursive: true })
console.log("copy-kit-docs: ok")
