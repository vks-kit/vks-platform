import * as React from "react"
import { ContactActions, WhatsAppIcon, ShareImageDialog, fitText, loadFonts, loadImage, SlotPicker, halfHours, RangeInline, DateInput, parseDmy, fmtDmy, ageOn, dobError, Button, Field, whatsappUrl, telUrl, laMobileDigits, todayISO, addDays, type Range } from "@vks-kit/ui"
import type { Doc } from "./types"

const TIMES = [...halfHours("08:00", "11:30"), ...halfHours("13:00", "16:30")]
function Slots() {
  const [v, setV] = React.useState({ d: "", t: "" })
  const t = todayISO()
  return <div className="w-full"><SlotPicker date={v.d} time={v.t} onChange={(d, tm) => setV({ d, t: tm })} times={TIMES} dayCounts={{ [addDays(t, 1)]: 3 }} timeCounts={{ [addDays(t, 1)]: { "09:00": 2 } }} hint="08:00–11:30 ແລະ 13:00–16:30 · ຕົວເລກ = ນັດທີ່ມີແລ້ວ" /></div>
}
function Range1() { const [r, setR] = React.useState<Range>({}); const t = todayISO(); return <div className="w-full max-w-sm"><RangeInline value={r} onChange={setR} allLabel="ທຸກວັນທີ" presets={[["ມື້ນີ້", { from: t, to: t }], ["7 ມື້ຜ່ານມາ", { from: addDays(t, -6), to: t }]]} /></div> }
function Dob() { const [v, setV] = React.useState<string | null>(null), [txt, setTxt] = React.useState(""); const t = todayISO(); const err = dobError(v, txt, t); return <div className="w-full max-w-xs"><Field label="ວັນເດືອນປີເກີດ" error={err}><DateInput value={v} onChange={setV} onText={setTxt} today={t} invalid={!!err} /></Field></div> }
function Share() {
  const [open, setOpen] = React.useState(false)
  const draw = React.useCallback(async (cv: HTMLCanvasElement) => {
    const F = '"Noto Sans Lao Variable", "Noto Sans Lao", sans-serif'
    await loadFonts(F)
    cv.width = 1080; cv.height = 1384
    const x = cv.getContext("2d"); if (!x) return
    const css = getComputedStyle(document.documentElement)
    x.fillStyle = css.getPropertyValue("--primary").trim() || "midnightblue"; x.fillRect(0, 0, 1080, 1384)
    x.fillStyle = css.getPropertyValue("--gold").trim() || "goldenrod"; x.textAlign = "center"
    const [t, sz] = fitText(x, "ໃບນັດສຳພາດ · ຕົວຢ່າງ", 800, 90, 960, F); x.font = "800 " + sz + "px " + F; x.fillText(t, 540, 692)
  }, [])
  return <><Button onClick={() => setOpen(true)}>ເປີດ ຮູບ ສົ່ງ</Button><ShareImageDialog open={open} onOpenChange={setOpen} title="ໃບນັດ · ຕົວຢ່າງ" fileName="VKS_example.png" ratio={1080 / 1384} draw={draw} note="ສ້າງ ຈາກ ຂໍ້ມູນ ທຸກຄັ້ງ ທີ່ເປີດ" /></>
}
void loadImage; void parseDmy; void fmtDmy; void ageOn; void whatsappUrl; void telUrl; void laMobileDigits

