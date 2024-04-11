import type { CapabilitiesRequestParams } from "../client/CapabilitiesRequestParams";
import type { MapRequestParams } from "../client/MapRequestParams";
import type { UnifiedCapabilitiesResponse } from "../client/UnifiedCapabilitiesResponse";
import type { VersionCompatibilityChecker } from "./version-compatibility-checker/VersionCompatibilityChecker";
import type { WmsVersionAdapter } from "./WmsVersionAdapter";

export interface WmsCapabilitiesResponseDataExtractor {
  extract(response: Document): UnifiedCapabilitiesResponse;
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

  transformMapRequestParams(params: MapRequestParams): object {
    return this.mapRequestParamsTransformer.transform(params);
  }
  isCompatible(wmsVersion: string): boolean {
    return this.versionCompatibilityChecker.isCompatible(wmsVersion);
  }
}
