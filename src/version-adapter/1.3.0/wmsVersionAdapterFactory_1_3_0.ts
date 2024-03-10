import { CapabilitiesRequestParamsTransformer_1_3_0 } from "./CapabilitiesRequestParamsTransformer_1_3_0";
import { CapabilitiesResponseParser_1_3_0 } from "./CapabilitiesResponseParser_1_3_0";

export function wmsVersionAdapterFactory_1_3_0() {
  return {
    version: "1.3.0",
    capabilitiesRequestParamsTransformer:
      new CapabilitiesRequestParamsTransformer_1_3_0(),
    capabilitiesResponseParser: new CapabilitiesResponseParser_1_3_0(),
  };
}
