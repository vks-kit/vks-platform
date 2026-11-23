# Fade crop

> Show the top of something long and let its foot fade out instead of cutting it at a random line. A mask, so it fades into any background in both themes. expandable adds one ເບິ່ງທັງໝົດ button.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/fade-crop.tsx`
- Live docs: #/docs/fade-crop

```ts
import { FadeCrop } from "@vks-kit/ui"
```

## When to use

- **FadeCrop**: Use for a long thing shown only in part (a list preview, a table on a dashboard tile, a screenshot in the docs): it fades out at its foot instead of being cut at an arbitrary line, so it reads as "this goes on". It is a mask, not a colour laid over the foot, so it fades into whatever it sits on, in both themes. Give expandable to add one "ເບິ່ງທັງໝົດ" button that opens the rest (and "ຫຍໍ້" to fold it again). Keep real content in the top part and let the fade fall on filler or older rows. For a list that must be read in full use DataTable; for paging use Pagination.

## Example

```tsx
<FadeCrop height={230} expandable>
  <AttendanceList rows={today} />
</FadeCrop>
```

### With ເບິ່ງທັງໝົດ

The button sits on the fade; open, the whole list shows and the button becomes ຫຍໍ້.

```tsx
<FadeCrop height={230} expandable>…</FadeCrop>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| height | number \| string | 280 | Visible part. |
| fadeFrom / fadeTo | number (%) | 58 / 96 | Where the fade starts and ends. |
| expandable | boolean |  | Adds ເບິ່ງທັງໝົດ / ຫຍໍ້. |
| moreLabel / lessLabel | string |  |  |
| open / onOpenChange | boolean / (o) => void |  |  |

## Notes

- Keep the real rows in the top half; let the fade fall on older rows or filler.
- Only the foot fades; top and sides stay sharp so it still reads as a placed block.
