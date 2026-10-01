# Dropzone

> Drag files in or click to pick. Checks type and size before upload.

- Group: Form · New
- Source: `packages/ui/src/components/desktop-kit.tsx`
- Live docs: #/docs/dropzone

```ts
import { Dropzone, fmtBytes } from "@vks/ui"
```

## When to use

- **Dropzone**: Drag files in (desktop) or tap to pick (phone). Checks type (accept) and size (maxSize bytes), reports rejects through onReject. The area glows while a file hovers over it.

## Example

```tsx
const [files, setFiles] = React.useState<File[]>([])
<Dropzone accept="image/*,.pdf" maxSize={5 * 1024 * 1024} files={files} onRemove={(i) => setFiles(files.filter((_, j) => j !== i))}
  onFiles={(f) => setFiles([...files, ...f])} onReject={(f, why) => toast.error(f.name)} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| files | { name; type?; size? }[] |  | Picked files, listed under the zone with a coloured type icon and size. |
| onRemove | (index) => void |  | Shows a remove button on each listed file. |
