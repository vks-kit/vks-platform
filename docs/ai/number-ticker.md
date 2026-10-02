# Number ticker

> Counts smoothly to a new value. Jumps straight there on low-end phones.

- Group: Data display · New
- Source: `packages/ui/src/components/extras.tsx`
- Live docs: #/docs/number-ticker

```ts
import { NumberTicker } from "@vks-kit/ui"
```

## When to use

- **NumberTicker**: Counts from the previous value to the new one (KPIs, money). Uses rAF with an ease-out; lite phones / reduced motion jump straight there. format: e.g. (n) => n.toLocaleString("lo") + " ກີບ"

## Example

```tsx
<NumberTicker value={income} format={(n) => Math.round(n).toLocaleString() + " ກີບ"} />
```
