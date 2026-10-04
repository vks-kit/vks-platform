# Reports (PDF & PPTX)

> House layout for PDF and PPTX reports: cover, KPI row, table, footer, and the Lao font settings each format needs.

- Group: Getting Started
- Live docs: #/docs/reports

Every VKS report, PDF or PPTX, has the same four parts in the same order: cover, KPI row, table, footer. The reader should find the answer on page 1.

## Layout (in this order)

| Part | Rule |
| --- | --- |
| Cover | Logo top left, report title, period (business day 06:00–06:00), who made it, date made. One page or one slide, nothing else on it. |
| KPI row | At most 5 numbers in one row, each with a label and the change from last period. Same numbers as the dashboard, same names. |
| Table | Header row repeats on every page. Numbers right-aligned with thousands separators (fmtNum, fmtKip). Zebra rows with the muted token. Totals row last, bold. |
| Footer | Every page: report name, page N of M, source (which sheet or app), date made. Small muted text. |

## Lao fonts and formats

| Format | Rule |
| --- | --- |
| All | Font Phetsarath OT v4.103 or newer (SIL OFL). Older versions mis-place marks. Use the Light, Medium, SemiBold and Black weights; do not fake bold. |
| All | Lao text uses composed sara-am (U+0EB3). Run normalizeLao() on names before they go in. |
| PDF | Render with a shaping engine: a browser (print to PDF), WeasyPrint or Typst. ReportLab does not shape Lao, so do not use it. |
| PDF / HTML | lang="lo" on the root. Lao line-height 1.8–2.2. Never word-break: break-all or overflow-wrap: anywhere; they split Lao syllables. |
| PPTX | Set the complex-script font too (a:cs typeface="Phetsarath OT"), not only run.font.name, or PowerPoint falls back to another font. |
| DOCX | Each run needs w:rFonts ascii/hAnsi/cs, b+bCs, i+iCs, sz+szCs, <w:cs/> and w:lang bidi="lo-LA". settings.xml needs w:themeFontLang bidi="lo-LA". |
| Colours | Use the theme tokens: primary (Guard Navy) for headers, gold for the one highlight, success / warning / destructive for status. No other colours. |

## Assumptions to confirm

| What | Value used now and how it is confirmed |
| --- | --- |
| Page size | ASSUMPTION: A4 portrait for PDF, 16:9 for PPTX. Confirm with the user against the last report sent to a client. |
| Margins | ASSUMPTION: 15 mm all sides for PDF. Confirm with the user when the first PDF is printed. |
| Logo | ASSUMPTION: the kit Logo, top left of the cover, about 30 mm wide; small logo in the footer. Confirm placement and file with the user. |
| Type sizes | ASSUMPTION: title 24 pt, KPI numbers 20 pt, table 10 pt, footer 8 pt. Confirm with the user on a printed sample. |
| Who signs | ASSUMPTION: no signature block. Confirm with the user which reports need one and whose. |

## Checklist before you send a report

- [ ] Page 1 answers the report's question without turning the page.
- [ ] No line starts with a dependent vowel or tone mark.
- [ ] No line ends with a pre-vowel (ເ ແ ໂ ໄ ໃ).
- [ ] Bold Lao looks bold (the complex-script bold flag is set).
- [ ] Lao text keeps its size (szCs is set in DOCX; the cs font is set in PPTX).
- [ ] Table header repeats on every page; totals row is last.
- [ ] Footer has page N of M and the data source.
- [ ] Every ASSUMPTION above is either confirmed or still labelled.

Parts: Logo, KpiStrip (same numbers on screen), DataTable (same columns), fmtNum / fmtKip from @vks-kit/core, normalizeLao from @vks-kit/types.
