# Instant data

> Pages open instantly on a second visit: cached data paints at once, refreshes in the background; Back keeps filters and scroll.

- Group: Foundations · New
- Source: `packages/ui/src/lib/use-data.ts`
- Live docs: #/docs/instant-data

```ts
import { useData, prefetchData, invalidateData, mutateData, peekData, useScrollRestore, useStickyState } from "@vks-kit/ui"
```

## Usage

Use for every page that loads data from the API. Replaces an app's own useLoad/useEffect+fetch. The first visit shows a skeleton; every later visit (Back from a record, switching tabs) paints the cached copy at once and refreshes quietly.

## Example

```tsx
// list page
const [status, setStatus] = useStickyState("people.status", "active")   // survives opening a record
const [q, setQ] = useStickyState("people.q", "")
const { data, loading, refreshing, error, reload } = useData("people:" + status, () => api.people(status))
useScrollRestore("people", !!data)                                       // Back lands where you were

if (loading) return <SkeletonTable />                                     // first visit only
// row: start loading the record before the click lands
<tr onPointerEnter={() => prefetchData("person:" + p.id, () => api.person(p.id))} …>

// record page — same key = instant when prefetched
const { data: person } = useData("person:" + id, () => api.person(id))

// after a save
await api.savePerson(id, patch)
mutateData("person:" + id, (p) => ({ ...p!, ...patch }))                 // show it now
invalidateData("people:*")                                               // lists refetch
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| useData(key, fn, opts?) | { data, error, loading, refreshing, reload } |  | key names the data and must change with every input of fn ("people:" + status). null = don't fetch. loading is true only when there is nothing to show; refreshing = background update over shown data. |
| opts.staleMs | number | 0 | Skip the background refetch while the cached copy is younger than this. |
| opts.refreshOnFocus | boolean | true | Refresh (if older than 30 s) when the tab or window comes back. |
| prefetchData(key, fn, staleMs?) | void |  | Warm the cache on hover/touch/idle. Shares the request with any page that asks for the same key. |
| invalidateData(key?) | void |  | Mark old: exact key, prefix with *, or all. Pages showing it refetch now. |
| mutateData(key, next) | void |  | Write into the cache (optimistic update). Every page using the key re-renders. |
| useScrollRestore(key, ready) | void |  | Remember window scroll per key; restore once ready (data on screen). |
| useStickyState(key, initial) | [value, set] |  | useState kept in sessionStorage for this tab — filters, search, tabs. |

## Notes

- Same key = one request, however many pages ask.
- A failed refresh keeps the last good data on screen; error is set only when nothing could be shown.
- Cache lives in memory for the tab; a full reload starts empty (use swr() from @vks-kit/core for an across-reload localStorage copy).
- Keep a list page mounted while a record is open (hide it) when the app routes by state — Back is then free; useData makes it fast even when it unmounts.
