import { beforeEach, describe, expect, it } from "vitest";
import type { FeatureInfoRequestParamsWithCustom } from "../../../../src/client/WmsClient";
import { constant } from "../../../../src/service-container/constant";
import { GenericFeatureInfoRequestParamsTransformer } from "../../../../src/version-adapter/feature-info-request-params-transformer/GenericFeatureInfoRequestParamsTransformer";
import { testContainer } from "../../../testContainer";

describe("GenericFeatureInfoRequestParamsTransformer class", () => {
  let transformer_1_1: GenericFeatureInfoRequestParamsTransformer;
  let transformer_1_3: GenericFeatureInfoRequestParamsTransformer;
  let transformer_1_0: GenericFeatureInfoRequestParamsTransformer;

  const params: FeatureInfoRequestParamsWithCustom = {
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
    queryLayers: ["layer1", "layer2"],
    infoFormat: "text/plain",
    x: 1,
    y: 2,
    customKey: "customValue",
  };

  beforeEach(() => {
    transformer_1_1 = testContainer.instantiate(
      GenericFeatureInfoRequestParamsTransformer,
      [
        { service: "MapRequestParamsTransformer", name: "1.1.1" },
        "VersionComparator",
        constant("1.1.1"),
      ]
    );

    transformer_1_3 = testContainer.instantiate(
      GenericFeatureInfoRequestParamsTransformer,
      [
        { service: "MapRequestParamsTransformer", name: "1.3.0" },
        "VersionComparator",
        constant("1.3.0"),
      ]
    );

    transformer_1_0 = testContainer.instantiate(
      GenericFeatureInfoRequestParamsTransformer,
      [
        { service: "MapRequestParamsTransformer", name: "1.0.0" },
        "VersionComparator",
        constant("1.0.0"),
      ]
    );
  });

  describe("transform() method", () => {
    it("should transform FeatureInfoRequestParamsWithCustom object to request params, compatible with WMS 1.1", () => {
      expect(transformer_1_1.transform(params)).toEqual({
        service: "WMS",
        request: "GetFeatureInfo",
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
        query_layers: "layer1,layer2",
        info_format: "text/plain",
        x: "1",
        y: "2",
        customKey: "customValue",
      });
    });

    it("should transform FeatureInfoRequestParamsWithCustom object to request params, compatible with WMS 1.3", () => {
      expect(transformer_1_3.transform(params)).toEqual({
        service: "WMS",
        request: "GetFeatureInfo",
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
        query_layers: "layer1,layer2",
        info_format: "text/plain",
        i: "1",
        j: "2",
        customKey: "customValue",
      });
    });

    it("should transform FeatureInfoRequestParamsWithCustom object to request params, compatible with WMS 1.0", () => {
      expect(transformer_1_0.transform(params)).toEqual({
        service: "WMS",
        request: "feature_info",
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
        query_layers: "layer1,layer2",
        info_format: "text/plain",
        x: "1",
        y: "2",
        customKey: "customValue",
      });
    });
  });
});
