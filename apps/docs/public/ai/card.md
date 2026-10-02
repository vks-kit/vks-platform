# Card

> The basic box. White on light, navy-ink on dark.

- Group: Data display · Stable
- Source: `packages/ui/src/components/card.tsx`
- Live docs: #/docs/card

```ts
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@vks-kit/ui"
```

## When to use

- **Card**: Use for a bordered surface that groups related content. For a number with a label use StatCard or KpiStrip instead; for a tappable settings row use ListGroup/ListRow instead.
- **CardHeader**: Use for the title block at the top of a Card (holds CardTitle + CardDescription). For a page-level title use PageHeader instead.
- **CardTitle**: Use for the heading inside a CardHeader. For a dialog heading use DialogTitle instead.
- **CardDescription**: Use for one muted line under a CardTitle. For longer help text put a <p> in CardContent instead.
- **CardContent**: Use for the main body of a Card. For a full table inside a card use DataTable directly instead of nesting padding.
- **CardFooter**: Use for the action row at the bottom of a Card. For dialog actions use DialogFooter instead.

## Example

```tsx
<Card>
  <CardHeader>
    <CardTitle>ປະຕູໜ້າ</CardTitle>
    <CardDescription>A-01 · ກາງເວັນ</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button size="sm" variant="outline">ລາຍລະອຽດ</Button></CardFooter>
</Card>
```
