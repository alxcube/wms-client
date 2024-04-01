import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { UnifiedCapabilitiesResponse } from "../../../UnifiedCapabilitiesResponse";

export class VersionExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["version"]>
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["version"]
  > {
    return map()
      .toNode("/WMT_MS_Capabilities/@version")
      .mandatory()
      .asString()
      .createNodeDataExtractor();
  }
}
