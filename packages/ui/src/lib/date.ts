/** Dates are plain 'YYYY-MM-DD' strings everywhere (no timezone surprises). Weeks start Monday. */
export const LAO_MONTHS = ["ມັງກອນ","ກຸມພາ","ມີນາ","ເມສາ","ພຶດສະພາ","ມິຖຸນາ","ກໍລະກົດ","ສິງຫາ","ກັນຍາ","ຕຸລາ","ພະຈິກ","ທັນວາ"]
export const LAO_WEEKDAYS = ["ຈັນ","ຄານ","ພຸດ","ພະຫັດ","ສຸກ","ເສົາ","ອາທິດ"]
export const pad = (n: number) => String(n).padStart(2, "0")
export const toISO = (y: number, m: number, d: number) => y + "-" + pad(m + 1) + "-" + pad(d) // m is 0-based
export function parseISO(s: string): { y: number; m: number; d: number } | null {
  const r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!r) return null
  const y = +r[1], m = +r[2] - 1, d = +r[3]
  return daysIn(y, m) >= d && m >= 0 && m < 12 && d >= 1 ? { y, m, d } : null
}
export const daysIn = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
export const todayISO = () => { const t = new Date(); return toISO(t.getFullYear(), t.getMonth(), t.getDate()) }
/** Mon=0 ... Sun=6 */
export const weekdayIndex = (y: number, m: number, d: number) => (new Date(y, m, d).getDay() + 6) % 7

/** Cells for one month grid: leading blanks (null) then day numbers, padded to full weeks. */
export function monthCells(y: number, m: number): (number | null)[] {
  const lead = weekdayIndex(y, m, 1), n = daysIn(y, m)
  const cells: (number | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= n; d++) cells.push(d)
  while (cells.length % 7) cells.push(null)
  return cells
}
export function addMonths(y: number, m: number, delta: number) {
  const t = y * 12 + m + delta
  return { y: Math.floor(t / 12), m: ((t % 12) + 12) % 12 }
}
export function inRange(iso: string, min?: string, max?: string) {
  return (!min || iso >= min) && (!max || iso <= max)
}
export const formatLaoDate = (iso: string) => {
  const p = parseISO(iso); return p ? p.d + " " + LAO_MONTHS[p.m] + " " + p.y : ""
}
