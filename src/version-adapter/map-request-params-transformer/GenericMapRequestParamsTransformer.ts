import type { ExceptionFormat } from "../../ExceptionFormat";
import type { MapRequestParams } from "../../MapRequestParams";
import type { VersionComparator } from "../../version-comparator/VersionComparator";
import type { WmsMapRequestParamsTransformer } from "../BaseWmsVersionAdapter";
import type { TransformMapRequestParamsOptions } from "../WmsVersionAdapter";

export class GenericMapRequestParamsTransformer
  implements WmsMapRequestParamsTransformer
{
  constructor(
    private readonly versionComparator: VersionComparator,
    private readonly version: string
  ) {}
  transform(
    params: MapRequestParams,
    options: TransformMapRequestParamsOptions = {}
  ): object {
    const requestParams: { [key: string]: unknown } = {};

    Object.keys(params).forEach((key: keyof MapRequestParams) => {
      switch (key) {
        case "layers":
          requestParams.layers = this.getLayersParam(params[key]);
          requestParams.styles = this.getStylesParam(params[key]);
          break;
        case "bounds":
          requestParams.bbox = this.getBboxParam(params[key], options.flipAxes);
          break;
        case "transparent":
          requestParams.transparent = params[key] ? "TRUE" : "FALSE";
          break;
        case "crs":
          requestParams[this.getCrsParamName()] = params[key];
          break;
        case "exceptionsFormat":
          requestParams["exceptions"] = this.transformExceptionFormat(
            params[key]
          );
          break;
        default:
          requestParams[key] = params[key];
          break;
      }
    });

    requestParams[this.getVersionParamName()] = this.version;
    requestParams.service = "WMS";
    requestParams.request = this.getRequestName();

    return requestParams;
  }

  private getBboxParam(
    bounds: MapRequestParams["bounds"],
    flipAxes = false
  ): string {
    return (
      flipAxes && this.isV1_3_x()
        ? [bounds.minY, bounds.minX, bounds.maxY, bounds.maxX]
        : [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY]
    ).join(",");
  }

  private getLayersParam(layers: MapRequestParams["layers"]): string {
    return layers.map(({ layer }) => layer).join(",");
  }

  private getStylesParam(layers: MapRequestParams["layers"]): string {
    return layers.map(({ style }) => style || "").join(",");
  }

  private isV1_0_x(): boolean {
    return this.versionComparator.is(this.version, "<", "1.1");
  }

  private isV1_3_x(): boolean {
    return this.versionComparator.is(this.version, ">=", "1.3");
  }

  private isV1_1(): boolean {
    return (
      this.versionComparator.is(this.version, ">=", "1.1") &&
      this.versionComparator.is(this.version, "<", "1.2")
    );
  }

  private getVersionParamName(): string {
    return this.isV1_0_x() ? "wmtver" : "version";
  }

  private getRequestName(): string {
    return this.isV1_0_x() ? "map" : "GetMap";
  }

  private getCrsParamName(): string {
    return this.isV1_3_x() ? "crs" : "srs";
  }

  private transformExceptionFormat(
    exceptionFormat: ExceptionFormat | string | undefined
  ): string | undefined {
    if (this.isV1_1()) {
      switch (exceptionFormat) {
        case "XML":
          return "application/vnd.ogc.se_xml";
        case "INIMAGE":
          return "application/vnd.ogc.se_inimage";
        case "BLANK":
          return "application/vnd.ogc.se_blank";
        default:
          return exceptionFormat;
      }
    }
    return exceptionFormat;
  }
}
