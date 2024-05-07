import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  ServiceSectionExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../src";
import { testContainer } from "../../../testContainer";
// eslint-disable-next-line import/no-unresolved
import xml_1_1 from "../../../fixtures/capabilities_1_1_1.xml?raw";
// eslint-disable-next-line import/no-unresolved
import xml_1_3 from "../../../fixtures/capabilities_1_3_0.xml?raw";

describe("ServiceSectionExtractor class", () => {
  let factory_1_1: ServiceSectionExtractor;
  let factory_1_3: ServiceSectionExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let doc_1_1: Document;
  let doc_1_3: Document;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(ServiceSectionExtractor, [
      { service: "XmlDataExtractor<Keyword[]>", name: "1.1.1" },
      constant("WMT_MS_Capabilities"),
      constant(""),
    ]);
    factory_1_3 = testContainer.instantiate(ServiceSectionExtractor, [
      { service: "XmlDataExtractor<Keyword[]>", name: "1.3.0" },
      constant("WMS_Capabilities"),
      constant("wms"),
    ]);

    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.useNamespaces({
      xlink: xlinkXmlNamespace,
      wms: wmsXmlNamespace,
    });

    doc_1_1 = xmlParser.parseFromString(xml_1_1, "text/xml");
    doc_1_3 = xmlParser.parseFromString(xml_1_3, "text/xml");
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
