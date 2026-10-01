# Detail popover

> Popup detail information. Hover (or tap) a name, row or map pin and a rich card grows out of it from the side it opens on; rows stagger in. On a phone the same content rises as a bottom sheet.

- Group: Overlays · New
- Source: `packages/ui/src/components/detail-popover.tsx`
- Live docs: #/docs/detail-popover

```ts
import { DetailPopover, type DetailField } from "@vks/ui"
```

## When to use

- **DetailPopover**: "Popup detail information". Point at a name / row / pin and a rich card springs out of it on desktop (from the side it opens on); on phones the same content comes up as a bottom sheet, because hover does not exist there. Rows stagger in. Keep it read-only-ish: 3-8 fields, max 2 actions.

## Example

```tsx
<DetailPopover side="right" align="start"
  title="ສົມຊາຍ ວົງສະຫວັນ" subtitle="ພະນັກງານຮັກສາຄວາມປອດໄພ"
  media={<Avatar name="ສົມຊາຍ" size={44} status="online" />}
  status={{ label: "ເຂົ້າກະແລ້ວ", tone: "success", live: true }}
  fields={[
    { label: "ລະຫັດ", value: "G014" },
    { label: "ກະ", value: "06:00-18:00", icon: <Clock /> },
    { label: "ຈຸດປະຈຳ", value: "ປະຕູໜ້າ A-01", icon: <MapPin />, wide: true },
  ]}
  body={<Progress value={9} max={12} label="ສະແກນ 9/12 ຈຸດ" />}
  actions={<Button size="sm">ເບິ່ງລາຍລະອຽດ</Button>}>
  <button>ສົມຊາຍ ວົງສະຫວັນ</button>
</DetailPopover>
```

### Click to open (map pins)

openOn="click" for things people tap on purpose. The red pin ripples; its chip dot breathes.

```tsx
<DetailPopover openOn="click" side="top" title="ຄັງສິນຄ້າ"
  status={{ label: "ພາດ", tone: "danger", live: true }} fields={…} actions={…}>
  <button aria-label="ຄັງສິນຄ້າ" className="size-11">…pin…</button>
</DetailPopover>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| children | ReactElement |  | One focusable trigger (button / a). Keyboard focus opens the hover card too. |
| title / subtitle / media | ReactNode |  | Header row. media = Avatar or icon tile. |
| status | { label; tone?: 'neutral'\|'success'\|'warning'\|'danger'\|'gold'; live? } |  | Chip with a dot; live = breathing dot. |
| fields | { label; value; icon?; wide? }[] |  | Two-column grid. wide spans both columns. Keep 3-8. |
| body / actions | ReactNode |  | Anything under the fields; up to 2 buttons at the bottom. |
| openOn | "hover" \| "click" | "hover" | Desktop only. Hover opens after 250 ms, closes 120 ms after leaving. |
| side / align | Radix side / align | "bottom" / "center" | The card grows from this side and flips when there is no room. |
| open / onOpenChange | boolean / (o) => void |  | Optional control. |

## Notes

- Motion: 240 ms scale 0.94 → 1 from the trigger's side on --ease-spring, exit 150 ms. Phone: normal sheet slide. Lite mode: fade only, no blur shadow.
- Never put the only copy of information in here: it is a shortcut to a detail page, not the page itself.
