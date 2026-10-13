import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AddToCartView } from "../../../src/views/add-to-cart-view";

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = `<div id="list"></div>`;
});
afterEach(() => vi.useRealTimers());

function addButton(id: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.dataset.addToCart = id;
  button.innerHTML = "<span>Add to cart</span>";
  document.getElementById("list")!.append(button);
  return button;
}

describe("AddToCartView", () => {
  it("handles clicks on buttons added after binding", () => {
    const handler = vi.fn();
    new AddToCartView().bindAdd(handler);
    const button = addButton("p2");
    button.querySelector("span")!.click();
    expect(handler).toHaveBeenCalledWith("p2", button);
  });

  it("ignores clicks elsewhere", () => {
    const handler = vi.fn();
    new AddToCartView().bindAdd(handler);
    document.body.click();
    expect(handler).not.toHaveBeenCalled();
  });

  it("shows Added ✓ for 1s then restores the label, restarting on re-click", () => {
    const view = new AddToCartView();
    const button = addButton("p1");
    button.textContent = "Add to cart";
    view.showAdded(button);
    expect(button.textContent).toBe("Added ✓");
    vi.advanceTimersByTime(600);
    view.showAdded(button);
    vi.advanceTimersByTime(600);
    expect(button.textContent).toBe("Added ✓");
    vi.advanceTimersByTime(400);
    expect(button.textContent).toBe("Add to cart");
  });
});
