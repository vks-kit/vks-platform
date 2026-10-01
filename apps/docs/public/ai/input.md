# Input & Textarea

> 44 px tall, 16 px text (iOS never zooms), red border + shake when invalid.

- Group: Form · Stable
- Source: `packages/ui/src/components/input.tsx`
- Live docs: #/docs/input

```ts
import { Input, Textarea, Label } from "@vks/ui"
```

## When to use

- **Input**: Use for a single-line text field (44 px, 16 px text so iOS does not zoom); set invalid to show the error ring. For multi-line text use Textarea; for a floating label use FloatingInput; for passwords use PasswordInput; for picking from a list use Select or Combobox; for dates use DatePicker instead.
- **Textarea**: Use for multi-line free text (notes, incident description); run cleanText() from @vks/types before saving. For a one-line value use Input instead.
- **Label**: Use for the visible label of a form field (link it with htmlFor). For a floating label that sits inside the field use FloatingInput instead.

## Example

```tsx
<Label htmlFor="id">ລະຫັດພະນັກງານ</Label>
<Input id="id" placeholder="G001" />

<Input invalid defaultValue="020 55" />   {/* red + shake */}
<Textarea placeholder="ໝາຍເຫດ…" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| invalid | boolean | false | Sets aria-invalid: red border and one shake. |
| ...props | React.ComponentProps<"input"> |  | Everything a normal input takes. |

## Notes

- Run cleanText() from @vks/types on free text before you save it.
