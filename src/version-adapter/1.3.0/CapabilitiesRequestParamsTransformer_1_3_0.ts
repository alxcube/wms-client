import type { CapabilitiesRequestParams } from "../../request/get-capabilities/CapabilitiesRequestParams";
import type { CapabilitiesRequestParamsTransformer } from "../CapabilitiesRequestParamsTransformer";

export class CapabilitiesRequestParamsTransformer_1_3_0
  implements CapabilitiesRequestParamsTransformer
{
  transform(params: CapabilitiesRequestParams): object {
    return {
      ...params,
      service: "WMS",
      request: "GetCapabilities",
      version: "1.3.0",
    };
  }
}
