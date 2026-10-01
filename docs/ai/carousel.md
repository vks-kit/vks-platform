# Carousel

> CSS scroll-snap cards with the next one peeking. Dots on phone, arrows on desktop. No JS animation.

- Group: Mobile & touch · New
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/carousel

```ts
import { Carousel } from "@vks/ui"
```

## When to use

- **Carousel**: Swipeable, snap-scrolling row of cards with page dots (phone) and arrow buttons (desktop). Native scroll = 60 fps on cheap Android, no JS on the drag path. Arrow keys work when focused. slideClassName sets how wide each slide is (default: 86% on phone, 3 per row on desktop).

## Example

```tsx
<Carousel>{sites.map((s) => <SiteCard key={s.id} {...s} />)}</Carousel>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| slideClassName | string | "w-[86%] md:w-[calc((100%-1.5rem)/3)]" | Slide width; 86% on phone shows a peek of the next card. |
| dots | boolean | true |  |

## Notes

- Swipe is native scrolling, so it is cheap on Android.
- Arrow keys work when focused.
