// npm run kit:publish -- 0.2.2 [--dry]
// Bumps types, core and ui to ONE shared version, runs the checks, publishes to GitHub Packages
// (types -> core -> ui) using the logged-in `gh` token. The token is never printed or kept on disk
// after the run. Needs: gh auth with write:packages.
import { execSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const version = process.argv[2]
const dry = process.argv.includes("--dry")
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) { console.error("usage: npm run kit:publish -- <x.y.z> [--dry]"); process.exit(2) }
const run = (c, opts = {}) => execSync(c, { cwd: root, stdio: "inherit", ...opts })

const names = ["types", "core", "ui"]
for (const n of names) {
  const f = resolve(root, "packages", n, "package.json")
  const j = JSON.parse(readFileSync(f, "utf8"))
  j.version = version
  for (const d of Object.keys(j.dependencies ?? {})) if (d.startsWith("@vks-kit/")) j.dependencies[d] = "^" + version
  writeFileSync(f, JSON.stringify(j, null, 2) + "\n")
}
run("npm install --package-lock-only")
run("npm test"); run("npm run typecheck"); run("npm run build"); run("npm run build:docs")

const dir = mkdtempSync(join(tmpdir(), "vks-pub-"))
const rc = join(dir, ".npmrc")
try {
  const token = execSync("gh auth token", { encoding: "utf8" }).trim()
  writeFileSync(rc, "@vks-kit:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=" + token + "\n")
  for (const n of names) run('npm publish --userconfig "' + rc + '"' + (dry ? " --dry-run" : ""), { cwd: resolve(root, "packages", n) })
} finally { rmSync(dir, { recursive: true, force: true }) }
console.log("kit:publish: " + (dry ? "dry run ok" : "published") + " @vks-kit/{types,core,ui}@" + version + ". Now: git add -A && git commit && git push")
