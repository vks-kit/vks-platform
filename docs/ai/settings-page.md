# Settings page

> The one settings screen every app shares: 10 standard pages (ໂປຣໄຟລ໌, ຄວາມປອດໄພ, ແຈ້ງເຕືອນ, ການສະແດງຜົນ, ທົ່ວໄປ, ສະມາຊິກ & ສິດ, ການເຊື່ອມຕໍ່, ປະຫວັດ, ຂໍ້ມູນ, ເຂດອັນຕະລາຍ) plus one app page built only from 9 standard row types. Left nav with change counts, Ctrl K search, sticky save bar; on a phone a grouped list that opens each page full screen. save() gets only the diff, which also feeds the audit log.

- Group: Form · New
- Source: `packages/ui/src/components/settings.tsx`
- Live docs: #/docs/settings-page

```ts
import { SettingsPage, SettingsSection, SettingsRow, SettingsControl, SettingsSaveBar, SettingsHoldButton, SettingsTimeRange, defineSettings, settingsDiff } from "@vks-kit/ui"
```

## When to use

- **SettingsPage**: Use for the one settings screen every VKS app shares: 10 standard pages (profile, security, notifications, display, general, members, integrations, audit, data, danger) plus one app page built only from the 9 standard row types; save() receives only the diff. Desktop: left nav with per-page change counts + Ctrl K search + sticky save bar. Phone: grouped list that opens each page full screen. For a single small form use FormDialogContent instead.
- **SettingsSection**: Use for one titled card of rows on a settings page (icon tile, header, one muted sub line, one action on the right); for a plain panel use Card instead.
- **SettingsRow**: Use for one setting inside a SettingsSection: bold label (gold dot when changed), one muted help line, the control on the right and its error under it; set wide to put the control below the label. For a form field outside settings use Field / Label instead.
- **SettingsControl**: Use to draw the control for one app row type (text, number, switch, select, segmented, time-range, days, checkbox-list, action) from its SettingRowDef; SettingsPage uses it for every app group. For a custom control put it straight into SettingsRow instead.
- **SettingsSaveBar**: Use for the sticky "N unsaved changes · Cancel / Save" bar of a settings page; render it only while something changed. For a form inside a dialog use FormDialogContent instead.
- **SettingsHoldButton**: Use for an action that cannot be undone inside settings: press and hold (1.5 s by default) to run it, a red fill shows progress. For a confirm with text use ConfirmDialog holdToConfirm instead.
- **SettingsTimeRange**: Use for a start - end time pair in settings (stored as "08:00-17:00"), one 300 px field with the length pill ("9 ຊມ · ຂ້າມຄືນ"); for a full shift picker with presets use TimeRangePicker instead.

## Example

```tsx
const settings = defineSettings({
  core: ["profile", "security", "notifications", "display", "general", "members", "integrations", "audit", "data", "danger"],
  events: [{ id: "late", label: "ມາວຽກຊ້າ" }],            // extra rows in the notification matrix
  permissions: [{ id: "approveLeave", label: "ອະນຸມັດວັນພັກ" }], // extra rows in the role matrix
  app: [{ header: "ການກວດ", rows: [
    { key: "keepDays", type: "number", label: "ເກັບຂໍ້ມູນ", unit: "ມື້", min: 1, max: 999, default: 90 },
    { key: "hours", type: "time-range", label: "ຊ່ວງເວລາ", default: "08:00-17:00" },
  ] }],
  load: () => api.get("settings"),
  save: (diff) => api.post("settings", diff),   // [{ key: "app.keepDays", from: 90, to: 30 }]
})
<SettingsPage config={settings} />
```

### Building blocks on their own

Use the parts directly when a screen only needs a few settings.

```tsx
<SettingsSection icon={<Bell />} header="ແຈ້ງເຕືອນ" sub="ຂໍ້ຄວາມສັ້ນ">
  <SettingsRow label="ເປີດໃຊ້" help="ໜຶ່ງແຖວ" dirty={changed}><Switch checked={on} onCheckedChange={setOn} /></SettingsRow>
  <SettingsRow label="ເວລາ"><SettingsTimeRange value={range} onChange={setRange} /></SettingsRow>
</SettingsSection>
{count > 0 && <SettingsSaveBar count={count} onCancel={reset} onSave={save} />}
<SettingsHoldButton onConfirm={wipe}>ກົດຄ້າງ ເພື່ອລຶບ</SettingsHoldButton>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| config.core | CoreSettingsPage[] | all 10 | Which shared pages to show. Order inside the nav groups is fixed. |
| config.app | { header, sub?, icon?, tone?, rows }[] |  | Row types: text, number, switch, select, segmented, time-range, days, checkbox-list, action. Keys are stored as app.<key>. |
| config.events / permissions | { id, label, default? }[] |  | Rows appended to the notification and role matrices (4-char masks). |
| config.load / save | () => values / (diff) => void |  | save receives only changed keys; throw to keep the page dirty. |
| config.members / devices / integrations / audit / storage / info | lists |  | Read-only data the shared pages show. |
| config.onAction | (id, target?) => void |  | Buttons outside the save: security.password, members.invite, danger.reset, app.<key>… |
| commandK | boolean | true | Ctrl K opens the settings search. Set false when the app shell already uses Ctrl K. |
| showKinds | boolean | false | Template view: row-type tags, the 'slot' badge and the add-group placeholder. |

## Notes

- Apps only fill the app page; every other page looks and behaves the same everywhere.
- Layout follows the width the page gets: under 720 px (or on a phone) it switches to the grouped list.
- The theme switch applies at once and is not part of the save.
- Time ranges show their length ("9 ຊມ", "8 ຊມ · ຂ້າມຄືນ"); Save is disabled while any row has an error.
- vks-app's @vks-app/settings (SettingsLayout, SettingRow) is the older per-app version; new screens use this one.
