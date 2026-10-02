# Notification banner

> iOS push-style banner that springs down from the top. Swipe up or wait to dismiss, tap to open.

- Group: Feedback · New
- Source: `packages/ui/src/components/ios.tsx`
- Live docs: #/docs/banner

```ts
import { Banner } from "@vks-kit/ui"
```

## When to use

- **Banner**: VKS notification banner (iOS behaviour): drops from the top with a spring, swipe up (or X) to dismiss, auto-hides after `duration` ms (0 = stay) with a draining progress line. Tap runs onPress. Keep it mounted and toggle `open`.

## Example

```tsx
<Banner open={o} onOpenChange={setO} tone="danger" app="VKS PATROL"
  title="ພາດຈຸດກວດ" message="ແຕະເພື່ອເປີດ" onPress={openIt} duration={5000} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| tone | 'info'\|'success'\|'warning'\|'danger' | "info" |  |
| duration | ms | 5000 | 0 = stays until dismissed. |
| onPress | () => void |  | Tap the banner. |
