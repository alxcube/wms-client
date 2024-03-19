import type { CapabilitiesRequestParams } from "../CapabilitiesRequestParams";
import type { WmsException } from "../error/WmsException";
import type { MapRequestParams } from "../MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "../UnifiedCapabilitiesResponse";
import type { WmsVersionAdapter } from "./WmsVersionAdapter";

export interface WmsCapabilitiesResponseDataExtractor {
  extract(response: Document): UnifiedCapabilitiesResponse;
}

export interface WmsErrorsExtractor {
  extract(response: Document): WmsException[];
}

export interface WmsCapabilitiesRequestParamsTransformer {
  transform(params: CapabilitiesRequestParams): object;
}

export interface WmsMapRequestParamsTransformer {
  transform(params: MapRequestParams): object;
}

export class BaseWmsVersionAdapter implements WmsVersionAdapter {
  constructor(
    readonly version: string,
    private readonly capabilitiesRequestParamsTransformer: WmsCapabilitiesRequestParamsTransformer,
    private readonly capabilitiesResponseDataExtractor: WmsCapabilitiesResponseDataExtractor,
    private readonly mapRequestParamsTransformer: WmsMapRequestParamsTransformer,
    private readonly errorsExtractor: WmsErrorsExtractor
  ) {}

  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse {
    return this.capabilitiesResponseDataExtractor.extract(response);
  }

  extractErrors(doc: Document): WmsException[] {
    return this.errorsExtractor.extract(doc);
  }

  transformCapabilitiesRequestParams(
    params: CapabilitiesRequestParams
  ): object {
    return this.capabilitiesRequestParamsTransformer.transform(params);
  }

  transformMapRequestParams(params: MapRequestParams): object {
    return this.mapRequestParamsTransformer.transform(params);
  }
}
