import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { scan } from "../bin/guard-lib.mjs"

const dirs: string[] = []
const mk = (src: string) => {
  const d = mkdtempSync(join(tmpdir(), "vks-guard-"))
  dirs.push(d)
  writeFileSync(join(d, "a.tsx"), src)
  return d
}
afterEach(() => { while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true }) })

describe("vks-guard", () => {
  it("passes clean code", () => {
    expect(scan(mk('import { Button } from "@vks-kit/ui"\nexport const A = () => <Button />\n'))).toEqual([])
  })
  it("flags raw colours", () => {
    expect(scan(mk('export const c = "#ff0000"\n')).some((h) => h.rule === "raw-colour")).toBe(true)
  })
  it("flags direct lucide imports", () => {
    expect(scan(mk('import { X } from "lucide-react"\n')).length).toBeGreaterThan(0)
  })
})
