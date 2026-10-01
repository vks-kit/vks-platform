# Radio group

> Pick exactly one of a few options, all visible at once. 44 px rows, the dot springs in.

- Group: Form · New
- Source: `packages/ui/src/components/form.tsx`
- Live docs: #/docs/radio-group

```ts
import { RadioGroup, RadioGroupItem } from "@vks/ui"
```

## When to use

- **RadioGroup**: Radio list. Dot springs in. Rows are 44 px tall so a thumb can hit them.
- **RadioGroupItem**: Use for one option inside a RadioGroup (label text as children, 44 px row). For independent yes/no options use Checkbox instead.

## Example

```tsx
<RadioGroup value={v} onValueChange={setV}>
  <RadioGroupItem value="day">ກະກາງເວັນ</RadioGroupItem>
  <RadioGroupItem value="night">ກະກາງຄືນ</RadioGroupItem>
</RadioGroup>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / onValueChange | string / (v: string) => void |  | Radix RadioGroup props. |
| disabled | boolean |  | On an item: greys that row. |

## Notes

- More than ~5 options: use Select or Combobox. 2-3 short options in a row: ToggleGroup variant="segmented".
