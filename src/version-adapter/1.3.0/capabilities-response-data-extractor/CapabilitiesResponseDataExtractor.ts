import {
  createObjectMapper,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath from "xpath";
import type { UnifiedCapabilitiesResponse } from "../../../UnifiedCapabilitiesResponse";
import type { WmsCapabilitiesResponseDataExtractor } from "../../BaseWmsVersionAdapter";
import type { XmlDataExtractor } from "../../XmlDataExtractor";

export class CapabilitiesResponseDataExtractor
  implements WmsCapabilitiesResponseDataExtractor
{
  private dataExtractor:
    | SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse>
    | undefined;

  constructor(
    private readonly versionExtractor: XmlDataExtractor<
      UnifiedCapabilitiesResponse["version"]
    >,
    private readonly updateSequenceExtractor: XmlDataExtractor<
      UnifiedCapabilitiesResponse["updateSequence"]
    >,
    private readonly serviceExtractor: XmlDataExtractor<
      UnifiedCapabilitiesResponse["service"]
    >,
    private readonly capabilityExtractor: XmlDataExtractor<
      UnifiedCapabilitiesResponse["capability"]
    >
  ) {}

  extract(response: Document): UnifiedCapabilitiesResponse {
    return this.getDataExtractor()(
      response,
      xpath.useNamespaces({
        wms: "http://www.opengis.net/wms",
        xlink: "http://www.w3.org/1999/xlink",
      })
    );
  }

  private getDataExtractor(): SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse> {
    if (!this.dataExtractor) {
      this.dataExtractor = this.buildDataExtractor();
    }
    return this.dataExtractor;
  }

  private buildDataExtractor(): SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse> {
    return createObjectMapper<UnifiedCapabilitiesResponse>({
      version: this.versionExtractor,
      updateSequence: this.updateSequenceExtractor,
      service: this.serviceExtractor,
      capability: this.capabilityExtractor,
    });
  }
}
