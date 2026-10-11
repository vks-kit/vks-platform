# Offline & empty

> Offline banner shows the number of scans waiting (classic bar, or the navy Dynamic-Island pill). Empty state with a floating icon orb for lists with nothing in them; Combobox, CommandPalette, NotificationList, IndexedList and DataTable use it too.

- Group: Feedback · Mobile
- Source: `packages/ui/src/components/feedback.tsx`
- Live docs: #/docs/offline-empty

```ts
import { OfflineBanner, Empty, PageBoundary, isChunkLoadError } from "@vks-kit/ui"
```

## When to use

- **OfflineBanner**: Drops in when the phone is offline; shows how many scans wait to sync. variant="island" = navy Dynamic-Island pill (tone badge + gold queue chip). For a one-off message use toast instead.
- **Empty**: Use for an empty list or "no results" state (icon orb + title + hint + optional action). size="sm" drops the dashed frame for use inside menus and lists. For an error or warning message use Alert instead; DataTable already shows its own empty state.
- **PageBoundary**: Use around a page (AppShell already wraps every page in one) so a crash or a page file that will not download shows a message with "reload" instead of a blank white screen. A missing page file reloads the app once by itself (the new version is usually there). Change `resetKey` (e.g. the page id) to clear the error. For a list with no rows use Empty instead.

## Example

```tsx
<OfflineBanner queued={queue.size} syncing={flushing} />
<Empty title="ຍັງບໍ່ມີຂໍ້ມູນ" hint="ສະແກນຈຸດທຳອິດເພື່ອເລີ່ມ" />
```

### Offline island

Fixed navy in both themes so it reads as system chrome.

```tsx
<div className="fixed inset-x-0 top-[max(.5rem,env(safe-area-inset-top))] z-50">
  <OfflineBanner variant="island" queued={queue.size} syncing={flushing} />
</div>
```

### Empty with icon + action

```tsx
<Empty icon={<Search />} title="ບໍ່ພົບຜົນ" hint="ລອງຄຳຄົ້ນອື່ນ" action={<Button size="sm" variant="outline">ລ້າງຕົວກອງ</Button>} />
<Empty size="sm" title="ບໍ່ມີແຈ້ງເຕືອນໃໝ່" />
```

### Page that failed to load

AppShell wraps every page in PageBoundary already. A page file that will not download (stale deploy, dev restart, no signal) reloads the app once, then shows this; a crash shows 'try again'. Never a white screen.

```tsx
// only needed outside AppShell
<PageBoundary resetKey={pageId}><Suspense fallback={<Skeleton />}><Page /></Suspense></PageBoundary>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| queued | number | 0 | OfflineBanner: waiting items. |
| syncing | boolean | false | OfflineBanner: spinner + 'sending' (island: pulsing gold dot). |
| variant | "bar" \| "island" | "bar" | OfflineBanner: island = navy pill, tone badge, gold queue chip. |
| title / hint | string / ReactNode |  | Empty. |
| icon | ReactNode | <Inbox /> | Empty: icon inside the orb. |
| action | ReactNode |  | Empty: e.g. a Button under the text. |
| size | "md" \| "sm" | "md" | Empty: sm drops the dashed frame, for menus and lists. |
