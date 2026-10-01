# Dialog

> Bottom sheet on a phone (thumb reach), centred box on desktop. Gold top edge.

- Group: Overlays · Stable
- Source: `packages/ui/src/components/overlay.tsx`
- Live docs: #/docs/dialog

```ts
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, InSheetView, useInSheet } from "@vks/ui"
```

## When to use

- **Dialog**: Use for a modal that needs the user's full attention (form, detail); bottom sheet on phones, centred on desktop. Pair with DialogTrigger + DialogContent. For a yes/no confirmation use ConfirmDialog instead; for a side panel use Sheet or Drawer instead; for an iOS-style alert use IOSAlert instead.
- **DialogTrigger**: Use for the element that opens a Dialog (use asChild with a Button). For opening a Sheet use SheetTrigger instead.
- **DialogContent**: Use for the panel of a Dialog (scrim, grabber on phones, close X built in). For a panel from the side use SheetContent instead.
- **DialogHeader**: Use for the title block at the top of DialogContent (DialogTitle + DialogDescription). For a card heading use CardHeader instead.
- **DialogTitle**: Use for the required accessible heading of a Dialog or Sheet. For page headings use PageHeader instead.
- **DialogDescription**: Use for one muted explanatory line under DialogTitle. For longer body text use a <p> inside DialogContent instead.
- **DialogFooter**: Use for the action buttons at the bottom of DialogContent. For card actions use CardFooter instead.
- **DialogClose**: Use to wrap a custom button that closes its Dialog (use asChild). The X in the corner is already built in; for confirm + cancel use ConfirmDialog instead.
- **InSheetView**: Use to show a second step (a picker, a detail) INSIDE an open Dialog or Sheet: it slides in over the same panel with a back arrow, so a phone never gets a sheet on top of a sheet. Esc / back arrow return to the form. Outside a Dialog/Sheet it renders nothing; there use Sheet instead. Combobox, DatePicker and DateRangePicker use it automatically.

## Example

```tsx
<Dialog>
  <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>ຢືນຢັນການບັນທຶກ?</DialogTitle>
      <DialogDescription>ຂໍ້ມູນຈະຖືກສົ່ງໄປຫາສູນຄວບຄຸມ.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">ຍົກເລີກ</Button></DialogClose>
      <Button variant="action">ບັນທຶກ</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Picker inside a dialog (no sheet on a sheet)

```tsx
<DialogContent>
  {/* ≤ 5 options: inline chips, no picker */}
  <FilterChips options={kinds} value={kind} onChange={setKind} />
  {/* long list: popover on desktop, pushed view INSIDE this sheet on a phone */}
  <Combobox options={posts} value={post} onChange={setPost} />
  {/* your own second step */}
  <InSheetView open={pick} onBack={() => setPick(false)} title="ເລືອກພະນັກງານ">…</InSheetView>
</DialogContent>
```

## Notes

- On a phone a dropdown inside a Dialog never opens a second sheet: Combobox, DatePicker and DateRangePicker push a view inside the same sheet (‹ back, Esc, or a pick returns). Use InSheetView for your own second step; useInSheet() tells a component it is inside one.
- ≤ 5 options inside a dialog: use FilterChips or RadioGroup, not a picker.
