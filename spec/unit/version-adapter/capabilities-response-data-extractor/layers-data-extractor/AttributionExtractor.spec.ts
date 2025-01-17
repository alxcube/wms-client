import { constant } from "@alxcube/di-container";
import type { DOMParser } from "@xmldom/xmldom";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  AttributionExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("AttributionExtractor class", () => {
  const attributionContent = `<Attribution>
        <Title>Attribution Title</Title>
        <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="https://example.com" />
        <LogoURL width="200" height="100">
          <Format>image/gif</Format>
          <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="https://example.com/logo.gif" />
        </LogoURL>
      </Attribution>`;

  const attributionXml_1_1 = `<Root>${attributionContent}</Root>`;
  const attributionXml_1_3 = `<Root xmlns="http://www.opengis.net/wms">${attributionContent}</Root>`;

  let factory_1_1: AttributionExtractor;
  let factory_1_3: AttributionExtractor;
  let select: XPathSelect;
  let xmlParser: DOMParser;
  let attributionContainer_1_1: Element;
  let attributionContainer_1_3: Element;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(AttributionExtractor, [
      constant(""),
    ]);
    factory_1_3 = testContainer.instantiate(AttributionExtractor, [
      constant("wms"),
    ]);
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    xmlParser = testContainer.resolve("DOMParser");
    const attributionDoc_1_1 = xmlParser.parseFromString(
      attributionXml_1_1,
      "text/xml"
    );
    const attributionDoc_1_3 = xmlParser.parseFromString(
      attributionXml_1_3,
      "text/xml"
    );
    attributionContainer_1_1 = select(
      "/Root",
      attributionDoc_1_1,
      true
    ) as Element;
    attributionContainer_1_3 = select(
      "/wms:Root",
      attributionDoc_1_3,
      true
    ) as Element;
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns Attribution object from given Attribution parent context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(attributionContainer_1_1, select)).toEqual({
        title: "Attribution Title",
        url: "https://example.com",
        logo: {
          width: 200,
          height: 100,
          format: "image/gif",
          url: "https://example.com/logo.gif",
        },
      });
    });

    it("should return SingleNodeDataExtractorFn, which returns Attribution object from given Attribution parent context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(attributionContainer_1_3, select)).toEqual({
        title: "Attribution Title",
        url: "https://example.com",
        logo: {
          width: 200,
          height: 100,
          format: "image/gif",
          url: "https://example.com/logo.gif",
        },
      });
    });
  });
});
