# Data table

> A table on desktop that turns into cards on a phone when there are more than 4 columns. Loading, error and empty states built in.

- Group: Data display · Mobile
- Source: `packages/ui/src/components/data-table.tsx`
- Live docs: #/docs/data-table

```ts
import { DataTable, type Column } from "@vks-kit/ui"
```

## When to use

- **DataTable**: Rule from the old kit: a table with more than 4 columns becomes a card list on phones. Primary columns show at the top of the card, the rest as label / value rows. For a long list a person works through on a phone (calls, tasks), prefer mode="rows": 2-line rows, ~8 per screen, instead of ~2 tall cards. States: loading = skeleton rows, empty = Empty, error = inline retry. Always ship all three.

## Example

```tsx
const cols: Column<Row>[] = [
  { key: "s", header: "ຈຸດ", cell: (r) => r.site, primary: true },
  { key: "st", header: "ສະຖານະ", cell: (r) => <Badge variant="success">{r.status}</Badge> },
  { key: "k", header: "ເງິນ", cell: (r) => fmtKip(r.kip) },
]
<DataTable columns={cols} rows={rows} rowKey={(r) => r.id} onRowClick={open} />
```

### Card layout (what phones see)

mode="cards" forces cards at every width, e.g. inside a narrow side panel on desktop.

```tsx
<DataTable mode="cards" columns={cols} rows={rows} rowKey={(r) => r.id} />
```

### Always a table

mode="table" keeps the table on a phone. Only for ≤ 4 short columns; wide tables scroll sideways and nobody finds the last column. See the Desktop ↔ Mobile guide.

```tsx
<DataTable mode="table" columns={cols} rows={rows} rowKey={(r) => r.id} />
```

### Loading

```tsx
<DataTable loading … />
```

### Error with retry

```tsx
<DataTable error="ໂຫຼດບໍ່ສຳເລັດ" onRetry={refetch} … />
```

### Empty

```tsx
<DataTable rows={[]} emptyTitle="ຍັງບໍ່ມີຂໍ້ມູນ" … />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| columns | { key; header; cell(row); primary?; className? }[] |  | primary columns become the card title on a phone. |
| rows | T[] |  |  |
| rowKey | (row: T) => string |  |  |
| onRowClick | (row: T) => void |  | Pair with Drawer. |
| loading | boolean |  | Shimmer rows. |
| error / onRetry | string / () => void |  |  |
| emptyTitle | string | "ຍັງບໍ່ມີຂໍ້ມູນ" |  |
| mode | "auto" \| "table" \| "cards" \| "rows" | "auto" | auto = table on desktop, cards on a phone when there are more than 4 columns. table / cards force one layout. |
| sortValue (column) | (row: T) => string \| number \| Date |  | Give it to a column to make its header sortable. |
| forceCards | boolean |  | Deprecated: use mode="cards". Still works. |
| row (column) | "title" \| "sub" \| "action" |  | With mode="rows": title = line 1, sub = line 2 (joined with ·), action = the button on the right. Other columns are not shown on a phone. |

## Notes

- A long list a person works through on a phone (calls, tasks): mode="rows". Two lines per row, ~8 rows per 360×780 screen, instead of ~2 label/value cards. Desktop still shows the table.
- Rows sit in a minmax(0,1fr) grid: a long line truncates, a row never gets wider than the screen (also inside SwipeRow).
