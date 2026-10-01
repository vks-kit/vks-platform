# Badge

> Small status pill. Tinted background + full-strength text so it passes contrast in both themes.

- Group: Actions · Stable
- Source: `packages/ui/src/components/badge.tsx`
- Live docs: #/docs/badge

```ts
import { Badge } from "@vks/ui"
```

## When to use

- **Badge**: Status pill: neutral / info / success / warning / danger / gold; dot adds a leading status dot, live makes it pulse. Use for a short read-only state next to text; for a selectable filter use Chip instead; for a count on an icon use a Badge inside the icon wrapper.

## Example

```tsx
<Badge>ປົກກະຕິ</Badge>
<Badge variant="success">ສຳເລັດ</Badge>
<Badge variant="warning">ຊ້າ</Badge>
<Badge variant="danger">ພາດ</Badge>
<Badge variant="gold">VIP</Badge>
<Badge variant="info">ໃໝ່</Badge>
<Badge variant="success" dot>ອອນລາຍ</Badge>
<Badge variant="danger" live>ສົດ</Badge>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| variant | "neutral" \| "info" \| "success" \| "warning" \| "danger" \| "gold" | "neutral" | Colour meaning. Gold never carries small gold text; it uses the foreground colour. |
| dot | boolean | false | Leading status dot in the text colour. |
| live | boolean | false | Dot with a ping ring (implies dot). Lite / reduced motion: still dot. |
