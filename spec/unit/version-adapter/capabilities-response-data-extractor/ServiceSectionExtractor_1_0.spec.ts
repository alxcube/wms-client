import { beforeEach, describe, expect, it } from "vitest";
import xpath from "xpath";
import { ServiceSectionExtractor_1_0 } from "../../../../src/version-adapter/capabilities-response-data-extractor/ServiceSectionExtractor_1_0";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import xml from "../../../fixtures/capabilities_1_0_0.xml?raw";

describe("ServiceSectionExtractor_1_0 class", () => {
  let factory: ServiceSectionExtractor_1_0;
  let xmlParser: DOMParser;
  let responseDoc: Document;

  beforeEach(() => {
    factory = testContainer.instantiate(ServiceSectionExtractor_1_0, [
      { service: "XmlDataExtractor<Keyword[]>", name: "1.0.0" },
    ]);
    xmlParser = testContainer.resolve("DOMParser");
    responseDoc = xmlParser.parseFromString(xml, "text/xml");
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFnFactory, which extracts UnifiedCapabilitiesResponse['service'] object from xml response v1.0.0", () => {
      const extract = factory.createNodeDataExtractor();
      expect(extract(responseDoc, xpath.select)).toEqual({
        title: "Acme Corp. Map Server",
        description:
          "WMT Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
        keywords: [
          { value: "bird" },
          { value: "roadrunner" },
          { value: "ambush" },
        ],
        url: "http://hostname:port/path/",
        fees: "none",
        accessConstraints: "none",
      });
    });
  });
});
