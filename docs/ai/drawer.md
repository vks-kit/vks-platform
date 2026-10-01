# Drawer

> Record detail panel. Full screen with a back arrow on a phone, side panel on desktop.

- Group: Overlays · Mobile
- Source: `packages/ui/src/components/drawer.tsx`
- Live docs: #/docs/drawer

```ts
import { Drawer } from "@vks/ui"
```

## When to use

- **Drawer**: Detail panel. Desktop: slides in from the right beside the list. Phone: full-screen page with a sticky back header (rule 5 in the kit: detail = full-screen overlay + back).

## Example

```tsx
<Drawer open={!!row} onClose={() => setRow(null)} title={row?.name}
  footer={<Button className="w-full">ແກ້ໄຂ</Button>}>
  …
</Drawer>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| open | boolean |  |  |
| onClose | () => void |  | Also fires on the phone back arrow. |
| title | ReactNode |  |  |
| footer | ReactNode |  | Sticky at the bottom. |
