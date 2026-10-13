# Design

## Context

T1 gives an empty `src/core`, `src/models`, `src/types` and Vitest with happy-dom. Layering rules are in `CLAUDE.md > Architecture` and enforced by `.claude/hooks/guard-mvc.mjs`: models must not touch the DOM (`document`, `querySelector`, `innerHTML`) nor import views/controllers. `window`/`localStorage` access goes through `src/core/storage.ts`, never directly from a model.

## Goals / Non-Goals

**Goals:** small, dependency-free, deterministic modules with 100% of spec scenarios covered by unit tests named after the scenarios.
**Non-Goals:** a generic state-management library; undo/redo; removing items from the cart (the design has no UI for it).

## Decisions

### EventEmitter (`src/core/event-emitter.ts`)
```ts
export class EventEmitter<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): () => void; // returns unsubscribe
  protected emit<K extends keyof Events>(event: K, payload: Events[K]): void;
}
```
Models **extend** it. A throwing listener must not stop other listeners (catch, `console.error`, continue).

### Storage (`src/core/storage.ts`)
```ts
export interface KeyValueStorage {
  get(key: string): string | null;            // never throws, null on failure
  set(key: string, value: string): void;      // never throws
  onExternalChange(key: string, cb: (newValue: string | null) => void): () => void;
}
export function createBrowserStorage(): KeyValueStorage;   // wraps window.localStorage + "storage" event
export function createMemoryStorage(): KeyValueStorage & { simulateExternalChange(key: string, value: string | null): void };
```
`createBrowserStorage` must work even if `window.localStorage` itself throws on access. The memory variant is used in tests and as the fallback.

### CartModel (`src/models/cart-model.ts`)
```ts
// src/types/cart.ts
export interface CartState { items: Readonly<Record<string, number>>; count: number; }

export class CartModel extends EventEmitter<{ change: CartState }> {
  static readonly STORAGE_KEY = "vanilla-shop:cart";
  constructor(storage: KeyValueStorage);
  add(productId: string): void;
  getState(): CartState;
  get count(): number;
  dispose(): void; // removes the external-change listener
}
```
- State is a plain object, copied on read (`getState` returns a frozen copy).
- Parsing lives in a pure `parseCart(raw: string | null): Record<string, number>` exported for tests.
- Saved format `{"version":1,"items":{...}}`. Count is derived, never stored.
- On external change: parse the new value, replace state, emit once (even if equal: simple and harmless).

### SearchModel (`src/models/search-model.ts`)
```ts
export class SearchModel extends EventEmitter<{ change: string }> {
  static readonly MAX_LENGTH = 200;
  static readonly DETAIL_PATH = "detail.html";
  submit(raw: string): boolean;               // normalise; false + no change if empty
  get query(): string;
  toDetailUrl(query?: string): string;        // defaults to current query
  static normalise(raw: string): string;      // trim + cut by code points (Array.from)
  static fromSearch(search: string): string;  // read & normalise `q` from "?q=..."
}
```
- Encode with `URLSearchParams` (`new URLSearchParams({ q }).toString()`) → spaces become `+`; that satisfies the spec (decodes back identically).
- `fromSearch` uses `URLSearchParams` inside `try`; `URLSearchParams` never throws: a lone `%` stays literal and invalid UTF-8 bytes become U+FFFD. Add a test to lock this in.
- The model does **not** read `window.location` itself; T8's page entry passes `location.search` in. This keeps the model pure and testable.

### Tests
`tests/unit/core/event-emitter.test.ts`, `tests/unit/core/storage.test.ts` (memory storage; browser storage with a throwing `localStorage` stub via `vi.stubGlobal`), `tests/unit/models/cart-model.test.ts`, `tests/unit/models/search-model.test.ts`. One `it()` per spec scenario, with the scenario name as the test title, plus any extra edge cases.

## Risks / Trade-offs

- [The `storage` event only fires in *other* tabs] → that is the desired semantics; the current tab already emitted on `add`.
- [Count can grow without bound] → display capping ("99+") is a view concern in T7.
