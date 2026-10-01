import { describe, it, expect } from "vitest"
import { fmtKip, fmtKipShort, t, setLang, cacheGet, cacheSet, swr } from "../src"

const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) } as unknown as Storage }

describe("kip", () => {
  it("full form appends ກີບ, no ₭", () => { expect(fmtKip(1234567)).toBe("1,234,567 ກີບ"); expect(fmtKip(5)).not.toContain("₭") })
  it("short form", () => { expect(fmtKipShort(950)).toBe("950"); expect(fmtKipShort(1500)).toBe("1.5K"); expect(fmtKipShort(2000000)).toBe("2M"); expect(fmtKipShort(-3400000)).toBe("-3.4M") })
})
describe("t()", () => {
  it("Lao by default, English on switch", () => { expect(t("Save", "ບັນທຶກ")).toBe("ບັນທຶກ"); setLang("en"); expect(t("Save", "ບັນທຶກ")).toBe("Save"); setLang("lo") })
})
describe("page cache", () => {
  it("round-trips and tolerates junk", () => {
    const s = mem(); cacheSet("k", { a: 1 }, s); expect(cacheGet("k", s)).toEqual({ a: 1 })
    s.setItem("bad", "{oops"); expect(cacheGet("bad", s)).toBeNull()
  })
  it("swr paints cached first, then returns and stores fresh", async () => {
    const s = mem(); cacheSet("p", "old", s); const seen: string[] = []
    const fresh = await swr("p", async () => "new", (v) => seen.push(v), s)
    expect(seen).toEqual(["old"]); expect(fresh).toBe("new"); expect(cacheGet("p", s)).toBe("new")
  })
})
