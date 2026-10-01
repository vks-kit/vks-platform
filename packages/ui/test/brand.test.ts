import { describe, it, expect } from "vitest"
import { BRAND } from "../src/components/logo"

describe("BRAND", () => {
  it("VKS is only the acronym", () => {
    expect(BRAND.short).toBe("VKS")
    expect(BRAND.name).toBe("Viengkham Security Service")
    expect(BRAND.legal).toBe("Viengkham Security Service Sole Co., Ltd.")
  })
  it("Lao legal name", () => expect(BRAND.legalLo).toBe("ບໍລິສັດ ວຽງຄຳບໍລິການຄວາມປອດໄພ ຈຳກັດຜູ້ດຽວ"))
  it("Lao uses composed sara-am (U+0EB3), never ໍ + າ", () => {
    for (const s of [BRAND.lo, BRAND.legalLo]) {
      expect(s).toContain("\u0EB3")
      expect(s).not.toContain("\u0ECD\u0EB2")
    }
  })
})
