import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { RequestErrorHandler } from "../client/RequestErrorHandler";
import type { WmsVersionAdapterResolver } from "../version-adapter/version-adapter-resolver/WmsVersionAdapterResolver";
import type { WmsClient } from "../client/WmsClient";
import type { WmsClientFactory } from "../client/WmsClientFactory";
import type { WmsVersionAdapter } from "../version-adapter/WmsVersionAdapter";
import type { WmsXmlParser } from "../wms-xml-parser/WmsXmlParser";
import type { WmsNegotiator, WmsNegotiatorOptions } from "./WmsNegotiator";
import type { XmlResponseVersionExtractor } from "../xml-response-version-extractor/XmlResponseVersionExtractor";

interface NegotiationOutcome {
  adapter: WmsVersionAdapter;
  responseDoc: Document;
}

export class BaseWmsNegotiator implements WmsNegotiator {
  constructor(
    private readonly wmsXmlParser: WmsXmlParser,
    private readonly xmlResponseVersionExtractor: XmlResponseVersionExtractor,
    private readonly wmsClientFactory: WmsClientFactory,
    private readonly versionAdapterResolver: WmsVersionAdapterResolver,
    private readonly requestErrorHandler: RequestErrorHandler
  ) {}
  async negotiate(
    wmsUrl: string,
    options: WmsNegotiatorOptions = {}
  ): Promise<WmsClient> {
    const { httpClient = axios.create() } = options;
    const { adapter } = await this.getNegotiationOutcome(wmsUrl, httpClient);

    // Use same http client in wms client
    options.httpClient = httpClient;
    return this.wmsClientFactory.create(wmsUrl, adapter.version, options);
  }

  private async getNegotiationOutcome(
    wmsUrl: string,
    httpClient: AxiosInstance
  ): Promise<NegotiationOutcome> {
    let adapter: WmsVersionAdapter | undefined =
      this.versionAdapterResolver.getHighest();
    const serverVersions: string[] = [];

    while (adapter) {
      const responseDoc = await this.getWmsServerCapabilities(
        wmsUrl,
        adapter,
        httpClient
      );
      const serverVersion =
        this.xmlResponseVersionExtractor.extractVersion(responseDoc);
      serverVersions.push(serverVersion);
      if (serverVersion === adapter.version) {
        return { adapter: adapter, responseDoc };
      }
      const compatibleAdapter = this.getCompatibleAdapter(serverVersion);
      if (compatibleAdapter) {
        return { adapter: compatibleAdapter, responseDoc };
      }
      adapter = this.versionAdapterResolver.findLower(serverVersion);
    }

    throw new RangeError(
      `Could not find compatible WMS version adapter for following versions: ${serverVersions.map((v) => `"${v}"`).join(", ")}`
    );
  }

  private async getWmsServerCapabilities(
    wmsUrl: string,
    wmsAdapter: WmsVersionAdapter,
    httpClient: AxiosInstance
  ): Promise<Document> {
    const params = wmsAdapter.transformCapabilitiesRequestParams({});
    let response: AxiosResponse<string>;
    try {
      response = await httpClient.get<string>(wmsUrl, {
        params,
        responseType: "text",
      });
    } catch (e) {
      this.requestErrorHandler.handleRequestError(e);
    }

    return this.wmsXmlParser.parse(response.data);
  }

  private getCompatibleAdapter(
    wmsVersion: string
  ): WmsVersionAdapter | undefined {
    const adapter = this.versionAdapterResolver.find(wmsVersion);
    return adapter || this.versionAdapterResolver.findCompatible(wmsVersion);
  }
}
