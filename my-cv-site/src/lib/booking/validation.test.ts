import { describe, it, expect } from "vitest";
import { validateDetails, firstInvalidField } from "./validation";

describe("validateDetails", () => {
  it("returns no errors for a complete, valid input", () => {
    expect(validateDetails({ name: "Jane", email: "jane@example.com" })).toEqual({});
  });

  it("flags an empty name and an empty email", () => {
    expect(validateDetails({ name: "  ", email: "" })).toEqual({
      name: "nameRequired",
      email: "emailRequired",
    });
  });

  it("flags a malformed email", () => {
    expect(validateDetails({ name: "Jane", email: "jane@" })).toEqual({
      email: "emailInvalid",
    });
  });
});

describe("firstInvalidField", () => {
  it("returns fields in visual order and null when clean", () => {
    expect(firstInvalidField({ email: "emailRequired" })).toBe("email");
    expect(firstInvalidField({ name: "nameRequired", email: "emailInvalid" })).toBe("name");
    expect(firstInvalidField({})).toBeNull();
  });
});
