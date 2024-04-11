import type {
  CapabilitiesRequestParams,
  MapRequestParams,
} from "../client/WmsClient";
import type { UnifiedCapabilitiesResponse } from "../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";

export interface WmsVersionAdapter {
  readonly version: string;
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;
  transformMapRequestParams(params: MapRequestParams): object;
  isCompatible(wmsVersion: string): boolean;
}
