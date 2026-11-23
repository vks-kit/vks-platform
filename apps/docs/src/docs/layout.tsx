import * as React from "react"
import { Home, ClipboardList, Users, BarChart3, Settings, Bell, Plus } from "@vks-kit/ui/icons"
import { AppShell, Sidebar, SidebarSheet, BottomNav, Fab, PageHeader, LoginCard, Wizard, Input, Button, Card, CardContent, PullToRefresh, SwipeRow, Avatar, Badge, Switch, toast, useTheme, FloatingInput, PasswordInput, LargeTitleBar, LoginScreen, ProfileView, useIsMobile, type NavItem } from "@vks-kit/ui"
import { MessageCircle, Pencil } from "@vks-kit/ui/icons"
import { Menu, ShieldCheck, Clock, MapPin, Phone, Mail, Bell as BellIcon, Lock, Globe, Moon } from "@vks-kit/ui/icons"
import type { Doc } from "./types"
import { useT } from "./kit"

const nav: NavItem[] = [
  { id: "home", label: "ໜ້າຫຼັກ", icon: <Home /> }, { id: "tasks", label: "ວຽກ", icon: <ClipboardList />, badge: 3 }, { id: "staff", label: "ພະນັກງານ", icon: <Users /> },
  { id: "reports", label: "ລາຍງານ", icon: <BarChart3 /> }, { id: "alerts", label: "ແຈ້ງເຕືອນ", icon: <Bell /> }, { id: "settings", label: "ຕັ້ງຄ່າ", icon: <Settings /> },
]
/**
 * Real 360 px viewport: the demo runs in an iframe (#/frame/<id>) so the md: breakpoint and
 * useIsMobile() see a phone, not the desktop window. Theme follows the parent via localStorage.
 */
export function PhoneFrame({ frame, h = 560, src, scale = 1 }: { frame: string; h?: number; src?: string; scale?: number }) {
  const { theme } = useTheme(), t = useT()
  const phone = <div className="relative mx-auto w-[380px] max-w-full rounded-[2.9rem] bg-bar p-[9px] shadow-2xl ring-1 ring-gold/30" style={{ height: h + 30 }}>
    {/* side buttons */}
    <i aria-hidden className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-bar" /><i aria-hidden className="absolute -left-[3px] top-36 h-12 w-[3px] rounded-l bg-bar" /><i aria-hidden className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-bar" />
    <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[2.3rem] bg-background [clip-path:inset(0_round_2.3rem)]">
      <div aria-hidden className="relative flex h-[30px] shrink-0 items-center justify-between px-7 text-[12px] font-bold leading-none text-foreground">
        <span className="tabular-nums">9:41</span>
        <span className="absolute left-1/2 top-[7px] h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
        <span className="flex items-end gap-[2px]">{[5, 7, 9, 11].map((x) => <i key={x} className="w-[3px] rounded-sm bg-foreground" style={{ height: x }} />)}<i className="ml-1.5 h-[11px] w-[22px] rounded-[3px] border border-foreground/50 p-[1.5px]"><i className="block h-full w-4/5 rounded-[1.5px] bg-foreground" /></i></span>
      </div>
      <iframe key={theme} title={t(frame + " ເທິງໂທລະສັບ", frame + " on a phone")} src={src ?? "#/frame/" + frame} className="block min-h-0 w-full flex-1 border-0" loading="lazy" />
      {/* own strip under the page, so fixed bottom bars in the frame never sit beneath the home indicator */}
      <div aria-hidden className="relative h-5 shrink-0 bg-background"><span className="absolute bottom-1.5 left-1/2 h-[5px] w-28 -translate-x-1/2 rounded-full bg-foreground/80" /></div>
    </div>
  </div>
  if (scale === 1) return phone
  // scaled copy: reserve the scaled size so the layout doesn't leave a hole
  return <div className="mx-auto" style={{ width: 380 * scale, height: (h + 30) * scale }}><div className="origin-top-left" style={{ width: 380, transform: "scale(" + scale + ")" }}>{phone}</div></div>
}
/**
 * Desktop viewport (1180 px) scaled down to fit the column, so the sidebar and md: rules are real.
 * Same iframe route as the phone, so both frames show the SAME page at two widths.
 */
