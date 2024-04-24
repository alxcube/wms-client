import {
  createObjectMapper,
  map,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath from "xpath";
import type { UnifiedCapabilitiesResponse } from "./data-types";

import type { CapabilitiesResponseDataExtractor } from "./CapabilitiesResponseDataExtractor";
import type { XmlDataExtractor } from "./XmlDataExtractor";

export class GenericCapabilitiesResponseDataExtractor
  implements CapabilitiesResponseDataExtractor
{
  constructor(
    private readonly serviceSectionExtractorFactory: XmlDataExtractor<
      UnifiedCapabilitiesResponse["service"]
    >,
    private readonly capabilitiesSectionExtractorFactory: XmlDataExtractor<
      UnifiedCapabilitiesResponse["capability"]
    >,
    private readonly namespaces: { [key: string]: string }
  ) {}
  extract(response: Document): UnifiedCapabilitiesResponse {
    return this.buildDataExtractor()(
      response,
      xpath.useNamespaces(this.namespaces)
    );
  }

  private buildDataExtractor(): SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse> {
    return createObjectMapper<UnifiedCapabilitiesResponse>({
      version: map().toNode("/*/@version").mandatory().asString(),
      updateSequence: map().toNode("/*/@updatesequence").asString(),
      service: this.serviceSectionExtractorFactory,
      capability: this.capabilitiesSectionExtractorFactory,
    });
  }
}
