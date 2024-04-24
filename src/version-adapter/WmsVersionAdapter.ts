import type {
  CapabilitiesRequestParams,
  FeatureInfoRequestParamsWithCustom,
  MapRequestParamsWithCustom,
} from "../client";
import type { UnifiedCapabilitiesResponse } from "./capabilities-response-data-extractor";

export interface WmsVersionAdapter {
  readonly version: string;
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;
  transformMapRequestParams(params: MapRequestParamsWithCustom): object;
  transformFeatureInfoRequestParams(
    params: FeatureInfoRequestParamsWithCustom
  ): object;
  isCompatible(wmsVersion: string): boolean;
}
