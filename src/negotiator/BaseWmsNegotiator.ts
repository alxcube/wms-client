import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type {
  RequestErrorHandler,
  WmsClient,
  WmsClientFactory,
} from "../client";
import { WmsException, WmsExceptionReport } from "../error";
import type { QueryParamsSerializer } from "../query-params-serializer";
import { mergeSearchParams } from "../utils";
import type {
  WmsVersionAdapterResolver,
  WmsVersionAdapter,
  XmlResponseVersionExtractor,
} from "../version-adapter";
import type { VersionComparator } from "../version-comparator";
import type { WmsXmlParser } from "../wms-xml-parser";
import type { WmsNegotiator, WmsNegotiatorOptions } from "./WmsNegotiator";

/**
 * Negotiation outcome interface.
 * @internal
 */
interface NegotiationOutcome {
  /**
   * WMS adapter of negotiated version.
   */
  adapter: WmsVersionAdapter;

  /**
   * Response document of GetCapabilities request of negotiated version.
   */
  responseDoc: Document;
}

/**
 * Base WmsNegotiator class.
 */
export class BaseWmsNegotiator implements WmsNegotiator {
  /**
   * BaseWmsNegotiator constructor.
   *
   * @param wmsXmlParser
   * @param xmlResponseVersionExtractor
   * @param wmsClientFactory
   * @param versionAdapterResolver
   * @param requestErrorHandler
   * @param versionComparator
   * @param queryParamsSerializer
   */
  constructor(
    private readonly wmsXmlParser: WmsXmlParser,
    private readonly xmlResponseVersionExtractor: XmlResponseVersionExtractor,
    private readonly wmsClientFactory: WmsClientFactory,
    private readonly versionAdapterResolver: WmsVersionAdapterResolver,
    private readonly requestErrorHandler: RequestErrorHandler,
    private readonly versionComparator: VersionComparator,
    private readonly queryParamsSerializer: QueryParamsSerializer
  ) {}

  /**
   * @inheritdoc
   */
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

  /**
   * Performs version negotiation and returns promise of NegotiationOutcome.
   *
   * @param wmsUrl
   * @param httpClient
   * @param customQuery
   * @private
   */
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

  /**
   * Performs GetCapabilities request to WMS server and returns promise of response document.
   *
   * @param wmsUrl
   * @param wmsAdapter
   * @param httpClient
   * @param customQuery
   * @private
   */
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

  /**
   * Returns WMS version adapter, compatible with given WMS version.
   *
   * @param wmsVersion
   * @private
   */
  private getCompatibleAdapter(
    wmsVersion: string
  ): WmsVersionAdapter | undefined {
    const adapter = this.versionAdapterResolver.find(wmsVersion);
    return adapter || this.versionAdapterResolver.findCompatible(wmsVersion);
  }
}
