# Snap sheet

> Maps-style bottom sheet with detents (half / full). Drag the grabber; flick down to close.

- Group: Overlays · Mobile
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/snap-sheet

```ts
import { SnapSheet } from "@vks/ui"
```

## When to use

- **SnapSheet**: Bottom sheet with snap points (Apple Maps style). Drag the handle; a flick picks the next stop, dragging below the lowest stop closes it. Tap the handle to cycle stops. snaps are fractions of the screen height. For a simple modal sheet use Sheet / Dialog; use this when the page behind should stay useful (maps, lists).

## Example

```tsx
<SnapSheet open={o} onOpenChange={setO} snaps={[0.45, 0.92]} title="ລາຍລະອຽດ">…</SnapSheet>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| snaps | number[] | [0.45, 0.92] | Heights as a fraction of the screen. |
| modal | boolean | true | false = no scrim, page stays usable (over a map). |
