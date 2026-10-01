# Login screen

> Premium full-page sign-in (for the compact centred card use LoginCard instead). Desktop: navy aurora brand panel with feature list beside the form. Phone: logo on top, form centred, safe-area padding.

- Group: Layout & navigation · New
- Source: `packages/ui/src/components/account.tsx`
- Live docs: #/docs/login-screen

```ts
import { LoginScreen } from "@vks/ui"
```

## When to use

- **LoginScreen**: Use for a full-page premium sign-in: brand panel on the left of a desktop, centred form on a phone. For a small centred card inside an existing page use LoginCard instead.

## Example

```tsx
<LoginScreen title="ຍິນດີຕ້ອນຮັບກັບມາ" subtitle="ໃສ່ລະຫັດພະນັກງານ"
  tagline="ຄວາມປອດໄພ ທີ່ທ່ານໄວ້ວາງໃຈ"
  features={[{ label: "ຕິດຕາມການລາດຕະເວນ" }, { icon: <Clock />, label: "ບັນທຶກການມາວຽກ" }]}
  footer={<span>ລືມລະຫັດ?</span>}>
  <FloatingInput label="ລະຫັດພະນັກງານ" />
  <PasswordInput placeholder="ລະຫັດຜ່ານ" />
  <Button className="w-full" size="lg">ເຂົ້າສູ່ລະບົບ</Button>
</LoginScreen>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| title / subtitle | string |  | Heading above the form. |
| children | ReactNode |  | The form. |
| tagline | string |  | Big headline on the desktop brand panel (defaults to title). |
| features | { icon?; label }[] |  | Bullets on the brand panel (desktop only). |
| footer | ReactNode |  | Help line under the form. |
| brand | string | BRAND.name |  |
