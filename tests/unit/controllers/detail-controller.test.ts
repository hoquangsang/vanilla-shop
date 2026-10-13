import { describe, expect, it, vi } from "vitest";
import { DetailController } from "../../../src/controllers/detail-controller";
import { SearchModel } from "../../../src/models/search-model";

function run(search: string) {
  const view = { render: vi.fn() };
  const model = new SearchModel();
  new DetailController(model, view, search).init();
  return { view, model };
}

describe("DetailController", () => {
  it("renders the query from the URL", () => {
    const { view, model } = run("?q=Reasonable+Price");
    expect(view.render).toHaveBeenLastCalledWith("Reasonable Price");
    expect(model.query).toBe("Reasonable Price");
  });

  it("decodes percent-encoded Unicode", () => {
    const { view } = run(`?q=${encodeURIComponent("Giá hợp lý 😊")}`);
    expect(view.render).toHaveBeenLastCalledWith("Giá hợp lý 😊");
  });

  it("renders an empty string when there is no query", () => {
    expect(run("").view.render).toHaveBeenLastCalledWith("");
    expect(run("?q=%20%20").view.render).toHaveBeenLastCalledWith("");
  });
});
