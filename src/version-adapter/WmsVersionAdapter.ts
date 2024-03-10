import type { CapabilitiesRequestParamsTransformer } from "./CapabilitiesRequestParamsTransformer";
import type { CapabilitiesResponseParser } from "./CapabilitiesResponseParser";

export interface WmsVersionAdapter {
  version: string;
  capabilitiesRequestParamsTransformer: CapabilitiesRequestParamsTransformer;
  capabilitiesResponseParser: CapabilitiesResponseParser;
}
