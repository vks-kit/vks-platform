import { describe, it, expect } from "vitest"
import { parseISO, monthCells, daysIn, addMonths, inRange, toISO, weekdayIndex } from "../src/lib/date"

describe("dates", () => {
  it("parses and rejects", () => { expect(parseISO("2026-09-30")).toEqual({ y: 2026, m: 8, d: 30 }); expect(parseISO("2026-02-30")).toBeNull(); expect(parseISO("x")).toBeNull() })
  it("leap years", () => { expect(daysIn(2024, 1)).toBe(29); expect(daysIn(2026, 1)).toBe(28) })
  it("Monday-first weekday", () => { expect(weekdayIndex(2026, 8, 28)).toBe(0) /* Mon 28 Sep 2026 */ })
  it("month grid is whole weeks, starts on the right day", () => {
    const c = monthCells(2026, 8) // Sep 2026 starts Tuesday
    expect(c.length % 7).toBe(0); expect(c[0]).toBeNull(); expect(c[1]).toBe(1); expect(c.filter(Boolean).length).toBe(30)
  })
  it("month arithmetic across years", () => { expect(addMonths(2026, 11, 1)).toEqual({ y: 2027, m: 0 }); expect(addMonths(2026, 0, -1)).toEqual({ y: 2025, m: 11 }) })
  it("range", () => { expect(inRange("2026-09-15", "2026-09-01", "2026-09-30")).toBe(true); expect(inRange("2026-10-01", undefined, "2026-09-30")).toBe(false) })
  it("toISO pads", () => expect(toISO(2026, 0, 5)).toBe("2026-01-05"))
})
