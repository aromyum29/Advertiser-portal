import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The domain layer is pure, so it runs without a DOM.
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
});
