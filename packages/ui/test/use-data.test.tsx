// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act, waitFor } from "@testing-library/react"
import { useData, prefetchData, invalidateData, mutateData, peekData, clearDataCache, useStickyState } from "../src/lib/use-data"

const deferred = <T,>() => { let res!: (v: T) => void, rej!: (e: unknown) => void; const p = new Promise<T>((a, b) => { res = a; rej = b }); return { p, res, rej } }

describe("useData", () => {
  beforeEach(() => clearDataCache())

  it("loads once, then serves the cache instantly on the next mount and refreshes in the background", async () => {
    let calls = 0
    const fn = () => { calls++; return Promise.resolve(["a" + calls]) }
    const a = renderHook(() => useData("people", fn))
    expect(a.result.current.loading).toBe(true)
    await waitFor(() => expect(a.result.current.data).toEqual(["a1"]))
    a.unmount()
    const d = deferred<string[]>()
    const b = renderHook(() => useData("people", () => { calls++; return d.p }))
    expect(b.result.current.data).toEqual(["a1"]) // instant, no skeleton
    expect(b.result.current.loading).toBe(false)
    expect(b.result.current.refreshing).toBe(true)
    await act(async () => { d.res(["fresh"]) })
    expect(b.result.current.data).toEqual(["fresh"])
    expect(b.result.current.refreshing).toBe(false)
  })

  it("skips the refetch while data is younger than staleMs", async () => {
    let calls = 0
    const fn = () => Promise.resolve(++calls)
    const a = renderHook(() => useData("k", fn, { staleMs: 60_000 }))
    await waitFor(() => expect(a.result.current.data).toBe(1))
    a.unmount()
    const b = renderHook(() => useData("k", fn, { staleMs: 60_000 }))
    expect(b.result.current.data).toBe(1)
    expect(calls).toBe(1)
  })

  it("shares one request between pages asking for the same key", async () => {
    let calls = 0
    const d = deferred<number>()
    const fn = () => { calls++; return d.p }
    renderHook(() => useData("same", fn)); renderHook(() => useData("same", fn))
    prefetchData("same", fn)
    expect(calls).toBe(1)
    await act(async () => { d.res(7) })
  })

  it("keeps the last good data when a refresh fails, and reports a first-load error", async () => {
    const a = renderHook(() => useData("e", () => Promise.reject(new Error("offline"))))
    await waitFor(() => expect(a.result.current.error).toBe("offline"))
    expect(a.result.current.loading).toBe(false)
    mutateData("ok", 1)
    const b = renderHook(() => useData("ok", () => Promise.reject(new Error("boom"))))
    await waitFor(() => expect(b.result.current.error).toBe("boom"))
    expect(b.result.current.data).toBe(1)
  })

  it("invalidate refetches pages on screen; mutate writes through", async () => {
    let n = 0
    const a = renderHook(() => useData("list:active", () => Promise.resolve(++n)))
    await waitFor(() => expect(a.result.current.data).toBe(1))
    await act(async () => { invalidateData("list:*") })
    await waitFor(() => expect(a.result.current.data).toBe(2))
    act(() => mutateData<number>("list:active", (p) => (p ?? 0) + 10))
    expect(a.result.current.data).toBe(12)
    expect(peekData("list:active")).toBe(12)
  })

  it("a null key does nothing", () => {
    const a = renderHook(() => useData(null, () => Promise.resolve(1)))
    expect(a.result.current).toMatchObject({ data: null, loading: false, refreshing: false })
  })
})

describe("useStickyState", () => {
  it("survives an unmount", () => {
    const a = renderHook(() => useStickyState("q", ""))
    act(() => a.result.current[1]("ສົມ"))
    a.unmount()
    const b = renderHook(() => useStickyState("q", ""))
    expect(b.result.current[0]).toBe("ສົມ")
  })
})
