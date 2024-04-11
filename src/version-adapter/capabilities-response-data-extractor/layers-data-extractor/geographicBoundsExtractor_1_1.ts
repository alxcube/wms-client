import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { GeographicBoundingBox } from "../../../wms-data-types/GeographicBoundingBox";

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
