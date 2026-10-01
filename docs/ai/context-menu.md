# Context menu

> Desktop-first: right-click menu (long-press works on phones but nobody discovers it, so give phones a visible ⋯ Menu or ActionSheet). Right-click (or long-press) menu with icons, shortcuts, sub-menus and a red destructive item.

- Group: Overlays · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/context-menu

```ts
import { ContextMenu } from "@vks/ui"
```

## When to use

- **ContextMenu**: Right-click menu on desktop, long-press menu on phones (Radix handles both; ~700 ms hold); on phones it docks to the bottom as a sheet with 48 px rows. Long-press is hard to discover, so on a phone also give the row a visible ⋯ button (Menu) or use ActionSheet. The wrapped element lifts slightly while the menu is open, like iOS. Supports nested sub-menus.

## Example

```tsx
<ContextMenu actions={[{ label: "ເປີດ", onSelect: open }, { label: "ລຶບ", destructive: true, separator: true, onSelect: del }]}>
  <Row … />
</ContextMenu>
```
