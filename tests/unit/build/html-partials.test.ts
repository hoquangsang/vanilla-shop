import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { inlinePartials } from "../../../build/html-partials";

describe("inlinePartials", () => {
  let dir: string;

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "partials-"));
    writeFileSync(join(dir, "header.html"), "<header>Header</header>\n");
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("replaces an include comment with the partial content", () => {
    const html = "<body><!-- @include partials/header.html --><main></main></body>";
    expect(inlinePartials(html, dir)).toBe("<body><header>Header</header><main></main></body>");
  });

  it("leaves other comments alone", () => {
    const html = "<main><!-- region:hero --><!-- just a note --></main>";
    expect(inlinePartials(html, dir)).toBe(html);
  });

  it("throws a clear error when the partial is missing", () => {
    const html = "<!-- @include partials/missing.html -->";
    expect(() => inlinePartials(html, dir)).toThrow(/Partial not found: .*missing\.html/);
  });
});
