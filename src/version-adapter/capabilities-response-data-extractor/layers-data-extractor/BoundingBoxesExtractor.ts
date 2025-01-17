import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import { withNamespace } from "../../../utils";
import type { BoundingBox } from "../data-types";

/**
 * Data extractor factory for `BoundingBox` objects array extractor.
 */
export class BoundingBoxesExtractor
  implements SingleNodeDataExtractorFnFactory<BoundingBox[] | undefined>
{
  /**
   * BoundingBoxesExtractor constructor.
   *
   * @param crsAttrName
   * @param ns
   */
  constructor(
    private readonly crsAttrName: string,
    private readonly ns: string
  ) {}

  /**
   * @inheritdoc
   */
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
