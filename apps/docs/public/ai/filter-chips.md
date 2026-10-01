# Filter chips

> Scrollable one-row chips for filtering lists. Better than a dropdown on a phone.

- Group: Form · New
- Source: `packages/ui/src/components/combobox.tsx`
- Live docs: #/docs/filter-chips

```ts
import { FilterChips } from "@vks/ui"
```

## When to use

- **FilterChips**: Toggle chips. Single or multi. Use for up to ~8 filters; more than 3 filters on phone should go in a filter sheet.

## Example

```tsx
<FilterChips options={[{ value: "all", label: "ທັງໝົດ" }, { value: "late", label: "ຊ້າ" }]} value={v} onChange={setV} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| options | Option[] |  |  |
| value | string[] |  |  |
| onChange | (v: string[]) => void |  |  |
| multiple | boolean | false |  |
