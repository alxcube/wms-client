import type { WmsClient, WmsClientFactoryOptions } from "../client";

export interface WmsNegotiatorOptions extends WmsClientFactoryOptions {}
export interface WmsNegotiator {
  negotiate(wmsUrl: string, options?: WmsNegotiatorOptions): Promise<WmsClient>;
}
