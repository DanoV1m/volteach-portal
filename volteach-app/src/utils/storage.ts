function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or storage access blocked
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
}

export const ls = { get, set, remove };
