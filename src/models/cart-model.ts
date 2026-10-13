import { EventEmitter } from "../core/event-emitter";
import type { KeyValueStorage } from "../core/storage";
import type { CartState } from "../types/cart";

// Prototype-less copy so ids like "constructor" or "__proto__" are plain keys.
function bare(source: Record<string, number>): Record<string, number> {
  const target = Object.create(null) as Record<string, number>;
  for (const [id, qty] of Object.entries(source)) target[id] = qty;
  return target;
}

export function parseCart(raw: string | null): Record<string, number> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return {};
    const { version, items } = data as { version?: unknown; items?: unknown };
    if (version !== 1 || typeof items !== "object" || items === null || Array.isArray(items)) {
      return {};
    }
    const result = bare({});
    for (const [id, qty] of Object.entries(items)) {
      if (id.trim() !== "" && typeof qty === "number" && Number.isInteger(qty) && qty > 0) {
        result[id] = qty;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export class CartModel extends EventEmitter<{ change: CartState }> {
  static readonly STORAGE_KEY = "vanilla-shop:cart";

  private items: Record<string, number>;
  private readonly stopExternal: () => void;

  constructor(private readonly storage: KeyValueStorage) {
    super();
    this.items = bare(parseCart(this.read()));
    this.stopExternal = storage.onExternalChange(CartModel.STORAGE_KEY, (value) => {
      this.items = bare(parseCart(value));
      this.emit("change", this.getState());
    });
  }

  add(productId: string): void {
    const id = productId.trim();
    if (id === "") return;
    this.items[id] = (this.items[id] ?? 0) + 1;
    this.save();
    this.emit("change", this.getState());
  }

  getState(): CartState {
    const items = Object.freeze(bare(this.items));
    return Object.freeze({ items, count: this.total(items) });
  }

  get count(): number {
    return this.total(this.items);
  }

  dispose(): void {
    this.stopExternal();
  }

  private total(items: Readonly<Record<string, number>>): number {
    return Object.values(items).reduce((sum, qty) => sum + qty, 0);
  }

  private read(): string | null {
    try {
      return this.storage.get(CartModel.STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private save(): void {
    try {
      this.storage.set(CartModel.STORAGE_KEY, JSON.stringify({ version: 1, items: this.items }));
    } catch {
      // keep working in memory
    }
  }
}
