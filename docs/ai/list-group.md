# Settings list

> iOS Settings-style grouped rows with coloured icon tiles, switches and chevrons.

- Group: Data display · Mobile
- Source: `packages/ui/src/components/ios.tsx`
- Live docs: #/docs/list-group

```ts
import { ListGroup, ListRow } from "@vks/ui"
```

## When to use

- **ListGroup**: iOS grouped list (Settings style). Put ListRow children inside.
- **ListRow**: One row: coloured icon tile, label, optional detail text / trailing control, chevron when tappable.

## Example

```tsx
<ListGroup header="ອຸປະກອນ" footer="GPS ຕ້ອງເປີດ.">
  <ListRow icon={<MapPin />} label="GPS" trailing={<Switch … />} />
  <ListRow icon={<Wifi />} label="ຂໍ້ມູນລໍຖ້າສົ່ງ" detail="3" onPress={open} />
</ListGroup>
```
