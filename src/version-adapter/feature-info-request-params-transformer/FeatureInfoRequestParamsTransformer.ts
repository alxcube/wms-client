import type { FeatureInfoRequestParamsWithCustom } from "../../client";

/**
 * GetFeatureInfo WMS request params transformer.
 */
export interface FeatureInfoRequestParamsTransformer {
  /**
   * Transforms `FeatureInfoRequestParamsWithCustom` interface into params object, acceptable by concrete WMS version.
   *
   * @param params
   */
  transform(params: FeatureInfoRequestParamsWithCustom): object;
}
