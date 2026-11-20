import * as React from "react"
import { Phone } from "lucide-react"
import { cn } from "../lib/cn"
import { telUrl, whatsappUrl } from "../lib/field-format"
import { Tooltip, TooltipContent, TooltipTrigger } from "./overlay"

/** The WhatsApp mark (Simple Icons, CC0) in the current text colour, so it follows the theme tokens. For other icons use @vks-kit/ui/icons. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
}

const round = "vks-press grid shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
const SIZE = { sm: "size-9 [&_svg]:size-4", md: "size-11 [&_svg]:size-5" } as const

/**
 * Use for the round WhatsApp / call buttons next to a phone number in a list row or a record (they open the chat or the
 * dialer straight away). WhatsApp only shows for a Lao mobile (020 / 030), never for a landline; pass blocked for a
 * do-not-call person and nothing shows. A click never reaches the row under it. For sharing a file use ShareImageDialog.
 */
export function ContactActions({ phone, whatsapp = true, call = false, blocked, size = "md", className }: {
  /** The number as stored or typed ("2055123456", "020 5512 3456", "+856…"). */
  phone: string | number
  /** Show the WhatsApp button (mobiles only). Default true. */
  whatsapp?: boolean
  /** Show a call button. Default false (most rows already have their own call action). */
  call?: boolean
  /** Do-not-contact: show nothing. */
  blocked?: boolean
  /** sm = 36 px (dense desktop table), md = 44 px (phone, cards). Default md. */
  size?: "sm" | "md"; className?: string
}) {
  if (blocked) return null
  const wa = whatsapp ? whatsappUrl(phone) : null, tel = call ? telUrl(phone) : null
  if (!wa && !tel) return null
  const stop = (e: React.SyntheticEvent) => e.stopPropagation()
  const link = (href: string, label: string, cls: string, icon: React.ReactNode, blank: boolean) => (
    <Tooltip><TooltipTrigger asChild>
      <a href={href} aria-label={label} onClick={stop} onKeyDown={stop} {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(round, SIZE[size], cls)}>{icon}</a>
    </TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
  )
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {wa && link(wa, "WhatsApp", "bg-success text-success-foreground shadow-sm transition-[filter] hover:brightness-110", <WhatsAppIcon />, true)}
      {tel && link(tel, "ໂທ", "border border-input bg-card text-foreground hover:bg-muted", <Phone />, false)}
    </span>
  )
}
