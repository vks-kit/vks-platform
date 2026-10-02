# Chip

> Selectable filter pills and removable tags. Tap x: the x spins, the chip shrinks away, then the chips after it glide into the gap (including wrapping up to the line above).

- Group: Form · New
- Source: `packages/ui/src/components/extras.tsx`
- Live docs: #/docs/chip

```ts
import { Chip } from "@vks-kit/ui"
```

## When to use

- **Chip**: Removable / selectable pill. selected = filled. onRemove shows an x.

## Example

```tsx
<Chip selected={on} onClick={toggle}>ກະເຊົ້າ</Chip>
<Chip icon={<MapPin />} onRemove={remove}>ປະຕູໜ້າ</Chip>
```
