import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayerCrsExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayerCrsExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayerCrsExtractorFactory class", () => {
  const xml_1_1 = `<Root>
<SRS>CRS:1 CRS:84</SRS>
<SRS>EPSG:3857</SRS>
</Root>`;

  const xml_1_3 = `<Root  xmlns="http://www.opengis.net/wms">
<CRS>CRS:1</CRS>
<CRS>CRS:84</CRS>
<CRS>EPSG:3857</CRS>
</Root>`;

  let factory_1_1: LayerCrsExtractorFactory;
  let factory_1_3: LayerCrsExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let crsContainer_1_1: Element;
  let crsContainer_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(LayerCrsExtractorFactory, [constant("SRS")], {
      name: "1.1.1",
    });
    testContainer.registerClass(
      LayerCrsExtractorFactory,
      [constant("wms:CRS")],
      {
        name: "1.3.0",
      }
    );

    factory_1_1 = testContainer.resolve(LayerCrsExtractorFactory, "1.1.1");
    factory_1_3 = testContainer.resolve(LayerCrsExtractorFactory, "1.3.0");

    xmlParser = testContainer.resolve("DOMParser");

    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    crsContainer_1_1 = select(
      "/Root",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;
    crsContainer_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns CRS codes array from given parent context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(crsContainer_1_1, select)).toEqual([
        "CRS:1",
        "CRS:84",
        "EPSG:3857",
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which returns CRS codes array from given parent context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(crsContainer_1_3, select)).toEqual([
        "CRS:1",
        "CRS:84",
        "EPSG:3857",
      ]);
    });
  });
});
