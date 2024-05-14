import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { Layer } from "../data-types";

/**
 * `Dimension` objects array extractor, compatible with WMS 1.3.
 */
export const dimensionsExtractor_1_3: SingleNodeDataExtractorFn<
  Layer["dimensions"]
> = map()
  .toNodesArray("wms:Dimension")
  .asArray()
  .ofObjects({
    name: map().toNode("@name").mandatory().asString(),
    units: map().toNode("@units").mandatory().asString(),
    unitSymbol: map().toNode("@unitSymbol").asString(),
    default: map().toNode("@default").asString(),
    multipleValues: map().toNode("@multipleValues").asBoolean(),
    nearestValue: map().toNode("@nearestValue").asBoolean(),
    current: map().toNode("@current").asBoolean(),
    value: map().toNode(".").asString(),
  })
  .createNodeDataExtractor();
