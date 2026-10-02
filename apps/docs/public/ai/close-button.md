# Close button

> The one round X. 44 px hit area, quiet muted hover, a small press, Lao label ປິດ. Alert, Banner, Dialog, Sheet and Drawer all use it.

- Group: Feedback · New
- Source: `packages/ui/src/components/close-button.tsx`
- Live docs: #/docs/close-button

```ts
import { CloseButton, CLOSE_BUTTON } from "@vks-kit/ui"
```

## When to use

- **CloseButton**: Use for any "close this" X on a card, banner or panel (Lao label "ປິດ", 44 px hit area). For a back arrow on a pushed page use the PageHeader back button instead; for a text "ຍົກເລີກ" use Button variant="ghost" instead.

## Example

```tsx
<CloseButton onClick={dismiss} />
<CloseButton aria-label="ປິດແຈ້ງເຕືອນ" className="absolute right-1 top-1" />
// on a non-button element (e.g. Radix Close): className={CLOSE_BUTTON}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| aria-label | string | "ປິດ" | Override when there are several closes on one screen. |
| children | ReactNode | <X /> | Swap the icon. |
| ...button props | ComponentProps<'button'> |  | onClick, onPointerDown, disabled… |

## Notes

- Never put a 32 px X on a phone; the visual stays 16 px but the hit area is always 44 px.
- For 'back' on a pushed page use the PageHeader back arrow instead.
