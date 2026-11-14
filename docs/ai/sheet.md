# Sheet

> Slides in from the bottom, the right, or covers the whole screen.

- Group: Overlays · Mobile
- Source: `packages/ui/src/components/overlay.tsx`
- Live docs: #/docs/sheet

```ts
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@vks-kit/ui"
```

## When to use

- **Sheet**: Use for a panel that slides in from an edge (side="bottom" on phones, "right" for desktop detail). Pair with SheetTrigger + SheetContent. For a centred modal use Dialog instead; for a draggable sheet with snap points use SnapSheet instead; for a simple side drawer with header use Drawer instead.
- **SheetTrigger**: Use for the element that opens a Sheet (use asChild). For opening a Dialog use DialogTrigger instead.
- **SheetContent**: Use for the sliding panel of a Sheet; side = bottom / right / left / fullscreen. Pass footer for the sheet's buttons: the body then scrolls on its own and the footer never leaves the screen. For a centred modal panel use DialogContent instead.
- **SheetTitle**: Use for the required accessible heading inside SheetContent (same as DialogTitle).
- **SheetDescription**: Use for one muted line under SheetTitle (same as DialogDescription).

## Example

```tsx
<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="bottom">
    <SheetTitle>ເລືອກຈຸດກວດ</SheetTitle>
    <SheetDescription>ຈຸດ 12 / 20</SheetDescription>
  </SheetContent>
</Sheet>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| side | "bottom" \| "right" \| "fullscreen" | "bottom" | Bottom respects the phone's home-bar safe area. |
| footer (SheetContent) | ReactNode |  | Buttons pinned to the bottom: only the body above scrolls, so Apply / Show 12 never leave the screen on a short phone. |
