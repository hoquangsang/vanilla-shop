import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NavMenuView } from "../../../src/views/nav-menu-view";

class FakeMedia extends EventTarget {
  matches = false;
  set(value: boolean): void {
    this.matches = value;
    this.dispatchEvent(new Event("change"));
  }
}

let toggle: HTMLButtonElement;
let menu: HTMLElement;
let media: FakeMedia;
let view: NavMenuView;

beforeEach(() => {
  document.body.innerHTML = `<button id="t">Menu</button><div id="m" hidden></div>`;
  toggle = document.querySelector("#t")!;
  menu = document.querySelector("#m")!;
  media = new FakeMedia();
});

afterEach(() => view.destroy());

describe("NavMenuView", () => {
  it("is closed on mobile and toggles with the hamburger", () => {
    view = new NavMenuView(toggle, menu, media as unknown as MediaQueryList);
    expect(menu.hidden).toBe(true);
    toggle.click();
    expect(menu.hidden).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(menu.hidden).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
  });

  it("is shown inline on desktop and hidden again when the viewport shrinks", () => {
    media.matches = true;
    view = new NavMenuView(toggle, menu, media as unknown as MediaQueryList);
    expect(menu.hidden).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    media.set(false);
    expect(menu.hidden).toBe(true);
  });
});
