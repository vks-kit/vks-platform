import * as React from "react"
import { Clock, Minus, Plus, X } from "lucide-react"
import { cn } from "../lib/cn"
import {
  CURRENCY_DECIMALS, CURRENCY_LABEL, caretAfter, clampNum, digitsOnly, fmtMoneyText, fmtPhoneLa, fmtPhoneLaFull, moneyNum, nowTime, normTime,
  numFromText, pad2, parseMoney, parseNumberText, parsePhoneLa, roundTo, stepTime, type Currency,
} from "../lib/field-format"

const shell = "vks-field flex h-11 w-full items-center rounded-lg border border-input bg-card text-foreground focus-within:border-ring aria-[invalid=true]:border-destructive aria-[invalid=true]:vks-shake has-[input:disabled]:opacity-50"
const bare = "h-full min-w-0 flex-1 bg-transparent px-3 text-base placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
const addon = "flex h-full shrink-0 items-center px-3 text-sm font-semibold text-muted-foreground select-none"

/** Keep the caret after the same digit once the text has been re-formatted (otherwise it jumps to the end). */
function useCaret(ref: React.RefObject<HTMLInputElement | null>) {
  const pending = React.useRef<number | null>(null)
  React.useLayoutEffect(() => { if (pending.current != null && ref.current && document.activeElement === ref.current) ref.current.setSelectionRange(pending.current, pending.current); pending.current = null })
  return (typed: string, caret: number | null, shown: string, sig: RegExp) => { pending.current = caretAfter(typed.slice(0, caret ?? typed.length), shown, sig) }
}

type FieldBase = { invalid?: boolean; disabled?: boolean; className?: string; id?: string; name?: string; autoFocus?: boolean; "aria-label"?: string; onBlur?: React.FocusEventHandler<HTMLInputElement> }

