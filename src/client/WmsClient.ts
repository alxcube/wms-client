import type { AxiosInstance } from "axios";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import type { MapRequestParams } from "./MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";

export interface WmsClientOptions {
  query?: { [key: string]: unknown };
}

export interface WmsClient {
  getVersion(): string;

  getCapabilities(
    params?: CapabilitiesRequestParams
  ): Promise<UnifiedCapabilitiesResponse>;

  getMap(params: MapRequestParams): Promise<ArrayBuffer>;

  getMapUrl(params: MapRequestParams): string;

  getCustomQueryParams(): { [key: string]: unknown };

  getHttpClient(): AxiosInstance;
}
