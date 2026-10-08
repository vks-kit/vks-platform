/**
 * Pure logic behind SettingsPage: the config shape, default values, the save diff,
 * dirty counts per page, row validation and the time-range length label. No React.
 */
import type { ReactNode } from "react"
import { spanMin, timeToMin } from "./time"
import { isPhoneLa, parsePhoneLa, fmtPhoneLaFull } from "./field-format"
import { workDaysText } from "./weekdays"

/** One stored setting. Masks ("1100") and ranges ("08:00-17:00") are plain strings so a diff reads well in the audit log. */
export type SettingValue = string | number | boolean | string[] | null
export type SettingsValues = Record<string, SettingValue>

/** The 9 row types an app may use in its own group. */
export type SettingRowType = "text" | "number" | "switch" | "select" | "segmented" | "time-range" | "days" | "checkbox-list" | "action"
export type SettingOption = { value: string; label: string; hint?: string }

/** One row of an app group. key is stored as "app.<key>". */
export type SettingRowDef = {
  key: string; type: SettingRowType; label: string; help?: string; default?: SettingValue
  unit?: string; min?: number; max?: number; step?: number; mono?: boolean
  options?: SettingOption[]; wide?: boolean; actionLabel?: string; onAction?: () => void
}
export type SettingGroupDef = { header: string; sub?: string; icon?: ReactNode; tone?: SettingTone; rows: SettingRowDef[] }
export type SettingTone = "primary" | "bar" | "destructive" | "warning" | "gold" | "success" | "muted"

export const CORE_SETTINGS_PAGES = ["profile", "security", "notifications", "display", "general", "members", "integrations", "audit", "data", "danger"] as const
export type CoreSettingsPage = (typeof CORE_SETTINGS_PAGES)[number]
export type SettingsPageId = CoreSettingsPage | "app"

/** One change, as sent to save() and written to the audit log. */
export type SettingChange = { key: string; from: SettingValue; to: SettingValue }
export type SettingsAuditEntry = { who: string; field: string; from: string; to: string; at: string }
export type SettingsMember = { id: string; name: string; dept?: string; role: string; status: "active" | "pending"; lastSeen?: string }
export type SettingsDevice = { id: string; name: string; where?: string; lastSeen?: string; current?: boolean; kind?: "desktop" | "phone" }
export type SettingsIntegration = { id: string; name: string; detail?: string; status: "connected" | "expired" | "off"; actionLabel?: string }

export type SettingsConfig = {
  /** Which shared pages to show, in this order inside their nav group. Default: all 10. */
  core?: readonly CoreSettingsPage[]
  /** Extra rows for the notification matrix (events x channels). */
  events?: { id: string; label: string; default?: string }[]
  /** Extra rows for the role matrix (owner / manager / staff / viewer). */
  permissions?: { id: string; label: string; default?: string }[]
  /** The app's own groups, built only from the 9 standard row types. */
  app?: SettingGroupDef[]
  /** Title of the app page in the nav. Default "ການຕັ້ງຄ່າຂອງແອັບ". */
  appLabel?: string
  /** Read-only lists the shared pages show. Leave out to show an empty state. */
  members?: SettingsMember[]
  devices?: SettingsDevice[]
  integrations?: SettingsIntegration[]
  audit?: SettingsAuditEntry[]
  storage?: { usedGb: number; totalGb: number }
  /** Short facts shown as help lines: password age ("42 ມື້ກ່ອນ"), last backup ("ມື້ນີ້ 02:00 · ສຳເລັດ"). */
  info?: { passwordAge?: string; lastBackup?: string }
  /** Buttons that are not part of the save bar (change password, invite, sign out a device, danger zone, app actions). id is e.g. "security.password", "members.invite", "danger.reset" or "app.<key>"; target is the device / member / integration id. */
  onAction?: (id: string, target?: string) => void
  /** Saved values; missing keys fall back to defaults. */
  load?: () => Promise<Partial<SettingsValues>> | Partial<SettingsValues>
  /** Receives only the changed keys. Throw to keep the page dirty (auto-save puts the old value back). */
  save?: (diff: SettingChange[]) => Promise<void> | void
  /**
   * How preference pages (security, notifications, display, members, data, app) save.
   * "auto" (default): each change saves on its own after a short pause and shows a toast with Undo.
   * "bar": changes wait in the sticky "N changes · Cancel / Save" bar.
   * Profile and General always show values first and save per section (Edit -> Save / Cancel).
   */
  saveMode?: "auto" | "bar"
}

/** Identity helper that fills defaults, so a typo in core shows up in the editor. */
export function defineSettings(config: SettingsConfig): SettingsConfig & { core: readonly CoreSettingsPage[] } {
  return { ...config, core: config.core ?? CORE_SETTINGS_PAGES }
}

