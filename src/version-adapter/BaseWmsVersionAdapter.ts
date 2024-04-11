import type {
  CapabilitiesRequestParams,
  MapRequestParams,
} from "../client/WmsClient";
import type { UnifiedCapabilitiesResponse } from "../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";
import type { CapabilitiesRequestParamsTransformer } from "./capabilities-request-params-transformer/CapabilitiesRequestParamsTransformer";
import type { CapabilitiesResponseDataExtractor } from "./capabilities-response-data-extractor/CapabilitiesResponseDataExtractor";
import type { MapRequestParamsTransformer } from "./map-request-params-transformer/MapRequestParamsTransformer";
import type { VersionCompatibilityChecker } from "./version-compatibility-checker/VersionCompatibilityChecker";
import type { WmsVersionAdapter } from "./WmsVersionAdapter";

export class BaseWmsVersionAdapter implements WmsVersionAdapter {
  constructor(
    readonly version: string,
    private readonly capabilitiesRequestParamsTransformer: CapabilitiesRequestParamsTransformer,
    private readonly capabilitiesResponseDataExtractor: CapabilitiesResponseDataExtractor,
    private readonly mapRequestParamsTransformer: MapRequestParamsTransformer,
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
