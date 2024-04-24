import { beforeEach, describe, expect, it } from "vitest";
import { BaseWmsClient, BaseWmsClientFactory } from "../../../src";
import { testContainer } from "../../testContainer";

describe("BaseWmsClientFactory class", () => {
  let factory: BaseWmsClientFactory;

  beforeEach(() => {
    factory = testContainer.instantiate(BaseWmsClientFactory, [
      "WmsVersionAdapterResolver",
      "QueryParamsSerializer",
      "WmsXmlParser",
      "RequestErrorHandler",
      "TextDecoder",
    ]);
  });

  describe("create() method", () => {
    it("should return BaseWmsClient instance", () => {
      expect(factory.create("url", "1.3.0")).toBeInstanceOf(BaseWmsClient);
    });

    it("should throw RangeError, when unsupported WMS version given", () => {
      expect(() => factory.create("url", "100.0.0")).toThrow(RangeError);
    });
  });
});
