import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../src/service-container/constant";
import { KeywordsExtractor } from "../../../../src/version-adapter/capabilities-response-data-extractor/KeywordsExtractor";
import { xlinkXmlNamespace } from "../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../testContainer";

describe("KeywordsExtractor class", () => {
  const xmlContent = `
<KeywordList>
    <Keyword vocabulary="test">keyword 1</Keyword>
    <Keyword>keyword 2</Keyword>
    <Keyword>keyword 3</Keyword>
</KeywordList>`;
  const xml_1_1 = `<Root>${xmlContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${xmlContent}</Root>`;

  let factory_1_1: KeywordsExtractor;
  let factory_1_3: KeywordsExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let contextNode_1_1: Element;
  let contextNode_1_3: Element;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(KeywordsExtractor, [constant("")]);
    factory_1_3 = testContainer.instantiate(KeywordsExtractor, [
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
    it("should create SingleNodeDataExtractorFn, which returns Keyword objects array from context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(contextNode_1_1, select)).toEqual([
        { vocabulary: "test", value: "keyword 1" },
        { value: "keyword 2" },
        { value: "keyword 3" },
      ]);
    });

    it("should create SingleNodeDataExtractorFn, which returns Keyword objects array from context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(contextNode_1_3, select)).toEqual([
        { vocabulary: "test", value: "keyword 1" },
        { value: "keyword 2" },
        { value: "keyword 3" },
      ]);
    });
  });
});
