/*
 * Pure logic behind the VKS domain parts (PatrolCheckpointRail, ShiftRosterGrid, IncidentEscalationCard,
 * ContractQuoteSummary). No React here, so it is unit-tested in node (packages/ui/test/domain.test.ts).
 */

export type CheckpointStatus = "done" | "next" | "pending" | "missed"
/** One checkpoint on a patrol round. distanceM comes from distanceM() in @vks-kit/core (null = no GPS yet). */
export type Checkpoint = { id: string; name: string; status: CheckpointStatus; time?: string; distanceM?: number | null; method?: "nfc" | "qr" | "gps"; note?: string }

/** Done / missed / total counts and the index of the checkpoint to scan next (-1 when none is left). */
export function checkpointProgress(list: Checkpoint[]) {
  const done = list.filter((c) => c.status === "done").length
  const missed = list.filter((c) => c.status === "missed").length
  let next = list.findIndex((c) => c.status === "next")
  if (next < 0) next = list.findIndex((c) => c.status === "pending")
  return { done, missed, total: list.length, next, complete: list.length > 0 && done === list.length }
}

/** Metres as short Lao text: "850 ມ" under 1 km, then "1.2 ກມ". */
export function fmtDistance(m: number): string {
  if (!Number.isFinite(m) || m < 0) return "—"
  if (m < 1000) return Math.round(m) + " ມ"
  return String(Math.round(m / 100) / 10) + " ກມ"
}

/** D = day shift, N = night shift, OFF = rest day, "" = not planned yet. */
export type ShiftCode = "D" | "N" | "OFF" | ""
/** staffId -> dayKey -> shift. */
export type Roster = Record<string, Record<string, ShiftCode | undefined>>
/** Minimum guards needed on a day, per shift. */
export type RosterNeed = { D?: number; N?: number }
export type DayCover = { day: string; D: number; N: number; off: number; short: ("D" | "N")[] }

const CYCLE: ShiftCode[] = ["D", "N", "OFF"]
/** The shift a tap moves a roster cell to: D -> N -> OFF -> D ("" starts at D). */
export function nextShift(c: ShiftCode): ShiftCode {
  return CYCLE[(CYCLE.indexOf(c) + 1) % CYCLE.length]
}

/** Head count per day and which shifts are below the need (need can differ per day). */
export function rosterCover(roster: Roster, staffIds: string[], dayKeys: string[], need?: RosterNeed | ((day: string) => RosterNeed | undefined)): DayCover[] {
  return dayKeys.map((day) => {
    let D = 0, N = 0, off = 0
    for (const s of staffIds) {
      const c = roster[s]?.[day]
      if (c === "D") D++
      else if (c === "N") N++
      else if (c === "OFF") off++
    }
    const n = typeof need === "function" ? need(day) : need
    const short: ("D" | "N")[] = []
    if (n?.D != null && D < n.D) short.push("D")
    if (n?.N != null && N < n.N) short.push("N")
    return { day, D, N, off, short }
  })
}

/** Time left on an incident's response SLA. text is mm:ss (h:mm:ss past an hour), "-" in front once overdue; pct = share of the SLA still left (0..1). */
export function slaLeft(openedAt: number, slaMinutes: number, now: number) {
  const total = Math.max(1, slaMinutes * 60_000)
  const ms = openedAt + total - now
  const s = Math.floor(Math.abs(ms) / 1000)
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  const p = (n: number) => String(n).padStart(2, "0")
  const text = (ms < 0 ? "-" : "") + (h ? h + ":" + p(m) : p(m)) + ":" + p(sec)
  return { ms, overdue: ms < 0, text, pct: Math.max(0, Math.min(1, ms / total)) }
}

/** One priced line on a guard-service quote: qty guards (or hours, visits) x unitPrice in Kip. */
export type QuoteLine = { id: string; label: string; qty: number; unitPrice: number; unit?: string; min?: number; max?: number }

/** Quote money in whole Kip: subtotal, discount (never more than the subtotal), VAT on what is left, total. */
export function quoteTotals(lines: QuoteLine[], vatRate = 0.1, discount = 0) {
  const subtotal = Math.round(lines.reduce((s, l) => s + Math.max(0, l.qty) * Math.max(0, l.unitPrice), 0))
  const off = Math.round(Math.max(0, Math.min(discount, subtotal)))
  const base = subtotal - off
  const vat = Math.round(base * Math.max(0, vatRate))
  return { subtotal, discount: off, base, vat, total: base + vat }
}
