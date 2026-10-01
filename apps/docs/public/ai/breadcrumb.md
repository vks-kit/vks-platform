# Breadcrumb

> Where am I, one click up. Long paths collapse the middle into …

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/breadcrumb

```ts
import { Breadcrumb } from "@vks/ui"
```

## When to use

- **Breadcrumb**: Where-am-I trail for desktop pages. Long trails collapse the middle into "…" (maxItems). Last item = current page.

## Example

```tsx
<Breadcrumb items={[{ label: "ໜ້າຫຼັກ", href: "/" }, { label: "ຈຸດ", href: "/sites" }, { label: "ປະຕູໜ້າ" }]} />
```

## Notes

- Desktop only. On phone use the back button in PageHeader.
