import { beforeEach, describe, expect, it } from "vitest";
import { serviceContainer } from "../../../src/serviceContainer";
import type { BaseWmsVersionAdapterResolver } from "../../../src/version-adapter/version-adapter-resolver/BaseWmsVersionAdapterResolver";

describe("BaseWmsVersionAdapterResolver class", () => {
  let resolver: BaseWmsVersionAdapterResolver;

  beforeEach(() => {
    resolver = serviceContainer.resolve(
      "WmsVersionAdapterResolver"
    ) as BaseWmsVersionAdapterResolver;
  });

  describe("resolve() method", () => {
    it("should resolve WmsVersionAdapter interface", () => {
      const adapter = resolver.resolve("1.3.0");
      expect(adapter.version).toBe("1.3.0");
      expect(adapter.transformCapabilitiesRequestParams).toBeTypeOf("function");
      expect(adapter.extractCapabilitiesResponseData).toBeTypeOf("function");
      expect(adapter.transformMapRequestParams).toBeTypeOf("function");
      expect(adapter.isCompatible).toBeTypeOf("function");
    });

    it("should throw RangeError, when no adapter for given version was found", () => {
      expect(() => resolver.resolve("invalid-version")).toThrow(RangeError);
    });
  });
});
