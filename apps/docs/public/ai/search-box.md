# Search box

> Input with a search icon and a clear button.

- Group: Form · New
- Source: `packages/ui/src/components/combobox.tsx`
- Live docs: #/docs/search-box

```ts
import { SearchBox } from "@vks/ui"
```

## When to use

- **SearchBox**: Use for a plain inline search field that filters a list on the page. For picking one value from a long list use Combobox instead; for an iOS search bar with Cancel use SearchBar instead; for app-wide jump-to use CommandPalette instead.

## Example

```tsx
<SearchBox value={q} onChange={setQ} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value | string |  |  |
| onChange | (v: string) => void |  |  |
| placeholder | string | "ຄົ້ນຫາ..." |  |
