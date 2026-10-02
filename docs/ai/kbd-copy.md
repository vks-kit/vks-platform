# Kbd, copy & separator

> Small helpers: keyboard hint, copy-to-clipboard with a tick, divider.

- Group: Actions
- Source: `packages/ui/src/components/extras.tsx`
- Live docs: #/docs/kbd-copy

```ts
import { Kbd, CopyButton, Separator } from "@vks-kit/ui"
```

## When to use

- **Kbd**: Use for showing a keyboard shortcut (Ctrl, K). For a status label use Badge instead.
- **CopyButton**: Copy to clipboard; the icon morphs into a tick for 1.5 s.
- **Separator**: Use for a thin horizontal or vertical divider line. For a divider inside a dropdown menu use MenuSeparator instead.

## Example

```tsx
<Kbd>Ctrl</Kbd> <Kbd>K</Kbd>
<CopyButton value={code} />
```
