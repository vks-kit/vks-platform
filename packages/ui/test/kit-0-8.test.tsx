// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest"
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import * as React from "react"
import { applyPatches, docTitleText, revealDelay, SubmitButton, PageHeader, ExpandCard, SignaturePad, useOptimisticList, type SignaturePadHandle } from "../src"
import { moveItem } from "../src/heavy/kanban"

afterEach(cleanup)
const src = (f: string) => readFileSync(resolve(__dirname, "../src", f), "utf8")

describe("pure helpers", () => {
  it("applyPatches lays pending changes over the saved list, in order", () => {
    const items = [{ id: "a", s: "todo" }, { id: "b", s: "todo" }]
    expect(applyPatches(items, [])).toBe(items)
    expect(applyPatches(items, [{ id: "b", patch: { s: "done" } }])).toEqual([{ id: "a", s: "todo" }, { id: "b", s: "done" }])
    expect(applyPatches(items, [{ id: "a", patch: { s: "x" } }, { id: "a", patch: { s: "y" } }])[0].s).toBe("y")
  })
  it("docTitleText builds the tab title", () => {
    expect(docTitleText("ກະ", "VKS HR", 3)).toBe("(3) ກະ · VKS HR")
    expect(docTitleText("ກະ", "VKS HR")).toBe("ກະ · VKS HR")
    expect(docTitleText("ກະ", "", 0)).toBe("ກະ")
    expect(docTitleText("", "VKS HR")).toBe("VKS HR")
    expect(docTitleText("VKS HR", "VKS HR")).toBe("VKS HR")
    expect(docTitleText("ແຈ້ງເຕືອນ", "VKS", 250)).toBe("(99+) ແຈ້ງເຕືອນ · VKS")
  })
  it("rows fill in under 400 ms: only the first 8 wait", () => {
    expect([0, 1, 7, 8, 50].map(revealDelay)).toEqual([0, 40, 280, 280, 280])
    expect(revealDelay(-3)).toBe(0)
  })
  it("moveItem reorders, and leaves bad moves alone", () => {
    const l = ["a", "b", "c", "d"]
    expect(moveItem(l, 0, 2)).toEqual(["b", "c", "a", "d"])
    expect(moveItem(l, 3, 0)).toEqual(["d", "a", "b", "c"])
    expect(moveItem(l, 1, 1)).toBe(l)
    expect(moveItem(l, -1, 2)).toBe(l)
    expect(moveItem(l, 0, 9)).toBe(l)
  })
})

describe("React 19 parts", () => {
  it("SubmitButton spins while its form action runs", async () => {
    let release = () => {}
    const action = () => new Promise<void>((r) => { release = r })
    const { getByRole } = render(<form action={action}><SubmitButton pendingLabel="ກຳລັງບັນທຶກ…">ບັນທຶກ</SubmitButton></form>)
    const b = getByRole("button")
    expect(b.getAttribute("type")).toBe("submit")
    await act(async () => { fireEvent.click(b) })
    await waitFor(() => expect(getByRole("button").textContent).toContain("ກຳລັງບັນທຶກ…"))
    expect((getByRole("button") as HTMLButtonElement).disabled).toBe(true)
    await act(async () => { release() })
    await waitFor(() => expect(getByRole("button").textContent).toBe("ບັນທຶກ"))
  })
  it("PageHeader docTitle names the browser tab (React 19 hoists <title>)", async () => {
    render(<PageHeader title="ກະ" docTitle appName="VKS HR" badge={3} />)
    await waitFor(() => expect(document.title).toBe("(3) ກະ · VKS HR"))
  })
  it("useOptimisticList shows the change at once and rolls back on failure", async () => {
    let fail: (e: Error) => void = () => {}
    function Demo() {
      const [saved] = React.useState([{ id: "a", s: "todo" }])
      const { items, mark, pending } = useOptimisticList(saved, () => new Promise((_, rej) => { fail = rej }), { failText: false })
      return <button onClick={() => mark(saved[0], { s: "done" })}>{items[0].s}|{pending.length}</button>
    }
    const { getByRole } = render(<Demo />)
    await act(async () => { fireEvent.click(getByRole("button")) })
    await waitFor(() => expect(getByRole("button").textContent).toBe("done|1"))
    await act(async () => { fail(new Error("offline")) })
    await waitFor(() => expect(getByRole("button").textContent).toBe("todo|0"))
  })
  it("SignaturePad takes ref as a plain prop (no forwardRef)", () => {
    expect(src("components/signature-pad.tsx")).not.toMatch(/forwardRef[<(]/)
    const ref = React.createRef<SignaturePadHandle>()
    HTMLCanvasElement.prototype.getContext = (() => ({ scale() {}, clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {} })) as never
    render(<SignaturePad ref={ref} />)
    expect(ref.current?.isEmpty()).toBe(true)
  })
  it("no forwardRef left anywhere in the kit", () => {
    for (const f of ["components/signature-pad.tsx", "components/actions.tsx", "heavy/kanban.tsx"]) expect(src(f)).not.toMatch(/forwardRef[<(]/)
  })
  it("ExpandCard opens from its card and closes with the ✕", async () => {
    const { getByRole, queryByRole } = render(<ExpandCard title="ກະ 06:00–18:00" summary={<b>ກະ</b>}><p>ລາຍລະອຽດ</p></ExpandCard>)
    const card = getByRole("button", { name: "ກະ" })
    expect(card.getAttribute("aria-expanded")).toBe("false")
    fireEvent.click(card)
    expect(getByRole("region", { name: "ກະ 06:00–18:00" })).toBeTruthy()
    fireEvent.click(getByRole("button", { name: "ປິດ" }))
    await waitFor(() => expect(queryByRole("region")).toBeNull(), { timeout: 1000 })
  })
})
