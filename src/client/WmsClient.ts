import type { AxiosInstance } from "axios";
import type { ExceptionFormat } from "../error";
import type {
  RequestBoundingBox,
  UnifiedCapabilitiesResponse,
} from "../version-adapter";

export interface WmsClientOptions {
  query?: { [key: string]: unknown };
  mapRequestUrl?: string;
  featureInfoRequestUrl?: string;
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
}

export interface MapRequestParamsWithCustom extends MapRequestParams {
  [key: string]: unknown;
}

export interface FeatureInfoRequestParams extends MapRequestParams {
  queryLayers: string[];
  infoFormat: string;
  x: number;
  y: number;
  featureCount?: number;
}

export interface FeatureInfoRequestParamsWithCustom
  extends FeatureInfoRequestParams {
  [key: string]: unknown;
}

export interface WmsClient {
  getVersion(): string;

  getWmsUrl(): string;

  getCapabilities(
    params?: CapabilitiesRequestParams
  ): Promise<UnifiedCapabilitiesResponse>;

  getMap(params: MapRequestParamsWithCustom): Promise<ArrayBuffer>;

  getMapRequestUrl(): string;

  setMapRequestUrl(url: string): void;

  getMapUrl(params: MapRequestParamsWithCustom): string;

  getCustomQueryParams(): { [key: string]: unknown };

  getHttpClient(): AxiosInstance;

  getFeatureInfo(params: FeatureInfoRequestParamsWithCustom): Promise<string>;

  getFeatureInfoRequestUrl(): string;

  setFeatureInfoRequestUrl(url: string): void;
}
