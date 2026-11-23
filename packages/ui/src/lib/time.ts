// 24 h clock helpers for TimePicker / TimeRangePicker. Times are "HH:MM" strings; minutes are 0..1439.
export const DAY_MIN = 1440
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/

/** Use to check a "HH:MM" 24 h value (00:00–23:59). */
export function isHHMM(t: string): boolean { return HHMM.test(t) }
/** "HH:MM" → minutes after midnight, or null when not a valid 24 h time. */
export function timeToMin(t: string): number | null { return HHMM.test(t) ? +t.slice(0, 2) * 60 + +t.slice(3) : null }
/** Minutes → "HH:MM", wrapping past midnight both ways (1500 → "01:00", -60 → "23:00"). */
export function minToTime(m: number): string { const x = ((m % DAY_MIN) + DAY_MIN) % DAY_MIN; return String(Math.floor(x / 60)).padStart(2, "0") + ":" + String(x % 60).padStart(2, "0") }
/** Length of a start→end span in minutes, crossing midnight when end < start. null when either is missing or both are equal. */
export function spanMin(starts: number | null, ends: number | null): number | null { return starts === null || ends === null || starts === ends ? null : (ends - starts + DAY_MIN) % DAY_MIN }
/** The 24 h bar segments of a span: one [a,b] inside the day, or two when it crosses midnight. */
export function spanSegments(starts: number | null, ends: number | null): [number, number][] {
  if (starts === null || ends === null || starts === ends) return []
  return ends > starts ? [[starts, ends]] : [[starts, DAY_MIN], [0, ends]]
}
/**
 * What a person typed into a time field → minutes, or null when it is not a time.
 * "6" → 06:00, "18" → 18:00, "630" → 06:30, "1830" / "18:30" / "18.30" / "18h30" → 18:30, "6:5" → 06:05.
 */
export function parseTimeText(raw: string): number | null {
  const t = raw.trim()
  if (!t) return null
  const parts = t.split(/[^0-9]+/).filter(Boolean)
  let h: number, m: number
  if (parts.length >= 2) { h = +parts[0]; m = +parts[1] }
  else {
    const d = parts[0] ?? ""
    if (!d || d.length > 4) return null
    if (d.length <= 2) { h = +d; m = 0 } else if (d.length === 3) { h = +d[0]; m = +d.slice(1) } else { h = +d.slice(0, 2); m = +d.slice(2) }
  }
  if (!Number.isInteger(h) || !Number.isInteger(m) || h > 23 || m > 59) return null
  return h * 60 + m
}
/** The times a time list offers: every step minutes for a whole day, starting at from (wraps past midnight). */
export function timeSteps(step = 30, from = 0): number[] {
  const s = Math.max(1, Math.min(240, Math.round(step)))
  return Array.from({ length: Math.ceil(DAY_MIN / s) }, (_, i) => (from + i * s) % DAY_MIN)
}
/** True when the hour cell h sits strictly inside the span (the start hour itself is not "inside"). */
export function hourInSpan(h: number, starts: number | null, len: number | null): boolean {
  if (starts === null || len === null) return false
  const at = (h * 60 - starts + DAY_MIN) % DAY_MIN
  return at > 0 && at < len
}
