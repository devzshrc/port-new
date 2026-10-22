import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, readTheme, type Theme } from "../lib/theme";

/** Switches between light and dark. The label names the mode you'll switch to. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const next: Theme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    applyTheme(next);
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-switching"), 200);
  };

  return <button type="button" className="pill theme-toggle" onClick={toggle} aria-label={`Switch to ${next} mode`}>
    <Icon key={theme} className="theme-icon" size={14} aria-hidden="true" />
    {next === "dark" ? "Dark" : "Light"}
  </button>;
}
