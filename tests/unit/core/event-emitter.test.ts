import { describe, expect, it, vi } from "vitest";
import { EventEmitter } from "../../../src/core/event-emitter";

class Bus extends EventEmitter<{ ping: number }> {
  fire(n: number): void {
    this.emit("ping", n);
  }
}

describe("EventEmitter", () => {
  it("calls a subscribed listener with the payload", () => {
    const bus = new Bus();
    const fn = vi.fn();
    bus.on("ping", fn);
    bus.fire(1);
    expect(fn).toHaveBeenCalledExactlyOnceWith(1);
  });

  it("calls multiple listeners", () => {
    const bus = new Bus();
    const a = vi.fn();
    const b = vi.fn();
    bus.on("ping", a);
    bus.on("ping", b);
    bus.fire(2);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("stops calling a listener after unsubscribe", () => {
    const bus = new Bus();
    const fn = vi.fn();
    const off = bus.on("ping", fn);
    off();
    bus.fire(3);
    expect(fn).not.toHaveBeenCalled();
  });

  it("a throwing listener does not block others", () => {
    const bus = new Bus();
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const ok = vi.fn();
    bus.on("ping", () => {
      throw new Error("boom");
    });
    bus.on("ping", ok);
    expect(() => bus.fire(4)).not.toThrow();
    expect(ok).toHaveBeenCalledWith(4);
    expect(err).toHaveBeenCalledTimes(1);
    err.mockRestore();
  });
});
