#!/usr/bin/env node
/**
 * vks-check <url> [--login email:password] [--pages a,b,c] [--open "button text"]... [--channel chrome|msedge] [--browser path]
 * Opens the app in a real browser at 360x640, 390x844 and 1440x900, walks every nav tab (or --pages hashes) and
 * fails (exit 1) when something is wider than the screen, a dialog's buttons are below the screen, a phone tap
 * target is under 44 px, or the console shows an error. --open clicks a button by its text on each page and checks the
 * dialog it opens too (e.g. --open ກັ່ນຕອງ --open "ເພີ່ມເບີໂທ").
 * Needs Playwright where you run it: npm i -D playwright && npx playwright install chromium (not a kit dependency).
 */
import { createRequire } from "node:module"
import { resolve } from "node:path"
import { SIZES, MIN_TAP, measure, report } from "./check-lib.mjs"

const args = process.argv.slice(2), url = args.find((a) => !a.startsWith("--") && /^https?:/.test(a))
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined }
const many = (k) => args.flatMap((a, i) => (a === k ? [args[i + 1]] : []))
if (!url) { console.error("usage: vks-check <url> [--login email:password] [--pages a,b] [--open \"button text\"]"); process.exit(2) }
let chromium
try { chromium = createRequire(resolve("package.json"))("playwright").chromium } catch {
  try { chromium = (await import("playwright")).chromium } catch { console.error("vks-check: Playwright not found. In your app: npm i -D playwright && npx playwright install chromium"); process.exit(2) }
}
const [email, password] = (opt("--login") ?? "").split(":")
const opens = many("--open"), wanted = opt("--pages")?.split(",").filter(Boolean)

// Prefer the Chrome or Edge already installed (no download); --browser <path> or Playwright's own browser otherwise
const channel = opt("--channel"), executablePath = opt("--browser")
let browser
for (const o of executablePath ? [{ executablePath }] : channel ? [{ channel }] : [{ channel: "chrome" }, { channel: "msedge" }, {}]) {
  try { browser = await chromium.launch(o); break } catch (e) { if (!Object.keys(o).length || executablePath || channel) { console.error("vks-check: no browser (" + e.message.split("\n")[0] + "). Install Chrome, or run: npx playwright install chromium"); process.exit(2) } }
}
const lines = []
for (const size of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, isMobile: size.mobile, hasTouch: size.mobile })
  const box = { minTap: MIN_TAP, width: size.width, height: size.height }
  const page = await ctx.newPage(), errors = []
  page.on("pageerror", (e) => errors.push(e.message)); // script errors only: "Failed to load resource" is the network (a 401 before sign-in, a missing icon), the
  // page itself reports a failed request it cares about
  page.on("console", (m) => { if (m.type() === "error" && !/^Failed to load resource/.test(m.text())) errors.push(m.text()) })
  await page.goto(url, { waitUntil: "networkidle" })
  if (email) {
    const box = page.locator("input[type=email], input[autocomplete=username]").first()
    if (await box.count()) { await box.fill(email); await page.locator("input[type=password]").first().fill(password ?? ""); await page.locator("button[type=submit]").first().click(); await page.waitForLoadState("networkidle") }
  }
  // the nav: bottom nav on a phone, sidebar on desktop; or the hashes given with --pages
  const tabs = wanted ?? await page.evaluate(() => [...document.querySelectorAll("nav button, aside nav button")].map((b) => b.textContent.trim()).filter(Boolean))
  let first = true
  for (const t of tabs.length ? tabs : [""]) {
    if (!first) errors.length = 0   // errors while loading belong to the first page
    first = false
    if (wanted) await page.evaluate((h) => { location.hash = "/" + h }, t)
    else if (t) { const b = page.locator("nav button", { hasText: t }).first(); if (await b.isVisible()) await b.click() }
    await page.waitForTimeout(1200)
    lines.push(...report(size, t || "/", await page.evaluate(measure, box), errors))
    for (const o of opens) {
      const b = page.getByRole("button", { name: o }).first(); if (!(await b.count()) || !(await b.isVisible())) continue
      await b.click(); await page.waitForTimeout(900)
      lines.push(...report(size, (t || "/") + " > " + o, await page.evaluate(measure, box), errors))
      await page.keyboard.press("Escape"); await page.waitForTimeout(500)
    }
  }
  await ctx.close()
}
await browser.close()
if (!lines.length) { console.log("vks-check: OK at " + SIZES.map((s) => s.width + "x" + s.height).join(", ")); process.exit(0) }
for (const l of lines) console.error(l)
console.error("\nvks-check: " + lines.length + " problem(s). Rules: docs/ai/design-thinking.md (phone rules)")
process.exit(1)
