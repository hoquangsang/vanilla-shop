import { afterEach, describe, expect, it, vi } from "vitest";
import { createBrowserStorage, createMemoryStorage } from "../../../src/core/storage";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("memory storage", () => {
  it("round-trips a value and returns null when missing", () => {
    const s = createMemoryStorage();
    expect(s.get("k")).toBeNull();
    s.set("k", "v");
    expect(s.get("k")).toBe("v");
  });

  it("fires the external change callback only for its key", () => {
    const s = createMemoryStorage();
    const cb = vi.fn();
    s.onExternalChange("a", cb);
    s.simulateExternalChange("b", "x");
    s.simulateExternalChange("a", "y");
    expect(cb).toHaveBeenCalledExactlyOnceWith("y");
  });

  it("stops the callback after unsubscribe", () => {
    const s = createMemoryStorage();
    const cb = vi.fn();
    const off = s.onExternalChange("a", cb);
    off();
    s.simulateExternalChange("a", "y");
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("browser storage", () => {
  it("round-trips a value through localStorage", () => {
    localStorage.clear();
    const s = createBrowserStorage();
    s.set("k", "v");
    expect(localStorage.getItem("k")).toBe("v");
    expect(s.get("k")).toBe("v");
  });

  it("does not throw when localStorage throws", () => {
    const boom = (): never => {
      throw new Error("denied");
    };
    vi.stubGlobal("localStorage", {
      getItem: boom,
      setItem: boom,
    });
    const s = createBrowserStorage();
    expect(() => s.set("k", "v")).not.toThrow();
    expect(() => s.get("k")).not.toThrow();
  });

  it("does not throw when accessing localStorage itself throws", () => {
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("denied");
      },
    });
    try {
      const s = createBrowserStorage();
      expect(() => s.set("k", "v")).not.toThrow();
      expect(s.get("k")).toBe("v");
    } finally {
      if (original) Object.defineProperty(window, "localStorage", original);
    }
  });

  it("fires the callback for storage events of its key only, and unsubscribes", () => {
    const s = createBrowserStorage();
    const cb = vi.fn();
    const off = s.onExternalChange("a", cb);
    window.dispatchEvent(new StorageEvent("storage", { key: "b", newValue: "1" }));
    window.dispatchEvent(new StorageEvent("storage", { key: "a", newValue: "2" }));
    expect(cb).toHaveBeenCalledExactlyOnceWith("2");
    off();
    window.dispatchEvent(new StorageEvent("storage", { key: "a", newValue: "3" }));
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
