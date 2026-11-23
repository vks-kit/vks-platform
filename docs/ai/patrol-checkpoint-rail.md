# Patrol checkpoint rail

> One patrol round: checkpoints in order (done, next, missed), real NFC / QR scan time, GPS distance and one big scan-next button. For patrol, inspector-head and QC.

- Group: Data display · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/patrol-checkpoint-rail

```ts
import { PatrolCheckpointRail, checkpointProgress, fmtDistance, type Checkpoint, type CheckpointStatus } from "@vks-kit/ui"
```

## When to use

- **PatrolCheckpointRail**: Use for one patrol round on a phone: the checkpoints in order with done / next / missed, the real scan time, the GPS distance and one big "scan next" button. For the history of a finished shift use Timeline; for numbered form steps use Wizard instead.

## Example

```tsx
const cps: Checkpoint[] = round.points.map((p) => ({
  id: p.id, name: p.name, status: p.status, time: p.scannedAt,
  method: p.via,                                   // "nfc" | "qr" | "gps"
  distanceM: here ? distanceM(here, p) : null,     // distanceM from @vks-kit/core
}))
<PatrolCheckpointRail checkpoints={cps} onScan={(cp) => openScanner(cp)} />
```

### Round finished (no button)

```tsx
<PatrolCheckpointRail checkpoints={finished} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| checkpoints | Checkpoint[] |  | { id, name, status: done \| next \| pending \| missed, time?, distanceM?, method?: nfc \| qr \| gps, note? }. If none is "next", the first pending one is. |
| onScan | (cp) => void \| Promise |  | Gets the next checkpoint. The button shows a spinner while the promise runs and hides when nothing is left. |
| scanning | boolean |  | Keep the spinner while the camera / NFC sheet is open. |
| labels | Partial<CheckpointLabels> |  | Lao by default. |

## Notes

- checkpointProgress() and fmtDistance() are pure and unit tested.
- Use Timeline for what happened during the whole shift; this rail is the live round.
