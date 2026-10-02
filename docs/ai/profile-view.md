# Profile view

> Employee / account profile. Desktop: sticky identity card on the left, grouped settings on the right. Phone: an iOS-contact-style header (big avatar, round call / message / edit buttons) edge to edge, then one stacked column.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/account.tsx`
- Live docs: #/docs/profile-view

```ts
import { ProfileView, type ProfileSection, type ProfileRow, type ProfileQuickAction } from "@vks-kit/ui"
```

## When to use

- **ProfileView**: Use for an employee or account profile page: two columns on a desktop (identity card + sections), one stacked column on a phone. For a single avatar + name line use UserChip instead.

## Example

```tsx
<ProfileView variant="actions" name="ສົມຊາຍ" role="ເຈົ້າໜ້າທີ່" code="VKS2207001" status="online"
  stats={[{ label: "ມື້ມາວຽກ", value: 24 }]}
  quickActions={[
    { icon: <Phone />, label: "ໂທ", onPress: call },
    { icon: <MessageCircle />, label: "ຂໍ້ຄວາມ", onPress: message },
    { icon: <Pencil />, label: "ແກ້ໄຂ", onPress: edit },
  ]}
  sections={[{ title: "ຂໍ້ມູນ", rows: [{ icon: <Phone />, label: "ເບີໂທ", value: "020…" }] }]}
  onSignOut={signOut} />
```

### Banner header (default)

variant="banner" keeps the navy banner with the avatar overlapping it; add flush for an edge-to-edge phone layout.

```tsx
<ProfileView flush name="ສົມຊາຍ" code="VKS2207001" actions={<Button variant="outline">ແກ້ໄຂ</Button>} sections={…} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| name / role / code / src / status | string / AvatarStatus |  | Identity card; avatar falls back to initials. |
| stats | { label; value }[] |  | Up to 4 numbers under the name. |
| flush | boolean |  | Phone only: the identity header runs edge to edge and lists keep one 16 px margin. Desktop is unchanged. |
| variant | "banner" \| "actions" | "banner" | Phone only: "actions" drops the navy banner for a soft header with a big avatar and round quick-action buttons. Implies flush. Desktop is unchanged. |
| quickActions | { icon; label; onPress? }[] |  | Round 56 px icon buttons with a label under the name (call, message, edit…). Keep to 3-4. |
| sections | { title?; rows: ProfileRow[] }[] |  | Row = icon, label, value, trailing (e.g. Switch) or onPress (shows a chevron). |
| actions | ReactNode |  | Buttons in the identity card. |
| onSignOut / signOutLabel | () => void / string |  | Red sign-out row at the bottom. |
