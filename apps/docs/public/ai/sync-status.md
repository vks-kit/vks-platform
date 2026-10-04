# Sync status

> Is my data on the server yet? Synced, pending N or failing, with the last sync time and a retry button. Reads the OfflineQueue from @vks-kit/core.

- Group: Feedback · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/sync-status

```ts
import { SyncStatus, syncState, sinceLabel } from "@vks-kit/ui"
```

## When to use

- **SyncStatus**: Use for "is my data on the server yet?": synced, pending N or failing, the last sync time and a retry button, fed by the OfflineQueue from @vks-kit/core. For the top-of-screen no-network bar use OfflineBanner instead; for a one-off result after an action use toast.

## Example

```tsx
// queue = new OfflineQueue(store, send) from @vks-kit/core
const [queued, setQueued] = useState(0), [dropped, setDropped] = useState(0)
const [syncing, setSyncing] = useState(false), [err, setErr] = useState<string>(), [last, setLast] = useState<number | null>(null)
const retry = async () => {
  setSyncing(true)
  try { const r = await queue.flush(); setDropped(r.dropped); setQueued(r.left); setErr(undefined); if (!r.left) setLast(Date.now()) }
  catch (e) { setErr(String(e)) } finally { setSyncing(false) }
}
<SyncStatus queued={queued} dropped={dropped} error={err} lastSyncAt={last} syncing={syncing} onRetry={retry} />
// Have the raw QueueItem[] (e.g. from your Storage)? Pass items={...} to also get the oldest-item time.
```

### Compact pill for a header

```tsx
<PageHeader title="ສະແກນ" actions={<SyncStatus compact items={items} error={err} onRetry={retry} />} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | readonly QueueItem[] |  | Queue contents. Wins over queued. Gives the oldest-item time and spots items about to be dropped. |
| queued | number |  | Use when you only have a count (queue.size()). |
| error | string \| boolean |  | Last flush failed. A string is shown under the title. |
| dropped | number |  | flush() result: items given up on. Above 0 = failing. |
| maxTries | number | 8 | Same as OfflineQueue. An item one try short of this counts as failing. |
| lastSyncAt | number \| null |  | ms timestamp of the last good flush. Shown as 'now', 'N min ago' or HH:MM. |
| syncing / onRetry | boolean / () => void |  | Retry shows only when not synced; spins while syncing. |
| compact | boolean | false | One-line Badge for a header. |
| labels | Partial<SyncLabels> |  | Override any Lao text. |

## Notes

- Pair with OfflineBanner: the banner says there is no network; SyncStatus says what is still waiting.
- Never hide a failing state. Show it until the user retries or the queue drains.
