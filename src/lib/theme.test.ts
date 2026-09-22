import { describe, expect, test } from "bun:test";
import { nextTheme, resolveTheme } from "./theme";

describe("theme preference", () => {
  test("follows the system when no valid preference is saved", () => {
    expect(resolveTheme(null, "light")).toBe("light");
    expect(resolveTheme(null, "dark")).toBe("dark");
    expect(resolveTheme("sepia", "dark")).toBe("dark");
  });

  test("lets a saved preference override the system", () => {
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme("dark", "light")).toBe("dark");
  });

  test("clears the override when switching back to the system theme", () => {
    expect(nextTheme("light", "dark")).toEqual({ theme: "dark", preference: null });
    expect(nextTheme("dark", "light")).toEqual({ theme: "light", preference: null });
    expect(nextTheme("light", "light")).toEqual({ theme: "dark", preference: "dark" });
  });
});
