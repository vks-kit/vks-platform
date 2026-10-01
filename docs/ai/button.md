# Button

> The one button. Layered fill, inner highlight, tinted lift shadow and a sheen on hover. Presses land on an iOS spring. h-11 (44 px) on every size.

- Group: Actions · Stable
- Source: `packages/ui/src/components/button.tsx`
- Live docs: #/docs/button

```ts
import { Button } from "@vks/ui"
```

## When to use

- **Button**: Use for any clickable action (44 px tall, loading spinner built in). variant="action" for scan/save/done, "destructive" for delete. For a button that stays pressed use Toggle instead; for an icon-only row action use size="icon"; for a floating main action on phones use Fab instead.

## Usage

import { Button } from "@vks/ui"

export function Save() {
  return <Button onClick={save}>ບັນທຶກ</Button>
}

## Example

```tsx
<Button>ບັນທຶກ</Button>
<Button variant="action"><ScanLine />ສະແກນ</Button>
<Button variant="gold">Gold</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive"><Trash2 />ລຶບ</Button>
```

### Sizes

sm stays 44 px tall on phones and only shrinks on desktop.

```tsx
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="add"><Plus /></Button>
```

### As a link

asChild hands the styles to your own element (Radix Slot).

```tsx
<Button asChild variant="outline">
  <a href="/intro">Read the intro <ArrowRight /></a>
</Button>
```

### Loading

loading keeps the width, shows a spinner and blocks double taps.

```tsx
const [busy, setBusy] = React.useState(false)
<Button variant="action" loading={busy} onClick={save}>ບັນທຶກ</Button>
```

### Disabled

```tsx
<Button disabled>ບັນທຶກ</Button>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| variant | "default" \| "action" \| "gold" \| "outline" \| "ghost" \| "destructive" | "default" | action = emerald, the main thing a guard does on the screen. Only one per screen. |
| size | "default" \| "sm" \| "lg" \| "icon" | "default" | Every size is at least 44 px on a phone. |
| asChild | boolean | false | Render your own child element with the button styles. |
| loading | boolean | false | Spinner + disabled, width does not jump. |
| ...props | React.ComponentProps<"button"> |  | Anything a normal button takes. |
