# Indexed list

> Contacts-style list with sticky letters and a scrub rail. Lao lead vowels sort correctly (ເພັດ under ພ).

- Group: Mobile & touch · Mobile
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/indexed-list

```ts
import { IndexedList, groupByIndex, indexKey } from "@vks/ui"
```

## When to use

- **IndexedList**: Contacts-style list: sticky letter headers + an index rail on the right. Slide a finger along the rail to jump (big letter bubble + haptic tick). Give it a height via className (default h-96).

## Example

```tsx
<IndexedList items={staff.map((s) => ({ id: s.id, label: s.name, sub: s.code }))} onSelect={open} className="h-[70dvh]" />
```

## Notes

- Slide a finger along the rail: big letter bubble + haptic tick.
- groupByIndex() is pure and unit tested.
