import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@vks-kit/ui > recharts",
      "@vks-kit/ui > leaflet",
      "use-sync-external-store/shim/with-selector",
    ],
  },
  server: { port: 5199, strictPort: true },
})
