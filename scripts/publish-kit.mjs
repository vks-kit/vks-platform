// npm run kit:publish -- 0.2.2 [--dry] [--no-deploy]
// Bumps types, core and ui to ONE shared version, runs the checks, publishes to GitHub Packages
// (types -> core -> ui) using the logged-in `gh` token. The token is never printed or kept on disk
// after the run. Then deploys the docs (https://ui.vks-security.com, Pages project vks-ui-docs) and the
// gallery (vks-ui-gallery) from the builds the checks just made, and checks the live docs show the new
// version. Releases go to the local Gitea, whose push does not run the GitHub deploy workflow, so without
// this step the docs site fell behind (it showed 0.5.4 while the kit was at 0.6.3).
// Needs: gh auth with write:packages; wrangler logged in to the Cloudflare account that owns vks-ui-docs.
// --dry skips the publish and the deploy; --no-deploy publishes but leaves the sites alone.
import { execSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const version = process.argv[2]
const dry = process.argv.includes("--dry")
const deploy = !dry && !process.argv.includes("--no-deploy")
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) { console.error("usage: npm run kit:publish -- <x.y.z> [--dry] [--no-deploy]"); process.exit(2) }
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

// Docs + gallery: the dist folders were built above with this version. A failed deploy does not undo the publish;
// it says so and how to retry, then exits 1.
const DOCS_URL = "https://ui.vks-security.com"
let deployed = "skipped (" + (dry ? "--dry" : "--no-deploy") + ")"
if (deploy) {
  try {
    const msg = '--commit-message "VKS UI ' + version + '" --commit-dirty=true'
    run("npx wrangler pages deploy dist --project-name=vks-ui-docs --branch=main " + msg, { cwd: resolve(root, "apps/docs") })
    run("npx wrangler pages deploy dist --project-name=vks-ui-gallery --branch=main " + msg, { cwd: resolve(root, "apps/gallery") })
    deployed = await liveVersion() ? DOCS_URL + " shows " + version : "deployed, but " + DOCS_URL + " does not show " + version + " yet (cache?): open it with Ctrl+F5"
  } catch (e) {
    console.error("kit:publish: published, but the docs deploy failed: " + (e instanceof Error ? e.message.split("\n")[0] : e))
    console.error("Retry the deploy only: cd apps/docs && npx wrangler pages deploy dist --project-name=vks-ui-docs --branch=main")
    process.exit(1)
  }
}
console.log("kit:publish: " + (dry ? "dry run ok" : "published") + " @vks-kit/{types,core,ui}@" + version + " · docs: " + deployed + ". Now: git add -A && git commit && git push")

/** The live docs page loads one index-*.js; the kit version is baked into it. Pages can take a few seconds to switch. */
async function liveVersion() {
  for (let i = 0; i < 6; i++) {
    try {
      const html = await (await fetch(DOCS_URL + "/?v=" + Date.now(), { headers: { "cache-control": "no-cache" } })).text()
      const js = html.match(/\/assets\/index-[^"]+\.js/)?.[0]
      if (js && (await (await fetch(DOCS_URL + js)).text()).includes('"' + version + '"')) return true
    } catch { /* offline: try again */ }
    await new Promise((r) => setTimeout(r, 5000))
  }
  return false
}
