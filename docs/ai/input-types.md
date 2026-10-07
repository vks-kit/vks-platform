# Input types

> The standard fields: text, phone (020 XXXX XXXX), money, time, number. Same 44 px / 16 px shell as Input, right keyboard on phones.

- Group: Form · New
- Source: `packages/ui/src/components/fields.tsx`
- Live docs: #/docs/input-types

```ts
import { TextInput, PhoneInput, MoneyInput, TimeInput, NumberInput, isPhoneLa, phoneLaE164 } from "@vks-kit/ui"
```

## When to use

- **TextInput**: Use for a free-text one-liner that needs a clear (x) button and/or a character counter (names, codes, notes); the value is cleaned with cleanText() by you before saving. For a plain field use Input; for several lines use Textarea; for phone, money, time or numbers use PhoneInput, MoneyInput, TimeInput, NumberInput instead.
- **PhoneInput**: Use for any Lao mobile number: "020" is fixed in front, the person types only 8 digits and they group as 020 XXXX XXXX (hard limit, pastes like +856 20… or 020… are cleaned). The value is "020 XXXX XXXX" (or "" when empty); check completeness with isPhoneLa(). For other text use TextInput or Input; for a code use OtpInput instead.
- **MoneyInput**: Use for any amount of money: thousands commas while typing, digits only, LAK has no decimals, THB / USD allow 2; the unit (ກີບ / ບາດ / ໂດລາ) sits inside the field. onChange gives the number (null when empty). For a plain count use NumberInput; to only show an amount use fmtKip().
- **TimeInput**: Use for a time of day in 24 h (shift start, check-in time): type 0905 and it becomes 09:05, ↑ ↓ (or the − + buttons) step by `step` minutes, and "ຕອນນີ້" fills the current time. The value is "HH:mm" or "" while incomplete. For a date use DatePicker; for a duration use NumberInput.
- **NumberInput**: Use for a plain quantity (guards on a shift, days, kilometres) when you want a typed number with min / max / decimals and an optional unit. It clamps on blur and ↑ ↓ step it. For +/- only with small ranges use Stepper; for money use MoneyInput.

## Example

```tsx
const [phone, setPhone] = useState("")
<PhoneInput value={phone} onChange={setPhone} invalid={!!phone && !isPhoneLa(phone)} />   // "020 5512 3456"
phoneLaE164(phone)                                                                     // "+8562055123456"

<MoneyInput value={salary} onChange={setSalary} />                  // number | null, 1,500,000 ກີບ
<MoneyInput value={p} onChange={setP} currency="THB" max={99999} /> // 2 decimals
<TimeInput value={t} onChange={setT} step={5} />                    // "08:30", ↑↓ ± step, ຕອນນີ້
<NumberInput value={n} onChange={setN} min={1} max={20} unit="ຄົນ" />
<TextInput value={s} onChange={setS} maxLength={30} />              // clear button + counter
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| PhoneInput value / onChange | (v: string, info: { digits; complete }) => void |  | Value is "020 XXXX XXXX" or "". 020 is locked; max 8 more digits. Pastes like +856 20…, 020…, 20… are cleaned. |
| MoneyInput value / onChange | number \| null |  | Commas while typing. currency: LAK (no decimals) \| THB \| USD (2). max clamps. |
| TimeInput value / step | "HH:mm" \| "" |  | 24 h. Type 0905 → 09:05. Value is "" until valid. step defaults to 5 min. |
| NumberInput min / max / step / decimals / unit | number \| null |  | Clamps on blur, ↑ ↓ and − + buttons step. |
| invalid | boolean |  | Red border + shake, like Input. |

## Notes

- Phones open the right keyboard: tel / numeric / decimal. Fonts are 16 px so iOS never zooms.
- Validate with isPhoneLa(); send phoneLaE164() to SMS / WhatsApp APIs.
- For free text, run cleanText() from @vks-kit/types before saving.
