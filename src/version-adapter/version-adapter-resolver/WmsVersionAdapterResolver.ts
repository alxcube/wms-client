import type { WmsVersionAdapter } from "../WmsVersionAdapter";

export interface WmsVersionAdapterResolver {
  resolve(wmsVersion: string): WmsVersionAdapter;

  find(wmsVersion: string): WmsVersionAdapter | undefined;

  findCompatible(wmsVersion: string): WmsVersionAdapter | undefined;

  findLower(wmsVersion: string): WmsVersionAdapter | undefined;

  getHighest(): WmsVersionAdapter;
}
