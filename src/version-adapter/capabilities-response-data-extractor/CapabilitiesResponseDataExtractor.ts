import type { UnifiedCapabilitiesResponse } from "./data-types";

/**
 * "GetCapabilities" response data extractor interface.
 */
export interface CapabilitiesResponseDataExtractor {
  /**
   * Extracts `UnifiedCapabilitiesResponse` object from given "GetCapabilities" response document.
   *
   * @param response
   */
  extract(response: Document): UnifiedCapabilitiesResponse;
}
