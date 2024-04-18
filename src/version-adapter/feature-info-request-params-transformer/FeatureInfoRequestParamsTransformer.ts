import type { FeatureInfoRequestParamsWithCustom } from "../../client/WmsClient";

export interface FeatureInfoRequestParamsTransformer {
  transform(params: FeatureInfoRequestParamsWithCustom): object;
}
