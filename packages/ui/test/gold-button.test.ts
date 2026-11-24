import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const read = (f: string) => readFileSync(resolve(__dirname, "../src", f), "utf8")
const hex = (h: string) => [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16) / 255)
const lum = (h: string) => { const [r, g, b] = hex(h).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const ratio = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }

describe("metallic gold button", () => {
  const theme = read("styles/theme.css")
  // the :root block and the .dark { … } block (not the "@custom-variant dark" line above them)
  const root = theme.slice(theme.indexOf(":root {")), dark = theme.slice(theme.search(/^\.dark \{/m))
  const blocks = [root.slice(0, root.indexOf("\n}")), dark.slice(0, dark.indexOf("\n}"))]
  const tok = (css: string, n: string) => (css.match(new RegExp("--" + n + ":\\s*(#[0-9a-fA-F]{6})")) ?? [])[1]
  it("has every metal token in light and dark", () => {
    for (const css of blocks) for (const n of ["gold-metal-hi", "gold-metal", "gold-metal-lo", "gold-metal-end", "gold-edge"]) expect(tok(css, n), n).toMatch(/^#/)
  })
  it("navy text is readable on every stop of the metal (>= 4.5:1) in both themes", () => {
    for (const css of blocks) {
      const fg = tok(css, "gold-foreground")!
      for (const n of ["gold-metal-hi", "gold-metal", "gold-metal-lo", "gold-metal-end"]) expect(ratio(fg, tok(css, n)!), n).toBeGreaterThanOrEqual(4.5)
    }
  })
  it("the gold variant uses the metal class and no raw colours", () => {
    const btn = read("components/button.tsx")
    const gold = btn.match(/gold: "([^"]+)"/)![1]
    expect(gold).toContain("vks-btn-gold")
    expect(gold).not.toMatch(/#[0-9a-fA-F]{3,6}/)
    const css = read("styles/animations.css").split("\n").filter((l) => l.startsWith(".vks-btn-gold") || l.startsWith(".dark .vks-btn-gold")).join("\n")
    expect(css).toContain("var(--gold-metal-hi)")
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}/)
  })
})
