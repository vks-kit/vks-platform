# Map

> Leaflet + OpenStreetMap with VKS controls: glass 44 px zoom + 'fit all pins' buttons, pulsing token pins (danger pulses faster), Noto Sans Lao card tooltips (tone dot, title, sub line, time), an optional pin card that springs up when a pin is tapped (phones have no hover, so this is how they read details), always-on labels, and a tiny © OSM credit (required by the OSM licence). Defaults to Vientiane. ~43 KB gzip.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/map.tsx`
- Live docs: #/docs/map

```ts
import { MapView, type Pin } from "@vks-kit/ui/map"
```

## When to use

- **MapView**: OpenStreetMap tiles via Leaflet, VKS-styled: glass +/- and "fit pins" controls (44 px), pulsing token pins (danger pins keep pulsing), Noto Sans Lao card tooltips, an optional pin card that springs up from the bottom when a pin is tapped (phones have no hover), and a tiny OSM credit (required by the tile licence). On phones, with 2+ pins, a bottom sheet lists every pin (tap a row to fly there and open its card), because small pins are hard to hit with a thumb; pass list={false} to turn it off. Import from "@vks-kit/ui/map" only where a map is shown. Point-in-radius check is in @vks-kit/core/geo.

## Example

```tsx
<MapView
  pins={[{ id: "1", lat: 17.9757, lng: 102.6331, label: "ປະຕູໜ້າ", sub: "ສົມພອນ · ເຂົ້າກະແລ້ວ", meta: "08:12", tone: "success" }]}
  renderCard={(pin) => <Button size="sm" onClick={() => call(pin.id)}>ໂທຫາ</Button>}
/>
```

### Always-on labels

tips="always" keeps small pill labels on every pin: good for wall screens in the control room.

```tsx
<MapView pins={pins} tips="always" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| flush | boolean | false | Phone only: edge to edge, no rounded corners or border, like a full-width screen. Desktop is unchanged. |
| list | boolean | phone + 2 or more pins | Uber-style bottom sheet on phones: peeks at the bottom, drag up to list every pin, drag down to tuck it away. Tap a row to fly there and open its card. Pins are small for a thumb, so the list is the reliable way to pick one. |
| pins | { id; lat; lng; label?; sub?; meta?; tone?: "success" \| "warning" \| "danger" \| "primary" }[] |  | sub = second line, meta = small right text (time). |
| tips | "hover" \| "always" \| "none" | "hover" | Hover tip, permanent labels, or none. |
| renderCard | (pin) => ReactNode |  | Tapping a pin opens a glass card at the bottom with title, tone, close and this body. |
| card | boolean | !!renderCard | Show the pin card without a custom body. |
| height | number | 320 |  |
| onPin | (pin) => void |  |  |
| center / zoom | [lat, lng] / number | [17.9757, 102.6331] / 12 |  |
