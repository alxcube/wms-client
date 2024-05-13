import type { CapabilitiesRequestParams } from "../../client";
import type { VersionComparator } from "../../version-comparator";

import type { CapabilitiesRequestParamsTransformer } from "./CapabilitiesRequestParamsTransformer";

/**
 * Generic CapabilitiesRequestParamsTransformer class. Compatible with WMS versions 1.0, 1.1, 1.3.
 */
export class GenericCapabilitiesRequestParamsTransformer
  implements CapabilitiesRequestParamsTransformer
{
  /**
   * GenericCapabilitiesRequestParamsTransformer constructor.
   *
   * @param versionComparator
   * @param version
   */
  constructor(
    private readonly versionComparator: VersionComparator,
    private readonly version: string
  ) {}

  /**
   * @inheritdoc
   */
  transform(params: CapabilitiesRequestParams): object {
    const transformedParams: { [key: string]: unknown } = {};
    Object.keys(params).forEach((key: keyof CapabilitiesRequestParams) => {
      switch (key) {
        case "updateSequence":
          transformedParams.updatesequence = params[key];
          break;
        default:
          transformedParams[key] = params[key];
          break;
      }
    });
    transformedParams.service = "WMS";
    transformedParams.request = this.getRequestName();
    transformedParams[this.getVersionParamName()] = this.version;
    return transformedParams;
  }

  /**
   * Returns `request` param value.
   *
   * @private
   */
  private getRequestName(): string {
    return this.isV_1_0() ? "capabilities" : "GetCapabilities";
  }

  /**
   * Returns `version` param name.
   * @private
   */
  private getVersionParamName(): string {
    return this.isV_1_0() ? "wmtver" : "version";
  }

  /**
   * Returns true, if using WMS version 1.0.x
   * @private
   */
  private isV_1_0(): boolean {
    return (
      this.versionComparator.is(this.version, ">=", "1") &&
      this.versionComparator.is(this.version, "<", "1.1")
    );
  }
}
