import { mkdir, readFile, writeFile } from "node:fs/promises";
import subsetFont from "subset-font";

const CSS = "src/styles/icons.css";
const FONTS = ["fa-solid-900", "fa-brands-400"];
const SRC_DIR = "node_modules/@fortawesome/fontawesome-free/webfonts";
const OUT_DIR = "src/assets/fonts";

async function main() {
  const css = await readFile(CSS, "utf8");
  const codepoints = [...css.matchAll(/--fa:\s*"\\([0-9a-f]{4,5})"/gi)].map((m) =>
    parseInt(m[1] ?? "", 16),
  );
  if (codepoints.length === 0) {
    console.error(`No --fa codepoints found in ${CSS}`);
    process.exit(1);
  }
  const text = String.fromCodePoint(...codepoints);
  await mkdir(OUT_DIR, { recursive: true });
  for (const name of FONTS) {
    const input = await readFile(`${SRC_DIR}/${name}.woff2`);
    const output = await subsetFont(input, text, { targetFormat: "woff2" });
    await writeFile(`${OUT_DIR}/${name}.woff2`, output);
    console.log(`${OUT_DIR}/${name}.woff2 ${output.length} bytes`);
  }
}

void main();
