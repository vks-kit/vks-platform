# QR scan & photo

> Camera QR scanner (jsQR) and a photo button that shrinks to 1280 px / 70 % JPEG before upload. ~48 KB gzip.

- Group: Heavy (lazy) · Lazy
- Source: `packages/ui/src/heavy/scan.tsx`
- Live docs: #/docs/scan

```ts
import { QrScanner, PhotoCapture } from "@vks-kit/ui/scan"
```

## When to use

- **QrScanner**: Use for a live QR scanner; for a photo use PhotoCapture instead. Calls onScan once per code (same code ignored for 2 s), stops the camera when unmounted. variant="fullscreen" fills its parent edge to edge (dimmed mask, gold corner viewfinder, torch when the phone has one, hint pill under the frame); put your own top bar and bottom card over it as children-siblings. Default "card" is the square in-page scanner.
- **PhotoCapture**: Take a photo with the phone camera (or pick one), shrink to ~1280 px JPEG, hand back a Blob + preview URL.

## Example

```tsx
<QrScanner onScan={(text) => submit(text)} onError={showHelp} />
<PhotoCapture onPhoto={({ blob, bytes }) => upload(blob)} />

// Full-screen scanner page: camera edge to edge, your own top bar + bottom card on top
<div className="fixed inset-0">
  <QrScanner variant="fullscreen" frameTop="34%" hint="ຫັນກ້ອງໃສ່ QR ທີ່ປະຕູເຂົ້າ" onScan={submit} />
  <TopBar className="absolute inset-x-0 top-0" />
  <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-card p-4">…</div>
</div>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| onScan / onError | (text) => void / (e) => void |  | QrScanner. Needs https + camera permission. |
| variant | "card" \| "fullscreen" | "card" | fullscreen fills its parent: dimmed mask, gold corner viewfinder, moving scan line, torch (when the phone has one) + switch camera on the right. |
| hint / frameTop | ReactNode / CSS length | — / "40%" | fullscreen only: one line under the viewfinder; where the viewfinder centre sits so your bottom card never covers it. |
| onPhoto | ({ blob, url, bytes }) => void |  | PhotoCapture. |
| maxEdge / quality | number | 1280 / 0.7 |  |
