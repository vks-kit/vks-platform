# Slider

> iOS-size 28 px thumb. While dragging the track thickens, a halo grows round the thumb, a value bubble springs up and Android phones tick on every step. Tick marks light up as the fill passes.

- Group: Form · New
- Source: `packages/ui/src/components/form.tsx`
- Live docs: #/docs/slider

```ts
import { Slider } from "@vks/ui"
```

## When to use

- **Slider**: Range slider. Big 28 px thumb (iOS) that grows with a soft halo while dragged; the track thickens, a value bubble springs up over the thumb and a light haptic tick fires on every step. Optional tick marks light up as the fill passes them.

## Example

```tsx
const [v, setV] = useState([40])
<Slider value={v} onValueChange={setV} format={(x) => x + "%"} aria-label="ລະດັບສຽງ" />
```

### Money with steps and ticks

Gold tone, 250,000 ກີບ steps, 5 marks. The label above pops on every change.

```tsx
<Slider value={v} onValueChange={setV} min={0} max={5000000} step={250000}
  ticks={5} tone="gold" format={fmtKip} aria-label="ເງິນເດືອນ" />
```

### Range, bubbles always shown

Two thumbs = a range (shift hours). Tick at every step.

```tsx
<Slider value={[8, 17]} min={0} max={24} ticks showValue="always"
  format={(h) => h + ":00"} minStepsBetweenThumbs={1} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| value / defaultValue / onValueChange | number[] |  | One number = one thumb, two = a range. |
| min / max / step | number | 0 / 100 / 1 |  |
| format | (v) => ReactNode | String | Text in the bubble; also used as aria-valuetext. |
| showValue | "drag" \| "always" \| false | "drag" | Bubble only while held / focused, pinned, or never. |
| ticks | boolean \| number |  | true = every step (max 21), number = that many marks. |
| tone | "success" \| "gold" \| "primary" | "success" | Fill, bubble and halo colour. |
| haptic | boolean | true | 4 ms buzz per step (throttled to 35 ms). |

## Notes

- Keyboard: arrows move one step, PageUp/PageDown ten, Home/End jump. The bubble shows on keyboard focus too.
- Always give aria-label: the thumb has no visible label of its own.
