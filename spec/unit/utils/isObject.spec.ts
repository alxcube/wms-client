import { describe, expect, it } from "vitest";
import { isObject } from "../../../src";

describe("isObject() function", () => {
  it("should return true if object is given and false otherwise", () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(function () {})).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});
