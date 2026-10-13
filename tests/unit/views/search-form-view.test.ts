import { beforeEach, describe, expect, it, vi } from "vitest";
import { SearchFormView } from "../../../src/views/search-form-view";

let form: HTMLFormElement;
let input: HTMLInputElement;
let view: SearchFormView;

beforeEach(() => {
  document.body.innerHTML = `<form><input type="search" name="q" /><button>go</button></form>`;
  form = document.querySelector("form")!;
  input = document.querySelector("input")!;
  view = new SearchFormView(form, input);
});

describe("SearchFormView", () => {
  it("prevents the native submit and passes the raw input value", () => {
    const handler = vi.fn();
    view.bindSubmit(handler);
    input.value = "  serum ";
    const event = new Event("submit", { cancelable: true });
    form.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(handler).toHaveBeenCalledWith("  serum ");
  });

  it("shows the error with aria attributes and keeps focus", () => {
    view.showError("Please enter a keyword");
    const hint = document.getElementById(input.getAttribute("aria-describedby")!)!;
    expect(hint.textContent).toBe("Please enter a keyword");
    expect(hint.classList.contains("invisible")).toBe(false);
    expect(hint.getAttribute("role")).toBe("status");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(input);
  });

  it("clears the error when the user types", () => {
    view.showError("Please enter a keyword");
    input.dispatchEvent(new Event("input"));
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(input.hasAttribute("aria-describedby")).toBe(false);
    expect(form.querySelector("[role=status]")!.classList.contains("invisible")).toBe(true);
  });
});
