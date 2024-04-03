import type { AxiosInstance } from "axios";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import type { MapRequestParams } from "./MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";

export interface WmsClientOptions {
  query?: { [key: string]: unknown };
}

export interface GetMapUrlOptions {
  flipAxes?: boolean;
}

export interface GetMapOptions extends GetMapUrlOptions {}
export interface WmsClient {
  getVersion(): string;

  getCapabilities(
    params?: CapabilitiesRequestParams
  ): Promise<UnifiedCapabilitiesResponse>;

  getMap(
    params: MapRequestParams,
    options?: GetMapOptions
  ): Promise<ArrayBuffer>;

  getMapUrl(params: MapRequestParams, options?: GetMapUrlOptions): string;

  getCustomQueryParams(): { [key: string]: unknown };

  getHttpClient(): AxiosInstance;
}
