# Share sheet

> Native OS share on phones; an iOS-style sheet (WhatsApp, LINE, Telegram, Facebook, copy link) on desktop.

- Group: Overlays · New
- Source: `packages/ui/src/components/mobile-kit.tsx`
- Live docs: #/docs/share-sheet

```ts
import { useShareSheet, ShareSheet } from "@vks-kit/ui"
```

## When to use

- **ShareSheet**: iOS-style share sheet: preview card, row of app targets, "copy link", cancel. Extra targets (e.g. save PDF) via targets.

## Example

```tsx
const { share, sheetProps } = useShareSheet()
<Button onClick={() => share({ title, url })}>ແບ່ງປັນ</Button>
<ShareSheet {...sheetProps} targets={[pdfTarget]} />
```
