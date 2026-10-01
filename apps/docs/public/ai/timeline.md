# Timeline

> What happened on a shift, newest first.

- Group: Data display · New
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/timeline

```ts
import { Timeline } from "@vks/ui"
```

## When to use

- **Timeline**: Use for a vertical history of events (patrol log, audit trail, status changes). For a table of records use DataTable instead; for a live feed with read/unread use NotificationList instead.

## Example

```tsx
<Timeline items={[
  { id: "1", time: "08:12", title: "ສະແກນປະຕູໜ້າ", tone: "success" },
  { id: "2", time: "08:41", title: "ຊ້າ 6 ນາທີ", detail: "ບ່ອນຈອດລົດ", tone: "warning" },
]} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | { id; time; title; detail?; tone?: "success" \| "warning" \| "danger" \| "neutral" }[] |  |  |
