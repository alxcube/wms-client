import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { GeographicBoundingBox } from "../data-types";

/**
 * `GeographicBoundingBox` object extractor, compatible with WMS 1.3.
 */
export const geographicBoundsExtractor_1_3: SingleNodeDataExtractorFn<
  GeographicBoundingBox | undefined
> = map()
  .toNode("wms:EX_GeographicBoundingBox")
  .asObject({
    north: map().toNode("wms:northBoundLatitude").mandatory().asNumber(),
    south: map().toNode("wms:southBoundLatitude").mandatory().asNumber(),
    west: map().toNode("wms:westBoundLongitude").mandatory().asNumber(),
    east: map().toNode("wms:eastBoundLongitude").mandatory().asNumber(),
  })
  .createNodeDataExtractor();
