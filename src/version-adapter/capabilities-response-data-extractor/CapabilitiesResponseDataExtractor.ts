import type { UnifiedCapabilitiesResponse } from "../../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";

export interface CapabilitiesResponseDataExtractor {
  extract(response: Document): UnifiedCapabilitiesResponse;
}
