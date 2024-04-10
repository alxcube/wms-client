import type { DOMParser } from "@xmldom/xmldom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayerMetadataUrlsExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayerMetadataUrlsExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayerMetadataUrlsExtractorFactory class", () => {
  const metadataUrlsContent = `
<MetadataURL type="FGDC">
  <Format>text/plain</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/metadata/roads.txt" />
</MetadataURL>
<MetadataURL type="FGDC">
    <Format>text/xml</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/metadata/roads.xml" />
</MetadataURL>`;
  const xml_1_1 = `<Root>${metadataUrlsContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${metadataUrlsContent}</Root>`;
  let factory_1_1: LayerMetadataUrlsExtractorFactory;
  let factory_1_3: LayerMetadataUrlsExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let container_1_1: Element;
  let container_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      LayerMetadataUrlsExtractorFactory,
      [constant("")],
      { name: "1.1.1" }
    );
    testContainer.registerClass(
      LayerMetadataUrlsExtractorFactory,
      [constant("wms")],
      { name: "1.3.0" }
    );

    factory_1_1 = testContainer.resolve(
      LayerMetadataUrlsExtractorFactory,
      "1.1.1"
    );
    factory_1_3 = testContainer.resolve(
      LayerMetadataUrlsExtractorFactory,
      "1.3.0"
    );

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    container_1_1 = select(
      "/Root",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;
    container_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which extracts MetadataUrl objects array from MetadataURL elements v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(container_1_1, select)).toEqual([
        {
          type: "FGDC",
          format: "text/plain",
          url: "http://www.university.edu/metadata/roads.txt",
        },
        {
          type: "FGDC",
          format: "text/xml",
          url: "http://www.university.edu/metadata/roads.xml",
        },
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which extracts MetadataUrl objects array from MetadataURL elements v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(container_1_3, select)).toEqual([
        {
          type: "FGDC",
          format: "text/plain",
          url: "http://www.university.edu/metadata/roads.txt",
        },
        {
          type: "FGDC",
          format: "text/xml",
          url: "http://www.university.edu/metadata/roads.xml",
        },
      ]);
    });
  });
});
