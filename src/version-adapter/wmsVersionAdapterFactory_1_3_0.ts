import { WmsVersionAdapter_1_3_0 } from "./WmsVersionAdapter_1_3_0";
import type { WmsVersionAdapterFactory } from "./WmsVersionAdapterFactory";

export const wmsVersionAdapterFactory_1_3_0: WmsVersionAdapterFactory =
  function () {
    return new WmsVersionAdapter_1_3_0();
  };
