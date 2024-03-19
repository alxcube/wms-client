import type { CapabilitiesRequestParams } from "../../CapabilitiesRequestParams";
import type { WmsCapabilitiesRequestParamsTransformer } from "../BaseWmsVersionAdapter";

export const capabilitiesRequestParamsTransformer: WmsCapabilitiesRequestParamsTransformer =
  {
    transform(params: CapabilitiesRequestParams): object {
      return {
        service: "WMS",
        request: "GetCapabilities",
        version: "1.3.0",
        updateSequence: params.updateSequence,
      };
    },
  };
