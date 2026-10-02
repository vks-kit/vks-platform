# Alert

> Inline warning strip with a coloured left edge. Info, success, warning, danger.

- Group: Feedback · New
- Source: `packages/ui/src/components/alerts.tsx`
- Live docs: #/docs/alert

```ts
import { Alert } from "@vks-kit/ui"
```

## When to use

- **Alert**: Inline notice inside a page or form; variant="card" gives the glass card with a round tone badge. Use a toast for things that pass, an Alert for things that stay.

## Example

```tsx
<Alert title="ຂໍ້ມູນ">ລະບົບຈະປິດປັບປຸງ 22:00.</Alert>
<Alert tone="success" title="ສົ່ງແລ້ວ">…</Alert>
<Alert tone="warning" title="ຊ້າ 6 ນາທີ" action={<Button size="sm" variant="outline">ເບິ່ງ</Button>}>…</Alert>
<Alert tone="danger" title="ພາດຈຸດກວດ" onClose={dismiss}>…</Alert>
```

### Card variant

Same tones, premium look: the colour lives in the round badge, the text stays neutral.

```tsx
<Alert variant="card" tone="success" title="ສົ່ງແລ້ວ">…</Alert>
<Alert variant="card" tone="danger" title="ພາດຈຸດກວດ" onClose={dismiss}>…</Alert>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| tone | "info" \| "success" \| "warning" \| "danger" | "info" |  |
| title | string |  |  |
| action | ReactNode |  | A button on the right. |
| onClose | () => void |  | Shows the shared CloseButton (44 px, label ປິດ). |
| variant | "bar" \| "card" | "bar" | card = glass card, gold top hairline, round tone badge (matches toast / IOSAlert). |
| icon | ReactNode |  | Replace the tone icon. |
