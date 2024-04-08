import {
  createObjectMapper,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath from "xpath";
import type { UnifiedCapabilitiesResponse } from "../../UnifiedCapabilitiesResponse";
import type { WmsCapabilitiesResponseDataExtractor } from "../BaseWmsVersionAdapter";
import type { XmlDataExtractor } from "./XmlDataExtractor";

export class GenericCapabilitiesResponseDataExtractor
  implements WmsCapabilitiesResponseDataExtractor
{
  constructor(
    private readonly versionExtractorFactory: XmlDataExtractor<
      UnifiedCapabilitiesResponse["version"]
    >,
    private readonly updateSequenceExtractorFactory: XmlDataExtractor<
      UnifiedCapabilitiesResponse["updateSequence"]
    >,
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
      version: this.versionExtractorFactory,
      updateSequence: this.updateSequenceExtractorFactory,
      service: this.serviceSectionExtractorFactory,
      capability: this.capabilitiesSectionExtractorFactory,
    });
  }
}
