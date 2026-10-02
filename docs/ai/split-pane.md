# Split pane

> List | detail with a draggable divider. Remembers its size.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/split-pane

```ts
import { SplitPane } from "@vks-kit/ui"
```

## When to use

- **SplitPane**: Resizable two-pane layout (list | detail) for desktop. Drag or use ← → on the divider; double-click resets. Size is a % of the width and is remembered in localStorage when storageKey is set. Stacks on phones.

## Example

```tsx
<SplitPane storageKey="reports" left={<List />} right={<Detail />} />
```

## Notes

- Stacks on phones; use a Drawer for detail there.
