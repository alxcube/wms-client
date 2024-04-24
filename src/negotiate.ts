import { serviceContainer } from "./serviceContainer";
import type { WmsClient } from "./client";
import type { WmsNegotiatorOptions } from "./negotiator";

export async function negotiate(
  wmsUrl: string,
  options: WmsNegotiatorOptions = {}
): Promise<WmsClient> {
  const negotiator = serviceContainer.resolve("WmsNegotiator");
  return await negotiator.negotiate(wmsUrl, options);
}
