import { useEffect, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "../utils/storage.js";

type Theme = "light" | "dark";
const THEME_KEY = "soopi-utils.theme";

function readStoredTheme(): Theme | null {
  const stored = safeLocalStorageGet(THEME_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = readStoredTheme();
  if (stored) {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [hasUserPreference, setHasUserPreference] = useState(() => readStoredTheme() !== null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");

    if (hasUserPreference) {
      safeLocalStorageSet(THEME_KEY, theme);
    }
  }, [theme, hasUserPreference]);

  useEffect(() => {
    if (hasUserPreference || typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onThemeChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onThemeChange);
      return () => media.removeEventListener("change", onThemeChange);
    }

    media.addListener(onThemeChange);
    return () => media.removeListener(onThemeChange);
  }, [hasUserPreference]);

  const toggleTheme = () => {
    setHasUserPreference(true);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
