# Signature pad

> Finger signature for hand-overs. Read it back as a PNG.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/components/signature-pad.tsx`
- Live docs: #/docs/signature-pad

```ts
import { SignaturePad, type SignaturePadHandle } from "@vks-kit/ui"
```

## When to use

- **SignaturePad**: Draw with finger or mouse. toDataURL() gives a PNG. Uses pointer events + touch-action:none so the page does not scroll while signing.

## Example

```tsx
const ref = useRef<SignaturePadHandle>(null)
<SignaturePad ref={ref} onChange={(empty) => setSigned(!empty)} />
// later
const png = ref.current!.toDataURL()
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| height | number |  |  |
| onChange | (empty: boolean) => void |  |  |
| ref | { clear(); isEmpty(); toDataURL() } |  |  |
