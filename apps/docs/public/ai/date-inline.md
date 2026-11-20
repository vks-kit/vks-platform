# Date in place

> RangeInline: a date range picked inside an open sheet (quick ranges + one month), so no second sheet opens. DateInput: a birth date typed as dd/mm/yyyy or picked year → month → day.

- Group: Dates · New
- Source: `packages/ui/src/components/date-inline.tsx`
- Live docs: #/docs/date-inline

```ts
import { RangeInline, DateInput, parseDmy, fmtDmy, ageOn, dobError } from "@vks-kit/ui"
```

## When to use

- **RangeInline**: Use for a date range chosen inside a sheet or panel that is already open (phone filter sheet): quick ranges, then a one-month calendar, all in place, so no second sheet opens on top. Every tap applies at once. For a range in a page control row use DateRangePicker.
- **DateInput**: Use for a birth date (or any date far in the past): type it as dd/mm/yyyy, or pick it with a picker that starts on the YEAR (12 at a time), then the month, then the day, instead of a calendar 300 clicks from 1999. The latest year offered makes the person minAge. Pair the typed text with dobError for the message. For near dates use DatePicker.

## Example

```tsx
// phone filter sheet
<Field label="ຊ່ວງວັນທີ"><RangeInline value={range} onChange={setRange} presets={presets} allLabel="ທຸກວັນທີ" /></Field>
// birth date
const err = dobError(dob, text, today, 16)
<Field label="ວັນເດືອນປີເກີດ" error={err}><DateInput value={dob} onChange={setDob} onText={setText} today={today} minAge={16} invalid={!!err} /></Field>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| RangeInline presets / allLabel | [label, Range][] / string |  | Quick ranges; allLabel adds a clear-all pill. |
| DateInput today / minAge | string / number | — / 16 | The picker's latest year makes the person minAge. |
| dobError(iso, text, today, minAge?) | string \| null |  | Lao message for a wrong format, a future date or too young. |

## Notes

- A segmented choice with a name is ToggleGroup variant="segmented" aria-label="…" className="w-full" (no extra part needed).
