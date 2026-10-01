# Loading & success

> Skeleton shimmer while loading, a spinner for short waits, and the animated check after a scan.

- Group: Feedback · Stable
- Source: `packages/ui/src/components/feedback.tsx`
- Live docs: #/docs/loading

```ts
import { Skeleton, Spinner, SuccessCheck, LiveDot } from "@vks/ui"
```

## When to use

- **Skeleton**: Use for a generic shimmering placeholder block; size it with className. For text lines use SkeletonText; for list rows use SkeletonList; for a table use SkeletonTable; for a short action wait use Spinner or Button loading instead.
- **Spinner**: Use for a small inline "working" indicator. For a button that is saving use Button loading instead; for page content that is loading use Skeleton instead; for a blocking full-screen wait use ProgressHUD instead.
- **SuccessCheck**: Circle pops, tick draws. Pair with haptics.success() from @vks/core.
- **LiveDot**: Use for a pulsing green "live / online now" dot. For a coloured status word use Badge instead.

## Example

```tsx
<Skeleton className="h-10 w-10 rounded-full" />
<Skeleton className="w-2/3" />
<Spinner />
<SuccessCheck />   {/* pair with haptics.success() */}
<LiveDot />
```
