# Long press

> Hold-to-act hook. Cancels if the finger moves, so it never fights scrolling.

- Group: Mobile & touch · Mobile
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/long-press

```ts
import { useLongPress } from "@vks/ui"
```

## Example

```tsx
const press = useLongPress(openMenu, { ms: 500, onPress: open })
<div {...press}>…</div>
```
