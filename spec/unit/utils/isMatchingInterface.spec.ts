import { describe, expect, it } from "vitest";
import {
  hasPropOfType,
  type InterfaceSchema,
  isMatchingInterface,
  isObject,
} from "../../../src";

describe("isMatchingInterface() function", () => {
  it("should return true if given object is matching given interface schema", () => {
    interface TestInterface {
      num: number;
      str: string;
      numOrStr: string;
      nested: { numeric: number };
      arr: unknown[];
      method(): void;
    }

    const schema: InterfaceSchema<TestInterface> = {
      num: "number",
      str: "string",
      numOrStr: ["number", "string"],
      nested: (val) => isObject(val) && hasPropOfType(val, "numeric", "number"),
      arr: Array.isArray,
      method: "function",
    };

    const valid: TestInterface = {
      num: 1,
      str: "str",
      numOrStr: "str",
      nested: { numeric: 1 },
      arr: [],
      method() {},
    };

    expect(isMatchingInterface(schema, valid)).toBe(true);
  });
});
