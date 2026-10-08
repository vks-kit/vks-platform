# Form dialog

> The frame for every form in a popup: sticky title and footer, only the body scrolls and never sideways. sm / md / lg widths on desktop, a sheet on a phone. Field = label + control + error or hint; FormSection = a muted group title.

- Group: Form · New
- Source: `packages/ui/src/components/form-dialog.tsx`
- Live docs: #/docs/form-dialog

```ts
import { FormDialogContent, Field, FormSection, type FormDialogSize } from "@vks-kit/ui"
```

## When to use

- **FormDialogContent**: Use for any form inside a Dialog: sticky header + footer, only the body scrolls (never sideways), sm/md/lg widths on desktop, sheet on phone; for a yes/no question use ConfirmDialog instead.
- **Field**: Use for one labelled control in a form (label, the control, then an error or a muted hint); for a read-only value use Facts instead.
- **FormSection**: Use for a muted section title between groups of fields in a form body; for a page title use PageHeader instead.

## Example

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <FormDialogContent size="md" title="ເພີ່ມສະຖານທີ່"
    footer={<><Button variant="outline" onClick={close}>ຍົກເລີກ</Button><Button onClick={save}>ບັນທຶກ</Button></>}>
    <div className="grid gap-4 sm:grid-cols-2">
      <FormSection className="sm:col-span-2">ຂໍ້ມູນທົ່ວໄປ</FormSection>
      <Field label="ຊື່ສະຖານທີ່" htmlFor="name" error={err.name}><Input id="name" … /></Field>
      <Field label="ລະຫັດ" htmlFor="id" hint="ເຊັ່ນ VKS26-001"><Input id="id" … /></Field>
    </div>
  </FormDialogContent>
</Dialog>
```

### Large (long forms)

lg is 64rem wide on desktop; use a 2-column grid in the body.

```tsx
<FormDialogContent size="lg" title="…" footer={…}>…</FormDialogContent>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| title / description | ReactNode |  | Sticky header. Keep the description to one line. |
| footer | ReactNode |  | Sticky footer, buttons right-aligned; respects the phone safe area. |
| size | "sm" \| "md" \| "lg" | "md" | Desktop width: 36 / 48 / 64 rem. A phone always gets the full-width sheet. |
| bodyClassName | string |  | Extra classes on the scrolling body. |
| icon | ReactNode |  | Optional icon tile left of the title; desktop only (hidden on phone). |
| Field: label / htmlFor / error / hint | ReactNode / string |  | error (red) replaces hint (muted) when set. |

## Notes

- Put it inside a Dialog, in place of DialogContent.
- Records open read-only first (Facts / FactGrid) with a ແກ້ໄຂ button; the form is the edit step.
- Run cleanText() on free text before saving.
