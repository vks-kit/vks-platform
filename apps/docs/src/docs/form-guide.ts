/**
 * "Form pattern" guide: validation, inline errors, submit states, 16 px inputs, Lao labels.
 * Docs only. Pure data, so the docs page and the AI catalogue (npm run ai:index) print the same words.
 */
export type FormRule = { id: string; title: string; rule: string; how: string }

export const FORM_INTRO =
  "A VKS form asks only what it needs, says what is wrong next to the field, and never loses what the user typed."

export const FORM_RULES: FormRule[] = [
  { id: "labels", title: "Every field has a visible Lao label", rule: "Label above the field, not a placeholder. Placeholders vanish while typing. Mark optional fields, not required ones.", how: "<Label htmlFor> + Input id. Lao line-height ≥ 1.5 (leading-normal or more)." },
  { id: "16px", title: "16 px inputs, 44 px tall", rule: "Text under 16 px makes iOS zoom the page. Every tap target is at least 44 px.", how: "Input, Textarea, Select and Combobox already use text-base and h-11. Do not override them smaller." },
  { id: "when", title: "Check on blur, then on every change", rule: "Do not shout while the user is still typing the first time. After the first blur or submit, re-check as they type so the error goes away the moment it is fixed.", how: "Keep a touched flag per field; show the error when touched or after a submit." },
  { id: "inline", title: "Errors sit under the field", rule: "One short line, red, under the field it belongs to. Say what to do, not what went wrong (\"ໃສ່ເບີ 8 ຕົວເລກ\", not \"invalid\").", how: "Input invalid + a <p id> linked with aria-describedby. Put the same text in aria-live so screen readers hear it." },
  { id: "first-error", title: "Submit jumps to the first error", rule: "If submit fails, focus the first wrong field and scroll it into view. A top summary is only for long forms.", how: "On submit: validate all, mark all touched, focus the first invalid ref." },
  { id: "submit", title: "One submit button with four states", rule: "Idle, sending (spinner, disabled), done (toast, then move on), failed (toast with the reason, form kept). Never submit twice.", how: "Button loading while the promise runs; toast.success / toast.error after." },
  { id: "keep", title: "Never lose what was typed", rule: "A failed send keeps every field. Offline sends go to the queue and show in SyncStatus.", how: "OfflineQueue from @vks-kit/core + SyncStatus. Keep drafts in state until the server says ok." },
  { id: "clean", title: "Clean free text before saving", rule: "Names and notes go through cleanText() (trims, removes zero-width characters, caps length). Compare names with normalizeLao().", how: "import { cleanText, normalizeLao } from \"@vks-kit/types\"." },
  { id: "phone", title: "Long forms on a phone are a Wizard", rule: "More than about 6 fields on a phone: split into steps, one topic per step. Next is disabled until the step is valid.", how: "Wizard with step-level validation; the right keyboard via inputMode (numeric, tel)." },
]

export const FORM_STATES: [string, string, string][] = [
  ["Untouched", "Label + empty field. No error yet.", "Input"],
  ["Invalid", "Red border, one line under the field, field shakes once.", "Input invalid + <p>"],
  ["Sending", "Button spinner, all buttons disabled.", "Button loading"],
  ["Saved", "Green toast, then close or move on.", "toast.success"],
  ["Failed", "Red toast with the reason; fields kept; button active again.", "toast.error"],
  ["Offline", "Saved to the queue; SyncStatus shows pending N.", "SyncStatus"],
]

export const FORM_CHECKLIST: string[] = [
  "Every field has a visible Lao label linked with htmlFor.",
  "No input text is under 16 px; every button is at least 44 px tall.",
  "Errors appear under the field, in plain words, and go away when fixed.",
  "Submit shows a spinner and cannot be pressed twice.",
  "A failed or offline send keeps what the user typed.",
  "Free text goes through cleanText() before it is saved.",
  "At 360 px the form is one column with one primary button.",
]

/** Markdown for the AI catalogue (docs/ai/forms.md). */
export function formsMd(): string {
  const out = [FORM_INTRO, "", "## Rules", ""]
  FORM_RULES.forEach((r, i) => out.push(`${i + 1}. **${r.title}.** ${r.rule} *How:* ${r.how}`))
  out.push("", "## Submit and field states", "", "| State | What the user sees | Part |", "| --- | --- | --- |")
  for (const [a, b, c] of FORM_STATES) out.push(`| ${a} | ${b} | ${c} |`)
  out.push("", "## Checklist before you call a form done", "")
  for (const c of FORM_CHECKLIST) out.push(`- [ ] ${c}`)
  out.push("", "Parts: Label, Input (invalid), Textarea, Select, Combobox, DatePicker, Button (loading), toast, Wizard, SyncStatus.")
  return out.join("\n")
}
