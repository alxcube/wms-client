import type { WmsClient } from "../client/WmsClient";
import type { WmsClientFactoryOptions } from "../client/WmsClientFactory";

export interface WmsNegotiatorOptions extends WmsClientFactoryOptions {}
export interface WmsNegotiator {
  negotiate(wmsUrl: string, options?: WmsNegotiatorOptions): Promise<WmsClient>;
}
