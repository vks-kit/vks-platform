# Capture stamp (photo & video)

> The time / site / GPS card the Patrol app burns into photos and video frames: top-left capture time, bottom-right site + GPS, top-right brand pill. One drawing function, so the live preview and the saved file look identical. Lao text wraps without splitting tone marks.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/scan.tsx`
- Live docs: #/docs/capture-stamp

```ts
import { drawCaptureStamp, stampPhoto, stampTime, CaptureStamp, type CaptureStampData } from "@vks/ui/scan"
```

## When to use

- **CaptureStamp**: Use as a live-camera overlay that shows exactly what drawCaptureStamp will burn in (same code); for the final image use stampPhoto.

## Example

```tsx
const data = { time: stampTime(), site: "ຄັງສິນຄ້າ ໂຮງງານເບຍລາວ", gps: "17.97570, 102.63310 (±8 m)" }

// live camera view: same drawing as the saved file
<div className="relative"><video … /><CaptureStamp data={data} /></div>

// photo: shrink + stamp, get a JPEG Blob
const blob = await stampPhoto(file, data)

// video: call once per frame on your own canvas
drawCaptureStamp(ctx, canvas.width, canvas.height, data)
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| data | { time; site?; gps; brand? } |  | time and gps are plain strings you format; site is left out when none is chosen; brand defaults to VKS. |
| drawCaptureStamp(ctx, w, h, data) | function |  | Draws on any 2D canvas (no React). Sizes scale with min(w, h), so it fits 720p video and 12 MP photos alike. |
| stampPhoto(blob, data, maxEdge?, quality?) | Promise<Blob> | 1280 / 0.7 | Shrinks, stamps, returns a JPEG. |
| stampTime(date?) | string |  | YYYY-MM-DD HH:mm:ss in local time. |

## Notes

- Canvas cannot read CSS tokens, so the stamp's colours are fixed inside the function (dark glass card, green labels) to match the existing Patrol PWA look.
- Stamp a video by calling drawCaptureStamp on each frame of your compositor canvas before encoding; the draw is cheap, but at 60 Hz screens limit it to the encode rate.
