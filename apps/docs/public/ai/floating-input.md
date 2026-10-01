# Floating & password input

> Label floats up on focus; password has an animated show/hide eye.

- Group: Form · New
- Source: `packages/ui/src/components/extras.tsx`
- Live docs: #/docs/floating-input

```ts
import { FloatingInput, PasswordInput } from "@vks/ui"
```

## When to use

- **FloatingInput**: Input whose label sits inside and floats up on focus / when filled (iOS / Material style). 56 px tall.
- **PasswordInput**: Password with show/hide eye. The eye swaps with a quick scale so it doesn't just blink.

## Example

```tsx
<FloatingInput label="ລະຫັດພະນັກງານ" />
<PasswordInput placeholder="ລະຫັດຜ່ານ" />
```
