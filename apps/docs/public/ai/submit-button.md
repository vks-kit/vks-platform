# Submit button (form actions)

> The save button of a React 19 form action: it reads useFormStatus() itself, so it spins, keeps its width and blocks a second tap while <form action> runs. No pending state of your own.

- Group: Actions · New
- Source: `packages/ui/src/components/actions.tsx`
- Live docs: #/docs/submit-button

```ts
import { SubmitButton } from "@vks-kit/ui"
```

## When to use

- **SubmitButton**: Use for the save button of a form that posts with React 19 actions (<form action={…}>, useActionState): it reads useFormStatus() itself, so while the action runs it shows the spinner, keeps its width and blocks a second tap, with no pending state of your own. pendingLabel swaps the text while saving. For a button outside a <form> use Button with loading instead; for the row of form buttons use FormActions.

## Example

```tsx
const [error, save] = useActionState(async (_prev, form: FormData) => {
  const res = await api.saveSite({ name: cleanText(String(form.get("name"))) })
  return res.ok ? null : res.error          // shown under the field
}, null)

<form action={save}>
  <Field label="ຊື່ສະຖານທີ່" error={error}><Input name="name" /></Field>
  <SubmitButton pendingLabel="ກຳລັງບັນທຶກ…">ບັນທຶກ</SubmitButton>
</form>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| pendingLabel | ReactNode |  | Text while the form is sending. Default: the normal label. |
| variant | Button variant | "action" | Same variants as Button. |
| …Button props |  |  | Everything Button takes except type and loading (it sets both). |

## Notes

- Must sit inside the <form> it submits: useFormStatus only sees its parent form.
- For a button outside a form keep Button loading={…}.
