import { describe, expect, it } from "vitest";
import { withNamespace } from "../../../src";

describe("withNamespace() function", () => {
  it("should return node name with namespace, when namespace is defined and is not empty string", () => {
    expect(withNamespace("NodeName", "ns")).toBe("ns:NodeName");
  });

  it("should return unchanged node name, when namespace is undefined of is empty string", () => {
    expect(withNamespace("NodeName", undefined)).toBe("NodeName");
    expect(withNamespace("NodeName", "")).toBe("NodeName");
  });
});
