import { describe, it, expect } from "vitest"
import { ScanInput, cleanText, normalizeLao } from "../src"

describe("ScanInput", () => {
  const good = { guardId: "G001", pointId: "P12", scannedAt: "2026-09-30T08:12:00Z", clientId: "abcdef123456" }
  it("accepts a valid scan", () => expect(ScanInput.safeParse(good).success).toBe(true))
  it("rejects a missing guard", () => expect(ScanInput.safeParse({ ...good, guardId: "" }).success).toBe(false))
  it("rejects a bad time", () => expect(ScanInput.safeParse({ ...good, scannedAt: "yesterday" }).success).toBe(false))
})
describe("text helpers", () => {
  it("strips control chars and caps length", () => {
    expect(cleanText("a\u0000b\u200Bc  ")).toBe("abc")
    expect(cleanText("x".repeat(600)).length).toBe(500)
  })
  it("composes Lao sara-am", () => expect(normalizeLao("\u0E84\u0ECD\u0EB2")).toBe("\u0E84\u0EB3".replace("\u0E84","\u0E84")))
})
