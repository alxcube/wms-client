import { describe, expect, it } from "vitest";
import { trim } from "../../../src";

describe("trim() function", () => {
  it("should trim given string", () => {
    expect(trim("   some string   ")).toBe("some string");
  });
});
