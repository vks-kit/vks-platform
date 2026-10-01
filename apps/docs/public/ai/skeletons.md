# Skeletons

> Shaped placeholders (text, avatar, list, card, table) so nothing jumps when data lands.

- Group: Feedback · New
- Source: `packages/ui/src/components/extras.tsx`
- Live docs: #/docs/skeletons

```ts
import { SkeletonText, SkeletonList, SkeletonCard, SkeletonTable, SkeletonAvatar } from "@vks/ui"
```

## When to use

- **SkeletonText**: n lines of text; last line is shorter like a real paragraph.
- **SkeletonList**: Avatar + two lines, repeated. Matches UserChip / list rows.
- **SkeletonCard**: Image block + title + text. Matches Card with a photo.
- **SkeletonTable**: Header row + n body rows. Matches Table / DataTable.
- **SkeletonAvatar**: Use for a round placeholder while a profile photo loads. For a whole list row use SkeletonList instead; for an arbitrary block use Skeleton instead.

## Example

```tsx
{loading ? <SkeletonList rows={5} /> : <StaffList … />}
```
