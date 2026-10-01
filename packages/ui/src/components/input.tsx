import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"
import { cn } from "../lib/cn"

/** Use for a single-line text field (44 px, 16 px text so iOS does not zoom); set invalid to show the error ring. For multi-line text use Textarea; for a floating label use FloatingInput; for passwords use PasswordInput; for picking from a list use Select or Combobox; for dates use DatePicker instead. */
export function Input({ className, invalid, ...p }: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "vks-field flex h-11 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:vks-shake",
        className,
      )}
      {...p}
    />
  )
}
/** Use for multi-line free text (notes, incident description); run cleanText() from @vks/types before saving. For a one-line value use Input instead. */
export function Textarea({ className, ...p }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("vks-field flex min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring", className)} {...p} />
}
/** Use for the visible label of a form field (link it with htmlFor). For a floating label that sits inside the field use FloatingInput instead. */
export function Label({ className, ...p }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("text-sm font-semibold leading-snug", className)} {...p} />
}
