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
/** True when the hour cell h sits strictly inside the span (the start hour itself is not "inside"). */
export function hourInSpan(h: number, starts: number | null, len: number | null): boolean {
  if (starts === null || len === null) return false
  const at = (h * 60 - starts + DAY_MIN) % DAY_MIN
  return at > 0 && at < len
}
