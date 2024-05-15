import type {
  CapabilitiesRequestParams,
  FeatureInfoRequestParamsWithCustom,
  MapRequestParamsWithCustom,
} from "../client";
import type {
  UnifiedCapabilitiesResponse,
  CapabilitiesResponseDataExtractor,
} from "./capabilities-response-data-extractor";
import type { CapabilitiesRequestParamsTransformer } from "./capabilities-request-params-transformer";
import type { FeatureInfoRequestParamsTransformer } from "./feature-info-request-params-transformer";
import type { MapRequestParamsTransformer } from "./map-request-params-transformer";
import type { VersionCompatibilityChecker } from "./version-compatibility-checker";
import type { WmsVersionAdapter } from "./WmsVersionAdapter";

/**
 * Base WmsVersionAdapter implementing class.
 */
export class BaseWmsVersionAdapter implements WmsVersionAdapter {
  /**
   * BaseWmsVersionAdapter constructor.
   *
   * @param version
   * @param capabilitiesRequestParamsTransformer
   * @param capabilitiesResponseDataExtractor
   * @param mapRequestParamsTransformer
   * @param featureInfoRequestParamsTransformer
   * @param versionCompatibilityChecker
   */
  constructor(
    readonly version: string,
    private readonly capabilitiesRequestParamsTransformer: CapabilitiesRequestParamsTransformer,
    private readonly capabilitiesResponseDataExtractor: CapabilitiesResponseDataExtractor,
    private readonly mapRequestParamsTransformer: MapRequestParamsTransformer,
    private readonly featureInfoRequestParamsTransformer: FeatureInfoRequestParamsTransformer,
    private readonly versionCompatibilityChecker: VersionCompatibilityChecker
  ) {}

  /**
   * @inheritdoc
   */
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse {
    return this.capabilitiesResponseDataExtractor.extract(response);
  }

  /**
   * @inheritdoc
   */
  transformCapabilitiesRequestParams(
    params: CapabilitiesRequestParams
  ): object {
    return this.capabilitiesRequestParamsTransformer.transform(params);
  }

  /**
   * @inheritdoc
   */
  transformMapRequestParams(params: MapRequestParamsWithCustom): object {
    return this.mapRequestParamsTransformer.transform(params);
  }

  /**
   * @inheritdoc
   */
  transformFeatureInfoRequestParams(
    params: FeatureInfoRequestParamsWithCustom
  ): object {
    return this.featureInfoRequestParamsTransformer.transform(params);
  }

  /**
   * @inheritdoc
   */
  isCompatible(wmsVersion: string): boolean {
    return this.versionCompatibilityChecker.isCompatible(wmsVersion);
  }
}
