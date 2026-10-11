import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { isChunkLoadError } from "../src/components/feedback"

describe("isChunkLoadError", () => {
  it("knows a page file that failed to download", () => {
    expect(isChunkLoadError(new TypeError("Failed to fetch dynamically imported module: http://x/src/pages/Scan.tsx"))).toBe(true)
    expect(isChunkLoadError(new TypeError("Importing a module script failed."))).toBe(true)
    expect(isChunkLoadError(new Error("error loading dynamically imported module"))).toBe(true)
    expect(isChunkLoadError(new Error("Loading chunk 42 failed."))).toBe(true)
  })
  it("leaves real crashes alone", () => {
    expect(isChunkLoadError(new TypeError("Cannot read properties of undefined (reading 'map')"))).toBe(false)
    expect(isChunkLoadError(null)).toBe(false)
  })
})

describe("AppShell", () => {
  it("wraps every page in a PageBoundary, so a failed page is never a white screen", () => {
    const src = readFileSync(new URL("../src/components/shell.tsx", import.meta.url), "utf8")
    expect(src).toMatch(/<main[^>]*>\s*<PageBoundary resetKey=\{active\}>\{children\}<\/PageBoundary>/)
  })
})
