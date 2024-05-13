import { constant } from "@alxcube/di-container";
import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import {
  IdentifiersExtractor,
  xlinkXmlNamespace,
  wmsXmlNamespace,
} from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("IdentifiersExtractor class", () => {
  const xmlContent = `
<AuthorityURL name="DIF_ID"><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://test1"/></AuthorityURL>
<AuthorityURL name="OTHER"><OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="http://test2"/></AuthorityURL>
<Identifier authority="DIF_ID">123456</Identifier>
<Identifier authority="OTHER">ID</Identifier>`;
  const xml_1_1 = `<Layer>${xmlContent}</Layer>`;
  const xml_1_3 = `<Layer xmlns="${wmsXmlNamespace}">${xmlContent}</Layer>`;
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
      "/Layer",
      xmlParser.parseFromString(xml_1_1, "text/xml"),
      true
    ) as Element;
    identifiersContainer_1_3 = select(
      "/wms:Layer",
      xmlParser.parseFromString(xml_1_3, "text/xml"),
      true
    ) as Element;
  });

  describe("createNodeDataExtractor() method", () => {
    it("should return SingleNodeDataExtractorFn, which returns Identifier objects array from given parent context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(identifiersContainer_1_1, select)).toEqual([
        { authorityUrl: "http://test1", value: "123456" },
        { authorityUrl: "http://test2", value: "ID" },
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which returns Identifier objects array from given parent context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(identifiersContainer_1_3, select)).toEqual([
        { authorityUrl: "http://test1", value: "123456" },
        { authorityUrl: "http://test2", value: "ID" },
      ]);
    });
  });
});
