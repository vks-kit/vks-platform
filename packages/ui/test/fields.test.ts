import { describe, expect, it } from "vitest"
import { parsePhoneLa, fmtPhoneLa, fmtPhoneLaFull, isPhoneLa, phoneLaE164, parseMoney, fmtMoneyText, moneyText, moneyNum, normTime, stepTime, nowTime, parseNumberText, numFromText, clampNum, roundTo, caretAfter } from "../src/lib/field-format"

describe("Lao phone 020 XXXX XXXX", () => {
  it("accepts every way people type or paste it", () => {
    for (const s of ["5512 3456", "020 5512 3456", "02055123456", "20 5512 3456", "+856 20 5512 3456", "856 20 55123456", "020-5512-3456"]) expect(parsePhoneLa(s)).toBe("55123456")
  })
  it("limits to 8 digits and groups 4 + 4", () => {
    expect(parsePhoneLa("551234567890")).toBe("55123456")
    expect(fmtPhoneLa("5512")).toBe("5512"); expect(fmtPhoneLa("55123")).toBe("5512 3"); expect(fmtPhoneLa("55123456")).toBe("5512 3456")
  })
  it("full form always starts with 020, empty stays empty", () => {
    expect(fmtPhoneLaFull("")).toBe(""); expect(fmtPhoneLaFull("5")).toBe("020 5"); expect(fmtPhoneLaFull("55123456")).toBe("020 5512 3456")
  })
  it("complete / international", () => {
    expect(isPhoneLa("020 5512 345")).toBe(false); expect(isPhoneLa("020 5512 3456")).toBe(true)
    expect(phoneLaE164("020 5512 3456")).toBe("+8562055123456"); expect(phoneLaE164("020 55")).toBe("")
  })
})

describe("money", () => {
  it("LAK is whole numbers with commas", () => {
    expect(parseMoney("1,234,567.89", 0)).toBe("1234567"); expect(fmtMoneyText("1234567")).toBe("1,234,567"); expect(parseMoney("0005", 0)).toBe("5")
    expect(moneyText(1500000, 0)).toBe("1,500,000"); expect(moneyText(null, 0)).toBe("")
  })
  it("THB / USD keep 2 decimals", () => {
    expect(parseMoney("12.3456", 2)).toBe("12.34"); expect(parseMoney(".5", 2)).toBe("0.5"); expect(fmtMoneyText("1234.5")).toBe("1,234.5"); expect(parseMoney("1..2.3", 2)).toBe("1.23")
  })
  it("number out", () => { expect(moneyNum("")).toBeNull(); expect(moneyNum("1234.5")).toBe(1234.5) })
})

describe("time 24 h", () => {
  it("normalises", () => { expect(normTime("9:05")).toBe("09:05"); expect(normTime("0905")).toBe("09:05"); expect(normTime("24:00")).toBe(""); expect(normTime("12:60")).toBe("") })
  it("steps and wraps midnight", () => { expect(stepTime("23:55", 10)).toBe("00:05"); expect(stepTime("00:05", -10)).toBe("23:55"); expect(stepTime("", 5)).toBe("") })
  it("now rounds to step", () => { expect(nowTime(5, new Date(2026, 0, 1, 8, 12))).toBe("08:10"); expect(nowTime(1, new Date(2026, 0, 1, 8, 12))).toBe("08:12"); expect(nowTime(30, new Date(2026, 0, 1, 23, 50))).toBe("00:00") })
})

describe("number + caret", () => {
  it("parses", () => {
    expect(parseNumberText("12.345", 1, false)).toBe("12.3"); expect(parseNumberText("-5", 0, false)).toBe("5"); expect(parseNumberText("-5", 0, true)).toBe("-5"); expect(parseNumberText("1.5", 0, false)).toBe("1")
    expect(numFromText("-")).toBeNull(); expect(numFromText("4.5")).toBe(4.5); expect(clampNum(15, 0, 10)).toBe(10); expect(roundTo(0.1 + 0.2, 1)).toBe(0.3)
  })
  it("keeps the caret after the same digit", () => { expect(caretAfter("12", "1,234", /[\d.]/)).toBe(3); expect(caretAfter("", "1,234", /\d/)).toBe(0); expect(caretAfter("1234", "12", /\d/)).toBe(2) })
})
