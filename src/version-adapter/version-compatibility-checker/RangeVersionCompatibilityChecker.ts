import type { VersionComparator } from "../../version-comparator";
import type { VersionCompatibilityChecker } from "./VersionCompatibilityChecker";

/**
 * VersionCompatibilityChecker implementation, checking compatibility using version range between min and max WMS
 * versions.
 */
export class RangeVersionCompatibilityChecker
  implements VersionCompatibilityChecker
{
  /**
   * RangeVersionCompatibilityChecker constructor.
   *
   * @param versionComparator
   * @param minVersion
   * @param maxVersion
   */
  constructor(
    private readonly versionComparator: VersionComparator,
    private readonly minVersion: string,
    private readonly maxVersion: string
  ) {}

  /**
   * @inheritdoc
   */
  isCompatible(wmsVersion: string): boolean {
    return (
      this.versionComparator.is(wmsVersion, ">=", this.minVersion) &&
      this.versionComparator.is(wmsVersion, "<", this.maxVersion)
    );
  }
}
