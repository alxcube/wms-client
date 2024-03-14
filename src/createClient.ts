import axios, { type AxiosInstance } from "axios";
import { BaseWmsClient } from "./BaseWmsClient";
import { BaseQueryParamsSerializer } from "./query-params-serializer/BaseQueryParamsSerializer";
import { versionAdapterFactoriesPool } from "./version-adapter/versionAdapterFactoriesPool";

import { DOMParser } from "@xmldom/xmldom";
import type { WmsClientOptions } from "./WmsClient";

export interface CreateClientOptions extends WmsClientOptions {
  httpClient?: AxiosInstance;
}
export function createClient(
  wmsUrl: string,
  wmsVersion: string,
  options: CreateClientOptions = {}
): BaseWmsClient {
  const versionAdapterFactory = versionAdapterFactoriesPool.get(wmsVersion);
  if (!versionAdapterFactory) {
    throw new RangeError(`No adapter for version "${wmsVersion} was found"`);
  }
  const versionAdapter = versionAdapterFactory();
  const { httpClient = axios.create() } = options;
  const xmlParser = new DOMParser();
  const queryParamsSerializer = new BaseQueryParamsSerializer();

  return new BaseWmsClient(
    httpClient,
    queryParamsSerializer,
    xmlParser,
    versionAdapter,
    wmsUrl,
    options
  );
}
