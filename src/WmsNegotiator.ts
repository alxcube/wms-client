import type { WmsClient } from "./WmsClient";
import type { WmsClientFactoryOptions } from "./WmsClientFactory";

export interface WmsNegotiatorOptions extends WmsClientFactoryOptions {}
export interface WmsNegotiator {
  negotiate(wmsUrl: string, options?: WmsNegotiatorOptions): Promise<WmsClient>;
}
