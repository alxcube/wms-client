import type { FeatureInfoRequestParamsWithCustom } from "../../client/WmsClient";
import type { VersionComparator } from "../../version-comparator/VersionComparator";
import type { MapRequestParamsTransformer } from "../map-request-params-transformer/MapRequestParamsTransformer";
import type { FeatureInfoRequestParamsTransformer } from "./FeatureInfoRequestParamsTransformer";

export class GenericFeatureInfoRequestParamsTransformer
  implements FeatureInfoRequestParamsTransformer
{
  constructor(
    private readonly mapRequestParamsTransformer: MapRequestParamsTransformer,
    private readonly versionComparator: VersionComparator,
    private readonly version: string
  ) {}
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

  private isV1_3(): boolean {
    return this.versionComparator.is(this.version, ">=", "1.3");
  }

  private isV1_0(): boolean {
    return (
      this.versionComparator.is(this.version, ">=", "1") &&
      this.versionComparator.is(this.version, "<", "1.1")
    );
  }
}