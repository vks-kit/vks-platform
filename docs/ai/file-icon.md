# File icon

> Coloured file-type tile (PDF, Excel, Word, image…) and a file row with size, progress and remove.

- Group: Data display · New
- Source: `packages/ui/src/components/file-icon.tsx`
- Live docs: #/docs/file-icon

```ts
import { FileIcon, FileItem, fileKind, fileBadge } from "@vks/ui"
```

## When to use

- **FileIcon**: Use for a coloured file-type tile (PDF red-orange, Excel green, Word blue…) next to any file name: uploads, attachments, report lists. Give name and/or mime type. For a whole row with size and remove use FileItem.
- **FileItem**: Use for one file row (icon, name, size or status, optional progress and remove). For a picker use Dropzone; it lists files with this.

## Example

```tsx
<FileIcon name="report.pdf" />
<FileItem name="report.pdf" size={1240000} onOpen={open} onRemove={remove} />
<FileItem name="photo.jpg" progress={62} meta="ກຳລັງອັບໂຫຼດ · 62%" />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| name / type | string |  | File name and/or mime type. Extension wins. |
| size | 'sm'\|'md'\|'lg' | "md" | sm hides the extension badge. |
| kind | FileKind |  | Force a family instead of guessing. |

## Notes

- One colour per family, from --file-* tokens (light and dark). Never colour a file icon by hand.
- Use FileItem wherever a file appears: uploads, attachments, report downloads.
