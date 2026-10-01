/** Money is Lao Kip. Rule from the old kit: append "ກີບ", never also the ₭ glyph. */
export const fmtKip = (n: number) => Math.round(n).toLocaleString("en-US") + " ກີບ"
/** Short form for tight cells (stat bars, tiles): 1.2K, 3.4M, 1.5B */
export function fmtKipShort(n: number) {
  const a = Math.abs(n), s = n < 0 ? "-" : ""
  const f = (v: number, u: string) => s + (Math.round(v * 10) / 10).toString().replace(/\.0$/, "") + u
  if (a >= 1e9) return f(a / 1e9, "B")
  if (a >= 1e6) return f(a / 1e6, "M")
  if (a >= 1e3) return f(a / 1e3, "K")
  return s + Math.round(a)
}
export const fmtNum = (n: number) => n.toLocaleString("en-US")
