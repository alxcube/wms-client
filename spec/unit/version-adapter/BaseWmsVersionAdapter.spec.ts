import { beforeEach, describe, expect, it } from "vitest";
import type {
  FeatureInfoRequestParamsWithCustom,
  MapRequestParamsWithCustom,
} from "../../../src/client/WmsClient";
import { constant } from "../../../src/service-container/constant";
import { BaseWmsVersionAdapter } from "../../../src/version-adapter/BaseWmsVersionAdapter";
import { testContainer } from "../../testContainer";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_0 from "../../fixtures/capabilities_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_1 from "../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_3_0 from "../../fixtures/capabilities_1_3_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_0_0 from "../../fixtures/capabilities_1_0_0.xml?raw";

describe("BaseWmsVersionAdapter class", () => {
  let adapter_1_1: BaseWmsVersionAdapter;
  let adapter_1_3: BaseWmsVersionAdapter;
  let adapter_1_0: BaseWmsVersionAdapter;

  beforeEach(() => {
    adapter_1_1 = testContainer.instantiate(BaseWmsVersionAdapter, [
      constant("1.1.1"),
      { service: "CapabilitiesRequestParamsTransformer", name: "1.1.1" },
      { service: "CapabilitiesResponseDataExtractor", name: "1.1.1" },
      { service: "MapRequestParamsTransformer", name: "1.1.1" },
      { service: "FeatureInfoRequestParamsTransformer", name: "1.1.1" },
      { service: "VersionCompatibilityChecker", name: "1.1.1" },
    ]);
    adapter_1_3 = testContainer.instantiate(BaseWmsVersionAdapter, [
      constant("1.3.0"),
      { service: "CapabilitiesRequestParamsTransformer", name: "1.3.0" },
      { service: "CapabilitiesResponseDataExtractor", name: "1.3.0" },
      { service: "MapRequestParamsTransformer", name: "1.3.0" },
      { service: "FeatureInfoRequestParamsTransformer", name: "1.3.0" },
      { service: "VersionCompatibilityChecker", name: "1.3.0" },
    ]);
    adapter_1_0 = testContainer.instantiate(BaseWmsVersionAdapter, [
      constant("1.0.0"),
      { service: "CapabilitiesRequestParamsTransformer", name: "1.0.0" },
      { service: "CapabilitiesResponseDataExtractor", name: "1.0.0" },
      { service: "MapRequestParamsTransformer", name: "1.0.0" },
      { service: "FeatureInfoRequestParamsTransformer", name: "1.0.0" },
      { service: "VersionCompatibilityChecker", name: "1.0.0" },
    ]);
  });

  describe("transformCapabilitiesRequestParams() method", () => {
    it("should return transformed GetCapabilities request params", () => {
      expect(adapter_1_1.transformCapabilitiesRequestParams({})).toEqual({
        service: "WMS",
        request: "GetCapabilities",
        version: "1.1.1",
      });

      expect(adapter_1_3.transformCapabilitiesRequestParams({})).toEqual({
        service: "WMS",
        request: "GetCapabilities",
        version: "1.3.0",
      });

      expect(adapter_1_0.transformCapabilitiesRequestParams({})).toEqual({
        service: "WMS",
        request: "capabilities",
        wmtver: "1.0.0",
      });
    });
  });

  describe("extractCapabilitiesResponseData", () => {
    let capabilitiesDoc_1_1_0: Document;
    let capabilitiesDoc_1_1_1: Document;
    let capabilitiesDoc_1_3_0: Document;
    let capabilitiesDoc_1_0_0: Document;
    let xmlParser: DOMParser;

    beforeEach(() => {
      xmlParser = testContainer.resolve("DOMParser");
      capabilitiesDoc_1_1_0 = xmlParser.parseFromString(
        capabilitiesXml_1_1_0,
        "text/xml"
      );
      capabilitiesDoc_1_1_1 = xmlParser.parseFromString(
        capabilitiesXml_1_1_1,
        "text/xml"
      );
      capabilitiesDoc_1_3_0 = xmlParser.parseFromString(
        capabilitiesXml_1_3_0,
        "text/xml"
      );
      capabilitiesDoc_1_0_0 = xmlParser.parseFromString(
        capabilitiesXml_1_0_0,
        "text/xml"
      );
    });

    it("should extract UnifiedCapabilitiesResponse from GetCapabilitiesResponse v1.1.0", () => {
      const capabilities = adapter_1_1.extractCapabilitiesResponseData(
        capabilitiesDoc_1_1_0
      );
      expect(capabilities.version).toBe("1.1.0");
      expect(capabilities.service).toBeDefined();
      expect(capabilities.capability).toBeDefined();
    });

    it("should extract UnifiedCapabilitiesResponse from GetCapabilitiesResponse v1.1.1", () => {
      const capabilities = adapter_1_1.extractCapabilitiesResponseData(
        capabilitiesDoc_1_1_1
      );
      expect(capabilities.version).toBe("1.1.1");
      expect(capabilities.service).toBeDefined();
      expect(capabilities.capability).toBeDefined();
    });

    it("should extract UnifiedCapabilitiesResponse from GetCapabilitiesResponse v1.3.0", () => {
      const capabilities = adapter_1_3.extractCapabilitiesResponseData(
        capabilitiesDoc_1_3_0
      );
      expect(capabilities.version).toBe("1.3.0");
      expect(capabilities.service).toBeDefined();
      expect(capabilities.capability).toBeDefined();
    });

    it("should extract UnifiedCapabilitiesResponse from GetCapabilitiesResponse v1.0.0", () => {
      const capabilities = adapter_1_0.extractCapabilitiesResponseData(
        capabilitiesDoc_1_0_0
      );
      expect(capabilities.version).toBe("1.0.0");
      expect(capabilities.service).toBeDefined();
      expect(capabilities.capability).toBeDefined();
    });
  });

  describe("transformMapRequestParams() method", () => {
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

    it("should transform MapRequestParams into object, compatible with GetMap request params v1.1.x", () => {
      expect(adapter_1_1.transformMapRequestParams(params)).toEqual({
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

    it("should transform MapRequestParams into object, compatible with GetMap request params v1.3.x", () => {
      expect(adapter_1_3.transformMapRequestParams(params)).toEqual({
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

    it("should transform MapRequestParams into object, compatible with GetMap request params v1.0.x", () => {
      expect(adapter_1_0.transformMapRequestParams(params)).toEqual({
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

  describe("transformFeatureInfoRequestParams() method", () => {
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

    it("should transform FeatureInfoRequestParamsWithCustom into object, compatible with GetMap request params v1.1.x", () => {
      expect(adapter_1_1.transformFeatureInfoRequestParams(params)).toEqual({
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

    it("should transform FeatureInfoRequestParamsWithCustom into object, compatible with GetMap request params v1.3.x", () => {
      expect(adapter_1_3.transformFeatureInfoRequestParams(params)).toEqual({
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

    it("should transform FeatureInfoRequestParamsWithCustom into object, compatible with GetMap request params v1.0.x", () => {
      expect(adapter_1_0.transformFeatureInfoRequestParams(params)).toEqual({
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

  describe("isCompatible() method", () => {
    it("should return true for versions [1.1, 1.2), when adapter is for version 1.1.1", () => {
      expect(adapter_1_1.isCompatible("1.1.0")).toBe(true);
      expect(adapter_1_1.isCompatible("1.1.99")).toBe(true);
      expect(adapter_1_1.isCompatible("1.2")).toBe(false);
      expect(adapter_1_1.isCompatible("1.3.0")).toBe(false);
    });

    it("should return true for versions [1.3, 1.4), when adapter is for version 1.3.0", () => {
      expect(adapter_1_3.isCompatible("1.3.0")).toBe(true);
      expect(adapter_1_3.isCompatible("1.3.99")).toBe(true);
      expect(adapter_1_3.isCompatible("1.4")).toBe(false);
      expect(adapter_1_3.isCompatible("1.1.0")).toBe(false);
    });

    it("should return true for versions [1.0, 1.1), when adapter is for version 1.0.0", () => {
      expect(adapter_1_0.isCompatible("1.0.0")).toBe(true);
      expect(adapter_1_0.isCompatible("1.0.99")).toBe(true);
      expect(adapter_1_0.isCompatible("1.1")).toBe(false);
      expect(adapter_1_0.isCompatible("1.3.0")).toBe(false);
    });
  });
});
