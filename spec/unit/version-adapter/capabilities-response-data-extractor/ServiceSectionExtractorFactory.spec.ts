import { afterEach, beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../src/service-container/constant";
import { ServiceSectionExtractorFactory } from "../../../../src/version-adapter/capabilities-response-data-extractor/ServiceSectionExtractorFactory";
import { xlinkXmlNamespace } from "../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../src/version-adapter/wmsXmlNamespace";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import xml_1_1 from "../../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import xml_1_3 from "../../../fixtures/capabilities_1_3_0.xml?raw";

describe("ServiceSectionExtractorFactory class", () => {
  let factory_1_1: ServiceSectionExtractorFactory;
  let factory_1_3: ServiceSectionExtractorFactory;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let doc_1_1: Document;
  let doc_1_3: Document;

  beforeEach(() => {
    testContainer.backup();
    testContainer.registerClass(
      ServiceSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name: "1.1.1" },
        constant("WMT_MS_Capabilities"),
        constant(""),
      ],
      { name: "1.1.1" }
    );
    testContainer.registerClass(
      ServiceSectionExtractorFactory,
      [
        { service: "XmlDataExtractor<Keyword[]>", name: "1.3.0" },
        constant("wms:WMS_Capabilities"),
        constant("wms"),
      ],
      { name: "1.3.0" }
    );

    factory_1_1 = testContainer.resolve(
      ServiceSectionExtractorFactory,
      "1.1.1"
    );
    factory_1_3 = testContainer.resolve(
      ServiceSectionExtractorFactory,
      "1.3.0"
    );

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    doc_1_1 = xmlParser.parseFromString(xml_1_1, "text/xml");
    doc_1_3 = xmlParser.parseFromString(xml_1_3, "text/xml");
  });

  afterEach(() => {
    testContainer.restore();
  });

  describe("createNodeDataExtractor() method", () => {
    it("should create SingleNodeDataExtractorFn, which returns UnifiedCapabilitiesResponse.service object from xml v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(doc_1_1, select)).toEqual({
        title: "Acme Corp. Map Server",
        description:
          "WMT Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
        keywords: [
          { value: "bird" },
          { value: "roadrunner" },
          { value: "ambush" },
        ],
        url: "http://hostname/",
        contactInformation: {
          contactPerson: {
            name: "Jeff deLaBeaujardiere",
            organization: "NASA",
          },
          position: "Computer Scientist",
          address: {
            addressType: "postal",
            address: "NASA Goddard Space Flight Center, Code 933",
            city: "Greenbelt",
            stateOrProvince: "MD",
            postCode: "20771",
            country: "USA",
          },
          telephone: "+1 301 286-1569",
          fax: "+1 301 286-1777",
          email: "delabeau@iniki.gsfc.nasa.gov",
        },
        fees: "none",
        accessConstraints: "none",
      });
    });

    it("should create SingleNodeDataExtractorFn, which returns UnifiedCapabilitiesResponse.service object from xml v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(doc_1_3, select)).toEqual({
        title: "Acme Corp. Map Server",
        description:
          "Map Server maintained by Acme Corporation.  Contact: webmaster@wmt.acme.com.  High-quality maps showing roadrunner nests and possible ambush locations.",
        keywords: [
          { value: "bird" },
          { value: "roadrunner" },
          { value: "ambush" },
        ],
        url: "http://hostname/",
        contactInformation: {
          contactPerson: {
            name: "Jeff Smith",
            organization: "NASA",
          },
          position: "Computer Scientist",
          address: {
            addressType: "postal",
            address: "NASA Goddard Space Flight Center",
            city: "Greenbelt",
            stateOrProvince: "MD",
            postCode: "20771",
            country: "USA",
          },
          telephone: "+1 301 555-1212",
          email: "user@host.com",
        },
        fees: "none",
        accessConstraints: "none",
        layerLimit: 16,
        maxWidth: 2048,
        maxHeight: 2048,
      });
    });
  });
});
