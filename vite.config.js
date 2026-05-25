import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: '',
  build: {
    manifest: true,
    rolldownOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        catalog: resolve(import.meta.dirname, "catalog.html"),
        solution: resolve(import.meta.dirname, "solution.html"),
      },
      output: {
        manualChunks: undefined,
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      }
    },
  },
});