export const kit061Docs: Doc[] = [
  {
    slug: "contact-actions", name: "Contact actions", group: "Actions", badge: "New",
    desc: "Round WhatsApp (real logo, green) and call buttons next to a phone number. WhatsApp only for a Lao mobile (020 / 030), never a landline; nothing for a do-not-call person. A click never opens the row.",
    file: "packages/ui/src/components/contact.tsx", importLine: 'import { ContactActions, WhatsAppIcon, whatsappUrl, telUrl, laMobileDigits } from "@vks-kit/ui"',
    demo: () => <><ContactActions phone="2055123456" call /><ContactActions phone="020 9923 4291" size="sm" /><ContactActions phone="021 212345" call /><span className="inline-flex size-11 items-center justify-center rounded-full bg-muted text-success"><WhatsAppIcon className="size-5" /></span></>,
    code: `// list row: WhatsApp beside the row's call button
<ContactActions phone={a.tel} blocked={a.do_not_call} size="sm" />
// record: WhatsApp + call
<ContactActions phone={p.phone} call />
// just the link
whatsappUrl("020 5512 3456") // "https://wa.me/8562055123456"`,
    props: [
      { name: "phone", type: "string | number", desc: "As stored or typed: 2055123456, \"020 5512 3456\", \"+856 20 …\"." },
      { name: "whatsapp / call", type: "boolean", def: "true / false", desc: "Which buttons. WhatsApp is skipped for a landline." },
      { name: "blocked", type: "boolean", desc: "Do-not-contact: renders nothing." },
      { name: "size", type: '"sm" | "md"', def: '"md"', desc: "sm 36 px (dense desktop table), md 44 px (phone, cards)." },
    ],
    notes: ["Opens https://wa.me/856<number> in a new tab: the WhatsApp app on a phone, WhatsApp Web / Desktop on a computer. The person's number does not need to be saved first.", "laMobileDigits / whatsappUrl / telUrl are pure and unit tested."],
  },
  {
    slug: "share-image", name: "Share image", group: "Overlays", badge: "New",
    desc: "A picture people send on (receipt, client card, certificate): you draw it on a canvas, the popup shows it sized to the screen with no scrolling and gives Download + copy + share, or Save + Send on WhatsApp on a phone.",
    file: "packages/ui/src/components/share-image.tsx", importLine: 'import { ShareImageDialog, fitText, loadFonts, loadImage } from "@vks-kit/ui"',
    demo: () => <Share />,
    code: `const draw = useCallback(async (cv: HTMLCanvasElement) => {
  await loadFonts(FONT)
  const logo = await loadImage(LOGO)
  cv.width = 1080; cv.height = 1384
  const x = cv.getContext("2d")!
  const [name, size] = fitText(x, applicant.name, 700, 66, 900, FONT)
  …
}, [applicant])
<ShareImageDialog open={open} onOpenChange={setOpen} title={"ໃບນັດ · " + name}
  fileName={"VKS_ໃບນັດ_" + code + ".png"} ratio={1080 / 1384} draw={draw} />`,
    props: [
      { name: "draw", type: "(canvas) => void | Promise", desc: "Set canvas.width / height and draw. Use tokens from getComputedStyle for colours." },
      { name: "ratio", type: "number", desc: "Picture width / height. The popup width follows the screen height from it." },
      { name: "fileName / title / description / note", type: "string / ReactNode", desc: "" },
      { name: "sendLabel / maxWidth", type: "string", def: '"ສົ່ງ WhatsApp" / "38rem"', desc: "" },
    ],
    notes: ["Desktop footer: copy and share as IconButtons, Download as the one labelled button. Copy puts a PNG on the clipboard: paste it into WhatsApp Web with Ctrl+V.", "fitText shrinks then cuts a line with …; loadFonts waits for Lao weights so the first draw is not in boxes; loadImage resolves null instead of failing."],
  },
  {
    slug: "slot-picker", name: "Slot picker", group: "Dates", badge: "New",
    desc: "Book a day and a time in one place, shown in the form (never a popup on a popup): calendar with a dot on booked days, time slots with a count. Wide forms show the times in 2 rows of 8.",
    file: "packages/ui/src/components/slot-picker.tsx", importLine: 'import { SlotPicker, halfHours } from "@vks-kit/ui"',
    demo: () => <Slots />,
    code: `const TIMES = [...halfHours("08:00", "11:30"), ...halfHours("13:00", "16:30")]
<SlotPicker date={date} time={time} onChange={(d, t) => { setDate(d); setTime(t) }}
  times={TIMES} isOpenDay={isInterviewDay} dayCounts={slots.days} timeCounts={slots.times} />`,
    props: [
      { name: "times", type: "string[]", desc: "Bookable starts (HH:MM)." },
      { name: "isOpenDay", type: "(iso) => boolean", desc: "false = closed day (greyed). Default every day open." },
      { name: "dayCounts / timeCounts", type: "Record", desc: "Bookings per day (dot) and per day + time (number)." },
      { name: "min / hint", type: "string / ReactNode", desc: "First bookable day (default today); one muted line under the times." },
    ],
  },
  {
    slug: "date-inline", name: "Date in place", group: "Dates", badge: "New",
    desc: "RangeInline: a date range picked inside an open sheet (quick ranges + one month), so no second sheet opens. DateInput: a birth date typed as dd/mm/yyyy or picked year → month → day.",
    file: "packages/ui/src/components/date-inline.tsx", importLine: 'import { RangeInline, DateInput, parseDmy, fmtDmy, ageOn, dobError } from "@vks-kit/ui"',
    demo: () => <div className="grid w-full gap-6 md:grid-cols-2"><Range1 /><Dob /></div>,
    code: `// phone filter sheet
<Field label="ຊ່ວງວັນທີ"><RangeInline value={range} onChange={setRange} presets={presets} allLabel="ທຸກວັນທີ" /></Field>
// birth date
const err = dobError(dob, text, today, 16)
<Field label="ວັນເດືອນປີເກີດ" error={err}><DateInput value={dob} onChange={setDob} onText={setText} today={today} minAge={16} invalid={!!err} /></Field>`,
    props: [
      { name: "RangeInline presets / allLabel", type: "[label, Range][] / string", desc: "Quick ranges; allLabel adds a clear-all pill." },
      { name: "DateInput today / minAge", type: "string / number", def: "— / 16", desc: "The picker's latest year makes the person minAge." },
      { name: "dobError(iso, text, today, minAge?)", type: "string | null", desc: "Lao message for a wrong format, a future date or too young." },
    ],
    notes: ["A segmented choice with a name is ToggleGroup variant=\"segmented\" aria-label=\"…\" className=\"w-full\" (no extra part needed)."],
  },
]
