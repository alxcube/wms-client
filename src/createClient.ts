import { serviceContainer } from "./serviceContainer";

import type { WmsClient } from "./client/WmsClient";
import type { WmsClientFactoryOptions } from "./client/WmsClientFactory";

export function createClient(
  wmsUrl: string,
  wmsVersion: string,
  options: WmsClientFactoryOptions = {}
): WmsClient {
  return serviceContainer
    .resolve("WmsClientFactory")
    .create(wmsUrl, wmsVersion, options);
}
