import { useEffect, useState } from "react";

type UseLocalStorageOptions<T> = {
  legacyKeys?: string[];
  migrate?: (value: unknown) => T;
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    const parseStoredValue = (stored: string | null): T | null => {
      if (!stored) {
        return null;
      }

      try {
        const parsed = JSON.parse(stored) as unknown;
        return options?.migrate ? options.migrate(parsed) : (parsed as T);
      } catch {
        return null;
      }
    };

    const directValue = parseStoredValue(window.localStorage.getItem(key));
    if (directValue !== null) {
      return directValue;
    }

    for (const legacyKey of options?.legacyKeys ?? []) {
      const legacyValue = parseStoredValue(window.localStorage.getItem(legacyKey));
      if (legacyValue !== null) {
        return legacyValue;
      }
    }

    return initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
