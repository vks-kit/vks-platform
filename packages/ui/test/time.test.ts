import { describe, it, expect } from "vitest"
import { isHHMM, timeToMin, minToTime, spanMin, spanSegments, hourInSpan } from "../src/lib/time"

describe("24 h time", () => {
  it("parses only real 24 h times", () => {
    expect(timeToMin("00:00")).toBe(0); expect(timeToMin("23:59")).toBe(1439); expect(timeToMin("07:30")).toBe(450)
    for (const bad of ["24:00", "7:30", "12:60", "", "ab:cd"]) { expect(timeToMin(bad)).toBeNull(); expect(isHHMM(bad)).toBe(false) }
  })
  it("formats and wraps past midnight", () => { expect(minToTime(450)).toBe("07:30"); expect(minToTime(1500)).toBe("01:00"); expect(minToTime(-60)).toBe("23:00") })
  it("span length, overnight and empty", () => {
    expect(spanMin(360, 1080)).toBe(720)            // 06:00–18:00
    expect(spanMin(1080, 360)).toBe(720)            // 18:00–06:00 next day
    expect(spanMin(1320, 360)).toBe(480)            // 22:00–06:00
    expect(spanMin(360, 360)).toBeNull(); expect(spanMin(null, 360)).toBeNull()
  })
  it("24 h bar splits an overnight shift in two", () => {
    expect(spanSegments(360, 1080)).toEqual([[360, 1080]])
    expect(spanSegments(1080, 360)).toEqual([[1080, 1440], [0, 360]])
    expect(spanSegments(360, 360)).toEqual([])
  })
  it("hours strictly inside the span", () => {
    expect(hourInSpan(6, 360, 720)).toBe(false); expect(hourInSpan(7, 360, 720)).toBe(true); expect(hourInSpan(18, 360, 720)).toBe(false)
    expect(hourInSpan(23, 1080, 720)).toBe(true); expect(hourInSpan(2, 1080, 720)).toBe(true); expect(hourInSpan(12, 1080, 720)).toBe(false)
  })
})
