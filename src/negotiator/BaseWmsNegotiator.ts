import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { RequestErrorHandler } from "../client/RequestErrorHandler";
import { WmsException } from "../error/WmsException";
import { WmsExceptionReport } from "../error/WmsExceptionReport";
import type { QueryParamsSerializer } from "../query-params-serializer/QueryParamsSerializer";
import { mergeSearchParams } from "../utils/mergeSearchParams";
import type { WmsVersionAdapterResolver } from "../version-adapter/version-adapter-resolver/WmsVersionAdapterResolver";
import type { WmsClient } from "../client/WmsClient";
import type { WmsClientFactory } from "../client/WmsClientFactory";
import type { WmsVersionAdapter } from "../version-adapter/WmsVersionAdapter";
import type { VersionComparator } from "../version-comparator/VersionComparator";
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
    private readonly requestErrorHandler: RequestErrorHandler,
    private readonly versionComparator: VersionComparator,
    private readonly queryParamsSerializer: QueryParamsSerializer
  ) {}
  async negotiate(
    wmsUrl: string,
    options: WmsNegotiatorOptions = {}
  ): Promise<WmsClient> {
    const { httpClient = axios.create() } = options;
    const { adapter, responseDoc } = await this.getNegotiationOutcome(
      wmsUrl,
      httpClient,
      options.query
    );
    const capabilities = adapter.extractCapabilitiesResponseData(responseDoc);

    const factoryOptions = {
      ...options,
      httpClient, // Use same http client in wms client
      mapRequestUrl: capabilities?.capability?.request?.getMap?.httpGetUrl,
      featureInfoRequestUrl:
        capabilities?.capability?.request?.getFeatureInfo?.httpGetUrl,
    };
    return this.wmsClientFactory.create(
      wmsUrl,
      adapter.version,
      factoryOptions
    );
  }

  private async getNegotiationOutcome(
    wmsUrl: string,
    httpClient: AxiosInstance,
    customQuery: object = {}
  ): Promise<NegotiationOutcome> {
    let adapter: WmsVersionAdapter | undefined =
      this.versionAdapterResolver.getHighest();
    const serverVersions: string[] = [];

    while (adapter) {
      let responseDoc: Document;
      try {
        responseDoc = await this.getWmsServerCapabilities(
          wmsUrl,
          adapter,
          httpClient,
          customQuery
        );
      } catch (e) {
        if (e instanceof WmsException || e instanceof WmsExceptionReport) {
          adapter = this.versionAdapterResolver.findLower(adapter.version);
          continue;
        } else {
          throw e;
        }
      }

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
      adapter = this.versionAdapterResolver.findLower(
        this.versionComparator.is(serverVersion, "<", adapter.version)
          ? serverVersion
          : adapter.version
      );
    }

    throw new RangeError(
      `Could not find compatible WMS version adapter for following versions: ${serverVersions.map((v) => `"${v}"`).join(", ")}`
    );
  }

  private async getWmsServerCapabilities(
    wmsUrl: string,
    wmsAdapter: WmsVersionAdapter,
    httpClient: AxiosInstance,
    customQuery: object = {}
  ): Promise<Document> {
    const params = wmsAdapter.transformCapabilitiesRequestParams({
      ...customQuery,
    });
    const serializedParams = this.queryParamsSerializer.serialize(params);
    const url = mergeSearchParams(wmsUrl, serializedParams);
    let response: AxiosResponse<string>;
    try {
      response = await httpClient.get<string>(url, {
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
