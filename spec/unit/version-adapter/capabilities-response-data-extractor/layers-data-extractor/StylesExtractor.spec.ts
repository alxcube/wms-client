import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { constant } from "../../../../../src/service-container/constant";
import { StylesExtractor } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/StylesExtractor";
import { xlinkXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/xlinkXmlNamespace";
import { wmsXmlNamespace } from "../../../../../src/version-adapter/capabilities-response-data-extractor/wmsXmlNamespace";
import { testContainer } from "../../../../testContainer";

describe("StylesExtractor class", () => {
  const xmlContent = `
<Style>
  <Name>USGS</Name>
  <Title>USGS Topo Map Style</Title>
  <Abstract>Features are shown in a style like that used in USGS topographic maps.</Abstract>
  <LegendURL width="72" height="72">
    <Format>image/gif</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/legends/usgs.gif" />
  </LegendURL>
  <StyleSheetURL>
    <Format>text/xsl</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/stylesheets/usgs.xsl" />
  </StyleSheetURL>
</Style>
<Style>
  <Name>ATLAS</Name>
  <Title>Road atlas style</Title>
  <Abstract>Roads are shown in a style like that used in a commercial road atlas.</Abstract>
  <LegendURL width="72" height="72">
    <Format>image/gif</Format>
    <OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.university.edu/legends/atlas.gif" />
  </LegendURL>
</Style>`;

  const xml_1_1 = `<Root>${xmlContent}</Root>`;
  const xml_1_3 = `<Root xmlns="${wmsXmlNamespace}">${xmlContent}</Root>`;
  let factory_1_1: StylesExtractor;
  let factory_1_3: StylesExtractor;
  let xmlParser: DOMParser;
  let select: XPathSelect;
  let contextNode_1_1: Element;
  let contextNode_1_3: Element;

  beforeEach(() => {
    factory_1_1 = testContainer.instantiate(StylesExtractor, [
      { service: "XmlDataExtractor<Layer[styles][styleUrl]>", name: "1.1.1" },
      constant(""),
    ]);
    factory_1_3 = testContainer.instantiate(StylesExtractor, [
      { service: "XmlDataExtractor<Layer[styles][styleUrl]>", name: "1.3.0" },
      constant("wms"),
    ]);

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
    it("should return SingleNodeDataExtractorFn, which returns array of LayerStyle objects from context node v1.1.1", () => {
      const extract = factory_1_1.createNodeDataExtractor();
      expect(extract(contextNode_1_1, select)).toEqual([
        {
          name: "USGS",
          title: "USGS Topo Map Style",
          description:
            "Features are shown in a style like that used in USGS topographic maps.",
          legendUrls: [
            {
              width: 72,
              height: 72,
              format: "image/gif",
              url: "http://www.university.edu/legends/usgs.gif",
            },
          ],
          stylesheetUrl: {
            format: "text/xsl",
            url: "http://www.university.edu/stylesheets/usgs.xsl",
          },
        },
        {
          name: "ATLAS",
          title: "Road atlas style",
          description:
            "Roads are shown in a style like that used in a commercial road atlas.",
          legendUrls: [
            {
              width: 72,
              height: 72,
              format: "image/gif",
              url: "http://www.university.edu/legends/atlas.gif",
            },
          ],
        },
      ]);
    });

    it("should return SingleNodeDataExtractorFn, which returns array of LayerStyle objects from context node v1.3.0", () => {
      const extract = factory_1_3.createNodeDataExtractor();
      expect(extract(contextNode_1_3, select)).toEqual([
        {
          name: "USGS",
          title: "USGS Topo Map Style",
          description:
            "Features are shown in a style like that used in USGS topographic maps.",
          legendUrls: [
            {
              width: 72,
              height: 72,
              format: "image/gif",
              url: "http://www.university.edu/legends/usgs.gif",
            },
          ],
          stylesheetUrl: {
            format: "text/xsl",
            url: "http://www.university.edu/stylesheets/usgs.xsl",
          },
        },
        {
          name: "ATLAS",
          title: "Road atlas style",
          description:
            "Roads are shown in a style like that used in a commercial road atlas.",
          legendUrls: [
            {
              width: 72,
              height: 72,
              format: "image/gif",
              url: "http://www.university.edu/legends/atlas.gif",
            },
          ],
        },
      ]);
    });
  });
});
