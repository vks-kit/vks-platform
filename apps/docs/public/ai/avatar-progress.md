# Avatar & progress

> Initials avatar (works with Lao names) and a labelled progress bar.

- Group: Data display · Stable
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/avatar-progress

```ts
import { Avatar, AvatarGroup, UserChip, Progress, ProgressRing } from "@vks-kit/ui"
```

## When to use

- **Avatar**: Photo with a soft fade-in; falls back to initials on a colour picked from the name (same person = same colour). ring = gold conic ring (supervisor / on duty). status = presence dot; "online" pulses unless the phone is in lite mode.
- **AvatarGroup**: Overlapping stack. Shows max, then a "+N" chip. Fans out on hover (desktop).
- **UserChip**: Profile row: avatar + name + sub line. Common in lists, headers, sidebars.
- **Progress**: Use for a linear percent bar (upload, form completion). For a circular gauge use ProgressRing instead; for numbered steps use StepProgress instead; for an indeterminate wait use Spinner instead.
- **ProgressRing**: Circular progress (patrol completion, shift time). Arc eases with the iOS curve.

## Example

```tsx
<Avatar name="ສົມຊາຍ ແກ້ວ" />
<Avatar name="Bounmy K" size={32} src={photoUrl} />
<Progress value={12} max={20} label="ຈຸດກວດ 12 / 20" />
```

### Avatar group & user chip

Group stacks faces and shows +N after max. UserChip is avatar + name + sub line for lists and sidebars.

```tsx
<AvatarGroup people={staff} max={4} />
<UserChip name="ສົມຊາຍ ແກ້ວ" sub="ຫົວໜ້າກະ · ປະຕູໜ້າ" status="online" />
```

### Progress ring

Circular gauge for a single score. tone: success | warning | danger | gold.

```tsx
<ProgressRing value={86} label="86%" />
<ProgressRing value={42} tone="warning" size={80} label="42%" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| name | string |  | Avatar: initials come from it. |
| size | number | 40 | px |
| value / max / label | number / number / string | — / 100 / — | Progress. |
