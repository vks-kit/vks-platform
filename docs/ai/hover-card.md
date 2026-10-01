# Hover card

> Rich preview when you hover a name or ID. Opens after 350 ms so it never flickers.

- Group: Overlays · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/hover-card

```ts
import { HoverCard } from "@vks/ui"
```

## When to use

- **HoverCard**: Rich preview on hover (desktop) — guard profile, site info. Touch devices ignore it, so never hide essential info in here.

## Example

```tsx
<HoverCard trigger={<a>ສົມຊາຍ</a>}><StaffPreview id="G001" /></HoverCard>
```

## Notes

- Preview only, never the only way to reach info (touch has no hover).
