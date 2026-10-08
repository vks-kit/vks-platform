import { describe, expect, it } from "vitest"
import { defineSettings, settingsDefaults, settingsDiff, dirtyByPage, rangeLengthLabel, validateSettingRow, settingPhoneError, splitTimeRange, settingMatches, settingText, CORE_SETTINGS_PAGES, settingsLabels, settingsErrors, settingEditSection, settingViewText, SETTINGS_EDIT_SECTIONS } from "../src/lib/settings"

const cfg = defineSettings({
  events: [{ id: "late", label: "ມາຊ້າ" }],
  permissions: [{ id: "scan", label: "ສະແກນ", default: "1110" }],
  app: [{ header: "A", rows: [{ key: "prefix", type: "text", label: "ຄຳນຳໜ້າ", default: "VKS-" }, { key: "keep", type: "number", label: "ເກັບ", min: 1, max: 999, default: 90 }, { key: "go", type: "action", label: "ສ້າງ" }] }],
})

describe("settings config", () => {
  it("fills core with all 10 pages", () => { expect(cfg.core).toEqual(CORE_SETTINGS_PAGES) })
  it("defaults cover matrix rows and app rows, but not actions", () => {
    const d = settingsDefaults(cfg)
    expect(d["notifications.incident"]).toBe("1111")
    expect(d["notifications.late"]).toBe("1000")
    expect(d["members.role.scan"]).toBe("1110")
    expect(d["app.prefix"]).toBe("VKS-")
    expect("app.go" in d).toBe(false)
  })
})

describe("settingsDiff / dirtyByPage", () => {
  it("returns only changed keys and counts them per page", () => {
    const a = settingsDefaults(cfg)
    const b = { ...a, "app.keep": 30, "display.lang": "en", "notifications.mention": "1110", "app.prefix": "VKS-" }
    const diff = settingsDiff(a, b)
    expect(diff.map((d) => d.key)).toEqual(["display.lang", "notifications.mention", "app.keep"])
    expect(diff.find((d) => d.key === "app.keep")).toEqual({ key: "app.keep", from: 90, to: 30 })
    expect(dirtyByPage(diff)).toEqual({ notifications: 1, display: 1, app: 1 })
  })
  it("compares arrays by value", () => { expect(settingsDiff({ k: ["a"] }, { k: ["a"] })).toEqual([]) })
})

describe("time range", () => {
  it("labels length and overnight", () => {
    expect(rangeLengthLabel("08:00", "17:00")).toBe("9 ຊມ")
    expect(rangeLengthLabel("08:00", "16:30")).toBe("8.5 ຊມ")
    expect(rangeLengthLabel("22:00", "06:00")).toBe("8 ຊມ · ຂ້າມຄືນ")
    expect(rangeLengthLabel("08:00", "08:00")).toBe("—")
    expect(rangeLengthLabel("8", "17:00")).toBe("—")
  })
  it("splits stored ranges", () => { expect(splitTimeRange("22:00-06:00")).toEqual(["22:00", "06:00"]); expect(splitTimeRange(3)).toEqual(["", ""]) })
})

describe("validation", () => {
  it("number min/max", () => {
    expect(validateSettingRow({ type: "number", min: 1, max: 999 }, 90)).toBeUndefined()
    expect(validateSettingRow({ type: "number", min: 1, max: 999 }, 0)).toBe("ໃສ່ຕົວເລກ 1–999")
    expect(validateSettingRow({ type: "number", min: 1, max: 999 }, null)).toBe("ໃສ່ຕົວເລກ 1–999")
  })
  it("time range must differ", () => {
    expect(validateSettingRow({ type: "time-range" }, "08:00-17:00")).toBeUndefined()
    expect(validateSettingRow({ type: "time-range" }, "08:00-08:00")).toBeTruthy()
  })
  it("phone needs 8 digits after 020", () => {
    expect(settingPhoneError("55123456")).toBeUndefined()
    expect(settingPhoneError("")).toBeUndefined()
    expect(settingPhoneError("5512")).toBe("ເບີບໍ່ຄົບ — ຕ້ອງມີ 10 ຕົວເລກ")
  })
})

describe("search + text", () => {
  it("matches label or help, NFC-insensitive", () => {
    expect(settingMatches("ລະຫັດ", "ປ່ຽນລະຫັດຜ່ານ")).toBe(true)
    expect(settingMatches("push", "x", "Web Push")).toBe(true)
    expect(settingMatches("zzz", "a")).toBe(false)
  })
  it("renders values for the audit log", () => { expect(settingText(true)).toBe("ເປີດ"); expect(settingText([])).toBe("—"); expect(settingText(90)).toBe("90") })
})

describe("labels + errors", () => {
  it("labels app and matrix rows", () => {
    const l = settingsLabels(cfg)
    expect(l["app.keep"]).toBe("ເກັບ")
    expect(l["notifications.late"]).toBe("ມາຊ້າ")
    expect(l["members.role.scan"]).toBe("ສິດ: ສະແກນ")
  })
  it("collects errors; quiet hours only when quiet is on", () => {
    const v = { ...settingsDefaults(cfg), "app.keep": 0, "notifications.quietHours": "22:00-22:00" }
    expect(Object.keys(settingsErrors(cfg, v)).sort()).toEqual(["app.keep", "notifications.quietHours"])
    expect(Object.keys(settingsErrors(cfg, { ...v, "notifications.quiet": false }))).toEqual(["app.keep"])
  })
})

describe("view first / auto-save split", () => {
  it("details are view-first sections, preferences are not", () => {
    expect(settingEditSection("profile.phone")).toBe("profile.info")
    expect(settingEditSection("general.currency")).toBe("general.org")
    expect(settingEditSection("general.workHours")).toBe("general.hours")
    expect(settingEditSection("profile.code")).toBeUndefined()
    expect(settingEditSection("display.lang")).toBeUndefined()
    expect(settingEditSection("app.keep")).toBeUndefined()
  })
  it("every section key has a default", () => {
    const d = settingsDefaults(cfg)
    for (const k of Object.values(SETTINGS_EDIT_SECTIONS).flat()) expect(k in d).toBe(true)
  })
  it("renders read-only text people can read", () => {
    expect(settingViewText("profile.phone", "020 5512 3456")).toBe("020 5512 3456")
    expect(settingViewText("profile.phone", "")).toBe("")
    expect(settingViewText("general.currency", "LAK")).toBe("ກີບ (LAK)")
    expect(settingViewText("general.weekStart", "sun")).toBe("ວັນອາທິດ")
    expect(settingViewText("general.workDays", "1111110")).toBe("ຈ–ສ (6 ມື້)")
    expect(settingViewText("general.workHours", "08:00-17:00")).toBe("08:00 – 17:00 · 9 ຊມ")
    expect(settingViewText("profile.name", "ສົມໃຈ")).toBe("ສົມໃຈ")
    expect(settingViewText("profile.email", undefined)).toBe("")
  })
})
