import { describe, expect, it, vi } from "vitest";
import { CartController } from "../../../src/controllers/cart-controller";
import { createMemoryStorage } from "../../../src/core/storage";
import { CartModel } from "../../../src/models/cart-model";

function setup(seed?: string) {
  const storage = createMemoryStorage();
  if (seed) storage.set(CartModel.STORAGE_KEY, seed);
  const badge = { render: vi.fn(), announce: vi.fn() };
  let add: (id: string, button: HTMLButtonElement) => void = () => {};
  const buttons = {
    bindAdd: vi.fn((handler: typeof add) => {
      add = handler;
    }),
    showAdded: vi.fn(),
  };
  new CartController(new CartModel(storage), badge, buttons).init();
  return {
    storage,
    badge,
    buttons,
    click: (id: string, b = document.createElement("button")) => add(id, b),
  };
}

describe("CartController", () => {
  it("renders the stored count on init", () => {
    const { badge } = setup(JSON.stringify({ version: 1, items: { p1: 2 } }));
    expect(badge.render).toHaveBeenCalledWith(2);
    expect(badge.announce).not.toHaveBeenCalled();
  });

  it("adds to the model, renders, announces and gives feedback", () => {
    const { badge, buttons, click } = setup();
    const button = document.createElement("button");
    click("p1", button);
    click("p2", button);
    expect(badge.render).toHaveBeenLastCalledWith(2);
    expect(badge.announce).toHaveBeenLastCalledWith(2);
    expect(buttons.showAdded).toHaveBeenCalledWith(button);
  });

  it("follows external storage changes", () => {
    const { storage, badge } = setup();
    storage.simulateExternalChange(
      CartModel.STORAGE_KEY,
      JSON.stringify({ version: 1, items: { p1: 4 } }),
    );
    expect(badge.render).toHaveBeenLastCalledWith(4);
  });
});
