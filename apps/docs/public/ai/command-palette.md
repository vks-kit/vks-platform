# Command palette (⌘K)

> Ctrl/⌘ K opens a fuzzy search over pages and actions. Arrow keys + Enter. Works in Lao.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/command-palette

```ts
import { CommandPalette, useCommandK } from "@vks-kit/ui"
```

## When to use

- **CommandPalette**: Spotlight-style command palette (desktop power users; also opens full-width on phones). Fuzzy search, grouped results, ↑ ↓ Enter, Esc. Pair with useCommandK(setOpen) for Ctrl K.

## Example

```tsx
const [open, setOpen] = React.useState(false)
useCommandK(setOpen)
<CommandPalette open={open} onOpenChange={setOpen} commands={[{ id: "rep", label: "ລາຍງານ", group: "ໄປທີ່", keywords: "report", onRun: go }]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| commands | { id; label; group?; icon?; shortcut?; keywords?; onRun }[] |  | keywords = extra English words to match. |

## Notes

- Substring matches rank above scattered-letter matches (fuzzyScore, unit tested).
- Call useCommandK once per app. This docs site already uses Ctrl+K for its own search, so the demo opens from the button.
