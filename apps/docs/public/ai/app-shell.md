# App shell

> Whole-app frame. Navy sidebar on desktop, bottom nav + FAB on a phone. One breakpoint: 768 px. Pages slide in the direction you moved and a gold bar sweeps the header.

- Group: Layout & navigation · Mobile
- Source: `packages/ui/src/components/shell.tsx`
- Live docs: #/docs/app-shell

```ts
import { AppShell, Fab, type NavItem } from "@vks/ui"
```

## When to use

- **AppShell**: One breakpoint, whole system pivots on it: 768 px (rule from vks-kit RESPONSIVE.md). Desktop = sidebar rail (collapsible, remembered). Mobile = bottom nav, max 5 items, the rest under "More". Pages slide in the direction you moved in the nav and a thin gold bar sweeps across the top.
- **Fab**: Create button (navy + gold ring, brand-lit). Desktop: sits in the header (use inline). Mobile: floating. Icon must say what it creates. extended = pill with label.

## Example

```tsx
const nav: NavItem[] = [
  { id: "home", label: "ໜ້າຫຼັກ", icon: <Home /> },
  { id: "tasks", label: "ວຽກ", icon: <ClipboardList />, badge: 3 },
  …
]
<AppShell items={nav} active={page} onNavigate={setPage} title="VKS"
  header={<b>ໜ້າຫຼັກ</b>}
  fab={<Fab label="ເພີ່ມ" onClick={add} />}>
  {content}
</AppShell>
```

### Same shell on a desktop

1180 px viewport scaled to fit. Collapse the rail with the chevron; the choice is remembered (localStorage "vks.rail"). Click items: later items slide in from the right, earlier ones from the left.

```tsx
<AppShell items={nav} active={page} onNavigate={setPage} collapsible>…</AppShell>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | { id; label; icon; badge? }[] |  | More than 5 on a phone → 4 + a More sheet. |
| active / onNavigate | string / (id) => void |  |  |
| title | string | "VKS" | Sidebar title. |
| header | ReactNode |  | Sticky top bar, respects the notch. |
| fab | ReactNode |  | Phone only. |
| user | ReactNode |  | Bottom of the sidebar. |
| collapsible | boolean | true | Desktop rail can shrink to 72 px icons. State is remembered. |

## Notes

- Motion: page = 320 ms slide + fade (transform/opacity only), header bar = 400 ms, bottom nav rises once on load. Lite mode shortens the page swap to 150 ms and snaps the rail.