export const SETTINGS_CHANNELS = ["ໃນແອັບ", "Push", "Telegram", "ອີເມວ"] as const
export const SETTINGS_EVENTS = [
  { id: "assigned", label: "ມີວຽກມອບໝາຍໃຫ້ຂ້ອຍ", default: "1100" },
  { id: "mention", label: "ມີຄົນກ່າວເຖິງຂ້ອຍ", default: "1100" },
  { id: "approval", label: "ລາຍການລໍຖ້າອະນຸມັດ", default: "1110" },
  { id: "incident", label: "ລະບົບມີບັນຫາ", default: "1111" },
  { id: "digest", label: "ສະຫຼຸບປະຈຳວັນ", default: "0011" },
]
export const SETTINGS_ROLES = ["ເຈົ້າຂອງ", "ຜູ້ຈັດການ", "ພະນັກງານ", "ຜູ້ເບິ່ງ"] as const
export const SETTINGS_PERMISSIONS = [
  { id: "view", label: "ເບິ່ງຂໍ້ມູນ", default: "1111" },
  { id: "edit", label: "ສ້າງ / ແກ້ໄຂ", default: "1110" },
  { id: "approve", label: "ອະນຸມັດ", default: "1100" },
  { id: "settings", label: "ແກ້ການຕັ້ງຄ່າ", default: "1100" },
  { id: "members", label: "ຈັດການສະມາຊິກ", default: "1000" },
  { id: "export", label: "ສົ່ງອອກຂໍ້ມູນ", default: "1100" },
]

const CORE_DEFAULTS: SettingsValues = {
  "profile.name": "", "profile.code": "", "profile.phone": "", "profile.email": "",
  "security.twoFactor": true, "security.autoLock": "15",
  "notifications.quiet": true, "notifications.quietHours": "22:00-06:00",
  "display.fontSize": "md", "display.density": "comfortable", "display.lang": "lo", "display.dateFormat": "DD/MM/YYYY", "display.numberFormat": "1,250,000",
  "general.orgName": "", "general.timezone": "Asia/Vientiane", "general.currency": "LAK", "general.workDays": "1111110", "general.workHours": "08:00-17:00", "general.weekStart": "mon",
  "data.autoDelete": "6m", "data.backup": true, "data.backupFreq": "daily",
}

/** Every key the page edits, with its default: core rows + matrix rows + app rows. */
export function settingsDefaults(config: SettingsConfig): SettingsValues {
  const v: SettingsValues = { ...CORE_DEFAULTS }
  for (const e of [...SETTINGS_EVENTS, ...(config.events ?? [])]) v["notifications." + e.id] = e.default ?? "1000"
  for (const p of [...SETTINGS_PERMISSIONS, ...(config.permissions ?? [])]) v["members.role." + p.id] = p.default ?? "1000"
  for (const g of config.app ?? []) for (const r of g.rows) if (r.type !== "action") v["app." + r.key] = r.default ?? rowEmpty(r.type)
  return v
}
function rowEmpty(t: SettingRowType): SettingValue {
  return t === "switch" ? false : t === "number" ? null : t === "checkbox-list" ? [] : t === "days" ? "0000000" : t === "time-range" ? "08:00-17:00" : ""
}

const same = (a: SettingValue | undefined, b: SettingValue | undefined) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

/** Changed keys only, in the order of `current`. This is what save() receives. */
export function settingsDiff(saved: SettingsValues, current: SettingsValues): SettingChange[] {
  const out: SettingChange[] = []
  for (const key of Object.keys(current)) if (!same(saved[key], current[key])) out.push({ key, from: saved[key] ?? null, to: current[key] })
  return out
}

/** The page a key belongs to: the text before the first dot. */
export const settingPage = (key: string) => key.split(".")[0] as SettingsPageId

/** { page: number of changed keys } for the nav badges. */
export function dirtyByPage(diff: SettingChange[]): Partial<Record<SettingsPageId, number>> {
  const c: Partial<Record<SettingsPageId, number>> = {}
  for (const d of diff) { const p = settingPage(d.key); c[p] = (c[p] ?? 0) + 1 }
  return c
}

/** "08:00-17:00" -> ["08:00", "17:00"]; anything else -> ["", ""]. */
export function splitTimeRange(v: SettingValue | undefined): [string, string] {
  const m = typeof v === "string" ? v.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/) : null
  return m ? [m[1], m[2]] : ["", ""]
}

/** Length of a time range in Lao: "9 ຊມ", "8.5 ຊມ", "8 ຊມ · ຂ້າມຄືນ" when it crosses midnight, "—" when unknown or zero. */
export function rangeLengthLabel(starts: string, ends: string): string {
  const s = timeToMin(starts), e = timeToMin(ends), m = spanMin(s, e)
  if (m === null || s === null || e === null) return "—"
  const h = m / 60
  return (Number.isInteger(h) ? String(h) : h.toFixed(1)) + " ຊມ" + (e < s ? " · ຂ້າມຄືນ" : "")
}

