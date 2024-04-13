import { type AxiosInstance, type AxiosResponse } from "axios";
import type { QueryParamsSerializer } from "../query-params-serializer/QueryParamsSerializer";
import type { UnifiedCapabilitiesResponse } from "../wms-data-types/get-capabilities-response/UnifiedCapabilitiesResponse";
import { inheritLayersData } from "../utils/inheritLayersData";
import type { WmsVersionAdapter } from "../version-adapter/WmsVersionAdapter";
import type { WmsXmlParser } from "../wms-xml-parser/WmsXmlParser";
import type { RequestErrorHandler } from "./RequestErrorHandler";
import type {
  CapabilitiesRequestParams,
  MapRequestParams,
  WmsClient,
  WmsClientOptions,
} from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly queryParamsSerializer: QueryParamsSerializer,
    private readonly wmsXmlParser: WmsXmlParser,
    private readonly versionAdapter: WmsVersionAdapter,
    private readonly requestErrorHandler: RequestErrorHandler,
    private readonly textDecoder: TextDecoder,
    private readonly wmsUrl: string,
    private readonly options: WmsClientOptions = {}
  ) {}

  getVersion(): string {
    return this.versionAdapter.version;
  }

  async getCapabilities(
    params: CapabilitiesRequestParams = {}
  ): Promise<UnifiedCapabilitiesResponse> {
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformCapabilitiesRequestParams(params),
    };

    let response: AxiosResponse<string>;
    try {
      response = await this.httpClient.get(this.wmsUrl, {
        params: requestParams,
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

  async getMap(params: MapRequestParams): Promise<ArrayBuffer> {
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

  getMapUrl(params: MapRequestParams): string {
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformMapRequestParams(params),
    };
    const query = this.queryParamsSerializer.serialize(requestParams);

    if (this.wmsUrl.indexOf("?") !== -1) {
      return this.wmsUrl.endsWith("?")
        ? `${this.wmsUrl}${query}`
        : `${this.wmsUrl}&${query}`;
    }

    return `${this.wmsUrl}?${query}`;
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
}
