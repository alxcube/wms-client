import type { CapabilitiesRequestParams } from "../client/CapabilitiesRequestParams";
import type { MapRequestParams } from "../client/MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "../client/UnifiedCapabilitiesResponse";

export interface WmsVersionAdapter {
  readonly version: string;
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;
  transformMapRequestParams(params: MapRequestParams): object;
  isCompatible(wmsVersion: string): boolean;
}
