import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayerBoundingBoxesExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayerBoundingBoxesExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayerBoundingBoxesExtractorFactory class", () => {
  const xml_1_1 = `<Root>
  <BoundingBox SRS="EPSG:4326" minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90" resx="0.01" resy="0.01"/>
  <BoundingBox SRS="EPSG:26986" minx="189000" miny="834000" maxx="285000" maxy="962000" resx="1" resy="1" />
</Root>`;
  const xml_1_3 = `<Root xmlns="http://www.opengis.net/wms">
  <BoundingBox CRS="EPSG:4326" minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90" resx="0.01" resy="0.01"/>
  <BoundingBox CRS="EPSG:26986" minx="189000" miny="834000" maxx="285000" maxy="962000" resx="1" resy="1" />
</Root>`;

  let factory_1_1: LayerBoundingBoxesExtractorFactory;
  let factory_1_3: LayerBoundingBoxesExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let boundingBoxesContainer_1_1: Element;
  let boundingBoxesContainer_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      LayerBoundingBoxesExtractorFactory,
      [constant("SRS"), constant("")],
      { name: "1.1.1" }
    );
    testContainer.registerClass(
      LayerBoundingBoxesExtractorFactory,
      [constant("CRS"), constant("wms")],
      { name: "1.3.0" }
    );

    factory_1_1 = testContainer.resolve(
      LayerBoundingBoxesExtractorFactory,
      "1.1.1"
    );
    factory_1_3 = testContainer.resolve(
      LayerBoundingBoxesExtractorFactory,
      "1.3.0"
    );

    xmlParser = testContainer.resolve("DOMParser");

    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    boundingBoxesContainer_1_1 = select(
      "/Root",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;
    boundingBoxesContainer_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns BoundingBox objects array from given parent context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(boundingBoxesContainer_1_1, select)).toEqual([
        {
          crs: "EPSG:4326",
          minX: -71.63,
          minY: 41.75,
          maxX: -70.78,
          maxY: 42.9,
          resX: 0.01,
          resY: 0.01,
        },
        {
          crs: "EPSG:26986",
          minX: 189000,
          minY: 834000,
          maxX: 285000,
          maxY: 962000,
          resX: 1,
          resY: 1,
        },
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which returns BoundingBox objects array from given parent context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(boundingBoxesContainer_1_3, select)).toEqual([
        {
          crs: "EPSG:4326",
          minX: -71.63,
          minY: 41.75,
          maxX: -70.78,
          maxY: 42.9,
          resX: 0.01,
          resY: 0.01,
        },
        {
          crs: "EPSG:26986",
          minX: 189000,
          minY: 834000,
          maxX: 285000,
          maxY: 962000,
          resX: 1,
          resY: 1,
        },
      ]);
    });
  });
});
