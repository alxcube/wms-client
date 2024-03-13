import type { AxiosInstance } from "axios";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";

export interface WmsClientOptions {
  query?: { [key: string]: unknown };
}
export interface WmsClient {
  getVersion(): string;

  getCapabilities(
    params?: CapabilitiesRequestParams
  ): Promise<UnifiedCapabilitiesResponse>;

  getCustomQueryParams(): { [key: string]: unknown };

  getHttpClient(): AxiosInstance;
}
