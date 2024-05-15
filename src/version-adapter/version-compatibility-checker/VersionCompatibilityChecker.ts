/**
 * WMS version compatibility checker. Used internally in `BaseWmsVersionAdapter`.
 */
export interface VersionCompatibilityChecker {
  /**
   * Checks if given `BaseWmsVersionAdapter` is compatible with given WMS version.
   *
   * @param wmsVersion
   */
  isCompatible(wmsVersion: string): boolean;
}
