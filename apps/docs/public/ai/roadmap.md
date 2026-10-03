# Roadmap & dependency map

> Plan views. Roadmap: phases as bars across months (Gantt) with a progress fill, gold milestone diamonds and a red today line. DependencyMap: boxes in columns with arrows from what each one needs; hover or focus a box to light its whole chain. Both are click-to-open (pair with Drawer). Phone: both scroll sideways inside their card.

- Group: Data display · New
- Source: `packages/ui/src/components/roadmap.tsx`
- Live docs: #/docs/roadmap

```ts
import { Roadmap, DependencyMap, planPct, planMonths, layoutDeps, type RoadmapRow, type RoadmapMilestone, type DepNode } from "@vks-kit/ui"
```

## When to use

- **Roadmap**: Use for phases or projects laid out over months (Gantt): bars with progress fill, gold diamond milestones and a today line. For a list of past events use Timeline; for work-item status use Kanban.
- **DependencyMap**: Use for "what must be built before what": boxes in columns (phases) with arrows from each dependency. Hover or focus a box to light up its chain. For a status board use Kanban; for dates use Roadmap.

## Example

```tsx
<Roadmap start="2026-10-01" end="2027-10-01" today={todayIso}
  rows={[{ id: "p1", label: "P1 · Foundation", start: "2026-11-01", end: "2027-01-15", progress: 20, tone: "primary" }]}
  milestones={[{ id: "m1", at: "2027-01-15", label: "Schema migrated" }]}
  onSelect={(row) => openDrawer(row.id)} onMilestone={(m) => openDrawer(m.id)} />

<DependencyMap columns={["P0", "P1", "P2"]}
  nodes={[{ id: "auth", label: "Auth", column: 1, deps: ["repo"], tone: "warning" }, …]}
  onSelect={(n) => openDrawer(n.id)} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| start / end / today | ISO date |  | Roadmap range; today draws the red line when inside the range. |
| rows | { id; label; sub?; start; end; progress?; tone? }[] |  | tone: primary \| gold \| success \| warning \| destructive \| muted. |
| milestones | { id; at; label }[] |  | Gold diamonds on their own row. |
| onSelect / onMilestone | (row) => void |  | Click a bar or label / a diamond. |
| milestoneLabel / todayLabel / locale | string | "Milestones" / "today" / "en" | Pass Lao strings and "lo" for Lao screens. |
| nodes | { id; label; sub?; column; deps?; tone? }[] |  | DependencyMap. column = left-to-right group; deps = ids this node needs. |
| columns | string[] |  | DependencyMap column headings. |

## Notes

- planPct, planMonths and layoutDeps are pure and unit tested.
- No chart library: plain divs and SVG, so it ships in the main entry and costs a few KB.
