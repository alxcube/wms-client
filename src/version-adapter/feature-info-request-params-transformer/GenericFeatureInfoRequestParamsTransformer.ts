import type { FeatureInfoRequestParamsWithCustom } from "../../client";
import type { VersionComparator } from "../../version-comparator";
import type { MapRequestParamsTransformer } from "../map-request-params-transformer";
import type { FeatureInfoRequestParamsTransformer } from "./FeatureInfoRequestParamsTransformer";

/**
 * Generic implementation of FeatureInfoRequestParamsTransformer.
 */
export class GenericFeatureInfoRequestParamsTransformer
  implements FeatureInfoRequestParamsTransformer
{
  /**
   * GenericFeatureInfoRequestParamsTransformer constructor.
   *
   * @param mapRequestParamsTransformer
   * @param versionComparator
   * @param version
   */
  constructor(
    private readonly mapRequestParamsTransformer: MapRequestParamsTransformer,
    private readonly versionComparator: VersionComparator,
    private readonly version: string
  ) {}

  /**
   * @inheritdoc
   */
  transform(params: FeatureInfoRequestParamsWithCustom): object {
    const result = this.mapRequestParamsTransformer.transform(params) as {
      [key: string]: string;
    };
    result.request = this.isV1_0() ? "feature_info" : "GetFeatureInfo";
    if (this.isV1_3()) {
      result.i = String(params.x);
      result.j = String(params.y);
      if ("x" in result) {
        delete result.x;
      }
      if ("y" in result) {
        delete result.y;
      }
    } else {
      result.x = String(params.x);
      result.y = String(params.y);
    }
    delete result.queryLayers;
    result.query_layers = params.queryLayers.join(",");
    delete result.infoFormat;
    result.info_format = params.infoFormat;
    return result;
  }

  /**
   * Returns true if working with WMS version v1.3.x.
   * @private
   */
  private isV1_3(): boolean {
    return this.versionComparator.is(this.version, ">=", "1.3");
  }

  /**
   * Returns true if working with WMS version v1.0.x.
   * @private
   */
  private isV1_0(): boolean {
    return (
      this.versionComparator.is(this.version, ">=", "1") &&
      this.versionComparator.is(this.version, "<", "1.1")
    );
  }
}
