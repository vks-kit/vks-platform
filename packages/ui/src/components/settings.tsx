import * as React from "react"
import { Bell, Clock, Database, Download, Globe, History, Info, Lock, LogOut, Monitor, Moon, Plug, Plus, RefreshCw, Search, Settings, Shield, SlidersHorizontal, Smartphone, Sun, TriangleAlert, Upload, User, Users } from "lucide-react"
import { haptics } from "@vks-kit/core"
import { cn } from "../lib/cn"
import { useTheme } from "../lib/theme"
import { useIsMobile } from "../lib/use-media"
import { normTime } from "../lib/field-format"
import {
  type SettingsConfig, type SettingsValues, type SettingValue, type SettingRowDef, type SettingTone, type SettingsPageId, type SettingsAuditEntry,
  settingsDefaults, settingsDiff, dirtyByPage, settingsErrors, settingsLabels, splitTimeRange, rangeLengthLabel, settingText, settingPage,
  CORE_SETTINGS_PAGES, SETTINGS_CHANNELS, SETTINGS_EVENTS, SETTINGS_PERMISSIONS, SETTINGS_ROLES, SETTINGS_PAGE_LABELS,
} from "../lib/settings"
import { Button } from "./button"
import { Badge } from "./badge"
import { NumberInput, TextInput, PhoneInput } from "./fields"
import { Switch, Checkbox, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./form"
import { ToggleGroup, ToggleGroupItem } from "./toggle"
import { WeekdayPicker } from "./weekday-picker"
import { ListGroup, ListRow } from "./ios"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./overlay"
import { CommandPalette, useCommandK, type Command } from "./desktop-kit"
import { Avatar, Progress } from "./data-display"
import { Kbd } from "./extras"
import { toast } from "./toaster"

/* ------------------------------------------------------------------ tones + page meta */
const TONE: Record<SettingTone, string> = {
  primary: "bg-primary/12 text-primary", bar: "bg-bar text-bar-foreground", destructive: "bg-destructive/12 text-destructive",
  warning: "bg-warning/15 text-warning", gold: "bg-gold text-gold-foreground", success: "bg-success/12 text-success", muted: "bg-muted text-muted-foreground",
}
const PAGE_META: Record<SettingsPageId, { icon: React.ReactNode; tone: SettingTone; head: string }> = {
  profile: { icon: <User />, tone: "primary", head: "ຂໍ້ມູນຂອງທ່ານ ທີ່ຄົນອື່ນເຫັນໃນລະບົບ." },
  security: { icon: <Shield />, tone: "bar", head: "ລະຫັດຜ່ານ, ການຢືນຢັນ 2 ຂັ້ນ ແລະ ອຸປະກອນທີ່ເຂົ້າລະບົບ." },
  notifications: { icon: <Bell />, tone: "destructive", head: "ເລືອກວ່າຈະຮັບແຈ້ງເຕືອນຫຍັງ ແລະ ທາງໃດ." },
  display: { icon: <Sun />, tone: "warning", head: "ຮູບແບບ, ພາສາ ແລະ ຂະໜາດຕົວໜັງສື — ໃຊ້ກັບເຄື່ອງນີ້." },
  general: { icon: <Settings />, tone: "bar", head: "ຂໍ້ມູນພື້ນຖານຂອງອົງກອນ — ໃຊ້ຮ່ວມກັນທຸກແອັບ." },
  members: { icon: <Users />, tone: "primary", head: "ໃຜເຂົ້າໄດ້, ແລະ ເຮັດຫຍັງໄດ້." },
  integrations: { icon: <Plug />, tone: "gold", head: "ເຊື່ອມແອັບນີ້ກັບບໍລິການອື່ນ." },
  app: { icon: <SlidersHorizontal />, tone: "success", head: "ສ່ວນດຽວທີ່ແຕ່ລະແອັບປັບເອງ — ປະກອບຈາກແຖວມາດຕະຖານເທົ່ານັ້ນ." },
  audit: { icon: <History />, tone: "bar", head: "ທຸກການປ່ຽນການຕັ້ງຄ່າ — ໃຜ, ປ່ຽນຫຍັງ, ເມື່ອໃດ." },
  data: { icon: <Database />, tone: "muted", head: "ພື້ນທີ່, ການສຳຮອງ ແລະ ການສົ່ງອອກ." },
  danger: { icon: <TriangleAlert />, tone: "destructive", head: "ສິ່ງທີ່ເຮັດແລ້ວ ກັບຄືນບໍ່ໄດ້. ກົດຄ້າງ 1.5 ວິນາທີເພື່ອຢືນຢັນ." },
}
const NAV_GROUPS: { label: string; pages: SettingsPageId[] }[] = [
  { label: "ບັນຊີ", pages: ["profile", "security", "notifications", "display"] },
  { label: "ອົງກອນ", pages: ["general", "members", "integrations"] },
  { label: "ແອັບນີ້", pages: ["app"] },
  { label: "ລະບົບ", pages: ["audit", "data", "danger"] },
]
const tile = (tone: SettingTone, size = "size-7") => cn("flex shrink-0 items-center justify-center rounded-lg [&_svg]:size-4", size, TONE[tone])
const rowDomId = (key: string) => "set-" + key.replace(/[^\w-]/g, "-")

/* ------------------------------------------------------------------ building blocks */
/** Use for one titled card of rows on a settings page (icon tile, header, one muted sub line, one action on the right); for a plain panel use Card instead. */
export function SettingsSection({ icon, tone = "primary", header, sub, action, children, className, id }: {
  icon?: React.ReactNode; tone?: SettingTone; header: React.ReactNode; sub?: React.ReactNode; action?: React.ReactNode; children?: React.ReactNode; className?: string; id?: string
}) {
  return (
    <section id={id} className={cn("overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgb(20_23_61/.05)]", className)}>
      <header className="flex items-center gap-3 border-b px-4 py-3 sm:px-5">
        {icon && <span className={tile(tone, "size-8")} aria-hidden>{icon}</span>}
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold leading-normal">{header}</h3>
          {sub && <p className="text-xs leading-normal text-muted-foreground">{sub}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="divide-y">{children}</div>
    </section>
  )
}

/** Use for one setting inside a SettingsSection: bold label (gold dot when changed), one muted help line, the control on the right and its error under it; set wide to put the control below the label. For a form field outside settings use Field / Label instead. */
export function SettingsRow({ label, help, dirty, error, wide, kind, children, id, flash, className }: {
  label: React.ReactNode; help?: React.ReactNode; dirty?: boolean; error?: string; wide?: boolean; kind?: string
  children?: React.ReactNode; id?: string; flash?: boolean; className?: string
}) {
  return (
    <div id={id} className={cn("relative grid min-h-[72px] items-center gap-x-8 gap-y-2.5 px-4 py-4 sm:px-5", !wide && "sm:grid-cols-[minmax(0,1fr)_auto]", className)}>
      <span aria-hidden className={cn("pointer-events-none absolute inset-0 bg-gold/15 opacity-0 transition-opacity duration-700", flash && "opacity-100")} />
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-[14.5px] font-semibold leading-normal">
          {label}
          {dirty && <span className="size-1.5 rounded-full bg-gold" aria-label="ປ່ຽນແລ້ວ ຍັງບໍ່ບັນທຶກ" />}
          {kind && <span className="rounded-md border border-dashed px-1.5 font-mono text-[10.5px] font-normal text-muted-foreground">{kind}</span>}
        </div>
        {help && <p className="mt-0.5 text-[13px] leading-normal text-muted-foreground">{help}</p>}
      </div>
      {children != null && (
        <div className={cn("relative flex min-w-0 flex-col gap-1.5", !wide && "sm:items-end")}>
          {children}
          {error && <p role="alert" className="text-xs leading-normal text-destructive sm:w-[300px]">{error}</p>}
        </div>
      )}
    </div>
  )
}

/** Use for the sticky "N unsaved changes · Cancel / Save" bar of a settings page; render it only while something changed. For a form inside a dialog use FormDialogContent instead. */
export function SettingsSaveBar({ count, onCancel, onSave, saving, disabled, note, className }: {
  count: number; onCancel: () => void; onSave: () => void; saving?: boolean; disabled?: boolean; note?: string; className?: string
}) {
  return (
    <div role="region" aria-label="ບັນທຶກການປ່ຽນແປງ" className={cn("sticky bottom-3 z-20 flex items-center gap-3 rounded-2xl border bg-card px-4 py-2.5 shadow-[0_18px_40px_-18px_rgb(20_23_61/.45)] animate-in fade-in slide-in-from-bottom-2", className)}>
      <span className="size-2 shrink-0 rounded-full bg-gold" aria-hidden />
      <div className="min-w-0 flex-1 text-sm leading-normal">
        <b className="tabular-nums">{count}</b> ການປ່ຽນແປງທີ່ຍັງບໍ່ບັນທຶກ
        {note && <span className="block text-xs text-destructive">{note}</span>}
      </div>
      <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>ຍົກເລີກ</Button>
      <Button size="sm" onClick={onSave} loading={saving} disabled={disabled}>ບັນທຶກ</Button>
    </div>
  )
}

/** Use for an action that cannot be undone inside settings: press and hold (1.5 s by default) to run it, a red fill shows progress. For a confirm with text use ConfirmDialog holdToConfirm instead. */
export function SettingsHoldButton({ children, onConfirm, ms = 1500, disabled, className }: { children: React.ReactNode; onConfirm: () => void; ms?: number; disabled?: boolean; className?: string }) {
  const [p, setP] = React.useState(0)
  const raf = React.useRef(0), done = React.useRef(false)
  React.useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const stop = () => { cancelAnimationFrame(raf.current); if (!done.current) setP(0) }
  const start = () => {
    if (disabled) return
    done.current = false
    const t0 = performance.now()
    const tick = (now: number) => {
      const x = Math.min(1, (now - t0) / ms); setP(x)
      if (x >= 1) { done.current = true; haptics.success(); onConfirm(); window.setTimeout(() => { done.current = false; setP(0) }, 900) }
      else raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  return (
    <button
      type="button" disabled={disabled}
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start() } }} onKeyUp={stop}
      className={cn("relative h-11 select-none overflow-hidden rounded-lg border border-destructive/40 bg-card px-4 text-sm font-semibold text-destructive outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 disabled:opacity-50 [-webkit-touch-callout:none]", className)}
    >
      <span aria-hidden className="absolute inset-0 origin-left bg-destructive/15" style={{ transform: "scaleX(" + p + ")" }} />
      <span className="relative">{p >= 1 ? "ສຳເລັດ" : children}</span>
    </button>
  )
}

/** Use for a start - end time pair in settings (stored as "08:00-17:00"), one 300 px field with the length pill ("9 ຊມ · ຂ້າມຄືນ"); for a full shift picker with presets use TimeRangePicker instead. */
export function SettingsTimeRange({ value, onChange, invalid, disabled, className, "aria-label": ariaLabel = "ເວລາ" }: {
  value: string; onChange: (v: string) => void; invalid?: boolean; disabled?: boolean; className?: string; "aria-label"?: string
}) {
  const [s, e] = splitTimeRange(value)
  const [a, setA] = React.useState(s), [b, setB] = React.useState(e)
  React.useEffect(() => { setA(s); setB(e) }, [s, e])
  const commit = (x: string, y: string) => { const nx = normTime(x), ny = normTime(y); if (nx) setA(nx); if (ny) setB(ny); if (nx && ny) onChange(nx + "-" + ny) }
  const inCls = "w-[5.2ch] bg-transparent text-center font-mono text-base tabular-nums outline-none"
  const clean = (v: string) => v.replace(/[^\d:]/g, "").slice(0, 5)
  return (
    <div aria-invalid={invalid || undefined} className={cn("vks-field flex h-11 w-[300px] max-w-full items-center gap-2 rounded-lg border border-input bg-card pl-3 pr-1.5 focus-within:border-ring aria-[invalid=true]:border-destructive", disabled && "opacity-50", className)}>
      <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <input aria-label={ariaLabel + " ເລີ່ມ"} inputMode="numeric" disabled={disabled} value={a} onChange={(ev) => setA(clean(ev.target.value))} onBlur={() => commit(a, b)} className={inCls} />
      <span className="text-muted-foreground" aria-hidden>→</span>
      <input aria-label={ariaLabel + " ເລີກ"} inputMode="numeric" disabled={disabled} value={b} onChange={(ev) => setB(clean(ev.target.value))} onBlur={() => commit(a, b)} className={inCls} />
      <span className="ml-auto truncate rounded-full bg-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-muted-foreground">{rangeLengthLabel(normTime(a), normTime(b))}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ small internal controls */
function Pick({ value, onChange, options, label, className }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string; className?: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className={cn("w-[300px] max-w-full", className)}><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}
function Seg({ value, onChange, options, label, width = 240 }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; label: string; width?: number }) {
  return (
    <ToggleGroup variant="segmented" type="single" aria-label={label} value={value} onValueChange={(v: string) => v && onChange(v)} style={{ width }} className="max-w-full">
      {options.map((o) => <ToggleGroupItem key={o.value} value={o.value}>{o.label}</ToggleGroupItem>)}
    </ToggleGroup>
  )
}
const asText = (v: SettingValue | undefined) => (v == null ? "" : String(v))
const flipMask = (mask: string, i: number) => mask.slice(0, i) + (mask[i] === "1" ? "0" : "1") + mask.slice(i + 1)

/** Use to draw the control for one app row type (text, number, switch, select, segmented, time-range, days, checkbox-list, action) from its SettingRowDef; SettingsPage uses it for every app group. For a custom control put it straight into SettingsRow instead. */
export function SettingsControl({ row, value, onChange, invalid, onAction }: { row: SettingRowDef; value: SettingValue | undefined; onChange: (v: SettingValue) => void; invalid?: boolean; onAction?: () => void }) {
  const opts = row.options ?? []
  switch (row.type) {
    case "text": return <TextInput aria-label={row.label} value={asText(value)} onChange={onChange} invalid={invalid} className={cn("w-[300px] max-w-full", row.mono && "font-mono")} />
    case "number": return <NumberInput aria-label={row.label} value={typeof value === "number" ? value : null} onChange={onChange} min={row.min} max={row.max} step={row.step} unit={row.unit} invalid={invalid} className="w-[180px]" />
    case "switch": return <Switch aria-label={row.label} checked={value === true} onCheckedChange={onChange} />
    case "select": return <Pick label={row.label} value={asText(value)} onChange={onChange} options={opts} />
    case "segmented": return <Seg label={row.label} value={asText(value)} onChange={onChange} options={opts} width={Math.min(340, Math.max(200, opts.length * 110))} />
    case "time-range": return <SettingsTimeRange aria-label={row.label} value={asText(value)} onChange={onChange} invalid={invalid} />
    case "days": return <WeekdayPicker aria-label={row.label} value={asText(value)} onChange={onChange} invalid={invalid} />
    case "checkbox-list": {
      const on = Array.isArray(value) ? value : []
      return (
        <div className="grid gap-2 sm:grid-cols-3">
          {opts.map((o) => (
            <label key={o.value} className={cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm leading-normal transition-colors", on.includes(o.value) && "border-primary bg-accent")}>
              <Checkbox checked={on.includes(o.value)} onCheckedChange={(c) => onChange(c === true ? [...on, o.value] : on.filter((x) => x !== o.value))} />
              <span className="min-w-0"><span className="block font-semibold">{o.label}</span>{o.hint && <span className="block text-xs text-muted-foreground">{o.hint}</span>}</span>
            </label>
          ))}
        </div>
      )
    }
    case "action": return <Button variant="outline" onClick={() => { row.onAction?.(); onAction?.() }}>{row.actionLabel ?? row.label}</Button>
  }
}

function Matrix({ cols, rows, mask, onFlip, dirty }: { cols: readonly string[]; rows: { key: string; label: string }[]; mask: (k: string) => string; onFlip: (k: string, i: number) => void; dirty: (k: string) => boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-sm">
        <thead><tr className="text-xs text-muted-foreground"><th className="px-5 py-2.5 text-left font-semibold">ເຫດການ</th>{cols.map((c) => <th key={c} className="w-24 px-2 py-2.5 text-center font-semibold">{c}</th>)}</tr></thead>
        <tbody className="divide-y border-t">
          {rows.map((r) => (
            <tr key={r.key} id={rowDomId(r.key)}>
              <td className="px-5 py-1.5 font-semibold leading-normal"><span className="inline-flex items-center gap-2">{r.label}{dirty(r.key) && <span className="size-1.5 rounded-full bg-gold" />}</span></td>
              {cols.map((c, i) => (
                <td key={c} className="px-2 py-0.5 text-center">
                  <label className="inline-flex size-11 cursor-pointer items-center justify-center"><Checkbox aria-label={r.label + " · " + c} checked={mask(r.key)[i] === "1"} onCheckedChange={() => onFlip(r.key, i)} /></label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ the page */
/**
 * Use for the one settings screen every VKS app shares: 10 standard pages (profile, security, notifications, display, general, members,
 * integrations, audit, data, danger) plus one app page built only from the 9 standard row types; save() receives only the diff.
 * Desktop: left nav with per-page change counts + Ctrl K search + sticky save bar. Phone: grouped list that opens each page full screen.
 * For a single small form use FormDialogContent instead.
 */
export function SettingsPage({ config, showKinds = false, commandK = true, className }: {
  config: SettingsConfig; showKinds?: boolean
  /** Bind Ctrl K to the settings search. Turn off when the host page already owns Ctrl K; the search button still works. */
  commandK?: boolean; className?: string
}) {
  const defaults = React.useMemo(() => settingsDefaults(config), [config])
  const labels = React.useMemo(() => settingsLabels(config), [config])
  const [saved, setSaved] = React.useState<SettingsValues>(defaults)
  const [v, setV] = React.useState<SettingsValues>(defaults)
  const [saving, setSaving] = React.useState(false)
  const [log, setLog] = React.useState<SettingsAuditEntry[]>(config.audit ?? [])
  const [flashKey, setFlashKey] = React.useState<string | null>(null)
  const [cmdOpen, setCmdOpen] = React.useState(false)
  /* Layout follows the space the page gets, not the screen: a narrow column on a wide screen still gets the list layout. */
  const phone = useIsMobile()
  const box = React.useRef<HTMLDivElement>(null)
  const [narrow, setNarrow] = React.useState(false)
  React.useLayoutEffect(() => {
    const el = box.current; if (!el || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 720)); ro.observe(el); return () => ro.disconnect()
  }, [])
  const mobile = phone || narrow
  const { theme, setTheme } = useTheme()
  const [themeMode, setThemeMode] = React.useState<"light" | "dark" | "system">(theme)
  useCommandK(React.useCallback((fn: (o: boolean) => boolean) => { if (commandK) setCmdOpen(fn) }, [commandK]))

  React.useEffect(() => {
    let alive = true
    Promise.resolve(config.load?.()).then((got) => { if (!alive || !got) return; const next = { ...defaults, ...got } as SettingsValues; setSaved(next); setV(next) })
    return () => { alive = false }
  }, [config, defaults])

  const pages = React.useMemo(() => {
    const core: readonly SettingsPageId[] = config.core ?? CORE_SETTINGS_PAGES
    return NAV_GROUPS.map((g) => ({ ...g, pages: g.pages.filter((p) => (p === "app" ? !!config.app : core.includes(p))) })).filter((g) => g.pages.length)
  }, [config])
  const [page, setPage] = React.useState<SettingsPageId>(() => pages[0]?.pages[0] ?? "profile")
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const diff = React.useMemo(() => settingsDiff(saved, v), [saved, v])
  const dirtyKeys = React.useMemo(() => new Set(diff.map((d) => d.key)), [diff])
  const counts = React.useMemo(() => dirtyByPage(diff), [diff])
  const errors = React.useMemo(() => settingsErrors(config, v), [config, v])
  const errCount = Object.keys(errors).length
  const set = (k: string) => (x: SettingValue) => setV((o) => ({ ...o, [k]: x }))
  const str = (k: string) => asText(v[k])
  const act = (id: string, target?: string) => config.onAction?.(id, target)
  const pageLabel = (p: SettingsPageId) => (p === "app" ? config.appLabel ?? SETTINGS_PAGE_LABELS.app : SETTINGS_PAGE_LABELS[p])

  const save = async () => {
    if (!diff.length || errCount) return
    setSaving(true)
    try {
      await config.save?.(diff)
      const at = new Date().toLocaleString("en-GB", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
      setLog((l) => [...diff.map((d) => ({ who: "ທ່ານ", field: labels[d.key] ?? d.key, from: settingText(d.from), to: settingText(d.to), at })), ...l])
      setSaved(v); toast.success("ບັນທຶກແລ້ວ · " + diff.length + " ລາຍການ")
    } catch (e) { toast.error("ບັນທຶກບໍ່ສຳເລັດ", { description: e instanceof Error ? e.message : undefined }) }
    finally { setSaving(false) }
  }
  const cancel = () => setV(saved)

  const goTo = (key: string) => {
    const p = settingPage(key) as SettingsPageId
    setPage(p); if (mobile) setSheetOpen(true)
    window.setTimeout(() => { document.getElementById(rowDomId(key))?.scrollIntoView({ block: "center", behavior: "smooth" }); setFlashKey(key); window.setTimeout(() => setFlashKey(null), 1400) }, mobile ? 350 : 60)
  }
  const commands: Command[] = React.useMemo(() => Object.entries(labels)
    .filter(([k]) => pages.some((g) => g.pages.includes(settingPage(k) as SettingsPageId)))
    .map(([k, label]) => ({ id: k, label, group: pageLabel(settingPage(k) as SettingsPageId), onRun: () => goTo(k) })), [labels, pages]) // eslint-disable-line react-hooks/exhaustive-deps

  /** One standard row bound to key. */
  const R = (key: string, control: React.ReactNode, o: { help?: React.ReactNode; wide?: boolean; kind?: string; label?: React.ReactNode } = {}) => (
    <SettingsRow key={key} id={rowDomId(key)} label={o.label ?? labels[key] ?? key} help={o.help} wide={o.wide} kind={showKinds ? o.kind : undefined}
      dirty={dirtyKeys.has(key)} error={dirtyKeys.has(key) || key.startsWith("app.") ? errors[key] : undefined} flash={flashKey === key}>{control}</SettingsRow>
  )

  const pane = (p: SettingsPageId): React.ReactNode => {
    switch (p) {
      case "profile": return (
        <SettingsSection icon={<User />} tone="primary" header="ຂໍ້ມູນສ່ວນຕົວ">
          {R("profile.photo", <div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => act("profile.photo")}>ປ່ຽນຮູບ</Button><Button variant="ghost" size="sm" onClick={() => act("profile.photoRemove")}>ລຶບ</Button></div>,
            { label: <span className="flex items-center gap-3"><Avatar name={str("profile.name") || "?"} size={48} />{labels["profile.photo"]}</span> })}
          {R("profile.name", <TextInput aria-label={labels["profile.name"]} value={str("profile.name")} onChange={set("profile.name")} className="w-[300px] max-w-full" />)}
          {R("profile.code", <TextInput aria-label={labels["profile.code"]} value={str("profile.code")} onChange={() => {}} disabled clearable={false} className="w-[300px] max-w-full font-mono" />, { help: "ປ່ຽນໄດ້ໂດຍ HR ເທົ່ານັ້ນ." })}
          {R("profile.phone", <PhoneInput aria-label={labels["profile.phone"]} value={str("profile.phone")} onChange={(x) => set("profile.phone")(x)} invalid={!!errors["profile.phone"] && dirtyKeys.has("profile.phone")} className="w-[300px] max-w-full font-mono" />)}
          {R("profile.email", <TextInput aria-label={labels["profile.email"]} inputMode="email" autoComplete="email" value={str("profile.email")} onChange={set("profile.email")} className="w-[300px] max-w-full" />)}
        </SettingsSection>
      )
      case "security": {
        const devices = config.devices ?? []
        return <>
          <SettingsSection icon={<Lock />} tone="bar" header="ການເຂົ້າລະບົບ">
            {R("security.password", <Button variant="outline" onClick={() => act("security.password")}>ປ່ຽນລະຫັດຜ່ານ</Button>, { help: config.info?.passwordAge ? "ປ່ຽນຄັ້ງສຸດທ້າຍ " + config.info.passwordAge : undefined })}
            {R("security.twoFactor", <Switch aria-label={labels["security.twoFactor"]} checked={v["security.twoFactor"] === true} onCheckedChange={set("security.twoFactor")} />, { help: "ໃສ່ລະຫັດຈາກໂທລະສັບ ທຸກຄັ້ງທີ່ເຂົ້າຈາກເຄື່ອງໃໝ່." })}
            {R("security.autoLock", <Pick label={labels["security.autoLock"]} value={str("security.autoLock")} onChange={set("security.autoLock")} options={[{ value: "5", label: "5 ນາທີ" }, { value: "15", label: "15 ນາທີ" }, { value: "30", label: "30 ນາທີ" }, { value: "60", label: "1 ຊົ່ວໂມງ" }, { value: "never", label: "ບໍ່ລັອກ" }]} />)}
          </SettingsSection>
          <SettingsSection id={rowDomId("security.devices")} icon={<Monitor />} tone="primary" header="ອຸປະກອນທີ່ເຂົ້າລະບົບ" sub={devices.length + " ອຸປະກອນ"}
            action={devices.length > 1 && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => act("security.signoutAll")}>ອອກຈາກທຸກເຄື່ອງ</Button>}>
            {devices.length ? devices.map((d) => (
              <SettingsRow key={d.id} label={<span className="flex items-center gap-3"><span className={tile("muted", "size-9")} aria-hidden>{d.kind === "phone" ? <Smartphone /> : <Monitor />}</span>{d.name}{d.current && <Badge variant="success">ເຄື່ອງນີ້</Badge>}</span>}
                help={[d.where, d.lastSeen].filter(Boolean).join(" · ")}>
                {!d.current && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => act("security.signout", d.id)}><LogOut />ອອກຈາກລະບົບ</Button>}
              </SettingsRow>
            )) : <SettingsRow label="ບໍ່ມີອຸປະກອນອື່ນ" help="ມີແຕ່ເຄື່ອງນີ້ທີ່ເຂົ້າລະບົບ." />}
          </SettingsSection>
        </>
      }
      case "notifications": {
        const evs = [...SETTINGS_EVENTS, ...(config.events ?? [])].map((e) => ({ key: "notifications." + e.id, label: e.label }))
        return <>
          <SettingsSection icon={<Bell />} tone="destructive" header="ເຫດການ × ຊ່ອງທາງ" sub="ເຫດການຂອງແຕ່ລະແອັບ ເພີ່ມເຂົ້າໃນຕາຕະລາງນີ້">
            <Matrix cols={SETTINGS_CHANNELS} rows={evs} mask={str} dirty={(k) => dirtyKeys.has(k)} onFlip={(k, i) => setV((o) => ({ ...o, [k]: flipMask(asText(o[k]) || "0000", i) }))} />
          </SettingsSection>
          <SettingsSection icon={<Moon />} tone="bar" header="ຊ່ວງງຽບ" sub="ບໍ່ສົ່ງແຈ້ງເຕືອນທີ່ບໍ່ດ່ວນ">
            {R("notifications.quiet", <Switch aria-label={labels["notifications.quiet"]} checked={v["notifications.quiet"] === true} onCheckedChange={set("notifications.quiet")} />, { help: "ເຫດການ \"ລະບົບມີບັນຫາ\" ຍັງແຈ້ງຢູ່." })}
            {R("notifications.quietHours", <SettingsTimeRange aria-label={labels["notifications.quietHours"]} value={str("notifications.quietHours")} onChange={set("notifications.quietHours")} disabled={v["notifications.quiet"] !== true} invalid={!!errors["notifications.quietHours"]} />)}
          </SettingsSection>
        </>
      }
      case "display": return <>
        <SettingsSection icon={<Sun />} tone="warning" header="ຮູບແບບ">
          <SettingsRow id={rowDomId("display.theme")} label={labels["display.theme"]} help="ປ່ຽນທັນທີ, ບໍ່ຕ້ອງບັນທຶກ." flash={flashKey === "display.theme"}>
            <Seg label={labels["display.theme"]} width={300} value={themeMode} options={[{ value: "light", label: "ແຈ້ງ" }, { value: "dark", label: "ມືດ" }, { value: "system", label: "ຕາມລະບົບ" }]}
              onChange={(m) => { setThemeMode(m as typeof themeMode); setTheme(m === "system" ? (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light") : (m as "light" | "dark")) }} />
          </SettingsRow>
          {R("display.fontSize", <Seg label={labels["display.fontSize"]} width={300} value={str("display.fontSize")} onChange={set("display.fontSize")} options={[{ value: "sm", label: "ນ້ອຍ" }, { value: "md", label: "ປົກກະຕິ" }, { value: "lg", label: "ໃຫຍ່" }]} />)}
          {R("display.density", <Seg label={labels["display.density"]} width={240} value={str("display.density")} onChange={set("display.density")} options={[{ value: "comfortable", label: "ສະບາຍ" }, { value: "compact", label: "ກະທັດຮັດ" }]} />)}
        </SettingsSection>
        <SettingsSection icon={<Globe />} tone="primary" header="ພາສາ ແລະ ຮູບແບບ">
          {R("display.lang", <Seg label={labels["display.lang"]} width={220} value={str("display.lang")} onChange={set("display.lang")} options={[{ value: "lo", label: "ລາວ" }, { value: "en", label: "English" }]} />)}
          {R("display.dateFormat", <Pick label={labels["display.dateFormat"]} value={str("display.dateFormat")} onChange={set("display.dateFormat")} className="font-mono" options={["DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY"].map((x) => ({ value: x, label: x }))} />)}
          {R("display.numberFormat", <Pick label={labels["display.numberFormat"]} value={str("display.numberFormat")} onChange={set("display.numberFormat")} className="font-mono" options={["1,250,000", "1.250.000", "1 250 000"].map((x) => ({ value: x, label: x }))} />)}
        </SettingsSection>
      </>
      case "general": return <>
        <SettingsSection icon={<Settings />} tone="bar" header="ອົງກອນ">
          {R("general.orgName", <TextInput aria-label={labels["general.orgName"]} value={str("general.orgName")} onChange={set("general.orgName")} className="w-[300px] max-w-full" />)}
          {R("general.logo", <div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-xl bg-bar text-sm font-bold text-gold">{(str("general.orgName") || "VKS").slice(0, 3)}</span><Button variant="outline" onClick={() => act("general.logo")}><Upload />ອັບໂຫຼດ</Button></div>, { help: "PNG ຫຼື SVG, ສີ່ຫຼ່ຽມ, ຢ່າງໜ້ອຍ 256 px." })}
          {R("general.timezone", <Pick label={labels["general.timezone"]} value={str("general.timezone")} onChange={set("general.timezone")} options={[{ value: "Asia/Vientiane", label: "Asia/Vientiane (UTC+7)" }, { value: "Asia/Bangkok", label: "Asia/Bangkok (UTC+7)" }]} />)}
          {R("general.currency", <Pick label={labels["general.currency"]} value={str("general.currency")} onChange={set("general.currency")} options={[{ value: "LAK", label: "ກີບ (LAK)" }, { value: "THB", label: "ບາດ (THB)" }, { value: "USD", label: "ໂດລາ (USD)" }]} />)}
        </SettingsSection>
        <SettingsSection icon={<Clock />} tone="primary" header="ເວລາເຮັດວຽກ" sub="ໃຊ້ຄິດໄລ່ ມື້ເຮັດວຽກ ແລະ ເວລາຕອບກັບ">
          {R("general.workDays", <WeekdayPicker aria-label={labels["general.workDays"]} value={str("general.workDays")} onChange={set("general.workDays")} />)}
          {R("general.workHours", <SettingsTimeRange aria-label={labels["general.workHours"]} value={str("general.workHours")} onChange={set("general.workHours")} invalid={!!errors["general.workHours"]} />)}
          {R("general.weekStart", <Seg label={labels["general.weekStart"]} width={240} value={str("general.weekStart")} onChange={set("general.weekStart")} options={[{ value: "mon", label: "ວັນຈັນ" }, { value: "sun", label: "ວັນອາທິດ" }]} />)}
        </SettingsSection>
      </>
      case "members": {
        const ms = config.members ?? []
        const perms = [...SETTINGS_PERMISSIONS, ...(config.permissions ?? [])].map((x) => ({ key: "members.role." + x.id, label: x.label }))
        const pending = ms.filter((m) => m.status === "pending").length
        return <>
          <SettingsSection id={rowDomId("members.list")} icon={<Users />} tone="primary" header="ສະມາຊິກ" sub={ms.length + " ຄົນ" + (pending ? " · " + pending + " ລໍຖ້າ" : "")}
            action={<Button size="sm" onClick={() => act("members.invite")}><Plus />ເຊີນ</Button>}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead><tr className="text-left text-xs text-muted-foreground">{["ຊື່", "ພະແນກ", "ສິດ", "ສະຖານະ", "ເຂົ້າລ່າສຸດ", ""].map((h, i) => <th key={i} className="px-5 py-2.5 font-semibold">{h}</th>)}</tr></thead>
                <tbody className="divide-y border-t">
                  {ms.map((m) => (
                    <tr key={m.id}>
                      <td className="px-5 py-2"><span className="flex items-center gap-2.5 font-semibold leading-normal"><Avatar name={m.name} size={32} />{m.name}</span></td>
                      <td className="px-5 py-2 text-muted-foreground">{m.dept ?? "—"}</td>
                      <td className="px-5 py-2">{m.role}</td>
                      <td className="px-5 py-2">{m.status === "pending" ? <Badge variant="warning">ລໍຖ້າ</Badge> : <Badge variant="success" dot>ໃຊ້ງານ</Badge>}</td>
                      <td className="px-5 py-2 font-mono text-xs tabular-nums text-muted-foreground">{m.lastSeen ?? "—"}</td>
                      <td className="px-3 py-1 text-right"><Button variant="ghost" size="sm" onClick={() => act("members.edit", m.id)}>ແກ້ໄຂ</Button></td>
                    </tr>
                  ))}
                  {!ms.length && <tr><td colSpan={6} className="px-5 py-6 text-center text-muted-foreground">ຍັງບໍ່ມີສະມາຊິກ</td></tr>}
                </tbody>
              </table>
            </div>
          </SettingsSection>
          <SettingsSection id={rowDomId("members.roles")} icon={<Shield />} tone="bar" header="ສິດຕາມບົດບາດ" sub="ແຕ່ລະແອັບ ເພີ່ມແຖວສິດຂອງຕົນເອງໄດ້">
            <Matrix cols={SETTINGS_ROLES} rows={perms} mask={str} dirty={(k) => dirtyKeys.has(k)} onFlip={(k, i) => setV((o) => ({ ...o, [k]: flipMask(asText(o[k]) || "0000", i) }))} />
          </SettingsSection>
        </>
      }
      case "integrations": {
        const list = config.integrations ?? []
        const st = { connected: { b: <Badge variant="success" dot>ເຊື່ອມແລ້ວ</Badge>, a: "ຈັດການ" }, expired: { b: <Badge variant="warning">ຕ້ອງເຂົ້າໃໝ່</Badge>, a: "ເຊື່ອມໃໝ່" }, off: { b: <Badge variant="neutral">ບໍ່ໄດ້ເຊື່ອມ</Badge>, a: "ເຊື່ອມ" } }
        return (
          <div id={rowDomId("integrations.list")} className="grid gap-3 sm:grid-cols-2">
            {list.map((x) => (
              <div key={x.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-3"><span className={tile(x.status === "connected" ? "gold" : "muted", "size-10")} aria-hidden><Plug /></span>
                  <div className="min-w-0 flex-1"><p className="font-bold leading-normal">{x.name}</p>{x.detail && <p className="truncate text-xs leading-normal text-muted-foreground">{x.detail}</p>}</div>{st[x.status].b}</div>
                <Button variant={x.status === "off" ? "default" : "outline"} size="sm" className="self-start" onClick={() => act("integrations." + x.id, x.id)}>{x.actionLabel ?? st[x.status].a}</Button>
              </div>
            ))}
            {!list.length && <p className="text-sm text-muted-foreground">ຍັງບໍ່ມີບໍລິການ</p>}
          </div>
        )
      }
      case "app": {
        const groups = config.app ?? []
        return <>
          {groups.map((g, gi) => (
            <SettingsSection key={gi} icon={g.icon ?? <SlidersHorizontal />} tone={g.tone ?? "success"} header={g.header} sub={g.sub}>
              {g.rows.map((r) => r.type === "action"
                ? <SettingsRow key={r.key} id={rowDomId("app." + r.key)} label={r.label} help={r.help} kind={showKinds ? r.type : undefined}><SettingsControl row={r} value={undefined} onChange={() => {}} onAction={() => act("app." + r.key)} /></SettingsRow>
                : R("app." + r.key, <SettingsControl row={r} value={v["app." + r.key]} onChange={set("app." + r.key)} invalid={!!errors["app." + r.key]} />, { help: r.help, wide: r.wide ?? r.type === "checkbox-list", kind: r.type }))}
            </SettingsSection>
          ))}
          {(showKinds || !groups.length) && (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed p-5 text-sm text-muted-foreground transition-colors hover:border-gold">
              <span className={tile("muted", "size-9")} aria-hidden><Plus /></span>
              <div className="min-w-0 leading-normal"><b className="text-foreground">ເພີ່ມກຸ່ມຂອງແອັບ</b><br />ສ້າງຈາກ <code className="font-mono text-xs">{"<SettingsSection> + <SettingsRow>"}</code> ຫຼື config.app</div>
            </div>
          )}
        </>
      }
      case "audit": return (
        <SettingsSection id={rowDomId("audit.list")} icon={<History />} tone="bar" header="ລ່າສຸດ" sub="ເກັບໄວ້ 1 ປີ, ລຶບບໍ່ໄດ້" action={<Button variant="outline" size="sm" onClick={() => act("audit.export")}><Download />ສົ່ງອອກ CSV</Button>}>
          {log.length ? log.map((e, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 sm:px-5">
              <Avatar name={e.who} size={32} />
              <div className="min-w-0 flex-1 text-sm leading-normal">
                <b>{e.who}</b> ປ່ຽນ <b>{e.field}</b>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs"><s className="rounded bg-destructive/10 px-1.5 text-destructive">{e.from}</s><span aria-hidden>→</span><ins className="rounded bg-success/12 px-1.5 text-success no-underline">{e.to}</ins></div>
              </div>
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{e.at}</span>
            </div>
          )) : <SettingsRow label="ຍັງບໍ່ມີການປ່ຽນ" help="ທຸກການບັນທຶກຈະຂຶ້ນຢູ່ນີ້." />}
        </SettingsSection>
      )
      case "data": {
        const s = config.storage
        return <>
          <SettingsSection icon={<Database />} tone="muted" header="ພື້ນທີ່ເກັບໄຟລ໌">
            {s && R("data.storage", <div className="w-[300px] max-w-full"><Progress value={s.usedGb} max={s.totalGb} label={s.usedGb + " / " + s.totalGb + " GB"} /></div>)}
            {R("data.autoDelete", <Pick label={labels["data.autoDelete"]} value={str("data.autoDelete")} onChange={set("data.autoDelete")} options={[{ value: "3m", label: "3 ເດືອນ" }, { value: "6m", label: "6 ເດືອນ" }, { value: "1y", label: "1 ປີ" }, { value: "never", label: "ບໍ່ລຶບ" }]} />, { help: "ລຶບແຕ່ຮູບ ແລະ ໄຟລ໌ແນບ, ບໍ່ລຶບບັນທຶກ." })}
          </SettingsSection>
          <SettingsSection icon={<RefreshCw />} tone="success" header="ສຳຮອງຂໍ້ມູນ" sub={config.info?.lastBackup ? "ລ່າສຸດ: " + config.info.lastBackup : undefined}>
            {R("data.backup", <Switch aria-label={labels["data.backup"]} checked={v["data.backup"] === true} onCheckedChange={set("data.backup")} />)}
            {R("data.backupFreq", <Seg label={labels["data.backupFreq"]} width={240} value={str("data.backupFreq")} onChange={set("data.backupFreq")} options={[{ value: "daily", label: "ທຸກມື້" }, { value: "weekly", label: "ທຸກອາທິດ" }]} />)}
            {R("data.export", <Button variant="outline" onClick={() => act("data.export")}><Download />ສົ່ງອອກ .xlsx</Button>)}
          </SettingsSection>
        </>
      }
      case "danger": return (
        <SettingsSection icon={<TriangleAlert />} tone="destructive" header="ກັບຄືນບໍ່ໄດ້">
          {R("danger.reset", <SettingsHoldButton onConfirm={() => act("danger.reset")}>ກົດຄ້າງ ເພື່ອລ້າງ</SettingsHoldButton>, { help: "ທຸກການຕັ້ງຄ່າກັບໄປເປັນຄ່າເລີ່ມຕົ້ນ." })}
          {R("danger.transfer", <SettingsHoldButton onConfirm={() => act("danger.transfer")}>ກົດຄ້າງ ເພື່ອໂອນ</SettingsHoldButton>, { help: "ທ່ານຈະເປັນຜູ້ຈັດການ." })}
          {R("danger.purge", <SettingsHoldButton onConfirm={() => act("danger.purge")}>ກົດຄ້າງ ເພື່ອລຶບ</SettingsHoldButton>, { help: "ລຶບແຕ່ຂໍ້ມູນທີ່ໝາຍວ່າ ທົດລອງ." })}
        </SettingsSection>
      )
    }
  }

  const head = (p: SettingsPageId) => (
    <div className="mb-1">
      <h2 className="text-xl font-bold leading-normal">{pageLabel(p)}</h2>
      <p className="text-sm leading-normal text-muted-foreground">{PAGE_META[p].head}</p>
    </div>
  )
  const saveBar = diff.length > 0 && (
    <SettingsSaveBar count={diff.length} onCancel={cancel} onSave={save} saving={saving} disabled={errCount > 0} note={errCount ? "ແກ້ " + errCount + " ຈຸດທີ່ຜິດກ່ອນບັນທຶກ" : undefined} />
  )
  const palette = <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} commands={commands} placeholder="ຄົ້ນຫາການຕັ້ງຄ່າ..." />
  const tag = (p: SettingsPageId) => counts[p] ? <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold tabular-nums text-gold-foreground">{counts[p]}</span> : null

  if (mobile) return (
    <div ref={box} className={cn("space-y-5", className)}>
      <button type="button" onClick={() => setCmdOpen(true)} className="flex h-11 w-full items-center gap-2 rounded-xl bg-muted px-3 text-base text-muted-foreground"><Search className="size-4" />ຄົ້ນຫາການຕັ້ງຄ່າ</button>
      {pages.map((g) => (
        <ListGroup key={g.label} header={g.label}>
          {g.pages.map((p) => <ListRow key={p} icon={PAGE_META[p].icon} iconClass={TONE[PAGE_META[p].tone]} label={pageLabel(p)} destructive={p === "danger"} detail={tag(p)} onPress={() => { setPage(p); setSheetOpen(true) }} />)}
        </ListGroup>
      ))}
      {diff.length > 0 && !sheetOpen && saveBar}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="fullscreen">
          <SheetTitle className="sr-only">{pageLabel(page)}</SheetTitle>
          <SheetDescription className="sr-only">{PAGE_META[page].head}</SheetDescription>
          <div className="h-full space-y-4 overflow-y-auto px-4 pb-6 pt-14">{head(page)}{pane(page)}{saveBar}</div>
        </SheetContent>
      </Sheet>
      {palette}
    </div>
  )

  return (
    <div ref={box} className={cn("grid grid-cols-[260px_minmax(0,1fr)] items-start gap-6", className)}>
      <nav aria-label="ໝວດການຕັ້ງຄ່າ" className="sticky top-4 space-y-4">
        <button type="button" onClick={() => setCmdOpen(true)} className="flex h-11 w-full items-center gap-2 rounded-xl border bg-card px-3 text-sm text-muted-foreground hover:border-ring">
          <Search className="size-4" /><span className="flex-1 text-left">ຄົ້ນຫາ</span>{commandK && <Kbd>Ctrl K</Kbd>}
        </button>
        {pages.map((g) => (
          <div key={g.label}>
            <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{g.label}</p>
            {g.pages.map((p) => {
              const on = p === page
              return (
                <button key={p} type="button" aria-current={on ? "page" : undefined} onClick={() => setPage(p)}
                  className={cn("relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold leading-normal transition-colors hover:bg-muted/70", on && "bg-card shadow-[0_1px_2px_rgb(20_23_61/.08)] ring-1 ring-border", p === "danger" && "text-destructive")}>
                  {on && <span aria-hidden className="absolute inset-y-2.5 left-0 w-[3px] rounded-full bg-gold" />}
                  <span className={tile(PAGE_META[p].tone)} aria-hidden>{PAGE_META[p].icon}</span>
                  <span className="min-w-0 flex-1 truncate">{pageLabel(p)}</span>
                  {tag(p) ?? (p === "app" && showKinds && <span className="rounded border border-dashed px-1.5 font-mono text-[10px] text-muted-foreground">slot</span>)}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
      <div key={page} className="min-w-0 space-y-4 animate-in fade-in">
        {head(page)}
        {page === "app" && showKinds && (
          <div className="flex items-start gap-3 rounded-xl border-l-4 border-primary bg-accent p-3 text-sm leading-normal"><Info className="mt-0.5 size-4 shrink-0 text-primary" />ແມ່ແບບ — ຕົວຢ່າງຂອງທຸກແບບແຖວ. ແຕ່ລະແອັບໃຊ້ສະເພາະແຖວທີ່ຕ້ອງການ.</div>
        )}
        {pane(page)}
        {saveBar}
      </div>
      {palette}
    </div>
  )
}
