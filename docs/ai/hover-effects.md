# Hover effects

> Premium mouse effects for desktop: spotlight, edge trace and 3D tilt on cards, mouse parallax, a sliding row highlight, icon nudge and a cursor ring for landing pages. Phones, lite mode and reduced motion get none of it.

- Group: Foundations · New
- Source: `packages/ui/src/components/hover-fx.tsx`
- Live docs: #/docs/hover-effects

```ts
import { HoverFx, Parallax, ParallaxLayer, SlideHighlight, CursorRing, usePointerVars } from "@vks/ui"
```

## When to use

- **HoverFx**: Use for a premium desktop hover on a card or tile: spotlight (gold glow follows the cursor), trace (gold edge near the cursor, best on navy) or tilt (≤5° 3D tilt + sheen, for hero/KPI cards). Wrap the card; for a plain lift use the vks-lift class instead. Phones and lite mode see no effect.
- **Parallax**: Use for a hero or login panel whose background layers drift with the mouse; put ParallaxLayer children inside with a depth. For scroll-driven motion use plain CSS instead.
- **ParallaxLayer**: Use inside Parallax: one layer that moves up to depth px with the mouse (negative = opposite way). Decorative layers should be aria-hidden.
- **SlideHighlight**: Use for a sidebar, menu or list where one soft pill glides to the hovered row instead of each row flashing; marks rows with [data-slide-item] or uses direct children. For keyboard selection keep the row's own focus style.
- **CursorRing**: Use for a landing or login area only: a gold ring trails the cursor and grows over buttons and links. Never on work screens, where staff need the normal precise cursor.

## Example

```tsx
<HoverFx effect="spotlight" className="rounded-2xl border bg-card p-5">…</HoverFx>
<Parallax><ParallaxLayer depth={-20}>orb</ParallaxLayer><ParallaxLayer depth={6}><Logo /></ParallaxLayer></Parallax>
<SlideHighlight>{rows.map(r => <button data-slide-item>…</button>)}</SlideHighlight>
<Button className="vks-nudge">Next <ArrowRight /></Button>
<LoginScreen cursorRing …/>
```

### Mouse parallax

Layers drift by their depth (px). Negative moves the other way. LoginScreen's brand panel uses this.

```tsx
<Parallax className="relative overflow-hidden">
  <ParallaxLayer depth={-20} aria-hidden>…orb…</ParallaxLayer>
  <ParallaxLayer depth={6}><Logo /></ParallaxLayer>
</Parallax>
```

### Sliding highlight

One pill glides to the hovered row. Mark rows with data-slide-item.

```tsx
<SlideHighlight>
  {rows.map((r) => <button key={r.id} data-slide-item>{r.label}</button>)}
</SlideHighlight>
```

### Icon nudge

Add className="vks-nudge" to a button: arrows slide right, other icons wiggle.

```tsx
<Button className="vks-nudge">ຕໍ່ໄປ <ArrowRight /></Button>
```

### Cursor ring (landing / login only)

A gold ring trails the cursor and grows over anything clickable. Never on work screens.

```tsx
<CursorRing className="min-h-dvh">…landing…</CursorRing>
<LoginScreen cursorRing title="…">…</LoginScreen>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| effect | 'spotlight'\|'trace'\|'tilt' | "spotlight" | HoverFx: glow under the cursor, gold edge near the cursor (best on navy), or ≤5° tilt + sheen. |
| depth | number | 12 | ParallaxLayer: max drift in px. |
| itemSelector | string |  | SlideHighlight: which children count as rows (default [data-slide-item] or direct children). |

## Notes

- Effects only run with a real mouse ((hover: hover) and (pointer: fine)). Lite mode and reduced motion turn them off.
- Tilt and the cursor ring are for hero/KPI cards and landing/login. Keep work screens calm: spotlight + sliding highlight + vks-lift.
- Only transform and opacity animate. The pointer is read once per frame (rAF).
