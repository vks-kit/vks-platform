import * as React from "react"

/*
 * Instant page data: stale-while-revalidate + prefetch + kept state.
 * A page that was opened before paints at once from memory, then refreshes quietly.
 * Requests for the same key share one fetch. Nothing extra to install.
 */

type Entry = { data?: unknown; error?: string; at: number; p?: Promise<unknown>; subs: Set<() => void>; fn?: () => Promise<unknown> }
const store = new Map<string, Entry>()
const entry = (k: string): Entry => { let e = store.get(k); if (!e) { e = { at: 0, subs: new Set() }; store.set(k, e) } return e }
const ping = (e: Entry) => { for (const f of e.subs) f() }
const msg = (x: unknown) => (x instanceof Error ? x.message : String(x))

/** Fetch `key` once; concurrent callers share the same promise. Resolves with the data, rejects with the error. */
function load<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const e = entry(key)
  if (e.p) return e.p as Promise<T>
  const p = fn().then(
    (d) => { e.data = d; e.error = undefined; e.at = Date.now(); return d },
    (x: unknown) => { e.error = msg(x); throw x },
  ).finally(() => { if (e.p === p) e.p = undefined; ping(e) })
  e.p = p; ping(e)
  return p
}

/** Warm the cache before the user gets there (hover, touch, idle). Skips fresh data. */
export function prefetchData<T>(key: string, fn: () => Promise<T>, staleMs = 30_000): void {
  const e = store.get(key)
  if (e && (e.p || (e.data !== undefined && Date.now() - e.at < staleMs))) return
  load(key, fn).catch(() => {})
}

/** Mark cached data old so the next useData refetches. A key, a prefix ending in "*", or nothing (= everything). Pages showing it refetch now. */
export function invalidateData(key?: string): void {
  for (const [k, e] of store) if (!key || k === key || (key.endsWith("*") && k.startsWith(key.slice(0, -1)))) {
    e.at = 0
    if (e.subs.size && e.fn && !e.p) load(k, e.fn).catch(() => {}) // on screen: refetch now
  }
}

/** Write data into the cache directly (optimistic update after a save). Every page using the key re-renders. */
export function mutateData<T>(key: string, next: T | ((prev: T | undefined) => T)): void {
  const e = entry(key)
  e.data = typeof next === "function" ? (next as (p: T | undefined) => T)(e.data as T | undefined) : next
  e.at = Date.now(); e.error = undefined; ping(e)
}

/** Read what the cache holds for a key (undefined when nothing yet). */
export const peekData = <T,>(key: string): T | undefined => store.get(key)?.data as T | undefined

export type DataState<T> = {
  /** Last good data (cached or fresh); null before the first load. */
  data: T | null
  error: string | null
  /** True only when there is nothing to show yet — show a skeleton. */
  loading: boolean
  /** True while a background refresh runs over data already on screen. */
  refreshing: boolean
  /** Refetch now (keeps the current data on screen). */
  reload: () => void
}

/**
 * Use for page data that should open instantly on a second visit: shows the cached copy at once and refreshes it in the background (stale-while-revalidate); for one-off actions (save, delete) call the API directly instead.
 * `key` names the data and must change with every input the fetch uses (e.g. "people:" + status). `null` key = don't fetch.
 */
export function useData<T>(key: string | null, fn: () => Promise<T>, opts: { staleMs?: number; refreshOnFocus?: boolean } = {}): DataState<T> {
  const { staleMs = 0, refreshOnFocus = true } = opts
  const fnRef = React.useRef(fn); fnRef.current = fn
  const [, force] = React.useReducer((n: number) => n + 1, 0)
  React.useEffect(() => {
    if (!key) return
    const e = entry(key)
    e.subs.add(force); e.fn = () => fnRef.current()
    if (!e.p && (e.data === undefined || Date.now() - e.at >= staleMs)) load(key, () => fnRef.current()).catch(() => {})
    return () => { e.subs.delete(force) }
  }, [key, staleMs])
  React.useEffect(() => {
    if (!key || !refreshOnFocus) return
    const on = () => { if (document.visibilityState === "visible") prefetchData(key, () => fnRef.current(), Math.max(staleMs, 30_000)) }
    document.addEventListener("visibilitychange", on); window.addEventListener("focus", on)
    return () => { document.removeEventListener("visibilitychange", on); window.removeEventListener("focus", on) }
  }, [key, staleMs, refreshOnFocus])
  const reload = React.useCallback(() => { if (key) { const e = entry(key); if (!e.p) load(key, () => fnRef.current()).catch(() => {}) } }, [key])
  const e = key ? store.get(key) : undefined
  const has = e?.data !== undefined
  return {
    data: has ? (e!.data as T) : null,
    error: e?.p ? null : e?.error ?? null,
    loading: !!key && !has && !e?.error,
    refreshing: !!e?.p && has,
    reload,
  }
}

const scrolls = new Map<string, number>()
/**
 * Use on a list page so Back lands where the user was: remembers window scroll per key and restores it once `ready` (data on screen); for scroll inside a panel, keep your own ref instead.
 */
export function useScrollRestore(key: string, ready: boolean): void {
  const done = React.useRef(false)
  React.useEffect(() => { done.current = false }, [key])
  React.useLayoutEffect(() => {
    if (!ready || done.current) return
    done.current = true
    const y = scrolls.get(key)
    if (y) window.scrollTo({ top: y })
  }, [key, ready])
  React.useEffect(() => {
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (done.current) scrolls.set(key, window.scrollY) }) }
    window.addEventListener("scroll", on, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", on) }
  }, [key])
}

/**
 * Use for filters, search text and tabs that should survive opening a record and coming back (kept for this browser tab, sessionStorage); for values that belong in a shareable link, put them in the URL instead.
 */
export function useStickyState<T>(key: string, initial: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const k = "vks-sticky:" + key
  const [v, setV] = React.useState<T>(() => {
    try { const r = sessionStorage.getItem(k); if (r !== null) return JSON.parse(r) as T } catch { /* private mode */ }
    return typeof initial === "function" ? (initial as () => T)() : initial
  })
  React.useEffect(() => { try { sessionStorage.setItem(k, JSON.stringify(v)) } catch { /* full: optional */ } }, [k, v])
  return [v, setV]
}

/** Test helper: empty the data cache. */
export const clearDataCache = () => { store.clear(); scrolls.clear() }