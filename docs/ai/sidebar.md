# Sidebar

> Navy rail. The active pill springs between items with a gold edge and a glow behind the icon; icons pop when clicked; the logo spins in once. Collapses to a 72 px icon rail with tooltips.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/shell.tsx`
- Live docs: #/docs/sidebar

```ts
import { Sidebar, SidebarSheet } from "@vks/ui"
```

## When to use

- **Sidebar**: Dark rail. A soft pill with a gold edge springs between items, the active icon glows, items stagger in, the logo spins in once. Collapsible to a 72 px icon rail: labels fade and slide out, badges shrink to a gold dot and every item gets a tooltip.
- **SidebarSheet**: Phone drawer version of the sidebar: slides in from the left over a scrim. Picking an item closes it.

## Example

```tsx
const [mini, setMini] = useState(false)
<Sidebar items={nav} active={page} onNavigate={setPage} title="VKS QC"
  collapsible collapsed={mini} onCollapsedChange={setMini}
  user={<UserChip />} />   {/* wrap user text in .vks-rail-fade so it hides when collapsed */}
```

### Phone drawer

Same rail as a left sheet for phone apps that need more than 5 destinations. Picking an item closes it.

```tsx
<SidebarSheet open={open} onOpenChange={setOpen} items={nav} active={page} onNavigate={setPage} title="VKS QC" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items / active / onNavigate / title / user |  |  | Same as AppShell. |
| collapsible | boolean | false | Show the collapse button at the bottom. |
| collapsed / defaultCollapsed / onCollapsedChange | boolean / boolean / (c) => void |  | Controlled or uncontrolled icon rail. |
| persist | boolean | false | Remember the state in localStorage (AppShell turns this on). |

## Notes

- Desktop only: a 240 px rail needs a wide canvas. On a phone use BottomNav (up to 5 places) or the SidebarSheet drawer below.
- Collapsed: labels fade + slide out (200 ms), the width eases over 320 ms, badges turn into a gold dot, every item gets a right-side tooltip. The width transition is the one non-transform animation we allow: a single element on desktop only. Lite mode snaps it.
