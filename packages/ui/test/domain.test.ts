import { describe, expect, it } from "vitest"
import { checkpointProgress, fmtDistance, nextShift, rosterCover, slaLeft, quoteTotals, type Checkpoint } from "../src/lib/domain"

describe("patrol checkpoints", () => {
  const cps: Checkpoint[] = [
    { id: "a", name: "A", status: "done" }, { id: "b", name: "B", status: "missed" },
    { id: "c", name: "C", status: "next" }, { id: "d", name: "D", status: "pending" },
  ]
  it("counts and finds the next one", () => {
    expect(checkpointProgress(cps)).toEqual({ done: 1, missed: 1, total: 4, next: 2, complete: false })
    expect(checkpointProgress(cps.map((c) => (c.id === "c" ? { ...c, status: "pending" as const } : c))).next).toBe(2)
    expect(checkpointProgress(cps.map((c) => ({ ...c, status: "done" as const })))).toMatchObject({ next: -1, complete: true })
    expect(checkpointProgress([])).toMatchObject({ total: 0, next: -1, complete: false })
  })
  it("distance text", () => {
    expect(fmtDistance(42.4)).toBe("42 ມ")
    expect(fmtDistance(1240)).toBe("1.2 ກມ")
    expect(fmtDistance(-1)).toBe("—")
  })
})

describe("shift roster", () => {
  it("tap cycles D -> N -> OFF -> D", () => {
    expect(["", "D", "N", "OFF"].map((c) => nextShift(c as never))).toEqual(["D", "N", "OFF", "D"])
  })
  it("cover and shortfall per day", () => {
    const r = { s1: { mon: "D" as const, tue: "N" as const }, s2: { mon: "N" as const, tue: "OFF" as const }, s3: { mon: "D" as const } }
    const c = rosterCover(r, ["s1", "s2", "s3"], ["mon", "tue"], { D: 2, N: 1 })
    expect(c[0]).toEqual({ day: "mon", D: 2, N: 1, off: 0, short: [] })
    expect(c[1]).toEqual({ day: "tue", D: 0, N: 1, off: 1, short: ["D"] })
    expect(rosterCover(r, ["s1"], ["mon"], (d) => (d === "mon" ? { N: 1 } : undefined))[0].short).toEqual(["N"])
  })
})

describe("incident SLA", () => {
  it("counts down and goes negative when overdue", () => {
    const t0 = 1_000_000
    expect(slaLeft(t0, 15, t0 + 10 * 60_000 + 42_000)).toMatchObject({ text: "04:18", overdue: false })
    expect(slaLeft(t0, 15, t0 + 16 * 60_000).text).toBe("-01:00")
    expect(slaLeft(t0, 90, t0).text).toBe("1:30:00")
    expect(slaLeft(t0, 10, t0 + 5 * 60_000).pct).toBeCloseTo(0.5)
  })
})

describe("quote totals", () => {
  it("10 guards x 8,000,000 + 10% VAT", () => {
    expect(quoteTotals([{ id: "g", label: "ຍາມ", qty: 10, unitPrice: 8_000_000 }])).toEqual({ subtotal: 80_000_000, discount: 0, base: 80_000_000, vat: 8_000_000, total: 88_000_000 })
  })
  it("discount before VAT, never below zero", () => {
    const l = [{ id: "a", label: "a", qty: 2, unitPrice: 1_000_000 }, { id: "b", label: "b", qty: -1, unitPrice: 500 }]
    expect(quoteTotals(l, 0.1, 500_000)).toEqual({ subtotal: 2_000_000, discount: 500_000, base: 1_500_000, vat: 150_000, total: 1_650_000 })
    expect(quoteTotals(l, 0, 9e9).total).toBe(0)
  })
})
