import type { WmsClient, WmsClientFactoryOptions } from "../client";

/**
 * WmsNegotiator options.
 */
export interface WmsNegotiatorOptions extends WmsClientFactoryOptions {}

/**
 * WMS negotiator.
 */
export interface WmsNegotiator {
  /**
   * Performs version negotiation with given WMS server. Returns promise, which fulfills with `WmsClient` interface,
   * if negotiation succeeds. If negotiation fails, returned promise will be rejected.
   *
   * @param wmsUrl
   * @param options
   */
  negotiate(wmsUrl: string, options?: WmsNegotiatorOptions): Promise<WmsClient>;
}
