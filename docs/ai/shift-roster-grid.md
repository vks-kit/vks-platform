# Shift roster grid

> Guard x day shift plan: tap a cell to cycle D (day) → N (night) → OFF, the bottom row counts heads per day and turns red when a shift is short. For duty-control, HRM and stationary-guard.

- Group: Data display · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/shift-roster-grid

```ts
import { ShiftRosterGrid, nextShift, rosterCover, type Roster, type RosterNeed, type ShiftCode, type RosterStaff, type RosterDay } from "@vks-kit/ui"
```

## When to use

- **ShiftRosterGrid**: Use for a guard x day shift plan (duty control, HRM, a site's week): tap a cell to cycle D -> N -> OFF, and the bottom row warns when a shift is below the head count it needs. For attendance that already happened use AttendanceBoard from @vks-kit/ui/charts; for picking one time slot use SlotPicker instead.

## Example

```tsx
const [roster, setRoster] = useState<Roster>(fromSheet)
<ShiftRosterGrid staff={guards} days={week} value={roster} need={{ D: 2, N: 2 }}
  onChange={(staffId, day, shift) => setRoster((r) => ({ ...r, [staffId]: { ...r[staffId], [day]: shift } }))} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| staff / days | { id, name, sub? }[] / { key, label, sub? }[] |  | Rows and columns. The staff column stays put while the days scroll sideways on a phone. |
| value | Roster |  | staffId → dayKey → "D" \| "N" \| "OFF" \| "". |
| onChange | (staffId, day, shift) => void |  | Gets the next shift (nextShift). Omit for a read-only grid. |
| need | { D?, N? } \| (day) => … |  | Minimum guards per shift; a short day is red and listed under the grid. |

## Notes

- Each cell is a 44 px button with a full spoken label (name · day: shift).
- For attendance that already happened use AttendanceBoard (charts).
