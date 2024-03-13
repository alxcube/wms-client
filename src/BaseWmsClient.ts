import { type AxiosInstance, isAxiosError } from "axios";
import xpath from "xpath";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import { WmsExceptionReport } from "./error/WmsExceptionReport";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";
import { inheritLayersData } from "./utils/inheritLayersData";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type { WmsClient, WmsClientOptions } from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  constructor(
    private readonly httpClient: AxiosInstance,
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
        const responseStr = String(error.response.data);
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
}
