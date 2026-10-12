# Design thinking

> One job per page, content first, hide what is used sometimes. The rules that keep VKS screens from getting cluttered.

- Group: Getting Started
- Live docs: #/docs/design-thinking

## The page question

Before you build a page, write one line: the question this page answers for the person using it. Everything on the page either helps answer it or goes somewhere else.

## Rules

1. **One job per page.** Every page answers one question ("What is being built now?", "Who is late today?"). The first screen answers it without scrolling. *How:* Write the question in PageHeader's subtitle while you design. If you need two questions, you need two pages or two tabs.
2. **Content first, controls second.** The main thing (table, map, board, timeline) starts in the first screen. Controls above it take one row, about 44 px. *How:* PageHeader → one control row → content. View switches (Tabs) go in PageHeader actions, not in a card of their own.
3. **Hide what is used sometimes.** Show the 1-3 controls people use every visit. Put the rest behind one button. *How:* Main switch as ToggleGroup (segmented), one quick toggle, then a "Filter" button that opens a Popover (a bottom sheet on phones) with FilterChips inside. The button shows how many filters are on.
4. **Show state only when it is not default.** Active filters appear as small removable chips with an ×. Reset appears only when something is set. Context options appear only when they apply. *How:* No filter set = no chips, no reset button. A "show related" toggle only renders while a filter is on.
5. **Few numbers, each one useful.** At most 4-5 headline numbers, in one slim row. Each number should lead somewhere (tap → the list behind it). A number no one acts on is noise. *How:* Desktop: one Card split into stat cells, or KpiStrip with ≤ 4 tiles. Phone: KpiHero (one big number). Put the hint under the number ("in 34 d", "3% done"), not in a second card.
6. **Say it once.** Never show the same fact twice on one page (a milestone as a chip row AND as diamonds on the chart, a status count in a card AND in the legend). *How:* Pick the place where the fact has context (on the chart) and delete the other.
7. **Merge, don't stack.** Small related cards become one strip. No more than 3 blocks above the main content. *How:* "Building now" + "Up next" → one ribbon with a divider. Overflow scrolls sideways instead of wrapping into a tall card.
8. **Help is one quiet line.** Legends, keys and hints are one line of muted xs text next to the thing they explain, never a paragraph or a card. *How:* "Hover a bar to trace its chain · click to open". Long explanations go in a Tooltip or the docs.
9. **Put counts on the controls.** A filter option shows how many items it would give (Backend 19). This replaces a separate summary block and stops dead ends. *How:* Count with the other filters applied. Disable options that would give 0.
10. **One page gutter, set by the shell.** Every page sits on the same side margin: AppShell's main already pads 16 px on a phone (p-4) and 24 px from 768 px (md:p-6), with room for the bottom nav. A page never adds its own outer padding on top of that, so the space from the screen edge is the same on every tab. *How:* Page root = "mx-auto flex w-full max-w-md flex-col gap-4" on phone-first apps (no p-4/p-6). Cards inside keep their own inner padding. Loading, error and empty states use the same root. Full-bleed screens (camera, map) opt out on purpose. Check: tab through every page at 360 px - the card edges line up.
11. **On a phone, even less.** One column, one primary action, filters in a bottom sheet, cards instead of tables. If it does not fit on 360 px, it was too much on desktop too. *How:* Check at 360 px and 1440 px before you call a screen done.

## Before → after (VKS Centre, v0.3)

| Before | After |
| --- | --- |
| Five big KPI tiles, the fifth on its own row | One slim row of 5 stat cells, hints underneath |
| Filter card with every project and status chip always open | One row: segmented switch, one toggle, Filter popover, x/32 count |
| "On the way" card + "Backend vs Frontend" card | One ribbon: Building … | Next … |
| Milestone chip row above a chart that already has milestone diamonds | Diamonds only |
| Legend card + key paragraph under a map | One muted line |

## Checklist before you call a screen done

- [ ] I can say this page's question in one line.
- [ ] At 1440×900 the main content starts in the first screen.
- [ ] Controls above the content fit on one row.
- [ ] Rarely used filters are behind a Filter popover; active ones show as chips.
- [ ] No more than 5 headline numbers, and each one leads somewhere.
- [ ] No fact appears twice on the page.
- [ ] No more than 3 blocks sit above the main content.
- [ ] Legends and hints are one muted line.
- [ ] At 360 px it is one column with one primary action.
- [ ] Every page has the same side margin as the others (the shell's 16 px; no extra p-4 on the page root).

Parts: PageHeader (actions slot), ToggleGroup segmented, Popover + FilterChips, Chip, KpiStrip / KpiHero, Tooltip, Card.
