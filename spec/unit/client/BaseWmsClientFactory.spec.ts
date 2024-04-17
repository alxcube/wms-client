import { beforeEach, describe, expect, it, test } from "vitest";
import { BaseWmsClient } from "../../../src/client/BaseWmsClient";
import { BaseWmsClientFactory } from "../../../src/client/BaseWmsClientFactory";
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

  test("correct resolution from service container", () => {
    expect(factory).toBeInstanceOf(BaseWmsClientFactory);
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
