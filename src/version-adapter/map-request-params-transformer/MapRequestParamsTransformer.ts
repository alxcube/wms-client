import type { MapRequestParams } from "../../client/WmsClient";

export interface MapRequestParamsTransformer {
  transform(params: MapRequestParams): object;
}
