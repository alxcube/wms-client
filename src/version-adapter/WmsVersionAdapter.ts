import type { CapabilitiesRequestParams } from "../CapabilitiesRequestParams";
import type { UnifiedCapabilitiesResponse } from "../UnifiedCapabilitiesResponse";

export interface WmsVersionAdapter {
  readonly version: string;
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;
}
