import { serviceContainer } from "./serviceContainer";

import type { WmsClient } from "./WmsClient";
import type { WmsClientFactoryOptions } from "./WmsClientFactory";

export function createClient(
  wmsUrl: string,
  wmsVersion: string,
  options: WmsClientFactoryOptions = {}
): WmsClient {
  return serviceContainer
    .resolve("WmsClientFactory")
    .create(wmsUrl, wmsVersion, options);
}
