# Page header

> Title, subtitle and actions. Actions hide on a phone: put the main one in the FAB.

- Group: Layout & navigation · Stable
- Source: `packages/ui/src/components/shell.tsx`
- Live docs: #/docs/page-header

```ts
import { PageHeader, LargeTitleBar } from "@vks-kit/ui"
```

## When to use

- **PageHeader**: Page title block. Title/subtitle rise in; optional back button and breadcrumb line; actions hide on phone (use Fab).
- **LargeTitleBar**: iOS navigation bar with a large title that collapses into the small centered one as you scroll. Put it at the top of a scrolling page. Uses scroll position only (no layout thrash).

## Example

```tsx
<PageHeader title="ພະນັກງານ" subtitle="128 ຄົນ" actions={<Button variant="action"><Plus />ເພີ່ມ</Button>} />
```

### iOS large title (phone)

Big title that shrinks into the centred bar as the window scrolls. Use on phone-first pages instead of PageHeader.

```tsx
<LargeTitleBar title="ຕັ້ງຄ່າ" onBack={() => history.back()} backLabel="ກັບ" trailing={<Button size="icon" variant="ghost"><Plus /></Button>} />
```
