# Toast

> Sonner restyled to match IOSAlert: glass card with a gold hairline, round tone badge, spring entrance and a bar that drains while it stays. Top-center, away from the thumb. Success, error and finished promises buzz the phone.

- Group: Feedback · Stable
- Source: `packages/ui/src/components/toaster.tsx`
- Live docs: #/docs/toast

```ts
import { toast, Toaster } from "@vks-kit/ui"
```

## When to use

- **Toaster**: Use once at the app root so toast() messages can appear (follows the theme). Then call toast.success / toast.error / toast.promise anywhere. For an inline persistent message use Alert instead; for an iOS push-style banner use Banner instead.

## Example

```tsx
// once, at the app root
<Toaster />

toast.success("ບັນທຶກແລ້ວ")   // + 50-20-50 ms buzz
toast.error("ສົ່ງບໍ່ສຳເລັດ", { action: { label: "ລອງໃໝ່", onClick: retry } })
toast.promise(save(), { loading: "ກຳລັງບັນທຶກ…", success: "ບັນທຶກແລ້ວ", error: "ບໍ່ສຳເລັດ" })  // buzzes when it settles
toast("ມີວຽກໃໝ່ 2 ລາຍການ", { description: "ຈາກ ຫົວໜ້າກະ" })
```

## Notes

- Only the badge carries colour; the text stays readable in every tone.
- The drain bar pauses while the pointer is over the stack (sonner pauses the timer too).
- Lite mode drops the glass blur and badge pop; reduced motion gets a plain fade.
- Use toast.promise when the user can keep working; use useProgressHUD when they must wait.
