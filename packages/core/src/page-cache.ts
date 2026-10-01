/**
 * Stale-while-revalidate for page data (the kit's "instant load" rule):
 * paint the cached copy at once, fetch fresh in the background, write it back.
 * Keys are per user so two accounts on one phone never mix.
 */
export const cacheKey = (app: string, userId: string, page: string) => "vks_" + app + "_ac_" + userId + "_" + page
export function cacheGet<T>(key: string, store: Pick<Storage, "getItem"> = localStorage): T | null {
  try { const r = store.getItem(key); return r ? (JSON.parse(r) as T) : null } catch { return null }
}
export function cacheSet(key: string, value: unknown, store: Pick<Storage, "setItem"> = localStorage) {
  try { store.setItem(key, JSON.stringify(value)) } catch { /* storage full: caching is optional */ }
}
/** onCached fires first (if a copy exists), then the fetch result is returned and stored. */
export async function swr<T>(key: string, fetcher: () => Promise<T>, onCached?: (v: T) => void, store?: Storage): Promise<T> {
  const c = cacheGet<T>(key, store); if (c !== null) onCached?.(c)
  const fresh = await fetcher(); cacheSet(key, fresh, store); return fresh
}
