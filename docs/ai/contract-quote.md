# Contract quote summary

> Guard-service price quote: one row per line with a − / + count, then subtotal, discount, VAT 10 % and total in Kip, tabular digits. Read-only without onChange (print, client report).

- Group: Form · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/contract-quote

```ts
import { ContractQuoteSummary, quoteTotals, type QuoteLine } from "@vks-kit/ui"
```

## When to use

- **ContractQuoteSummary**: Use for a guard-service price quote (marketing, client report, printed offer): one row per line with a − / + count, then subtotal, discount, VAT and the total in Kip, all tabular so digits line up. For one money field use MoneyInput; for a list of many records use DataTable instead.

## Example

```tsx
const [lines, setLines] = useState<QuoteLine[]>([
  { id: "g", label: "ພະນັກງານຍາມ 12 ຊົ່ວໂມງ", qty: 10, unitPrice: 8_000_000, unit: "ນາຍ", min: 1 },
])
<ContractQuoteSummary title="ໃບສະເໜີລາຄາ" lines={lines} onChange={setLines} vatRate={0.1} />
quoteTotals(lines)   // { subtotal: 80000000, discount: 0, base: 80000000, vat: 8000000, total: 88000000 }
```

### Kip amount and Lao phone fields (already in the kit)

The audit's CurrencyKipInput and LaoPhoneInput are MoneyInput and PhoneInput: thousands commas + ກີບ, and 020 XXXX XXXX.

```tsx
<MoneyInput value={fee} onChange={setFee} />            // LAK, commas, ກີບ
<PhoneInput value={tel} onChange={setTel} />            // 020 XXXX XXXX
```

### Read-only with a discount

```tsx
<ContractQuoteSummary lines={lines} discount={2_000_000} period="" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| lines | QuoteLine[] |  | { id, label, qty, unitPrice (Kip), unit?, min?, max? }. |
| onChange | (lines) => void |  | Shows a Stepper per line. Omit for read-only. |
| vatRate / discount | number / number | 0.1 / 0 | Discount is taken off before VAT and never exceeds the subtotal. |
| period | string | "ເດືອນ" | After the total; "" hides it. |

## Notes

- quoteTotals() rounds to whole Kip and is unit tested.
- Amounts use fmtKip ("80,000,000 ກີບ"), never the ₭ glyph.
