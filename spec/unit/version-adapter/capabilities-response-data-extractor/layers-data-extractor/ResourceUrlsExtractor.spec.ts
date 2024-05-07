import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  ResourceUrlsExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("ResourceUrlsExtractor class", () => {
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

  let dataUrlsExtractorFactory_1_1: ResourceUrlsExtractor;
  let featureListUrlsExtractorFactory_1_1: ResourceUrlsExtractor;
  let dataUrlsExtractorFactory_1_3: ResourceUrlsExtractor;
  let featureListUrlsExtractorFactory_1_3: ResourceUrlsExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let contextNode_1_1: Element;
  let contextNode_1_3: Element;

  beforeEach(() => {
    dataUrlsExtractorFactory_1_1 = testContainer.instantiate(
      ResourceUrlsExtractor,
      [constant("DataURL"), constant("")]
    );
    dataUrlsExtractorFactory_1_3 = testContainer.instantiate(
      ResourceUrlsExtractor,
      [constant("DataURL"), constant("wms")]
    );
    featureListUrlsExtractorFactory_1_1 = testContainer.instantiate(
      ResourceUrlsExtractor,
      [constant("FeatureListURL"), constant("")]
    );
    featureListUrlsExtractorFactory_1_3 = testContainer.instantiate(
      ResourceUrlsExtractor,
      [constant("FeatureListURL"), constant("wms")]
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
