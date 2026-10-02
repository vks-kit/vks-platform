# Bottom nav & FAB

> 56 px tall tabs above the phone's home bar. The FAB sits above it on the right.

- Group: Layout & navigation · Mobile
- Source: `packages/ui/src/components/shell.tsx`
- Live docs: #/docs/bottom-nav

```ts
import { BottomNav, Fab } from "@vks-kit/ui"
```

## When to use

- **BottomNav**: Frosted tab bar. Rises in on first paint; the active icon sits on a pill that springs across; the icon bounces when tapped.
- **Fab**: Create button (navy + gold ring, brand-lit). Desktop: sits in the header (use inline). Mobile: floating. Icon must say what it creates. extended = pill with label.

## Example

```tsx
<BottomNav items={nav} active={page} onNavigate={setPage} />
<Fab label="ສະແກນ" icon={<ScanLine />} onClick={scan} />   {/* aria-label required */}
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| label | string |  | Fab: required, read by screen readers. |
| icon | ReactNode | <Plus /> | Fab. |
