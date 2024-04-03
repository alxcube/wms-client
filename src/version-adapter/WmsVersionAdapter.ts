import type { CapabilitiesRequestParams } from "../CapabilitiesRequestParams";
import type { WmsException } from "../error/WmsException";
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
  extractErrors(doc: Document): WmsException[];
}
