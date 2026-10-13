export interface KeyValueStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  onExternalChange(key: string, cb: (newValue: string | null) => void): () => void;
}

export interface MemoryStorage extends KeyValueStorage {
  simulateExternalChange(key: string, value: string | null): void;
}

type ChangeCallback = (newValue: string | null) => void;

export function createBrowserStorage(): KeyValueStorage {
  const fallback = createMemoryStorage();

  const area = (): Storage | null => {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  };

  return {
    get(key) {
      try {
        const store = area();
        return store ? store.getItem(key) : fallback.get(key);
      } catch {
        return fallback.get(key);
      }
    },
    set(key, value) {
      try {
        const store = area();
        if (!store) throw new Error("localStorage unavailable");
        store.setItem(key, value);
      } catch {
        fallback.set(key, value);
      }
    },
    onExternalChange(key, cb) {
      const handler = (event: StorageEvent): void => {
        if (event.key === key) cb(event.newValue);
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
  };
}

export function createMemoryStorage(): MemoryStorage {
  const data = new Map<string, string>();
  const subscribers = new Map<string, Set<ChangeCallback>>();

  return {
    get: (key) => data.get(key) ?? null,
    set: (key, value) => {
      data.set(key, value);
    },
    onExternalChange(key, cb) {
      let set = subscribers.get(key);
      if (!set) {
        set = new Set();
        subscribers.set(key, set);
      }
      set.add(cb);
      return () => {
        set.delete(cb);
      };
    },
    simulateExternalChange(key, value) {
      if (value === null) data.delete(key);
      else data.set(key, value);
      for (const cb of [...(subscribers.get(key) ?? [])]) cb(value);
    },
  };
}
