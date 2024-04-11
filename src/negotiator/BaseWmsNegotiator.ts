import axios from "axios";
import type { WmsVersionAdapter } from "../version-adapter/WmsVersionAdapter";
import type { VersionComparator } from "../version-comparator/VersionComparator";
import type { WmsClient } from "../client/WmsClient";
import type { WmsClientFactory } from "../client/WmsClientFactory";
import type { WmsNegotiator, WmsNegotiatorOptions } from "./WmsNegotiator";
import type { XmlResponseVersionExtractor } from "../xml-response-version-extractor/XmlResponseVersionExtractor";

export class BaseWmsNegotiator implements WmsNegotiator {
  constructor(
    private readonly adaptersPool: WmsVersionAdapter[],
    private readonly versionComparator: VersionComparator,
    private readonly xmlParser: DOMParser,
    private readonly xmlResponseVersionExtractor: XmlResponseVersionExtractor,
    private readonly wmsClientFactory: WmsClientFactory
  ) {}
  async negotiate(
    wmsUrl: string,
    options: WmsNegotiatorOptions = {}
  ): Promise<WmsClient> {
    const { httpClient = axios.create() } = options;
    let negotiatedVersion: string | undefined;
    let adapter = this.getHighestVersionAdapter();

    while (!negotiatedVersion) {
      const params = adapter.transformCapabilitiesRequestParams({});
      const response = await httpClient.get<string>(wmsUrl, {
        params,
        responseType: "text",
      });
      // todo check for errors
      const responseDoc = this.xmlParser.parseFromString(
        response.data,
        "text/xml"
      );
      const version =
        this.xmlResponseVersionExtractor.extractVersion(responseDoc);

      if (version === adapter.version) {
        negotiatedVersion = version;
        break;
      }

      const exactAdapter = this.getExactVersionAdapter(version);
      if (exactAdapter) {
        negotiatedVersion = adapter.version;
        break;
      }

      const compatibleAdapter = this.getCompatibleVersionAdapter(version);
      if (compatibleAdapter) {
        negotiatedVersion = compatibleAdapter.version;
        break;
      }

      adapter = this.getLowerVersionAdapter(version);
    }

    // Use same http client in wms client
    options.httpClient = httpClient;
    return this.wmsClientFactory.create(wmsUrl, negotiatedVersion, options);
  }

  private getHighestVersionAdapter(): WmsVersionAdapter {
    if (!this.adaptersPool.length) {
      throw new RangeError(`Version adapters pool is empty.`);
    }
    return this.adaptersPool
      .slice()
      .sort((adapter1, adapter2) =>
        this.versionComparator.compare(adapter1.version, adapter2.version)
      )
      .pop()!;
  }

  private getExactVersionAdapter(
    version: string
  ): WmsVersionAdapter | undefined {
    return this.adaptersPool.find((adapter) => adapter.version === version);
  }

  private getCompatibleVersionAdapter(
    version: string
  ): WmsVersionAdapter | undefined {
    for (const adapter of this.adaptersPool) {
      if (adapter.isCompatible(version)) {
        return adapter;
      }
    }
  }

  private getLowerVersionAdapter(version: string): WmsVersionAdapter {
    const sortedByDescAdapters = this.adaptersPool
      .slice()
      .sort((adapter1, adapter2) =>
        this.versionComparator.compare(adapter2.version, adapter1.version)
      );
    const lowerVersionAdapter = sortedByDescAdapters.find((adapter) =>
      this.versionComparator.is(adapter.version, "<", version)
    );
    if (!lowerVersionAdapter) {
      throw new RangeError(
        `Can't find adapter with version lower, than "${version}"`
      );
    }
    return lowerVersionAdapter;
  }
}
