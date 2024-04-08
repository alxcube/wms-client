import type { WmsVersionAdapter } from "../WmsVersionAdapter";
import type { WmsVersionAdapterResolver } from "./WmsVersionAdapterResolver";

export class BaseWmsVersionAdapterResolver
  implements WmsVersionAdapterResolver
{
  constructor(private readonly adaptersPool: WmsVersionAdapter[]) {}
  resolve(wmsVersion: string): WmsVersionAdapter {
    const adapter = this.adaptersPool.find(
      ({ version }) => version === wmsVersion
    );
    if (!adapter) {
      throw new RangeError(`No adapter for WMS version "${wmsVersion}"`);
    }
    return adapter;
  }
}
