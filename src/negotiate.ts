import { serviceContainer } from "./serviceContainer";
import type { WmsClient } from "./client";
import type { WmsNegotiatorOptions } from "./negotiator";

/**
 * Takes WMS base URL and returns Promise, which will be resolved with `WmsClient` interface of compatible version.
 * If no compatible version is found, the promise will be rejected.
 *
 * @param wmsUrl
 * @param options
 */
export async function negotiate(
  wmsUrl: string,
  options: WmsNegotiatorOptions = {}
): Promise<WmsClient> {
  const negotiator = serviceContainer.resolve("WmsNegotiator");
  return await negotiator.negotiate(wmsUrl, options);
}
