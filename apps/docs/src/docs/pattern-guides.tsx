import * as React from "react"
import { Button, Input, Label, toast } from "@vks-kit/ui"
import { H2, P, useT, useTr } from "./kit"
import { REPORT_ASSUMPTIONS, REPORT_CHECKLIST, REPORT_FORMATS, REPORT_INTRO, REPORT_PARTS, type Row } from "./reports-guide"
import { FORM_CHECKLIST, FORM_INTRO, FORM_RULES, FORM_STATES } from "./form-guide"

function RowTable({ rows, head }: { rows: Row[]; head: [string, string] }) {
  const tr = useTr()
  return <div className="overflow-hidden rounded-xl border text-sm">
    <div className="grid grid-cols-[8rem_1fr] bg-muted px-4 py-2 font-semibold"><span>{tr(head[0])}</span><span>{tr(head[1])}</span></div>
    {rows.map((r, i) => <div key={i} className="grid grid-cols-[8rem_1fr] gap-2 border-t px-4 py-2.5 leading-relaxed"><b>{tr(r.part)}</b><span>{tr(r.rule)}</span></div>)}
  </div>
}
function Checks({ items }: { items: string[] }) {
  const tr = useTr()
  return <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">{items.map((c) => <li key={c}>{tr(c)}</li>)}</ul>
}

/** Reports guide page (docs only, no component). */
export function ReportsGuide() {
  const t = useT(), tr = useTr()
  return <div className="space-y-6">
    <P>{tr(REPORT_INTRO)}</P>
    <H2 id="layout">{t("ໂຄງຮ່າງ (ຕາມລຳດັບນີ້)", "Layout (in this order)")}</H2>
    <RowTable rows={REPORT_PARTS} head={["Part", "Rule"]} />
    <H2 id="fonts">{t("ຟອນລາວ ແລະ ຮູບແບບໄຟລ໌", "Lao fonts and formats")}</H2>
    <RowTable rows={REPORT_FORMATS} head={["Format", "Rule"]} />
    <H2 id="assumptions">{t("ຂໍ້ສົມມຸດທີ່ຕ້ອງຢືນຢັນ", "Assumptions to confirm")}</H2>
    <RowTable rows={REPORT_ASSUMPTIONS} head={["What", "Value used now and how it is confirmed"]} />
    <H2 id="checklist">{t("ກວດກ່ອນສົ່ງລາຍງານ", "Checklist before you send a report")}</H2>
    <Checks items={REPORT_CHECKLIST} />
  </div>
}

function FormDemo() {
  const t = useT()
  const [phone, setPhone] = React.useState(""), [touched, setTouched] = React.useState(false), [busy, setBusy] = React.useState(false)
  const ref = React.useRef<HTMLInputElement>(null)
  const err = /^\d{8}$/.test(phone.replace(/\s/g, "")) ? null : t("ໃສ່ເບີໂທ 8 ຕົວເລກ", "Enter an 8-digit phone number")
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setTouched(true)
    if (err) { ref.current?.focus(); return }
    setBusy(true); await new Promise((r) => setTimeout(r, 800)); setBusy(false)
    toast.success(t("ບັນທຶກແລ້ວ", "Saved"))
  }
  const show = touched && err
  return <form onSubmit={submit} noValidate className="grid max-w-sm gap-2 rounded-xl border bg-card p-4">
    <Label htmlFor="fp-phone">{t("ເບີໂທ", "Phone")}</Label>
    <Input id="fp-phone" ref={ref} inputMode="tel" value={phone} invalid={!!show} aria-describedby="fp-phone-msg" onBlur={() => setTouched(true)} onChange={(e) => setPhone(e.target.value)} />
    <p id="fp-phone-msg" aria-live="polite" className={"min-h-5 text-xs leading-normal " + (show ? "text-destructive" : "text-muted-foreground")}>{show ? err : t("ຕົວຢ່າງ: 20 12 34 56", "Example: 20 12 34 56")}</p>
    <Button type="submit" loading={busy}>{t("ບັນທຶກ", "Save")}</Button>
  </form>
}

/** Form pattern guide page. */
export function FormsGuide() {
  const t = useT(), tr = useTr()
  return <div className="space-y-6">
    <P>{tr(FORM_INTRO)}</P>
    <FormDemo />
    <H2 id="rules">{t("ກົດ", "Rules")}</H2>
    <div className="grid gap-2 md:grid-cols-2">{FORM_RULES.map((r, i) => <div key={r.id} className="rounded-xl border bg-card p-4">
      <div className="flex items-baseline gap-2"><span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span><b>{tr(r.title)}</b></div>
      <p className="mt-1 text-sm leading-relaxed">{tr(r.rule)}</p>
      <p className="mt-1 text-xs leading-normal text-muted-foreground">{tr(r.how)}</p>
    </div>)}</div>
    <H2 id="states">{t("ສະຖານະຂອງຟອມ", "Submit and field states")}</H2>
    <div className="overflow-hidden rounded-xl border text-sm">{FORM_STATES.map(([a, b, c]) => <div key={a} className="grid gap-2 border-t px-4 py-2.5 leading-relaxed first:border-0 md:grid-cols-[8rem_1fr_12rem]"><b>{tr(a)}</b><span>{tr(b)}</span><code className="text-xs text-muted-foreground">{c}</code></div>)}</div>
    <H2 id="checklist">{t("ກວດກ່ອນສົ່ງ", "Checklist before you ship")}</H2>
    <Checks items={FORM_CHECKLIST} />
  </div>
}
