import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { ResourceUrl } from "../data-types";

/**
 * <StyleURL/> node data extractor, compatible with WMS 1.0.
 */
export const styleUrlExtractor_1_0: SingleNodeDataExtractorFn<
  ResourceUrl | undefined
> = map()
  .toNode("StyleURL")
  .asObject({
    format: () => "",
    url: map().toNode(".").mandatory().asString(),
  })
  .createNodeDataExtractor();
