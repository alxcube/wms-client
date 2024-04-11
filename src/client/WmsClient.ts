import type { AxiosInstance } from "axios";
import type { ExceptionFormat } from "../wms-data-types/ExceptionFormat";
import type { RequestBoundingBox } from "../wms-data-types/get-capabilities-response/RequestBoundingBox";
import type { UnifiedCapabilitiesResponse } from "../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";

export interface WmsClientOptions {
  query?: { [key: string]: unknown };
}

export interface CapabilitiesRequestParams {
  updateSequence?: number | string;

  [key: string]: number | string | undefined;
}

export interface LayerWithStyle {
  layer: string;
  style?: string;
}

export interface MapRequestParams {
  layers: LayerWithStyle[];
  crs: string;
  bounds: RequestBoundingBox;
  width: number;
  height: number;
  format: string;
  transparent?: boolean;
  bgColor?: string;
  exceptionsFormat?: ExceptionFormat | string;
  time?: number | string;
  elevation?: number | string;

  [key: string]: unknown;
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