/** Error text for one row value, or undefined when it is fine. Numbers check min / max; time ranges must be two valid, different times. */
export function validateSettingRow(row: Pick<SettingRowDef, "type" | "min" | "max">, value: SettingValue | undefined): string | undefined {
  if (row.type === "number") {
    const lo = row.min ?? -Infinity, hi = row.max ?? Infinity
    if (typeof value !== "number" || Number.isNaN(value) || value < lo || value > hi)
      return row.min != null && row.max != null ? `ໃສ່ຕົວເລກ ${row.min}–${row.max}` : "ໃສ່ຕົວເລກ"
  }
  if (row.type === "time-range") {
    const [s, e] = splitTimeRange(value)
    if (spanMin(timeToMin(s), timeToMin(e)) === null) return "ເວລາເລີ່ມ ແລະ ເລີກ ຕ້ອງຖືກ ແລະ ບໍ່ຄືກັນ"
  }
  return undefined
}

/** Lao phone check used by the profile page: 020 + 8 digits. */
export function settingPhoneError(v: SettingValue | undefined): string | undefined {
  const s = String(v ?? "")
  return s.replace(/\D/g, "") === "" || isPhoneLa(s) ? undefined : "ເບີບໍ່ຄົບ — ຕ້ອງມີ 10 ຕົວເລກ"
}

/** Options of the core select / segmented rows, shared by the controls and the read-only view. */
export const SETTINGS_OPTIONS: Record<string, SettingOption[]> = {
  "security.autoLock": [{ value: "5", label: "5 ນາທີ" }, { value: "15", label: "15 ນາທີ" }, { value: "30", label: "30 ນາທີ" }, { value: "60", label: "1 ຊົ່ວໂມງ" }, { value: "never", label: "ບໍ່ລັອກ" }],
  "general.timezone": [{ value: "Asia/Vientiane", label: "Asia/Vientiane (UTC+7)" }, { value: "Asia/Bangkok", label: "Asia/Bangkok (UTC+7)" }],
  "general.currency": [{ value: "LAK", label: "ກີບ (LAK)" }, { value: "THB", label: "ບາດ (THB)" }, { value: "USD", label: "ໂດລາ (USD)" }],
  "general.weekStart": [{ value: "mon", label: "ວັນຈັນ" }, { value: "sun", label: "ວັນອາທິດ" }],
  "data.autoDelete": [{ value: "3m", label: "3 ເດືອນ" }, { value: "6m", label: "6 ເດືອນ" }, { value: "1y", label: "1 ປີ" }, { value: "never", label: "ບໍ່ລຶບ" }],
}

/** The sections that show values first and save on their own (Edit -> Save / Cancel). Keys not listed here are preferences. */
export const SETTINGS_EDIT_SECTIONS = {
  "profile.info": ["profile.name", "profile.phone", "profile.email"],
  "general.org": ["general.orgName", "general.timezone", "general.currency"],
  "general.hours": ["general.workDays", "general.workHours", "general.weekStart"],
} as const
export type SettingsEditSection = keyof typeof SETTINGS_EDIT_SECTIONS

/** The view-first section a key belongs to, or undefined for a preference (auto-saved / save bar). */
export function settingEditSection(key: string): SettingsEditSection | undefined {
  for (const [id, keys] of Object.entries(SETTINGS_EDIT_SECTIONS)) if ((keys as readonly string[]).includes(key)) return id as SettingsEditSection
  return undefined
}

/** Read-only text of a core value: "020 5512 3456", "ກີບ (LAK)", "ຈ–ສ (6 ມື້)", "08:00 – 17:00 · 9 ຊມ". "" when empty, so the page can say "not set". */
export function settingViewText(key: string, v: SettingValue | undefined): string {
  if (v == null || v === "") return ""
  if (key === "profile.phone") return parsePhoneLa(String(v)) ? fmtPhoneLaFull(parsePhoneLa(String(v))) : ""
  if (key === "general.workDays") return workDaysText(String(v))
  if (key === "general.workHours" || key === "notifications.quietHours") {
    const [s, e] = splitTimeRange(v)
    return s ? s + " – " + e + " · " + rangeLengthLabel(s, e) : String(v)
  }
  const opt = SETTINGS_OPTIONS[key]?.find((o) => o.value === String(v))
  return opt ? opt.label : settingText(v)
}

/** Short display text of a value for the audit log and toasts. */
export function settingText(v: SettingValue | undefined): string {
  if (v === true) return "ເປີດ"
  if (v === false) return "ປິດ"
  if (v == null || v === "") return "—"
  return Array.isArray(v) ? v.join(", ") || "—" : String(v)
}

