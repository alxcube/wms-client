import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { ResourceUrl } from "../data-types";

/**
 * Layer DataUrl array extractor, compatible with WMS 1.0.
 */
export const dataUrlsExtractor_1_0: SingleNodeDataExtractorFn<
  ResourceUrl[] | undefined
> = map()
  .toNodesArray("DataURL")
  .asArray()
  .ofObjects({
    format: () => "", // No Format node, just return empty string
    url: map().toNode(".").mandatory().asString(),
  })
  .createNodeDataExtractor();
