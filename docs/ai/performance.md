# Performance tiers

> High-end vs low-end phone mode. Lite drops blur, looping motion and heavy shadows.

- Group: Foundations · New
- Source: `packages/ui/src/lib/perf.tsx`
- Live docs: #/docs/performance

```ts
import { PerfProvider, initPerf, PerfToggle, usePerf } from "@vks/ui"
```

## When to use

- **PerfToggle**: Auto / Full / Lite. Lite = cheap-Android mode: no blur, no looping or decorative motion, flat shadows. Needs <PerfProvider> above it. tone="bar" for use on the navy header.

## Example

```tsx
// main.tsx
initPerf()   // sets <html data-perf> before first paint
root.render(<ThemeProvider><PerfProvider><App /></PerfProvider></ThemeProvider>)

// settings screen
<PerfToggle />
const { tier } = usePerf()   // skip JS effects when tier === "lite"
```

## Notes

- Auto = lite when: reduced motion, Save-Data, ≤3 GB RAM, or ≤4 cores with ≤4 GB.
- Choice is stored in localStorage (vks-perf).
- Lite keeps every feature — only the decoration goes.
