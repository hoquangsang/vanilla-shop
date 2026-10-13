// @vitest-environment node
import { readFileSync } from "node:fs";
import subsetFont from "subset-font";
import { describe, expect, it } from "vitest";

const FONTS = ["fa-solid-900", "fa-brands-400"].map((name) => ({
  name,
  data: readFileSync(`src/assets/fonts/${name}.woff2`),
}));

const css = readFileSync("src/styles/icons.css", "utf8");
const codepoints = [...css.matchAll(/--fa:\s*"\\([0-9a-f]{4,5})"/gi)].map((m) =>
  parseInt(m[1] ?? "", 16),
);

/** Glyph count of an sfnt buffer, read from its `maxp` table. */
function glyphCount(sfnt: Uint8Array): number {
  const view = new DataView(sfnt.buffer, sfnt.byteOffset, sfnt.byteLength);
  for (let i = 0; i < view.getUint16(4); i++) {
    const entry = 12 + i * 16;
    const tag = String.fromCharCode(...sfnt.subarray(entry, entry + 4));
    if (tag === "maxp") return view.getUint16(view.getUint32(entry + 8) + 4);
  }
  throw new Error("maxp table not found");
}

/** Subsetting to one character leaves only `.notdef` when the font lacks it. */
async function hasGlyph(data: Buffer, codepoint: number): Promise<boolean> {
  const out = await subsetFont(data, String.fromCodePoint(codepoint), { targetFormat: "sfnt" });
  return glyphCount(out) > 1;
}

describe("icon subset fonts", () => {
  it("finds the icon codepoints in icons.css", () => {
    expect(codepoints.length).toBeGreaterThan(0);
  });

  it.each(codepoints)("contains used icon U+%s in a subset font", async (codepoint) => {
    const found = await Promise.all(FONTS.map((f) => hasGlyph(f.data, codepoint)));
    expect(found.some(Boolean), `U+${codepoint.toString(16)} missing, run pnpm icons`).toBe(true);
  });

  it.each(FONTS)("keeps $name under 20 kB", ({ data }) => {
    expect(data.length).toBeLessThan(20 * 1024);
  });
});
