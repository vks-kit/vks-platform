# Bottom toolbar

> Frosted row of actions for the current screen. Actions, not places (that is BottomNav).

- Group: Layout & navigation · Mobile
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/bottom-toolbar

```ts
import { BottomToolbar } from "@vks/ui"
```

## When to use

- **BottomToolbar**: iOS bottom toolbar: frosted bar of actions for the current screen (share, edit, delete), sits above the home indicator. Use it instead of BottomNav when the buttons are actions, not places.

## Example

```tsx
<BottomToolbar fixed items={[{ id: "share", icon: <Share2 />, label: "ແບ່ງປັນ", onPress: share }, { id: "del", icon: <Trash2 />, label: "ລຶບ", destructive: true }]} />
```
