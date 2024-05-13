import type { CapabilitiesRequestParams } from "../../client";

/**
 * GetCapabilities WMS request params transformer.
 */
export interface CapabilitiesRequestParamsTransformer {
  /**
   * Transforms CapabilitiesRequestParams interface into params object, acceptable by concrete WMS version.
   *
   * @param params
   */
  transform(params: CapabilitiesRequestParams): object;
}
