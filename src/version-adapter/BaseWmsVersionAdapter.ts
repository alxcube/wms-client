import type { CapabilitiesRequestParams } from "../CapabilitiesRequestParams";
import type { MapRequestParams } from "../MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "../UnifiedCapabilitiesResponse";
import type { VersionCompatibilityChecker } from "./VersionCompatibilityChecker";
import type {
  TransformMapRequestParamsOptions,
  WmsVersionAdapter,
} from "./WmsVersionAdapter";

export interface WmsCapabilitiesResponseDataExtractor {
  extract(response: Document): UnifiedCapabilitiesResponse;
}

export interface WmsCapabilitiesRequestParamsTransformer {
  transform(params: CapabilitiesRequestParams): object;
}

export interface WmsMapRequestParamsTransformer {
  transform(
    params: MapRequestParams,
    options?: TransformMapRequestParamsOptions
  ): object;
}

export class BaseWmsVersionAdapter implements WmsVersionAdapter {
  constructor(
    readonly version: string,
    private readonly capabilitiesRequestParamsTransformer: WmsCapabilitiesRequestParamsTransformer,
    private readonly capabilitiesResponseDataExtractor: WmsCapabilitiesResponseDataExtractor,
    private readonly mapRequestParamsTransformer: WmsMapRequestParamsTransformer,
    private readonly versionCompatibilityChecker: VersionCompatibilityChecker
  ) {}

  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse {
    return this.capabilitiesResponseDataExtractor.extract(response);
  }

  transformCapabilitiesRequestParams(
    params: CapabilitiesRequestParams
  ): object {
    return this.capabilitiesRequestParamsTransformer.transform(params);
  }

  transformMapRequestParams(
    params: MapRequestParams,
    options: TransformMapRequestParamsOptions = {}
  ): object {
    return this.mapRequestParamsTransformer.transform(params, options);
  }
  isCompatible(wmsVersion: string): boolean {
    return this.versionCompatibilityChecker.isCompatible(wmsVersion);
  }
}
