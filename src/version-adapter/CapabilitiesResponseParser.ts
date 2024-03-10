import type { UnifiedCapabilitiesResponse } from "../request/get-capabilities/UnifiedCapabilitiesResponse";

export interface CapabilitiesResponseParser {
  parse(response: string): UnifiedCapabilitiesResponse;
}
