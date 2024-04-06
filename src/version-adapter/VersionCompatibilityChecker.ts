export interface VersionCompatibilityChecker {
  isCompatible(wmsVersion: string): boolean;
}
