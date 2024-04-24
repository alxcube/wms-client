import {
  map,
  type SingleNodeDataExtractorFn,
  type SingleNodeDataExtractorFnFactory,
} from "@alxcube/xml-mapper";
import type { Keyword, UnifiedCapabilitiesResponse } from "./data-types";
import type { XmlDataExtractor } from "./XmlDataExtractor";

export class ServiceSectionExtractor_1_0
  implements
    SingleNodeDataExtractorFnFactory<UnifiedCapabilitiesResponse["service"]>
{
  constructor(
    private keywordsExtractor: XmlDataExtractor<Keyword[] | undefined>
  ) {}
  createNodeDataExtractor(): SingleNodeDataExtractorFn<
    UnifiedCapabilitiesResponse["service"]
  > {
    return map()
      .toNode("/WMT_MS_Capabilities/Service")
      .mandatory()
      .asObject({
        title: map().toNode("Title").asString().withDefault(""),
        description: map().toNode("Abstract").asString(),
        keywords: this.keywordsExtractor,
        url: map().toNode("OnlineResource").asString().withDefault(""),
        fees: map().toNode("Fees").asString(),
        accessConstraints: map().toNode("AccessConstraints").asString(),
      })
      .createNodeDataExtractor();
  }
}
