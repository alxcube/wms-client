import { wmsVersionAdapterFactory_1_3_0 } from "./1.3.0/wmsVersionAdapterFactory_1_3_0";
import type { WmsVersionAdapterFactory } from "./WmsVersionAdapterFactory";

export const versionAdapterFactoriesPool = new Map<
  string,
  WmsVersionAdapterFactory
>();

versionAdapterFactoriesPool.set("1.3.0", wmsVersionAdapterFactory_1_3_0);
