import { useEffect, useRef, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "../utils/storage.js";

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

    const directValue = parseStoredValue(safeLocalStorageGet(key));
    if (directValue !== null) {
      return directValue;
    }

    for (const legacyKey of options?.legacyKeys ?? []) {
      const legacyValue = parseStoredValue(safeLocalStorageGet(legacyKey));
      if (legacyValue !== null) {
        return legacyValue;
      }
    }

    return initialValue;
  });

  const saveTimerRef = useRef<number | null>(null);
  const latestStateRef = useRef(state);
  latestStateRef.current = state;

  useEffect(() => {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      safeLocalStorageSet(key, JSON.stringify(state));
      saveTimerRef.current = null;
    }, 200);

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [key, state]);

  useEffect(() => {
    return () => {
      safeLocalStorageSet(key, JSON.stringify(latestStateRef.current));
    };
  }, [key]);

  return [state, setState] as const;
}
