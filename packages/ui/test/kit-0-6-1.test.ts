import { describe, expect, it } from "vitest"
import { laMobileDigits, whatsappUrl, telUrl } from "../src/lib/field-format"
import { halfHours } from "../src/components/slot-picker"
import { parseDmy, fmtDmy, ageOn, dobError } from "../src/components/date-inline"

describe("contact links", () => {
  it("WhatsApp only for Lao mobiles, any input format", () => {
    expect(whatsappUrl(2055123456)).toBe("https://wa.me/8562055123456")
    expect(whatsappUrl("020 5512 3456")).toBe("https://wa.me/8562055123456")
    expect(whatsappUrl("+856 20 5512 3456")).toBe("https://wa.me/8562055123456")
    expect(whatsappUrl(309123456)).toBe("https://wa.me/856309123456")
    expect(whatsappUrl("021 212345")).toBeNull()
    expect(whatsappUrl("2055")).toBeNull()
    expect(laMobileDigits("02099234291")).toBe("2099234291")
  })
  it("tel links dial the number as written", () => {
    expect(telUrl(2055123456)).toBe("tel:02055123456")
    expect(telUrl("021 212345")).toBe("tel:021212345")
    expect(telUrl("")).toBeNull()
  })
})

describe("slot picker times", () => {
  it("half hours inclusive", () => {
    expect(halfHours("08:00", "11:30")).toEqual(["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"])
    expect([...halfHours("08:00", "11:30"), ...halfHours("13:00", "16:30")]).toHaveLength(16)
  })
})

describe("birth date", () => {
  it("parses dd/mm/yyyy and refuses impossible days", () => {
    expect(parseDmy("12/04/1999")).toBe("1999-04-12")
    expect(parseDmy("5.6.2000")).toBe("2000-06-05")
    expect(parseDmy("31/02/2000")).toBeNull()
    expect(fmtDmy("1999-04-12")).toBe("12/04/1999")
  })
  it("age and messages", () => {
    expect(ageOn("1999-11-13", "2026-11-12")).toBe(26)
    expect(ageOn("1999-04-12", "2026-11-12")).toBe(27)
    expect(dobError(null, "", "2026-11-12")).toBeNull()
    expect(dobError(null, "12/13/1999", "2026-11-12")).toMatch(/ວວ\/ດດ/)
    expect(dobError("2015-01-01", "01/01/2015", "2026-11-12")).toMatch(/16/)
    expect(dobError("1999-04-12", "12/04/1999", "2026-11-12")).toBeNull()
  })
})
