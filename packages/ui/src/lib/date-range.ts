import { parseISO, toISO, todayISO, daysIn } from "./date"

export type Range = { from?: string; to?: string }
export function addDays(iso: string, n: number) {
  const p = parseISO(iso)!, d = new Date(Date.UTC(p.y, p.m, p.d + n))
  return toISO(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}
/** Days from a to b, both ends counted. 2026-09-01..2026-09-01 = 1. */
export function daysBetween(a: string, b: string) {
  const pa = parseISO(a)!, pb = parseISO(b)!
  return Math.round((Date.UTC(pb.y, pb.m, pb.d) - Date.UTC(pa.y, pa.m, pa.d)) / 86400000) + 1
}
/** Two-tap range: first tap = start, second = end (in either order), third tap starts over. */
export function pickRange(cur: Range, iso: string): Range {
  if (!cur.from || cur.to) return { from: iso }
  return iso < cur.from ? { from: iso, to: cur.from } : { from: cur.from, to: iso }
}
export const inSpan = (iso: string, r: Range) => !!r.from && !!r.to && iso >= r.from && iso <= r.to
export function clampRange(r: Range, min?: string, max?: string): Range {
  const c = (v?: string) => (v && min && v < min ? min : v && max && v > max ? max : v)
  return { from: c(r.from), to: c(r.to) }
}
export type Preset = { id: string; en: string; lo: string; range: (today: string) => { from: string; to: string } }
const monthStart = (iso: string) => { const p = parseISO(iso)!; return toISO(p.y, p.m, 1) }
export const PRESETS: Preset[] = [
  { id: "today", en: "Today", lo: "ມື້ນີ້", range: (t) => ({ from: t, to: t }) },
  { id: "yesterday", en: "Yesterday", lo: "ມື້ວານ", range: (t) => ({ from: addDays(t, -1), to: addDays(t, -1) }) },
  { id: "last7", en: "Last 7 days", lo: "7 ມື້ຜ່ານມາ", range: (t) => ({ from: addDays(t, -6), to: t }) },
  { id: "last30", en: "Last 30 days", lo: "30 ມື້ຜ່ານມາ", range: (t) => ({ from: addDays(t, -29), to: t }) },
  { id: "thisMonth", en: "This month", lo: "ເດືອນນີ້", range: (t) => ({ from: monthStart(t), to: t }) },
  { id: "lastMonth", en: "Last month", lo: "ເດືອນກ່ອນ", range: (t) => {
    const p = parseISO(t)!, y = p.m === 0 ? p.y - 1 : p.y, m = p.m === 0 ? 11 : p.m - 1
    return { from: toISO(y, m, 1), to: toISO(y, m, daysIn(y, m)) } } },
]
export const todayRangeBase = todayISO
