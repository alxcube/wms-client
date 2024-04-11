import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { MapRequestParams } from "../../../src/client/WmsClient";
import { constant } from "../../../src/service-container/constant";
import { BaseWmsVersionAdapter } from "../../../src/version-adapter/BaseWmsVersionAdapter";
import { testContainer } from "../../testContainer";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_0 from "../../fixtures/capabilities_1_1_0.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_1_1 from "../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import capabilitiesXml_1_3_0 from "../../fixtures/capabilities_1_3_0.xml?raw";

describe("BaseWmsVersionAdapter class", () => {
  let adapter_1_1: BaseWmsVersionAdapter;
  let adapter_1_3: BaseWmsVersionAdapter;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      BaseWmsVersionAdapter,
      [
        constant("1.1.1"),
        { service: "CapabilitiesRequestParamsTransformer", name: "1.1.1" },
        { service: "CapabilitiesResponseDataExtractor", name: "1.1.1" },
        { service: "MapRequestParamsTransformer", name: "1.1.1" },
        { service: "VersionCompatibilityChecker", name: "1.1.1" },
      ],
      { name: "1.1.1" }
    );

    testContainer.registerClass(
      BaseWmsVersionAdapter,
      [
        constant("1.3.0"),
        { service: "CapabilitiesRequestParamsTransformer", name: "1.3.0" },
        { service: "CapabilitiesResponseDataExtractor", name: "1.3.0" },
        { service: "MapRequestParamsTransformer", name: "1.3.0" },
        { service: "VersionCompatibilityChecker", name: "1.3.0" },
      ],
      { name: "1.3.0" }
    );

    adapter_1_1 = testContainer.resolve(BaseWmsVersionAdapter, "1.1.1");
    adapter_1_3 = testContainer.resolve(BaseWmsVersionAdapter, "1.3.0");
  });

  afterEach(() => {
    testContainer.restore();
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
    });
  });

  describe("extractCapabilitiesResponseData", () => {
    let capabilitiesDoc_1_1_0: Document;
    let capabilitiesDoc_1_1_1: Document;
    let capabilitiesDoc_1_3_0: Document;
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
  });

  describe("transformMapRequestParams() method", () => {
    const params: MapRequestParams = {
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
  });
});
