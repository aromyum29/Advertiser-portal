/**
 * Namespaced localStorage access that never throws.
 *
 * The portal is server rendered, so every read has to survive running with no
 * `window` at all, and private-mode browsers can refuse storage outright. Both
 * cases fall back to the caller's default rather than taking the page down.
 */

const PREFIX = "koko-advertiser";

const memory = new Map<string, string>();

const available = (): Storage | null => {
  if (typeof window === "undefined") return null;
  try {
    const probe = `${PREFIX}:probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
};

const key = (name: string) => `${PREFIX}:${name}`;

export const readJSON = <T>(name: string, fallback: T): T => {
  const store = available();
  const raw = store ? store.getItem(key(name)) : memory.get(key(name));
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeJSON = (name: string, value: unknown): void => {
  const raw = JSON.stringify(value);
  const store = available();
  if (store) {
    try {
      store.setItem(key(name), raw);
      return;
    } catch {
      // Quota exceeded or storage disabled mid-session; fall through to memory.
    }
  }
  memory.set(key(name), raw);
};

export const remove = (name: string): void => {
  available()?.removeItem(key(name));
  memory.delete(key(name));
};
