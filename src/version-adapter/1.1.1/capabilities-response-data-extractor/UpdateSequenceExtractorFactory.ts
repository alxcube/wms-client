import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { UnifiedCapabilitiesResponse } from "../../../UnifiedCapabilitiesResponse";

export class UpdateSequenceExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<
      UnifiedCapabilitiesResponse["updateSequence"]
    >
{
  createNodeDataExtractor(): SingleNodeDataExtractorFn<string | undefined> {
    return map()
      .toNode("/WMT_MS_Capabilities/@updatesequence")
      .asString()
      .createNodeDataExtractor();
  }
}
