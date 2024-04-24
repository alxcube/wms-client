import { beforeEach, describe, expect, it } from "vitest";
import xpath, { type XPathSelect } from "xpath";
import { DimensionsExtractor_1_1 } from "../../../../../src";
import { testContainer } from "../../../../testContainer";

describe("DimensionsExtractor_1_1 class", () => {
  const xml = `
<Layer>
    <Dimension name="time" units="TIME_UNITS" />
    <Layer>
        <Dimension name="elevation" units="ELEVATION_UNITS" />
        <Extent name="time" nearestValue="1" default="DEFAULT_TIME">TIME_VALUE</Extent>
        <Extent name="elevation">ELEVATION_VALUE_1</Extent>
    </Layer>
    <Layer>
        <Extent name="time">1234</Extent>
        <Extent name="elevation">ELEVATION_VALUE_2</Extent>    
    </Layer>
</Layer>`;

  let factory: DimensionsExtractor_1_1;
  let xmlParser: DOMParser;
  let rootLayerNode: Element;
  let nestedLayerNode1: Element;
  let nestedLayerNode2: Element;
  let select: XPathSelect;

  beforeEach(() => {
    factory = testContainer.instantiate(DimensionsExtractor_1_1, []);
    xmlParser = testContainer.resolve("DOMParser");
    select = xpath.select;
    const doc = xmlParser.parseFromString(xml, "text/xml");
    rootLayerNode = select("/Layer", doc, true) as Element;
    nestedLayerNode1 = select("/Layer/Layer[1]", doc, true) as Element;
    nestedLayerNode2 = select("/Layer/Layer[2]", doc, true) as Element;
  });

  describe("createNodeDataExtractor() method", () => {
    it("should create SingleNodeDataExtractorFn, which returns empty array, when only Dimension node is present, and not Extent node", () => {
      const extract = factory.createNodeDataExtractor();
      expect(extract).toBeTypeOf("function");
      expect(extract(rootLayerNode, select)).toEqual([]);
    });

    it("should create SingleNodeDataExtractorFn, which extracts Dimension objects array from Layer node, including dimensions, declared in parent Layer node", () => {
      const extract = factory.createNodeDataExtractor();
      expect(extract(nestedLayerNode1, select)).toEqual([
        {
          name: "time",
          units: "TIME_UNITS",
          nearestValue: true,
          value: "TIME_VALUE",
          default: "DEFAULT_TIME",
        },
        {
          name: "elevation",
          units: "ELEVATION_UNITS",
          value: "ELEVATION_VALUE_1",
        },
      ]);
    });

    it("should create SingleNodeDataExtractorFn, which extracts Dimension objects array from Layer node, including dimensions, declared earlier in xml", () => {
      const extract = factory.createNodeDataExtractor();
      expect(extract(nestedLayerNode2, select)).toEqual([
        {
          name: "time",
          units: "TIME_UNITS",
          value: "1234",
        },
        {
          name: "elevation",
          units: "ELEVATION_UNITS",
          value: "ELEVATION_VALUE_2",
        },
      ]);
    });
  });
});
