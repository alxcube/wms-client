import type { CapabilitiesRequestParams } from "../../client";
import type { VersionComparator } from "../../version-comparator";

import type { CapabilitiesRequestParamsTransformer } from "./CapabilitiesRequestParamsTransformer";

export class GenericCapabilitiesRequestParamsTransformer
  implements CapabilitiesRequestParamsTransformer
{
  constructor(
    private readonly versionComparator: VersionComparator,
    private readonly version: string
  ) {}
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

  private getRequestName(): string {
    return this.isV_1_0() ? "capabilities" : "GetCapabilities";
  }

  private getVersionParamName(): string {
    return this.isV_1_0() ? "wmtver" : "version";
  }

  private isV_1_0(): boolean {
    return (
      this.versionComparator.is(this.version, ">=", "1") &&
      this.versionComparator.is(this.version, "<", "1.1")
    );
  }
}
