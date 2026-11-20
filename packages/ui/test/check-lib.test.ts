import { describe, expect, it } from "vitest"
import { MIN_TAP, SIZES, report } from "../bin/check-lib.mjs"

const phone = SIZES[0], desk = SIZES[2]
const clean = { wide: [], small: [], stuck: [], docW: 360, vw: 360 }

describe("vks-check report", () => {
  it("checks the smallest phone, a large phone and a laptop", () => {
    expect(SIZES.map((s) => s.width + "x" + s.height)).toEqual(["360x640", "390x844", "1440x900"])
    expect(MIN_TAP).toBe(44)
  })
  it("a clean screen has no lines", () => { expect(report(phone, "list", clean)).toEqual([]) })
  it("names each problem with the size and page", () => {
    const l = report(phone, "list", { wide: ["li 020 7794 7314 (435 px)"], small: ["remove 28 px"], stuck: ["ກັ່ນຕອງ: «ຕົກລົງ» at 690 px, screen 640 px"], docW: 435, vw: 360 }, ["boom"])
    expect(l).toHaveLength(5)
    expect(l[0]).toContain("[sideways]"); expect(l[1]).toContain("[too-wide]"); expect(l[2]).toContain("[buttons-off-screen]")
    expect(l[3]).toContain("[tap-under-44]"); expect(l[4]).toContain("[console-error]")
    expect(l.every((x) => x.startsWith("phone-small 360x640 list"))).toBe(true)
  })
  it("0.6.2 layout rules: off-centre popup, two-row footer, unnamed icon, repeating top bar", () => {
    const l = report(desk, "board", { ...clean, docW: 1440, vw: 1440, offCentre: ["ນັດ above the middle by 180 px"], wrapped: ["ນັດ: 6 buttons on 2 rows"], unnamed: ["button (size-11) at 20,30"], topbar: ["«VKS QC · 21/11» 56 px"] })
    expect(l.map((x) => x.match(/\[[^\]]+\]/)?.[0])).toEqual(["[popup-off-centre]", "[buttons-two-rows]", "[icon-without-name]", "[top-bar-repeats]"])
  })
  it("old measurements without the 0.6.2 fields still report cleanly", () => {
    expect(report(desk, "list", { ...clean, docW: 1440, vw: 1440 })).toEqual([])
  })
  it("tap size is a phone rule only", () => {
    expect(report(desk, "list", { ...clean, docW: 1440, vw: 1440, small: ["x 28 px"] })).toEqual([])
  })
})
