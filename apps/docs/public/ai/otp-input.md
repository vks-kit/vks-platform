# OTP input

> One box per digit, numeric keyboard, pastes a whole code, shakes on error.

- Group: Form · New
- Source: `packages/ui/src/components/otp-input.tsx`
- Live docs: #/docs/otp-input

```ts
import { OtpInput } from "@vks-kit/ui"
```

## When to use

- **OtpInput**: N boxes, one hidden real input: keeps paste, autofill (one-time-code) and backspace working.

## Example

```tsx
<OtpInput value={code} onChange={setCode} onComplete={verify} error={wrong} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| length | number | 6 |  |
| value | string |  |  |
| onChange | (v: string) => void |  |  |
| onComplete | (v: string) => void |  | Fires when every box is filled. |
| error | boolean |  | Red + shake. |
| autoFocus | boolean |  |  |
