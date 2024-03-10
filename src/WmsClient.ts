import type { CapabilitiesRequestParams } from "./request/get-capabilities/CapabilitiesRequestParams";
import type { UnifiedCapabilitiesResponse } from "./request/get-capabilities/UnifiedCapabilitiesResponse";

export interface WmsClient {
  getVersion(): string;

  getCapabilities(
    params?: CapabilitiesRequestParams
  ): Promise<UnifiedCapabilitiesResponse>;
}
