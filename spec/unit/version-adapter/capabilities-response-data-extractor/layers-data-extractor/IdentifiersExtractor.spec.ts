import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  constant,
  IdentifiersExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("IdentifiersExtractor class", () => {
  const xmlContent = `<Identifier authority="DIF_ID">123456</Identifier><Identifier authority="OTHER">ID</Identifier>`;
  const xml_1_1 = `<Root>${xmlContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${xmlContent}</Root>`;
  let factory_1_1: IdentifiersExtractor;
  let factory_1_3: IdentifiersExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let identifiersContainer_1_1: Element;
  let identifiersContainer_1_3: Element;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(IdentifiersExtractor, [
      constant(""),
    ]);
    factory_1_3 = testContainer.instantiate(IdentifiersExtractor, [
      constant("wms"),
    ]);

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    identifiersContainer_1_1 = select(
      "/Root",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;
    identifiersContainer_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns Identifier objects array from given parent context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(identifiersContainer_1_1, select)).toEqual([
        { authority: "DIF_ID", value: "123456" },
        { authority: "OTHER", value: "ID" },
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which returns Identifier objects array from given parent context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(identifiersContainer_1_3, select)).toEqual([
        { authority: "DIF_ID", value: "123456" },
        { authority: "OTHER", value: "ID" },
      ]);
    });
  });
});
