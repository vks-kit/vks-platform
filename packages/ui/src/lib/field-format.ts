/**
 * Pure parsers / formatters behind the standard inputs (PhoneInput, MoneyInput, TimeInput, NumberInput).
 * No React in here, so every rule is unit-tested (packages/ui/test/fields.test.ts).
 */

export const digitsOnly = (s: string) => s.replace(/\D/g, "")

/* ---------------- Lao mobile: 020 XXXX XXXX ---------------- */
export const PHONE_LA_PREFIX = "020"
export const PHONE_LA_LEN = 8

/**
 * The 8 subscriber digits of a Lao mobile number, from anything a person types or pastes:
 * "5512 3456", "020 5512 3456", "20 5512 3456", "+856 20 5512 3456", "02055123456". Max 8 digits.
 */
export function parsePhoneLa(raw: string): string {
  let d = digitsOnly(raw)
  if (d.startsWith("856") && d.length > PHONE_LA_LEN) d = d.slice(3)
  if (d.startsWith("020")) d = d.slice(3)
  else if (d.startsWith("0")) d = d.slice(1)
  else if (d.length > PHONE_LA_LEN && d.startsWith("20")) d = d.slice(2)
  return d.slice(0, PHONE_LA_LEN)
}
/** "5512 3456" (the 8 digits grouped 4 + 4, partial while typing). */
export const fmtPhoneLa = (d: string) => d.slice(0, 4) + (d.length > 4 ? " " + d.slice(4, 8) : "")
/** "020 5512 3456" (partial while typing), or "" when there are no digits yet. */
export const fmtPhoneLaFull = (d: string) => (d ? PHONE_LA_PREFIX + " " + fmtPhoneLa(d) : "")
/** True when the number has all 8 digits after 020. */
export const isPhoneLa = (v: string) => parsePhoneLa(v).length === PHONE_LA_LEN
/** International form for an SMS / WhatsApp API: "+85620XXXXXXXX". Empty until the number is complete. */
export const phoneLaE164 = (v: string) => (isPhoneLa(v) ? "+85620" + parsePhoneLa(v) : "")

/* ---------------- Money ---------------- */
export type Currency = "LAK" | "THB" | "USD"
export const CURRENCY_DECIMALS: Record<Currency, number> = { LAK: 0, THB: 2, USD: 2 }
export const CURRENCY_LABEL: Record<Currency, string> = { LAK: "ກີບ", THB: "ບາດ", USD: "ໂດລາ" }

/** Clean typed text into a plain number string: digits, at most one ".", at most `decimals` decimals, no leading zeros. */
export function parseMoney(raw: string, decimals: number): string {
  let s = raw.replace(/,/g, "").replace(/[^\d.]/g, "")
  if (decimals === 0) s = s.split(".")[0]
  const [int0, ...rest] = s.split(".")
  const int = int0.replace(/^0+(?=\d)/, "")
  if (!rest.length) return int
  return (int === "" ? "0" : int) + "." + rest.join("").slice(0, decimals)
}
/** Add thousands commas to a plain number string: "1234567.5" -> "1,234,567.5". */
export function fmtMoneyText(s: string): string {
  const [i, f] = s.split(".")
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (f === undefined ? "" : "." + f)
}
export const moneyNum = (s: string): number | null => (s === "" || s === "." ? null : Number(s))
/** Number -> the text shown in the field ("1,234,567"). */
export const moneyText = (n: number | null, decimals: number) => (n == null ? "" : fmtMoneyText(parseMoney(String(n), decimals)))

/* ---------------- Time (24 h) ---------------- */
export const pad2 = (n: number | string) => String(n).padStart(2, "0")
/** "9:05", "0905" or "09:05" -> "09:05"; anything invalid -> "". */
export function normTime(v: string): string {
  const m = /^(\d{1,2}):?(\d{2})$/.exec(v.trim())
  if (!m) return ""
  const h = Number(m[1]), mi = Number(m[2])
  return h > 23 || mi > 59 ? "" : pad2(h) + ":" + pad2(mi)
}
/** Move a "HH:mm" value by minutes, wrapping around midnight. */
export function stepTime(v: string, deltaMin: number): string {
  const t = normTime(v)
  if (!t) return ""
  const total = (Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) + deltaMin) % 1440
  const w = (total + 1440) % 1440
  return pad2(Math.floor(w / 60)) + ":" + pad2(w % 60)
}
/** The current time as "HH:mm", minutes rounded to `step` (e.g. 5 -> 08:10). */
export function nowTime(step = 1, d = new Date()): string {
  const total = Math.round((d.getHours() * 60 + d.getMinutes()) / step) * step % 1440
  return pad2(Math.floor(total / 60)) + ":" + pad2(total % 60)
}

/* ---------------- Number ---------------- */
export const clampNum = (n: number, min?: number, max?: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
export const roundTo = (n: number, decimals: number) => { const f = 10 ** decimals; return Math.round(n * f) / f }
/** Clean typed text: digits, one ".", optional leading "-". */
export function parseNumberText(raw: string, decimals: number, allowNegative: boolean): string {
  let s = raw.replace(/[^\d.\-]/g, "")
  const neg = allowNegative && s.startsWith("-")
  s = s.replace(/-/g, "")
  if (decimals === 0) s = s.split(".")[0]
  const [i, ...rest] = s.split(".")
  const out = rest.length ? i + "." + rest.join("").slice(0, decimals) : i
  return (neg ? "-" : "") + out
}
export const numFromText = (s: string): number | null => (s === "" || s === "-" || s === "." || s === "-." || !Number.isFinite(Number(s)) ? null : Number(s))

/* ---------------- Caret ---------------- */
/** Where the caret goes after formatting: keep it after the same number of "real" characters (digits) it had before. */
export function caretAfter(before: string, formatted: string, sig: RegExp): number {
  const n = [...before].filter((c) => sig.test(c)).length
  if (n === 0) return 0
  let seen = 0
  for (let i = 0; i < formatted.length; i++) if (sig.test(formatted[i]) && ++seen === n) return i + 1
  return formatted.length
}
