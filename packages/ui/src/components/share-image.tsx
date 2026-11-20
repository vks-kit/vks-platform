import * as React from "react"
import { Copy, Download, Share2 } from "lucide-react"
import { cn } from "../lib/cn"
import { useIsMobile } from "../lib/use-media"
import { Button, IconButton } from "./button"
import { Dialog } from "./overlay"
import { FormDialogContent } from "./form-dialog"
import { toast } from "./toaster"

export { fitText, loadFonts, loadImage } from "../lib/canvas-text"

/**
 * Use for an image people send on (appointment receipt, client card, certificate): the popup shows the picture you draw
 * on a canvas, sized to the screen with no scrolling, and gives Download PNG + copy + share (desktop) or Save + Send on
 * WhatsApp (phone, the native share sheet). You only write draw(canvas). For a share link (no file) use useShareSheet.
 */
export function ShareImageDialog({ open, onOpenChange, title, description, fileName, draw, ratio, sendLabel = "ສົ່ງ WhatsApp", maxWidth = "38rem", note }: {
  open: boolean; onOpenChange: (o: boolean) => void
  title: React.ReactNode; description?: React.ReactNode
  /** Download / share file name, e.g. "VKS_ໃບນັດ_APT-000014.png". */
  fileName: string
  /** Draw the picture. Set canvas.width / height inside (the canvas is not sized for you). Async is fine (fonts, logo). */
  draw: (canvas: HTMLCanvasElement) => void | Promise<void>
  /** width / height of the picture (1080 / 1384). The popup width follows the screen height from it, so the whole picture shows. */
  ratio: number
  /** Phone main button label. Default "ສົ່ງ WhatsApp". */
  sendLabel?: string
  /** Widest the popup gets on a tall screen. Default 38rem. */
  maxWidth?: string
  /** One muted line under the picture. */
  note?: React.ReactNode
}) {
  const mobile = useIsMobile()
  const cv = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false), [busy, setBusy] = React.useState(false)
  React.useEffect(() => {
    if (!open) { setReady(false); return }
    let live = true
    // the canvas mounts with the popup: wait one frame for it
    const id = requestAnimationFrame(async () => { if (!cv.current) return; await draw(cv.current); if (live) setReady(true) })
    return () => { live = false; cancelAnimationFrame(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, draw])
  const blob = () => new Promise<Blob>((ok, bad) => cv.current ? cv.current.toBlob((b) => (b ? ok(b) : bad(new Error("png"))), "image/png") : bad(new Error("png")))
  const act = (fn: () => Promise<void>) => async () => { setBusy(true); try { await fn() } finally { setBusy(false) } }
  const download = act(async () => {
    try { const u = URL.createObjectURL(await blob()); const a = document.createElement("a"); a.href = u; a.download = fileName; a.click(); setTimeout(() => URL.revokeObjectURL(u), 4000); toast.success("ດາວໂຫຼດແລ້ວ · " + fileName) }
    catch { toast.error("ສ້າງຮູບບໍ່ໄດ້") }
  })
  const canCopy = typeof ClipboardItem !== "undefined" && typeof navigator !== "undefined" && !!navigator.clipboard?.write
  const copy = act(async () => {
    try { await navigator.clipboard.write([new ClipboardItem({ "image/png": blob() })]); toast.success("ສຳເນົາຮູບແລ້ວ · ວາງ (Ctrl+V) ໃນ WhatsApp") }
    catch { toast.error("ສຳເນົາບໍ່ໄດ້ · ກົດ ດາວໂຫຼດ ແທນ") }
  })
  const canShare = typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], fileName, { type: "image/png" })] })
  const share = act(async () => {
    try { await navigator.share({ files: [new File([await blob()], fileName, { type: "image/png" })] }) }
    catch (e) { if ((e as Error).name !== "AbortError") toast.error("ແບ່ງປັນບໍ່ໄດ້") }
  })
  // the picture gets the screen height minus the title and the buttons; the popup width follows from the ratio
  const imgH = "calc(92dvh - 15rem)"
  const off = !ready || busy
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent width={"min(" + maxWidth + ", calc((" + imgH + ") * " + ratio + " + 3rem))"} className="md:max-h-[92dvh]" title={title} description={description}
        footer={<div className="flex w-full gap-2 [&>button]:min-w-0">
          {mobile && canShare
            ? <><Button variant="outline" className="min-h-11 flex-1" disabled={off} onClick={download}><Download className="shrink-0" /><span className="truncate">ບັນທຶກຮູບ</span></Button>
                <Button className="min-h-11 flex-1" disabled={off} onClick={share}><Share2 className="shrink-0" /><span className="truncate">{sendLabel}</span></Button></>
            : <>{canCopy && <IconButton label="ສຳເນົາຮູບ" icon={<Copy />} disabled={off} onClick={copy} />}
                {canShare && <IconButton label="ແບ່ງປັນ" icon={<Share2 />} disabled={off} onClick={share} />}
                <Button className="min-h-11 flex-1 px-3" disabled={off} onClick={download}><Download className="shrink-0" /><span className="truncate">ດາວໂຫຼດ</span></Button></>}
        </div>}>
        <canvas ref={cv} aria-label={typeof title === "string" ? title : fileName}
          className={cn("mx-auto block h-auto max-h-[calc(92dvh-15rem)] w-auto max-w-full rounded-lg shadow-lg", !ready && "opacity-0")} />
        {note && <p className="mt-2 text-center text-xs leading-normal text-muted-foreground">{note}</p>}
      </FormDialogContent>
    </Dialog>
  )
}
