import { beforeEach, describe, expect, it } from "vitest";
import { BaseQueryParamsSerializer } from "../../../src";

describe("BaseQueryParamsSerializer class", () => {
  let serializer: BaseQueryParamsSerializer;

  beforeEach(() => {
    serializer = new BaseQueryParamsSerializer();
  });

  describe("serialize() method", () => {
    it("should serialize flat object to query string", () => {
      expect(
        serializer.serialize({ str: "string value", num: 1.23, bool: true })
      ).toBe("str=string%20value&num=1.23&bool=1");
    });
  });

  it("should serialize array values", () => {
    const params = {
      arr: [1, "string", false],
    };

    expect(serializer.serialize(params)).toBe(
      "arr%5B0%5D=1&arr%5B1%5D=string&arr%5B2%5D=0"
    );
  });

  it("should serialize nested objects", () => {
    const params = {
      nested: { a: "string", b: null, c: [true, false] },
    };

    expect(serializer.serialize(params)).toBe(
      "nested%5Ba%5D=string&nested%5Bb%5D=&nested%5Bc%5D%5B0%5D=1&nested%5Bc%5D%5B1%5D=0"
    );
  });
});
