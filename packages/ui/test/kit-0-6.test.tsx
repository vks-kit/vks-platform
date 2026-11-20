// @vitest-environment jsdom
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { IconButton, TooltipProvider } from "../src"

const src = (f: string) => readFileSync(resolve(__dirname, "../src/components", f), "utf8")

describe("kit 0.6 layout rules", () => {
  it("IconButton always has an accessible name and a 44 px square", () => {
    const { getByRole } = render(<TooltipProvider><IconButton label="ສຳເນົາຮູບ" icon={<svg />} /></TooltipProvider>)
    const b = getByRole("button", { name: "ສຳເນົາຮູບ" })
    expect(b.className).toContain("size-11")
  })
  it("popups are centred top to bottom, never pinned at a fixed top", () => {
    for (const f of ["overlay.tsx", "form-dialog.tsx", "alerts.tsx"]) {
      expect(src(f)).not.toMatch(/md:top-\[\d+vh\]/)
      expect(src(f)).toContain("md:my-auto")
    }
  })
  it("a custom popup width moves its left edge with it", () => {
    expect(src("form-dialog.tsx")).toContain("md:left-[calc(50%-min(var(--fd-w)/2,50%-1rem))]")
  })
  it("AppShell can drop the top bar on desktop and builds the profile button", () => {
    const s = src("shell.tsx")
    expect(s).toContain("desktopHeader")
    expect(s).toContain('!desktopHeader && "md:hidden"')
    expect(s).toContain("function ProfileButton")
  })
})
