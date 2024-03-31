import {
  createObjectMapper,
  map,
  type SingleNodeDataExtractorFn,
} from "@alxcube/xml-mapper";
import xpath from "xpath";
import type { UnifiedCapabilitiesResponse } from "../../../UnifiedCapabilitiesResponse";
import type { WmsCapabilitiesResponseDataExtractor } from "../../BaseWmsVersionAdapter";
import type { CapabilitiesExtractorFactory } from "./CapabilitiesExtractorFactory";
import type { ServiceDataExtractorFactory } from "./ServiceDataExtractorFactory";

export class CapabilitiesResponseDataExtractor
  implements WmsCapabilitiesResponseDataExtractor
{
  constructor(
    private readonly serviceDataExtractorFactory: ServiceDataExtractorFactory,
    private readonly capabilitiesExtractorFactory: CapabilitiesExtractorFactory
  ) {}
  extract(response: Document): UnifiedCapabilitiesResponse {
    return this.buildDataExtractor()(
      response,
      xpath.useNamespaces({
        wms: "http://www.opengis.net/wms",
        xlink: "http://www.w3.org/1999/xlink",
      })
    );
  }

  private buildDataExtractor(): SingleNodeDataExtractorFn<UnifiedCapabilitiesResponse> {
    return createObjectMapper<UnifiedCapabilitiesResponse>({
      version: map()
        .toNode("/WMT_MS_Capabilities/@version")
        .mandatory()
        .asString(),
      updateSequence: map()
        .toNode("/WMT_MS_Capabilities/@updatesequence")
        .asString(),
      service: this.serviceDataExtractorFactory,
      capability: this.capabilitiesExtractorFactory,
    });
  }
}
