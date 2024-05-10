import axios from "axios";
import type { WmsXmlParser } from "../wms-xml-parser";
import { BaseWmsClient } from "./BaseWmsClient";
import type { QueryParamsSerializer } from "../query-params-serializer";
import type { WmsVersionAdapterResolver } from "../version-adapter";
import type { RequestErrorHandler } from "./RequestErrorHandler";
import type {
  WmsClientFactory,
  WmsClientFactoryOptions,
} from "./WmsClientFactory";

/**
 * Base WmsClientFactory class.
 */
export class BaseWmsClientFactory implements WmsClientFactory {
  /**
   * BaseWmsClientFactory constructor.
   *
   * @param versionAdapterResolver
   * @param queryParamsSerializer
   * @param wmsXmlParser
   * @param requestErrorHandler
   * @param textDecoder
   */
  constructor(
    private readonly versionAdapterResolver: WmsVersionAdapterResolver,
    private readonly queryParamsSerializer: QueryParamsSerializer,
    private readonly wmsXmlParser: WmsXmlParser,
    private readonly requestErrorHandler: RequestErrorHandler,
    private readonly textDecoder: TextDecoder
  ) {}

  /**
   * @inheritdoc
   */
  create(
    wmsUrl: string,
    wmsVersion: string,
    options: WmsClientFactoryOptions = {}
  ): BaseWmsClient {
    const versionAdapter = this.versionAdapterResolver.resolve(wmsVersion);
    const { httpClient = axios.create() } = options;

    return new BaseWmsClient(
      httpClient,
      this.queryParamsSerializer,
      this.wmsXmlParser,
      versionAdapter,
      this.requestErrorHandler,
      this.textDecoder,
      wmsUrl,
      options
    );
  }
}
