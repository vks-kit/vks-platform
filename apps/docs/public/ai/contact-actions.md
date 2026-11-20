# Contact actions

> Round WhatsApp (real logo, green) and call buttons next to a phone number. WhatsApp only for a Lao mobile (020 / 030), never a landline; nothing for a do-not-call person. A click never opens the row.

- Group: Actions · New
- Source: `packages/ui/src/components/contact.tsx`
- Live docs: #/docs/contact-actions

```ts
import { ContactActions, WhatsAppIcon, whatsappUrl, telUrl, laMobileDigits } from "@vks-kit/ui"
```

## When to use

- **ContactActions**: Use for the round WhatsApp / call buttons next to a phone number in a list row or a record (they open the chat or the dialer straight away). WhatsApp only shows for a Lao mobile (020 / 030), never for a landline; pass blocked for a do-not-call person and nothing shows. A click never reaches the row under it. For sharing a file use ShareImageDialog.
- **WhatsAppIcon**: The WhatsApp mark (Simple Icons, CC0) in the current text colour, so it follows the theme tokens. For other icons use @vks-kit/ui/icons.

## Example

```tsx
// list row: WhatsApp beside the row's call button
<ContactActions phone={a.tel} blocked={a.do_not_call} size="sm" />
// record: WhatsApp + call
<ContactActions phone={p.phone} call />
// just the link
whatsappUrl("020 5512 3456") // "https://wa.me/8562055123456"
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| phone | string \| number |  | As stored or typed: 2055123456, "020 5512 3456", "+856 20 …". |
| whatsapp / call | boolean | true / false | Which buttons. WhatsApp is skipped for a landline. |
| blocked | boolean |  | Do-not-contact: renders nothing. |
| size | "sm" \| "md" | "md" | sm 36 px (dense desktop table), md 44 px (phone, cards). |

## Notes

- Opens https://wa.me/856<number> in a new tab: the WhatsApp app on a phone, WhatsApp Web / Desktop on a computer. The person's number does not need to be saved first.
- laMobileDigits / whatsappUrl / telUrl are pure and unit tested.
