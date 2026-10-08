import { describe, expect, it } from "vitest"
import { workDaysText, workDaysCount, WEEKDAYS_LO } from "../src/lib/weekdays"

describe("workDaysText", () => {
  it("names the common masks", () => {
    expect(workDaysText("1111111")).toBe("ທຸກມື້")
    expect(workDaysText("1111100")).toBe("ຈ–ສ")
    expect(workDaysText("1111110")).toBe("ຈ–ສ (6 ມື້)")
    expect(workDaysText("0000000")).toBe("—")
  })
  it("lists initials for other sets", () => {
    expect(workDaysText("1010100")).toBe("ຈ ພ ສ")
    expect(workDaysText("0000011")).toBe("ສ ອາ")
  })
  it("passes bad input through", () => { expect(workDaysText("abc")).toBe("abc") })
  it("counts days", () => { expect(workDaysCount("1111110")).toBe(6); expect(WEEKDAYS_LO).toHaveLength(7) })
})
