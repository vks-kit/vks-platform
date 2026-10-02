# Notification centre

> Grouped notifications with unread dots, mark-all and dismiss.

- Group: Feedback · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/notification-list

```ts
import { NotificationList } from "@vks-kit/ui"
```

## When to use

- **NotificationList**: Notification centre list (bell popover on desktop, full page on phones). Grouped by group ("ມື້ນີ້", "ມື້ວານ"), unread rows get a dot + tint; "mark all read" in the header. Put it inside PopoverContent for the bell.

## Example

```tsx
<NotificationList items={notices} onOpen={open} onMarkAll={readAll} onDismiss={remove} />
```

## Notes

- Put it inside a Popover on desktop or a Sheet on phone.
