# Share image

> A picture people send on (receipt, client card, certificate): you draw it on a canvas, the popup shows it sized to the screen with no scrolling and gives Download + copy + share, or Save + Send on WhatsApp on a phone.

- Group: Overlays · New
- Source: `packages/ui/src/components/share-image.tsx`
- Live docs: #/docs/share-image

```ts
import { ShareImageDialog, fitText, loadFonts, loadImage } from "@vks-kit/ui"
```

## When to use

- **ShareImageDialog**: Use for an image people send on (appointment receipt, client card, certificate): the popup shows the picture you draw on a canvas, sized to the screen with no scrolling, and gives Download PNG + copy + share (desktop) or Save + Send on WhatsApp (phone, the native share sheet). You only write draw(canvas). For a share link (no file) use useShareSheet.

## Example

```tsx
const draw = useCallback(async (cv: HTMLCanvasElement) => {
  await loadFonts(FONT)
  const logo = await loadImage(LOGO)
  cv.width = 1080; cv.height = 1384
  const x = cv.getContext("2d")!
  const [name, size] = fitText(x, applicant.name, 700, 66, 900, FONT)
  …
}, [applicant])
<ShareImageDialog open={open} onOpenChange={setOpen} title={"ໃບນັດ · " + name}
  fileName={"VKS_ໃບນັດ_" + code + ".png"} ratio={1080 / 1384} draw={draw} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| draw | (canvas) => void \| Promise |  | Set canvas.width / height and draw. Use tokens from getComputedStyle for colours. |
| ratio | number |  | Picture width / height. The popup width follows the screen height from it. |
| fileName / title / description / note | string / ReactNode |  |  |
| sendLabel / maxWidth | string | "ສົ່ງ WhatsApp" / "38rem" |  |

## Notes

- Desktop footer: copy and share as IconButtons, Download as the one labelled button. Copy puts a PNG on the clipboard: paste it into WhatsApp Web with Ctrl+V.
- fitText shrinks then cuts a line with …; loadFonts waits for Lao weights so the first draw is not in boxes; loadImage resolves null instead of failing.
