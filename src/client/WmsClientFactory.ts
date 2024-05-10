import type { AxiosInstance } from "axios";
import type { WmsClient, WmsClientOptions } from "./WmsClient";

/**
 * WmsClientFactory options.
 */
export interface WmsClientFactoryOptions extends WmsClientOptions {
  /**
   * Axios instance to be used in WMS communication. An instance with configured interceptors (e.g. for caching) can
   * be passed. If this option is not set, fresh Axios instance will be created for client using `axios.create()`.
   */
  httpClient?: AxiosInstance;
}

/**
 * WmsClient factory.
 */
export interface WmsClientFactory {
  /**
   * Returns instance of WmsClient.
   *
   * @param wmsUrl
   * @param wmsVersion
   * @param options
   */
  create(
    wmsUrl: string,
    wmsVersion: string,
    options?: WmsClientFactoryOptions
  ): WmsClient;
}
