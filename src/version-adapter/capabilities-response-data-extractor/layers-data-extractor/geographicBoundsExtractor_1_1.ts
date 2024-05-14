import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { GeographicBoundingBox } from "../data-types";

/**
 * `GeographicBoundingBox` object extractor, compatible with WMS 1.1.
 */
export const geographicBoundsExtractor_1_1: SingleNodeDataExtractorFn<
  GeographicBoundingBox | undefined
> = map()
  .toNode("LatLonBoundingBox")
  .asObject({
    west: map().toNode("@minx").mandatory().asNumber(),
    south: map().toNode("@miny").mandatory().asNumber(),
    east: map().toNode("@maxx").mandatory().asNumber(),
    north: map().toNode("@maxy").mandatory().asNumber(),
  })
  .createNodeDataExtractor();
