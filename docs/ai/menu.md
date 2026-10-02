# Menu & popover

> Frosted iOS menu and a content popover. On desktop they spring out of their trigger; on a phone (under 640 px) both dock to the bottom as a sheet with a grabber, dimmed backdrop and 48 px rows.

- Group: Overlays · New
- Source: `packages/ui/src/components/extras.tsx`
- Live docs: #/docs/menu

```ts
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuLabel, MenuSeparator, Popover, PopoverTrigger, PopoverContent } from "@vks-kit/ui"
```

## When to use

- **Menu**: Use for a dropdown list of actions opened from a button (Edit / Share / Delete). Pair with MenuTrigger + MenuContent + MenuItem. For a right-click menu use ContextMenu instead; for a mobile bottom action list use ActionSheet instead; for choosing a form value use Select or Combobox instead.
- **MenuTrigger**: Use for the button that opens a Menu (use asChild). For opening a Popover use PopoverTrigger instead.
- **MenuContent**: iOS context-menu look: frosted, rounded, springs out of the trigger. On phones (under 640 px) it docks to the bottom as a sheet with a grabber and 44 px rows.
- **MenuItem**: Use for one action row in MenuContent (destructive for red, icon for a trailing icon). For a form option use SelectItem instead.
- **MenuLabel**: Use for a small muted heading above a group of MenuItems. For a heading in a settings list use ListGroup's title instead.
- **MenuSeparator**: Use for a divider between groups of MenuItems. For dividers outside menus use Separator instead.
- **Popover**: Copy to clipboard; the icon morphs into a tick for 1.5 s. */ export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) { const [ok, setOk] = React.useState(false) return ( <button type="button" aria-label={label} onClick={async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1500) } catch { /* no clipboard */ } }} className={cn("vks-press inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground [&_svg]:size-4", ok && "text-success", className)}> <span key={String(ok)} className="vks-pop">{ok ? <Check /> : <Copy />}</span> </button> ) } /* ---------------- Menus / popovers ----------------
- **PopoverTrigger**: Use for the element that opens a Popover (use asChild with a Button). For a hover preview use HoverCard instead.
- **PopoverContent**: Use for small interactive content anchored to a trigger (a filter form, a quick edit). For a list of actions use Menu/MenuContent instead; for read-only details use DetailPopover instead; for a hint on hover use Tooltip instead.

## Example

```tsx
<Menu>
  <MenuTrigger asChild><Button>…</Button></MenuTrigger>
  <MenuContent><MenuItem icon={<Copy />} onSelect={copy}>ສຳເນົາ</MenuItem></MenuContent>
</Menu>
```
