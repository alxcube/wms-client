import type { CapabilitiesRequestParams } from "../CapabilitiesRequestParams";
import type { MapRequestParams } from "../MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "../UnifiedCapabilitiesResponse";

export interface TransformMapRequestParamsOptions {
  flipAxes?: boolean;
}
export interface WmsVersionAdapter {
  readonly version: string;
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;
  transformMapRequestParams(
    params: MapRequestParams,
    options?: TransformMapRequestParamsOptions
  ): object;
  isCompatible(wmsVersion: string): boolean;
}
