# Stepper

> − / + number control for small counts (qty, guards per shift). The digit rolls up or down.

- Group: Form · New
- Source: `packages/ui/src/components/form.tsx`
- Live docs: #/docs/stepper

```ts
import { Stepper } from "@vks-kit/ui"
```

## When to use

- **Stepper**: Number stepper (qty, guards per shift). The digit rolls up or down.

## Example

```tsx
<Stepper value={n} onChange={setN} min={1} max={12} label="guards" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / onChange | number / (v: number) => void |  |  |
| min / max / step | number | 0 / 999 / 1 | Buttons disable at the bounds. |
| label | string |  | aria-label for the group. |

## Notes

- For a wide range or a precise value use Slider or an Input type=number instead.
