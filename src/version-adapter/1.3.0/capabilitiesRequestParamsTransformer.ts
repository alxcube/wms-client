import type { CapabilitiesRequestParams } from "../../CapabilitiesRequestParams";
import type { WmsCapabilitiesRequestParamsTransformer } from "../BaseWmsVersionAdapter";

export const capabilitiesRequestParamsTransformer: WmsCapabilitiesRequestParamsTransformer =
  {
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
      transformedParams.version = "1.3.0";
      return transformedParams;
    },
  };
