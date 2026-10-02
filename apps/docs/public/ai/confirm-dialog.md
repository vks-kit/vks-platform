# Confirm popup

> Warning popup before anything you cannot undo. Hold-to-confirm for the really dangerous ones, so a pocket tap can't delete.

- Group: Feedback · New
- Source: `packages/ui/src/components/alerts.tsx`
- Live docs: #/docs/confirm-dialog

```ts
import { ConfirmDialog } from "@vks-kit/ui"
```

## When to use

- **ConfirmDialog**: Confirm before something that cannot be undone (delete, clock out, submit report). tone="danger" makes the confirm button red. holdToConfirm adds a 1.2 s press-and-hold guard for the worst cases.

## Example

```tsx
<ConfirmDialog open={open} onOpenChange={setOpen}
  tone="danger" holdToConfirm
  title="ລຶບພະນັກງານນີ້?" description="ຄຳສັ່ງນີ້ຍົກເລີກບໍ່ໄດ້."
  onConfirm={async () => { await remove(id) }} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| open / onOpenChange | boolean / (o) => void |  |  |
| title | string |  |  |
| description | ReactNode |  |  |
| tone | "warning" \| "danger" | "warning" |  |
| holdToConfirm | boolean | false | User must press and hold ~1 s; a ring fills up. |
| onConfirm | () => void \| Promise<void> |  | Button shows a spinner while the promise runs. |
| confirmLabel / cancelLabel | string | "ຢືນຢັນ" / "ຍົກເລີກ" |  |
| busy | boolean |  |  |
