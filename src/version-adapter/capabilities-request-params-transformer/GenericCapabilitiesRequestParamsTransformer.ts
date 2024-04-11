import type { CapabilitiesRequestParams } from "../../client/WmsClient";

import type { CapabilitiesRequestParamsTransformer } from "./CapabilitiesRequestParamsTransformer";

export class GenericCapabilitiesRequestParamsTransformer
  implements CapabilitiesRequestParamsTransformer
{
  constructor(private readonly version: string) {}
  transform(params: CapabilitiesRequestParams): object {
    const transformedParams: { [key: string]: unknown } = {};
    Object.keys(params).forEach((key: keyof CapabilitiesRequestParams) => {
      switch (key) {
        case "updateSequence":
          transformedParams.updatesequence = params[key];
          break;
        default:
          transformedParams[key] = params[key];
          break;
      }
    });
    transformedParams.service = "WMS";
    transformedParams.request = "GetCapabilities";
    transformedParams.version = this.version;
    return transformedParams;
  }
}
