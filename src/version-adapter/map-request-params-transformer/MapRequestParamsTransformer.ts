import type { MapRequestParamsWithCustom } from "../../client/WmsClient";

export interface MapRequestParamsTransformer {
  transform(params: MapRequestParamsWithCustom): object;
}
