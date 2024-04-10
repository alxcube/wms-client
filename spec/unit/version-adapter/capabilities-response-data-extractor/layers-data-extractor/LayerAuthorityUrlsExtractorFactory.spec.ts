import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayerAuthorityUrlsExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayerAuthorityUrlsExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayerAuthorityUrlsExtractorFactory class", () => {
  const autoriryUrlsXmlContent = `
<AuthorityURL name="DIF_ID">
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html" />
</AuthorityURL>
<AuthorityURL name="NAME">
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="https://example.com" />
</AuthorityURL>
  `;

  const authorityUrlsXml_1_1 = `<Root>${autoriryUrlsXmlContent}</Root>`;
  const authorityUrlsXml_1_3 = `<Root xmlns="http://www.opengis.net/wms">${autoriryUrlsXmlContent}</Root>`;
  let factory_1_1: LayerAuthorityUrlsExtractorFactory;
  let factory_1_3: LayerAuthorityUrlsExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let authorityUrlsContainer_1_1: Element;
  let authorityUrlsContainer_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      LayerAuthorityUrlsExtractorFactory,
      [constant("")],
      { name: "1.1.1" }
    );
    testContainer.registerClass(
      LayerAuthorityUrlsExtractorFactory,
      [constant("wms")],
      { name: "1.3.0" }
    );

    factory_1_1 = testContainer.resolve(
      LayerAuthorityUrlsExtractorFactory,
      "1.1.1"
    );
    factory_1_3 = testContainer.resolve(
      LayerAuthorityUrlsExtractorFactory,
      "1.3.0"
    );

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    authorityUrlsContainer_1_1 = select(
      "/Root",
      xmlParser.parseFromString(authorityUrlsXml_1_1, "text/xml"),
      true
    ) as Element;
    authorityUrlsContainer_1_3 = select(
      "/wms:Root",
      xmlParser.parseFromString(authorityUrlsXml_1_3, "text/xml"),
      true
    ) as Element;
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns AuthorityUrl objects array from given parent context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(authorityUrlsContainer_1_1, select)).toEqual([
        {
          name: "DIF_ID",
          url: "http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html",
        },
        {
          name: "NAME",
          url: "https://example.com",
        },
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which returns AuthorityUrl objects array from given parent context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(authorityUrlsContainer_1_3, select)).toEqual([
        {
          name: "DIF_ID",
          url: "http://gcmd.gsfc.nasa.gov/difguide/whatisadif.html",
        },
        {
          name: "NAME",
          url: "https://example.com",
        },
      ]);
    });
  });
});
