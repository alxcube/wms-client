import type { VersionComparator } from "../version-comparator/VersionComparator";
import type { VersionCompatibilityChecker } from "./VersionCompatibilityChecker";

export class RangeVersionCompatibilityChecker
  implements VersionCompatibilityChecker
{
  constructor(
    private readonly versionComparator: VersionComparator,
    private readonly minVersion: string,
    private readonly maxVersion: string
  ) {}
  isCompatible(wmsVersion: string): boolean {
    return (
      this.versionComparator.is(wmsVersion, ">=", this.minVersion) &&
      this.versionComparator.is(wmsVersion, "<", this.maxVersion)
    );
  }
}
