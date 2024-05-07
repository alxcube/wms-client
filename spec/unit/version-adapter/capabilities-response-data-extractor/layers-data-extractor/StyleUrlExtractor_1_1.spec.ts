import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  StyleUrlExtractor_1_1,
  wmsXmlNamespace,
  xlinkXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("StyleUrlExtractor_1_1 class", () => {
  const xmlContent = `
<StyleURL>
    <Format>text/xml</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://example.com/style.xml" />
</StyleURL>`;

  const xml_1_1 = `<Root>${xmlContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${xmlContent}</Root>`;

  let extractor_1_1: StyleUrlExtractor_1_1;
  let extractor_1_3: StyleUrlExtractor_1_1;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let contextNode_1_1: Element;
  let contextNode_1_3: Element;

  beforeEach(() => {
    extractor_1_1 = testContainer.instantiate(StyleUrlExtractor_1_1, [
      constant(""),
    ]);
    extractor_1_3 = testContainer.instantiate(StyleUrlExtractor_1_1, [
      constant("wms"),
    ]);
    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    contextNode_1_1 = select(
      "/Root",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;
    contextNode_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns ResourceUrl object from context node v1.1.1", () => {
      const extract = extractor_1_1.createNodeDataExtractor();
      expect(extract(contextNode_1_1, select)).toEqual({
        format: "text/xml",
        url: "http://example.com/style.xml",
      });
    });

    it("should return SingleNodeDataExtractorFn, which returns ResourceUrl object from context node v1.3.0", () => {
      const extract = extractor_1_3.createNodeDataExtractor();
      expect(extract(contextNode_1_3, select)).toEqual({
        format: "text/xml",
        url: "http://example.com/style.xml",
      });
    });
  });
});
