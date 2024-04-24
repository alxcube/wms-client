import type { UnifiedCapabilitiesResponse } from "./data-types";

export interface CapabilitiesResponseDataExtractor {
  extract(response: Document): UnifiedCapabilitiesResponse;
}
