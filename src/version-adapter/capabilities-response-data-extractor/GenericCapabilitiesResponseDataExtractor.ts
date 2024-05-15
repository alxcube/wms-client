import {
  createObjectMapper,
  map,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath from "xpath";
import type { UnifiedCapabilitiesResponse } from "./data-types";

import type { CapabilitiesResponseDataExtractor } from "./CapabilitiesResponseDataExtractor";
import type { XmlDataExtractor } from "./XmlDataExtractor";

/**
 * Generic CapabilitiesResponseDataExtractor implementing class.
 */
export class GenericCapabilitiesResponseDataExtractor
  implements CapabilitiesResponseDataExtractor
{
  /**
   * GenericCapabilitiesResponseDataExtractor constructor.
   */
  constructor(
    private readonly serviceSectionExtractorFactory: XmlDataExtractor<
      UnifiedCapabilitiesResponse["service"]
    >,
    private readonly capabilitiesSectionExtractorFactory: XmlDataExtractor<
      UnifiedCapabilitiesResponse["capability"]
    >,
    private readonly namespaces: { [key: string]: string }
  ) {}

  /**
   * @inheritdoc
   */
  extract(response: Document): UnifiedCapabilitiesResponse {
    return this.buildDataExtractor()(
      response,
      xpath.useNamespaces(this.namespaces)
    );
  }

  /**
   * Returns UnifiedCapabilitiesResponse extractor.
   */
  private buildDataExtractor(): SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse> {
    return createObjectMapper<UnifiedCapabilitiesResponse>({
      version: map().toNode("/*/@version").mandatory().asString(),
      updateSequence: map().toNode("/*/@updatesequence").asString(),
      service: this.serviceSectionExtractorFactory,
      capability: this.capabilitiesSectionExtractorFactory,
    });
  }
}
