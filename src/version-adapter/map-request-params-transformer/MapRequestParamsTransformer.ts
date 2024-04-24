import type { MapRequestParamsWithCustom } from "../../client";

export interface MapRequestParamsTransformer {
  transform(params: MapRequestParamsWithCustom): object;
}
