# Action sheet

> iOS grouped buttons from the bottom with a separate Cancel.

- Group: Overlays · Mobile
- Source: `packages/ui/src/components/ios.tsx`
- Live docs: #/docs/action-sheet

```ts
import { ActionSheet } from "@vks-kit/ui"
```

## When to use

- **ActionSheet**: VKS action sheet (iOS behaviour): slides up, grabber, list of icon-tile rows + a separate Cancel pill. Great for "what to do with this item" on phones.

## Example

```tsx
<ActionSheet open={o} onOpenChange={setO} title="ຮູບ IMG_0142"
  actions={[{ label: "ແບ່ງປັນ", icon: <Share2 />, onPress: share }, { label: "ລຶບ", destructive: true, onPress: del }]} />
```
