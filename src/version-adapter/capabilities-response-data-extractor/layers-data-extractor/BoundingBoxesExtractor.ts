import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils/withNamespace";
import type { BoundingBox } from "../../../wms-data-types/BoundingBox";

export class BoundingBoxesExtractor
  implements SingleNodeDataExtractorFnFactory<BoundingBox[] | undefined>
{
  constructor(
    private readonly crsAttrName: string,
    private readonly ns: string
  ) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    BoundingBox[] | undefined
  > {
    return map()
      .toNodesArray(withNamespace("BoundingBox", this.ns))
      .asArray()
      .ofObjects({
        crs: map().toNode(`@${this.crsAttrName}`).mandatory().asString(),
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
