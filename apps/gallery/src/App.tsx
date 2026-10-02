import * as React from "react"
import { BookOpen, Moon, ScanLine, Search, Sun, Trash2 } from "@vks-kit/ui/icons"
import {
  Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Dialog, DialogContent,
  DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Empty, Input, Label, LiveDot, Logo, OfflineBanner,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger,
  Skeleton, Spinner, SuccessCheck, Switch, Toggle, ToggleGroup, ToggleGroupItem, Table, TBody, TD, TH, THead, Tabs, TabsContent, TabsList, TabsTrigger, TR,
  Toaster, Tip, CloseButton, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, toast, useTheme,
} from "@vks-kit/ui"
import { haptics } from "@vks-kit/core"

const Sec = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-20 space-y-3">
    <h2 className="text-lg font-bold">{title}</h2>
    {children}
  </section>
)
const tokens = ["background", "card", "primary", "secondary", "muted", "accent", "success", "warning", "destructive", "gold", "border"]

export function App() {
  const { theme, setTheme } = useTheme()
  const [shakeKey, setShakeKey] = React.useState(0)
  const [checkKey, setCheckKey] = React.useState(0)
  return (
    <TooltipProvider>
      <Toaster />
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-bar px-5 py-3 text-bar-foreground shadow">
        <Logo className="size-9" />
        <div className="leading-tight"><b>VKS design system</b><div className="text-xs opacity-70">theme {theme === "light" ? "A · light" : "E · dark"}</div></div>
        <nav className="ml-6 hidden gap-4 text-sm md:flex">
          {["colours", "buttons", "forms", "feedback", "overlays", "data", "phone"].map((s) => <a key={s} href={"#" + s} className="opacity-80 hover:opacity-100">{s}</a>)}
        </nav>
        <a href={location.protocol + "//" + location.hostname + ":5201/"} target="_blank" rel="noreferrer" className="vks-press ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg border border-bar-foreground/20 px-3 text-sm font-semibold hover:bg-bar-foreground/10"><BookOpen className="size-4" />Docs</a>
        <Button data-testid="theme-toggle" variant="gold" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <Moon /> : <Sun />}{theme === "light" ? "Dark (E)" : "Light (A)"}
        </Button>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 p-5 pb-24">
        <Sec id="colours" title="Colour tokens">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {tokens.map((t) => (
              <div key={t} className="overflow-hidden rounded-lg border">
                <div className="h-12" style={{ background: "var(--" + t + ")" }} />
                <div className="bg-card px-2 py-1 text-xs font-semibold">{t}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Apps use these names only. Gold is for lines and icons, not small text (contrast 3.1:1 in theme A).</p>
        </Sec>

        <Sec id="buttons" title="Buttons">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button><Button variant="action"><ScanLine />ສະແກນ</Button><Button variant="gold">Gold</Button>
            <Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="destructive"><Trash2 />ລຶບ</Button>
            <Button disabled>Disabled</Button><Button size="sm">Small</Button><Button size="lg">Large</Button>
          </div>
        </Sec>

        <Sec id="forms" title="Forms (44 px touch targets)">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="emp">ລະຫັດພະນັກງານ</Label>
              <Input key={shakeKey} id="emp" placeholder="G001" invalid={shakeKey > 0} />
              <Button variant="outline" size="sm" onClick={() => { setShakeKey((k) => k + 1); haptics.error() }}>Show error shake</Button></div>
            <div className="space-y-1.5"><Label>ເລືອກຈຸດກວດ</Label>
              <Select><SelectTrigger><SelectValue placeholder="ເລືອກ…" /></SelectTrigger>
                <SelectContent><SelectItem value="1">ປະຕູໜ້າ</SelectItem><SelectItem value="2">ບ່ອນຈອດລົດ</SelectItem><SelectItem value="3">ຄັງສິນຄ້າ</SelectItem></SelectContent></Select></div>
            <label className="flex items-center gap-3"><Checkbox defaultChecked /><span>ກວດແລ້ວ</span></label>
            <label className="flex items-center gap-3"><Switch defaultChecked /><span>ແຈ້ງເຕືອນ</span></label>
            <ToggleGroup type="single" variant="segmented" defaultValue="day" className="w-64"><ToggleGroupItem value="day">ກາງເວັນ</ToggleGroupItem><ToggleGroupItem value="night">ກາງຄືນ</ToggleGroupItem></ToggleGroup>
            <Toggle variant="outline" aria-label="flashlight">ໄຟສາຍ</Toggle>
          </div>
        </Sec>

        <Sec id="feedback" title="Feedback and motion">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Card><CardHeader><CardTitle>Success</CardTitle></CardHeader><CardContent className="flex flex-col items-start gap-2">
              <SuccessCheck key={checkKey} /><Button size="sm" variant="outline" onClick={() => { setCheckKey((k) => k + 1); haptics.success() }}>Play</Button></CardContent></Card>
            <Card><CardHeader><CardTitle>Skeleton</CardTitle></CardHeader><CardContent className="space-y-2"><Skeleton /><Skeleton className="w-2/3" /><Skeleton className="w-1/2" /></CardContent></Card>
            <Card><CardHeader><CardTitle>Live + spinner</CardTitle></CardHeader><CardContent className="flex items-center gap-3"><LiveDot /><Spinner /><Badge variant="success">online</Badge></CardContent></Card>
            <Card><CardHeader><CardTitle>Toast</CardTitle></CardHeader><CardContent><Button size="sm" variant="action" onClick={() => toast.success("ບັນທຶກແລ້ວ")}>Show toast</Button></CardContent></Card>
          </div>
          <OfflineBanner queued={3} className="rounded-lg" />
          <div className="grid gap-2 rounded-xl bg-muted p-3"><OfflineBanner variant="island" queued={3} /><OfflineBanner variant="island" queued={3} syncing /></div>
          <div className="grid gap-3 md:grid-cols-2">
            <Empty title="ຍັງບໍ່ມີຂໍ້ມູນ" hint="ສະແກນຈຸດກວດທຳອິດເພື່ອເລີ່ມ" />
            <Empty icon={<Search />} title="ບໍ່ພົບຜົນ" hint="ລອງຄຳຄົ້ນອື່ນ" action={<Button size="sm" variant="outline">ລ້າງຕົວກອງ</Button>} />
          </div>
          <div className="flex flex-wrap items-center gap-2"><Badge>neutral</Badge><Badge variant="info">ໃໝ່</Badge><Badge variant="success" dot>ສຳເລັດ</Badge><Badge variant="warning">ລໍຖ້າ</Badge><Badge variant="danger" live>ສົດ</Badge><Badge variant="gold">VIP</Badge><CloseButton /></div>
        </Sec>

        <Sec id="overlays" title="Dialog, bottom sheet, tooltip">
          <div className="flex flex-wrap gap-2">
            <Dialog><DialogTrigger asChild><Button variant="outline">Dialog</Button></DialogTrigger>
              <DialogContent><DialogHeader><DialogTitle>ຢືນຢັນການບັນທຶກ?</DialogTitle><DialogDescription>ຂໍ້ມູນຈະຖືກສົ່ງໄປຫາສູນຄວບຄຸມ.</DialogDescription></DialogHeader>
                <DialogFooter><Button variant="ghost">ຍົກເລີກ</Button><Button variant="action">ບັນທຶກ</Button></DialogFooter></DialogContent></Dialog>
            <Sheet><SheetTrigger asChild><Button variant="outline">Bottom sheet</Button></SheetTrigger>
              <SheetContent side="bottom"><SheetTitle>ເລືອກຈຸດກວດ</SheetTitle><SheetDescription>ຈຸດ 12 / 20</SheetDescription>
                <div className="mt-3 space-y-2">{["ປະຕູໜ້າ", "ບ່ອນຈອດລົດ", "ຄັງສິນຄ້າ"].map((s) => <Button key={s} variant="outline" className="w-full justify-start">{s}</Button>)}</div></SheetContent></Sheet>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost">Tooltip</Button></TooltipTrigger><TooltipContent>ຄຳອະທິບາຍ</TooltipContent></Tooltip>
            <Tip content="ບັນທຶກ" shortcut="Ctrl S"><Button variant="ghost">Tip + key</Button></Tip>
            <Tip variant="light" side="bottom" title="ກະເຊົ້າ" content="06:00 – 14:00 · 12 ຄົນ"><Button variant="ghost">Tip light</Button></Tip>
            <Tip variant="glass" side="right" content="ຈຸດກວດ 12 / 20"><Button variant="ghost">Tip glass</Button></Tip>
          </div>
        </Sec>

        <Sec id="data" title="Table and tabs">
          <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">ວັນນີ້</TabsTrigger><TabsTrigger value="b">ອາທິດນີ້</TabsTrigger></TabsList>
            <TabsContent value="a"><Table><THead><TR><TH>ຈຸດກວດ</TH><TH>ເວລາ</TH><TH>ສະຖານະ</TH></TR></THead>
              <TBody>{[["ປະຕູໜ້າ", "08:12", "success"], ["ບ່ອນຈອດລົດ", "08:41", "success"], ["ຄັງສິນຄ້າ", "—", "warning"]].map(([a, b, c]) => (
                <TR key={a}><TD>{a}</TD><TD>{b}</TD><TD><Badge variant={c as "success" | "warning"}>{c === "success" ? "ສຳເລັດ" : "ລໍຖ້າ"}</Badge></TD></TR>))}</TBody></Table></TabsContent>
            <TabsContent value="b"><Empty title="ບໍ່ມີຂໍ້ມູນອາທິດນີ້" /></TabsContent></Tabs>
        </Sec>

        <Sec id="phone" title="Guard scan screen, built from the shared parts">
          <div className="mx-auto w-[300px] overflow-hidden rounded-3xl border-4 border-border bg-background shadow-lg">
            <div className="flex items-center justify-between bg-bar px-4 py-3 text-bar-foreground"><b>ສະແກນຈຸດກວດ</b><Badge className="bg-bar-foreground/20 text-bar-foreground">12/20</Badge></div>
            <div className="space-y-2 p-3">
              <div className="overflow-hidden py-4"><div className="relative mx-auto flex size-24 items-center justify-center rounded-xl border-2 border-dashed border-gold vks-ripple"><ScanLine className="size-10 text-gold" /></div></div>
              <div className="vks-stagger space-y-1.5">
                {[["ປະຕູໜ້າ", "08:12", "success"], ["ບ່ອນຈອດລົດ", "08:41", "success"], ["ຄັງສິນຄ້າ", "ລໍຖ້າ", "warning"]].map(([a, b, c], i) => (
                  <div key={a} style={{ "--i": i } as React.CSSProperties} className="flex items-center gap-2 rounded-lg bg-card px-3 py-2.5 shadow-sm">
                    <span className={"size-2.5 rounded-full " + (c === "success" ? "bg-success" : "bg-warning")} />{a}<span className="ml-auto text-xs text-muted-foreground">{b}</span></div>))}
              </div>
              <Button variant="action" className="w-full">ບັນທຶກ</Button>
            </div>
          </div>
        </Sec>
      </main>
    </TooltipProvider>
  )
}