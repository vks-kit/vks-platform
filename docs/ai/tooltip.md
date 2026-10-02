# Tooltip

> Desktop hint only. Never put anything a phone user needs inside a tooltip. Three looks: dark (navy chip, default), light (card for longer help), glass (over maps, photos, charts). Optional arrow, key-shortcut hint and a bold title line. Tip is the one-line shortcut.

- Group: Overlays · Stable
- Source: `packages/ui/src/components/overlay.tsx`
- Live docs: #/docs/tooltip

```ts
import { TooltipProvider, Tip, Tooltip, TooltipTrigger, TooltipContent } from "@vks-kit/ui"
```

## When to use

- **TooltipProvider**: Use once near the app root so Tooltips share open/close delays (AppShell apps: wrap the whole tree). Not needed for Popover or HoverCard.
- **Tip**: Use for a one-line tooltip without the three-part markup: <Tip content="ບັນທຶກ" shortcut="Ctrl S"><Button /></Tip>. Needs TooltipProvider at the root.
- **Tooltip**: Use for a short text hint on hover/focus (icon-only buttons, desktop). Pair with TooltipTrigger + TooltipContent. Not reliable on touch: for phones put the text in the label; for rich hover content use HoverCard instead; for tap-to-open content use Popover instead.
- **TooltipTrigger**: Use for the element that shows a Tooltip (use asChild with a Button). For opening a Popover use PopoverTrigger instead.
- **TooltipContent**: Use for the short text bubble of a Tooltip. For interactive content use PopoverContent instead. Additive options: variant dark (navy chip, default) | light (card, longer help) | glass (over maps, photos, charts), arrow, shortcut (key hint on the right), title (bold first line, children become the muted second line).

## Example

```tsx
// TooltipProvider once at the root
<Tip content="ບັນທຶກ" shortcut="Ctrl S"><Button>…</Button></Tip>
<Tip variant="light" title="ກະເຊົ້າ" content="06:00 – 14:00 · 12 ຄົນ"><Button>…</Button></Tip>

// full control
<Tooltip>
  <TooltipTrigger asChild><Button variant="ghost">Hover me</Button></TooltipTrigger>
  <TooltipContent variant="glass" arrow side="right">ຄຳອະທິບາຍ</TooltipContent>
</Tooltip>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| variant | "dark" \| "light" \| "glass" | "dark" | On TooltipContent and Tip. |
| arrow | boolean | false (Tip: true) |  |
| shortcut | string |  | Key hint on the right, e.g. "Ctrl S". |
| title | ReactNode |  | Bold first line; content becomes the muted second line. |
| side / align / delay | top\|right\|bottom\|left / start\|center\|end / ms | top / center | Tip only; on TooltipContent use side/align directly. |
