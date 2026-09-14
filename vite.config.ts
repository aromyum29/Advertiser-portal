import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve `figma:asset/<filename>` imports to real files copied into
// src/figma-assets/. Falls back is not provided — if a file is missing,
// Vite will surface a clear resolution error.
const figmaAssetResolver = {
  name: "figma-asset-resolver",
  enforce: "pre" as const,
  resolveId(id: string) {
    if (id.startsWith("figma:asset/")) {
      const filename = id.slice("figma:asset/".length);
      return path.resolve(__dirname, "src/figma-assets", filename);
    }
  },
};

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [figmaAssetResolver],
  },
});
