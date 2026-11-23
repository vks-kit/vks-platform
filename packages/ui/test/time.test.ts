import { describe, it, expect } from "vitest"
import { isHHMM, timeToMin, minToTime, spanMin, spanSegments, hourInSpan, parseTimeText, timeSteps } from "../src/lib/time"

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

describe("typed time text", () => {
  it("reads the ways people type a time", () => {
    const t = (s: string) => { const m = parseTimeText(s); return m === null ? null : String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0") }
    expect(["6", "06", "18", "630", "0630", "1830", "18:30", "18.30", "18h30", "6:5", " 7 "].map(t)).toEqual(["06:00", "06:00", "18:00", "06:30", "06:30", "18:30", "18:30", "18:30", "18:30", "06:05", "07:00"])
    expect(["", "24", "2460", "1875", "abc", "12345", "25:00"].map(t)).toEqual([null, null, null, null, null, null, null])
  })
  it("list steps wrap from a start", () => {
    expect(timeSteps(30)).toHaveLength(48)
    expect(timeSteps(60, 22 * 60).slice(0, 4)).toEqual([1320, 1380, 0, 60])
    expect(timeSteps(15)[1]).toBe(15)
  })
})
