# Combobox

> Searchable picker. Bottom sheet on a phone, popover on desktop; inside a Dialog on a phone it pushes a view in the same sheet. Single or multi.

- Group: Form · New
- Source: `packages/ui/src/components/combobox.tsx`
- Live docs: #/docs/combobox

```ts
import { Combobox, type Option } from "@vks/ui"
```

## When to use

- **Combobox**: Use for picking from a long list (8+ options, searchable). Popover on desktop; bottom sheet on phone; inside a Dialog/Sheet on phone it pushes a view in the same sheet (never a sheet on a sheet). For up to ~7 options use RadioGroup or FilterChips instead. Replaces the old jt-select.

## Example

```tsx
const [v, setV] = useState<string[]>([])
<Combobox options={sites} value={v} onChange={setV} />
```

### Multiple

```tsx
<Combobox multiple options={sites} value={v} onChange={setV} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| options | { value: string; label: string; hint?: string }[] |  | hint shows on the right (a code, a count). |
| value | string[] |  | Always an array, even in single mode. |
| onChange | (v: string[]) => void |  |  |
| multiple | boolean | false |  |
| placeholder | string | "ເລືອກ..." |  |
| searchable | boolean | true | Search matches Lao after normalizeLao(). |
