export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(preference: unknown, systemTheme: Theme): Theme {
  return isTheme(preference) ? preference : systemTheme;
}

export function nextTheme(current: Theme, systemTheme: Theme): { theme: Theme; preference: Theme | null } {
  const theme: Theme = current === "dark" ? "light" : "dark";
  return { theme, preference: theme === systemTheme ? null : theme };
}
