# Progress HUD

> Centred dark square: spinner → tick or cross. Blocks taps while a save runs.

- Group: Feedback · Mobile
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/progress-hud

```ts
import { useProgressHUD, ProgressHUD } from "@vks/ui"
```

## When to use

- **ProgressHUD**: iOS-style HUD: dark frosted square in the centre with a spinner, then a tick or a cross. Blocks taps while loading (Escape and outside clicks are ignored). Prefer useProgressHUD().run(promise).

## Example

```tsx
const { hud, run } = useProgressHUD()
await run(api.submit(report), { loading: "ກຳລັງສົ່ງ…", success: "ສົ່ງແລ້ວ", error: "ບໍ່ສຳເລັດ" })
return <>{…}{hud}</>
```

## Notes

- Use for short blocking work (< 5 s) like submit. For background work use a toast.
- run() rethrows on error so your code can still handle it.
