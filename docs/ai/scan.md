# QR scan & photo

> Camera QR scanner (jsQR) and a photo button that shrinks to 1280 px / 70 % JPEG before upload. ~48 KB gzip.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/scan.tsx`
- Live docs: #/docs/scan

```ts
import { QrScanner, PhotoCapture } from "@vks/ui/scan"
```

## When to use

- **QrScanner**: Live QR scanner. Calls onScan once per code (same code ignored for 2 s). Stops the camera when unmounted.
- **PhotoCapture**: Take a photo with the phone camera (or pick one), shrink to ~1280 px JPEG, hand back a Blob + preview URL.

## Example

```tsx
<QrScanner onScan={(text) => submit(text)} onError={showHelp} />
<PhotoCapture onPhoto={({ blob, bytes }) => upload(blob)} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| onScan / onError | (text) => void / (e) => void |  | QrScanner. Needs https + camera permission. |
| onPhoto | ({ blob, url, bytes }) => void |  | PhotoCapture. |
| maxEdge / quality | number | 1280 / 0.7 |  |
