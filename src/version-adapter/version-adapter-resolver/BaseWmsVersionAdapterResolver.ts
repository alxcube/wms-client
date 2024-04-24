import type { VersionComparator } from "../../version-comparator";
import type { WmsVersionAdapter } from "../WmsVersionAdapter";
import type { WmsVersionAdapterResolver } from "./WmsVersionAdapterResolver";

export class BaseWmsVersionAdapterResolver
  implements WmsVersionAdapterResolver
{
  constructor(
    private readonly adaptersPool: WmsVersionAdapter[],
    private readonly versionComparator: VersionComparator
  ) {}
  resolve(wmsVersion: string): WmsVersionAdapter {
    const adapter = this.find(wmsVersion);
    if (!adapter) {
      throw new RangeError(`No adapter for WMS version "${wmsVersion}"`);
    }
    return adapter;
  }

  find(wmsVersion: string): WmsVersionAdapter | undefined {
    return this.getNotEmptyAdaptersList().find(
      ({ version }) => version === wmsVersion
    );
  }

  findCompatible(wmsVersion: string): WmsVersionAdapter | undefined {
    return this.getNotEmptyAdaptersList().find((adapter) =>
      adapter.isCompatible(wmsVersion)
    );
  }

  findLower(wmsVersion: string): WmsVersionAdapter | undefined {
    return this.getAdaptersSortedByVersionDesc().find((adapter) =>
      this.versionComparator.is(adapter.version, "<", wmsVersion)
    );
  }

  getHighest(): WmsVersionAdapter {
    return this.getAdaptersSortedByVersionDesc()[0];
  }

  private getNotEmptyAdaptersList(): WmsVersionAdapter[] {
    if (this.adaptersPool.length) {
      return this.adaptersPool;
    }
    throw new RangeError(`WMS version adapters list is empty`);
  }

  private getAdaptersSortedByVersionDesc(): WmsVersionAdapter[] {
    return this.getNotEmptyAdaptersList()
      .slice()
      .sort((adapter1, adapter2) =>
        this.versionComparator.compare(adapter2.version, adapter1.version)
      );
  }
}
