import axios from "axios";
import { BaseWmsClient } from "./BaseWmsClient";
import { versionAdapterFactoriesPool } from "./version-adapter/versionAdapterFactoriesPool";
import type { WmsClient } from "./WmsClient";
import { DOMParser } from "@xmldom/xmldom";

export function createClient(wmsUrl: string, wmsVersion: string): WmsClient {
  const versionAdapterFactory = versionAdapterFactoriesPool.get(wmsVersion);
  if (!versionAdapterFactory) {
    throw new RangeError(`No adapter for version "${wmsVersion} was found"`);
  }
  const versionAdapter = versionAdapterFactory();

  const httpClient = axios.create();

  const xmlParser = new DOMParser();

  return new BaseWmsClient(httpClient, xmlParser, versionAdapter, wmsUrl);
}
