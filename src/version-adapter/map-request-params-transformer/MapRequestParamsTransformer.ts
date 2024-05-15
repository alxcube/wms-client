import type { MapRequestParamsWithCustom } from "../../client";

/**
 * GetMap WMS request params transformer.
 */
export interface MapRequestParamsTransformer {
  /**
   * Transforms `MapRequestParamsWithCustom` interface into params object, acceptable by concrete WMS version.
   *
   * @param params
   */
  transform(params: MapRequestParamsWithCustom): object;
}
