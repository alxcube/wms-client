import { describe, expect, it } from "vitest";
import { capabilitiesRequestParamsTransformer } from "../../../../src/version-adapter/1.3.0/capabilitiesRequestParamsTransformer";

describe("capabilitiesRequestParamsTransformer object", () => {
  describe("transform() method", () => {
    it("should return known params", () => {
      expect(
        capabilitiesRequestParamsTransformer.transform({ updateSequence: 1 })
      ).toEqual({
        updatesequence: 1,
        service: "WMS",
        request: "GetCapabilities",
        version: "1.3.0",
      });
    });
  });
});
