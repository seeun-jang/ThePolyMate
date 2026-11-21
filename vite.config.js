import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  esbuild: { jsx: "automatic" },
  server: {
    watch: { ignored: ["**/legacy/**", "**/docs/**"] },
  },
  build: { target: "es2020" },
});
