import type {
  CapabilitiesRequestParams,
  FeatureInfoRequestParamsWithCustom,
  MapRequestParamsWithCustom,
} from "../client";
import type { UnifiedCapabilitiesResponse } from "./capabilities-response-data-extractor";

/**
 * Adapter interface for communication with different WMS versions.
 */
export interface WmsVersionAdapter {
  /**
   * Concrete WMS version implementation, supported by adapter.
   */
  readonly version: string;

  /**
   * Transforms `CapabilitiesRequestParams` interface to params object, understandable by particular WMS version.
   *
   * @param params
   */
  transformCapabilitiesRequestParams(params: CapabilitiesRequestParams): object;

  /**
   * Extracts `UnifiedCapabilitiesResponse` interface object with WMS metadata from given "GetCapabilities" XML
   * response document.
   *
   * @param response
   */
  extractCapabilitiesResponseData(
    response: Document
  ): UnifiedCapabilitiesResponse;

  /**
   * Transforms `MapRequestParamsWithCustom` interface to params object, understandable by particular WMS version.
   *
   * @param params
   */
  transformMapRequestParams(params: MapRequestParamsWithCustom): object;

  /**
   * Transforms `FeatureInfoRequestParamsWithCustom` interface to params object, understandable by particular WMS
   * version.
   *
   * @param params
   */
  transformFeatureInfoRequestParams(
    params: FeatureInfoRequestParamsWithCustom
  ): object;

  /**
   * Returns true, if adapter is compatible with given WMS version, and false otherwise.
   *
   * @param wmsVersion
   */
  isCompatible(wmsVersion: string): boolean;
}
