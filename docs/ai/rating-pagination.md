# Star rating & pagination

> Inspection scores and paged lists. Both 44 px targets.

- Group: Data display · Stable
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/rating-pagination

```ts
import { StarRating, Pagination } from "@vks/ui"
```

## When to use

- **StarRating**: Read-only or tap-to-rate. 44 px targets when interactive. Tapping pops the stars in a ripple up to the chosen one; supports half stars when read-only.
- **Pagination**: Page numbers with a pill that springs to the current page. Compact "3 / 12" mode for phones.

## Example

```tsx
<StarRating value={score} onChange={setScore} />
<Pagination page={page} pages={9} onPage={setPage} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / onChange / max | number / (v) => void / number | — / — / 5 | StarRating; no onChange = read only. |
| page / pages / onPage | number / number / (p) => void |  | Pagination. |
