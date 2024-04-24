import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  constant,
  CrsExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("CrsExtractor class", () => {
  const xml_1_1 = `<Root>
<SRS>CRS:1 CRS:84</SRS>
<SRS>EPSG:3857</SRS>
</Root>`;

  const xml_1_3 = `<Root  xmlns="http://www.opengis.net/wms">
<CRS>CRS:1</CRS>
<CRS>CRS:84</CRS>
<CRS>EPSG:3857</CRS>
</Root>`;

  let factory_1_1: CrsExtractor;
  let factory_1_3: CrsExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let crsContainer_1_1: Element;
  let crsContainer_1_3: Element;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(CrsExtractor, [constant("SRS")]);
    factory_1_3 = testContainer.instantiate(CrsExtractor, [
      constant("wms:CRS"),
    ]);

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
