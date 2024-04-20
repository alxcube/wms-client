import { beforeEach, describe, expect, it } from "vitest";
import { serviceContainer } from "../../../../src/serviceContainer";
import { BaseWmsVersionAdapterResolver } from "../../../../src/version-adapter/version-adapter-resolver/BaseWmsVersionAdapterResolver";

describe("BaseWmsVersionAdapterResolver class", () => {
  let resolver: BaseWmsVersionAdapterResolver;

  beforeEach(() => {
    resolver = serviceContainer.instantiate(BaseWmsVersionAdapterResolver, [
      "WmsVersionAdapter[]",
      "VersionComparator",
    ]);
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

    it("should resolve WmsVersionAdapter for v1.1.1", () => {
      expect(resolver.resolve("1.1.1")).toBeTypeOf("object");
    });

    it("should throw RangeError, when no adapter for given version was found", () => {
      expect(() => resolver.resolve("invalid-version")).toThrow(RangeError);
    });
  });

  describe("find() method", () => {
    it("should return adapter of given version or undefined", () => {
      expect(resolver.find("1.1.1")).toBeDefined();
      expect(resolver.find("1.1.0")).toBeUndefined();
    });
  });

  describe("findCompatible() method", () => {
    it("should return adapter, compatible with given version", () => {
      const adapter_1_1 = resolver.findCompatible("1.1.0");
      expect(adapter_1_1).toBeDefined();
      expect(adapter_1_1?.version).toBe("1.1.1");

      const adapter_1_3 = resolver.findCompatible("1.3");
      expect(adapter_1_3).toBeDefined();
      expect(adapter_1_3?.version).toBe("1.3.0");
    });

    it("should return undefined, when no compatible adapter is found", () => {
      expect(resolver.findCompatible("1.4")).toBeUndefined();
    });
  });

  describe("findLower() method", () => {
    it("should return adapter with version, lower than given", () => {
      const adapter = resolver.findLower("1.3");
      expect(adapter).toBeDefined();
      expect(adapter?.version).toBe("1.1.1");
    });

    it("should return undefined, when there is no version lower", () => {
      expect(resolver.findLower("1.0")).toBeUndefined();
    });
  });

  describe("getHighest() method", () => {
    it("should return adapter of highest version", () => {
      expect(resolver.getHighest().version).toBe("1.3.0");
    });
  });
});
