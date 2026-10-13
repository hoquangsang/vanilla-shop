import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const OUT = "docs/screenshots";
const PAGES = ["home", "detail"] as const;
const WIDTHS = [375, 768, 1440];

async function isUp(): Promise<boolean> {
  try {
    return (await fetch(BASE)).ok;
  } catch {
    return false;
  }
}

async function main() {
  const server = (await isUp())
    ? null
    : spawn("pnpm", ["exec", "vite", "preview", "--port", String(PORT), "--strictPort"], {
        stdio: "ignore",
      });
  for (let i = 0; i < 50 && !(await isUp()); i++) await new Promise((r) => setTimeout(r, 200));

  const browser = await chromium.launch();
  try {
    await mkdir(OUT, { recursive: true });
    for (const name of PAGES) {
      for (const width of WIDTHS) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(`${BASE}/${name === "home" ? "index" : "detail"}.html`, {
          waitUntil: "networkidle",
        });
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 50));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForLoadState("networkidle");
        await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true });
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server?.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
