# Wizard

> Multi-step form with a step bar. Long forms on a phone should always be a wizard.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/wizard.tsx`
- Live docs: #/docs/wizard

```ts
import { Wizard } from "@vks/ui"
```

## When to use

- **Wizard**: Step dots + current step content + Back/Next. Controlled: you own "step". The connector fills as you advance, the current dot pops with a halo, done dots turn into a drawn tick, and the content slides in from the side you are moving towards.

## Example

```tsx
<Wizard steps={["ຂໍ້ມູນ", "ຮູບ", "ຢືນຢັນ"]} step={step} onStep={setStep} onFinish={submit}
  canNext={valid} finishLabel="ສົ່ງ" nextLabel="ຕໍ່ໄປ" backLabel="ກັບຄືນ">
  {step === 0 && <InfoStep />}
</Wizard>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| steps | string[] |  |  |
| step / onStep | number / (i) => void |  | 0-based. |
| onFinish | () => void |  |  |
| canNext | boolean | true | Disable Next until the step is valid. |
| finishLabel / nextLabel / backLabel | string | "Done" / "Next" / "Back" |  |
