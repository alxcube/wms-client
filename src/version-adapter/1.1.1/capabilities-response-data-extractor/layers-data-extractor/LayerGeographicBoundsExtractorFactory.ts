import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { GeographicBoundingBox } from "../../../../wms-data-types/GeographicBoundingBox";

export class LayerGeographicBoundsExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<GeographicBoundingBox | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    GeographicBoundingBox | undefined
  > {
    return map()
      .toNode("LatLonBoundingBox")
      .asObject({
        west: map().toNode("@minx").mandatory().asNumber(),
        south: map().toNode("@miny").mandatory().asNumber(),
        east: map().toNode("@maxx").mandatory().asNumber(),
        north: map().toNode("@maxy").mandatory().asNumber(),
      })
      .createNodeDataExtractor();
  }
}
