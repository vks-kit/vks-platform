import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider, PerfProvider, TooltipProvider, initPerf } from "@vks-kit/ui"
import { App } from "./App"
import { More } from "./More"

function Root() {
  const [h, setH] = useState(location.hash)
  useEffect(() => { const f = () => setH(location.hash); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f) }, [])
  // App has its own TooltipProvider; More did not, so Part 2 crashed ("Tooltip must be used within TooltipProvider")
  return h.startsWith("#/more") ? <TooltipProvider><More /></TooltipProvider> : <App />
}
initPerf()
createRoot(document.getElementById("root")!).render(<StrictMode><ThemeProvider><PerfProvider><Root /></PerfProvider></ThemeProvider></StrictMode>)
