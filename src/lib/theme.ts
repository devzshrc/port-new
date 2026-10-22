export type Theme = "light" | "dark";

const storageKey = "portfolio-theme";

/** Light unless the visitor chose dark. Storage can be blocked (private windows), so it never throws. */
export function readTheme(): Theme {
  try {
    return localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The choice still applies for this visit.
  }
}
