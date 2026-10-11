import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

// A Radix popper opened inside an open Dialog/Sheet must be modal: the dialog's scroll lock
// (react-remove-scroll) only lets the newest lock's own nodes scroll, so a non-modal popover
// portalled to <body> can't be scrolled with the wheel or touch (long Combobox lists got stuck).
const DIR = join(__dirname, "../src/components")
const files = readdirSync(DIR).filter((f) => f.endsWith(".tsx"))

describe("popovers scroll inside dialogs", () => {
  it("every Popover root in the kit sets modal", () => {
    const bad: string[] = []
    for (const f of files) readFileSync(join(DIR, f), "utf8").split(/\r?\n/).forEach((l, i) => {
      if (/<(Popover|PO)\.Root\b/.test(l) && !/\bmodal=/.test(l)) bad.push(`${f}:${i + 1}  ${l.trim()}`)
    })
    expect(bad).toEqual([])
  })
  it("the Popover wrapper defaults to modal inside a Dialog/Sheet", () => {
    expect(readFileSync(join(DIR, "extras.tsx"), "utf8")).toMatch(/modal=\{modal \?\? nested\}/)
  })
})
