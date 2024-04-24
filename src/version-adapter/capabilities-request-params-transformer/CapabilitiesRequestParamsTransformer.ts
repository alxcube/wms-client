import type { CapabilitiesRequestParams } from "../../client";

export interface CapabilitiesRequestParamsTransformer {
  transform(params: CapabilitiesRequestParams): object;
}
