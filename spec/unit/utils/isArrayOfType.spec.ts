import { describe, expect, it } from "vitest";
import { hasPropOfType, isArrayOfType, isObject } from "../../../src";

describe("isArrayOfType() function", () => {
  it("should return true if all of array items are of given type", () => {
    expect(isArrayOfType([1, 2, 3], "number")).toBe(true);
    expect(isArrayOfType(["1", "2", "3"], "string")).toBe(true);
    expect(isArrayOfType(["1", 2, "3"], ["string", "number"])).toBe(true);
    expect(
      isArrayOfType(
        [
          { x: 1, y: 1 },
          { x: 0, y: 0 },
        ],
        (point) => {
          return (
            isObject(point) &&
            hasPropOfType(point, "x", "number") &&
            hasPropOfType(point, "y", "number")
          );
        }
      )
    ).toBe(true);
  });

  it("should return true if empty array is given", () => {
    expect(isArrayOfType([], "number")).toBe(true);
    expect(isArrayOfType([], "string")).toBe(true);
    expect(isArrayOfType([], ["number", "string"])).toBe(true);
    expect(isArrayOfType([], Array.isArray)).toBe(true);
  });

  it("should return false if any of given array items has different type", () => {
    expect(isArrayOfType([1, 2, "3"], "number")).toBe(false);
    expect(isArrayOfType([1, "2", true], ["number", "string"])).toBe(false);
  });
});
