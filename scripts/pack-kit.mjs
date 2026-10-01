// npm run kit:pack -- 0.2.0  -> release/vks-{types,core,ui}-<version>.tgz with one shared version.
import { execSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const version = process.argv[2]
if (!version || !/^\d+\.\d+\.\d+/.test(version)) { console.error("usage: npm run kit:pack -- <x.y.z>"); process.exit(2) }
const out = resolve(root, "release")
mkdirSync(out, { recursive: true })
const names = ["types", "core", "ui"]
const files = names.map((n) => resolve(root, "packages", n, "package.json"))
const originals = files.map((f) => readFileSync(f, "utf8"))
try {
  files.forEach((f, i) => {
    const j = JSON.parse(originals[i])
    j.version = version
    for (const k of ["dependencies"]) for (const d of Object.keys(j[k] ?? {})) if (d.startsWith("@vks/")) j[k][d] = "^" + version
    writeFileSync(f, JSON.stringify(j, null, 2) + "\n")
  })
  for (const n of names) execSync("npm pack --pack-destination \"" + out + "\"", { cwd: resolve(root, "packages", n), stdio: "inherit" })
} finally {
  files.forEach((f, i) => writeFileSync(f, originals[i]))
}
console.log("kit:pack: done ->", out)
