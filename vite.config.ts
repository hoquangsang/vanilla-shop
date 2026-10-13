import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import { htmlPartials } from "./build/html-partials";

export default defineConfig({
  base: "./",
  plugins: [htmlPartials({ root: "src/partials" }), tailwindcss()],
  build: { rollupOptions: { input: { index: "index.html", detail: "detail.html" } } },
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
    passWithNoTests: true,
  },
});
