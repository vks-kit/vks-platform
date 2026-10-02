# Select

> Radix Select with a 44 px trigger. For long lists or search, use Combobox.

- Group: Form · Stable
- Source: `packages/ui/src/components/form.tsx`
- Live docs: #/docs/select

```ts
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@vks-kit/ui"
```

## When to use

- **Select**: Use for picking one value from a short fixed list (under ~10 options). Pair with SelectTrigger + SelectValue + SelectContent + SelectItem. For long or searchable lists use Combobox instead; for 2-4 options shown at once use ToggleGroup variant="segmented" or RadioGroup instead.
- **SelectTrigger**: Use for the closed field of a Select (44 px, chevron). For a searchable field use Combobox instead.
- **SelectValue**: Use inside SelectTrigger to show the chosen value or a placeholder. For free text entry use Input instead.
- **SelectContent**: Use for the dropdown panel that holds SelectItems. For a menu of actions use MenuContent instead.
- **SelectItem**: Use for one option inside SelectContent (tick shows when chosen). For an action row use MenuItem instead.

## Example

```tsx
<Select onValueChange={setSite}>
  <SelectTrigger><SelectValue placeholder="ເລືອກຈຸດ…" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">ປະຕູໜ້າ</SelectItem>
    <SelectItem value="b">ບ່ອນຈອດລົດ</SelectItem>
  </SelectContent>
</Select>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / onValueChange | string / (v: string) => void |  | Controlled mode (Radix Select.Root). |
| defaultValue | string |  | Uncontrolled start value. |
