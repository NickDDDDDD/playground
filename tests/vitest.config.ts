import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    coverage: {
      reportsDirectory: "./tests/coverage"
    },
    include: [
      "apps/**/*.{test,spec}.{ts,tsx}",
      "packages/**/*.{test,spec}.{ts,tsx}"
    ],
    exclude: ["**/node_modules/**", "**/dist/**"]
  }
});
