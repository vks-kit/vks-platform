# Tabs

> Segmented tabs. Keep to 2-4 on a phone.

- Group: Form · Stable
- Source: `packages/ui/src/components/form.tsx`
- Live docs: #/docs/tabs

```ts
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@vks-kit/ui"
```

## When to use

- **Tabs**: Use for switching between peer views on the same page (Radix Tabs root). Pair with TabsList + TabsTrigger + TabsContent. For a choice that sets a form value use ToggleGroup variant="segmented" instead; for app-level navigation use Sidebar/BottomNav instead; for sequential steps use Wizard instead.
- **TabsList**: Use for the row of tab buttons; variant="pill" (default, sliding white pill) or "underline" (gold bar). For a breadcrumb trail use Breadcrumb instead.
- **TabsTrigger**: Use for one tab button inside TabsList (value must match a TabsContent). For a standalone toggle use Toggle instead.
- **TabsContent**: Use for the panel shown when its TabsTrigger is active (fades up). For collapsible content use AccordionContent instead.

## Example

```tsx
<Tabs defaultValue="a">
  <TabsList>
    <TabsTrigger value="a">ວັນນີ້</TabsTrigger>
    <TabsTrigger value="b">ອາທິດນີ້</TabsTrigger>
  </TabsList>
  <TabsContent value="a">…</TabsContent>
  <TabsContent value="b">…</TabsContent>
</Tabs>
```
