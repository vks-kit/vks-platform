# Lightbox

> Full screen photo viewer with swipe, arrows and a caption. For patrol photos.

- Group: Overlays · Mobile
- Source: `packages/ui/src/components/lightbox.tsx`
- Live docs: #/docs/lightbox

```ts
import { Lightbox, PhotoGrid } from "@vks/ui"
```

## When to use

- **Lightbox**: iOS Photos-style viewer. - opens with a spring zoom over a fading black backdrop, chrome fades in after - tap anywhere outside the photo (or Esc / X) to close; drag the photo down to dismiss - swipe left / right or arrow keys to move; the new photo slides in from that side - with 2+ photos a thumbnail strip sits bottom-right (full width on phones), current one lifts - double-tap / double-click zooms 2x
- **PhotoGrid**: Thumbnail grid that opens a Lightbox. Handy default for evidence photos on a report.

## Example

```tsx
<Lightbox images={photos} index={i} onIndex={setI} onClose={() => setI(null)} />
```

### Photo grid

Square thumbnails that open the same Lightbox on tap. cols = 2 | 3 | 4.

```tsx
<PhotoGrid images={photos} cols={3} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| images | { src: string; caption?: string }[] |  |  |
| index | number \| null |  | null = closed. |
| onIndex | (i: number) => void |  |  |
| onClose | () => void |  |  |
