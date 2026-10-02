# Login card

> Compact centred sign-in card with the logo shine, for simple apps and phones. For a full-page split-screen login with a brand panel use LoginScreen instead.

- Group: Layout & navigation · Stable
- Source: `packages/ui/src/components/shell.tsx`
- Live docs: #/docs/login-card

```ts
import { LoginCard } from "@vks-kit/ui"
```

## When to use

- **LoginCard**: Login screen: slow gold/navy aurora behind a frosted card with a lifted logo. In lite mode the aurora stops moving and the glass becomes a solid card (see perf tiers).

## Example

```tsx
<LoginCard title="ເຂົ້າສູ່ລະບົບ" subtitle="ໃສ່ລະຫັດພະນັກງານ">
  <Input placeholder="G001" />
  <Button className="w-full">ເຂົ້າ</Button>
</LoginCard>
```
