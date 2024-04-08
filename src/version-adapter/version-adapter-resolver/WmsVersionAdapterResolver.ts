import type { WmsVersionAdapter } from "../WmsVersionAdapter";

export interface WmsVersionAdapterResolver {
  resolve(wmsVersion: string): WmsVersionAdapter;
}
