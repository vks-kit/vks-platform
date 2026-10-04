import { cleanText } from "@vks-kit/types"
import type { QueueItem } from "@vks-kit/core"

/*
 * Pure logic behind the business parts (ApprovalCard, SyncStatus, Timeline audit rows).
 * No React here, so it is unit-tested in node (packages/ui/test/workflow.test.ts).
 */

/** One changed field in an audit row: label is what the reader sees, from/to are display strings. */
export type FieldChange = { field: string; label: string; from: string; to: string }

const show = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "—"
  if (typeof v === "boolean") return v ? "✓" : "✗"
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

/**
 * Fields that differ between two versions of a record, in key order (before first, then new keys).
 * labels maps a field name to the text shown; ignore skips noise such as updatedAt.
 */
export function diffFields(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
  opts: { labels?: Record<string, string>; ignore?: string[] } = {},
): FieldChange[] {
  const a = before ?? {}, b = after ?? {}
  const skip = new Set(opts.ignore ?? [])
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])]
  const out: FieldChange[] = []
  for (const k of keys) {
    if (skip.has(k)) continue
    const from = show(a[k]), to = show(b[k])
    if (from !== to) out.push({ field: k, label: opts.labels?.[k] ?? k, from, to })
  }
  return out
}

/** Minimum length of a rejection reason after cleanText(). */
export const REJECT_REASON_MIN = 5

/** null when the reason is fine, otherwise the Lao error to show under the field. */
export function rejectReasonError(reason: string, min = REJECT_REASON_MIN): string | null {
  const s = cleanText(reason)
  if (!s) return "ກະລຸນາໃສ່ເຫດຜົນ"
  if ([...s].length < min) return "ເຫດຜົນສັ້ນເກີນໄປ (ຢ່າງໜ້ອຍ " + min + " ຕົວອັກສອນ)"
  return null
}

export type SyncState = "synced" | "pending" | "failing"
/** What SyncStatus needs. items = the offline queue contents (QueueItem from @vks-kit/core). */
export type SyncInput = { queued?: number; items?: readonly QueueItem<unknown>[]; dropped?: number; error?: string | boolean; maxTries?: number }

/**
 * synced = nothing waiting; pending = items waiting; failing = last flush errored, items were dropped,
 * or an item is one failure away from being dropped (tries >= maxTries - 1; default 8, same as OfflineQueue).
 */
export function syncState(i: SyncInput): { state: SyncState; queued: number; oldestAt: number | null } {
  const items = i.items ?? []
  const queued = i.items ? items.length : Math.max(0, i.queued ?? 0)
  const oldestAt = items.length ? Math.min(...items.map((x) => x.queuedAt)) : null
  const maxTries = i.maxTries ?? 8
  const stuck = items.some((x) => x.tries >= maxTries - 1)
  const state: SyncState = i.error || (i.dropped ?? 0) > 0 || stuck ? "failing" : queued > 0 ? "pending" : "synced"
  return { state, queued, oldestAt }
}

const two = (n: number) => String(n).padStart(2, "0")
/** "ດຽວນີ້" under a minute, "N ນາທີກ່ອນ" under an hour, otherwise the clock time HH:MM (local). */
export function sinceLabel(at: number, now = Date.now()): string {
  const s = Math.max(0, Math.floor((now - at) / 1000))
  if (s < 60) return "ດຽວນີ້"
  if (s < 3600) return Math.floor(s / 60) + " ນາທີກ່ອນ"
  const d = new Date(at)
  return two(d.getHours()) + ":" + two(d.getMinutes())
}
