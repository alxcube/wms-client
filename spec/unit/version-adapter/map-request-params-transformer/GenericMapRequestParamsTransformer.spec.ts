import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";

import type { MapRequestParamsWithCustom } from "../../../../src";
import { GenericMapRequestParamsTransformer } from "../../../../src";
import { testContainer } from "../../../testContainer";

describe("GenericMapRequestParamsTransformer class", () => {
  let transformer_1_1: GenericMapRequestParamsTransformer;
  let transformer_1_3: GenericMapRequestParamsTransformer;
  let transformer_1_0: GenericMapRequestParamsTransformer;

  const params: MapRequestParamsWithCustom = {
    layers: [
      { layer: "layer1", style: "style1" },
      { layer: "layer2" },
      { layer: "layer3", style: "style3" },
    ],
    crs: "CRS:84",
    bounds: { minX: -180, minY: -90, maxX: 180, maxY: 90 },
    width: 200,
    height: 100,
    format: "image/png",
    transparent: true,
    bgColor: "0xffffff",
    exceptionsFormat: "XML",
    customKey: "customValue",
  };

  beforeEach(() => {
    transformer_1_1 = testContainer.instantiate(
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.1.1")]
    );
    transformer_1_3 = testContainer.instantiate(
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.3.0")]
    );
    transformer_1_0 = testContainer.instantiate(
      GenericMapRequestParamsTransformer,
      ["VersionComparator", constant("1.0.0")]
    );
  });

  describe("transform() method", () => {
    it("should transform MapRequestParamsWithCustom object to request params, compatible with WMS 1.1", () => {
      expect(transformer_1_1.transform(params)).toEqual({
        service: "WMS",
        request: "GetMap",
        version: "1.1.1",
        layers: "layer1,layer2,layer3",
        styles: "style1,,style3",
        srs: "CRS:84",
        bbox: "-180,-90,180,90",
        width: 200,
        height: 100,
        format: "image/png",
        exceptions: "application/vnd.ogc.se_xml",
        transparent: "TRUE",
        bgcolor: "0xffffff",
        customKey: "customValue",
      });
    });

    it("should transform MapRequestParamsWithCustom object to request params, compatible with WMS 1.3", () => {
      expect(transformer_1_3.transform(params)).toEqual({
        service: "WMS",
        request: "GetMap",
        version: "1.3.0",
        layers: "layer1,layer2,layer3",
        styles: "style1,,style3",
        crs: "CRS:84",
        bbox: "-180,-90,180,90",
        width: 200,
        height: 100,
        format: "image/png",
        exceptions: "XML",
        transparent: "TRUE",
        bgcolor: "0xffffff",
        customKey: "customValue",
      });
    });

    it("should transform MapRequestParamsWithCustom object to request params, compatible with WMS 1.0", () => {
      expect(transformer_1_0.transform(params)).toEqual({
        service: "WMS",
        request: "map",
        wmtver: "1.0.0",
        layers: "layer1,layer2,layer3",
        styles: "style1,,style3",
        srs: "CRS:84",
        bbox: "-180,-90,180,90",
        width: 200,
        height: 100,
        format: "image/png",
        exceptions: "WMS_XML",
        transparent: "TRUE",
        bgcolor: "0xffffff",
        customKey: "customValue",
      });
    });
  });
});
