import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { inlinePartials } from "../../../build/html-partials";

describe("inlinePartials", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "partials-"));
    writeFileSync(join(dir, "header.html"), "<header>Hi</header>\n");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("replaces an include with the partial content", () => {
    const out = inlinePartials("<body><!-- @include partials/header.html --></body>", dir);
    expect(out).toBe("<body><header>Hi</header></body>");
  });

  it("leaves other comments alone", () => {
    const html = "<!-- region:hero --><!-- just a note -->";
    expect(inlinePartials(html, dir)).toBe(html);
  });

  it("throws on a missing file", () => {
    expect(() => inlinePartials("<!-- @include partials/nope.html -->", dir)).toThrow(/not found/);
  });
});
