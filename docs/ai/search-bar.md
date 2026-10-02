# Search bar

> iOS search pill: clear button while typing, Cancel slides in on focus.

- Group: Mobile & touch · Mobile
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/search-bar

```ts
import { SearchBar } from "@vks-kit/ui"
```

## When to use

- **SearchBar**: iOS search field: grey pill, clear (x) while typing, "Cancel" slides in on focus and clears + blurs. Use at the top of phone lists. For a plain desktop filter box use SearchBox.

## Example

```tsx
<SearchBar value={q} onChange={setQ} onSubmit={go} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / onChange | string |  | Controlled. |
| onCancel | () => void |  | Called after Cancel clears + blurs. |
| cancelLabel | string | "ຍົກເລີກ" |  |

## Notes

- Phone lists. On desktop filter bars use SearchBox.
