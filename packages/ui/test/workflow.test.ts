import { describe, it, expect } from "vitest"
import { diffFields, rejectReasonError, syncState, sinceLabel, REJECT_REASON_MIN } from "../src/lib/workflow"

describe("diffFields", () => {
  it("returns only changed fields, with labels and display strings", () => {
    const d = diffFields({ site: "A", shift: "day", pay: 100, note: "" }, { site: "B", shift: "day", pay: 120, note: "x" }, { labels: { site: "ສະຖານທີ່" } })
    expect(d).toEqual([
      { field: "site", label: "ສະຖານທີ່", from: "A", to: "B" },
      { field: "pay", label: "pay", from: "100", to: "120" },
      { field: "note", label: "note", from: "—", to: "x" },
    ])
  })
  it("handles added and removed keys, ignore and null records", () => {
    expect(diffFields({ a: 1 }, { b: true }).map((c) => [c.field, c.from, c.to])).toEqual([["a", "1", "—"], ["b", "—", "✓"]])
    expect(diffFields({ a: 1, updatedAt: 1 }, { a: 1, updatedAt: 2 }, { ignore: ["updatedAt"] })).toEqual([])
    expect(diffFields(null, { a: "x" })).toHaveLength(1)
    expect(diffFields({ a: null }, { a: undefined })).toEqual([])
  })
})

describe("rejectReasonError", () => {
  it("requires a reason after cleanText", () => {
    expect(rejectReasonError("")).not.toBeNull()
    expect(rejectReasonError("   \u200B ")).not.toBeNull()
    expect(rejectReasonError("ab")).toContain(String(REJECT_REASON_MIN))
    expect(rejectReasonError("ບໍ່ມີໃບຢັ້ງຢືນ")).toBeNull()
  })
})

describe("syncState", () => {
  const item = (tries: number, queuedAt: number) => ({ clientId: "c" + queuedAt, payload: {}, tries, queuedAt })
  it("synced / pending / failing", () => {
    expect(syncState({}).state).toBe("synced")
    expect(syncState({ queued: 3 })).toEqual({ state: "pending", queued: 3, oldestAt: null })
    expect(syncState({ items: [item(0, 50), item(1, 20)] })).toEqual({ state: "pending", queued: 2, oldestAt: 20 })
    expect(syncState({ queued: 1, error: "HTTP 500" }).state).toBe("failing")
    expect(syncState({ dropped: 1 }).state).toBe("failing")
    expect(syncState({ items: [item(7, 1)] }).state).toBe("failing")
    expect(syncState({ items: [item(2, 1)], maxTries: 3 }).state).toBe("failing")
  })
  it("items win over queued", () => { expect(syncState({ items: [], queued: 5 }).queued).toBe(0) })
})

describe("sinceLabel", () => {
  it("now, minutes, then clock time", () => {
    const now = new Date(2026, 9, 2, 14, 30).getTime()
    expect(sinceLabel(now - 10_000, now)).toBe("ດຽວນີ້")
    expect(sinceLabel(now - 5 * 60_000, now)).toBe("5 ນາທີກ່ອນ")
    expect(sinceLabel(new Date(2026, 9, 2, 9, 5).getTime(), now)).toBe("09:05")
  })
})
