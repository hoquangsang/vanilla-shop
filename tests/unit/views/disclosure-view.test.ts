import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DisclosureView } from "../../../src/views/disclosure-view";

let toggle: HTMLButtonElement;
let panel: HTMLElement;
let outside: HTMLElement;
let view: DisclosureView;

beforeEach(() => {
  document.body.innerHTML = `<button id="t">Toggle</button><div id="p" hidden>Panel</div><p id="o">x</p>`;
  toggle = document.querySelector("#t")!;
  panel = document.querySelector("#p")!;
  outside = document.querySelector("#o")!;
});

afterEach(() => view.destroy());

describe("DisclosureView", () => {
  it("starts closed and mirrors hidden into aria-expanded", () => {
    view = new DisclosureView(toggle, panel);
    expect(view.isOpen).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("toggles on click", () => {
    view = new DisclosureView(toggle, panel);
    toggle.click();
    expect(panel.hidden).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    toggle.click();
    expect(panel.hidden).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape and returns focus to the toggle", () => {
    view = new DisclosureView(toggle, panel);
    view.open();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(view.isOpen).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it("closes on an outside click but not on a click inside the panel", () => {
    view = new DisclosureView(toggle, panel);
    view.open();
    panel.click();
    expect(view.isOpen).toBe(true);
    outside.click();
    expect(view.isOpen).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("ignores Escape and outside clicks while not dismissable", () => {
    view = new DisclosureView(toggle, panel, { dismissable: () => false });
    view.open();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    outside.click();
    expect(view.isOpen).toBe(true);
    toggle.click();
    expect(view.isOpen).toBe(false);
  });
});

describe("nested disclosures", () => {
  it("closes only the innermost open panel on Escape (inner registered first)", () => {
    document.body.innerHTML = `<button id="a"></button><div id="pa"><button id="b"></button><div id="pb"></div></div>`;
    const inner = new DisclosureView(document.querySelector("#b")!, document.querySelector("#pb")!);
    const outer = new DisclosureView(document.querySelector("#a")!, document.querySelector("#pa")!);
    outer.open();
    inner.open();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", cancelable: true }));
    expect(inner.isOpen).toBe(false);
    expect(outer.isOpen).toBe(true);
    inner.destroy();
    outer.destroy();
    view = new DisclosureView(toggle, panel);
  });
});