export function DesktopFrame({ frame, w = 1180, h = 700 }: { frame: string; w?: number; h?: number }) {
  const { theme } = useTheme(), t = useT()
  const box = React.useRef<HTMLDivElement>(null)
  const [s, setS] = React.useState(0.6)
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return
    const ro = new ResizeObserver(() => setS(Math.min(1, el.clientWidth / w))); ro.observe(el); return () => ro.disconnect()
  }, [w])
  return <div ref={box} className="w-full">
    <div className="overflow-hidden rounded-xl border-[6px] border-bar bg-background shadow-xl" style={{ height: h * s + 12 }}>
      <div className="flex h-3 items-center gap-1 bg-bar px-1.5" aria-hidden><i className="size-1.5 rounded-full bg-bar-foreground/30" /><i className="size-1.5 rounded-full bg-bar-foreground/30" /><i className="size-1.5 rounded-full bg-bar-foreground/30" /></div>
      <iframe key={theme} title={t(frame + " ເທິງຄອມພິວເຕີ", frame + " on a desktop")} src={"#/frame/" + frame} className="block origin-top-left border-0" style={{ width: w, height: h, transform: `scale(${s})` }} loading="lazy" />
    </div>
  </div>
}
function ShellDemo() {
  const [a, setA] = React.useState("home")
  const label = nav.find((n) => n.id === a)?.label ?? ""
  const sites = [{ s: "ປະຕູໜ້າ", t: "08:12", st: "ສຳເລັດ", v: "success" as const }, { s: "ບ່ອນຈອດລົດ", t: "08:41", st: "ຊ້າ 6 ນາທີ", v: "warning" as const }, { s: "ຄັງສິນຄ້າ", t: "—", st: "ລໍຖ້າ", v: "neutral" as const }, { s: "ຫ້ອງເຊີເວີ", t: "09:02", st: "ສຳເລັດ", v: "success" as const }]
  return <AppShell items={nav} active={a} onNavigate={setA} title="VKS"
    header={<div className="flex w-full items-center gap-3 leading-normal"><Avatar name="ສົມຊາຍ" size={36} className="shrink-0" /><div className="min-w-0 flex-1"><div className="text-[11px] text-muted-foreground">ສະບາຍດີ, ສົມຊາຍ</div><div className="truncate text-[15px] font-bold">{label}</div></div><button aria-label="ແຈ້ງເຕືອນ" className="relative flex size-11 items-center justify-center rounded-full hover:bg-muted"><Bell className="size-5" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive ring-2 ring-card" /></button></div>}
    fab={<Fab label="ເພີ່ມ" onClick={() => toast("FAB")} />}>
    <div className="vks-stagger space-y-3 leading-normal">
      <div className="vks-hero relative overflow-hidden rounded-3xl p-5 text-bar-foreground" style={{ "--i": 0 } as React.CSSProperties}>
        <div className="text-xs opacity-80">ກະເຊົ້າ · 06:00–18:00</div>
        <div className="mt-1 text-2xl font-bold tabular-nums">12 / 16 ຈຸດ</div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-bar-foreground/15"><div className="h-full w-3/4 rounded-full bg-gold" /></div>
        <div className="mt-2 flex justify-between text-xs opacity-80"><span>ລາດຕະເວນມື້ນີ້</span><span>75%</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2" style={{ "--i": 1 } as React.CSSProperties}>{[["ຕົງເວລາ", "94%"], ["ເຫດການ", "2"], ["ຊົ່ວໂມງ", "6.5"]].map(([k, v]) => <div key={k} className="rounded-2xl border bg-card p-3 text-center"><div className="text-lg font-bold tabular-nums">{v}</div><div className="text-[11px] text-muted-foreground">{k}</div></div>)}</div>
      <div className="px-1 pt-1 text-sm font-bold" style={{ "--i": 2 } as React.CSSProperties}>ຈຸດກວດລ່າສຸດ</div>
      {sites.map((x, i) => <Card key={x.s} style={{ "--i": i + 3 } as React.CSSProperties} className="rounded-2xl"><CardContent className="flex items-center gap-3 p-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary dark:bg-gold/15 dark:text-gold"><ClipboardList className="size-5" /></span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{x.s}</div><div className="text-xs text-muted-foreground tabular-nums">{x.t}</div></div><Badge variant={x.v}>{x.st}</Badge></CardContent></Card>)}
    </div>
  </AppShell>
}
const userChip = <div className="flex items-center gap-2.5 px-1 text-sm"><Avatar name="Admin" size={32} className="shrink-0" /><span className="vks-rail-fade">Admin</span></div>
function SidebarDemo() {
  const [a, setA] = React.useState("tasks")
  const [mini, setMini] = React.useState(false), t = useT()
  return <div className="flex w-full flex-col items-center gap-3">
    <label className="flex items-center gap-2 text-sm font-medium"><Switch checked={mini} onCheckedChange={setMini} />{t("ຫຍໍ້ເປັນໄອຄອນ (collapsed)", "Collapse to icons")}</label>
    <div className="h-[460px] overflow-hidden rounded-xl border [transform:translateZ(0)]">
      <Sidebar items={nav.slice(0, 5)} active={a} onNavigate={setA} title="VKS QC" collapsible collapsed={mini} onCollapsedChange={setMini} className="flex !h-full" user={userChip} />
    </div>
  </div>
}
function SidebarSheetDemo() {
  const [a, setA] = React.useState("home"), [open, setOpen] = React.useState(false), t = useT()
  return <><Button variant="outline" onClick={() => setOpen(true)}><Menu />{t("ເປີດເມນູ (ໂທລະສັບ)", "Open menu (phone)")}</Button>
    <SidebarSheet open={open} onOpenChange={setOpen} items={nav} active={a} onNavigate={setA} title="VKS QC" user={userChip} /></>
}
function BottomDemo() { const [a, setA] = React.useState("home"), t = useT(); return <><div className="p-4 text-sm text-muted-foreground">{t("6 ລາຍການ: ສະແດງ 4 + ··· ເພີ່ມເຕີມ. ແຕະ ເພີ່ມເຕີມ.", "6 items: 4 shown + ··· More. Tap More.")}</div><Fab label="ສະແກນ" onClick={() => toast("FAB")} /><BottomNav items={nav} active={a} onNavigate={setA} /></> }
function WizardDemo() {
  const [s, setS] = React.useState(0)
  return <Card className="w-full max-w-md"><CardContent className="pt-5"><Wizard steps={["ຂໍ້ມູນ", "ຮູບ", "ຢືນຢັນ"]} step={s} onStep={setS} onFinish={() => { toast.success("ສົ່ງແລ້ວ"); setS(0) }} finishLabel="ສົ່ງ" nextLabel="ຕໍ່ໄປ" backLabel="ກັບຄືນ"><div className="rounded-lg bg-muted p-6 text-center">ຂັ້ນຕອນ {s + 1}</div></Wizard></CardContent></Card>
}
function SwipeDemo() {
  const [names, setNames] = React.useState(["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ"]), t = useT()
  return <div className="p-3"><PullToRefresh onRefresh={() => new Promise((r) => setTimeout(r, 900))}><div className="space-y-2 pb-40">
    <p className="text-center text-xs text-muted-foreground">{t("ດຶງລົງເພື່ອໂຫຼດໃໝ່ · ປັດແຖວໄປຊ້າຍ", "Pull down to refresh · swipe a row left")}</p>
    {names.map((n) => <SwipeRow key={n} onAction={() => setNames(names.filter((x) => x !== n))}><div className="flex items-center gap-3 p-3"><Avatar name={n} size={36} /><b>{n}</b></div></SwipeRow>)}
    {names.length === 0 && <Button className="w-full" variant="outline" onClick={() => setNames(["ສົມຊາຍ", "ນາງບົວ", "ທ້າວດາວ"])}>{t("ຣີເຊັດ", "Reset")}</Button>}
  </div></PullToRefresh></div>
}

function LoginDemo() {
  const [busy, setBusy] = React.useState(false)
  return <LoginCard title="ເຂົ້າສູ່ລະບົບ" subtitle="ໃສ່ລະຫັດພະນັກງານ ແລະ ລະຫັດຜ່ານ" footer={<span>ລືມລະຫັດ? ໂທຫາສູນຄວບຄຸມ</span>}>
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); toast.success("ຍິນດີຕ້ອນຮັບ") }, 1200) }}>
      <FloatingInput label="ລະຫັດພະນັກງານ" autoComplete="username" />
      <PasswordInput placeholder="ລະຫັດຜ່ານ" autoComplete="current-password" />
      <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "ກຳລັງເຂົ້າ…" : "ເຂົ້າສູ່ລະບົບ"}</Button>
    </form>
  </LoginCard>
}
function LoginScreenDemo() {
  const [busy, setBusy] = React.useState(false)
  return <LoginScreen title="ຍິນດີຕ້ອນຮັບກັບມາ" subtitle="ເຂົ້າສູ່ລະບົບດ້ວຍລະຫັດພະນັກງານຂອງທ່ານ"
    tagline="ຄວາມປອດໄພ ທີ່ທ່ານໄວ້ວາງໃຈ" features={[{ label: "ຕິດຕາມການລາດຕະເວນແບບເວລາຈິງ" }, { icon: <Clock />, label: "ບັນທຶກການມາວຽກອັດຕະໂນມັດ" }, { icon: <MapPin />, label: "ກວດຈຸດດ້ວຍ GPS ແລະ QR" }]}
    footer={<span>ລືມລະຫັດ? ໂທຫາສູນຄວບຄຸມ</span>}>
    <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); toast.success("ຍິນດີຕ້ອນຮັບ") }, 1200) }}>
      <FloatingInput label="ລະຫັດພະນັກງານ" autoComplete="username" />
      <PasswordInput placeholder="ລະຫັດຜ່ານ" autoComplete="current-password" />
      <Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? "ກຳລັງເຂົ້າ…" : "ເຂົ້າສູ່ລະບົບ"}</Button>
    </form>
  </LoginScreen>
}
function ProfileDemo() {
  const [push, setPush] = React.useState(true), t = useT()
  return <div className="w-full md:p-8"><ProfileView variant="actions" name="ສົມຊາຍ ວົງສະຫວັນ" role="ເຈົ້າໜ້າທີ່ຮັກສາຄວາມປອດໄພ" code="VKS2207001" status="online"
    quickActions={[{ icon: <Phone />, label: t("ໂທ", "Call"), onPress: () => toast(t("ໂທ", "Call")) }, { icon: <MessageCircle />, label: t("ຂໍ້ຄວາມ", "Message"), onPress: () => toast(t("ຂໍ້ຄວາມ", "Message")) }, { icon: <Pencil />, label: t("ແກ້ໄຂ", "Edit"), onPress: () => toast(t("ແກ້ໄຂ", "Edit")) }]}
    stats={[{ label: "ມື້ມາວຽກ", value: 24 }, { label: "ລາດຕະເວນ", value: 61 }, { label: "ຄະແນນ", value: "4.8" }]}
    sections={[
      { title: "ຂໍ້ມູນ", rows: [{ icon: <Phone />, label: "ເບີໂທ", value: "020 5555 1234" }, { icon: <Mail />, label: "ອີເມວ", value: "somchai@vks.la" }, { icon: <MapPin />, label: "ຈຸດປະຈຳການ", value: "ທະນາຄານ ສາຂາຫຼັກ" }] },
      { title: "ຕັ້ງຄ່າ", rows: [{ icon: <BellIcon />, label: "ແຈ້ງເຕືອນ", trailing: <Switch checked={push} onCheckedChange={setPush} /> }, { icon: <Lock />, label: "ປ່ຽນລະຫັດຜ່ານ", onPress: () => toast(t("ປ່ຽນລະຫັດຜ່ານ", "Password")) }, { icon: <Globe />, label: "ພາສາ", value: "ລາວ", onPress: () => toast(t("ພາສາ", "Language")) }, { icon: <Moon />, label: "ຮູບແບບສີ", value: "ອັດຕະໂນມັດ", onPress: () => toast(t("ຮູບແບບສີ", "Theme")) }] },
    ]}
    onSignOut={() => toast(t("ອອກຈາກລະບົບແລ້ວ", "Signed out"))} /></div>
}
/** Phone-width viewport (the Phone pane iframe) shows the real page; a wide one shows it scaled inside a desktop frame. */
function PageHeaderDemo() { const t = useT(); return <div className="w-full"><PageHeader title="ພະນັກງານ" subtitle="128 ຄົນ · 6 ຈຸດ" actions={<><Button variant="outline">{t("ສົ່ງອອກ", "Export")}</Button><Button variant="action"><Plus />ເພີ່ມ</Button></>} /></div> }
function LargeTitleDemo() { const t = useT(); return <div className="w-full max-w-sm overflow-hidden rounded-xl border"><LargeTitleBar title="ຕັ້ງຄ່າ" onBack={() => toast(t("ກັບຄືນ", "Back"))} backLabel="ກັບ" /></div> }
function LoginAdaptive() { return useIsMobile() ? <LoginScreenDemo /> : <DesktopFrame frame="login-screen" /> }
function ProfileAdaptive() { return useIsMobile() ? <ProfileDemo /> : <DesktopFrame frame="profile" h={640} /> }
/** Pages rendered alone inside a PhoneFrame iframe. */
export const frames: Record<string, React.FC> = { "app-shell": ShellDemo, "bottom-nav": BottomDemo, "login-card": LoginDemo, "login-screen": LoginScreenDemo, profile: ProfileDemo, touch: SwipeDemo }

