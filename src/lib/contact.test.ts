import { describe, expect, test } from "bun:test";
import { validateContact } from "./contact";

describe("validateContact", () => {
  const valid = { name: "Asha", email: "asha@example.com", message: "Hello there, nice site." };

  test("accepts a complete message", () => {
    expect(validateContact(valid)).toEqual({});
  });

  test("flags each field that is missing or too short", () => {
    expect(validateContact({ name: " ", email: "", message: "hi" })).toEqual({
      name: "Please add your name.",
      email: "Please add your email.",
      message: "Tell me a little more (at least 10 characters).",
    });
  });

  test("rejects malformed email addresses", () => {
    expect(validateContact({ ...valid, email: "asha@" }).email).toBe("That email doesn’t look right.");
  });
});
