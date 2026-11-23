# Incident escalation card

> One open incident in the call center or duty room: P1 / P2 / P3, place, reporter with call + WhatsApp, a live SLA countdown that turns amber then red, and one dispatch button.

- Group: Feedback · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/incident-card

```ts
import { IncidentEscalationCard, slaLeft, type IncidentPriority } from "@vks-kit/ui"
```

## When to use

- **IncidentEscalationCard**: Use for one open incident or alarm in the call center / duty room: priority, where, who reported it (call or WhatsApp in one tap), a live SLA countdown that turns red when overdue, and one dispatch button. For a yes/no request use ApprovalCard; for a passing message use toast or Alert instead.

## Example

```tsx
<IncidentEscalationCard code={inc.code} priority={inc.p} title={inc.title} location={inc.site}
  reporter={inc.by} reporterPhone={inc.tel} openedAt={inc.openedAt} slaMinutes={15}
  status={inc.statusText} dispatchLabel="ສັ່ງການໜ່ວຍ Patrol-02" onDispatch={() => dispatch(inc.id)} />
```

### Overdue and resolved

```tsx
<IncidentEscalationCard priority="P2" openedAt={t} slaMinutes={15} />
<IncidentEscalationCard resolved … />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| priority | "P1" \| "P2" \| "P3" | "P2" | P1 = red bar, pulsing badge, red dispatch button. |
| openedAt / slaMinutes | number / number | — / 15 | Countdown in mm:ss; amber below a third left, red and negative once overdue. |
| reporterPhone | string \| number |  | Shows ContactActions (WhatsApp for 020 / 030, plus call). |
| resolved | boolean |  | Stops the timer and hides the button. |
| now | number |  | Fixed clock for tests and screenshots. |

## Notes

- The timer ticks once a second and stops when resolved or unmounted.
- slaLeft() is pure and unit tested.