export const layoutDocs: Doc[] = [
  {
    slug: "app-shell", name: "App shell", group: "Layout & navigation", badge: "Mobile",
    desc: "Whole-app frame. Navy sidebar on desktop, bottom nav + FAB on a phone. One breakpoint: 768 px. Pages slide in the direction you moved and a gold bar sweeps the header.",
    file: "packages/ui/src/components/shell.tsx", importLine: 'import { AppShell, Fab, type NavItem, type ShellProfile } from "@vks-kit/ui"',
    demo: () => <PhoneFrame frame="app-shell" />,
    examples: [
      { id: "desktop", title: "Same shell on a desktop", note: "1180 px viewport scaled to fit. Collapse the rail with the chevron; the choice is remembered (localStorage \"vks.rail\"). Click items: later items slide in from the right, earlier ones from the left.", demo: () => <DesktopFrame frame="app-shell" />, code: `<AppShell items={nav} active={page} onNavigate={setPage} collapsible>…</AppShell>` },
    ],
    code: `const nav: NavItem[] = [
  { id: "home", label: "ໜ້າຫຼັກ", icon: <Home /> },
  { id: "tasks", label: "ວຽກ", icon: <ClipboardList />, badge: 3 },
  …
]
// 0.6 recommended: no top bar anywhere; the person under the sidebar opens the profile page
<AppShell items={nav} active={page} onNavigate={setPage} title="VKS"
  phoneHeader={false} desktopHeader={false}
  profile={{ id: "profile", name: me.full_name, sub: me.code }}
  fab={<Fab label="ເພີ່ມ" onClick={add} />}>
  {content}
</AppShell>`,
    props: [
      { name: "items", type: "{ id; label; icon; badge? }[]", desc: "More than 5 on a phone → 4 + a More sheet." },
      { name: "active / onNavigate", type: "string / (id) => void", desc: "" }, { name: "title", type: "string", def: '"VKS"', desc: "Sidebar title." },
      { name: "header", type: "ReactNode", desc: "Sticky top bar, respects the notch." }, { name: "fab", type: "ReactNode", desc: "Phone only." },
      { name: "user", type: "ReactNode", desc: "Bottom of the sidebar." },
      { name: "collapsible", type: "boolean", def: "true", desc: "Desktop rail can shrink to 72 px icons. State is remembered." },
      { name: "phoneHeader", type: "boolean", def: "true", desc: "false = no top bar on a phone (the bottom nav is the frame). Use it when the bar would only repeat the app name, the date or the nav." },
      { name: "phoneProfile", type: "NavItem", desc: "Phone only: adds the profile page as the last bottom-nav tab (desktop opens it from the user chip). e.g. { id: \"profile\", label: \"ຂ້ອຍ\", icon: <UserRound /> }." },
      { name: "desktopHeader", type: "boolean", def: "true", desc: "0.6: false = no top bar on desktop either. The sidebar and each page's PageHeader already say where you are (rule No top bar)." },
      { name: "profile", type: "ShellProfile", desc: "0.6: { id, name, sub?, src?, label?, icon? }. Desktop: a button under the sidebar that opens the profile page (current while you are on it). Phone: the profile page as the last bottom tab (ຂ້ອຍ). Replaces a hand-made user button + phoneProfile." },
    ],
    notes: ["Motion: page = 320 ms slide + fade (transform/opacity only), header bar = 400 ms, bottom nav rises once on load. Lite mode shortens the page swap to 150 ms and snaps the rail.",
      "Page gutter: main pads every page 16 px on a phone and 24 px from 768 px, plus room for the bottom nav. Pages must NOT add their own outer p-4 - that doubles the margin and makes tabs look misaligned. Root a phone page with mx-auto flex w-full max-w-md flex-col gap-4. See Design thinking → One page gutter."],
  },
  {
    slug: "sidebar", name: "Sidebar", group: "Layout & navigation", badge: "New",
    desc: "Navy rail. The active pill springs between items with a gold edge and a glow behind the icon; icons pop when clicked; the logo spins in once. Collapses to a 72 px icon rail with tooltips.",
    file: "packages/ui/src/components/shell.tsx", importLine: 'import { Sidebar, SidebarSheet } from "@vks-kit/ui"',
    demo: () => <SidebarDemo />,
    code: `const [mini, setMini] = useState(false)
<Sidebar items={nav} active={page} onNavigate={setPage} title="VKS QC"
  collapsible collapsed={mini} onCollapsedChange={setMini}
  user={<UserChip />} />   {/* wrap user text in .vks-rail-fade so it hides when collapsed */}`,
    examples: [
      { id: "sheet", device: "mobile", title: "Phone drawer", note: "Same rail as a left sheet for phone apps that need more than 5 destinations. Picking an item closes it.", demo: () => <SidebarSheetDemo />, code: `<SidebarSheet open={open} onOpenChange={setOpen} items={nav} active={page} onNavigate={setPage} title="VKS QC" />` },
    ],
    props: [
      { name: "items / active / onNavigate / title / user", type: "", desc: "Same as AppShell." },
      { name: "collapsible", type: "boolean", def: "false", desc: "Show the collapse button at the bottom." },
      { name: "collapsed / defaultCollapsed / onCollapsedChange", type: "boolean / boolean / (c) => void", desc: "Controlled or uncontrolled icon rail." },
      { name: "persist", type: "boolean", def: "false", desc: "Remember the state in localStorage (AppShell turns this on)." },
    ],
    notes: ["Desktop only: a 240 px rail needs a wide canvas. On a phone use BottomNav (up to 5 places) or the SidebarSheet drawer below.", "Collapsed: labels fade + slide out (200 ms), the width eases over 320 ms, badges turn into a gold dot, every item gets a right-side tooltip. The width transition is the one non-transform animation we allow: a single element on desktop only. Lite mode snaps it."],
  },
  {
    slug: "bottom-nav", name: "Bottom nav & FAB", group: "Layout & navigation", badge: "Mobile",
    desc: "56 px tall tabs above the phone's home bar. The FAB sits above it on the right.",
    file: "packages/ui/src/components/shell.tsx", importLine: 'import { BottomNav, Fab } from "@vks-kit/ui"',
    demo: () => <PhoneFrame frame="bottom-nav" h={320} />,
    code: `<BottomNav items={nav} active={page} onNavigate={setPage} />
<Fab label="ສະແກນ" icon={<ScanLine />} onClick={scan} />   {/* aria-label required */}`,
    props: [{ name: "label", type: "string", desc: "Fab: required, read by screen readers." }, { name: "icon", type: "ReactNode", def: "<Plus />", desc: "Fab." }],
  },
  {
    slug: "page-header", name: "Page header", group: "Layout & navigation", badge: "Stable",
    desc: "Title, subtitle and actions. Actions hide on a phone: put the main one in the FAB.",
    file: "packages/ui/src/components/shell.tsx", importLine: 'import { PageHeader, LargeTitleBar, docTitleText } from "@vks-kit/ui"',
    demo: () => <PageHeaderDemo />,
    code: `<PageHeader title="ພະນັກງານ" subtitle="128 ຄົນ" actions={<Button variant="action"><Plus />ເພີ່ມ</Button>} />`,
    props: [
      { name: "title / subtitle / eyebrow", type: "string / string / ReactNode", desc: "" }, { name: "actions", type: "ReactNode", desc: "Hidden on a phone: put the main one in the Fab." },
      { name: "docTitle", type: "boolean | string", desc: "Also name the browser tab. true = title. React 19 moves the <title> into <head>." },
      { name: "appName", type: "string", desc: "After the page in the tab: \"ກະ · VKS HR\"." }, { name: "badge", type: "number", desc: "Count in front: \"(3) ກະ · VKS HR\"; 0 hides it." },
    ],
    notes: ["Use docTitle on every top-level page so people with 5 VKS tabs open can tell them apart. docTitleText(title, appName, badge) builds the same text if you need it elsewhere."],
    examples: [{ id: "large-title", title: "iOS large title (phone)", note: "Big title that shrinks into the centred bar as the window scrolls. Use on phone-first pages instead of PageHeader.",
      demo: () => <LargeTitleDemo />,
      code: `<LargeTitleBar title="ຕັ້ງຄ່າ" onBack={() => history.back()} backLabel="ກັບ" trailing={<Button size="icon" variant="ghost"><Plus /></Button>} />` }],
  },
  {
    slug: "login-card", name: "Login card", group: "Layout & navigation", badge: "Stable",
    desc: "Compact centred sign-in card with the logo shine, for simple apps and phones. For a full-page split-screen login with a brand panel use LoginScreen instead.",
    file: "packages/ui/src/components/shell.tsx", importLine: 'import { LoginCard } from "@vks-kit/ui"',
    demo: () => <PhoneFrame frame="login-card" />,
    code: `<LoginCard title="ເຂົ້າສູ່ລະບົບ" subtitle="ໃສ່ລະຫັດພະນັກງານ">
  <Input placeholder="G001" />
  <Button className="w-full">ເຂົ້າ</Button>
</LoginCard>`,
  },
  {
    slug: "login-screen", name: "Login screen", group: "Layout & navigation", badge: "New",
    desc: "Premium full-page sign-in (for the compact centred card use LoginCard instead). Desktop: navy aurora brand panel with feature list beside the form. Phone: logo on top, form centred, safe-area padding.",
    file: "packages/ui/src/components/account.tsx", importLine: 'import { LoginScreen } from "@vks-kit/ui"',
    demo: LoginAdaptive,
    code: `<LoginScreen title="ຍິນດີຕ້ອນຮັບກັບມາ" subtitle="ໃສ່ລະຫັດພະນັກງານ"
  tagline="ຄວາມປອດໄພ ທີ່ທ່ານໄວ້ວາງໃຈ"
  features={[{ label: "ຕິດຕາມການລາດຕະເວນ" }, { icon: <Clock />, label: "ບັນທຶກການມາວຽກ" }]}
  footer={<span>ລືມລະຫັດ?</span>}>
  <FloatingInput label="ລະຫັດພະນັກງານ" />
  <PasswordInput placeholder="ລະຫັດຜ່ານ" />
  <Button className="w-full" size="lg">ເຂົ້າສູ່ລະບົບ</Button>
</LoginScreen>`,
    props: [
      { name: "title / subtitle", type: "string", desc: "Heading above the form." }, { name: "children", type: "ReactNode", desc: "The form." },
      { name: "tagline", type: "string", desc: "Big headline on the desktop brand panel (defaults to title)." },
      { name: "features", type: "{ icon?; label }[]", desc: "Bullets on the brand panel (desktop only)." },
      { name: "footer", type: "ReactNode", desc: "Help line under the form." }, { name: "brand", type: "string", def: "BRAND.name", desc: "" },
    ],
  },
  {
    slug: "profile-view", name: "Profile view", group: "Layout & navigation", badge: "New", bleed: true,
    desc: "Employee / account profile. Desktop: sticky identity card on the left, grouped settings on the right. Phone: an iOS-contact-style header (big avatar, round call / message / edit buttons) edge to edge, then one stacked column.",
    file: "packages/ui/src/components/account.tsx", importLine: 'import { ProfileView, type ProfileSection, type ProfileRow, type ProfileQuickAction } from "@vks-kit/ui"',
    demo: ProfileAdaptive,
    examples: [
      { id: "banner", title: "Banner header (default)", note: "variant=\"banner\" keeps the navy banner with the avatar overlapping it; add flush for an edge-to-edge phone layout.", demo: () => <div className="w-full md:p-8"><ProfileView flush name="ສົມຊາຍ ວົງສະຫວັນ" role="ເຈົ້າໜ້າທີ່ຮັກສາຄວາມປອດໄພ" code="VKS2207001" sections={[{ title: "ຂໍ້ມູນ", rows: [{ icon: <Phone />, label: "ເບີໂທ", value: "020 5555 1234" }] }]} actions={<Button variant="outline">ແກ້ໄຂໂປຣໄຟລ໌</Button>} /></div>, code: `<ProfileView flush name="ສົມຊາຍ" code="VKS2207001" actions={<Button variant="outline">ແກ້ໄຂ</Button>} sections={…} />` },
    ],
    code: `<ProfileView variant="actions" name="ສົມຊາຍ" role="ເຈົ້າໜ້າທີ່" code="VKS2207001" status="online"
  stats={[{ label: "ມື້ມາວຽກ", value: 24 }]}
  quickActions={[
    { icon: <Phone />, label: "ໂທ", onPress: call },
    { icon: <MessageCircle />, label: "ຂໍ້ຄວາມ", onPress: message },
    { icon: <Pencil />, label: "ແກ້ໄຂ", onPress: edit },
  ]}
  sections={[{ title: "ຂໍ້ມູນ", rows: [{ icon: <Phone />, label: "ເບີໂທ", value: "020…" }] }]}
  onSignOut={signOut} />`,
    props: [
      { name: "name / role / code / src / status", type: "string / AvatarStatus", desc: "Identity card; avatar falls back to initials." },
      { name: "stats", type: "{ label; value }[]", desc: "Up to 4 numbers under the name." },
      { name: "flush", type: "boolean", desc: "Phone only: the identity header runs edge to edge and lists keep one 16 px margin. Desktop is unchanged." },
      { name: "variant", type: '"banner" | "actions"', def: '"banner"', desc: "Phone only: \"actions\" drops the navy banner for a soft header with a big avatar and implies flush. Round quick-action buttons also show in the desktop identity card. Everything else on desktop is unchanged." },
      { name: "quickActions", type: "{ icon; label; onPress? }[]", desc: "Round 56 px icon buttons with a label under the name (call, message, edit…). Keep to 3-4." },
      { name: "sections", type: "{ title?; rows: ProfileRow[] }[]", desc: "Row = icon, label, value, trailing (e.g. Switch) or onPress (shows a chevron)." },
      { name: "actions", type: "ReactNode", desc: "Buttons in the identity card." }, { name: "onSignOut / signOutLabel", type: "() => void / string", desc: "Red sign-out row at the bottom." },
    ],
  },
  {
    slug: "wizard", name: "Wizard", group: "Layout & navigation", badge: "New",
    desc: "Multi-step form with a step bar. Long forms on a phone should always be a wizard.",
    file: "packages/ui/src/components/wizard.tsx", importLine: 'import { Wizard } from "@vks-kit/ui"',
    demo: () => <WizardDemo />,
    code: `<Wizard steps={["ຂໍ້ມູນ", "ຮູບ", "ຢືນຢັນ"]} step={step} onStep={setStep} onFinish={submit}
  canNext={valid} finishLabel="ສົ່ງ" nextLabel="ຕໍ່ໄປ" backLabel="ກັບຄືນ">
  {step === 0 && <InfoStep />}
</Wizard>`,
    props: [
      { name: "steps", type: "string[]", desc: "" }, { name: "step / onStep", type: "number / (i) => void", desc: "0-based." },
      { name: "onFinish", type: "() => void", desc: "" }, { name: "canNext", type: "boolean", def: "true", desc: "Disable Next until the step is valid." },
      { name: "finishLabel / nextLabel / backLabel", type: "string", def: '"Done" / "Next" / "Back"', desc: "" },
    ],
  },
  {
    slug: "touch", name: "Pull to refresh & swipe row", group: "Mobile & touch", badge: "Mobile",
    desc: "The two gestures guards already know from other apps. Both have a button fallback for accessibility.",
    file: "packages/ui/src/components/touch.tsx", importLine: 'import { PullToRefresh, SwipeRow } from "@vks-kit/ui"',
    demo: () => <PhoneFrame frame="touch" h={440} />,
    code: `<PullToRefresh onRefresh={refetch}>          {/* 70 px pull */}
  {rows.map((r) => (
    <SwipeRow key={r.id} onAction={() => remove(r.id)} actionLabel="ລຶບ">
      <Row {...r} />
    </SwipeRow>
  ))}
</PullToRefresh>`,
    props: [
      { name: "onRefresh", type: "() => Promise<unknown>", desc: "PullToRefresh: spinner until it resolves." },
      { name: "SwipeRow width", type: "—", desc: "Always the width of its list (min-w-0, max-w-full): a long second line truncates instead of pushing the row and its action past the screen." },
      { name: "onAction", type: "() => void", desc: "SwipeRow." }, { name: "actionLabel", type: "string", def: '"ລຶບ"', desc: "" }, { name: "icon", type: "ReactNode", def: "<Trash2 />", desc: "" },
    ],
  },
]