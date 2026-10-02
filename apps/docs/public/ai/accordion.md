# Accordion

> FAQ and long forms broken into parts.

- Group: Data display · Stable
- Source: `packages/ui/src/components/data-display.tsx`
- Live docs: #/docs/accordion

```ts
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@vks-kit/ui"
```

## When to use

- **Accordion**: Use for collapsible sections such as FAQs or grouped settings (Radix Accordion root; pass type="single" or "multiple"). For switching between peer views use Tabs instead; for a nested hierarchy use TreeView instead.
- **AccordionItem**: Use for one collapsible section inside Accordion (needs a unique value). For a static divider between items use Separator instead.
- **AccordionTrigger**: Use for the tappable header row of an AccordionItem (chevron rotates). For a plain heading that never collapses use CardTitle instead.
- **AccordionContent**: Use for the body that expands under an AccordionTrigger. For content in a popup use Popover or Sheet instead.

## Example

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>ລືມລະຫັດຜ່ານເຮັດແນວໃດ?</AccordionTrigger>
    <AccordionContent>ຕິດຕໍ່ຫົວໜ້າກະ ຫຼື HR.</AccordionContent>
  </AccordionItem>
</Accordion>
```
