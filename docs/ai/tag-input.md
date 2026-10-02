# Tag input

> Type and press Enter or comma. Paste a list, backspace to remove, suggestions below.

- Group: Form · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/tag-input

```ts
import { TagInput, parseTags } from "@vks-kit/ui"
```

## When to use

- **TagInput**: Chips you type: Enter or comma adds, Backspace on empty removes the last, paste splits a list. Optional suggestions.

## Example

```tsx
<TagInput value={tags} onChange={setTags} max={6} suggestions={["ກະເຊົ້າ", "VIP"]} />
```
