import { beforeEach, describe, expect, it } from "vitest";
import { constant } from "../../../../src/service-container/constant";
import { GenericCapabilitiesRequestParamsTransformer } from "../../../../src/version-adapter/capabilities-request-params-transformer/GenericCapabilitiesRequestParamsTransformer";
import { testContainer } from "../../../testContainer";

describe("GenericCapabilitiesRequestParamsTransformer class", () => {
  let transformer_1_1_1: GenericCapabilitiesRequestParamsTransformer;
  let transformer_1_3_0: GenericCapabilitiesRequestParamsTransformer;

  beforeEach(() => {
    transformer_1_1_1 = testContainer.instantiate(
      GenericCapabilitiesRequestParamsTransformer,
      [constant("1.1.1")]
    );
    transformer_1_3_0 = testContainer.instantiate(
      GenericCapabilitiesRequestParamsTransformer,
      [constant("1.3.0")]
    );
  });

  describe("transform() method", () => {
    it("should return known default values for request v1.1.1", () => {
      expect(transformer_1_1_1.transform({})).toEqual({
        version: "1.1.1",
        service: "WMS",
        request: "GetCapabilities",
      });
    });

    it("should return known default values for request v1.1.1", () => {
      expect(transformer_1_3_0.transform({})).toEqual({
        version: "1.3.0",
        service: "WMS",
        request: "GetCapabilities",
      });
    });

    it("should accept custom params", () => {
      const customParams = { customNumber: 1, customString: "str" };
      expect(transformer_1_1_1.transform(customParams)).toMatchObject(
        customParams
      );
    });
  });
});
