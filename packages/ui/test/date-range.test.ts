import { describe, it, expect } from "vitest"
import { addDays, daysBetween, pickRange, inSpan, clampRange, PRESETS } from "../src/lib/date-range"
describe("date range", () => {
  it("addDays crosses month and year", () => { expect(addDays("2026-09-30", 1)).toBe("2026-10-01"); expect(addDays("2026-01-01", -1)).toBe("2025-12-31"); expect(addDays("2024-02-28", 1)).toBe("2024-02-29") })
  it("daysBetween counts both ends", () => { expect(daysBetween("2026-09-01", "2026-09-01")).toBe(1); expect(daysBetween("2026-09-01", "2026-09-30")).toBe(30); expect(daysBetween("2026-12-30", "2027-01-02")).toBe(4) })
  it("two-tap flow", () => {
    let r = pickRange({}, "2026-09-10"); expect(r).toEqual({ from: "2026-09-10" })
    r = pickRange(r, "2026-09-15"); expect(r).toEqual({ from: "2026-09-10", to: "2026-09-15" })
    r = pickRange(r, "2026-09-20"); expect(r).toEqual({ from: "2026-09-20" }) // third tap restarts
  })
  it("second tap earlier than start swaps", () => expect(pickRange({ from: "2026-09-10" }, "2026-09-03")).toEqual({ from: "2026-09-03", to: "2026-09-10" }))
  it("same day is a valid one-day range", () => expect(pickRange({ from: "2026-09-10" }, "2026-09-10")).toEqual({ from: "2026-09-10", to: "2026-09-10" }))
  it("inSpan", () => { const r = { from: "2026-09-10", to: "2026-09-12" }; expect(inSpan("2026-09-11", r)).toBe(true); expect(inSpan("2026-09-13", r)).toBe(false); expect(inSpan("2026-09-11", { from: "2026-09-10" })).toBe(false) })
  it("clamp", () => expect(clampRange({ from: "2026-01-01", to: "2026-12-31" }, "2026-03-01", "2026-06-30")).toEqual({ from: "2026-03-01", to: "2026-06-30" }))
  it("presets", () => {
    const g = (id: string) => PRESETS.find((p) => p.id === id)!.range("2026-09-30")
    expect(g("last7")).toEqual({ from: "2026-09-24", to: "2026-09-30" }); expect(g("last30")).toEqual({ from: "2026-09-01", to: "2026-09-30" })
    expect(g("thisMonth")).toEqual({ from: "2026-09-01", to: "2026-09-30" }); expect(g("lastMonth")).toEqual({ from: "2026-08-01", to: "2026-08-31" })
    expect(PRESETS.find((p) => p.id === "lastMonth")!.range("2026-01-15")).toEqual({ from: "2025-12-01", to: "2025-12-31" })
  })
})
