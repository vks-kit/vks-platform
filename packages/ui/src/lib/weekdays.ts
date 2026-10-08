/** Lao weekday initials, Monday first (matches a 7-char work-days mask "1111100"). */
export const WEEKDAYS_LO = ["ຈ", "ອ", "ພ", "ພຫ", "ສ", "ສ", "ອາ"] as const
/** Full Lao weekday names, Monday first. */
export const WEEKDAY_NAMES_LO = ["ຈັນ", "ອັງຄານ", "ພຸດ", "ພະຫັດ", "ສຸກ", "ເສົາ", "ອາທິດ"] as const

/** A 7-char Monday-first mask as short Lao text: "ທຸກມື້", "ຈ–ສ" (Mon–Fri), "ຈ–ສ (6 ມື້)" (Mon–Sat), else the initials ("ຈ ພ ສ").
 *  ສຸກ and ເສົາ share the initial ສ, so only those two runs are shortened. */
export function workDaysText(mask: string): string {
  if (!/^[01]{7}$/.test(mask)) return mask
  if (mask === "1111111") return "ທຸກມື້"
  if (mask === "1111100") return "ຈ–ສ"
  if (mask === "1111110") return "ຈ–ສ (6 ມື້)"
  if (mask === "0000000") return "—"
  return [...mask].map((c, i) => (c === "1" ? WEEKDAYS_LO[i] : null)).filter(Boolean).join(" ")
}

/** Number of working days in a mask. */
export const workDaysCount = (mask: string) => [...mask].filter((c) => c === "1").length
