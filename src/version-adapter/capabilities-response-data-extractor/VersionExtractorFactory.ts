import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { UnifiedCapabilitiesResponse } from "../../UnifiedCapabilitiesResponse";

export class VersionExtractorFactory
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["version"]>
{
  constructor(private readonly rootNodeName: string) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["version"]
  > {
    return map()
      .toNode(`/${this.rootNodeName}/@version`)
      .mandatory()
      .asString()
      .createNodeDataExtractor();
  }
}
