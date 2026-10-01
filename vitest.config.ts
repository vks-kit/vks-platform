import { defineConfig } from "vitest/config"
export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: { include: ["packages/**/*.test.{ts,tsx}", "apps/**/*.test.{ts,tsx}"], environment: "node" },
})
