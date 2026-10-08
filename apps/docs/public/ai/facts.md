# Facts

> The read-only half of view-first. Facts = label/value rows for a narrow side panel; FactGrid = label-over-value cells in 2 columns for a record popup. Empty values show —.

- Group: Form · New
- Source: `packages/ui/src/components/facts.tsx`
- Live docs: #/docs/facts

```ts
import { Facts, FactGrid } from "@vks-kit/ui"
```

## When to use

- **Facts**: Use for the read-only "view" half of view-first: a label/value list, "—" for empty values; for a record popup with a 2-column layout use FactGrid instead.
- **FactGrid**: Use for read-only facts in a record popup or card: label-over-value cells in 2 columns (third tuple item = full width), "—" for empty; for a narrow side list use Facts instead.

## Example

```tsx
<Facts rows={[["ລູກຄ້າ", c.name], ["ໂທ", c.phone], ["ໝາຍເຫດ", c.note]]} />
<FactGrid rows={[["ລູກຄ້າ", c.name], ["ໂທ", c.phone], ["ທີ່ຢູ່", c.address, true]]} />  // true = full width
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| rows (Facts) | [label, value][] |  |  |
| cols | "6rem" \| "8rem" | "8rem" | Label column width. |
| rows (FactGrid) | [label, value, wide?][] |  | wide spans both columns. |
