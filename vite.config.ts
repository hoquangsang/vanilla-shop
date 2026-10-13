/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { htmlPartials } from "./build/html-partials.ts";

export default defineConfig({
  base: "./",
  plugins: [htmlPartials({ root: "src/partials" }), tailwindcss()],
  build: {
    rollupOptions: {
      input: { index: "index.html", detail: "detail.html" },
    },
  },
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
    passWithNoTests: true,
  },
});
