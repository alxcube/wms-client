import { type AxiosInstance, type AxiosResponse } from "axios";
import type { QueryParamsSerializer } from "../query-params-serializer";
import { mergeSearchParams, inheritLayersData } from "../utils";
import type {
  UnifiedCapabilitiesResponse,
  WmsVersionAdapter,
} from "../version-adapter";
import type { WmsXmlParser } from "../wms-xml-parser";
import type { RequestErrorHandler } from "./RequestErrorHandler";
import type {
  CapabilitiesRequestParams,
  FeatureInfoRequestParamsWithCustom,
  MapRequestParamsWithCustom,
  WmsClient,
  WmsClientOptions,
} from "./WmsClient";

/**
 * Base WmsClient class.
 */
export class BaseWmsClient implements WmsClient {
  /**
   * Base url for GetMap WMS request.
   *
   * @private
   */
  private mapRequestUrl: string;

  /**
   * Base url for GetFeatureInfo WMS request.
   * @private
   */
  private featureInfoRequestUrl: string;

  /**
   * BaseWmsClient constructor.
   *
   * @param httpClient
   * @param queryParamsSerializer
   * @param wmsXmlParser
   * @param versionAdapter
   * @param requestErrorHandler
   * @param textDecoder
   * @param wmsUrl
   * @param options
   */
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly queryParamsSerializer: QueryParamsSerializer,
    private readonly wmsXmlParser: WmsXmlParser,
    private readonly versionAdapter: WmsVersionAdapter,
    private readonly requestErrorHandler: RequestErrorHandler,
    private readonly textDecoder: TextDecoder,
    private readonly wmsUrl: string,
    private readonly options: WmsClientOptions = {}
  ) {
    this.mapRequestUrl = options.mapRequestUrl || wmsUrl;
    this.featureInfoRequestUrl = options.featureInfoRequestUrl || wmsUrl;
  }

  /**
   * @inheritdoc
   */
  getVersion(): string {
    return this.versionAdapter.version;
  }

  /**
   * @inheritdoc
   */
  getWmsUrl(): string {
    return this.wmsUrl;
  }

  /**
   * @inheritdoc
   */
  async getCapabilities(
    params: CapabilitiesRequestParams = {}
  ): Promise<UnifiedCapabilitiesResponse> {
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformCapabilitiesRequestParams(params),
    };
    const url = this.prepareUrl(this.wmsUrl, requestParams);
    let response: AxiosResponse<string>;
    try {
      response = await this.httpClient.get(url.toString(), {
        responseType: "text",
      });
    } catch (e) {
      this.requestErrorHandler.handleRequestError(e);
    }

    const doc = this.wmsXmlParser.parse(response.data);
    const capabilities =
      this.versionAdapter.extractCapabilitiesResponseData(doc);

    inheritLayersData(capabilities.capability.layers);

    return capabilities;
  }

  /**
   * @inheritdoc
   */
  async getMap(params: MapRequestParamsWithCustom): Promise<ArrayBuffer> {
    const url = this.getMapUrl(params);
    let response: AxiosResponse<ArrayBuffer>;
    try {
      response = await this.httpClient.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      });
    } catch (e) {
      this.requestErrorHandler.handleRequestError(e);
    }

    this.checkForErrorGetMapResponse(response);

    return response.data;
  }

  /**
   * @inheritdoc
   */
  getMapRequestUrl(): string {
    return this.mapRequestUrl;
  }

  /**
   * @inheritdoc
   */
  setMapRequestUrl(url: string) {
    this.mapRequestUrl = url;
  }

  /**
   * @inheritdoc
   */
  getMapUrl(params: MapRequestParamsWithCustom): string {
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformMapRequestParams(params),
    };
    return this.prepareUrl(this.mapRequestUrl, requestParams);
  }

  /**
   * @inheritdoc
   */
  async getFeatureInfo(
    params: FeatureInfoRequestParamsWithCustom
  ): Promise<string> {
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformFeatureInfoRequestParams(params),
    };
    const url = this.prepareUrl(this.featureInfoRequestUrl, requestParams);
    let response: AxiosResponse<string>;
    try {
      response = await this.httpClient.get<string>(url, {
        responseType: "text",
      });
    } catch (e) {
      this.requestErrorHandler.handleRequestError(e);
    }

    if (this.isXmlResponse(response)) {
      // Parser will check error xml and throw if error xml is found
      this.wmsXmlParser.parse(response.data);
    }
    return response.data;
  }

  /**
   * @inheritdoc
   */
  getFeatureInfoRequestUrl(): string {
    return this.featureInfoRequestUrl;
  }

  /**
   * @inheritdoc
   */
  setFeatureInfoRequestUrl(url: string) {
    this.featureInfoRequestUrl = url;
  }

  /**
   * @inheritdoc
   */
  getCustomQueryParams(): { [p: string]: unknown } {
    const { query = {} } = this.options;
    return { ...query };
  }

  /**
   * @inheritdoc
   */
  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  /**
   * Checks response of GetMap request for WMS exception XML.
   *
   * @param response
   * @private
   */
  private checkForErrorGetMapResponse(response: AxiosResponse) {
    if (!this.isXmlResponse(response)) {
      return;
    }
    const responseString = this.getResponseString(response);
    // Parser will throw, if xml contains WMS exception.
    this.wmsXmlParser.parse(responseString);
  }

  /**
   * Returns http response body as string if response body is either string or ArrayBuffer.
   *
   * @param response
   * @private
   */
  private getResponseString(response: AxiosResponse): string {
    if (typeof response.data === "string") {
      return response.data;
    }
    if (response.data instanceof ArrayBuffer) {
      return this.textDecoder.decode(response.data);
    }
    throw new TypeError(`Unexpected response type`);
  }

  /**
   * Detects if response is xml, based on Content-Type header.
   *
   * @param response
   * @private
   */
  private isXmlResponse(response: AxiosResponse): boolean {
    return /(?:\b|_)xml(?:\b|_)/.test(response.headers["content-type"]);
  }

  /**
   * Prepares url for request, using base url and query string params.
   *
   * @param baseUrl
   * @param query
   * @private
   */
  private prepareUrl(baseUrl: string, query: object): string {
    const serializedParams = this.queryParamsSerializer.serialize(query);
    return mergeSearchParams(baseUrl, serializedParams);
  }
}
