import { type AxiosInstance } from "axios";
import type { CapabilitiesRequestParams } from "./request/get-capabilities/CapabilitiesRequestParams";
import type { UnifiedCapabilitiesResponse } from "./request/get-capabilities/UnifiedCapabilitiesResponse";
import type { WmsVersionAdapter } from "./version-adapter/WmsVersionAdapter";
import type { WmsClient } from "./WmsClient";
export class BaseWmsClient implements WmsClient {
  constructor(
    private readonly httpClient: AxiosInstance,
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
      this.versionAdapter.capabilitiesRequestParamsTransformer.transform(
        params
      );

    const { data } = await this.httpClient.get(this.wmsUrl, {
      params: requestParams,
      responseType: "text",
    });

    return this.versionAdapter.capabilitiesResponseParser.parse(data);
  }
}
