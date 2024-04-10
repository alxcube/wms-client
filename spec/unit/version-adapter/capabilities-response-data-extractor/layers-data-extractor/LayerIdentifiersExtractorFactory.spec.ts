import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayerIdentifiersExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayerIdentifiersExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayerIdentifiersExtractorFactory class", () => {
  const xmlContent = `<Identifier authority="DIF_ID">123456</Identifier><Identifier authority="OTHER">ID</Identifier>`;
  const xml_1_1 = `<Root>${xmlContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${xmlContent}</Root>`;
  let factory_1_1: LayerIdentifiersExtractorFactory;
  let factory_1_3: LayerIdentifiersExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let identifiersContainer_1_1: Element;
  let identifiersContainer_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      LayerIdentifiersExtractorFactory,
      [constant("")],
      { name: "1.1.1" }
    );
    testContainer.registerClass(
      LayerIdentifiersExtractorFactory,
      [constant("wms")],
      { name: "1.3.0" }
    );

    factory_1_1 = testContainer.resolve(
      LayerIdentifiersExtractorFactory,
      "1.1.1"
    );
    factory_1_3 = testContainer.resolve(
      LayerIdentifiersExtractorFactory,
      "1.3.0"
    );

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

  afterEach(() => {
    testContainer.restore();
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
