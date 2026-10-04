# Timeline

> What happened on a shift, newest first.

- Group: Data display · New
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/timeline

```ts
import { Timeline } from "@vks-kit/ui"
```

## When to use

- **Timeline**: Use for a vertical history of events (patrol log, status changes) and for an audit trail: add actor and changes (from diffFields) to show who changed which field from what to what. For a table of records use DataTable instead; for a live feed with read/unread use NotificationList instead.

## Example

```tsx
<Timeline items={[
  { id: "1", time: "08:12", title: "ສະແກນປະຕູໜ້າ", tone: "success" },
  { id: "2", time: "08:41", title: "ຊ້າ 6 ນາທີ", detail: "ບ່ອນຈອດລົດ", tone: "warning" },
]} />
```

### Audit trail (who, what, when, diff)

Same Timeline with actor and changes. diffFields skips fields that did not change; pass ignore for noise such as updatedAt.

```tsx
import { Timeline, diffFields } from "@vks-kit/ui"

<Timeline items={log.map((e) => ({
  id: e.id, time: e.at, actor: e.by, title: e.action,
  changes: diffFields(e.before, e.after, { labels: { shift: "ກະ", site: "ສະຖານທີ່" }, ignore: ["updatedAt"] }),
}))} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| items | { id; time; title; detail?; tone?: "success" \| "warning" \| "danger" \| "neutral"; actor?; changes? }[] |  |  |
| items[].actor | string |  | Audit trail: who did it. Shown after the time. |
| items[].changes | { field; label; from; to }[] |  | Audit trail: changed fields, old value struck through, then the new one. Build it with diffFields(before, after, { labels, ignore }). |

## Notes

- Audit rows are read-only. Never let the user edit history in place.
