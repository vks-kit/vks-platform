import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { ThemeProvider, TooltipProvider, Toaster, PerfProvider, initPerf } from "@vks-kit/ui"
import App from "./App"

initPerf()
createRoot(document.getElementById("root")!).render(
  <StrictMode><ThemeProvider><PerfProvider><TooltipProvider><App /><Toaster /></TooltipProvider></PerfProvider></ThemeProvider></StrictMode>,
)
