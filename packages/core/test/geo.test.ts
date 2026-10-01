import { describe, it, expect } from "vitest"
import { distanceM, withinRadius } from "../src/geo"
const vte = { lat: 17.9757, lng: 102.6331 }
describe("geo", () => {
  it("same point is 0", () => expect(distanceM(vte, vte)).toBe(0))
  it("0.001 deg latitude is about 111 m", () => { const d = distanceM(vte, { lat: vte.lat + 0.001, lng: vte.lng }); expect(d).toBeGreaterThan(105); expect(d).toBeLessThan(117) })
  it("radius check", () => { expect(withinRadius(vte, { lat: vte.lat + 0.0005, lng: vte.lng }, 100)).toBe(true); expect(withinRadius(vte, { lat: vte.lat + 0.01, lng: vte.lng }, 100)).toBe(false) })
})
