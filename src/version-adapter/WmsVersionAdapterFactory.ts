import type { WmsVersionAdapter } from "./WmsVersionAdapter";

export interface WmsVersionAdapterFactory {
  (): WmsVersionAdapter;
}
