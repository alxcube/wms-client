import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { UnifiedCapabilitiesResponse } from "../../UnifiedCapabilitiesResponse";

export class UpdateSequenceExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<
      UnifiedCapabilitiesResponse["updateSequence"]
    >
{
  constructor(private readonly rootNodeName: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<string | undefined> {
    return map()
      .toNode(`/${this.rootNodeName}/@updatesequence`)
      .asString()
      .createNodeDataExtractor();
  }
}
