# Optimistic list

> React 19 useOptimistic for lists: a scan shows ✓ at once, the save runs behind it, and a failure puts the row back by itself with a toast. For guards on a slow network.

- Group: Feedback · New
- Source: `packages/ui/src/components/actions.tsx`
- Live docs: #/docs/optimistic-list

```ts
import { useOptimisticList, applyPatches, type ListPatch } from "@vks-kit/ui"
```

## Example

```tsx
const { items, mark, pending } = useOptimisticList(checkpoints, (cp, patch) => api.scan(cp.id, patch))

{items.map((cp) => cp.status === "done"
  ? <Badge variant="success">{pending.includes(cp.id) ? "ກຳລັງສົ່ງ…" : "ສຳເລັດ"}</Badge>
  : <Button onClick={() => mark(cp, { status: "done" })}>ສະແກນ</Button>)}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | T[] (each with id) |  | The saved list (from useData or state). When save resolves, update it so the optimistic copy is replaced. |
| save | (item, patch) => Promise |  | Throw / reject to roll back. |
| failText | string \| false | "ບັນທຶກບໍ່ສຳເລັດ, ກັບຄືນແລ້ວ" | Toast on failure; false for none. |
| returns | { items, mark(item, patch), pending: id[] } |  | pending = ids still sending (show them softer). |

## Notes

- Offline work that must survive closing the app still goes through OfflineQueue + SyncStatus; this hook is the instant feedback on top.
- applyPatches is pure and unit tested.
