import { serviceContainer } from "./serviceContainer";
import type { WmsClient, WmsClientFactoryOptions } from "./client";

/**
 * Takes WMS base URL and WMS version, which should be one of registered WMS adapter versions, and returns `WmsClient`
 * interface.
 *
 * @param wmsUrl
 * @param wmsVersion
 * @param options
 */
export function createClient(
  wmsUrl: string,
  wmsVersion: string,
  options: WmsClientFactoryOptions = {}
): WmsClient {
  return serviceContainer
    .resolve("WmsClientFactory")
    .create(wmsUrl, wmsVersion, options);
}
