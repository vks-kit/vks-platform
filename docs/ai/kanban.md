# Kanban

> Task board. Desktop: drag cards between columns (keyboard: Space + arrows). Phone: no dragging — one column per screen with count tabs, swipe between columns, tap a card to move it from a bottom sheet. ~17 KB gzip.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/kanban.tsx`
- Live docs: #/docs/kanban

```ts
import { Kanban, moveCard, type KanbanCard } from "@vks-kit/ui/kanban"
```

## When to use

- **Kanban**: Task board. Desktop: drag cards between columns (mouse drags after 4 px; keyboard: Space + arrows; cards move live while dragging). Phone: no dragging — one column per screen with a tab strip (name + count) and swipe between columns; tap a card to open a bottom sheet with a "move to" list. Use for status boards (todo / doing / done); for a plain list use ListGroup instead. Import from "@vks-kit/ui/kanban".

## Example

```tsx
<Kanban columns={[{ id: "todo", title: "ຕ້ອງເຮັດ" }, { id: "done", title: "ສຳເລັດ" }]}
  cards={cards} onChange={(next, { id, to }) => { setCards(next); save(id, to) }} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| columns | { id; title; tone? }[] |  | tone colours the dot: muted \| primary \| warning \| success \| destructive. |
| cards | { id; column; title; meta?; tone? }[] |  | tone colours the left edge. |
| onChange | (cards, { id, to }) => void |  | Fires once on drop, only when something changed. |
| onAdd | (column) => void |  | Shows a + button under each column. |
| onOpen | (card) => void |  | Click / tap a card. |
| emptyLabel / addLabel | string | "ລາກບັດມາວາງບ່ອນນີ້" / "ເພີ່ມບັດ" |  |

## Notes

- Phone: tab strip with counts + swipe between columns; tap a card → sheet with a "move to" list (and an Open button when onOpen is set). Desktop (md+): columns share the width, drag and drop.
- Optional phone labels: moveLabel, openLabel.
- dropCard(cards, id, overId, columnIds) and moveCard are pure and unit tested — use them server-side too.
