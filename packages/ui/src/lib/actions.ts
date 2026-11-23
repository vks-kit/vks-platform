/*
 * Pure logic behind useOptimisticList and docTitle (no React), unit-tested in node (packages/ui/test/actions.test.ts).
 */

/** One pending change to a list item: the id it applies to and the fields it changes. */
export type ListPatch<T> = { id: string; patch: Partial<T> }

/** The list as the person should see it right now: every pending patch laid over the saved items, in order. */
export function applyPatches<T extends { id: string }>(items: T[], patches: ListPatch<T>[]): T[] {
  if (!patches.length) return items
  return items.map((it) => {
    let out = it
    for (const p of patches) if (p.id === it.id) out = { ...out, ...p.patch }
    return out
  })
}

/** Browser tab text: "(3) ກະ · VKS HR". badge 0 / undefined is left out; an empty title falls back to the app name. */
export function docTitleText(title: string, appName?: string, badge?: number): string {
  const t = title.trim(), a = (appName ?? "").trim()
  const base = t && a && t !== a ? t + " · " + a : t || a
  return (badge && badge > 0 ? "(" + (badge > 99 ? "99+" : badge) + ") " : "") + base
}
