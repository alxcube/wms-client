import { beforeEach, describe, expect, it } from "vitest";
import xpath from "xpath";
import { layerGeographicBoundsExtractor_1_1 } from "../../../../../src/version-adapter/capabilities-response-data-extractor/layers-data-extractor/layerGeographicBoundsExtractor_1_1";
import { testContainer } from "../../../../testContainer";

describe("layerGeographicBoundsExtractor_1_1 data extractor function", () => {
  const xml = `<Root><LatLonBoundingBox minx="-180" miny="-90" maxx="180" maxy="90" /></Root>`;
  let containerElement: Element;
  let xmlParser: DOMParser;

  beforeEach(() => {
    xmlParser = testContainer.resolve("DOMParser");
    containerElement = xpath.select(
      "/Root",
      xmlParser.parseFromString(xml, "text/xml"),
      true
    ) as Element;
  });

  it("should return GeographicBoundingBox object from LatLonBoundingBox element", () => {
    expect(
      layerGeographicBoundsExtractor_1_1(containerElement, xpath.select)
    ).toEqual({
      north: 90,
      south: -90,
      west: -180,
      east: 180,
    });
  });
});