import { type AxiosInstance, type AxiosResponse, isAxiosError } from "axios";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import type { ExceptionXmlChecker } from "../error/ExceptionXmlChecker";
import type { MapRequestParams } from "./MapRequestParams";
import type { QueryParamsSerializer } from "../query-params-serializer/QueryParamsSerializer";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";
import { inheritLayersData } from "../utils/inheritLayersData";
import type { WmsVersionAdapter } from "../version-adapter/WmsVersionAdapter";
import type { WmsClient, WmsClientOptions } from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly queryParamsSerializer: QueryParamsSerializer,
    private readonly xmlParser: DOMParser,
    private readonly versionAdapter: WmsVersionAdapter,
    private readonly exceptionXmlChecker: ExceptionXmlChecker,
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

    try {
      const { data } = await this.httpClient.get(this.wmsUrl, {
        params: requestParams,
        responseType: "text",
      });

      const doc = this.parseXml(data);
      this.checkForErrorXml(doc);

      const capabilities =
        this.versionAdapter.extractCapabilitiesResponseData(doc);

      inheritLayersData(capabilities.capability.layers);

      return capabilities;
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  async getMap(params: MapRequestParams): Promise<ArrayBuffer> {
    const url = this.getMapUrl(params);
    let response: AxiosResponse<ArrayBuffer>;
    try {
      response = await this.httpClient.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      });
    } catch (e) {
      this.handleErrorResponse(e);
    }

    this.checkForErrorResponse(response);

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

  private parseXml(xml: string): Document {
    return this.xmlParser.parseFromString(xml, "text/xml");
  }

  private checkForErrorResponse(response: AxiosResponse) {
    if (!this.isXmlResponse(response)) {
      return;
    }
    const responseString = this.getResponseString(response);
    const responseDoc = this.parseXml(responseString);
    this.checkForErrorXml(responseDoc);
  }

  private checkForErrorXml(doc: Document) {
    this.exceptionXmlChecker.check(doc);
  }

  private handleErrorResponse(error: Error | unknown): never {
    if (isAxiosError(error)) {
      if (error.response) {
        const responseStr = this.getResponseString(error.response);
        if (this.isXmlResponse(error.response)) {
          // Try to get error xml
          let errorDoc: Document;
          try {
            errorDoc = this.parseXml(responseStr);
          } catch (e) {
            throw new Error(`Unexpected WMS response: ${responseStr}`);
          }
          this.checkForErrorXml(errorDoc);
        }
      }
    }

    throw error;
  }

  private getResponseString(response: AxiosResponse): string {
    if (typeof response.data === "string") {
      return response.data;
    }
    if (response.data instanceof ArrayBuffer) {
      const decoder = new TextDecoder();
      return decoder.decode(response.data);
    }
    throw new TypeError(`Unexpected response type`);
  }

  private isXmlResponse(response: AxiosResponse): boolean {
    return /(?:\b|_)xml(?:\b|_)/.test(response.headers["content-type"]);
  }
}
