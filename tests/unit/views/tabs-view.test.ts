import { beforeEach, describe, expect, it, vi } from "vitest";
import { TabsView } from "../../../src/views/tabs-view";

describe("TabsView", () => {
  let root: HTMLElement;
  const tab = (id: string) => document.getElementById(id)!;
  const key = (id: string, k: string) =>
    tab(id).dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <div role="tablist">
          <button role="tab" id="tab-a" aria-controls="panel-a" aria-selected="true">A</button>
          <button role="tab" id="tab-b" aria-controls="panel-b" aria-selected="false">B</button>
        </div>
        <div role="tabpanel" id="panel-a"></div>
        <div role="tabpanel" id="panel-b" hidden></div>
      </div>`;
    root = document.getElementById("root")!;
  });

  it("selects the first tab and roves tabindex on load", () => {
    new TabsView(root);
    expect(tab("tab-a").getAttribute("aria-selected")).toBe("true");
    expect(tab("tab-a").tabIndex).toBe(0);
    expect(tab("tab-b").tabIndex).toBe(-1);
    expect(document.getElementById("panel-b")!.hidden).toBe(true);
  });

  it("switches panels on click and reports the tab id", () => {
    const onSelect = vi.fn();
    new TabsView(root, onSelect);
    tab("tab-b").click();
    expect(tab("tab-b").getAttribute("aria-selected")).toBe("true");
    expect(tab("tab-a").getAttribute("aria-selected")).toBe("false");
    expect(document.getElementById("panel-a")!.hidden).toBe(true);
    expect(document.getElementById("panel-b")!.hidden).toBe(false);
    expect(onSelect).toHaveBeenCalledWith("tab-b");
  });

  it("supports arrow, Home and End keys with wrap-around and moves focus", () => {
    new TabsView(root);
    key("tab-a", "ArrowRight");
    expect(tab("tab-b").getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tab("tab-b"));
    key("tab-b", "ArrowRight");
    expect(tab("tab-a").getAttribute("aria-selected")).toBe("true");
    key("tab-a", "ArrowLeft");
    expect(tab("tab-b").getAttribute("aria-selected")).toBe("true");
    key("tab-b", "Home");
    expect(tab("tab-a").getAttribute("aria-selected")).toBe("true");
    key("tab-a", "End");
    expect(tab("tab-b").getAttribute("aria-selected")).toBe("true");
  });
});
