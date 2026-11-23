# Sortable list

> Put a short list in order: drag a row by its grip and the others move aside; keyboard = Space + arrows; on a phone each row also has ↑ ↓ buttons. Ships in @vks-kit/ui/kanban (same drag library).

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/kanban.tsx`
- Live docs: #/docs/sortable-list

```ts
import { SortableList, moveItem } from "@vks-kit/ui/kanban"
```

## When to use

- **SortableList**: Use for putting a short list in order (patrol checkpoint order, checklist questions, menu order): drag a row by its grip and the others move out of the way; keyboard = focus the grip, Space, arrows, Space; on a phone each row also has ↑ ↓ buttons so nobody has to drag. onChange gets the whole list in its new order. For cards moving between columns use Kanban instead; for a list nobody reorders use DataTable or ListGroup.

## Example

```tsx
const [points, setPoints] = useState(round.points)
<SortableList items={points} getId={(p) => p.id} onChange={setPoints}
  render={(p, i) => <><b>{i + 1}. {p.name}</b><div className="text-xs text-muted-foreground">{p.code}</div></>} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items / getId | T[] / (item) => string |  |  |
| onChange | (items: T[]) => void |  | The whole list in its new order. |
| render | (item, index) => ReactNode |  | Row content beside the grip. |
| moveLabel | (index) => string | "ລາກເພື່ອຍ້າຍ ລຳດັບທີ N" | Spoken label of the grip. |
| disabled | boolean |  | Read-only order. |

## Notes

- moveItem(list, from, to) is pure and unit tested.
- Rows are 56 px with 44 px grips and arrow buttons.
