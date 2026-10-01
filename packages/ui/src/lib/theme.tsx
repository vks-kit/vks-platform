import * as React from "react"

export type Theme = "light" | "dark"
type Ctx = { theme: Theme; setTheme: (t: Theme) => void }
const ThemeContext = React.createContext<Ctx>({ theme: "light", setTheme: () => {} })
const KEY = "vks-theme"

/** Light (theme A) is the default. Dark (theme E) is opt-in, e.g. for night shifts. */
export function ThemeProvider({ children, defaultTheme = "light" }: { children: React.ReactNode; defaultTheme?: Theme }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    try { const s = localStorage.getItem(KEY); if (s === "light" || s === "dark") return s } catch {}
    return defaultTheme
  })
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])
  const setTheme = React.useCallback((t: Theme) => {
    try { localStorage.setItem(KEY, t) } catch {}
    setThemeState(t)
  }, [])
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
export const useTheme = () => React.useContext(ThemeContext)
