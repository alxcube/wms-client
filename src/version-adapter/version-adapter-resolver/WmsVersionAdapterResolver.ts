import type { WmsVersionAdapter } from "../WmsVersionAdapter";

/**
 * Interface for resolution of WmsVersionAdapter interfaces.
 */
export interface WmsVersionAdapterResolver {
  /**
   * Returns `WmsVersionAdapter` for given exact WMS version. Throws `RangeError` if no adapter for given version was
   * found.
   *
   * @param wmsVersion
   */
  resolve(wmsVersion: string): WmsVersionAdapter;

  /**
   * Returns `WmsVersionAdapter` for given exact WMS version, of `undefined` if no such adapter was found.
   *
   * @param wmsVersion
   */
  find(wmsVersion: string): WmsVersionAdapter | undefined;

  /**
   * Returns `WmsVersionAdapter`, compatible with given WMS version, or `undefined` if no compatible adapter was found.
   *
   * @param wmsVersion
   */
  findCompatible(wmsVersion: string): WmsVersionAdapter | undefined;

  /**
   * Returns `WmsVersionAdapter` for WMS version, lower than given. Returns `undefined` if no such adapter was found.
   *
   * @param wmsVersion
   */
  findLower(wmsVersion: string): WmsVersionAdapter | undefined;

  /**
   * Returns `WmsVersionAdapter` for highest WMS version available.
   */
  getHighest(): WmsVersionAdapter;
}