/** Case- and Lao-insensitive match of a query against a label + help line (both NFC). */
export function settingMatches(query: string, ...text: (string | undefined)[]): boolean {
  const q = query.normalize("NFC").toLowerCase().trim()
  return !q || text.some((t) => !!t && t.normalize("NFC").toLowerCase().includes(q))
}

export const SETTINGS_PAGE_LABELS: Record<SettingsPageId, string> = {
  profile: "ໂປຣໄຟລ໌", security: "ຄວາມປອດໄພ", notifications: "ແຈ້ງເຕືອນ", display: "ການສະແດງຜົນ",
  general: "ທົ່ວໄປ", members: "ສະມາຊິກ & ສິດ", integrations: "ການເຊື່ອມຕໍ່", app: "ການຕັ້ງຄ່າຂອງແອັບ",
  audit: "ປະຫວັດການປ່ຽນ", data: "ຂໍ້ມູນ & ສຳຮອງ", danger: "ເຂດອັນຕະລາຍ",
}
const CORE_LABELS: Record<string, string> = {
  "profile.photo": "ຮູບໂປຣໄຟລ໌", "profile.name": "ຊື່ ແລະ ນາມສະກຸນ", "profile.code": "ລະຫັດພະນັກງານ", "profile.phone": "ເບີໂທ", "profile.email": "ອີເມວ",
  "security.password": "ລະຫັດຜ່ານ", "security.twoFactor": "ຢືນຢັນ 2 ຂັ້ນ", "security.autoLock": "ລັອກອັດຕະໂນມັດ", "security.devices": "ອຸປະກອນທີ່ເຂົ້າລະບົບ",
  "notifications.quiet": "ຊ່ວງງຽບ", "notifications.quietHours": "ເວລາງຽບ",
  "display.theme": "ຮູບແບບສີ", "display.fontSize": "ຂະໜາດຕົວໜັງສື", "display.density": "ຄວາມໜາແໜ້ນ", "display.lang": "ພາສາ", "display.dateFormat": "ຮູບແບບວັນທີ", "display.numberFormat": "ຮູບແບບຕົວເລກ",
  "general.orgName": "ຊື່ອົງກອນ", "general.logo": "ໂລໂກ້", "general.timezone": "ເຂດເວລາ", "general.currency": "ສະກຸນເງິນ", "general.workDays": "ມື້ເຮັດວຽກ", "general.workHours": "ເວລາເຮັດວຽກ", "general.weekStart": "ມື້ເລີ່ມອາທິດ",
  "members.list": "ສະມາຊິກ", "members.roles": "ສິດຕາມບົດບາດ", "integrations.list": "ບໍລິການທີ່ເຊື່ອມ", "audit.list": "ປະຫວັດລ່າສຸດ",
  "data.storage": "ພື້ນທີ່ເກັບໄຟລ໌", "data.autoDelete": "ລຶບໄຟລ໌ເກົ່າອັດຕະໂນມັດ", "data.backup": "ສຳຮອງອັດຕະໂນມັດ", "data.backupFreq": "ຄວາມຖີ່", "data.export": "ສົ່ງອອກຂໍ້ມູນທັງໝົດ",
  "danger.reset": "ລ້າງການຕັ້ງຄ່າ", "danger.transfer": "ໂອນຄວາມເປັນເຈົ້າຂອງ", "danger.purge": "ລຶບຂໍ້ມູນທົດລອງ",
}

/** key -> Lao label for every row the page shows (core, matrix rows, app rows). Feeds search and the audit log. */
export function settingsLabels(config: SettingsConfig): Record<string, string> {
  const l: Record<string, string> = { ...CORE_LABELS }
  for (const e of [...SETTINGS_EVENTS, ...(config.events ?? [])]) l["notifications." + e.id] = e.label
  for (const p of [...SETTINGS_PERMISSIONS, ...(config.permissions ?? [])]) l["members.role." + p.id] = "ສິດ: " + p.label
  for (const g of config.app ?? []) for (const r of g.rows) l["app." + r.key] = r.label
  return l
}

/** Error text per key for the current values. Save stays disabled while this is not empty. */
export function settingsErrors(config: SettingsConfig, v: SettingsValues): Record<string, string> {
  const e: Record<string, string> = {}
  const put = (k: string, m: string | undefined) => { if (m) e[k] = m }
  put("profile.phone", settingPhoneError(v["profile.phone"]))
  put("general.workHours", validateSettingRow({ type: "time-range" }, v["general.workHours"]))
  if (v["notifications.quiet"]) put("notifications.quietHours", validateSettingRow({ type: "time-range" }, v["notifications.quietHours"]))
  for (const g of config.app ?? []) for (const r of g.rows) put("app." + r.key, validateSettingRow(r, v["app." + r.key]))
  return e
}
