import { describe, expect, it } from "vitest";
import { hasPropOfType, isObject } from "../../../src";

describe("hasPropOfType() function", () => {
  it("should return true if given object has prop of given type", () => {
    expect(hasPropOfType({ num: 1 }, "num", "number")).toBe(true);
    expect(hasPropOfType({ str: "str" }, "str", "string")).toBe(true);
    expect(
      hasPropOfType(
        {
          getNum() {
            return 1;
          },
        },
        "getNum",
        "function"
      )
    ).toBe(true);
    expect(hasPropOfType({ sym: Symbol() }, "sym", "symbol")).toBe(true);
    expect(hasPropOfType({ bool: false }, "bool", "boolean")).toBe(true);
    expect(hasPropOfType({ obj: {} }, "obj", "object")).toBe(true);
    expect(
      hasPropOfType(
        { explicitlyUndefined: undefined },
        "explicitlyUndefined",
        "undefined"
      )
    ).toBe(true);
    expect(hasPropOfType({}, "implicitlyUndefined", "undefined")).toBe(true);
  });

  it("should return true, if given object has given prop of one of given types", () => {
    expect(hasPropOfType({ value: 1 }, "value", ["string", "number"])).toBe(
      true
    );
    expect(hasPropOfType({ value: "str" }, "value", ["string", "number"])).toBe(
      true
    );
    expect(hasPropOfType({}, "value", ["string", "number", "undefined"])).toBe(
      true
    );
  });

  it("should return false, if given object has no property of given type", () => {
    expect(hasPropOfType({ num: "1" }, "num", "number")).toBe(false);
    expect(hasPropOfType({}, "value", ["string", "number"])).toBe(false);
  });

  it("should accept type checker function as 3 argument", () => {
    expect(hasPropOfType({ items: [] }, "items", Array.isArray)).toBe(true);
    expect(hasPropOfType({ obj: {} }, "obj", isObject)).toBe(true);
    expect(hasPropOfType({ obj: null }, "obj", isObject)).toBe(false);
  });
});
