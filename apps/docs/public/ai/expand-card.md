# Expand card

> A card that grows into its own panel and folds back into the same spot, so the eye keeps track of where it came from. Phone: a near full-screen panel; desktop: a panel over the card. Transform only, 300 ms.

- Group: Overlays · New
- Source: `packages/ui/src/components/actions.tsx`
- Live docs: #/docs/expand-card

```ts
import { ExpandCard } from "@vks-kit/ui"
```

## When to use

- **ExpandCard**: Use for a card that opens into its own full panel and folds back (a shift card into its checkpoints, a site card into its details): the panel grows out of the card's own box, so the eye keeps track of where it came from. Transform only, 300 ms, snaps with reduced motion. The card is the trigger; Esc or the ✕ closes. For a record that needs its own route or a long form use Drawer instead; for a short yes/no use Dialog.

## Example

```tsx
<ExpandCard title={s.time + " · " + s.site} summary={<ShiftSummary s={s} />}>
  <CheckpointList s={s} />
</ExpandCard>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| summary | ReactNode |  | The closed card. The whole card is the button. |
| title | ReactNode |  | Header of the open panel (also its accessible name). |
| children | ReactNode |  | Panel body; scrolls on its own. |
| open / onOpenChange | boolean / (o) => void |  | Optional control from outside. |

## Notes

- Esc or ✕ closes and gives focus back to the card.
- Reduced motion: opens and closes without the grow.
- For a record with its own URL or a long form use Drawer.
