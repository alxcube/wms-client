import { type AxiosInstance, isAxiosError } from "axios";
import type { CapabilitiesRequestParams } from "./CapabilitiesRequestParams";
import type { UnifiedCapabilitiesResponse } from "./UnifiedCapabilitiesResponse";
import { inheritLayersData } from "./utils/inheritLayersData";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type { WmsClient } from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  constructor(
    private readonly httpClient: AxiosInstance,
    private readonly xmlParser: DOMParser,
    private readonly versionAdapter: WmsVersionAdapter,
    private readonly wmsUrl: string
  ) {}

  getVersion(): string {
    return this.versionAdapter.version;
  }

  async getCapabilities(
    params: CapabilitiesRequestParams = {}
  ): Promise<UnifiedCapabilitiesResponse> {
    const requestParams =
      this.versionAdapter.transformCapabilitiesRequestParams(params);

    try {
      const { data } = await this.httpClient.get(this.wmsUrl, {
        params: requestParams,
        responseType: "text",
      });

      const doc = this.xmlParser.parseFromString(data, "text/xml");

      const capabilities =
        this.versionAdapter.extractCapabilitiesResponseData(doc);

      inheritLayersData(capabilities.capability.layers);

      return capabilities;
    } catch (e) {
      if (isAxiosError(e)) {
        // todo
      }
      throw e;
    }
  }
}
