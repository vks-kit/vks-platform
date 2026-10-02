# Logo

> The official VKS badge, redrawn as a vector from the brand file used in the QC dashboard. Same colours in both themes, because the badge carries its own field.

- Group: Foundations · New
- Source: `packages/ui/src/components/logo.tsx`
- Live docs: #/docs/logo

```ts
import { Logo, LogoTile, BRAND } from "@vks-kit/ui"
```

## When to use

- **Logo**: Use for the full VKS logo mark (variant="mono" for single-colour). For a square app icon / avatar-style tile use LogoTile instead; for brand strings use BRAND.
- **LogoTile**: Logo on the navy app tile (PWA icon, splash, login).

## Example

```tsx
<Logo className="size-40" />
<LogoTile className="size-24" />          {/* PWA icon, splash, login */}
<Logo variant="mono" className="size-8" /> {/* one colour: currentColor */}
```

### Sizes

Readable down to 32 px. Below that use mono.

```tsx
<Logo className="size-8" /> … <Logo className="size-28" />
```

### On the navy bar

```tsx
import { Logo, BRAND } from "@vks-kit/ui"

<header className="bg-bar text-bar-foreground">
  <Logo className="size-10" />
  <div>
    <div className="font-bold">{BRAND.name}</div>     {/* Viengkham Security Service */}
    <div className="text-xs">{BRAND.legalLo}</div>    {/* ບໍລິສັດ ວຽງຄຳບໍລິການຄວາມປອດໄພ ຈຳກັດຜູ້ດຽວ */}
  </div>
</header>
```

### Company names (BRAND)

VKS is only the acronym. Always take the name from BRAND, never type it.

```tsx
BRAND.short   // "VKS"
BRAND.name    // "Viengkham Security Service"
BRAND.legal   // "Viengkham Security Service Sole Co., Ltd."
BRAND.lo      // "ວຽງຄຳບໍລິການຄວາມປອດໄພ"
BRAND.legalLo // "ບໍລິສັດ ວຽງຄຳບໍລິການຄວາມປອດໄພ ຈຳກັດຜູ້ດຽວ"
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| variant | "full" \| "mono" | "full" | mono draws everything in currentColor. |
| className | string |  | Size it with size-*. |
| title | string | BRAND.name | Accessible name (Viengkham Security Service). |

## Notes

- Colours live in theme.css as --logo-navy / --logo-gold / --logo-steel / --logo-field. They do not change with the theme.
- Never stretch, recolour or re-letter the badge. For one colour use variant="mono".
