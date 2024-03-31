import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { BoundingBox } from "../../../../wms-data-types/BoundingBox";

export class LayerBoundingBoxesExtractorFactory
  implements SingleNodeDataExtractorFnFactory<BoundingBox[] | undefined>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    BoundingBox[] | undefined
  > {
    return map()
      .toNodesArray("BoundingBox")
      .asArray()
      .ofObjects({
        crs: map().toNode("@SRS").mandatory().asString(),
        minX: map().toNode("@minx").mandatory().asNumber(),
        minY: map().toNode("@miny").mandatory().asNumber(),
        maxX: map().toNode("@maxx").mandatory().asNumber(),
        maxY: map().toNode("@maxy").mandatory().asNumber(),
        resX: map().toNode("@resx").asNumber(),
        resY: map().toNode("@resy").asNumber(),
      })
      .createNodeDataExtractor();
  }
}
