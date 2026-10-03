import { describe, it, expect } from "vitest"
import { planPct, planMonths, layoutDeps } from "../src/components/roadmap"
describe("planPct", () => {
  it("start, middle, end", () => { expect(planPct("2026-01-01", "2026-01-01", "2026-01-11")).toBe(0); expect(planPct("2026-01-06", "2026-01-01", "2026-01-11")).toBe(50); expect(planPct("2026-01-11", "2026-01-01", "2026-01-11")).toBe(100) })
  it("clamps outside the range", () => { expect(planPct("2025-12-01", "2026-01-01", "2026-02-01")).toBe(0); expect(planPct("2027-01-01", "2026-01-01", "2026-02-01")).toBe(100) })
  it("bad range gives 0", () => expect(planPct("2026-01-05", "2026-02-01", "2026-01-01")).toBe(0))
})
describe("planMonths", () => {
  it("one tick per month, year on January", () => { const m = planMonths("2026-11-01", "2027-02-01"); expect(m.map((x) => x.at)).toEqual(["2026-11-01", "2026-12-01", "2027-01-01"]); expect(m[2].label).toContain("27") })
  it("mid-month start clamps first tick", () => expect(planMonths("2026-10-15", "2026-12-01")[0].at).toBe("2026-10-15"))
})
describe("layoutDeps", () => {
  it("stacks per column", () => { const { pos, width } = layoutDeps([{ id: "a", label: "A", column: 0 }, { id: "b", label: "B", column: 0 }, { id: "c", label: "C", column: 1, deps: ["a"] }]); expect(pos.b.y).toBeGreaterThan(pos.a.y); expect(pos.c.x).toBeGreaterThan(pos.a.x); expect(pos.c.y).toBe(pos.a.y); expect(width).toBeGreaterThan(pos.c.x) })
})
