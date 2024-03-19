import { DOMParser } from "@xmldom/xmldom";
import axios from "axios";
import { BaseWmsClient } from "./BaseWmsClient";
import type { QueryParamsSerializer } from "./query-params-serializer/QueryParamsSerializer";
import type { WmsVersionAdapterResolver } from "./version-adapter/WmsVersionAdapterResolver";
import type {
  WmsClientFactory,
  WmsClientFactoryOptions,
} from "./WmsClientFactory";

export class BaseWmsClientFactory implements WmsClientFactory {
  constructor(
    private readonly versionAdapterResolver: WmsVersionAdapterResolver,
    private readonly queryParamsSerializer: QueryParamsSerializer
  ) {}
  create(
    wmsUrl: string,
    wmsVersion: string,
    options: WmsClientFactoryOptions = {}
  ): BaseWmsClient {
    const versionAdapter = this.versionAdapterResolver.resolve(wmsVersion);
    const { httpClient = axios.create() } = options;
    const xmlParser = new DOMParser();

    return new BaseWmsClient(
      httpClient,
      this.queryParamsSerializer,
      xmlParser,
      versionAdapter,
      wmsUrl,
      options
    );
  }
}
