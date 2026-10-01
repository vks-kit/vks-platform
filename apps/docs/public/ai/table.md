# Table

> Plain table parts with a navy header. Every column can sort: pass sortKey + sort + onSort to TH.

- Group: Data display · Stable
- Source: `packages/ui/src/components/table.tsx`
- Live docs: #/docs/table

```ts
import { Table, THead, TBody, TR, TH, TD } from "@vks/ui"
```

## When to use

- **Table**: Use for a hand-built static table (you write THead/TBody/TR/TH/TD yourself). For lists of records with sort, search, loading/empty/error states and phone cards use DataTable instead.
- **THead**: Use for the navy header row group of a Table. For DataTable, columns are configured instead.
- **TBody**: animate=true slides rows in (use when the order changes, e.g. after a sort).
- **TR**: Use for one row in a Table (hover highlight built in). For swipe actions on phones use SwipeRow instead.
- **TH**: Header cell. Pass sortKey + sort + onSort to make it a sort button; arrow flips with a spring.
- **TD**: Use for a body cell in a Table (align="right" for numbers). For header cells use TH instead.

## Example

```tsx
const [sort, setSort] = useState<SortState>(null)
const data = sortRows(rows, sort, (r, k) => r[k])
<Table>
  <THead><TR><TH sortKey="site" sort={sort} onSort={setSort}>ຈຸດກວດ</TH><TH sortKey="time" sort={sort} onSort={setSort}>ເວລາ</TH></TR></THead>
  <TBody><TR><TD>ປະຕູໜ້າ</TD><TD>08:12</TD></TR></TBody>
</Table>
```

## Notes

- Desktop only: a wide table does not fit a phone. On a phone use DataTable (it turns rows into cards) or ListGroup.