/** Use for a free-text one-liner that needs a clear (x) button and/or a character counter (names, codes, notes); the value is cleaned with cleanText() by you before saving. For a plain field use Input; for several lines use Textarea; for phone, money, time or numbers use PhoneInput, MoneyInput, TimeInput, NumberInput instead. */
export function TextInput({ value, onChange, maxLength, clearable = true, placeholder, className, invalid, ...p }: FieldBase & { value: string; onChange: (v: string) => void; maxLength?: number; clearable?: boolean; placeholder?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; autoComplete?: string }) {
  const ref = React.useRef<HTMLInputElement>(null)
  return (
    <div className={cn("grid gap-1", className)}>
      <div className={shell} aria-invalid={invalid || undefined}>
        <input ref={ref} {...p} value={value} maxLength={maxLength} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={bare} />
        {clearable && value && !p.disabled && (
          <button type="button" aria-label="clear" onClick={() => { onChange(""); ref.current?.focus() }} className="vks-pop flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        )}
      </div>
      {maxLength ? <span className={cn("text-end text-xs tabular-nums", value.length >= maxLength ? "text-destructive" : "text-muted-foreground")}>{value.length} / {maxLength}</span> : null}
    </div>
  )
}

/** Use for any Lao mobile number: "020" is fixed in front, the person types only 8 digits and they group as 020 XXXX XXXX (hard limit, pastes like +856 20… or 020… are cleaned). The value is "020 XXXX XXXX" (or "" when empty); check completeness with isPhoneLa(). For other text use TextInput or Input; for a code use OtpInput instead. */
export function PhoneInput({ value, onChange, invalid, className, placeholder = "5512 3456", ...p }: FieldBase & { value: string; onChange: (v: string, info: { digits: string; complete: boolean }) => void; placeholder?: string }) {
  const ref = React.useRef<HTMLInputElement>(null)
  const keep = useCaret(ref)
  const digits = parsePhoneLa(value)
  const shown = fmtPhoneLa(digits)
  return (
    <div className={cn(shell, className)} aria-invalid={invalid || undefined}>
      <span className={cn(addon, "text-foreground")} aria-hidden>020</span>
      <input
        ref={ref} {...p} type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={placeholder} value={shown}
        aria-label={p["aria-label"] ?? "020 XXXX XXXX"} className={cn(bare, "pl-0 tabular-nums tracking-wide")}
        onChange={(e) => {
          const d = parsePhoneLa(e.target.value), s = fmtPhoneLa(d)
          keep(e.target.value, e.target.selectionStart, s, /\d/)
          onChange(fmtPhoneLaFull(d), { digits: d, complete: d.length === 8 })
        }}
        onKeyDown={(e) => { if (e.key === "Backspace" && !digits && e.currentTarget.selectionStart === 0) e.preventDefault() }}
      />
    </div>
  )
}

/** Use for any amount of money: thousands commas while typing, digits only, LAK has no decimals, THB / USD allow 2; the unit (ກີບ / ບາດ / ໂດລາ) sits inside the field. onChange gives the number (null when empty). For a plain count use NumberInput; to only show an amount use fmtKip(). */
export function MoneyInput({ value, onChange, currency = "LAK", max, invalid, className, placeholder = "0", ...p }: FieldBase & { value: number | null; onChange: (v: number | null) => void; currency?: Currency; max?: number; placeholder?: string }) {
  const dec = CURRENCY_DECIMALS[currency]
  const ref = React.useRef<HTMLInputElement>(null)
  const keep = useCaret(ref)
  const [text, setText] = React.useState(() => (value == null ? "" : fmtMoneyText(parseMoney(String(value), dec))))
  // follow outside changes (reset, load) but never fight the person typing
  React.useEffect(() => { if (moneyNum(text.replace(/,/g, "")) !== value) setText(value == null ? "" : fmtMoneyText(parseMoney(String(value), dec))) }, [value, dec]) // eslint-disable-line react-hooks/exhaustive-deps
  const shown = text
  return (
    <div className={cn(shell, className)} aria-invalid={invalid || undefined}>
      <input
        ref={ref} {...p} type="text" inputMode={dec ? "decimal" : "numeric"} placeholder={placeholder} value={shown}
        className={cn(bare, "text-end tabular-nums")}
        onChange={(e) => {
          let raw = parseMoney(e.target.value, dec)
          let n = moneyNum(raw)
          if (n != null && max != null && n > max) { raw = parseMoney(String(max), dec); n = max }
          const s = fmtMoneyText(raw)
          keep(e.target.value, e.target.selectionStart, s, /[\d.]/)
          setText(s); onChange(n)
        }}
        onBlur={(e) => { const raw = parseMoney(text.replace(/,/g, ""), dec); setText(raw.endsWith(".") ? fmtMoneyText(raw.slice(0, -1)) : fmtMoneyText(raw)); p.onBlur?.(e) }}
      />
      <span className={addon}>{CURRENCY_LABEL[currency]}</span>
    </div>
  )
}

/** Use for a time of day in 24 h (shift start, check-in time): type 0905 and it becomes 09:05, ↑ ↓ (or the − + buttons) step by `step` minutes, and "ຕອນນີ້" fills the current time. The value is "HH:mm" or "" while incomplete. For a date use DatePicker; for a duration use NumberInput. */
export function TimeInput({ value, onChange, step = 5, invalid, className, showNow = true, ...p }: FieldBase & { value: string; onChange: (v: string) => void; step?: number; showNow?: boolean }) {
  const [text, setText] = React.useState(value)
  React.useEffect(() => { if (normTime(text) !== value && !(value === "" && normTime(text) === "")) setText(value) }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  const set = (v: string) => { setText(v); onChange(normTime(v)) }
  const shift = (d: number) => set(stepTime(normTime(text) || nowTime(step), d))
  return (
    <div className={cn(shell, className)} aria-invalid={invalid || undefined}>
      <Clock className="ml-3 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input
        {...p} type="text" inputMode="numeric" autoComplete="off" placeholder="HH:mm" maxLength={5} value={text} aria-label={p["aria-label"] ?? "HH:mm"}
        className={cn(bare, "tabular-nums tracking-wider")}
        onChange={(e) => {
          const d = digitsOnly(e.target.value).slice(0, 4)
          const fixed = d.length >= 3 ? d.slice(0, 2) + ":" + d.slice(2) : (e.nativeEvent as InputEvent).inputType === "deleteContentBackward" ? d : d.length === 2 ? d + ":" : d
          set(fixed)
        }}
        onBlur={(e) => { const t = normTime(text); if (text && !t) { const d = digitsOnly(text); if (d.length <= 2 && d) { const n = Number(d); if (n < 24) return set(pad2(n) + ":00") } } p.onBlur?.(e) }}
        onKeyDown={(e) => { if (e.key === "ArrowUp") { e.preventDefault(); shift(step) } else if (e.key === "ArrowDown") { e.preventDefault(); shift(-step) } }}
      />
      <button type="button" aria-label={`-${step} min`} onClick={() => shift(-step)} className="flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-transform"><Minus className="size-4" /></button>
      <button type="button" aria-label={`+${step} min`} onClick={() => shift(step)} className="flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-transform"><Plus className="size-4" /></button>
      {showNow && <button type="button" onClick={() => set(nowTime(step))} className="h-full shrink-0 border-l border-input px-3 text-sm font-semibold text-primary hover:bg-muted rounded-r-lg">ຕອນນີ້</button>}
    </div>
  )
}

/** Use for a plain quantity (guards on a shift, days, kilometres) when you want a typed number with min / max / decimals and an optional unit. It clamps on blur and ↑ ↓ step it. For +/- only with small ranges use Stepper; for money use MoneyInput. */
export function NumberInput({ value, onChange, min, max, step = 1, decimals = 0, unit, invalid, className, placeholder, ...p }: FieldBase & { value: number | null; onChange: (v: number | null) => void; min?: number; max?: number; step?: number; decimals?: number; unit?: string; placeholder?: string }) {
  const [text, setText] = React.useState(value == null ? "" : String(value))
  React.useEffect(() => { if (numFromText(text) !== value) setText(value == null ? "" : String(value)) }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  const commit = (n: number | null) => { setText(n == null ? "" : String(n)); onChange(n) }
  const bump = (d: number) => commit(roundTo(clampNum((numFromText(text) ?? (min ?? 0) - (d > 0 ? d : 0) * 0) + d, min, max), decimals))
  return (
    <div className={cn(shell, className)} aria-invalid={invalid || undefined}>
      <button type="button" aria-label="-" disabled={p.disabled || (value != null && min != null && value <= min)} onClick={() => bump(-step)} className="flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 active:scale-90 transition-transform"><Minus className="size-4" /></button>
      <input
        {...p} type="text" inputMode={decimals ? "decimal" : (min ?? 0) < 0 ? "text" : "numeric"} placeholder={placeholder} value={text} className={cn(bare, "text-center tabular-nums")}
        onChange={(e) => { const s = parseNumberText(e.target.value, decimals, (min ?? -1) < 0); setText(s); onChange(numFromText(s)) }}
        onBlur={(e) => { const n = numFromText(text); if (n != null) commit(roundTo(clampNum(n, min, max), decimals)); else if (text !== "") commit(null); p.onBlur?.(e) }}
        onKeyDown={(e) => { if (e.key === "ArrowUp") { e.preventDefault(); bump(step) } else if (e.key === "ArrowDown") { e.preventDefault(); bump(-step) } }}
      />
      {unit && <span className={addon}>{unit}</span>}
      <button type="button" aria-label="+" disabled={p.disabled || (value != null && max != null && value >= max)} onClick={() => bump(step)} className="flex size-11 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 active:scale-90 transition-transform"><Plus className="size-4" /></button>
    </div>
  )
}
