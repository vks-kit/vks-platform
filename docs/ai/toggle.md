# Toggle

> A button that stays pressed. ToggleGroup picks one (or many) of a few options; the segmented variant is the iOS control with a pill that springs under your choice.

- Group: Actions · New
- Source: `packages/ui/src/components/toggle.tsx`
- Live docs: #/docs/toggle

```ts
import { Toggle, ToggleGroup, ToggleGroupItem } from "@vks-kit/ui"
```

## When to use

- **Toggle**: Use for a single button that stays pressed (Bold, "only mine", flashlight). For an on/off setting use Switch instead; for one choice of several use ToggleGroup instead.
- **ToggleGroup**: ToggleGroup. type="single" for one choice, type="multiple" for filters. variant="segmented" = iOS segmented control: a white pill springs under the chosen item.
- **ToggleGroupItem**: Use for one option inside a ToggleGroup (value required). For a standalone pressed button use Toggle instead.

## Example

```tsx
const [view, setView] = React.useState("list")

<ToggleGroup type="single" variant="segmented" value={view} onValueChange={(v) => v && setView(v)}>
  <ToggleGroupItem value="list"><List />ລາຍການ</ToggleGroupItem>
  <ToggleGroupItem value="grid"><LayoutGrid />ຕາຕະລາງ</ToggleGroupItem>
  <ToggleGroupItem value="map"><Map />ແຜນທີ່</ToggleGroupItem>
</ToggleGroup>

<Toggle variant="outline" aria-label="flashlight"><Flashlight />ໄຟສາຍ</Toggle>
```

### Segmented: shift picker

Two or three choices, all visible. Guards never open a dropdown for this.

```tsx
<ToggleGroup type="single" variant="segmented" value={shift} onValueChange={(v) => v && setShift(v)}>
  <ToggleGroupItem value="day"><Sun />ກາງເວັນ</ToggleGroupItem>
  <ToggleGroupItem value="night"><Moon />ກາງຄືນ</ToggleGroupItem>
  <ToggleGroupItem value="24"><Clock />24 ຊມ</ToggleGroupItem>
</ToggleGroup>
```

### Multiple: text format

```tsx
<ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
  <ToggleGroupItem value="bold" aria-label="bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="italic"><Italic /></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="underline"><Underline /></ToggleGroupItem>
</ToggleGroup>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| variant (Toggle) | "default" \| "outline" | "default" | Pressed state = accent fill + thin gold ring. |
| variant (ToggleGroup) | "default" \| "outline" \| "segmented" | "default" | segmented = iOS control with a spring pill. |
| type | "single" \| "multiple" |  | Radix ToggleGroup type. |
| pressed / onPressedChange | boolean / (b) => void |  | Controlled Toggle. |
| value / onValueChange | string \| string[] |  | Controlled group. For segmented, ignore empty values so one stays picked. |

## Notes

- On/off setting that saves right away → Switch.
- Pressed state of one tool (flashlight, bold) → Toggle.
- One of 2–4 options, all visible → ToggleGroup variant="segmented". More than 4 → Select.
