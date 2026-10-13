import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CategoriesMenuView } from "../../../src/views/categories-menu-view";

class FakeMedia extends EventTarget {
  matches = false;
  set(value: boolean): void {
    this.matches = value;
    this.dispatchEvent(new Event("change"));
  }
}

let toggle: HTMLButtonElement;
let menu: HTMLElement;
let view: CategoriesMenuView;

beforeEach(() => {
  document.body.innerHTML = `<button id="t">Categories</button><ul id="m" hidden></ul><p id="o">x</p>`;
  toggle = document.querySelector("#t")!;
  menu = document.querySelector("#m")!;
});

afterEach(() => view.destroy());

describe("CategoriesMenuView", () => {
  it("is open on load when pinned", () => {
    view = new CategoriesMenuView(toggle, menu, { pinnedOpen: () => true });
    expect(menu.hidden).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("stays open on Escape and outside click when pinned, but the button still toggles", () => {
    view = new CategoriesMenuView(toggle, menu, { pinnedOpen: () => true });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    document.querySelector<HTMLElement>("#o")!.click();
    expect(view.isOpen).toBe(true);
    toggle.click();
    expect(view.isOpen).toBe(false);
  });

  it("is closed on load and dismissable when not pinned", () => {
    view = new CategoriesMenuView(toggle, menu, { pinnedOpen: () => false });
    expect(view.isOpen).toBe(false);
    toggle.click();
    expect(view.isOpen).toBe(true);
    document.querySelector<HTMLElement>("#o")!.click();
    expect(view.isOpen).toBe(false);
  });

  it("re-evaluates when the media query changes", () => {
    const media = new FakeMedia();
    view = new CategoriesMenuView(toggle, menu, {
      pinnedOpen: () => media.matches,
      media: media as unknown as MediaQueryList,
    });
    expect(view.isOpen).toBe(false);
    media.set(true);
    expect(view.isOpen).toBe(true);
    media.set(false);
    expect(view.isOpen).toBe(false);
  });
});
