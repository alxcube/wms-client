import type { CapabilitiesRequestParams } from "../request/get-capabilities/CapabilitiesRequestParams";

export interface CapabilitiesRequestParamsTransformer {
  transform(params: CapabilitiesRequestParams): object;
}
