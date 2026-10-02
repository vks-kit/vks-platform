# iOS alert

> iOS alert behaviour in VKS style: spring zoom, round tone badge (info / success / warning / danger), gold glow + hairline, pill buttons. 2 buttons side by side, 3+ stacked.

- Group: Overlays · New
- Source: `packages/ui/src/components/ios.tsx`
- Live docs: #/docs/ios-alert

```ts
import { IOSAlert } from "@vks-kit/ui"
```

## When to use

- **IOSAlert**: VKS alert (iOS UIAlertController behaviour, VKS look): centred card, zooms in with a spring, round tone badge, gold hairline, pill buttons. Two actions sit side by side, three or more stack. "default" = navy primary, "destructive" = red, "cancel" = quiet muted pill. Use for short blocking questions. For long content use Dialog; for choices use ActionSheet.

## Example

```tsx
<IOSAlert open={o} onOpenChange={setO} title="ລຶບຮູບນີ້?" message="ຍົກເລີກບໍ່ໄດ້."
  actions={[{ label: "ຍົກເລີກ", style: "cancel" }, { label: "ລຶບ", style: "destructive", onPress: del }]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| actions | { label; onPress?; style?: 'default'\|'cancel'\|'destructive' }[] |  | cancel = bold, destructive = red + error haptic. |
| icon | ReactNode |  | Replaces the tone icon inside the badge. |
| tone | "info" \| "success" \| "warning" \| "danger" | danger if any action is destructive, else info | Badge colour. |

## Notes

- Use for short yes/no questions. Long forms → Dialog. A list of choices → Action sheet.
- Hold-to-confirm for dangerous actions → ConfirmDialog.
