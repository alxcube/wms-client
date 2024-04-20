import { map, type SingleNodeDataExtractorFn } from "@alxcube/xml-mapper";
import type { ResourceUrl } from "../../../wms-data-types/get-capabilities-response/ResourceUrl";

export const styleUrlExtractor_1_0: SingleNodeDataExtractorFn<
  ResourceUrl | undefined
> = map()
  .toNode("StyleURL")
  .asObject({
    format: () => "",
    url: map().toNode(".").mandatory().asString(),
  })
  .createNodeDataExtractor();
