/**
 * Phone checks that a code scan cannot see, measured in a real browser. Pure helpers here (unit-tested);
 * vks-check.mjs drives the browser. Every rule comes from a real bug in a VKS app (Call Center, 11/2026).
 */

/** Sizes every screen is checked at: the smallest common phone, a large phone, a laptop. */
export const SIZES = [
  { name: "phone-small", width: 360, height: 640, mobile: true },
  { name: "phone", width: 390, height: 844, mobile: true },
  { name: "desktop", width: 1440, height: 900, mobile: false },
]

/** Smallest tap target on a touch screen (WCAG / Apple HIG), in CSS px. */
export const MIN_TAP = 44

/**
 * Runs inside the page. Returns what is wrong on the current screen:
 *  wide  = elements reaching past the right edge (the page scrolls sideways or a row is cut off)
 *  small = visible buttons/links/inputs under 44 px tall on a phone (their hit area, ::after included)
 *  stuck = dialog buttons that are below the bottom of the screen (a sheet whose buttons scrolled away)
 */
export function measure({ minTap, width, height }) {
  // the screen size is passed in: a phone browser that meets wide content zooms out and reports a wider innerWidth,
  // which would hide exactly the overflow we are looking for
  const vw = width ?? innerWidth, vh = height ?? innerHeight, out = { wide: [], small: [], stuck: [], docW: Math.max(document.documentElement.scrollWidth, innerWidth), vw }
  const name = (e) => (e.getAttribute("aria-label") || e.textContent || e.getAttribute("placeholder") || e.tagName).trim().replace(/\s+/g, " ").slice(0, 40)
  const shown = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !e.closest("[aria-hidden=true],[inert]") }
  for (const e of document.querySelectorAll("body *")) {
    if (!shown(e)) continue
    const r = e.getBoundingClientRect()
    // inside a sideways-scrolling strip is fine (chips, tabs, a board): only report what overflows the page itself
    if (r.right > vw + 1) { let p = e.parentElement, scrolls = false; while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if ((o === "auto" || o === "scroll" || o === "hidden" || o === "clip") && p.getBoundingClientRect().right <= vw + 1) { scrolls = true; break } p = p.parentElement } if (!scrolls) out.wide.push(e.tagName.toLowerCase() + " " + name(e) + " (" + Math.round(r.right) + " px)") }
  }
  const touch = matchMedia("(pointer: coarse)").matches || vw < 768
  if (touch) for (const e of document.querySelectorAll("button, a[href], [role=button], [role=radio], [role=tab], [role=switch], input:not([type=hidden]), select, textarea")) {
    if (!shown(e)) continue
    const r = e.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue
    const a = getComputedStyle(e, "::after"), extra = a.content && a.content !== "none" && a.position === "absolute" ? Math.max(0, -parseFloat(a.top) || 0) + Math.max(0, -parseFloat(a.bottom) || 0) : 0
    if (r.height + extra < minTap - 0.5 && !e.closest("[data-vks-check-skip]")) out.small.push(name(e) + " " + Math.round(r.height + extra) + " px")
  }
  for (const d of document.querySelectorAll("[role=dialog]")) {
    if (!shown(d)) continue
    const btns = [...d.querySelectorAll("button")].filter((b) => shown(b) && !b.closest("[aria-label=ປິດ]") && b.getAttribute("aria-label") !== "ປິດ")
    const last = btns.at(-1); if (!last) continue
    const r = last.getBoundingClientRect(); if (r.bottom > vh + 1) out.stuck.push(name(d) + ": «" + name(last) + "» at " + Math.round(r.top) + " px, screen " + vh + " px")
  }
  out.small = [...new Set(out.small)]; out.wide = [...new Set(out.wide)]
  return out
}

/** One line per problem, for the report. Pure, so it is tested without a browser. */
export function report(size, page, m, errors = []) {
  const where = size.name + " " + size.width + "x" + size.height + " " + page
  const lines = []
  if (m.docW > m.vw + 1) lines.push(where + "  [sideways]  page is " + m.docW + " px wide on a " + m.vw + " px screen")
  for (const w of m.wide.slice(0, 5)) lines.push(where + "  [too-wide]  " + w)
  for (const s of m.stuck) lines.push(where + "  [buttons-off-screen]  " + s)
  if (size.mobile) for (const s of m.small.slice(0, 8)) lines.push(where + "  [tap-under-44]  " + s)
  for (const e of errors.slice(0, 3)) lines.push(where + "  [console-error]  " + String(e).slice(0, 160))
  return lines
}
