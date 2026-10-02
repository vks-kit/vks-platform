# Step progress

> Compact 'Step 2 of 4' bar for long phone forms where the full wizard header won't fit.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/wizard.tsx`
- Live docs: #/docs/step-progress

```ts
import { StepProgress } from "@vks-kit/ui"
```

## When to use

- **StepProgress**: Thin progress for long single-page forms or uploads: "Step 2 of 5" + filling bar.

## Example

```tsx
<StepProgress step={1} total={4} label="ລາຍງານເຫດການ" />
```
