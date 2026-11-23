# Expand card

> A card that opens into its own screen as one object (the iOS App Store card) and folds back into the same spot. With cover, the card is the foot of a coloured header that grows to full size while the body is revealed. Phone: full screen; desktop: a centred panel over a dimmed page.

- Group: Overlays · New
- Source: `packages/ui/src/components/actions.tsx`
- Live docs: #/docs/expand-card

```ts
import { ExpandCard, insetClip } from "@vks-kit/ui"
```

## When to use

- **ExpandCard**: Use for a card that opens into its own screen as one object, the way iOS opens an App Store card, and folds back into the same spot (a shift card into its checkpoints, a site card into its details). With cover (a coloured header with a title) the card IS the bottom of that header: opening, the header grows up to full size while the body is revealed under it, and closing it shrinks back into the list. Phone: full screen; desktop: a centred panel over a dimmed page. clip-path + transform only (no layout jump), about 520 ms, instant with reduced motion; Esc / ✕ / the dimmed page close it and focus returns to the card. For a record with its own URL or a long form use Drawer; for a yes/no use Dialog.

## Example

```tsx
<ExpandCard title={s.time + " · " + s.site} coverClassName="bg-primary text-primary-foreground"
  cover={<><div className="text-xl font-bold tabular-nums">{s.time}</div><div className="text-sm opacity-85">{s.site}</div></>}>
  <CheckpointList s={s} />
</ExpandCard>
```

### Without a cover

A plain card (summary) grows into a panel whose header line is the title.

```tsx
<ExpandCard title="…" summary={<ShiftSummary s={s} />}>…</ExpandCard>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| cover | ReactNode |  | Header of the open screen. Its foot is the closed card (no summary needed). |
| coverClassName | string |  | Tokens only: "bg-primary text-primary-foreground", "vks-hero", "bg-success text-success-foreground". |
| coverHeight / cardHeight | number | 220 / 132 | Open header height and closed card height, px. |
| summary | ReactNode |  | A plain closed card instead of the cover's foot. |
| title | ReactNode |  | Accessible name; header line when there is no cover. |
| open / onOpenChange | boolean / (o) => void |  | Optional control from outside. |

## Notes

- One element from card to screen: a clip-path grows from the card's rectangle while the content slides up, so nothing swaps and nothing jumps.
- Esc, ✕ or the dimmed page close it; focus goes back to the card. Reduced motion: opens and closes at once.
- The page behind does not scroll while it is open. For a record with its own URL or a long form use Drawer.
