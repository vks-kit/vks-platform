# Form pattern

> Lao labels, 16 px inputs, errors under the field, one submit button with four states, never lose what was typed.

- Group: Getting Started
- Live docs: #/docs/forms

A VKS form asks only what it needs, says what is wrong next to the field, and never loses what the user typed.

## Rules

1. **Every field has a visible Lao label.** Label above the field, not a placeholder. Placeholders vanish while typing. Mark optional fields, not required ones. *How:* <Label htmlFor> + Input id. Lao line-height ≥ 1.5 (leading-normal or more).
2. **16 px inputs, 44 px tall.** Text under 16 px makes iOS zoom the page. Every tap target is at least 44 px. *How:* Input, Textarea, Select and Combobox already use text-base and h-11. Do not override them smaller.
3. **Check on blur, then on every change.** Do not shout while the user is still typing the first time. After the first blur or submit, re-check as they type so the error goes away the moment it is fixed. *How:* Keep a touched flag per field; show the error when touched or after a submit.
4. **Errors sit under the field.** One short line, red, under the field it belongs to. Say what to do, not what went wrong ("ໃສ່ເບີ 8 ຕົວເລກ", not "invalid"). *How:* Input invalid + a <p id> linked with aria-describedby. Put the same text in aria-live so screen readers hear it.
5. **Submit jumps to the first error.** If submit fails, focus the first wrong field and scroll it into view. A top summary is only for long forms. *How:* On submit: validate all, mark all touched, focus the first invalid ref.
6. **One submit button with four states.** Idle, sending (spinner, disabled), done (toast, then move on), failed (toast with the reason, form kept). Never submit twice. *How:* Button loading while the promise runs; toast.success / toast.error after.
7. **Never lose what was typed.** A failed send keeps every field. Offline sends go to the queue and show in SyncStatus. *How:* OfflineQueue from @vks-kit/core + SyncStatus. Keep drafts in state until the server says ok.
8. **Clean free text before saving.** Names and notes go through cleanText() (trims, removes zero-width characters, caps length). Compare names with normalizeLao(). *How:* import { cleanText, normalizeLao } from "@vks-kit/types".
9. **Long forms on a phone are a Wizard.** More than about 6 fields on a phone: split into steps, one topic per step. Next is disabled until the step is valid. *How:* Wizard with step-level validation; the right keyboard via inputMode (numeric, tel).

## Submit and field states

| State | What the user sees | Part |
| --- | --- | --- |
| Untouched | Label + empty field. No error yet. | Input |
| Invalid | Red border, one line under the field, field shakes once. | Input invalid + <p> |
| Sending | Button spinner, all buttons disabled. | Button loading |
| Saved | Green toast, then close or move on. | toast.success |
| Failed | Red toast with the reason; fields kept; button active again. | toast.error |
| Offline | Saved to the queue; SyncStatus shows pending N. | SyncStatus |

## Checklist before you call a form done

- [ ] Every field has a visible Lao label linked with htmlFor.
- [ ] No input text is under 16 px; every button is at least 44 px tall.
- [ ] Errors appear under the field, in plain words, and go away when fixed.
- [ ] Submit shows a spinner and cannot be pressed twice.
- [ ] A failed or offline send keeps what the user typed.
- [ ] Free text goes through cleanText() before it is saved.
- [ ] At 360 px the form is one column with one primary button.

Parts: Label, Input (invalid), Textarea, Select, Combobox, DatePicker, Button (loading), toast, Wizard, SyncStatus.
