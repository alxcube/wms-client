import { type AxiosInstance, type AxiosResponse } from "axios";
import type { QueryParamsSerializer } from "../query-params-serializer/QueryParamsSerializer";
import { mergeSearchParams } from "../utils/mergeSearchParams";
import type { UnifiedCapabilitiesResponse } from "../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";
import { inheritLayersData } from "../utils/inheritLayersData";
import type { WmsVersionAdapter } from "../version-adapter/WmsVersionAdapter";
import type { WmsXmlParser } from "../wms-xml-parser/WmsXmlParser";
import type { RequestErrorHandler } from "./RequestErrorHandler";
import type {
  CapabilitiesRequestParams,
  FeatureInfoRequestParamsWithCustom,
  MapRequestParamsWithCustom,
  WmsClient,
  WmsClientOptions,
} from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  private mapRequestUrl: string;
  private featureInfoRequestUrl: string;
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

  getVersion(): string {
    return this.versionAdapter.version;
  }

  getWmsUrl(): string {
    return this.wmsUrl;
  }

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

  getMapRequestUrl(): string {
    return this.mapRequestUrl;
  }

  setMapRequestUrl(url: string) {
    this.mapRequestUrl = url;
  }

  getMapUrl(params: MapRequestParamsWithCustom): string {
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformMapRequestParams(params),
    };
    return this.prepareUrl(this.mapRequestUrl, requestParams);
  }

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

  getFeatureInfoRequestUrl(): string {
    return this.featureInfoRequestUrl;
  }

  setFeatureInfoRequestUrl(url: string) {
    this.featureInfoRequestUrl = url;
  }

  getCustomQueryParams(): { [p: string]: unknown } {
    const { query = {} } = this.options;
    return { ...query };
  }

  getHttpClient(): AxiosInstance {
    return this.httpClient;
  }

  private checkForErrorGetMapResponse(response: AxiosResponse) {
    if (!this.isXmlResponse(response)) {
      return;
    }
    const responseString = this.getResponseString(response);
    // Parser will throw, if xml contains WMS exception.
    this.wmsXmlParser.parse(responseString);
  }

  private getResponseString(response: AxiosResponse): string {
    if (typeof response.data === "string") {
      return response.data;
    }
    if (response.data instanceof ArrayBuffer) {
      return this.textDecoder.decode(response.data);
    }
    throw new TypeError(`Unexpected response type`);
  }

  private isXmlResponse(response: AxiosResponse): boolean {
    return /(?:\b|_)xml(?:\b|_)/.test(response.headers["content-type"]);
  }

  private prepareUrl(baseUrl: string, query: object): string {
    const serializedParams = this.queryParamsSerializer.serialize(query);
    return mergeSearchParams(baseUrl, serializedParams);
  }
}
