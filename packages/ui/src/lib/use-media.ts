import * as React from "react"
/** true when viewport is <= 768 px (the one breakpoint). SSR-safe. */
export function useIsMobile(query = "(max-width: 768px)") {
  const [m, setM] = React.useState(() => typeof window !== "undefined" && window.matchMedia(query).matches)
  React.useEffect(() => {
    const mq = window.matchMedia(query), f = () => setM(mq.matches)
    f(); mq.addEventListener("change", f); return () => mq.removeEventListener("change", f)
  }, [query])
  return m
}
