# Guard ID badge

> A guard's ID card on screen and in print (85.6 mm wide): VKS logo, photo, name, staff ID, role, posted site, status and a QR slot.

- Group: Data display · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/guard-id-badge

```ts
import { GuardIdBadge, type GuardIdStatus } from "@vks-kit/ui"
```

## When to use

- **GuardIdBadge**: Use for a guard's ID card on screen and on paper (85.6 x 54 mm card width when printed): VKS logo, photo, name, staff ID, role, posted site, status and a QR slot for the inspector to scan. For a person in a list use UserChip; for a full profile page use ProfileView instead.

## Example

```tsx
<GuardIdBadge name={g.name} staffId={g.code} role={g.role} site={g.site} photo={g.photo}
  status={g.active ? "active" : "suspended"} validUntil="31/12/2027" qr={<img src={qrUrl(g.code)} alt="" />} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| status | "active" \| "suspended" \| "expired" | "active" | Green, red or amber badge. |
| qr | ReactNode |  | Drawn by the app (img or svg). The kit has no QR encoder. |
| photo | string |  | Photo URL; initials when missing. |

## Notes

- The header uses the fixed logo navy in both themes, like the logo itself.
- When printed the card is 85.6 mm wide with colours kept (print-color-adjust: exact).
