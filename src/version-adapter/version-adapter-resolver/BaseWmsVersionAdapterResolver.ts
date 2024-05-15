import type { VersionComparator } from "../../version-comparator";
import type { WmsVersionAdapter } from "../WmsVersionAdapter";
import type { WmsVersionAdapterResolver } from "./WmsVersionAdapterResolver";

/**
 * Base WmsVersionAdapterResolver implementing class.
 */
export class BaseWmsVersionAdapterResolver
  implements WmsVersionAdapterResolver
{
  /**
   * BaseWmsVersionAdapterResolver constructor.
   *
   * @param adaptersPool
   * @param versionComparator
   */
  constructor(
    private readonly adaptersPool: WmsVersionAdapter[],
    private readonly versionComparator: VersionComparator
  ) {}

  /**
   * @inheritdoc
   */
  resolve(wmsVersion: string): WmsVersionAdapter {
    const adapter = this.find(wmsVersion);
    if (!adapter) {
      throw new RangeError(`No adapter for WMS version "${wmsVersion}"`);
    }
    return adapter;
  }

  /**
   * @inheritdoc
   */
  find(wmsVersion: string): WmsVersionAdapter | undefined {
    return this.getNotEmptyAdaptersList().find(
      ({ version }) => version === wmsVersion
    );
  }

  /**
   * @inheritdoc
   */
  findCompatible(wmsVersion: string): WmsVersionAdapter | undefined {
    return this.getNotEmptyAdaptersList().find((adapter) =>
      adapter.isCompatible(wmsVersion)
    );
  }

  /**
   * @inheritdoc
   */
  findLower(wmsVersion: string): WmsVersionAdapter | undefined {
    return this.getAdaptersSortedByVersionDesc().find((adapter) =>
      this.versionComparator.is(adapter.version, "<", wmsVersion)
    );
  }

  /**
   * @inheritdoc
   */
  getHighest(): WmsVersionAdapter {
    return this.getAdaptersSortedByVersionDesc()[0];
  }

  /**
   * Returns array of `WmsVersionAdapter` interfaces. Throws `RangeError` if provided adapters array is empty.
   * @private
   */
  private getNotEmptyAdaptersList(): WmsVersionAdapter[] {
    if (this.adaptersPool.length) {
      return this.adaptersPool;
    }
    throw new RangeError(`WMS version adapters list is empty`);
  }

  /**
   * Returns array of `WmsVersionAdapter`, sorted by supported WMS version descending.
   * @private
   */
  private getAdaptersSortedByVersionDesc(): WmsVersionAdapter[] {
    return this.getNotEmptyAdaptersList()
      .slice()
      .sort((adapter1, adapter2) =>
        this.versionComparator.compare(adapter2.version, adapter1.version)
      );
  }
}
