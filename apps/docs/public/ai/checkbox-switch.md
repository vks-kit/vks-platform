# Checkbox & Switch

> Press in and hold: the box sinks with a soft halo, the switch knob stretches into a pill. Let go: green grows out from the centre, the tick draws, the knob springs across and one ring pulses. Unticking is quicker and quiet. Both have a 44 px hit area and a tiny haptic on Android.

- Group: Form · New
- Source: `packages/ui/src/components/form.tsx`
- Live docs: #/docs/checkbox-switch

```ts
import { Checkbox, Switch, Label } from "@vks/ui"
```

## When to use

- **Checkbox**: Press in: box sinks to 86 %, a soft halo appears, border turns green. Release: green fill grows from the centre with a spring, the tick draws in, the box bounces past 100 % and the halo ripples out once. Unchecking is quicker and quiet. Supports checked="indeterminate". Tiny haptic on toggle (Android).
- **Switch**: iOS switch, 51x31. Press in: the knob stretches into a pill toward where it will go and the off-track darkens. Release: the knob springs across and shrinks back to a circle, green floods out from the middle of the track and one ring pulses. The pill is 3 transform-only pieces, so no width animation.
- **Label**: Use for the visible label of a form field (link it with htmlFor). For a floating label that sits inside the field use FloatingInput instead.

## Example

```tsx
<label className="flex items-center gap-3"><Checkbox defaultChecked />ມີຮູບປະກອບ</label>
<label className="flex items-center gap-3"><Switch defaultChecked />ແຈ້ງເຕືອນ</label>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| checked / onCheckedChange | boolean / (v) => void |  | Radix props. Checkbox also takes checked="indeterminate". |
| haptic | boolean | true | 8 ms vibration on toggle (Android only). |

## Notes

- Wrap them in a <label>: pressing the label text runs the same press-in animation and dims the text.
- Transform + opacity only, ≤ 460 ms. Lite mode drops the halo, ring and glow; reduced motion snaps.
