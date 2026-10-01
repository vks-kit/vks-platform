import * as React from "react"
import { File, FileArchive, FileAudio, FileImage, FileSpreadsheet, FileText, FileVideo, Presentation, X } from "lucide-react"
import { cn } from "../lib/cn"

export type FileKind = "pdf" | "sheet" | "doc" | "slide" | "image" | "video" | "audio" | "archive" | "other"

const EXT: Record<string, FileKind> = {
  pdf: "pdf",
  xlsx: "sheet", xls: "sheet", xlsm: "sheet", csv: "sheet", tsv: "sheet", ods: "sheet",
  docx: "doc", doc: "doc", odt: "doc", rtf: "doc", txt: "doc", md: "doc",
  pptx: "slide", ppt: "slide", odp: "slide", key: "slide",
  jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image", heic: "image", svg: "image", bmp: "image",
  mp4: "video", mov: "video", webm: "video", mkv: "video", avi: "video",
  mp3: "audio", m4a: "audio", wav: "audio", ogg: "audio", aac: "audio",
  zip: "archive", rar: "archive", "7z": "archive", gz: "archive", tar: "archive",
}

/** File family from a name and/or mime type: "report.xlsx" → "sheet". Extension wins, mime is the fallback. Pure. */
export function fileKind(name = "", type = ""): FileKind {
  const ext = name.toLowerCase().split(".").pop() ?? ""
  if (name.includes(".") && EXT[ext]) return EXT[ext]
  const t = type.toLowerCase()
  if (t === "application/pdf") return "pdf"
  if (t.startsWith("image/")) return "image"
  if (t.startsWith("video/")) return "video"
  if (t.startsWith("audio/")) return "audio"
  if (/spreadsheet|excel|csv/.test(t)) return "sheet"
  if (/presentation|powerpoint/.test(t)) return "slide"
  if (/word|document|text\//.test(t)) return "doc"
  if (/zip|compressed|archive|tar/.test(t)) return "archive"
  return "other"
}

const META: Record<FileKind, { I: React.ComponentType<{ className?: string }>; label: string }> = {
  pdf: { I: FileText, label: "PDF" }, sheet: { I: FileSpreadsheet, label: "XLS" }, doc: { I: FileText, label: "DOC" },
  slide: { I: Presentation, label: "PPT" }, image: { I: FileImage, label: "IMG" }, video: { I: FileVideo, label: "VID" },
  audio: { I: FileAudio, label: "AUD" }, archive: { I: FileArchive, label: "ZIP" }, other: { I: File, label: "FILE" },
}

/** Short badge text for a file: the real extension when short ("XLSX", "PDF"), else the family label. Pure. */
export function fileBadge(name = "", type = ""): string {
  const ext = name.includes(".") ? name.split(".").pop()!.toUpperCase() : ""
  return ext && ext.length <= 4 ? ext : META[fileKind(name, type)].label
}

const SIZES = { sm: "size-8 rounded-lg [&_svg]:size-4", md: "size-11 rounded-xl [&_svg]:size-5", lg: "size-14 rounded-2xl [&_svg]:size-6" }

/**
 * Use for a coloured file-type tile (PDF red-orange, Excel green, Word blue…) next to any file name:
 * uploads, attachments, report lists. Give name and/or mime type. For a whole row with size and remove use FileItem.
 */
export function FileIcon({ name, type, kind, size = "md", badge = true, className }: { name?: string; type?: string; kind?: FileKind; size?: keyof typeof SIZES; badge?: boolean; className?: string }) {
  const k = kind ?? fileKind(name, type), { I } = META[k]
  return (
    <span data-kind={k} aria-hidden style={{ "--fk": `var(--file-${k})` } as React.CSSProperties}
      className={cn("relative inline-flex shrink-0 items-center justify-center bg-[color-mix(in_oklab,var(--fk)_12%,transparent)] text-[var(--fk)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--fk)_22%,transparent)]", SIZES[size], className)}>
      <I />
      {badge && size !== "sm" && <span className="absolute -bottom-1 -right-1.5 rounded-[5px] bg-[var(--fk)] px-1 font-sans text-[9px] font-bold leading-[14px] tracking-wide text-card shadow-sm">{name || kind ? fileBadge(name, type).slice(0, 4) : ""}</span>}
    </span>
  )
}

/** Use for one file row (icon, name, size or status, optional progress and remove). For a picker use Dropzone; it lists files with this. */
export function FileItem({ name, type, size, meta, progress, onRemove, onOpen, className }: {
  name: string; type?: string; size?: number; meta?: React.ReactNode; progress?: number; onRemove?: () => void; onOpen?: () => void; className?: string
}) {
  const body = <>
    <FileIcon name={name} type={type} />
    <span className="min-w-0 flex-1 text-left">
      <span className="block truncate text-sm font-semibold leading-normal text-foreground">{name}</span>
      <span className="block truncate text-xs leading-normal text-muted-foreground">{meta ?? (size != null ? fmtSize(size) : fileBadge(name, type))}</span>
      {progress != null && progress < 100 && <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-muted"><span className="block h-full origin-left rounded-full bg-primary transition-transform duration-300" style={{ transform: `scaleX(${Math.max(0, Math.min(100, progress)) / 100})` }} /></span>}
    </span>
  </>
  return (
    <div className={cn("vks-pop flex min-h-14 items-center gap-3 rounded-xl border bg-card p-2.5 pr-1.5", className)}>
      {onOpen ? <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">{body}</button> : <div className="flex min-w-0 flex-1 items-center gap-3">{body}</div>}
      {onRemove && <button type="button" aria-label={"Remove " + name} onClick={onRemove} className="vks-press grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring outline-none"><X className="size-4" /></button>}
    </div>
  )
}

function fmtSize(n: number) {
  if (n < 1024) return n + " B"
  const u = ["KB", "MB", "GB"]; let i = -1
  do { n /= 1024; i++ } while (n >= 1024 && i < 2)
  return (n < 10 ? n.toFixed(1) : Math.round(n)) + " " + u[i]
}
