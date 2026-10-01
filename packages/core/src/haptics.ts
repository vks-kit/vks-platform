/** Success buzz from the branding rules. iPhones ignore it (no vibrate API), so it never throws. */
export const haptics = {
  success: () => { try { navigator.vibrate?.([50, 20, 50]) } catch {} },
  error: () => { try { navigator.vibrate?.([120]) } catch {} },
  /** Tiny tick for selections / tab changes (Android only). */
  tap: () => { try { navigator.vibrate?.(8) } catch {} },
}
