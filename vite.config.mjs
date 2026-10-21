import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative paths work on the Vercel root and GitHub Pages project URL.
  base: "./",
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  plugins: [
    {
      name: "copy-image-assets",
      apply: "build",
      writeBundle() {
        cpSync(resolve("image"), resolve("dist/image"), { recursive: true });
      },
    },
  ],
});
