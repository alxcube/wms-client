import { type AxiosInstance, type AxiosResponse, isAxiosError } from "axios";
import xpath from "xpath";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import { WmsExceptionReport } from "./error/WmsExceptionReport";
import type { MapRequestParams } from "./MapRequestParams";
import type { QueryParamsSerializer } from "./query-params-serializer/QueryParamsSerializer";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";
import { inheritLayersData } from "./utils/inheritLayersData";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type {
  GetMapOptions,
  GetMapUrlOptions,
  WmsClient,
  WmsClientOptions,
} from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly queryParamsSerializer: QueryParamsSerializer,
    private readonly xmlParser: DOMParser,
    private readonly versionAdapter: WmsVersionAdapter,
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
      this.checkForErrorResponse(doc);

      const capabilities =
        this.versionAdapter.extractCapabilitiesResponseData(doc);

      inheritLayersData(capabilities.capability.layers);

      return capabilities;
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  async getMap(
    params: MapRequestParams,
    options: GetMapOptions = {}
  ): Promise<ArrayBuffer> {
    const url = this.getMapUrl(params, options);
    try {
      const response = await this.httpClient.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      });
      return response.data;
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  getMapUrl(params: MapRequestParams, options: GetMapUrlOptions = {}): string {
    const { flipAxes } = options;
    const requestParams = {
      ...this.getCustomQueryParams(),
      ...this.versionAdapter.transformMapRequestParams(params, { flipAxes }),
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

  private checkForErrorResponse(doc: Document) {
    const rootNode = xpath.select1("/*", doc) as Node;
    if (/exception/i.test(rootNode.nodeName)) {
      const wmsExceptions = this.versionAdapter.extractErrors(doc);
      if (wmsExceptions.length === 1) {
        throw wmsExceptions[0];
      } else {
        throw new WmsExceptionReport(wmsExceptions);
      }
    }
  }

  private handleErrorResponse(error: Error | unknown): never {
    if (isAxiosError(error)) {
      if (error.response) {
        const responseStr = this.getResponseString(error.response);
        if (responseStr.length) {
          // Try to get error xml
          let errorDoc: Document;
          try {
            errorDoc = this.parseXml(responseStr);
          } catch (e) {
            throw new Error(`Unexpected WMS response: ${responseStr}`);
          }
          this.checkForErrorResponse(errorDoc);
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
}
