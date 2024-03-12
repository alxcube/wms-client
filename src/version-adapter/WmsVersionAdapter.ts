import type { CapabilitiesRequestParams } from "../CapabilitiesRequestParams";
import type { WmsException } from "../error/WmsException";
import type { UnifiedCapabilitiesResponse } from "../UnifiedCapabilitiesResponse";

export interface WmsVersionAdapter {
  readonly version: string;
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;
  extractErrors(doc: Document): WmsException[];
}
