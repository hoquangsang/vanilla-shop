import { describe, expect, it, vi } from "vitest";
import { createMemoryStorage, type KeyValueStorage } from "../../../src/core/storage";
import { CartModel, parseCart } from "../../../src/models/cart-model";

const KEY = CartModel.STORAGE_KEY;

describe("CartModel", () => {
  it("First visit", () => {
    const cart = new CartModel(createMemoryStorage());
    expect(cart.count).toBe(0);
    expect(cart.getState().items).toEqual({});
  });

  it("Add one product", () => {
    const cart = new CartModel(createMemoryStorage());
    cart.add("p1");
    expect(cart.getState().items.p1).toBe(1);
    expect(cart.count).toBe(1);
  });

  it("Add the same product repeatedly", () => {
    const cart = new CartModel(createMemoryStorage());
    for (let i = 0; i < 3; i++) cart.add("p1");
    expect(cart.getState().items.p1).toBe(3);
    expect(cart.count).toBe(3);
  });

  it("Add different products", () => {
    const cart = new CartModel(createMemoryStorage());
    cart.add("p1");
    cart.add("p1");
    cart.add("p2");
    expect(cart.count).toBe(3);
  });

  it("Empty id", () => {
    const cart = new CartModel(createMemoryStorage());
    const fn = vi.fn();
    cart.on("change", fn);
    cart.add("");
    cart.add("   ");
    expect(cart.count).toBe(0);
    expect(fn).not.toHaveBeenCalled();
  });

  it("Subscriber is told about an add", () => {
    const cart = new CartModel(createMemoryStorage());
    const fn = vi.fn();
    cart.on("change", fn);
    cart.add("p1");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0]?.[0]).toMatchObject({ count: 1, items: { p1: 1 } });
  });

  it("Unsubscribed listener is not called", () => {
    const cart = new CartModel(createMemoryStorage());
    const fn = vi.fn();
    const off = cart.on("change", fn);
    off();
    cart.add("p1");
    expect(fn).not.toHaveBeenCalled();
  });

  it("Survives reload", () => {
    const storage = createMemoryStorage();
    const first = new CartModel(storage);
    first.add("p1");
    first.add("p1");
    expect(JSON.parse(storage.get(KEY) ?? "")).toEqual({ version: 1, items: { p1: 2 } });
    expect(new CartModel(storage).count).toBe(2);
  });

  it("Garbage in storage", () => {
    const storage = createMemoryStorage();
    storage.set(KEY, "{not json");
    expect(() => new CartModel(storage)).not.toThrow();
    expect(new CartModel(storage).count).toBe(0);
  });

  it("Partly invalid items", () => {
    const storage = createMemoryStorage();
    storage.set(KEY, '{"version":1,"items":{"p1":2,"p2":-1,"p3":"x","p4":1.5}}');
    const cart = new CartModel(storage);
    expect(cart.getState().items).toEqual({ p1: 2 });
    expect(cart.count).toBe(2);
  });

  it("Storage disabled", () => {
    const boom = (): never => {
      throw new Error("denied");
    };
    const storage: KeyValueStorage = { get: boom, set: boom, onExternalChange: () => () => {} };
    const cart = new CartModel(storage);
    const fn = vi.fn();
    cart.on("change", fn);
    expect(() => cart.add("p1")).not.toThrow();
    expect(cart.count).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("Other tab adds a product", () => {
    const storage = createMemoryStorage();
    const cart = new CartModel(storage);
    const fn = vi.fn();
    cart.on("change", fn);
    storage.simulateExternalChange(KEY, '{"version":1,"items":{"p1":3,"p2":1}}');
    expect(cart.count).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("stops listening to other tabs after dispose", () => {
    const storage = createMemoryStorage();
    const cart = new CartModel(storage);
    cart.dispose();
    storage.simulateExternalChange(KEY, '{"version":1,"items":{"p1":3}}');
    expect(cart.count).toBe(0);
  });

  it("counts ids that collide with Object.prototype members", () => {
    const cart = new CartModel(createMemoryStorage());
    cart.add("constructor");
    cart.add("constructor");
    cart.add("__proto__");
    expect(cart.count).toBe(3);
    expect(cart.getState().count).toBe(3);
    expect(Object.getPrototypeOf(cart.getState().items)).toBeNull();
  });

  it("returns frozen copies from getState", () => {
    const cart = new CartModel(createMemoryStorage());
    cart.add("p1");
    const state = cart.getState();
    expect(Object.isFrozen(state)).toBe(true);
    cart.add("p1");
    expect(state.items.p1).toBe(1);
  });
});

describe("parseCart", () => {
  it.each([null, "", "[]", "null", '{"version":2,"items":{}}', '{"version":1,"items":[]}'])(
    "treats %j as empty",
    (raw) => {
      expect(parseCart(raw)).toEqual({});
    },
  );
});
