# Pull to refresh & swipe row

> The two gestures guards already know from other apps. Both have a button fallback for accessibility.

- Group: Mobile & touch · Mobile
- Source: `packages/ui/src/components/touch.tsx`
- Live docs: #/docs/touch

```ts
import { PullToRefresh, SwipeRow } from "@vks-kit/ui"
```

## When to use

- **PullToRefresh**: Pull down at the top of the page to refresh. Touch only, ignores mouse. Threshold 70 px.
- **SwipeRow**: Row you can swipe left to reveal an action (delete, call). Snaps open past 40%. Tap the action to run it.

## Example

```tsx
<PullToRefresh onRefresh={refetch}>          {/* 70 px pull */}
  {rows.map((r) => (
    <SwipeRow key={r.id} onAction={() => remove(r.id)} actionLabel="ລຶບ">
      <Row {...r} />
    </SwipeRow>
  ))}
</PullToRefresh>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| onRefresh | () => Promise<unknown> |  | PullToRefresh: spinner until it resolves. |
| onAction | () => void |  | SwipeRow. |
| actionLabel | string | "ລຶບ" |  |
| icon | ReactNode | <Trash2 /> |  |
