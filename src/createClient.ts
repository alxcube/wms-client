import { serviceContainer } from "./serviceContainer";

import type { WmsClient, WmsClientFactoryOptions } from "./client";

export function createClient(
  wmsUrl: string,
  wmsVersion: string,
  options: WmsClientFactoryOptions = {}
): WmsClient {
  return serviceContainer
    .resolve("WmsClientFactory")
    .create(wmsUrl, wmsVersion, options);
}
