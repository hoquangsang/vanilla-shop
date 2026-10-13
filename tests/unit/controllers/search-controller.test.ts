import { describe, expect, it, vi } from "vitest";
import { SearchController } from "../../../src/controllers/search-controller";
import { SearchModel } from "../../../src/models/search-model";

function setup() {
  let submit: (raw: string) => void = () => {};
  const view = {
    bindSubmit: vi.fn((handler: typeof submit) => {
      submit = handler;
    }),
    showError: vi.fn(),
  };
  const navigator = { go: vi.fn() };
  new SearchController(new SearchModel(), view, navigator).init();
  return { view, navigator, submit: (raw: string) => submit(raw) };
}

describe("SearchController", () => {
  it("navigates to the encoded Detail URL on a valid query", () => {
    const { navigator, view, submit } = setup();
    submit("  Reasonable Price ");
    expect(navigator.go).toHaveBeenCalledWith("detail.html?q=Reasonable+Price");
    expect(view.showError).not.toHaveBeenCalled();
  });

  it("encodes special characters", () => {
    const { navigator, submit } = setup();
    submit("a&b=c");
    expect(navigator.go).toHaveBeenCalledWith("detail.html?q=a%26b%3Dc");
  });

  it("shows an error and does not navigate on a blank query", () => {
    const { navigator, view, submit } = setup();
    submit("   ");
    expect(view.showError).toHaveBeenCalledWith("Please enter a keyword");
    expect(navigator.go).not.toHaveBeenCalled();
  });
});
