import * as React from "react"
import { ScanLine, Trash2, Plus, ArrowRight, Bold, Italic, Underline, Flashlight, List, LayoutGrid, Map as MapIcon, Sun, Moon, Clock } from "@vks/ui/icons"
import { Button, Badge, Logo, LogoTile, BRAND, Toggle, ToggleGroup, ToggleGroupItem, toast } from "@vks/ui"
import type { Doc } from "./types"

export const actionDocs: Doc[] = [
  {
    slug: "button", name: "Button", group: "Actions", badge: "Stable",
    desc: "The one button. Layered fill, inner highlight, tinted lift shadow and a sheen on hover. Presses land on an iOS spring. h-11 (44 px) on every size.",
    file: "packages/ui/src/components/button.tsx", importLine: 'import { Button } from "@vks/ui"',
    demo: () => <><Button>ບັນທຶກ</Button><Button variant="action"><ScanLine />ສະແກນ</Button><Button variant="gold">Gold</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive"><Trash2 />ລຶບ</Button></>,
    code: `<Button>ບັນທຶກ</Button>
<Button variant="action"><ScanLine />ສະແກນ</Button>
<Button variant="gold">Gold</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive"><Trash2 />ລຶບ</Button>`,
    usage: `import { Button } from "@vks/ui"

export function Save() {
  return <Button onClick={save}>ບັນທຶກ</Button>
}`,
    examples: [
      { id: "sizes", title: "Sizes", note: "sm stays 44 px tall on phones and only shrinks on desktop.", demo: () => <><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button><Button size="icon" aria-label="add"><Plus /></Button></>,
        code: `<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="add"><Plus /></Button>` },
      { id: "as-child", title: "As a link", note: "asChild hands the styles to your own element (Radix Slot).", demo: () => <Button asChild variant="outline"><a href="#/docs/introduction">Read the intro <ArrowRight /></a></Button>,
        code: `<Button asChild variant="outline">
  <a href="/intro">Read the intro <ArrowRight /></a>
</Button>` },
      { id: "loading", title: "Loading", note: "loading keeps the width, shows a spinner and blocks double taps.", demo: () => { const [b, setB] = React.useState(false); return <Button variant="action" loading={b} onClick={() => { setB(true); setTimeout(() => { setB(false); toast.success("ບັນທຶກແລ້ວ") }, 1400) }}>ບັນທຶກ</Button> },
        code: `const [busy, setBusy] = React.useState(false)
<Button variant="action" loading={busy} onClick={save}>ບັນທຶກ</Button>` },
      { id: "disabled", title: "Disabled", demo: () => <><Button disabled>ບັນທຶກ</Button><Button variant="action" disabled>ສະແກນ</Button></>, code: `<Button disabled>ບັນທຶກ</Button>` },
    ],
    props: [
      { name: "variant", type: '"default" | "action" | "gold" | "outline" | "ghost" | "destructive"', def: '"default"', desc: "action = emerald, the main thing a guard does on the screen. Only one per screen." },
      { name: "size", type: '"default" | "sm" | "lg" | "icon"', def: '"default"', desc: "Every size is at least 44 px on a phone." },
      { name: "asChild", type: "boolean", def: "false", desc: "Render your own child element with the button styles." },
      { name: "loading", type: "boolean", def: "false", desc: "Spinner + disabled, width does not jump." },
      { name: "...props", type: 'React.ComponentProps<"button">', desc: "Anything a normal button takes." },
    ],
  },
  {
    slug: "badge", name: "Badge", group: "Actions", badge: "Stable",
    desc: "Small status pill. Tinted background + full-strength text so it passes contrast in both themes.",
    file: "packages/ui/src/components/badge.tsx", importLine: 'import { Badge } from "@vks/ui"',
    demo: () => <><Badge>ປົກກະຕິ</Badge><Badge variant="info">ໃໝ່</Badge><Badge variant="success" dot>ສຳເລັດ</Badge><Badge variant="danger" live>ສົດ</Badge><Badge variant="success">ສຳເລັດ</Badge><Badge variant="warning">ຊ້າ</Badge><Badge variant="danger">ພາດ</Badge><Badge variant="gold">VIP</Badge></>,
    code: `<Badge>ປົກກະຕິ</Badge>
<Badge variant="success">ສຳເລັດ</Badge>
<Badge variant="warning">ຊ້າ</Badge>
<Badge variant="danger">ພາດ</Badge>
<Badge variant="gold">VIP</Badge>
<Badge variant="info">ໃໝ່</Badge>
<Badge variant="success" dot>ອອນລາຍ</Badge>
<Badge variant="danger" live>ສົດ</Badge>`,
    props: [
      { name: "variant", type: '"neutral" | "info" | "success" | "warning" | "danger" | "gold"', def: '"neutral"', desc: "Colour meaning. Gold never carries small gold text; it uses the foreground colour." },
      { name: "dot", type: "boolean", def: "false", desc: "Leading status dot in the text colour." },
      { name: "live", type: "boolean", def: "false", desc: "Dot with a ping ring (implies dot). Lite / reduced motion: still dot." },
    ],
  },
  {
    slug: "toggle", name: "Toggle", group: "Actions", badge: "New",
    desc: "A button that stays pressed. ToggleGroup picks one (or many) of a few options; the segmented variant is the iOS control with a pill that springs under your choice.",
    file: "packages/ui/src/components/toggle.tsx", importLine: 'import { Toggle, ToggleGroup, ToggleGroupItem } from "@vks/ui"',
    demo: () => {
      const [v, setV] = React.useState("list")
      return <div className="flex flex-col items-center gap-5">
        <ToggleGroup type="single" variant="segmented" value={v} onValueChange={(x) => x && setV(x)} aria-label="View" className="w-[min(22rem,80vw)]">
          <ToggleGroupItem value="list"><List />ລາຍການ</ToggleGroupItem><ToggleGroupItem value="grid"><LayoutGrid />ຕາຕະລາງ</ToggleGroupItem><ToggleGroupItem value="map"><MapIcon />ແຜນທີ່</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex gap-2"><Toggle aria-label="flashlight" variant="outline"><Flashlight />ໄຟສາຍ</Toggle><Toggle aria-label="bold"><Bold /></Toggle></div>
      </div>
    },
    code: `const [view, setView] = React.useState("list")

<ToggleGroup type="single" variant="segmented" value={view} onValueChange={(v) => v && setView(v)}>
  <ToggleGroupItem value="list"><List />ລາຍການ</ToggleGroupItem>
  <ToggleGroupItem value="grid"><LayoutGrid />ຕາຕະລາງ</ToggleGroupItem>
  <ToggleGroupItem value="map"><Map />ແຜນທີ່</ToggleGroupItem>
</ToggleGroup>

<Toggle variant="outline" aria-label="flashlight"><Flashlight />ໄຟສາຍ</Toggle>`,
    examples: [
      { id: "shift", title: "Segmented: shift picker", note: "Two or three choices, all visible. Guards never open a dropdown for this.", demo: () => { const [s, setS] = React.useState("day"); return <ToggleGroup type="single" variant="segmented" value={s} onValueChange={(x) => x && setS(x)} className="w-72"><ToggleGroupItem value="day"><Sun />ກາງເວັນ</ToggleGroupItem><ToggleGroupItem value="night"><Moon />ກາງຄືນ</ToggleGroupItem><ToggleGroupItem value="24"><Clock />24 ຊມ</ToggleGroupItem></ToggleGroup> },
        code: `<ToggleGroup type="single" variant="segmented" value={shift} onValueChange={(v) => v && setShift(v)}>
  <ToggleGroupItem value="day"><Sun />ກາງເວັນ</ToggleGroupItem>
  <ToggleGroupItem value="night"><Moon />ກາງຄືນ</ToggleGroupItem>
  <ToggleGroupItem value="24"><Clock />24 ຊມ</ToggleGroupItem>
</ToggleGroup>` },
      { id: "multiple", title: "Multiple: text format", demo: () => <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}><ToggleGroupItem value="bold" aria-label="bold"><Bold /></ToggleGroupItem><ToggleGroupItem value="italic" aria-label="italic"><Italic /></ToggleGroupItem><ToggleGroupItem value="underline" aria-label="underline"><Underline /></ToggleGroupItem></ToggleGroup>,
        code: `<ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
  <ToggleGroupItem value="bold" aria-label="bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="italic"><Italic /></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="underline"><Underline /></ToggleGroupItem>
</ToggleGroup>` },
    ],
    notes: ["On/off setting that saves right away → Switch.", "Pressed state of one tool (flashlight, bold) → Toggle.", "One of 2–4 options, all visible → ToggleGroup variant=\"segmented\". More than 4 → Select."],
    props: [
      { name: "variant (Toggle)", type: '"default" | "outline"', def: '"default"', desc: "Pressed state = accent fill + thin gold ring." },
      { name: "variant (ToggleGroup)", type: '"default" | "outline" | "segmented"', def: '"default"', desc: "segmented = iOS control with a spring pill." },
      { name: "type", type: '"single" | "multiple"', desc: "Radix ToggleGroup type." },
      { name: "pressed / onPressedChange", type: "boolean / (b) => void", desc: "Controlled Toggle." },
      { name: "value / onValueChange", type: "string | string[]", desc: "Controlled group. For segmented, ignore empty values so one stays picked." },
    ],
  },
  {
    slug: "logo", name: "Logo", group: "Foundations", badge: "New",
    desc: "The official VKS badge, redrawn as a vector from the brand file used in the QC dashboard. Same colours in both themes, because the badge carries its own field.",
    file: "packages/ui/src/components/logo.tsx", importLine: 'import { Logo, LogoTile, BRAND } from "@vks/ui"',
    demo: () => <div className="flex flex-wrap items-center justify-center gap-6">
      <Logo className="vks-shine size-40" />
      <div className="flex flex-col items-center gap-3"><LogoTile className="size-24" /><span className="text-xs text-muted-foreground">LogoTile · app icon</span></div>
      <div className="flex flex-col items-center gap-3"><div className="flex items-end gap-3 text-foreground"><Logo variant="mono" className="size-8" /><Logo variant="mono" className="size-12" /></div><span className="text-xs text-muted-foreground">mono · stamps, print</span></div>
    </div>,
    code: `<Logo className="size-40" />
<LogoTile className="size-24" />          {/* PWA icon, splash, login */}
<Logo variant="mono" className="size-8" /> {/* one colour: currentColor */}`,
    examples: [
      { id: "sizes", title: "Sizes", note: "Readable down to 32 px. Below that use mono.", demo: () => <div className="flex flex-wrap items-end justify-center gap-4">{["size-8", "size-10", "size-14", "size-20", "size-28"].map((s) => <Logo key={s} className={s} />)}</div>, code: `<Logo className="size-8" /> … <Logo className="size-28" />` },
      { id: "on-navy", title: "On the navy bar", demo: () => <div className="flex items-center gap-3 rounded-2xl bg-bar px-5 py-3 text-bar-foreground"><Logo className="size-10" /><div><div className="font-bold leading-snug">{BRAND.name}</div><div className="text-xs leading-normal opacity-75">{BRAND.legalLo}</div></div></div>,
        code: `import { Logo, BRAND } from "@vks/ui"

<header className="bg-bar text-bar-foreground">
  <Logo className="size-10" />
  <div>
    <div className="font-bold">{BRAND.name}</div>     {/* Viengkham Security Service */}
    <div className="text-xs">{BRAND.legalLo}</div>    {/* ບໍລິສັດ ວຽງຄຳບໍລິການຄວາມປອດໄພ ຈຳກັດຜູ້ດຽວ */}
  </div>
</header>` },
      { id: "names", title: "Company names (BRAND)", note: "VKS is only the acronym. Always take the name from BRAND, never type it.", demo: () => <div className="w-full max-w-lg divide-y divide-foreground/10 rounded-xl border text-sm">{(Object.keys(BRAND) as (keyof typeof BRAND)[]).map((k) => <div key={k} className="flex gap-4 px-4 py-2.5 leading-normal"><code className="w-20 shrink-0 text-muted-foreground">{k}</code><span>{BRAND[k]}</span></div>)}</div>,
        code: `BRAND.short   // "VKS"
BRAND.name    // "Viengkham Security Service"
BRAND.legal   // "Viengkham Security Service Sole Co., Ltd."
BRAND.lo      // "ວຽງຄຳບໍລິການຄວາມປອດໄພ"
BRAND.legalLo // "ບໍລິສັດ ວຽງຄຳບໍລິການຄວາມປອດໄພ ຈຳກັດຜູ້ດຽວ"` },
    ],
    notes: ["Colours live in theme.css as --logo-navy / --logo-gold / --logo-steel / --logo-field. They do not change with the theme.", "Never stretch, recolour or re-letter the badge. For one colour use variant=\"mono\"."],
    props: [
      { name: "variant", type: '"full" | "mono"', def: '"full"', desc: "mono draws everything in currentColor." },
      { name: "className", type: "string", desc: "Size it with size-*." },
      { name: "title", type: "string", def: "BRAND.name", desc: "Accessible name (Viengkham Security Service)." },
    ],
  },
]
