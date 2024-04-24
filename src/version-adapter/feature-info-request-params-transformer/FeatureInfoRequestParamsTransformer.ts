import type { FeatureInfoRequestParamsWithCustom } from "../../client";

export interface FeatureInfoRequestParamsTransformer {
  transform(params: FeatureInfoRequestParamsWithCustom): object;
}
