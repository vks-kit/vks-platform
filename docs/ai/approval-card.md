# Approval card

> One request that needs a yes or no from a manager: what, who asked, when. Approve, or Reject with a required reason.

- Group: Data display · New
- Source: `packages/ui/src/components/business.tsx`
- Live docs: #/docs/approval-card

```ts
import { ApprovalCard, rejectReasonError, type ApprovalStatus } from "@vks-kit/ui"
```

## When to use

- **ApprovalCard**: Use for one request that needs a yes/no from a manager (leave, overtime, site change, payroll fix): summary, who asked and when, Approve / Reject with a required reason. For a list of many requests put one ApprovalCard per row, or use DataTable with a Drawer; for a plain yes/no without a reason use ConfirmDialog instead.

## Example

```tsx
<ApprovalCard
  title="ຂໍລາພັກ 2 ມື້" summary="03–04/10 · ທຸລະກິດຄອບຄົວ"
  requester={req.name} requesterRole={req.role} requestedAt={req.at}
  status={req.status}
  onApprove={() => api.approve(req.id)}
  onReject={(reason) => api.reject(req.id, reason)}   // reason is already cleanText()-ed
/>
```

### Approved and rejected

After a decision the buttons go away and the card shows who decided, when, and the reason.

```tsx
<ApprovalCard status="approved" decidedBy="…" decidedAt="…" {...req} />
<ApprovalCard status="rejected" decidedBy="…" decidedAt="…" reason={req.reason} {...req} />
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| title / summary | ReactNode |  | What is asked. Keep the title to one line. |
| requester / requesterRole / requestedAt | string |  | Who asked and when (pre-formatted). |
| status | "pending" \| "approved" \| "rejected" |  | Buttons show only when pending. |
| decidedBy / decidedAt / reason | string |  | Shown after a decision; reason only when rejected. |
| onApprove | () => void \| Promise |  | Button spins until the promise settles. |
| onReject | (reason: string) => void \| Promise |  | Called only when rejectReasonError() passes (not empty, at least 5 characters after cleanText). |
| labels | Partial<ApprovalLabels> |  | Override any Lao button or status text. |
| children | ReactNode |  | Extra detail rows under the summary. |

## Notes

- Reject always needs a reason. The requester sees it.
- Keep the decision on the server too: the card only shows the status you pass.
