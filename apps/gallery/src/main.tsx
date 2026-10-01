import { StrictMode, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider, PerfProvider, initPerf } from "@vks/ui"
import { App } from "./App"
import { More } from "./More"

function Root() {
  const [h, setH] = useState(location.hash)
  useEffect(() => { const f = () => setH(location.hash); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f) }, [])
  return h.startsWith("#/more") ? <More /> : <App />
}
initPerf()
createRoot(document.getElementById("root")!).render(<StrictMode><ThemeProvider><PerfProvider><Root /></PerfProvider></ThemeProvider></StrictMode>)
