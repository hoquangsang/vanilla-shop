import { describe, expect, it, vi } from "vitest";
import { SearchModel } from "../../../src/models/search-model";

describe("SearchModel", () => {
  it("Surrounding spaces are removed", () => {
    const m = new SearchModel();
    expect(m.submit("  Reasonable Price  ")).toBe(true);
    expect(m.query).toBe("Reasonable Price");
  });

  it("Very long input is cut", () => {
    const m = new SearchModel();
    const long = "a".repeat(100) + "b".repeat(100) + "c".repeat(50);
    m.submit(long);
    expect(m.query).toBe(long.slice(0, 200));
  });

  it("does not split an emoji when cutting", () => {
    expect(SearchModel.normalise("😊".repeat(250))).toBe("😊".repeat(200));
  });

  it("Only spaces", () => {
    const m = new SearchModel();
    m.submit("serum");
    const fn = vi.fn();
    m.on("change", fn);
    expect(m.submit("    ")).toBe(false);
    expect(m.query).toBe("serum");
    expect(fn).not.toHaveBeenCalled();
  });

  it("Subscriber receives the query", () => {
    const m = new SearchModel();
    const fn = vi.fn();
    m.on("change", fn);
    m.submit("serum");
    expect(fn).toHaveBeenCalledExactlyOnceWith("serum");
  });

  it("Plain text", () => {
    expect(new SearchModel().toDetailUrl("Reasonable Price")).toBe(
      "detail.html?q=Reasonable+Price",
    );
  });

  it("defaults the URL to the current query", () => {
    const m = new SearchModel();
    m.submit("serum");
    expect(m.toDetailUrl()).toBe("detail.html?q=serum");
  });

  it("Special characters round-trip", () => {
    const q = "Giá hợp lý & <b>#1</b>? 😊";
    const url = new SearchModel().toDetailUrl(q);
    const search = url.slice(url.indexOf("?"));
    expect(SearchModel.fromSearch(search)).toBe(q);
  });

  it("Query present", () => {
    expect(SearchModel.fromSearch("?q=Reasonable%20Price")).toBe("Reasonable Price");
  });

  it("Query missing", () => {
    expect(SearchModel.fromSearch("")).toBe("");
    expect(SearchModel.fromSearch("?foo=bar")).toBe("");
    expect(SearchModel.fromSearch("?q=%20%20")).toBe("");
  });

  it("Malformed encoding", () => {
    expect(() => SearchModel.fromSearch("?q=100%")).not.toThrow();
    expect(SearchModel.fromSearch("?q=100%")).toBe("100%");
  });
});
