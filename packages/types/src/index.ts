import { z } from "zod"

/** Shared by browser AND Worker API: one definition, checked on both sides. */
export const Role = z.enum(["guard", "inspector", "supervisor", "office", "hr", "manager", "admin"])
export type Role = z.infer<typeof Role>

/** HRM V4 is the master staff list. Every other app keeps a read-only copy of this shape. */
export const Staff = z.object({
  id: z.string().min(1),                  // employee ID, also the guard sign-in
  name: z.string().min(1),
  role: Role,
  site: z.string().nullable(),
  active: z.boolean(),
})
export type Staff = z.infer<typeof Staff>

export const ScanInput = z.object({
  guardId: z.string().min(1),
  pointId: z.string().min(1),
  scannedAt: z.iso.datetime(),            // phone clock; server also stamps its own time
  clientId: z.string().min(8),            // unique per scan: makes retries safe (no duplicates)
  photoKey: z.string().optional(),        // R2 key when a photo was taken
  note: z.string().max(500).optional(),
})
export type ScanInput = z.infer<typeof ScanInput>

export const ApiError = z.object({ ok: z.literal(false), error: z.string(), code: z.string().optional() })
export const ok = <T extends z.ZodType>(data: T) => z.object({ ok: z.literal(true), data })

/** Free-text sanitising rule from CLAUDE.md: strip control chars, cap length. */
export function cleanText(s: string, max = 500): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().slice(0, max)
}
/** Lao: compose sara-am (U+0ECD + U+0EB2 -> U+0EB3) so text compares equal everywhere. */
export const normalizeLao = (s: string) => s.normalize("NFC").replace(/\u0ECD\u0EB2/g, "\u0EB3")
