import { describe, expect, it } from "vitest";
import { BaseWmsClient } from "../../src/BaseWmsClient";
import { createClient } from "../../src/createClient";

describe("createClient() function", () => {
  it("should create BaseWmsClient instance", () => {
    expect(createClient("https://example.com", "1.3.0")).toBeInstanceOf(
      BaseWmsClient
    );
  });

  it("should throw RangeError, when not supported WMS version passed", () => {
    expect(() => createClient("", "100")).toThrow(RangeError);
  });
});
