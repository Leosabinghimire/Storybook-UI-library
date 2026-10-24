import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

interface ThemeContextValue {
  /** The resolved theme currently applied. */
  theme: Theme;
  /** What the user chose: an explicit theme or "system". */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial preference. Defaults to "system". */
  defaultPreference?: ThemePreference;
  /** localStorage key used to remember the preference. Pass `null` to disable persistence. */
  storageKey?: string | null;
  /** Element that receives the `data-theme` attribute. Defaults to <html>. */
  target?: HTMLElement | null;
}

/**
 * Applies `data-theme="light|dark"` to the document so the CSS tokens switch, and exposes the current
 * theme through `useTheme()`. Wrap your app once at the root.
 */
export function ThemeProvider({ children, defaultPreference = "system", storageKey = "ui-theme", target }: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored === "light" || stored === "dark" || stored === "system") return stored;
      } catch {
        // Storage can be unavailable (private mode, blocked). Fall back to the default.
      }
    }
    return defaultPreference;
  });
  const [system, setSystem] = useState<Theme>(systemTheme);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystem(media.matches ? "dark" : "light");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const theme: Theme = preference === "system" ? system : preference;

  useEffect(() => {
    const element = target ?? document.documentElement;
    element.setAttribute("data-theme", theme);
  }, [theme, target]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, next);
        } catch {
          // Ignore storage failures; the theme still applies for this session.
        }
      }
    },
    [storageKey],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, preference, setPreference, toggle: () => setPreference(theme === "dark" ? "light" : "dark") }),
    [theme, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return context;
}
