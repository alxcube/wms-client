import type { AxiosInstance } from "axios";
import type { WmsClient, WmsClientOptions } from "./WmsClient";

export interface WmsClientFactoryOptions extends WmsClientOptions {
  httpClient?: AxiosInstance;
}

export interface WmsClientFactory {
  create(
    wmsUrl: string,
    wmsVersion: string,
    options?: WmsClientFactoryOptions
  ): WmsClient;
}
