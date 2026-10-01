import { describe, it, expect } from "vitest"
import { indexKey, groupByIndex, shareUrls } from "../src/components/mobile-kit"
import { fuzzyScore, flattenTree, fmtBytes, acceptsFile, parseTags, type TreeNode } from "../src/components/desktop-kit"

describe("indexKey / groupByIndex", () => {
  it("Latin → uppercase first letter", () => expect(indexKey("alice")).toBe("A"))
  it("digits → #", () => expect(indexKey("7-Eleven")).toBe("#"))
  it("skips Lao lead vowel", () => expect(indexKey("ເພັດ")).toBe("ພ"))
  it("groups and keeps items", () => {
    const g = groupByIndex([{ label: "bob" }, { label: "ann" }, { label: "ben" }])
    expect(g.map((x) => x.key)).toEqual(["A", "B"])
    expect(g[1].items.map((i) => i.label).sort()).toEqual(["ben", "bob"])
  })
})
describe("shareUrls", () => {
  it("encodes text + url", () => { const u = shareUrls("ລາຍງານ QC", "https://x.la/r?a=1"); expect(u.whatsapp).toContain(encodeURIComponent("ລາຍງານ QC https://x.la/r?a=1")); expect(u.facebook).toContain(encodeURIComponent("https://x.la/r?a=1")) })
})
describe("fuzzyScore", () => {
  it("empty query matches all", () => expect(fuzzyScore("", "anything")).toBeGreaterThan(0))
  it("substring beats subsequence", () => expect(fuzzyScore("pat", "patrol")).toBeGreaterThan(fuzzyScore("ptl", "patrol")))
  it("subsequence matches", () => expect(fuzzyScore("ptl", "patrol")).toBeGreaterThan(0))
  it("no match = 0", () => expect(fuzzyScore("xyz", "patrol")).toBe(0))
  it("Lao substring", () => expect(fuzzyScore("ລາຍງານ", "ເປີດ ລາຍງານ")).toBeGreaterThan(0))
})
describe("flattenTree", () => {
  const t: TreeNode[] = [{ id: "a", label: "A", children: [{ id: "a1", label: "A1" }] }, { id: "b", label: "B" }]
  it("collapsed hides children", () => expect(flattenTree(t, new Set()).map((r) => r.node.id)).toEqual(["a", "b"]))
  it("expanded shows children with depth + parent", () => { const r = flattenTree(t, new Set(["a"])); expect(r.map((x) => x.node.id)).toEqual(["a", "a1", "b"]); expect(r[1]).toMatchObject({ depth: 1, parent: "a" }) })
})
describe("files + tags", () => {
  it("fmtBytes", () => { expect(fmtBytes(500)).toBe("500 B"); expect(fmtBytes(1536)).toBe("1.5 KB"); expect(fmtBytes(10 * 1024 * 1024)).toBe("10 MB") })
  it("acceptsFile", () => { expect(acceptsFile({ name: "a.PDF", type: "application/pdf" }, "image/*,.pdf")).toBe(true); expect(acceptsFile({ name: "a.png", type: "image/png" }, "image/*")).toBe(true); expect(acceptsFile({ name: "a.exe", type: "x" }, "image/*,.pdf")).toBe(false); expect(acceptsFile({ name: "a", type: "" })).toBe(true) })
  it("parseTags splits, trims, dedupes, caps", () => { expect(parseTags(" a, b ;a\nc  d", ["B"])).toEqual(["B", "a", "c d"]); expect(parseTags("x,y,z", [], 2)).toEqual(["x", "y"]) })
})
