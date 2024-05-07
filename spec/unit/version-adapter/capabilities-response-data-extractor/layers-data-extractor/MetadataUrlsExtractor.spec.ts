import { constant } from "@alxcube/di-container";
import type { DOMParser } from "@xmldom/xmldom";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  MetadataUrlsExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("MetadataUrlsExtractor class", () => {
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
  let factory_1_1: MetadataUrlsExtractor;
  let factory_1_3: MetadataUrlsExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let container_1_1: Element;
  let container_1_3: Element;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(MetadataUrlsExtractor, [
      constant(""),
    ]);
    factory_1_3 = testContainer.instantiate(MetadataUrlsExtractor, [
      constant("wms"),
    ]);

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
