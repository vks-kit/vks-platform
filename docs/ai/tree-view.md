# Tree view

> Nested sites/folders. Arrow keys walk and open/close, rows slide in.

- Group: Data display · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/tree-view

```ts
import { TreeView, flattenTree } from "@vks-kit/ui"
```

## When to use

- **TreeView**: File-explorer tree (sites → posts → guards). Click to open, arrows ← → ↑ ↓ + Enter on keyboard. Controlled selection via selected/onSelect; expansion is internal (defaultExpanded).

## Example

```tsx
<TreeView nodes={tree} selected={id} onSelect={(n) => setId(n.id)} defaultExpanded={["vte"]} />
```
