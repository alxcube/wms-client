import type { CapabilitiesRequestParams } from "../../client/WmsClient";

export interface CapabilitiesRequestParamsTransformer {
  transform(params: CapabilitiesRequestParams): object;
}
