import { describe, expect, it } from "vitest";
import { trim } from "../../../src/utils/trim";

describe("trim() function", () => {
  it("should trim given string", () => {
    expect(trim("   some string   ")).toBe("some string");
  });
});
