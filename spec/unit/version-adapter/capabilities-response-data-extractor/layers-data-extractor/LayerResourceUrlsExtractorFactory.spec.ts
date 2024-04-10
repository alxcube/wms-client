import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { LayerResourceUrlsExtractorFactory } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/LayerResourceUrlsExtractorFactory";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("LayerResourceUrlsExtractorFactory class", () => {
  const xmlContent = `
<FeatureListURL>
  <Format>application/xml</Format>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://example.com/featurelist.xml" />
</FeatureListURL>
<FeatureListURL>
  <Format>application/json</Format>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://example.com/featurelist.json" />
</FeatureListURL>
<DataURL>
  <Format>application/xml</Format>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://example.com/data.xml" />
</DataURL>
<DataURL>
  <Format>application/json</Format>
  <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://example.com/data.json" />
</DataURL>`;

  const xml_1_1 = `<Root>${xmlContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${xmlContent}</Root>`;

  let dataUrlsExtractorFactory_1_1: LayerResourceUrlsExtractorFactory;
  let featureListUrlsExtractorFactory_1_1: LayerResourceUrlsExtractorFactory;
  let dataUrlsExtractorFactory_1_3: LayerResourceUrlsExtractorFactory;
  let featureListUrlsExtractorFactory_1_3: LayerResourceUrlsExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let contextNode_1_1: Element;
  let contextNode_1_3: Element;

  beforeEach(() => {
    testContainer.backup();

    testContainer.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("DataURL"), constant("")],
      { name: "data-url-1.1.1" }
    );
    testContainer.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("FeatureListURL"), constant("")],
      { name: "feature-list-url-1.1.1" }
    );
    testContainer.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("DataURL"), constant("wms")],
      { name: "data-url-1.3.0" }
    );
    testContainer.registerClass(
      LayerResourceUrlsExtractorFactory,
      [constant("FeatureListURL"), constant("wms")],
      { name: "feature-list-url-1.3.0" }
    );

    dataUrlsExtractorFactory_1_1 = testContainer.resolve(
      LayerResourceUrlsExtractorFactory,
      "data-url-1.1.1"
    );
    dataUrlsExtractorFactory_1_3 = testContainer.resolve(
      LayerResourceUrlsExtractorFactory,
      "data-url-1.3.0"
    );
    featureListUrlsExtractorFactory_1_1 = testContainer.resolve(
      LayerResourceUrlsExtractorFactory,
      "feature-list-url-1.1.1"
    );
    featureListUrlsExtractorFactory_1_3 = testContainer.resolve(
      LayerResourceUrlsExtractorFactory,
      "feature-list-url-1.3.0"
    );

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

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should create SingleNodeDataExtractorFn, which extracts DataUrl objects array from context node v1.1.1", () => {
      const extract = dataUrlsExtractorFactory_1_1.createNodeDataExtractor();
      expect(extract(contextNode_1_1, select)).toEqual([
        { format: "application/xml", url: "http://example.com/data.xml" },
        { format: "application/json", url: "http://example.com/data.json" },
      ]);
    });

    it("should create SingleNodeDataExtractorFn, which extracts DataUrl objects array from context node v1.3.0", () => {
      const extract = dataUrlsExtractorFactory_1_3.createNodeDataExtractor();
      expect(extract(contextNode_1_3, select)).toEqual([
        { format: "application/xml", url: "http://example.com/data.xml" },
        { format: "application/json", url: "http://example.com/data.json" },
      ]);
    });

    it("should create SingleNodeDataExtractorFn, which extracts FeatureListUrl objects array from context node v1.1.1", () => {
      const extract =
        featureListUrlsExtractorFactory_1_1.createNodeDataExtractor();
      expect(extract(contextNode_1_1, select)).toEqual([
        {
          format: "application/xml",
          url: "http://example.com/featurelist.xml",
        },
        {
          format: "application/json",
          url: "http://example.com/featurelist.json",
        },
      ]);
    });

    it("should create SingleNodeDataExtractorFn, which extracts FeatureListUrl objects array from context node v1.3.0", () => {
      const extract =
        featureListUrlsExtractorFactory_1_3.createNodeDataExtractor();
      expect(extract(contextNode_1_3, select)).toEqual([
        {
          format: "application/xml",
          url: "http://example.com/featurelist.xml",
        },
        {
          format: "application/json",
          url: "http://example.com/featurelist.json",
        },
      ]);
    });
  });
});
